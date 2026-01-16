# z1x - All-in-One Utility Tool

## Overview
z1x is a comprehensive utility suite built with Python (FastAPI) backend and React frontend, offering 50+ tools across 5 major categories.

---

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: SQLite (for user preferences/history)
- **Libraries**: 
  - Pillow (image processing)
  - cryptography (encryption)
  - python-qrcode (QR codes)
  - pandas (data manipulation)
  - pydantic (validation)

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

---

## Feature Categories - Practical & Useful Tools

### 1. Developer Tools
| Tool | Description |
|------|-------------|
| API Tester | Make HTTP requests, test APIs with headers/body |
| Webhook Tester | Generate webhook URLs to capture and inspect requests |
| Regex Builder | Visual regex builder with explanations |
| JWT Inspector | Decode, verify, and debug JWT tokens with key validation |
| Cron Builder | Visual cron expression builder with next run times |
| Git Command Generator | Generate git commands for common workflows |
| .env Editor | Manage environment variables with encryption |
| SQL Query Builder | Visual SQL query builder |
| Mock Data Generator | Generate realistic fake data - names, emails, addresses |
| Response Time Checker | Check API/website response times from multiple locations |

### 2. Productivity Tools
| Tool | Description |
|------|-------------|
| Pomodoro Timer | Focus timer with stats and history |
| Quick Notes | Markdown notes with sync and search |
| Kanban Board | Simple project task board |
| Habit Tracker | Track daily habits with streaks |
| Time Zone Converter | Convert times across zones with meeting planner |
| Bookmark Manager | Save and organize links with tags |
| Clipboard History | Track clipboard history with search |
| Screenshot Annotator | Capture and annotate screenshots |
| Link Shortener | Create short URLs with click tracking |
| Expense Tracker | Track expenses with categories and charts |

### 3. Data Tools
| Tool | Description |
|------|-------------|
| Data Transformer | Transform data between formats - JSON/CSV/XML/YAML |
| SQL to NoSQL | Convert SQL queries to MongoDB/Firebase queries |
| Database Schema Designer | Visual database schema designer with export |
| Data Faker | Generate realistic test datasets |
| File Converter | Convert documents - PDF/Word/Markdown |
| Spreadsheet Editor | Edit CSV/Excel files in browser |
| Data Visualizer | Create charts from data |
| Diff Tool | Compare files/text with merge support |
| Log Parser | Parse and analyze log files |
| Regex Data Extractor | Extract data from text using patterns |

### 4. Security Tools
| Tool | Description |
|------|-------------|
| Password Generator | Generate secure passwords with policies |
| Password Manager | Encrypted password storage - local only |
| Secret Vault | Store API keys and secrets securely |
| File Encryptor | Encrypt/decrypt files with AES |
| Hash Generator | Generate and verify hashes |
| SSL Checker | Check SSL certificate status and expiry |
| Security Headers Checker | Analyze website security headers |
| Leaked Password Checker | Check if password is in breached databases |
| 2FA Code Generator | Generate TOTP codes |
| Privacy Policy Generator | Generate privacy policies from templates |

### 5. Media Tools
| Tool | Description |
|------|-------------|
| QR Code Studio | Generate styled QR codes with logos |
| Image Editor | Crop, resize, filter images |
| Color Palette Generator | Extract palettes from images |
| Icon Generator | Generate app icons for all platforms |
| Image Optimizer | Compress images with quality control |
| Background Remover | Remove backgrounds from images |
| Favicon Generator | Create favicons from any image |
| OG Image Generator | Create social media preview images |
| Video to GIF | Convert video clips to GIFs |
| Audio Recorder | Record and trim audio clips |

---

## Architecture

```mermaid
graph TB
    subgraph Frontend - React
        UI[UI Components]
        Pages[Tool Pages]
        Router[React Router]
        State[Zustand Store]
    end
    
    subgraph Backend - FastAPI
        API[REST API]
        Services[Tool Services]
        Utils[Utility Functions]
        DB[SQLite DB]
    end
    
    UI --> Pages
    Pages --> Router
    Pages --> State
    Pages --> API
    API --> Services
    Services --> Utils
    Services --> DB
```

---

## API Structure

### Base URL: `/api/v1`

```
/api/v1/
├── /developer/
│   ├── POST /json/format
│   ├── POST /json/validate
│   ├── POST /yaml-to-json
│   ├── POST /json-to-yaml
│   ├── POST /base64/encode
│   ├── POST /base64/decode
│   ├── POST /url/encode
│   ├── POST /url/decode
│   ├── POST /regex/test
│   ├── GET  /uuid/generate
│   ├── POST /diff
│   └── POST /beautify
│
├── /security/
│   ├── GET  /password/generate
│   ├── POST /password/strength
│   ├── POST /hash/generate
│   ├── POST /hash/verify
│   └── POST /validate/email
│
├── /data/
│   ├── POST /csv-to-json
│   ├── POST /json-to-csv
│   ├── POST /sql/format
│   ├── GET  /fake-data
│   └── POST /convert/base
│
├── /media/
│   ├── POST /qr/generate
│   ├── POST /qr/read
│   ├── POST /image/compress
│   ├── POST /image/to-base64
│   └── POST /color/palette
│
└── /productivity/
    ├── POST /text/word-count
    ├── POST /text/case-convert
    └── POST /markdown/render
```

---

## Project Structure

