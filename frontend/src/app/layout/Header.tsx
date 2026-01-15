type HeaderProps = {
  onLaunchTools?: () => void
  onBackHome?: () => void
  isToolsView?: boolean
}

const navLinks = [
  { label: 'Overview', href: '#home' },
  { label: 'Tools', href: '#tools' },
  { label: 'Changelog', href: '#changelog' },
]

export function Header({ onLaunchTools, onBackHome, isToolsView }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-mark">UT</div>
        <div className="brand-text">
          <span className="brand-name">Utility Tools</span>
          <span className="brand-sub">Fast, reliable helpers for builders</span>
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
        {isToolsView ? (
          <button className="btn ghost" onClick={onBackHome}>Back</button>
        ) : (
          <button className="btn ghost" onClick={onBackHome}>Overview</button>
        )}
        <button className="btn primary" onClick={onLaunchTools}>Open tools</button>
      </div>
    </header>
  )
}

export default Header
