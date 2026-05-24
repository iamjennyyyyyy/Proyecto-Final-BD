const express = require('express');
const app = express();

const areaRoutes = require('./routes/areaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const distritoRoutes = require('./routes/distritoRoutes');
const materialRoutes = require('./routes/materialRoutes');
const paqueteRoutes = require('./routes/paqueteRoutes');

app.use(express.json());
app.use('/api/areas', areaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/distritos', distritoRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/materiales', materialRoutes);
app.use('/api/paquetes', paqueteRoutes);

// Inicio el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});