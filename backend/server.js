require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Database
require("./config/db");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

// ======================
// Route Imports
// ======================

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const routeRoutes = require("./routes/routeRoutes");
const tripRoutes = require("./routes/tripRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const fuelRoutes = require("./routes/fuelRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const alertRoutes = require("./routes/alertRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");

// ======================
// API Routes
// ======================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    application: "TransitOps",
    message: "Backend Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/trips", tripRoutes);

app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/alerts", alertRoutes);

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
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TransitOps backend running on port ${PORT}`);
});
