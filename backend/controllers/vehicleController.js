const pool = require("../config/db");

// GET /api/vehicles
const getAllVehicles = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY vehicle_id");
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch vehicles." });
  }
};

// POST /api/vehicles
const createVehicle = async (req, res) => {
  try {
    const { registration_number, name_model, vehicle_type, capacity, odometer, acquisition_cost, status } = req.body;

    if (!registration_number || !name_model) {
      return res.status(400).json({ success: false, message: "Registration number and model name are required." });
    }

    const result = await pool.query(
      `INSERT INTO vehicles (registration_number, name_model, vehicle_type, capacity, odometer, acquisition_cost, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        registration_number,
        name_model,
        vehicle_type || null,
        capacity || null,
        odometer || 0,
        acquisition_cost || null,
        status || "Available",
      ]
    );

    res.status(201).json({ success: true, message: "Vehicle added successfully.", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    const isDuplicate = err.code === "23505";
    res.status(isDuplicate ? 409 : 500).json({
      success: false,
      message: isDuplicate ? "Registration number already exists." : "Failed to create vehicle.",
    });
  }
};

module.exports = { getAllVehicles, createVehicle };
