const express = require('express');
const router = express.Router();
const ProdutoDAO = require('../controllers/ProdutoController');

router.post('/', ProdutoDAO.createProduto)
router.get('/', ProdutoDAO.getProdutos)
router.get('/:id', ProdutoDAO.getProdutoById)
router.put('/:id', ProdutoDAO.updateProduto)

module.exports = router
