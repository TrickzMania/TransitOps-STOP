const express = require("express");

const router = express.Router();

const { getAllRoutes } = require("../controllers/routeController");

router.get("/", getAllRoutes);

module.exports = router;
