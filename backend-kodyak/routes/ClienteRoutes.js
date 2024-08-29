const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');

router.put('/', ClienteController.createCliente)
router.get('/', ClienteController.getClientes)
router.put('/:id', ClienteController.updateCliente)

module.exports = router;
