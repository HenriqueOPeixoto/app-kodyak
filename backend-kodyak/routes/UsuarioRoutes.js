const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const authenticateToken = require('../middleware/Authorization');

// Infomar middleware como está abaixo, quando a autenticação estiver pronta no frontend.
// Fazer o mesmo em todas as outras funções.
//router.get('/', authenticateToken, UsuarioController.getUsuarios);

router.post('/', UsuarioController.createUsuario);
router.get('/eu', authenticateToken, UsuarioController.getUsuarioAtual)
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
