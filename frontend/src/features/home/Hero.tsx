import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Hero() {
  const [requestCount, setRequestCount] = useState<string>('0')

  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await fetch('/api/v1/stats/requests')
        const data = await response.json()
        setRequestCount(new Intl.NumberFormat().format(data.count))
      } catch {
        setRequestCount('NaN')
      }
    }
    fetchRequestCount()
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-aurora" aria-hidden="true" />
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="hero-spotlight" aria-hidden="true" />
      
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        Developer utilities that just work
      </div>
      
      <h1 className="hero-title">
        Build on the <span className="gradient-text">Utility Cloud</span>
      </h1>
      
      <p className="hero-lead">
        A streamlined platform for the boring but critical tasks—formatting JSON, 
        encoding payloads, generating passwords. Fast, reliable, and ad-free.
      </p>
      
      <div className="hero-actions">
        <Link className="btn primary" to="/tools/developer">Start building now →</Link>
        <a className="btn ghost" href="#features">Learn more</a>
      </div>
      
      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-value">{requestCount}</div>
          <div className="stat-label">Requests processed</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">48ms</div>
          <div className="stat-label">Avg. response</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">99.98%</div>
          <div className="stat-label">Uptime</div>
        </div>
      </div>
    </section>
  )
}

export default Hero
