from pydantic import BaseModel
from beanie import PydanticObjectId


class CreateCareerPath(BaseModel):
    career_id: PydanticObjectId
    skills: list = []
    timeline: int = 2
    period: str = "weeks"
    resume: str = ""
    user_input: str = ""
