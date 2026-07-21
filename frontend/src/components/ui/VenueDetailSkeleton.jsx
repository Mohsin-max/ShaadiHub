function VenueDetailSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-6 pt-6 pb-16 animate-pulse">
      <div className="mb-6 space-y-3">
        <div className="h-5 w-32 bg-surface-container rounded-full" />
        <div className="h-8 w-2/3 bg-surface-container rounded" />
        <div className="h-4 w-1/3 bg-surface-container rounded" />
      </div>

      <div className="flex gap-3 mb-10 h-[440px]">
        <div className="flex-[3] bg-surface-container rounded-xl" />
        <div className="hidden md:flex flex-1 flex-col gap-3">
          <div className="flex-1 bg-surface-container rounded-xl" />
          <div className="flex-1 bg-surface-container rounded-xl" />
          <div className="flex-1 bg-surface-container rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-3">
            <div className="h-5 w-40 bg-surface-container rounded" />
            <div className="h-4 bg-surface-container rounded" />
            <div className="h-4 bg-surface-container rounded w-5/6" />
            <div className="h-4 bg-surface-container rounded w-2/3" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-surface-container rounded-xl" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-5 w-32 bg-surface-container rounded" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-7 w-20 bg-surface-container rounded-full" />
              ))}
            </div>
          </div>
          <div className="h-64 bg-surface-container rounded-xl" />
        </div>
        <div className="h-64 bg-surface-container rounded-xl" />
      </div>
    </div>
  )
}

export default VenueDetailSkeleton
