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
import io
from datetime import datetime, timedelta
from difflib import unified_diff, HtmlDiff
import os
from pathlib import Path

class JsonPayload(BaseModel):
    data: str = Field(..., description="JSON string to process")
    indent: Optional[int] = Field(2, description="Indentation level for formatting")
    sort_keys: Optional[bool] = Field(
        False, description="Sort object keys alphabetically"
    )

class YamlPayload(BaseModel):
    data: str = Field(..., description="YAML or JSON string")

class TextPayload(BaseModel):
    data: str = Field(..., description="Text data to process")

class TextPair(BaseModel):

    a: str = Field(..., description="First text")
    b: str = Field(..., description="Second text")
    context_lines: Optional[int] = Field(3, description="Context lines for diff")

class RegexPayload(BaseModel):

    pattern: str = Field(..., description="Regular expression pattern")
    text: str = Field(..., description="Text to search")
    flags: Optional[str] = Field(
        "", description="Regex flags: i=ignore case, m=multiline, s=dotall"
    )
    replace_with: Optional[str] = Field(
        None, description="Replacement string for substitution"
    )

class Base64Payload(BaseModel):

    data: str = Field(..., description="Data to encode/decode")
    url_safe: Optional[bool] = Field(False, description="Use URL-safe Base64")

class UrlPayload(BaseModel):

    data: str = Field(..., description="URL or string to encode/decode")

class JWTPayload(BaseModel):

    token: str = Field(..., description="JWT token to decode")

class CronPayload(BaseModel):

    expression: str = Field(..., description="Cron expression (5 or 6 fields)")
    count: Optional[int] = Field(5, description="Number of next run times to return")

class HttpPingPayload(BaseModel):

    url: str = Field(..., description="URL to ping")
    method: Optional[str] = Field("GET", description="HTTP method")
    timeout: Optional[float] = Field(10.0, description="Request timeout in seconds")

class ConversionResponse(BaseModel):
    success: bool
    message: str
    downloadUrl: Optional[str] = None
    title: Optional[str] = None
    duration: Optional[str] = None
    thumbnail: Optional[str] = None
    fileSize: Optional[str] = None

class VideoInfoResponse(BaseModel):
    success: bool
    title: Optional[str] = None
    duration: Optional[str] = None
    thumbnail: Optional[str] = None
    fileSize: Optional[str] = None
    format: Optional[str] = None

class GitCommandPayload(BaseModel):

    action: str = Field(
        ...,
        description="Git action: init, clone, commit, push, pull, branch, merge, rebase, stash, tag",
    )
    branch: Optional[str] = Field(None, description="Branch name")
    remote: Optional[str] = Field("origin", description="Remote name")
    message: Optional[str] = Field(None, description="Commit message")
    tag_name: Optional[str] = Field(None, description="Tag name for tag operations")

class LoremIpsumPayload(BaseModel):

    paragraphs: Optional[int] = Field(3, description="Number of paragraphs")
    words_per_paragraph: Optional[int] = Field(
        50, description="Approximate words per paragraph"
    )

class TimestampPayload(BaseModel):

    value: str = Field(
        ..., description="Timestamp value (unix seconds/ms or ISO string)"
    )
    from_format: Optional[str] = Field(
        "auto", description="Input format: auto, unix, unix_ms, iso"
    )
    to_format: Optional[str] = Field(
        "all", description="Output format: unix, unix_ms, iso, all"
    )

class HtmlPayload(BaseModel):

    data: str = Field(..., description="HTML or text to process")

class CodeBeautifyPayload(BaseModel):

    code: str = Field(..., description="Code to beautify")
    language: str = Field("json", description="Language: json, html, css, sql, xml")
    indent: Optional[int] = Field(2, description="Indentation spaces")

class SlugPayload(BaseModel):

    text: str = Field(..., description="Text to convert to slug")
    separator: Optional[str] = Field("-", description="Word separator")
    lowercase: Optional[bool] = Field(True, description="Convert to lowercase")

class NumberBasePayload(BaseModel):

    value: str = Field(..., description="Number value as string")
    from_base: int = Field(..., description="Source base (2-36)")
    to_base: int = Field(..., description="Target base (2-36)")

class EnvPayload(BaseModel):

    data: str = Field(..., description="Contents of .env file")
    site_name: Optional[str] = Field(None, description="Netlify site name")

class HarPayload(BaseModel):

    data: str = Field(..., description="HAR file content as JSON string")
    max_entries: int = Field(50, description="Limit number of entries returned")

class CssInlinePayload(BaseModel):

    html: str = Field(..., description="HTML content to inline CSS")
    base_url: Optional[str] = Field(None, description="Base URL for resolving links")

class ImageResizePayload(BaseModel):

    data: str = Field(..., description="Base64 image data URI or raw base64")
    width: Optional[int] = Field(None, ge=1)
    height: Optional[int] = Field(None, ge=1)
    format: Optional[str] = Field("jpeg", description="jpeg/png/webp")
    quality: Optional[int] = Field(80, ge=1, le=100)

    format: Optional[str] = Field("jpeg", description="jpeg/png/webp")
    quality: Optional[int] = Field(80, ge=1, le=100)

router = APIRouter()

