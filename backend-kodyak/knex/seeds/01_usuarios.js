/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del()
  await knex('nivel_acesso').del()

  await knex('nivel_acesso').insert([
    {
      id: 1, descricao: "Administrador"
    },
    {
      id: 2, descricao: "Vendedor"
    }
  ])
  await knex('usuarios').insert([
    {
      nome: 'admin',
      email: 'admin',
      senha: '$2a$10$JR1clzowAFzdqV/WIsz2DOL4uQvlaSke9SCj2QPdAU.39yD5ij2fO',
      nivel_acesso: 1,
      inativo: false 
    }
  ]);
};
