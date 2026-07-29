import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { roleHome } from '../../utils/roleHome'
import LandingPage from '../../pages/LandingPage'

function RootRedirect() {
  const { user } = useAuth()
  if (user) {
    return <Navigate to={roleHome(user.role)} replace />
  }
  return <LandingPage />
}

export default RootRedirect
