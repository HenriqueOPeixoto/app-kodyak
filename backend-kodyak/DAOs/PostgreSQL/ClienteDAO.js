const pool = require('../../postgres').pool

const createCliente = (request, response) => {
    const {
        razao_social,
        nome,
        cnpj,
        cpf,
        inscricao_estadual,
        telefone_fixo,
        telefone_celular,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado
    } = request.body

    const query =
        `INSERT INTO CLIENTES (
            razao_social, nome, cnpj, cpf, inscricao_estadual, telefone_fixo, telefone_celular,
        email, cep, logradouro, numero, bairro, cidade, estado
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING ID`
    
    const values = [
        razao_social,
        nome,
        cnpj,
        cpf,
        inscricao_estadual,
        telefone_fixo,
        telefone_celular,
        email,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado
    ]

    pool.query(query, values)
    .then((results) => { response.status(201).send(`Cliente cadastrado com ID ${results.rows[0].id}`) })
    .catch((error) => { response.status(500).send('Não foi possível cadastrar o cliente. Erro: ' + error) })

}

module.exports = {
    createCliente
}