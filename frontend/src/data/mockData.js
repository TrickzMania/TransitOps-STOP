export const dashboardMetrics = [
  { label: 'Dispatch load', value: '72%', delta: '+5%', tone: 'good' },
  { label: 'Maintenance backlog', value: '4.2h', delta: '-1h', tone: 'neutral' },
  { label: 'Fuel efficiency', value: '8.3 mpg', delta: '+0.4', tone: 'good' },
]

export const recentTrips = [
  { id: 'TR-1042', route: 'North Loop', driver: 'Mina Patel', status: 'On time', eta: '08:30' },
  { id: 'TR-1043', route: 'Harbor Line', driver: 'Joel Kim', status: 'Delayed', eta: '09:10' },
  { id: 'TR-1044', route: 'West Campus', driver: 'Nia Brooks', status: 'On time', eta: '09:45' },
]

export const vehicles = [
  { id: 'V-101', registrationNumber: 'ABC-102', nameModel: 'Metro Cruiser', type: 'Shuttle', capacity: '32 pax', odometer: '18,420 km', acquisitionCost: '$82,000', status: 'Available' },
  { id: 'V-102', registrationNumber: 'DEF-204', nameModel: 'River Express', type: 'Bus', capacity: '48 pax', odometer: '42,118 km', acquisitionCost: '$128,500', status: 'Trip' },
  { id: 'V-103', registrationNumber: 'GHI-308', nameModel: 'Sunset Van', type: 'Van', capacity: '12 pax', odometer: '29,001 km', acquisitionCost: '$54,200', status: 'Maintenance' },
]

export const drivers = [
  { id: 'D-201', name: 'Mina Patel', licenseNo: 'LIC-4412', category: 'Class A', expiry: '2027-05-22', contact: '+1 555 0142', tripCompletion: '96%', safety: 'Excellent', status: 'Available' },
  { id: 'D-202', name: 'Joel Kim', licenseNo: 'LIC-1188', category: 'Class B', expiry: '2026-11-10', contact: '+1 555 0143', tripCompletion: '88%', safety: 'Monitor', status: 'Trip' },
  { id: 'D-203', name: 'Nia Brooks', licenseNo: 'LIC-7721', category: 'Class A', expiry: '2028-02-08', contact: '+1 555 0144', tripCompletion: '93%', safety: 'Excellent', status: 'Off duty' },
]

export const trips = [
  { id: 'TR-1042', source: 'North Hub', destination: 'Central Port', vehicle: 'Metro Cruiser', driver: 'Mina Patel', cargoWeightKg: '1800', plannedDistanceKm: '124', status: 'Planned' },
  { id: 'TR-1043', source: 'Harbor Line', destination: 'West Yard', vehicle: 'River Express', driver: 'Joel Kim', cargoWeightKg: '3200', plannedDistanceKm: '216', status: 'Assigned' },
  { id: 'TR-1044', source: 'West Campus', destination: 'Airport', vehicle: 'Sunset Van', driver: 'Nia Brooks', cargoWeightKg: '900', plannedDistanceKm: '78', status: 'In transit' },
]

export const maintenanceTasks = [
  { id: 'MT-301', vehicle: 'Sunset Van', task: 'Brake inspection', priority: 'High', status: 'Pending' },
  { id: 'MT-302', vehicle: 'Metro Cruiser', task: 'Oil change', priority: 'Medium', status: 'Scheduled' },
  { id: 'MT-303', vehicle: 'River Express', task: 'Tire rotation', priority: 'Low', status: 'Complete' },
]

export const expenses = [
  { id: 'EXP-401', category: 'Fuel', amount: '₹1,245', date: 'Jul 10', vehicle: 'V-102' },
  { id: 'EXP-402', category: 'Repairs', amount: '₹860', date: 'Jul 08', vehicle: 'V-103' },
  { id: 'EXP-403', category: 'Parking', amount: '₹320', date: 'Jul 06', vehicle: 'V-101' },
]

export const reports = [
  { title: 'Weekly utilization', value: '81%', detail: 'Up 5% from last week' },
  { title: 'Maintenance SLA', value: '92%', detail: 'Above target' },
  { title: 'Cost per trip', value: '$18.40', detail: 'Down 2.1%' },
]

export const settingsOptions = [
  { label: 'Auto-sync dispatch board', enabled: true },
  { label: 'Push maintenance alerts', enabled: true },
  { label: 'Dark mode', enabled: true },
]
