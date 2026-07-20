function SelectField({ label, className = '', children, ...selectProps }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
        {label}
      </label>
      <select
        className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
        {...selectProps}
      >
        {children}
      </select>
    </div>
  )
}

export default SelectField
