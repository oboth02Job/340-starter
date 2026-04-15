const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists =
          await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};


/* **************
 *  Inventory Data Validation Rules
 * ************* */
validate.inventoryRules = () => {
  return [
    // Item name is required
    body("item_name").trim().notEmpty().withMessage("Item name is required"),

    // Quantity is required and must be a number greater than 0
    body("item_quantity")
      .trim()
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a number greater than 0"),

    // Price is required and must be a valid float
    body("item_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ min: 0.01 })
      .withMessage("Price must be a number greater than 0"),
  ];
}

/* **************
 *  Check Inventory Data & Return Errors or Continue
 * ************* */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const { item_name, item_quantity, item_price } = req.body;

  if (!errors.isEmpty()) {
    // Get navigation (optional, depends on your templates)
    let nav = await utilities.getNav();

    return res.render("inventory/add", {
      title: "Add Inventory Item",
      nav,
      errors: errors.array(),
      item_name,
      item_quantity,
      item_price,
    });
  }

  // If everything is good, continue to next middleware/controller
  next();
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login data validation rules
 * ********************************* */
validate.loginRules = () => {
  return [
    //Valid email required
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    //Password required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Please provide a password."),
  ];
};

/*  **********************************
 *  Check login errors and return error or continue
 * ********************************* */
validate.checkLoginData = async function (req, res, next) {
  const { account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    });
  }
  next();
};

validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Valid email required.")
      .custom(async (email, { req }) => {
        const account = await accountModel.getAccountByEmail(email);

        if (account && account.account_id != req.body.account_id) {
          throw new Error("Email already exists.");
        }
      }),

    body("account_phone")
      .optional({ checkFalsy: true })
      .trim()
      .custom((phone) => {
        const cleaned = phone.replace(/[^0-9]/g, "");
        if (!/^[0-9()+\-\s]*$/.test(phone)) {
          throw new Error("Phone number may only contain digits, spaces, +, -, and parentheses.");
        }
        if (cleaned.length < 10 || cleaned.length > 15) {
          throw new Error("Phone number must contain between 10 and 15 digits.");
        }
        return true;
      }),

    body("account_bio")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 500 })
      .withMessage("Bio must be less than 500 characters."),

    body("account_image")
      .optional({ checkFalsy: true })
      .trim()
      .isURL()
      .withMessage("Image must be a valid URL."),
  ];
}

validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ];
}

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    return res.render("account/update", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors: errors.array(),
      message: null,
    });
  }

  next();
}

module.exports = validate;
