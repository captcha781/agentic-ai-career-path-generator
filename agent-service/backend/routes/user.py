from fastapi import APIRouter, Depends
from backend.validations import user as user_valid
from backend.controller import user as user_ctrl
from backend.security.jsonwebtoken import get_current_user_access

router = APIRouter()

@router.post("/chat/{career_id}")
async def chat_career(career_id, chat_data: user_valid.CareerChat, data: dict = Depends(get_current_user_access)):
    return await user_ctrl.chat_career(career_id, chat_data)

@router.get("/chat/{career_id}")
async def career_messages(career_id, data: dict = Depends(get_current_user_access)):
    return await user_ctrl.career_messages(career_id)