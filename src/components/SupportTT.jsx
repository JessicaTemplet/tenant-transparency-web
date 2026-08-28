import { useState, useEffect } from 'react'
import '../support.css'

// TODO(Jessica): once Sheenita's Stripe account exists, create a Payment Link
// (Stripe Dashboard → Payment Links → New) and paste the URL here. Until this
// is set, the button below renders as a disabled "coming soon" state instead
// of linking anywhere broken.
const STRIPE_PAYMENT_LINK = ''

const LOOP_IMAGES = [
  {
    src: '/signinglease.png',
    alt: 'A family and community members gathered around a table outside a Chicago brick apartment building, smiling as a woman signs a lease',
    caption: 'Every renter deserves to know before they sign.',
  },
  {
    src: '/neighborhood.png',
    alt: 'A quiet Chicago residential street at golden hour with brick three-flats and mature trees',
    caption: 'Built block by block, for Chicago renters.',
  },
  {
    src: '/chicago-skyline.png',
    alt: 'The Chicago skyline',
    caption: 'Always free for renters — that never changes.',
  },
]

function ImageLoop() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % LOOP_IMAGES.length)
    }, 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="image-loop" role="img" aria-label={LOOP_IMAGES[index].alt}>
      {LOOP_IMAGES.map((img, i) => (
        <div
          key={img.src}
          className={`image-loop-slide${i === index ? ' active' : ''}`}
          style={{ backgroundImage: `url(${img.src})` }}
        />
      ))}
      <div className="image-loop-caption">{LOOP_IMAGES[index].caption}</div>
      <div className="image-loop-dots">
        {LOOP_IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className={`image-loop-dot${i === index ? ' active' : ''}`}
            aria-label={`Show image ${i + 1} of ${LOOP_IMAGES.length}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default function SupportTT() {
  return (
    <div className="support-page">
      <section className="support-hero">
        <div className="support-hero-content">
          <span className="section-eyebrow">Support TT</span>
          <h1>Help Build a More Transparent Rental Market</h1>
          <p>
            Tenant Transparency is building tools and resources designed to
            help renters access better information, understand their options,
            and make more informed decisions before signing a lease.
          </p>
          <p>
            Your support helps us continue developing the Tenant Transparency
            platform, expanding renter education and resources, conducting
            housing research, and bringing Know Before You Lease&trade; to
            more communities.
          </p>

          <div className="support-cta-wrap">
            {STRIPE_PAYMENT_LINK ? (
              <a
                href={STRIPE_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary"
              >
                Support Tenant Transparency
              </a>
            ) : (
              <button type="button" className="cta-primary support-cta-disabled" disabled aria-disabled="true">
                Support Tenant Transparency — coming soon
              </button>
            )}
          </div>

          <div className="support-disclosure">
            <p>
              Tenant Transparency is a for-profit business. Contributions made
              through this page are voluntary and are not tax-deductible
              charitable donations. Making a contribution does not provide an
              ownership or investment interest in Tenant Transparency.
            </p>
          </div>
        </div>

        <ImageLoop />
      </section>
    </div>
  )
}
