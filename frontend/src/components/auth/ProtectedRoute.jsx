import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLE_HOME = {
  Client: '/venues',
  VenueOwner: '/provider/dashboard',
  Admin: '/venues',
}

function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || '/venues'} replace />
  }

  return children
}

export default ProtectedRoute
