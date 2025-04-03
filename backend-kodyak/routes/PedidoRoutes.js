const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');

router.post('/', PedidoController.createPedido)
router.get('/', PedidoController.getPedidos)
router.put('/:id/frete', PedidoController.salvarInformacoesFrete)
router.put('/:id', PedidoController.updatePedido)
router.delete('/:id', PedidoController.deletePedido)
router.get('/view', PedidoController.getViewPedidos)
router.get('/:id', PedidoController.getPedidoById)

module.exports = router;
