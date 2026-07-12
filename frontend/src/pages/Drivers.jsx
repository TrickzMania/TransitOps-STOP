import { useEffect, useMemo, useState } from 'react'
import { drivers as initialDrivers } from '../data/mockData'
import { createDriver, getDrivers, mapDriver } from '../services/api'

const EMPTY_FORM = { full_name: '', license_no: '', license_category: 'Class A', license_expiry: '', phone: '', status: 'Available' }

function Drivers() {
  const [driverList, setDriverList] = useState(initialDrivers)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let ignore = false
    getDrivers().then((data) => {
      if (!ignore && Array.isArray(data) && data.length) setDriverList(data.map(mapDriver))
    }).catch(() => {})
    return () => { ignore = true }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return driverList
    return driverList.filter((d) => [d.name, d.licenseNo, d.category, d.status].join(' ').toLowerCase().includes(q))
  }, [search, driverList])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.full_name || !form.license_no) return setFormError('Full name and license number are required.')
    setSaving(true)
    const optimistic = { id: `tmp-${Date.now()}`, name: form.full_name, licenseNo: form.license_no, category: form.license_category, expiry: form.license_expiry || '-', contact: form.phone || '-', tripCompletion: '0%', safety: 'Good', status: form.status }
    setDriverList((prev) => [optimistic, ...prev])
    setShowForm(false)
    setForm(EMPTY_FORM)
    try {
      const saved = await createDriver(form)
      if (saved) setDriverList((prev) => prev.map((d) => d.id === optimistic.id ? mapDriver(saved) : d))
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save. Check license number is unique.')
      setDriverList((prev) => prev.filter((d) => d.id !== optimistic.id))
      setShowForm(true)
      setForm(form)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = (id, value) =>
    setDriverList((prev) => prev.map((d) => (d.id === id ? { ...d, status: value } : d)))

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>Driver roster</h3>
          <div className="section-actions">
            <input className="search-box" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search drivers" />
            <button className="btn btn-primary" onClick={() => { setShowForm((v) => !v); setFormError('') }}>
              {showForm ? '✕ Cancel' : '+ Add driver'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="inline-form-panel">
            <h4>New driver</h4>
            {formError && <div className="auth-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Full name *<input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Raj Kumar" required /></label>
                <label>License number *<input name="license_no" value={form.license_no} onChange={handleChange} placeholder="LIC-MH-0001" required /></label>
              </div>
              <div className="form-row">
                <label>License category
                  <select name="license_category" value={form.license_category} onChange={handleChange}>
                    <option>Class A</option><option>Class B</option><option>Class C</option>
                  </select>
                </label>
                <label>License expiry<input name="license_expiry" type="date" value={form.license_expiry} onChange={handleChange} /></label>
              </div>
              <div className="form-row">
                <label>Phone<input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98100 00001" /></label>
                <label>Status
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option>Available</option><option>Trip</option><option>Off duty</option><option>Suspended</option>
                  </select>
                </label>
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add driver'}</button>
            </form>
          </div>
        )}

        <div className="table-card">
          <div className="table-row table-head">
            <div>Driver</div><div>License no</div><div>Category</div>
            <div>Expiry</div><div>Contact</div><div>Trip completion</div><div>Safety</div><div>Status</div>
          </div>
          {filtered.map((driver) => (
            <div key={driver.id} className="table-row">
              <div><strong>{driver.name}</strong><p className="muted">{driver.id}</p></div>
              <div>{driver.licenseNo}</div>
              <div>{driver.category}</div>
              <div>{driver.expiry}</div>
              <div>{driver.contact}</div>
              <div>{driver.tripCompletion}</div>
              <div>{driver.safety}</div>
              <div>
                <select className="status-select" value={driver.status} onChange={(e) => handleStatusChange(driver.id, e.target.value)}>
                  <option>Available</option><option>Trip</option><option>Off duty</option><option>Suspended</option>
                </select>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="table-row"><div className="muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}>No drivers found.</div></div>}
        </div>
      </section>
    </div>
  )
}

export default Drivers
