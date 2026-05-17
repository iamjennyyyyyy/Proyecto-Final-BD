// 🔗 CONEXIÓN 21: Importo Express y mis rutas
const express = require('express');
const tratamientoRoutes = require('./routes/tratamientoRoutes');

const app = express();

// Middleware para leer JSON
app.use(express.json());

// 🔗 CONEXIÓN 22: Conecto las rutas a una URL base
app.use('/api/tratamientos', tratamientoRoutes);

// Inicio el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});