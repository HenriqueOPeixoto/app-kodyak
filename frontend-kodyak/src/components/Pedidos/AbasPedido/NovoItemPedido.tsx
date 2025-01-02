import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
//import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Box, FormControl, FormControlLabel, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { debounce } from 'lodash'
import { NumericFormat } from 'react-number-format';


interface NovoItemPedidoProps {
    open: boolean,
    handleClose: () => void,
    onAdicionarItemAoCarrinho: (itemPedido: ItemPedido) => void
}

interface FamiliaProduto {
    id: number,
    nome: string
}

interface Produto {
    id: number
    nome: string
    valor: number
    indicacoes: string
    modo_uso: string
    restricoes: number
    peso: number
    consumo_diario: number
    familia_produtos: number
    inativo: boolean
}

interface ItemPedido {
    id: number
    produto: Produto
    quantidade: number
    valor: number

}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const steps = ['Selecionar Produto', 'Ajustar Quantidade e Valor'];

const NovoItemPedido: React.FC<NovoItemPedidoProps> = ({ open, handleClose, onAdicionarItemAoCarrinho}) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

    // Passo 1
    const [familiaProdutos, setFamiliaProdutos] = React.useState('')
    const [familiasProdutos, setFamiliasProdutos] = React.useState<FamiliaProduto[]>([])
    const [listaProdutos, setListaProdutos] = React.useState<Produto[]>([])
    const [produto, setProduto] = React.useState<Produto | null>(null)
    const [buscaProduto, setBuscaProduto] = React.useState('')

    // Passo 2
    const [quantidade, setQuantidade] = React.useState<number | null>(null);
    const [valor, setValor] = React.useState<number | null>(null)
    const [isSaca, setSaca] = React.useState(false)

    React.useEffect(() => {
        axios.get(`${backendBaseURL}/api/familia_produtos/`, {
            params: {
                inativo: false
            }
        })
            .then((results) => { setFamiliasProdutos(results.data) })
            .catch((error) => { console.error('Não foi possível listar as famílias de produtos: ' + error) })
    }, [])

    const fetchProdutos = (buscaProduto = '') => {
        axios.get(`${backendBaseURL}/api/produtos`, {
            params: {
                nome: buscaProduto,
                familia_produtos: familiaProdutos,
                inativo: false
            }
        })
            .then((results) => {
                setListaProdutos(results.data);
            })
            .catch((error) => {
                console.error('Não foi possível listar os produtos: ' + error);
            });
    };

    const debouncedGetProdutos = debounce((buscaProduto) => {
        fetchProdutos(buscaProduto);
    }, 500)

    React.useEffect(() => {
        if (buscaProduto) {
            debouncedGetProdutos(buscaProduto);
        } else {
            fetchProdutos();
        }
        // Cleanup debounce function when the component is unmounted or buscaProduto changes
        return () => {
            debouncedGetProdutos.cancel();
        };
    }, [familiaProdutos, buscaProduto])

    const handleAdicionarItem = () => {
        const novoItemPedido = {
            produto: produto,
            quantidade: quantidade,
            valor: valor
        } as ItemPedido

        if (isSaca && produto) {
            novoItemPedido.quantidade *= produto?.peso
        }
        onAdicionarItemAoCarrinho(novoItemPedido);
        handleReset()
        handleClose()
        
      };

    const handleChangeFamiliaProduto = (event: SelectChangeEvent) => {
        setFamiliaProdutos(event.target.value as string)
    }

    const handleTxtBuscaProdutos = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuscaProduto(event.target.value as string)
    }

    // Formatar preço no padrão pt-BR
    const formatarPreco = (preco: number | bigint) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(preco);
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        // Esses passos permitem que o usuário consiga pular uma etapa opcional e volte para preencher
        // caso mude de ideia. Ao voltar para o passo opcional e não pulá-lo novamente, o sistema considera
        // a etapa concluída.
        // Pode ser que não seja necessário nessa tela, mas vou manter caso surja a necessidade.
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => {
            if (activeStep < steps.length) {
                return prevActiveStep + 1
            }

            return prevActiveStep
        });
        setSkipped(newSkipped);

        if (activeStep >= 1) {
            handleAdicionarItem()
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

        // Se o usuário voltar para a primeira tela, apagar todas as alterações feitas
        if (activeStep === 1) {
            handleReset()
        }
    };

    const handleReset = () => {
        setProduto(null)
        setQuantidade(null)
        setValor(null)
        setSaca(false)
        setActiveStep(0)
    };

    const handleSelecionarProduto = (produto: Produto) => {
        setProduto(produto)
        handleNext()
    }

    const handleUnidadeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSaca(event.target.value === 'kg' ? false : true)
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullScreen={fullScreen}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Novo Item"}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '480px' }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === 0 && (
                        <>
                            <TextField sx={{ marginTop: '10px' }} className='TxtBuscaProduto' label='Buscar produto' onChange={handleTxtBuscaProdutos} />
                            <FormControl className='ContainerSelecaoFamilia'>
                                <InputLabel className='LblSelecaoFamilia'
                                    id="selecao-familia-label">Família de Produtos</InputLabel>
                                <Select
                                    labelId="selecao-familia-label"
                                    id="familia-produto-select"
                                    className='SelectFamiliaProduto'

                                    label="Família de Produtos"
                                    onChange={handleChangeFamiliaProduto}

                                    variant='standard'

                                >
                                    <MenuItem key={undefined} value={undefined}>Nenhum</MenuItem>
                                    {familiasProdutos.map((familia: FamiliaProduto) => (
                                        <MenuItem key={familia.id} value={familia.id}>{familia.nome}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <List sx={{ overflowY: 'auto' }}>
                                {listaProdutos.map((produto) => (
                                    <ListItem key={produto.id} disablePadding>
                                        <ListItemButton onClick={() => { handleSelecionarProduto(produto) }/*handleAddToCart(product)*/}>
                                            <ListItemText primary={produto.nome} secondary={formatarPreco(produto.valor)} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )
                    }
                    {activeStep === 1 && (
                        <>
                            <Typography variant='h6' sx={{ textAlign: 'center' }}>{produto?.nome || 'Produto não selecionado'}</Typography>
                            <Box
                                sx={{
                                    width: 200,       // Set the width of the rectangle
                                    height: 100,      // Set the height of the rectangle
                                    backgroundColor: 'gray', // Set the background color
                                    border: '1px solid black', // Optional border
                                    alignContent: 'center',
                                    textAlign: 'center'
                                }}
                            >Foto Produto </Box>
                            <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <NumericFormat
                                    label="Quantidade"
                                    customInput={TextField}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    value={quantidade}
                                    prefix=""
                                    suffix={isSaca ? ' sc' : ' kg'}
                                    onValueChange={(values) => { setQuantidade(values.floatValue as number) }}
                                />
                                <FormControl>
                                    {/*<FormLabel id="tipo-unidade-form-label"></FormLabel>*/}
                                    <RadioGroup
                                        aria-labelledby="tipo-unidade-group-label"
                                        defaultValue="kg"
                                        name="tipo-unidade-radio-buttons-group"
                                        onChange={handleUnidadeChange}
                                    >
                                        <FormControlLabel value='kg' control={<Radio />} label='kg' />
                                        <FormControlLabel value='saca' control={<Radio />} label='saca' />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center', flexGrow: '1' }}>
                                <FormControl sx={{ flexGrow: '1' }} className='ContainerSelecaoTabRef'>
                                    <InputLabel className='LblSelecaoTabRef'
                                        id="selecao-tab-ref-label">Tabela de Referência</InputLabel>
                                    <Select
                                        labelId="selecao-tab-ref-label"
                                        id="tab-ref-select"
                                        className='SelectTabRef'
                                        label="Tabela de Referência"
                                        onChange={(valor) => { console.log(valor) }}

                                        variant='standard'

                                    >
                                        <MenuItem key={undefined} value={undefined}>Nenhum</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <div>
                                <NumericFormat
                                    label="Valor"
                                    customInput={TextField}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    value={valor}
                                    prefix="R$ "
                                    decimalScale={2}
                                    fixedDecimalScale
                                    allowNegative={false}
                                    onValueChange={(values) => { setValor(values.floatValue as number) }}
                                />
                            </div>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {/** Se for a primeira tela, o usuário pode fechar a tela,
                     *  caso contrário volta apenas um passo.
                     */}
                    {activeStep > 0 ?
                        (<>
                            <Button onClick={handleBack} autoFocus>Voltar</Button>
                            <Button onClick={handleNext} autoFocus>
                                Continuar
                            </Button>
                        </>
                        ) :
                        <Button color='error' onClick={handleClose}>Cancelar</Button>
                    }
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default NovoItemPedido;
