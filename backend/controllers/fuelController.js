const pool = require("../config/db");

// GET /api/fuel
const getAllFuelLogs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM fuel_logs ORDER BY fuel_log_id",
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fuel logs.",
    });
  }
};

// POST /api/fuel
const createFuelLog = async (req, res) => {
  try {
    const { vehicle_id, fuel_station, fuel_date, liters, cost, odometer } =
      req.body;

    const result = await pool.query(
      `INSERT INTO fuel_logs
      (vehicle_id, fuel_station, fuel_date, liters, cost, odometer)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [vehicle_id, fuel_station, fuel_date, liters, cost, odometer],
    );

    res.status(201).json({
      success: true,
      message: "Fuel log created successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to create fuel log.",
    });
  }
};

module.exports = {
  getAllFuelLogs,
  createFuelLog,
};
