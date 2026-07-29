import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientHeader from '../components/layout/ClientHeader'
import PageFooter from '../components/layout/PageFooter'
import ProviderSidebar from '../components/layout/ProviderSidebar'
import DashboardHeader from '../components/layout/DashboardHeader'
import MobileBottomNav from '../components/layout/MobileBottomNav'
import Icon from '../components/ui/Icon'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import ErrorBanner from '../components/ui/ErrorBanner'
import { useAuth } from '../context/AuthContext'

function AccountSettingsPage() {
  const { user, updatePhone, logout } = useAuth()
  const navigate = useNavigate()
  const isProvider = user?.role === 'VenueOwner'

  const [phone, setPhone] = useState(user?.phone || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    setLoading(true)
    try {
      await updatePhone(phone.trim())
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const content = (
    <>
      <div className="max-w-2xl mx-auto px-5 md:px-6 py-8 space-y-6">
          <div>
            <h1 className="font-headline-md text-[22px] text-primary">Account Settings</h1>
            <p className="text-[13px] text-on-surface-variant mt-0.5">
              Manage your profile details and contact information.
            </p>
          </div>

          <div className="bg-white border border-outline-variant rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon name="person" className="text-[28px]" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-primary">{user?.displayName}</p>
                <p className="text-[12px] text-on-surface-variant">
                  {user?.role === 'Client' ? 'Client Account' : user?.role === 'VenueOwner' ? 'Venue Owner Account' : 'Account'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
                  Email Address
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] text-on-surface-variant">
                  <Icon name="mail" className="text-[16px] shrink-0" />
                  {user?.email}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
                  Account Type
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] text-on-surface-variant">
                  <Icon name="verified_user" className="text-[16px] shrink-0" />
                  {user?.role}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <ErrorBanner message={error} />
              {saved && (
                <p className="flex items-center gap-1.5 text-[12px] font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-2">
                  <Icon name="check_circle" className="text-[15px]" />
                  Phone number updated.
                </p>
              )}
              <FormField
                label="Phone Number"
                type="tel"
                placeholder="03XX-XXXXXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setSaved(false)
                }}
              />
              <p className="text-[11px] text-on-surface-variant">
                Only shared with the other party once a booking is confirmed.
              </p>
              <Button type="submit" variant="primary" fullWidth={false} className="px-6" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </Button>
            </form>
          </div>

          <div className="bg-white border border-outline-variant rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-on-surface">Sign Out</p>
              <p className="text-[12px] text-on-surface-variant">End your current session on this device.</p>
            </div>
            <Button variant="outline" fullWidth={false} className="px-5" onClick={handleLogout}>
              <Icon name="logout" className="text-[16px]" />
              Logout
            </Button>
          </div>
        </div>
    </>
  )

  if (isProvider) {
    return (
      <div className="flex min-h-screen bg-background text-on-surface font-body-md">
        <ProviderSidebar activeLabel="Settings" />
        <main className="flex-1 md:ml-52 min-h-screen overflow-y-auto pb-16 md:pb-0">
          <DashboardHeader />
          {content}
        </main>
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <ClientHeader />
      <main className="pt-14 flex-1">{content}</main>
      <PageFooter />
    </div>
  )
}

export default AccountSettingsPage
