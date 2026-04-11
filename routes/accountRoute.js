// Needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const { checkEmployeeOrAdmin } = require("../controllers/accountController");


// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route for when "my account" is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route for when "register" is clicked
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route for account dashboard
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);


// Route for logging out
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
);

router.get(
  "/update/:account_id", 
  utilities.handleErrors(accountController.buildUpdateView),
);

router.get(
  "/update",
  utilities.handleErrors(accountController.updateAccount),
);

router.get(
  "/change-password",
  utilities.handleErrors(accountController.changePassword),
);

module.exports = router
