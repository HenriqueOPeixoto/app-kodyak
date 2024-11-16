const ClientesEnderecosDAO = require('../DAOs/PostgreSQL/ClientesEnderecosDAO')

exports.createEndereco = (req, res) => {
    ClientesEnderecosDAO.createEndereco(req, res);
    
}

exports.getEnderecosByCliente = (req, res) => {
    ClientesEnderecosDAO.getEnderecosByCliente(req, res);
}

exports.updateEndereco = (req, res) => {
    ClientesEnderecosDAO.updateEndereco(req, res);
}

exports.getEnderecoById = (req, res) => {
    ClientesEnderecosDAO.getEnderecoById(req, res);
}

exports.alterarStatusEndereco = (req, res) => {
    ClientesEnderecosDAO.alterarStatusEndereco(req, res);
}

