# API Documentation

## Base URL
- Production: `https://your-domain.vercel.app/api`
- Development: `http://localhost:8000/api`

## Endpoints

### Health Check
```
GET /api/health
```
Returns the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-13T02:43:52.571071"
}
```

---

### Developer Tools

#### Format JSON
```
POST /api/developer/json/format
```
Format and validate JSON data.

**Request Body:**
```json
{
  "data": "{\"key\":\"value\"}",
  "indent": 2,
  "sort_keys": false
}
```

**Response:**
```json
{
  "success": true,
  "formatted": "{\n  \"key\": \"value\"\n}",
  "valid": true
}
```

#### Minify JSON
```
POST /api/developer/json/minify
```
Minify JSON data.

**Request Body:**
```json
{
  "data": "{\n  \"key\": \"value\"\n}"
}
```

**Response:**
```json
{
  "success": true,
  "minified": "{\"key\":\"value\"}",
  "valid": true
}
```

#### Encode Base64
```
POST /api/developer/base64/encode
```
Encode string to Base64.

**Request Body:**
```json
{
  "data": "Hello World"
}
```

**Response:**
```json
{
  "success": true,
  "encoded": "SGVsbG8gV29ybGQ="
}
```

#### Decode Base64
```
POST /api/developer/base64/decode
```
Decode Base64 string.

**Request Body:**
```json
{
  "data": "SGVsbG8gV29ybGQ="
}
```

**Response:**
```json
{
  "success": true,
  "decoded": "Hello World"
}
```

#### Test Regex
```
POST /api/developer/regex/test
```
Test regular expression against text.

**Request Body:**
```json
{
  "pattern": "\\d+",
  "text": "Hello 123 World 456",
  "flags": "g"
}
```

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "match": "123",
      "start": 6,
      "end": 9,
      "groups": []
    },
    {
      "match": "456",
      "start": 16,
      "end": 19,
      "groups": []
    }
  ],
  "count": 2
}
```

#### Generate UUID
```
GET /api/developer/uuid/generate
```
Generate a UUID v4.

**Response:**
```json
{
  "success": true,
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### Security Tools

#### Generate Hash
```
POST /api/security/hash/generate
```
Generate hash of input data.

**Request Body:**
```json
{
  "data": "password123",
  "algorithm": "sha256"
}
```

**Supported Algorithms:** `md5`, `sha1`, `sha256`, `sha512`

**Response:**
```json
{
  "success": true,
  "hash": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
  "algorithm": "sha256"
}
```

#### Generate Password
```
POST /api/security/password/generate
```
Generate a secure random password.

**Request Body:**
```json
{
  "length": 16,
  "include_uppercase": true,
  "include_lowercase": true,
  "include_numbers": true,
  "include_symbols": true
}
```

**Response:**
```json
{
  "success": true,
  "password": "aB3$xY9!mN2@pQ5#",
  "length": 16
}
```

#### Check Password Strength
```
POST /api/security/password/strength
```
Check password strength.

**Request Body:**
```json
{
  "data": "MyPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "strength": "strong",
  "score": 5,
  "max_score": 6,
  "feedback": []
}
```

---

### Data Tools

#### Word Count
```
POST /api/data/text/word-count
```
Count words, characters, and lines in text.

**Request Body:**
```json
{
  "data": "Hello world\nThis is a test"
}
```

**Response:**
```json
{
  "success": true,
  "words": 6,
  "characters": 28,
  "characters_no_spaces": 23,
  "lines": 2
}
```

#### Convert Case
```
POST /api/data/text/case-convert
```
Convert text case to various formats.

**Request Body:**
```json
{
  "data": "hello world"
}
```

**Response:**
```json
{
  "success": true,
  "uppercase": "HELLO WORLD",
  "lowercase": "hello world",
  "title_case": "Hello World",
  "sentence_case": "Hello world",
  "snake_case": "hello_world",
  "kebab_case": "hello-world",
  "camel_case": "HelloWorld"
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK` - Successful request
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

Error responses include a `detail` field:
```json
{
  "detail": "Error message here"
}
```

## Interactive Documentation

Visit `/docs` on your API server for interactive Swagger UI documentation.
