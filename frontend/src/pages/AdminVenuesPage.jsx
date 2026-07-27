import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'
import Icon from '../components/ui/Icon'
import ConfirmModal from '../components/ui/ConfirmModal'
import { useAuth } from '../context/AuthContext'
import { listAdminVenues, setAdminVenueStatus } from '../utils/api'

function ActiveBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-surface-container-high text-on-surface-variant'
      }`}
    >
      {isActive ? 'Active' : 'Deactivated'}
    </span>
  )
}

function AdminVenuesPage() {
  const { user } = useAuth()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pendingVenue, setPendingVenue] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const requestIdRef = useRef(0)

  const fetchVenues = (term) => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    listAdminVenues(term, user?.token)
      .then((data) => {
        if (requestId === requestIdRef.current) setVenues(data)
      })
      .catch(() => {
        if (requestId === requestIdRef.current) setVenues([])
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false)
      })
  }

  useEffect(() => {
    const timeout = setTimeout(() => fetchVenues(search), search ? 300 : 0)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, user?.token])

  const handleConfirm = async () => {
    if (!pendingVenue) return
    setSubmitting(true)
    try {
      const updated = await setAdminVenueStatus(pendingVenue.id, !pendingVenue.isActive, user?.token)
      setVenues((prev) =>
        prev.map((v) => (v.id === pendingVenue.id ? { ...v, isActive: updated.isActive } : v)),
      )
      setPendingVenue(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <AdminSidebar activeLabel="Venues" />

      <main className="flex-1 md:ml-52 min-h-screen overflow-y-auto">
        <header className="bg-white border-b border-outline-variant px-5 md:px-6 py-4">
          <h1 className="font-headline-sm text-[20px] text-primary">All Venues</h1>
          <p className="text-[12px] text-on-surface-variant">{venues.length} venues listed</p>
        </header>

        <div className="p-5 md:p-6 max-w-[1280px] mx-auto space-y-4">
          <div className="relative max-w-sm">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, area, city, or owner…"
              className="w-full pl-10 pr-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>

          {loading ? (
            <div className="h-40 bg-surface-container rounded-xl animate-pulse" />
          ) : (
            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                      <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                        Area
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {venues.map((v) => (
                      <tr key={v.id} className="border-b border-outline-variant last:border-0">
                        <td className="px-4 py-3 text-[13px] font-bold text-on-surface whitespace-nowrap">
                          {v.name}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-on-surface-variant whitespace-nowrap">
                          {v.ownerName || '—'}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-on-surface-variant whitespace-nowrap">
                          {v.areaName}, {v.city}
                        </td>
                        <td className="px-4 py-3">
                          <ActiveBadge isActive={v.isActive} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/venues/${v.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1.5 rounded-lg border border-outline-variant text-primary hover:bg-surface-container transition-colors"
                            >
                              <Icon name="visibility" className="text-[15px]" />
                              View
                            </Link>
                            <button
                              onClick={() => setPendingVenue(v)}
                              className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                                v.isActive
                                  ? 'border-error/30 text-error hover:bg-error-container/30'
                                  : 'border-outline-variant text-primary hover:bg-surface-container'
                              }`}
                            >
                              <Icon name={v.isActive ? 'block' : 'check_circle'} className="text-[15px]" />
                              {v.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {venues.length === 0 && (
                <p className="text-[13px] text-on-surface-variant p-6 text-center">
                  No venues match your search.
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <ConfirmModal
        open={!!pendingVenue}
        title={pendingVenue?.isActive ? 'Deactivate this venue?' : 'Activate this venue?'}
        details={
          pendingVenue
            ? [
                { label: 'Venue', value: pendingVenue.name, wide: true },
                { label: 'Owner', value: pendingVenue.ownerName || '—' },
                { label: 'Area', value: `${pendingVenue.areaName}, ${pendingVenue.city}` },
              ]
            : []
        }
        message={
          pendingVenue?.isActive
            ? "It will be hidden from client search and browsing until you activate it again."
            : 'It will become visible to clients browsing venues again.'
        }
        confirmLabel={pendingVenue?.isActive ? 'Yes, Deactivate' : 'Yes, Activate'}
        variant={pendingVenue?.isActive ? 'danger' : 'primary'}
        loading={submitting}
        onConfirm={handleConfirm}
        onCancel={() => setPendingVenue(null)}
      />
    </div>
  )
}

export default AdminVenuesPage
