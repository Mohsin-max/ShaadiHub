import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { roleHome } from '../../utils/roleHome'

function RootRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? roleHome(user.role) : '/signup'} replace />
}

export default RootRedirect
