const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/ingresos', verificarToken, reporteController.generarIngresosPorMes);
router.get('/top-tratamientos', verificarToken, reporteController.obtenerTop3Tratamientos);
router.get('/empleados-por-cliente/:idCliente', verificarToken, reporteController.obtenerEmpleadosPorCliente);
router.get('/servicios-cliente/:idCliente', verificarToken, reporteController.buscarServiciosPorClientePorIntervalo);

module.exports = router;