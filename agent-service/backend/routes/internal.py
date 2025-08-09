from fastapi import APIRouter, Depends
from backend.validations import internal as intr_valid
from backend.controller import internal as intr_ctrl
from backend.middleware.verify_signature import verify_signature

router = APIRouter()


@router.post("/create-career-path")
async def create_career_path(career_data: intr_valid.CreateCareerPath, data: dict = Depends(verify_signature)):
    return await intr_ctrl.create_career_path(career_data)
