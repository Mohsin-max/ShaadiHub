import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProviderSidebar from '../components/layout/ProviderSidebar'
import VenueForm from '../components/ui/VenueForm'
import { useAuth } from '../context/AuthContext'
import { getVenue, updateVenue } from '../utils/api'

function EditVenuePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getVenue(id)
      .then(setVenue)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async ({ form, amenities, newPhotos, removeImageIds }) => {
    const formData = new FormData()
    formData.append('Name', form.name)
    formData.append('Type', form.type)
    formData.append('Capacity', form.capacity)
    formData.append('GoogleMapsLink', form.googleMapsLink)
    formData.append('AreaName', form.areaName)
    formData.append('City', form.city)
    formData.append('Price', form.price)
    if (form.weekendPrice) formData.append('WeekendPrice', form.weekendPrice)
    amenities.forEach((tag) => formData.append('Amenities', tag))
    newPhotos.forEach((file) => formData.append('Images', file))
    removeImageIds.forEach((imgId) => formData.append('RemoveImageIds', imgId))

    const updated = await updateVenue(id, formData, user?.token)
    navigate(`/venues/${updated.id}`)
  }

  return (
    <div className="flex h-screen w-full bg-background text-on-surface font-body-md overflow-hidden">
      <ProviderSidebar activeLabel="Dashboard" />

      {loading && (
        <main className="flex-1 md:ml-52 flex items-center justify-center text-on-surface-variant">
          Loading venue…
        </main>
      )}

      {!loading && (error || !venue) && (
        <main className="flex-1 md:ml-52 flex items-center justify-center text-on-surface-variant">
          {error || 'Venue not found.'}
        </main>
      )}

      {!loading && venue && (
        <VenueForm
          title="Edit Venue"
          submitLabel="Save Changes"
          loadingLabel="Saving…"
          initialValues={{
            name: venue.name,
            type: venue.type,
            capacity: String(venue.capacity),
            googleMapsLink: venue.googleMapsLink,
            areaName: venue.areaName,
            city: venue.city,
            price: String(venue.price),
            weekendPrice: venue.weekendPrice ? String(venue.weekendPrice) : '',
          }}
          initialAmenities={venue.amenities}
          initialImages={venue.images}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

export default EditVenuePage
