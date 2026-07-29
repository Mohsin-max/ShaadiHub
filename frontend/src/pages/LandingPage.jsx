import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LandingHeader from '../components/layout/LandingHeader'
import PublicFooter from '../components/layout/PublicFooter'
import SearchableSelect from '../components/ui/SearchableSelect'
import Icon from '../components/ui/Icon'
import { listVenues } from '../utils/api'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD6OHpX8opUTWHiBi39zutJtBZIaiXsx3UL0sdEzsObeYxC5cZFW1yi5DpxVoI_-WX7nH2x0UmaJ4JtSgSwCWKgZMGgHkb94i7OIwq8q0BZA8MgpbqjlfKFszF3BVlKtVXmALezrhAapLIPjbdx03zDmxs1k6PE6xwGyY7oNen1MjxUzUDwEcbMhhRGzQQRBc8tdvRAMxPIwJgzLuPuRw1QqKTYH-iSfg0KDi6Un-E61TreZfyil3jguNkExkhsfp1qSBXuBpMK7w'

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23e7eefe"/><text x="400" y="260" font-family="sans-serif" font-size="28" fill="%2380737d" text-anchor="middle">ShaadiHub</text></svg>',
  )

// Real, recognizable city landmarks (Wikimedia Commons) so "Explore by City" reads as an
// editorial travel guide rather than a random photo pulled from whichever venue happens to be listed there.
const CITY_LANDMARKS = {
  Karachi: {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PK_Karachi_asv2020-02_img52_Mazar-e-Quaid.jpg/500px-PK_Karachi_asv2020-02_img52_Mazar-e-Quaid.jpg',
    landmark: 'Mazar-e-Quaid',
  },
  Lahore: {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Minar_e_Pakistan_2021.jpg/500px-Minar_e_Pakistan_2021.jpg',
    landmark: 'Minar-e-Pakistan',
  },
  Islamabad: {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ali_Mujtaba_WLM2017_FAISAL_MOSQUE_019.jpg/500px-Ali_Mujtaba_WLM2017_FAISAL_MOSQUE_019.jpg',
    landmark: 'Faisal Mosque',
  },
  Faisalabad: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Kenta_Kerr.JPG/500px-Kenta_Kerr.JPG',
    landmark: 'Ghanta Ghar',
  },
  Multan: {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Splendid_Shrine_of_Hazrat_Baha-ud-din_Zakariya.jpg/500px-Splendid_Shrine_of_Hazrat_Baha-ud-din_Zakariya.jpg',
    landmark: 'Shrine of Bahauddin Zakariya',
  },
  Peshawar: {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Bala_Hisar_Fort.jpg/500px-Bala_Hisar_Fort.jpg',
    landmark: 'Bala Hisar Fort',
  },
  Rawalpindi: {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Rawal_Lake_Eastern_Bank.jpg/500px-Rawal_Lake_Eastern_Bank.jpg',
    landmark: 'Rawal Lake',
  },
}

const HOW_IT_WORKS = [
  {
    icon: 'travel_explore',
    title: 'Browse & Compare',
    description: 'Filter by city, date, capacity, and budget to shortlist venues that fit your celebration.',
  },
  {
    icon: 'forum',
    title: 'Request & Negotiate',
    description: 'Send a booking request with your offer and negotiate directly with the venue — no middlemen.',
  },
  {
    icon: 'event_available',
    title: 'Confirm Your Booking',
    description: 'Once both sides agree, the date locks in and contact details are shared to finalize details.',
  },
]

const WHY_SHAADIHUB = [
  {
    icon: 'handshake',
    title: 'Direct Negotiation',
    description: 'Secure the best rate through our built-in request & offer system — talk straight to the venue.',
  },
  {
    icon: 'payments',
    title: 'Transparent Pricing',
    description: 'See base price, weekend rates, and policies upfront. No hidden costs, no surprise add-ons.',
  },
  {
    icon: 'calendar_month',
    title: 'Real-Time Availability',
    description: "Every venue's calendar is live, so you always know exactly which dates are open.",
  },
]

const DOT_GRID_STYLE = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
}

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-PK')}`
}

function SectionEyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold text-antique-gold uppercase tracking-[0.15em] mb-3">
      <span className="h-px w-5 bg-antique-gold" />
      {children}
    </span>
  )
}

function LandingPage() {
  const navigate = useNavigate()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroCity, setHeroCity] = useState('')
  const [heroDate, setHeroDate] = useState('')
  const [heroGuests, setHeroGuests] = useState('')

  useEffect(() => {
    listVenues()
      .then(setVenues)
      .catch(() => setVenues([]))
      .finally(() => setLoading(false))
  }, [])

  const cities = useMemo(() => [...new Set(venues.map((v) => v.city))].sort(), [venues])

  const featured = useMemo(
    () => [...venues].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, 3),
    [venues],
  )

  const cityGroups = useMemo(() => {
    const map = new Map()
    venues.forEach((v) => {
      if (!map.has(v.city)) map.set(v.city, { city: v.city, count: 0 })
      map.get(v.city).count += 1
    })
    return [...map.values()].sort((a, b) => b.count - a.count)
  }, [venues])

  const handleHeroSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (heroCity) params.set('city', heroCity)
    if (heroDate) params.set('date', heroDate)
    if (heroGuests) params.set('capacity', heroGuests)
    const query = params.toString()
    navigate(query ? `/venues?${query}` : '/venues')
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen w-full overflow-x-hidden">
      <LandingHeader />

      {/* Hero */}
      <header className="relative pt-16">
        <div className="relative min-h-[660px] md:min-h-[760px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_IMAGE}
              alt="A luxurious Pakistani wedding venue scene during golden hour, with marigolds, roses, and plum and antique-gold draped silk fabrics."
              className="w-full h-full object-cover brightness-[0.5]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 md:px-6 pb-14 pt-16">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em] mb-5 px-3 py-1.5 rounded-full border border-secondary-fixed-dim/30 bg-white/5 backdrop-blur-sm">
                <Icon name="auto_awesome" className="text-[14px]" />
                Pakistan's Premier Venue Marketplace
              </span>
              <h1 className="font-display-lg text-[36px] md:text-[52px] leading-[1.08] text-white mb-6">
                Where Pakistan's Grandest Weddings Begin.
              </h1>
              <p className="text-white/85 text-[15px] md:text-[17px] leading-relaxed max-w-lg mb-10">
                Discover and negotiate directly with Pakistan's most prestigious wedding venues — from
                heritage ballrooms to open-air marquees. No commissions, no middlemen, just your perfect
                celebration.
              </p>
            </div>

            {/* Search bar */}
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-2xl md:rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] max-w-3xl border border-black/5"
            >
              <div className="flex flex-col md:flex-row md:items-center divide-y md:divide-y-0 md:divide-x divide-outline-variant/60">
                <label className="group flex-1 flex items-center gap-3 px-6 py-3.5 md:pl-7 md:pr-4 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer min-w-0">
                  <Icon name="location_on" className="text-primary/60 text-[19px] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] font-bold text-primary uppercase tracking-wider">
                      City
                    </span>
                    <SearchableSelect options={cities} value={heroCity} onChange={setHeroCity} placeholder="Any city" />
                  </div>
                </label>

                <label className="group flex-1 flex items-center gap-3 px-6 py-3.5 hover:bg-surface-container-low transition-colors cursor-pointer min-w-0">
                  <Icon name="calendar_month" className="text-primary/60 text-[19px] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] font-bold text-primary uppercase tracking-wider">
                      Date
                    </span>
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={heroDate}
                      onChange={(e) => setHeroDate(e.target.value)}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none text-[13px] font-semibold text-on-surface"
                    />
                  </div>
                </label>

                <label className="group flex-1 flex items-center gap-3 px-6 py-3.5 hover:bg-surface-container-low transition-colors cursor-pointer min-w-0">
                  <Icon name="groups" className="text-primary/60 text-[19px] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] font-bold text-primary uppercase tracking-wider">
                      Guests
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={heroGuests}
                      onChange={(e) => setHeroGuests(e.target.value)}
                      placeholder="e.g. 400"
                      className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none text-[13px] font-semibold text-on-surface placeholder:text-outline-variant placeholder:font-normal"
                    />
                  </div>
                </label>

                <div className="p-2 md:pr-2.5 shrink-0">
                  <button
                    type="submit"
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-6 md:px-5 py-3 md:py-3 rounded-full font-bold text-[13px] hover:bg-primary-container active:scale-[0.98] transition-all"
                  >
                    <Icon name="search" className="text-[18px]" />
                    <span className="md:hidden lg:inline">Search Venues</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <section className="bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-8 grid grid-cols-3 gap-4">
          {[
            { icon: 'domain', value: loading ? '—' : venues.length, label: 'Premium Venues' },
            { icon: 'map', value: loading ? '—' : cities.length, label: 'Cities Covered' },
            { icon: 'verified', value: '0%', label: 'Hidden Fees' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 text-center md:text-left justify-center">
              <div className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon name={stat.icon} className="text-[20px]" />
              </div>
              <div>
                <p className="font-display-lg text-[22px] md:text-[26px] text-primary leading-none">{stat.value}</p>
                <p className="text-[10px] md:text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <main>
        {/* Featured Venues */}
        {!loading && featured.length > 0 && (
          <section className="py-20 px-5 md:px-6 max-w-[1280px] mx-auto">
            <div className="flex justify-between items-end mb-8 gap-4">
              <div>
                <SectionEyebrow>Handpicked Selection</SectionEyebrow>
                <h2 className="font-display-lg text-[26px] md:text-[32px] text-primary">Featured Venues</h2>
              </div>
              <Link
                to="/venues"
                className="hidden sm:flex items-center gap-1.5 text-primary font-bold text-[13px] hover:text-secondary transition-colors shrink-0 group"
              >
                View all venues
                <Icon name="arrow_forward" className="text-[16px] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:h-[560px]">
              {featured[0] && (
                <Link
                  to={`/venues/${featured[0].id}`}
                  className="md:col-span-8 group relative overflow-hidden rounded-2xl border border-outline-variant shadow-sm hover:shadow-2xl transition-shadow h-[320px] md:h-full"
                >
                  <img
                    src={featured[0].images?.[0]?.url || PLACEHOLDER_IMAGE}
                    alt={featured[0].name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                    <span className="inline-flex items-center gap-1 bg-antique-gold text-primary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide mb-3">
                      <Icon name="workspace_premium" className="text-[13px]" />
                      Top Pick
                    </span>
                    <h3 className="font-display-lg text-[22px] md:text-[28px] text-white mb-2">
                      {featured[0].name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-white/85 text-[13px]">
                      <span className="flex items-center gap-1">
                        <Icon name="location_on" className="text-[16px]" />
                        {featured[0].areaName}, {featured[0].city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="group" className="text-[16px]" />
                        Up to {featured[0].capacity} Guests
                      </span>
                      <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                        {formatPrice(featured[0].price)}
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="md:col-span-4 flex flex-col gap-5">
                {featured.slice(1, 3).map((venue) => (
                  <Link
                    key={venue.id}
                    to={`/venues/${venue.id}`}
                    className="group relative flex-1 min-h-[160px] overflow-hidden rounded-2xl border border-outline-variant shadow-sm hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={venue.images?.[0]?.url || PLACEHOLDER_IMAGE}
                      alt={venue.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <h3 className="font-title-lg text-[15px] text-white mb-0.5">{venue.name}</h3>
                      <p className="text-white/75 text-[12px] flex items-center gap-1">
                        <Icon name="location_on" className="text-[13px]" />
                        {venue.city}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Explore Cities */}
        {!loading && cityGroups.length > 0 && (
          <section className="py-20 bg-surface-container-lowest border-y border-outline-variant">
            <div className="max-w-[1280px] mx-auto px-5 md:px-6">
              <div className="mb-8">
                <SectionEyebrow>Across Pakistan</SectionEyebrow>
                <h2 className="font-display-lg text-[26px] md:text-[32px] text-primary">Explore by City</h2>
              </div>
              <div className="flex overflow-x-auto gap-5 pb-4 -mx-5 px-5 md:mx-0 md:px-0 custom-scrollbar">
                {cityGroups.map((group) => {
                  const landmark = CITY_LANDMARKS[group.city]
                  return (
                    <button
                      key={group.city}
                      onClick={() => navigate(`/venues?city=${encodeURIComponent(group.city)}`)}
                      className="group shrink-0 w-[230px] text-left"
                    >
                      <div className="h-[280px] rounded-2xl overflow-hidden mb-3 relative border border-outline-variant shadow-sm group-hover:shadow-xl transition-shadow">
                        <img
                          src={landmark?.image || PLACEHOLDER_IMAGE}
                          alt={landmark ? `${landmark.landmark}, ${group.city}` : group.city}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/5 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                          <h4 className="font-display-lg text-[19px] text-white mb-0.5">{group.city}</h4>
                          {landmark && (
                            <p className="text-white/70 text-[10px] uppercase tracking-wide font-semibold mb-1">
                              {landmark.landmark}
                            </p>
                          )}
                          <p className="text-white/90 text-[11px] font-semibold flex items-center gap-1">
                            <Icon name="storefront" className="text-[13px]" />
                            {group.count} Venue{group.count === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-5 md:px-6 max-w-[1280px] mx-auto scroll-mt-20">
          <div className="text-center max-w-xl mx-auto mb-16">
            <SectionEyebrow>
              <span className="mx-auto">Simple, Transparent, Direct</span>
            </SectionEyebrow>
            <h2 className="font-display-lg text-[26px] md:text-[32px] text-primary">How ShaadiHub Works</h2>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <div className="hidden md:block absolute top-7 left-[16.5%] right-[16.5%] h-px border-t-2 border-dashed border-outline-variant" />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="relative text-center px-4">
                <div className="relative h-14 w-14 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 ring-8 ring-background">
                  <Icon name={step.icon} className="text-[24px]" />
                  <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-antique-gold text-primary text-[11px] font-bold flex items-center justify-center ring-2 ring-background">
                    {i + 1}
                  </span>
                </div>
                <h4 className="font-title-lg text-[16px] text-primary mb-2">{step.title}</h4>
                <p className="text-on-surface-variant text-[13px] leading-relaxed max-w-[240px] mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why ShaadiHub */}
        <section className="py-20 px-5 md:px-6 bg-surface-container-lowest border-y border-outline-variant">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <SectionEyebrow>
                <span className="mx-auto">Why ShaadiHub</span>
              </SectionEyebrow>
              <h2 className="font-display-lg text-[26px] md:text-[32px] text-primary">
                Transparency in Every Celebration
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WHY_SHAADIHUB.map((item) => (
                <div
                  key={item.title}
                  className="relative bg-white p-7 rounded-2xl border border-outline-variant hover:border-antique-gold/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-5">
                    <Icon name={item.icon} className="text-on-primary text-[22px]" />
                  </div>
                  <h4 className="font-title-lg text-[16px] text-primary mb-2">{item.title}</h4>
                  <p className="text-on-surface-variant text-[13px] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Venue Owner CTA */}
        <section id="for-owners" className="py-20 px-5 md:px-6 scroll-mt-20">
          <div className="max-w-[1280px] mx-auto relative overflow-hidden rounded-3xl bg-primary px-6 md:px-14 py-14 md:py-16">
            <div className="absolute inset-0" style={DOT_GRID_STYLE} />
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-antique-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-secondary-fixed/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-xl">
                <span className="inline-block text-[11px] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em] mb-3">
                  For Venue Owners
                </span>
                <h2 className="font-display-lg text-[24px] md:text-[30px] text-white mb-3">
                  Own a Hall, Marquee, or Lawn? List It Today.
                </h2>
                <p className="text-white/75 text-[14px] leading-relaxed">
                  Reach thousands of couples actively planning their wedding. Manage inquiries, negotiate
                  offers, and control your calendar — all from one dashboard.
                </p>
              </div>
              <Link
                to="/signup?role=provider"
                className="shrink-0 flex items-center gap-2 bg-antique-gold text-primary px-7 py-3.5 rounded-xl font-bold text-[14px] hover:brightness-105 active:scale-[0.98] transition-all"
              >
                <Icon name="add_business" className="text-[18px]" />
                List Your Venue
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

export default LandingPage
