// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
// Route to build inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId,));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));
router.get("/error", utilities.handleErrors(invController.triggerError))
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification),
);
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory),
);
router.post(
  "/add-inventory",
  utilities.handleErrors(invController.addInventory),
);

module.exports = router;