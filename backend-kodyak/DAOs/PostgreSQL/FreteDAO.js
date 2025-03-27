const pool = require('../../postgres').pool

const createFrete = (request, response) => {
    const { cidade, valor_frete, icms_frete, icms_venda } = request.body

    pool.query('SELECT * FROM FRETES WHERE CIDADE = $1', [cidade])
        .then((results) => {
            if (results.rows.length > 0) {
                return response.status(400).send('Já existe um frete cadastrado para essa cidade.')
            } else {
                const query = 
                    `INSERT INTO fretes (
                        cidade,
                        valor_frete,
                        icms_frete,
                        icms_venda
                    ) VALUES ($1, $2, $3, $4) RETURNING id`
            
                const values = [
                    cidade,
                    valor_frete,
                    icms_frete,
                    icms_venda
                ]
            
                pool.query(query, values)
                    .then((results) => {
                        const newId = results.rows[0].id
                        response.status(201).send({ id: newId, message: `Frete cadastrado com ID ${results.rows[0].id}`})
                    })
                    .catch((error) => { response.status(500).send('Não foi possível cadastrar o frete. Erro: ' + error) })            
            }
        })
        .catch((error) => { return response.status(500).send('Não foi possível verificar a existência de um frete para essa cidade. Erro: ' + error) })

    
}

const updateFrete = (request, response) => {
    const id = parseInt(request.params.id)
    const { cidade, valor_frete, icms_frete, icms_venda } = request.body

    let query = 'UPDATE fretes SET '
    const params = []
    const updates = []

    if (cidade) {
        params.push(cidade)
        updates.push(' cidade = $' + params.length)
    }

    if (valor_frete) {
        params.push(valor_frete)
        updates.push(' valor_frete = $' + params.length)
    }

    if (icms_frete) {
        params.push(icms_frete)
        updates.push(' icms_frete = $' + params.length)
    }

    if (icms_venda) {
        params.push(icms_venda)
        updates.push(' icms_venda = $' + params.length)
    }

    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.') }

    params.push(id)
    query += updates.join(', ') + ' WHERE id = $' + params.length

    pool.query(query, params)
        .then(() => { response.status(200).send('Frete atualizado com sucesso.') })
        .catch((error) => { response.status(500).send('Não foi possível atualizar o frete. Erro: ' + error) })
}

const getFrete = (request, response) => {
    const { cidade } = request.query

    let query = 'SELECT * FROM fretes WHERE 1=1 '
    const params = []

    if (cidade) {
        params.push(cidade)
        query += ' AND cidade = $' + params.length
    }

    pool.query(query, params)
        .then((results) => { response.status(200).send(results.rows) })
        .catch((error) => { response.status(500).send('Não foi possível listar os fretes. Erro: ' + error) })
}

const getFretesView = (request, response) => {
    const { id_uf, id_municipio } = request.query

    let query = 'SELECT * FROM vw_fretes WHERE 1=1 '
    const params = []

    if (id_uf) {
        params.push(id_uf)
        query += ' AND id_uf = $' + params.length
    }

    if (id_municipio) {
        params.push(id_municipio)
        query += ' AND id_municipio = $' + params.length
    }

    pool.query(query, params)
        .then((results) => { response.status(200).send(results.rows) })
        .catch((error) => { response.status(500).send('Não foi possível listar os fretes. Erro: ' + error) })
}

const getFreteById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM fretes WHERE id = $1', [id])
        .then((results) => { response.status(200).send(results.rows) })
        .catch((error) => { response.status(500).send('Não foi possível buscar o frete. Erro: ' + error) })
}

const alterarStatusFrete = (request, response) => {
    const id = parseInt(request.params.id)
    const { inativo } = request.body

    if (typeof inativo !== 'boolean') { return response.status(400).send('O campo inativo deve ser um booleano.') }

    pool.query('UPDATE fretes SET inativo = $1 WHERE id = $2', [inativo, id])
        .then(() => { response.status(200).send('Status do frete alterado com sucesso.') })
        .catch((error) => { response.status(500).send('Não foi possível alterar o status do frete. Erro: ' + error) })
}

module.exports = {
    createFrete,
    updateFrete,
    getFrete,
    getFretesView,
    getFreteById,
    alterarStatusFrete
}
