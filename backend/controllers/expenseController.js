const pool = require("../config/db");

// GET /api/expenses
const getAllExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses ORDER BY expense_id",
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
      message: "Failed to fetch expenses.",
    });
  }
};

// POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { vehicle_id, expense_type, amount, expense_date, remarks } =
      req.body;

    const result = await pool.query(
      `INSERT INTO expenses
      (vehicle_id, expense_type, amount, expense_date, remarks)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [vehicle_id, expense_type, amount, expense_date, remarks],
    );

    res.status(201).json({
      success: true,
      message: "Expense created successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to create expense.",
    });
  }
};

module.exports = {
  getAllExpenses,
  createExpense,
};
