const express = require('express');
const router = express.Router();
const FamiliaProdutosController = require('../controllers/FamiliaProdutosController');

router.post('/', FamiliaProdutosController.createFamiliaProdutos);
router.get('/:id', FamiliaProdutosController.getFamiliaProdutosById);
router.get('/', FamiliaProdutosController.getFamiliaProdutos);
router.patch('/:id/alterarStatus', FamiliaProdutosController.alterarStatusFamiliaProdutos);
router.put('/:id', FamiliaProdutosController.updateFamiliaProdutos);

module.exports = router;
