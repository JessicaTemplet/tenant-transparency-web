import ImageLoop from './ImageLoop.jsx'
import '../support.css'

// TODO(Jessica): once Sheenita's Stripe account exists, create a Payment Link
// (Stripe Dashboard → Payment Links → New) and paste the URL here. Until this
// is set, the button below renders as a disabled "coming soon" state instead
// of linking anywhere broken.
const STRIPE_PAYMENT_LINK = ''

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
