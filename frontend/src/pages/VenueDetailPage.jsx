import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ClientHeader from '../components/layout/ClientHeader'
import PageFooter from '../components/layout/PageFooter'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'
import VenueGallery from '../components/ui/VenueGallery'
import AmenitiesGrid from '../components/ui/AmenitiesGrid'
import AvailabilityCalendar from '../components/ui/AvailabilityCalendar'
import ProviderCard from '../components/ui/ProviderCard'
import BookingRequestModal from '../components/ui/BookingRequestModal'
import { SAMPLE_VENUES } from '../utils/sampleVenues'

const GALLERY_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBB_v75plFPWmZxzPxFp2zLMDhhQSWnPHrB9yniobnjdEyJkhZtMEhO4bL3b4-UyX_yEY6l66kW-xKHzfnxgtQ4DHojn_rLccrfUaOYoVkN3N3kKGM4NXlc2v9VjMrVThc5EUgXw2WW8g8xq-WNH3iyJY6D2ysQK24AuLIeC8iMCabTGhi1KrROXqGyIhqnByKlktCvIvBF5nCexwPtKfyN8d5LOOjwFvC_jXYnmxfl30g6RXJkHsb9SAbmt-CdUi4fKuz3SWOZ5A',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuATHiIldzc0EnqX4vFo19e-zQC-pX6ROERk6-xSb52MyeGpiyOrC43KKJ2W4Cm9hrYDJ3Tmwhj8JjUgdDmVhYlEC7gfc6Ecyq5qTnEUm4Yz-vR2VXdwKMbCJorwpZzGTRWDXhXbmnGp3qzDjFZaVA8SXMlKgJXC4s4_xC61-l1Ejo-Np5sAeEtHaseYOK-lghdwJdTCQf2E7PAISp4TAHJEAp7HwZIx48dAsBxMCri4bDl3dgv37JZuhTApf0TUb2cMpIZScET9lw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAp5-Qi43PB3iy-dMPVkeqaymPYTrJs49RHp-MaRoq8yAGGjvZC1kelICbQc6WRWaB4PTgdDgnBXR6IJQBmGQXZAgTKaUzUS9X1OYG1EzAF3psOtaytcZpBuMa0TQd6L8tV8f8YyNN6Hu0J7jzxkjEf0nSKqcFzpV-a2t0z9rowMPNV29ATVOXK6ZwAAQUbhzINZ_Wl9VUqctbdt-SfwBncIUe9nIwL4Ad7GkKHiu4SvvMjtbF7u31cJBp8Blpj5b3ZxfJR_doUxQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBtnHR0CIIpNjYHf7a1vJyfiSl3M6Nvkx970fowFR0vVQL9_IpWecVyxypq7qF2SGrCnQV_kKkc3NuCgZhEiuAYZy-sv6iGUkaMbMVpkfD7rAuPKW1Zs-W45SFBEFRhuIEREkMgr2KLZyJxyRlrQRiqt0KdNch4T3n_wzM4SepKLIGlNcRiwzQy0tI1qPSivSo_-DnMV_h3r15wYBWFKMcoLx0VzCJV5txajybYC4xEPr4m3l5xYJ1bPS9SEuO5wFigZmtu71VrnQ',
  ...SAMPLE_VENUES.slice(0, 5).map((v) => v.image),
]

const PROVIDER_PHOTO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDAjnfkx4zTzlysx8mRONBGwVPFkSUQ_cHR4GUP9K-NjEmUDsxaMgThGnGpAcuHo2q-57xt7yfd8az-OiG3LRgOLLxHSgvKd1F6c55lcR-6A6s0lTR2ilBzie0ceUmINpgGkhxw0h83IsnPoB4fZK_hSrKOH_AsPWP5eHpFc6U5-S0OHO2O__qpcxHCzhMYvzJ-hjPXzNC3rEVzO9qs8kV4-f_BnLbW2Hp32WiKcu2ZjM8wzOIgvDnrE5V0sVMqWyeRdOV0ti1wqA'

const STATS = [
  { label: 'Capacity', value: '500 - 1200' },
  { label: 'Event Types', value: 'Wedding, Nikah' },
  { label: 'Catering', value: 'In-house Only' },
  { label: 'Parking', value: '250+ Spots' },
]

const FOOTER_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
]

function VenueDetailPage() {
  const { id } = useParams()
  const [modalOpen, setModalOpen] = useState(false)

  const venue = SAMPLE_VENUES.find((v) => String(v.id) === id) || SAMPLE_VENUES[0]

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
                  Premium Heritage Venue
                </span>
                <h1 className="font-headline-lg text-[28px] text-primary mb-1.5">
                  The Mughal Gardens Royal Pavilion
                </h1>
                <div className="flex items-center gap-1.5 text-on-surface-variant text-[14px]">
                  <Icon name="location_on" className="text-[18px]" />
                  <span>{venue.area}</span>
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

          <VenueGallery images={GALLERY_IMAGES} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-margin-desktop items-start">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="font-headline-sm text-[18px] text-primary mb-3">About the Venue</h3>
                <p className="text-on-surface-variant text-[15px] leading-relaxed max-w-3xl">
                  Experience the zenith of regal hospitality at The Mughal Gardens. Located in the
                  heart of Gulberg, this architectural masterpiece blends the timeless elegance of
                  Pakistani heritage with contemporary luxury. Featuring vast outdoor lawns capable
                  of hosting up to 1,200 guests and an exquisite indoor pavilion with
                  climate-controlled systems, it remains Lahore's premier choice for discerning
                  families.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6 pt-6 border-t border-outline-variant">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="flex flex-col">
                      <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                        {stat.label}
                      </span>
                      <span className="text-[16px] font-bold text-primary">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <AmenitiesGrid />

              <AvailabilityCalendar bookedDays={[8, 15, 22]} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              <ProviderCard
                name="Zeeshan Haider"
                role="Senior Event Manager"
                photo={PROVIDER_PHOTO}
                onSendRequest={() => setModalOpen(true)}
              />

              <div className="bg-primary-container p-5 rounded-xl text-on-primary-container border border-primary relative overflow-hidden">
                <div className="relative z-10">
                  <h5 className="font-headline-sm text-[16px] mb-2">Winter Promotion</h5>
                  <p className="text-[13px] mb-3 text-on-primary-container/80">
                    Book for any date in January or February and get a complimentary appetizer
                    course for up to 300 guests.
                  </p>
                  <button className="text-[13px] font-semibold text-primary-fixed border-b border-primary-fixed hover:text-on-primary transition-colors">
                    View Details
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Icon name="celebration" className="text-[100px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PageFooter links={FOOTER_LINKS} />

      <BookingRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        venueName="The Mughal Gardens Royal Pavilion"
      />
    </div>
  )
}

export default VenueDetailPage
