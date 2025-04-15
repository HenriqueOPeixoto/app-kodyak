const PedidoDAO = require('../DAOs/PostgreSQL/PedidoDAO');


exports.createPedido = (req, res) => {
    PedidoDAO.createPedido(req, res)
}

exports.updatePedido = (req, res) => {
    PedidoDAO.updatePedido(req, res)
}

exports.getPedidos = (req, res) => {
    PedidoDAO.getPedidos(req, res)
}

exports.deletePedido = (req, res) => {
    PedidoDAO.deletePedido(req, res)
}

exports.getViewPedidos = (req, res) => {
    PedidoDAO.getViewPedidos(req, res)
}

exports.getPedidoById = (req, res) => {
    PedidoDAO.getPedidoById(req, res)
}

exports.salvarInformacoesFrete = (req, res) => {
    PedidoDAO.salvarInformacoesFrete(req, res)
}

exports.getInfoFreteView = (req, res) => {
    PedidoDAO.getInfoFreteView(req, res)
}
