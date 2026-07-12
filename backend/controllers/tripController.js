const pool = require("../config/db");

const getAllTrips = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trips ORDER BY trip_id");

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getAllTrips };
