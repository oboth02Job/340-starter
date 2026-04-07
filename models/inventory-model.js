const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassification() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")

}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification as c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`, [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getClassificationById error " + error)
    }
}

/* ***************************
 *  Get one inventory item and inventory detail by inventory_id
 * ************************** */
async function getInventoryByInventoryId(inv_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM inventory WHERE inv_id = $1`, [inv_id]
      );
      return data.rows[0];
    } catch (error) {
      console.error("getInventoryByInventoryId error " + error);
    }
}

async function addClassification(classification_name) {
    try {
        const sql = `INSERT INTO classification(classification_name)
    VALUES ($1)
    RETURNING *`;
        const result = await pool.query(sql, [classification_name])  
        return result.rows[0]   
        
    } catch (error) {
        console.error("addClassification error:", error)
        return null
}
}

async function checkExistingClassification(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1"
        const result = await pool.query(sql, [classification_name])
        return result.rows[0]
    } catch (error) {
        console.error(error)
}
} 

async function addInventory(make, model, year, price, classification_id) {
    try {
        const sql = `INSERT INTO inventory (inv_make,
        inv_model, inv_year, inv_price, classification_id,) VALUES ($1, $2, $3, $4, $5)
        RETURNING *; `
        return await pool.query(sql, [make, model, year, price, classification_id])
    } catch (error) {
        console.error(error)
}
}

async function getClassifications() {
    try {
        const sql = "SELECT * FROM classification ORDER BY classification_name"
        return await pool.query(sql)
    } catch (error) {
        console.error(error)
    }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {
  getClassification,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addClassification,
  checkExistingClassification,
  addInventory,
  getClassifications,
  updateInventory,
};
