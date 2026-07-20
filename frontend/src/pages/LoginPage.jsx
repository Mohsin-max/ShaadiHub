import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import PublicFooter from '../components/layout/PublicFooter'
import AuthLayout from '../components/layout/AuthLayout'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import GoogleButton from '../components/ui/GoogleButton'
import Divider from '../components/ui/Divider'
import Icon from '../components/ui/Icon'
import ErrorBanner from '../components/ui/ErrorBanner'
import { useAuth } from '../context/AuthContext'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAwvZpBFL9aDvrLFc-VZZPbPGrm2ZDLpS-0vf4zUj2g3IgqTBPSPZ1uBZLfLdAyEjBBqfncOHrjLmlfr43kddRxZDPcBsrB6NQsNmh0Itoyjdg5oXZjfWeT3AWp1S3lSBopIqbTqluHBztnq30JWEGh57u5DolAeMyD3X7rf1GIIbzfC47HwCPEETL59Fea7k4Z7J-4E5GroXCiloFAUfqJpZT9YhRUqEKCeISXpcZbvTqix2Y7kPOy2YCI5Lh5MAotGvO1VH_nbwY'

const ROLE_REDIRECT = {
  Client: '/venues',
  VenueOwner: '/provider/dashboard',
  Admin: '/venues',
}

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(form)
      navigate(ROLE_REDIRECT[result.role] || '/venues')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <PublicHeader />

      <AuthLayout
        imageUrl={HERO_IMAGE}
        imageAlt="A luxurious Pakistani wedding venue scene during a sunset golden hour, with marigolds, white roses, and plum and antique-gold draped silk fabrics."
        headline="Welcome Back to Your Journey."
        bodyText="Your dream venues, negotiations, and bookings are right where you left them. Sign in to pick up exactly where you left off."
      >
        <div className="mb-5">
          <h1 className="font-display-lg text-[22px] leading-tight text-primary mb-1">Sign In</h1>
          <p className="text-on-surface-variant text-body-sm">
            Welcome back — enter your details to continue.
          </p>
        </div>

        <ErrorBanner message={error} />

        <form className="space-y-3 mt-3" onSubmit={handleSubmit}>
          <FormField
            label="Email Address"
            type="email"
            placeholder="zia.khan@example.com"
            required
            value={form.email}
            onChange={updateField('email')}
          />

          <div className="space-y-1">
            <FormField
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={updateField('password')}
            />
            <div className="text-right pt-1">
              <a
                href="#"
                className="text-body-sm text-primary font-semibold hover:text-secondary transition-colors"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </Button>

          <Divider label="Or continue with" />

          <GoogleButton type="button" disabled />
        </form>

        <p className="mt-5 text-center text-body-sm text-on-surface-variant">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:text-secondary transition-colors">
            Sign Up
          </Link>
        </p>

        <p className="mt-3 text-center text-body-sm text-on-surface-variant">
          Protected by ShaadiHub Secure Protocol.{' '}
          <Icon name="lock" className="align-middle text-[14px]" />
        </p>
      </AuthLayout>

      <PublicFooter />
    </div>
  )
}

export default LoginPage
