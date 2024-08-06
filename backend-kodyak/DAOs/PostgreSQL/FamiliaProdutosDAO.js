const pool = require('../../postgres').pool

const createFamiliaProdutos = (request, response) => {
    const { nome } = request.body

    pool.query(
        'INSERT INTO FAMILIA_PRODUTOS (NOME) VALUES ($1) RETURNING ID',
        [nome]
    ).then((results) => {
        response.status(201).send(`Criada família de produtos com ID ${results.rows[0].id}`)
    }).catch((error) => {
        response.status(500).send('Erro no servidor ao cadastrar família de produtos: ' + error)
    })

}

const alterarStatusFamiliaProdutos = (request, response) => {
    const id = request.params.id
    const { inativo } = request.body

    pool.query(
        'UPDATE FAMILIA_PRODUTOS SET INATIVO = $1 WHERE ID = $2',
        [inativo, id]
    ).then(() => {
        const acaoRealizada = inativo ? 'inativada' : 'ativada'
        response.status(200).send(`Família de produtos com ID ${id} ${acaoRealizada}`)
    }).catch((error) => {
        response.status(500).send('Ocorreu um erro ao alterar status da família de produtos. ' + error)
    })
}

const updateFamiliaProdutos = (request, response) => {
    const id = request.params.id
    const { nome } = request.body

    pool.query(
        'UPDATE FAMILIA_PRODUTOS SET NOME = $1 WHERE ID = $2',
        [nome, id]
    ).then(() => {
        response.status(200).send(`Família de produtos com ID ${id} atualizado`)
    }).catch((error) => {
        response.status(500).send('Ocorreu um erro ao atualizar. ' + error)
    })
}

const getFamiliaProdutos = (request, response) => {
    pool.query('SELECT * FROM FAMILIA_PRODUTOS')
    .then((results) => {
        response.status(200).send(results.rows)
    })
    .catch((error) => {
        response.status(500).send('Ocorreu um erro ao listar as famílias de produtos. ' + error)
    })
}

const getFamiliaProdutosById = (request, response) => {
    const id = request.params.id

    pool.query('SELECT * FROM FAMILIA_PRODUTOS WHERE ID = $1', [id])
    .then((results) => {
        response.status(200).send(results.rows)
    })
    .catch((error) => {
        response.status(500).send('Ocorreu um erro ao consultar família de produto. ' + error)
    })
}

module.exports = {
    createFamiliaProdutos,
    alterarStatusFamiliaProdutos,
    updateFamiliaProdutos,
    getFamiliaProdutos,
    getFamiliaProdutosById
}