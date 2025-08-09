from contextlib import asynccontextmanager

from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from backend.config.main import MONGO_URI
import logging

from backend.models.Chat import Chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.db = AsyncIOMotorClient(MONGO_URI)["pente-agent-service"]
    await init_beanie(
        database=app.db,
        document_models=[Chat],
    )
    logging.info("Database initialized")
    yield
    logging.info("Server closed successfully")
