from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
import hashlib
import secrets
import string
import re
import base64
import hmac

class PasswordGenerateOptions(BaseModel):
    length: int = Field(16, ge=4, le=128)
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_numbers: bool = True
    include_symbols: bool = True
    exclude_ambiguous: bool = False
    count: int = Field(1, ge=1, le=50)

class PasswordPayload(BaseModel):
    password: str

class HashPayload(BaseModel):
    data: str
    algorithm: str = "sha256"
    encoding: str = "hex"

class HashVerifyPayload(BaseModel):
    data: str
    hash: str
    algorithm: str = "sha256"

class HmacPayload(BaseModel):
    data: str
    key: str
    algorithm: str = "sha256"

class EmailValidatePayload(BaseModel):
    email: str

class EncryptPayload(BaseModel):
    data: str
    key: str

class SecretTokenPayload(BaseModel):
    length: int = Field(32, ge=8, le=256)
    format: str = "hex"

class ChecksumPayload(BaseModel):
    data: str
    algorithm: str = "crc32"

class OTPPayload(BaseModel):
    secret: Optional[str] = None
    digits: int = Field(6, ge=6, le=8)
    period: int = 30

class PasswordPolicyPayload(BaseModel):
    password: str
    min_length: int = 8
    require_uppercase: bool = True
    require_lowercase: bool = True
    require_numbers: bool = True
    require_symbols: bool = False
    max_repeated: int = 3
    banned_words: Optional[List[str]] = None

router = APIRouter()

@router.get("/password/generate", summary="Generate Password")
async def password_generate(
    length: int = Query(16, ge=4, le=128),
    include_uppercase: bool = Query(True),
    include_lowercase: bool = Query(True),
    include_numbers: bool = Query(True),
    include_symbols: bool = Query(True),
    exclude_ambiguous: bool = Query(False),
    count: int = Query(1, ge=1, le=50),
):
    chars = ""
    char_sets_used = []

    if include_lowercase:
        lowercase = string.ascii_lowercase
        if exclude_ambiguous:
            lowercase = lowercase.replace("l", "").replace("o", "")
        chars += lowercase
        char_sets_used.append("lowercase")

    if include_uppercase:
        uppercase = string.ascii_uppercase
        if exclude_ambiguous:
            uppercase = uppercase.replace("I", "").replace("O", "")
        chars += uppercase
        char_sets_used.append("uppercase")

    if include_numbers:
        digits = string.digits
        if exclude_ambiguous:
            digits = digits.replace("0", "").replace("1", "")
        chars += digits
        char_sets_used.append("numbers")

    if include_symbols:
        symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        chars += symbols
        char_sets_used.append("symbols")

    if not chars:
        raise HTTPException(
            status_code=400, detail="At least one character set must be selected"
        )

    passwords = []
    for _ in range(count):
        password_chars = []
        if include_lowercase:
            password_chars.append(secrets.choice(string.ascii_lowercase))
        if include_uppercase:
            password_chars.append(secrets.choice(string.ascii_uppercase))
        if include_numbers:
            password_chars.append(secrets.choice(string.digits))
        if include_symbols:
            password_chars.append(secrets.choice("!@#$%^&*()_+-=[]{}|;:,.<>?"))

        remaining = length - len(password_chars)
        password_chars.extend(secrets.choice(chars) for _ in range(remaining))
        secrets.SystemRandom().shuffle(password_chars)
        passwords.append("".join(password_chars[:length]))

    entropy = len(passwords[0]) * (len(chars).bit_length())
    result = {
        "success": True,
        "length": length,
        "character_sets": char_sets_used,
        "charset_size": len(chars),
        "entropy_bits": entropy,
    }

    if count == 1:
        result["password"] = passwords[0]
    else:
        result["passwords"] = passwords
        result["count"] = len(passwords)

    return result

