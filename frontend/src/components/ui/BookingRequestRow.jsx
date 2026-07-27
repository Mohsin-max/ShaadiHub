import { Link } from 'react-router-dom'
import Icon from './Icon'
import StatusBadge from './StatusBadge'
import { formatRelativeTime, isRecentlyUpdated } from '../../utils/formatRelativeTime'

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-PK')}`
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
}

function BookingRequestRow({ request, detailHref, secondaryLabel }) {
  const isNew = isRecentlyUpdated(request.updatedAt)

  return (
    <Link
      to={detailHref}
      className={`flex items-center gap-4 bg-white border rounded-xl p-4 hover:border-antique-gold/50 hover:shadow-sm transition-all ${
        isNew ? 'border-antique-gold/60 shadow-sm shadow-antique-gold/10' : 'border-outline-variant'
      }`}
    >
      {request.venueImage ? (
        <img
          src={request.venueImage}
          alt=""
          className="w-16 h-16 rounded-lg object-cover border border-outline-variant shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-surface-container border border-outline-variant shrink-0 flex items-center justify-center text-outline-variant">
          <Icon name="image" className="text-[24px]" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-headline-sm text-[15px] text-primary truncate">{request.venueName}</h3>
          <StatusBadge status={request.status} />
          {isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-antique-gold text-primary">
              New
            </span>
          )}
        </div>
        <p className="text-[12px] text-on-surface-variant truncate">
          {secondaryLabel} · {formatDate(request.eventDate)}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Current Offer</p>
        <p className="text-[15px] font-bold text-primary">{formatPrice(request.currentPrice)}</p>
        <p className="text-[10px] text-on-surface-variant mt-0.5">{formatRelativeTime(request.updatedAt)}</p>
      </div>

      <Icon name="chevron_right" className="text-on-surface-variant text-[20px] shrink-0" />
    </Link>
  )
}

export default BookingRequestRow
