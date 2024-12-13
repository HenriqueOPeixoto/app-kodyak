import { Card, CardActionArea, CardContent, Typography } from "@mui/material"

interface Item {
    nome: string
    quantidade: number
    valor: number
}

const CardItem: React.FC<{ item: Item }> = ({ item }) => {
    return (
        <Card variant="outlined">
            <CardActionArea>
                <CardContent>
                    <Typography variant="h6">{item.nome}</Typography>
                    <Typography>Quant. Sacas: {item.quantidade}</Typography>
                    <Typography>R$ {item.valor}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default function ItensPedido() {
    const staticItem1: Item = {
        nome: "DDG1",
        quantidade: 10,
        valor: 2500,
    };
    const staticItem2: Item = {
        nome: "DDG2",
        quantidade: 10,
        valor: 2500,
    };
    const staticItem3: Item = {
        nome: "DDG3",
        quantidade: 10,
        valor: 2500,
    };
    const staticItem4: Item = {
        nome: "DDG4",
        quantidade: 10,
        valor: 2500,
    };

    return (
        <div>
            <CardItem item={ staticItem1 } />
            <CardItem item={ staticItem2 } />
            <CardItem item={ staticItem3 } />
            <CardItem item={ staticItem4 } />
        </div>
    )
}