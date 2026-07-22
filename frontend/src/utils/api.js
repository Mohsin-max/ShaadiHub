const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5114/api'

export function getHubUrl(hubPath) {
  return `${API_URL.replace(/\/api\/?$/, '')}${hubPath}`
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const message = data?.message || data?.title || 'Something went wrong. Please try again.'
    throw new Error(message)
  }

  return data
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function signupClient(payload) {
  return request('/auth/signup/client', { method: 'POST', body: JSON.stringify(payload) })
}

export function signupProvider(payload) {
  return request('/auth/signup/provider', { method: 'POST', body: JSON.stringify(payload) })
}

export function login(payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export function updatePhone(phone, token) {
  return request('/auth/phone', {
    method: 'PUT',
    body: JSON.stringify({ phone }),
    headers: authHeaders(token),
  })
}

export function createVenue(formData, token) {
  return request('/venues', { method: 'POST', body: formData, headers: authHeaders(token) })
}

export function listVenues({ city = [], area = [], type = [] } = {}) {
  const params = new URLSearchParams()
  city.forEach((c) => params.append('city', c))
  area.forEach((a) => params.append('area', a))
  type.forEach((t) => params.append('type', t))
  const query = params.toString()
  return request(`/venues${query ? `?${query}` : ''}`)
}

export function getVenue(id) {
  return request(`/venues/${id}`)
}

export function listMyVenues(token) {
  return request('/venues/mine', { headers: authHeaders(token) })
}

export function updateVenue(id, formData, token) {
  return request(`/venues/${id}`, { method: 'PUT', body: formData, headers: authHeaders(token) })
}

export function getBookedDates(venueId) {
  return request(`/venues/${venueId}/booked-dates`)
}

export function createBookingRequest(venueId, payload, token) {
  return request(`/venues/${venueId}/booking-requests`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  })
}

export function listMyBookingRequests(token) {
  return request('/booking-requests/mine', { headers: authHeaders(token) })
}

export function listReceivedBookingRequests(token) {
  return request('/booking-requests/received', { headers: authHeaders(token) })
}

export function getBookingNotificationCount(token) {
  return request('/booking-requests/notifications/count', { headers: authHeaders(token) })
}

export function getBookingRequest(id, token) {
  return request(`/booking-requests/${id}`, { headers: authHeaders(token) })
}

export function respondBookingRequest(id, payload, token) {
  return request(`/booking-requests/${id}/respond`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  })
}
