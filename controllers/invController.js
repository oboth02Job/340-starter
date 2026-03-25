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

module.exports = invCont;