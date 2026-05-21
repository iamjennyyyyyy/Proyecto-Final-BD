const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const areaRoutes = require('./routes/areaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const tratamientoRoutes = require('./routes/tratamientoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const distritoRoutes = require('./routes/distritoRoutes');
const materialRoutes = require('./routes/materialRoutes');

app.use('/api/areas', areaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/tratamientos', tratamientoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/distritos', distritoRoutes);
app.use('/api/materiales', materialRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
