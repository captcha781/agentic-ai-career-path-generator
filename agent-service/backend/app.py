import logging
from fastapi import FastAPI, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import (
    RequestValidationError,
    ValidationException,
    HTTPException,
)

from backend.config.lifespan import lifespan
from backend.config import main as config
from backend.routes.index import router as index
from backend.utils.pydanticToFormError import pydantic_to_form_error

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    lifespan=lifespan,
    title="Pente AI - Assessment",
    description="Assessment for Pente AI",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={"name": "Bhuvaneshwaran S", "url": "https://github.com/captcha781"},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONT_HOST, config.USER_HOST],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_checker(request: Request, call_next):
    """To identify and log the incoming request body"""
    data = await request.body()
    logging.info(data)
    return await call_next(request)


@app.exception_handler(Exception)
async def catch_all_exception_handler(request: Request, exc: Exception):
    """To catch all exceptions and return a JSON response, This preserves the server process from termination"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "message": "Internal Server Error"},
    )


@app.exception_handler(HTTPException)
async def catch_all_http_exceptions(request: Request, exc: HTTPException):
    """This catches all the HTTP based exception raised from HTTPException"""
    return JSONResponse(
        exc.detail,
        status_code=exc.status_code,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: ValidationException):
    """This catches all the validation errors raised from pydantic and makes into usable json for formik in frontend"""
    return JSONResponse(
        {"success": False, "errors": pydantic_to_form_error(exc.errors())},
        status_code=400,
    )


app.include_router(prefix="/api", router=index)
