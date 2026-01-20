import { Link, useNavigate } from "react-router-dom";

const tools = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON data",
    icon: "bi-braces",
    tags: ["JSON", "Lint", "Validate"],
  },
  {
    id: "base64",
    name: "Base64",
    description: "Encode and decode Base64 strings",
    icon: "bi-clipboard-data",
    tags: ["Encoding", "Payloads"],
  },
  {
    id: "url",
    name: "URL Encoder",
    description: "Encode and decode URL components",
    icon: "bi-link-45deg",
    tags: ["Encoding", "URLs"],
  },
  {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate unique identifiers (v1, v4)",
    icon: "bi-fingerprint",
    tags: ["IDs", "Uniqueness"],
  },
  {
    id: "regex",
    name: "Regex Tester",
    description: "Test and debug regular expressions",
    icon: "bi-search",
    tags: ["Patterns", "Flags"],
  },
  {
    id: "jwt",
    name: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens",
    icon: "bi-shield-lock",
    tags: ["Auth", "Tokens"],
  },
  {
    id: "diff",
    name: "Text Diff",
    description: "Compare two texts and see differences",
    icon: "bi-arrow-left-right",
    tags: ["Compare", "Changes"],
  },
  {
    id: "yaml-json",
    name: "YAML ↔ JSON",
    description: "Convert between YAML and JSON formats",
    icon: "bi-shuffle",
    tags: ["YAML", "JSON", "Convert"],
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps to dates",
    icon: "bi-clock-history",
    tags: ["Time", "Date", "Unix"],
  },
  {
    id: "query-params",
    name: "Query Params to JSON",
    description: "Parse URL query strings to JSON",
    icon: "bi-question-circle",
    tags: ["Query", "JSON", "URL"],
  },
  {
    id: "hex-rgb",
    name: "HEX ↔ RGB",
    description: "Convert color codes between formats",
    icon: "bi-palette",
    tags: ["Color", "HEX", "RGB"],
  },
  {
    id: "image-base64",
    name: "Image to Base64",
    description: "Convert images to Base64 strings",
    icon: "bi-image",
    tags: ["Image", "Base64"],
  },
  {
    id: "base64-image",
    name: "Base64 to Image",
    description: "Convert Base64 strings to images",
    icon: "bi-camera",
    tags: ["Base64", "Image"],
  },
  {
    id: "number-base",
    name: "Number Base Converter",
    description: "Convert between binary, decimal, hex",
    icon: "bi-123",
    tags: ["Binary", "Hex", "Decimal"],
  },
  {
    id: "css-units",
    name: "CSS Units Converter",
    description: "Convert px, rem, em, vw, vh units",
    icon: "bi-rulers",
    tags: ["CSS", "Units", "px", "rem"],
  },
  {
    id: "xml-json",
    name: "XML ↔ JSON",
    description: "Transform XML data to/from JSON",
    icon: "bi-file-earmark-code",
    tags: ["XML", "JSON", "Convert"],
  },
  {
    id: "svg-viewer",
    name: "SVG Viewer",
    description: "Preview and validate SVG code",
    icon: "bi-vector-pen",
    tags: ["SVG", "Preview", "Vector"],
  },
  {
    id: "lorem",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text",
    icon: "bi-card-text",
    tags: ["Lorem", "Text", "Placeholder"],
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text case styles",
    icon: "bi-type",
    tags: ["Case", "Text", "camelCase"],
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Create QR codes from text or URLs",
    icon: "bi-qr-code",
    tags: ["QR", "Code", "Generate"],
  },
  {
    id: "markdown",
    name: "Markdown Preview",
    description: "Live preview markdown content",
    icon: "bi-markdown",
    tags: ["Markdown", "Preview", "MD"],
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description: "Pick and convert color formats",
    icon: "bi-eyedropper",
    tags: ["Color", "Pick", "Palette"],
  },
  {
    id: "html-entities",
    name: "HTML Entities",
    description: "Encode and decode HTML entities",
    icon: "bi-code-slash",
    tags: ["HTML", "Entities", "Escape"],
  },
  {
    id: "cron-parser",
    name: "Cron Parser",
    description: "Parse and explain cron expressions",
    icon: "bi-alarm",
    tags: ["Cron", "Schedule", "Parse"],
  },
];

export default function DeveloperToolsPage() {
  const navigate = useNavigate();

  return (
    <div className="tools-page-wrapper">
      <div className="tools-page-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <div className="section-badge">Developer suite</div>
        <h1>Developer Tools</h1>
        <p className="muted">
          JSON formatting, encoding, UUID generation, and more. Everything you
          need in one clean panel.
        </p>
      </div>

      <div className="tools-grid tools-grid-balanced">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="tool-card wide"
            onClick={() => navigate(`/tools/developer/${tool.id}`)}
          >
            <div className="tool-card-icon subtle" aria-hidden>
              <i className={`bi ${tool.icon}`} aria-hidden />
            </div>
            <div className="tool-card-content">
              <div className="tool-card-title-row">
                <h3 className="tool-card-title">{tool.name}</h3>
                <span className="pill ghost">Open</span>
              </div>
              <p className="tool-card-description">{tool.description}</p>
              <div className="tool-card-tags" aria-hidden>
                {tool.tags.map((tag) => (
                  <span key={tag} className="tool-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="tool-card-arrow" aria-hidden>
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
