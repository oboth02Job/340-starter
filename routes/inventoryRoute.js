// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const { checkEmployeeOrAdmin } = require("../controllers/accountController");


// Route to build inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId,));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));
router.get("/error", utilities.handleErrors(invController.triggerError))
router.get(
  "/",
  utilities.handleErrors(checkEmployeeOrAdmin, invController.buildManagement),
);
router.get(
  "/add-classification",
  utilities.handleErrors(
    checkEmployeeOrAdmin, invController.buildAddClassification,
  ),
);
router.post(
  "/add-classification",
  utilities.handleErrors(checkEmployeeOrAdmin, invController.addClassification),
);

router.get(
  "/add-inventory",
  utilities.handleErrors(checkEmployeeOrAdmin, invController.buildAddInventory),
);
router.post(
  "/add-inventory",
  utilities.handleErrors(checkEmployeeOrAdmin, invController.addInventory),
);

router.get(
  "./getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON),
);

//route to update inventory
router.get(
  "/edit/:inventory_id",
  utilities.handleErrors(invController.editInventory),
);

router.post("/update/", utilities.handleErrors(invController.updateInventory));

module.exports = router;