@router.post("/password/generate", summary="Generate Password (POST)")
async def password_generate_post(options: PasswordGenerateOptions):
    return await password_generate(
        options.length,
        options.include_uppercase,
        options.include_lowercase,
        options.include_numbers,
        options.include_symbols,
        options.exclude_ambiguous,
        options.count,
    )

@router.post("/password/strength", summary="Check Password Strength")
async def password_strength(payload: PasswordPayload):
    pwd = payload.password
    score, max_score, feedback, warnings = 0, 10, [], []
    length = len(pwd)

    if length >= 8:
        score += 1
    else:
        feedback.append("Use at least 8 characters")
    if length >= 12:
        score += 1
    elif length < 12:
        feedback.append("Consider using 12+ characters")
    if length >= 16:
        score += 1

    has_lower = bool(re.search(r"[a-z]", pwd))
    has_upper = bool(re.search(r"[A-Z]", pwd))
    has_digit = bool(re.search(r"\d", pwd))
    has_symbol = bool(re.search(r"[!@#$%^&*()_+\-=\[\]{}|;':\",./<>?]", pwd))

    if has_lower:
        score += 1
    else:
        feedback.append("Add lowercase letters")
    if has_upper:
        score += 1
    else:
        feedback.append("Add uppercase letters")
    if has_digit:
        score += 1
    else:
        feedback.append("Add numbers")
    if has_symbol:
        score += 1
    else:
        feedback.append("Add special characters")

    common_patterns = [r"^123", r"abc", r"qwerty", r"password", r"(.)\1{2,}"]
    if not any(re.search(p, pwd, re.IGNORECASE) for p in common_patterns):
        score += 1
    else:
        warnings.append("Contains common patterns")

    sequential = any(
        ord(pwd[i]) + 1 == ord(pwd[i + 1]) == ord(pwd[i + 2]) - 1
        for i in range(len(pwd) - 2)
    )
    if not sequential:
        score += 1
    else:
        warnings.append("Contains sequential characters")

    charset_size = (
        (26 if has_lower else 0)
        + (26 if has_upper else 0)
        + (10 if has_digit else 0)
        + (32 if has_symbol else 0)
    )
    entropy = length * (charset_size.bit_length() if charset_size > 0 else 0)

    strength = (
        "weak"
        if score <= 3
        else (
            "fair"
            if score <= 5
            else "good" if score <= 7 else "strong" if score <= 9 else "very_strong"
        )
    )
    color = (
        "red"
        if score <= 3
        else "orange" if score <= 5 else "yellow" if score <= 7 else "green"
    )

    guesses_per_second = 10_000_000_000
    possible = charset_size**length if charset_size > 0 else 1
    secs = possible / guesses_per_second
    crack_time = (
        "instantly"
        if secs < 1
        else (
            f"{int(secs)} seconds"
            if secs < 60
            else (
                f"{int(secs/60)} minutes"
                if secs < 3600
                else (
                    f"{int(secs/3600)} hours"
                    if secs < 86400
                    else (
                        f"{int(secs/86400)} days"
                        if secs < 31536000
                        else (
                            f"{int(secs/31536000)} years"
                            if secs < 31536000 * 100
                            else "centuries"
                        )
                    )
                )
            )
        )
    )

    return {
        "success": True,
        "strength": strength,
        "score": score,
        "max_score": max_score,
        "percentage": int((score / max_score) * 100),
        "color": color,
        "length": length,
        "entropy_bits": entropy,
        "crack_time_estimate": crack_time,
        "character_analysis": {
            "has_lowercase": has_lower,
            "has_uppercase": has_upper,
            "has_numbers": has_digit,
            "has_symbols": has_symbol,
            "charset_size": charset_size,
        },
        "feedback": feedback,
        "warnings": warnings,
    }

