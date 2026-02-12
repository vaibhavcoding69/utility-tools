import { Link } from "react-router-dom";
import { ArrowUpRight} from "lucide-react";

const heroQuickLinks = [
  { label: "JSON Formatter", href: "/tools/developer/json" },
  { label: "UUID Generator", href: "/tools/developer/uuid" },
  { label: "Hash Generator", href: "/tools/security/hash" },
  { label: "CSV ⇌ JSON", href: "/tools/data/csv-to-json" },
];

export function Hero() {
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
            Essential tools for{" "}
            <span className="gradient-text">developers</span>.
          </h1>
          <p className="hero-lead">
            Simple, fast, and privacy-focused. Zero ads, no tracking. Just the
            utilities you need to get the job done.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/tools">
              Get Started →
            </Link>
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
      </div>
    </section>
  );
}

export default Hero;
