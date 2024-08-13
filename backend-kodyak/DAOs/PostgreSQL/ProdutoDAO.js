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

module.exports = {
    createProduto
}
