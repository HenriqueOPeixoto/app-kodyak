const pool = require('./postgres').pool
const estados = require('./localidades_ibge/estados.json')
const municipios = require('./localidades_ibge/municipios.json')

function cadastrarLocalidades() {
    console.log('Aguarde... Cadastrando estados no banco de dados.')
    estados.map((estado) => {
        pool.query(
            'INSERT INTO UNIDADES_FEDERATIVAS (id, sigla, nome, regiao) VALUES ($1, $2, $3, $4)',
            [estado.id, estado.sigla, estado.nome, estado.regiao.id]
        )
        .then(() => { console.log(estado.nome + ' cadastrado com sucesso!') })
        .catch((error) => { console.log('Ocorreu um erro ao cadastrar ' + estado.nome + ' -> ' + error) })
    })
}

cadastrarLocalidades()