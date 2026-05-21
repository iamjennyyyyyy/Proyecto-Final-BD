const express = require('express');
const router = express.Router();
const tratamientoController = require('../controllers/tratamientoController');

router.get('/', tratamientoController.listarTodos);
router.get('/:id', tratamientoController.obtenerPorId);
router.post('/', tratamientoController.crear);
router.delete('/:id', tratamientoController.eliminar);

module.exports = router;
