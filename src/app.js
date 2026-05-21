const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const areaRoutes = require('./routes/areaRoutes');
const tratamientoRoutes = require('./routes/tratamientoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const distritoRoutes = require('./routes/distritoRoutes');

app.use('/api/areas', areaRoutes);
app.use('/api/tratamientos', tratamientoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/distritos', distritoRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
