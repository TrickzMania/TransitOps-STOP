const express = require("express");

const router = express.Router();

const { getAllDrivers } = require("../controllers/driverController");

router.get("/", getAllDrivers);

module.exports = router;
