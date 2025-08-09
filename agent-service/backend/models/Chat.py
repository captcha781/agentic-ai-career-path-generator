from beanie import Document, PydanticObjectId
from datetime import datetime, timezone
from pydantic import Field
from typing import Optional


class Chat(Document):
    career_path_id: PydanticObjectId
    user_input: str = ""
    agent_response: str = ""
    initial_prompt: str = ""
    is_resume_included: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "chats"
