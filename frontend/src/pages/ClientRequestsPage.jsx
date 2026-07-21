import { useEffect, useState } from 'react'
import ClientHeader from '../components/layout/ClientHeader'
import PageFooter from '../components/layout/PageFooter'
import BookingRequestRow from '../components/ui/BookingRequestRow'
import EmptyStateCard from '../components/ui/EmptyStateCard'
import { useAuth } from '../context/AuthContext'
import { listMyBookingRequests } from '../utils/api'

const FOOTER_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
]

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

function ClientRequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listMyBookingRequests(user?.token)
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user?.token])

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader />

      <main className="pt-14 flex-1">
        <div className="max-w-3xl mx-auto px-5 md:px-6 py-8">
          <div className="mb-6">
            <h1 className="font-headline-md text-[24px] text-primary mb-0.5">My Booking Requests</h1>
            <p className="text-[13px] text-on-surface-variant">
              Track your venue requests and negotiations in one place
            </p>
          </div>

          {error && (
            <p className="text-[13px] text-error bg-error-container rounded-lg px-3.5 py-2.5 mb-5">{error}</p>
          )}

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && requests.length === 0 && !error && (
            <div className="max-w-md mx-auto mt-8">
              <EmptyStateCard
                icon="event_note"
                title="No booking requests yet"
                description="Once you send a booking request from a venue's page, you'll be able to track its status and negotiate here."
                actionLabel="Browse Venues"
                actionIcon="search"
                onAction={() => (window.location.href = '/venues')}
              />
            </div>
          )}

          {!loading && requests.length > 0 && (
            <div className="space-y-3">
              {requests.map((request) => (
                <BookingRequestRow
                  key={request.id}
                  request={request}
                  detailHref={`/my-requests/${request.id}`}
                  secondaryLabel={`${request.venueAreaName}, ${request.venueCity}`}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <PageFooter links={FOOTER_LINKS} />
    </div>
  )
}

export default ClientRequestsPage
