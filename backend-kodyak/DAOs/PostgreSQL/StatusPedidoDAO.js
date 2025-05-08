const pool = require('../../postgres').pool

const getStatusPedidos = (request, response) => {
    pool.query('SELECT * FROM STATUS_PEDIDO')
    .then((results) => {
        return response.status(200).send(results.rows)
    })
    .catch((error) => {
        console.error(error)
        return response.status(500).send('Não foi possível listar os status de pedido.')
    })
}

const getStatusPedidoById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM STATUS_PEDIDO WHERE ID = $1', [id])
    .then((results) => {
        return response.status(200).send(results.rows[0])
    })
    .catch((error) => {
        console.error(error)
        return response.status(500).send('Não foi possível listar os status de pedido.')
    })

}

module.exports = {
    getStatusPedidos,
    getStatusPedidoById
}