const pool = require('../../postgres').pool

const createPedido = (request, response) => {
    const { data, status, observacoes, cliente_endereco } = request.body

    const query = 
        `INSERT INTO PEDIDOS (data, status, observacoes, cliente_endereco) VALUES ($1, $2, $3, $4) RETURNING ID`
    
        pool.query(query, [data, status, observacoes, cliente_endereco])
        .then((results) => { response.status(201).send(`Pedido cadastrado com ID ${results.rows[0].id}`) })
        .catch((error) => { response.status(500).send('Não foi possível cadastrar o pedido. Erro: ' + error)})
}

const updatePedido = (request, response) => {
    const id = parseInt(request.params.id)

    const { data, status, observacoes, cliente_endereco } = request.body

    let query = 'UPDATE PEDIDOS SET '
    const updates = []
    const params = []

    if (data) {
        params.push(data)
        updates.push(' data = $' + params.length)
    }
    if (status) {
        params.push(status)
        updates.push(' status = $' + params.length)
    }
    if (observacoes) {
        params.push(observacoes)
        updates.push(' observacoes = $' + params.length)
    }
    if (cliente_endereco) {
        params.push(cliente_endereco)
        updates.push(' cliente_endereco = $' + params.length)
    }

    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.') }

    query += updates.join(', ')
    query += ' WHERE ID = ' + id

    pool.query(query, params)
    .then(() => { response.status(200).send('Pedido atualizado') })
    .catch((error) => { response.status(500).send('Não foi possível atualizar as informações do pedido.' + error) })
}

const getPedidos = (request, response) => {
    const { data, status, observacoes, cliente_endereco } = request.query

    let query = 'SELECT * FROM PEDIDOS WHERE 1=1'
    const params = []

    if (data) {
        params.push(data)
        query += ' AND DATA = $' + params.length
    }

    if (status) {
        params.push(status)
        query += ' AND STATUS = $' + params.length
    }

    if (observacoes) {
        params.push(observacoes)
        query += ' AND OBSERVACOES = $' + params.length
    }

    if (cliente_endereco) {
        params.push(cliente_endereco)
        query += ' AND CLIENTE_ENDERECO = $' + params.length
    }

    pool.query(query, params)
    .then((results) => { response.status(200).json(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível encontrar os pedidos.' + error) })
}

const deletePedido = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM PEDIDOS WHERE ID = $1', [id])
    .then(() => { response.status(200).send('Pedido deletado') })
    .catch((error) => { response.status(500).send('Não foi possível deletar o pedido.' + error) })
}

module.exports = {
    createPedido,
    updatePedido,
    getPedidos,
    deletePedido
}
