const StatusPedidoDAO = require('../DAOs/PostgreSQL/StatusPedidoDAO');

exports.getStatusPedidos = (req, res, isView) => {
    StatusPedidoDAO.getStatusPedidos(req, res, isView);
};

exports.getStatusPedidoById = (req, res) => {
    StatusPedidoDAO.getStatusPedidoById(req, res);
};