```
z1x/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── router.py
│   │   │   ├── developer.py
│   │   │   ├── security.py
│   │   │   ├── data.py
│   │   │   ├── media.py
│   │   │   └── productivity.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── json_service.py
│   │   │   ├── hash_service.py
│   │   │   ├── password_service.py
│   │   │   ├── qr_service.py
│   │   │   └── image_service.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── helpers.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── ...
│   │   │   └── tools/
│   │   │       ├── JsonFormatter.tsx
│   │   │       ├── PasswordGenerator.tsx
│   │   │       └── ...
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── DeveloperTools.tsx
│   │   │   ├── SecurityTools.tsx
│   │   │   ├── DataTools.tsx
│   │   │   ├── MediaTools.tsx
│   │   │   └── ProductivityTools.tsx
│   │   ├── hooks/
│   │   │   ├── useApi.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── store/
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```
might not need docker i guess
---

## UI Design Concept

### Design Philosophy
**Plain, functional, developer-friendly** - Inspired by tools like Linear, Raycast, and Vercel. No gradients, no glow effects, no unnecessary animations. Just clean typography and purposeful spacing.

### Design Principles
1. **Whitespace is a feature** - Generous padding, breathing room
2. **Typography-first** - Good fonts do the heavy lifting
3. **Subtle borders** - Thin 1px borders, not shadows everywhere
4. **Monospace for data** - Code and data in monospace fonts
5. **No decorative elements** - Every element serves a purpose

### Layout
- **Top Navigation**: Simple horizontal nav with category tabs
- **Main Area**: Single-column tool interface, centered
- **No sidebar clutter**: Clean, focused workspace

### Typography
```css
/* Fonts */
--font-sans: Inter, system-ui, sans-serif;
--font-mono: JetBrains Mono, Fira Code, monospace;

/* Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
```

### Color Palette - Minimal
```css
/* Light Theme - Default */
--bg: #ffffff;
--bg-secondary: #fafafa;
--border: #e5e5e5;
--text: #171717;
--text-muted: #737373;
--accent: #171717;  /* Black accent - simple */
--accent-text: #ffffff;

/* Dark Theme */
--bg: #0a0a0a;
--bg-secondary: #141414;
--border: #262626;
--text: #fafafa;
--text-muted: #a3a3a3;
--accent: #fafafa;  /* White accent - simple */
--accent-text: #0a0a0a;
```

### Component Style Guide

**Buttons**
- Primary: Black bg, white text, no border-radius or minimal 4px
- Secondary: Transparent bg, thin border, dark text
- Ghost: No bg, no border, just text

**Inputs**
- Simple bordered box, no shadows
- Focus: darker border only
- Placeholder: muted gray text

**Cards**
- White bg, 1px border, no shadow
- Or: subtle bg color difference, no border

### What We Are NOT Doing
- ❌ Gradient backgrounds
- ❌ Glowing effects or neon colors
- ❌ Rounded corners everywhere - pills
- ❌ Drop shadows on everything
- ❌ Animated backgrounds
- ❌ 3D elements or illustrations
- ❌ Overly colorful accent palettes

### What We ARE Doing
- ✅ Black and white with purpose
- ✅ Clean monospaced code displays
- ✅ Thin borders, subtle separators
- ✅ Generous whitespace
- ✅ Fast, instant interactions
- ✅ Clear hierarchy with typography

### Responsive Design
- Desktop: Centered content, max-width 900px
- Tablet: Same layout, slightly less padding
- Mobile: Full-width, stacked elements

---

## Key Features

### 1. Offline-First
- Many tools work entirely in the browser
- Service worker for offline access
- Local storage for preferences

### 2. History & Favorites
- Recent tool usage history
- Favorite tools quick access
- Saved outputs

### 3. Keyboard Shortcuts
- `Ctrl/Cmd + K` - Command palette
- `Ctrl/Cmd + Enter` - Execute tool
- `Ctrl/Cmd + S` - Save output

### 4. Copy & Share
- One-click copy to clipboard
- Share results via URL
- Export outputs

---

## Implementation Priority

### Phase 1 - Core Setup
- Project scaffolding
- Basic layout and routing
- API infrastructure

### Phase 2 - Developer Tools
- JSON Formatter
- Base64 Encoder/Decoder
- Regex Tester
- UUID Generator

### Phase 3 - Security Tools
- Password Generator
- Hash Generator
- Password Strength Checker

### Phase 4 - Data Tools
- CSV/JSON Converters
- Unit Converter
- Number Base Converter

### Phase 5 - Media Tools
- QR Code Generator
- Color Picker
- Image Compressor

### Phase 6 - Productivity Tools
- Pomodoro Timer
- Note Pad
- Word Counter

### Phase 7 - Polish
- Dark/Light theme
- Keyboard shortcuts
- PWA support
- Documentation

---

## Wireframe - Clean Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   z1x          Dev  Data  Security  Media  Time           ◐    │
│   ─────────────────────────────────────────────────────────    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                      JSON Formatter                             │
│                      Format and validate JSON data              │
│                                                                 │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │  Paste your JSON here...                                │   │
│   │                                                         │   │
│   │                                                         │   │
│   │                                                         │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                                                                 │
│   Indent   [2]       [ ] Sort keys                              │
│                                                                 │
│                                                                 │
│   [Format]     [Minify]     [Copy]                              │
│                                                                 │
│                                                                 │
│   Output                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │  {                                                      │   │
│   │    "result": "formatted"                                │   │
│   │  }                                                      │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Notes
- Top nav only, no sidebar - clean and focused
- Centered content with max-width constraint
- Monospace font for input/output areas
- Simple black buttons, no colors
- Generous vertical spacing between sections
- Dark mode toggle in header - half circle icon

---

## Next Steps

1. Set up project structure with backend/ and frontend/ directories
2. Initialize FastAPI backend with base routes
3. Initialize Vite + React + TypeScript frontend
4. Implement clean navigation and layout
5. Build tools incrementally starting with JSON Formatter
6. Add dark/light theme toggle
