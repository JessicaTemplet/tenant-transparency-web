import { useState } from 'react'
import { submitBetaFeedback } from '../api.js'

const NAVY = '#0e2540'
const NAVY_TEXT = '#14304f'
const ORANGE = '#f5751f'

const RESPONDENT_TYPES = [
  { value: 'current_renter',       label: 'Current renter' },
  { value: 'former_renter',        label: 'Former renter' },
  { value: 'apartment_hunter',     label: 'Apartment hunter' },
  { value: 'housing_advocate',     label: 'Housing advocate' },
  { value: 'housing_professional', label: 'Housing professional' },
  { value: 'landlord_or_pm',       label: 'Landlord or property manager' },
  { value: 'other',                label: 'Other' },
]

function sourceFromQuery() {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('src') || null
}

const s = {
  hero: { position: 'relative', minHeight: 340, display: 'flex', alignItems: 'flex-end', background: '#0b1412' },
  heroPhoto: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(11,20,18,.95) 0%,rgba(11,20,18,.82) 45%,rgba(11,20,18,.6) 100%)' },
  heroInner: { position: 'relative', padding: '64px 56px 48px', maxWidth: 820, color: '#fff' },
  eyebrow: { font: "700 12px 'Inter',sans-serif", letterSpacing: '.14em', textTransform: 'uppercase', color: '#e6f4f1', marginBottom: 16 },
  h1: { font: "700 46px/1.1 'Lora',Georgia,serif", letterSpacing: '-.01em', margin: 0 },
  heroSub: { font: "400 17px/1.6 'Inter',sans-serif", color: '#cfdae6', marginTop: 18, maxWidth: 600 },
  page: { maxWidth: 1080, margin: '0 auto', padding: '56px 56px 88px' },
  intro: { display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 44, alignItems: 'start', marginBottom: 44 },
  lead: { font: "400 19px/1.6 'Inter',sans-serif", color: NAVY_TEXT, margin: 0 },
  body: { font: "400 15px/1.7 'Inter',sans-serif", color: '#5c6b7c', margin: 0 },
  callout: { background: NAVY, borderRadius: 12, padding: '28px 30px', color: '#dbe4ee' },
  calloutKicker: { font: "700 12px 'Inter',sans-serif", letterSpacing: '.12em', textTransform: 'uppercase', color: '#f9a86a', marginBottom: 12 },
  calloutBody: { font: "400 15px/1.7 'Inter',sans-serif", margin: 0 },
  section: { background: '#fff', border: '1px solid #e5e0d6', borderRadius: 14, padding: '34px 36px' },
  sectionHead: { display: 'flex', alignItems: 'baseline', gap: 12, paddingBottom: 20, marginBottom: 24, borderBottom: '1px solid #eee8dd' },
  sectionNum: { font: "700 12px 'Inter',sans-serif", color: ORANGE, letterSpacing: '.1em' },
  sectionTitle: { font: "700 20px 'Archivo','Inter',sans-serif", color: NAVY_TEXT },
  label: { display: 'flex', flexDirection: 'column', gap: 8, font: "600 14px 'Inter',sans-serif", color: NAVY_TEXT },
  labelSm: { display: 'flex', flexDirection: 'column', gap: 7, font: "600 13px 'Inter',sans-serif", color: NAVY_TEXT },
  hint: { fontWeight: 400, color: '#8b98a6' },
  input: { border: '1px solid #d8d2c6', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: NAVY_TEXT, background: '#fcfbf8', fontFamily: "'Inter',sans-serif" },
  textarea: { border: '1px solid #d8d2c6', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: NAVY_TEXT, background: '#fcfbf8', resize: 'vertical', fontFamily: "'Inter',sans-serif" },
  select: { border: '1px solid #d8d2c6', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: NAVY_TEXT, background: '#fcfbf8', fontFamily: "'Inter',sans-serif" },
  chip: (on) => ({ display: 'flex', alignItems: 'center', gap: 9, background: on ? '#fff5ee' : '#fcfbf8', border: `1px solid ${on ? ORANGE : '#d8d2c6'}`, borderRadius: 22, padding: '9px 16px 9px 13px', font: "500 13px 'Inter',sans-serif", color: on ? NAVY_TEXT : '#3f5165', cursor: 'pointer' }),
  checkbox: { accentColor: ORANGE, width: 17, height: 17, flexShrink: 0 },
  consent: { display: 'flex', alignItems: 'flex-start', gap: 11, background: '#f7f4ef', borderRadius: 10, padding: '16px 18px', font: "400 14px/1.55 'Inter',sans-serif", color: '#3f5165', cursor: 'pointer' },
  submit: { background: ORANGE, color: '#fff', font: "600 15px 'Inter',sans-serif", padding: '16px 34px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  submitNote: { font: "400 13px 'Inter',sans-serif", color: '#8b98a6' },
  error: { font: "500 14px 'Inter',sans-serif", color: '#b3261e', margin: 0 },
  thanks: { background: '#fff', border: '1px solid #e5e0d6', borderRadius: 14, padding: '64px 48px', textAlign: 'center' },
  thanksIcon: { width: 52, height: 52, borderRadius: '50%', background: ORANGE, color: '#fff', font: "600 24px/52px 'Inter',sans-serif", margin: '0 auto 20px' },
  two: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 24px' },
  stack: { display: 'flex', flexDirection: 'column', gap: 22 },
}

