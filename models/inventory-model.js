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


module.exports = { getClassification, getInventoryByClassificationId, getInventoryByInventoryId };
