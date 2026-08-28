import { useState, useEffect } from 'react'

// Default set — the same three photos already used on the Support TT page,
// reused here so the standalone form pages (Beta, Founding Community) carry
// the same visual identity as the rest of the site. Pass a different
// `images` array to override.
export const DEFAULT_LOOP_IMAGES = [
  {
    src: '/youngcouple.jpg',
    alt: 'A couple carrying a dresser into their new home on moving day outside a Chicago brick bungalow',
    caption: 'Every renter deserves to know before they sign.',
  },
  {
    src: '/singlefemale.jpg',
    alt: 'A multigenerational family greeting a smiling neighbor outside a Chicago home',
    caption: 'Built block by block, for Chicago renters.',
  },
  {
    src: '/youngwomenandchildren.jpg',
    alt: 'A woman walking toward a Chicago high-rise as movers carry furniture into her new building',
    caption: 'Always free for renters — that never changes.',
  },
]

export default function ImageLoop({ images = DEFAULT_LOOP_IMAGES }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 4500)
    return () => clearInterval(id)
  }, [images])

  return (
    <div className="image-loop" role="img" aria-label={images[index].alt}>
      {images.map((img, i) => (
        <div
          key={img.src}
          className={`image-loop-slide${i === index ? ' active' : ''}`}
          style={{ backgroundImage: `url(${img.src})` }}
        />
      ))}
      <div className="image-loop-caption">{images[index].caption}</div>
      <div className="image-loop-dots">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className={`image-loop-dot${i === index ? ' active' : ''}`}
            aria-label={`Show image ${i + 1} of ${images.length}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
