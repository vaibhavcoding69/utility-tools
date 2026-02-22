from pathlib import Path

APP_TITLE = "Utility Tools API"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "A comprehensive collection of developer utilities"

USAGE_STATS_FILE = Path(__file__).resolve().parent.parent / "usage_stats.json"

TOOL_PATH_MAPPING = {
    "/api/developer/json/format": "json-format",
    "/api/developer/json/minify": "json-minify",
    "/api/developer/json/validate": "json-validate",
    "/api/developer/json/query": "json-query",
    "/api/developer/base64/encode": "base64-encode",
    "/api/developer/base64/decode": "base64-decode",
    "/api/developer/url/encode": "url-encode",
    "/api/developer/url/decode": "url-decode",
    "/api/developer/html/encode": "html-encode",
    "/api/developer/html/decode": "html-decode",
    "/api/developer/regex/test": "regex-test",
    "/api/developer/uuid/generate": "uuid-generate",
    "/api/developer/diff": "text-diff",
    "/api/developer/jwt/decode": "jwt-decode",
    "/api/developer/http/ping": "http-ping",
    "/api/developer/yaml-to-json": "yaml-to-json",
    "/api/developer/json-to-yaml": "json-to-yaml",
    "/api/developer/env/netlify": "env-netlify",
    "/api/developer/har/summary": "har-summary",
    "/api/developer/encode": "universal-encode",
    "/api/developer/decode": "universal-decode",
    "/api/developer/encodings": "list-encodings",

    "/api/security/password/generate": "password-generate",
    "/api/security/password/strength": "password-strength",
    "/api/security/password/policy": "password-policy",
    "/api/security/hash/generate": "hash-generate",
    "/api/security/hash/verify": "hash-verify",
    "/api/security/hash/all": "hash-all",
    "/api/security/hmac/generate": "hmac-generate",
    "/api/security/validate/email": "email-validate",
    "/api/security/secret/generate": "secret-generate",

    "/api/data/csv-to-json": "csv-to-json",
    "/api/data/json-to-csv": "json-to-csv",
    "/api/data/sql/format": "sql-format",
    "/api/data/sql/minify": "sql-minify",
    "/api/data/fake/generate": "fake-data",
    "/api/data/base/convert": "base-convert",
    "/api/data/text/word-count": "word-count",
    "/api/data/text/case-convert": "case-convert",
    "/api/data/random/string": "random-string",
}

SUPPORTED_HASH_ALGORITHMS = [
    "md5", "sha1", "sha256", "sha384", "sha512",
    "blake2b", "blake2s"
]

SUPPORTED_ENCODINGS = {
    "rotation": ["rot13", "rot5", "rot47", "caesar"],
    "substitution": ["vigenere", "atbash", "a1z26", "bacon", "reverse", "xor"],
    "transposition": ["rail-fence"],
    "hashes": ["md5-hash", "sha1-hash", "sha256-hash", "sha512-hash"],
    "base": ["base64", "base32", "hex"],
    "url": ["url-encode", "url-decode"],
}

CORS_ORIGINS = ["*"]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ["*"]
CORS_ALLOW_HEADERS = ["*"]

RATE_LIMIT_REQUESTS = 100

HTTP_TIMEOUT = 10.0
DEFAULT_UUID_COUNT = 1
DEFAULT_FAKE_DATA_COUNT = 5
DEFAULT_PASSWORD_LENGTH = 16
DEFAULT_RANDOM_STRING_LENGTH = 16
DEFAULT_SECRET_LENGTH = 32

MAX_UUID_COUNT = 100
MAX_FAKE_DATA_COUNT = 100
MAX_PASSWORD_LENGTH = 128
MAX_RANDOM_STRING_LENGTH = 1024
MAX_SECRET_LENGTH = 128
MAX_HAR_ENTRIES = 50
