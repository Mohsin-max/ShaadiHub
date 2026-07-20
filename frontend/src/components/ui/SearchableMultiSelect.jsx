import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

function SearchableMultiSelect({ options, selected, onToggle, placeholder = 'Search…' }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const filteredOptions = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Icon
          name="search"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[15px] pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={selected.length > 0 ? `${selected.length} selected` : placeholder}
          className="w-full pl-8 pr-3 py-2 bg-white border border-outline-variant rounded-lg text-[12px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant"
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-[11px] font-semibold px-2 py-1 rounded-full"
            >
              {value}
              <button
                type="button"
                onClick={() => onToggle(value)}
                aria-label={`Remove ${value}`}
                className="hover:opacity-70 transition-opacity"
              >
                <Icon name="close" className="text-[12px]" />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-outline-variant rounded-lg shadow-lg py-1">
          {filteredOptions.length === 0 ? (
            <p className="px-3 py-2 text-[12px] text-on-surface-variant italic">No matches</p>
          ) : (
            filteredOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-surface-container-low"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onToggle(option)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-[13px] text-on-surface-variant">{option}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SearchableMultiSelect
