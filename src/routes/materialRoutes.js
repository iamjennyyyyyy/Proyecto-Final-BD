const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

router.get('/', materialController.listarTodos);      // ← Cambiado
router.get('/:id', materialController.obtenerPorId);  // ← Cambiado
router.post('/', materialController.crear);           // ← Cambiado
router.put('/:id', materialController.actualizar);    // ← Esto ya estaba bien
router.delete('/:id', materialController.eliminar);   // ← Cambiado

module.exports = router;