const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildByInventoryId = async function (req, res, next) {
    try {
        const inv_id = req.params.invId
        const data = await invModel.getInventoryByInventoryId(inv_id)
        console.log("Vehicle from Database:", data)
        if (!data) {
            return next({ status: 404, message: "I can't get that vehicle Fella" })
        }
        let nav = await utilities.getNav()
        const vehicleDetail = await utilities.buildVehicleDetail(data)
        const title = data.inv_make + " " + data.inv_model
    
        res.render("inventory/detail", {
            title,
            nav,
            vehicleDetail
        })
    
    }
    catch (error) {
        next(error)
    }
}

invCont.triggerError = async function (req, res, next) {
    throw new Error("Intentional Server Error")
}


invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList();
    const accountData = res.locals.accountData
    const welcomeMessage = accountData ? `Welcome, ${accountData.account_firstname}!` : null
    res.render("inventory/management", {
        title: "Inventory Management",
      nav,
        message: welcomeMessage,
      classificationList,
        accountData: res.locals.accountData
    } )
}

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        message: null
    })
}

invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body
    let nav = await utilities.getNav()
    if (!classification_name || !classification_name.match(/^[A-Za-z]+$/)) {
        return res.status(400).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            message: "Error: Classification name must contain only letters (no spaces or special characters)"
        })
    }
        const existing =
            await invModel.checkExistingClassification(classification_name)
        if (existing) {
            return res.render("inventory/add-classification", {
                title: "Add Classification",
                nav,
                message: "Error: Classification already exists"
            })
        };
        const result = await invModel.addClassification(classification_name)

        if (result) {
            let nav = await utilities.getNav()
            return res.render("inventory/management", {
                title: "Inventory Management",
                nav,
                message: "Success! New Classification Added"
            })
        } else {
            return res.status(500).render("inventory/add-classification", {
                title: "Add Classification",
                nav,
                message: "Error: Could not add classification"
        
            })
        }
}
    
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: null,

      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_price: "",
      classification_id: "",
    });
}

invCont.addInventory = async function (req, res) {
 
  const { inv_make, inv_model, inv_year, inv_price, classification_id } =
    req.body;

    let nav = await utilities.getNav()
    
    let classificationList =
      await utilities.buildClassificationList(classification_id);

  if (
    !inv_make ||
    !inv_model ||
    !inv_year ||
    !inv_price ||
    !classification_id
  ) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: "Error: All fields are required",

      inv_make,
      inv_model,
      inv_year,
      inv_price,
      classification_id,
    });
  }

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id,
  );
  if (result) {
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: "Success! Vehicle added",
    });
  } else {
    return res.render("inventory/management", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: "Error, could not add vehicle",
    });
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont;