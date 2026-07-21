import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from './FormField'
import SelectField from './SelectField'
import TagInput from './TagInput'
import Button from './Button'
import Icon from './Icon'
import ErrorBanner from './ErrorBanner'
import VenueProgressSidebar from './VenueProgressSidebar'
import PageFooter from '../layout/PageFooter'
import { VENUE_TYPES, PAKISTANI_CITIES, detectCityFromText } from '../../utils/venueOptions'

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

export const EMPTY_VENUE_FORM = {
  name: '',
  type: VENUE_TYPES[0],
  capacity: '',
  googleMapsLink: '',
  areaName: '',
  city: '',
  price: '',
  weekendPrice: '',
}

function VenueForm({
  title,
  backTo = '/provider/dashboard',
  submitLabel = 'Publish Venue',
  loadingLabel = 'Publishing…',
  initialValues = EMPTY_VENUE_FORM,
  initialAmenities = [],
  initialImages = [],
  onSubmit,
}) {
  const [form, setForm] = useState(initialValues)
  const [amenities, setAmenities] = useState(initialAmenities)
  const [existingImages, setExistingImages] = useState(initialImages)
  const [removedImageIds, setRemovedImageIds] = useState([])
  const [photos, setPhotos] = useState([])
  const [cityAutoDetected, setCityAutoDetected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sectionsComplete = [
    Boolean(form.name && form.type && form.capacity),
    Boolean(form.googleMapsLink && form.areaName && form.city),
    Boolean(form.price),
    amenities.length > 0,
    existingImages.length > 0 || photos.length > 0,
  ]
  const firstIncomplete = sectionsComplete.findIndex((done) => !done)
  const currentStep = firstIncomplete === -1 ? sectionsComplete.length : firstIncomplete

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleMapsLinkBlur = () => {
    if (form.city) return
    const detected = detectCityFromText(form.googleMapsLink)
    if (detected) {
      setForm((prev) => ({ ...prev, city: detected }))
      setCityAutoDetected(true)
    }
  }

  const handlePhotosSelected = (e) => {
    const files = Array.from(e.target.files || [])
    const withPreviews = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setPhotos((prev) => [...prev, ...withPreviews])
    e.target.value = ''
  }

  const removeNewPhoto = (index) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const removeExistingImage = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id))
    setRemovedImageIds((prev) => [...prev, id])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({
        form,
        amenities,
        newPhotos: photos.map((p) => p.file),
        removeImageIds: removedImageIds,
      })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 md:ml-52 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-5 md:px-6 bg-white border-b border-outline-variant/30 shrink-0">
        <div className="flex items-center gap-3">
          <Link to={backTo} className="p-1.5 hover:bg-surface-container rounded-full transition-colors">
            <Icon name="arrow_back" className="text-primary" />
          </Link>
          <h1 className="font-headline-sm text-[18px] text-primary">{title}</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            fullWidth={false}
            className="border-primary px-5 py-2 hover:bg-primary/5"
            disabled
          >
            Save Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth={false}
            className="px-5 py-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? loadingLabel : submitLabel}
          </Button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <form className="max-w-4xl mx-auto px-5 md:px-6 py-6 flex gap-5" onSubmit={handleSubmit}>
          {/* Left Column: Form */}
          <div className="flex-1 min-w-0 space-y-5">
            <ErrorBanner message={error} />

            <FormSection icon="info" title="Section 1: Venue Details">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  className="col-span-2"
                  label="Venue Name"
                  type="text"
                  placeholder="e.g. Grand Emerald Marquee"
                  required
                  value={form.name}
                  onChange={updateField('name')}
                />
                <SelectField label="Venue Type" value={form.type} onChange={updateField('type')}>
                  {VENUE_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </SelectField>
                <FormField
                  label="Max Capacity (Guests)"
                  type="number"
                  placeholder="e.g. 500"
                  required
                  min={1}
                  value={form.capacity}
                  onChange={updateField('capacity')}
                />
              </div>
            </FormSection>

            <FormSection icon="location_on" title="Section 2: Location">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  className="col-span-2"
                  label="Google Maps Link"
                  type="url"
                  placeholder="Paste your venue's Google Maps link here"
                  required
                  value={form.googleMapsLink}
                  onChange={updateField('googleMapsLink')}
                  onBlur={handleMapsLinkBlur}
                />
                <FormField
                  label="Area Name"
                  type="text"
                  placeholder="e.g. Gulberg, Nazimabad, DHA Phase 6"
                  required
                  value={form.areaName}
                  onChange={updateField('areaName')}
                />
                <div>
                  <SelectField
                    label="City"
                    value={form.city}
                    onChange={(e) => {
                      updateField('city')(e)
                      setCityAutoDetected(false)
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select city
                    </option>
                    {PAKISTANI_CITIES.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </SelectField>
                  {cityAutoDetected && (
                    <p className="text-[11px] text-secondary font-semibold mt-1">
                      Auto-detected from your Maps link — change it if that's wrong.
                    </p>
                  )}
                </div>
              </div>
            </FormSection>

            <FormSection icon="payments" title="Section 3: Pricing">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Price (PKR)"
                  prefix="Rs."
                  type="number"
                  placeholder="250,000"
                  required
                  min={0}
                  value={form.price}
                  onChange={updateField('price')}
                />
                <FormField
                  label="Weekend Price (PKR)"
                  prefix="Rs."
                  type="number"
                  placeholder="Optional — leave blank if same as base price"
                  min={0}
                  value={form.weekendPrice}
                  onChange={updateField('weekendPrice')}
                />
              </div>
            </FormSection>

            <FormSection icon="sell" title="Section 4: Amenities">
              <TagInput
                tags={amenities}
                onChange={setAmenities}
                placeholder="e.g. Parking, Catering, AC — press Enter to add"
              />
            </FormSection>

            <FormSection icon="photo_library" title="Section 5: Photos">
              <label className="block border-2 border-dashed border-outline-variant hover:border-secondary transition-colors rounded-xl p-8 text-center bg-background group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotosSelected}
                />
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-variant group-hover:bg-secondary-container transition-colors">
                  <Icon name="cloud_upload" className="text-primary text-[22px]" />
                </div>
                <h3 className="text-primary font-bold text-[15px] mb-1">Click to upload photos</h3>
                <p className="text-on-surface-variant text-[13px] mb-4">
                  High resolution photos make your venue stand out (JPG, PNG, or WebP)
                </p>
                <span className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-antique-gold text-primary font-bold text-[14px]">
                  Select Files
                </span>
              </label>

              <div className="mt-5 grid grid-cols-4 gap-3">
                {existingImages.length === 0 && photos.length === 0 ? (
                  <div className="aspect-video bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center text-outline text-[11px] italic">
                    No photos yet
                  </div>
                ) : (
                  <>
                    {existingImages.map((img) => (
                      <div
                        key={`existing-${img.id}`}
                        className="relative aspect-video rounded-lg overflow-hidden border border-outline-variant group"
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove photo"
                        >
                          <Icon name="close" className="text-[14px]" />
                        </button>
                      </div>
                    ))}
                    {photos.map((p, index) => (
                      <div
                        key={p.preview}
                        className="relative aspect-video rounded-lg overflow-hidden border border-outline-variant group"
                      >
                        <img src={p.preview} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-secondary text-on-secondary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                          New
                        </span>
                        <button
                          type="button"
                          onClick={() => removeNewPhoto(index)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove photo"
                        >
                          <Icon name="close" className="text-[14px]" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </FormSection>
          </div>

          {/* Right Column: Progress */}
          <VenueProgressSidebar currentStep={currentStep} />
        </form>

        <PageFooter links={FOOTER_LINKS} />
      </div>
    </main>
  )
}

export default VenueForm
