import { useState } from 'react'
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

function SignupPage() {
  const [activeForm, setActiveForm] = useState('client')

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
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
            onClick={() => setActiveForm('client')}
            className={`relative z-10 flex-1 py-2 font-title-lg text-body-sm transition-colors duration-300 ${
              activeForm === 'client' ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setActiveForm('provider')}
            className={`relative z-10 flex-1 py-2 font-title-lg text-body-sm transition-colors duration-300 ${
              activeForm === 'provider' ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            Venue Provider
          </button>
        </div>

        {activeForm === 'client' ? (
          <form className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" type="text" placeholder="Zia" />
              <FormField label="Last Name" type="text" placeholder="Khan" />
            </div>
            <FormField label="Email Address" type="email" placeholder="zia.khan@example.com" />
            <FormField label="Password" type="password" placeholder="••••••••" />

            <Button type="submit" variant="primary" className="mt-3">
              Create Client Account
            </Button>

            <Divider label="Or continue with" />

            <GoogleButton />
          </form>
        ) : (
          <form className="space-y-3">
            <FormField label="Full Name" type="text" placeholder="Ahmed Khan" />
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Email" type="email" placeholder="ahmed@royalpalms.pk" />
              <FormField label="Phone Number" type="tel" placeholder="+92 300 1234567" />
            </div>
            <FormField label="Create Password" type="password" placeholder="••••••••" />

            <Button type="submit" variant="gold" className="mt-3">
              Register as Provider
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
