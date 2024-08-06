const NivelAcessoDAO = require('../DAOs/PostgreSQL/NivelAcessoDAO');

exports.getNivelAcesso = (req, res) => {
    NivelAcessoDAO.getNivelAcesso(req, res);
};

exports.getNivelAcessoById = (req, res) => {
    NivelAcessoDAO.getNivelAcessoById(req, res);
};
