const express = require('express');
const router = express.Router();
const LocalidadesController = require('../controllers/LocalidadesController');

router.get('/unidades_federativas', LocalidadesController.getUnidadesFederativas);
router.get('/unidades_federativas/:id', LocalidadesController.getUnidadeFederativaById);
router.get('/municipios', LocalidadesController.getMunicipios);
router.get('/municipios/:id', LocalidadesController.getMunicipioById);

module.exports = router;