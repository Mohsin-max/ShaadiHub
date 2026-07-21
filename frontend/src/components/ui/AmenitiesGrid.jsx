function AmenitiesGrid({ amenities = [], hideHeading = false }) {
  if (amenities.length === 0) return null

  return (
    <section>
      {!hideHeading && <h3 className="font-headline-sm text-[18px] text-primary mb-4">Amenities</h3>}
      <div className="flex flex-wrap gap-2">
        {amenities.map((tag) => (
          <span
            key={tag}
            className="bg-white border border-outline-variant text-on-surface-variant text-[13px] font-medium px-3.5 py-2 rounded-full hover:border-antique-gold/50 hover:text-primary transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}

export default AmenitiesGrid
