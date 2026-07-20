function DashboardFooter() {
  return (
    <footer className="w-full px-6 md:px-8 py-8 max-w-[1280px] mx-auto border-t border-outline-variant mt-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-6">
        <div className="col-span-1 md:col-span-2">
          <span className="font-display-lg-mobile text-[20px] font-bold text-primary mb-3 block">
            ShaadiHub
          </span>
          <p className="text-on-surface-variant max-w-xs text-sm">
            Bridging traditions with excellence. The premier platform for elite wedding
            services in Pakistan.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-primary mb-3 text-sm">Quick Links</h5>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Partner Program
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-primary mb-3 text-sm">Contact</h5>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>support@shaadihub.com</li>
            <li>+92 (300) 123-4567</li>
            <li>Karachi, Pakistan</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-outline-variant/30 text-on-surface-variant text-xs">
        <span>© 2026 ShaadiHub. Bridging Traditions with Excellence.</span>
        <div className="flex gap-6 mt-3 md:mt-0">
          <a className="hover:text-primary" href="#">
            About Us
          </a>
          <a className="hover:text-primary" href="#">
            Careers
          </a>
          <a className="hover:text-primary" href="#">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  )
}

export default DashboardFooter
