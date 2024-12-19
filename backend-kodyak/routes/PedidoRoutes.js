const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');

router.put('/', PedidoController.createPedido)
router.get('/', PedidoController.getPedidos)
router.put('/:id', PedidoController.updatePedido)
router.delete('/:id', PedidoController.deletePedido)

module.exports = router;
