const pool = require('../../postgres').pool

const createRepresentante = (request, response) => {
    const {
        nome,
        tipo_pessoa,
        documento,
        telefone,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        banco,
        conta,
        agencia
    } = request.body

    const query = 
    `INSERT INTO REPRESENTANTES (
        nome, tipo_pessoa, documento, telefone, email, cep, logradouro, numero,
        bairro, cidade, banco, conta, agencia
        )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING ID`

    const values = [
        nome,
        tipo_pessoa,
        documento,
        telefone,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        banco,
        conta,
        agencia
    ]

    pool.query(query, values)
    .then((results) => { response.status(201).send(`Representante cadastrado com ID ${results.rows[0].id}`) })
    .catch((error) => { response.status(500).send('Não foi possível cadastrar o representante. Erro: ' + error) })
}

const updateRepresentante = (request, response) => {
    const id = parseInt(request.params.id)

    const {
        nome,
        tipo_pessoa,
        documento,
        telefone,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        banco,
        conta,
        agencia
    } = request.body

    let query = 'UPDATE REPRESENTANTES SET '
    const updates = []
    const params = []

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
    if (telefone) {
        params.push(telefone)
        updates.push(' telefone = $' + params.length)
    }
    if (email) {
        params.push(email)
        updates.push(' email = $' + params.length)
    }
    if (cep) {
        params.push(cep)
        updates.push(' cep = $' + params.length)
    }
    if (logradouro) {
        params.push(logradouro)
        updates.push(' logradouro = $' + params.length)
    }
    if (numero) {
        params.push(numero)
        updates.push(' numero = $' + params.length)
    }
    if (bairro) {
        params.push(bairro)
        updates.push(' bairro = $' + params.length)
    }
    if (cidade) {
        params.push(cidade)
        updates.push(' cidade = $' + params.length)
    }
    if (banco !== undefined) {
        params.push(banco)
        updates.push(' banco = $' + params.length)
    }
    if (conta !== undefined) {
        params.push(conta)
        updates.push(' conta = $' + params.length)
    }
    if (agencia !== undefined) {
        params.push(agencia)
        updates.push(' agencia = $' + params.length)
    }

    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.')}

    query += updates.join(', ')
    params.push(id)
    query += ' WHERE ID = $' + params.length

    pool.query(query, params)
    .then(() => { response.status(200).send('Representante atualizado.') })
    .catch((error) => { response.status(500).send('Não foi possível atualizar o representante. Erro: ' + error) })

}

const getRepresentante = (request, response) => {
    const { nome, documento, inativo } = request.query

    let query = 'SELECT * FROM REPRESENTANTES WHERE 1=1'
    const params = []

    if (nome) {
        params.push('%' + nome + '%')
        query += ' AND UPPER(NOME) LIKE UPPER ($' + params.length + ')'
    }

    if (documento) {
        params.push('%' + documento + '%')
        query += ' AND DOCUMENTO LIKE $' + params.length
    }

    if (inativo) {
        params.push(inativo)
        query += ' AND INATIVO = $' + params.length
    }

    pool.query(query, params)
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível listar os representantes. Erro: ' + error) })
}

const getRepresentanteById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM REPRESENTANTES WHERE ID = $1', [id])
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível consultar o representante. Erro: ' + error) })

}

const alterarStatusRepresentante = (request, response) => {
    const id = parseInt(request.params.id)
    const { inativo } = request.body

    if (typeof inativo !== 'boolean') {
        return response.status(400).send('Valor inválido para status. Esperava um boolean.')
    }

    pool.query('UPDATE REPRESENTANTES SET INATIVO = $1 WHERE ID = $2', [inativo, id])
    .then(() => {
        const acaoRealizada = (inativo ? 'inativado' : 'ativado')
        response.status(200).send(`Representante com ID ${id} ${acaoRealizada} com sucesso.`)}
    )
    .catch((error) => { response.status(200).send('Ocorreu um erro ao alterar status do representante ' + error) })
}


module.exports = {
    createRepresentante,
    updateRepresentante,
    getRepresentante,
    getRepresentanteById,
    alterarStatusRepresentante
}