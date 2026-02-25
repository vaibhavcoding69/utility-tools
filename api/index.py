import sys
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

# Add the root directory to the path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))
sys.path.insert(0, str(root_dir / "backend"))

# Now import the routers
try:
    from app.config import (
        APP_TITLE, APP_VERSION, APP_DESCRIPTION,
        CORS_ORIGINS, CORS_ALLOW_CREDENTIALS, CORS_ALLOW_METHODS, CORS_ALLOW_HEADERS
    )
    from app.utils import save_usage_stats, increment_request_count, increment_tool_usage, get_tool_key_from_path
    from app.api import health, developer, security, data
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Python path: {sys.path}")
    raise

# Create app with lifespan
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_ALLOW_METHODS,
    allow_headers=CORS_ALLOW_HEADERS,
)

# Include API routers
app.include_router(health, prefix="/api")
app.include_router(developer, prefix="/api/developer")
app.include_router(security, prefix="/api/security")
app.include_router(data, prefix="/api/data")

# Short URL redirect route
@app.get("/u/{slug}")
async def redirect_short_url(slug: str):
    from app.api.security import url_store
    if slug in url_store:
        return RedirectResponse(url=url_store[slug], status_code=301)
    return {"error": "Short URL not found", "status": 404}

# Usage tracking middleware
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

# Serve static files from frontend build (ensure dist is present)
static_dir = root_dir / "api" / "dist"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")


