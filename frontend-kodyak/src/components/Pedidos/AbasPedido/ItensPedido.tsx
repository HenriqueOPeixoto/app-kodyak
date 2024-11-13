import { Card, CardActionArea, CardContent, Link, Typography } from "@mui/material"

interface Item {
    nome: string
    qtde_sacas: number
    peso_total: number
    valor: number
}

const CardItem: React.FC<{ item: Item }> = ({ item }) => {
    return (
        <Card variant="outlined">
            <CardActionArea>
                <CardContent>
                    <Typography variant="h6">{item.nome}</Typography>
                    <Typography>Quant. Sacas: {item.qtde_sacas}</Typography>
                    <Typography>Peso Total: {item.peso_total}</Typography>
                    <Typography>R$ {item.valor}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default function ItensPedido() {
    const staticItem: Item = {
        nome: "DDG",
        qtde_sacas: 10,
        peso_total: 500,
        valor: 2500,
    };

    return (
        <div>
            <CardItem item={ staticItem } />
            <CardItem item={ staticItem } />
            <CardItem item={ staticItem } />
            <CardItem item={ staticItem } />
            <CardItem item={ staticItem } />
            <CardItem item={ staticItem } />
            <CardItem item={ staticItem } />
            <CardItem item={ staticItem } />
            <CardItem item={ staticItem } />
        </div>
    )
}