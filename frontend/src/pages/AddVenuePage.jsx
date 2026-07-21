import { useNavigate } from 'react-router-dom'
import ProviderSidebar from '../components/layout/ProviderSidebar'
import VenueForm from '../components/ui/VenueForm'
import { useAuth } from '../context/AuthContext'
import { createVenue } from '../utils/api'

function AddVenuePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async ({ form, amenities, newPhotos }) => {
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

    const venue = await createVenue(formData, user?.token)
    navigate(`/venues/${venue.id}`)
  }

  return (
    <div className="flex h-screen w-full bg-background text-on-surface font-body-md overflow-hidden">
      <ProviderSidebar activeLabel="Dashboard" />
      <VenueForm
        title="Add New Venue"
        submitLabel="Publish Venue"
        loadingLabel="Publishing…"
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default AddVenuePage
