from fastapi import APIRouter
from datetime import datetime, timezone

from ..utils import get_request_count, get_tool_usage

router = APIRouter()

@router.get("/")
async def root():
    return {
        "name": "Utility Tools API",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/stats/requests")
async def get_request_stats():
    return {
        "success": True,
        "count": get_request_count()
    }

@router.get("/stats/tools")
async def get_tool_stats(limit: int = 6):
    return {
        "success": True,
        "tools": get_tool_usage(limit)
    }
