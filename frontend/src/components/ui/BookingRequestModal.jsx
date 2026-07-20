import { useState } from 'react'
import Icon from './Icon'
import Button from './Button'
import FormField from './FormField'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function BookingRequestModal({ open, onClose, venueName }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onClose()
    setSelectedDate('')
    setPrice('')
    setNote('')
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

          <div className="space-y-1">
            <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
              Preferred Date
            </label>
            <div className="relative">
              <Icon
                name="calendar_month"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[18px] pointer-events-none"
              />
              <input
                type="date"
                required
                min={todayISO()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <FormField
            label="Proposed Offer Price (PKR)"
            prefix="Rs."
            type="number"
            placeholder="e.g. 450,000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

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
            <Button type="submit" variant="primary">
              Submit Request
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
