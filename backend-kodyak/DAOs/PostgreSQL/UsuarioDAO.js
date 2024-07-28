const pool = require('../../postgres').pool

const MensagensErro = {
    EMAIL_EM_USO: 'E-mail já está em uso',
    SENHAS_NAO_COINCIDEM: 'Senhas não coincidem',
    ERRO_SERVIDOR: 'Erro no servidor'
}

const CodigoStatus = {
    [MensagensErro.EMAIL_EM_USO]: 409,
    [MensagensErro.SENHAS_NAO_COINCIDEM]: 400,
    [MensagensErro.ERRO_SERVIDOR]: 500
}

const createUsuario = (request, response) => {
    const { nome, email, senha, confirmacao_senha, representante, nivel_acesso } = request.body

    console.log(request.body)

    //Validar credenciais antes de registrar.
    validaCadastro(request)
        .then(() => {
            pool.query(
                'INSERT INTO USUARIOS (NOME, EMAIL, SENHA, REPRESENTANTE, NIVEL_ACESSO) VALUES ($1, $2 ,$3, $4, $5)',
                [nome, email, senha, representante, nivel_acesso],
                (error, results) => {
                    if (error) {
                        throw error
                    }

                    response.status(201).send(`USUARIO adicionado com sucesso! ${results.insertId}`)

                })

        })
        .catch((error) => {
            console.log('Ocorreu um erro', error)
            const codErro = CodigoStatus[error.message] || 500
            response.status(codErro).send(error.message)
        })

}

// Verifica se e-mail informado no request já está cadastrado no BD
const validaEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT EMAIL FROM USUARIOS WHERE EMAIL = $1', [email], async (error, results) => {
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

const validaCadastro = (request) => {
    const { email, senha, confirmacao_senha } = request.body
    
    return new Promise((resolve, reject) => {
        validaEmail(email)
        .then((emailExiste) => {
            
            //const emailExiste = validaEmail(email)
            if (emailExiste) {
                //return response.status(409).send('E-mail já está em uso')
                reject(new Error(MensagensErro.EMAIL_EM_USO))
            }

            if (!validaSenha(senha, confirmacao_senha)) {
                //return response.status(400).send('As senhas não coincidem')
                console.log(MensagensErro.SENHAS_NAO_COINCIDEM)
                reject(new Error(MensagensErro.SENHAS_NAO_COINCIDEM))
            }

            resolve('Validação bem-sucedida')
        })
        .catch((error) => {
            console.error(error)
            //response.status(500).send('Erro no servidor')
            reject(new Error(MensagensErro.ERRO_SERVIDOR))
        })
        }
    )

}

module.exports = {
    createUsuario,
    validaCadastro
}