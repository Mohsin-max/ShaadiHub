import Icon from './Icon'

const DEFAULT_AMENITIES = [
  { icon: 'ac_unit', label: 'Air Conditioning' },
  { icon: 'local_parking', label: 'Parking' },
  { icon: 'restaurant', label: 'In-house Catering' },
  { icon: 'speaker', label: 'Sound System' },
  { icon: 'bolt', label: 'Generator Backup' },
  { icon: 'bed', label: 'Bridal Room' },
  { icon: 'directions_car', label: 'Valet Service' },
  { icon: 'celebration', label: 'Stage / Decor Setup' },
]

function AmenitiesGrid({ amenities = DEFAULT_AMENITIES }) {
  return (
    <section>
      <h3 className="font-headline-sm text-[18px] text-primary mb-4">Amenities</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {amenities.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 bg-white border border-outline-variant rounded-lg px-3 py-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
              <Icon name={item.icon} className="text-primary-container text-[18px]" />
            </div>
            <span className="text-[13px] text-on-surface-variant leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AmenitiesGrid
