const VARIANTS = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-container',
  gold: 'bg-antique-gold text-primary hover:brightness-105',
  outline:
    'bg-white border border-outline-variant text-primary hover:bg-surface-container',
}

function Button({ variant = 'primary', className = '', children, ...rest }) {
  return (
    <button
      className={`w-full flex items-center justify-center gap-2 font-bold text-[14px] py-2.5 rounded-lg transition-all active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
