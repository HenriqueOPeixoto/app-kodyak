const express = require('express');
const router = express.Router();
const MotoristaController = require('../controllers/MotoristaController');

router.post('/cadastro', MotoristaController.createMotorista);
router.get('/', MotoristaController.getMotoristas);
router.get('/:id', MotoristaController.getMotoristaById);
router.put('/:id', MotoristaController.updateMotorista);
router.put('/:id/alterarStatus', MotoristaController.alterarStatusMotorista);

module.exports = router;