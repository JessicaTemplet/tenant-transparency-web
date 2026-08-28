import { useState } from 'react'
import { submitFoundingCommunityResponse } from '../api.js'

function sourceFromQuery() {
  if (typeof window === 'undefined') return 'nextdoor_founding_community'
  return new URLSearchParams(window.location.search).get('src') || 'nextdoor_founding_community'
}

export default function FoundingCommunity() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [originalJoinReason, setOriginalJoinReason] = useState('')
  const [whenMostUseful, setWhenMostUseful] = useState('')
  const [futureContactOk, setFutureContactOk] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await submitFoundingCommunityResponse({
        name: name.trim() || null,
        email: email.trim() || null,
        original_join_reason: originalJoinReason.trim() || null,
        when_most_useful: whenMostUseful || null,
        source: sourceFromQuery(),
        future_contact_ok: futureContactOk,
      })
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <div className="site-chrome">
      <header className="app-header">
        <div className="header-inner">
          <a href="/" className="brand-link">
            <img src="/logo.png" alt="Tenant Transparency — Know Before You Lease" className="brand-logo" />
          </a>
        </div>
      </header>

      <main className="app-main page-content">
        <div className="about-page">
          <section className="about-hero" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <span className="section-eyebrow">Founding Community</span>
              <h1>Report My Landlord was the beginning. Tenant Transparency is the broader solution.</h1>
              <p>
                Report My Landlord started as a place for renters to share
                experiences and hold landlords accountable. As the idea
                grew, it became clear that renters need information{' '}
                <em>before</em> problems happen, not only a place to report
                issues afterward. Tenant Transparency expands that into
                property intelligence, renter experiences, education, and
                transparency tools &mdash; with more on the way.
              </p>
              <p>
                You're part of the community that started this. Before we
                explain more about what Tenant Transparency is becoming,
                we'd love to hear from you.
              </p>
            </div>
          </section>

          {status === 'done' ? (
            <section style={{ background: 'var(--teal)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)', textAlign: 'center', marginTop: 'var(--space-8)' }}>
              <h2 style={{ color: 'var(--white)' }}>Thank you</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)' }}>
                We'll be in touch as Tenant Transparency grows. Feel free to{' '}
                <a href="/" style={{ color: 'var(--white)', textDecoration: 'underline' }}>explore the platform</a>{' '}
                in the meantime.
              </p>
            </section>
          ) : (
            <div className="report-panel" style={{ marginTop: 'var(--space-8)' }}>
              <form className="report-form" onSubmit={handleSubmit} noValidate>
                <label className="field-label">
                  When you originally joined Report My Landlord, what were you hoping the community would help you do?
                  <textarea rows={3} value={originalJoinReason} onChange={(e) => setOriginalJoinReason(e.target.value)} />
                </label>

                <label className="field-label">
                  Would a platform like Tenant Transparency be most useful to you before signing a lease, while you're renting, after a problem happens, or throughout the entire rental process?
                  <select value={whenMostUseful} onChange={(e) => setWhenMostUseful(e.target.value)}>
                    <option value="">Select one</option>
                    <option value="before_signing">Before signing a lease</option>
                    <option value="while_renting">While renting</option>
                    <option value="after_problem">After a problem happens</option>
                    <option value="throughout">Throughout the entire rental process</option>
                  </select>
                </label>

                <label className="field-label">
                  Name (optional)
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>

                <label className="field-label">
                  Email (optional)
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label className="field-checkbox">
                  <input
                    type="checkbox"
                    checked={futureContactOk}
                    onChange={(e) => setFutureContactOk(e.target.checked)}
                  />
                  I am willing to be contacted for future Tenant Transparency testing, interviews, surveys, or product feedback.
                </label>

                {status === 'error' && <p className="status-line error">{error}</p>}

                <button type="submit" className="cta-primary" disabled={status === 'loading'} style={{ alignSelf: 'flex-start' }}>
                  {status === 'loading' ? 'Submitting…' : 'Submit'}
                </button>
              </form>
            </div>
          )}

          <section style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <a href="/" className="cta-secondary">Explore Tenant Transparency</a>
          </section>
        </div>
      </main>
    </div>
  )
}
