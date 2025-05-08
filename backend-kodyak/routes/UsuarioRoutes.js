const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

router.post('/', UsuarioController.createUsuario);
router.get('/', (req, res) => { UsuarioController.getUsuarios(req, res, false) });
router.get('/view', (req, res) => { UsuarioController.getUsuarios(req, res, true) });
router.get('/eu', UsuarioController.getUsuarioAtual);
router.put('/:id', UsuarioController.updateUsuario);
router.get('/:id', UsuarioController.getUsuarioById);
router.patch('/:id/alterarStatus', UsuarioController.alterarStatusUsuario);


// O terceiro argumento de getUsuarios é isView, que é false por padrão.
// Se for 'view', o sistema irá buscar a view no banco.
// Se for qualquer outra coisa, o sistema irá buscar a tabela no banco.
//router.get('/:type?', (req, res) => {
//    const isView = req.params.type === 'view'
//    UsuarioController.getUsuarios(req, res, isView)
//});


module.exports = router;
