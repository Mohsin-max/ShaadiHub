export function formatRelativeTime(value) {
  const diffMs = Date.now() - new Date(value).getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`

  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`

  return new Date(value).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
}

export function isRecentlyUpdated(value, withinMinutes = 5) {
  const diffMs = Date.now() - new Date(value).getTime()
  return diffMs < withinMinutes * 60 * 1000
}
