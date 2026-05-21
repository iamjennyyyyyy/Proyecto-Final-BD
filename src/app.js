const express = require('express');
const app = express();

// ✅ Ruta CORREGIDA (agrega src/)
const areaRoutes = require('./routes/areaRoutes');

app.use(express.json());
app.use('/api/areas', areaRoutes);

// Inicio el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});