import { useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Drivers from './pages/Drivers'
import FuelExpenses from './pages/FuelExpenses'
import Login from './pages/Login'
import Maintenance from './pages/Maintenance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Trips from './pages/Trips'
import Vehicles from './pages/Vehicles'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/trips', label: 'Trips' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/fuel-expenses', label: 'Fuel & Expenses' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
]

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const showShell = location.pathname !== '/'

  return (
    <div className="app-shell">
      {showShell ? (
        <>
          <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-brand">
              <div className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="brand-icon">
                  <path d="M4 14h8l2-3h4l2 3v2H4z" />
                  <path d="M8 11V8h3" />
                  <path d="M14 11h3" />
                  <circle cx="8" cy="16" r="2" />
                  <circle cx="16" cy="16" r="2" />
                </svg>
              </div>
              <div className="brand-copy">
                <h3>TransitOps</h3>
                <p>Command center</p>
              </div>
            </div>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen((value) => !value)}>
              {sidebarOpen ? '⟨' : '⟩'}
            </button>
            <nav className="nav-links">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-link-badge" aria-hidden="true">
                    {item.label.charAt(0).toUpperCase()}
                  </span>
                  {sidebarOpen && <span className="nav-link-text">{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </aside>

          <main className="main-content">
            {location.pathname === '/dashboard' && (
              <header className="topbar">
                <div>
                  <p className="eyebrow">Operations</p>
                  <h2>TransitOps dashboard</h2>
                </div>
                <div className="topbar-actions">
                  <button className="btn btn-secondary">Alerts</button>
                  <button className="btn btn-primary">+ New task</button>
                </div>
              </header>
            )}

            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/fuel-expenses" element={<FuelExpenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </div>
  )
}

export default App
