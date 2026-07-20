import { useState } from 'react'

const NEIGHBORHOODS = ['DHA', 'Clifton', 'Gulshan-e-Iqbal', 'Gulberg', 'Model Town', 'Nazimabad']
const VENUE_TYPES = ['All', 'Banquet', 'Lawn', 'Hotel']

function FilterSidebar() {
  const [activeType, setActiveType] = useState('All')

  return (
    <aside className="hidden md:block w-64 h-[calc(100vh-56px)] fixed left-0 top-14 bg-surface-container-lowest border-r border-outline-variant p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-headline-sm text-[16px] text-primary">Filters</h2>
        <button className="text-[11px] text-secondary hover:underline transition-all">
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Neighborhood */}
        <div>
          <h3 className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider mb-3">
            Neighborhood
          </h3>
          <div className="space-y-2.5">
            {NEIGHBORHOODS.map((area) => (
              <label key={area} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-[13px] text-on-surface-variant group-hover:text-primary transition-colors">
                  {area}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Venue Type */}
        <div>
          <h3 className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider mb-3">
            Venue Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {VENUE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-1.5 rounded-full border text-[11px] transition-all ${
                  activeType === type
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

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
