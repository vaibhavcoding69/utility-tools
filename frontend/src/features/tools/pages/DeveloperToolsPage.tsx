import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { getToolsByCategory } from "../../../config/tools";

const tools = getToolsByCategory("Developer");

export default function DeveloperToolsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return tools;
    return tools.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.keywords.some((keyword) => keyword.toLowerCase().includes(q))
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
        {filtered.map((tool) => {
          const toolId = tool.href.split("/").pop() || "";
          return (
            <button
              key={tool.name}
              className="tool-card wide"
              onClick={() => navigate(`/tools/developer/${toolId}`)}
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
                  {tool.tags?.map((tag) => (
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
          );
        })}
      </div>
    </div>
  );
}
