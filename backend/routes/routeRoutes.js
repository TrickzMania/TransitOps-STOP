const express = require("express");

const router = express.Router();

const { getAllRoutes } = require("../controllers/routecontroller");

router.get("/", getAllRoutes);

module.exports = router;