@router.post(
    "/json/format",
    summary="Format JSON",
    description="Pretty-print and format JSON data",
)
async def format_json(payload: JsonPayload):
    try:
        obj = json.loads(payload.data)
        formatted = json.dumps(
            obj, indent=payload.indent, sort_keys=payload.sort_keys, ensure_ascii=False
        )
        return {
            "success": True,
            "formatted": formatted,
            "valid": True,
            "stats": {
                "original_length": len(payload.data),
                "formatted_length": len(formatted),
                "keys_count": count_keys(obj) if isinstance(obj, dict) else None,
                "depth": get_json_depth(obj),
            },
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": str(e),
            "valid": False,
            "error_position": {"line": e.lineno, "column": e.colno},
        }

@router.post(
    "/json/validate",
    summary="Validate JSON",
    description="Check if a string is valid JSON",
)
async def validate_json(payload: JsonPayload):
    try:
        obj = json.loads(payload.data)
        return {
            "success": True,
            "valid": True,
            "type": type(obj).__name__,
            "stats": {
                "keys_count": count_keys(obj) if isinstance(obj, dict) else None,
                "array_length": len(obj) if isinstance(obj, list) else None,
                "depth": get_json_depth(obj),
            },
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "valid": False,
            "error": str(e),
            "error_position": {"line": e.lineno, "column": e.colno},
        }

@router.post(
    "/json/minify", summary="Minify JSON", description="Remove whitespace from JSON"
)
async def minify_json(payload: JsonPayload):
    try:
        obj = json.loads(payload.data)
        minified = json.dumps(obj, separators=(",", ":"), ensure_ascii=False)
        return {
            "success": True,
            "minified": minified,
            "stats": {
                "original_length": len(payload.data),
                "minified_length": len(minified),
                "reduction_percent": round(
                    (1 - len(minified) / len(payload.data)) * 100, 2
                ),
            },
        }
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/json/query",
    summary="Query JSON",
    description="Query JSON using dot notation path",
)
async def query_json(
    payload: JsonPayload,
    path: str = Query(..., description="Dot notation path like 'users.0.name'"),
):
    try:
        obj = json.loads(payload.data)
        result = navigate_json_path(obj, path)
        return {"success": True, "result": result, "path": path}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

        result = navigate_json_path(obj, path)
        return {"success": True, "result": result, "path": path}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/yaml/to-json", summary="YAML to JSON", description="Convert YAML to JSON format"
)
async def yaml_to_json(payload: YamlPayload):
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

@router.post(
    "/json/to-yaml", summary="JSON to YAML", description="Convert JSON to YAML format"
)
async def json_to_yaml(payload: JsonPayload):
    try:
        import yaml
    except ImportError:
        raise HTTPException(status_code=500, detail="PyYAML not installed")
    try:
        obj = json.loads(payload.data)
        yaml_str = yaml.safe_dump(
            obj,
            sort_keys=payload.sort_keys,
            allow_unicode=True,
            default_flow_style=False,
        )
        return {"success": True, "yaml": yaml_str}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/base64/encode", summary="Base64 Encode", description="Encode text to Base64"
)
async def base64_encode(payload: Base64Payload):
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
            "encoded_length": len(encoded),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/base64/decode", summary="Base64 Decode", description="Decode Base64 to text"
)
async def base64_decode(payload: Base64Payload):
    try:
        data = payload.data
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
            "decoded_length": len(decoded),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/url/encode", summary="URL Encode", description="URL encode a string")
async def url_encode(payload: UrlPayload):
    encoded = urllib.parse.quote(payload.data, safe="")
    return {
        "success": True,
        "encoded": encoded,
        "original_length": len(payload.data),
        "encoded_length": len(encoded),
    }

@router.post("/url/decode", summary="URL Decode", description="URL decode a string")
async def url_decode(payload: UrlPayload):
    decoded = urllib.parse.unquote(payload.data)
    return {
        "success": True,
        "decoded": decoded,
        "encoded_length": len(payload.data),
        "decoded_length": len(decoded),
    }

@router.post(
    "/html/encode", summary="HTML Encode", description="Encode special HTML characters"
)
async def html_encode(payload: HtmlPayload):
    encoded = html.escape(payload.data)
    return {"success": True, "encoded": encoded}

@router.post("/html/decode", summary="HTML Decode", description="Decode HTML entities")
async def html_decode(payload: HtmlPayload):
    decoded = html.unescape(payload.data)
    return {"success": True, "decoded": decoded}

    encoded = html.escape(payload.data)
    return {"success": True, "encoded": encoded}

@router.post("/html/decode", summary="HTML Decode", description="Decode HTML entities")
async def html_decode(payload: HtmlPayload):
    decoded = html.unescape(payload.data)
    return {"success": True, "decoded": decoded}

class EncoderPayload(BaseModel):
    data: str = Field(..., description="Data to encode/decode")
    encoding: str = Field(..., description="Encoding type")
    mode: str = Field("encode", description="Mode: encode or decode")
    options: Optional[dict] = Field(None, description="Additional options (shift, key, separator)")

MORSE_CODE = {
    "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
    "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
    "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
    "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
    "Y": "-.--", "Z": "--..", "0": "-----", "1": ".----", "2": "..---",
    "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...",
    "8": "---..", "9": "----.", " ": "/"
}
MORSE_REVERSE = {v: k for k, v in MORSE_CODE.items()}

