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
