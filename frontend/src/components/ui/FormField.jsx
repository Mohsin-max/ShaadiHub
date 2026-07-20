function FormField({ label, className = '', ...inputProps }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block font-bold text-[12px] text-primary uppercase tracking-wider">
        {label}
      </label>
      <input
        className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant"
        {...inputProps}
      />
    </div>
  )
}

export default FormField
