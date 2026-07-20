import Icon from './Icon'

function VenueCard({ venue }) {
  const { image, badge, name, area, capacity, amenity, amenityIcon, price } = venue

  return (
    <div className="group bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-44 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={image}
          alt={name}
        />
        <div className="absolute top-3 left-3 bg-primary text-on-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {badge}
        </div>
        <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-on-surface-variant hover:text-error transition-all">
          <Icon name="favorite" className="text-[18px]" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-headline-sm text-[16px] text-on-surface mb-1.5">{name}</h3>
        <div className="flex items-center gap-1.5 text-on-surface-variant mb-3">
          <Icon name="location_on" className="text-[16px]" />
          <span className="text-[13px]">{area}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-outline-variant mb-3">
          <div className="flex items-center gap-1.5">
            <Icon name="groups" className="text-secondary text-[18px]" />
            <span className="text-[11px] text-on-surface-variant">{capacity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name={amenityIcon} className="text-secondary text-[18px]" />
            <span className="text-[11px] text-on-surface-variant">{amenity}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-on-surface-variant">Starting from</p>
            <p className="text-[16px] font-bold text-secondary">{price}</p>
          </div>
          <button className="h-9 px-4 rounded-lg bg-primary text-on-primary text-[13px] font-semibold hover:bg-primary-container transition-all">
            Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default VenueCard
