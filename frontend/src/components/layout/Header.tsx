import { ChevronDown } from 'lucide-react'

const navItems = [
  { label: 'Model Platform', hasDropdown: true },
  { label: 'GPU Cloud', hasDropdown: true },
  { label: 'Solutions', hasDropdown: true },
  { label: 'Developers', hasDropdown: true },
  { label: 'Pricing', hasDropdown: true },
  { label: 'Company', hasDropdown: true },
]

export function Header() {
  return (
    <header className="nav">
      <div className="nav-left">
        <div className="logo">together.ai</div>
        <nav className="nav-menu">
          {navItems.map((item) => (
            <button key={item.label} className="nav-item">
              {item.label}
              {item.hasDropdown && <ChevronDown size={14} />}
            </button>
          ))}
        </nav>
      </div>
      <div className="nav-actions">
        <button className="btn-signin">Sign in</button>
        <button className="btn-contact">Contact sales</button>
      </div>
    </header>
  )
}

export default Header
