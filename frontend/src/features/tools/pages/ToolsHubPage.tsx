import { Link } from "react-router-dom";

const suites = [
  {
    id: "developer",
    title: "Developer Tools",
    description: "JSON formatting, encoding, UUIDs, regex, and more in one panel.",
    icon: "{ }",
    href: "/tools/developer",
    tags: ["JSON", "Base64", "UUID", "Regex"],
    count: 24,
  },
  {
    id: "security",
    title: "Security Tools",
    description: "Passwords, hashing, and TOTP generators for secure workflows.",
    icon: "🔐",
    href: "/tools/security",
    tags: ["Passwords", "Hashes", "2FA"],
    count: 3,
  },
  {
    id: "data",
    title: "Data Tools",
    description: "CSV/JSON conversion, SQL formatting, fake data, and base conversions.",
    icon: "📊",
    href: "/tools/data",
    tags: ["CSV", "JSON", "SQL", "Mock"],
    count: 5,
  },
];

export default function ToolsHubPage() {
  return (
    <div className="tools-page-wrapper">
      <div className="tools-page-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <div className="section-badge">Utility suites</div>
        <h1>All Tools</h1>
        <p className="muted">
          Choose a suite to jump into curated tools for development, security, and data work.
        </p>
      </div>

      <div className="tools-grid tools-grid-balanced">
        {suites.map((suite) => (
          <Link key={suite.id} to={suite.href} className="tool-card wide">
            <div className="tool-card-icon subtle" aria-hidden>
              {suite.icon}
            </div>
            <div className="tool-card-content">
              <div className="tool-card-title-row">
                <h3 className="tool-card-title">{suite.title}</h3>
                <span className="pill ghost">{suite.count} tools</span>
              </div>
              <p className="tool-card-description">{suite.description}</p>
              <div className="tool-card-tags" aria-hidden>
                {suite.tags.map((tag) => (
                  <span key={tag} className="tool-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="tool-card-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