@router.post("/password/policy", summary="Check Password Policy")
async def password_policy(payload: PasswordPolicyPayload):
    pwd, violations, passed = payload.password, [], []

    if len(pwd) >= payload.min_length:
        passed.append(f"Length >= {payload.min_length}")
    else:
        violations.append(f"Must be at least {payload.min_length} characters")

    if payload.require_uppercase:
        if re.search(r"[A-Z]", pwd):
            passed.append("Contains uppercase")
        else:
            violations.append("Must contain uppercase letter")
    if payload.require_lowercase:
        if re.search(r"[a-z]", pwd):
            passed.append("Contains lowercase")
        else:
            violations.append("Must contain lowercase letter")
    if payload.require_numbers:
        if re.search(r"\d", pwd):
            passed.append("Contains numbers")
        else:
            violations.append("Must contain number")
    if payload.require_symbols:
        if re.search(r"[!@#$%^&*()_+\-=\[\]{}|;':\",./<>?]", pwd):
            passed.append("Contains symbols")
        else:
            violations.append("Must contain special character")

    if re.search(f"(.)\\1{{{payload.max_repeated},}}", pwd):
        violations.append(f"Too many repeated characters")
    else:
        passed.append("No excessive repetition")

    if payload.banned_words:
        for word in payload.banned_words:
            if word.lower() in pwd.lower():
                violations.append(f"Contains banned word: {word}")

    return {
        "success": True,
        "valid": len(violations) == 0,
        "violations": violations,
        "passed": passed,
    }

@router.post("/hash/generate", summary="Generate Hash")
async def hash_generate(payload: HashPayload):
    algorithms = {
        "md5": hashlib.md5,
        "sha1": hashlib.sha1,
        "sha224": hashlib.sha224,
        "sha256": hashlib.sha256,
        "sha384": hashlib.sha384,
        "sha512": hashlib.sha512,
        "blake2b": hashlib.blake2b,
        "blake2s": hashlib.blake2s,
        "sha3_256": hashlib.sha3_256,
        "sha3_512": hashlib.sha3_512,
    }

    alg = payload.algorithm.lower()
    if alg not in algorithms:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported algorithm. Available: {', '.join(algorithms.keys())}",
        )

    hash_obj = algorithms[alg](payload.data.encode("utf-8"))
    hash_value = (
        base64.b64encode(hash_obj.digest()).decode("utf-8")
        if payload.encoding == "base64"
        else hash_obj.hexdigest()
    )

    return {
        "success": True,
        "hash": hash_value,
        "algorithm": alg,
        "encoding": payload.encoding,
        "input_length": len(payload.data),
        "digest_size_bytes": hash_obj.digest_size,
    }

@router.post("/hash/verify", summary="Verify Hash")
async def hash_verify(payload: HashVerifyPayload):
    algorithms = {
        "md5": hashlib.md5,
        "sha1": hashlib.sha1,
        "sha256": hashlib.sha256,
        "sha384": hashlib.sha384,
        "sha512": hashlib.sha512,
        "blake2b": hashlib.blake2b,
        "blake2s": hashlib.blake2s,
    }

    alg = payload.algorithm.lower()
    if alg not in algorithms:
        raise HTTPException(status_code=400, detail="Unsupported algorithm")

    computed = algorithms[alg](payload.data.encode("utf-8")).hexdigest()
    match = hmac.compare_digest(computed.lower(), payload.hash.lower())

    return {
        "success": True,
        "match": match,
        "algorithm": alg,
        "computed_hash": computed,
        "provided_hash": payload.hash,
    }

@router.post("/hash/all", summary="Generate All Hashes")
async def hash_all(payload: HashPayload):
    data_bytes = payload.data.encode("utf-8")
    results = {
        name: func(data_bytes).hexdigest()
        for name, func in [
            ("md5", hashlib.md5),
            ("sha1", hashlib.sha1),
            ("sha256", hashlib.sha256),
            ("sha384", hashlib.sha384),
            ("sha512", hashlib.sha512),
            ("blake2b", hashlib.blake2b),
            ("blake2s", hashlib.blake2s),
        ]
    }
    return {"success": True, "hashes": results, "input_length": len(payload.data)}

