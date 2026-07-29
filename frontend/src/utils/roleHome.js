export const ROLE_HOME = {
  Client: '/venues',
  VenueOwner: '/provider/dashboard',
  Admin: '/admin/dashboard',
}

export function roleHome(role) {
  return ROLE_HOME[role] || '/venues'
}
