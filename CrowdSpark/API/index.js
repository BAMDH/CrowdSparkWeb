const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

const rutaEmail = require('./endpoints/email');

app.use(cors());
app.use(express.json({ limit: '1mb', type: 'application/json' }));


app.use('/email', rutaEmail);

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('Servidor de correo en funcionamiento!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
