import { useState } from 'react'
import AdminLogin from './components/AdminLogin.jsx'
import AdminModerationQueue from './components/AdminModerationQueue.jsx'
import { getStoredTokens } from './adminApi.js'

export default function AdminApp() {
  // Checked once on mount from localStorage — a stored access token might
  // already be expired, but that's fine: the queue's first load will hit
  // a 401, adminApi.js refreshes once automatically, and only falls back
  // to the login screen if the refresh token itself is dead too.
  const [loggedIn, setLoggedIn] = useState(() => !!getStoredTokens().refreshToken)

  return loggedIn ? (
    <AdminModerationQueue onLoggedOut={() => setLoggedIn(false)} />
  ) : (
    <AdminLogin onLoggedIn={() => setLoggedIn(true)} />
  )
}
