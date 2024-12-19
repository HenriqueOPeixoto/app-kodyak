const { request } = require('express')

const pool = require('../../postgres').pool

const createPedidoItem = (request, response) => {
    const { pedido, produto, quantidade, valor } = request.body

    const query = 
        `INSERT INTO PEDIDOS_ITENS (pedido, produto, quantidade, valor) VALUES ($1, $2, $3, $4) RETURNING ID`
    
        pool.query(query, [pedido, produto, quantidade, valor])
        .then((results) => { response.status(201).send(`Item de pedido cadastrado com ID ${results.rows[0].id}`) })
        .catch((error) => { response.status(500).send('Não foi possível cadastrar o item de pedido. Erro: ' + error)})
}

const updatePedidoItem = (request, response) => {
    const id = parseInt(request.params.id)

    const { produto, quantidade, valor } = request.body

    let query = 'UPDATE PEDIDOS_ITENS SET '
    const updates = []
    const params = []

    if (produto) {
        params.push(produto)
        updates.push(' produto = $' + params.length)
    }

    if (quantidade) {
        params.push(quantidade)
        updates.push(' quantidade = $' + params.length)
    }

    if (valor) {
        params.push(valor)
        updates.push(' valor = $' + params.length)
    }

    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.') }

    query += updates.join(', ')
    query += ' WHERE ID = ' + id

    pool.query(query, params)
    .then(() => { response.status(200).send('Item de pedido atualizado') })
    .catch((error) => { response.status(500).send('Não foi possível atualizar as informações do item de pedido.' + error) })
}

const getPedidoItem = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM PEDIDOS_ITENS WHERE ID = $1', [id])
    .then((results) => { response.status(200).json(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível encontrar o item de pedido. Erro: ' + error) })
}

const getItensByPedido = (request, response) => {
    const pedido = parseInt(request.params.pedido)

    pool.query('SELECT * FROM PEDIDOS_ITENS WHERE pedido = $1', [pedido])
    .then((results) => { response.status(200).json(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível encontrar os itens do pedido. Erro: ' + error) })
}

const deletePedidoItem = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM PEDIDOS_ITENS WHERE ID = $1', [id])
    .then(() => { response.status(200).send('Item de pedido deletado') })
    .catch((error) => { response.status(500).send('Não foi possível deletar o item de pedido. Erro: ' + error) })
}

module.exports = {
    createPedidoItem,
    updatePedidoItem,
    getPedidoItem,
    getItensByPedido,
    deletePedidoItem
}