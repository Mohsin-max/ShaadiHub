import { Link, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' },
  { icon: 'storefront', label: 'Venue Owners', to: '/admin/venue-owners' },
  { icon: 'group', label: 'Clients', to: '/admin/clients' },
  { icon: 'domain', label: 'Venues', to: '/admin/venues' },
]

function AdminSidebar({ activeLabel = 'Dashboard' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <aside className="hidden md:flex flex-col h-screen w-52 bg-primary text-on-primary shadow-lg fixed left-0 top-0 z-50">
      <div className="px-4 py-4">
        <span className="font-display-lg text-[17px] text-secondary-fixed font-bold">
          ShaadiHub
        </span>
        <span className="block text-[9px] font-label-caps text-on-primary/60 uppercase tracking-widest">
          Admin
        </span>
      </div>

      <div className="px-4 mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
          <Icon name="shield_person" className="text-on-secondary-container text-[16px]" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-title-lg text-[12px] leading-tight truncate">
            {user?.displayName || 'Admin'}
          </span>
          <span className="font-label-caps text-[9px] text-on-primary/60 uppercase tracking-widest">
            Administrator
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === activeLabel
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-bold'
                  : 'text-on-primary/80 hover:bg-primary-container'
              }`}
            >
              <Icon name={item.icon} className="text-[18px]" />
              <span className="font-label-caps text-[10px] uppercase flex-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4">
        <div className="pt-2 border-t border-on-primary/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 text-on-primary/60 px-2 py-1.5 hover:text-on-primary transition-colors"
          >
            <Icon name="logout" className="text-[16px]" />
            <span className="text-[11px] font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
