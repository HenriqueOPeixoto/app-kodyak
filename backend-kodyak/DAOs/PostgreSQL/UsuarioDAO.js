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

    //Validar credenciais antes de registrar.
    validaCadastro(request)
        .then(() => {
            pool.query(
                'INSERT INTO USUARIOS (NOME, EMAIL, SENHA, REPRESENTANTE, NIVEL_ACESSO) VALUES ($1, $2 ,$3, $4, $5) RETURNING id',
                [nome, email, senha, representante, nivel_acesso],
                (error, results) => {
                    if (error) {
                        throw error
                    }

                    response.status(201).send(`USUARIO adicionado com sucesso! ${results.rows[0].id}`)

                })

        })
        .catch((error) => {
            console.log('Ocorreu um erro', error)
            const codErro = CodigoStatus[error.message] || 500
            response.status(codErro).send(error.message)
        })

}

const updateUsuario = async (request, response) => {
    const { id, nome, email, senha, representante, nivel_acesso } = request.body

    let query = 'UPDATE USUARIOS SET'
    let updates = []
    const params = []

    if (nome) {
        params.push(nome)
        updates.push(' NOME = $' + (params.length))
    }
    
    if (email) {
        try {
            const emailExiste = await validaEmail(email)
            if (emailExiste) {
                return response.status(400).send('O e-mail informado já está em uso.')
            }
            params.push(email)
            updates.push(' EMAIL = $' + (params.length))
            
        } catch {
            console.log(error)
            return response.status(500).send('Erro ao validar o e-mail.');
        }
    }

    if (senha) {
        params.push(senha)
        updates.push(' SENHA = $' + (params.length))
    }
    
    if (representante) {
        params.push(representante)
        updates.push(' REPRESENTANTE = $' + (params.length))
    }
    
    if (nivel_acesso) {
        params.push(nivel_acesso)
        updates.push(' NIVEL_ACESSO = $' + (params.length))
    }

    query += updates.join(', ')

    query += ' WHERE ID = ' + (id)

    pool.query(query, params,
        (error, results) => {
            if (error) {
                return response.status(400).send('Ocorreu um erro ao atualizar o usuário')
            }
            return response.status(200).send(`Usuário ${id} atualizado com sucesso!`)
        }
    )

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

const getUsuarios = (request, response) => {
    const { nome, inativo } = request.query;

    // 1=1 é uma condição neutra, é só para não ter que lidar com o where nos filtros adicionais
    let query = 'SELECT * FROM USUARIOS WHERE 1=1 '
    const params = []

    if (nome) {
        // Foi criado um índice para o nome em uppercase no banco de dados.
        // idx_usuarios_nome_upper
        // Devido a isso, sempre que fazer uma query por nome,
        // usar o nome em uppercase.
        params.push('%' + nome + '%')
        query += 'AND UPPER(NOME) LIKE UPPER($' + (params.length) + ')'
    }

    if (inativo) {
        query += 'AND INATIVO = $' + (params.length + 1)
        params.push(inativo)
    }

    pool.query(
        query, params, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

const getUsuarioById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query(
        'SELECT * FROM USUARIOS WHERE ID = $1',
        [id]
    ).then((results) => {
        response.status(200).json(results.rows)
    })
    .catch((error) => {
        console.log(error)
        response.status(500).send(error)
    })
}

const inativarUsuario = (request, response) => {
    
}

module.exports = {
    createUsuario,
    updateUsuario,
    validaCadastro,
    getUsuarios,
    getUsuarioById,
    inativarUsuario
}