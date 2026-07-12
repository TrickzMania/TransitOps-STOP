const express = require("express");
const router = express.Router();
const { getAllDrivers, createDriver } = require("../controllers/driverController");

router.get("/", getAllDrivers);
router.post("/", createDriver);

module.exports = router;
