import { Delete, Edit, MoreVert } from "@mui/icons-material"
import { Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material"
import React from "react"

interface Produto {
    id: number,
    nome: string,
    peso: number
}

interface Item {
    id: number
    produto: Produto
    quantidade: number
    valor: number
}

interface ItensPedidoProps {
    listaItens: Item[]
    onDeleteItem: (itemId: number) => void // callback chamado quando deleta, vai permitir que a tela de pedido faça a exclusão
}

const CardItem: React.FC<{ item: Item, onOpenDialog: (itemId: number) => void}> = ({ item, onOpenDialog }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    const handleItemMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleItemMenuClose = () => {
        setAnchorEl(null);
    };
    const handleDeleteButtonClick = () => {
        onOpenDialog(item.id)
        setAnchorEl(null)
    }

    return (
        <Card variant="outlined">
                <CardContent sx={{ position: 'relative' }}>
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
                        <MenuItem onClick={handleDeleteButtonClick}>
                            <ListItemIcon>
                                <Delete sx={{color: 'red'}} fontSize="small" />
                            </ListItemIcon>
                            <ListItemText sx={{ color: 'red' }}>Excluir</ListItemText>
                        </MenuItem>
                    </Menu>
                    
                </CardContent>
        </Card>
    )
}

const ItensPedido: React.FC<ItensPedidoProps> = ({ listaItens, onDeleteItem }) => {

    const [openDialog, setOpenDialog] = React.useState(false)
    const [itemAExcluir, setItemAExcluir] = React.useState<number | null>(null)

    const handleOpenDialog = (itemId: number) => {
        setItemAExcluir(itemId)
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setItemAExcluir(null)
    }

    const handleConfirmDelete = () => {
        if (itemAExcluir) {
            onDeleteItem(itemAExcluir)
        }
        handleCloseDialog()
    }

    return (
        <div>
            {listaItens.map((item: Item) => (
                <CardItem key={item.id} item={item} onOpenDialog={handleOpenDialog} />
            ))}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir este item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleConfirmDelete} color="error">Excluir</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ItensPedido
