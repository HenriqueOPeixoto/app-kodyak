const express = require('express');
const router = express.Router();
const ProdutoDAO = require('../controllers/ProdutoController');

router.post('/', ProdutoDAO.createProduto)

module.exports = router
