import { Link, useNavigate } from 'react-router-dom'
import Icon from './Icon'

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-PK')}`
}

function VenueCard({ venue, showFavorite = true, editHref }) {
  const { id, images, type, name, areaName, city, capacity, price } = venue
  const image = images?.[0]?.url
  const navigate = useNavigate()
  const detailHref = `/venues/${id}`

  return (
    <div
      onClick={() => navigate(detailHref)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(detailHref)
      }}
      role="link"
      tabIndex={0}
      className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:border-antique-gold/50 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden bg-surface-container">
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
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 bg-primary text-on-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ring-1 ring-antique-gold/40">
          {type}
        </div>
        {showFavorite && (
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-on-surface-variant hover:text-error transition-all"
          >
            <Icon name="favorite" className="text-[18px]" />
          </button>
        )}
        {editHref && (
          <Link
            to={editHref}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
            aria-label="Edit venue"
          >
            <Icon name="edit" className="text-[16px]" />
          </Link>
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
            <p className="text-[17px] font-bold text-primary">
              {formatPrice(price)}
              <span className="text-antique-gold">.</span>
            </p>
          </div>
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-surface-container group-hover:bg-primary transition-colors">
            <Icon
              name="chevron_right"
              className="text-on-surface-variant group-hover:text-on-primary group-hover:translate-x-0.5 transition-all text-[18px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenueCard
