import { useMemo, useState } from 'react'
import { drivers as initialDrivers } from '../data/mockData'

function Drivers() {
  const [driverList, setDriverList] = useState(initialDrivers)
  const [search, setSearch] = useState('')

  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return driverList

    return driverList.filter((driver) =>
      [driver.name, driver.licenseNo, driver.category, driver.status].join(' ').toLowerCase().includes(query),
    )
  }, [search, driverList])

  const handleStatusChange = (id, value) => {
    setDriverList((current) => current.map((driver) => (driver.id === id ? { ...driver, status: value } : driver)))
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>Driver roster</h3>
          <div className="section-actions">
            <input className="search-box" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search drivers" />
            <button className="btn btn-primary">Add driver</button>
          </div>
        </div>
        <div className="table-card">
          <div className="table-row table-head">
            <div>Driver</div>
            <div>License no</div>
            <div>Category</div>
            <div>Expiry</div>
            <div>Contact</div>
            <div>Trip completion</div>
            <div>Safety</div>
            <div>Status</div>
          </div>
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="table-row">
              <div>
                <strong>{driver.name}</strong>
                <p className="muted">{driver.id}</p>
              </div>
              <div>{driver.licenseNo}</div>
              <div>{driver.category}</div>
              <div>{driver.expiry}</div>
              <div>{driver.contact}</div>
              <div>{driver.tripCompletion}</div>
              <div>{driver.safety}</div>
              <div>
                <select className="status-select" value={driver.status} onChange={(event) => handleStatusChange(driver.id, event.target.value)}>
                  <option value="Available">Available</option>
                  <option value="Trip">Trip</option>
                  <option value="Off duty">Off duty</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Drivers
