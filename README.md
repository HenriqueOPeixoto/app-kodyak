# App Vendas

Sistema de vendas que desenvolvi  para uso interno no Grupo Mano Julio / Kodyak, cobrindo cadastros e fluxo de vendas de ponta a ponta.

# Sobre o projeto

O sistema foi construído para resolver a ausência de um sistema de vendas integrado ao ERP existente, permitindo cadastro de clientes/produtos e registro de vendas de forma centralizada. Desenvolvido sozinho, do zero, incluindo modelagem de banco de dados, API REST e interface web.

# Funcionalidades

- Cadastros: clientes, produtos, motoristas, usuários
- Vendas: criação de pedido, itens, cálculo de totais, status e acompanhamento dos pedidos
- Autenticação: login com JWT, incluindo fluxo de refresh token para renovação de sessão sem exigir novo login
- Segurança: senhas armazenadas com hash, nunca em texto plano
- Permissões: por perfil de usuário

# Tecnologias

## Backend (backend-kodyak/)

- Node.js + Express
- PostgreSQL como banco de dados e queries em pg puro
- JWT (jsonwebtoken) para autenticação, com estratégia de access token + refresh token
- bcrypt (ou similar) para hash de senhas

## Frontend (frontend-kodyak/)

- React
- Biblioteca de estilização — Material UI
- Consumo da API via axios

# Autenticação e segurança

O fluxo de autenticação foi implementado com:

- Emissão de access token (curta duração) no login
- Emissão de refresh token (longa duração) para renovar o access token sem exigir novo login do usuário
- Middleware de proteção de rotas validando o token em cada requisição
- Senhas nunca armazenadas em texto plano — hash aplicado antes da persistência no banco

## Como rodar o projeto

### Arquivo .env
```
URL - para configuração do CORS
PORT - caso queira definir uma porta diferente da padrão (5174)
ACCESS_TOKEN_SECRET - chave usada para validação do JWT
```

### Executando o projeto

```bash
# Backend
cd backend-kodyak
npm install
# configurar variável de ambiente (.env) com o ACCESS_TOKEN_SECRET
npm run dev

# Frontend
cd frontend-kodyak
npm install
npm start
```

## Contexto do projeto

Este sistema foi desenvolvido de forma independente como proposta interna de solução de vendas, concorrendo com uma equipe de desenvolvimento de um fornecedor externo. Apesar de não ter sido implantado, o projeto avançou até um estágio funcional cobrindo os principais fluxos de cadastro e vendas, com mais de 500 commits ao longo do desenvolvimento.

## Aprendizados

- Implementar um fluxo seguro de autenticação com refresh tokens do zero
- Modelar um banco relacional para um domínio de vendas real
- Criação e consumo de APIs REST
- Desenvolvimento frontend com React (useState, useEffect, useMemo) e MaterialUI. 
