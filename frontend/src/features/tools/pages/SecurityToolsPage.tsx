import { Link, useNavigate } from "react-router-dom";

const tools = [
  {
    id: "password",
    name: "Password Generator",
    description: "Generate strong, secure passwords",
    icon: "bi-shield-lock",
    tags: ["Entropy", "Symbols", "Length"],
  },
  {
    id: "hash",
    name: "Hash Generator",
    description: "Generate MD5, SHA-256, and other hashes",
    icon: "bi-hash",
    tags: ["SHA", "MD5", "Digest"],
  },
  {
    id: "totp",
    name: "TOTP Generator",
    description: "Generate time-based one-time passwords",
    icon: "bi-stopwatch",
    tags: ["2FA", "Time", "Auth"],
  },
];

export default function SecurityToolsPage() {
  const navigate = useNavigate();

  return (
    <div className="tools-page-wrapper">
      <div className="tools-page-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <div className="section-badge">Security suite</div>
        <h1>Security Tools</h1>
        <p className="muted">Password generation, hashing, and TOTP utilities.</p>
        
      </div>

      <div className="tools-grid tools-grid-balanced">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="tool-card wide"
            onClick={() => navigate(`/tools/security/${tool.id}`)}
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
