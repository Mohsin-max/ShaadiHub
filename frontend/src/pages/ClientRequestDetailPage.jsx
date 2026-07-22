import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ClientHeader from '../components/layout/ClientHeader'
import PageFooter from '../components/layout/PageFooter'
import NegotiationDetail from '../components/ui/NegotiationDetail'
import BookingSuccessModal from '../components/ui/BookingSuccessModal'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import {
  getBookingRequest,
  respondBookingRequest,
  cancelBookingRequest,
  requestDateChange,
  respondDateChange,
} from '../utils/api'

const FOOTER_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
]

function ClientRequestDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [responding, setResponding] = useState(false)
  const [respondError, setRespondError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    getBookingRequest(id, user?.token)
      .then(setRequest)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, user?.token])

  const handleRespond = async (action, payload) => {
    setResponding(true)
    setRespondError('')
    try {
      const updated = await respondBookingRequest(id, { action, ...payload }, user?.token)
      setRequest(updated)
      if (action === 'Accept' && updated.status === 'Booked') {
        setShowSuccess(true)
      }
    } catch (err) {
      setRespondError(err.message)
    } finally {
      setResponding(false)
    }
  }

  const handleCancel = async (reason) => {
    setResponding(true)
    setRespondError('')
    try {
      const updated = await cancelBookingRequest(id, reason, user?.token)
      setRequest(updated)
    } catch (err) {
      setRespondError(err.message)
    } finally {
      setResponding(false)
    }
  }

  const handleRequestDateChange = async (dateStr, note) => {
    setResponding(true)
    setRespondError('')
    try {
      const updated = await requestDateChange(id, { newDate: dateStr, note }, user?.token)
      setRequest(updated)
    } catch (err) {
      setRespondError(err.message)
    } finally {
      setResponding(false)
    }
  }

  const handleRespondDateChange = async (action) => {
    setResponding(true)
    setRespondError('')
    try {
      const updated = await respondDateChange(id, action, user?.token)
      setRequest(updated)
    } catch (err) {
      setRespondError(err.message)
    } finally {
      setResponding(false)
    }
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader />

      <main className="pt-14 flex-1">
        <div className="max-w-3xl mx-auto px-5 md:px-6 py-8">
          <button
            onClick={() => navigate('/my-requests')}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-secondary transition-colors mb-5"
          >
            <Icon name="arrow_back" className="text-[16px]" />
            Back to My Requests
          </button>

          {loading && (
            <div className="max-w-3xl mx-auto space-y-5 animate-pulse">
              <div className="h-28 bg-surface-container rounded-xl" />
              <div className="h-40 bg-surface-container rounded-xl" />
            </div>
          )}

          {!loading && (error || !request) && (
            <div className="flex flex-col items-center justify-center gap-2 text-center py-16">
              <Icon name="error" className="text-error text-[32px]" />
              <p className="text-on-surface-variant">{error || 'Request not found.'}</p>
            </div>
          )}

          {!loading && request && (
            <NegotiationDetail
              request={request}
              venueHref={`/venues/${request.venueId}`}
              onRespond={handleRespond}
              responding={responding}
              respondError={respondError}
              onCancel={handleCancel}
              onRequestDateChange={handleRequestDateChange}
              onRespondDateChange={handleRespondDateChange}
            />
          )}
        </div>
      </main>

      <PageFooter links={FOOTER_LINKS} />

      <BookingSuccessModal open={showSuccess} request={request} onClose={() => setShowSuccess(false)} />
    </div>
  )
}

export default ClientRequestDetailPage
