import { useEffect, useRef } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useAuth } from '../context/AuthContext'
import { getHubUrl } from '../utils/api'

function useBookingRequestChangeSignal(onChanged) {
  const { user } = useAuth()
  const callbackRef = useRef(onChanged)
  callbackRef.current = onChanged

  useEffect(() => {
    if (!user || (user.role !== 'Client' && user.role !== 'VenueOwner')) return

    const connection = new HubConnectionBuilder()
      .withUrl(getHubUrl(`/hubs/notifications?access_token=${encodeURIComponent(user.token)}`))
      .withAutomaticReconnect()
      .configureLogging(LogLevel.None)
      .build()

    connection.on('bookingRequestChanged', (requestId) => {
      callbackRef.current?.(requestId)
    })
    connection.start().catch(() => {})

    return () => {
      connection.stop()
    }
  }, [user?.token, user?.role])
}

export default useBookingRequestChangeSignal
