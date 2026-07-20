function FormField({ label, prefix, className = '', inputClassName = '', ...inputProps }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-[14px] pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          className={`w-full ${prefix ? 'pl-10' : 'px-3.5'} pr-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant ${inputClassName}`}
          {...inputProps}
        />
      </div>
    </div>
  )
}

export default FormField
