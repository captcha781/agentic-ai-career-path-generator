import requests
import json

from backend.utils.create_signature import create_hmac_signature
from backend.config import main as config

def update_career_path(data, id):
    try:
        body = data
        signature_data = create_hmac_signature(body=body, mode="body")
        headers = {
            "Content-Type": "application/json",
            "PENTE-SIGNATURE": signature_data["signature"],
            "PENTE-TIMESTAMP": str(signature_data["timestamp"]),
            "PENTE-ORIGIN": "agent",
            "PENTE-VALIDATE": "body",
        }
        
        response = requests.post(
            f"{config.USER_HOST}/api/internal/update-career-path/{id}", headers=headers, json=body
        )
        parsed_response = response.json()
        
        return parsed_response
    except Exception as e:
        print(e)
        return {"success": False, "error": str(e)}