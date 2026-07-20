import Icon from '../ui/Icon'

function DashboardHeader({ greetingName = 'Royal Palms' }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-background shadow-sm sticky top-0 z-40">
      <div>
        <h1 className="font-headline-sm text-[20px] leading-tight text-primary">
          Assalamu Alaikum, {greetingName}
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          Welcome back to your venue command center.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
          <Icon name="notifications" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background" />
        </button>
        <div className="h-6 w-px bg-outline-variant" />
        <button className="flex items-center gap-2 font-semibold text-primary hover:text-secondary transition-colors">
          <Icon name="account_circle" />
          <span className="hidden sm:block text-body-sm">My Profile</span>
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader
