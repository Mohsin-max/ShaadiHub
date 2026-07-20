import Icon from '../ui/Icon'

function PageFooter({ links = [], social = false }) {
  return (
    <footer className="w-full px-5 md:px-6 py-6 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant">
      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center md:text-left">
        <span className="font-display-lg text-[16px] font-bold text-primary">ShaadiHub</span>
        <span className="text-body-sm text-on-surface-variant">
          © 2026 ShaadiHub. All rights reserved.
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-5">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      {social && (
        <div className="flex gap-3">
          <button className="w-7 h-7 flex items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:text-primary transition-all">
            <Icon name="public" className="text-[16px]" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:text-primary transition-all">
            <Icon name="mail" className="text-[16px]" />
          </button>
        </div>
      )}
    </footer>
  )
}

export default PageFooter
