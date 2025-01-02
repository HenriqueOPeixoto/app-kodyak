const PedidoItensDAO = require('../DAOs/PostgreSQL/PedidosItensDAO');

exports.createPedidoItem = (req, res) => {
    PedidoItensDAO.createPedidoItem(req, res)
}

exports.updatePedidoItem = (req, res) => {
    PedidoItensDAO.updatePedidoItem(req, res)
}

exports.getPedidoItem = (req, res) => {
    PedidoItensDAO.getPedidoItem(req, res)
}

exports.getItensByPedido = (req, res) => {
    PedidoItensDAO.getItensByPedido(req, res)
}

exports.deletePedidoItem = (req, res) => {
    PedidoItensDAO.deletePedidoItem(req, res)
}

exports.getItensCompletosByPedido = (req, res) => {
    PedidoItensDAO.getItensCompletosByPedido(req, res)
}
