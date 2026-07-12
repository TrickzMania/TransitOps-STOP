const pool = require("../config/db");

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Hackathon version — plain text password check
    if (password !== "password") {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { full_name, email, password, role, phone } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }

    // Check duplicate
    const existing = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const result = await pool.query(
      `INSERT INTO users (full_name, email, role, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, full_name, email, role`,
      [full_name, email, role || "fleet-manager", phone || null]
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
};

// GET /api/auth/profile/:id
const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT user_id, full_name, email, role, phone, created_at FROM users WHERE user_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch profile" });
  }
};

module.exports = { login, register, getProfile };
