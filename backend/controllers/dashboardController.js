const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const vehicles = await pool.query("SELECT COUNT(*) FROM vehicles");

    const drivers = await pool.query("SELECT COUNT(*) FROM drivers");

    const activeTrips = await pool.query(
      "SELECT COUNT(*) FROM trips WHERE trip_status='Active'",
    );

    const maintenance = await pool.query(
      "SELECT COUNT(*) FROM maintenance_records",
    );

    res.json({
      success: true,
      data: {
        totalVehicles: Number(vehicles.rows[0].count),
        totalDrivers: Number(drivers.rows[0].count),
        activeTrips: Number(activeTrips.rows[0].count),
        maintenanceRecords: Number(maintenance.rows[0].count),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getDashboard };
