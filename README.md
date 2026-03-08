# Utility Tools

A comprehensive collection of developer utilities with a FastAPI backend and React frontend, designed for deployment on Vercel.

![34314](https://github.com/user-attachments/assets/2effc2ca-cd61-4802-91ed-477035489187)

## Features

### Developer Tools 
- **JSON Tools**: Format, minify, validate, and query JSON data
- **YAML Tools**: Convert between JSON and YAML formats
- **Encoding Tools**: Base64, URL, HTML encoding/decoding
- **Regex Tester**: Test regular expressions with match highlighting
- **UUID Generator**: Generate UUID v4 identifiers
- **JWT Decoder**: Decode JSON Web Tokens
- **HTTP Ping**: Test URL response times
- **Text Diff**: Compare and diff text files
- **HAR Summary**: Analyze HTTP Archive files
- **Universal Encoder/Decoder**: 20+ encoding algorithms (ROT13, Caesar, Vigenere, hashes, etc.)

### Security Tools 
- **Password Generator**: Generate secure random passwords with customizable options
- **Password Strength Checker**: Analyze password strength with detailed feedback
- **Password Policy Validator**: Check passwords against security policies
- **Hash Generator**: Generate hashes using MD5, SHA1, SHA256, SHA512, Blake2
- **Hash Verifier**: Verify data against hashes
- **HMAC Generator**: Generate HMAC signatures
- **Email Validator**: Validate email addresses and check deliverability
- **Secret Token Generator**: Generate cryptographically secure tokens

### Data Tools
- **CSV/JSON Converter**: Bidirectional conversion between CSV and JSON
- **SQL Formatter/Minifier**: Format and minify SQL queries
- **Fake Data Generator**: Generate realistic test data (names, addresses, emails, etc.)
- **Base Converter**: Convert numbers between different bases (binary, octal, decimal, hex)
- **Word Counter**: Count words, characters, and lines in text
- **Case Converter**: Convert text to various cases (uppercase, lowercase, camelCase, snake_case, etc.)
- **Random String Generator**: Generate random strings with customizable character sets

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- npm or yarn

### Local 

1. Clone the repository:
```bash
git clone https://github.com/redac1ed/utility-tools.git
cd utility-tools
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Run the development servers:
```bash
python main.py 
```
The API will be available at `http://localhost:8000` and the frontend will be available at `http://localhost:5173`.

### Vercel

Deploy this project to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvaibhavcoding69%2Futility-tools)

---

## API Documentation

Complete API documentation is available in [API_REFERENCE.md](./API_REFERENCE.md).

Once the backend is running, you can test the API endpoints using the examples provided in [API_REFERENCE.md](API_REFERENCE.md).

---

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is open source and available under the MIT License.

## Authors

Created by [redac1ed](https://github.com/redac1ed).
