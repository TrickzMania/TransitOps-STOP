const pool = require("../config/db");

const getReports = async (req, res) => {
  try {
    const monthlyFuel = await pool.query(
      "SELECT COALESCE(SUM(cost),0) AS fuel_cost FROM fuel_logs",
    );

    const maintenanceCost = await pool.query(
      "SELECT COALESCE(SUM(cost),0) AS maintenance_cost FROM maintenance_records",
    );

    const totalTrips = await pool.query(
      "SELECT COUNT(*) AS total_trips FROM trips",
    );

    res.json({
      success: true,
      data: {
        fuelCost: Number(monthlyFuel.rows[0].fuel_cost),
        maintenanceCost: Number(maintenanceCost.rows[0].maintenance_cost),
        totalTrips: Number(totalTrips.rows[0].total_trips),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to generate reports",
    });
  }
};

module.exports = {
  getReports,
};
