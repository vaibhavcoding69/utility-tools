from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class HealthResponse(BaseModel):
    status: str
    timestamp: Optional[str] = None

class StatsResponse(BaseModel):
    success: bool
    count: Optional[int] = None
    tools: Optional[list] = None

class JsonFormatRequest(BaseModel):
    data: str = Field(..., description="JSON string to format")
    indent: Optional[int] = Field(2, description="Indentation level (0-8)")
    sort_keys: Optional[bool] = Field(False, description="Sort object keys alphabetically")

class Base64Request(BaseModel):
    data: str = Field(..., description="Data to encode/decode")
    url_safe: Optional[bool] = Field(False, description="Use URL-safe Base64")

class UrlRequest(BaseModel):
    data: str = Field(..., description="URL string to encode/decode")

class HtmlRequest(BaseModel):
    data: str = Field(..., description="HTML content to encode/decode")

class RegexTestRequest(BaseModel):
    pattern: str = Field(..., description="Regular expression pattern")
    text: str = Field(..., description="Text to search in")
    flags: Optional[str] = Field("", description="Regex flags (g, i, m, s)")

class UuidGenerateRequest(BaseModel):
    version: Optional[int] = Field(4, description="UUID version (1 or 4)")
    count: Optional[int] = Field(1, description="Number of UUIDs to generate (1-100)")

class DiffRequest(BaseModel):
    original: str = Field(..., description="Original text")
    modified: str = Field(..., description="Modified text")
    context_lines: Optional[int] = Field(3, description="Context lines around changes")

class JwtDecodeRequest(BaseModel):
    token: str = Field(..., description="JWT token to decode")

class HttpPingRequest(BaseModel):
    url: str = Field(..., description="URL to ping")
    method: Optional[str] = Field("GET", description="HTTP method")
    timeout: Optional[float] = Field(10.0, description="Request timeout in seconds")

class YamlJsonRequest(BaseModel):
    data: str = Field(..., description="YAML or JSON string to convert")

class EnvNetlifyRequest(BaseModel):
    data: str = Field(..., description=".env file content")
    site_name: Optional[str] = Field(None, description="Netlify site name")

class HarSummaryRequest(BaseModel):
    data: str = Field(..., description="HAR file content as JSON string")
    max_entries: Optional[int] = Field(50, description="Maximum entries to process")

class EncodeRequest(BaseModel):
    data: str = Field(..., description="Text to encode")
    encoding: str = Field(..., description="Encoding type")
    options: Optional[Dict[str, Any]] = Field(None, description="Additional encoding options")

class DecodeRequest(BaseModel):
    data: str = Field(..., description="Text to decode")
    encoding: str = Field(..., description="Encoding type used")
    options: Optional[Dict[str, Any]] = Field(None, description="Additional decoding options")

class HashRequest(BaseModel):
    data: str = Field(..., description="Data to hash")
    algorithm: Optional[str] = Field("sha256", description="Hash algorithm")

class HashVerifyRequest(BaseModel):
    data: str = Field(..., description="Original data")
    hash: str = Field(..., description="Hash to verify against")
    algorithm: Optional[str] = Field("sha256", description="Hash algorithm used")

class HmacRequest(BaseModel):
    data: str = Field(..., description="Data to authenticate")
    key: str = Field(..., description="Secret key")
    algorithm: Optional[str] = Field("sha256", description="HMAC algorithm")

class PasswordGenerateRequest(BaseModel):
    length: Optional[int] = Field(16, description="Password length (8-128)")
    include_uppercase: Optional[bool] = Field(True, description="Include uppercase letters")
    include_lowercase: Optional[bool] = Field(True, description="Include lowercase letters")
    include_numbers: Optional[bool] = Field(True, description="Include numbers")
    include_symbols: Optional[bool] = Field(True, description="Include special symbols")

class PasswordStrengthRequest(BaseModel):
    data: str = Field(..., description="Password to analyze")

class PasswordPolicyRequest(BaseModel):
    data: str = Field(..., description="Password to validate")
    min_length: Optional[int] = Field(8, description="Minimum password length")
    require_uppercase: Optional[bool] = Field(True, description="Require uppercase letters")
    require_lowercase: Optional[bool] = Field(True, description="Require lowercase letters")
    require_numbers: Optional[bool] = Field(True, description="Require numbers")
    require_symbols: Optional[bool] = Field(True, description="Require special symbols")

class EmailValidateRequest(BaseModel):
    email: str = Field(..., description="Email address to validate")

class SecretGenerateRequest(BaseModel):
    length: Optional[int] = Field(32, description="Token length in bytes (16-128)")
    encoding: Optional[str] = Field("hex", description="Output encoding (hex, base64, base64url)")

class CsvToJsonRequest(BaseModel):
    data: str = Field(..., description="CSV content with headers in first row")

class JsonToCsvRequest(BaseModel):
    data: str = Field(..., description="JSON string containing array of objects")

class SqlFormatRequest(BaseModel):
    data: str = Field(..., description="SQL query to format")

class SqlMinifyRequest(BaseModel):
    data: str = Field(..., description="SQL query to minify")

class FakeDataRequest(BaseModel):
    data_type: Optional[str] = Field("person", description="Type of data to generate")
    count: Optional[int] = Field(5, description="Number of items to generate (1-100)")
    locale: Optional[str] = Field("en_US", description="Locale for generated data")

class BaseConvertRequest(BaseModel):
    value: str = Field(..., description="Number to convert")
    from_base: int = Field(..., description="Source base (2-36)")
    to_base: int = Field(..., description="Target base (2-36)")

class WordCountRequest(BaseModel):
    data: str = Field(..., description="Text to analyze")

class CaseConvertRequest(BaseModel):
    data: str = Field(..., description="Text to convert")

class RandomStringRequest(BaseModel):
    length: Optional[int] = Field(16, description="String length (1-1024)")
    uppercase: Optional[bool] = Field(True, description="Include uppercase letters")
    lowercase: Optional[bool] = Field(True, description="Include lowercase letters")
    digits: Optional[bool] = Field(True, description="Include digits")
    symbols: Optional[bool] = Field(False, description="Include special symbols")

class ApiResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    message: Optional[str] = None