NATO_ALPHABET = {
    "A": "Alpha", "B": "Bravo", "C": "Charlie", "D": "Delta", "E": "Echo",
    "F": "Foxtrot", "G": "Golf", "H": "Hotel", "I": "India", "J": "Juliet",
    "K": "Kilo", "L": "Lima", "M": "Mike", "N": "November", "O": "Oscar",
    "P": "Papa", "Q": "Quebec", "R": "Romeo", "S": "Sierra", "T": "Tango",
    "U": "Uniform", "V": "Victor", "W": "Whiskey", "X": "X-ray", "Y": "Yankee",
    "Z": "Zulu", "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
    "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Niner", " ": "[space]"
}
NATO_REVERSE = {v.lower(): k for k, v in NATO_ALPHABET.items()}

BACON_CIPHER = {
    "A": "AAAAA", "B": "AAAAB", "C": "AAABA", "D": "AAABB", "E": "AABAA",
    "F": "AABAB", "G": "AABBA", "H": "AABBB", "I": "ABAAA", "J": "ABAAB",
    "K": "ABABA", "L": "ABABB", "M": "ABBAA", "N": "ABBAB", "O": "ABBBA",
    "P": "ABBBB", "Q": "BAAAA", "R": "BAAAB", "S": "BAABA", "T": "BAABB",
    "U": "BABAA", "V": "BABAB", "W": "BABBA", "X": "BABBB", "Y": "BBAAA", "Z": "BBAAB"
}
BACON_REVERSE = {v: k for k, v in BACON_CIPHER.items()}

BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

def base32_encode(data: str) -> str:
    data_bytes = data.encode("utf-8")
    bits = "".join(f"{b:08b}" for b in data_bytes)
    while len(bits) % 5:
        bits += "0"
    result = "".join(BASE32_ALPHABET[int(bits[i:i+5], 2)] for i in range(0, len(bits), 5))
    while len(result) % 8:
        result += "="
    return result

def base32_decode(data: str) -> str:
    cleaned = data.rstrip("=").upper()
    bits = "".join(f"{BASE32_ALPHABET.index(c):05b}" for c in cleaned if c in BASE32_ALPHABET)
    byte_list = [int(bits[i:i+8], 2) for i in range(0, len(bits) - len(bits) % 8, 8)]
    return bytes(byte_list).decode("utf-8")

def vigenere_encode(text: str, key: str) -> str:
    if not key:
        return text
    key_upper = "".join(c for c in key.upper() if c.isalpha())
    if not key_upper:
        return text
    result = []
    key_idx = 0
    for char in text:
        if char.isalpha():
            base = ord("A") if char.isupper() else ord("a")
            char_code = ord(char.upper()) - ord("A")
            key_code = ord(key_upper[key_idx % len(key_upper)]) - ord("A")
            encoded = (char_code + key_code) % 26
            result.append(chr(encoded + base))
            key_idx += 1
        else:
            result.append(char)
    return "".join(result)

def vigenere_decode(text: str, key: str) -> str:
    if not key:
        return text
    key_upper = "".join(c for c in key.upper() if c.isalpha())
    if not key_upper:
        return text
    result = []
    key_idx = 0
    for char in text:
        if char.isalpha():
            base = ord("A") if char.isupper() else ord("a")
            char_code = ord(char.upper()) - ord("A")
            key_code = ord(key_upper[key_idx % len(key_upper)]) - ord("A")
            decoded = (char_code - key_code + 26) % 26
            result.append(chr(decoded + base))
            key_idx += 1
        else:
            result.append(char)
    return "".join(result)

