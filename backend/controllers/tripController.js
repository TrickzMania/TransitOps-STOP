const pool = require("../config/db");

// GET /api/trips
const getAllTrips = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*,
              v.name_model   AS vehicle_name,
              d.full_name    AS driver_name
       FROM   trips t
       LEFT JOIN vehicles v ON v.vehicle_id = t.vehicle_id
       LEFT JOIN drivers  d ON d.driver_id  = t.driver_id
       ORDER BY t.trip_id`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /api/trips
const createTrip = async (req, res) => {
  try {
    const {
      vehicle_id,
      driver_id,
      source,
      destination,
      cargo_weight_kg,
      planned_distance_km,
      trip_status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO trips
       (vehicle_id, driver_id, source, destination, cargo_weight_kg, planned_distance_km, trip_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        vehicle_id || null,
        driver_id || null,
        source,
        destination,
        cargo_weight_kg || null,
        planned_distance_km || null,
        trip_status || "Planned",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Trip created successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to create trip.",
    });
  }
};

module.exports = { getAllTrips, createTrip };
