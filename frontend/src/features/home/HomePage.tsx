import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hero } from "./Hero";
import api from "../../lib/api";
import { toolIndex, searchTools, getQuickActions} from "../../config/tools";
import { 
  Search, 
  ArrowUpRight,
  Check
} from "lucide-react";
import Lottie from 'lottie-react';
import accuracyAnimation from '../../assets/icons8-accuracy.json'; // Downloaded Lottie animation
import lockAnimation from '../../assets/icons8-lock.json'; // Lock icon animation
import developerAnimation from '../../assets/icons8-developer.json'; // Developer icon animation

// Premium feature showcase data
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

// const tools = [
//   {
//     category: "Developer",
//     items: [
//       "JSON Formatter",
//       "Base64 Encoder",
//       "UUID Generator",
//       "JWT Decoder",
//       "Regex Tester",
//       "URL Encoder",
//     ],
//     href: "/tools/developer",
//   },
//   {
//     category: "Security",
//     items: [
//       "Password Generator",
//       "Hash Generator",
//       "TOTP Generator",
//       "HMAC Generator",
//     ],
//     href: "/tools/security",
//   },
//   {
//     category: "Data",
//     items: [
//       "CSV to JSON",
//       "JSON to CSV",
//       "SQL Formatter",
//       "Fake Data Generator",
//       "Base Converter",
//     ],
//     href: "/tools/data",
//   },
// ];

// const categoryFilters = [
//   {
//     label: "Developer",
//     caption: "Encoding, payloads, diffing",
//     href: "/tools/developer",
//   },
//   {
//     label: "Security",
//     caption: "Passwords, hashes, TOTP",
//     href: "/tools/security",
//   },
//   { label: "Data", caption: "CSV/JSON, SQL, fake data", href: "/tools/data" },
// ];

// const toolIndex = [
//   {
//     name: "JSON Formatter",
//     description: "Format & validate JSON payloads",
//     href: "/tools/developer/json",
//     category: "Developer",
//     keywords: ["json", "format", "validate"],
//   },
//   {
//     name: "Base64 Encoder",
//     description: "Encode/decode Base64 strings",
//     href: "/tools/developer/base64",
//     category: "Developer",
//     keywords: ["base64", "encode", "decode"],
//   },
//   {
//     name: "URL Encoder",
//     description: "Escape URLs safely",
//     href: "/tools/developer/url",
//     category: "Developer",
//     keywords: ["url", "encode", "decode"],
//   },
//   {
//     name: "UUID Generator",
//     description: "Generate UUID v1 & v4",
//     href: "/tools/developer/uuid",
//     category: "Developer",
//     keywords: ["uuid", "id", "unique"],
//   },
//   {
//     name: "Regex Tester",
//     description: "Run expressions with flags",
//     href: "/tools/developer/regex",
//     category: "Developer",
//     keywords: ["regex", "pattern", "test"],
//   },
//   {
//     name: "JWT Decoder",
//     description: "Inspect token payloads",
//     href: "/tools/developer/jwt",
//     category: "Developer",
//     keywords: ["jwt", "token"],
//   },
//   {
//     name: "Text Diff",
//     description: "Compare two inputs",
//     href: "/tools/developer/diff",
//     category: "Developer",
//     keywords: ["diff", "compare"],
//   },
//   {
//     name: "Password Generator",
//     description: "Create secure passwords",
//     href: "/tools/security/password",
//     category: "Security",
//     keywords: ["password", "generator"],
//   },
//   {
//     name: "Hash Generator",
//     description: "SHA, MD5, and more",
//     href: "/tools/security/hash",
//     category: "Security",
//     keywords: ["hash", "sha", "md5"],
//   },
//   {
//     name: "TOTP Generator",
//     description: "2FA compatible codes",
//     href: "/tools/security/totp",
//     category: "Security",
//     keywords: ["totp", "2fa"],
//   },
//   {
//     name: "CSV to JSON",
//     description: "Convert CSV quickly",
//     href: "/tools/data/csv-to-json",
//     category: "Data",
//     keywords: ["csv", "json"],
//   },
//   {
//     name: "JSON to CSV",
//     description: "Flatten arrays to CSV",
//     href: "/tools/data/json-to-csv",
//     category: "Data",
//     keywords: ["json", "csv"],
//   },
//   {
//     name: "SQL Formatter",
//     description: "Beautify SQL queries",
//     href: "/tools/data/sql",
//     category: "Data",
//     keywords: ["sql", "format"],
//   },
//   {
//     name: "Fake Data",
//     description: "Generate personas & more",
//     href: "/tools/data/fake-data",
//     category: "Data",
//     keywords: ["fake", "data", "mock"],
//   },
//   {
//     name: "Base Converter",
//     description: "Convert between bases",
//     href: "/tools/data/base-converter",
//     category: "Data",
//     keywords: ["base", "convert"],
//   },
// ];

const quickActions = getQuickActions();

const toolIdByHref: Record<string, string> = {
  "/tools/developer/json": "json",
  "/tools/developer/base64": "base64",
  "/tools/developer/url": "url",
  "/tools/developer/uuid": "uuid",
  "/tools/developer/regex": "regex",
  "/tools/developer/jwt": "jwt",
  "/tools/developer/diff": "diff",
  "/tools/security/password": "password",
  "/tools/security/hash": "hash",
  "/tools/security/totp": "totp",
  "/tools/data/csv-to-json": "csv-to-json",
  "/tools/data/json-to-csv": "json-to-csv",
  "/tools/data/sql": "sql",
  "/tools/data/fake-data": "fake-data",
  "/tools/data/base-converter": "base-converter",
};

const sortByUsage = (items: typeof toolIndex, usage: Record<string, number>) => {
  return [...items].sort((a, b) => {
    const aKey = toolIdByHref[a.href];
    const bKey = toolIdByHref[b.href];
    const aCount = aKey ? usage[aKey] || 0 : 0;
    const bCount = bKey ? usage[bKey] || 0 : 0;

    if (bCount !== aCount) {
      return bCount - aCount;
    }

    return a.name.localeCompare(b.name);
  });
};

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
  const [usage, setUsage] = useState<Record<string, number>>({});
  useEffect(() => {
    let active = true;
    api
      .toolUsage(10)
      .then((response) => {
        if (!active || !response?.success) return;
        const map: Record<string, number> = {};
        (response.tools as { id: string; count: number }[]).forEach((tool) => {
          map[tool.id] = tool.count;
        });
        setUsage(map);
      })
      .catch(() => {
        if (!active) return;
        setUsage({});
      });

    return () => {
      active = false;
    };
  }, []);

  const normalized = query.trim().toLowerCase();
  const results = normalized ? searchTools(query) : [];

  const visibleResults = results.slice(0, 5);
  const sortedQuickActions = sortByUsage(quickActions, usage);

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
      {/* <FeaturesSection /> */}
      <StatsSection />
      <PremiumFeaturesSection />
      <CTASection />
    </>
  );
}
