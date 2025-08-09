import logging
from jose import jwt, JWTError
from typing import Annotated
from cryptography.hazmat.primitives import serialization
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from pydantic import BaseModel
from cryptography.hazmat.backends import default_backend

from backend.config import main

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class TokenData(BaseModel):
    sessionId: str
    userId: str
    mode: str = ""


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def verify_access_token(token: str) -> dict:
    try:
        public_key = serialization.load_pem_public_key(
            main.JWT_ACCESS_KEY_PUBLIC, backend=default_backend()
        )

        public_key_pem_decrypted = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
        )

        payload = jwt.decode(
            token, public_key_pem_decrypted.decode("utf-8"), algorithms=["RS256"]
        )

        if payload.get("mode") != "active":
            logging.error("Unauthorized 401, Invalid mode")
            raise credentials_exception

        return payload
    except JWTError as e:
        print(e)
        logging.error(e)
        raise credentials_exception


async def get_current_user_access(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> TokenData:
    return await verify_access_token(token)
