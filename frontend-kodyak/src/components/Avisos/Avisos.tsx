import { List, ListItem, Typography } from "@mui/material";

function Avisos() {
    return (
        <div>
            <Typography variant="h5">Vendas Kodyak</Typography>
            <Typography variant="h6">Versão: 0.1</Typography>
            <hr />

            <Typography>Seja bem-vindo!</Typography>
            <Typography>Abaixo está disponível o histórico de modificações por versão:</Typography>
            <br />
            <Typography variant="h6">Changelog:</Typography>
            <Typography variant="h6">0.1 - Versão inicial do projeto</Typography>
            <Typography color={'red'}>
                Aviso: Está é uma build de teste da aplicação, podendo apresentar instabilidades.
            </Typography>
            <List>
                <ListItem>Implementado protótipo da IU;</ListItem>
                <ListItem>Implementado cadastro de clientes;</ListItem>
                <ListItem>Implementado cadastro de endereços;</ListItem>
                <ListItem>Implementado cadastro de família de produtos;</ListItem>
                <ListItem>Implementado cadastro de produtos;</ListItem>
                <ListItem>Implementado cadastro de bancos;</ListItem>
                <ListItem>Implementado cadastro de motoristas;</ListItem>
                <ListItem>Implementado cadastro de representantes;</ListItem>
                <ListItem>Implementado cadastro de usuários (apenas para armazenamento, ainda não há autenticação de usuários);</ListItem>
                <ListItem>Implementado criação de pedidos, porém ainda não permite cadastrar frete.</ListItem>
            </List>

        </div>
    )
  }
  
  export default Avisos