const BancoDAO = require('../DAOs/PostgreSQL/BancoDAO')

exports.createBanco = (req, res) => {
    BancoDAO.createBanco(req, res)
}

exports.updateBanco = (req, res) => {
    BancoDAO.updateBanco(req, res)
}

exports.getBanco = (req, res) => {
    BancoDAO.getBanco(req, res)
}

exports.getBancoById = (req, res) => {
    BancoDAO.getBancoById(req, res)
}

exports.alterarStatusBanco = (req, res) => {
    BancoDAO.alterarStatusBanco(req, res)
}
