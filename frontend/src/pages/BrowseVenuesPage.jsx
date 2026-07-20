import { useEffect, useMemo, useState } from 'react'
import ClientHeader from '../components/layout/ClientHeader'
import FilterSidebar from '../components/layout/FilterSidebar'
import PageFooter from '../components/layout/PageFooter'
import VenueCard from '../components/ui/VenueCard'
import EmptyStateCard from '../components/ui/EmptyStateCard'
import { listVenues } from '../utils/api'

const FOOTER_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
]

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function BrowseVenuesPage() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedCities, setSelectedCities] = useState([])
  const [selectedAreas, setSelectedAreas] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])

  useEffect(() => {
    listVenues()
      .then(setVenues)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const cities = useMemo(() => [...new Set(venues.map((v) => v.city))].sort(), [venues])
  const areas = useMemo(() => [...new Set(venues.map((v) => v.areaName))].sort(), [venues])
  const types = useMemo(() => [...new Set(venues.map((v) => v.type))].sort(), [venues])

  const filteredVenues = venues.filter(
    (v) =>
      (selectedCities.length === 0 || selectedCities.includes(v.city)) &&
      (selectedAreas.length === 0 || selectedAreas.includes(v.areaName)) &&
      (selectedTypes.length === 0 || selectedTypes.includes(v.type)),
  )

  const clearAll = () => {
    setSelectedCities([])
    setSelectedAreas([])
    setSelectedTypes([])
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader />

      <main className="pt-14 flex-1 flex">
        <FilterSidebar
          cities={cities}
          areas={areas}
          types={types}
          selectedCities={selectedCities}
          selectedAreas={selectedAreas}
          selectedTypes={selectedTypes}
          onCityToggle={(city) => setSelectedCities((prev) => toggleValue(prev, city))}
          onAreaToggle={(area) => setSelectedAreas((prev) => toggleValue(prev, area))}
          onTypeToggle={(type) => setSelectedTypes((prev) => toggleValue(prev, type))}
          onClearAll={clearAll}
        />

        <section className="flex-1 ml-0 md:ml-64 p-5 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-5 gap-3">
            <div>
              <h1 className="font-headline-md text-[24px] text-primary mb-0.5">Premium Venues</h1>
              <p className="text-[13px] text-on-surface-variant">
                {loading ? 'Loading venues…' : `Showing ${filteredVenues.length} of ${venues.length} venues`}
              </p>
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-error bg-error-container rounded-lg px-3.5 py-2.5 mb-5">
              {error}
            </p>
          )}

          {!loading && venues.length === 0 && !error && (
            <div className="max-w-md mx-auto mt-12">
              <EmptyStateCard
                icon="storefront"
                title="No venues listed yet"
                description="Once venue providers start listing their halls and lawns, they'll show up here."
                actionLabel="Refresh"
                actionIcon="refresh"
                onAction={() => window.location.reload()}
              />
            </div>
          )}

          {!loading && venues.length > 0 && filteredVenues.length === 0 && (
            <div className="max-w-md mx-auto mt-12">
              <EmptyStateCard
                icon="filter_alt_off"
                title="No venues match your filters"
                description="Try clearing some filters to see more results."
                actionLabel="Clear Filters"
                actionIcon="close"
                onAction={clearAll}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </section>
      </main>

      <div className="md:pl-64">
        <PageFooter links={FOOTER_LINKS} social />
      </div>
    </div>
  )
}

export default BrowseVenuesPage
