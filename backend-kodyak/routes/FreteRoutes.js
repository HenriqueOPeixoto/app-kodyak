const express = require('express')
const router = express.Router()
const FreteController = require('../controllers/FreteController')

router.post('/', FreteController.createFrete)
router.get('/', FreteController.getFrete)
router.put('/:id', FreteController.updateFrete)
router.get('/:id', FreteController.getFreteById)
router.patch('/:id/alterarStatus', FreteController.alterarStatusFrete)

module.exports = router;
