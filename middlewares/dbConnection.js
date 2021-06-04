require('dotenv').config()
const mysql = require('mysql2')


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB,
    password:process.env.DB_PASSWORD
})


module.exports = db;