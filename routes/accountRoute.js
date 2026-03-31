// Needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Route for when "my account" is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin));


// Route for when "register" is clicked
router.get("/register", utilities.handleErrors(accountController.buildRegister));


router.post("/register", utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)


module.exports = router
