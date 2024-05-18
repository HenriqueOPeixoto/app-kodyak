const Pool = require('pg').Pool

const { request, response } = require('express')
const credentials = require('./credentials.json') // Arquivo com a senha do banco

const pool = new Pool({
    user: credentials['postgresql-user'],
    host: credentials['postgresql-host'],
    database: credentials['postgresql-db'],
    password: credentials['postgresql-passwd'],
    port: credentials['postgresql-port']
})



module.exports = {
    pool
}

