import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ClientHeader from '../components/layout/ClientHeader'
import PageFooter from '../components/layout/PageFooter'
import Icon from '../components/ui/Icon'
import VenueGallery from '../components/ui/VenueGallery'
import AmenitiesGrid from '../components/ui/AmenitiesGrid'
import AvailabilityCalendar from '../components/ui/AvailabilityCalendar'
import ProviderCard from '../components/ui/ProviderCard'
import PriceSummaryCard from '../components/ui/PriceSummaryCard'
import OwnerActionCard from '../components/ui/OwnerActionCard'
import BookingRequestModal from '../components/ui/BookingRequestModal'
import VenueDetailSkeleton from '../components/ui/VenueDetailSkeleton'
import { useAuth } from '../context/AuthContext'
import { getVenue } from '../utils/api'

const CATERING_LABELS = {
  Internal: 'Provided by Venue',
  External: 'Bring Your Own',
  Both: 'Internal or External — Both Allowed',
}

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
  const { user } = useAuth()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [specialEntrySelected, setSpecialEntrySelected] = useState(false)

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
        <main className="pt-14 flex-1">
          <VenueDetailSkeleton />
        </main>
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

  const isOwner = user?.role === 'VenueOwner' && user?.id === venue.ownerId

  const galleryImages = venue.images.length > 0 ? venue.images.map((i) => i.url) : [PLACEHOLDER_IMAGE]

  const stats = [
    { label: 'Capacity', value: `${venue.capacity} Guests`, icon: 'group' },
    { label: 'Venue Type', value: venue.type, icon: 'category' },
    { label: 'Price', value: formatPrice(venue.price), icon: 'payments' },
    {
      label: 'Weekend Price',
      value: venue.weekendPrice ? formatPrice(venue.weekendPrice) : 'Same as base',
      icon: 'weekend',
    },
  ]

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader />

      <main className="pt-14 flex-1">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 pt-8 pb-16">
          {isOwner && (
            <div className="flex items-center gap-2 text-[12px] font-semibold text-antique-gold bg-antique-gold/10 border border-antique-gold/30 rounded-lg px-3.5 py-2 mb-4">
              <Icon name="visibility" className="text-[16px]" />
              You're previewing your own listing exactly as clients see it — booking actions are disabled.
            </div>
          )}

          {/* Header Info */}
          <div className="relative overflow-hidden rounded-2xl mb-6 bg-gradient-to-br from-primary/[0.05] via-transparent to-antique-gold/[0.08] border border-outline-variant/60 px-5 md:px-7 py-6">
            <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-antique-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-12 w-56 h-56 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold mb-2.5 ring-1 ring-antique-gold/30">
                  <Icon name="verified" className="text-[13px]" />
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
                {isOwner ? (
                  <Link
                    to={`/provider/venues/${venue.id}/edit`}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-antique-gold text-primary rounded-lg text-[13px] font-bold hover:brightness-105 transition-all"
                  >
                    <Icon name="edit" className="text-[16px]" /> Edit Venue
                  </Link>
                ) : (
                  <button className="flex items-center gap-1.5 px-3.5 py-2 border border-outline-variant rounded-lg text-[13px] font-semibold bg-surface-container-lowest hover:border-antique-gold/50 hover:text-primary transition-colors">
                    <Icon name="favorite" className="text-[16px]" /> Save
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3.5 py-2 border border-outline-variant rounded-lg text-[13px] font-semibold bg-surface-container-lowest hover:border-antique-gold/50 hover:text-primary transition-colors">
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
                <h3 className="font-headline-sm text-[18px] text-primary mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-antique-gold inline-block" />
                  About the Venue
                </h3>
                <p className="text-on-surface-variant text-[15px] leading-relaxed max-w-3xl">
                  {venue.description || `${venue.name} is a ${venue.type.toLowerCase()} located in ${venue.areaName}, ${venue.city}, with space for up to ${venue.capacity} guests.`}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col gap-2 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-antique-gold/50 hover:shadow-sm transition-all"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Icon name={stat.icon} className="text-[16px]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                          {stat.label}
                        </p>
                        <p className="text-[14px] font-bold text-on-surface">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div>
                <h3 className="font-headline-sm text-[18px] text-primary mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-antique-gold inline-block" />
                  Amenities
                </h3>
                <AmenitiesGrid amenities={venue.amenities} hideHeading />
              </div>

              <div>
                <h3 className="font-headline-sm text-[18px] text-primary mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-antique-gold inline-block" />
                  Facilities & Policies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant">
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon name="restaurant" className="text-[16px]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Catering
                      </p>
                      <p className="text-[13px] font-bold text-on-surface leading-snug">
                        {CATERING_LABELS[venue.catering] || venue.catering}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant">
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon name="local_parking" className="text-[16px]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Parking
                      </p>
                      <p className="text-[13px] font-bold text-on-surface leading-snug">
                        {venue.parkingSpaces ? `${venue.parkingSpaces} vehicles` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant">
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon name="policy" className="text-[16px]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Refund Policy
                      </p>
                      <p className="text-[13px] font-bold text-on-surface leading-snug">{venue.refundPolicy}</p>
                    </div>
                  </div>
                </div>
              </div>

              <AvailabilityCalendar bookedDays={[8, 15, 22]} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              <PriceSummaryCard
                venue={venue}
                specialEntrySelected={specialEntrySelected}
                onToggleSpecialEntry={setSpecialEntrySelected}
              />
              {isOwner ? (
                <OwnerActionCard venueId={venue.id} />
              ) : (
                <ProviderCard
                  name={venue.ownerName}
                  role="Venue Owner"
                  photo={null}
                  onSendRequest={() => setModalOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <PageFooter links={FOOTER_LINKS} />

      {!isOwner && (
        <BookingRequestModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          venueName={venue.name}
          initialPrice={venue.price + (specialEntrySelected ? Number(venue.specialEntryPrice || 0) : 0)}
        />
      )}
    </div>
  )
}

export default VenueDetailPage
