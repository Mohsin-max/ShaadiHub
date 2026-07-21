import { useEffect, useMemo, useState } from 'react'
import ClientHeader from '../components/layout/ClientHeader'
import FilterSidebar from '../components/layout/FilterSidebar'
import PageFooter from '../components/layout/PageFooter'
import VenueCard from '../components/ui/VenueCard'
import VenueCardSkeleton from '../components/ui/VenueCardSkeleton'
import EmptyStateCard from '../components/ui/EmptyStateCard'
import Icon from '../components/ui/Icon'
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

  const [searchText, setSearchText] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedAreas, setSelectedAreas] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [capacityMin, setCapacityMin] = useState(0)
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')

  useEffect(() => {
    listVenues()
      .then(setVenues)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const cities = useMemo(() => [...new Set(venues.map((v) => v.city))].sort(), [venues])
  const types = useMemo(() => [...new Set(venues.map((v) => v.type))].sort(), [venues])

  const areasForCity = useMemo(() => {
    if (!selectedCity) return []
    return [...new Set(venues.filter((v) => v.city === selectedCity).map((v) => v.areaName))].sort()
  }, [venues, selectedCity])

  const filteredVenues = useMemo(() => {
    const search = searchText.trim().toLowerCase()

    let result = venues.filter((v) => {
      if (selectedCity && v.city !== selectedCity) return false
      if (selectedAreas.length > 0 && !selectedAreas.includes(v.areaName)) return false
      if (selectedTypes.length > 0 && !selectedTypes.includes(v.type)) return false
      if (capacityMin > 0 && v.capacity < capacityMin) return false
      if (search) {
        const haystack = `${v.name} ${v.areaName} ${v.city} ${v.type}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })

    const min = budgetMin !== '' ? Number(budgetMin) : null
    const max = budgetMax !== '' ? Number(budgetMax) : null

    if (min !== null || max !== null) {
      const lo = min ?? 0
      const hi = max ?? Infinity
      result = [...result].sort((a, b) => {
        const aIn = a.price >= lo && a.price <= hi
        const bIn = b.price >= lo && b.price <= hi
        if (aIn !== bIn) return aIn ? -1 : 1
        const aDist = aIn ? 0 : Math.min(Math.abs(a.price - lo), Math.abs(a.price - hi))
        const bDist = bIn ? 0 : Math.min(Math.abs(b.price - lo), Math.abs(b.price - hi))
        return aDist - bDist
      })
    } else if (capacityMin > 0) {
      result = [...result].sort((a, b) => a.capacity - b.capacity)
    }

    return result
  }, [venues, selectedCity, selectedAreas, selectedTypes, capacityMin, budgetMin, budgetMax, searchText])

  const handleCityChange = (city) => {
    setSelectedCity(city)
    setSelectedAreas([])
  }

  const clearAll = () => {
    setSelectedCity('')
    setSelectedAreas([])
    setSelectedTypes([])
    setCapacityMin(0)
    setBudgetMin('')
    setBudgetMax('')
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader searchValue={searchText} onSearchChange={setSearchText} />

      <main className="pt-14 flex-1 flex">
        <FilterSidebar
          cities={cities}
          areas={areasForCity}
          types={types}
          selectedCity={selectedCity}
          selectedAreas={selectedAreas}
          selectedTypes={selectedTypes}
          capacityMin={capacityMin}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          onCityChange={handleCityChange}
          onAreaToggle={(area) => setSelectedAreas((prev) => toggleValue(prev, area))}
          onTypeToggle={(type) => setSelectedTypes((prev) => toggleValue(prev, type))}
          onCapacityChange={setCapacityMin}
          onBudgetMinChange={setBudgetMin}
          onBudgetMaxChange={setBudgetMax}
          onClearAll={clearAll}
        />

        <section className="flex-1 ml-0 md:ml-[282px] p-5 md:p-6">
          <div className="relative overflow-hidden rounded-2xl mb-6 bg-gradient-to-br from-primary/[0.05] via-transparent to-antique-gold/[0.08] border border-outline-variant/60 px-5 md:px-7 py-6">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-antique-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row justify-between items-baseline gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-antique-gold uppercase tracking-wider mb-1.5">
                  <Icon name="auto_awesome" className="text-[13px]" />
                  Curated Selection
                </span>
                <h1 className="font-headline-md text-[24px] text-primary mb-0.5">Premium Venues</h1>
                <p className="text-[13px] text-on-surface-variant">
                  {!loading && `Showing ${filteredVenues.length} of ${venues.length} venues`}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-error bg-error-container rounded-lg px-3.5 py-2.5 mb-5">
              {error}
            </p>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <VenueCardSkeleton key={i} />
              ))}
            </div>
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

          {!loading && filteredVenues.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="md:pl-[282px]">
        <PageFooter links={FOOTER_LINKS} social />
      </div>
    </div>
  )
}

export default BrowseVenuesPage
