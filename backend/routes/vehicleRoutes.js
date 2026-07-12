const express = require("express");
const router = express.Router();
const { getAllVehicles, createVehicle } = require("../controllers/vehicleController");

router.get("/", getAllVehicles);
router.post("/", createVehicle);

module.exports = router;
