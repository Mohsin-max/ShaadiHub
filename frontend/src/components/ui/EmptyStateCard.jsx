import Icon from './Icon'

function EmptyStateCard({ icon, title, description, actionLabel, actionIcon, onAction }) {
  return (
    <div className="bg-white border-2 border-dashed border-outline-variant rounded-2xl p-7 flex flex-col items-center text-center group cursor-pointer hover:border-secondary transition-all duration-500 hover:bg-surface-container-low">
      <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-3 relative">
        <Icon
          name={icon}
          className="text-[22px] text-outline-variant group-hover:text-secondary transition-colors"
        />
        <div className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary w-5 h-5 rounded-full flex items-center justify-center shadow-md">
          <Icon name="add" className="text-[13px]" />
        </div>
      </div>
      <h3 className="font-headline-sm text-[18px] text-primary mb-1.5">{title}</h3>
      <p className="max-w-md text-on-surface-variant text-body-sm mb-4">{description}</p>
      <button
        onClick={onAction}
        className="bg-primary text-on-primary px-6 py-2.5 text-[14px] rounded-lg font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
      >
        <Icon name={actionIcon} className="text-[18px]" />
        {actionLabel}
      </button>
    </div>
  )
}

export default EmptyStateCard
