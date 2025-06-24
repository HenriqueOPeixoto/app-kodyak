/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('bancos', function (table) {
            table.increments('id')
            table.text('cod_banco').notNullable()
            table.text('nome').notNullable()
            table.text('sigla')
            table.boolean('inativo').notNullable().defaultTo(false)
        })
        .createTable('representantes', function (table) {
            table.increments('id')
            table.text('nome').notNullable(),
            table.string('tipo_pessoa', 1).notNullable(),
            table.text('documento').notNullable(),
            table.text('telefone'),
            table.text('email'),
            table.text('cep'),
            table.text('logradouro'),
            table.text('numero'),
            table.text('bairro'),
            table.text('cidade'),
            table.integer('banco').references('id').inTable('bancos'),
            table.text('conta'),
            table.text('agencia'),
            table.boolean('inativo').defaultTo(false).notNullable()
        })
        .createTable('nivel_acesso', function (table) {
            table.integer('id').notNullable()
            table.text('descricao').notNullable()

            table.primary(['id'])
        })
        .createTable('usuarios', function (table) {
            table.increments('id')
            table.string('nome', 60).notNullable()
            table.string('email', 100).notNullable()
            table.string('senha', 256).notNullable()
            table.integer('nivel_acesso').notNullable().references('id').inTable('nivel_acesso').onUpdate('CASCADE').onDelete('RESTRICT')
            table.integer('representante').references('id').inTable('representantes')
            table.boolean('inativo').notNullable().defaultTo(false)
        })
        .createTable('motoristas', function (table) {
            table.increments('id')
            table.text('nome').notNullable()
            table.text('placa').notNullable()
            table.text('telefone').notNullable()
            table.text('vinculo').notNullable()
            table.integer('tp_caminhao').notNullable()
            table.boolean('inativo').defaultTo(false)
        })
        
        .createTable('clientes', function (table) {
            table.increments('id')
            table.text('razao_social').notNullable()
            table.text('nome').notNullable()
            table.text('documento').notNullable()
            table.string('tipo_pessoa', 1).notNullable()
            table.boolean('inativo').notNullable().defaultTo(false)
        })
        .createTable('clientes_enderecos', function (table) {
            table.increments('id')
            table.text('inscricao_estadual').notNullable()
            table.text('telefone_fixo') 
            table.text('telefone_celular').notNullable()
            table.text('email')
            table.text('cep').notNullable()
            table.text('logradouro').notNullable()
            table.text('numero').notNullable()
            table.text('bairro').notNullable()
            table.integer('cidade').notNullable()
            table.integer('cliente').notNullable().references('id').inTable('clientes').onUpdate('CASCADE').onDelete('RESTRICT')
            table.boolean('inativo').defaultTo(false).notNullable()
            table.text('complemento_cnpj')
            table.text('digito_cnpj')
            table.text('descricao')
        })
        .createTable('familia_produtos', function (table) {
            table.increments('id')
            table.text('nome').notNullable()
            table.boolean('inativo').defaultTo(false)
        })
        .createTable('produtos', function (table) {
            table.increments('id')
            table.text('nome').notNullable(),
            table.decimal('valor').notNullable(),
            table.text('indicacoes'),
            table.text('modo_uso'),
            table.text('restricoes'),
            table.decimal('peso').notNullable(),
            table.decimal('consumo_diario'),
            table.integer('familia_produtos').notNullable().references('id').inTable('familia_produtos').onUpdate('CASCADE').onDelete('RESTRICT'),
            table.boolean('inativo').defaultTo(false).notNullable()
        })
        .createTable('fretes', function (table) {
            table.increments('id')
            table.integer('cidade').notNullable(),
            table.decimal('valor_frete').notNullable(),
            table.decimal('icms_frete').notNullable(),
            table.decimal('icms_venda').notNullable(),
            table.boolean('inativo').defaultTo(false).notNullable()
        })
        .createTable('regioes_brasileiras', function (table) {
            table.integer('id').notNullable()
            table.text('sigla').notNullable()
            table.text('nome').notNullable()

            table.primary(['id'])
        })
        .createTable('unidades_federativas', function (table) {
            table.integer('id').notNullable()
            table.text('sigla').notNullable()
            table.text('nome').notNullable()
            table.integer('regiao').notNullable().references('id').inTable('regioes_brasileiras').onUpdate('CASCADE').onDelete('RESTRICT')

            table.primary(['id'])
        })
        .createTable('mesorregioes', function (table) {
            table.integer('id').notNullable()
            table.text('nome').notNullable()
            table.integer('unidade_federativa').notNullable().references('id').inTable('unidades_federativas').onUpdate('CASCADE').onDelete('RESTRICT')

            table.primary(['id'])
        })
        .createTable('microrregioes', function (table) {
            table.integer('id')
            table.text('nome').notNullable()
            table.integer('mesorregiao').notNullable().references('id').inTable('mesorregioes').onUpdate('CASCADE').onDelete('RESTRICT')

            table.primary(['id'])
        })
        .createTable('municipios', function (table) {
            table.integer('id')
            table.text('nome').notNullable()
            table.integer('microrregiao').notNullable().references('id').inTable('microrregioes').onUpdate('CASCADE').onDelete('RESTRICT')

            table.primary(['id'])
        })
        .createTable('status_pedido', function (table) {
            table.increments('id')
            table.text('descricao').notNullable()
            table.integer('ordem').notNullable()
        })
        .createTable('vincula_acesso_status', function (table) {
            table.integer('id_nivel_acesso').notNullable()
            table.integer('id_status_pedido').notNullable()

            table.primary(['id_nivel_acesso', 'id_status_pedido'])
        })
        .createTable('pedidos', function (table) {
            table.increments('id')
            table.timestamp('data', { useTz: true }).notNullable()
            table.integer('status').notNullable().references('id').inTable('status_pedido').onDelete('RESTRICT').onUpdate('CASCADE')
            table.text('observacoes')
            table.integer('cliente_endereco').notNullable().references('id').inTable('clientes_enderecos').onDelete('RESTRICT').onUpdate('CASCADE')
            table.boolean('retirada_loja')
            table.decimal('valor_frete')
            table.integer('municipio_entrega').references('id').inTable('municipios').onDelete('RESTRICT').onUpdate('CASCADE')
            table.text('cep_entrega')
            table.text('logradouro_entrega')
            table.text('numero_entrega')
            table.decimal('valor_extra', 12, 2)
            table.decimal('valor_chapa', 12, 2)
            table.date('data_agendamento')
            table.decimal('icms_frete_percentual')
            table.decimal('icms_venda_percentual')

        })
        .createTable('pedidos_itens', function (table) {
            table.increments('id')
            table.integer('produto').notNullable().references('id').inTable('produtos').onDelete('RESTRICT').onUpdate('CASCADE')
            table.decimal('quantidade').notNullable()
            table.decimal('valor', 12, 2).notNullable()
            table.integer('pedido').notNullable().references('id').inTable('pedidos').onDelete('RESTRICT').onUpdate('CASCADE')
        })

        // VIEWS

        //MUNICIPIOS POR UF
        .raw(` CREATE MATERIALIZED VIEW municipios_por_uf AS
                SELECT m.id AS id_municipio,
                    m.nome AS nome_municipio,
                    uf.id AS id_uf,
                    uf.nome AS nome_uf,
                    uf.sigla AS sigla_uf,
                    uf.regiao AS regiao_uf
                FROM municipios m
                    JOIN microrregioes micro ON m.microrregiao = micro.id
                    JOIN mesorregioes meso ON micro.mesorregiao = meso.id
                    JOIN unidades_federativas uf ON meso.unidade_federativa = uf.id;`)
        
        //VW_CLIENTES_ENDERECOS
        .raw(`
            CREATE OR REPLACE VIEW vw_clientes_enderecos AS
             SELECT e.id,
                e.descricao,
                e.inscricao_estadual,
                e.telefone_fixo,
                e.telefone_celular,
                e.email,
                e.cep,
                e.logradouro,
                e.numero,
                e.bairro,
                m.nome AS cidade,
                uf.sigla AS estado,
                e.cliente,
                e.inativo,
                e.complemento_cnpj
            FROM clientes_enderecos e
                JOIN municipios m ON e.cidade = m.id
                JOIN microrregioes mic ON m.microrregiao = mic.id
                JOIN mesorregioes meso ON mic.mesorregiao = meso.id
                JOIN unidades_federativas uf ON meso.unidade_federativa = uf.id;
            `)

        //VW_USUARIOS
        .raw(`
            CREATE OR REPLACE VIEW vw_usuarios AS
             SELECT u.id,
                u.nome,
                u.email,
                r.nome AS representante,
                n.descricao AS nivel_acesso,
                u.inativo
            FROM usuarios u
                LEFT JOIN representantes r ON u.representante = r.id
                INNER JOIN nivel_acesso n ON u.nivel_acesso = n.id;
            `)
        
        //VW_FRETES
        .raw(`
            CREATE OR REPLACE VIEW vw_fretes AS
             SELECT f.id,
                m.id_uf,
                m.nome_uf,
                m.id_municipio,
                m.nome_municipio,
                f.valor_frete,
                f.icms_frete,
                f.icms_venda
            FROM fretes f
                JOIN municipios_por_uf m ON f.cidade = m.id_municipio;
            `)
        
        //VW_PEDIDO_FRETE
        .raw(`
            CREATE OR REPLACE VIEW vw_pedido_frete AS
             SELECT p.id,
                p.retirada_loja,
                p.valor_frete,
                m.nome_municipio AS municipio_entrega,
                m.sigla_uf AS uf_entrega,
                p.cep_entrega,
                p.logradouro_entrega,
                p.numero_entrega,
                p.valor_extra,
                p.valor_chapa,
                p.data_agendamento,
                p.icms_venda_percentual,
                p.icms_frete_percentual
            FROM pedidos p
                LEFT JOIN municipios_por_uf m ON p.municipio_entrega = m.id_municipio::numeric;
            `)
        
        //VW_PEDIDOS
        .raw(`
            CREATE OR REPLACE VIEW vw_pedidos AS
             SELECT ped.id,
                ped.data,
                ped.status,
                cli.razao_social,
                cli.documento
            FROM pedidos ped
                JOIN clientes_enderecos e ON e.id = ped.cliente_endereco
                JOIN clientes cli ON cli.id = e.cliente;
            `)

        //VW_PEDIDOS_ITENS
        .raw(`
            CREATE OR REPLACE VIEW vw_pedidos_itens AS
             SELECT it.id,
                it.produto,
                it.quantidade,
                it.valor,
                it.pedido,
                p.id AS id_produto,
                p.nome,
                p.valor AS valor_produto,
                p.indicacoes,
                p.modo_uso,
                p.restricoes,
                p.peso,
                p.consumo_diario,
                p.familia_produtos,
                p.inativo
            FROM pedidos_itens it
                JOIN produtos p ON p.id = it.produto;
            `)
        
        // FUNCTIONS
        
        //set_retirada_loja()]
        .raw(`
            CREATE OR REPLACE FUNCTION public.set_retirada_loja(
                pedido_id integer,
                data_agendamento_pedido date)
                RETURNS void
                LANGUAGE 'plpgsql'
                COST 100
                VOLATILE PARALLEL UNSAFE
            AS $BODY$
            BEGIN
                -- Verifica se o pedido existe
                IF EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id) THEN
                    -- Atualiza o endereço do pedido para NULL
                    UPDATE pedidos
                    SET 
                        RETIRADA_LOJA = TRUE,
                        DATA_AGENDAMENTO = data_agendamento_pedido,
                        VALOR_FRETE = NULL,
                        MUNICIPIO_ENTREGA = NULL,
                        CEP_ENTREGA = NULL,
                        LOGRADOURO_ENTREGA = NULL,
                        NUMERO_ENTREGA = NULL,
                        VALOR_EXTRA = NULL,
                        VALOR_CHAPA = NULL,
                        ICMS_VENDA_PERCENTUAL = NULL,
                        ICMS_FRETE_PERCENTUAL = NULL
                    WHERE id = pedido_id;
                ELSE
                    RAISE NOTICE 'Pedido com ID % não encontrado.', pedido_id;
                END IF;
            END;
            $BODY$;

            ALTER FUNCTION public.set_retirada_loja(integer, date)
                OWNER TO postgres;
            `)
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema

    .raw(`DROP FUNCTION SET_RETIRADA_LOJA`)

    .dropViewIfExists('vw_clientes_enderecos')
    .dropViewIfExists('vw_usuarios')
    .dropViewIfExists('vw_fretes')
    .dropViewIfExists('vw_pedido_frete')
    .dropViewIfExists('vw_pedidos')
    .dropViewIfExists('vw_pedidos_itens')
    
    .dropMaterializedViewIfExists('municipios_por_uf')

    .dropTable('pedidos_itens')
    .dropTable('pedidos')
    .dropTable('usuarios')
    .dropTable('representantes')
    .dropTable('bancos')
    .dropTable('vincula_acesso_status')
    .dropTable('nivel_acesso')
    .dropTable('motoristas')
    .dropTable('clientes_enderecos')
    .dropTable('clientes')
    .dropTable('produtos')
    .dropTable('familia_produtos')
    .dropTable('fretes')
    .dropTable('municipios')
    .dropTable('microrregioes')
    .dropTable('mesorregioes')
    .dropTable('unidades_federativas')
    .dropTable('regioes_brasileiras')
    .dropTable('status_pedido')
};
