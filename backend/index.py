"""
Main FastAPI application for Utility Tools.

This is the entry point for the Utility Tools API, bringing together all
the route modules and middleware configuration.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import (
    APP_TITLE, APP_VERSION, APP_DESCRIPTION,
    CORS_ORIGINS, CORS_ALLOW_CREDENTIALS, CORS_ALLOW_METHODS, CORS_ALLOW_HEADERS
)
from app.utils import save_usage_stats, increment_request_count, increment_tool_usage, get_tool_key_from_path
from app.api import health, developer, security, data


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events."""
    # Startup
    yield
    # Shutdown - save usage stats
    save_usage_stats()


# Create FastAPI app
app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_ALLOW_METHODS,
    allow_headers=CORS_ALLOW_HEADERS,
)

# Include route modules
app.include_router(health.router)
app.include_router(developer.router, prefix="/api")
app.include_router(security.router, prefix="/api")
app.include_router(data.router, prefix="/api")


@app.middleware("http")
async def track_usage(request: Request, call_next):
    """Middleware to track API usage statistics."""
    response = await call_next(request)

    # Track usage for API endpoints
    path = request.url.path
    if path.startswith("/api/"):
        increment_request_count()

        tool_key = get_tool_key_from_path(path)
        if tool_key:
            increment_tool_usage(tool_key)

    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "index:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
