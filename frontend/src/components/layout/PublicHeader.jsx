import { Link } from 'react-router-dom'

function PublicHeader() {
  return (
    <header className="w-full h-20 flex items-center px-margin-mobile md:px-margin-desktop bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto w-full flex justify-between items-center">
        <Link to="/" className="font-display-lg text-headline-sm text-primary font-bold">
          ShaadiHub
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-on-surface-variant text-body-sm hidden sm:inline">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="text-primary font-bold hover:text-secondary transition-colors text-body-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}

export default PublicHeader
