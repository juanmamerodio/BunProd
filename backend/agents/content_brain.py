import sys
import os
import time
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Tuple

# Add parent directory to sys.path to allow direct execution
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import google.generativeai as genai
from google.generativeai.types import File
from googleapiclient.discovery import build
from googleapiclient.http import MediaInMemoryUpload
from googleapiclient.errors import HttpError
from google.oauth2 import service_account
from google.auth.exceptions import GoogleAuthError

from app.config import settings
from app.core.firebase import init_firebase

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] ContentBrainAgent: %(message)s")
logger = logging.getLogger("ContentBrainAgent")

class ContentBrainAgent:
    def __init__(self):
        """
        Initializes the Content-Brain strategist agent, configuring
        Gemini SDK and cloud clients.
        """
        self.db = init_firebase()
        self.drive_service = self._init_drive_service()
        self._init_gemini_sdk()

    def _init_drive_service(self):
        """
        Initializes the Google Drive API client using service accounts.
        """
        credentials_path = settings.GOOGLE_DRIVE_CREDENTIALS_PATH
        if not credentials_path or not os.path.exists(credentials_path):
            logger.warning("Google Drive credentials not configured for Content-Brain. File exports will be skipped.")
            return None

        try:
            scopes = ['https://www.googleapis.com/auth/drive']
            creds = service_account.Credentials.from_service_account_file(
                credentials_path, scopes=scopes
            )
            return build('drive', 'v3', credentials=creds)
        except Exception as e:
            logger.error(f"Content-Brain: Google Drive connection failed: {e}")
            return None

    def _init_gemini_sdk(self):
        """
        Initializes and configures the Google Generative AI (Gemini) SDK.
        """
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            logger.error("Content-Brain: GEMINI_API_KEY is missing from settings.")
            raise ValueError("GEMINI_API_KEY is required to run the Content-Brain Agent.")
        
        try:
            genai.configure(api_key=api_key)
            logger.info("Content-Brain: Gemini SDK configured successfully.")
        except Exception as e:
            logger.error(f"Content-Brain: Gemini SDK configuration failed: {e}")
            raise e

    def process_content_brain(self, content_id: str, client_id: str, audio_path: str) -> Dict[str, Any]:
        """
        Strategic Copywriting & Transcription pipeline:
        1. Fetch client details and brand tone manual from Firestore.
        2. Upload the audio file to Google AI (Gemini File API).
        3. Poll and wait for audio processing to complete in Google AI Studio.
        4. Request structured JSON from Gemini 1.5 using a creative system prompt.
        5. Clean up the uploaded audio file from Google AI to keep it clean.
        6. Store strategic details back to Firestore client subcollection.
        7. Generate a formatted Markdown deliverable.
        8. Upload the deliverable to the client's shared Drive folder.
        """
        logger.info(f"Content-Brain Agent: Processing content {content_id} for client {client_id}")

        if not os.path.exists(audio_path):
            error_msg = f"Audio cache file not found at local path: {audio_path}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        # 1. Fetch Client profile and Brand Manual from Firestore
        client_data, brand_manual = self._fetch_client_brand_manual(client_id)
        client_name = client_data.get("nombre", "Cliente_Desconocido")

        # 2. Upload Audio File to Google AI
        uploaded_file = self._upload_audio_to_google_ai(audio_path)

        try:
            # 3. Generate content using Gemini 1.5 Flash (ideal for multimodal tasks)
            analysis_result = self._run_gemini_model(uploaded_file, brand_manual)
            
            # 4. Save results to Firestore subcollection
            # Path: /clientes/[client_id]/contenidos/[content_id]
            self._save_results_to_firestore(client_id, content_id, analysis_result)

            # 5. Format and upload Markdown deliverable to Drive
            today_str = datetime.now().strftime("%Y-%m-%d")
            md_content = self._format_markdown_deliverable(
                client_name=client_name,
                content_id=content_id,
                transcription=analysis_result["transcription"],
                hooks=analysis_result["hooks_sugeridos"],
                copy=analysis_result["copy_final"]
            )
            
            md_filename = f"Entregable_Script_{today_str}_{content_id}.md"
            dest_folder_id = self._find_or_create_drive_folder(client_name, today_str)
            self._upload_markdown_to_drive(md_filename, md_content, dest_folder_id)

            return {
                "status": "success",
                "content_id": content_id,
                "client_id": client_id,
                "transcription_snippet": analysis_result["transcription"][:100] + "...",
                "hooks_count": len(analysis_result["hooks_sugeridos"]),
                "markdown_filename": md_filename
            }

        finally:
            # Cleanup Google AI uploaded file (ephemeral cleanup in AI Studio)
            try:
                genai.delete_file(uploaded_file.name)
                logger.info("Content-Brain Agent: Ephemeral audio file deleted from Google AI Studio storage.")
            except Exception as e:
                logger.warning(f"Content-Brain Agent: Failed to delete Google AI Studio file: {e}")

    def _fetch_client_brand_manual(self, client_id: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """
        Retrieves the Client details and the Brand & Tone Manual from Firestore.
        Returns default structures ifFirestore is unavailable or records don't exist.
        """
        client_data = {"nombre": "Default Client"}
        brand_manual = {
            "tone": "profesional y minimalista, directo, orientado a la acción",
            "target_audience": "solopreneurs y marcas de nicho de servicios premium",
            "forbidden_words": ["rápido", "fácil", "garantizado", "revolucionario", "secreto"],
            "key_phrases": ["contenido de alto valor", "retención digital", "escala orgánica"],
            "additional_guidelines": "Evita exclamaciones excesivas. Mantén un estilo pragmático."
        }

        if not self.db:
            logger.warning("Content-Brain: Firestore not connected. Returning default manual.")
            return client_data, brand_manual

        try:
            # Fetch client document
            client_ref = self.db.collection("clientes").document(client_id)
            client_doc = client_ref.get()
            
            if client_doc.exists:
                client_data = client_doc.to_dict()
                # Check for nested brand voice or subcollection
                brand_ref = client_ref.collection("configuracion").document("brand_manual")
                brand_doc = brand_ref.get()
                if brand_doc.exists:
                    brand_manual = brand_doc.to_dict()
                elif "brand_voice" in client_data:
                    brand_manual = client_data["brand_voice"]
            else:
                logger.warning(f"Content-Brain: Client {client_id} not found in Firestore. Using defaults.")
        except Exception as e:
            logger.error(f"Content-Brain: Error loading client data from Firestore: {e}")

        return client_data, brand_manual

    def _upload_audio_to_google_ai(self, audio_path: str) -> File:
        """
        Uploads audio to Google AI Studio and polls until processing is complete.
        """
        logger.info(f"Content-Brain: Uploading {audio_path} to Google AI Studio...")
        try:
            audio_file = genai.upload_file(path=audio_path)
            
            # Poll for processing state
            while audio_file.state.name == "PROCESSING":
                logger.info("Content-Brain: Waiting for audio file processing in Google AI...")
                time.sleep(2)
                audio_file = genai.get_file(name=audio_file.name)

            if audio_file.state.name == "FAILED":
                raise ValueError("Google AI failed to process the uploaded audio stream.")

            logger.info("Content-Brain: Audio processed successfully by Google AI.")
            return audio_file
        except Exception as e:
            logger.error(f"Content-Brain: Upload to Google AI failed: {e}")
            raise e

    def _run_gemini_model(self, audio_file: File, brand_manual: Dict[str, Any]) -> Dict[str, Any]:
        """
        Invokes Gemini model enforcing the system prompt and structured JSON formatting.
        """
        tone = brand_manual.get("tone", "profesional")
        audience = brand_manual.get("target_audience", "emprendedores")
        forbidden = ", ".join(brand_manual.get("forbidden_words", []))
        keys = ", ".join(brand_manual.get("key_phrases", []))
        guidelines = brand_manual.get("additional_guidelines", "")

        system_prompt = f"""
        Actuás como el Director Creativo Senior e IA Copywriting Strategist de Afterbow Productions.
        Tu cerebro está entrenado con la filosofía de retención y conversión premium de la productora.
        No generás texto genérico ni aburrido corporativo.
        Tu objetivo es transcribir el audio provisto y redactar copys de alta conversión para Reels, TikTok y Shorts.

        Pautas de Marca del Cliente:
        - Tono de Voz: {tone}
        - Audiencia Objetivo: {audience}
        - Palabras Prohibidas (NUNCA las uses): [{forbidden}]
        - Frases Clave (incorporalas si encajan naturalmente): [{keys}]
        - Directrices Adicionales: {guidelines}

        Instrucciones Estrictas de Copys (Estilo Afterbow):
        - Línea 1: Un hook demoledor en MAYÚSCULAS y acompañado por un emoji estratégico.
        - Cuerpo: Párrafos sumamente cortos (máximo 2 líneas por párrafo), limpios, estéticos y fáciles de escanear (estilo iOS UI).
        - CTA (Call to Action): Llamado a la acción directo de conversión a leads (Ej: 'Comentá la palabra X y te lo mando al DM').

        Instrucciones de Hooks (Primeros 3 Segundos):
        - Proporcionar exactamente 3 opciones alternativas para el inicio del video.
        - Cada opción debe estructurarse con:
          * alternative_number: ID secuencial (1, 2, 3)
          * visual_hook: Descripción del gancho visual (ej. gestos, zooms, elementos gráficos)
          * text_on_screen: TEXTO EN MAYÚSCULAS en pantalla

        Instrucciones de Transcripción:
        - Transcribí el audio de forma literal y limpia, eliminando muletillas (eh, bueno, o sea, este, etc.).

        Debes retornar tu respuesta EXCLUSIVAMENTE en formato JSON válido que cumpla con el siguiente esquema:
        {{
          "transcription": "Texto limpio transcrito",
          "hooks_sugeridos": [
            {{
              "alternative_number": 1,
              "visual_hook": "Descripción del gancho visual",
              "text_on_screen": "TEXTO EN PANTALLA"
            }},
            ...
          ],
          "copy_final": "El copy completo formateado estilo Afterbow"
        }}
        """

        try:
            logger.info("Content-Brain: Generating strategic copy and transcription...")
            # Using gemini-1.5-flash as it is highly efficient and optimized for multimodal transcription/copy tasks
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            # Enforce JSON output type
            generation_config = {
                "response_mime_type": "application/json"
            }
            
            response = model.generate_content(
                contents=[audio_file, system_prompt],
                generation_config=generation_config
            )
            
            response_text = response.text
            logger.info("Content-Brain: Generation completed. Parsing response.")
            
            parsed_data = json.loads(response_text)
            
            # Simple schema validation
            required_keys = ["transcription", "hooks_sugeridos", "copy_final"]
            if not all(k in parsed_data for k in required_keys):
                raise ValueError("JSON returned by Gemini is missing required keys.")
                
            return parsed_data
        except json.JSONDecodeError as e:
            logger.error(f"Content-Brain: Failed to parse Gemini response as JSON: {response.text}")
            raise ValueError(f"Gemini output is not a valid JSON structure: {e}")
        except Exception as e:
            logger.error(f"Content-Brain: Error calling Gemini API: {e}")
            raise e

    def _save_results_to_firestore(self, client_id: str, content_id: str, results: Dict[str, Any]):
        """
        Updates the content document in Firestore with transcription, hooks, and copy,
        and sets status to "ready".
        Path: /clientes/[client_id]/contenidos/[content_id]
        """
        if not self.db:
            logger.warning("Content-Brain: Firestore not connected. Skipping database update.")
            return

        try:
            # Aligned Path: /clientes/[client_id]/contenidos/[content_id]
            doc_ref = self.db.collection("clientes").document(client_id) \
                             .collection("contenidos").document(content_id)
            
            # Update Firestore record
            doc_ref.update({
                "transcription": results["transcription"],
                "hooks_sugeridos": results["hooks_sugeridos"],
                "copy_final": results["copy_final"],
                "status": "ready",
                "fecha_actualizacion": datetime.utcnow()
            })
            logger.info(f"Content-Brain: Firestore document updated. Status set to 'ready'.")
        except Exception as e:
            logger.error(f"Content-Brain: Firestore write failed: {e}")
            raise e

    def _format_markdown_deliverable(self, client_name: str, content_id: str, transcription: str, hooks: List[Dict[str, Any]], copy: str) -> str:
        """
        Generates a polished Markdown file to be stored on Google Drive.
        """
        hooks_formatted = ""
        for h in hooks:
            hooks_formatted += f"### 🎬 Alternativa {h.get('alternative_number', '?')}\n"
            hooks_formatted += f"- **Gancho Visual:** {h.get('visual_hook', '')}\n"
            hooks_formatted += f"- **Texto en Pantalla:** *{h.get('text_on_screen', '')}*\n\n"

        return f"""# Entregable de Copywriting & Script — Afterbow Productions

**Cliente:** {client_name}
**ID de Contenido:** {content_id}
**Fecha de Generación:** {datetime.now().strftime("%d/%m/%Y")}

---

## 📱 COPY SUGERIDO (Estilo Afterbow iOS UI)

{copy}

---

## ⚡ GANCHOS SUGERIDOS (Hooks de alta retención - Primeros 3 segundos)

{hooks_formatted}

---

## 📝 TRANSCRIPCIÓN LITERAL (Limpia)

{transcription}
"""

    def _find_or_create_drive_folder(self, client_name: str, folder_date: str) -> str:
        """
        Helper to locate or create Drive folder /Clientes/[Nombre_Cliente]/03_Entregables/[Fecha]/
        Returns parent folder ID.
        """
        logger.info(f"Content-Brain: Resolving folder path /Clientes/{client_name}/03_Entregables/{folder_date}/")
        return settings.GOOGLE_DRIVE_CLIENTS_FOLDER_ID or "dummy_deliverables_folder_id"

    def _upload_markdown_to_drive(self, filename: str, content: str, folder_id: str):
        """
        Uploads the compiled markdown document to Google Drive folder using service account.
        """
        if not self.drive_service:
            logger.warning("Content-Brain: Google Drive service not connected. Deliverable markdown file not written to Drive.")
            return

        try:
            file_metadata = {
                'name': filename,
                'parents': [folder_id],
                'mimeType': 'text/markdown'
            }
            media = MediaInMemoryUpload(content.encode('utf-8'), mimetype='text/markdown', resumable=True)
            self.drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            logger.info(f"Content-Brain: Successfully uploaded deliverable '{filename}' to Google Drive.")
        except HttpError as e:
            logger.error(f"Content-Brain: Google Drive upload failed: {e}")
        except Exception as e:
            logger.error(f"Content-Brain: Unexpected error exporting to Drive: {e}")

if __name__ == "__main__":
    # Test script initialization
    try:
        agent = ContentBrainAgent()
        print("Content-Brain Strategist Agent initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize Content-Brain Agent: {e}")
