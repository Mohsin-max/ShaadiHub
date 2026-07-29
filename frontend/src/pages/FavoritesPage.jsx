import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientHeader from '../components/layout/ClientHeader'
import PageFooter from '../components/layout/PageFooter'
import VenueCard from '../components/ui/VenueCard'
import VenueCardSkeleton from '../components/ui/VenueCardSkeleton'
import EmptyStateCard from '../components/ui/EmptyStateCard'
import useFavorites from '../hooks/useFavorites'
import { listVenues } from '../utils/api'

function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteIds } = useFavorites()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listVenues()
      .then(setVenues)
      .catch(() => setVenues([]))
      .finally(() => setLoading(false))
  }, [])

  const favoriteVenues = venues.filter((v) => favoriteIds.includes(v.id))

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader />

      <main className="pt-14 flex-1">
        <div className="max-w-[1280px] mx-auto p-5 md:p-6">
          <div className="mb-5">
            <h1 className="font-headline-md text-[24px] text-primary mb-0.5">Your Favorites</h1>
            <p className="text-[13px] text-on-surface-variant">
              {loading
                ? 'Loading your saved venues…'
                : favoriteVenues.length === 0
                  ? 'No saved venues yet'
                  : `${favoriteVenues.length} saved venue${favoriteVenues.length === 1 ? '' : 's'}`}
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <VenueCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && favoriteVenues.length === 0 && (
            <div className="max-w-md mx-auto mt-12">
              <EmptyStateCard
                icon="favorite"
                title="You haven't saved any venues yet"
                description="Tap the heart icon on any venue while browsing to save it here for quick access later."
                actionLabel="Browse Venues"
                actionIcon="search"
                onAction={() => navigate('/venues')}
              />
            </div>
          )}

          {!loading && favoriteVenues.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favoriteVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </main>

      <PageFooter />
    </div>
  )
}

export default FavoritesPage
