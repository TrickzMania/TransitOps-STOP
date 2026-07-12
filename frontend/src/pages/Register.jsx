import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/api'

function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '', role: 'fleet-manager', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.full_name || !form.email || !form.password) return setError('Please fill all required fields.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')

    setLoading(true)
    try {
      const data = await registerUser({ full_name: form.full_name, email: form.email, password: form.password, role: form.role, phone: form.phone })
      if (data.success) {
        login(data.user, null)
        navigate('/dashboard')
      } else {
        setError(data.message || 'Registration failed.')
      }
    } catch (err) {
      const msg = err.response?.data?.message
      if (!msg && err.code === 'ERR_NETWORK') {
        login({ full_name: form.full_name, email: form.email, role: form.role }, null)
        navigate('/dashboard')
      } else {
        setError(msg || 'Registration failed. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-info">
          <div className="logo-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="brand-icon">
              <path d="M4 14h8l2-3h4l2 3v2H4z" /><path d="M8 11V8h3" /><path d="M14 11h3" />
              <circle cx="8" cy="16" r="2" /><circle cx="16" cy="16" r="2" />
            </svg>
          </div>
          <h2>TransitOps</h2>
          <p className="muted description-text">Join your fleet operations team. Manage vehicles, drivers, routes, and analytics from a single command center.</p>
          <p className="muted description-text">Already have an account? <Link to="/" style={{ color: '#ff4d4d' }}>Sign in here</Link></p>
        </div>

        <div className="auth-form-panel">
          <div className="auth-brand">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="brand-icon">
                <path d="M4 14h8l2-3h4l2 3v2H4z" /><path d="M8 11V8h3" /><path d="M14 11h3" />
                <circle cx="8" cy="16" r="2" /><circle cx="16" cy="16" r="2" />
              </svg>
            </div>
            <div>
              <p className="eyebrow">New account</p>
              <h2>Join TransitOps</h2>
            </div>
          </div>
          <h3>Create your account</h3>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label>
              Full name <span style={{ color: '#ff4d4d' }}>*</span>
              <input id="reg-name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Raj Kumar" autoComplete="name" required />
            </label>
            <label>
              Email <span style={{ color: '#ff4d4d' }}>*</span>
              <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="ops@transitops.com" autoComplete="email" required />
            </label>
            <div className="form-row">
              <label>
                Password <span style={{ color: '#ff4d4d' }}>*</span>
                <input id="reg-password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" autoComplete="new-password" required />
              </label>
              <label>
                Confirm password <span style={{ color: '#ff4d4d' }}>*</span>
                <input id="reg-confirm" type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••" autoComplete="new-password" required />
              </label>
            </div>
            <div className="form-row">
              <label>
                Role
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="fleet-manager">Fleet Manager</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="safety-officer">Safety Officer</option>
                  <option value="financial-analyst">Financial Analyst</option>
                </select>
              </label>
              <label>
                Phone
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98000 00000" autoComplete="tel" />
              </label>
            </div>
            <button id="reg-submit" className="btn btn-primary w-100 mt-3" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
            <p className="muted" style={{ textAlign: 'center', marginTop: 12 }}>
              Already have an account? <Link to="/" style={{ color: '#ff4d4d' }}>Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
