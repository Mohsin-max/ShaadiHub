import Icon from './Icon'

function ProviderCard({ name, role, photo }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(75,44,94,0.08)]">
      <h4 className="font-headline-sm text-[18px] text-primary mb-5">Venue Provider</h4>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary-fixed shrink-0 bg-secondary-container flex items-center justify-center">
          {photo ? (
            <img className="w-full h-full object-cover" src={photo} alt={name} />
          ) : (
            <Icon name="storefront" className="text-on-secondary-container text-[20px]" />
          )}
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

      <div className="flex items-start gap-2.5 bg-antique-gold/10 border border-antique-gold/30 rounded-lg p-3.5">
        <Icon name="touch_app" className="text-antique-gold text-[18px] shrink-0" />
        <p className="text-[12px] text-on-surface leading-relaxed">
          <span className="font-bold">Select a date</span> on the availability calendar below to send this venue
          a booking request.
        </p>
      </div>
    </div>
  )
}

export default ProviderCard
