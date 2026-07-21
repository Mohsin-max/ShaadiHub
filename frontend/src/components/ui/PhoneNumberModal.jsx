import { useState } from 'react'
import Icon from './Icon'
import Button from './Button'
import FormField from './FormField'
import ErrorBanner from './ErrorBanner'

function PhoneNumberModal({ open, onClose, onSubmit }) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setError('')
    try {
      await onSubmit(phone.trim())
      setPhone('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 p-6 border border-outline-variant">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Icon name="call" className="text-[22px]" />
        </div>
        <h3 className="font-headline-sm text-[18px] text-primary mb-1.5">Add Your Phone Number</h3>
        <p className="text-[13px] text-on-surface-variant leading-relaxed mb-4">
          We only share this with the venue owner once a booking is confirmed — never before that.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ErrorBanner message={error} />
          <FormField
            label="Phone Number"
            type="tel"
            placeholder="03XX-XXXXXXX"
            required
            autoFocus
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading || !phone.trim()}>
              {loading ? 'Saving…' : 'Save & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PhoneNumberModal
