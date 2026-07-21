function VenueCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden animate-pulse">
      <div className="h-56 bg-surface-container" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-surface-container rounded w-3/4" />
        <div className="h-3 bg-surface-container rounded w-1/2" />
        <div className="h-11 bg-surface-container rounded-lg" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 bg-surface-container rounded w-1/3" />
          <div className="h-4 w-4 bg-surface-container rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default VenueCardSkeleton
