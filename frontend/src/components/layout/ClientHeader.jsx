import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Icon from '../ui/Icon'
import NotificationBadge from '../ui/NotificationBadge'
import { useAuth } from '../../context/AuthContext'
import useBookingNotificationCount from '../../hooks/useBookingNotificationCount'
import { useFavorites } from '../../context/FavoritesContext'

const BASE_NAV_ITEMS = [
  { label: 'Browse Venues', to: '/venues' },
  { label: 'Favorites', to: '/favorites' },
]

function ClientHeader({ searchValue, onSearchChange }) {
  const { user } = useAuth()
  const [localSearch, setLocalSearch] = useState('')
  const notificationCount = useBookingNotificationCount()
  const { favoriteIds } = useFavorites()

  const isControlled = searchValue !== undefined
  const search = isControlled ? searchValue : localSearch

  const handleSearchChange = (e) => {
    if (isControlled) onSearchChange?.(e.target.value)
    else setLocalSearch(e.target.value)
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
                `flex items-center gap-1.5 text-[13px] font-semibold pb-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-secondary'
                }`
              }
            >
              {item.label}
              {item.label === 'My Requests' && <NotificationBadge count={notificationCount} />}
              {item.label === 'Favorites' && favoriteIds.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold leading-none">
                  {favoriteIds.length > 9 ? '9+' : favoriteIds.length}
                </span>
              )}
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

        {user ? (
          <Link
            to="/account/settings"
            className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full hover:bg-surface-container-low transition-colors"
            title="Account Settings"
          >
            <span className="hidden md:block text-[13px] font-semibold text-primary">
              {user.displayName}
            </span>
            <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-outline-variant">
              <Icon name="person" className="text-[18px]" />
            </span>
          </Link>
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
