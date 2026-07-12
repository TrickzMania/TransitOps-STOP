import { maintenanceTasks } from '../data/mockData'

function Maintenance() {
  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>MAINTENANCE</h3>
          <button className="btn btn-primary">LOG SERVICE</button>
        </div>
        <div className="maintenance-layout">
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Service record</h3>
              <span className="muted">Fill details</span>
            </div>
            <form className="maintenance-form">
              <label>
                Vehicle
                <input placeholder="Select vehicle" />
              </label>
              <label>
                Service type
                <select defaultValue="">
                  <option value="" disabled>Choose service</option>
                  <option>Oil change</option>
                  <option>Brake inspection</option>
                  <option>Tire rotation</option>
                </select>
              </label>
              <label>
                Cost
                <input placeholder="₹0.00" />
              </label>
              <label>
                Date
                <input type="date" />
              </label>
              <label>
                Status
                <select defaultValue="Pending">
                  <option>Pending</option>
                  <option>Scheduled</option>
                  <option>Completed</option>
                </select>
              </label>
              <button className="btn btn-primary" type="button">SAVE</button>
            </form>
          </div>
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Service log</h3>
              <span className="muted">Recent entries</span>
            </div>
            <div className="table-card">
              <div className="table-row table-head">
                <div>Vehicle</div>
                <div>Service</div>
                <div>Cost</div>
                <div>Status</div>
              </div>
              {maintenanceTasks.map((task) => (
                <div key={task.id} className="table-row">
                  <div>
                    <strong>{task.vehicle}</strong>
                    <p className="muted">{task.id}</p>
                  </div>
                  <div>{task.task}</div>
                  <div>{task.priority === 'High' ? '₹12,000' : task.priority === 'Medium' ? '₹7,500' : '₹3,000'}</div>
                  <div>{task.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Maintenance