def universal_encode(data: str, encoding: str, options: dict = None) -> str:
    options = options or {}
    shift = options.get("shift", 3)
    key = options.get("key", "KEY")
    separator = options.get("separator", " ")
    
    if encoding == "base64":
        return base64.b64encode(data.encode("utf-8")).decode("utf-8")
    elif encoding == "base64url":
        return base64.urlsafe_b64encode(data.encode("utf-8")).decode("utf-8").rstrip("=")
    elif encoding == "base32":
        return base32_encode(data)
    elif encoding == "base16":
        return data.encode("utf-8").hex().upper()
    elif encoding == "url":
        return urllib.parse.quote(data)
    elif encoding == "url-component":
        return urllib.parse.quote(data, safe="")
    elif encoding == "html":
        return html.escape(data)
    elif encoding == "html-full":
        return "".join(f"&#{ord(c)};" for c in data)
    elif encoding == "hex":
        return separator.join(f"{ord(c):02x}" for c in data)
    elif encoding == "hex-0x":
        return separator.join(f"0x{ord(c):02x}" for c in data)
    elif encoding == "binary":
        return separator.join(f"{ord(c):08b}" for c in data)
    elif encoding == "octal":
        return separator.join(f"{ord(c):03o}" for c in data)
    elif encoding in ("decimal", "ascii"):
        return separator.join(str(ord(c)) for c in data)
    elif encoding == "unicode":
        return separator.join(f"U+{ord(c):04X}" for c in data)
    elif encoding == "unicode-escape":
        return "".join(f"\\u{ord(c):04x}" for c in data)
    elif encoding == "utf8":
        return separator.join(f"{b:02x}" for b in data.encode("utf-8"))
    elif encoding == "utf16":
        return separator.join(f"{ord(c):04X}" for c in data)
    elif encoding == "a1z26":
        return "-".join(
            str(ord(c.upper()) - 64) if c.isalpha() else ("0" if c == " " else c)
            for c in data
        )
    elif encoding == "nato":
        return " ".join(NATO_ALPHABET.get(c.upper(), c) for c in data)
    elif encoding == "morse":
        return " ".join(MORSE_CODE.get(c.upper(), c) for c in data)
    elif encoding == "reverse":
        return data[::-1]
    elif encoding == "rot13":
        return "".join(
            chr((ord(c) - (65 if c.isupper() else 97) + 13) % 26 + (65 if c.isupper() else 97))
            if c.isalpha() else c for c in data
        )
    elif encoding == "rot5":
        return "".join(
            chr((ord(c) - 48 + 5) % 10 + 48) if c.isdigit() else c for c in data
        )
    elif encoding == "rot47":
        return "".join(
            chr((ord(c) - 33 + 47) % 94 + 33) if 33 <= ord(c) <= 126 else c for c in data
        )
    elif encoding == "caesar":
        return "".join(
            chr((ord(c) - (65 if c.isupper() else 97) + shift) % 26 + (65 if c.isupper() else 97))
            if c.isalpha() else c for c in data
        )
    elif encoding == "atbash":
        return "".join(
            chr((65 if c.isupper() else 97) + 25 - (ord(c) - (65 if c.isupper() else 97)))
            if c.isalpha() else c for c in data
        )
    elif encoding == "vigenere":
        return vigenere_encode(data, key)
    elif encoding == "bacon":
        return " ".join(BACON_CIPHER.get(c.upper(), c) for c in data if c.isalpha() or c == " ")
    elif encoding == "md5-hash":
        return hashlib.md5(data.encode()).hexdigest()
    elif encoding == "sha1-hash":
        return hashlib.sha1(data.encode()).hexdigest()
    elif encoding == "sha256-hash":
        return hashlib.sha256(data.encode()).hexdigest()
    else:
        raise ValueError(f"Unknown encoding: {encoding}")

def universal_decode(data: str, encoding: str, options: dict = None) -> str:
    options = options or {}
    shift = options.get("shift", 3)
    key = options.get("key", "KEY")
    
    if encoding == "base64":
        return base64.b64decode(data).decode("utf-8")
    elif encoding == "base64url":
        padded = data + "=" * (4 - len(data) % 4) if len(data) % 4 else data
        return base64.urlsafe_b64decode(padded).decode("utf-8")
    elif encoding == "base32":
        return base32_decode(data)
    elif encoding == "base16":
        return bytes.fromhex(data).decode("utf-8")
    elif encoding == "url":
        return urllib.parse.unquote(data)
    elif encoding == "url-component":
        return urllib.parse.unquote(data)
    elif encoding in ("html", "html-full"):
        return html.unescape(data)
    elif encoding == "hex":
        parts = data.strip().split()
        return "".join(chr(int(p, 16)) for p in parts if p)
    elif encoding == "hex-0x":
        parts = data.strip().split()
        return "".join(chr(int(p.replace("0x", ""), 16)) for p in parts if p)
    elif encoding == "binary":
        parts = data.strip().split()
        return "".join(chr(int(p, 2)) for p in parts if p)
    elif encoding == "octal":
        parts = data.strip().split()
        return "".join(chr(int(p, 8)) for p in parts if p)
    elif encoding in ("decimal", "ascii"):
        parts = data.strip().split()
        return "".join(chr(int(p)) for p in parts if p)
    elif encoding == "unicode":
        parts = data.strip().split()
        return "".join(chr(int(p.replace("U+", ""), 16)) for p in parts if p)
    elif encoding == "unicode-escape":
        import codecs
        return codecs.decode(data, "unicode_escape")
    elif encoding == "utf8":
        parts = data.strip().split()
        return bytes(int(p, 16) for p in parts if p).decode("utf-8")
    elif encoding == "utf16":
        parts = data.strip().split()
        return "".join(chr(int(p, 16)) for p in parts if p)
    elif encoding == "a1z26":
        parts = data.split("-")
        return "".join(
            chr(int(p) + 64) if p.isdigit() and 1 <= int(p) <= 26 else (" " if p == "0" else p)
            for p in parts
        )
    elif encoding == "nato":
        words = data.strip().split()
        return "".join(NATO_REVERSE.get(w.lower(), w) if w.lower() != "[space]" else " " for w in words)
    elif encoding == "morse":
        codes = data.strip().split()
        return "".join(MORSE_REVERSE.get(c, c) if c != "/" else " " for c in codes)
    elif encoding == "reverse":
        return data[::-1]
    elif encoding == "rot13":
        return universal_encode(data, "rot13")
    elif encoding == "rot5":
        return universal_encode(data, "rot5")
    elif encoding == "rot47":
        return universal_encode(data, "rot47")
    elif encoding == "caesar":
        return universal_encode(data, "caesar", {"shift": -shift})
    elif encoding == "atbash":
        return universal_encode(data, "atbash")
    elif encoding == "vigenere":
        return vigenere_decode(data, key)
    elif encoding == "bacon":
        codes = data.strip().split()
        return "".join(BACON_REVERSE.get(c, c) for c in codes)
    elif encoding in ("md5-hash", "sha1-hash", "sha256-hash"):
        raise ValueError("Hash functions cannot be decoded")
    else:
        raise ValueError(f"Unknown encoding: {encoding}")

