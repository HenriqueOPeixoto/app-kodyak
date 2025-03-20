import { List, ListItem, Typography } from "@mui/material";

function Avisos() {
    return (
        <div>
            <Typography variant="h5">Vendas Kodyak</Typography>
            <Typography variant="h6">Versão: 0.2</Typography>
            <hr />

            <Typography>Seja bem-vindo!</Typography>
            <Typography>Abaixo está disponível o histórico de modificações por versão:</Typography>
            <br />
            <Typography variant="h6">Changelog:</Typography>
            <Typography variant="h6">0.2.1</Typography>
            <List>
                <ListItem>Na listagem de usuários, o sistema exibe nome do representante e nível de acesso, em vez de seus respectivos IDs;</ListItem>
                <ListItem>Caracteres de espaço são ignorados no campo e-mail, quando inseridos no início e no final - Login e Cadastro de Usuários;</ListItem>
                <ListItem>Corrigido erro "Invalid input syntax for type integer" que não permitia cadastrar representantes caso não fosse informado o banco;</ListItem>
                <ListItem>A tela de representantes agora inclui um Autocomplete para selecionar estado e cidade;</ListItem>
                <ListItem>Não é possível cadastrar representantes se campos obrigatórios não estiverem preenchidos;</ListItem>
                <ListItem>Agora o sistema consegue manter sessões de usuário persistentes, sem que seja necessário reinserir as credenciais.</ListItem>
            </List>
            <hr />
            <Typography variant="h6">0.2</Typography>
            <Typography color={'red'}>
                Aviso: Está é uma build de teste da aplicação, podendo apresentar instabilidades.
            </Typography>
            <List>
                <ListItem>Implementada tela de login;</ListItem>
                <ListItem>O sistema agora verifica se o usuário está autenticado ao carregar rotas;</ListItem>
                <ListItem>Adicionado controle de sessão;</ListItem>
                <ListItem>Corrigido bug de verificação de formato de texto, no campo telefone na tela de Representantes, que impedia o usuário de inserir caracteres;</ListItem>
                <ListItem>Implementado Autocomplete para informar representante na tela de cadastro de usuários;</ListItem>
                <ListItem>Corrigido bug que não permitia atualizar dados de usuário, caso o e-mail também não fosse alterado;</ListItem>
                <ListItem>Corrigida falha que armazenava senhas descriptografadas no banco ao atualizar o cadastro de usuário;</ListItem>
                <ListItem>O sistema agora exige que senhas tenham no mínimo 8 caracteres;</ListItem>
            </List>
            <hr />
            <Typography variant="h6">0.1.1</Typography>
            <Typography color={'red'}>
                Aviso: Está é uma build de teste da aplicação, podendo apresentar instabilidades.
            </Typography>
            <List>
                <ListItem>Alguns campos de texto não permitem mais valores com letras minúsculas;</ListItem>
                <ListItem>Os campos da tela de cadastro de clientes não são mais limpos ao clicar em Gravar;</ListItem>
                <ListItem>O seletor de Tipo Pessoa vem marcado como Pessoa Física por padrão, na tela de cadastro de clientes;</ListItem>
                <ListItem>Adicionada função para copiar nome do cliente no campo razão social;</ListItem>
                <ListItem>Telefone celular agora é obrigatório no cadastro de endereços;</ListItem>
                <ListItem>O sistema agora exibe qual submenu está selecionado;</ListItem>
                <ListItem>Ao clicar no botão Voltar, em qualquer tela de cadastro, o sistema agora lembra qual o último menu aberto;</ListItem>
                <ListItem>Corrigida falha interna que disparava erros em massa ao informar uma data nos filtros do pedido;</ListItem>
                <ListItem>Removida opção de informar quantidade de item em sacas;</ListItem>
                <ListItem>Adicionada função para alterar quantidade e valor do item do pedido;</ListItem>
                <ListItem>Adicionada a opção para pesquisar pedidos em um intervalo de datas;</ListItem>
                <ListItem></ListItem>
            </List>
            <hr />
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