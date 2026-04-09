const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassification()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>";
        list += "</li>";
    })
    list += "</ul>";
    return list;
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">';
        data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  
    }
    return grid
}

Util.buildVehicleDetail = async function (data) {
  let detail = ""
  if (data) {
    const price = new Intl.NumberFormat('en-US').format(data.inv_price)
    const miles = new Intl.NumberFormat('en-US').format(data.inv_miles)

    detail = `<div class = "vehicle-detail"> 
    <div class = "vehicle-image">
    <img src="${data.inv_image}" alt="image of ${data.inv_make} ${data.inv_model}">
     </div> 
     <div class = "vehicle-info">
     <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2> 
     <p>Price:<strong>$${price}</strong></p>
     <p>Mileage:<strong>${miles}</strong></p>
     <p>Description:<strong>${data.inv_description}</strong></p>
     </div>
    </div>`;
  } else {
    detail = `<p class="notice">Sorry, vehicle details not available.</p>`
  }
return detail
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.buildClassificationList = async function (selectedId = null) {
  const data = await invModel.getClassifications()
  let list = `<select id="classificationList" name="classification_id" required>`
  list += `<option value="">Choose a Classification</option>`
  data.rows.forEach(row => {
    list += `<option value="${row.classification_id}"
    ${selectedId == row.classification_id ? "selected" : ""}>
   ${row.classification_name}  </option>`;
  })
  list += `</select>`
  return list
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 res.locals.loggedin = 0
 res.locals.accountData = null
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("notice", "Please log in.")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};



module.exports = Util


