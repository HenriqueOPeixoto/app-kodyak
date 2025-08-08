/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('parcelamentos').del()
  await knex('formas_pagamento').del()

  await knex('formas_pagamento').insert([
    {id: 0, descricao: 'Boleto', inativo: false},
    {id: 1, descricao: 'Débito', inativo: false},
    {id: 2, descricao: 'Crédito', inativo: false},
    {id: 3, descricao: 'Depósito', inativo: false},
    {id: 4, descricao: 'Depósito à prazo', inativo: false},
  ]);

  await knex('parcelamentos').insert([
    {id: 0, descricao: 'À vista',      forma_pagamento: 0, inativo: false},
    {id: 1, descricao: '30',           forma_pagamento: 0, inativo: false},
    {id: 2, descricao: '60',           forma_pagamento: 0, inativo: false},
    {id: 3, descricao: '90',           forma_pagamento: 0, inativo: false},
    {id: 4, descricao: '30/60',        forma_pagamento: 0, inativo: false},
    {id: 5, descricao: '60/90',        forma_pagamento: 0, inativo: false},
    {id: 6, descricao: '30/60/90',     forma_pagamento: 0, inativo: false},
    {id: 7, descricao: '30/60/90/120', forma_pagamento: 0, inativo: false},
    
    {id: 8, descricao: 'À vista',      forma_pagamento: 1, inativo: false},
    
    {id: 9, descricao: 'À vista',      forma_pagamento: 2, inativo: false},
    {id: 10, descricao: '2x',          forma_pagamento: 2, inativo: false},
    {id: 11, descricao: '3x',          forma_pagamento: 2, inativo: false},
    
    {id: 12, descricao: 'À vista',     forma_pagamento: 3, inativo: false},
    
    
    {id: 13, descricao: '30',          forma_pagamento: 4, inativo: false},
    {id: 14, descricao: '60',          forma_pagamento: 4, inativo: false},

  ])

};
