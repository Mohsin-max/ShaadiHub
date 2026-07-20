function Divider({ label }) {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-outline-variant" />
      </div>
      <div className="relative flex justify-center text-body-sm">
        <span className="bg-surface-container-lowest px-4 text-on-surface-variant">
          {label}
        </span>
      </div>
    </div>
  )
}

export default Divider
