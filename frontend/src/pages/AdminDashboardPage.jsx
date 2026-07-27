import { useEffect, useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { getAdminDashboard } from '../utils/api'
import { formatRelativeTime } from '../utils/formatRelativeTime'

function AdminDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDashboard(user?.token)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [user?.token])

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <AdminSidebar activeLabel="Dashboard" />

      <main className="flex-1 md:ml-52 min-h-screen overflow-y-auto">
        <header className="bg-white border-b border-outline-variant px-5 md:px-6 py-4">
          <h1 className="font-headline-sm text-[20px] text-primary">Dashboard</h1>
          <p className="text-[12px] text-on-surface-variant">Platform overview at a glance</p>
        </header>

        <div className="p-5 md:p-6 max-w-[1280px] mx-auto space-y-6">
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-surface-container rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {!loading && data && (
            <>
              <section>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard
                    icon="storefront"
                    iconClassName="bg-secondary-container/30 text-on-secondary-container"
                    value={data.totalVenueOwners}
                    label="Venue Owners"
                  />
                  <StatCard
                    icon="group"
                    iconClassName="bg-primary-container/10 text-primary"
                    value={data.totalClients}
                    label="Clients"
                  />
                  <StatCard
                    icon="domain"
                    iconClassName="bg-secondary-container/30 text-on-secondary-container"
                    value={data.totalVenues}
                    label="Venues Listed"
                  />
                  <StatCard
                    icon="pending_actions"
                    iconClassName="bg-antique-gold/15 text-antique-gold"
                    value={data.pendingActivityCount}
                    label="Pending Activity"
                  />
                </div>
              </section>

              <section>
                <h2 className="font-title-lg text-[15px] text-primary mb-3 flex items-center gap-1.5">
                  <Icon name="history" className="text-secondary text-[18px]" />
                  Recent Request Activity
                </h2>
                <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
                  {data.recentActivity.length === 0 && (
                    <p className="text-[13px] text-on-surface-variant p-5 text-center">
                      No booking request activity yet.
                    </p>
                  )}
                  {data.recentActivity.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between px-4 py-3 ${
                        idx !== data.recentActivity.length - 1 ? 'border-b border-outline-variant' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-on-surface truncate">{item.venueName}</p>
                        <p className="text-[11px] text-on-surface-variant truncate">
                          Requested by {item.clientName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-on-surface-variant">
                          {formatRelativeTime(item.updatedAt)}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {!loading && !data && (
            <p className="text-[13px] text-on-surface-variant">Couldn't load dashboard data.</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboardPage
