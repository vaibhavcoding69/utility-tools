import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, Shield, Sparkles } from 'lucide-react'

type InfoPanel =
  | {
      id: string
      type: 'metrics'
      title: string
      primary: string
      note: string
      metrics: { label: string; value: string }[]
    }
  | {
      id: string
      type: 'text'
      title: string
      eyebrow?: string
      body: string
      icon: LucideIcon
    }
  | {
      id: string
      type: 'list'
      title: string
      items: { label: string; status: string }[]
    }

const infoPanels: InfoPanel[] = [
  {
    id: 'conformance',
    type: 'metrics',
    title: 'Conformance',
    primary: '9.5',
    note: 'Excellent',
    metrics: [
      { label: 'Total Issues', value: '34' },
      { label: 'Major Issues', value: '12' },
    ],
  },
  {
    id: 'secure',
    type: 'text',
    eyebrow: 'Secure Compute',
    title: 'Limit your exposure.',
    body: 'Internal APIs, private databases, and runtime traces stay off the public internet. Dedicated IPs, no shared tenants.',
    icon: Shield,
  },
  {
    id: 'ops',
    type: 'list',
    title: 'Workflow queue',
    items: [
      { label: 'Data tools rollout', status: '00:32 ETA' },
      { label: 'JWT inspector update', status: 'Shipped' },
      { label: 'Hash ring audit', status: 'In review' },
    ],
  },
]

const heroQuickLinks = [
  { label: 'JSON Formatter', href: '/tools/developer/json' },
  { label: 'UUID Generator', href: '/tools/developer/uuid' },
  { label: 'Hash Generator', href: '/tools/security/hash' },
  { label: 'CSV ⇌ JSON', href: '/tools/data/csv-to-json' },
]

function InfoCard({ panel }: { panel: InfoPanel }) {
  if (panel.type === 'metrics') {
    return (
      <article className="info-card metrics">
        <header>
          <p className="eyebrow">{panel.title}</p>
          <div className="metrics-primary">
            <span>{panel.primary}</span>
            <small>{panel.note}</small>
          </div>
        </header>
        <div className="metrics-details">
          {panel.metrics.map((metric) => (
            <div key={metric.label}>
              <p className="metrics-label">{metric.label}</p>
              <p className="metrics-value">{metric.value}</p>
            </div>
          ))}
        </div>
      </article>
    )
  }

  if (panel.type === 'text') {
    const Icon = panel.icon
    return (
      <article className="info-card narrative">
        {panel.eyebrow && <p className="eyebrow">{panel.eyebrow}</p>}
        <div className="narrative-title">
          <Icon size={18} />
          <h3>{panel.title}</h3>
        </div>
        <p className="narrative-body">{panel.body}</p>
      </article>
    )
  }

  return (
    <article className="info-card list">
      <p className="eyebrow">{panel.title}</p>
      <ul>
        {panel.items.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <span>{item.status}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function HeroVisualFrame() {
  return (
    <div className="hero-visual-card">
      <div className="hero-visual">
        <div className="hero-visual-placeholder">
          <Sparkles size={18} />
          <div>
            <p>Bring your own graphic</p>
            <span>Drop a render into /public/hero-visual.png and update this slot.</span>
          </div>
        </div>
      </div>
      <div className="hero-visual-actions">
        <p className="hero-visual-hint">This frame is ready for your custom artwork or video still.</p>
      </div>
    </div>
  )
}

export function Hero() {
  const [requestCount, setRequestCount] = useState<string>('0')

  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await fetch('/api/stats/requests')
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
      <div className="hero-lines" aria-hidden="true" />

      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Introducing Utility Ops
          </div>
          <h1 className="hero-title">
            Introducing the latest <span className="gradient-text">utility tools</span> to power your workflow.
          </h1>
          <p className="hero-lead">
            From JSON diffing to secure token tooling, this surface keeps your favorite utilities pinned, performant, and ready in <strong>two clicks</strong>.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/tools/developer">Launch developer suite →</Link>
            <a className="btn ghost" href="#features">Explore platform</a>
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
          <div className="hero-chips">
            {heroQuickLinks.map((link) => (
              <Link key={link.label} to={link.href} className="hero-chip">
                <ArrowUpRight size={16} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <HeroVisualFrame />
          <div className="hero-info-grid">
            {infoPanels.map((panel) => (
              <InfoCard key={panel.id} panel={panel} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
