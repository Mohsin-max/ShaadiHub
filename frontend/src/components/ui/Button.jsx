const VARIANTS = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-container',
  gold: 'bg-antique-gold text-primary hover:brightness-105',
  outline:
    'bg-white border border-outline-variant text-primary hover:bg-surface-container',
}

function Button({ variant = 'primary', fullWidth = true, className = '', children, ...rest }) {
  return (
    <button
      className={`${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-2 font-bold text-[14px] py-2.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
