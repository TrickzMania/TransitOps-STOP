import { useEffect, useMemo, useState } from 'react'
import { vehicles as initialVehicles } from '../data/mockData'
import { createVehicle, getVehicles, mapVehicle } from '../services/api'

const EMPTY_FORM = { registration_number: '', name_model: '', vehicle_type: 'Bus', capacity: '', odometer: '', acquisition_cost: '', status: 'Available' }

function Vehicles() {
  const [vehicleList, setVehicleList] = useState(initialVehicles)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let ignore = false
    getVehicles().then((data) => {
      if (!ignore && Array.isArray(data) && data.length) setVehicleList(data.map(mapVehicle))
    }).catch(() => {})
    return () => { ignore = true }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return vehicleList
    return vehicleList.filter((v) => [v.registrationNumber, v.nameModel, v.type, v.status].join(' ').toLowerCase().includes(q))
  }, [search, vehicleList])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.registration_number || !form.name_model) return setFormError('Registration number and model name are required.')
    setSaving(true)
    const optimistic = { ...mapVehicle({ ...form, vehicle_id: `tmp-${Date.now()}` }), registrationNumber: form.registration_number, nameModel: form.name_model, type: form.vehicle_type, capacity: form.capacity ? `${form.capacity} pax` : '-', odometer: form.odometer ? `${Number(form.odometer).toLocaleString()} km` : '-', acquisitionCost: form.acquisition_cost ? `Rs ${Number(form.acquisition_cost).toLocaleString()}` : '-' }
    setVehicleList((prev) => [optimistic, ...prev])
    setShowForm(false)
    setForm(EMPTY_FORM)
    try {
      const saved = await createVehicle({ ...form, capacity: form.capacity || null, odometer: form.odometer || 0, acquisition_cost: form.acquisition_cost || null })
      if (saved) setVehicleList((prev) => prev.map((v) => v.id === optimistic.id ? mapVehicle(saved) : v))
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save. Check registration number is unique.')
      setVehicleList((prev) => prev.filter((v) => v.id !== optimistic.id))
      setShowForm(true)
      setForm(form)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = (id, value) =>
    setVehicleList((prev) => prev.map((v) => (v.id === id ? { ...v, status: value } : v)))

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>Fleet inventory</h3>
          <div className="section-actions">
            <input className="search-box" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vehicles" />
            <button className="btn btn-primary" onClick={() => { setShowForm((v) => !v); setFormError('') }}>
              {showForm ? '✕ Cancel' : '+ Add vehicle'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="inline-form-panel">
            <h4>New vehicle</h4>
            {formError && <div className="auth-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Registration number *<input name="registration_number" value={form.registration_number} onChange={handleChange} placeholder="MH-01-AB-1234" required /></label>
                <label>Name / Model *<input name="name_model" value={form.name_model} onChange={handleChange} placeholder="City Liner" required /></label>
              </div>
              <div className="form-row">
                <label>Type
                  <select name="vehicle_type" value={form.vehicle_type} onChange={handleChange}>
                    <option>Bus</option><option>Shuttle</option><option>Van</option><option>Truck</option>
                  </select>
                </label>
                <label>Capacity (passengers)<input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} placeholder="48" /></label>
              </div>
              <div className="form-row">
                <label>Odometer (km)<input name="odometer" type="number" min="0" value={form.odometer} onChange={handleChange} placeholder="0" /></label>
                <label>Acquisition cost (₹)<input name="acquisition_cost" type="number" min="0" value={form.acquisition_cost} onChange={handleChange} placeholder="1200000" /></label>
              </div>
              <div className="form-row">
                <label>Status
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option>Available</option><option>Trip</option><option>Maintenance</option><option>Off duty</option><option>Suspended</option>
                  </select>
                </label>
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add vehicle'}</button>
            </form>
          </div>
        )}

        <div className="table-card">
          <div className="table-row table-head">
            <div>Registration</div><div>Name/Model</div><div>Type</div>
            <div>Capacity</div><div>Odometer</div><div>Acq. cost</div><div>Status</div>
          </div>
          {filtered.map((vehicle) => (
            <div key={vehicle.id} className="table-row">
              <div><strong>{vehicle.registrationNumber}</strong><p className="muted">{vehicle.id}</p></div>
              <div><strong>{vehicle.nameModel}</strong><p className="muted">Model line</p></div>
              <div><strong>{vehicle.type}</strong><p className="muted">Vehicle class</p></div>
              <div>{vehicle.capacity}</div>
              <div>{vehicle.odometer}</div>
              <div>{vehicle.acquisitionCost}</div>
              <div>
                <select className="status-select" value={vehicle.status} onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}>
                  <option>Available</option><option>Trip</option><option>Off duty</option><option>Suspended</option><option>Maintenance</option>
                </select>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="table-row"><div className="muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}>No vehicles found.</div></div>}
        </div>
      </section>
    </div>
  )
}

export default Vehicles
