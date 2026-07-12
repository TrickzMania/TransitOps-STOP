import { Link } from 'react-router-dom'

function Login() {
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
          <form className="auth-form">
            <label>
              Email
              <input type="email" placeholder="ops@transitops.com" />
            </label>
            <label>
              Password
              <input type="password" placeholder="••••••••" />
            </label>
            <label>
              Role
              <select defaultValue="fleet-manager">
                <option value="fleet-manager">Fleet Manager</option>
                <option value="dispatcher">Dispatcher</option>
                <option value="safety-officer">Safety Officer</option>
                <option value="financial-analyst">Financial Analyst</option>
              </select>
            </label>
            <div className="login-actions">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <Link to="/dashboard" className="btn btn-primary w-100 mt-3">
              Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
