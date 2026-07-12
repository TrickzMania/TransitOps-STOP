import { expenses } from '../data/mockData'

function FuelExpenses() {
  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>FUEL & EXPENSES</h3>
          <div className="section-actions">
            <button className="btn btn-secondary">ADD FUEL LOG</button>
            <button className="btn btn-primary">ADD EXPENSE</button>
          </div>
        </div>
        <div className="fuel-layout">
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Fuel log</h3>
              <span className="muted">Recent entries</span>
            </div>
            <div className="table-card">
              <div className="table-row table-head">
                <div>Vehicle</div>
                <div>Date</div>
                <div>Litres</div>
                <div>Fuel cost</div>
              </div>
              {expenses.slice(0, 2).map((expense) => (
                <div key={expense.id} className="table-row">
                  <div>{expense.vehicle}</div>
                  <div>{expense.date}</div>
                  <div>48 L</div>
                  <div>{expense.amount}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Other expenses</h3>
              <span className="muted">Tolls & misc.</span>
            </div>
            <div className="table-card">
              <div className="table-row table-head">
                <div>Trips</div>
                <div>Vehicles</div>
                <div>Type</div>
                <div>Total</div>
              </div>
              <div className="table-row">
                <div>TR-1042</div>
                <div>V-101</div>
                <div>Toll</div>
                <div>₹320</div>
              </div>
              <div className="table-row">
                <div>TR-1043</div>
                <div>V-102</div>
                <div>Misc.</div>
                <div>₹180</div>
              </div>
              <div className="table-row">
                <div>TR-1044</div>
                <div>V-103</div>
                <div>Maint.</div>
                <div>₹450</div>
              </div>
            </div>
            <div className="summary-card" style={{ marginTop: '10px' }}>
              <h4>TOTAL OPERATIONAL COST</h4>
              <p className="muted">Fuel + maintenance = ₹24,600</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FuelExpenses
