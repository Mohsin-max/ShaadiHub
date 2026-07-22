import { useEffect, useState } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useAuth } from '../context/AuthContext'
import { getBookingNotificationCount, getHubUrl } from '../utils/api'

function useBookingNotificationCount() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user || (user.role !== 'Client' && user.role !== 'VenueOwner')) {
      setCount(0)
      return
    }

    let active = true

    getBookingNotificationCount(user.token)
      .then((data) => {
        if (active) setCount(data.count)
      })
      .catch(() => {})

    const connection = new HubConnectionBuilder()
      .withUrl(getHubUrl(`/hubs/notifications?access_token=${encodeURIComponent(user.token)}`))
      .withAutomaticReconnect()
      .configureLogging(LogLevel.None)
      .build()

    connection.on('notificationCount', (newCount) => {
      if (active) setCount(newCount)
    })

    connection.start().catch(() => {})

    return () => {
      active = false
      connection.stop()
    }
  }, [user?.token, user?.role])

  return count
}

export default useBookingNotificationCount
