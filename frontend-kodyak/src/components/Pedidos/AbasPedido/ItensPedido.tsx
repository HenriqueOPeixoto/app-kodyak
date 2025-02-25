import { Delete, Edit, MoreVert } from "@mui/icons-material"
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography } from "@mui/material"
import React from "react"
import { NumericFormat } from "react-number-format"

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
    onAlterarItem: (itemId: number, novaQuantidade: number) => void // callback chamado quando altera a quantidade, vai permitir que a tela de pedido também processe a alteração
}

const CardItem: React.FC<{ item: Item, onOpenDialogExcluir: (itemId: number) => void, onOpenDialogAlterar: (itemId: number) => void}> = ({ item, onOpenDialogExcluir, onOpenDialogAlterar }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    const handleItemMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleItemMenuClose = () => {
        setAnchorEl(null);
    };
    const handleDeleteButtonClick = () => {
        onOpenDialogExcluir(item.id)
        setAnchorEl(null)
    }
    const handleAlterarButtonClick = () => {
        onOpenDialogAlterar(item.id)
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
                        <MenuItem onClick={handleAlterarButtonClick}>
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

const ItensPedido: React.FC<ItensPedidoProps> = ({ listaItens, onDeleteItem, onAlterarItem }) => {

    const [openDialogExcluir, setOpenDialogExcluir] = React.useState(false)
    const [openDialogAlterar, setOpenDialogAlterar] = React.useState(false)

    const [itemAExcluir, setItemAExcluir] = React.useState<number | null>(null)
    
    const [itemAlterar, setItemAlterar] = React.useState<number | null>(null)
    const [novaQuantidade, setNovaQuantidade] = React.useState<number | null>(null)

    const handleOpenDialogExcluir = (itemId: number) => {
        setItemAExcluir(itemId)
        setOpenDialogExcluir(true)
    }

    const handleCloseDialogExcluir = () => {
        setOpenDialogExcluir(false)
        setItemAExcluir(null)
    }

    const handleConfirmExcluir = () => {
        if (itemAExcluir) {
            onDeleteItem(itemAExcluir)
        }
        handleCloseDialogExcluir()
    }

    const handleOpenDialogAlterar = (itemId: number) => {
        setItemAlterar(itemId)
        setOpenDialogAlterar(true)
    }

    const handleCloseDialogAlterar = () => {
        setOpenDialogAlterar(false)
        setItemAlterar(null)
    }

    const handleConfirmAlterar = () => {
        if (itemAlterar && novaQuantidade) {
            onAlterarItem(itemAlterar, novaQuantidade)
        }
        handleCloseDialogAlterar()
    }

    return (
        <div>
            {listaItens.map((item: Item) => (
                <CardItem key={item.id} item={item} onOpenDialogExcluir={handleOpenDialogExcluir} onOpenDialogAlterar={handleOpenDialogAlterar} />
            ))}
            <Dialog open={openDialogExcluir} onClose={handleCloseDialogExcluir}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir este item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogExcluir}>Cancelar</Button>
                    <Button onClick={handleConfirmExcluir} color="error">Excluir</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDialogAlterar} onClose={handleCloseDialogAlterar}>
                <DialogTitle>Alterar item</DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'}}>
                    <DialogContentText>
                        Insira a nova quantidade do item:
                    </DialogContentText>
                    <NumericFormat
                        label="Quantidade"
                        customInput={TextField}
                        thousandSeparator="."
                        decimalSeparator=","
                        value={novaQuantidade}
                        prefix=""
                        suffix=" kg"
                        onValueChange={(values) => { setNovaQuantidade(values.floatValue as number) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogAlterar}>Cancelar</Button>
                    <Button onClick={handleConfirmAlterar} color="success">Confirmar</Button>
                </DialogActions>
            </Dialog>
            
            
        </div>
    )
}

export default ItensPedido
