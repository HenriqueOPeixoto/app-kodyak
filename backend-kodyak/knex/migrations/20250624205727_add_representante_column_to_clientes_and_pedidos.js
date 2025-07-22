/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('clientes', function (table) {
    table.integer('representante').references('id').inTable('representantes').onUpdate('CASCADE').onDelete('RESTRICT')
  })
  .alterTable('pedidos', function (table) {
    table.integer('representante').references('id').inTable('representantes').onUpdate('CASCADE').onDelete('RESTRICT')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('clientes', function (table) {
    table.dropColumn('representante')
  })
  .alterTable('pedidos', function (table) {
    table.dropColumn('representante')
  })
};
