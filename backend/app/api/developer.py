"""
Developer Tools API
Comprehensive endpoints for developer utilities including JSON/YAML manipulation,
encoding/decoding, regex testing, UUID generation, JWT inspection, and more.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Any
import base64
import json
import uuid
import re
import hashlib
import html
import urllib.parse
from datetime import datetime, timedelta
from difflib import unified_diff, HtmlDiff

# ============================================================================
# Pydantic Models
# ============================================================================

class JsonPayload(BaseModel):
    """Payload for JSON operations"""
    data: str = Field(..., description="JSON string to process")
    indent: Optional[int] = Field(2, description="Indentation level for formatting")
    sort_keys: Optional[bool] = Field(False, description="Sort object keys alphabetically")


class YamlPayload(BaseModel):
    """Payload for YAML operations"""
    data: str = Field(..., description="YAML or JSON string")


class TextPayload(BaseModel):
    """Generic text payload"""
    data: str = Field(..., description="Text data to process")


class TextPair(BaseModel):
    """Two text strings for comparison"""
    a: str = Field(..., description="First text")
    b: str = Field(..., description="Second text")
    context_lines: Optional[int] = Field(3, description="Context lines for diff")


class RegexPayload(BaseModel):
    """Payload for regex testing"""
    pattern: str = Field(..., description="Regular expression pattern")
    text: str = Field(..., description="Text to search")
    flags: Optional[str] = Field("", description="Regex flags: i=ignore case, m=multiline, s=dotall")
    replace_with: Optional[str] = Field(None, description="Replacement string for substitution")


class Base64Payload(BaseModel):
    """Payload for Base64 operations"""
    data: str = Field(..., description="Data to encode/decode")
    url_safe: Optional[bool] = Field(False, description="Use URL-safe Base64")


class UrlPayload(BaseModel):
    """Payload for URL operations"""
    data: str = Field(..., description="URL or string to encode/decode")


class JWTPayload(BaseModel):
    """Payload for JWT operations"""
    token: str = Field(..., description="JWT token to decode")


class CronPayload(BaseModel):
    """Payload for cron expression parsing"""
    expression: str = Field(..., description="Cron expression (5 or 6 fields)")
    count: Optional[int] = Field(5, description="Number of next run times to return")


class HttpPingPayload(BaseModel):
    """Payload for HTTP ping/timing"""
    url: str = Field(..., description="URL to ping")
    method: Optional[str] = Field("GET", description="HTTP method")
    timeout: Optional[float] = Field(10.0, description="Request timeout in seconds")


class GitCommandPayload(BaseModel):
    """Payload for git command generation"""
    action: str = Field(..., description="Git action: init, clone, commit, push, pull, branch, merge, rebase, stash, tag")
    branch: Optional[str] = Field(None, description="Branch name")
    remote: Optional[str] = Field("origin", description="Remote name")
    message: Optional[str] = Field(None, description="Commit message")
    tag_name: Optional[str] = Field(None, description="Tag name for tag operations")


class LoremIpsumPayload(BaseModel):
    """Payload for lorem ipsum generation"""
    paragraphs: Optional[int] = Field(3, description="Number of paragraphs")
    words_per_paragraph: Optional[int] = Field(50, description="Approximate words per paragraph")


class TimestampPayload(BaseModel):
    """Payload for timestamp conversion"""
    value: str = Field(..., description="Timestamp value (unix seconds/ms or ISO string)")
    from_format: Optional[str] = Field("auto", description="Input format: auto, unix, unix_ms, iso")
    to_format: Optional[str] = Field("all", description="Output format: unix, unix_ms, iso, all")


class HtmlPayload(BaseModel):
    """Payload for HTML operations"""
    data: str = Field(..., description="HTML or text to process")


class CodeBeautifyPayload(BaseModel):
    """Payload for code beautification"""
    code: str = Field(..., description="Code to beautify")
    language: str = Field("json", description="Language: json, html, css, sql, xml")
    indent: Optional[int] = Field(2, description="Indentation spaces")


class SlugPayload(BaseModel):
    """Payload for slug generation"""
    text: str = Field(..., description="Text to convert to slug")
    separator: Optional[str] = Field("-", description="Word separator")
    lowercase: Optional[bool] = Field(True, description="Convert to lowercase")


class NumberBasePayload(BaseModel):
    """Payload for number base conversion"""
    value: str = Field(..., description="Number value as string")
    from_base: int = Field(..., description="Source base (2-36)")
    to_base: int = Field(..., description="Target base (2-36)")


# ============================================================================
# Router
# ============================================================================

router = APIRouter()


# ============================================================================
# JSON Endpoints
# ============================================================================

@router.post("/json/format", summary="Format JSON", description="Pretty-print and format JSON data")
async def format_json(payload: JsonPayload):
    """Format JSON with configurable indentation and key sorting."""
    try:
        obj = json.loads(payload.data)
        formatted = json.dumps(
            obj,
            indent=payload.indent,
            sort_keys=payload.sort_keys,
            ensure_ascii=False
        )
        return {
            "success": True,
            "formatted": formatted,
            "valid": True,
            "stats": {
                "original_length": len(payload.data),
                "formatted_length": len(formatted),
                "keys_count": count_keys(obj) if isinstance(obj, dict) else None,
                "depth": get_json_depth(obj)
            }
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": str(e),
            "valid": False,
            "error_position": {"line": e.lineno, "column": e.colno}
        }


@router.post("/json/validate", summary="Validate JSON", description="Check if a string is valid JSON")
async def validate_json(payload: JsonPayload):
    """Validate JSON syntax and return structure information."""
    try:
        obj = json.loads(payload.data)
        return {
            "success": True,
            "valid": True,
            "type": type(obj).__name__,
            "stats": {
                "keys_count": count_keys(obj) if isinstance(obj, dict) else None,
                "array_length": len(obj) if isinstance(obj, list) else None,
                "depth": get_json_depth(obj)
            }
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "valid": False,
            "error": str(e),
            "error_position": {"line": e.lineno, "column": e.colno}
        }


@router.post("/json/minify", summary="Minify JSON", description="Remove whitespace from JSON")
async def minify_json(payload: JsonPayload):
    """Minify JSON by removing all unnecessary whitespace."""
    try:
        obj = json.loads(payload.data)
        minified = json.dumps(obj, separators=(',', ':'), ensure_ascii=False)
        return {
            "success": True,
            "minified": minified,
            "stats": {
                "original_length": len(payload.data),
                "minified_length": len(minified),
                "reduction_percent": round((1 - len(minified) / len(payload.data)) * 100, 2)
            }
        }
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/json/query", summary="Query JSON", description="Query JSON using dot notation path")
async def query_json(payload: JsonPayload, path: str = Query(..., description="Dot notation path like 'users.0.name'")):
    """Query JSON data using dot notation path."""
    try:
        obj = json.loads(payload.data)
        result = navigate_json_path(obj, path)
        return {"success": True, "result": result, "path": path}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# YAML Endpoints
# ============================================================================

@router.post("/yaml/to-json", summary="YAML to JSON", description="Convert YAML to JSON format")
async def yaml_to_json(payload: YamlPayload):
    """Convert YAML string to JSON."""
    try:
        import yaml
    except ImportError:
        raise HTTPException(status_code=500, detail="PyYAML not installed")
    try:
        obj = yaml.safe_load(payload.data)
        json_str = json.dumps(obj, indent=2, ensure_ascii=False)
        return {"success": True, "json": json_str}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/json/to-yaml", summary="JSON to YAML", description="Convert JSON to YAML format")
async def json_to_yaml(payload: JsonPayload):
    """Convert JSON string to YAML."""
    try:
        import yaml
    except ImportError:
        raise HTTPException(status_code=500, detail="PyYAML not installed")
    try:
        obj = json.loads(payload.data)
        yaml_str = yaml.safe_dump(obj, sort_keys=payload.sort_keys, allow_unicode=True, default_flow_style=False)
        return {"success": True, "yaml": yaml_str}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# Encoding/Decoding Endpoints
# ============================================================================

@router.post("/base64/encode", summary="Base64 Encode", description="Encode text to Base64")
async def base64_encode(payload: Base64Payload):
    """Encode string to Base64 with optional URL-safe encoding."""
    try:
        data_bytes = payload.data.encode("utf-8")
        if payload.url_safe:
            encoded = base64.urlsafe_b64encode(data_bytes).decode("utf-8")
        else:
            encoded = base64.b64encode(data_bytes).decode("utf-8")
        return {
            "success": True,
            "encoded": encoded,
            "url_safe": payload.url_safe,
            "original_length": len(payload.data),
            "encoded_length": len(encoded)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/base64/decode", summary="Base64 Decode", description="Decode Base64 to text")
async def base64_decode(payload: Base64Payload):
    """Decode Base64 string to original text."""
    try:
        # Handle both standard and URL-safe Base64
        data = payload.data
        # Add padding if necessary
        padding = 4 - len(data) % 4
        if padding != 4:
            data += "=" * padding
        
        try:
            decoded = base64.urlsafe_b64decode(data).decode("utf-8")
        except:
            decoded = base64.b64decode(data).decode("utf-8")
        
        return {
            "success": True,
            "decoded": decoded,
            "encoded_length": len(payload.data),
            "decoded_length": len(decoded)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/url/encode", summary="URL Encode", description="URL encode a string")
async def url_encode(payload: UrlPayload):
    """URL encode a string for safe use in URLs."""
    encoded = urllib.parse.quote(payload.data, safe="")
    return {
        "success": True,
        "encoded": encoded,
        "original_length": len(payload.data),
        "encoded_length": len(encoded)
    }


@router.post("/url/decode", summary="URL Decode", description="URL decode a string")
async def url_decode(payload: UrlPayload):
    """Decode a URL-encoded string."""
    decoded = urllib.parse.unquote(payload.data)
    return {
        "success": True,
        "decoded": decoded,
        "encoded_length": len(payload.data),
        "decoded_length": len(decoded)
    }


@router.post("/html/encode", summary="HTML Encode", description="Encode special HTML characters")
async def html_encode(payload: HtmlPayload):
    """Encode special characters for safe HTML display."""
    encoded = html.escape(payload.data)
    return {"success": True, "encoded": encoded}


@router.post("/html/decode", summary="HTML Decode", description="Decode HTML entities")
async def html_decode(payload: HtmlPayload):
    """Decode HTML entities back to characters."""
    decoded = html.unescape(payload.data)
    return {"success": True, "decoded": decoded}


# ============================================================================
# Regex Endpoints
# ============================================================================

@router.post("/regex/test", summary="Test Regex", description="Test a regex pattern against text")
async def regex_test(payload: RegexPayload):
    """Test regex pattern and return all matches with positions."""
    flags = 0
    flag_descriptions = []
    if payload.flags:
        if "i" in payload.flags.lower():
            flags |= re.IGNORECASE
            flag_descriptions.append("IGNORECASE")
        if "m" in payload.flags.lower():
            flags |= re.MULTILINE
            flag_descriptions.append("MULTILINE")
        if "s" in payload.flags.lower():
            flags |= re.DOTALL
            flag_descriptions.append("DOTALL")
        if "x" in payload.flags.lower():
            flags |= re.VERBOSE
            flag_descriptions.append("VERBOSE")
    
    try:
        pattern = re.compile(payload.pattern, flags)
    except re.error as e:
        return {
            "success": False,
            "error": str(e),
            "error_position": e.pos if hasattr(e, 'pos') else None,
            "matches": [],
            "count": 0
        }
    
    matches = []
    for m in pattern.finditer(payload.text):
        match_data = {
            "match": m.group(0),
            "start": m.start(),
            "end": m.end(),
            "groups": list(m.groups()),
            "named_groups": m.groupdict() if m.groupdict() else None
        }
        matches.append(match_data)
    
    result = {
        "success": True,
        "matches": matches,
        "count": len(matches),
        "pattern": payload.pattern,
        "flags_applied": flag_descriptions
    }
    
    # Include replacement result if replace_with is provided
    if payload.replace_with is not None:
        replaced = pattern.sub(payload.replace_with, payload.text)
        result["replaced"] = replaced
        result["replacement_count"] = len(matches)
    
    return result


@router.post("/regex/replace", summary="Regex Replace", description="Replace text using regex pattern")
async def regex_replace(payload: RegexPayload):
    """Replace all matches of regex pattern with replacement string."""
    if payload.replace_with is None:
        raise HTTPException(status_code=400, detail="replace_with is required")
    
    flags = 0
    if payload.flags:
        if "i" in payload.flags.lower():
            flags |= re.IGNORECASE
        if "m" in payload.flags.lower():
            flags |= re.MULTILINE
        if "s" in payload.flags.lower():
            flags |= re.DOTALL
    
    try:
        pattern = re.compile(payload.pattern, flags)
        replaced, count = pattern.subn(payload.replace_with, payload.text)
        return {
            "success": True,
            "result": replaced,
            "replacements": count,
            "original_length": len(payload.text),
            "result_length": len(replaced)
        }
    except re.error as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# UUID Endpoints
# ============================================================================

@router.get("/uuid/generate", summary="Generate UUID", description="Generate a new UUID")
async def uuid_generate(
    version: int = Query(4, description="UUID version: 1, 4, or 5"),
    count: int = Query(1, description="Number of UUIDs to generate (max 100)"),
    namespace: Optional[str] = Query(None, description="Namespace for UUID5 (dns, url, oid, x500)"),
    name: Optional[str] = Query(None, description="Name for UUID5")
):
    """Generate one or more UUIDs of specified version."""
    count = min(count, 100)
    uuids = []
    
    for _ in range(count):
        if version == 1:
            new_uuid = str(uuid.uuid1())
        elif version == 4:
            new_uuid = str(uuid.uuid4())
        elif version == 5:
            if not name:
                raise HTTPException(status_code=400, detail="name required for UUID5")
            ns_map = {
                "dns": uuid.NAMESPACE_DNS,
                "url": uuid.NAMESPACE_URL,
                "oid": uuid.NAMESPACE_OID,
                "x500": uuid.NAMESPACE_X500
            }
            ns = ns_map.get(namespace, uuid.NAMESPACE_DNS)
            new_uuid = str(uuid.uuid5(ns, name))
        else:
            new_uuid = str(uuid.uuid4())
        uuids.append(new_uuid)
    
    if count == 1:
        return {"success": True, "uuid": uuids[0], "version": version}
    return {"success": True, "uuids": uuids, "count": len(uuids), "version": version}


@router.post("/uuid/validate", summary="Validate UUID", description="Check if string is valid UUID")
async def uuid_validate(payload: TextPayload):
    """Validate if a string is a properly formatted UUID."""
    try:
        parsed = uuid.UUID(payload.data)
        return {
            "success": True,
            "valid": True,
            "uuid": str(parsed),
            "version": parsed.version,
            "variant": str(parsed.variant)
        }
    except ValueError:
        return {"success": True, "valid": False, "error": "Invalid UUID format"}


# ============================================================================
# Diff Endpoints
# ============================================================================

@router.post("/diff/text", summary="Text Diff", description="Compare two texts and show differences")
async def text_diff(payload: TextPair):
    """Generate unified diff between two texts."""
    a_lines = payload.a.splitlines(keepends=True)
    b_lines = payload.b.splitlines(keepends=True)
    
    diff_lines = list(unified_diff(
        a_lines, b_lines,
        fromfile="original",
        tofile="modified",
        lineterm="",
        n=payload.context_lines
    ))
    
    # Count changes
    additions = sum(1 for line in diff_lines if line.startswith('+') and not line.startswith('+++'))
    deletions = sum(1 for line in diff_lines if line.startswith('-') and not line.startswith('---'))
    
    return {
        "success": True,
        "diff": "".join(diff_lines),
        "stats": {
            "additions": additions,
            "deletions": deletions,
            "original_lines": len(a_lines),
            "modified_lines": len(b_lines)
        }
    }


@router.post("/diff/html", summary="HTML Diff", description="Generate HTML diff view")
async def html_diff(payload: TextPair):
    """Generate side-by-side HTML diff."""
    a_lines = payload.a.splitlines()
    b_lines = payload.b.splitlines()
    
    differ = HtmlDiff(wrapcolumn=80)
    html_table = differ.make_table(a_lines, b_lines, fromdesc="Original", todesc="Modified", context=True, numlines=payload.context_lines)
    
    return {"success": True, "html": html_table}


# ============================================================================
# JWT Endpoints
# ============================================================================

@router.post("/jwt/decode", summary="Decode JWT", description="Decode and inspect JWT token")
async def jwt_decode(payload: JWTPayload):
    """Decode JWT token and return header and payload (without verification)."""
    try:
        parts = payload.token.split(".")
        if len(parts) < 2:
            raise ValueError("Invalid JWT structure - must have at least 2 parts")
        
        # Decode header
        header_b64 = parts[0]
        # Add padding
        header_b64 += "=" * (4 - len(header_b64) % 4)
        header = json.loads(base64.urlsafe_b64decode(header_b64))
        
        # Decode payload
        payload_b64 = parts[1]
        payload_b64 += "=" * (4 - len(payload_b64) % 4)
        body = json.loads(base64.urlsafe_b64decode(payload_b64))
        
        # Check expiration if present
        exp_info = None
        if "exp" in body:
            exp_time = datetime.fromtimestamp(body["exp"])
            is_expired = datetime.utcnow() > exp_time
            exp_info = {
                "expires_at": exp_time.isoformat(),
                "is_expired": is_expired,
                "expires_in_seconds": (exp_time - datetime.utcnow()).total_seconds() if not is_expired else None
            }
        
        # Check issued at if present
        iat_info = None
        if "iat" in body:
            iat_time = datetime.fromtimestamp(body["iat"])
            iat_info = {"issued_at": iat_time.isoformat()}
        
        return {
            "success": True,
            "header": header,
            "payload": body,
            "expiration": exp_info,
            "issued": iat_info,
            "has_signature": len(parts) == 3
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# Cron Endpoints
# ============================================================================

@router.post("/cron/next", summary="Cron Next Runs", description="Get next execution times for cron expression")
async def cron_next(payload: CronPayload):
    """Parse cron expression and return next scheduled run times."""
    try:
        from croniter import croniter
    except ImportError:
        raise HTTPException(status_code=500, detail="croniter not installed")
    
    try:
        now = datetime.utcnow()
        itr = croniter(payload.expression, now)
        count = max(1, min(payload.count, 50))
        
        times = []
        for _ in range(count):
            next_time = itr.get_next(datetime)
            times.append({
                "datetime": next_time.isoformat(),
                "timestamp": int(next_time.timestamp()),
                "relative": get_relative_time(next_time, now)
            })
        
        return {
            "success": True,
            "expression": payload.expression,
            "next_runs": times,
            "timezone": "UTC"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/cron/explain", summary="Explain Cron", description="Get human-readable explanation of cron expression")
async def cron_explain(payload: CronPayload):
    """Provide human-readable explanation of cron expression."""
    parts = payload.expression.split()
    if len(parts) < 5:
        raise HTTPException(status_code=400, detail="Cron expression must have at least 5 fields")
    
    explanations = {
        "minute": explain_cron_field(parts[0], "minute", 0, 59),
        "hour": explain_cron_field(parts[1], "hour", 0, 23),
        "day_of_month": explain_cron_field(parts[2], "day of month", 1, 31),
        "month": explain_cron_field(parts[3], "month", 1, 12),
        "day_of_week": explain_cron_field(parts[4], "day of week", 0, 6)
    }
    
    return {
        "success": True,
        "expression": payload.expression,
        "fields": explanations,
        "summary": build_cron_summary(explanations)
    }


# ============================================================================
# HTTP Endpoints
# ============================================================================

@router.post("/http/ping", summary="HTTP Ping", description="Check URL response time and status")
async def http_ping(payload: HttpPingPayload):
    """Ping a URL and return response time, status, and headers."""
    try:
        import httpx
    except ImportError:
        raise HTTPException(status_code=500, detail="httpx not installed")
    
    try:
        start = datetime.utcnow()
        async with httpx.AsyncClient(timeout=payload.timeout, follow_redirects=True) as client:
            if payload.method.upper() == "HEAD":
                resp = await client.head(payload.url)
            else:
                resp = await client.get(payload.url)
        elapsed = (datetime.utcnow() - start).total_seconds() * 1000
        
        return {
            "success": True,
            "url": payload.url,
            "status_code": resp.status_code,
            "status_text": resp.reason_phrase,
            "response_time_ms": round(elapsed, 2),
            "headers": dict(resp.headers),
            "content_length": resp.headers.get("content-length"),
            "content_type": resp.headers.get("content-type"),
            "server": resp.headers.get("server"),
            "redirects": len(resp.history)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# Git Command Generator
# ============================================================================

@router.post("/git/generate", summary="Generate Git Command", description="Generate git commands for common workflows")
async def git_generate(payload: GitCommandPayload):
    """Generate git commands for various workflows."""
    action = payload.action.lower()
    branch = payload.branch or "main"
    remote = payload.remote or "origin"
    msg = payload.message or "update"
    tag = payload.tag_name
    
    commands = {
        "init": [
            "git init",
            "git add .",
            f'git commit -m "initial commit"'
        ],
        "clone": [f"git clone {remote}"],
        "commit": [
            "git add .",
            f'git commit -m "{msg}"'
        ],
        "push": [f"git push {remote} {branch}"],
        "pull": [f"git pull {remote} {branch}"],
        "checkout": [f"git checkout {branch}"],
        "branch": [
            f"git checkout -b {branch}",
            f"git push -u {remote} {branch}"
        ],
        "merge": [
            f"git checkout {branch}",
            f"git merge {payload.branch or 'feature-branch'}"
        ],
        "rebase": [f"git rebase {branch}"],
        "stash": ["git stash", "git stash pop"],
        "tag": [
            f'git tag -a {tag or "v1.0.0"} -m "{msg}"',
            f"git push {remote} {tag or 'v1.0.0'}"
        ],
        "reset": ["git reset --hard HEAD~1"],
        "amend": [f'git commit --amend -m "{msg}"'],
        "log": ["git log --oneline -n 10"],
        "status": ["git status"],
        "diff": ["git diff"],
        "fetch": [f"git fetch {remote}"]
    }
    
    if action not in commands:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported action. Available: {', '.join(commands.keys())}"
        )
    
    return {
        "success": True,
        "action": action,
        "commands": commands[action],
        "combined": " && ".join(commands[action])
    }


# ============================================================================
# Timestamp Endpoints
# ============================================================================

@router.post("/timestamp/convert", summary="Convert Timestamp", description="Convert between timestamp formats")
async def timestamp_convert(payload: TimestampPayload):
    """Convert timestamps between Unix, milliseconds, and ISO formats."""
    try:
        # Parse input
        value = payload.value.strip()
        dt = None
        
        if payload.from_format == "auto":
            # Try to auto-detect
            if value.isdigit():
                num = int(value)
                if num > 9999999999:  # Likely milliseconds
                    dt = datetime.fromtimestamp(num / 1000)
                else:
                    dt = datetime.fromtimestamp(num)
            else:
                dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        elif payload.from_format == "unix":
            dt = datetime.fromtimestamp(int(value))
        elif payload.from_format == "unix_ms":
            dt = datetime.fromtimestamp(int(value) / 1000)
        elif payload.from_format == "iso":
            dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        
        if dt is None:
            raise ValueError("Could not parse timestamp")
        
        result = {
            "success": True,
            "input": payload.value,
            "unix": int(dt.timestamp()),
            "unix_ms": int(dt.timestamp() * 1000),
            "iso": dt.isoformat(),
            "formatted": {
                "date": dt.strftime("%Y-%m-%d"),
                "time": dt.strftime("%H:%M:%S"),
                "full": dt.strftime("%Y-%m-%d %H:%M:%S UTC"),
                "relative": get_relative_time(dt, datetime.utcnow())
            }
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/timestamp/now", summary="Current Timestamp", description="Get current timestamp in all formats")
async def timestamp_now():
    """Get current time in various formats."""
    now = datetime.utcnow()
    return {
        "success": True,
        "unix": int(now.timestamp()),
        "unix_ms": int(now.timestamp() * 1000),
        "iso": now.isoformat() + "Z",
        "formatted": now.strftime("%Y-%m-%d %H:%M:%S UTC")
    }


# ============================================================================
# Slug Generator
# ============================================================================

@router.post("/slug/generate", summary="Generate Slug", description="Convert text to URL-friendly slug")
async def slug_generate(payload: SlugPayload):
    """Generate URL-friendly slug from text."""
    import unicodedata
    
    text = payload.text
    
    # Normalize unicode
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    
    # Convert to lowercase if requested
    if payload.lowercase:
        text = text.lower()
    
    # Replace spaces and invalid chars
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", payload.separator, text).strip("-_")
    
    return {
        "success": True,
        "slug": text,
        "original": payload.text,
        "length": len(text)
    }


# ============================================================================
# Number Base Conversion
# ============================================================================

@router.post("/base/convert", summary="Convert Number Base", description="Convert numbers between bases 2-36")
async def base_convert(payload: NumberBasePayload):
    """Convert number from one base to another."""
    if not (2 <= payload.from_base <= 36 and 2 <= payload.to_base <= 36):
        raise HTTPException(status_code=400, detail="Base must be between 2 and 36")
    
    try:
        # Convert to decimal first
        decimal_value = int(payload.value, payload.from_base)
        
        # Convert to target base
        if payload.to_base == 10:
            result = str(decimal_value)
        else:
            digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            result = ""
            num = decimal_value
            if num == 0:
                result = "0"
            else:
                while num > 0:
                    result = digits[num % payload.to_base] + result
                    num //= payload.to_base
        
        return {
            "success": True,
            "result": result,
            "decimal": decimal_value,
            "from_base": payload.from_base,
            "to_base": payload.to_base
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid number for base {payload.from_base}")


# ============================================================================
# Lorem Ipsum Generator
# ============================================================================

@router.post("/lorem/generate", summary="Generate Lorem Ipsum", description="Generate placeholder text")
async def lorem_generate(payload: LoremIpsumPayload):
    """Generate lorem ipsum placeholder text."""
    words = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
        "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
        "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
        "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
        "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
        "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
        "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
        "deserunt", "mollit", "anim", "id", "est", "laborum"
    ]
    
    import random
    paragraphs = []
    
    for _ in range(min(payload.paragraphs, 20)):
        para_words = []
        for _ in range(payload.words_per_paragraph):
            para_words.append(random.choice(words))
        
        # Capitalize first word and add period
        para_text = " ".join(para_words)
        para_text = para_text[0].upper() + para_text[1:] + "."
        paragraphs.append(para_text)
    
    return {
        "success": True,
        "paragraphs": paragraphs,
        "text": "\n\n".join(paragraphs),
        "word_count": sum(len(p.split()) for p in paragraphs)
    }


# ============================================================================
# Helper Functions
# ============================================================================

def count_keys(obj, count=0):
    """Recursively count keys in a JSON object."""
    if isinstance(obj, dict):
        count += len(obj)
        for v in obj.values():
            count = count_keys(v, count)
    elif isinstance(obj, list):
        for item in obj:
            count = count_keys(item, count)
    return count


def get_json_depth(obj, depth=0):
    """Get maximum depth of JSON structure."""
    if isinstance(obj, dict):
        if not obj:
            return depth
        return max(get_json_depth(v, depth + 1) for v in obj.values())
    elif isinstance(obj, list):
        if not obj:
            return depth
        return max(get_json_depth(item, depth + 1) for item in obj)
    return depth


def navigate_json_path(obj, path):
    """Navigate JSON using dot notation path."""
    parts = path.split(".")
    current = obj
    for part in parts:
        if part.isdigit():
            current = current[int(part)]
        else:
            current = current[part]
    return current


def get_relative_time(dt, now):
    """Get human-readable relative time."""
    diff = dt - now
    seconds = diff.total_seconds()
    
    if seconds < 0:
        return "in the past"
    elif seconds < 60:
        return f"in {int(seconds)} seconds"
    elif seconds < 3600:
        return f"in {int(seconds / 60)} minutes"
    elif seconds < 86400:
        return f"in {int(seconds / 3600)} hours"
    else:
        return f"in {int(seconds / 86400)} days"


def explain_cron_field(value, name, min_val, max_val):
    """Explain a single cron field."""
    if value == "*":
        return f"every {name}"
    elif value.startswith("*/"):
        step = value[2:]
        return f"every {step} {name}s"
    elif "-" in value:
        return f"{name}s {value}"
    elif "," in value:
        return f"{name}s {value}"
    else:
        return f"at {name} {value}"


def build_cron_summary(explanations):
    """Build summary from cron explanations."""
    parts = []
    for field, explanation in explanations.items():
        parts.append(explanation)
    return ", ".join(parts)
