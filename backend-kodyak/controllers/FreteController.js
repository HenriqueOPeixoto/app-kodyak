const FreteDAO = require('../DAOs/PostgreSQL/FreteDAO')

exports.createFrete = (req, res) => {
    FreteDAO.createFrete(req, res)
}

exports.updateFrete = (req, res) => {
    FreteDAO.updateFrete(req, res)
}

exports.getFrete = (req, res) => {
    FreteDAO.getFrete(req, res)
}

exports.getFreteById = (req, res) => {
    FreteDAO.getFreteById(req, res)
}

exports.alterarStatusFrete = (req, res) => {
    FreteDAO.alterarStatusFrete(req, res)
}
