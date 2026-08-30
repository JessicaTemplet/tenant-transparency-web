import { useState } from 'react'
import { submitFoundingCommunityResponse } from '../api.js'

const NAVY = '#0e2540'
const NAVY_TEXT = '#14304f'
const ORANGE = '#f5751f'

function sourceFromQuery() {
  if (typeof window === 'undefined') return 'nextdoor_founding_community'
  return new URLSearchParams(window.location.search).get('src') || 'nextdoor_founding_community'
}

const s = {
  hero: { position: 'relative', minHeight: 340, display: 'flex', alignItems: 'flex-end', background: '#0b1412' },
  heroPhoto: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(11,20,18,.95) 0%,rgba(11,20,18,.82) 45%,rgba(11,20,18,.6) 100%)' },
  heroInner: { position: 'relative', padding: '64px 56px 48px', maxWidth: 860, color: '#fff' },
  eyebrow: { font: "700 12px 'Inter',sans-serif", letterSpacing: '.14em', textTransform: 'uppercase', color: '#e6f4f1', marginBottom: 16 },
  h1: { font: "700 42px/1.15 'Lora',Georgia,serif", letterSpacing: '-.01em', margin: 0 },
  page: { maxWidth: 1000, margin: '0 auto', padding: '56px 56px 88px' },
  twoUp: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 44 },
  cardLight: { background: '#fff', border: '1px solid #e5e0d6', borderRadius: 14, padding: '30px 32px' },
  cardDark: { background: NAVY, borderRadius: 14, padding: '30px 32px', color: '#dbe4ee' },
  kicker: { font: "700 11px 'Inter',sans-serif", letterSpacing: '.12em', textTransform: 'uppercase', color: '#8b98a6', marginBottom: 14 },
  kickerLight: { font: "700 11px 'Inter',sans-serif", letterSpacing: '.12em', textTransform: 'uppercase', color: '#f9a86a', marginBottom: 14 },
  cardBody: { font: "400 15px/1.75 'Inter',sans-serif", color: '#3f5165', margin: 0 },
  cardBodyLight: { font: "400 15px/1.75 'Inter',sans-serif", margin: 0 },
  lead: { font: "400 20px/1.6 'Inter',sans-serif", color: NAVY_TEXT, maxWidth: 640, marginBottom: 36 },
  form: { background: '#fff', border: '1px solid #e5e0d6', borderRadius: 14, padding: '38px 40px', display: 'flex', flexDirection: 'column', gap: 24 },
  label: { display: 'flex', flexDirection: 'column', gap: 8, font: "600 14px 'Inter',sans-serif", color: NAVY_TEXT },
  optional: { fontWeight: 400, color: '#8b98a6' },
  input: { border: '1px solid #d8d2c6', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: NAVY_TEXT, background: '#fcfbf8', fontFamily: "'Inter',sans-serif" },
  textarea: { border: '1px solid #d8d2c6', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: NAVY_TEXT, background: '#fcfbf8', resize: 'vertical', fontFamily: "'Inter',sans-serif" },
  select: { maxWidth: 380, border: '1px solid #d8d2c6', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: NAVY_TEXT, background: '#fcfbf8', fontFamily: "'Inter',sans-serif" },
  consent: { display: 'flex', alignItems: 'flex-start', gap: 11, background: '#f7f4ef', borderRadius: 10, padding: '16px 18px', font: "400 14px/1.55 'Inter',sans-serif", color: '#3f5165', cursor: 'pointer' },
  checkbox: { accentColor: ORANGE, width: 17, height: 17, flexShrink: 0 },
  submit: { alignSelf: 'flex-start', background: ORANGE, color: '#fff', font: "600 15px 'Inter',sans-serif", padding: '15px 32px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  error: { font: "500 14px 'Inter',sans-serif", color: '#b3261e', margin: 0 },
  thanks: { background: NAVY, borderRadius: 14, padding: '60px 48px', textAlign: 'center', color: '#fff' },
  secondary: { display: 'inline-block', border: `1.5px solid ${NAVY_TEXT}`, color: NAVY_TEXT, font: "600 14px 'Inter',sans-serif", padding: '14px 30px', borderRadius: 8, textDecoration: 'none' },
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
    <>
      <section style={s.hero}>
        <img
          src="/singlefemale.jpg"
          alt="A multigenerational family greeting a smiling neighbor outside a Chicago home"
          style={s.heroPhoto}
        />
        <div style={s.heroOverlay} />
        <div style={s.heroInner}>
          <div style={s.eyebrow}>Founding Community</div>
          <h1 style={s.h1}>
            Report My Landlord was the beginning.<br />
            Tenant Transparency is the broader solution.
          </h1>
        </div>
      </section>

      <div style={s.page}>
        <div style={s.twoUp}>
          <div style={s.cardLight}>
            <div style={s.kicker}>Where we started</div>
            <p style={s.cardBody}>
              Report My Landlord started as a place for renters to share experiences and
              hold landlords accountable. As the idea grew, it became clear that renters
              need information <em>before</em> problems happen — not only a place to
              report issues afterward.
            </p>
          </div>
          <div style={s.cardDark}>
            <div style={s.kickerLight}>Where it's going</div>
            <p style={s.cardBodyLight}>
              Tenant Transparency expands that into property intelligence, renter
              experiences, education, and transparency tools — with more on the way.
            </p>
          </div>
        </div>

        <p style={s.lead}>
          You're part of the community that started this. Before we explain more about what
          Tenant Transparency is becoming, we'd love to hear from you.
        </p>

        {status === 'done' ? (
          <div style={s.thanks}>
            <div style={{ font: "700 30px 'Archivo','Inter',sans-serif", marginBottom: 12 }}>Thank you</div>
            <p style={{ font: "400 16px/1.7 'Inter',sans-serif", color: '#cfdae6', maxWidth: 460, margin: '0 auto' }}>
              We'll be in touch as Tenant Transparency grows. Feel free to{' '}
              <a href="/" style={{ color: '#fff' }}>explore the platform</a> in the meantime.
            </p>
          </div>
        ) : (
          <form style={s.form} onSubmit={handleSubmit} noValidate>
            <label style={s.label}>
              When you originally joined Report My Landlord, what were you hoping the community would help you do?
              <textarea rows={4} style={s.textarea} value={originalJoinReason} onChange={(e) => setOriginalJoinReason(e.target.value)} />
            </label>

            <label style={s.label}>
              When would a platform like Tenant Transparency be most useful to you?
              <select style={s.select} value={whenMostUseful} onChange={(e) => setWhenMostUseful(e.target.value)}>
                <option value="">Select one</option>
                <option value="before_signing">Before signing a lease</option>
                <option value="while_renting">While renting</option>
                <option value="after_problem">After a problem happens</option>
                <option value="throughout">Throughout the entire rental process</option>
              </select>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <label style={s.label}>
                Name <span style={s.optional}>optional</span>
                <input type="text" style={s.input} value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label style={s.label}>
                Email <span style={s.optional}>optional</span>
                <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </div>

            <label style={s.consent}>
              <input type="checkbox" style={s.checkbox} checked={futureContactOk} onChange={(e) => setFutureContactOk(e.target.checked)} />
              I am willing to be contacted for future Tenant Transparency testing, interviews, surveys, or product feedback.
            </label>

            {status === 'error' && <p style={s.error}>{error}</p>}

            <button type="submit" style={s.submit} disabled={status === 'loading'}>
              {status === 'loading' ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
          <a href="/" style={s.secondary}>Explore Tenant Transparency</a>
        </div>
      </div>
    </>
  )
}
