const express = require('express');
const router = express.Router();
const paqueteController = require('../controllers/paqueteController');

router.get('/', paqueteController.listarTodos);
router.get('/:id', paqueteController.obtenerPorId);
router.post('/', paqueteController.crear);
router.put('/:id', paqueteController.actualizar);
router.delete('/:id', paqueteController.eliminar);

module.exports = router;
