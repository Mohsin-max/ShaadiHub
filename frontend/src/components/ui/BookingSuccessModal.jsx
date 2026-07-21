import Icon from './Icon'
import Button from './Button'

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-PK')}`
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BookingSuccessModal({ open, request, onClose }) {
  if (!open || !request) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-outline-variant text-center">
        <div className="bg-gradient-to-br from-primary to-primary-container px-6 pt-8 pb-6">
          <div className="w-16 h-16 rounded-full bg-antique-gold flex items-center justify-center mx-auto mb-3">
            <Icon name="check" className="text-primary text-[32px]" />
          </div>
          <h3 className="font-headline-sm text-[20px] text-white mb-1">Booking Confirmed</h3>
          <p className="text-[13px] text-white/80">Your venue is officially reserved for this date</p>
        </div>

        <div className="p-6 text-left space-y-4">
          <div className="flex items-center gap-3">
            {request.venueImage && (
              <img
                src={request.venueImage}
                alt=""
                className="w-14 h-14 rounded-lg object-cover border border-outline-variant shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="font-headline-sm text-[15px] text-primary truncate">{request.venueName}</p>
              <p className="text-[12px] text-on-surface-variant truncate">
                {request.venueAreaName}, {request.venueCity}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant">
            <div>
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Event Date
              </p>
              <p className="text-[13px] font-bold text-on-surface">{formatDate(request.eventDate)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Final Price
              </p>
              <p className="text-[13px] font-bold text-primary">{formatPrice(request.currentPrice)}</p>
            </div>
          </div>

          {request.contactInfo && (
            <div className="bg-antique-gold/10 border border-antique-gold/30 rounded-lg p-3 text-[12px] text-on-surface flex items-start gap-2">
              <Icon name="call" className="text-antique-gold text-[16px] shrink-0 mt-0.5" />
              <span>
                {request.contactInfo.ownerName}'s contact details are now visible on this page for you to
                coordinate directly.
              </span>
            </div>
          )}

          <Button variant="primary" onClick={onClose}>
            Got It
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccessModal
