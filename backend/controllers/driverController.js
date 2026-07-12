const pool = require("../config/db");

// GET /api/drivers
const getAllDrivers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM drivers ORDER BY driver_id");
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/drivers
const createDriver = async (req, res) => {
  try {
    const { full_name, license_no, license_category, license_expiry, phone, status } = req.body;

    if (!full_name || !license_no) {
      return res.status(400).json({ success: false, message: "Full name and license number are required." });
    }

    const result = await pool.query(
      `INSERT INTO drivers (full_name, license_no, license_category, license_expiry, phone, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        full_name,
        license_no,
        license_category || null,
        license_expiry || null,
        phone || null,
        status || "Available",
      ]
    );

    res.status(201).json({ success: true, message: "Driver added successfully.", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    const isDuplicate = err.code === "23505";
    res.status(isDuplicate ? 409 : 500).json({
      success: false,
      message: isDuplicate ? "License number already exists." : "Failed to create driver.",
    });
  }
};

module.exports = { getAllDrivers, createDriver };
