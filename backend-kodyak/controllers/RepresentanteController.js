const RepresentanteDAO = require('../DAOs/PostgreSQL/RepresentanteDAO')

exports.createRepresentante = (req, res) => {
    RepresentanteDAO.createRepresentante(req, res)
}
exports.updateRepresentante = (req, res) => {
    RepresentanteDAO.updateRepresentante(req, res)
}
exports.getRepresentante = (req, res) => {
    RepresentanteDAO.getRepresentante(req, res)
}
exports.getRepresentanteById = (req, res) => {
    RepresentanteDAO.getRepresentanteById(req, res)
}
exports.alterarStatusRepresentante = (req, res) => {
    RepresentanteDAO.alterarStatusRepresentante(req, res)
}
