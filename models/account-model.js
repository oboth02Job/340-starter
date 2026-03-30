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


module.exports = { registerAccount };