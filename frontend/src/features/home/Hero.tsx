type HeroProps = {
  onLaunchTools?: () => void
}

const stats = [
  { label: 'Requests handled', value: '2.3M' },
  { label: 'Avg. response', value: '48ms' },
  { label: 'Uptime', value: '99.98%' },
]

export function Hero({ onLaunchTools }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="hero-left fade-up">
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
          {stats.map((item, idx) => (
            <div key={item.label} className={`stat-card fade-up-${idx + 1}`}>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
