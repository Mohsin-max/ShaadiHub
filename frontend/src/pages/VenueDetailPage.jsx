import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ClientHeader from '../components/layout/ClientHeader'
import PageFooter from '../components/layout/PageFooter'
import Icon from '../components/ui/Icon'
import VenueGallery from '../components/ui/VenueGallery'
import AmenitiesGrid from '../components/ui/AmenitiesGrid'
import AvailabilityCalendar from '../components/ui/AvailabilityCalendar'
import ProviderCard from '../components/ui/ProviderCard'
import BookingRequestModal from '../components/ui/BookingRequestModal'
import { getVenue } from '../utils/api'

const FOOTER_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
]

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23e7eefe"/><text x="400" y="260" font-family="sans-serif" font-size="28" fill="%2380737d" text-anchor="middle">No photos yet</text></svg>',
  )

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-PK')}`
}

function VenueDetailPage() {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    getVenue(id)
      .then(setVenue)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <ClientHeader />
        <div className="pt-14 flex-1 flex items-center justify-center text-on-surface-variant">
          Loading venue…
        </div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <ClientHeader />
        <div className="pt-14 flex-1 flex flex-col items-center justify-center gap-2 text-center px-4">
          <Icon name="error" className="text-error text-[32px]" />
          <p className="text-on-surface-variant">{error || 'Venue not found.'}</p>
        </div>
      </div>
    )
  }

  const galleryImages = venue.images.length > 0 ? venue.images.map((i) => i.url) : [PLACEHOLDER_IMAGE]

  const stats = [
    { label: 'Capacity', value: `${venue.capacity} Guests` },
    { label: 'Venue Type', value: venue.type },
    { label: 'Price', value: formatPrice(venue.price) },
    { label: 'Weekend Price', value: venue.weekendPrice ? formatPrice(venue.weekendPrice) : 'Same as base' },
  ]

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader />

      <main className="pt-14 flex-1">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 pt-8 pb-16">
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold mb-2.5">
                  {venue.type}
                </span>
                <h1 className="font-headline-lg text-[28px] text-primary mb-1.5">{venue.name}</h1>
                <div className="flex items-center gap-1.5 text-on-surface-variant text-[14px]">
                  <Icon name="location_on" className="text-[18px]" />
                  <span>
                    {venue.areaName}, {venue.city}
                  </span>
                  {venue.googleMapsLink && (
                    <a
                      href={venue.googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary font-semibold hover:text-secondary transition-colors ml-1"
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2.5">
                <button className="flex items-center gap-1.5 px-3.5 py-2 border border-outline-variant rounded-lg text-[13px] font-semibold hover:bg-surface-container-low transition-colors">
                  <Icon name="favorite" className="text-[16px]" /> Save
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-2 border border-outline-variant rounded-lg text-[13px] font-semibold hover:bg-surface-container-low transition-colors">
                  <Icon name="share" className="text-[16px]" /> Share
                </button>
              </div>
            </div>
          </div>

          <VenueGallery images={galleryImages} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-margin-desktop items-start">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="font-headline-sm text-[18px] text-primary mb-3">About the Venue</h3>
                <p className="text-on-surface-variant text-[15px] leading-relaxed max-w-3xl">
                  {venue.description || `${venue.name} is a ${venue.type.toLowerCase()} located in ${venue.areaName}, ${venue.city}, with space for up to ${venue.capacity} guests.`}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6 pt-6 border-t border-outline-variant">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col">
                      <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        {stat.label}
                      </span>
                      <span className="text-[16px] font-bold text-primary">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <AmenitiesGrid amenities={venue.amenities} />

              <AvailabilityCalendar bookedDays={[8, 15, 22]} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              <ProviderCard
                name={venue.ownerName}
                role="Venue Owner"
                photo={null}
                onSendRequest={() => setModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>

      <PageFooter links={FOOTER_LINKS} />

      <BookingRequestModal open={modalOpen} onClose={() => setModalOpen(false)} venueName={venue.name} />
    </div>
  )
}

export default VenueDetailPage
