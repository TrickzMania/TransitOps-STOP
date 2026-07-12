const express = require("express");

const router = express.Router();

const {
  getAllExpenses,
  createExpense,
} = require("../controllers/expenseController");

router.get("/", getAllExpenses);

router.post("/", createExpense);

module.exports = router;
