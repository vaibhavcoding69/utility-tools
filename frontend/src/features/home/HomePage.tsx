import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hero } from "./Hero";
import { Zap, Shield, Sparkles, Search, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Sub-50ms response times. Pages load instantly so you stay in flow and ship faster.",
    gradient: "linear-gradient(135deg, #ffffff 0%, #d9d9d9 100%)",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data never leaves our servers. No third-party tracking, no analytics spyware.",
    gradient: "linear-gradient(135deg, #e5e5e5 0%, #bfbfbf 100%)",
  },
  {
    icon: Sparkles,
    title: "Production Ready",
    description:
      "Typed endpoints, validation, and helpful errors. Built for CI/CD pipelines and automation.",
    gradient: "linear-gradient(135deg, #ffffff 0%, #cfcfcf 100%)",
  },
];

const tools = [
  {
    category: "Developer",
    items: [
      "JSON Formatter",
      "Base64 Encoder",
      "UUID Generator",
      "JWT Decoder",
      "Regex Tester",
      "URL Encoder",
    ],
    href: "/tools/developer",
  },
  {
    category: "Security",
    items: [
      "Password Generator",
      "Hash Generator",
      "TOTP Generator",
      "HMAC Generator",
    ],
    href: "/tools/security",
  },
  {
    category: "Data",
    items: [
      "CSV to JSON",
      "JSON to CSV",
      "SQL Formatter",
      "Fake Data Generator",
      "Base Converter",
    ],
    href: "/tools/data",
  },
];

const categoryFilters = [
  {
    label: "Developer",
    caption: "Encoding, payloads, diffing",
    href: "/tools/developer",
  },
  {
    label: "Security",
    caption: "Passwords, hashes, TOTP",
    href: "/tools/security",
  },
  { label: "Data", caption: "CSV/JSON, SQL, fake data", href: "/tools/data" },
];

const toolIndex = [
  {
    name: "JSON Formatter",
    description: "Format & validate JSON payloads",
    href: "/tools/developer/json",
    category: "Developer",
    keywords: ["json", "format", "validate"],
  },
  {
    name: "Base64 Encoder",
    description: "Encode/decode Base64 strings",
    href: "/tools/developer/base64",
    category: "Developer",
    keywords: ["base64", "encode", "decode"],
  },
  {
    name: "URL Encoder",
    description: "Escape URLs safely",
    href: "/tools/developer/url",
    category: "Developer",
    keywords: ["url", "encode", "decode"],
  },
  {
    name: "UUID Generator",
    description: "Generate UUID v1 & v4",
    href: "/tools/developer/uuid",
    category: "Developer",
    keywords: ["uuid", "id", "unique"],
  },
  {
    name: "Regex Tester",
    description: "Run expressions with flags",
    href: "/tools/developer/regex",
    category: "Developer",
    keywords: ["regex", "pattern", "test"],
  },
  {
    name: "JWT Decoder",
    description: "Inspect token payloads",
    href: "/tools/developer/jwt",
    category: "Developer",
    keywords: ["jwt", "token"],
  },
  {
    name: "Text Diff",
    description: "Compare two inputs",
    href: "/tools/developer/diff",
    category: "Developer",
    keywords: ["diff", "compare"],
  },
  {
    name: "Password Generator",
    description: "Create secure passwords",
    href: "/tools/security/password",
    category: "Security",
    keywords: ["password", "generator"],
  },
  {
    name: "Hash Generator",
    description: "SHA, MD5, and more",
    href: "/tools/security/hash",
    category: "Security",
    keywords: ["hash", "sha", "md5"],
  },
  {
    name: "TOTP Generator",
    description: "2FA compatible codes",
    href: "/tools/security/totp",
    category: "Security",
    keywords: ["totp", "2fa"],
  },
  {
    name: "CSV to JSON",
    description: "Convert CSV quickly",
    href: "/tools/data/csv-to-json",
    category: "Data",
    keywords: ["csv", "json"],
  },
  {
    name: "JSON to CSV",
    description: "Flatten arrays to CSV",
    href: "/tools/data/json-to-csv",
    category: "Data",
    keywords: ["json", "csv"],
  },
  {
    name: "SQL Formatter",
    description: "Beautify SQL queries",
    href: "/tools/data/sql",
    category: "Data",
    keywords: ["sql", "format"],
  },
  {
    name: "Fake Data",
    description: "Generate personas & more",
    href: "/tools/data/fake-data",
    category: "Data",
    keywords: ["fake", "data", "mock"],
  },
  {
    name: "Base Converter",
    description: "Convert between bases",
    href: "/tools/data/base-converter",
    category: "Data",
    keywords: ["base", "convert"],
  },
];

const quickActions = toolIndex.slice(0, 6);

// Simple scroll-triggered reveal animations
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
  const results = normalized
    ? toolIndex.filter((tool) =>
        [tool.name, tool.description, tool.category, ...tool.keywords]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
    : [];

  const visibleResults = results.slice(0, 5);

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
        <Link to="/tools/developer" className="command-search-link">
          Browse catalog
        </Link>
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
      <div
        className="command-pills"
        role="navigation"
        aria-label="Filter categories"
      >
        {categoryFilters.map((category) => (
          <Link
            key={category.label}
            className="command-pill"
            to={category.href}
          >
            <strong>{category.label}</strong>
            <span>{category.caption}</span>
          </Link>
        ))}
      </div>
      <div className="quick-actions-grid">
        {quickActions.map((action) => (
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

function FeaturesSection() {
  return (
    <section className="section" id="features">
      <div className="section-header">
        <div className="section-badge">Why Utility Tools</div>
        <h2 className="section-title">Built for developers who ship</h2>
        <p className="section-description">
          Every feature designed to eliminate friction and keep you focused on
          what matters.
        </p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="feature-card reveal"
              style={
                {
                  "--card-gradient": feature.gradient,
                  transitionDelay: `${index * 80}ms`,
                  animationDelay: `${index * 150}ms`,
                } as React.CSSProperties
              }
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
          );
        })}
      </div>
    </section>
  );
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
          <article key={group.category} className="feature-card reveal">
            <h3 className="feature-title">{group.category}</h3>
            <ul
              style={{ margin: "16px 0 24px", padding: 0, listStyle: "none" }}
            >
              {group.items.map((item) => (
                <li
                  key={item}
                  style={{
                    padding: "8px 0",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <Link
              className="btn secondary"
              to={group.href}
              style={{ width: "100%" }}
            >
              Open {group.category} Tools →
            </Link>
          </article>
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
    { label: "Availability", value: "99.98%", unit: "uptime SLA" },
  ];

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
          <div
            key={stat.label}
            className="stats-card reveal"
            style={{ transitionDelay: `${stats.indexOf(stat) * 90}ms` }}
          >
            <div className="stats-card-label">{stat.label}</div>
            <div className="stats-card-value">{stat.value}</div>
            <div className="stats-card-unit">{stat.unit}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="cta-section">
      <h2 className="cta-title">Ready to streamline your workflow?</h2>
      <p className="cta-description">
        Start using the tools instantly. No signup required.
      </p>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
        <Link className="btn primary" to="/tools/developer">
          Explore Tools →
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
      <FeaturesSection />
      <ToolsSection />
      <StatsSection />
      <CTASection />
    </>
  );
}
