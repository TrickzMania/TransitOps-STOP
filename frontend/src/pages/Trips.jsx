import { useState } from 'react'
import { drivers as initialDrivers, trips as initialTrips, vehicles as initialVehicles } from '../data/mockData'

function Trips() {
  const [tripList, setTripList] = useState(initialTrips)
  const [form, setForm] = useState({ source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' })

  const availableVehicles = initialVehicles.filter((vehicle) => vehicle.status === 'Available')
  const availableDrivers = initialDrivers.filter((driver) => driver.status === 'Available')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.source || !form.destination || !form.vehicle || !form.driver || !form.cargoWeight || !form.plannedDistance) {
      return
    }

    const selectedVehicle = availableVehicles.find((vehicle) => vehicle.id === form.vehicle)
    const selectedDriver = availableDrivers.find((driver) => driver.id === form.driver)

    setTripList((current) => [
      {
        id: `TR-${String(current.length + 1042).padStart(4, '0')}`,
        source: form.source,
        destination: form.destination,
        vehicle: selectedVehicle?.nameModel || form.vehicle,
        driver: selectedDriver?.name || form.driver,
        cargoWeightKg: form.cargoWeight,
        plannedDistanceKm: form.plannedDistance,
        status: 'Planned',
      },
      ...current,
    ])

    setForm({ source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' })
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>Trip lifecycle</h3>
          <button className="btn btn-primary">New trip</button>
        </div>
        <div className="trip-layout">
          <div className="trip-stack">
            <div className="panel soft-panel">
              <div className="section-title">
                <h3>Live trip flow</h3>
                <span className="muted">Left-side operations</span>
              </div>
              <div className="timeline">
                {tripList.map((trip) => {
                  const steps = ['Planned', 'Assigned', 'In transit', 'Completed']
                  const activeIndex = Math.max(0, steps.indexOf(trip.status))

                  return (
                    <div key={trip.id} className="timeline-item">
                      <div className="timeline-marker" />
                      <div className="timeline-body">
                        <div className="card-top">
                          <strong>{trip.source} → {trip.destination}</strong>
                          <span className="status-chip">{trip.status}</span>
                        </div>
                        <p className="muted">Vehicle: {trip.vehicle} • Driver: {trip.driver}</p>
                        <div className="timeline-steps">
                          {steps.map((step, index) => (
                            <span key={step} className={`timeline-step ${index <= activeIndex ? 'active' : ''}`}>
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="panel soft-panel">
              <div className="section-title">
                <h3>Create trip</h3>
                <span className="muted">Add a new route</span>
              </div>
              <form className="trip-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>
                    Source
                    <input name="source" value={form.source} onChange={handleChange} placeholder="Pickup point" />
                  </label>
                  <label>
                    Destination
                    <input name="destination" value={form.destination} onChange={handleChange} placeholder="Drop-off point" />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Vehicle
                    <select name="vehicle" value={form.vehicle} onChange={handleChange}>
                      <option value="">Select available vehicle</option>
                      {availableVehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>{vehicle.nameModel}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Driver
                    <select name="driver" value={form.driver} onChange={handleChange}>
                      <option value="">Select available driver</option>
                      {availableDrivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>{driver.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Cargo weight (kg)
                    <input name="cargoWeight" value={form.cargoWeight} onChange={handleChange} placeholder="1800" />
                  </label>
                  <label>
                    Planned distance (km)
                    <input name="plannedDistance" value={form.plannedDistance} onChange={handleChange} placeholder="124" />
                  </label>
                </div>
                <button className="btn btn-primary" type="submit">Create trip</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Trips
