import { useNavigate } from 'react-router-dom'
import ClientHeader from '../components/layout/ClientHeader'
import FilterSidebar from '../components/layout/FilterSidebar'
import PageFooter from '../components/layout/PageFooter'
import EmptyStateCard from '../components/ui/EmptyStateCard'

const FOOTER_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
]

// No backend/state wiring yet — favorites always render empty in this UI-only phase.
const favoriteVenues = []

function FavoritesPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader />

      <main className="pt-14 flex-1 flex">
        <FilterSidebar />

        <section className="flex-1 ml-0 md:ml-64 p-5 md:p-6">
          <div className="mb-5">
            <h1 className="font-headline-md text-[24px] text-primary mb-0.5">Your Favorites</h1>
            <p className="text-[13px] text-on-surface-variant">
              {favoriteVenues.length === 0
                ? 'No saved venues yet'
                : `${favoriteVenues.length} saved venues`}
            </p>
          </div>

          {favoriteVenues.length === 0 && (
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
        </section>
      </main>

      <div className="md:pl-64">
        <PageFooter links={FOOTER_LINKS} social />
      </div>
    </div>
  )
}

export default FavoritesPage
