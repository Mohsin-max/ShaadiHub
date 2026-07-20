function PublicFooter() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant py-12">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="space-y-4">
          <span className="font-display-lg text-display-lg-mobile text-primary font-bold">
            ShaadiHub
          </span>
          <p className="text-on-surface-variant text-body-sm leading-relaxed">
            Bridging Traditions with Excellence. Pakistan's most trusted platform for
            high-end wedding planning and venue management.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4">Quick Links</h4>
          <ul className="space-y-2 text-body-sm text-on-surface-variant">
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                About Us
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                How it Works
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Partner Program
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Sitemap
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4">Legal</h4>
          <ul className="space-y-2 text-body-sm text-on-surface-variant">
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
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4">Contact</h4>
          <ul className="space-y-2 text-body-sm text-on-surface-variant">
            <li>support@shaadihub.pk</li>
            <li>+92 21 3584 1029</li>
            <li>DHA Phase 6, Karachi, PK</li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop mt-12 pt-8 border-t border-outline-variant/30 text-center text-body-sm text-on-surface-variant/60">
        © 2026 ShaadiHub. All rights reserved.
      </div>
    </footer>
  )
}

export default PublicFooter
