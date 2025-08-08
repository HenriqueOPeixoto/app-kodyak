/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('formas_pagamento', function (table) {
    table.integer('id').primary()
    table.text('descricao').notNullable()
    table.boolean('inativo').defaultTo(false)
  })
  .createTable('parcelamentos', function (table) {
    table.integer('id').primary()
    table.text('descricao').notNullable()
    table.integer('forma_pagamento').notNullable().references('id').inTable('formas_pagamento').onDelete('RESTRICT').onUpdate('CASCADE')
    table.boolean('inativo').defaultTo(false)
  })
  .alterTable('pedidos', function (table) {
    table.integer('parcelamento').references('id').inTable('parcelamentos').onDelete('RESTRICT').onUpdate('CASCADE')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .alterTable('pedidos', function (table) {
        table.dropColumn('parcelamento')
    })
    .dropTable('parcelamentos')
    .dropTable('formas_pagamento')
};
