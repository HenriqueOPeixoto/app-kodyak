const pool = require('../../postgres').pool

const createBanco = (request, response) => {
    const { cod_banco, nome, sigla } = request.body

    const query = 
        `INSERT INTO BANCOS (cod_banco, nome, sigla) VALUES ($1, $2, $3) RETURNING ID`

    const values = [cod_banco, nome, sigla]

    pool.query(query, values)
    .then((results) => { response.status(201).send(`Banco cadastrado com ID ${results.rows[0].id}`) })
    .catch((error) => { response.status(500).send('Não foi possível cadastrar o banco. Erro: ' + error)})
}

const updateBanco = (request, response) => {
    const id = parseInt(request.params.id)

    const { cod_banco, nome, sigla } = request.body

    let query = 'UPDATE BANCOS SET '
    const updates = []
    const params = []

    if (cod_banco) {
        params.push(cod_banco)
        updates.push(' cod_banco = $' + params.length)
    }
    if (nome) {
        params.push(nome)
        updates.push(' nome = $' + params.length)
    }
    if (sigla !== undefined) {
        params.push(sigla)
        updates.push(' sigla = $' + params.length)
    }
    
    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.') }
    
    query += updates.join(', ')
    params.push(id)
    query += ' WHERE ID = $' + params.length

    pool.query(query, params)
    .then(() => { response.status(200).send('Banco atualizado') })
    .catch((error) => { response.status(500).send('Não foi possível atualizar as informações do banco.' + error) })

}

const getBanco = (request, response) => {
    const { cod_banco, nome, sigla, inativo } = request.query

    let query = 'SELECT * FROM BANCOS WHERE 1=1'
    const params = []

    if (cod_banco) {
        params.push(cod_banco)
        query += ' AND COD_BANCO = $' + params.length
    }

    if (nome) {
        params.push('%' + nome + '%')
        query += ' AND UPPER(NOME) LIKE UPPER($' + params.length + ')'
    }

    if (sigla) {
        params.push(sigla)
        query += ' AND SIGLA = $' + params.length
    }

    if (inativo) {
        params.push(inativo)
        query += ' AND INATIVO = $' + params.length
    }

    pool.query(query, params)
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível listar os bancos. ' + error)})
}

const getBancoById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM BANCOS WHERE ID = $1', [id])
    .then((results) => { response.status(200).send(results.rows) })
    .catch((error) => { response.status(500).send('Não foi possível buscar o banco. ' + error)})
}

const alterarStatusBanco = (request, response) => {
    const id = parseInt(request.params.id)
    const { inativo } = request.body

    if (typeof inativo !== 'boolean') {
        return response.status(400).send('Valor inválido para status. Esperava um boolean.')
    }

    pool.query('UPDATE BANCOS SET INATIVO = $1 WHERE ID = $2', [inativo, id])
    .then(() => {
        const acaoRealizada = (inativo ? 'inativado' : 'ativado')
        response.status(200).send(`Banco com ID ${id} ${acaoRealizada} com sucesso.`)}
    )
    .catch((error) => { response.status(500).send('Ocorreu um erro ao alterar status do banco. ' + error) })
}

module.exports = {
    createBanco,
    updateBanco,
    getBanco,
    getBancoById,
    alterarStatusBanco
}