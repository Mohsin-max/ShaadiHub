import { useState } from 'react'
import Icon from './Icon'

function TagInput({ label, tags, onChange, placeholder = 'Type and press Enter to add' }) {
  const [draft, setDraft] = useState('')

  const addTag = () => {
    const value = draft.trim()
    if (value && !tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      onChange([...tags, value])
    }
    setDraft('')
  }

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 rounded-lg border border-outline-variant text-primary text-[13px] font-semibold hover:bg-surface-container transition-colors"
        >
          Add
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container text-[12px] font-semibold px-3 py-1.5 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Remove ${tag}`}
              >
                <Icon name="close" className="text-[14px]" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagInput
