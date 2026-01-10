const companyLogos = [
  'CURSOR',
  'Decagon',
  'zoom',
  'Salesforce',
  'Merrily',
  'K3',
  'Cog',
]

export function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-arc"></div>
        <div className="hero-dots"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          Build on the <span className="text-gradient">AI Native Cloud</span>
        </h1>
        <p className="hero-subtitle">
          Engineered for AI natives, powered by cutting-edge research
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary">Start building now</button>
          <button className="btn btn-outline">Contact sales</button>
        </div>
      </div>
      <div className="company-logos">
        {companyLogos.map((logo) => (
          <div key={logo} className="company-logo">
            {logo}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Hero
