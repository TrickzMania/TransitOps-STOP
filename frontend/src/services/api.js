import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
})

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('transitops_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const unwrap = (response) => response.data?.data ?? response.data
const asCurrency = (value) => `Rs ${Number(value || 0).toLocaleString()}`
const asDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: '2-digit' }) : '-'

// ─── Auth ───────────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

// ─── Reads ───────────────────────────────────────────────────────────────────
export const getDashboard = async () => unwrap(await api.get('/dashboard'))
export const getReports   = async () => unwrap(await api.get('/reports'))
export const getVehicles  = async () => unwrap(await api.get('/vehicles'))
export const getDrivers   = async () => unwrap(await api.get('/drivers'))
export const getTrips     = async () => unwrap(await api.get('/trips'))
export const getMaintenance = async () => unwrap(await api.get('/maintenance'))
export const getFuelLogs  = async () => unwrap(await api.get('/fuel'))
export const getExpenses  = async () => unwrap(await api.get('/expenses'))

// ─── Writes ──────────────────────────────────────────────────────────────────
export const createTrip = async (payload) => unwrap(await api.post('/trips', payload))
export const createMaintenance = async (payload) => unwrap(await api.post('/maintenance', payload))
export const createFuelLog = async (payload) => unwrap(await api.post('/fuel', payload))
export const createExpense = async (payload) => unwrap(await api.post('/expenses', payload))

// ─── Mappers ─────────────────────────────────────────────────────────────────
export const mapVehicle = (vehicle) => ({
  id: vehicle.vehicle_id || vehicle.id || vehicle.registration_number,
  registrationNumber: vehicle.registration_number || vehicle.registrationNumber || vehicle.registration_no || '-',
  nameModel: vehicle.name_model || vehicle.nameModel || vehicle.model || vehicle.vehicle_name || 'Vehicle',
  type: vehicle.vehicle_type || vehicle.type || '-',
  capacity: vehicle.capacity
    ? `${vehicle.capacity} pax`
    : vehicle.capacity_text || vehicle.capacity || '-',
  odometer:
    vehicle.odometer || vehicle.odometer_reading
      ? `${Number(vehicle.odometer || vehicle.odometer_reading).toLocaleString()} km`
      : '-',
  acquisitionCost:
    vehicle.acquisition_cost || vehicle.acquisitionCost
      ? asCurrency(vehicle.acquisition_cost || vehicle.acquisitionCost)
      : '-',
  status: vehicle.status || 'Available',
})

export const mapDriver = (driver) => ({
  id: driver.driver_id || driver.id || driver.license_no,
  name: driver.full_name || driver.name || 'Driver',
  licenseNo: driver.license_no || driver.license_number || driver.licenseNo || '-',
  category: driver.license_category || driver.category || '-',
  expiry:
    driver.license_expiry || driver.expiry
      ? asDate(driver.license_expiry || driver.expiry)
      : '-',
  contact: driver.phone || driver.contact || driver.contact_number || '-',
  tripCompletion: driver.trip_completion || driver.tripCompletion || '-',
  safety: driver.safety || 'Good',
  status: driver.status || 'Available',
})

export const mapTrip = (trip) => ({
  id: trip.trip_id ? `TR-${trip.trip_id}` : trip.id,
  source: trip.source || trip.origin || '-',
  destination: trip.destination || '-',
  vehicle: trip.vehicle_name || trip.name_model || trip.vehicle || trip.vehicle_id || '-',
  driver: trip.driver_name || trip.full_name || trip.driver || trip.driver_id || '-',
  cargoWeightKg: trip.cargo_weight_kg || trip.cargoWeightKg || trip.cargo_weight || '-',
  plannedDistanceKm:
    trip.planned_distance_km || trip.plannedDistanceKm || trip.distance_km || '-',
  status: trip.trip_status || trip.status || 'Planned',
})

export const mapMaintenance = (record) => ({
  id: record.maintenance_id ? `MT-${record.maintenance_id}` : record.id,
  vehicle:
    record.vehicle_name || record.name_model || record.vehicle || record.vehicle_id || '-',
  task: record.service_type || record.task || record.description || 'Service',
  priority: record.priority || 'Medium',
  cost: asCurrency(record.cost),
  status: record.status || 'Pending',
})

export const mapFuelLog = (log) => ({
  id: log.fuel_log_id ? `FL-${log.fuel_log_id}` : log.id,
  vehicle: log.vehicle_name || log.name_model || log.vehicle || log.vehicle_id || '-',
  date: asDate(log.fuel_date || log.date),
  liters: log.liters ? `${Number(log.liters).toLocaleString()} L` : '-',
  amount: asCurrency(log.cost || log.amount),
})

export const mapExpense = (expense) => ({
  id: expense.expense_id ? `EXP-${expense.expense_id}` : expense.id,
  category: expense.expense_type || expense.category || 'Expense',
  amount: asCurrency(expense.amount),
  date: asDate(expense.expense_date || expense.date),
  vehicle:
    expense.vehicle_name || expense.name_model || expense.vehicle || expense.vehicle_id || '-',
})

export default api
