const pool = require("../database/");


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const Sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client' ) RETURNING *"
        return await pool.query(Sql, [account_firstname, account_lastname, account_email, account_password]) 
    } catch (error) {
      return error.message
  
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    console.log("registration error:,", error)
    return null;
  }
}


async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password,account_phone, account_bio, account_image  FROM account WHERE account_email = $1",
      [account_email],
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

async function updateAccount(account_id, firstname, lastname, email, phone, bio, image) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3,
          account_phone = $4,
          account_bio = $5,
          account_image = $6
      WHERE account_id = $7
      RETURNING *;
    `;
    return await pool.query(sql, [firstname, lastname, email, phone, bio, image, account_id]);
  } catch (error) {
    console.error("updateAccount error:", error);
  }
}

async function updatePassword(account_id, password) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `;
    return await pool.query(sql, [password, account_id]);
  } catch (error) {
    console.error("updatePassword error:", error);
  }
}

async function getAccountById(account_id) {
  try {
    const result = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password,account_phone, account_bio, account_image  FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0]
  } catch (error) {
    return new Error("No matching data found");
}
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  updateAccount,
  updatePassword,
  getAccountById,
};