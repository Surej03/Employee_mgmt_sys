const express = require("express");
const router = express.Router();
const controllers = require("../empController");

//Homepage-view all records
router.get("/", controllers.view);

//Add new records
router.get("/addemp", controllers.addemp);
router.post("/addemp", controllers.save);

//Update records
router.get("/editemp/:id", controllers.editemp);
router.post("/editemp/:id", controllers.edit);

//Delete records
router.get("/deleteemp/:id", controllers.delete);


module.exports = router;