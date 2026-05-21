const express = require('express');
const router = express.Router();
const distritoController = require('../controllers/distritoController');

router.get('/', distritoController.listarTodos);
router.get('/:id', distritoController.obtenerPorId);
router.post('/', distritoController.crear);
router.put('/:id', distritoController.actualizar);
router.delete('/:id', distritoController.eliminar);

module.exports = router;
