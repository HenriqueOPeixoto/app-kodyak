const express = require('express');
const router = express.Router();
const RepresentanteController = require('../controllers/RepresentanteController');

router.post('/', RepresentanteController.createRepresentante)
router.get('/',  RepresentanteController.getRepresentante)
router.get('/:id', RepresentanteController.getRepresentanteById)
router.put('/:id', RepresentanteController.updateRepresentante)
router.patch('/:id/alterarStatus', RepresentanteController.alterarStatusRepresentante)

module.exports = router
