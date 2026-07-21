import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'

const BASE_NAV_ITEMS = [
  { label: 'Browse Venues', to: '/venues' },
  { label: 'Favorites', to: '/favorites' },
]

const AVATAR_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAd3lpSQDoU_3gmMFUvFJ97LcWxuhZnI4HBFFyZDIcHnCcKq51qp88JYvZTWxpg31NUOnF3GSfyUbK48JYZJSSVv58V2SU6nDGcVt06d_iHzsGXI-a35c1Fk6eepVfVikrtpvmYBOf05cMO2gpRnceM9SMksjX7ljxBDyOhGf5t3dhtuLmWPYiyVB9ll6bjSa9A8w_YmTywwKVsz7ooM3zCQVTjkvFKF52DmpBWjzpxZ2f8YGUrmWWah9tbu3jVWHMkhSu1Q4-q4g'

function ClientHeader({ searchValue, onSearchChange }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [localSearch, setLocalSearch] = useState('')

  const isControlled = searchValue !== undefined
  const search = isControlled ? searchValue : localSearch

  const handleSearchChange = (e) => {
    if (isControlled) onSearchChange?.(e.target.value)
    else setLocalSearch(e.target.value)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems =
    user?.role === 'Client'
      ? [...BASE_NAV_ITEMS, { label: 'My Requests', to: '/my-requests' }]
      : BASE_NAV_ITEMS

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-5 md:px-6 h-14 bg-background/95 backdrop-blur-md border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/venues" className="font-display-lg text-[18px] font-bold text-primary">
          ShaadiHub
        </Link>
        <nav className="hidden md:flex gap-5">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `text-[13px] font-semibold pb-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-secondary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="hidden sm:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
          />
          <input
            className="w-full h-9 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-full text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Search venues, areas..."
            type="text"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === 'VenueOwner' && (
          <Link
            to="/provider/dashboard"
            className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-primary border border-outline-variant rounded-full px-3 py-1.5 hover:border-antique-gold/50 hover:bg-surface-container-low transition-colors"
          >
            <Icon name="dashboard" className="text-[15px]" />
            Dashboard
          </Link>
        )}

        <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors">
          <Icon name="notifications" className="text-[20px]" />
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-secondary-fixed flex items-center justify-center overflow-hidden border border-outline-variant">
              <img className="w-full h-full object-cover" src={AVATAR_IMAGE} alt="" />
            </div>
            <span className="hidden md:block text-[13px] font-semibold text-primary">
              {user.displayName}
            </span>
            <button
              onClick={handleLogout}
              className="text-[12px] font-semibold text-on-surface-variant hover:text-error transition-colors ml-1"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-[13px] font-semibold text-primary hover:text-secondary transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  )
}

export default ClientHeader
