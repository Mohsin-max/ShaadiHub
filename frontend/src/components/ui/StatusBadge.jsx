const STATUS_STYLES = {
  Pending: 'bg-secondary-container text-on-secondary-container',
  Countered: 'bg-amber-100 text-amber-800',
  Booked: 'bg-primary text-on-primary',
  Rejected: 'bg-error-container text-on-error-container',
}

const STATUS_LABELS = {
  Pending: 'Pending',
  Countered: 'Countered',
  Booked: 'Booked',
  Rejected: 'Rejected',
}

function StatusBadge({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
        STATUS_STYLES[status] || 'bg-surface-container text-on-surface-variant'
      } ${className}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export default StatusBadge
