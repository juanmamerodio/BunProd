# System Specification: Database & Web Dashboard Sync

## 1. Arquitectura de Datos (Google Firestore Schema)

Para mantener la escalabilidad y evitar bloqueos de concurrencia, el sistema interactúa con una colección centralizada en Firestore:
/afterbow-app (Root)
/clientes (Colección)
/[cliente_id] (Documento)

- nombre: "Nombre Cliente"
- plan: "Contenido del Mes"
  /contenidos (Subcolección)
  /[contenido_id] (Documento)
- video_drive_url: "string"
- audio_cached_url: "string"
- status: "ingested" | "processing" | "ready"
- transcription: "string"
- hooks_sugeridos: [Array]
- copy_final: "string"
- fecha_creacion: Timestamp

## 2. Sincronización con el Frontend (Vercel + WebGL UI)

- **Real-time Updates:** La interfaz web privada de Afterbow debe escuchar los cambios de Firestore mediante `onSnapshot()` de Firebase.
- **Optimización de Render:** Cuando el estado de un contenido cambia de `processing` a `ready`, la interfaz de la web debe renderizar una transición fluida (60fps) usando microinteracciones para mostrarle al equipo el copy final generado, minimizando el lag visual.

## 3. Acciones del Usuario en la Web

1. **Aprobación de Copy:** Cuando el usuario hace clic en "Aprobar Contenido" en la web, el estado en Firestore cambia a `approved`.
2. **Trigger del Publicador:** El cambio a `approved` gatilla el webhook final que compila el video definitivo y su metadata para el Agente Publicador.
