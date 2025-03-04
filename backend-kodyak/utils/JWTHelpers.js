const jwt = require('jsonwebtoken')

function jwtTokens({id, nome, email}) {
    const usuario = { id, nome, email }

    const accessToken = jwt.sign(usuario, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
    const refreshToken = jwt.sign(usuario, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '14d'})

    return ({ accessToken, refreshToken })
}

module.exports = jwtTokens
