const pool = require('../../postgres').pool

const getUnidadesFederativas = (request, response) => {
    pool.query('SELECT * FROM UNIDADES_FEDERATIVAS')
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(501).send(error)})
}

const getUnidadeFederativaById = (request, response) => {
    const id = request.params.id

    pool.query('SELECT * FROM UNIDADES_FEDERATIVAS WHERE ID = $1', [id])
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(501).send('Não foi possível buscar a UF. Erro: ' + error)})
}

const getMunicipiosByUnidadeFederativa = (request, response) => {
    const id = request.params.id

    pool.query('SELECT * FROM MUNICIPIOS_POR_UF WHERE ID_UF = $1', [id])
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(501).send('Não foi possível listar os municípios. Erro: ' + error)})
}

const getMunicipioById = (request, response) => {
    const id = request.params.id

    pool.query('SELECT * FROM MUNICIPIOS_POR_UF WHERE ID = $1', [id])
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(501).send('Não foi possível listar os municípios. Erro: ' + error)})
}

module.exports = {
    getUnidadeFederativaById,
    getUnidadesFederativas,
    getMunicipiosByUnidadeFederativa,
    getMunicipioById
}
