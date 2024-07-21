const pool = require('../../postgres').pool

const createMotorista = (request, response) => {
    const { nome, placa, telefone, vinculo, tp_caminhao } = request.body

    console.log(request.body)

    pool.query(
        'INSERT INTO MOTORISTAS (NOME, PLACA, TELEFONE, VINCULO, TP_CAMINHAO) VALUES ($1, $2 ,$3, $4, $5)',
        [nome, placa, telefone, vinculo, tp_caminhao],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(201).send(`Motorista adicionado com ID ${results.insertId}`)
            
        })
}

const getMotoristas = (request, response) => {
    const { nome, inativo } = request.query;

    // 1=1 é uma condição neutra, é só para não ter que lidar com o where nos filtros adicionais
    let query = 'SELECT * FROM MOTORISTAS WHERE 1=1 '
    const params = []

    if (nome) {
        // Foi criado um índice para o nome em uppercase no banco de dados.
        // idx_motoristas_nome_upper
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

const getMotoristaById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query(
        'SELECT * FROM MOTORISTAS WHERE ID = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        }
    )
}

const updateMotorista = (request, response) => {
    const id = parseInt(request.params.id)
    const { nome, placa, telefone, vinculo, tp_caminhao } = request.body
    pool.query(
        'UPDATE MOTORISTAS SET NOME = $1, PLACA = $2, TELEFONE = $3, VINCULO = $4, TP_CAMINHAO = $5 WHERE id = $6',
        [nome, placa, telefone, vinculo, tp_caminhao, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Motorista com ID ${id} foi alterado`)
        }
    )
}

const alterarStatusMotorista = (request, response) => {
    const id = parseInt(request.params.id)

    const inativo = request.body.inativo // true ou false

    if (typeof inativo !== 'boolean') {
        return response.status(400).send('Valor inválido para status. Esperava um boolean.')
    }

    pool.query(
        'UPDATE MOTORISTAS SET INATIVO = $1 WHERE ID = $2',
        [inativo, id],
        (error, results) => {
            if (error) {
                throw error
            }
            const acaoRealizada = inativo ? 'inativado' : 'ativado'
            response.status(200).send(`Motorista com ID ${id} ${acaoRealizada}`)
        }
    )
}

module.exports = {
    createMotorista,
    getMotoristas,
    getMotoristaById,
    updateMotorista,
    alterarStatusMotorista
}