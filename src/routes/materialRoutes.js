const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

router.get('/', materialController.listarTodos);
router.get('/:id', materialController.obtenerPorId);
router.post('/', materialController.crear);
router.put('/:id', materialController.actualizar);
router.delete('/:id', materialController.eliminar);

module.exports = router;
