const express = require('express');
const router = express.Router();
const paqueteVendidoController = require('../controllers/paqueteVendidoController');

router.get('/', paqueteVendidoController.listarTodos);
router.get('/:id', paqueteVendidoController.obtenerPorId);
router.post('/', paqueteVendidoController.crear);
router.put('/:id', paqueteVendidoController.actualizar);
router.delete('/:id', paqueteVendidoController.eliminar);

module.exports = router;
