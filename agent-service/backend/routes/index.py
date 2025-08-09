from fastapi import APIRouter
from backend.routes.internal import router as intr_router
from backend.routes.user import router as user_router

router = APIRouter()

router.include_router(prefix="/internal", router=intr_router)
router.include_router(prefix="/user", router=user_router)
