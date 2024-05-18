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

const createMotorista = (request, response) => {
    const { nome, placa, telefone, vinculo, tp_caminhao } = request.body

    console.log(request.body)

    pool.query(
        'INSERT INTO MOTORISTAS (NOME, PLACA, TELEFONE, VINCULO, TP_CAMINHAO) VALUES ($1, $2 ,$3, $4, $5)',
        [nome, placa, telefone, vinculo, tp_caminhao],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(201).send(`Motorista adicionado com ID ${results.insertId}`)
            
        })
}

module.exports = {
    createMotorista
}

