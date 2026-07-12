const pool = require("../config/db");

// GET /api/maintenance
const getAllMaintenance = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM maintenance_records ORDER BY maintenance_id",
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
      message: "Failed to fetch maintenance records.",
    });
  }
};

// POST /api/maintenance
const createMaintenance = async (req, res) => {
  try {
    const {
      vehicle_id,
      service_type,
      vendor_name,
      description,
      cost,
      service_date,
      next_service_due,
      status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO maintenance_records
      (vehicle_id, service_type, vendor_name, description, cost,
      service_date, next_service_due, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        vehicle_id,
        service_type,
        vendor_name,
        description,
        cost,
        service_date,
        next_service_due,
        status,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Maintenance record created successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to create maintenance record.",
    });
  }
};

module.exports = {
  getAllMaintenance,
  createMaintenance,
};
