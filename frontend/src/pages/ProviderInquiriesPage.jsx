import { useEffect, useState } from 'react'
import ProviderSidebar from '../components/layout/ProviderSidebar'
import DashboardHeader from '../components/layout/DashboardHeader'
import MobileBottomNav from '../components/layout/MobileBottomNav'
import BookingRequestRow from '../components/ui/BookingRequestRow'
import EmptyStateCard from '../components/ui/EmptyStateCard'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { listReceivedBookingRequests } from '../utils/api'

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 bg-white border border-outline-variant rounded-xl p-4 animate-pulse">
      <div className="w-16 h-16 rounded-lg bg-surface-container shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-container rounded w-1/3" />
        <div className="h-3 bg-surface-container rounded w-1/4" />
      </div>
      <div className="h-4 w-20 bg-surface-container rounded" />
    </div>
  )
}

function ProviderInquiriesPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listReceivedBookingRequests(user?.token)
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user?.token])

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <ProviderSidebar activeLabel="Inquiries" />

      <main className="flex-1 md:ml-52 min-h-screen overflow-y-auto pb-16 md:pb-0">
        <DashboardHeader />

        <div className="p-5 md:p-6 max-w-3xl mx-auto space-y-5">
          <section>
            <h2 className="font-title-lg text-[15px] text-primary mb-3 flex items-center gap-1.5">
              <Icon name="mail" className="text-secondary text-[18px]" />
              Booking Inquiries
            </h2>

            {error && (
              <p className="text-[13px] text-error bg-error-container rounded-lg px-3.5 py-2.5 mb-3">{error}</p>
            )}

            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <RowSkeleton key={i} />
                ))}
              </div>
            )}

            {!loading && requests.length === 0 && !error && (
              <EmptyStateCard
                icon="mail"
                title="No booking requests yet"
                description="When a client sends a booking request for one of your venues, it will show up here."
              />
            )}

            {!loading && requests.length > 0 && (
              <div className="space-y-3">
                {requests.map((request) => (
                  <BookingRequestRow
                    key={request.id}
                    request={request}
                    detailHref={`/provider/inquiries/${request.id}`}
                    secondaryLabel={request.clientName}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  )
}

export default ProviderInquiriesPage
