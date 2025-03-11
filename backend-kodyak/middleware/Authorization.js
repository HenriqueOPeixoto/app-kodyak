const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    // Bearer [TOKEN]
    //const authHeader =  req.headers['authorization']
    //const token = authHeader && authHeader.split(' ')[1] // Primeiro verifica se != null e depois do AND separa em ('Bearer', TOKEN)
    
    const token = req.cookies['access_token']

    if (token == null) {
        return res.status(401).send('Token nulo')
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) { return res.status(403).send(error)}
        
        req.user = user
        next()
    })
}

module.exports = authenticateToken
