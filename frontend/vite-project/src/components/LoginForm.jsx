export default function LoginForm({ onRegisterClick }) {
    async function handleSubmit(e) {
      e.preventDefault()
      const username = e.target.username.value
      const password = e.target.password.value
  
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
  
      const data = await res.json()
      console.log('[Login response]', data)
      alert(data.message || (data.success ? 'Login success!' : 'Login failed'))
    }
  
    return (
      <div className="login-box">
        <h2>Sign In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input name="username" type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button type="submit">Login</button>
          <button type="button" className="link" onClick={onRegisterClick}>
            Don’t have an account? Create one
          </button>
        </form>
      </div>
    )
  }
  