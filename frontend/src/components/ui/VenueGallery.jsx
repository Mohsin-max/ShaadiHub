import { useEffect, useState } from 'react'
import Icon from './Icon'

function ArrowButton({ direction, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${direction === 'left' ? 'left-3' : 'right-3'} w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-primary shadow-sm hover:bg-white transition-all z-10`}
      aria-label={direction === 'left' ? 'Previous photo' : 'Next photo'}
    >
      <Icon name={direction === 'left' ? 'chevron_left' : 'chevron_right'} />
    </button>
  )
}

function VenueGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goTo = (delta) => {
    setActiveIndex((prev) => (prev + delta + images.length) % images.length)
  }

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') goTo(-1)
      if (e.key === 'ArrowRight') goTo(1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length])

  const thumbnails = [1, 2, 3].filter((i) => i < images.length)
  const remaining = Math.max(0, images.length - 4)

  return (
    <>
      <div className="flex gap-gutter mb-10 h-[300px] md:h-[440px] overflow-hidden">
        <div className="flex-1 md:flex-[3] min-w-0 h-full rounded-xl overflow-hidden relative group">
          <img
            className="w-full h-full object-cover"
            src={images[activeIndex]}
            alt="Venue"
          />
          <ArrowButton direction="left" onClick={() => goTo(-1)} />
          <ArrowButton direction="right" onClick={() => goTo(1)} />
        </div>

        <div className="hidden md:flex flex-1 flex-col gap-gutter h-full min-w-0">
          {thumbnails.map((i, idx) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i)
                setLightboxOpen(true)
              }}
              className="flex-1 min-h-0 rounded-xl overflow-hidden relative group"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={images[i]}
                alt="Venue thumbnail"
              />
              {idx === thumbnails.length - 1 && remaining > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-on-primary">
                  <span className="font-label-caps text-[12px] font-bold">
                    + {remaining} Photos
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-md"
            onClick={() => setLightboxOpen(false)}
          />

          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <Icon name="close" />
          </button>

          <div className="relative z-10 max-w-4xl w-full flex items-center justify-center">
            <button
              onClick={() => goTo(-1)}
              className="absolute left-0 -translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors hidden sm:flex"
              aria-label="Previous photo"
            >
              <Icon name="chevron_left" />
            </button>

            <img
              src={images[activeIndex]}
              alt="Venue full view"
              className="max-h-[80vh] w-auto rounded-lg shadow-2xl"
            />

            <button
              onClick={() => goTo(1)}
              className="absolute right-0 translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors hidden sm:flex"
              aria-label="Next photo"
            >
              <Icon name="chevron_right" />
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/10 text-white text-[12px] font-semibold">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

export default VenueGallery
