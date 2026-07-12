import { useEffect, useState } from 'react'
import { getReports } from '../services/api'

function Reports() {
  const [summary, setSummary] = useState({ fuelCost: 0, maintenanceCost: 0, totalTrips: 0 })

  useEffect(() => {
    let ignore = false

    getReports()
      .then((data) => {
        if (!ignore && data) {
          setSummary(data)
        }
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [])

  const totalCost = Number(summary.fuelCost || 0) + Number(summary.maintenanceCost || 0)

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>ANALYTICS</h3>
          <button className="btn btn-primary">GENERATE</button>
        </div>
        <div className="reports-layout">
          <div className="reports-grid">
            <div className="info-card">
              <h4>TOTAL TRIPS</h4>
              <h3>{summary.totalTrips || 0}</h3>
              <p className="muted">Trips currently tracked</p>
            </div>
            <div className="info-card">
              <h4>FUEL COST</h4>
              <h3>Rs {Number(summary.fuelCost || 0).toLocaleString()}</h3>
              <p className="muted">Fuel spend from backend logs</p>
            </div>
            <div className="info-card">
              <h4>OPERATIONAL COST</h4>
              <h3>Rs {totalCost.toLocaleString()}</h3>
              <p className="muted">Fuel + maintenance</p>
            </div>
            <div className="info-card">
              <h4>MAINTENANCE COST</h4>
              <h3>Rs {Number(summary.maintenanceCost || 0).toLocaleString()}</h3>
              <p className="muted">Service cost from backend records</p>
            </div>
          </div>
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Monthly revenue</h3>
              <span className="muted">Last 6 months</span>
            </div>
            <div className="bar-chart">
              {[65, 72, 84, 91, 97, 108].map((value, index) => (
                <div key={index} className="bar-column">
                  <div className="bar-fill" style={{ height: `${value}%` }} />
                  <span className="muted">M{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Costliest vehicles</h3>
              <span className="muted">By operating cost</span>
            </div>
            <div className="progress-list">
              {[
                { label: 'River Express', value: '92%' },
                { label: 'Metro Cruiser', value: '76%' },
                { label: 'Sunset Van', value: '58%' },
              ].map((item) => (
                <div key={item.label} className="progress-row">
                  <div className="card-top">
                    <span>{item.label}</span>
                    <span className="muted">{item.value}</span>
                  </div>
                  <div className="progress-bar"><span style={{ width: item.value }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Reports
