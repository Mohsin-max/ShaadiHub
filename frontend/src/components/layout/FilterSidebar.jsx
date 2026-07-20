import SearchableMultiSelect from '../ui/SearchableMultiSelect'

function FilterSidebar({
  cities = [],
  areas = [],
  types = [],
  selectedCities = [],
  selectedAreas = [],
  selectedTypes = [],
  onCityToggle,
  onAreaToggle,
  onTypeToggle,
  onClearAll,
}) {
  const hasActiveFilters =
    selectedCities.length > 0 || selectedAreas.length > 0 || selectedTypes.length > 0

  return (
    <aside className="hidden md:block w-64 h-[calc(100vh-56px)] fixed left-0 top-14 bg-surface-container-lowest border-r border-outline-variant p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-headline-sm text-[16px] text-primary">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-[11px] text-secondary hover:underline transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* City */}
        <div>
          <h3 className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider mb-3">
            City
          </h3>
          {cities.length === 0 ? (
            <p className="text-[12px] text-on-surface-variant italic">No venues yet</p>
          ) : (
            <SearchableMultiSelect
              options={cities}
              selected={selectedCities}
              onToggle={onCityToggle}
              placeholder="Search city…"
            />
          )}
        </div>

        {/* Neighborhood / Area */}
        {areas.length > 0 && (
          <div>
            <h3 className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider mb-3">
              Neighborhood
            </h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
              {areas.map((area) => (
                <label key={area} className="flex items-center gap-2 cursor-pointer group min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedAreas.includes(area)}
                    onChange={() => onAreaToggle?.(area)}
                    className="w-4 h-4 shrink-0 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-[13px] text-on-surface-variant group-hover:text-primary transition-colors truncate">
                    {area}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Venue Type */}
        {types.length > 0 && (
          <div>
            <h3 className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider mb-3">
              Venue Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => onTypeToggle?.(type)}
                  className={`px-3 py-1.5 rounded-full border text-[11px] transition-all ${
                    selectedTypes.includes(type)
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Capacity */}
        <div>
          <h3 className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider mb-3">
            Capacity (Guests)
          </h3>
          <div className="space-y-3">
            <input
              type="range"
              className="w-full accent-primary bg-outline-variant h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant">
              <span>200</span>
              <span className="text-primary font-bold">2,500+</span>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div>
          <h3 className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider mb-3">
            Budget Range
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-on-surface-variant">
                Rs.
              </span>
              <input
                className="w-full pl-8 pr-2 py-2 bg-white border border-outline-variant rounded-lg text-[12px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Min"
                type="text"
              />
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-on-surface-variant">
                Rs.
              </span>
              <input
                className="w-full pl-8 pr-2 py-2 bg-white border border-outline-variant rounded-lg text-[12px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Max"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default FilterSidebar
