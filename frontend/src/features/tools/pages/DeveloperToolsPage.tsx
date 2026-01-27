import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const tools = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON data",
    icon: "bi-braces",
    tags: ["JSON", "Lint", "Validate"],
  },
  {
    id: "diff",
    name: "Text Diff",
    description: "Compare two texts and see differences",
    icon: "bi-arrow-left-right",
    tags: ["Compare", "Changes"],
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
    id: "image-resize",
    name: "Image Resizer / WebP",
    description: "Resize images or convert to WebP/PNG/JPEG",
    icon: "bi-aspect-ratio",
    tags: ["Image", "Resize", "WebP"],
  },
  {
    id: "css-units",
    name: "CSS Units Converter",
    description: "Convert px, rem, em, vw, vh units",
    icon: "bi-rulers",
    tags: ["CSS", "Units", "px", "rem"],
  },
  {
    id: "css-inline",
    name: "CSS Inliner",
    description: "Inline CSS for HTML email",
    icon: "bi-envelope-open",
    tags: ["Email", "Inline", "CSS"],
  },
  {
    id: "svg-viewer",
    name: "SVG Viewer",
    description: "Preview and validate SVG code",
    icon: "bi-vector-pen",
    tags: ["SVG", "Preview", "Vector"],
  },
  {
    id: "har-viewer",
    name: "HAR Viewer",
    description: "Summarize HAR files quickly",
    icon: "bi-journal-code",
    tags: ["HAR", "Network", "Debug"],
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
    id: "cron-parser",
    name: "Cron Parser",
    description: "Parse and explain cron expressions",
    icon: "bi-alarm",
    tags: ["Cron", "Schedule", "Parse"],
  },
  {
    id: "query-params",
    name: "Query Params to JSON",
    description: "Parse URL query strings to JSON",
    icon: "bi-question-circle",
    tags: ["Query", "JSON", "URL"],
  },
  {
    id: "env-netlify",
    name: ".env → netlify.toml",
    description: "Convert env vars to netlify.toml",
    icon: "bi-gear",
    tags: ["Netlify", "Env", "Config"],
  },
];

export default function DeveloperToolsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return tools;
    return tools.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query]);

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

      <div className="tools-page-header-controls">
        <input
          className="tool-input"
          type="search"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="tools-grid tools-grid-balanced">
        {filtered.map((tool) => (
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
