const pool = require('../../postgres').pool

const getNivelAcesso = (request, response) => {
    pool.query('SELECT * FROM NIVEL_ACESSO')
    .then((results) => {
        return response.status(200).send(results.rows)
    })
    .catch((error) => {
        return response.status(500).send('Erro de servidor: ' + error)
    })
}

const getNivelAcessoById = (request, response) => {
    const id = request.params.id

    pool.query(
        'SELECT * FROM NIVEL_ACESSO WHERE ID = $1',
        [id]
    )
    .then((results) => {
        return response.status(200).send(results.rows)
    })
    .catch((error) => {
        return response.status(500).send('Erro de servidor: ' + error)
    })
}

module.exports = {
    getNivelAcesso,
    getNivelAcessoById
}