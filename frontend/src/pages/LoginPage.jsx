import { Link } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import PublicFooter from '../components/layout/PublicFooter'
import AuthLayout from '../components/layout/AuthLayout'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import GoogleButton from '../components/ui/GoogleButton'
import Divider from '../components/ui/Divider'
import Icon from '../components/ui/Icon'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAwvZpBFL9aDvrLFc-VZZPbPGrm2ZDLpS-0vf4zUj2g3IgqTBPSPZ1uBZLfLdAyEjBBqfncOHrjLmlfr43kddRxZDPcBsrB6NQsNmh0Itoyjdg5oXZjfWeT3AWp1S3lSBopIqbTqluHBztnq30JWEGh57u5DolAeMyD3X7rf1GIIbzfC47HwCPEETL59Fea7k4Z7J-4E5GroXCiloFAUfqJpZT9YhRUqEKCeISXpcZbvTqix2Y7kPOy2YCI5Lh5MAotGvO1VH_nbwY'

function LoginPage() {
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

        <form className="space-y-3">
          <FormField label="Email Address" type="email" placeholder="zia.khan@example.com" />

          <div className="space-y-1">
            <FormField label="Password" type="password" placeholder="••••••••" />
            <div className="text-right pt-1">
              <a
                href="#"
                className="text-body-sm text-primary font-semibold hover:text-secondary transition-colors"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-3">
            Sign In
          </Button>

          <Divider label="Or continue with" />

          <GoogleButton />
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
