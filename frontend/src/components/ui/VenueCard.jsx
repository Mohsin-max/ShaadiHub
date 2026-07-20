import { Link } from 'react-router-dom'
import Icon from './Icon'

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-PK')}`
}

function VenueCard({ venue, showFavorite = true }) {
  const { id, images, type, name, areaName, city, capacity, price } = venue
  const image = images?.[0]?.url

  return (
    <div className="group bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-44 overflow-hidden bg-surface-container">
        {image ? (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={image}
            alt={name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline-variant">
            <Icon name="image" className="text-[40px]" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-primary text-on-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {type}
        </div>
        {showFavorite && (
          <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-on-surface-variant hover:text-error transition-all">
            <Icon name="favorite" className="text-[18px]" />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-headline-sm text-[16px] text-on-surface mb-1.5">{name}</h3>
        <div className="flex items-center gap-1.5 text-on-surface-variant mb-3">
          <Icon name="location_on" className="text-[16px]" />
          <span className="text-[13px]">
            {areaName}, {city}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-outline-variant mb-3">
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Capacity</p>
            <p className="text-[12px] font-semibold text-on-surface">{capacity} Guests</p>
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Type</p>
            <p className="text-[12px] font-semibold text-on-surface">{type}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-on-surface-variant">Starting from</p>
            <p className="text-[16px] font-bold text-secondary">{formatPrice(price)}</p>
          </div>
          <Link
            to={`/venues/${id}`}
            className="h-9 px-4 rounded-lg bg-primary text-on-primary text-[13px] font-semibold hover:bg-primary-container transition-all flex items-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VenueCard
