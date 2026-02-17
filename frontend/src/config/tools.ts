export interface Tool {
  name: string;
  description: string;
  href: string;
  category: "Developer" | "Security" | "Data";
  keywords: string[];
  icon?: string;
  tags?: string[];
}

export const toolIndex: Tool[] = [
  {
    name: "JSON Formatter",
    description: "Format & validate JSON payloads",
    href: "/tools/developer/json",
    category: "Developer",
    keywords: ["json", "format", "validate"],
    icon: "bi-braces",
    tags: ["JSON", "Lint", "Validate"],
  },
  {
    name: "Encoder/Decoder",
    description: "Universal encoder/decoder with 33+ formats",
    href: "/tools/developer/encoder-decoder",
    category: "Developer",
    keywords: ["encode", "decode", "base64", "hex", "binary", "morse", "rot13", "caesar", "hash"],
    icon: "bi-shuffle",
    tags: ["Encode", "Decode", "Convert"],
  },
  {
    name: "Cipher & Hash Lab",
    description: "Work with classic ciphers and cryptographic hashes",
    href: "/tools/security/ciphers-hashes",
    category: "Security",
    keywords: ["cipher", "hash", "rot13", "caesar", "vigenere", "md5", "sha256", "sha1"],
    icon: "bi-shield-lock",
    tags: ["Cipher", "Hash", "Crypto"],
  },
  {
    name: "UUID Generator",
    description: "Generate UUID v1 & v4",
    href: "/tools/developer/uuid",
    category: "Developer",
    keywords: ["uuid", "id", "unique"],
    icon: "bi-key",
    tags: ["UUID", "ID"],
  },
  {
    name: "Regex Tester",
    description: "Run expressions with flags",
    href: "/tools/developer/regex",
    category: "Developer",
    keywords: ["regex", "pattern", "test"],
    icon: "bi-search",
    tags: ["Regex", "Pattern"],
  },
  {
    name: "JWT Decoder",
    description: "Inspect token payloads",
    href: "/tools/developer/jwt",
    category: "Developer",
    keywords: ["jwt", "token"],
    icon: "bi-shield-check",
    tags: ["JWT", "Token"],
  },
  {
    name: "Text Diff",
    description: "Compare two inputs",
    href: "/tools/developer/diff",
    category: "Developer",
    keywords: ["diff", "compare"],
    icon: "bi-arrow-left-right",
    tags: ["Compare", "Changes"],
  },
  {
    name: "Image to Base64",
    description: "Convert images to Base64 strings",
    href: "/tools/developer/image-base64",
    category: "Developer",
    keywords: ["image", "base64", "convert"],
    icon: "bi-image",
    tags: ["Image", "Base64"],
  },
  {
    name: "Base64 to Image",
    description: "Decode Base64 strings to images",
    href: "/tools/developer/base64-image",
    category: "Developer",
    keywords: ["base64", "image", "decode"],
    icon: "bi-camera",
    tags: ["Base64", "Image"],
  },
  {
    name: "Image Resizer",
    description: "Resize images or convert to WebP/PNG/JPEG",
    href: "/tools/developer/image-resize",
    category: "Developer",
    keywords: ["image", "resize", "webp"],
    icon: "bi-aspect-ratio",
    tags: ["Image", "Resize", "WebP"],
  },
  {
    name: "CSS Units Converter",
    description: "Convert px, em, rem, pt units",
    href: "/tools/developer/css-units",
    category: "Developer",
    keywords: ["css", "units", "convert"],
    icon: "bi-rulers",
    tags: ["CSS", "Units"],
  },
  {
    name: "CSS Inliner",
    description: "Inline CSS for HTML emails",
    href: "/tools/developer/css-inline",
    category: "Developer",
    keywords: ["css", "inline", "email"],
    icon: "bi-envelope-open",
    tags: ["Email", "CSS"],
  },
  {
    name: "SVG Viewer",
    description: "Preview and validate SVG code",
    href: "/tools/developer/svg-viewer",
    category: "Developer",
    keywords: ["svg", "preview", "vector"],
    icon: "bi-vector-pen",
    tags: ["SVG", "Preview"],
  },
  {
    name: "HAR Viewer",
    description: "Summarize HAR files quickly",
    href: "/tools/developer/har-viewer",
    category: "Developer",
    keywords: ["har", "network", "debug"],
    icon: "bi-journal-code",
    tags: ["HAR", "Network"],
  },
  {
    name: "QR Code Generator",
    description: "Create QR codes from text or URLs",
    href: "/tools/developer/qr-generator",
    category: "Developer",
    keywords: ["qr", "code", "generate"],
    icon: "bi-qr-code",
    tags: ["QR", "Code"],
  },
  {
    name: "Markdown Preview",
    description: "Live preview markdown content",
    href: "/tools/developer/markdown",
    category: "Developer",
    keywords: ["markdown", "preview", "md"],
    icon: "bi-markdown",
    tags: ["Markdown", "Preview"],
  },
  {
    name: "Cron Parser",
    description: "Parse and explain cron expressions",
    href: "/tools/developer/cron-parser",
    category: "Developer",
    keywords: ["cron", "schedule", "parse"],
    icon: "bi-alarm",
    tags: ["Cron", "Schedule"],
  },
  {
    name: "Query Params to JSON",
    description: "Parse URL query strings to JSON",
    href: "/tools/developer/query-params",
    category: "Developer",
    keywords: ["query", "json", "url"],
    icon: "bi-question-circle",
    tags: ["Query", "JSON"],
  },
  {
    name: ".env to netlify.toml",
    description: "Convert env vars to netlify.toml",
    href: "/tools/developer/env-netlify",
    category: "Developer",
    keywords: ["netlify", "env", "config"],
    icon: "bi-gear",
    tags: ["Netlify", "Env"],
  },

  {
    name: "Password Generator",
    description: "Create secure passwords",
    href: "/tools/security/password",
    category: "Security",
    keywords: ["password", "generator", "secure"],
    icon: "bi-key",
    tags: ["Password", "Generator"],
  },
  {
    name: "Hash Generator",
    description: "SHA, MD5, and more",
    href: "/tools/security/hash",
    category: "Security",
    keywords: ["hash", "sha", "md5", "crypto"],
    icon: "bi-shield-lock",
    tags: ["Hash", "SHA", "MD5"],
  },
  {
    name: "TOTP Generator",
    description: "2FA compatible codes",
    href: "/tools/security/totp",
    category: "Security",
    keywords: ["totp", "2fa", "authenticator"],
    icon: "bi-phone-vibrate",
    tags: ["TOTP", "2FA"],
  },
  {
    name: "Random String",
    description: "Generate random strings",
    href: "/tools/security/random-string",
    category: "Security",
    keywords: ["random", "string", "generate"],
    icon: "bi-shuffle",
    tags: ["Random", "String"],
  },

  {
    name: "CSV to JSON",
    description: "Convert CSV quickly",
    href: "/tools/data/csv-to-json",
    category: "Data",
    keywords: ["csv", "json", "convert"],
    icon: "bi-table",
    tags: ["CSV", "JSON"],
  },
  {
    name: "JSON to CSV",
    description: "Flatten arrays to CSV",
    href: "/tools/data/json-to-csv",
    category: "Data",
    keywords: ["json", "csv", "convert"],
    icon: "bi-file-earmark-spreadsheet",
    tags: ["JSON", "CSV"],
  },
  {
    name: "SQL Formatter",
    description: "Beautify SQL queries",
    href: "/tools/data/sql",
    category: "Data",
    keywords: ["sql", "format", "query"],
    icon: "bi-database",
    tags: ["SQL", "Format"],
  },
  {
    name: "Fake Data Generator",
    description: "Generate personas & more",
    href: "/tools/data/fake-data",
    category: "Data",
    keywords: ["fake", "data", "mock", "persona"],
    icon: "bi-person-bounding-box",
    tags: ["Fake", "Data", "Mock"],
  },
  {
    name: "Base Converter",
    description: "Convert between bases",
    href: "/tools/data/base-converter",
    category: "Data",
    keywords: ["base", "convert", "binary", "hex"],
    icon: "bi-calculator",
    tags: ["Base", "Convert"],
  },
  {
    name: "Timestamp Converter",
    description: "Convert Unix timestamps",
    href: "/tools/data/timestamp",
    category: "Data",
    keywords: ["timestamp", "unix", "date"],
    icon: "bi-calendar-event",
    tags: ["Timestamp", "Date"],
  },
  {
    name: "XML to JSON",
    description: "Convert XML and JSON",
    href: "/tools/data/xml-json",
    category: "Data",
    keywords: ["xml", "json", "convert"],
    icon: "bi-code-slash",
    tags: ["XML", "JSON"],
  },
  {
    name: "HEX to RGB",
    description: "Convert color formats",
    href: "/tools/data/hex-rgb",
    category: "Data",
    keywords: ["hex", "rgb", "color", "convert"],
    icon: "bi-palette",
    tags: ["Color", "HEX", "RGB"],
  },
  {
    name: "YAML to JSON",
    description: "Convert YAML to JSON",
    href: "/tools/data/yaml-json",
    category: "Data",
    keywords: ["yaml", "json", "convert"],
    icon: "bi-filetype-yml",
    tags: ["YAML", "JSON"],
  },
  {
    name: "JSON to YAML",
    description: "Convert JSON to YAML",
    href: "/tools/data/json-yaml",
    category: "Data",
    keywords: ["json", "yaml", "convert"],
    icon: "bi-filetype-json",
    tags: ["JSON", "YAML"],
  },
  {
    name: "Lorem Ipsum",
    description: "Generate placeholder text",
    href: "/tools/data/lorem",
    category: "Data",
    keywords: ["lorem", "ipsum", "placeholder"],
    icon: "bi-chat-left-text",
    tags: ["Lorem", "Text"],
  },
];

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return toolIndex.filter((tool) => tool.category === category);
}

export function getToolByHref(href: string): Tool | undefined {
  return toolIndex.find((tool) => tool.href === href);
}

export function getToolById(id: string): Tool | undefined {
  return toolIndex.find((tool) => tool.href.endsWith(`/${id}`));
}

export function searchTools(query: string): Tool[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  
  return toolIndex.filter((tool) =>
    [tool.name, tool.description, tool.category, ...tool.keywords]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export function getQuickActions(): Tool[] {
  return toolIndex.slice(0, 6);
}

export function getToolCountByCategory(category: Tool["category"]): number {
  return getToolsByCategory(category).length;
}
