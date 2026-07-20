import { Navigate, Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProviderDashboardPage from './pages/ProviderDashboardPage'
import AddVenuePage from './pages/AddVenuePage'
import BrowseVenuesPage from './pages/BrowseVenuesPage'
import FavoritesPage from './pages/FavoritesPage'
import VenueDetailPage from './pages/VenueDetailPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute allowedRoles={['VenueOwner']}>
            <ProviderDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/venues/new"
        element={
          <ProtectedRoute allowedRoles={['VenueOwner']}>
            <AddVenuePage />
          </ProtectedRoute>
        }
      />
      <Route path="/venues" element={<BrowseVenuesPage />} />
      <Route path="/venues/:id" element={<VenueDetailPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  )
}

export default App
