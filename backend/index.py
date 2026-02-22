import sys
from pathlib import Path

current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import (
    APP_TITLE, APP_VERSION, APP_DESCRIPTION,
    CORS_ORIGINS, CORS_ALLOW_CREDENTIALS, CORS_ALLOW_METHODS, CORS_ALLOW_HEADERS
)
from app.utils import save_usage_stats, increment_request_count, increment_tool_usage, get_tool_key_from_path
from app.api import health, developer, security, data
from fastapi.responses import RedirectResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    save_usage_stats()

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_ALLOW_METHODS,
    allow_headers=CORS_ALLOW_HEADERS,
)

app.include_router(health)
app.include_router(developer, prefix="/api/developer")
app.include_router(security, prefix="/api/security")
app.include_router(data, prefix="/api/data")

@app.get("/u/{slug}")
async def redirect_short_url(slug: str):
    from app.api.security import url_store
    if slug in url_store:
        return RedirectResponse(url=url_store[slug], status_code=301)
    return {"error": "Short URL not found", "status": 404}

@app.middleware("http")
async def track_usage(request: Request, call_next):
    response = await call_next(request)

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
