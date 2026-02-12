from fastapi import APIRouter

from app.api import developer, security, data

api_router = APIRouter()

api_router.include_router(developer, prefix="/developer", tags=["developer"])
api_router.include_router(security, prefix="/security", tags=["security"])
api_router.include_router(data, prefix="/data", tags=["data"])
