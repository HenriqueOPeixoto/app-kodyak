const FormasPagamentoDAO = require('../DAOs/PostgreSQL/FormasPagamentoDAO');

exports.getFormasPagamento = (req, res) => {
    FormasPagamentoDAO.getFormasPagamento(req, res)
}

exports.getFormaPagamentoById = (req, res) => {
    FormasPagamentoDAO.getFormaPagamentoById(req, res)
}

exports.getParcelamentosByFormaPagamentoID = (req, res) => {
    FormasPagamentoDAO.getParcelamentosByFormaPagamentoID(req, res)
}
