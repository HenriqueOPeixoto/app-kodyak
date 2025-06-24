/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('status_pedido').del()
  await knex('vincula_acesso_status').del()

  await knex('status_pedido').insert([
  { descricao: "Criado", ordem: 0},
  { descricao: "Pendente", ordem: 1},
  { descricao: "Análise financeira", ordem: 2},
  { descricao: "Aprovado", ordem: 3},
  { descricao: "Avaliar comissão", ordem: 4},
  { descricao: "Em produção", ordem: 5},
  { descricao: "Em rota", ordem: 6},
  { descricao: "Entregue", ordem: 7},
  { descricao: "Recusado", ordem: 9}
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
