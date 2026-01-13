# z1x - Utility Tools

A collection of utility tools with a FastAPI backend and React frontend, designed for deployment on Vercel.

## About

z1x is a comprehensive utility suite offering multiple tools across different categories including developer tools, security tools, and data manipulation tools. The application features a clean, modern interface and a robust API backend.

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom components with Lucide React icons

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **API**: RESTful API with OpenAPI documentation
- **Deployment**: Vercel Serverless Functions

## Features

### Developer Tools
- **JSON Formatter**: Format and validate JSON data with customizable indentation
- **Base64 Encoder/Decoder**: Encode and decode Base64 strings
- **Regex Tester**: Test regular expressions with match highlighting
- **UUID Generator**: Generate UUID v4 identifiers

### Security Tools
- **Password Generator**: Generate secure random passwords with customizable options
- **Password Strength Checker**: Analyze password strength with detailed feedback
- **Hash Generator**: Generate hashes using MD5, SHA1, SHA256, SHA512

### Data Tools
- **Word Counter**: Count words, characters, and lines in text
- **Case Converter**: Convert text to various cases (uppercase, lowercase, camelCase, snake_case, etc.)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/vaibhavcoding69/utility-tools.git
cd utility-tools
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ..
pip install -r requirements.txt
```

4. Run the development server:

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:8000`.

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

### API Endpoints

#### Health Check
- `GET /api/health` - Check API health status

#### Developer Tools
- `POST /api/developer/json/format` - Format JSON data
- `POST /api/developer/json/minify` - Minify JSON data
- `POST /api/developer/base64/encode` - Encode to Base64
- `POST /api/developer/base64/decode` - Decode from Base64
- `POST /api/developer/regex/test` - Test regex patterns
- `GET /api/developer/uuid/generate` - Generate UUID v4

#### Security Tools
- `POST /api/security/hash/generate` - Generate hash
- `POST /api/security/password/generate` - Generate password
- `POST /api/security/password/strength` - Check password strength

#### Data Tools
- `POST /api/data/text/word-count` - Count words in text
- `POST /api/data/text/case-convert` - Convert text case

## Deploy to Vercel

Deploy this project to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvaibhavcoding69%2Futility-tools)

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

The `vercel.json` configuration file handles both the frontend build and backend API deployment automatically.

## Project Structure

```
utility-tools/
├── api/
│   └── index.py          # FastAPI application (serverless function)
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── tools/    # Tool components
│   │   │   ├── layout/   # Layout components
│   │   │   └── hero/     # Hero section
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and API client
│   │   ├── App.tsx       # Main App component
│   │   └── index.css     # Global styles
│   ├── package.json
│   └── vite.config.ts
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is open source and available under the MIT License.

## Authors

Created by [vaibhavcoding69](https://github.com/vaibhavcoding69) and [CloudCompile](https://github.com/CloudCompile).
