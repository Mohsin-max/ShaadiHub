function NotificationBadge({ count, className = '' }) {
  if (!count || count <= 0) return null

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-error text-on-error text-[10px] font-bold leading-none ${className}`}
    >
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default NotificationBadge
