const jwt = require('jsonwebtoken')

function jwtTokens({id, nome, email}) {
    // Enquanto não for necessário passar mais informações, o token será gerado apenas com
    // o ID no payload.
    //const usuario = { id, nome, email }
    const usuario = { id }

    const accessToken = jwt.sign(usuario, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
    const refreshToken = jwt.sign(usuario, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'})

    return ({ accessToken, refreshToken })
}

module.exports = jwtTokens
