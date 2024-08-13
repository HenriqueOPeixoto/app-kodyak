const ProdutoDAO = require('../DAOs/PostgreSQL/ProdutoDAO')

exports.createProduto = (req, res) => {
    ProdutoDAO.createProduto(req, res)
}