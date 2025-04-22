export default function RegisterModal({ onClose }) {
    async function handleRegister(e) {
      e.preventDefault()
      const username = e.target.username.value
      const password = e.target.password.value
  
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
  
      const data = await res.json()
      console.log('[Register response]', data)
      alert(data.message || (data.success ? 'Registered!' : 'Register failed'))
    }
  
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <button className="modal-close" onClick={onClose}>✖</button>
          <h3>Create Account</h3>
          <form className="modal-form" onSubmit={handleRegister}>
            <input name="username" type="text" placeholder="Username" />
            <input name="password" type="password" placeholder="Password" />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    )
  }
  