@router.post("/hmac/generate", summary="Generate HMAC")
async def hmac_generate(payload: HmacPayload):
    algorithms = {
        "sha256": hashlib.sha256,
        "sha384": hashlib.sha384,
        "sha512": hashlib.sha512,
    }
    alg = payload.algorithm.lower()
    if alg not in algorithms:
        raise HTTPException(status_code=400, detail="Supported: sha256, sha384, sha512")

    signature = hmac.new(
        payload.key.encode("utf-8"), payload.data.encode("utf-8"), algorithms[alg]
    ).hexdigest()
    return {
        "success": True,
        "signature": signature,
        "algorithm": alg,
        "signature_base64": base64.b64encode(bytes.fromhex(signature)).decode("utf-8"),
    }

@router.post("/validate/email", summary="Validate Email")
async def validate_email(payload: EmailValidatePayload):
    email = payload.email.strip()
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    basic_valid = bool(re.match(pattern, email))
    issues = []

    if not basic_valid:
        issues.append("Invalid email format")
    if email.count("@") != 1:
        issues.append("Must contain exactly one @ symbol")
    elif "@" in email:
        local, domain = email.rsplit("@", 1)
        if len(local) == 0:
            issues.append("Local part is empty")
        elif len(local) > 64:
            issues.append("Local part exceeds 64 characters")
        if len(domain) == 0:
            issues.append("Domain is empty")
        elif "." not in domain:
            issues.append("Domain must contain a dot")
        if ".." in email:
            issues.append("Cannot contain consecutive dots")

    domain = email.split("@")[-1].lower() if "@" in email else ""
    disposable_domains = [
        "tempmail.com",
        "throwaway.email",
        "guerrillamail.com",
        "10minutemail.com",
    ]

    return {
        "success": True,
        "email": email,
        "valid": basic_valid and len(issues) == 0,
        "issues": issues,
        "is_disposable": domain in disposable_domains,
        "local_part": email.split("@")[0] if "@" in email else None,
        "domain": domain or None,
    }

@router.post("/secret/generate", summary="Generate Secret Token")
async def secret_generate(payload: SecretTokenPayload):
    length = min(payload.length, 256)
    token_bytes = secrets.token_bytes(length)

    if payload.format == "base64":
        token = base64.b64encode(token_bytes).decode("utf-8")
    elif payload.format == "urlsafe":
        token = base64.urlsafe_b64encode(token_bytes).decode("utf-8").rstrip("=")
    else:
        token = token_bytes.hex()

    return {
        "success": True,
        "token": token,
        "format": payload.format,
        "bytes": length,
        "entropy_bits": length * 8,
    }

@router.get("/secret/api-key", summary="Generate API Key")
async def generate_api_key(
    prefix: str = Query("sk"), length: int = Query(32, ge=16, le=64)
):
    token = secrets.token_hex(length)
    return {
        "success": True,
        "api_key": f"{prefix}_{token}",
        "prefix": prefix,
        "length": len(f"{prefix}_{token}"),
    }

@router.post("/checksum/calculate", summary="Calculate Checksum")
async def checksum_calculate(payload: ChecksumPayload):
    import zlib

    data_bytes = payload.data.encode("utf-8")
    alg = payload.algorithm.lower()

    if alg == "crc32":
        checksum = format(zlib.crc32(data_bytes) & 0xFFFFFFFF, "08x")
    elif alg == "adler32":
        checksum = format(zlib.adler32(data_bytes) & 0xFFFFFFFF, "08x")
    elif alg == "md5":
        checksum = hashlib.md5(data_bytes).hexdigest()
    elif alg == "sha256":
        checksum = hashlib.sha256(data_bytes).hexdigest()
    else:
        raise HTTPException(
            status_code=400, detail="Supported: crc32, adler32, md5, sha256"
        )

    return {
        "success": True,
        "checksum": checksum,
        "algorithm": alg,
        "input_length": len(payload.data),
    }

