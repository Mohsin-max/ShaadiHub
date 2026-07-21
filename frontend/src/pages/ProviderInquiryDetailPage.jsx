import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProviderSidebar from '../components/layout/ProviderSidebar'
import DashboardHeader from '../components/layout/DashboardHeader'
import MobileBottomNav from '../components/layout/MobileBottomNav'
import NegotiationDetail from '../components/ui/NegotiationDetail'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { getBookingRequest, respondBookingRequest } from '../utils/api'

function ProviderInquiryDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [responding, setResponding] = useState(false)
  const [respondError, setRespondError] = useState('')

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
    } catch (err) {
      setRespondError(err.message)
    } finally {
      setResponding(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <ProviderSidebar activeLabel="Inquiries" />

      <main className="flex-1 md:ml-52 min-h-screen overflow-y-auto pb-16 md:pb-0">
        <DashboardHeader />

        <div className="p-5 md:p-6 max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/provider/inquiries')}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-secondary transition-colors mb-5"
          >
            <Icon name="arrow_back" className="text-[16px]" />
            Back to Inquiries
          </button>

          {loading && (
            <div className="space-y-5 animate-pulse">
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
            />
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  )
}

export default ProviderInquiryDetailPage
