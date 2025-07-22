const pool = require('../../postgres').pool

const createCliente = (request, response) => {
    const {
        razao_social,
        nome,
        tipo_pessoa,
        documento,
        representante
    } = request.body

    const query =
        `INSERT INTO CLIENTES (
            razao_social, nome, tipo_pessoa, documento, representante
        ) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING ID`
    
    const values = [
        razao_social,
        nome,
        tipo_pessoa,
        documento,
        representante
    ]

    pool.query(query, values)
    .then((results) => {
        const newId = results.rows[0].id
        response.status(201).send({ id: newId, message: `Cliente cadastrado com ID ${results.rows[0].id}`}) 
    })
    .catch((error) => { response.status(500).send('Não foi possível cadastrar o cliente. Erro: ' + error) })

}

const getClientes = (request, response) => {
    const { nome, documento, inativo, representante } = request.query

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
    
    if (representante) {
        params.push(representante)
        query += ' AND REPRESENTANTE = $' + params.length
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
        documento,
        representante
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
    if (representante) {
        params.push(representante)
        updates.push(' representante = $' + params.length)
    }

    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.')}

    query += updates.join(', ')
    params.push(id)
    query += ' WHERE ID = $' + params.length

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