# Afterbow Productions — Memory Log

## Aprendizajes de la Arquitectura (Backend & Agentes)

- **Separación de Responsabilidades:** Se estructuró el backend bajo un patrón de servicios y routers API para desacoplar el procesamiento multimedia (DIT Agent) de la lógica cognitiva basada en LLMs (Content-Brain Agent).
- **Procesamiento Asíncrono en FastAPI:** Debido a que la descarga/validación de brutos de video y la posterior transcripción con Gemini 1.5 pueden tomar tiempo, se configuraron los endpoints con `BackgroundTasks` de FastAPI para evitar timeouts en llamadas HTTP.
- **Validación con FFmpeg:** Se implementó una interfaz nativa que interactúa con `ffprobe` y `ffmpeg` mediante subprocesses para garantizar tolerancia cero a la pérdida y corrupción de material audiovisual sin sobrecargar dependencias de Python.
- **Sincronización Web-Firestore:** El dashboard privado escuchará directamente Firestore (`onSnapshot`), de modo que el backend se limita a cambiar el estado del documento a `ready` o a reaccionar a `approved` para activar el webhook del publicador, optimizando las transiciones a 60fps en el frontend.

---

## Estructura del Directorio Creado (`/backend`)

```
/backend
├── .env.example              # Configuración de variables de entorno para API keys y credenciales
├── requirements.txt          # Dependencias necesarias (FastAPI, Firebase, Google Drive, Gemini SDK)
└── app/
    ├── __init__.py
    ├── main.py               # Inicialización de la aplicación y registro de rutas de API
    ├── config.py             # Configuración fuertemente tipada con Pydantic Settings
    ├── api/                  # Capa de Endpoints (Controladores)
    │   ├── __init__.py
    │   └── v1/
    │       ├── __init__.py
    │       ├── dit.py            # Rutas del Agente de Ingesta (DIT)
    │       ├── content_brain.py  # Rutas del Agente Content-Brain
    │       └── contents.py       # Rutas de sincronización del Dashboard (Aprobaciones)
    ├── core/                 # Inicialización de Clientes de Servicios de la Nube
    │   ├── __init__.py
    │   ├── drive.py          # Cliente de Google Drive API (v3)
    │   ├── firebase.py       # Cliente de Firebase Admin SDK (Firestore)
    │   └── gemini.py         # Inicialización de Google Generative AI (AI Studio)
    ├── models/               # Esquemas y Validaciones Pydantic
    │   ├── __init__.py
    │   ├── client.py         # Modelo de datos de Clientes y Manual de Tono
    │   └── content.py        # Modelo de estado y metadatos de Contenidos
    ├── services/             # Lógica de Negocio (Motores de los Agentes)
    │   ├── __init__.py
    │   ├── dit_service.py           # Ciclo de vida DIT (download, validate, extract, move, log)
    │   └── content_brain_service.py # Ciclo de vida Content-Brain (Gemini transcription, hooks copy)
    └── utils/                # Utilidades generales
        ├── __init__.py
        └── ffmpeg.py         # Helper de ejecución ffmpeg/ffprobe por subprocess
```

---

## Pasos de Configuración Inicial

Para poner en marcha el backend de Afterbow, seguí estos pasos:

### 1. Entorno Virtual de Python
Ubicarse en la carpeta `/backend` y crear un entorno virtual para instalar las dependencias aisladas:
```bash
cd backend
python -m venv .venv
# Activar en Windows PowerShell:
.venv\Scripts\Activate.ps1
# Activar en Linux/macOS:
source .venv/bin/activate
```

