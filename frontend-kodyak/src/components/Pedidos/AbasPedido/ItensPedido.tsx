import { Delete, Edit, MoreVert } from "@mui/icons-material"
import { Card, CardActionArea, CardContent, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material"
import React from "react"

interface Produto {
    id: number,
    nome: string,
    peso: number
}

interface Item {
    produto: Produto
    quantidade: number
    valor: number
}

interface ItensPedidoProps {
    listaItens: Item[]
}

const CardItem: React.FC<{ item: Item }> = ({ item }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleItemMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleItemMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card variant="outlined">
            <CardActionArea>
                <CardContent>
                    <Typography sx={{ fontWeight: 'bold' }} variant="h6">{item.produto.nome}</Typography>
                    <Typography>
                        Quant. Sacas: { // Mostra entre 0 e 3 casas decimais
                            new Intl.NumberFormat('pt-BR', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 3
                            }).format(item.quantidade / item.produto.peso)
                        }
                    </Typography>
                    <Typography>Peso total: {item.quantidade} Kg</Typography>
                    <Typography sx={{ fontWeight: 'bold' }} variant="h6">{
                            new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(item.valor)
                        }
                    </Typography>
                    <IconButton 
                        sx={{ position: 'absolute', right: 8, top: 8}}
                        onClick={handleItemMenuClick}
                    >
                        <MoreVert />
                    </IconButton>
                    <Menu
                        id="menu-item"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleItemMenuClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleItemMenuClose}>
                            <ListItemIcon>
                                <Edit fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Alterar</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleItemMenuClose}>
                            <ListItemIcon>
                                <Delete sx={{color: 'red'}} fontSize="small" />
                            </ListItemIcon>
                            <ListItemText sx={{ color: 'red' }}>Excluir</ListItemText>
                        </MenuItem>
                    </Menu>
                    
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

const ItensPedido: React.FC<ItensPedidoProps> = ({ listaItens }) => {

    return (
        <div>
            {listaItens.map((item: Item) => (
                <CardItem item={item} />
            ))}
        </div>
    )
}

export default ItensPedido
