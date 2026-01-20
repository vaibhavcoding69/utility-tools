from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.router import api_router

app = FastAPI(title="z1x Utility Tools API", version="1.0.0")

# Request counter
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
    return {"name": "z1x Utility Tools API", "version": "1.0.0", "status": "active"}


@app.get("/api/v1/stats/requests")
async def get_request_count():
    return {"count": request_count}
