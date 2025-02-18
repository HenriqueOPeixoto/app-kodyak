const pool = require('./postgres').pool
const regioes = require('./localidades_ibge/regioes.json')
const estados = require('./localidades_ibge/estados.json')
const mesorregioes = require('./localidades_ibge/mesorregioes.json')
const microrregioes = require('./localidades_ibge/microrregioes.json')
const municipios = require('./localidades_ibge/municipios.json')

function cadastrarLocalidades() {
    console.log('=== Aguarde... Cadastrando regioes no banco de dados. ===')
    regioes.map((regiao) => {
        pool.query(
            'INSERT INTO REGIOES_BRASILEIRAS (id, sigla, nome) VALUES ($1, $2, $3)',
            [regiao.id, regiao.sigla, regiao.nome]
        )
        .then(() => { console.log(regiao.nome + ' cadastrado com sucesso!') })
        .catch((error) => { console.log('Ocorreu um erro ao cadastrar ' + regiao.nome + ' -> ' + error) })
    })

    estados.map((estado) => {
        pool.query(
            'INSERT INTO UNIDADES_FEDERATIVAS (id, sigla, nome, regiao) VALUES ($1, $2, $3, $4)',
            [estado.id, estado.sigla, estado.nome, estado.regiao.id]
        )
        .then(() => { console.log(estado.nome + ' cadastrado com sucesso!') })
        .catch((error) => { console.log('Ocorreu um erro ao cadastrar ' + estado.nome + ' -> ' + error) })
    })

    console.log('\n')
    console.log('=== Cadastrando mesorregiões ===')
    mesorregioes.map((mesorregiao) => {
        pool.query(
            'INSERT INTO MESORREGIOES (id, nome, unidade_federativa) VALUES ($1, $2, $3)',
            [mesorregiao.id, mesorregiao.nome, mesorregiao.UF.id]
        )
        .then(() => { console.log(mesorregiao.nome + ' cadastrado com sucesso!') })
        .catch((error) => { console.log('Ocorreu um erro ao cadastrar ' + mesorregiao.nome + ' -> ' + error) })
    })

    console.log('\n')
    console.log('=== Cadastrando microrregiões ===')
    microrregioes.map((microrregiao) => {
        pool.query(
            'INSERT INTO MICRORREGIOES (id, nome, mesorregiao) VALUES ($1, $2, $3)',
            [microrregiao.id, microrregiao.nome, microrregiao.mesorregiao.id]
        )
        .then(() => { console.log(microrregiao.nome + ' cadastrado com sucesso!') })
        .catch((error) => { console.log('Ocorreu um erro ao cadastrar ' + microrregiao.nome + ' -> ' + error) })
    })

    console.log('\n')
    console.log('=== Cadastrando municípios ===')
    municipios.map((municipio, index) => {
        pool.query(
            'INSERT INTO MUNICIPIOS (id, nome, microrregiao) VALUES ($1, $2, $3)',
            [municipio.id, municipio.nome, municipio.microrregiao.id]
        )
        .then(() => { console.log(index + ': ' + municipio.nome + ' cadastrado com sucesso!') })
        .catch((error) => { console.log('Ocorreu um erro ao cadastrar ' + municipio.nome + ' -> ' + error) })
    })
}

cadastrarLocalidades()