import { Link, useNavigate } from "react-router-dom";

type ToolType =
  | "csv-to-json"
  | "json-to-csv"
  | "sql"
  | "fake-data"
  | "base-converter";

const tools: { id: ToolType; name: string; description: string; tags: string[]; icon: string }[] = [
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
    id: "sql",
    name: "SQL Formatter",
    description: "Format and beautify SQL queries",
    tags: ["SQL", "Format", "DDL/DML"],
    icon: "bi-database",
  },
  {
    id: "fake-data",
    name: "Fake Data",
    description: "Generate fake test data for development",
    tags: ["Mock", "Seed", "Sample"],
    icon: "bi-stars",
  },
  {
    id: "base-converter",
    name: "Base Converter",
    description: "Convert numbers between different bases",
    tags: ["Binary", "Hex", "Decimal"],
    icon: "bi-123",
  },
];

export default function DataToolsPage() {
  const navigate = useNavigate();

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

      <div className="tools-grid tools-grid-balanced">
        {tools.map((tool) => (
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
