import { Link } from 'react-router-dom'
import { Hero } from './Hero'
import { Zap, Shield, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-50ms response times. Pages load instantly so you stay in flow and ship faster.',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data never leaves our servers. No third-party tracking, no analytics spyware.',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #22d3ee 100%)',
  },
  {
    icon: Sparkles,
    title: 'Production Ready',
    description: 'Typed endpoints, validation, and helpful errors. Built for CI/CD pipelines and automation.',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
  },
]

const tools = [
  { category: 'Developer', items: ['JSON Formatter', 'Base64 Encoder', 'UUID Generator', 'JWT Decoder', 'Regex Tester', 'URL Encoder'], href: '/tools/developer' },
  { category: 'Security', items: ['Password Generator', 'Hash Generator', 'TOTP Generator', 'HMAC Generator'], href: '/tools/security' },
  { category: 'Data', items: ['CSV to JSON', 'JSON to CSV', 'SQL Formatter', 'Fake Data Generator', 'Base Converter'], href: '/tools/data' },
]

function FeaturesSection() {
  return (
    <section className="section" id="features">
      <div className="section-header">
        <div className="section-badge">Why Utility Tools</div>
        <h2 className="section-title">Built for developers who ship</h2>
        <p className="section-description">
          Every feature designed to eliminate friction and keep you focused on what matters.
        </p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <article 
              key={feature.title} 
              className="feature-card"
              style={{ 
                '--card-gradient': feature.gradient,
                animationDelay: `${index * 150}ms` 
              } as React.CSSProperties}
            >
              <div className="feature-card-glow" />
              <div className="feature-card-content">
                <div className="feature-icon-wrapper">
                  <Icon className="feature-icon" size={24} strokeWidth={2} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-link">
                  Learn more <span className="feature-arrow">→</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ToolsSection() {
  return (
    <section className="section">
      <div className="section-header">
        <div className="section-badge">Full Stack Development</div>
        <h2 className="section-title">40+ tools at your fingertips</h2>
        <p className="section-description">
          From encoding to encryption, everything you need in one place.
        </p>
      </div>
      <div className="features-grid">
        {tools.map((group) => (
          <article key={group.category} className="feature-card">
            <h3 className="feature-title">{group.category}</h3>
            <ul style={{ margin: '16px 0 24px', padding: 0, listStyle: 'none' }}>
              {group.items.map((item) => (
                <li key={item} style={{ padding: '8px 0', color: 'var(--text-secondary)', fontSize: '14px', borderBottom: '1px solid var(--border)' }}>
                  {item}
                </li>
              ))}
            </ul>
            <Link className="btn secondary" to={group.href} style={{ width: '100%' }}>
              Open {group.category} Tools →
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { label: 'Faster Processing', value: '3.5x', unit: 'vs browser extensions' },
    { label: 'Response Time', value: '<50', unit: 'milliseconds' },
    { label: 'Cost Savings', value: '100%', unit: 'free forever' },
    { label: 'Availability', value: '99.98%', unit: 'uptime SLA' },
  ]

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-badge">Proven Results</div>
        <h2 className="section-title">Ship faster, save time</h2>
        <p className="section-description">
          Measurable improvements for teams that care about velocity.
        </p>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stats-card">
            <div className="stats-card-label">{stat.label}</div>
            <div className="stats-card-value">{stat.value}</div>
            <div className="stats-card-unit">{stat.unit}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="cta-section">
      <h2 className="cta-title">Ready to streamline your workflow?</h2>
      <p className="cta-description">
        Start using the tools instantly. No signup required.
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link className="btn primary" to="/tools/developer">Explore Tools →</Link>
        <a className="btn ghost" href="https://github.com/vaibhavcoding69/utility-tools" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <ToolsSection />
      <StatsSection />
      <CTASection />
    </>
  )
}