@router.post(
    "/encode",
    summary="Universal Encode",
    description="Encode data using various formats (base64, hex, binary, morse, etc.)"
)
async def universal_encode_endpoint(payload: EncoderPayload):
    try:
        result = universal_encode(payload.data, payload.encoding, payload.options)
        return {
            "success": True,
            "result": result,
            "encoding": payload.encoding,
            "mode": "encode",
            "input_length": len(payload.data),
            "output_length": len(result)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/decode",
    summary="Universal Decode", 
    description="Decode data from various formats (base64, hex, binary, morse, etc.)"
)
async def universal_decode_endpoint(payload: EncoderPayload):
    try:
        result = universal_decode(payload.data, payload.encoding, payload.options)
        return {
            "success": True,
            "result": result,
            "encoding": payload.encoding,
            "mode": "decode",
            "input_length": len(payload.data),
            "output_length": len(result)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/encode-decode",
    summary="Encode/Decode",
    description="Universal encode or decode endpoint"
)
async def encode_decode_endpoint(payload: EncoderPayload):
    try:
        if payload.mode == "encode":
            result = universal_encode(payload.data, payload.encoding, payload.options)
        else:
            result = universal_decode(payload.data, payload.encoding, payload.options)
        return {
            "success": True,
            "result": result,
            "encoding": payload.encoding,
            "mode": payload.mode,
            "input_length": len(payload.data),
            "output_length": len(result)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get(
    "/encodings",
    summary="List Encodings",
    description="Get list of all supported encoding formats"
)
async def list_encodings():
    encodings = [
        {"id": "base64", "name": "Base64", "category": "web", "canDecode": True},
        {"id": "base64url", "name": "Base64 URL", "category": "web", "canDecode": True},
        {"id": "base32", "name": "Base32", "category": "web", "canDecode": True},
        {"id": "base16", "name": "Base16", "category": "web", "canDecode": True},
        {"id": "url", "name": "URL Encode", "category": "web", "canDecode": True},
        {"id": "url-component", "name": "URL Component", "category": "web", "canDecode": True},
        {"id": "html", "name": "HTML Entities", "category": "web", "canDecode": True},
        {"id": "html-full", "name": "HTML Full", "category": "web", "canDecode": True},
        {"id": "hex", "name": "Hexadecimal", "category": "numeric", "canDecode": True},
        {"id": "hex-0x", "name": "Hex (0x prefix)", "category": "numeric", "canDecode": True},
        {"id": "binary", "name": "Binary", "category": "numeric", "canDecode": True},
        {"id": "octal", "name": "Octal", "category": "numeric", "canDecode": True},
        {"id": "decimal", "name": "Decimal", "category": "numeric", "canDecode": True},
        {"id": "ascii", "name": "ASCII Codes", "category": "numeric", "canDecode": True},
        {"id": "unicode", "name": "Unicode", "category": "text", "canDecode": True},
        {"id": "unicode-escape", "name": "Unicode Escape", "category": "text", "canDecode": True},
        {"id": "utf8", "name": "UTF-8 Bytes", "category": "text", "canDecode": True},
        {"id": "utf16", "name": "UTF-16", "category": "text", "canDecode": True},
        {"id": "a1z26", "name": "A1Z26", "category": "text", "canDecode": True},
        {"id": "nato", "name": "NATO Phonetic", "category": "text", "canDecode": True},
        {"id": "morse", "name": "Morse Code", "category": "text", "canDecode": True},
        {"id": "reverse", "name": "Reverse", "category": "text", "canDecode": True},
        {"id": "rot13", "name": "ROT13", "category": "cipher", "canDecode": True},
        {"id": "rot5", "name": "ROT5", "category": "cipher", "canDecode": True},
        {"id": "rot47", "name": "ROT47", "category": "cipher", "canDecode": True},
        {"id": "caesar", "name": "Caesar Cipher", "category": "cipher", "canDecode": True},
        {"id": "atbash", "name": "Atbash", "category": "cipher", "canDecode": True},
        {"id": "vigenere", "name": "Vigenère", "category": "cipher", "canDecode": True},
        {"id": "bacon", "name": "Bacon Cipher", "category": "cipher", "canDecode": True},
        {"id": "md5-hash", "name": "MD5", "category": "hash", "canDecode": False},
        {"id": "sha1-hash", "name": "SHA-1", "category": "hash", "canDecode": False},
        {"id": "sha256-hash", "name": "SHA-256", "category": "hash", "canDecode": False},
    ]
    return {"success": True, "encodings": encodings, "count": len(encodings)}

@router.post(
    "/regex/test", summary="Test Regex", description="Test a regex pattern against text"
)
async def regex_test(payload: RegexPayload):
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
            "error_position": e.pos if hasattr(e, "pos") else None,
            "matches": [],
            "count": 0,
        }

    matches = []
    for m in pattern.finditer(payload.text):
        match_data = {
            "match": m.group(0),
            "start": m.start(),
            "end": m.end(),
            "groups": list(m.groups()),
            "named_groups": m.groupdict() if m.groupdict() else None,
        }
        matches.append(match_data)

    result = {
        "success": True,
        "matches": matches,
        "count": len(matches),
        "pattern": payload.pattern,
        "flags_applied": flag_descriptions,
    }

    if payload.replace_with is not None:
        replaced = pattern.sub(payload.replace_with, payload.text)
        result["replaced"] = replaced
        result["replacement_count"] = len(matches)

    return result

