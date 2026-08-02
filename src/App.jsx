import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Homepage from './components/Homepage.jsx'
import PropertySearch from './components/PropertySearch.jsx'
import PropertyDetail from './components/PropertyDetail.jsx'
import SiteChrome from './components/SiteChrome.jsx'
import ReportIssue from './components/ReportIssue.jsx'
import ResourceCenter from './components/ResourceCenter.jsx'
import About from './components/About.jsx'
import NeighborhoodMap from './components/NeighborhoodMap.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import TermsOfUse from './components/TermsOfUse.jsx'
import AdminApp from './AdminApp.jsx'

function RenterSearchFlow() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)

  return selectedPropertyId ? (
    <PropertyDetail propertyId={selectedPropertyId} onBack={() => setSelectedPropertyId(null)} />
  ) : (
    <PropertySearch onSelectProperty={setSelectedPropertyId} />
  )
}

// "/" and all public-facing routes get full site chrome (nav + footer).
// "/admin" is deliberately bare — it's a back-office tool, not a renter page.
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<SiteChrome><Homepage /></SiteChrome>} />
        <Route path="/search" element={<SiteChrome><div className="page-content"><RenterSearchFlow /></div></SiteChrome>} />
        <Route path="/report-issue" element={<SiteChrome><div className="page-content"><ReportIssue /></div></SiteChrome>} />
        <Route path="/resources" element={<SiteChrome><ResourceCenter /></SiteChrome>} />
        <Route path="/about" element={<SiteChrome><About /></SiteChrome>} />
        <Route path="/map" element={<SiteChrome hideFooter><NeighborhoodMap /></SiteChrome>} />
        <Route path="/privacy" element={<SiteChrome><PrivacyPolicy /></SiteChrome>} />
        <Route path="/terms" element={<SiteChrome><TermsOfUse /></SiteChrome>} />
        <Route
          path="/admin"
          element={
            <div className="admin-shell">
              <header className="admin-shell-header">
                <Link to="/" className="brand-link">
                  TENANT TRANSPARENCY — Admin
                </Link>
              </header>
              <main className="app-main page-content">
                <AdminApp />
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
