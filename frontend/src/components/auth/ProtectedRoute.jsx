import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { roleHome } from '../../utils/roleHome'

function ProtectedRoute({ allowedRoles, children, loginPath = '/login' }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={loginPath} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />
  }

  return children
}

export default ProtectedRoute
