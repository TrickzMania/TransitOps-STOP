const pool = require("../config/db");

// GET /api/alerts
const getAllAlerts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alerts ORDER BY alert_id");

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts.",
    });
  }
};

// POST /api/alerts
const createAlert = async (req, res) => {
  try {
    const { vehicle_id, title, message, priority, status } = req.body;

    const result = await pool.query(
      `INSERT INTO alerts
      (vehicle_id, title, message, priority, status)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [vehicle_id, title, message, priority, status],
    );

    res.status(201).json({
      success: true,
      message: "Alert created successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to create alert.",
    });
  }
};

module.exports = {
  getAllAlerts,
  createAlert,
};
