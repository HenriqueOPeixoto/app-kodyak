const ProdutoDAO = require('../DAOs/PostgreSQL/ProdutoDAO')

exports.createProduto = (req, res) => {
    ProdutoDAO.createProduto(req, res)
}

exports.getProdutos = (req, res) => {
    ProdutoDAO.getProdutos(req, res)
}

exports.getProdutoById = (req, res) => {
    ProdutoDAO.getProdutoById(req, res)
}

exports.updateProduto = (req, res) => {
    ProdutoDAO.updateProduto(req, res)
}