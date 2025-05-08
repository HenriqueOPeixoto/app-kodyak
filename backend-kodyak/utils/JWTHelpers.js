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

/**
 * Verifica se o access token é válido e retorna o payload.
 * @param token 
 * @returns payload (json)
 */
function decodeToken(token) {
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        return decoded

    } catch (error) {
        // Está aqui apenas como fallback caso o middleware falhe.
        // Em tese esse catch nunca vai executar, pois a verificação do token ocorre antes de executar essa função.
        // Verificar Authorization.js (authenticateToken)
        console.error(error)
    }
    
    
}

module.exports = { jwtTokens, decodeToken }
