import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Shield, Sparkles } from "lucide-react";

type InfoPanel =
  | {
      id: string;
      type: "metrics";
      title: string;
      primary: string;
      note: string;
      metrics: { label: string; value: string }[];
    }
  | {
      id: string;
      type: "text";
      title: string;
      eyebrow?: string;
      body: string;
      icon: LucideIcon;
    }
  | {
      id: string;
      type: "list";
      title: string;
      items: { label: string; status: string }[];
    };

const heroQuickLinks = [
  { label: "JSON Formatter", href: "/tools/developer/json" },
  { label: "UUID Generator", href: "/tools/developer/uuid" },
  { label: "Hash Generator", href: "/tools/security/hash" },
  { label: "CSV ⇌ JSON", href: "/tools/data/csv-to-json" },
];

function InfoCard({ panel }: { panel: InfoPanel }) {
  if (panel.type === "metrics") {
    return (
      <article className="info-card metrics">
        <p className="eyebrow">{panel.title}</p>
        <div className="metric-primary">
          <span className="metric-value">{panel.primary}</span>
          <span className="metric-note">{panel.note}</span>
        </div>
        <div className="metric-grid">
          {panel.metrics.map((metric) => (
            <div key={metric.label} className="metric-tile">
              <span className="metric-label">{metric.label}</span>
              <span className="metric-number">{metric.value}</span>
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (panel.type === "text") {
    const Icon = panel.icon;
    return (
      <article className="info-card text">
        {panel.eyebrow ? <p className="eyebrow">{panel.eyebrow}</p> : null}
        <div className="text-row">
          <div className="text-icon" aria-hidden>
            <Icon size={16} />
          </div>
          <div>
            <h3>{panel.title}</h3>
            <p>{panel.body}</p>
          </div>
        </div>
      </article>
    );
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
  );
}

function HeroVisualFrame() {
  return (
    <div className="hero-visual-card">
      <div className="hero-visual">
        <div className="hero-visual-placeholder">
          <Sparkles size={18} />
          {/* <div>
            <p>Bring your own graphic</p>
            <span>
              Drop a render into /public/hero-visual.png and update this slot.
            </span>
          </div> */}
        </div>
      </div>
      <div className="hero-visual-actions">
        <p className="hero-visual-hint">
          {/* This frame is ready for your custom artwork or video still. */}
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  const [requestCount, setRequestCount] = useState<string>("0");
  const totalTools = 32;
  const totalDeveloperTools = 24;
  const totalSecurityTools = 3;
  const totalDataTools = 5;

  const infoPanels: InfoPanel[] = [
    {
      id: "usage",
      type: "metrics",
      title: "Live usage",
      primary: requestCount,
      note: "Requests processed",
      metrics: [
        { label: "Requests", value: requestCount },
        { label: "Avg. latency", value: "48ms" },
        { label: "Uptime", value: "99.98%" },
      ],
    },
    {
      id: "secure",
      type: "text",
      eyebrow: "Secure Compute",
      title: "Limit your exposure.",
      body: "Internal APIs, private databases, and runtime traces stay off the public internet. Dedicated IPs, no shared tenants.",
      icon: Shield,
    },
    {
      id: "ops",
      type: "list",
      title: "Catalog",
      items: [
        { label: "Developer tools", status: `${totalDeveloperTools}` },
        { label: "Security tools", status: `${totalSecurityTools}` },
        { label: "Data tools", status: `${totalDataTools}` },
        { label: "Total", status: `${totalTools}` },
      ],
    },
  ];

  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await fetch("/api/stats/requests");
        const data = await response.json();
        setRequestCount(new Intl.NumberFormat().format(data.count));
      } catch {
        setRequestCount("NaN");
      }
    };
    fetchRequestCount();

    const interval = setInterval(fetchRequestCount, 5000);
    return () => clearInterval(interval);
  }, []);

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
            Free + No ads 
          </div>
          <h1 className="hero-title">
            Introducing the latest{" "}
            <span className="gradient-text">utility tools</span> to power your
            workflow.
          </h1>
          <p className="hero-lead">
            From JSON diffing to secure token tooling, this surface keeps your
            favorite utilities pinned, performant, and ready in{" "}
            <strong>two clicks</strong>.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/tools/developer">
              Launch developer suite →
            </Link>
            <a className="btn ghost" href="#features">
              Explore platform
            </a>
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
  );
}

export default Hero;
