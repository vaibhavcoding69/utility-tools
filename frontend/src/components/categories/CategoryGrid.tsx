const categories = [
  {
    name: 'Dev',
    tools: ['API Tester', 'Webhook Tester', 'JWT Inspector', 'Cron Builder', 'Regex Builder'],
  },
  {
    name: 'Data',
    tools: ['Data Transformer', 'SQL to NoSQL', 'Schema Designer', 'Log Parser', 'Diff Tool'],
  },
  {
    name: 'Security',
    tools: ['Password Vault', 'File Encryptor', 'Hash Generator', 'SSL Checker', 'Headers Check'],
  },
  {
    name: 'Media',
    tools: ['QR Studio', 'Image Optimizer', 'Icon Generator', 'Palette Extractor', 'Video → GIF'],
  },
  {
    name: 'Productivity',
    tools: ['Pomodoro', 'Quick Notes', 'Kanban', 'Time Zone Planner', 'Clipboard History'],
  },
]

export function CategoryGrid() {
  return (
    <section className="category-section">
      <div className="section-head">
        <div>
          <div className="section-label">Browse</div>
          <h2 className="section-title-lg">Tools by category</h2>
        </div>
        <button className="btn secondary">See all</button>
      </div>
      <div className="card-grid">
        {categories.map((cat) => (
          <div key={cat.name} className="card hoverable">
            <div className="card-body">
              <div className="card-head">
                <div className="card-title">{cat.name}</div>
                <span className="pill pill-ghost">{cat.tools.length} tools</span>
              </div>
              <ul className="tool-list">
                {cat.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
              <div className="card-footer">
                <button className="btn secondary">Open</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategoryGrid
