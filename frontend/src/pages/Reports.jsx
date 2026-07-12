import { reports } from '../data/mockData'

function Reports() {
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
              <h4>FUEL EFFICIENCY</h4>
              <h3>8.3 MPG</h3>
              <p className="muted">Improved by 0.4 mpg this month</p>
            </div>
            <div className="info-card">
              <h4>FLEET UTILIZATION</h4>
              <h3>81%</h3>
              <p className="muted">Above current target</p>
            </div>
            <div className="info-card">
              <h4>OPERATIONAL COST</h4>
              <h3>Rs 24.6K</h3>
              <p className="muted">Fuel + maintenance</p>
            </div>
            <div className="info-card">
              <h4>VEHICLE ROI</h4>
              <h3>14.8%</h3>
              <p className="muted">Revenue minus fuel and maintenance</p>
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
