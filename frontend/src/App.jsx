import { Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProviderDashboardPage from './pages/ProviderDashboardPage'
import AddVenuePage from './pages/AddVenuePage'
import EditVenuePage from './pages/EditVenuePage'
import BrowseVenuesPage from './pages/BrowseVenuesPage'
import FavoritesPage from './pages/FavoritesPage'
import VenueDetailPage from './pages/VenueDetailPage'
import ClientRequestsPage from './pages/ClientRequestsPage'
import ClientRequestDetailPage from './pages/ClientRequestDetailPage'
import ProviderInquiriesPage from './pages/ProviderInquiriesPage'
import ProviderInquiryDetailPage from './pages/ProviderInquiryDetailPage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminVenueOwnersPage from './pages/AdminVenueOwnersPage'
import AdminClientsPage from './pages/AdminClientsPage'
import AdminVenuesPage from './pages/AdminVenuesPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RootRedirect from './components/auth/RootRedirect'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
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
      <Route
        path="/provider/venues/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['VenueOwner']}>
            <EditVenuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/inquiries"
        element={
          <ProtectedRoute allowedRoles={['VenueOwner']}>
            <ProviderInquiriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/inquiries/:id"
        element={
          <ProtectedRoute allowedRoles={['VenueOwner']}>
            <ProviderInquiryDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="/venues" element={<BrowseVenuesPage />} />
      <Route path="/venues/:id" element={<VenueDetailPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute allowedRoles={['Client']}>
            <ClientRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests/:id"
        element={
          <ProtectedRoute allowedRoles={['Client']}>
            <ClientRequestDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/settings"
        element={
          <ProtectedRoute allowedRoles={['Client', 'VenueOwner']}>
            <AccountSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Admin']} loginPath="/admin/login">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/venue-owners"
        element={
          <ProtectedRoute allowedRoles={['Admin']} loginPath="/admin/login">
            <AdminVenueOwnersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute allowedRoles={['Admin']} loginPath="/admin/login">
            <AdminClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/venues"
        element={
          <ProtectedRoute allowedRoles={['Admin']} loginPath="/admin/login">
            <AdminVenuesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
