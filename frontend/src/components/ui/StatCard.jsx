import Icon from './Icon'

function StatCard({ icon, iconClassName, value, label, badge, badgeClassName }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl transition-all duration-300 hover:shadow-[0_4px_20px_-5px_rgba(197,160,89,0.15)]">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2.5 rounded-lg ${iconClassName}`}>
          <Icon name={icon} />
        </div>
        {badge && (
          <span className={`text-xs font-bold px-2 py-1 rounded ${badgeClassName}`}>
            {badge}
          </span>
        )}
      </div>
      <span className="block text-3xl font-display-lg text-primary">{value}</span>
      <span className="text-label-caps text-on-surface-variant uppercase mt-1 block">
        {label}
      </span>
    </div>
  )
}

export default StatCard
