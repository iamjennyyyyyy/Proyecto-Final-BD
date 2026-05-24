const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

router.get('/', empleadoController.listarTodos);
router.get('/:id', empleadoController.obtenerPorId);
router.post('/', empleadoController.crear);
router.put('/:id', empleadoController.actualizar);
router.delete('/:id', empleadoController.eliminar);

module.exports = router;