import ClientHeader from '../components/layout/ClientHeader'
import FilterSidebar from '../components/layout/FilterSidebar'
import PageFooter from '../components/layout/PageFooter'
import VenueCard from '../components/ui/VenueCard'
import Pagination from '../components/ui/Pagination'
import { SAMPLE_VENUES } from '../utils/sampleVenues'

const FOOTER_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
]

function BrowseVenuesPage() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader />

      <main className="pt-14 flex-1 flex">
        <FilterSidebar />

        <section className="flex-1 ml-0 md:ml-64 p-5 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-5 gap-3">
            <div>
              <h1 className="font-headline-md text-[24px] text-primary mb-0.5">Premium Venues</h1>
              <p className="text-[13px] text-on-surface-variant">
                Showing {SAMPLE_VENUES.length} venues in Karachi and Lahore
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_VENUES.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>

          <Pagination currentPage={1} totalPages={3} />
        </section>
      </main>

      <div className="md:pl-64">
        <PageFooter links={FOOTER_LINKS} social />
      </div>
    </div>
  )
}

export default BrowseVenuesPage
