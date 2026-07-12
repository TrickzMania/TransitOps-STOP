-- ============================================================
-- TransitOps Seed Data
-- ============================================================

-- Users (password for all is "password" in hackathon mode)
INSERT INTO users (full_name, email, role, phone) VALUES
  ('Admin User',    'admin@transitops.com',    'fleet-manager',    '+91 98000 00001'),
  ('Raj Dispatcher','dispatch@transitops.com', 'dispatcher',       '+91 98000 00002'),
  ('Priya Safety',  'safety@transitops.com',   'safety-officer',   '+91 98000 00003'),
  ('Amit Finance',  'finance@transitops.com',  'financial-analyst', '+91 98000 00004')
ON CONFLICT (email) DO NOTHING;

-- Vehicles
INSERT INTO vehicles (registration_number, name_model, vehicle_type, capacity, odometer, acquisition_cost, status) VALUES
  ('MH-01-AB-1234', 'Metro Cruiser',   'Shuttle', 32, 18420,  820000, 'Available'),
  ('MH-02-CD-5678', 'River Express',   'Bus',     48, 42118, 1285000, 'Trip'),
  ('MH-03-EF-9012', 'Sunset Van',      'Van',     12, 29001,  542000, 'Maintenance'),
  ('MH-04-GH-3456', 'City Liner',      'Bus',     52, 11200, 1450000, 'Available'),
  ('MH-05-IJ-7890', 'Rapid Shuttle',   'Shuttle', 28,  8750,  760000, 'Available'),
  ('MH-06-KL-2345', 'Night Rider',     'Bus',     45, 55300, 1320000, 'Off duty')
ON CONFLICT (registration_number) DO NOTHING;

-- Drivers
INSERT INTO drivers (full_name, license_no, license_category, license_expiry, phone, trip_completion, safety, status) VALUES
  ('Mina Patel',   'LIC-MH-4412', 'Class A', '2027-05-22', '+91 98100 11001', '96%', 'Excellent', 'Available'),
  ('Joel Kim',     'LIC-MH-1188', 'Class B', '2026-11-10', '+91 98100 11002', '88%', 'Monitor',   'Trip'),
  ('Nia Brooks',   'LIC-MH-7721', 'Class A', '2028-02-08', '+91 98100 11003', '93%', 'Excellent', 'Off duty'),
  ('Arjun Mehta',  'LIC-MH-3309', 'Class A', '2027-08-15', '+91 98100 11004', '91%', 'Good',      'Available'),
  ('Sara Thomas',  'LIC-MH-6654', 'Class B', '2026-07-30', '+91 98100 11005', '85%', 'Good',      'Available'),
  ('Dev Rao',      'LIC-MH-9981', 'Class A', '2029-01-20', '+91 98100 11006', '98%', 'Excellent', 'Available')
ON CONFLICT (license_no) DO NOTHING;

-- Trips
INSERT INTO trips (vehicle_id, driver_id, source, destination, cargo_weight_kg, planned_distance_km, trip_status) VALUES
  (1, 1, 'North Hub',    'Central Port', 1800, 124, 'Planned'),
  (2, 2, 'Harbor Line',  'West Yard',    3200, 216, 'Assigned'),
  (3, 3, 'West Campus',  'Airport',       900,  78, 'In transit'),
  (4, 4, 'East Depot',   'South Terminal',2500, 185, 'Completed'),
  (5, 5, 'City Centre',  'North Hub',    1200,  92, 'Planned');

-- Maintenance Records
INSERT INTO maintenance_records (vehicle_id, service_type, vendor_name, cost, service_date, status, priority) VALUES
  (3, 'Brake inspection', 'SpeedFix Garage',  12000, '2026-07-10', 'Pending',   'High'),
  (1, 'Oil change',       'QuickLube Centre',  7500, '2026-07-08', 'Scheduled', 'Medium'),
  (2, 'Tire rotation',    'TireKing Workshop', 3500, '2026-07-05', 'Completed', 'Low'),
  (4, 'AC service',       'CoolAuto Works',    9000, '2026-07-12', 'Pending',   'Medium'),
  (6, 'Engine check',     'MechPro Ltd',      15000, '2026-07-11', 'Scheduled', 'High');

-- Fuel Logs
INSERT INTO fuel_logs (vehicle_id, fuel_station, fuel_date, liters, cost, odometer) VALUES
  (1, 'HP Petrol, Andheri',    '2026-07-10', 48.5, 5820, 18380),
  (2, 'Indian Oil, Dadar',     '2026-07-09', 72.0, 8640, 42050),
  (3, 'BPCL, Kurla',           '2026-07-08', 32.0, 3840, 28970),
  (4, 'HP Petrol, Thane',      '2026-07-07', 60.0, 7200, 11140),
  (5, 'Indian Oil, Borivali',  '2026-07-06', 40.0, 4800,  8710),
  (2, 'Shell, BKC',            '2026-07-11', 65.0, 7800, 42100);

-- Expenses
INSERT INTO expenses (vehicle_id, expense_type, amount, expense_date, remarks) VALUES
  (2, 'Toll',     1245, '2026-07-10', 'Mumbai-Pune expressway tolls'),
  (3, 'Repairs',   860, '2026-07-08', 'Wiper blade replacement'),
  (1, 'Parking',   320, '2026-07-06', 'Airport overnight parking'),
  (4, 'Toll',      980, '2026-07-09', 'Western Express Highway'),
  (5, 'Repairs',  2200, '2026-07-07', 'Side mirror replacement'),
  (6, 'Parking',   450, '2026-07-05', 'Depot parking fee');

-- Alerts
INSERT INTO alerts (type, message, severity) VALUES
  ('maintenance', 'Sunset Van brake inspection overdue', 'high'),
  ('fuel',        'River Express fuel below 20%',         'medium'),
  ('license',     'Joel Kim license expiring in 4 months','low');
