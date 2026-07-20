function PublicFooter() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant py-8">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="space-y-2">
          <span className="font-display-lg text-[18px] text-primary font-bold">ShaadiHub</span>
          <p className="text-on-surface-variant text-body-sm leading-relaxed">
            Bridging Traditions with Excellence. Pakistan's most trusted platform for
            high-end wedding planning and venue management.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-1.5 text-body-sm text-on-surface-variant">
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
          <h4 className="font-bold text-primary mb-3 text-sm">Legal</h4>
          <ul className="space-y-1.5 text-body-sm text-on-surface-variant">
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
          <h4 className="font-bold text-primary mb-3 text-sm">Contact</h4>
          <ul className="space-y-1.5 text-body-sm text-on-surface-variant">
            <li>support@shaadihub.pk</li>
            <li>+92 21 3584 1029</li>
            <li>DHA Phase 6, Karachi, PK</li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop mt-6 pt-5 border-t border-outline-variant/30 text-center text-body-sm text-on-surface-variant/60">
        © 2026 ShaadiHub. All rights reserved.
      </div>
    </footer>
  )
}

export default PublicFooter