### 2. Instalación de Dependencias
Instalar las librerías listadas en `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 3. Instalación de FFmpeg en el Servidor/Sistema
Para que los procesos de extracción de audio y ffprobe funcionen correctamente, la máquina debe tener instalado FFmpeg y sus binarios en las variables de entorno del sistema (`PATH`).
- **Windows:** Instalar vía `winget install Gyan.FFmpeg` o descargar de gyan.dev y agregar a `PATH`.
- **Linux:** `sudo apt update && sudo apt install ffmpeg`

### 4. Configuración de Credenciales (`.env`)
Copiar el archivo `.env.example` como `.env` y completar los valores correspondientes:
- **`GEMINI_API_KEY`**: Clave de API de Google AI Studio.
- **`FIREBASE_CREDENTIALS_PATH`**: Ruta absoluta o relativa al JSON de la cuenta de servicio de Firebase.
- **`GOOGLE_DRIVE_CREDENTIALS_PATH`**: Ruta al JSON de credenciales de Google Drive (Cuenta de servicio con permisos de edición en las carpetas `/Clientes` e `/01_Inbound_Clientes`).

### 5. Ejecutar en Modo Desarrollo
Para levantar el servidor de desarrollo local con auto-reload:
```bash
uvicorn app.main:app --reload --port 8000
```
La documentación interactiva de la API estará disponible en `http://localhost:8000/docs`.

---

## Manejo de Excepciones en el DIT Agent (`/backend/agents/dit_agent.py`)

El módulo `dit_agent.py` cuenta con un sistema robusto para mitigar y reportar fallas en los brutos multimedia y en las conexiones a la nube de Google:

### 1. Fallas de Permisos en Google Drive (Acceso Denegado / Archivo Inexistente)
- **Causa:** La cuenta de servicio de Google no tiene acceso de lectura al archivo o el ID es inválido.
- **Detección:** Se captura la excepción `googleapiclient.errors.HttpError` con códigos HTTP `403` o `404` en la función `_fetch_drive_file_metadata`.
- **Tratamiento:** Se eleva una excepción descriptiva de tipo `PermissionError`, deteniendo el pipeline de inmediato y evitando descargas infructuosas.

### 2. Archivos de Video Corruptos o Incompletos
- **Causa:** El archivo se subió a medias o tiene cabeceras corruptas que impiden leer el contenedor MP4/MOV.
- **Detección:** `ffmpeg-python` ejecuta una llamada `ffmpeg.probe(temp_video_path)` para validar los codecs y streams de video.
- **Tratamiento:** Si falla la lectura de metadatos o no se detecta un stream de tipo `"video"`, se genera una excepción `ValueError` detallada ("El archivo de video está corrupto o no es un contenedor multimedia válido").

### 3. Falla de Extracción de Audio
- **Causa:** El codificador de audio o el contenedor de video falla al convertirse a MP3.
- **Detección:** Se captura la excepción de ejecución `ffmpeg.Error`.
- **Tratamiento:** Se lee el flujo `stderr` del comando para registrar el log detallado del error de FFmpeg, y se eleva un `ValueError` con el log de error de FFmpeg.

### 4. Limpieza de Archivos Temporales (Tolerancia Cero al Almacenamiento Residual)
- **Mecanismo:** Para garantizar que el video no se almacene permanentemente (optimizando costos y espacio en disco), la descarga y el procesamiento se encapsulan en un bloque `try...finally`.
- **Resultado:** El archivo bruto temporal de video se elimina *siempre* en el bloque `finally`, independientemente de si el proceso fue exitoso o falló debido a corrupción.

---

## Estructuración del Prompt del Sistema en Content-Brain Service (`/backend/app/services/content_brain_service.py`)

Para garantizar que el modelo de lenguaje (Gemini 1.5) genere transcripciones exactas y redacte copys estrictamente alineados con la identidad y el tono de Afterbow Productions, el prompt del sistema se estructuró de la siguiente forma en el código:

### 1. Inyección de Contexto Dinámico del Cliente
El prompt del sistema se compila dinámicamente inyectando las directrices del manual de marca recuperado de Firestore para cada cliente:
- **Tono de Voz:** Define la personalidad comunicativa (ej. audaz, instructivo, sarcástico, etc.).
- **Audiencia Objetivo:** Delimita a quién va dirigido el copy.
- **Palabras Prohibidas:** Una lista de términos (ej. "secreto", "fácil", "garantizado") que el modelo tiene estrictamente prohibido utilizar, protegiendo al cliente de caer en clichés de marketing.
- **Frases Clave:** Expresiones específicas del nicho del cliente que se incentiva incorporar de forma orgánica.
- **Directrices Adicionales:** Instrucciones de estilo puntuales (ej. evitar signos de exclamación excesivos).

