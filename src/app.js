const express = require('express');
const path = require('path');
const app = express();

const areaRoutes = require('./routes/areaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const distritoRoutes = require('./routes/distritoRoutes');
const materialRoutes = require('./routes/materialRoutes');
const paqueteRoutes = require('./routes/paqueteRoutes');
const tratamientoRoutes = require('./routes/tratamientoRoutes');
const paqueteVendidoRoutes = require('./routes/paqueteVendidoRoutes');
const citaRoutes = require('./routes/citaRoutes');

app.use(express.json());

// ===== LOGGING DE TODAS LAS PETICIONES =====
app.use((req, res, next) => {
    console.log(`📢 ${req.method} ${req.url}`);
    next();
});

// ===== SERVIR FRONTEND =====
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== RUTAS API =====
app.use('/api/areas', areaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/distritos', distritoRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/materiales', materialRoutes);
app.use('/api/paquetes', paqueteRoutes);
app.use('/api/tratamientos', tratamientoRoutes);
app.use('/api/paquetes-vendidos', paqueteVendidoRoutes);
app.use('/api/citas', citaRoutes);

// ===== MANEJADOR DE ERRORES GLOBAL =====
app.use((err, req, res, next) => {
    console.error('❌ ERROR DETALLADO:', err);
    res.status(500).json({ 
        error: err.message,
        stack: err.stack 
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});