const express = require('express');
const router = express.Router();
const ClientesEnderecosController = require('../controllers/ClientesEnderecosController');

router.post('/', ClientesEnderecosController.createEndereco);
router.get('/', ClientesEnderecosController.getEnderecosByCliente);
router.get('/view', ClientesEnderecosController.getEnderecosViewByCliente);
router.get('/:id', ClientesEnderecosController.getEnderecoById);
router.put('/:id', ClientesEnderecosController.updateEndereco);
router.patch('/:id/alterarStatus', ClientesEnderecosController.alterarStatusEndereco);

module.exports = router;