const { request } = require('express')

const pool = require('../../postgres').pool

const createPedidoItem = (request, response) => {
    const { pedido_id, produto_id, quantidade, valor_unitario } = request.body

    const query = 
        `INSERT INTO PEDIDOS_ITENS (pedido_id, produto_id, quantidade, valor_unitario) VALUES ($1, $2, $3, $4) RETURNING ID`
    
        pool.query(query, [pedido_id, produto_id, quantidade, valor_unitario])
        .then((results) => { response.status(201).send(`Item de pedido cadastrado com ID ${results.rows[0].id}`) })
        .catch((error) => { response.status(500).send('Não foi possível cadastrar o item de pedido. Erro: ' + error)})
}

const updatePedidoItem = (request, response) => {
    const id = parseInt(request.params.id)

    const { produto_id, quantidade, valor_unitario } = request.body

    let query = 'UPDATE PEDIDOS_ITENS SET '
    const updates = []
    const params = []

    if (produto_id) {
        params.push(produto_id)
        updates.push(' produto_id = $' + params.length)
    }

    if (quantidade) {
        params.push(quantidade)
        updates.push(' quantidade = $' + params.length)
    }

    if (valor_unitario) {
        params.push(valor_unitario)
        updates.push(' valor_unitario = $' + params.length)
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
    const pedido_id = parseInt(request.params.pedido_id)

    pool.query('SELECT * FROM PEDIDOS_ITENS WHERE PEDIDO_ID = $1', [pedido_id])
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