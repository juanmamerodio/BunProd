from pydantic import BaseModel, Field
from typing import Optional, List

class BrandVoice(BaseModel):
    tone: str = Field(description="The tone of voice of the brand (e.g. bold, professional, educational)")
    target_audience: str = Field(description="Description of target customers/users")
    key_phrases: List[str] = Field(default=[], description="Common phrases or buzzwords this brand uses")
    forbidden_words: List[str] = Field(default=[], description="Words/expressions the brand strictly avoids")
    additional_guidelines: Optional[str] = Field(default=None, description="Any other writing instructions")

class Client(BaseModel):
    id: str = Field(description="Unique ID matching the Firestore document key")
    nombre: str = Field(description="The display name of the client")
    plan: str = Field(default="Contenido del Mes", description="Plan tier bought by the client")
    brand_voice: Optional[BrandVoice] = Field(default=None, description="Tone & strategic copywriting manual of the client")
