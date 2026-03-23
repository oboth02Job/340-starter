// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controller/invController")
// Route to build inventory by classification
router.get("/type/:classificationId", invController.buildByClassification);

module.exports = router;