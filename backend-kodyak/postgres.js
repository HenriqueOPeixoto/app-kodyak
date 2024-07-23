const Pool = require('pg').Pool
const dotenv_config = require('dotenv/config')

const { request, response } = require('express')
const credentials = require('./credentials.json') // Arquivo com a senha do banco

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
})



module.exports = {
    pool
}

