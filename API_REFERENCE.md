# Utility Tools API

**Base URL:** `https://your-domain.vercel.app/api` | **Dev:** `http://localhost:8000/api`

## Quick Reference

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Health** | `/health` | GET | Health check |
| **Data** | `/data/csv-to-json` | POST | CSV → JSON |
| | `/data/json-to-csv` | POST | JSON → CSV |
| | `/data/sql/format` | POST | Format SQL |
| | `/data/sql/minify` | POST | Minify SQL |
| | `/data/fake/generate` | POST | Generate fake data |
| | `/data/base/convert` | POST | Convert number bases |
| | `/data/text/word-count` | POST | Count words/chars |
| | `/data/text/case-convert` | POST | Convert text case |
| | `/data/random/string` | POST | Generate random string |
| **Developer** | `/developer/json/format` | POST | Format JSON |
| | `/developer/json/minify` | POST | Minify JSON |
| | `/developer/json/validate` | POST | Validate JSON |
| | `/developer/json/query` | POST | Query JSON |
| | `/developer/base64/encode` | POST | Base64 encode |
| | `/developer/base64/decode` | POST | Base64 decode |
| | `/developer/url/encode` | POST | URL encode |
| | `/developer/url/decode` | POST | URL decode |
| | `/developer/html/encode` | POST | HTML encode |
| | `/developer/html/decode` | POST | HTML decode |
| | `/developer/regex/test` | POST | Test regex |
| | `/developer/uuid/generate` | GET | Generate UUID(s) |
| | `/developer/diff` | POST | Compare texts |
| | `/developer/jwt/decode` | POST | Decode JWT |
| | `/developer/http/ping` | POST | Ping URL |
| | `/developer/yaml-to-json` | POST | YAML → JSON |
| | `/developer/json-to-yaml` | POST | JSON → YAML |
| | `/developer/env/netlify` | POST | .env → netlify.toml |
| | `/developer/har/summary` | POST | Summarize HAR |
| | `/developer/encode` | POST | Encode text |
| | `/developer/decode` | POST | Decode text |
| | `/developer/encodings` | GET | List encodings |
| **Security** | `/security/password/generate` | POST | Generate password |
| | `/security/password/strength` | POST | Check strength |
| | `/security/password/policy` | POST | Check policy |
| | `/security/hash/generate` | POST | Generate hash |
| | `/security/hash/verify` | POST | Verify hash |
| | `/security/hash/all` | POST | All hash algorithms |
| | `/security/hmac/generate` | POST | Generate HMAC |
| | `/security/validate/email` | POST | Validate email |
| | `/security/secret/generate` | POST | Generate token |

## Quick Start

```bash
# Health check
curl http://localhost:8000/api/health

# Format JSON
curl -X POST http://localhost:8000/api/developer/json/format \
  -H "Content-Type: application/json" \
  -d '{"data": "{\"name\":\"John\",\"age\":30}"}'

# Generate password
curl -X POST http://localhost:8000/api/security/password/generate \
  -H "Content-Type: application/json" \
  -d '{"length": 16}'
```

## Core Examples

### Data Tools
```bash
# CSV to JSON
curl -X POST "http://localhost:8000/api/data/csv-to-json" \
  -H "Content-Type: application/json" \
  -d '{"data": "name,age\nJohn,30\nJane,25"}'

# Format SQL
curl -X POST "http://localhost:8000/api/data/sql/format" \
  -H "Content-Type: application/json" \
  -d '{"data": "select id,name from users"}'

# Word count
curl -X POST "http://localhost:8000/api/data/text/word-count" \
  -H "Content-Type: application/json" \
  -d '{"data": "Hello world\nThis is a test"}'
```

### Developer Tools
```bash
# Format JSON
curl -X POST "http://localhost:8000/api/developer/json/format" \
  -H "Content-Type: application/json" \
  -d '{"data": "{\"name\":\"John\",\"age\":30}", "indent": 2}'

# Base64 encode
curl -X POST "http://localhost:8000/api/developer/base64/encode" \
  -H "Content-Type: application/json" \
  -d '{"data": "Hello World"}'

# Test regex
curl -X POST "http://localhost:8000/api/developer/regex/test" \
  -H "Content-Type: application/json" \
  -d '{"pattern": "\\d+", "text": "abc123def456"}'

# Generate UUID
curl -X GET "http://localhost:8000/api/developer/uuid/generate?count=3"

# Ping URL
curl -X POST "http://localhost:8000/api/developer/http/ping" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://httpbin.org/get"}'
```

### Security Tools
```bash
# Generate password
curl -X POST "http://localhost:8000/api/security/password/generate" \
  -H "Content-Type: application/json" \
  -d '{"length": 16, "include_symbols": true}'

# Check password strength
curl -X POST "http://localhost:8000/api/security/password/strength" \
  -H "Content-Type: application/json" \
  -d '{"data": "MyPassword123!"}'

# Generate hash
curl -X POST "http://localhost:8000/api/security/hash/generate" \
  -H "Content-Type: application/json" \
  -d '{"data": "mypassword", "algorithm": "sha256"}'

# Validate email
curl -X POST "http://localhost:8000/api/security/validate/email" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

## Response Format

**Success:**
```json
{
  "success": true,
  "result": "...",
  "...": "..."
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "detail": "..."
}
```

## Status Codes
- `200` - Success
- `400` - Bad request
- `422` - Validation error
- `429` - Rate limited
- `500` - Server error

## Support
[GitHub Repository](https://github.com/vaibhavcoding69/utility-tools)
