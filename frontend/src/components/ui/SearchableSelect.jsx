import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

function SearchableSelect({ options, value, onChange, placeholder = 'Search…' }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const filteredOptions = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))

  const handleSelect = (option) => {
    onChange(option)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Icon
          name="search"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[15px] pointer-events-none"
        />
        <input
          type="text"
          value={open ? search : value || ''}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            setOpen(true)
            setSearch('')
          }}
          placeholder={value || placeholder}
          className="w-full pl-8 pr-8 py-2 bg-white border border-outline-variant rounded-lg text-[12px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant"
        />
        {value && !open && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear city"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-error transition-colors"
          >
            <Icon name="close" className="text-[14px]" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-outline-variant rounded-lg shadow-lg py-1">
          {filteredOptions.length === 0 ? (
            <p className="px-3 py-2 text-[12px] text-on-surface-variant italic">No matches</p>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-3 py-2 text-[13px] transition-colors hover:bg-surface-container-low ${
                  value === option ? 'text-primary font-semibold bg-secondary-container/30' : 'text-on-surface-variant'
                }`}
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SearchableSelect
