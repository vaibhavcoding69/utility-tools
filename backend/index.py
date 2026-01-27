from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from pathlib import Path
from asyncio import Lock
import json
import base64
import hashlib
import secrets
import string
import re
import uuid
import difflib
import csv
import io
import time
from datetime import datetime, timezone
from urllib.parse import quote, unquote

import pyotp
import sqlparse
from faker import Faker

app = FastAPI(title="z1x Utility Tools API", version="1.0.0")

USAGE_FILE = Path(__file__).resolve().parent / "usage_stats.json"
USAGE_LOCK = Lock()
REQUEST_COUNT = 0
TOOL_USAGE: Dict[str, int] = {}

TOOL_PATH_MAP: Dict[str, str] = {
    "/api/developer/json/format": "json",
    "/api/developer/json/minify": "json",
    "/api/developer/base64/encode": "base64",
    "/api/developer/base64/decode": "base64",
    "/api/developer/url/encode": "url",
    "/api/developer/url/decode": "url",
    "/api/developer/regex/test": "regex",
    "/api/developer/uuid/generate": "uuid",
    "/api/developer/diff": "diff",
    "/api/developer/jwt/decode": "jwt",
    "/api/security/hash/generate": "hash",
    "/api/security/hash/all": "hash",
    "/api/security/password/generate": "password",
    "/api/security/password/strength": "password",
    "/api/security/otp/generate": "totp",
    "/api/data/csv-to-json": "csv-to-json",
    "/api/data/json-to-csv": "json-to-csv",
    "/api/data/sql/format": "sql",
    "/api/data/fake/generate": "fake-data",
    "/api/data/base/convert": "base-converter",
    "/api/data/text/word-count": "text-stats",
    "/api/data/text/case-convert": "case-converter",
}


def _load_usage() -> None:
    global REQUEST_COUNT, TOOL_USAGE
    if not USAGE_FILE.exists():
        REQUEST_COUNT = 0
        TOOL_USAGE = {}
        return
    try:
        payload = json.loads(USAGE_FILE.read_text(encoding="utf-8"))
        REQUEST_COUNT = int(payload.get("total", 0))
        TOOL_USAGE = {
            key: int(value)
            for key, value in (payload.get("tools", {}) or {}).items()
            if isinstance(key, str)
        }
    except Exception:
        REQUEST_COUNT = 0
        TOOL_USAGE = {}


def _save_usage() -> None:
    payload = {"total": REQUEST_COUNT, "tools": TOOL_USAGE}
    USAGE_FILE.write_text(json.dumps(payload, indent=2), encoding="utf-8")


_load_usage()


@app.middleware("http")
async def track_requests(request, call_next):
    global REQUEST_COUNT
    response = await call_next(request)

    path = request.url.path
    if path.startswith("/api/"):
        tool_key = TOOL_PATH_MAP.get(path)
        async with USAGE_LOCK:
            REQUEST_COUNT += 1
            if tool_key:
                TOOL_USAGE[tool_key] = TOOL_USAGE.get(tool_key, 0) + 1
                _save_usage()

    return response

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Models ====================


class JsonFormatRequest(BaseModel):
    data: str
    indent: Optional[int] = 2
    sort_keys: Optional[bool] = False


class Base64Request(BaseModel):
    data: str


class UrlRequest(BaseModel):
    data: str


class HashRequest(BaseModel):
    data: str
    algorithm: Optional[str] = "sha256"


class PasswordGenerateRequest(BaseModel):
    length: Optional[int] = 16
    include_uppercase: Optional[bool] = True
    include_lowercase: Optional[bool] = True
    include_numbers: Optional[bool] = True
    include_symbols: Optional[bool] = True


class PasswordStrengthRequest(BaseModel):
    password: Optional[str] = None
    data: Optional[str] = None


class RegexTestRequest(BaseModel):
    pattern: str
    text: str
    flags: Optional[str] = ""


class DiffRequest(BaseModel):
    original: str
    modified: str
    context_lines: Optional[int] = 3


class JwtDecodeRequest(BaseModel):
    token: str


class CsvRequest(BaseModel):
    data: str


class JsonToCsvRequest(BaseModel):
    data: str


class SqlFormatRequest(BaseModel):
    data: str


class FakeDataRequest(BaseModel):
    data_type: str = "person"
    count: int = 5
    locale: str = "en_US"


class BaseConvertRequest(BaseModel):
    value: str
    from_base: int
    to_base: int


class TotpRequest(BaseModel):
    secret: Optional[str] = None
    digits: Optional[int] = 6
    period: Optional[int] = 30


