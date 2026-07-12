import { useEffect, useState } from 'react'
import { drivers as initialDrivers, trips as initialTrips, vehicles as initialVehicles } from '../data/mockData'
import { createTrip, getDrivers, getTrips, getVehicles, mapDriver, mapTrip, mapVehicle } from '../services/api'

function Trips() {
  const [tripList, setTripList] = useState(initialTrips)
  const [driverList, setDriverList] = useState(initialDrivers)
  const [vehicleList, setVehicleList] = useState(initialVehicles)
  const [form, setForm] = useState({
    source: '',
    destination: '',
    vehicle: '',
    driver: '',
    cargoWeight: '',
    plannedDistance: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const availableVehicles = vehicleList.filter((v) => v.status === 'Available')
  const availableDrivers = driverList.filter((d) => d.status === 'Available')

  useEffect(() => {
    let ignore = false

    Promise.allSettled([getTrips(), getVehicles(), getDrivers()]).then(
      ([tripsResult, vehiclesResult, driversResult]) => {
        if (ignore) return

        if (tripsResult.status === 'fulfilled' && Array.isArray(tripsResult.value) && tripsResult.value.length) {
          setTripList(tripsResult.value.map(mapTrip))
        }
        if (vehiclesResult.status === 'fulfilled' && Array.isArray(vehiclesResult.value) && vehiclesResult.value.length) {
          setVehicleList(vehiclesResult.value.map(mapVehicle))
        }
        if (driversResult.status === 'fulfilled' && Array.isArray(driversResult.value) && driversResult.value.length) {
          setDriverList(driversResult.value.map(mapDriver))
        }
      }
    )

    return () => {
      ignore = true
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaveError('')
    if (!form.source || !form.destination) return

    const selectedVehicle = availableVehicles.find((v) => String(v.id) === form.vehicle)
    const selectedDriver = availableDrivers.find((d) => String(d.id) === form.driver)

    // Optimistic UI update
    const optimisticTrip = {
      id: `TR-new-${Date.now()}`,
      source: form.source,
      destination: form.destination,
      vehicle: selectedVehicle?.nameModel || form.vehicle || '-',
      driver: selectedDriver?.name || form.driver || '-',
      cargoWeightKg: form.cargoWeight,
      plannedDistanceKm: form.plannedDistance,
      status: 'Planned',
    }
    setTripList((current) => [optimisticTrip, ...current])
    setForm({ source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' })

    setSaving(true)
    try {
      const saved = await createTrip({
        vehicle_id: form.vehicle || null,
        driver_id: form.driver || null,
        source: form.source,
        destination: form.destination,
        cargo_weight_kg: form.cargoWeight || null,
        planned_distance_km: form.plannedDistance || null,
        trip_status: 'Planned',
      })
      // Replace optimistic entry with real DB entry
      if (saved) {
        setTripList((current) =>
          current.map((t) =>
            t.id === optimisticTrip.id ? mapTrip(saved) : t
          )
        )
      }
    } catch {
      setSaveError('Trip saved locally but failed to sync with server.')
    } finally {
      setSaving(false)
    }
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
                          <strong>{trip.source} to {trip.destination}</strong>
                          <span className="status-chip">{trip.status}</span>
                        </div>
                        <p className="muted">Vehicle: {trip.vehicle} | Driver: {trip.driver}</p>
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
              {saveError && <p className="muted" style={{ color: 'var(--color-danger, #f87171)' }}>{saveError}</p>}
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
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Create trip'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Trips