### 2. Estricto Formateo del Copy Final (Estilo Afterbow iOS UI)
El prompt detalla las pautas estructurales exactas de Afterbow:
- **Línea 1:** Un gancho (hook) de alto impacto visual y escrito en MAYÚSCULAS junto a un emoji seleccionado estratégicamente.
- **Cuerpo:** Párrafos cortos y legibles en dispositivos móviles, limitados a un máximo de 2 líneas de longitud.
- **CTA:** Un llamado a la acción enfocado a la generación de leads mediante comentarios (conversión orgánica, ej: "Comentá la palabra X y te lo mando por DM").

### 3. Restricción de Salida Estructurada (JSON)
Para evitar fallas de análisis sintáctico al procesar el output de la IA en el backend, se configuró `response_mime_type="application/json"` en el `generation_config` de Gemini y se le instruyó al modelo devolver exactamente tres claves JSON tipadas:
- `"transcription"`: Una cadena de texto limpia de muletillas coloquiales.
- `"hooks_sugeridos"`: Un arreglo de 3 elementos con las claves `"alternative_number"`, `"visual_hook"` y `"text_on_screen"`.
- `"copy_final"`: El texto de la descripción ya formateado.

Esto asegura compatibilidad de tipos directa con nuestros modelos de datos de Firestore.

---

## Fase 1 — Auditoría Técnica: Cloud Run Ready (2026-06-13)

### Código Eliminado (Legacy)

- **`/backend/agents/`**: Se eliminó el directorio completo que contenía `dit_agent.py` (306 líneas) y `content_brain.py` (389 líneas). La lógica funcional fue migrada a `/backend/app/services/`.
- **`/agents/specs/`**: Se eliminó el directorio raíz con las especificaciones de diseño (`01_dit_agent_core.md`, `02_content_brain_agent_core.md`, `03_database_and_web_bridge.md`). El conocimiento ya está plasmado en el código productivo y en este archivo.

### Unificación de Servicios

Se consolidó toda la lógica de negocio en dos servicios con tipado fuerte Pydantic:

- **`/backend/app/services/dit_service.py`**: Integra la lógica de producción de los 5 pasos del pipeline:
  1. **Descarga Efímera**: Descarga de video desde Google Drive a `/tmp/` (`MediaIoBaseDownload` con chunked download).
  2. **Extracción de Audio Optimizada**: Subproceso FFmpeg para extraer el audio y comprimirlo a 128kbps en formato `.mp3` (ahorro masivo de ancho de banda).
  3. **Renombrado Estricto**: Renombra el archivo en Drive a la nomenclatura oficial (`[AFT]-[CLIENTE]-[AAAAMMDD]-[TIPO_PLANO]-[NRO_CLIP]`).
  4. **Limpieza Absoluta de Disco (`finally`)**: Se llama a `_absolute_disk_cleanup()` para eliminar todo archivo efímero de `/tmp/`, manteniendo el almacenamiento del contenedor en 0 bytes y previniendo facturación por disco residual.
  5. **Persistencia de Estado**: Actualiza el estado a `Audio_Listo` en Firestore.

- **`/backend/app/services/content_brain_service.py`**: Integra la lógica real del agente legacy:
  - Upload de audio a Google AI Studio (`genai.upload_file()`) con polling de estado.
  - Prompt creativo completo del Director Creativo Senior con inyección de `BrandVoice` Pydantic.
  - Gemini 1.5 Flash con `response_mime_type="application/json"` para output estructurado.
  - Validación de hooks con `HookSuggestion` Pydantic model.
  - Exportación de markdown a Google Drive con `MediaInMemoryUpload`.
  - Cleanup de archivos efímeros en Google AI Studio vía `genai.delete_file()`.

### Dockerfile Optimizado

- Imagen base: `python:3.11-slim`
- Dependencias de sistema: `ffmpeg`, `libavcodec-extra`, `libavformat-dev`
- Limpieza de caché apt (`rm -rf /var/lib/apt/lists/*`)
- Variables de entorno: `PYTHONDONTWRITEBYTECODE=1`, `PYTHONUNBUFFERED=1`
- Puerto: `8080` (estándar Cloud Run)
- Entrypoint: `uvicorn app.main:app --host 0.0.0.0 --port 8080`
- Se creó `.dockerignore` para excluir `__pycache__`, `.env`, `.git`, `cache/`, etc.

### Externalización de Credenciales

