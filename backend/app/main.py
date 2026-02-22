from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import RedirectResponse

from app.api.router import api_router

app = FastAPI(title="Utility Tools API", version="1.0.0")

request_count = 0


class RequestCounterMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        global request_count
        if request.url.path.startswith("/api/v1"):
            request_count += 1
        response = await call_next(request)
        return response


app.add_middleware(RequestCounterMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"name": "Utility Tools API", "version": "1.0.0", "status": "active"}


@app.get("/api/v1/stats/requests")
async def get_request_count():
    return {"count": request_count}


@app.get("/u/{slug}")
async def redirect_short_url(slug: str):
    from app.api.security import url_store
    
    if slug in url_store:
        return RedirectResponse(url=url_store[slug], status_code=301)
    else:
        return {"error": "Short URL not found", "status": 404}
