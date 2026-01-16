import { Link, useNavigate } from 'react-router-dom'

const tools = [
  { id: 'password', name: 'Password Generator', description: 'Generate strong, secure passwords', icon: '🔐' },
  { id: 'hash', name: 'Hash Generator', description: 'Generate MD5, SHA-256, and other hashes', icon: '#️⃣' },
  { id: 'totp', name: 'TOTP Generator', description: 'Generate time-based one-time passwords', icon: '⏱️' },
]

export default function SecurityToolsPage() {
  const navigate = useNavigate()

  return (
    <div className="tools-page-wrapper">
      <div className="tools-page-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Security Tools</h1>
        <p className="muted">Password generation, hashing, and authentication utilities.</p>
      </div>

      <div className="tools-grid">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="tool-card"
            onClick={() => navigate(`/tools/security/${tool.id}`)}
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
