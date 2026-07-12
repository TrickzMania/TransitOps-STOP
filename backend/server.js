require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Database
const pool = require("./config/db");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

// ======================
// Auto-initialize DB
// ======================

async function initDB() {
  try {
    // Check if users table exists
    const check = await pool.query(
      `SELECT to_regclass('public.users') AS exists`
    );

    if (!check.rows[0].exists) {
      console.log("🔧 First run — creating database schema...");
      const schemaPath = path.join(__dirname, "..", "database", "schema.sql");
      const seedPath   = path.join(__dirname, "..", "database", "seed.sql");

      if (fs.existsSync(schemaPath)) {
        await pool.query(fs.readFileSync(schemaPath, "utf8"));
        console.log("✅ Schema created.");
      }
      if (fs.existsSync(seedPath)) {
        await pool.query(fs.readFileSync(seedPath, "utf8"));
        console.log("✅ Seed data inserted.");
      }
      console.log("🚀 Database ready!");
    } else {
      console.log("✅ Database schema already exists.");
    }
  } catch (err) {
    console.error("⚠️  DB init warning:", err.message);
  }
}

// ======================
// Route Imports
// ======================

const authRoutes        = require("./routes/authRoutes");
const vehicleRoutes     = require("./routes/vehicleRoutes");
const driverRoutes      = require("./routes/driverRoutes");
const routeRoutes       = require("./routes/routeRoutes");
const tripRoutes        = require("./routes/tripRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const fuelRoutes        = require("./routes/fuelRoutes");
const expenseRoutes     = require("./routes/expenseRoutes");
const alertRoutes       = require("./routes/alertRoutes");
const dashboardRoutes   = require("./routes/dashboardRoutes");
const reportRoutes      = require("./routes/reportRoutes");

// ======================
// API Routes
// ======================

app.get("/api/health", (req, res) => {
  res.json({ success: true, application: "TransitOps", message: "Backend Running" });
});

app.use("/api/auth",        authRoutes);
app.use("/api/dashboard",   dashboardRoutes);
app.use("/api/reports",     reportRoutes);
app.use("/api/vehicles",    vehicleRoutes);
app.use("/api/drivers",     driverRoutes);
app.use("/api/routes",      routeRoutes);
app.use("/api/trips",       tripRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/fuel",        fuelRoutes);
app.use("/api/expenses",    expenseRoutes);
app.use("/api/alerts",      alertRoutes);

// ======================
// Frontend Build
// ======================

const frontendDist = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDist));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// ======================
// 404
// ======================

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`TransitOps backend running on port ${PORT}`);
  await initDB();
});
