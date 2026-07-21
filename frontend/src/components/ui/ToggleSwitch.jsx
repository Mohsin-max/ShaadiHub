function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <label
      className="flex items-start gap-3 cursor-pointer select-none"
      onClick={(e) => {
        e.preventDefault()
        onChange(!checked)
      }}
    >
      <span
        role="switch"
        aria-checked={checked}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors mt-0.5 ${
          checked ? 'bg-primary' : 'bg-outline-variant'
        }`}
      >
        <span
          className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
      {(label || description) && (
        <span>
          {label && <span className="block text-[13px] font-bold text-primary">{label}</span>}
          {description && (
            <span className="block text-[11px] text-on-surface-variant mt-0.5">{description}</span>
          )}
        </span>
      )}
    </label>
  )
}

export default ToggleSwitch
