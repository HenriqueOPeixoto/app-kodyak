const UsuarioDAO = require('../DAOs/PostgreSQL/UsuarioDAO');

exports.createUsuario = (req, res) => {
    UsuarioDAO.createUsuario(req, res);
};

exports.updateUsuario = (req, res) => {
    UsuarioDAO.updateUsuario(req, res);
};

exports.getUsuarios = (req, res, isView) => {
    UsuarioDAO.getUsuarios(req, res, isView);
};

exports.getUsuarioById = (req, res) => {
    UsuarioDAO.getUsuarioById(req, res);
};

exports.alterarStatusUsuario = (req, res) => {
    UsuarioDAO.alterarStatusUsuario(req, res);
};