@router.post("/encrypt/xor", summary="XOR Encrypt")
async def xor_encrypt(payload: EncryptPayload):
    data, key = payload.data, payload.key
    extended_key = (key * (len(data) // len(key) + 1))[: len(data)]
    encrypted = "".join(chr(ord(d) ^ ord(k)) for d, k in zip(data, extended_key))
    return {
        "success": True,
        "encrypted": base64.b64encode(encrypted.encode("latin-1")).decode("utf-8"),
        "warning": "XOR is NOT secure for production",
    }

@router.post("/decrypt/xor", summary="XOR Decrypt")
async def xor_decrypt(payload: EncryptPayload):
    try:
        encrypted = base64.b64decode(payload.data).decode("latin-1")
        key = payload.key
        extended_key = (key * (len(encrypted) // len(key) + 1))[: len(encrypted)]
        return {
            "success": True,
            "decrypted": "".join(
                chr(ord(e) ^ ord(k)) for e, k in zip(encrypted, extended_key)
            ),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/otp/generate", summary="Generate TOTP")
async def otp_generate(payload: OTPPayload):
    import time

    secret = payload.secret or base64.b32encode(secrets.token_bytes(20)).decode(
        "utf-8"
    ).rstrip("=")
    current_time = int(time.time())
    counter = current_time // payload.period

    key = base64.b32decode(secret + "=" * ((8 - len(secret) % 8) % 8))
    msg = counter.to_bytes(8, "big")
    hmac_hash = hmac.new(key, msg, hashlib.sha1).digest()

    offset = hmac_hash[-1] & 0x0F
    code = (
        ((hmac_hash[offset] & 0x7F) << 24)
        | ((hmac_hash[offset + 1] & 0xFF) << 16)
        | ((hmac_hash[offset + 2] & 0xFF) << 8)
        | (hmac_hash[offset + 3] & 0xFF)
    )
    otp = str(code % (10**payload.digits)).zfill(payload.digits)

    return {
        "success": True,
        "secret": secret,
        "current_code": otp,
        "digits": payload.digits,
        "period": payload.period,
        "time_remaining": payload.period - (current_time % payload.period),
        "provisioning_uri": f"otpauth://totp/UtilityTools:user?secret={secret}&issuer=UtilityTools&digits={payload.digits}&period={payload.period}",
    }

class UrlShortenPayload(BaseModel):
    url: str
    custom_slug: Optional[str] = None

class FileMetadataPayload(BaseModel):
    file_data: str
    file_name: str

import json
import os

URL_STORE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "url_store.json")

def load_url_store():
    try:
        if os.path.exists(URL_STORE_FILE):
            with open(URL_STORE_FILE, "r") as f:
                return json.load(f)
    except:
        pass
    return {}

def save_url_store(store):
    try:
        with open(URL_STORE_FILE, "w") as f:
            json.dump(store, f)
    except:
        pass

url_store = load_url_store()

@router.post("/url/shorten", summary="Shorten a URL")
async def shorten_url(payload: UrlShortenPayload):
    import string
    import random
    
    try:
        if not payload.url.startswith(("http://", "https://")):
            raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
        
        slug = payload.custom_slug or "".join(random.choices(string.ascii_letters + string.digits, k=8))
        
        if slug in url_store:
            if url_store[slug] != payload.url:
                raise HTTPException(status_code=409, detail="Slug already exists for a different URL")
        else:
            url_store[slug] = payload.url
            save_url_store(url_store)
        
        return {
            "success": True,
            "short_url": f"/u/{slug}",
            "slug": slug,
            "original_url": payload.url,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/url/lookup/{slug}", summary="Look up short URL")
async def lookup_url(slug: str):
    if slug in url_store:
        return {"success": True, "url": url_store[slug], "slug": slug}
    else:
        raise HTTPException(status_code=404, detail="Short URL not found")

@router.get("/url/{slug}", summary="Redirect short URL")
async def redirect_url(slug: str):
    from fastapi.responses import RedirectResponse
    
    if slug in url_store:
        return RedirectResponse(url=url_store[slug], status_code=301)
    else:
        raise HTTPException(status_code=404, detail="Short URL not found")

@router.post("/metadata/file", summary="Analyze file metadata")
async def file_metadata(payload: FileMetadataPayload):
    try:
        import mimetypes
        import struct
        
        file_name = payload.file_name
        file_data = payload.file_data
        
        try:
            file_bytes = base64.b64decode(file_data)
        except:
            file_bytes = file_data.encode() if isinstance(file_data, str) else file_data
        
        _, ext = file_name.rsplit(".", 1) if "." in file_name else (file_name, "")
        
        mime_type, _ = mimetypes.guess_type(file_name)
        
        metadata = {
            "success": True,
            "file_name": file_name,
            "file_size_bytes": len(file_bytes),
            "extension": ext.lower(),
            "mime_type": mime_type or "application/octet-stream",
        }
        
        if mime_type and mime_type.startswith("image/"):
            metadata["type"] = "image"
            
            if mime_type == "image/jpeg":
                dimensions = extract_jpeg_dimensions(file_bytes)
                if dimensions:
                    metadata["width"], metadata["height"] = dimensions
            elif mime_type == "image/png":
                dimensions = extract_png_dimensions(file_bytes)
                if dimensions:
                    metadata["width"], metadata["height"] = dimensions
            elif mime_type == "image/gif":
                dimensions = extract_gif_dimensions(file_bytes)
                if dimensions:
                    metadata["width"], metadata["height"] = dimensions
        
        elif mime_type == "application/pdf":
            metadata["type"] = "pdf"
            try:
                page_count = file_bytes.count(b"/Type/Page")
                if page_count > 0:
                    metadata["pages"] = page_count
            except:
                pass
        
        elif mime_type == "application/json":
            metadata["type"] = "json"
            try:
                content = file_bytes.decode("utf-8")
                import json
                json_data = json.loads(content)
                metadata["valid_json"] = True
                metadata["keys"] = list(json_data.keys()) if isinstance(json_data, dict) else None
            except:
                metadata["valid_json"] = False
        
        elif mime_type and mime_type.startswith("text/"):
            metadata["type"] = "text"
            try:
                content = file_bytes.decode("utf-8")
                metadata["line_count"] = content.count("\n") + 1
                metadata["character_count"] = len(content)
            except:
                try:
                    content = file_bytes.decode("latin-1")
                    metadata["line_count"] = content.count("\n") + 1
                    metadata["character_count"] = len(content)
                except:
                    pass
        
        else:
            metadata["type"] = "binary"
        
        return metadata
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def extract_jpeg_dimensions(data: bytes):
    """Extract width and height from JPEG file"""
    try:
        offset = 0
        while offset < len(data):
            offset = data.find(b"\xff", offset)
            if offset == -1:
                break
            marker = data[offset + 1]
            if marker == 0xc0 or marker == 0xc1 or marker == 0xc2:
                height = (data[offset + 5] << 8) + data[offset + 6]
                width = (data[offset + 7] << 8) + data[offset + 8]
                return (width, height)
            offset += 2
    except:
        pass
    return None

def extract_png_dimensions(data: bytes):
    """Extract width and height from PNG file"""
    try:
        if data.startswith(b"\x89PNG"):
            width = int.from_bytes(data[16:20], "big")
            height = int.from_bytes(data[20:24], "big")
            return (width, height)
    except:
        pass
    return None

def extract_gif_dimensions(data: bytes):
    """Extract width and height from GIF file"""
    try:
        if data[:3] in (b"GIF87a", b"GIF89a"):
            width = int.from_bytes(data[6:8], "little")
            height = int.from_bytes(data[8:10], "little")
            return (width, height)
    except:
        pass
    return None
