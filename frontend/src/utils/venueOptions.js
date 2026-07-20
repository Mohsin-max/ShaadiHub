export const VENUE_TYPES = [
  'Banquet Hall',
  'Marquee / Lawn',
  'Ballroom',
  'Hotel',
  'Farmhouse',
  'Rooftop',
  'Community Hall',
  'Other',
]

export const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
]

// Best-effort local heuristic: scans the pasted Maps link/address text for a known
// city name. Not a real geocoding lookup — the City field stays manually editable
// so the provider can correct or fill it in when detection doesn't find a match.
export function detectCityFromText(text) {
  if (!text) return null
  const normalized = decodeURIComponent(text).toLowerCase()
  return PAKISTANI_CITIES.find((city) => normalized.includes(city.toLowerCase())) || null
}
