const express = require("express");
const router = express.Router();
const controllers = require("../empController");

// homepage
router.get("/", controllers.view);

module.exports = router;