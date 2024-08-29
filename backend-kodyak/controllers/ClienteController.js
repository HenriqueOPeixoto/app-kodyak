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

exports.getClienteById = (req, res) => {
    ClienteDAO.getClienteById(req, res)
}

exports.alterarStatusCliente = (req, res) => {
    ClienteDAO.alterarStatusCliente(req, res)
}