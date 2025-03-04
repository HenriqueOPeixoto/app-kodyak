const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const authenticateToken = require('../middleware/Authorization');

// Infomar middleware como está abaixo, quando a autenticação estiver pronta no frontend.
// Fazer o mesmo em todas as outras funções.
//router.get('/', authenticateToken, UsuarioController.getUsuarios);

router.post('/', UsuarioController.createUsuario);
router.put('/:id', UsuarioController.updateUsuario);
router.get('/', UsuarioController.getUsuarios);
router.get('/:id', UsuarioController.getUsuarioById);
router.patch('/:id/alterarStatus', UsuarioController.alterarStatusUsuario);

module.exports = router;
