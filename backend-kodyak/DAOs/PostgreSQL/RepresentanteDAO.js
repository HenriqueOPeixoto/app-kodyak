const pool = require('../../postgres').pool

const createRepresentante = (request, response) => {
    const {
        nome,
        tipo_pessoa,
        documento,
        telefone,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        banco,
        conta,
        agencia
    } = request.body

    const query = 
    `INSERT INTO REPRESENTANTES (
        nome, tipo_pessoa, documento, telefone, email, cep, logradouro, numero,
        bairro, cidade, estado, banco, conta, agencia
        )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING ID`

    const values = [
        nome,
        tipo_pessoa,
        documento,
        telefone,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        banco,
        conta,
        agencia
    ]

    pool.query(query, values)
    .then((results) => { response.status(201).send(`Representante cadastrado com ID ${results.rows[0].id}`) })
    .catch((error) => { response.status(500).send('Não foi possível cadastrar o representante. Erro: ' + error) })
}

const updateRepresentante = (request, response) => {}
const getRepresentante = (request, response) => {}
const getRepresentanteById = (request, response) => {}
const alterarStatusRepresentante = (request, response) => {}


module.exports = {
    createRepresentante,
    updateRepresentante,
    getRepresentante,
    getRepresentanteById,
    alterarStatusRepresentante
}