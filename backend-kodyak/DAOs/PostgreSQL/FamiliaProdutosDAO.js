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
    const { nome, inativo } = request.query;

    // 1=1 é uma condição neutra, é só para não ter que lidar com o where nos filtros adicionais
    let query = 'SELECT * FROM FAMILIA_PRODUTOS WHERE 1=1 '
    const params = []

    if (nome) {
        // Foi criado um índice para o nome em uppercase no banco de dados.
        // idx_familia_produtos_upper
        // Devido a isso, sempre que fazer uma query por nome,
        // usar o nome em uppercase.
        params.push('%' + nome + '%')
        query += 'AND UPPER(NOME) LIKE UPPER($' + (params.length) + ')'
    }

    if (inativo) {
        query += 'AND INATIVO = $' + (params.length + 1)
        params.push(inativo)
    }

    pool.query(
        query, params, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
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