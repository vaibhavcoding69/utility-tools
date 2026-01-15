const navLinks = [
  { label: 'Overview', href: '#home' },
  { label: 'Tools', href: '#tools' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'Docs', href: '#docs' },
  { label: 'Status', href: '#status' },
]

export function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-mark">UT</div>
        <div className="brand-text">
          <span className="brand-name">Utility Tools</span>
        </div>
      </div>
      <nav className="nav-links" aria-label="Primary">
        {navLinks.map((item) => (
          <a key={item.label} className="nav-link" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <a className="btn ghost" href="#home">Overview</a>
        <a className="btn primary" href="#tool-desk">Open tools</a>
      </div>
    </header>
  )
}

export default Header
