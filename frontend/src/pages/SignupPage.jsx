import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
}

function SignupPage() {
  const [activeForm, setActiveForm] = useState('client')
  const [clientForm, setClientForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [providerForm, setProviderForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signupClient, signupProvider } = useAuth()
  const navigate = useNavigate()

  const updateClientField = (field) => (e) =>
    setClientForm((prev) => ({ ...prev, [field]: e.target.value }))
  const updateProviderField = (field) => (e) =>
    setProviderForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleClientSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signupClient(clientForm)
      navigate(ROLE_REDIRECT[result.role] || '/venues')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProviderSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signupProvider(providerForm)
      navigate(ROLE_REDIRECT[result.role] || '/provider/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col w-full">
      <PublicHeader />

      <AuthLayout
        imageUrl={HERO_IMAGE}
        imageAlt="A luxurious Pakistani wedding venue scene during a sunset golden hour, with marigolds, white roses, and plum and antique-gold draped silk fabrics."
        headline="Crafting Moments of Forever."
        bodyText="Join Pakistan's premier wedding ecosystem where traditions meet technical precision. Whether you're planning your dream day or hosting it, we bridge the gap with excellence."
      >
        <div className="mb-5">
          <h1 className="font-display-lg text-[22px] leading-tight text-primary mb-1">
            Create Your Account
          </h1>
          <p className="text-on-surface-variant text-body-sm">
            Choose your path to begin your journey with us.
          </p>
        </div>

        {/* Toggle */}
        <div className="relative bg-surface-container-low p-1 rounded-lg flex mb-5 border border-outline-variant/30">
          <div
            className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] top-1 left-1 bg-antique-gold rounded-md transition-transform duration-300 ease-in-out ${
              activeForm === 'provider' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          <button
            type="button"
            onClick={() => {
              setActiveForm('client')
              setError('')
            }}
            className={`relative z-10 flex-1 py-2 font-title-lg text-body-sm transition-colors duration-300 ${
              activeForm === 'client' ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveForm('provider')
              setError('')
            }}
            className={`relative z-10 flex-1 py-2 font-title-lg text-body-sm transition-colors duration-300 ${
              activeForm === 'provider' ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            Venue Provider
          </button>
        </div>

        <ErrorBanner message={error} />

        {activeForm === 'client' ? (
          <form className="space-y-3 mt-3" onSubmit={handleClientSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="First Name"
                type="text"
                placeholder="Zia"
                required
                value={clientForm.firstName}
                onChange={updateClientField('firstName')}
              />
              <FormField
                label="Last Name"
                type="text"
                placeholder="Khan"
                required
                value={clientForm.lastName}
                onChange={updateClientField('lastName')}
              />
            </div>
            <FormField
              label="Email Address"
              type="email"
              placeholder="zia.khan@example.com"
              required
              value={clientForm.email}
              onChange={updateClientField('email')}
            />
            <FormField
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              value={clientForm.password}
              onChange={updateClientField('password')}
            />

            <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Client Account'}
            </Button>

            <Divider label="Or continue with" />

            <GoogleButton type="button" disabled />
          </form>
        ) : (
          <form className="space-y-3 mt-3" onSubmit={handleProviderSubmit}>
            <FormField
              label="Full Name"
              type="text"
              placeholder="Ahmed Khan"
              required
              value={providerForm.name}
              onChange={updateProviderField('name')}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Email"
                type="email"
                placeholder="ahmed@royalpalms.pk"
                required
                value={providerForm.email}
                onChange={updateProviderField('email')}
              />
              <FormField
                label="Phone Number"
                type="tel"
                placeholder="+92 300 1234567"
                required
                value={providerForm.phone}
                onChange={updateProviderField('phone')}
              />
            </div>
            <FormField
              label="Create Password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              value={providerForm.password}
              onChange={updateProviderField('password')}
            />

            <Button type="submit" variant="gold" className="mt-3" disabled={loading}>
              {loading ? 'Registering…' : 'Register as Provider'}
            </Button>

            <p className="text-center text-body-sm text-on-surface-variant px-4 pt-2">
              By signing up, you agree to our{' '}
              <a className="underline font-semibold" href="#">
                Venue Terms of Service
              </a>{' '}
              and Privacy Policy.
            </p>
          </form>
        )}

        <p className="mt-5 text-center text-body-sm text-on-surface-variant">
          Protected by ShaadiHub Secure Protocol.{' '}
          <Icon name="lock" className="align-middle text-[14px]" />
        </p>
      </AuthLayout>

      <PublicFooter />
    </div>
  )
}

export default SignupPage
