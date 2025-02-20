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

const getMunicipios = (request, response) => {
    const { id_uf } = request.query

    let query = 'SELECT * FROM MUNICIPIOS_POR_UF WHERE 1=1'
    const params = []

    if (id_uf) {
        params.push(id_uf)
        query += ' AND ID_UF = $' + params.length
    }

    pool.query(query, params)
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
    getMunicipios,
    getMunicipioById
}
