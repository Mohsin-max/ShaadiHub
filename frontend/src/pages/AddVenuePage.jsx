import { Link } from 'react-router-dom'
import ProviderSidebar from '../components/layout/ProviderSidebar'
import PageFooter from '../components/layout/PageFooter'
import FormField from '../components/ui/FormField'
import SelectField from '../components/ui/SelectField'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import VenueProgressSidebar from '../components/ui/VenueProgressSidebar'

const FOOTER_LINKS = [
  { label: 'About Us', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Partner Program', href: '#' },
]

function FormSection({ icon, title, children }) {
  return (
    <section className="bg-white border border-outline-variant/50 rounded-xl p-6 shadow-sm transition-shadow">
      <div className="flex items-center mb-5">
        <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center mr-3">
          <Icon name={icon} className="text-primary-container text-[18px]" />
        </div>
        <h2 className="font-title-lg text-[15px] text-primary">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function AddVenuePage() {
  return (
    <div className="flex h-screen w-full bg-background text-on-surface font-body-md overflow-hidden">
      <ProviderSidebar activeLabel="My Venues" />

      <main className="flex-1 md:ml-52 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-5 md:px-6 bg-white border-b border-outline-variant/30 shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/provider/dashboard" className="p-1.5 hover:bg-surface-container rounded-full transition-colors">
              <Icon name="arrow_back" className="text-primary" />
            </Link>
            <h1 className="font-headline-sm text-[18px] text-primary">Add New Venue</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" fullWidth={false} className="border-primary px-5 py-2 hover:bg-primary/5">
              Save Draft
            </Button>
            <Button variant="primary" fullWidth={false} className="px-5 py-2">
              Publish Venue
            </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-6 flex gap-5">
            {/* Left Column: Form */}
            <div className="flex-1 space-y-5">
              <FormSection icon="info" title="Section 1: Venue Details">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    className="col-span-2"
                    label="Venue Name"
                    type="text"
                    placeholder="e.g. Grand Emerald Marquee"
                  />
                  <SelectField label="Venue Type" defaultValue="Banquet Hall">
                    <option>Banquet Hall</option>
                    <option>Outdoor Lawn</option>
                    <option>Hotel Ballroom</option>
                    <option>Farmhouse</option>
                    <option>Other</option>
                  </SelectField>
                  <FormField label="Max Capacity (Guests)" type="number" placeholder="e.g. 500" />
                </div>
              </FormSection>

              <FormSection icon="location_on" title="Section 2: Location">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    className="col-span-2"
                    label="Google Maps Link"
                    type="url"
                    placeholder="Paste your venue's Google Maps link here"
                  />
                  <FormField
                    className="col-span-2"
                    label="Area Name"
                    type="text"
                    placeholder="e.g. Gulberg, Nazimabad, DHA Phase 6"
                  />
                </div>
              </FormSection>

              <FormSection icon="payments" title="Section 3: Pricing">
                <FormField label="Price (PKR)" prefix="Rs." type="number" placeholder="250,000" />
              </FormSection>

              <FormSection icon="photo_library" title="Section 4: Photos">
                <div className="border-2 border-dashed border-outline-variant hover:border-secondary transition-colors rounded-xl p-8 text-center bg-background group cursor-pointer">
                  <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-variant group-hover:bg-secondary-container transition-colors">
                    <Icon name="cloud_upload" className="text-primary text-[22px]" />
                  </div>
                  <h3 className="text-primary font-bold text-[15px] mb-1">
                    Click to upload or drag and drop
                  </h3>
                  <p className="text-on-surface-variant text-[13px] mb-4">
                    High resolution photos make your venue stand out (Max 10 photos, JPG or PNG)
                  </p>
                  <Button variant="gold" fullWidth={false} className="px-6 py-2">
                    Select Files
                  </Button>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-3">
                  <div className="aspect-video bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center text-outline text-[11px] italic">
                    No photos yet
                  </div>
                </div>
              </FormSection>
            </div>

            {/* Right Column: Progress */}
            <VenueProgressSidebar currentStep={1} />
          </div>

          <PageFooter links={FOOTER_LINKS} />
        </div>
      </main>
    </div>
  )
}

export default AddVenuePage
