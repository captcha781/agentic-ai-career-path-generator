from pydantic import BaseModel, Field


class CareerChat(BaseModel):
    message: str = Field(max_length=500)
