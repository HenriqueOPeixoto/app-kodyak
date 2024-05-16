const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());

const port = process.env.PORT || 5174;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/cadastro/motorista', (req, res) => {
    console.log('Recebido: ' + JSON.stringify(req.body, null, 2));
    
    res.status(200).send();
  });

app.listen(port, () => {
    console.log(`Escutando no endereço localhost:${port}`)
})