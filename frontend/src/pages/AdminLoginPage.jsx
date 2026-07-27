import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import ErrorBanner from '../components/ui/ErrorBanner'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'

function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, logout } = useAuth()
  const navigate = useNavigate()

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(form)
      if (result.role !== 'Admin') {
        logout()
        setError('This portal is for administrators only.')
        return
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center mb-3">
            <Icon name="shield_person" className="text-secondary-fixed text-[22px]" />
          </div>
          <h1 className="font-headline-sm text-[19px] text-primary">Admin Login</h1>
          <p className="text-[12px] text-on-surface-variant mt-1">ShaadiHub platform administration</p>
        </div>

        <ErrorBanner message={error} />

        <form className="space-y-3 mt-2" onSubmit={handleSubmit}>
          <FormField
            label="Email Address"
            type="email"
            placeholder="admin@shaadihub.pk"
            required
            value={form.email}
            onChange={updateField('email')}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={updateField('password')}
          />

          <Button type="submit" variant="primary" className="mt-2" disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
