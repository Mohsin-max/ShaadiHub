import { useEffect, useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'
import AdminUserTable from '../components/ui/AdminUserTable'
import { useAuth } from '../context/AuthContext'
import { listAdminClients, setAdminUserStatus } from '../utils/api'

function AdminClientsPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listAdminClients(user?.token)
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setLoading(false))
  }, [user?.token])

  const handleToggle = async (client) => {
    const updated = await setAdminUserStatus(client.id, !client.isActive, user?.token)
    setClients((prev) => prev.map((c) => (c.id === client.id ? { ...c, isActive: updated.isActive } : c)))
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <AdminSidebar activeLabel="Clients" />

      <main className="flex-1 md:ml-52 min-h-screen overflow-y-auto">
        <header className="bg-white border-b border-outline-variant px-5 md:px-6 py-4">
          <h1 className="font-headline-sm text-[20px] text-primary">Clients</h1>
          <p className="text-[12px] text-on-surface-variant">{clients.length} registered accounts</p>
        </header>

        <div className="p-5 md:p-6 max-w-[1280px] mx-auto">
          {loading ? (
            <div className="h-40 bg-surface-container rounded-xl animate-pulse" />
          ) : (
            <AdminUserTable
              users={clients}
              onToggleStatus={handleToggle}
              emptyLabel="No clients have signed up yet."
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminClientsPage
