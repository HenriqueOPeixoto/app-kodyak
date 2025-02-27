const pool = require('../../postgres').pool

const createPedido = (request, response) => {
    const { data, status, observacoes, cliente_endereco } = request.body

    const query = 
        `INSERT INTO PEDIDOS (data, status, observacoes, cliente_endereco) VALUES ($1, $2, $3, $4) RETURNING ID`
    
        pool.query(query, [data, status, observacoes, cliente_endereco])
        .then((results) => { 
            const newId = results.rows[0].id;
            response.status(201).json({ id: newId, message: `Pedido cadastrado com ID ${newId}` });
         })
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
    if (observacoes !== undefined) {
        params.push(observacoes)
        updates.push(' observacoes = $' + params.length)
    }
    if (cliente_endereco) {
        params.push(cliente_endereco)
        updates.push(' cliente_endereco = $' + params.length)
    }

    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.') }

    query += updates.join(', ')
    params.push(id)
    query += ' WHERE ID = $' + params.length

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

/**
 * Fornece uma view que pode ser filtrada com base em parâmetros.
 * Retorna um erro ao fornecer dois ou mais dos parâmetros data, data_inicio e data_fim na mesma requisição.
 * @param {*} request { id, data, razao_social, status, data_inicio, data_fim }
 * @param {*} response 
 */
const getViewPedidos = (request, response) => {
    const { id, data, razao_social, status, data_inicio, data_fim } = request.query
    
    if (data && (data_inicio || data_fim)) {
        return response.status(400).send('Você pode fornecer uma única data ou um intervalo de datas, mas não ambos.')
    }

    let query = 'SELECT * FROM VW_PEDIDOS WHERE 1=1 '
    const params = []
    
    if (id) {
        params.push(id)
        query += ' AND ID = $' + params.length
    }

    if (status) {
        params.push(status)
        query += ' AND STATUS = $' + params.length
    }

    if (data) {
        params.push(data)
        query += ' AND DATA = $' + params.length
    }

    if (razao_social) {
        params.push('%' + razao_social + '%')
        query += ' AND UPPER(RAZAO_SOCIAL) LIKE UPPER($' + params.length + ')'
    }

    if (data_inicio) {
        params.push(data_inicio)
        query += ' AND DATA >= $' + params.length
    }

    if (data_fim) {
        params.push(data_fim)
        query += ' AND DATA <= $' + params.length
    }

    query += ' ORDER BY ID DESC'

    pool.query(query, params)
    .then((results) => { response.status(200).json(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível encontrar os pedidos.' + error) })   
}

    const getPedidoById = (request, response) => {
        const id = parseInt(request.params.id)
    
        pool.query('SELECT * FROM PEDIDOS WHERE ID = $1', [id])
        .then((results) => { response.status(200).json(results.rows) })
        .catch((error) => { response.status(500).send('Não foi possível encontrar o pedido.' + error) })
    }

module.exports = {
    createPedido,
    updatePedido,
    getPedidos,
    deletePedido,
    getViewPedidos,
    getPedidoById
}
