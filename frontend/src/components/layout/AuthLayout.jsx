function AuthLayout({ imageUrl, imageAlt, headline, bodyText, children }) {
  return (
    <main className="flex-grow flex items-center justify-center py-12 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_#C5A059_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_bottom_left,_#4A154B_0%,_transparent_70%)]" />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden">
        <div className="hidden lg:block relative min-h-[600px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            role="img"
            aria-label={imageAlt}
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
          <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
            <h2 className="font-display-lg text-display-lg mb-4">{headline}</h2>
            <p className="font-body-md opacity-90 max-w-md">{bodyText}</p>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">{children}</div>
      </div>
    </main>
  )
}

export default AuthLayout
