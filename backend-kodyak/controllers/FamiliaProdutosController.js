const FamiliaProdutosDAO = require('../DAOs/PostgreSQL/FamiliaProdutosDAO');

exports.createFamiliaProdutos = (req, res) => {
    FamiliaProdutosDAO.createFamiliaProdutos(req, res);
};

exports.getFamiliaProdutosById = (req, res) => {
    FamiliaProdutosDAO.getFamiliaProdutosById(req, res);
};

exports.getFamiliaProdutos = (req, res) => {
    FamiliaProdutosDAO.getFamiliaProdutos(req, res);
};

exports.alterarStatusFamiliaProdutos = (req, res) => {
    FamiliaProdutosDAO.alterarStatusFamiliaProdutos(req, res);
};

exports.updateFamiliaProdutos = (req, res) => {
    FamiliaProdutosDAO.updateFamiliaProdutos(req, res);
};
