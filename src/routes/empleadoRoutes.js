const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

router.get('/', empleadoController.listarTodos);
router.get('/:idEmpleado', empleadoController.obtenerPorId);
router.get('/dni', empleadoController.obtenerPorDNI);
router.post('/', empleadoController.crear);
router.put('/:idEmpleado', empleadoController.actualizar);
router.delete('/:idEmpleado', empleadoController.eliminar);

module.exports = router;