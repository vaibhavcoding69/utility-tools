import { Moon } from 'lucide-react'

const categories = ['Dev', 'Data', 'Security', 'Media', 'Productivity']

export function Header() {
  return (
    <header className="nav">
      <div className="nav-left">
        <div style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>z1x</div>
        <div className="nav-tabs">
          {categories.map((cat) => (
            <span key={cat} className="nav-tab muted">
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div className="nav-actions">
        <button className="theme-toggle" aria-label="Toggle theme">
          <Moon size={16} />
        </button>
      </div>
    </header>
  )
}

export default Header
