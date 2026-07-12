-- ============================================================
-- TransitOps Database Schema
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
  user_id     SERIAL PRIMARY KEY,
  full_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  role        VARCHAR(50)  NOT NULL DEFAULT 'fleet-manager',
  phone       VARCHAR(20),
  created_at  TIMESTAMP    DEFAULT NOW()
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id          SERIAL PRIMARY KEY,
  registration_number VARCHAR(30)  UNIQUE NOT NULL,
  name_model          VARCHAR(100) NOT NULL,
  vehicle_type        VARCHAR(50),
  capacity            INTEGER,
  odometer            NUMERIC(10,2) DEFAULT 0,
  acquisition_cost    NUMERIC(12,2),
  status              VARCHAR(30)  DEFAULT 'Available',
  created_at          TIMESTAMP    DEFAULT NOW()
);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
  driver_id        SERIAL PRIMARY KEY,
  full_name        VARCHAR(100) NOT NULL,
  license_no       VARCHAR(50)  UNIQUE NOT NULL,
  license_category VARCHAR(20),
  license_expiry   DATE,
  phone            VARCHAR(20),
  trip_completion  VARCHAR(10)  DEFAULT '0%',
  safety           VARCHAR(30)  DEFAULT 'Good',
  status           VARCHAR(30)  DEFAULT 'Available',
  created_at       TIMESTAMP    DEFAULT NOW()
);

-- Routes
CREATE TABLE IF NOT EXISTS routes (
  route_id    SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  origin      VARCHAR(100),
  destination VARCHAR(100),
  distance_km NUMERIC(8,2),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  trip_id             SERIAL PRIMARY KEY,
  vehicle_id          INTEGER REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
  driver_id           INTEGER REFERENCES drivers(driver_id)   ON DELETE SET NULL,
  source              VARCHAR(100),
  destination         VARCHAR(100),
  cargo_weight_kg     NUMERIC(8,2),
  planned_distance_km NUMERIC(8,2),
  trip_status         VARCHAR(30) DEFAULT 'Planned',
  started_at          TIMESTAMP,
  completed_at        TIMESTAMP,
  created_at          TIMESTAMP DEFAULT NOW()
);

-- Maintenance Records
CREATE TABLE IF NOT EXISTS maintenance_records (
  maintenance_id   SERIAL PRIMARY KEY,
  vehicle_id       INTEGER REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
  service_type     VARCHAR(100),
  vendor_name      VARCHAR(100),
  description      TEXT,
  cost             NUMERIC(10,2) DEFAULT 0,
  service_date     DATE,
  next_service_due DATE,
  status           VARCHAR(30) DEFAULT 'Pending',
  priority         VARCHAR(20) DEFAULT 'Medium',
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Fuel Logs
CREATE TABLE IF NOT EXISTS fuel_logs (
  fuel_log_id  SERIAL PRIMARY KEY,
  vehicle_id   INTEGER REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
  fuel_station VARCHAR(100),
  fuel_date    DATE DEFAULT CURRENT_DATE,
  liters       NUMERIC(8,2),
  cost         NUMERIC(10,2),
  odometer     NUMERIC(10,2),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  expense_id   SERIAL PRIMARY KEY,
  vehicle_id   INTEGER REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
  expense_type VARCHAR(100),
  amount       NUMERIC(10,2),
  expense_date DATE DEFAULT CURRENT_DATE,
  remarks      TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  alert_id    SERIAL PRIMARY KEY,
  type        VARCHAR(50),
  message     TEXT,
  severity    VARCHAR(20) DEFAULT 'info',
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);
