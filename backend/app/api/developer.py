from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import base64
import json
import uuid
import re
import httpx
from difflib import unified_diff
from croniter import croniter
from datetime import datetime

class JsonPayload(BaseModel):
    data: str
    indent: int | None = 2
    sort_keys: bool | None = False

class TextPair(BaseModel):
    a: str
    b: str

class RegexPayload(BaseModel):
    pattern: str
    text: str
    flags: str | None = ""

class Base64Payload(BaseModel):
    data: str

class UrlPayload(BaseModel):
    data: str

class JWTPayload(BaseModel):
    token: str

class CronPayload(BaseModel):
    expression: str
    count: int = 5

class PingPayload(BaseModel):
    url: str

class GitPayload(BaseModel):
    action: str
    branch: str | None = None
    remote: str | None = "origin"
    message: str | None = None

router = APIRouter()

@router.post("/json/format")
async def format_json(payload: JsonPayload):
    try:
        obj = json.loads(payload.data)
        formatted = json.dumps(obj, indent=payload.indent, sort_keys=payload.sort_keys, ensure_ascii=False)
        return {"success": True, "formatted": formatted, "valid": True}
    except json.JSONDecodeError as e:
        return {"success": False, "error": str(e), "valid": False}

@router.post("/json/validate")
async def validate_json(payload: JsonPayload):
    try:
        json.loads(payload.data)
        return {"success": True, "valid": True}
    except json.JSONDecodeError as e:
        return {"success": False, "valid": False, "error": str(e)}

@router.post("/json-to-yaml")
async def json_to_yaml(payload: JsonPayload):
    try:
        import yaml
    except ImportError:
        raise HTTPException(status_code=500, detail="pyyaml not installed")
    try:
        obj = json.loads(payload.data)
        return {"success": True, "yaml": yaml.safe_dump(obj, sort_keys=payload.sort_keys, allow_unicode=True)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/yaml-to-json")
async def yaml_to_json(payload: Base64Payload):
    try:
        import yaml
    except ImportError:
        raise HTTPException(status_code=500, detail="pyyaml not installed")
    try:
        obj = yaml.safe_load(payload.data)
        return {"success": True, "json": json.dumps(obj, ensure_ascii=False)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/base64/encode")
async def b64_encode(payload: Base64Payload):
    try:
        encoded = base64.b64encode(payload.data.encode("utf-8")).decode("utf-8")
        return {"success": True, "encoded": encoded}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/base64/decode")
async def b64_decode(payload: Base64Payload):
    try:
        decoded = base64.b64decode(payload.data).decode("utf-8")
        return {"success": True, "decoded": decoded}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/url/encode")
async def url_encode(payload: UrlPayload):
    from urllib.parse import quote
    return {"success": True, "encoded": quote(payload.data)}

@router.post("/url/decode")
async def url_decode(payload: UrlPayload):
    from urllib.parse import unquote
    return {"success": True, "decoded": unquote(payload.data)}

@router.post("/regex/test")
async def regex_test(payload: RegexPayload):
    flags = 0
    if payload.flags:
        if "i" in payload.flags:
            flags |= re.IGNORECASE
        if "m" in payload.flags:
            flags |= re.MULTILINE
        if "s" in payload.flags:
            flags |= re.DOTALL
    try:
        pattern = re.compile(payload.pattern, flags)
    except re.error as e:
        return {"success": False, "error": str(e), "matches": [], "count": 0}
    matches = []
    for m in pattern.finditer(payload.text):
        matches.append({
            "match": m.group(0),
            "start": m.start(),
            "end": m.end(),
            "groups": m.groups()
        })
    return {"success": True, "matches": matches, "count": len(matches)}

@router.get("/uuid/generate")
async def uuid_generate():
    return {"success": True, "uuid": str(uuid.uuid4())}

@router.post("/diff")
async def text_diff(payload: TextPair):
    diff_lines = list(unified_diff(
        payload.a.splitlines(), payload.b.splitlines(), lineterm=""
    ))
    return {"success": True, "diff": "\n".join(diff_lines)}

@router.post("/beautify")
async def beautify(payload: JsonPayload):
    # Placeholder: reuse format_json
    return await format_json(payload)


@router.post("/jwt/decode")
async def jwt_decode(payload: JWTPayload):
    try:
        parts = payload.token.split(".")
        if len(parts) < 2:
            raise ValueError("Invalid JWT structure")
        header = json.loads(base64.urlsafe_b64decode(parts[0] + "=="))
        body = json.loads(base64.urlsafe_b64decode(parts[1] + "=="))
        return {"success": True, "header": header, "payload": body}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/cron/next")
async def cron_next(payload: CronPayload):
    try:
        now = datetime.utcnow()
        itr = croniter(payload.expression, now)
        times = [itr.get_next(datetime).isoformat() for _ in range(max(1, min(payload.count, 20)))]
        return {"success": True, "next": times}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/http/ping")
async def http_ping(payload: PingPayload):
    try:
        start = datetime.utcnow()
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(payload.url)
        elapsed = (datetime.utcnow() - start).total_seconds() * 1000
        return {
            "success": True,
            "status": resp.status_code,
            "ms": round(elapsed, 2),
            "headers": dict(resp.headers),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/git/generate")
async def git_generate(payload: GitPayload):
    action = payload.action.lower()
    branch = payload.branch or "main"
    remote = payload.remote or "origin"
    msg = payload.message or "update"
    commands = {
        "init": "git init && git add . && git commit -m \"initial commit\"",
        "clone": f"git clone {remote}",
        "commit": f"git add . && git commit -m \"{msg}\"",
        "push": f"git push {remote} {branch}",
        "pull": f"git pull {remote} {branch}",
        "checkout": f"git checkout {branch}",
        "branch": f"git checkout -b {branch}",
    }
    if action not in commands:
        raise HTTPException(status_code=400, detail="Unsupported git action")
    return {"success": True, "command": commands[action]}
