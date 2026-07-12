import { useMemo, useState } from 'react'
import { vehicles as initialVehicles } from '../data/mockData'

function Vehicles() {
  const [vehicleList, setVehicleList] = useState(initialVehicles)
  const [search, setSearch] = useState('')

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return vehicleList

    return vehicleList.filter((vehicle) =>
      [vehicle.registrationNumber, vehicle.nameModel, vehicle.type, vehicle.status].join(' ').toLowerCase().includes(query),
    )
  }, [search, vehicleList])

  const handleStatusChange = (id, value) => {
    setVehicleList((current) => current.map((vehicle) => (vehicle.id === id ? { ...vehicle, status: value } : vehicle)))
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>Fleet inventory</h3>
          <div className="section-actions">
            <input className="search-box" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vehicles" />
            <button className="btn btn-primary">Add vehicle</button>
          </div>
        </div>
        <div className="table-card">
          <div className="table-row table-head">
            <div>Registration</div>
            <div>Name/Model</div>
            <div>Type</div>
            <div>Capacity</div>
            <div>Odometer</div>
            <div>Acq. cost</div>
            <div>Status</div>
          </div>
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="table-row">
              <div>
                <strong>{vehicle.registrationNumber}</strong>
                <p className="muted">{vehicle.id}</p>
              </div>
              <div>
                <strong>{vehicle.nameModel}</strong>
                <p className="muted">Model line</p>
              </div>
              <div>
                <strong>{vehicle.type}</strong>
                <p className="muted">Vehicle class</p>
              </div>
              <div>{vehicle.capacity}</div>
              <div>{vehicle.odometer}</div>
              <div>{vehicle.acquisitionCost}</div>
              <div>
                <select className="status-select" value={vehicle.status} onChange={(event) => handleStatusChange(vehicle.id, event.target.value)}>
                  <option value="Available">Available</option>
                  <option value="Trip">Trip</option>
                  <option value="Off duty">Off duty</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Vehicles
