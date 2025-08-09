from langchain_google_genai import ChatGoogleGenerativeAI
from backend.config import main as config

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-latest", google_api_key=config.GEMINI_API_KEY,
)
