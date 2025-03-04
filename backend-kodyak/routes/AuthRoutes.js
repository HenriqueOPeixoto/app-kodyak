const express = require('express');
const pool = require('../postgres').pool
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const jwtTokens = require('../utils/JWTHelpers');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body

        // Como e-mail é UNIQUE no banco, a linha abaixo irá sempre retornar um registro apenas
        const usuarios = await pool.query('SELECT * FROM USUARIOS WHERE email = $1', [email])

        if (usuarios.rows.length === 0) {
            return res.status(401).send('E-mail incorreto')
        }

        // validação de senha
        const isSenhaValida = await bcrypt.compare(senha, usuarios.rows[0].senha)
        if (!isSenhaValida) {
            return res.status(401).send('Senha incorreta')
        }

        // Retorna o token para quem requisitou o login.
        // return res.status(200).send('Sucesso')
        let tokens = jwtTokens(usuarios.rows[0])
        res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true})
        res.json(tokens)

    } catch (error) {
        res.status(401).send(error)
    }
})

module.exports = router