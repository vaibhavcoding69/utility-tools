const meta = [
  { label: 'Tools', value: '50+' },
  { label: 'Categories', value: '5' },
  { label: 'Offline', value: 'Many local' },
]

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="badge">All-in-one utility desk</div>
        <h1 className="hero-title">Plain, fast, useful.</h1>
        <p className="hero-subtitle">
          z1x is a focused toolkit for builders: APIs, data, security, media, and productivity tools in a clean, distraction-free workspace.
        </p>
        <div className="hero-actions">
          <button className="btn">Open workspace</button>
          <button className="btn secondary">View tools</button>
        </div>
        <div className="hero-meta">
          {meta.map((m) => (
            <div key={m.label}>
              <div className="meta-number">{m.value}</div>
              <div className="meta-label">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
