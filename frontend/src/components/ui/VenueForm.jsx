import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from './FormField'
import SelectField from './SelectField'
import TagInput from './TagInput'
import ToggleSwitch from './ToggleSwitch'
import Button from './Button'
import Icon from './Icon'
import ErrorBanner from './ErrorBanner'
import VenueProgressSidebar from './VenueProgressSidebar'
import PageFooter from '../layout/PageFooter'
import { VENUE_TYPES, PAKISTANI_CITIES, detectCityFromText } from '../../utils/venueOptions'
import { listVenues } from '../../utils/api'

const FOOTER_LINKS = [
  { label: 'About Us', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Partner Program', href: '#' },
]

const MIN_PHOTOS = 4
const MIN_NAME_LENGTH = 3

function FormSection({ number, icon, title, subtitle, children }) {
  return (
    <section className="bg-white border border-outline-variant/50 rounded-xl p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-5">
        <div className="relative w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center mr-3 shrink-0">
          <Icon name={icon} className="text-primary-container text-[18px]" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-antique-gold text-primary text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
            {number}
          </span>
        </div>
        <div>
          <h2 className="font-title-lg text-[15px] text-primary leading-tight">{title}</h2>
          {subtitle && <p className="text-[11px] text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
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
  catering: 'Internal',
  parkingSpaces: '',
  refundPolicy: 'Non-Refundable',
  specialEntryEnabled: false,
  specialEntryPrice: '',
  specialEntryDescription: '',
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
  const [form, setForm] = useState({ ...EMPTY_VENUE_FORM, ...initialValues })
  const [amenities, setAmenities] = useState(initialAmenities)
  const [existingImages, setExistingImages] = useState(initialImages)
  const [removedImageIds, setRemovedImageIds] = useState([])
  const [photos, setPhotos] = useState([])
  const [cityAutoDetected, setCityAutoDetected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [areaSuggestions, setAreaSuggestions] = useState([])
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false)
  const areaFieldRef = useRef(null)

  useEffect(() => {
    if (!form.city) {
      setAreaSuggestions([])
      return
    }
    let cancelled = false
    listVenues({ city: [form.city] })
      .then((venues) => {
        if (cancelled) return
        setAreaSuggestions([...new Set(venues.map((v) => v.areaName))].sort())
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [form.city])

  useEffect(() => {
    if (!areaDropdownOpen) return
    const handleClickOutside = (e) => {
      if (areaFieldRef.current && !areaFieldRef.current.contains(e.target)) {
        setAreaDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [areaDropdownOpen])

  const filteredAreaSuggestions = areaSuggestions.filter((a) =>
    a.toLowerCase().includes(form.areaName.trim().toLowerCase()),
  )

  const selectAreaSuggestion = (area) => {
    setForm((prev) => ({ ...prev, areaName: area }))
    setAreaDropdownOpen(false)
  }

  const totalPhotos = existingImages.length + photos.length
  const nameValid = form.name.trim().length >= MIN_NAME_LENGTH
  const specialEntryValid = !form.specialEntryEnabled || Boolean(form.specialEntryPrice && form.specialEntryDescription.trim())

  const sectionsComplete = [
    Boolean(nameValid && form.type && form.capacity),
    Boolean(form.googleMapsLink && form.areaName && form.city),
    Boolean(form.price),
    Boolean(form.catering && form.refundPolicy && specialEntryValid),
    amenities.length > 0,
    totalPhotos >= MIN_PHOTOS,
  ]

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

  const validate = () => {
    if (!nameValid) {
      return `Venue name must be at least ${MIN_NAME_LENGTH} characters.`
    }
    if (totalPhotos < MIN_PHOTOS) {
      return `Please add at least ${MIN_PHOTOS} photos of the venue (currently ${totalPhotos}).`
    }
    if (form.specialEntryEnabled && !specialEntryValid) {
      return 'Special Entry is on — please add its charges and a short description, or turn it off.'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
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
        <form className="max-w-6xl mx-auto px-5 md:px-6 py-6 flex gap-6" onSubmit={handleSubmit}>
          {/* Left Column: Form */}
          <div className="flex-1 min-w-0 space-y-5">
            <ErrorBanner message={error} />

            <FormSection number={1} icon="info" title="Venue Details" subtitle="What guests will see first">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField
                    label="Venue Name"
                    type="text"
                    placeholder="e.g. Grand Emerald Marquee"
                    required
                    value={form.name}
                    onChange={updateField('name')}
                  />
                  <p className={`text-[11px] mt-1 ${form.name.length === 0 ? 'text-on-surface-variant' : nameValid ? 'text-secondary' : 'text-error'}`}>
                    {form.name.length === 0
                      ? `Minimum ${MIN_NAME_LENGTH} characters`
                      : nameValid
                        ? 'Looks good'
                        : `Needs at least ${MIN_NAME_LENGTH} characters (${form.name.trim().length}/${MIN_NAME_LENGTH})`}
                  </p>
                </div>
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

            <FormSection number={2} icon="location_on" title="Location" subtitle="Help clients find you">
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
                <div className="relative" ref={areaFieldRef}>
                  <FormField
                    label="Area Name"
                    type="text"
                    placeholder="e.g. Gulberg, Nazimabad, DHA Phase 6"
                    required
                    autoComplete="off"
                    value={form.areaName}
                    onChange={updateField('areaName')}
                    onFocus={() => setAreaDropdownOpen(true)}
                  />
                  {areaDropdownOpen && filteredAreaSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-outline-variant rounded-lg shadow-lg py-1">
                      {filteredAreaSuggestions.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => selectAreaSuggestion(area)}
                          className="w-full text-left px-3.5 py-2 text-[13px] text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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

            <FormSection number={3} icon="payments" title="Pricing" subtitle="Your base rates in PKR">
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

            <FormSection number={4} icon="settings_suggest" title="Facilities & Policies" subtitle="Catering, parking, refunds & add-ons">
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Catering" value={form.catering} onChange={updateField('catering')}>
                  <option value="Internal">Provided by Venue (Internal)</option>
                  <option value="External">Bring Your Own (External)</option>
                  <option value="Both">Both Allowed</option>
                </SelectField>
                <FormField
                  label="Parking Capacity (Vehicles)"
                  type="number"
                  placeholder="e.g. 100 — optional"
                  min={0}
                  value={form.parkingSpaces}
                  onChange={updateField('parkingSpaces')}
                />
                <SelectField label="Refund Policy" value={form.refundPolicy} onChange={updateField('refundPolicy')}>
                  <option value="Non-Refundable">Non-Refundable</option>
                  <option value="Refundable">Refundable</option>
                </SelectField>
              </div>

              <div className="mt-5 pt-5 border-t border-outline-variant/50">
                <ToggleSwitch
                  checked={form.specialEntryEnabled}
                  onChange={(checked) => setForm((prev) => ({ ...prev, specialEntryEnabled: checked }))}
                  label="Special Entry Option"
                  description="Offer an optional premium/grand entry add-on that clients can select at extra cost."
                />

                {form.specialEntryEnabled && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pl-14">
                    <FormField
                      label="Special Entry Charges (PKR)"
                      prefix="Rs."
                      type="number"
                      placeholder="e.g. 25,000"
                      min={0}
                      required
                      value={form.specialEntryPrice}
                      onChange={updateField('specialEntryPrice')}
                    />
                    <div className="col-span-2 space-y-1">
                      <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
                        Special Entry Description
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={form.specialEntryDescription}
                        onChange={updateField('specialEntryDescription')}
                        placeholder="Describe what's included, e.g. dhol, fireworks, decorated entrance walk..."
                        className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection number={5} icon="sell" title="Amenities" subtitle="What's included with a booking">
              <TagInput
                tags={amenities}
                onChange={setAmenities}
                placeholder="e.g. Parking, Catering, AC — press Enter to add"
              />
            </FormSection>

            <FormSection number={6} icon="photo_library" title="Photos" subtitle={`At least ${MIN_PHOTOS} high-quality photos required`}>
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

              <div className="flex items-center justify-between mt-4 mb-1">
                <p className="text-[12px] font-semibold text-on-surface-variant">Uploaded photos</p>
                <p className={`text-[12px] font-bold ${totalPhotos >= MIN_PHOTOS ? 'text-secondary' : 'text-error'}`}>
                  {totalPhotos} / {MIN_PHOTOS} minimum
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {existingImages.length === 0 && photos.length === 0 ? (
                  <div className="col-span-4 aspect-[16/5] bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center text-outline text-[11px] italic">
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
          <VenueProgressSidebar sectionsComplete={sectionsComplete} />
        </form>

        <PageFooter links={FOOTER_LINKS} />
      </div>
    </main>
  )
}

export default VenueForm
