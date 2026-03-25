// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
// Route to build inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

module.exports = router;