const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

router.get('/', citaController.listarTodos);
router.get('/cliente/:idCliente', citaController.listarPorCliente);
router.get('/empleado/:idEmpleado', citaController.listarPorEmpleado);
router.get('/fecha', citaController.listarPorFecha);
router.get('/:id', citaController.obtenerPorId);
router.post('/', citaController.crear);
router.put('/:id', citaController.modificar);
router.delete('/:id', citaController.eliminar);

module.exports = router;