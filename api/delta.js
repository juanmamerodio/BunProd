export default async function handler(req, res) {
    // ── CORS headers (útil para testing local)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // ── 1. Validar método
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ── 2. Validar body
    const { idea } = req.body ?? {};
    if (!idea || typeof idea !== 'string' || idea.trim().length < 3) {
        return res.status(400).json({ error: 'El campo "idea" es obligatorio y debe tener al menos 3 caracteres.' });
    }

    // ── 3. API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[delta] GEMINI_API_KEY no está definida en las variables de entorno.');
        return res.status(500).json({ error: 'Configuración del servidor incompleta: API key faltante.' });
    }

    // ── 4. Modelo correcto (gemini-2.5-flash estable)
    const MODEL_NAME = 'gemini-3.1-flash-lite';
    const endpoint   = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    // ── 5. Prompt maestro Delta Engine
    const systemPrompt = `Eres un consultor de negocios de élite y estratega de crecimiento (estilo Alex Hormozi, directo, agresivo en marketing y orientado a resultados concretos).
Un usuario (que no sabe nada de marketing, son programadores mayormente) te proporcionará una idea de negocio, proyecto o empresa.
Tu misión es aplicar la metodología "Delta" y devolver una estrategia estructurada ESTRICTAMENTE en formato JSON, sin texto adicional, sin markdown, sin bloques de código.

El JSON debe contener EXACTAMENTE estas claves:
1. "nicho": El nicho de mercado específico y ultra-segmentado (quién es el cliente ideal, dolor específico, demografía), explicar porqué ese nicho es el correcto para ellos.
2. "vehiculo": El servicio exacto que llevarás al mercado (cómo pasas al cliente del punto A al B, en qué formato, canal y frecuencia) y si podría agregar/delegar algo mas para ofrecer un servicio mas completo.
3. "oferta_final": Una Grand Slam Offer irresistible: incluye el resultado prometido, garantía, bonus, precio y mecanismo de entrega, explicá cada cosa de manera de que se entienda (deben entender de que se debe vender una transformación). 
4. "guion_video": Un guion profesional para un video vertical de 30-60 segundos. IMPORTANTE: separá EXACTAMENTE cada sección con un prefijo en mayúscula seguido de dos puntos y salto de línea, en este orden:\nHOOK: [gancho disruptivo, máx 2 oraciones]\nPROBLEMA: [dolor específico del cliente, máx 2 oraciones]\nSOLUCIÓN: [cómo tu servicio resuelve el problema, máx 2 oraciones]\nPRUEBA SOCIAL: [resultado concreto o caso de éxito, máx 2 oraciones]\nCTA: [llamada a la acción urgente y específica, máx 2 oraciones]

IMPORTANTE: Solo devuelve el objeto JSON. Nada más.`;

    const payload = {
        contents: [{
            parts: [{ text: `Idea de negocio: ${idea.trim()}` }]
        }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    nicho:        { type: 'STRING' },
                    vehiculo:     { type: 'STRING' },
                    oferta_final: { type: 'STRING' },
                    guion_video:  { type: 'STRING' }
                },
                required: ['nicho', 'vehiculo', 'oferta_final', 'guion_video']
            },
            temperature: 0.9
        }
    };

    try {
        // ── 6. Llamada a Gemini
        const geminiRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            console.error(`[delta] Gemini error ${geminiRes.status}:`, errText);
            return res.status(502).json({
                error: `La API de Gemini respondió con error ${geminiRes.status}.`,
                detail: errText
            });
        }

        const geminiData = await geminiRes.json();

        // ── 7. Extraer contenido
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            console.error('[delta] Respuesta vacía de Gemini:', JSON.stringify(geminiData));
            return res.status(502).json({ error: 'El modelo devolvió una respuesta vacía. Volvé a intentar.' });
        }

        // ── 8. Parsear JSON (el modelo debería devolver JSON puro gracias a responseMimeType)
        let parsed;
        try {
            parsed = JSON.parse(rawText);
        } catch (parseErr) {
            console.error('[delta] Error al parsear JSON del modelo:', rawText);
            return res.status(502).json({ error: 'La respuesta del modelo no es JSON válido.' });
        }

        // ── 9. Validar que tenga las claves requeridas
        const required = ['nicho', 'vehiculo', 'oferta_final', 'guion_video'];
        const missing  = required.filter(k => !parsed[k]);
        if (missing.length > 0) {
            console.warn('[delta] Claves faltantes en respuesta:', missing);
            return res.status(502).json({ error: `Respuesta incompleta del modelo. Faltan: ${missing.join(', ')}` });
        }

        // ── 10. Éxito
        return res.status(200).json({
            nicho:        parsed.nicho,
            vehiculo:     parsed.vehiculo,
            oferta_final: parsed.oferta_final,
            guion_video:  parsed.guion_video
        });

    } catch (err) {
        console.error('[delta] Error interno:', err);
        return res.status(500).json({
            error: 'Error interno del servidor. Revisá los logs de Vercel para más detalles.',
            detail: err.message
        });
    }
}