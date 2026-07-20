import Icon from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'

function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header className="flex items-center justify-between px-5 md:px-6 py-2.5 bg-background shadow-sm sticky top-0 z-40">
      <div>
        <h1 className="font-headline-sm text-[16px] leading-tight text-primary">
          Assalamu Alaikum, {user?.displayName || 'there'}
        </h1>
        <p className="text-[12px] text-on-surface-variant">
          Welcome back to your venue command center.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
          <Icon name="notifications" className="text-[20px]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full border-2 border-background" />
        </button>
        <div className="h-5 w-px bg-outline-variant" />
        <button className="flex items-center gap-1.5 font-semibold text-primary hover:text-secondary transition-colors">
          <Icon name="account_circle" className="text-[20px]" />
          <span className="hidden sm:block text-[13px]">My Profile</span>
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader
