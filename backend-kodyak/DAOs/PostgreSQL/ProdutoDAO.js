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
    const { nome, inativo } = request.body

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

module.exports = {
    createProduto,
    getProdutos,
    getProdutoById
}
