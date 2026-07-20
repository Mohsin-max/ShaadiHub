import Button from './Button'

function GoogleButton({ children = 'Google', ...rest }) {
  return (
    <Button type="button" variant="outline" {...rest}>
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d="M12 11h8.5c.1.5.1 1.1.1 1.7c0 5.2-3.5 8.9-8.6 8.9C6.5 21.6 2 17.1 2 11.6S6.5 1.6 12 1.6c2.6 0 4.8 1 6.5 2.6l-2.7 2.7C14.7 6 13.5 5.5 12 5.5c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5c3.2 0 4.4-2.3 4.6-3.5H12v-2z"
          fill="#EA4335"
        />
      </svg>
      {children}
    </Button>
  )
}

export default GoogleButton
