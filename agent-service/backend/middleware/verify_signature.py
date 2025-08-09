import hmac
import hashlib
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import json
import os

from backend.config import main as config

# Load your secrets (simulate config.HMAC_*_SECRET)
HMAC_SECRETS = {
    "agent": config.HMAC_AGENT_KEY,
    "user": config.HMAC_USER_KEY,
}

async def verify_signature(request: Request):
    headers = request.headers

    signature = headers.get("pente-signature")
    origin = headers.get("pente-origin")
    validate = headers.get("pente-validate")
    timestamp = headers.get("pente-timestamp")
    

    if not all([signature, origin, validate, timestamp]):
        raise HTTPException(status_code=403, detail="Signature Invalid")

    body_bytes = await request.body()
    try:
        body_json = json.loads(body_bytes.decode("utf-8"))
    except json.JSONDecodeError:
        body_json = {}

    query_params = dict(request.query_params)

    if validate == "query":
        validator = json.dumps(query_params, separators=(',', ':')) + timestamp
    elif validate == "both":
        validator = json.dumps(query_params, separators=(',', ':')) + json.dumps(body_json, separators=(',', ':')) + timestamp
    else:
        validator = json.dumps(body_json, separators=(',', ':')) + timestamp

    key = HMAC_SECRETS.get(origin)
    if not key:
        raise HTTPException(status_code=403, detail="Signature Invalid")

    generated_signature = hmac.new(
        key.encode("utf-8"),
        validator.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(generated_signature, signature):
        raise HTTPException(status_code=403, detail="Signature Invalid")
