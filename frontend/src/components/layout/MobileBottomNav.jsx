import Icon from '../ui/Icon'

const ITEMS = [
  { icon: 'dashboard', label: 'Home', active: true },
  { icon: 'mail', label: 'Inquiries' },
  { icon: 'storefront', label: 'Venues' },
  { icon: 'person', label: 'Profile' },
]

function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] h-14 flex items-center justify-around px-4 z-50">
      {ITEMS.slice(0, 2).map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center gap-0.5 ${item.active ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <Icon name={item.icon} className="text-[20px]" />
          <span className="text-[10px] font-bold uppercase">{item.label}</span>
        </button>
      ))}

      <button className="flex flex-col items-center -mt-6 bg-primary p-2.5 rounded-full text-secondary shadow-lg">
        <Icon name="add" />
      </button>

      {ITEMS.slice(2).map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center gap-0.5 ${item.active ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <Icon name={item.icon} className="text-[20px]" />
          <span className="text-[10px] font-bold uppercase">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default MobileBottomNav
