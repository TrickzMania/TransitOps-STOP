const pool = require("../config/db");

const getAllVehicles = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM vehicles ORDER BY vehicle_id",
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles.",
    });
  }
};

module.exports = {
  getAllVehicles,
};
