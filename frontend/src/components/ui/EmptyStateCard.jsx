import Icon from './Icon'

function EmptyStateCard({ icon, title, description, actionLabel, actionIcon, onAction }) {
  return (
    <div className="bg-white border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center text-center group cursor-pointer hover:border-secondary transition-all duration-500 hover:bg-surface-container-low">
      <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-5 relative">
        <Icon
          name={icon}
          className="text-3xl text-outline-variant group-hover:text-secondary transition-colors"
        />
        <div className="absolute -bottom-1.5 -right-1.5 bg-secondary text-on-secondary w-6 h-6 rounded-full flex items-center justify-center shadow-md">
          <Icon name="add" className="text-base" />
        </div>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{title}</h3>
      <p className="max-w-md text-on-surface-variant text-body-md mb-6">{description}</p>
      <button
        onClick={onAction}
        className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
      >
        <Icon name={actionIcon} />
        {actionLabel}
      </button>
    </div>
  )
}

export default EmptyStateCard
