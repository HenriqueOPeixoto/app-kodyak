const pool = require('../../postgres').pool

const createEndereco = (request, response) => {
    const {
        inscricao_estadual,
        telefone_fixo,
        telefone_celular,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        cliente,
        descricao,
        complemento_cnpj,
        digito_cnpj
    } = request.body

    const query =
        `INSERT INTO CLIENTES_ENDERECOS (
            inscricao_estadual, telefone_fixo, telefone_celular,
        email, cep, logradouro, numero, bairro, cidade, estado, cliente,
        descricao, complemento_cnpj, digito_cnpj
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING ID`
    
    const values = [
        inscricao_estadual,
        telefone_fixo,
        telefone_celular,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        cliente,
        descricao,
        complemento_cnpj,
        digito_cnpj
    ]

    pool.query(query, values)
    .then((results) => { response.status(201).send(`Endereço cadastrado com ID ${results.rows[0].id}`) })
    .catch((error) => { response.status(500).send('Não foi possível cadastrar o endereço. Erro: ' + error) })

}

const getEnderecosByCliente = (request, response) => {
    const { cliente, inativo } = request.query

    if (!cliente) {
        return response.status(400).send('Cliente não informado.')
    }

    let query = 'SELECT * FROM CLIENTES_ENDERECOS WHERE CLIENTE = $1'
    const params = [cliente]
    
    if (inativo) {
        query += ' AND INATIVO = $2'
        params.push(inativo)
    }


    pool.query(query, params)
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível listar os endereços. Erro: ' + error)})
}

const getEnderecosViewByCliente = (request, response) => {
    const { cliente, inativo } = request.query

    if (!cliente) {
        return response.status(400).send('Cliente não informado.')
    }

    let query = 'SELECT * FROM VW_CLIENTES_ENDERECOS WHERE CLIENTE = $1'
    const params = [cliente]
    
    if (inativo) {
        query += ' AND INATIVO = $2'
        params.push(inativo)
    }


    pool.query(query, params)
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível listar os endereços. Erro: ' + error)})
}

const updateEndereco = (request, response) => {
    const id = parseInt(request.params.id)

    const {
        //inscricao_estadual,
        telefone_fixo,
        telefone_celular,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        descricao,
        complemento_cnpj,
        digito_cnpj
    } = request.body

    let query = 'UPDATE CLIENTES_ENDERECOS SET '
    const updates = []
    const params = []

    /*if (inscricao_estadual) {
        params.push(inscricao_estadual)
        updates.push(' inscricao_estadual = $' + params.length)
    }*/
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
    if (descricao) {
        params.push(descricao)
        updates.push(' descricao = $' + params.length)
    }
    if (complemento_cnpj) {
        params.push(complemento_cnpj)
        updates.push(' complemento_cnpj = $' + params.length)
    }
    if (digito_cnpj) {
        params.push(digito_cnpj)
        updates.push(' digito_cnpj = $' + params.length)
    }

    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.')}

    query += updates.join(', ')
    query += ' WHERE ID = ' + id

    pool.query(query, params)
    .then(() => { response.status(200).send('Endereço atualizado.') })
    .catch((error) => { response.status(500).send('Não foi possível atualizar o endereço. Erro:' + error) })

}

const getEnderecoById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM CLIENTES_ENDERECOS WHERE ID = $1', [id])
    .then((results) => { response.status(200).send(results.rows)})
    .catch((error) => { response.status(500).send('Não foi possível buscar o endereço. ' + error) })
}

const alterarStatusEndereco = (request, response) => {
    const id = parseInt(request.params.id)
    const { inativo } = request.body

    if (typeof inativo !== 'boolean') {
        return response.status(400).send('Valor inválido para status. Esperava um boolean.')
    }

    pool.query('UPDATE CLIENTES_ENDERECOS SET INATIVO = $1 WHERE ID = $2', [inativo, id])
    .then(() => {
        const acaoRealizada = (inativo ? 'inativado' : 'ativado')
        response.status(200).send(`Endereço com ID ${id} ${acaoRealizada} com sucesso.`)}
    )
    .catch((error) => { response.status(200).send('Ocorreu um erro ao alterar status do endereço' + error) })
}


module.exports = {
    createEndereco,
    getEnderecosByCliente,
    getEnderecosViewByCliente,
    updateEndereco,
    getEnderecoById,
    alterarStatusEndereco
}