from decouple import Config, RepositoryEnv
from backend.utils.timedelta import parse_timespan
import os
import logging

config = Config(RepositoryEnv("local.env"))

if os.getenv("ENVIRONMENT") == "STAGE":
    config = Config(RepositoryEnv("stage.env"))

if os.getenv("ENVIRONMENT") == "PRODUCTION":
    config = Config(RepositoryEnv("production.env"))

CORS_ORIGIN = config.get("CORS_ORIGIN", default="*")
MONGO_URI = config.get("MONGO_URI")
PORT = config.get("PORT", default=5000, cast=int)

ASTRA_DB_SECRET_KEY = config.get("ASTRA_DB_SECRET_KEY", cast=str)
ASTRA_DB_ENDPOINT = config.get("ASTRA_DB_ENDPOINT", cast=str)
ASTRA_DB_KEYSPACE = config.get("ASTRA_DB_KEYSPACE", cast=str)
GEMINI_API_KEY = config.get("GEMINI_API_KEY", cast=str)

__access_public_key_path = os.path.join(
    os.path.dirname(__file__), "../private/auth_public_key.pem"
)

JWT_ACCESS_KEY_PUBLIC = open(__access_public_key_path, "rb").read()

HMAC_AGENT_KEY = config.get("HMAC_AGENT_KEY", cast=str)
HMAC_USER_KEY = config.get("HMAC_USER_KEY", cast=str)

API_HOST = config.get("API_HOST", cast=str)
USER_HOST = config.get("USER_HOST", cast=str)
FRONT_HOST = config.get("FRONT_HOST", cast=str)
