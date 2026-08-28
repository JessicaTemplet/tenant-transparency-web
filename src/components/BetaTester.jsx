import { useState } from 'react'
import { submitBetaFeedback } from '../api.js'
import Logo from './Logo.jsx'

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
    <div className="site-chrome">
      <header className="app-header">
        <div className="header-inner">
          <a href="/" className="brand-link">
            <Logo className="brand-logo" />
          </a>
        </div>
      </header>

      <main className="app-main page-content">
        {status === 'done' ? (
          <div className="report-panel">
            <div className="report-success">
              <div className="report-success-icon">&#10003;</div>
              <h1>Thank you</h1>
              <p>
                Your feedback has been recorded. This is exactly the kind of
                honest, unfiltered read we need before opening this up more
                broadly &mdash; we really appreciate the time.
              </p>
            </div>
          </div>
        ) : (
          <div className="report-panel">
            <div className="report-panel-header">
              <h1>Help Us Build Tenant Transparency</h1>
              <p className="subhead">
                Tenant Transparency is a renter-focused platform built
                around one simple idea: renters should be able to know more
                before they sign a lease.
              </p>
              <p>
                We're looking for renters, former renters, apartment
                hunters, housing advocates, housing professionals, and
                others familiar with the rental process to test the early
                version of the platform and give us honest feedback.
              </p>
              <p>
                We are not looking for compliments. We want to know what
                works, what's confusing, what's missing, and what renters
                would actually use.
              </p>
              <div className="report-privacy-note">
                <span>&#9201;</span>
                Please spend about five to ten minutes exploring{' '}
                <a href="/" target="_blank" rel="noopener noreferrer">Tenant Transparency</a>{' '}
                before filling this out. We're intentionally not giving much
                direction beyond that &mdash; one of the most important
                things we want to learn is whether someone who's never heard
                of Tenant Transparency can figure out what it is, who it's
                for, and how to use it without us explaining it first.
              </div>
            </div>

            <form className="report-form" onSubmit={handleSubmit} noValidate>
              <label className="field-label">
                Name
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </label>

              <label className="field-label">
                Email address
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <div className="field-label">
                City and state
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={{ flex: 1 }} />
                  <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} style={{ width: '100px' }} />
                </div>
              </div>

              <div className="field-label">
                Which of these describes you?
                <span className="field-hint">Select all that apply</span>
                <div className="tag-checkbox-list">
                  {RESPONDENT_TYPES.map((t) => (
                    <label key={t.value} className="tag-checkbox">
                      <input
                        type="checkbox"
                        checked={respondentTypes.includes(t.value)}
                        onChange={() => toggleType(t.value)}
                      />
                      {t.label}
                    </label>
                  ))}
                </div>
              </div>

              <label className="field-label">
                After spending a few minutes on Tenant Transparency, how would you describe what the platform does?
                <textarea rows={3} value={descriptionAfterUse} onChange={(e) => setDescriptionAfterUse(e.target.value)} />
              </label>

              <label className="field-label">
                Was it immediately clear who Tenant Transparency is designed for?
                <select value={audienceClarity} onChange={(e) => setAudienceClarity(e.target.value)}>
                  <option value="">Select one</option>
                  <option value="yes">Yes</option>
                  <option value="somewhat">Somewhat</option>
                  <option value="no">No</option>
                </select>
              </label>

              <label className="field-label">
                What was the first thing you clicked on?
                <input type="text" value={firstClicked} onChange={(e) => setFirstClicked(e.target.value)} />
              </label>

              <label className="field-label">
                Was the website easy to navigate?
                <select value={easyToNavigate} onChange={(e) => setEasyToNavigate(e.target.value)}>
                  <option value="">Select one</option>
                  <option value="yes">Yes</option>
                  <option value="somewhat">Somewhat</option>
                  <option value="no">No</option>
                </select>
              </label>

              <label className="field-label">
                What information would you want to know about a rental property before signing a lease?
                <textarea rows={3} value={infoWantedBeforeLease} onChange={(e) => setInfoWantedBeforeLease(e.target.value)} />
              </label>

              <label className="field-label">
                Would renter reviews or property reports influence your decision about whether to rent a property?
                <select value={reviewsInfluenceDecision} onChange={(e) => setReviewsInfluenceDecision(e.target.value)}>
                  <option value="">Select one</option>
                  <option value="yes">Yes</option>
                  <option value="somewhat">Somewhat</option>
                  <option value="no">No</option>
                </select>
              </label>

              <label className="field-label">
                What would make you trust a renter review or property report?
                <textarea rows={3} value={trustFactors} onChange={(e) => setTrustFactors(e.target.value)} />
              </label>

              <label className="field-label">
                Did you visit the Resource Center?
                <select value={visitedResourceCenter} onChange={(e) => setVisitedResourceCenter(e.target.value)}>
                  <option value="">Select one</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>

              <label className="field-label">
                Did you use any of the renter tools or resources?
                <select value={usedTools} onChange={(e) => setUsedTools(e.target.value)}>
                  <option value="">Select one</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>

              <label className="field-label">
                Which resource or tool was most useful to you?
                <input type="text" value={mostUsefulResource} onChange={(e) => setMostUsefulResource(e.target.value)} />
              </label>

              <label className="field-label">
                What information or feature felt missing?
                <textarea rows={3} value={missingFeature} onChange={(e) => setMissingFeature(e.target.value)} />
              </label>

              <label className="field-label">
                Was anything confusing or difficult to use?
                <textarea rows={3} value={confusingExperience} onChange={(e) => setConfusingExperience(e.target.value)} />
              </label>

              <label className="field-label">
                Was there anything that made you hesitant to create an account or provide information?
                <textarea rows={3} value={accountHesitation} onChange={(e) => setAccountHesitation(e.target.value)} />
              </label>

              <label className="field-label">
                Would you use Tenant Transparency before signing a lease?
                <select value={wouldUseBeforeLease} onChange={(e) => setWouldUseBeforeLease(e.target.value)}>
                  <option value="">Select one</option>
                  <option value="yes">Yes</option>
                  <option value="maybe">Maybe</option>
                  <option value="no">No</option>
                </select>
              </label>

              <label className="field-label">
                How likely are you to recommend Tenant Transparency to another renter? (1&ndash;10)
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={recommendScore}
                  onChange={(e) => setRecommendScore(e.target.value)}
                />
              </label>

              <label className="field-label">
                What is the one feature you would most like us to add?
                <textarea rows={3} value={featureRequest} onChange={(e) => setFeatureRequest(e.target.value)} />
              </label>

              <label className="field-label">
                What else do you believe renters should be able to know before signing a lease?
                <textarea rows={3} value={renterKnowledgeWishlist} onChange={(e) => setRenterKnowledgeWishlist(e.target.value)} />
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
                {status === 'loading' ? 'Submitting…' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
