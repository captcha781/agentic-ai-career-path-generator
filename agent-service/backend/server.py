import uvicorn

from backend.config.main import PORT

def start_server():
    uvicorn.run(
        "backend.app:app",
        host="0.0.0.0",
        port=PORT,
        reload=True,
    )


if __name__ == "__main__":
    start_server()