faker = Faker()

# ==================== Routes ====================


@app.get("/")
async def root():
    return {
        "name": "z1x Utility Tools API",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/api/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/stats/requests")
async def stats_requests():
    """Return a simple rolling request count for the hero metrics."""
    global REQUEST_COUNT
    return {"success": True, "count": REQUEST_COUNT}


@app.get("/api/stats/tools")
async def stats_tools(limit: int = 6):
    """Return most-used tools for the home command dock."""
    safe_limit = max(1, min(limit, 20))
    sorted_tools = sorted(TOOL_USAGE.items(), key=lambda item: item[1], reverse=True)
    top_tools = [
        {"id": tool_id, "count": count}
        for tool_id, count in sorted_tools[:safe_limit]
    ]
    return {"success": True, "tools": top_tools}


# ==================== Developer Tools ====================


@app.post("/api/developer/json/format")
async def format_json(request: JsonFormatRequest):
    """Format and validate JSON data"""
    try:
        parsed = json.loads(request.data)
        separators = (",", ":") if request.indent == 0 else None
        formatted = json.dumps(
            parsed,
            indent=None if request.indent == 0 else request.indent,
            separators=separators,
            sort_keys=request.sort_keys,
            ensure_ascii=False,
        )
        return {"success": True, "formatted": formatted, "valid": True}
    except json.JSONDecodeError as e:
        return {"success": False, "error": str(e), "valid": False}


@app.post("/api/developer/json/minify")
async def minify_json(request: JsonFormatRequest):
    """Minify JSON data"""
    try:
        parsed = json.loads(request.data)
        minified = json.dumps(parsed, separators=(",", ":"), ensure_ascii=False)
        return {"success": True, "minified": minified, "valid": True}
    except json.JSONDecodeError as e:
        return {"success": False, "error": str(e), "valid": False}


@app.post("/api/developer/base64/encode")
async def encode_base64(request: Base64Request):
    """Encode string to base64"""
    try:
        encoded = base64.b64encode(request.data.encode("utf-8")).decode("utf-8")
        return {"success": True, "encoded": encoded}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/developer/url/encode")
async def encode_url(request: UrlRequest):
    try:
        encoded = quote(request.data, safe="")
        return {"success": True, "encoded": encoded}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/developer/url/decode")
async def decode_url(request: UrlRequest):
    try:
        decoded = unquote(request.data)
        return {"success": True, "decoded": decoded}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/developer/base64/decode")
async def decode_base64(request: Base64Request):
    """Decode base64 string"""
    try:
        decoded = base64.b64decode(request.data).decode("utf-8")
        return {"success": True, "decoded": decoded}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/developer/regex/test")
async def test_regex(request: RegexTestRequest):
    """Test regular expression against text"""
    try:
        flags_int = 0
        if "i" in request.flags:
            flags_int |= re.IGNORECASE
        if "m" in request.flags:
            flags_int |= re.MULTILINE
        if "s" in request.flags:
            flags_int |= re.DOTALL

        pattern = re.compile(request.pattern, flags_int)
        matches = list(pattern.finditer(request.text))

        positions = [
            {"match": m.group(0), "start": m.start(), "end": m.end()} for m in matches
        ]
        groups: List[str] = (
            list(matches[0].groups()) if matches and matches[0].groups() else []
        )

        return {
            "success": True,
            "matches": bool(matches),
            "match_count": len(matches),
            "groups": groups,
            "positions": positions,
        }
    except re.error as e:
        return {
            "success": False,
            "error": str(e),
            "matches": False,
            "match_count": 0,
            "groups": [],
            "positions": [],
        }


@app.get("/api/developer/uuid/generate")
async def generate_uuid(version: int = 4, count: int = 1):
    """Generate one or more UUIDs"""
    count = max(1, min(count, 100))
    uuids: List[uuid.UUID] = []
    for _ in range(count):
        if version == 1:
            uuids.append(uuid.uuid1())
        else:
            uuids.append(uuid.uuid4())

    if count == 1:
        return {"success": True, "uuid": str(uuids[0])}
    return {"success": True, "uuids": [str(u) for u in uuids]}


@app.post("/api/developer/diff")
async def diff_text(request: DiffRequest):
    """Return unified diff and stats between two texts"""
    diff_lines = list(
        difflib.unified_diff(
            request.original.splitlines(),
            request.modified.splitlines(),
            lineterm="",
            n=request.context_lines,
        )
    )

    additions = sum(
        1 for line in diff_lines if line.startswith("+") and not line.startswith("+++")
    )
    deletions = sum(
        1 for line in diff_lines if line.startswith("-") and not line.startswith("---")
    )
    return {
        "success": True,
        "unified_diff": "\n".join(diff_lines),
        "stats": {
            "additions": additions,
            "deletions": deletions,
            "changes": additions + deletions,
        },
    }


def _b64url_decode(segment: str) -> bytes:
    padding = "=" * (-len(segment) % 4)
    return base64.urlsafe_b64decode(segment + padding)


@app.post("/api/developer/jwt/decode")
async def decode_jwt(request: JwtDecodeRequest):
    parts = request.token.split(".")
    if len(parts) != 3:
        raise HTTPException(status_code=400, detail="Invalid JWT format")

    try:
        header = json.loads(_b64url_decode(parts[0]).decode("utf-8"))
        payload = json.loads(_b64url_decode(parts[1]).decode("utf-8"))
        signature = parts[2]
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Unable to decode JWT: {exc}")

    exp_ts = payload.get("exp")
    exp_date = None
    expired = None
    if exp_ts is not None:
        try:
            exp_date = datetime.fromtimestamp(int(exp_ts), tz=timezone.utc).isoformat()
            expired = datetime.now(tz=timezone.utc).timestamp() > int(exp_ts)
        except Exception:
            expired = None

    return {
        "success": True,
        "header": header,
        "payload": payload,
        "signature": signature,
        "expired": expired,
        "exp_date": exp_date,
    }


# ==================== Security Tools ====================


@app.post("/api/security/hash/generate")
async def generate_hash(request: HashRequest):
    """Generate hash of input data"""
    try:
        algorithms = {
            "md5": hashlib.md5,
            "sha1": hashlib.sha1,
            "sha256": hashlib.sha256,
            "sha384": hashlib.sha384,
            "sha512": hashlib.sha512,
            "blake2b": hashlib.blake2b,
            "blake2s": hashlib.blake2s,
        }

        if request.algorithm not in algorithms:
            raise HTTPException(
                status_code=400, detail=f"Unsupported algorithm: {request.algorithm}"
            )

        hash_func = algorithms[request.algorithm]
        hash_value = hash_func(request.data.encode("utf-8")).hexdigest()

        return {"success": True, "hash": hash_value, "algorithm": request.algorithm}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/security/hash/all")
async def generate_all_hashes(request: Base64Request):
    try:
        algorithms = {
            "md5": hashlib.md5,
            "sha1": hashlib.sha1,
            "sha256": hashlib.sha256,
            "sha384": hashlib.sha384,
            "sha512": hashlib.sha512,
            "blake2b": hashlib.blake2b,
            "blake2s": hashlib.blake2s,
        }

        hashes = {
            name: func(request.data.encode("utf-8")).hexdigest()
            for name, func in algorithms.items()
        }
        return {"success": True, "hashes": hashes}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/security/password/generate")
async def generate_password(request: PasswordGenerateRequest):
    """Generate a secure random password"""
    try:
        chars = ""
        if request.include_lowercase:
            chars += string.ascii_lowercase
        if request.include_uppercase:
            chars += string.ascii_uppercase
        if request.include_numbers:
            chars += string.digits
        if request.include_symbols:
            chars += string.punctuation

        if not chars:
            raise HTTPException(
                status_code=400, detail="At least one character type must be selected"
            )

        password = "".join(secrets.choice(chars) for _ in range(request.length))

        return {"success": True, "password": password, "length": len(password)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/security/password/strength")
async def check_password_strength(request: PasswordStrengthRequest):
    """Check password strength"""
    password = request.password or request.data
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")
    strength = 0
    feedback = []

    # Length check
    if len(password) >= 8:
        strength += 1
    else:
        feedback.append("Password should be at least 8 characters long")

    if len(password) >= 12:
        strength += 1

    # Character variety checks
    if re.search(r"[a-z]", password):
        strength += 1
    else:
        feedback.append("Add lowercase letters")

    if re.search(r"[A-Z]", password):
        strength += 1
    else:
        feedback.append("Add uppercase letters")

    if re.search(r"\d", password):
        strength += 1
    else:
        feedback.append("Add numbers")

    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        strength += 1
    else:
        feedback.append("Add special characters")

    # Determine strength level
    if strength <= 2:
        level = "weak"
    elif strength <= 4:
        level = "medium"
    else:
        level = "strong"

    return {
        "success": True,
        "strength": level,
        "score": strength,
        "max_score": 6,
        "feedback": feedback,
    }


@app.post("/api/security/otp/generate")
async def generate_totp(request: TotpRequest):
    """Generate TOTP codes and provisioning data"""
    secret = request.secret or pyotp.random_base32()
    totp = pyotp.TOTP(secret, digits=request.digits or 6, interval=request.period or 30)
    code = totp.now()
    period = request.period or 30
    time_remaining = period - (int(time.time()) % period)
    provisioning_uri = totp.provisioning_uri(
        name="user@example.com", issuer_name="UtilityTools"
    )

    return {
        "success": True,
        "secret": secret,
        "current_code": code,
        "time_remaining": time_remaining,
        "provisioning_uri": provisioning_uri,
    }


# ==================== Data Tools ====================


@app.post("/api/data/csv-to-json")
async def csv_to_json(request: CsvRequest):
    try:
        reader = csv.DictReader(io.StringIO(request.data))
        rows = list(reader)
        return {
            "success": True,
            "data": rows,
            "json": json.dumps(rows, ensure_ascii=False, indent=2),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/data/json-to-csv")
async def json_to_csv(request: JsonToCsvRequest):
    try:
        parsed = json.loads(request.data)
        if isinstance(parsed, dict):
            parsed = [parsed]
        if not isinstance(parsed, list):
            raise HTTPException(
                status_code=400,
                detail="JSON input must be an object or array of objects",
            )

        fieldnames = set()
        for item in parsed:
            if isinstance(item, dict):
                fieldnames.update(item.keys())
        field_list = sorted(fieldnames)
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=field_list)
        writer.writeheader()
        for item in parsed:
            if not isinstance(item, dict):
                raise HTTPException(status_code=400, detail="All items must be objects")
            writer.writerow({k: item.get(k, "") for k in field_list})

        return {"success": True, "csv": output.getvalue()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/data/sql/format")
async def format_sql(request: SqlFormatRequest):
    try:
        formatted = sqlparse.format(request.data, reindent=True, keyword_case="upper")
        return {"success": True, "formatted": formatted}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/data/fake/generate")
async def generate_fake_data(request: FakeDataRequest):
    faker_localized = Faker(request.locale)

    def generate_item(data_type: str) -> Any:
        if data_type == "person":
            return {
                "name": faker_localized.name(),
                "email": faker_localized.email(),
                "job": faker_localized.job(),
            }
        if data_type == "address":
            return {
                "street": faker_localized.street_address(),
                "city": faker_localized.city(),
                "country": faker_localized.country(),
                "postcode": faker_localized.postcode(),
            }
        if data_type == "company":
            return {
                "company": faker_localized.company(),
                "catch_phrase": faker_localized.catch_phrase(),
                "website": faker_localized.domain_name(),
            }
        if data_type == "email":
            return faker_localized.email()
        if data_type == "phone":
            return faker_localized.phone_number()
        if data_type == "date":
            return str(faker_localized.date())
        if data_type == "text":
            return faker_localized.paragraph(nb_sentences=3)
        return faker_localized.word()

    try:
        count = max(1, min(request.count, 100))
        data = [generate_item(request.data_type) for _ in range(count)]
        return {"success": True, "data": data, "rows": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/data/base/convert")
async def convert_base(request: BaseConvertRequest):
    try:
        number = int(request.value, request.from_base)
        digits = "0123456789abcdefghijklmnopqrstuvwxyz"

        def to_base(n: int, base: int) -> str:
            if n == 0:
                return "0"
            res = ""
            while n > 0:
                n, rem = divmod(n, base)
                res = digits[rem] + res
            return res

        converted = to_base(number, request.to_base)
        return {"success": True, "result": converted, "value": converted}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/data/text/word-count")
async def word_count(request: Base64Request):
    """Count words, characters, and lines in text"""
    text = request.data
    words = len(text.split())
    chars = len(text)
    chars_no_spaces = len(text.replace(" ", "").replace("\n", "").replace("\t", ""))
    lines = len(text.split("\n"))

    return {
        "success": True,
        "words": words,
        "characters": chars,
        "characters_no_spaces": chars_no_spaces,
        "lines": lines,
    }


@app.post("/api/data/text/case-convert")
async def convert_case(request: Base64Request):
    """Convert text case to various formats"""
    text = request.data

    return {
        "success": True,
        "uppercase": text.upper(),
        "lowercase": text.lower(),
        "title_case": text.title(),
        "sentence_case": text.capitalize(),
        "snake_case": text.lower().replace(" ", "_"),
        "kebab_case": text.lower().replace(" ", "-"),
        "camel_case": "".join(word.capitalize() for word in text.split()),
    }


# For Vercel serverless deployment
handler = app