Se eliminaron todas las dependencias de rutas estáticas locales. El sistema ahora resuelve credenciales en 3 niveles de prioridad:

1. **Ruta explícita** (`FIREBASE_CREDENTIALS_PATH` / `GOOGLE_DRIVE_CREDENTIALS_PATH`) — para desarrollo local.
2. **`GOOGLE_APPLICATION_CREDENTIALS`** — variable estándar de GCP, apuntando a un JSON de Service Account.
3. **Application Default Credentials (ADC)** — automático en Cloud Run, GCE, GKE. No requiere archivos JSON.

Se agregó `FIREBASE_PROJECT_ID` para especificar el proyecto de Firebase cuando se usa ADC sin JSON explícito.

### Estructura Actual del Backend

```
/backend
├── .dockerignore
├── .env.example
├── Dockerfile
├── requirements.txt
└── app/
    ├── __init__.py
    ├── main.py
    ├── config.py              # PORT=8080, GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_PROJECT_ID
    ├── api/v1/
    │   ├── dit.py
    │   ├── content_brain.py
    │   └── contents.py
    ├── core/
    │   ├── drive.py           # 3-tier credential resolution (explicit → GAC → ADC)
    │   ├── firebase.py        # 3-tier credential resolution (explicit → GAC → ADC)
    │   └── gemini.py
    ├── models/
    │   ├── client.py          # Client, BrandVoice
    │   └── content.py         # ContentStatus, HookSuggestion, Content, ContentUpdate
    ├── services/
    │   ├── dit_service.py     # Lógica completa DIT (download, validate, extract, rename, move, log)
    │   └── content_brain_service.py  # Lógica completa Content-Brain (Gemini, transcription, hooks, copy)
    └── utils/
        └── ffmpeg.py
```

---

## Fase 2 — Implementación de Content-Brain Service (2026-06-13)

### Llamada Multimodal con Audio Nativo

Para realizar la transcripción cognitiva y la redacción del copy de forma altamente contextual, se implementó el siguiente flujo en `/backend/app/services/content_brain_service.py`:
1. **Carga de Contexto**: Se accede a Firestore para obtener el manual de marca del cliente (`tono`, `arquetipo`, y `pilares`).
2. **Carga Nativa de Audio**: Se utiliza la API de Archivos de Google AI (`genai.upload_file()`) para subir de forma efímera el archivo `.mp3` de 128kbps y se realiza polling de su estado hasta que esté activo.
3. **Inferencia con Prompt Creativo**: Se llama al modelo `gemini-1.5-flash` inyectando tanto el archivo de audio como un prompt de sistema rígido que combina el tono, arquetipo y pilares con las restricciones de copywriting de Afterbow.

### Restricción del Esquema JSON (Nativo)

Se forzó al modelo a responder únicamente en formato estructurado JSON nativo configurando `response_mime_type="application/json"` en el `generation_config`.
El esquema exigido y validado es:
- `transcription`: Transcripción limpia y sin muletillas coloquiales del audio.
- `hooks_sugeridos`: Un array de 3 ganchos secuenciales conteniendo:
  - `alternative_number` (secuencia 1, 2, 3)
  - `visual_hook` (acción en los primeros 3 segundos)
  - `text_on_screen` (texto superpuesto en pantalla en MAYÚSCULAS)
- `copy_final`: Texto final que sigue el estilo Afterbow (primera línea con emoji + mayúsculas, párrafos cortos de máx. 2 líneas, CTA directo de conversión).

### Persistencia y Sincronización

El resultado es persistido en Firestore de forma redundante:
1. En la subcolección específica del cliente: `/clientes/[client_id]/contenidos/[content_id]`
2. En la colección de sincronización del dashboard: `/afterbow-app/clientes/[client_id]/[content_id]`

Para evitar la eliminación prematura del archivo de audio local (race condition) dado el procesamiento en segundo plano, se sincronizó el endpoint del webhook en `/api/v1/content-brain/process` usando `await` directo sobre el pipeline. Adicionalmente, el cliente HTTP interno (`dit_service.py`) aumentó su timeout de conexión a `60.0` segundos para tolerar el tiempo de transcripción e inferencia de Gemini. El archivo local se borra únicamente cuando el webhook retorna exitosamente la persistencia "ready".

