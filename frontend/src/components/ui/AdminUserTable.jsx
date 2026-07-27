import { useState } from 'react'
import Icon from './Icon'
import ConfirmModal from './ConfirmModal'

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

function AdminUserTable({ users, showVenueCount = false, onToggleStatus, emptyLabel = 'No accounts found.' }) {
  const [pendingUser, setPendingUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!pendingUser) return
    setSubmitting(true)
    try {
      await onToggleStatus(pendingUser)
      setPendingUser(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant">
              <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                Phone
              </th>
              {showVenueCount && (
                <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                  Venues
                </th>
              )}
              <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2.5 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-outline-variant last:border-0">
                <td className="px-4 py-3 text-[13px] font-bold text-on-surface whitespace-nowrap">
                  {u.name || '—'}
                </td>
                <td className="px-4 py-3 text-[13px] text-on-surface-variant whitespace-nowrap">{u.email}</td>
                <td className="px-4 py-3 text-[13px] text-on-surface-variant whitespace-nowrap">
                  {u.phone || '—'}
                </td>
                {showVenueCount && (
                  <td className="px-4 py-3 text-[13px] text-on-surface-variant">{u.venueCount ?? 0}</td>
                )}
                <td className="px-4 py-3">
                  <ActiveBadge isActive={u.isActive} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setPendingUser(u)}
                    className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                      u.isActive
                        ? 'border-error/30 text-error hover:bg-error-container/30'
                        : 'border-outline-variant text-primary hover:bg-surface-container'
                    }`}
                  >
                    <Icon name={u.isActive ? 'block' : 'check_circle'} className="text-[15px]" />
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-[13px] text-on-surface-variant p-6 text-center">{emptyLabel}</p>
      )}

      <ConfirmModal
        open={!!pendingUser}
        title={pendingUser?.isActive ? 'Deactivate this account?' : 'Activate this account?'}
        details={
          pendingUser
            ? [
                { label: 'Name', value: pendingUser.name || '—' },
                { label: 'Email', value: pendingUser.email, wide: true },
              ]
            : []
        }
        message={
          pendingUser?.isActive
            ? "They won't be able to log in until you activate the account again."
            : 'They will be able to log in again immediately.'
        }
        confirmLabel={pendingUser?.isActive ? 'Yes, Deactivate' : 'Yes, Activate'}
        variant={pendingUser?.isActive ? 'danger' : 'primary'}
        loading={submitting}
        onConfirm={handleConfirm}
        onCancel={() => setPendingUser(null)}
      />
    </div>
  )
}

export default AdminUserTable
