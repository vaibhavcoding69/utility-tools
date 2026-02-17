import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const tools = [
  {
    id: "csv-to-json",
    name: "CSV to JSON",
    description: "Convert CSV data to JSON format",
    tags: ["CSV", "JSON", "Parse"],
    icon: "bi-filetype-csv",
  },
  {
    id: "json-to-csv",
    name: "JSON to CSV",
    description: "Convert JSON array to CSV format",
    tags: ["JSON", "CSV", "Export"],
    icon: "bi-filetype-json",
  },
  {
    id: "json-yaml",
    name: "JSON to YAML",
    description: "Convert JSON to YAML",
    tags: ["JSON", "YAML", "Convert"],
    icon: "bi-shuffle",
  },
  {
    id: "yaml-json",
    name: "YAML to JSON",
    description: "Convert YAML to JSON",
    tags: ["YAML", "JSON", "Convert"],
    icon: "bi-filetype-yml",
  },
  {
    id: "xml-json",
    name: "XML ↔ JSON",
    description: "Convert XML and JSON",
    tags: ["XML", "JSON", "Convert"],
    icon: "bi-file-earmark-code",
  },
  {
    id: "sql",
    name: "SQL Formatter",
    description: "Format and beautify SQL queries",
    tags: ["SQL", "Format", "DDL/DML"],
    icon: "bi-database",
  },
  {
    id: "sql-minify",
    name: "SQL Minifier",
    description: "Minify SQL queries by removing whitespace",
    tags: ["SQL", "Minify", "Compact"],
    icon: "bi-file-earmark-code",
  },
  {
    id: "fake-data",
    name: "Fake Data",
    description: "Generate fake test data for development",
    tags: ["Mock", "Seed", "Sample"],
    icon: "bi-stars",
  },
  {
    id: "hex-rgb",
    name: "HEX ↔ RGB",
    description: "Convert color codes between formats",
    tags: ["Color", "HEX", "RGB"],
    icon: "bi-palette",
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps",
    tags: ["Time", "Date", "Unix"],
    icon: "bi-clock-history",
  },
  {
    id: "lorem",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text",
    tags: ["Lorem", "Text", "Placeholder"],
    icon: "bi-card-text",
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description: "Pick and convert color formats",
    tags: ["Color", "Pick", "Palette"],
    icon: "bi-eyedropper",
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text case styles",
    tags: ["Case", "Text", "camelCase"],
    icon: "bi-type",
  },
  {
    id: "base-converter",
    name: "Base Converter",
    description: "Convert between number bases",
    tags: ["Binary", "Hex", "Decimal"],
    icon: "bi-calculator",
  },
];

export default function DataToolsPage() {
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
        <div className="section-badge">Data suite</div>
        <h1>Data Tools</h1>
        <p className="muted">Transform, convert, and generate data in various formats.</p>
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
            onClick={() => navigate(`/tools/data/${tool.id}`)}
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
