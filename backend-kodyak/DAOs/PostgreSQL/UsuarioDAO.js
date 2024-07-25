const pool = require('../../postgres').pool

const createUsuario = (request, response) => {
    const { nome, email, senha, representante, nivel_acesso } = request.body

    console.log(request.body)

    pool.query(
        'INSERT INTO USUARIOS (NOME, EMAIL, SENHA, REPRESENTANTE, NIVEL_ACESSO) VALUES ($1, $2 ,$3, $4, $5)',
        [nome, email, senha, representante, nivel_acesso],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(201).send(`USUARIO adicionado com sucesso! ${results.insertId}`)
            
        })
}

// Verifica se e-mail informado no request já está cadastrado no BD
const validaEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT EMAIL FROM USUARIOS WHERE EMAIL = $1', [email], async(error, results) => {
                if (error) {
                    return reject('Ocorreu um erro ao listar usuários: ' + error) // erro
                }
    
                if (results.rows.length > 0) {
                    return resolve(true) // e-mail existe
                }
                resolve(false) //E-mail não existe
            } 
        )

    })

}

const validaSenha = (senha, confirmacao_senha) => {
    return senha === confirmacao_senha
}

const validaCadastro = async (request, response) => {
    const { email, senha, confirmacao_senha } = request.body

    try {
        const emailExiste = await validaEmail(email)
        if (emailExiste) {
            return response.status(409).send('E-mail já está em uso')
        }

        if (!validaSenha(senha, confirmacao_senha)) {
            return response.status(400).send('As senhas não coincidem')
        }

        response.status(200).send('Validação bem-sucedida')
    } catch (error) {
        console.error(error)
        response.status(500).send('Erro no servidor')
    }

}

module.exports = {
    createUsuario,
    validaCadastro
}