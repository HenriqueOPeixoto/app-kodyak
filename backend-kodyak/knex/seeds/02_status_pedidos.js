/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('status_pedido').del()
  await knex('vincula_acesso_status').del()

  await knex('status_pedido').insert([
  { id: 0, descricao: "Criado", ordem: 0},
  { id: 1, descricao: "Pendente", ordem: 1},
  { id: 2, descricao: "Análise financeira", ordem: 2},
  { id: 3, descricao: "Aprovado", ordem: 3},
  { id: 4, descricao: "Avaliar comissão", ordem: 4},
  { id: 5, descricao: "Em produção", ordem: 5},
  { id: 6, descricao: "Em rota", ordem: 6},
  { id: 7, descricao: "Entregue", ordem: 7},
  { id: 8, descricao: "Recusado", ordem: 9}
  ]);

  await knex('vincula_acesso_status').insert([
    { id_nivel_acesso: 1, id_status_pedido: 0 },
    { id_nivel_acesso: 1, id_status_pedido: 1 },
    { id_nivel_acesso: 1, id_status_pedido: 2 },
    { id_nivel_acesso: 1, id_status_pedido: 3 },
    { id_nivel_acesso: 1, id_status_pedido: 4 },
    { id_nivel_acesso: 1, id_status_pedido: 5 },
    { id_nivel_acesso: 1, id_status_pedido: 6 },
    { id_nivel_acesso: 1, id_status_pedido: 7 },
    { id_nivel_acesso: 1, id_status_pedido: 8 },
    { id_nivel_acesso: 2, id_status_pedido: 0 },
    { id_nivel_acesso: 2, id_status_pedido: 1 }
  ])
};
