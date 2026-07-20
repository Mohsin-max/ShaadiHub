import Icon from './Icon'

const STEPS = [
  { icon: 'info', label: 'Venue Details' },
  { icon: 'location_on', label: 'Location' },
  { icon: 'payments', label: 'Pricing' },
  { icon: 'sell', label: 'Amenities' },
  { icon: 'photo_camera', label: 'Photos' },
]

function stepState(index, currentStep) {
  if (index < currentStep) return 'done'
  if (index === currentStep) return 'active'
  return 'pending'
}

function VenueProgressSidebar({ currentStep = 1 }) {
  return (
    <aside className="w-72 shrink-0 space-y-4">
      <div className="bg-white border border-outline-variant/50 rounded-xl p-5 sticky top-0 shadow-sm">
        <h3 className="font-label-caps text-[11px] text-primary border-b border-outline-variant/30 pb-3 mb-5 uppercase tracking-widest">
          Venue Progress
        </h3>
        <div className="space-y-6 relative">
          <div className="absolute left-[13px] top-2 bottom-2 w-px bg-outline-variant/50" />

          {STEPS.map((step, index) => {
            const state = stepState(index, currentStep)
            return (
              <div key={step.label} className={`flex items-start relative z-10 ${state === 'pending' ? 'opacity-50' : ''}`}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 shadow-sm border-2 border-white shrink-0 ${
                    state === 'done'
                      ? 'bg-primary text-white'
                      : state === 'active'
                        ? 'bg-secondary-container text-on-secondary-container ring-4 ring-secondary-container/20'
                        : 'bg-surface-variant text-on-surface-variant'
                  }`}
                >
                  <Icon
                    name={state === 'done' ? 'check' : step.icon}
                    className="text-[14px]"
                  />
                </div>
                <div className="pt-0.5">
                  <p className="font-bold text-primary text-[13px]">{step.label}</p>
                  <p
                    className={`text-[11px] ${state === 'active' ? 'text-secondary font-semibold' : 'text-on-surface-variant'}`}
                  >
                    {state === 'done' ? 'Completed' : state === 'active' ? 'In Progress' : 'Pending'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-3 bg-primary-container/5 rounded-lg border border-primary-container/10">
          <p className="text-[11px] text-primary leading-relaxed italic">
            "Complete all sections to increase your venue's visibility score. High-quality photos
            increase booking inquiries by up to 40%."
          </p>
        </div>
      </div>
    </aside>
  )
}

export default VenueProgressSidebar
