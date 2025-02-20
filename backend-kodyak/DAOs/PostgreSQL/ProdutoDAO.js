const pool = require('../../postgres').pool

/**
 * id
nome
valor
indicacoes
modo_uso
restricoes
peso
consumo_diario
familia_produtos
 */

const createProduto = (request, response) => {
    const { nome, valor, indicacoes, modo_uso, restricoes, peso, consumo_diario, familia_produtos } = request.body

    pool.query(
        'INSERT INTO PRODUTOS (NOME, VALOR, INDICACOES, MODO_USO, RESTRICOES, PESO, CONSUMO_DIARIO, FAMILIA_PRODUTOS) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [nome, valor, indicacoes, modo_uso, restricoes, peso, consumo_diario, familia_produtos]
    )
    .then((results) => {
        response.status(201).send(`Produto cadastrado com sucesso. ID: ${results.rows[0].id}`)
    })
    .catch((error) => {
        response.status(500).send('Ocorreu um erro ao cadastrar produto. ' + error)
    })
}

const getProdutos = (request, response) => {
    const { nome, inativo, familia_produtos } = request.query

    let query = 'SELECT * FROM PRODUTOS WHERE 1 = 1'
    const params = []
    
    if (nome) {
        params.push('%' + nome + '%')
        query += ' AND UPPER(NOME) LIKE UPPER($' + params.length + ')'
    }

    if (inativo) {
        params.push(inativo)
        query += ' AND INATIVO = ($' + params.length + ')'
    }
    
    if (familia_produtos) {
        params.push(familia_produtos)
        query += ' AND FAMILIA_PRODUTOS = ($' + params.length + ')'
    }

    query += ' ORDER BY UPPER(NOME)'

    pool.query(query, params)
    .then((results) => {
        response.status(200).send(results.rows)
    })
    .catch((error) => {
        response.status(500).send('Ocorreu um erro ao listar os produtos. '+ error)
    })
}

const getProdutoById = (request, response) => {
    const id = parseInt(request.params.id)
    
    pool.query('SELECT * FROM PRODUTOS WHERE ID = $1', [id])
    .then((results) => {
        response.status(200).send(results.rows)
    })
    .catch((error) => {
        response.status(500).send('Ocorreu um erro ao buscar o produto.' + error)
    })
}

const updateProduto = (request, response) => {
    const id = request.params.id
    const { nome, valor, indicacoes, modo_uso, restricoes, peso, consumo_diario, familia_produtos } = request.body

    let query = 'UPDATE PRODUTOS SET '
    const updates = []
    const params = []

    if (nome) {
        params.push(nome)
        updates.push(' nome = $' + params.length)
    }

    if (valor) {
        params.push(valor)
        updates.push(' valor = $' + params.length)
    }

    if (indicacoes !== undefined) {
        params.push(indicacoes)
        updates.push(' indicacoes = $' + params.length)
    }

    if (modo_uso !== undefined) {
        params.push(modo_uso)
        updates.push(' modo_uso = $' + params.length)
    }

    if (restricoes !== undefined) {
        params.push(restricoes)
        updates.push(' restricoes = $' + params.length)
    }

    if (peso) {
        params.push(peso)
        updates.push(' peso = $' + params.length)
    }

    if (consumo_diario) {
        params.push(consumo_diario)
        updates.push(' consumo_diario = $' + params.length)
    }

    if (familia_produtos) {
        params.push(familia_produtos)
        updates.push(' familia_produtos = $' + params.length)
    }

    if (updates.length === 0) { return response.status(400).send('Não há atualizações a serem realizadas.') }

    query += updates.join(', ')
    query += ' WHERE ID = ' + id

    pool.query(query, params)
    .then(() => {
        response.status(200).send('Produto atualizado.')
    })
    .catch((error) => {
        response.status(500).send('Não foi possível atualizar o produto. ' + error)
    })
}

const alterarStatusProduto = (request, response) => {
    const id = parseInt(request.params.id)
    const { inativo } = request.body

    if (typeof inativo !== 'boolean') {
        return response.status(400).send('Valor inválido para status. Esperava um boolean.')
    }

    pool.query(
        'UPDATE PRODUTOS SET INATIVO = $1 WHERE ID = $2',
        [inativo, id]
    )
    .then(() => {
        const acaoRealizada = inativo ? 'inativado' : 'ativado'
        response.status(200).send(`Produto com ID ${id} ${acaoRealizada} com sucesso.`)
    })
    .catch((error) => {
        response.status(500).send('Ocorreu um erro ao inativar o cadastro: ' + error)
    })


}

module.exports = {
    createProduto,
    getProdutos,
    getProdutoById,
    updateProduto,
    alterarStatusProduto
}
