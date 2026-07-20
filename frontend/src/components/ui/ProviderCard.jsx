import Icon from './Icon'
import Button from './Button'

function ProviderCard({ name, role, photo, onSendRequest }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(75,44,94,0.08)]">
      <h4 className="font-headline-sm text-[18px] text-primary mb-5">Venue Provider</h4>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary-fixed shrink-0">
          <img className="w-full h-full object-cover" src={photo} alt={name} />
        </div>
        <div>
          <p className="text-[14px] font-bold text-on-surface">{name}</p>
          <p className="text-[12px] text-on-surface-variant">{role}</p>
        </div>
      </div>

      <div className="space-y-2.5 mb-6">
        <div className="flex items-center gap-2.5 text-on-surface-variant">
          <Icon name="schedule" className="text-[18px] text-secondary" />
          <span className="text-[13px]">Mon - Sun, 10 AM - 10 PM</span>
        </div>
      </div>

      <Button variant="primary" onClick={onSendRequest}>
        Send Booking Request
      </Button>
      <p className="text-center text-[11px] text-on-surface-variant mt-3">
        Typically responds within 2 hours
      </p>
    </div>
  )
}

export default ProviderCard
