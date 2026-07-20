import Icon from './Icon'

function Pagination({ currentPage = 1, totalPages = 3 }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="mt-8 flex justify-center items-center gap-3">
      <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all">
        <Icon name="chevron_left" className="text-[18px]" />
      </button>
      <div className="flex gap-1.5">
        {pages.map((page) => (
          <button
            key={page}
            className={`h-9 w-9 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-all ${
              page === currentPage
                ? 'bg-primary text-on-primary'
                : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all">
        <Icon name="chevron_right" className="text-[18px]" />
      </button>
    </div>
  )
}

export default Pagination
