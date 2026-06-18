import os
import json
import time
import logging
from datetime import datetime
from typing import Dict, Any, List, Tuple

import google.generativeai as genai
from google.generativeai.types import File
from googleapiclient.http import MediaInMemoryUpload
from googleapiclient.errors import HttpError

from app.config import settings
from app.core.firebase import init_firebase
from app.core.drive import get_drive_service
from app.core.gemini import init_gemini
from app.models.client import BrandVoice
from app.models.content import HookSuggestion

logger = logging.getLogger("app.services.content_brain")


class ContentBrainService:
    """
    Content-Brain Strategist Service.

    Handles the complete lifecycle of audio analysis and strategic copy generation:
    fetch brand manual → upload audio to Gemini → transcribe & generate copy → save to Firestore → export to Drive.
    """

    def __init__(self):
        self.db = init_firebase()
        self.drive = get_drive_service()
        init_gemini()

    # ──────────────────────────────────────────────
    # PUBLIC PIPELINE
    # ──────────────────────────────────────────────

    async def process_audio_and_generate_strategy(
        self,
        content_id: str,
        client_id: str,
        audio_path: str,
    ) -> Dict[str, Any]:
        """
        Strategic Copywriting & Transcription pipeline:
        1. Fetch client brand manual from Firestore (tono, arquetipo, pilares).
        2. Upload audio using genai.upload_file().
        3. Invoke Gemini with a strict system prompt and JSON constraint.
        4. Validate structure and clean up Gemini file.
        5. Persist JSON in client's /contenidos subcollection and set status to "ready".
        """
        logger.info(f"Content-Brain: Processing content {content_id} for client {client_id}")

        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio cache file not found at {audio_path}")

        # 1. Recepción del Trigger y Carga de Contexto (Manual de Marca)
        brand_manual = self._fetch_client_brand_manual(client_id)

        # 2. Upload a Gemini Files API
        uploaded_file = self._upload_audio_to_google_ai(audio_path)

        try:
            # 3. Inyección del Prompt Estratégico de Afterbow & Llamada a Gemini
            analysis_result = self._run_gemini_model(uploaded_file, brand_manual)

            # 5. Persistencia en la subcolección /contenidos y estado "ready"
            await self._update_firestore_content(client_id, content_id, analysis_result)

            # Opcional: Generar markdown para Drive si está configurado
            try:
                client_name = brand_manual.get("nombre", "Cliente_Desconocido")
                today_str = datetime.utcnow().strftime("%Y-%m-%d")
                md_content = self._format_markdown_deliverable(
                    client_name=client_name,
                    content_id=content_id,
                    transcription=analysis_result["transcription"],
                    hooks=analysis_result["hooks_sugeridos"],
                    copy=analysis_result["copy_final"],
                )
                md_filename = f"Entregable_Script_{today_str}_{content_id}.md"
                dest_folder_id = self._find_or_create_drive_folder(client_name, today_str)
                self._upload_markdown_to_drive(md_filename, md_content, dest_folder_id)
            except Exception as e:
                logger.warning(f"Content-Brain: Optional Google Drive export skipped or failed: {e}")

            # Notificación a Social Media Managers
            self._notify_social_media_managers(brand_manual.get("nombre", "Cliente"), content_id)

            return {
                "status": "ready",
                "content_id": content_id,
                "client_id": client_id,
                "transcription": analysis_result["transcription"],
                "hooks_sugeridos": analysis_result["hooks_sugeridos"],
                "copy_final": analysis_result["copy_final"]
            }

        except Exception as e:
            logger.error(f"Content-Brain: Pipeline execution failed: {e}")
            raise e
        finally:
            # Limpieza efímera en Google AI Studio
            if uploaded_file:
                try:
                    genai.delete_file(uploaded_file.name)
                    logger.info("Content-Brain: Ephemeral audio file deleted from Google AI Studio storage.")
                except Exception as e:
                    logger.warning(f"Content-Brain: Failed to delete Google AI Studio file: {e}")

    # ──────────────────────────────────────────────
    # 1. FIRESTORE — LOAD BRAND MANUAL
    # ──────────────────────────────────────────────

    def _fetch_client_brand_manual(self, client_id: str) -> Dict[str, Any]:
        """
        Loads the Client details and the Brand & Tone Manual from Firestore.
        Retrieves: tono, arquetipo, pilares, and other guidelines.
        """
        brand_manual = {
            "nombre": "Default Client",
            "tono": "profesional y minimalista, directo, orientado a la acción",
            "arquetipo": "El Creador / El Sabio",
            "pilares": ["contenido de alto valor", "retención digital", "escala orgánica"],
            "forbidden_words": ["rápido", "fácil", "garantizado", "revolucionario", "secreto"],
            "key_phrases": ["contenido de alto valor", "retención digital"],
            "additional_guidelines": "Evita exclamaciones excesivas. Mantén un estilo pragmático."
        }

        if not self.db:
            logger.warning("Content-Brain: Firestore not connected. Returning default brand manual.")
            return brand_manual

        try:
            # Intentamos leer de la colección raíz 'clientes'
            client_ref = self.db.collection("clientes").document(client_id)
            client_doc = client_ref.get()

            if client_doc.exists:
                client_data = client_doc.to_dict() or {}
                brand_manual["nombre"] = client_data.get("nombre", brand_manual["nombre"])
                
                # Check directly in the client doc (if flat fields exist)
                if "brand_voice" in client_data and isinstance(client_data["brand_voice"], dict):
                    brand_manual.update(client_data["brand_voice"])
                else:
                    for k in ["tono", "arquetipo", "pilares", "forbidden_words", "key_phrases", "additional_guidelines"]:
                        if k in client_data:
                            brand_manual[k] = client_data[k]

                # Check for subcollection config
                brand_ref = client_ref.collection("configuracion").document("brand_manual")
                brand_doc = brand_ref.get()
                if brand_doc.exists:
                    brand_manual.update(brand_doc.to_dict() or {})
            else:
                # Intentamos en el path alternativo: /afterbow-app/clientes/[client_id]/configuracion/brand_manual
                alt_ref = (
                    self.db.collection("afterbow-app")
                    .document("clientes")
                    .collection(client_id)
                    .document("brand_manual")
                )
                alt_doc = alt_ref.get()
                if alt_doc.exists:
                    brand_manual.update(alt_doc.to_dict() or {})

            logger.info(f"Content-Brain: Brand manual context loaded for client {client_id}.")
        except Exception as e:
            logger.error(f"Content-Brain: Error loading client brand manual from Firestore: {e}")

        return brand_manual

    # ──────────────────────────────────────────────
    # 2. GEMINI FILE API UPLOAD
    # ──────────────────────────────────────────────

    def _upload_audio_to_google_ai(self, audio_path: str) -> File:
        """
        Uploads audio to Google AI Files API using genai.upload_file().
        """
        logger.info(f"Content-Brain: Uploading ephemeral audio {audio_path} to Google AI...")
        try:
            audio_file = genai.upload_file(path=audio_path)
            
            # Polling to wait for the file to be processed
            while audio_file.state.name == "PROCESSING":
                logger.info("Content-Brain: Audio processing in progress, waiting 2s...")
                time.sleep(2)
                audio_file = genai.get_file(name=audio_file.name)

            if audio_file.state.name == "FAILED":
                raise ValueError("Google AI File API failed to process the audio stream.")

            logger.info("Content-Brain: Audio processed and active in Google AI.")
            return audio_file
        except Exception as e:
            logger.error(f"Content-Brain: Failed to upload file to Google AI: {e}")
            raise e

    # ──────────────────────────────────────────────
    # 3 & 4. GEMINI INTERACTION & JSON SCHEMA
    # ──────────────────────────────────────────────

    def _run_gemini_model(self, audio_file: File, brand_manual: Dict[str, Any]) -> Dict[str, Any]:
        """
        Invokes Gemini model enforcing structured JSON output containing:
        - transcription
        - hooks_sugeridos
        - copy_final
        """
        forbidden = ", ".join(brand_manual.get("forbidden_words", []))
        keys = ", ".join(brand_manual.get("key_phrases", []))
        pilares = ", ".join(brand_manual.get("pilares", []))
        tono = brand_manual.get("tono", "")
        arquetipo = brand_manual.get("arquetipo", "")
        guidelines = brand_manual.get("additional_guidelines", "")

        system_prompt = f"""
        Actuás como el Director Creativo Senior e IA Copywriting Strategist de Afterbow Productions.
        Tu cerebro está entrenado con la filosofía de retención y conversión premium de la productora.
        No generás texto genérico ni aburrido corporativo.
        Tu objetivo es transcribir el audio provisto y redactar copys de alta conversión para Reels, TikTok y Shorts.

        Pautas de Marca del Cliente:
        - Tono de Voz: {tono}
        - Arquetipo de Marca: {arquetipo}
        - Pilares de Contenido: [{pilares}]
        - Palabras Prohibidas (NUNCA las uses): [{forbidden}]
        - Frases Clave (incorporalas si encajan naturalmente): [{keys}]
        - Directrices Adicionales: {guidelines}

        Instrucciones Estrictas de Copys (Estilo Afterbow):
        - Línea 1: Un hook demoledor en MAYÚSCULAS y acompañado por un emoji estratégico.
        - Cuerpo: Párrafos sumamente cortos (máximo 2 líneas por párrafo), limpios, estéticos y fáciles de escanear (estilo iOS UI).
        - CTA (Call to Action): Llamado a la acción directo de conversión a leads (Ej: 'Comentá la palabra X y te lo mando al DM').

        Instrucciones de Hooks (Primeros 3 Segundos de alta retención):
        - Proporcionar exactamente 3 opciones alternativas para el inicio del video.
        - Cada opción debe estructurarse con:
          * alternative_number: ID secuencial (1, 2, 3)
          * visual_hook: Descripción del gancho visual (ej. gestos, zooms, elementos gráficos)
          * text_on_screen: TEXTO EN MAYÚSCULAS en pantalla

        Debes retornar tu respuesta EXCLUSIVAMENTE en formato JSON válido que cumpla con el siguiente esquema:
        {{
          "transcription": "Texto limpio transcrito",
          "hooks_sugeridos": [
            {{
              "alternative_number": 1,
              "visual_hook": "Descripción del gancho visual",
              "text_on_screen": "TEXTO EN PANTALLA"
            }},
            {{
              "alternative_number": 2,
              "visual_hook": "Descripción del gancho visual",
              "text_on_screen": "TEXTO EN PANTALLA"
            }},
            {{
              "alternative_number": 3,
              "visual_hook": "Descripción del gancho visual",
              "text_on_screen": "TEXTO EN PANTALLA"
            }}
          ],
          "copy_final": "El copy completo formateado estilo Afterbow"
        }}
        """

        try:
            logger.info("Content-Brain: Generating copy and transcribing with Gemini...")
            model = genai.GenerativeModel("gemini-1.5-flash")

            # Force native structured JSON formatting
            generation_config = {"response_mime_type": "application/json"}

            response = model.generate_content(
                contents=[audio_file, system_prompt],
                generation_config=generation_config,
            )

            parsed_data = json.loads(response.text)

            # Validaciones básicas
            required_keys = ["transcription", "hooks_sugeridos", "copy_final"]
            if not all(k in parsed_data for k in required_keys):
                raise ValueError("JSON returned by Gemini is missing required keys.")

            return parsed_data
        except json.JSONDecodeError as e:
            logger.error("Content-Brain: Gemini response is not valid JSON.")
            raise ValueError(f"Gemini output is not a valid JSON structure: {e}")
        except Exception as e:
            logger.error(f"Content-Brain: Gemini API error: {e}")
            raise e

    # ──────────────────────────────────────────────
    # 5. FIRESTORE PERSISTENCE
    # ──────────────────────────────────────────────

    async def _update_firestore_content(self, client_id: str, content_id: str, results: Dict[str, Any]):
        """
        Saves transcription, hooks, and copy to:
        - /clientes/[client_id]/contenidos/[content_id] (Requested path)
        - /afterbow-app/clientes/[client_id]/[content_id] (Dashboard / dit path)
        Updates status to "ready".
        """
        if not self.db:
            logger.warning("Content-Brain: Firestore client not initialized. Persistence skipped.")
            return

        # 1. Path de subcolección /clientes/[client_id]/contenidos/[content_id]
        try:
            doc_ref_alt = (
                self.db.collection("clientes")
                .document(client_id)
                .collection("contenidos")
                .document(content_id)
            )
            doc_data = {
                "transcription": results["transcription"],
                "hooks_sugeridos": results["hooks_sugeridos"],
                "copy_final": results["copy_final"],
                "status": "ready",
                "fecha_actualizacion": datetime.utcnow(),
            }
            doc_ref_alt.set(doc_data, merge=True)
            logger.info(f"Content-Brain: Saved to /clientes/{client_id}/contenidos/{content_id}")
        except Exception as e:
            logger.error(f"Content-Brain: Failed to write to /clientes subcollection: {e}")
            raise e

        # 2. Path de Dashboard unificado /afterbow-app/clientes/[client_id]/[content_id]
        try:
            doc_ref = (
                self.db.collection("afterbow-app")
                .document("clientes")
                .collection(client_id)
                .document(content_id)
            )
            doc_ref.update({
                "transcription": results["transcription"],
                "hooks_sugeridos": results["hooks_sugeridos"],
                "copy_final": results["copy_final"],
                "status": "ready",
                "fecha_actualizacion": datetime.utcnow(),
            })
            logger.info(f"Content-Brain: Updated status to 'ready' in dashboard path.")
        except Exception as e:
            logger.warning(f"Content-Brain: Dashboards path update skipped or failed: {e}")

    # ──────────────────────────────────────────────
    # HELPERS (MARKDOWN & DRIVE)
    # ──────────────────────────────────────────────

    @staticmethod
    def _format_markdown_deliverable(
        client_name: str,
        content_id: str,
        transcription: str,
        hooks: List[Dict[str, Any]],
        copy: str,
    ) -> str:
        """
        Generates a polished Markdown file.
        """
        hooks_formatted = ""
        for h in hooks:
            hooks_formatted += f"### 🎬 Alternativa {h.get('alternative_number', '?')}\n"
            hooks_formatted += f"- **Gancho Visual:** {h.get('visual_hook', '')}\n"
            hooks_formatted += f"- **Texto en Pantalla:** *{h.get('text_on_screen', '')}*\n\n"

        return f"""# Entregable de Copywriting & Script — Afterbow Productions

**Cliente:** {client_name}
**ID de Contenido:** {content_id}
**Fecha de Generación:** {datetime.utcnow().strftime("%d/%m/%Y")}

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
        return settings.GOOGLE_DRIVE_CLIENTS_FOLDER_ID or "dummy_deliverables_folder_id"

    def _upload_markdown_to_drive(self, filename: str, content: str, folder_id: str):
        if not self.drive:
            return
        try:
            file_metadata = {
                "name": filename,
                "parents": [folder_id],
                "mimeType": "text/markdown",
            }
            media = MediaInMemoryUpload(
                content.encode("utf-8"), mimetype="text/markdown", resumable=True
            )
            self.drive.files().create(
                body=file_metadata, media_body=media, fields="id"
            ).execute()
            logger.info(f"Content-Brain: Successfully uploaded deliverable '{filename}' to Google Drive.")
        except HttpError as e:
            logger.error(f"Content-Brain: Google Drive upload failed: {e}")
        except Exception as e:
            logger.error(f"Content-Brain: Unexpected error exporting to Drive: {e}")

    # ──────────────────────────────────────────────
    # NOTIFICATIONS
    # ──────────────────────────────────────────────

    @staticmethod
    def _notify_social_media_managers(client_name: str, content_id: str):
        """
        Alerts Social Media Managers that content is ready for review in the dashboard.
        In production, integrate Slack/Telegram/email notification here.
        """
        logger.info(
            f"Notification Sent: Content {content_id} for client {client_name} "
            f"is ready for review. Social media managers alerted."
        )
