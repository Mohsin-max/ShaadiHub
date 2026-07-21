function VenueCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-surface-container" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-4 bg-surface-container rounded w-3/4" />
        <div className="h-3 bg-surface-container rounded w-1/2" />
        <div className="h-10 bg-surface-container rounded-lg" />
        <div className="h-4 bg-surface-container rounded w-1/3" />
      </div>
    </div>
  )
}

export default VenueCardSkeleton