export default function BetaTester() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [respondentTypes, setRespondentTypes] = useState([])
  const [descriptionAfterUse, setDescriptionAfterUse] = useState('')
  const [audienceClarity, setAudienceClarity] = useState('')
  const [firstClicked, setFirstClicked] = useState('')
  const [easyToNavigate, setEasyToNavigate] = useState('')
  const [infoWantedBeforeLease, setInfoWantedBeforeLease] = useState('')
  const [reviewsInfluenceDecision, setReviewsInfluenceDecision] = useState('')
  const [trustFactors, setTrustFactors] = useState('')
  const [visitedResourceCenter, setVisitedResourceCenter] = useState('')
  const [usedTools, setUsedTools] = useState('')
  const [mostUsefulResource, setMostUsefulResource] = useState('')
  const [missingFeature, setMissingFeature] = useState('')
  const [confusingExperience, setConfusingExperience] = useState('')
  const [accountHesitation, setAccountHesitation] = useState('')
  const [wouldUseBeforeLease, setWouldUseBeforeLease] = useState('')
  const [recommendScore, setRecommendScore] = useState('')
  const [featureRequest, setFeatureRequest] = useState('')
  const [renterKnowledgeWishlist, setRenterKnowledgeWishlist] = useState('')
  const [futureContactOk, setFutureContactOk] = useState(false)

  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function toggleType(value) {
    setRespondentTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setStatus('error')
      setError('Name and email are required.')
      return
    }
    if (respondentTypes.length === 0) {
      setStatus('error')
      setError('Select at least one option for who you are.')
      return
    }

    setStatus('loading')
    setError('')
    try {
      await submitBetaFeedback({
        name: name.trim(),
        email: email.trim(),
        city: city.trim() || null,
        state: state.trim() || null,
        respondent_types: respondentTypes,
        source: sourceFromQuery(),
        description_after_use: descriptionAfterUse.trim() || null,
        audience_clarity: audienceClarity || null,
        first_clicked: firstClicked.trim() || null,
        easy_to_navigate: easyToNavigate || null,
        info_wanted_before_lease: infoWantedBeforeLease.trim() || null,
        reviews_influence_decision: reviewsInfluenceDecision || null,
        trust_factors: trustFactors.trim() || null,
        visited_resource_center: visitedResourceCenter === '' ? null : visitedResourceCenter === 'yes',
        used_tools: usedTools === '' ? null : usedTools === 'yes',
        most_useful_resource: mostUsefulResource.trim() || null,
        missing_feature: missingFeature.trim() || null,
        confusing_experience: confusingExperience.trim() || null,
        account_hesitation: accountHesitation.trim() || null,
        would_use_before_lease: wouldUseBeforeLease || null,
        recommend_score: recommendScore === '' ? null : Number(recommendScore),
        feature_request: featureRequest.trim() || null,
        renter_knowledge_wishlist: renterKnowledgeWishlist.trim() || null,
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
          src="/youngcouple.jpg"
          alt="A couple carrying a dresser into their new home on moving day outside a Chicago brick bungalow"
          style={s.heroPhoto}
        />
        <div style={s.heroOverlay} />
        <div style={s.heroInner}>
          <div style={s.eyebrow}>Beta Testing</div>
          <h1 style={s.h1}>Help us build Tenant Transparency</h1>
          <p style={s.heroSub}>
            Five to ten minutes of honest feedback from renters, advocates, and housing
            professionals before we open the platform up more broadly.
          </p>
        </div>
      </section>

      <div style={s.page}>
        <div style={s.intro}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={s.lead}>
              Tenant Transparency is a renter-focused platform built around one simple idea:{' '}
              <strong style={{ fontWeight: 600 }}>renters should be able to know more before they sign a lease.</strong>
            </p>
            <p style={s.body}>
              We're looking for renters, former renters, apartment hunters, housing
              advocates, housing professionals, and others familiar with the rental process
              to test the early version of the platform and give us honest feedback.
            </p>
            <p style={s.body}>
              We are not looking for compliments. We want to know what works, what's
              confusing, what's missing, and what renters would actually use.
            </p>
          </div>
          <div style={s.callout}>
            <div style={s.calloutKicker}>Before you start</div>
            <p style={s.calloutBody}>
              Please spend about five to ten minutes exploring{' '}
              <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>Tenant Transparency</a>{' '}
              first. We're intentionally not giving much direction beyond that — one of the
              most important things we want to learn is whether someone who has never heard
              of us can figure out what this is, who it's for, and how to use it without an
              explanation.
            </p>
          </div>
        </div>

        {status === 'done' ? (
          <div style={s.thanks}>
            <div style={s.thanksIcon}>✓</div>
            <div style={{ font: "700 30px 'Archivo','Inter',sans-serif", color: NAVY_TEXT, marginBottom: 12 }}>Thank you</div>
            <p style={{ font: "400 16px/1.7 'Inter',sans-serif", color: '#5c6b7c', maxWidth: 460, margin: '0 auto' }}>
              Your feedback has been recorded. This is exactly the kind of honest,
              unfiltered read we need before opening this up more broadly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <section style={s.section}>
              <div style={s.sectionHead}>
                <div style={s.sectionNum}>01</div>
                <div style={s.sectionTitle}>About you</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                <label style={s.labelSm}>
                  Name
                  <input type="text" style={s.input} value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label style={s.labelSm}>
                  Email address
                  <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label style={s.labelSm}>
                  City
                  <input type="text" style={s.input} value={city} onChange={(e) => setCity(e.target.value)} />
                </label>
                <label style={s.labelSm}>
                  State
                  <input type="text" style={s.input} value={state} onChange={(e) => setState(e.target.value)} />
                </label>
                <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ font: "600 13px 'Inter',sans-serif", color: NAVY_TEXT }}>
                    Which of these describes you? <span style={s.hint}>Select all that apply</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {RESPONDENT_TYPES.map((t) => (
                      <label key={t.value} style={s.chip(respondentTypes.includes(t.value))}>
                        <input
                          type="checkbox"
                          style={s.checkbox}
                          checked={respondentTypes.includes(t.value)}
                          onChange={() => toggleType(t.value)}
                        />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section style={s.section}>
              <div style={s.sectionHead}>
                <div style={s.sectionNum}>02</div>
                <div style={s.sectionTitle}>First impressions</div>
              </div>
              <div style={s.stack}>
                <label style={s.label}>
                  After spending a few minutes on Tenant Transparency, how would you describe what the platform does?
                  <textarea rows={3} style={s.textarea} value={descriptionAfterUse} onChange={(e) => setDescriptionAfterUse(e.target.value)} />
                </label>
                <div style={s.two}>
                  <label style={s.label}>
                    Was it immediately clear who the platform is designed for?
                    <select style={s.select} value={audienceClarity} onChange={(e) => setAudienceClarity(e.target.value)}>
                      <option value="">Select one</option>
                      <option value="yes">Yes</option>
                      <option value="somewhat">Somewhat</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                  <label style={s.label}>
                    Was the website easy to navigate?
                    <select style={s.select} value={easyToNavigate} onChange={(e) => setEasyToNavigate(e.target.value)}>
                      <option value="">Select one</option>
                      <option value="yes">Yes</option>
                      <option value="somewhat">Somewhat</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                  <label style={{ ...s.label, gridColumn: '1/-1' }}>
                    What was the first thing you clicked on?
                    <input type="text" style={s.input} value={firstClicked} onChange={(e) => setFirstClicked(e.target.value)} />
                  </label>
                </div>
              </div>
            </section>

            <section style={s.section}>
              <div style={s.sectionHead}>
                <div style={s.sectionNum}>03</div>
                <div style={s.sectionTitle}>Information and trust</div>
              </div>
              <div style={s.stack}>
                <label style={s.label}>
                  What information would you want to know about a rental property before signing a lease?
                  <textarea rows={3} style={s.textarea} value={infoWantedBeforeLease} onChange={(e) => setInfoWantedBeforeLease(e.target.value)} />
                </label>
                <label style={s.label}>
                  Would renter reviews or property reports influence whether you rent a property?
                  <select style={{ ...s.select, maxWidth: 280 }} value={reviewsInfluenceDecision} onChange={(e) => setReviewsInfluenceDecision(e.target.value)}>
                    <option value="">Select one</option>
                    <option value="yes">Yes</option>
                    <option value="somewhat">Somewhat</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label style={s.label}>
                  What would make you trust a renter review or property report?
                  <textarea rows={3} style={s.textarea} value={trustFactors} onChange={(e) => setTrustFactors(e.target.value)} />
                </label>
              </div>
            </section>

            <section style={s.section}>
              <div style={s.sectionHead}>
                <div style={s.sectionNum}>04</div>
                <div style={s.sectionTitle}>Resources and tools</div>
              </div>
              <div style={s.two}>
                <label style={s.label}>
                  Did you visit the Resource Center?
                  <select style={s.select} value={visitedResourceCenter} onChange={(e) => setVisitedResourceCenter(e.target.value)}>
                    <option value="">Select one</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label style={s.label}>
                  Did you use any of the renter tools or resources?
                  <select style={s.select} value={usedTools} onChange={(e) => setUsedTools(e.target.value)}>
                    <option value="">Select one</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label style={{ ...s.label, gridColumn: '1/-1' }}>
                  Which resource or tool was most useful to you?
                  <input type="text" style={s.input} value={mostUsefulResource} onChange={(e) => setMostUsefulResource(e.target.value)} />
                </label>
              </div>
            </section>

            <section style={s.section}>
              <div style={s.sectionHead}>
                <div style={s.sectionNum}>05</div>
                <div style={s.sectionTitle}>What's missing</div>
              </div>
              <div style={s.stack}>
                <label style={s.label}>
                  What information or feature felt missing?
                  <textarea rows={3} style={s.textarea} value={missingFeature} onChange={(e) => setMissingFeature(e.target.value)} />
                </label>
                <label style={s.label}>
                  Was anything confusing or difficult to use?
                  <textarea rows={3} style={s.textarea} value={confusingExperience} onChange={(e) => setConfusingExperience(e.target.value)} />
                </label>
                <label style={s.label}>
                  Was there anything that made you hesitant to create an account or provide information?
                  <textarea rows={3} style={s.textarea} value={accountHesitation} onChange={(e) => setAccountHesitation(e.target.value)} />
                </label>
                <label style={s.label}>
                  What is the one feature you would most like us to add?
                  <textarea rows={3} style={s.textarea} value={featureRequest} onChange={(e) => setFeatureRequest(e.target.value)} />
                </label>
                <label style={s.label}>
                  What else do you believe renters should be able to know before signing a lease?
                  <textarea rows={3} style={s.textarea} value={renterKnowledgeWishlist} onChange={(e) => setRenterKnowledgeWishlist(e.target.value)} />
                </label>
              </div>
            </section>

            <section style={s.section}>
              <div style={s.sectionHead}>
                <div style={s.sectionNum}>06</div>
                <div style={s.sectionTitle}>Would you use it</div>
              </div>
              <div style={{ ...s.two, marginBottom: 24 }}>
                <label style={s.label}>
                  Would you use Tenant Transparency before signing a lease?
                  <select style={s.select} value={wouldUseBeforeLease} onChange={(e) => setWouldUseBeforeLease(e.target.value)}>
                    <option value="">Select one</option>
                    <option value="yes">Yes</option>
                    <option value="maybe">Maybe</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label style={s.label}>
                  How likely are you to recommend it to another renter? (1–10)
                  <input type="number" min="1" max="10" style={s.input} value={recommendScore} onChange={(e) => setRecommendScore(e.target.value)} />
                </label>
              </div>
              <label style={s.consent}>
                <input type="checkbox" style={s.checkbox} checked={futureContactOk} onChange={(e) => setFutureContactOk(e.target.checked)} />
                I am willing to be contacted for future Tenant Transparency testing, interviews, surveys, or product feedback.
              </label>
            </section>

            {status === 'error' && <p style={s.error}>{error}</p>}

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', paddingTop: 4 }}>
              <button type="submit" style={s.submit} disabled={status === 'loading'}>
                {status === 'loading' ? 'Submitting…' : 'Submit feedback'}
              </button>
              <div style={s.submitNote}>Every field is optional except your name, email, and who you are.</div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
