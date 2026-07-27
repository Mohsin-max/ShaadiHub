import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLE_HOME = {
  Client: '/venues',
  VenueOwner: '/provider/dashboard',
  Admin: '/admin/dashboard',
}

function ProtectedRoute({ allowedRoles, children, loginPath = '/login' }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={loginPath} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || '/venues'} replace />
  }

  return children
}

export default ProtectedRoute
