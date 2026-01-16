import { Link, useNavigate } from 'react-router-dom'

const tools = [
  { id: 'json', name: 'JSON Formatter', description: 'Format, validate, and beautify JSON data', icon: '{ }' },
  { id: 'base64', name: 'Base64', description: 'Encode and decode Base64 strings', icon: '🔤' },
  { id: 'url', name: 'URL Encoder', description: 'Encode and decode URL components', icon: '🔗' },
  { id: 'uuid', name: 'UUID Generator', description: 'Generate unique identifiers (v1, v4)', icon: '🆔' },
  { id: 'regex', name: 'Regex Tester', description: 'Test and debug regular expressions', icon: '.*' },
  { id: 'jwt', name: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens', icon: '🎫' },
  { id: 'diff', name: 'Text Diff', description: 'Compare two texts and see differences', icon: '↔️' },
]

export default function DeveloperToolsPage() {
  const navigate = useNavigate()

  return (
    <div className="tools-page-wrapper">
      <div className="tools-page-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Developer Tools</h1>
        <p className="muted">JSON formatting, encoding, UUID generation, and more for developers.</p>
      </div>

      <div className="tools-grid">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="tool-card"
            onClick={() => navigate(`/tools/developer/${tool.id}`)}
          >
            <div className="tool-card-icon">{tool.icon}</div>
            <div className="tool-card-content">
              <h3 className="tool-card-title">{tool.name}</h3>
              <p className="tool-card-description">{tool.description}</p>
            </div>
            <span className="tool-card-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
