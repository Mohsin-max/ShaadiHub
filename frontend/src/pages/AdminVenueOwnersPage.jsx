import { useEffect, useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'
import AdminUserTable from '../components/ui/AdminUserTable'
import { useAuth } from '../context/AuthContext'
import { listAdminVenueOwners, setAdminUserStatus } from '../utils/api'

function AdminVenueOwnersPage() {
  const { user } = useAuth()
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listAdminVenueOwners(user?.token)
      .then(setOwners)
      .catch(() => setOwners([]))
      .finally(() => setLoading(false))
  }, [user?.token])

  const handleToggle = async (owner) => {
    const updated = await setAdminUserStatus(owner.id, !owner.isActive, user?.token)
    setOwners((prev) => prev.map((o) => (o.id === owner.id ? { ...o, isActive: updated.isActive } : o)))
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <AdminSidebar activeLabel="Venue Owners" />

      <main className="flex-1 md:ml-52 min-h-screen overflow-y-auto">
        <header className="bg-white border-b border-outline-variant px-5 md:px-6 py-4">
          <h1 className="font-headline-sm text-[20px] text-primary">Venue Owners</h1>
          <p className="text-[12px] text-on-surface-variant">{owners.length} registered accounts</p>
        </header>

        <div className="p-5 md:p-6 max-w-[1280px] mx-auto">
          {loading ? (
            <div className="h-40 bg-surface-container rounded-xl animate-pulse" />
          ) : (
            <AdminUserTable
              users={owners}
              showVenueCount
              onToggleStatus={handleToggle}
              emptyLabel="No venue owners have signed up yet."
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminVenueOwnersPage
