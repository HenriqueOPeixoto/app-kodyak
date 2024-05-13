const express = require('express');
const cors = require('cors')

const app = express();

app.use(cors());

const port = process.env.PORT || 5174;

app.get('/teste', (req, res) => {
    console.log('Request received');
    res.json({ message: 'Hello from the backend!' });
  });

app.listen(port, () => {
    console.log(`Escutando no endereço localhost:${port}`)
})