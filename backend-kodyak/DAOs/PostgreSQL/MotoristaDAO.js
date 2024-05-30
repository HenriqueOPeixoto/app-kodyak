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
    pool.query(
        'SELECT * FROM MOTORISTAS', (error, results) => {
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
        [nome, placa, telefone, vinculo, tp_caminhao],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Motorista com ID ${id} foi alterado`)
        }
    )
}

module.exports = {
    createMotorista,
    getMotoristas,
    getMotoristaById,
    updateMotorista
}