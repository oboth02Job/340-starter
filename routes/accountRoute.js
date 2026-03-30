// Needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController");

// Route for when "my account" is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin));


// Route for when "register" is clicked
router.get("/register", utilities.handleErrors(accountController.buildRegister));


router.post("/register", utilities.handleErrors(accountController.registerAccount));


module.exports = router