@router.post(
    "/regex/replace",
    summary="Regex Replace",
    description="Replace text using regex pattern",
)
async def regex_replace(payload: RegexPayload):
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
            "result_length": len(replaced),
        }
    except re.error as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get(
    "/uuid/generate", summary="Generate UUID", description="Generate a new UUID"
)
async def uuid_generate(
    version: int = Query(4, description="UUID version: 1, 4, or 5"),
    count: int = Query(1, description="Number of UUIDs to generate (max 100)"),
    namespace: Optional[str] = Query(
        None, description="Namespace for UUID5 (dns, url, oid, x500)"
    ),
    name: Optional[str] = Query(None, description="Name for UUID5"),
):
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
                "x500": uuid.NAMESPACE_X500,
            }
            ns = ns_map.get(namespace, uuid.NAMESPACE_DNS)
            new_uuid = str(uuid.uuid5(ns, name))
        else:
            new_uuid = str(uuid.uuid4())
        uuids.append(new_uuid)

    if count == 1:
        return {"success": True, "uuid": uuids[0], "version": version}
    return {"success": True, "uuids": uuids, "count": len(uuids), "version": version}

@router.post(
    "/uuid/validate",
    summary="Validate UUID",
    description="Check if string is valid UUID",
)
async def uuid_validate(payload: TextPayload):
    try:
        parsed = uuid.UUID(payload.data)
        return {
            "success": True,
            "valid": True,
            "uuid": str(parsed),
            "version": parsed.version,
            "variant": str(parsed.variant),
        }
    except ValueError:
        return {"success": True, "valid": False, "error": "Invalid UUID format"}

@router.post(
    "/diff/text",
    summary="Text Diff",
    description="Compare two texts and show differences",
)
async def text_diff(payload: TextPair):
    a_lines = payload.a.splitlines(keepends=True)
    b_lines = payload.b.splitlines(keepends=True)

    diff_lines = list(
        unified_diff(
            a_lines,
            b_lines,
            fromfile="original",
            tofile="modified",
            lineterm="",
            n=payload.context_lines,
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
        "diff": "".join(diff_lines),
        "stats": {
            "additions": additions,
            "deletions": deletions,
            "original_lines": len(a_lines),
            "modified_lines": len(b_lines),
        },
    }

@router.post("/diff/html", summary="HTML Diff", description="Generate HTML diff view")
async def html_diff(payload: TextPair):
    a_lines = payload.a.splitlines()
    b_lines = payload.b.splitlines()

    differ = HtmlDiff(wrapcolumn=80)
    html_table = differ.make_table(
        a_lines,
        b_lines,
        fromdesc="Original",
        todesc="Modified",
        context=True,
        numlines=payload.context_lines,
    )

    return {"success": True, "html": html_table}

@router.post(
    "/jwt/decode", summary="Decode JWT", description="Decode and inspect JWT token"
)
async def jwt_decode(payload: JWTPayload):
    try:
        parts = payload.token.split(".")
        if len(parts) < 2:
            raise ValueError("Invalid JWT structure - must have at least 2 parts")

        header_b64 = parts[0]
        header_b64 += "=" * (4 - len(header_b64) % 4)
        header = json.loads(base64.urlsafe_b64decode(header_b64))

        payload_b64 = parts[1]
        payload_b64 += "=" * (4 - len(payload_b64) % 4)
        body = json.loads(base64.urlsafe_b64decode(payload_b64))

        exp_info = None
        if "exp" in body:
            exp_time = datetime.fromtimestamp(body["exp"])
            is_expired = datetime.utcnow() > exp_time
            exp_info = {
                "expires_at": exp_time.isoformat(),
                "is_expired": is_expired,
                "expires_in_seconds": (
                    (exp_time - datetime.utcnow()).total_seconds()
                    if not is_expired
                    else None
                ),
            }

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
            "has_signature": len(parts) == 3,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/cron/next",
    summary="Cron Next Runs",
    description="Get next execution times for cron expression",
)
async def cron_next(payload: CronPayload):
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
            times.append(
                {
                    "datetime": next_time.isoformat(),
                    "timestamp": int(next_time.timestamp()),
                    "relative": get_relative_time(next_time, now),
                }
            )

        return {
            "success": True,
            "expression": payload.expression,
            "next_runs": times,
            "timezone": "UTC",
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/cron/explain",
    summary="Explain Cron",
    description="Get human-readable explanation of cron expression",
)
async def cron_explain(payload: CronPayload):
    parts = payload.expression.split()
    if len(parts) < 5:
        raise HTTPException(
            status_code=400, detail="Cron expression must have at least 5 fields"
        )

    explanations = {
        "minute": explain_cron_field(parts[0], "minute", 0, 59),
        "hour": explain_cron_field(parts[1], "hour", 0, 23),
        "day_of_month": explain_cron_field(parts[2], "day of month", 1, 31),
        "month": explain_cron_field(parts[3], "month", 1, 12),
        "day_of_week": explain_cron_field(parts[4], "day of week", 0, 6),
    }

    return {
        "success": True,
        "expression": payload.expression,
        "fields": explanations,
        "summary": build_cron_summary(explanations),
    }

