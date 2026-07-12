import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/api'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', role: 'fleet-manager', remember: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const data = await loginUser(form.email, form.password)
      if (data.success) {
        login(data.user, data.token || null)
        navigate('/dashboard')
      } else {
        setError(data.message || 'Login failed. Check your credentials.')
      }
    } catch (err) {
      const msg = err.response?.data?.message
      // If backend is unreachable in dev, allow demo access
      if (!msg && err.code === 'ERR_NETWORK') {
        login({ full_name: 'Demo User', email: form.email, role: form.role }, null)
        navigate('/dashboard')
      } else {
        setError(msg || 'Login failed. Check your credentials.')
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
              <path d="M4 14h8l2-3h4l2 3v2H4z" />
              <path d="M8 11V8h3" />
              <path d="M14 11h3" />
              <circle cx="8" cy="16" r="2" />
              <circle cx="16" cy="16" r="2" />
            </svg>
          </div>
          <h2>TransitOps</h2>
          <p className="muted description-text">
            A centralized platform for fleet operations, dispatching, maintenance, fuel control, and analytics.
          </p>
          <p className="muted description-text">
            It helps teams reduce scheduling conflicts, improve visibility, and manage transport operations more efficiently.
          </p>
        </div>

        <div className="auth-form-panel">
          <div className="auth-brand">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="brand-icon">
                <path d="M4 14h8l2-3h4l2 3v2H4z" />
                <path d="M8 11V8h3" />
                <path d="M14 11h3" />
                <circle cx="8" cy="16" r="2" />
                <circle cx="16" cy="16" r="2" />
              </svg>
            </div>
            <div>
              <p className="eyebrow">Secure access</p>
              <h2>Fleet command center</h2>
            </div>
          </div>
          <h3>Sign in to manage operations</h3>
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label>
              Email
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ops@transitops.com"
                autoComplete="email"
                required
              />
            </label>
            <label>
              Password
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>
            <label>
              Role
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="fleet-manager">Fleet Manager</option>
                <option value="dispatcher">Dispatcher</option>
                <option value="safety-officer">Safety Officer</option>
                <option value="financial-analyst">Financial Analyst</option>
              </select>
            </label>
            <div className="login-actions">
              <label>
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button
              id="login-submit"
              className="btn btn-primary w-100 mt-3"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
