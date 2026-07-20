import Icon from './Icon'

function ErrorBanner({ message }) {
  if (!message) return null

  return (
    <div className="flex items-start gap-2 bg-error-container text-on-error-container text-[13px] rounded-lg px-3.5 py-2.5">
      <Icon name="error" className="text-[16px] mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export default ErrorBanner
