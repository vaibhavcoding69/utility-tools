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
    <section className="category-section" aria-labelledby="tool-categories">
      <div className="section-head">
        <div>
          <p className="eyebrow">Browse</p>
          <h2 id="tool-categories">Tools by category</h2>
          <p className="muted">Jump straight to the utility you need. No ads, no noise.</p>
        </div>
        <a className="btn ghost" href="#tool-desk">Open tool desk</a>
      </div>
      <div className="card-grid">
        {categories.map((cat) => (
          <article key={cat.name} className="card hoverable">
            <div className="card-body">
              <div className="card-head">
                <div className="card-title">{cat.name}</div>
                <span className="pill ghost">{cat.tools.length} tools</span>
              </div>
              <ul className="tool-list">
                {cat.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
              <div className="card-footer">
                <a className="btn subtle" href="#tool-desk">Use these</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CategoryGrid
