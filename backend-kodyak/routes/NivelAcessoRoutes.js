const express = require('express');
const router = express.Router();
const NivelAcessoController = require('../controllers/NivelAcessoController');

router.get('/', NivelAcessoController.getNivelAcesso);
router.get('/:id', NivelAcessoController.getNivelAcessoById);

module.exports = router;
