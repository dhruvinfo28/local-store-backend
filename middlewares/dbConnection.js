require('dotenv').config()
const mysql = require('mysql2')

const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB,
    password:process.env.DB_PASSWORD
}

let db = mysql.createConnection(db_config)

setInterval(function () {
    db.query("Select 1");
}, 5000);

module.exports = db;