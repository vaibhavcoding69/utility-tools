from fastapi import APIRouter

from app.api import developer, security, data, media, productivity

api_router = APIRouter()

api_router.include_router(developer.router, prefix="/developer", tags=["developer"])
api_router.include_router(security.router, prefix="/security", tags=["security"])
api_router.include_router(data.router, prefix="/data", tags=["data"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(productivity.router, prefix="/productivity", tags=["productivity"])
