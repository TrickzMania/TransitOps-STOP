const express = require("express");

const router = express.Router();

const { getAllTrips } = require("../controllers/tripController");

router.get("/", getAllTrips);

module.exports = router;
