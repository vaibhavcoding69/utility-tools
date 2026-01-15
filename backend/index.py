from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json
import base64
import hashlib
import secrets
import string
import re
from datetime import datetime

app = FastAPI(title="z1x Utility Tools API", version="1.0.0")

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

class HashRequest(BaseModel):
    data: str
    algorithm: Optional[str] = "sha256"

class PasswordGenerateRequest(BaseModel):
    length: Optional[int] = 16
    include_uppercase: Optional[bool] = True
    include_lowercase: Optional[bool] = True
    include_numbers: Optional[bool] = True
    include_symbols: Optional[bool] = True

class RegexTestRequest(BaseModel):
    pattern: str
    text: str
    flags: Optional[str] = ""

# ==================== Routes ====================

@app.get("/")
async def root():
    return {
        "name": "z1x Utility Tools API",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# ==================== Developer Tools ====================

@app.post("/api/developer/json/format")
async def format_json(request: JsonFormatRequest):
    """Format and validate JSON data"""
    try:
        parsed = json.loads(request.data)
        formatted = json.dumps(
            parsed,
            indent=request.indent,
            sort_keys=request.sort_keys,
            ensure_ascii=False
        )
        return {
            "success": True,
            "formatted": formatted,
            "valid": True
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": str(e),
            "valid": False
        }

@app.post("/api/developer/json/minify")
async def minify_json(request: JsonFormatRequest):
    """Minify JSON data"""
    try:
        parsed = json.loads(request.data)
        minified = json.dumps(parsed, separators=(',', ':'), ensure_ascii=False)
        return {
            "success": True,
            "minified": minified,
            "valid": True
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": str(e),
            "valid": False
        }

@app.post("/api/developer/base64/encode")
async def encode_base64(request: Base64Request):
    """Encode string to base64"""
    try:
        encoded = base64.b64encode(request.data.encode('utf-8')).decode('utf-8')
        return {
            "success": True,
            "encoded": encoded
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/developer/base64/decode")
async def decode_base64(request: Base64Request):
    """Decode base64 string"""
    try:
        decoded = base64.b64decode(request.data).decode('utf-8')
        return {
            "success": True,
            "decoded": decoded
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/developer/regex/test")
async def test_regex(request: RegexTestRequest):
    """Test regular expression against text"""
    try:
        flags_int = 0
        if 'i' in request.flags:
            flags_int |= re.IGNORECASE
        if 'm' in request.flags:
            flags_int |= re.MULTILINE
        if 's' in request.flags:
            flags_int |= re.DOTALL
        
        pattern = re.compile(request.pattern, flags_int)
        matches = pattern.finditer(request.text)
        
        match_list = []
        for match in matches:
            match_list.append({
                "match": match.group(0),
                "start": match.start(),
                "end": match.end(),
                "groups": match.groups()
            })
        
        return {
            "success": True,
            "matches": match_list,
            "count": len(match_list)
        }
    except re.error as e:
        return {
            "success": False,
            "error": str(e),
            "matches": [],
            "count": 0
        }

@app.get("/api/developer/uuid/generate")
async def generate_uuid():
    """Generate a UUID v4"""
    import uuid
    return {
        "success": True,
        "uuid": str(uuid.uuid4())
    }

# ==================== Security Tools ====================

@app.post("/api/security/hash/generate")
async def generate_hash(request: HashRequest):
    """Generate hash of input data"""
    try:
        algorithms = {
            'md5': hashlib.md5,
            'sha1': hashlib.sha1,
            'sha256': hashlib.sha256,
            'sha512': hashlib.sha512
        }
        
        if request.algorithm not in algorithms:
            raise HTTPException(status_code=400, detail=f"Unsupported algorithm: {request.algorithm}")
        
        hash_func = algorithms[request.algorithm]
        hash_value = hash_func(request.data.encode('utf-8')).hexdigest()
        
        return {
            "success": True,
            "hash": hash_value,
            "algorithm": request.algorithm
        }
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
            raise HTTPException(status_code=400, detail="At least one character type must be selected")
        
        password = ''.join(secrets.choice(chars) for _ in range(request.length))
        
        return {
            "success": True,
            "password": password,
            "length": len(password)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/security/password/strength")
async def check_password_strength(request: Base64Request):
    """Check password strength"""
    password = request.data
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
    if re.search(r'[a-z]', password):
        strength += 1
    else:
        feedback.append("Add lowercase letters")
    
    if re.search(r'[A-Z]', password):
        strength += 1
    else:
        feedback.append("Add uppercase letters")
    
    if re.search(r'\d', password):
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
        "feedback": feedback
    }

# ==================== Data Tools ====================

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
        "lines": lines
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
        "camel_case": ''.join(word.capitalize() for word in text.split())
    }

# For Vercel serverless deployment
handler = app
