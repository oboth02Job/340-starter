const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
      message: "",
        errors: null
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration.",
    );
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult && regResult.rows.length > 0) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`,
    ); 
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      // Redirect based on account type
      if (accountData.account_type === "Employee" || accountData.account_type === "Admin") {
        return res.redirect("/account");
      } else {
        return res.redirect("/account/");
      }
    } else {
      req.flash(
        "notice",
        "Please check your credentials and try again.",
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}


async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  const welcomeMessage = accountData ? `Welcome, ${accountData.account_firstname}!` : "Welcome!"
  res.render("account/account", {
    title: "My account",
    nav,
    message: welcomeMessage,
    accountData,
    errors: null
  })
}

async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

function login(req, res) {
  const payload = {
    account_id: user.account_id,
    firstName: user.firstName,
    account_type: user.account_type,
  };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  }); //here

  //Set cookie
  res.cookie('jwt', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 })
  res.redirect("/")
}

function checkLogin(req, res, next) {
  const token = req.cookies.jwt
  console.log("Token:", token)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Decoded:", decoded);
      res.locals.accountData = decoded;
    } catch (err) {
      console.log("Invalid token");
      res.locals.accountData = null;
    }
  } else {
    console.log("No token found");
    res.locals.accountData = null;
  }
  next()
}


async function checkEmployeeOrAdmin(req, res, next) {
  
  try {
    if (res.locals.accountData) {
      const accountType = res.locals.accountData.account_type;

      if (accountType === "Employee" || accountType === "Admin") {
        return next(); // allow access
      }
    }

    // Not authorized
    const nav = await utilities.getNav();
    return res.status(403).render("account/login", {
      title: "Login",
      nav,
      message: "Access denied. Please log in with an Employee or Admin account."
    });

  } catch (error) {
    console.error("Middleware error:", error);
    return res.redirect("/account/login");
  }
}

async function buildUpdateView(req, res, next) {
  try {
    const nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      accountData: res.locals.accountData,
      message: null,
      errors: null
    })
  } catch (error) {
    console.log("Update view error:", error)
    return res.status(500).render("errors/error", {
      title: "Server error",
      message: "Unable to load update page",
      nav: await utilities.getNav()
    })
  }
}

async function buildUpdatePasswordView(req, res, next) {
  try {
    const nav = await utilities.getNav()
    return res.render("account/update-password", {
      title: "Update Password",
      nav,
      accountData: res.locals.accountData,
      message: null,
      errors: null
    })
  } catch (error) {
    console.log("Update password view error:", error)
    return res.status(500).render("errors/error", {
      title: "Server error",
      message: "Unable to load password update page",
      nav: await utilities.getNav()
    })
  }
}

async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  ); if (updateResult) {
    req.flash("notice", "Account updated successfully")
    return res.redirect("/account/")
  } else {
    return res.status(500).render("account update", {
      title: "Account Update",
      nav,
      accountData: req.body,
      errors: null
    })
  }
}

async function updatePassword(req, res) {
  const nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword,
    );

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      return res.redirect("/account/");
    } else {
      throw new Error("Password update failed");
    }
  } catch (error) {
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      accountData: res.locals.accountData,
      errors: null,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  checkLogin,
  login,
  accountLogout,
  checkEmployeeOrAdmin,
  buildUpdateView,
  buildUpdatePasswordView,
  updateAccount,
  updatePassword,
};