"""
Health and statistics routes for the Utility Tools API.

This module contains endpoints for health checks and usage statistics.
"""

from fastapi import APIRouter
from datetime import datetime, timezone

from ..utils import get_request_count, get_tool_usage

router = APIRouter()


@router.get("/")
async def root():
    """Get basic API information."""
    return {
        "name": "Utility Tools API",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/health")
async def health_check():
    """Check if the API is healthy and responding."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.get("/stats/requests")
async def get_request_stats():
    """Get total request count for metrics display."""
    return {
        "success": True,
        "count": get_request_count()
    }


@router.get("/stats/tools")
async def get_tool_stats(limit: int = 6):
    """Get most used tools for the dashboard."""
    return {
        "success": True,
        "tools": get_tool_usage(limit)
    }