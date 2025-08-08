const pool = require('../../postgres').pool

const getFormasPagamento = (request, response) => {
    pool.query(
        'SELECT * FROM FORMAS_PAGAMENTO WHERE INATIVO = FALSE'
    ).then((results) => {
        response.status(200).send(results.rows)
    }).catch((error) => {
        response.status(500).send('Erro ao buscar formas de pagamento: ' + error)
    })
}

const getFormaPagamentoById = (request, response) => {
    const id = request.params.id

    pool.query(
        'SELECT * FROM FORMAS_PAGAMENTO WHERE ID = $1 AND INATIVO = FALSE',
        [id]
    ).then((results) => {
        if (results.rows.length > 0) {
            response.status(200).send(results.rows[0])
        } else {
            response.status(404).send('Forma de pagamento não encontrada')
        }
    }).catch((error) => {
        response.status(500).send('Erro ao buscar forma de pagamento: ' + error)
    })
}

const getParcelamentosByFormaPagamentoID = (request, response) => {
    const formaPagamentoId = request.params.id

    pool.query(
        'SELECT * FROM PARCELAMENTOS WHERE FORMA_PAGAMENTO = $1 AND INATIVO = FALSE',
        [formaPagamentoId]
    ).then((results) => {
        response.status(200).send(results.rows)
    }).catch((error) => {
        response.status(500).send('Erro ao buscar parcelamentos: ' + error)
    })
}

module.exports = {
    getFormasPagamento,
    getFormaPagamentoById,
    getParcelamentosByFormaPagamentoID
}