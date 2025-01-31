const pool = require('../../postgres').pool

const createCliente = (request, response) => {
    const {
        razao_social,
        nome,
        tipo_pessoa,
        documento
    } = request.body

    const query =
        `INSERT INTO CLIENTES (
            razao_social, nome, tipo_pessoa, documento
        ) 
        VALUES ($1, $2, $3, $4)
        RETURNING ID`
    
    const values = [
        razao_social,
        nome,
        tipo_pessoa,
        documento
    ]

    pool.query(query, values)
    .then((results) => { response.status(201).send(`Cliente cadastrado com ID ${results.rows[0].id}`) })
    .catch((error) => { response.status(500).send('Não foi possível cadastrar o cliente. Erro: ' + error) })

}

const getClientes = (request, response) => {
    const { nome, documento, inativo } = request.query

    let query = 'SELECT * FROM CLIENTES WHERE 1=1'
    const params = []

    if (nome) {
        params.push('%' + nome + '%')
        query += ' AND UPPER(NOME) LIKE UPPER($' + params.length + ')'

    }

    if (documento) {
        params.push('%' + documento + '%')
        query += ' AND DOCUMENTO LIKE $' + params.length
    }

    if (inativo) {
        params.push(inativo)
        query += ' AND INATIVO = $' + params.length
    }

    query += ' ORDER BY UPPER(NOME)'

    pool.query(query, params)
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível listar os clientes. Erro: ' + error)})
}

const updateCliente = (request, response) => {
    const id = parseInt(request.params.id)

    const {
        razao_social,
        nome,
        tipo_pessoa,
        documento
    } = request.body

    let query = 'UPDATE CLIENTES SET '
    const updates = []
    const params = []

    if (razao_social) {
        params.push(razao_social)
        updates.push(' razao_social = $' + params.length)
    }
    if (nome) {
        params.push(nome)
        updates.push(' nome = $' + params.length)
    }
    if (tipo_pessoa) {
        params.push(tipo_pessoa)
        updates.push(' tipo_pessoa = $' + params.length)
    }
    if (documento) {
        params.push(documento)
        updates.push(' documento = $' + params.length)
    }

    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.')}

    query += updates.join(', ')
    query += ' WHERE ID = ' + id

    pool.query(query, params)
    .then(() => { response.status(200).send('Cliente atualizado.') })
    .catch((error) => { response.status(500).send('Não foi possível atualizar o cliente. Erro:' + error) })

}

const getClienteById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM CLIENTES WHERE ID = $1', [id])
    .then((results) => { response.status(200).send(results.rows)})
    .catch((error) => { response.status(500).send('Não foi possível buscar o cliente. ' + error) })
}

const alterarStatusCliente = (request, response) => {
    const id = parseInt(request.params.id)
    const { inativo } = request.body

    if (typeof inativo !== 'boolean') {
        return response.status(400).send('Valor inválido para status. Esperava um boolean.')
    }

    pool.query('UPDATE CLIENTES SET INATIVO = $1 WHERE ID = $2', [inativo, id])
    .then(() => {
        const acaoRealizada = (inativo ? 'inativado' : 'ativado')
        response.status(200).send(`Cliente com ID ${id} ${acaoRealizada} com sucesso.`)}
    )
    .catch((error) => { response.status(200).send('Ocorreu um erro ao alterar status do cliente ' + error) })
}


module.exports = {
    createCliente,
    getClientes,
    updateCliente,
    getClienteById,
    alterarStatusCliente
}