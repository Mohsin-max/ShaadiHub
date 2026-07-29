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

const HOW_IT_WORKS = [
  {
    icon: 'travel_explore',
    title: 'Browse & Compare',
    description: 'Filter by city, capacity, and budget to shortlist venues that fit your celebration.',
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

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-PK')}`
}

function LandingPage() {
  const navigate = useNavigate()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroCity, setHeroCity] = useState('')
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
      if (!map.has(v.city)) {
        map.set(v.city, { city: v.city, count: 0, image: v.images?.[0]?.url })
      }
      const entry = map.get(v.city)
      entry.count += 1
      if (!entry.image && v.images?.[0]?.url) entry.image = v.images[0].url
    })
    return [...map.values()].sort((a, b) => b.count - a.count)
  }, [venues])

  const handleHeroSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (heroCity) params.set('city', heroCity)
    if (heroGuests) params.set('capacity', heroGuests)
    const query = params.toString()
    navigate(query ? `/venues?${query}` : '/venues')
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen w-full overflow-x-hidden">
      <LandingHeader />

      {/* Hero */}
      <header className="relative pt-16">
        <div className="relative min-h-[640px] md:min-h-[720px] flex items-end">
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_IMAGE}
              alt="A luxurious Pakistani wedding venue scene during golden hour, with marigolds, roses, and plum and antique-gold draped silk fabrics."
              className="w-full h-full object-cover brightness-[0.55]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-primary/10" />
          </div>

          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 md:px-6 pb-16 pt-28">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary-fixed-dim uppercase tracking-widest mb-4">
                <Icon name="auto_awesome" className="text-[14px]" />
                Pakistan's Premier Venue Marketplace
              </span>
              <h1 className="font-display-lg text-[34px] md:text-[48px] leading-[1.1] text-white mb-5">
                Where Pakistan's Grandest Weddings Begin.
              </h1>
              <p className="text-white/85 text-[15px] md:text-[16px] leading-relaxed max-w-lg mb-8">
                Discover and negotiate directly with Pakistan's most prestigious wedding venues — from
                heritage ballrooms to open-air marquees. No commissions, no middlemen, just your perfect
                celebration.
              </p>
            </div>

            {/* Search card */}
            <form
              onSubmit={handleHeroSearch}
              className="bg-surface-container-lowest p-2.5 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 border border-outline-variant max-w-2xl"
            >
              <div className="flex-1 flex items-center px-3.5 py-2.5 gap-2.5 border-b md:border-b-0 md:border-r border-outline-variant">
                <Icon name="location_on" className="text-primary text-[20px] shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
                    City
                  </label>
                  <SearchableSelect
                    options={cities}
                    value={heroCity}
                    onChange={setHeroCity}
                    placeholder="Any city"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center px-3.5 py-2.5 gap-2.5">
                <Icon name="groups" className="text-primary text-[20px] shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
                    Guests
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={heroGuests}
                    onChange={(e) => setHeroGuests(e.target.value)}
                    placeholder="e.g. 400"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none text-[14px] text-on-surface placeholder:text-outline-variant"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-[14px] hover:bg-primary-container transition-colors"
              >
                <Icon name="search" className="text-[18px]" />
                Search Venues
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <section className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-6 grid grid-cols-3 divide-x divide-outline-variant text-center">
          <div>
            <p className="font-display-lg text-[26px] md:text-[32px] text-primary">
              {loading ? '—' : venues.length}
            </p>
            <p className="text-[11px] md:text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Premium Venues
            </p>
          </div>
          <div>
            <p className="font-display-lg text-[26px] md:text-[32px] text-primary">
              {loading ? '—' : cities.length}
            </p>
            <p className="text-[11px] md:text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Cities Covered
            </p>
          </div>
          <div>
            <p className="font-display-lg text-[26px] md:text-[32px] text-primary">0%</p>
            <p className="text-[11px] md:text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Hidden Fees
            </p>
          </div>
        </div>
      </section>

      <main>
        {/* Featured Venues */}
        {!loading && featured.length > 0 && (
          <section className="py-20 px-5 md:px-6 max-w-[1280px] mx-auto">
            <div className="flex justify-between items-end mb-8 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-antique-gold uppercase tracking-widest mb-2 block">
                  Handpicked Selection
                </span>
                <h2 className="font-display-lg text-[26px] md:text-[30px] text-primary">Featured Venues</h2>
              </div>
              <Link
                to="/venues"
                className="hidden sm:flex items-center gap-1.5 text-primary font-bold text-[13px] hover:text-secondary transition-colors shrink-0"
              >
                View all venues
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:h-[560px]">
              {featured[0] && (
                <Link
                  to={`/venues/${featured[0].id}`}
                  className="md:col-span-8 group relative overflow-hidden rounded-2xl border border-outline-variant shadow-sm h-[320px] md:h-full"
                >
                  <img
                    src={featured[0].images?.[0]?.url || PLACEHOLDER_IMAGE}
                    alt={featured[0].name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                    <span className="inline-block bg-antique-gold text-primary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide mb-3">
                      Top Pick
                    </span>
                    <h3 className="font-display-lg text-[22px] md:text-[26px] text-white mb-2">
                      {featured[0].name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/85 text-[13px]">
                      <span className="flex items-center gap-1">
                        <Icon name="location_on" className="text-[16px]" />
                        {featured[0].areaName}, {featured[0].city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="group" className="text-[16px]" />
                        Up to {featured[0].capacity} Guests
                      </span>
                      <span className="font-bold text-white">{formatPrice(featured[0].price)}</span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="md:col-span-4 flex flex-col gap-5">
                {featured.slice(1, 3).map((venue) => (
                  <Link
                    key={venue.id}
                    to={`/venues/${venue.id}`}
                    className="group relative flex-1 min-h-[160px] overflow-hidden rounded-2xl border border-outline-variant shadow-sm"
                  >
                    <img
                      src={venue.images?.[0]?.url || PLACEHOLDER_IMAGE}
                      alt={venue.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <h3 className="font-title-lg text-[15px] text-white mb-0.5">{venue.name}</h3>
                      <p className="text-white/75 text-[12px]">{venue.city}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Explore Cities */}
        {!loading && cityGroups.length > 0 && (
          <section className="py-16 bg-surface-container-lowest border-y border-outline-variant">
            <div className="max-w-[1280px] mx-auto px-5 md:px-6">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[12px] font-bold text-primary uppercase tracking-widest">
                  Explore by City
                </h3>
                <div className="h-px flex-1 bg-outline-variant" />
              </div>
              <div className="flex overflow-x-auto gap-5 pb-4 -mx-5 px-5 md:mx-0 md:px-0">
                {cityGroups.map((group) => (
                  <button
                    key={group.city}
                    onClick={() => navigate(`/venues?city=${encodeURIComponent(group.city)}`)}
                    className="group shrink-0 w-[220px] text-left"
                  >
                    <div className="h-[260px] rounded-xl overflow-hidden mb-3 relative">
                      <img
                        src={group.image || PLACEHOLDER_IMAGE}
                        alt={group.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-primary/15 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h4 className="font-display-lg text-[18px] text-primary">{group.city}</h4>
                    <p className="text-on-surface-variant text-[12px]">
                      {group.count} Venue{group.count === 1 ? '' : 's'} Available
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-5 md:px-6 max-w-[1280px] mx-auto scroll-mt-20">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[11px] font-semibold text-antique-gold uppercase tracking-widest mb-2 block">
              Simple, Transparent, Direct
            </span>
            <h2 className="font-display-lg text-[26px] md:text-[30px] text-primary">How ShaadiHub Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="relative text-center px-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                  <Icon name={step.icon} className="text-[26px]" />
                </div>
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 font-display-lg text-[64px] text-primary/5 pointer-events-none select-none">
                  {i + 1}
                </span>
                <h4 className="font-title-lg text-[16px] text-primary mb-2 relative">{step.title}</h4>
                <p className="text-on-surface-variant text-[13px] leading-relaxed relative">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why ShaadiHub */}
        <section className="py-20 px-5 md:px-6 bg-surface-container-lowest border-y border-outline-variant">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-[11px] font-semibold text-antique-gold uppercase tracking-widest mb-2 block">
                Why ShaadiHub
              </span>
              <h2 className="font-display-lg text-[26px] md:text-[30px] text-primary">
                Transparency in Every Celebration
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WHY_SHAADIHUB.map((item) => (
                <div
                  key={item.title}
                  className="bg-white p-6 rounded-2xl border border-outline-variant hover:border-antique-gold/50 hover:shadow-lg transition-all"
                >
                  <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center mb-4">
                    <Icon name={item.icon} className="text-on-primary text-[20px]" />
                  </div>
                  <h4 className="font-title-lg text-[15px] text-primary mb-1.5">{item.title}</h4>
                  <p className="text-on-surface-variant text-[13px] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Venue Owner CTA */}
        <section id="for-owners" className="py-20 px-5 md:px-6 scroll-mt-20">
          <div className="max-w-[1280px] mx-auto relative overflow-hidden rounded-3xl bg-primary px-6 md:px-14 py-14 md:py-16">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-antique-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-secondary-fixed/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-xl">
                <span className="text-[11px] font-semibold text-secondary-fixed-dim uppercase tracking-widest mb-3 block">
                  For Venue Owners
                </span>
                <h2 className="font-display-lg text-[24px] md:text-[28px] text-white mb-3">
                  Own a Hall, Marquee, or Lawn? List It Today.
                </h2>
                <p className="text-white/75 text-[14px] leading-relaxed">
                  Reach thousands of couples actively planning their wedding. Manage inquiries, negotiate
                  offers, and control your calendar — all from one dashboard.
                </p>
              </div>
              <Link
                to="/signup?role=provider"
                className="shrink-0 flex items-center gap-2 bg-antique-gold text-primary px-7 py-3.5 rounded-xl font-bold text-[14px] hover:brightness-105 transition-all"
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
