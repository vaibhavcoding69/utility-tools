import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hero } from "./Hero";
import { searchTools, getQuickActions} from "../../config/tools";
import { 
  Search, 
  ArrowUpRight,
  Check
} from "lucide-react";
import Lottie from 'lottie-react';
import accuracyAnimation from '../../assets/icons8-accuracy.json';
import lockAnimation from '../../assets/icons8-lock.json';
import developerAnimation from '../../assets/icons8-developer.json';

const premiumFeatures = [
  {
    badge: "Developer Experience",
    title: "Designed for Focus",
    description: "Keyboard shortcuts. Instant results. Copy with one click. We got out of your way so you can stay in flow.",
    icon: () => <Lottie animationData={accuracyAnimation} style={{width: 120, height: 120}} className="lottie-icon-invert-dark" />,
    features: [
      "Keyboard-first navigation",
      "One-click copy to clipboard",
      "Shareable result URLs",
      "Dark mode by default"
    ]
  },
  {
    badge: "API Access",
    title: "API First",
    description: "Use our tools in your own scripts. Simple API access for everything you see here.",
    icon: () => <Lottie animationData={developerAnimation} style={{width: 120, height: 120}} className="lottie-icon-invert" />,
    features: [
      "RESTful JSON endpoints",
      "OpenAPI 3.0 documentation",
      "Generous rate limits",
      "Webhook support planned"
    ]
  },
  {
    badge: "Privacy First",
    title: "No Ads, No Tracking",
    description: "We don't spy on you. We don't sell your data. We just built tools that work locally in your browser.",
    icon: () => <Lottie animationData={lockAnimation} style={{width: 120, height: 120}} className="lottie-icon-invert" />,
    features: [
      "Zero analytics",
      "No third-party trackers",
      "Client-side processing",
      "Open source code"
    ]
  }
];

const quickActions = getQuickActions();

function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function UtilityDock() {
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();
  const results = normalized ? searchTools(query) : [];

  const visibleResults = results.slice(0, 5);
  const sortedQuickActions = quickActions;

  return (
    <section className="command-dock" aria-label="Tool navigation">
      <div className="command-search">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search tools, e.g. “JWT” or “CSV”"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {normalized && (
        <div className="command-results" role="listbox">
          {visibleResults.length ? (
            visibleResults.map((tool) => (
              <Link
                key={tool.name}
                to={tool.href}
                className="command-result-item"
              >
                <div>
                  <p>{tool.name}</p>
                  <span>{tool.description}</span>
                </div>
                <span>{tool.category}</span>
              </Link>
            ))
          ) : (
            <p className="command-result-empty">No matches for that query.</p>
          )}
        </div>
      )}
      <div className="quick-actions-grid">
        {sortedQuickActions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="quick-action-card"
          >
            <div className="quick-action-title">
              {action.name}
              <ArrowUpRight size={16} />
            </div>
            <p>{action.description}</p>
            <span>{action.category}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    {
      label: "Faster Processing",
      value: "3.5x",
      unit: "vs browser extensions",
    },
    { label: "Response Time", value: "<50", unit: "milliseconds" },
    { label: "Cost Savings", value: "100%", unit: "free forever" },
    { label: "Availability", value: "99.98%", unit: "uptime" },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-badge">Proven Results</div>
        <h2 className="section-title">Built for speed</h2>
        <p className="section-description">
          We know you hate waiting. That's why everything here is instant.
        </p>
      </div>
      <div className="animated-stats">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="animated-stat reveal"
            style={{ transitionDelay: `${index * 90}ms` }}
          >
            <div className="animated-stat-value">{stat.value}</div>
            <div className="animated-stat-label">{stat.label}</div>
            <div className="animated-stat-sublabel">{stat.unit}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PremiumFeaturesSection() {
  return (
    <section className="section">
      <div className="premium-features">
        {premiumFeatures.map((feature) => {
          return (
            <div key={feature.title} className="premium-feature reveal">
              <div className="premium-feature-content">
                <div className="premium-feature-badge">
                  <span className="premium-feature-badge-dot" />
                  {feature.badge}
                </div>
                <h2 className="premium-feature-title">{feature.title}</h2>
                <p className="premium-feature-description">{feature.description}</p>
                <ul className="premium-feature-list">
                  {feature.features.map((item) => (
                    <li key={item} className="premium-feature-list-item">
                      <span className="premium-feature-list-icon">
                        <Check size={12} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="premium-feature-visual">
                {feature.icon()}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="cta-section">
      <h2 className="cta-title">Start using it now</h2>
      <p className="cta-description">
        No signup. No credit card. Just tools.
      </p>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link className="btn primary" to="/tools">
          Explore →
        </Link>
        <a
          className="btn ghost"
          href="https://github.com/vaibhavcoding69/utility-tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </div>
    </section>
  );
}

export default function HomePage() {
  useRevealOnScroll();

  return (
    <>
      <div className="reveal visible">
        <Hero />
      </div>
      <div className="reveal">
        <UtilityDock />
      </div>
      <StatsSection />
      <PremiumFeaturesSection />
      <CTASection />
    </>
  );
}
