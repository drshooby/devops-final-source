import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import RegisterModal from './components/RegisterModal'

export default function App() {
  const [showModal, setShowModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = loading, true/false = result

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify`, {
          credentials: 'include', // sends cookies
        })

        if (res.ok) {
          const user = await res.json()
          console.log('[Authenticated]', user)
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return <div>Checking credentials...</div>
  }

  // If not logged in, show login form
  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <h1 className="brand">iDropThings</h1>
        <p className="tagline">continuous delivery...usually</p>
        <LoginForm onRegisterClick={() => setShowModal(true)} />
        {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
      </div>
    )
  }

  // If logged in, show the app (for now, just a placeholder)
  return (
    <div className="app-container">
      <h1 className="brand">Welcome to iDropThings</h1>
      <p className="tagline">You’re logged in and probably ready to drop.</p>
      <button onClick={() => alert("This could lead to the fake dashboard")}>
        Go to Dashboard
      </button>
    </div>
  )
}
