import { useEffect, useState } from 'react'
import { dashboardMetrics, recentTrips } from '../data/mockData'

const fleetCards = [
  { title: 'Active vehicles', value: '18', detail: 'In service now', status: 'Live', accent: 'teal' },
  { title: 'Available vehicles', value: '12', detail: 'Ready for dispatch', status: 'Ready', accent: 'green' },
  { title: 'Vehicles on maintenance', value: '6', detail: 'Scheduled today', status: 'Hold', accent: 'amber' },
  { title: 'Pending trips', value: '9', detail: 'Awaiting dispatch', status: 'Queued', accent: 'amber' },
  { title: 'Drivers on duty', value: '14', detail: 'Shift coverage', status: 'On shift', accent: 'green' },
  { title: 'Fleet utilization', value: '81%', detail: 'Above target', status: 'Optimal', accent: 'teal' },
]

const analyticsCards = [
  { title: 'Dispatch load', value: '72%', detail: 'Balanced across routes' },
  { title: 'Maintenance backlog', value: '4.2h', detail: 'Average turnaround' },
  { title: 'Fuel efficiency', value: '8.3 mpg', detail: 'Steady week-over-week' },
]

const pieData = [
  { label: 'Available vehicles', value: 12, color: '#ff4d4d' },
  { label: 'Active vehicles', value: 18, color: '#ff7c7c' },
  { label: 'Vehicles on maintenance', value: 6, color: '#ffd4d4' },
  { label: 'Pending trips', value: 9, color: '#7dd3fc' },
  { label: 'Drivers on duty', value: 14, color: '#2bb8a7' },
  { label: 'Fleet utilization', value: 81, color: '#8f7cf3' },
]

function Dashboard() {
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="page-grid">
      <section className="panel hero-panel">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h2>Everything moving smoothly this morning.</h2>
          <p className="muted">Monitor route performance, fleet status, maintenance alerts, and utilization in one command view.</p>
        </div>
        <div className="hero-badge">Live • {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </section>

      <section className="panel">
        <div className="filter-row">
          <select defaultValue="all">
            <option value="all">Vehicle type</option>
            <option value="bus">Bus</option>
            <option value="shuttle">Shuttle</option>
            <option value="van">Van</option>
          </select>
          <select defaultValue="all">
            <option value="all">Status</option>
            <option value="available">Available</option>
            <option value="service">Trip</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select defaultValue="all">
            <option value="all">Region</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="west">West</option>
          </select>
        </div>
      </section>

      <div className="dashboard-cards">
        {fleetCards.map((card) => (
          <div key={card.title} className={`dashboard-card accent-${card.accent}`}>
            <div className="card-top">
              <p className="muted">{card.title}</p>
              <span className="status-chip">{card.status}</span>
            </div>
            <h3>{card.value}</h3>
            <p className="muted">{card.detail}</p>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="section-title">
          <h3>Operational metrics</h3>
          <span className="muted">Live snapshot</span>
        </div>
        <div className="metrics-grid">
          {dashboardMetrics.map((item) => (
            <div key={item.label} className="metric-card">
              <p className="muted">{item.label}</p>
              <h3>{item.value}</h3>
              <span className={`metric-delta ${item.tone}`}>{item.delta}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h3>Fleet mix</h3>
          <span className="muted">Current distribution</span>
        </div>
        <div className="dashboard-pie-layout">
          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <svg width="180" height="180" viewBox="0 0 120 120" aria-label="Dashboard pie chart">
                <circle cx="60" cy="60" r="42" fill="none" stroke="#f3e5e5" strokeWidth="18" />
                {(() => {
                  const total = pieData.reduce((sum, item) => sum + item.value, 0)
                  let offset = 0
                  return pieData.map((segment) => {
                    const circumference = 2 * Math.PI * 42
                    const dash = (segment.value / total) * circumference
                    const circle = (
                      <circle
                        key={segment.label}
                        cx="60"
                        cy="60"
                        r="42"
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="18"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        className="status-ring"
                      />
                    )
                    offset += dash
                    return circle
                  })
                })()}
              </svg>
            </div>
            <div className="chart-legend">
              {pieData.map((item) => (
                <div key={item.label} className="legend-item">
                  <span className="legend-swatch" style={{ background: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card">
            <div className="section-title">
              <h3>Key indicators</h3>
              <span className="muted">Snapshot</span>
            </div>
            <div className="table-card">
              <div className="table-row">
                <div><strong>12</strong><p className="muted">Available vehicles</p></div>
                <div><strong>18</strong><p className="muted">Active vehicles</p></div>
              </div>
              <div className="table-row">
                <div><strong>6</strong><p className="muted">Maintenance</p></div>
                <div><strong>9</strong><p className="muted">Pending trips</p></div>
              </div>
              <div className="table-row">
                <div><strong>14</strong><p className="muted">Drivers on duty</p></div>
                <div><strong>81%</strong><p className="muted">Fleet utilization</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h3>Recent trips</h3>
          <a href="#">View all</a>
        </div>
        <div className="table-card">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="table-row">
              <div>
                <strong>{trip.id}</strong>
                <p className="muted">{trip.route}</p>
              </div>
              <div>
                <strong>{trip.driver}</strong>
                <p className="muted">Driver</p>
              </div>
              <div>
                <strong>{trip.status}</strong>
                <p className="muted">Status</p>
              </div>
              <div>
                <strong>{trip.eta}</strong>
                <p className="muted">ETA</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel analytics-panel">
        <div className="section-title">
          <h3>Operational analytics</h3>
          <span className="muted">Updated every minute</span>
        </div>
        <div className="analytics-grid">
          {analyticsCards.map((item) => (
            <div key={item.title} className="analytics-card">
              <p className="muted">{item.title}</p>
              <h3>{item.value}</h3>
              <p className="muted">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
