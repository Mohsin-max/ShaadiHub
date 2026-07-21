import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getBookingNotificationCount } from '../utils/api'

const POLL_INTERVAL_MS = 25000

function useBookingNotificationCount() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user || (user.role !== 'Client' && user.role !== 'VenueOwner')) {
      setCount(0)
      return
    }

    const fetchCount = () => {
      getBookingNotificationCount(user.token)
        .then((data) => setCount(data.count))
        .catch(() => {})
    }

    fetchCount()
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [user?.token, user?.role])

  return count
}

export default useBookingNotificationCount
