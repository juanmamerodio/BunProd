export default async function handler(req, res) {
    // 1. Verificación de método y CORS
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { idea } = req.body;

    if (!idea) {
        return res.status(400).json({ error: 'La idea de negocio es obligatoria' });
    }

    // 2. Extraer la API Key de las Variables de Entorno de Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    // 3. El Motor "Delta" (Tu Prompt Maestro)
    const systemPrompt = `Eres un consultor de negocios y estratega de crecimiento nivel experto (estilo Alex Hormozi, directo, agresivo en marketing). 
    Un usuario te proporcionará una idea de negocio, proyecto o empresa. Tu objetivo es aplicar la metodología 'Delta' y devolver una estrategia estructurada estrictamente en formato JSON, sin texto adicional. 
    
    El JSON debe contener las siguientes claves:
    1. nicho: El nicho de mercado específico y ultra-segmentado.
    2. vehiculo: El servicio exacto (cómo llevarás al cliente del punto A al punto B).
    3. oferta_final: Una oferta irresistible y de alto valor (Grand Slam Offer).
    4. guion_video: Un guion profesional para un video vertical de 30 a 60 segundos. Debe seguir estrictamente la estructura: 'Hook (Gancho disruptivo)' > 'Problema' > 'Solución' > 'Casos de éxito/Prueba social' > 'CTA'. Separa las partes con saltos de línea (\\n).`;

    const payload = {
        contents: [{ 
            parts: [{ text: `Idea de negocio del usuario: ${idea}` }] 
        }],
        systemInstruction: { 
            parts: [{ text: systemPrompt }] 
        },
        generationConfig: {
            responseMimeType: "application/json",
            // Forzamos al modelo a devolver el esquema exacto que espera el Front-End
            responseSchema: {
                type: "OBJECT",
                properties: {
                    nicho: { type: "STRING" },
                    vehiculo: { type: "STRING" },
                    oferta_final: { type: "STRING" },
                    guion_video: { type: "STRING" }
                },
                required: ["nicho", "vehiculo", "oferta_final", "guion_video"]
            }
        }
    };

    try {
        // 4. Ejecutar el request al servidor de Google
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            return res.status(500).json({ error: 'Fallo al procesar en Gemini' });
        }

        const result = await response.json();
        const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!jsonString) {
            return res.status(500).json({ error: 'Respuesta vacía del modelo' });
        }

        // 5. Devolver el JSON limpio al cliente
        const parsedData = JSON.parse(jsonString);
        return res.status(200).json(parsedData);

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: 'Fallo interno del servidor' });
    }
}