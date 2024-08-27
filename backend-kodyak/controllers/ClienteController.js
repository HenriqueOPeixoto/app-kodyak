const ClienteDAO = require('../DAOs/PostgreSQL/ClienteDAO');

exports.createCliente = (req, res) => {
    ClienteDAO.createCliente(req, res);
};