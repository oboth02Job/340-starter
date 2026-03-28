// Needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController");

// Route for when "my account" is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin));


module.exports = router
