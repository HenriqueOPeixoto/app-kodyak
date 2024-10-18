const express = require('express');
const router = express.Router();
const BancoController = require('../controllers/BancoController');

router.post('/', BancoController.createBanco)
router.get('/', BancoController.getBanco)
router.put('/:id', BancoController.updateBanco)
router.get('/:id', BancoController.getBancoById)
router.patch('/:id/alterarStatus', BancoController.alterarStatusBanco)

module.exports = router;
