import { Link } from 'react-router-dom'

const categories = [
  {
    name: 'Developer',
    slug: 'developer',
    description: 'JSON, Base64, UUID, Regex & more',
    tools: ['JSON Formatter', 'Base64 Encoder', 'UUID Generator', 'Regex Tester', 'JWT Decoder', 'URL Encoder', 'Text Diff'],
  },
  {
    name: 'Security',
    slug: 'security',
    description: 'Passwords, hashing & encryption',
    tools: ['Password Generator', 'Hash Generator', 'TOTP Generator', 'HMAC Generator', 'Email Validator'],
  },
  {
    name: 'Data',
    slug: 'data',
    description: 'Transform & convert data formats',
    tools: ['CSV to JSON', 'JSON to CSV', 'SQL Formatter', 'Fake Data Generator', 'Base Converter'],
  },
]

export function CategoryGrid() {
  return (
    <section className="category-section" aria-labelledby="tool-categories">
      <div className="section-head">
        <div>
          <p className="eyebrow">Browse</p>
          <h2 id="tool-categories">Tools by category</h2>
          <p className="muted">Jump straight to the utility you need. No ads, no noise.</p>
        </div>
      </div>
      <div className="card-grid">
        {categories.map((cat) => (
          <article key={cat.name} className="card hoverable">
            <div className="card-body">
              <div className="card-head">
                <div className="card-title">{cat.name}</div>
                <span className="pill ghost">{cat.tools.length} tools</span>
              </div>
              <p className="card-description">{cat.description}</p>
              <ul className="tool-list">
                {cat.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
              <div className="card-footer">
                <Link className="btn primary" to={`/tools/${cat.slug}`}>
                  Open {cat.name} Tools
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CategoryGrid
