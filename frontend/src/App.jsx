import { Navigate, Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProviderDashboardPage from './pages/ProviderDashboardPage'
import AddVenuePage from './pages/AddVenuePage'
import BrowseVenuesPage from './pages/BrowseVenuesPage'
import FavoritesPage from './pages/FavoritesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/provider/dashboard" element={<ProviderDashboardPage />} />
      <Route path="/provider/venues/new" element={<AddVenuePage />} />
      <Route path="/venues" element={<BrowseVenuesPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  )
}

export default App
