import Icon from './Icon'
import Button from './Button'

function ConfirmModal({
  open,
  title,
  details,
  message,
  confirmLabel = "Yes, I'm Sure",
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'primary',
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onCancel} />

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 p-6 border border-outline-variant">
        <div className="w-12 h-12 rounded-full bg-antique-gold/15 text-antique-gold flex items-center justify-center mb-4">
          <Icon name="help" className="text-[24px]" />
        </div>
        <h3 className="font-headline-sm text-[18px] text-primary mb-3">{title}</h3>

        {details && details.length > 0 && (
          <div className="grid grid-cols-2 gap-3 bg-surface-container-lowest border border-outline-variant rounded-lg p-3.5 mb-4">
            {details.map((d) => (
              <div key={d.label} className={d.wide ? 'col-span-2' : ''}>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  {d.label}
                </p>
                <p className="text-[15px] font-bold text-primary leading-snug">{d.value}</p>
              </div>
            ))}
          </div>
        )}

        <p className="text-[13px] text-on-surface-variant leading-relaxed mb-5">{message}</p>
        <div className="flex gap-2.5">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={loading}>
            {loading ? 'Please wait…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
