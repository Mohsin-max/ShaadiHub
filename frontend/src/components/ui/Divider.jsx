function Divider({ label }) {
  return (
    <div className="relative py-2.5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-outline-variant" />
      </div>
      <div className="relative flex justify-center text-body-sm">
        <span className="bg-surface-container-lowest px-3 text-on-surface-variant">
          {label}
        </span>
      </div>
    </div>
  )
}

export default Divider
