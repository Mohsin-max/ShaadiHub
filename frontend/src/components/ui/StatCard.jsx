import Icon from './Icon'

function StatCard({ icon, iconClassName, value, label, badge, badgeClassName }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl transition-all duration-300 hover:shadow-[0_4px_20px_-5px_rgba(197,160,89,0.15)]">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${iconClassName}`}>
          <Icon name={icon} className="text-[18px]" />
        </div>
        {badge && (
          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${badgeClassName}`}>
            {badge}
          </span>
        )}
      </div>
      <span className="block text-2xl font-display-lg text-primary">{value}</span>
      <span className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wide mt-0.5 block">
        {label}
      </span>
    </div>
  )
}

export default StatCard
