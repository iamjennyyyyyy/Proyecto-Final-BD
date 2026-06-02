const express = require('express');
const router = express.Router();
const distritoController = require('../controllers/distritoController');

router.get('/', distritoController.listarTodos);
router.get('/:idDistrito', distritoController.obtenerPorId);
router.post('/', distritoController.crear);
router.put('/:idDistrito', distritoController.actualizar);
router.delete('/:idDistrito', distritoController.eliminar);

module.exports = router;