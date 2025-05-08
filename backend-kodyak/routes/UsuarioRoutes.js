const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

router.post('/', UsuarioController.createUsuario);
router.get('/eu', UsuarioController.getUsuarioAtual);
router.put('/:id', UsuarioController.updateUsuario);


// O terceiro argumento de getUsuarios é isView, que é false por padrão.
// Se for 'view', o sistema irá buscar a view no banco.
// Se for qualquer outra coisa, o sistema irá buscar a tabela no banco.
router.get('/:type?', (req, res) => {
    const isView = req.params.type === 'view'
    UsuarioController.getUsuarios(req, res, isView)
});

router.get('/:id', UsuarioController.getUsuarioById);
router.patch('/:id/alterarStatus', UsuarioController.alterarStatusUsuario);

module.exports = router;
