import Icon from '../ui/Icon'

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'mail', label: 'Inquiries' },
  { icon: 'event_available', label: 'Bookings' },
  { icon: 'storefront', label: 'My Venues' },
  { icon: 'payments', label: 'Earnings' },
  { icon: 'settings', label: 'Settings' },
]

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAN7Oa5EjnIP4Bq91N9yq18t9hKJqAk6ycgf5lgXTlsNxoA-u3JXaSiU_OIWlrgSfA9vBGNLNMR_XKkOpHM856Xf95SPkeUkhVP2jQLu16_obAE2LesXWMay8wuxquO_hz86iqI3DdhneXjcAiNRr7gU9RseftTMC0Zdt7q6d349c1umA7qfmHLQfJMH803mhko4DL2tURjcsXyqhyigYKp0ae9xHpXGAj86HuOdrdrabC-_bOULnttNsQ4PxjIQ3IsjbtCUqoo6KQ'

function ProviderSidebar({ venueName = 'Royal Palms Marquee' }) {
  return (
    <aside className="hidden md:flex flex-col h-screen w-52 bg-primary text-on-primary shadow-lg fixed left-0 top-0 z-50">
      <div className="px-4 py-4">
        <span className="font-display-lg text-[17px] text-secondary-fixed font-bold">
          ShaadiHub
        </span>
      </div>

      {/* Profile */}
      <div className="px-4 mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant/20 shrink-0">
          <img className="w-full h-full object-cover" src={PROFILE_IMAGE} alt="" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-title-lg text-[12px] leading-tight truncate">{venueName}</span>
          <span className="font-label-caps text-[9px] text-on-primary/60 uppercase tracking-widest">
            Provider Account
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              item.active
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'text-on-primary/80 hover:bg-primary-container'
            }`}
          >
            <Icon name={item.icon} className="text-[18px]" />
            <span className="font-label-caps text-[10px] uppercase">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="px-3 py-4 space-y-2">
        <button className="w-full py-2 px-3 bg-secondary text-on-secondary rounded-lg font-bold text-xs uppercase tracking-wide hover:brightness-110 transition-all flex items-center justify-center gap-1.5">
          <Icon name="add" className="text-[16px]" />
          Add New Venue
        </button>
        <div className="pt-2 border-t border-on-primary/10">
          <a
            href="#"
            className="flex items-center gap-2.5 text-on-primary/60 px-2 py-1.5 hover:text-on-primary transition-colors"
          >
            <Icon name="help" className="text-[16px]" />
            <span className="text-[11px] font-semibold">Help Center</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2.5 text-on-primary/60 px-2 py-1.5 hover:text-on-primary transition-colors"
          >
            <Icon name="logout" className="text-[16px]" />
            <span className="text-[11px] font-semibold">Logout</span>
          </a>
        </div>
      </div>
    </aside>
  )
}

export default ProviderSidebar
