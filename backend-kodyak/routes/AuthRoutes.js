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
            return res.status(401).send('E-mail não encontrado')
        }

        // validação de senha
        const isSenhaValida = await bcrypt.compare(senha, usuarios.rows[0].senha)
        if (!isSenhaValida) {
            return res.status(401).send('Senha incorreta')
        }

        // Retorna o token para quem requisitou o login.
        // return res.status(200).send('Sucesso')
        let usuario = {
            id: usuarios.rows[0].id,
            email: usuarios.rows[0].email,
            nivel_acesso: usuarios.rows[0].nivel_acesso
        }
        let tokens = jwtTokens(usuarios.rows[0])
        res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true})
        res.cookie('access_token', tokens.accessToken, {httpOnly: true})
        res.status(200).send('Autenticado.')

    } catch (error) {
        res.status(401).send(error)
    }
})

router.get('/refresh_token', (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token

        if (refreshToken === null) { return res.status(401).json({ error: 'Refresh Token Nulo' }) }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) { return res.status(403).send(error) }

            let tokens = jwtTokens(user)
            res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true})
            res.cookie('access_token', tokens.accessToken, {httpOnly: true})

            // Linha abaixo comentada pois não vejo necessidade em retornar os tokens como json,
            // tendo em vista que já estão salvas como cookies
            // res.json(tokens)
            res.status(200).send('Novos tokens gerados com sucesso.')
        })
    } catch (error) {
        res.status(401).send(error)
    }
})

// Chamado quando o usuário faz logout
router.delete('/refresh_token', (req, res) => {
    try {
        res.clearCookie('refresh_token')
        res.clearCookie('access_token')
        return res.status(200).send('O RefreshToken foi apagado.')
    } catch (error) {
        res.status(401).send(error)
    }
})

module.exports = router