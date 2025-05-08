const express = require('express');
const router = express.Router();
const StatusPedidoController = require('../controllers/StatusPedidoController');

router.get('/', StatusPedidoController.getStatusPedidos)
router.get('/:id', StatusPedidoController.getStatusPedidoById)

module.exports = router
