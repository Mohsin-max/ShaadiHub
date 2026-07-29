import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

function storageKey(userId) {
  return `shaadihub_favorites_${userId || 'guest'}`
}

function loadFavorites(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function useFavorites() {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState(() => loadFavorites(user?.id))

  useEffect(() => {
    setFavoriteIds(loadFavorites(user?.id))
  }, [user?.id])

  const isFavorite = useCallback((venueId) => favoriteIds.includes(venueId), [favoriteIds])

  const toggleFavorite = useCallback(
    (venueId) => {
      setFavoriteIds((prev) => {
        const next = prev.includes(venueId) ? prev.filter((id) => id !== venueId) : [...prev, venueId]
        localStorage.setItem(storageKey(user?.id), JSON.stringify(next))
        return next
      })
    },
    [user?.id],
  )

  return { favoriteIds, isFavorite, toggleFavorite }
}

export default useFavorites
