const express = require('express');
const router = express.Router();
const PedidoItensController = require('../controllers/PedidoItensController');

router.put('/', PedidoItensController.createPedidoItem)
router.put('/:id', PedidoItensController.updatePedidoItem)
router.delete('/:id', PedidoItensController.deletePedidoItem)
router.get('/:id', PedidoItensController.getPedidoItem) 
router.get('/pedido/:pedido', PedidoItensController.getItensByPedido)

module.exports = router;
