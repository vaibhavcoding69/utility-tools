from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import hashlib
import secrets
import string

class PasswordOptions(BaseModel):
    length: int = 16
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_numbers: bool = True
    include_symbols: bool = True

class PasswordPayload(BaseModel):
    data: str

class HashPayload(BaseModel):
    data: str
    algorithm: str = "sha256"

class HashVerifyPayload(BaseModel):
    data: str
    algorithm: str = "sha256"
    expected: str

router = APIRouter()

@router.get("/password/generate")
async def password_generate(
    length: int = 16,
    include_uppercase: bool = True,
    include_lowercase: bool = True,
    include_numbers: bool = True,
    include_symbols: bool = True,
):
    chars = ""
    if include_lowercase:
        chars += string.ascii_lowercase
    if include_uppercase:
        chars += string.ascii_uppercase
    if include_numbers:
        chars += string.digits
    if include_symbols:
        chars += string.punctuation
    if not chars:
        raise HTTPException(status_code=400, detail="At least one character set must be selected")
    password = "".join(secrets.choice(chars) for _ in range(length))
    return {"success": True, "password": password, "length": len(password)}

@router.post("/password/strength")
async def password_strength(payload: PasswordPayload):
    pwd = payload.data
    score = 0
    feedback = []
    if len(pwd) >= 8:
        score += 1
    else:
        feedback.append("Use at least 8 characters")
    if len(pwd) >= 12:
        score += 1
    if any(c.islower() for c in pwd):
        score += 1
    else:
        feedback.append("Add lowercase letters")
    if any(c.isupper() for c in pwd):
        score += 1
    else:
        feedback.append("Add uppercase letters")
    if any(c.isdigit() for c in pwd):
        score += 1
    else:
        feedback.append("Add numbers")
    symbols = set(string.punctuation)
    if any(c in symbols for c in pwd):
        score += 1
    else:
        feedback.append("Add symbols")
    level = "weak" if score <= 2 else "medium" if score <= 4 else "strong"
    return {"success": True, "strength": level, "score": score, "max_score": 6, "feedback": feedback}

@router.post("/hash/generate")
async def hash_generate(payload: HashPayload):
    algs = {
        "md5": hashlib.md5,
        "sha1": hashlib.sha1,
        "sha256": hashlib.sha256,
        "sha512": hashlib.sha512,
    }
    if payload.algorithm not in algs:
        raise HTTPException(status_code=400, detail="Unsupported algorithm")
    h = algs[payload.algorithm](payload.data.encode("utf-8")).hexdigest()
    return {"success": True, "hash": h, "algorithm": payload.algorithm}

@router.post("/hash/verify")
async def hash_verify(payload: HashVerifyPayload):
    result = await hash_generate(HashPayload(data=payload.data, algorithm=payload.algorithm))
    ok = result["hash"] == payload.expected
    return {"success": True, "match": ok, "computed": result["hash"], "expected": payload.expected}

@router.post("/validate/email")
async def validate_email(email: EmailStr):
    return {"success": True, "valid": True, "email": email}
