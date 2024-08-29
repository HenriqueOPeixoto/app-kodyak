const ClienteDAO = require('../DAOs/PostgreSQL/ClienteDAO');

exports.createCliente = (req, res) => {
    ClienteDAO.createCliente(req, res);
};

exports.getClientes = (req, res) => {
    ClienteDAO.getClientes(req, res)
};

exports.updateCliente= (req, res) => {
    ClienteDAO.updateCliente(req, res)
};