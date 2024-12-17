import { Card, CardActionArea, CardContent, Typography } from "@mui/material"

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
                    <Typography sx={{ fontWeight: 'bold' }} variant="h6">R$ {item.valor}</Typography>
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
