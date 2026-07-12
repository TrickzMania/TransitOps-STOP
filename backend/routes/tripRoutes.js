const express = require("express");

const router = express.Router();

const { getAllTrips, createTrip } = require("../controllers/tripController");

router.get("/", getAllTrips);
router.post("/", createTrip);

module.exports = router;
