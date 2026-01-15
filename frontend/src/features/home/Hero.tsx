type HeroProps = {
  onLaunchTools?: () => void
}

const stats = [
  { label: 'Requests handled', value: '2.3M' },
  { label: 'Avg. response', value: '48ms' },
  { label: 'Uptime', value: '99.98%' },
]

const quickCards = [
  { title: 'JSON Formatter', detail: 'Validate, prettify, and minify in seconds.' },
  { title: 'Base64 Encode/Decode', detail: 'Handle payloads without copy/paste mistakes.' },
  { title: 'Password Generator', detail: 'Strong defaults with instant strength checks.' },
]

export function Hero({ onLaunchTools }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <p className="eyebrow">Developer utilities</p>
        <h1 className="hero-title">Ship faster with a focused tool desk</h1>
        <p className="hero-lead">
          A streamlined workspace for the boring but critical tasks: formatting JSON, encoding payloads,
          and generating secure passwords. Built for teams that want clarity over chaos.
        </p>
        <div className="hero-actions">
          <button className="btn primary" onClick={onLaunchTools}>Launch tools</button>
          <a className="btn ghost" href="#tools">See categories</a>
        </div>
        <div className="hero-stats" aria-label="Service stats">
          {stats.map((item) => (
            <div key={item.label} className="stat-card">
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-right" aria-label="Tool previews">
        <div className="preview-surface">
          <div className="preview-header">
            <span className="pill">Live previews</span>
            <span className="muted">Minimal steps, copy-ready outputs</span>
          </div>
          <div className="preview-grid">
            {quickCards.map((card) => (
              <div key={card.title} className="preview-card">
                <div className="preview-title">{card.title}</div>
                <p className="preview-detail">{card.detail}</p>
              </div>
            ))}
          </div>
          <div className="preview-footer">
            <div>
              <p className="eyebrow">Fast lanes</p>
              <p className="muted">Save time on routine checks and move on to shipping.</p>
            </div>
            <button className="btn subtle" onClick={onLaunchTools}>Jump in</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
