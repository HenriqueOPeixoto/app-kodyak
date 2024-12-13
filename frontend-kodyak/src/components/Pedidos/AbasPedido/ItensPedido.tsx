import { Card, CardActionArea, CardContent, Typography } from "@mui/material"

interface Item {
    produto: number
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
                    <Typography variant="h6">{item.produto}</Typography>
                    <Typography>Quant. Sacas: {item.quantidade}</Typography>
                    <Typography>R$ {item.valor}</Typography>
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