@router.post(
    "/http/ping", summary="HTTP Ping", description="Check URL response time and status"
)
async def http_ping(payload: HttpPingPayload):
    try:
        import httpx
    except ImportError:
        raise HTTPException(status_code=500, detail="httpx not installed")

    try:
        start = datetime.utcnow()
        async with httpx.AsyncClient(
            timeout=payload.timeout, follow_redirects=True
        ) as client:
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
            "redirects": len(resp.history),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/git/generate",
    summary="Generate Git Command",
    description="Generate git commands for common workflows",
)
async def git_generate(payload: GitCommandPayload):
    action = payload.action.lower()
    branch = payload.branch or "main"
    remote = payload.remote or "origin"
    msg = payload.message or "update"
    tag = payload.tag_name

    commands = {
        "init": ["git init", "git add .", f'git commit -m "initial commit"'],
        "clone": [f"git clone {remote}"],
        "commit": ["git add .", f'git commit -m "{msg}"'],
        "push": [f"git push {remote} {branch}"],
        "pull": [f"git pull {remote} {branch}"],
        "checkout": [f"git checkout {branch}"],
        "branch": [f"git checkout -b {branch}", f"git push -u {remote} {branch}"],
        "merge": [
            f"git checkout {branch}",
            f"git merge {payload.branch or 'feature-branch'}",
        ],
        "rebase": [f"git rebase {branch}"],
        "stash": ["git stash", "git stash pop"],
        "tag": [
            f'git tag -a {tag or "v1.0.0"} -m "{msg}"',
            f"git push {remote} {tag or 'v1.0.0'}",
        ],
        "reset": ["git reset --hard HEAD~1"],
        "amend": [f'git commit --amend -m "{msg}"'],
        "log": ["git log --oneline -n 10"],
        "status": ["git status"],
        "diff": ["git diff"],
        "fetch": [f"git fetch {remote}"],
    }

    if action not in commands:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported action. Available: {', '.join(commands.keys())}",
        )

    return {
        "success": True,
        "action": action,
        "commands": commands[action],
        "combined": " && ".join(commands[action]),
    }

@router.post(
    "/timestamp/convert",
    summary="Convert Timestamp",
    description="Convert between timestamp formats",
)
async def timestamp_convert(payload: TimestampPayload):
    try:
        value = payload.value.strip()
        dt = None

        if payload.from_format == "auto":
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
                "relative": get_relative_time(dt, datetime.utcnow()),
            },
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get(
    "/timestamp/now",
    summary="Current Timestamp",
    description="Get current timestamp in all formats",
)
async def timestamp_now():
    now = datetime.utcnow()
    return {
        "success": True,
        "unix": int(now.timestamp()),
        "unix_ms": int(now.timestamp() * 1000),
        "iso": now.isoformat() + "Z",
        "formatted": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
    }

@router.post(
    "/slug/generate",
    summary="Generate Slug",
    description="Convert text to URL-friendly slug",
)
async def slug_generate(payload: SlugPayload):
    import unicodedata

    text = payload.text

    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")

    if payload.lowercase:
        text = text.lower()

    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", payload.separator, text).strip("-_")

    return {
        "success": True,
        "slug": text,
        "original": payload.text,
        "length": len(text),
    }

@router.post(
    "/base/convert",
    summary="Convert Number Base",
    description="Convert numbers between bases 2-36",
)
async def base_convert(payload: NumberBasePayload):
    if not (2 <= payload.from_base <= 36 and 2 <= payload.to_base <= 36):
        raise HTTPException(status_code=400, detail="Base must be between 2 and 36")

    try:
        decimal_value = int(payload.value, payload.from_base)

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
            "to_base": payload.to_base,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=400, detail=f"Invalid number for base {payload.from_base}"
        )

@router.post(
    "/env/netlify",
    summary="Convert .env to netlify.toml",
    description="Convert .env contents into a netlify.toml template",
)
async def env_to_netlify(payload: EnvPayload):
    lines = payload.data.splitlines()
    env_vars = {}
    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        env_vars[key.strip()] = value.strip()

    redirects_block = (
        "[[redirects]]\n"
        "  from = \"/api/*\"\n"
        "  to = \"https://example.com/api/:splat\"\n"
        "  status = 200\n"
    )
    env_block = "[build.environment]\n" + "\n".join(
        f"  {k} = \"{v}\"" for k, v in env_vars.items()
    )
    site_block = (
        "[build]\n  command = \"npm run build\"\n  publish = \"dist\"\n"
        + (f"  base = \"{payload.site_name}\"\n" if payload.site_name else "")
    )

    return {
        "success": True,
        "toml": "\n\n".join([site_block, env_block, redirects_block]),
    }

