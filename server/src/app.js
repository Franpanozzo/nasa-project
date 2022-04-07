const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(morgan('combined'));  //Lo pongo aca pq va despues del filtro de quien puede y antes de la logica etc.

app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));

app.use('/v1', api); 

// Si no pasa por ninguna de las rutas de arriba la mando al front que esta en index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname,'..','public','index.html'));  // para produccion, cuando el frontend tambien es brindado por la API (en full stack)
})

module.exports = app;