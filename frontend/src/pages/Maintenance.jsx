import { useEffect, useState } from 'react'
import { maintenanceTasks } from '../data/mockData'
import { createMaintenance, getMaintenance, getVehicles, mapMaintenance, mapVehicle } from '../services/api'

function Maintenance() {
  const [serviceLog, setServiceLog] = useState(maintenanceTasks)
  const [vehicleList, setVehicleList] = useState([])
  const [form, setForm] = useState({
    vehicle_id: '',
    service_type: '',
    cost: '',
    service_date: '',
    status: 'Pending',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    let ignore = false

    Promise.allSettled([getMaintenance(), getVehicles()]).then(([maintResult, vehiclesResult]) => {
      if (ignore) return
      if (maintResult.status === 'fulfilled' && Array.isArray(maintResult.value) && maintResult.value.length) {
        setServiceLog(maintResult.value.map(mapMaintenance))
      }
      if (vehiclesResult.status === 'fulfilled' && Array.isArray(vehiclesResult.value) && vehiclesResult.value.length) {
        setVehicleList(vehiclesResult.value.map(mapVehicle))
      }
    })

    return () => {
      ignore = true
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveError('')
    if (!form.service_type) return

    const selectedVehicle = vehicleList.find((v) => String(v.id) === form.vehicle_id)

    // Optimistic entry
    const optimistic = {
      id: `MT-new-${Date.now()}`,
      vehicle: selectedVehicle?.nameModel || form.vehicle_id || '-',
      task: form.service_type,
      priority: 'Medium',
      cost: form.cost ? `Rs ${Number(form.cost).toLocaleString()}` : 'Rs 0',
      status: form.status,
    }
    setServiceLog((current) => [optimistic, ...current])
    setForm({ vehicle_id: '', service_type: '', cost: '', service_date: '', status: 'Pending' })

    setSaving(true)
    try {
      const saved = await createMaintenance({
        vehicle_id: form.vehicle_id || null,
        service_type: form.service_type,
        cost: form.cost || null,
        service_date: form.service_date || null,
        status: form.status,
      })
      if (saved) {
        setServiceLog((current) =>
          current.map((t) => (t.id === optimistic.id ? mapMaintenance(saved) : t))
        )
      }
    } catch {
      setSaveError('Record saved locally but failed to sync with server.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>Maintenance</h3>
          <button className="btn btn-primary">Log service</button>
        </div>
        <div className="maintenance-layout">
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Service record</h3>
              <span className="muted">Fill details</span>
            </div>
            {saveError && <p className="muted" style={{ color: 'var(--color-danger, #f87171)' }}>{saveError}</p>}
            <form className="maintenance-form" onSubmit={handleSubmit}>
              <label>
                Vehicle
                <select name="vehicle_id" value={form.vehicle_id} onChange={handleChange}>
                  <option value="">Select vehicle</option>
                  {vehicleList.map((v) => (
                    <option key={v.id} value={v.id}>{v.nameModel} ({v.registrationNumber})</option>
                  ))}
                </select>
              </label>
              <label>
                Service type
                <select name="service_type" value={form.service_type} onChange={handleChange}>
                  <option value="" disabled>Choose service</option>
                  <option>Oil change</option>
                  <option>Brake inspection</option>
                  <option>Tire rotation</option>
                  <option>Engine check</option>
                  <option>AC service</option>
                  <option>Body repair</option>
                </select>
              </label>
              <label>
                Cost (₹)
                <input name="cost" value={form.cost} onChange={handleChange} placeholder="0.00" type="number" min="0" />
              </label>
              <label>
                Date
                <input name="service_date" value={form.service_date} onChange={handleChange} type="date" />
              </label>
              <label>
                Status
                <select name="status" value={form.status} onChange={handleChange}>
                  <option>Pending</option>
                  <option>Scheduled</option>
                  <option>Completed</option>
                </select>
              </label>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
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
              {serviceLog.map((task) => (
                <div key={task.id} className="table-row">
                  <div>
                    <strong>{task.vehicle}</strong>
                    <p className="muted">{task.id}</p>
                  </div>
                  <div>{task.task}</div>
                  <div>{task.cost}</div>
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