@router.post(
    "/har/summary",
    summary="Summarize HAR file",
    description="Summarize HAR network entries",
)
async def har_summary(payload: HarPayload):
    try:
        obj = json.loads(payload.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid HAR JSON: {e}")

    log = obj.get("log", {})
    entries = log.get("entries", [])
    pages = log.get("pages", [])

    summary = {
        "pages": [
            {
                "id": p.get("id"),
                "title": p.get("title"),
                "startedDateTime": p.get("startedDateTime"),
            }
            for p in pages
        ],
        "count": len(entries),
        "entries": [],
    }

    for entry in entries[: payload.max_entries]:
        req = entry.get("request", {})
        res = entry.get("response", {})
        tim = entry.get("timings", {})
        summary["entries"].append(
            {
                "method": req.get("method"),
                "url": req.get("url"),
                "status": res.get("status"),
                "statusText": res.get("statusText"),
                "mimeType": res.get("content", {}).get("mimeType"),
                "time": entry.get("time"),
                "timings": {
                    k: tim.get(k)
                    for k in ["dns", "connect", "ssl", "send", "wait", "receive"]
                },
                "size": {
                    "body": res.get("bodySize"),
                    "headers": res.get("headersSize"),
                },
            }
        )

    return {"success": True, "summary": summary}

@router.post(
    "/css/inline",
    summary="Inline CSS for email",
    description="Inline CSS into HTML markup",
)
async def css_inline(payload: CssInlinePayload):
    try:
        from premailer import transform
    except ImportError:
        raise HTTPException(status_code=500, detail="premailer not installed")

    html_inlined = transform(payload.html, base_url=payload.base_url)
    return {"success": True, "html": html_inlined}

@router.post(
    "/image/resize",
    summary="Resize or convert image (supports webp)",
    description="Resize and/or convert base64 images",
)
async def image_resize(payload: ImageResizePayload):
    try:
        from PIL import Image
    except ImportError:
        raise HTTPException(status_code=500, detail="Pillow not installed")

    try:
        raw_data = payload.data.split(",")[-1]
        img_bytes = base64.b64decode(raw_data)
        img = Image.open(io.BytesIO(img_bytes))

        target_w = payload.width or img.width
        target_h = payload.height or img.height
        img = img.resize((target_w, target_h))

        fmt = (payload.format or "jpeg").upper()
        fmt = "WEBP" if fmt.lower() == "webp" else fmt

        if fmt == "JPEG" and img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")

        out = io.BytesIO()
        save_kwargs = {"format": fmt}
        if fmt in ("JPEG", "WEBP") and payload.quality:
            save_kwargs["quality"] = payload.quality
        img.save(out, **save_kwargs)

        result = (
            f"data:image/{fmt.lower()};base64,"
            + base64.b64encode(out.getvalue()).decode("utf-8")
        )
        return {"success": True, "image": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post(
    "/lorem/generate",
    summary="Generate Lorem Ipsum",
    description="Generate placeholder text",
)
async def lorem_generate(payload: LoremIpsumPayload):
    words = [
        "lorem",
        "ipsum",
        "dolor",
        "sit",
        "amet",
        "consectetur",
        "adipiscing",
        "elit",
        "sed",
        "do",
        "eiusmod",
        "tempor",
        "incididunt",
        "ut",
        "labore",
        "et",
        "dolore",
        "magna",
        "aliqua",
        "enim",
        "ad",
        "minim",
        "veniam",
        "quis",
        "nostrud",
        "exercitation",
        "ullamco",
        "laboris",
        "nisi",
        "aliquip",
        "ex",
        "ea",
        "commodo",
        "consequat",
        "duis",
        "aute",
        "irure",
        "in",
        "reprehenderit",
        "voluptate",
        "velit",
        "esse",
        "cillum",
        "fugiat",
        "nulla",
        "pariatur",
        "excepteur",
        "sint",
        "occaecat",
        "cupidatat",
        "non",
        "proident",
        "sunt",
        "culpa",
        "qui",
        "officia",
        "deserunt",
        "mollit",
        "anim",
        "id",
        "est",
        "laborum",
    ]

    import random

    paragraphs = []

    for _ in range(min(payload.paragraphs, 20)):
        para_words = []
        for _ in range(payload.words_per_paragraph):
            para_words.append(random.choice(words))

        para_text = " ".join(para_words)
        para_text = para_text[0].upper() + para_text[1:] + "."
        paragraphs.append(para_text)

    return {
        "success": True,
        "paragraphs": paragraphs,
        "text": "\n\n".join(paragraphs),
        "word_count": sum(len(p.split()) for p in paragraphs),
    }

def count_keys(obj, count=0):
    if isinstance(obj, dict):
        count += len(obj)
        for v in obj.values():
            count = count_keys(v, count)
    elif isinstance(obj, list):
        for item in obj:
            count = count_keys(item, count)
    return count

def get_json_depth(obj, depth=0):
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
    parts = path.split(".")
    current = obj
    for part in parts:
        if part.isdigit():
            current = current[int(part)]
        else:
            current = current[part]
    return current

def get_relative_time(dt, now):
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
    parts = []
    for field, explanation in explanations.items():
        parts.append(explanation)
    return ", ".join(parts)
