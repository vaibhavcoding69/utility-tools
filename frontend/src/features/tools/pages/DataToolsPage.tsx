import { Link, useNavigate } from 'react-router-dom'

type ToolType = 'csv-to-json' | 'json-to-csv' | 'sql' | 'fake-data' | 'base-converter'

const tools: { id: ToolType; name: string; description: string }[] = [
  { id: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV data to JSON format' },
  { id: 'json-to-csv', name: 'JSON to CSV', description: 'Convert JSON array to CSV format' },
  { id: 'sql', name: 'SQL Formatter', description: 'Format and beautify SQL queries' },
  { id: 'fake-data', name: 'Fake Data', description: 'Generate fake test data for development' },
  { id: 'base-converter', name: 'Base Converter', description: 'Convert numbers between different bases' },
]

export default function DataToolsPage() {
  const navigate = useNavigate()

  return (
    <div className="tools-page-wrapper">
      <div className="tools-page-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Data Tools</h1>
        <p className="muted">Transform, convert, and generate data in various formats.</p>
      </div>

      <div className="tools-grid">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="tool-card"
            onClick={() => navigate(`/tools/data/${tool.id}`)}
          >
            <div className="tool-card-icon">📊</div>
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
