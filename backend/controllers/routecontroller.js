const pool = require("../config/db");

const getAllRoutes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM routes ORDER BY route_id");

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

module.exports = { getAllRoutes };
