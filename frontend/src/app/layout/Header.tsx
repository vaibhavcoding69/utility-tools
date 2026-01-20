import { Link, useLocation } from "react-router-dom";
import { useThemeStore } from "../../lib/store";
import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const navLinks = [
  { label: "Developer", href: "/tools/developer" },
  { label: "Security", href: "/tools/security" },
  { label: "Data", href: "/tools/data" },
];

export function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <header className="site-header">
      {/* <Link to="/" className="brand">
        <div className="brand-mark">UT</div>
        <span className="brand-name">Utility Tools</span>
      </Link> */}
      <nav className="nav-links" aria-label="Primary">
        {navLinks.map((item) => (
          <Link
            key={item.label}
            className={`nav-link ${location.pathname.startsWith(item.href) ? "active" : ""}`}
            to={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="nav-actions">
        <button
          onClick={toggleTheme}
          className="btn ghost"
          style={{ padding: "8px 12px" }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {/* <Link className="btn primary" to="/tools/developer">
          Get Started
        </Link> */}
      </div>
    </header>
  );
}

export default Header;
