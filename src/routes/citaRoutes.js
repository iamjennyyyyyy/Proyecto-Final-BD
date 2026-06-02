const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

router.get('/', citaController.listarTodos);
router.get('/:idCita', citaController.obtenerPorId);
router.get('/cliente/:idCliente', citaController.obtenerPorCliente);
router.get('/empleado/:idEmpleado', citaController.obtenerPorEmpleado);
router.get('/tratamiento/:idTratamiento', citaController.obtenerPorTratamiento);
router.get('/paquete/:idPaquete', citaController.obtenerPorPaquete);
router.get('/fecha', citaController.obtenerPorFecha);
router.get('/estado', citaController.obtenerPorEstado);
router.get('/intervalo/fechas', citaController.obtenerPorIntervaloFechas);
router.get('/intervalo/precio', citaController.obtenerPorIntervaloPrecio);
router.get('/:idCita/materiales', citaController.obtenerMaterialesPorCita);
router.get('/material/:idMaterial', citaController.obtenerCitasPorMaterial);
router.post('/:idCita/materiales/:idMaterial', citaController.asignarMaterialACita);
router.delete('/:idCita/materiales/:idMaterial', citaController.desasignarMaterialACita);
router.post('/', citaController.crear);
router.put('/:idCita', citaController.modificar);
router.delete('/:idCita', citaController.eliminar);

module.exports = router;