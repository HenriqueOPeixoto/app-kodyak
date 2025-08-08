const express = require('express')
const router = express.Router()
const FormasPagamentoController = require('../controllers/FormasPagamentoController')

router.get('/', FormasPagamentoController.getFormasPagamento)
router.get('/:id', FormasPagamentoController.getFormaPagamentoById)
router.get('/:id/parcelamentos', FormasPagamentoController.getParcelamentosByFormaPagamentoID)

module.exports = router
