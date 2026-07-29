import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

const NAV_LINKS = [
  { label: 'Browse Venues', to: '/venues' },
  { label: 'How It Works', to: '#how-it-works' },
  { label: 'For Venue Owners', to: '#for-owners' },
]

function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/60">
      <div className="max-w-[1280px] mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display-lg text-[20px] font-bold text-primary">
          ShaadiHub
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-[13px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-[13px] font-semibold text-primary hover:text-secondary transition-colors px-2"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="flex items-center gap-1.5 bg-antique-gold text-primary px-4 py-2 rounded-lg text-[13px] font-bold hover:brightness-105 transition-all"
          >
            Get Started
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 text-primary"
          aria-label="Toggle menu"
        >
          <Icon name={menuOpen ? 'close' : 'menu'} className="text-[24px]" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background border-t border-outline-variant px-5 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.to}
              onClick={() => setMenuOpen(false)}
              className="block text-[14px] font-semibold text-on-surface py-1.5"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-outline-variant flex flex-col gap-2.5">
            <Link
              to="/login"
              className="text-center py-2.5 text-[13px] font-bold text-primary border border-outline-variant rounded-lg"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-center py-2.5 text-[13px] font-bold text-primary bg-antique-gold rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default LandingHeader
