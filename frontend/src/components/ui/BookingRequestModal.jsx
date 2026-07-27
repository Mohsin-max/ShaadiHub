import { useEffect, useState } from 'react'
import Icon from './Icon'
import Button from './Button'
import FormField from './FormField'
import ErrorBanner from './ErrorBanner'
import { createBookingRequest } from '../../utils/api'

function formatDate(value) {
  if (!value) return ''
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function BookingRequestModal({
  open,
  onClose,
  venueId,
  venueName,
  initialPrice,
  preselectedDate,
  bookedDates = [],
  token,
  onSuccess,
}) {
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')
  const [priceTouched, setPriceTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setError('')
    }
  }, [open])

  if (!open) return null

  const displayPrice = priceTouched ? price : initialPrice ? String(initialPrice) : price

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (bookedDates.some((b) => b.date === preselectedDate)) {
      setError('That date is already booked for this venue — please cancel and pick another.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const created = await createBookingRequest(
        venueId,
        { eventDate: preselectedDate, offerPrice: Number(displayPrice), note: note.trim() || null },
        token,
      )
      onClose()
      setPrice('')
      setPriceTouched(false)
      setNote('')
      onSuccess?.(created)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-outline-variant">
        <div className="p-5 border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-headline-sm text-[18px] text-primary">New Booking Request</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container rounded-full transition-colors"
            aria-label="Close"
          >
            <Icon name="close" />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {venueName && (
            <p className="text-[12px] text-on-surface-variant -mt-1">
              Requesting <span className="font-semibold text-primary">{venueName}</span>
            </p>
          )}

          <ErrorBanner message={error} />

          <div className="space-y-1">
            <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
              Event Date
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg">
              <Icon name="calendar_month" className="text-primary text-[18px] shrink-0" />
              <span className="text-[14px] font-semibold text-on-surface">{formatDate(preselectedDate)}</span>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Want a different date? Cancel and select another one on the calendar.
            </p>
          </div>

          <div>
            <FormField
              label="Proposed Offer Price (PKR)"
              prefix="Rs."
              type="number"
              placeholder="e.g. 450,000"
              required
              min={0}
              value={displayPrice}
              onChange={(e) => {
                setPriceTouched(true)
                setPrice(e.target.value)
              }}
            />
            {displayPrice && !Number.isNaN(Number(displayPrice)) && (
              <p className="text-[12px] text-antique-gold font-semibold mt-1">
                Rs. {Number(displayPrice).toLocaleString('en-PK')}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
              Short Note / Requirements
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Mention guest count, specific services, or any questions for the venue..."
              className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Sending…' : 'Submit Request'}
            </Button>
          </div>

          <p className="text-center text-[11px] text-on-surface-variant/70 italic px-4">
            By submitting, you agree to ShaadiHub's Terms of Service and Privacy Policy regarding
            vendor negotiations.
          </p>
        </form>
      </div>
    </div>
  )
}

export default BookingRequestModal
