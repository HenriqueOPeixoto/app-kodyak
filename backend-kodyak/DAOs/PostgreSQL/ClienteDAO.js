const pool = require('../../postgres').pool

const createCliente = (request, response) => {
    const {
        razao_social,
        nome,
        cnpj,
        cpf,
        inscricao_estadual,
        telefone_fixo,
        telefone_celular,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado
    } = request.body

    const query =
        `INSERT INTO CLIENTES (
            razao_social, nome, cnpj, cpf, inscricao_estadual, telefone_fixo, telefone_celular,
        email, cep, logradouro, numero, bairro, cidade, estado
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING ID`
    
    const values = [
        razao_social,
        nome,
        cnpj,
        cpf,
        inscricao_estadual,
        telefone_fixo,
        telefone_celular,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado
    ]

    pool.query(query, values)
    .then((results) => { response.status(201).send(`Cliente cadastrado com ID ${results.rows[0].id}`) })
    .catch((error) => { response.status(500).send('Não foi possível cadastrar o cliente. Erro: ' + error) })

}

const getClientes = (request, response) => {
    const { nome, cnpj, cpf, inativo } = request.query

    let query = 'SELECT * FROM CLIENTES WHERE 1=1'
    const params = []

    if (nome) {
        params.push('%' + nome + '%')
        query += ' AND UPPER(NOME) LIKE UPPER($' + params.length + ')'

    }

    if (cpf) {
        params.push('%' + cpf + '%')
        query += ' AND CPF LIKE $' + params.length
    }

    if (cnpj) {
        params.push('%' + cnpj + '%')
        query += ' AND CNPJ LIKE $' + params.length
    }

    if (inativo) {
        params.push(inativo)
        query += ' AND INATIVO = $' + params.length
    }

    pool.query(query, params)
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível listar os clientes. Erro: ' + error)})
}

const updateCliente = (request, response) => {
    const id = parseInt(request.params.id)

    const {
        razao_social,
        nome,
        cnpj,
        cpf,
        inscricao_estadual,
        telefone_fixo,
        telefone_celular,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado
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
    if (cnpj) {
        params.push(cnpj)
        updates.push(' cnpj = $' + params.length)
    }
    if (cpf) {
        params.push(cpf)
        updates.push(' cpf = $' + params.length)
    }
    if (inscricao_estadual) {
        params.push(inscricao_estadual)
        updates.push(' inscricao_estadual = $' + params.length)
    }
    if (telefone_fixo) {
        params.push(telefone_fixo)
        updates.push(' telefone_fixo = $' + params.length)
    }
    if (telefone_celular) {
        params.push(telefone_celular)
        updates.push(' telefone_celular = $' + params.length)
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
    if (estado) {
        params.push(estado)
        updates.push(' estado = $' + params.length)
    }
    if (cidade) {
        params.push(cidade)
        updates.push(' cidade = $' + params.length)
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
        response.status(200).send(`Usuário com ID ${id} ${acaoRealizada} com sucesso.`)}
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