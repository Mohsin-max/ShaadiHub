import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)

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

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState(() => loadFavorites(user?.id))

  useEffect(() => {
    setFavoriteIds(loadFavorites(user?.id))
  }, [user?.id])

  const value = useMemo(() => {
    const isFavorite = (venueId) => favoriteIds.includes(venueId)
    const toggleFavorite = (venueId) => {
      setFavoriteIds((prev) => {
        const next = prev.includes(venueId) ? prev.filter((id) => id !== venueId) : [...prev, venueId]
        localStorage.setItem(storageKey(user?.id), JSON.stringify(next))
        return next
      })
    }
    return { favoriteIds, isFavorite, toggleFavorite }
  }, [favoriteIds, user?.id])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider')
  return ctx
}
