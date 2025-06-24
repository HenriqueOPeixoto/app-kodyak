const fs = require('fs')
const path = require('path')
const pool = require('./postgres').pool
const regioes = require('./localidades_ibge/regioes.json')
const estados = require('./localidades_ibge/estados.json')
const mesorregioes = require('./localidades_ibge/mesorregioes.json')
const microrregioes = require('./localidades_ibge/microrregioes.json')
const municipios = require('./localidades_ibge/municipios.json')

const logFilePath = path.join(__dirname + '/logs', 'erros_localidades.log')

function logToFile(message) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}\n`
    fs.appendFileSync(logFilePath, logMessage)
}

async function cadastrarLocalidades() {
    console.log('=== Aguarde... Cadastrando regioes no banco de dados. ===');
    logToFile('=== Aguarde... Cadastrando regioes no banco de dados. ===');

    // 1. Regiões
    for (const regiao of regioes) {
        try {
            await pool.query(
                'INSERT INTO REGIOES_BRASILEIRAS (id, sigla, nome) VALUES ($1, $2, $3)',
                [regiao.id, regiao.sigla, regiao.nome]
            );
            console.log(`${regiao.nome} cadastrado com sucesso!`);
        } catch (error) {
            logToFile(`Erro ao cadastrar ${regiao.nome}: ${error}`);
            console.log(`Erro ao cadastrar ${regiao.nome}: ${error}`);
        }
    }

    // 2. Estados
    logToFile('=== Cadastrando estados ===');
    for (const estado of estados) {
        try {
            await pool.query(
                'INSERT INTO UNIDADES_FEDERATIVAS (id, sigla, nome, regiao) VALUES ($1, $2, $3, $4)',
                [estado.id, estado.sigla, estado.nome, estado.regiao.id]
            );
            console.log(`${estado.nome} cadastrado com sucesso!`);
        } catch (error) {
            logToFile(`Erro ao cadastrar ${estado.nome}: ${error}`);
            console.log(`Erro ao cadastrar ${estado.nome}: ${error}`);
        }
    }

    // 3. Mesorregiões
    console.log('\n=== Cadastrando mesorregiões ===');
    logToFile('=== Cadastrando mesorregiões ===');
    for (const mesorregiao of mesorregioes) {
        try {
            await pool.query(
                'INSERT INTO MESORREGIOES (id, nome, unidade_federativa) VALUES ($1, $2, $3)',
                [mesorregiao.id, mesorregiao.nome, mesorregiao.UF.id]
            );
            console.log(`${mesorregiao.nome} cadastrado com sucesso!`);
        } catch (error) {
            logToFile(`Erro ao cadastrar ${mesorregiao.nome}: ${error}`);
            console.log(`Erro ao cadastrar ${mesorregiao.nome}: ${error}`);
        }
    }

    // 4. Microrregiões
    console.log('\n=== Cadastrando microrregiões ===');
    logToFile('=== Cadastrando microrregiões ===');
    for (const microrregiao of microrregioes) {
        try {
            await pool.query(
                'INSERT INTO MICRORREGIOES (id, nome, mesorregiao) VALUES ($1, $2, $3)',
                [microrregiao.id, microrregiao.nome, microrregiao.mesorregiao.id]
            );
            console.log(`${microrregiao.nome} cadastrado com sucesso!`);
        } catch (error) {
            logToFile(`Erro ao cadastrar ${microrregiao.nome}: ${error}`);
            console.log(`Erro ao cadastrar ${microrregiao.nome}: ${error}`);
        }
    }

    // 5. Municípios
    console.log('\n=== Cadastrando municípios ===');
    logToFile('=== Cadastrando municípios ===');
    for (const [index, municipio] of municipios.entries()) {
        try {
            await pool.query(
                'INSERT INTO MUNICIPIOS (id, nome, microrregiao) VALUES ($1, $2, $3)',
                [municipio.id, municipio.nome, municipio.microrregiao.id]
            );
            console.log(`${index}: ${municipio.nome} cadastrado com sucesso!`);
        } catch (error) {
            logToFile(`Erro ao cadastrar ${municipio.nome}: ${error}`);
            console.log(`Erro ao cadastrar ${municipio.nome}: ${error}`);
        }
    }

    console.log('\n=== Cadastro finalizado ===');
    console.log('Consulte logs/erros_localidades.log para verificar se algum cadastro falhou.')
    logToFile('=== Cadastro finalizado ===');
}



cadastrarLocalidades()
