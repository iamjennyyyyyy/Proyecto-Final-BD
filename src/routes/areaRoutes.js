const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

router.get('/', areaController.listarTodos);
router.get('/:id', areaController.obtenerPorId);
router.post('/', areaController.crear());
routes.put('/', areaController.modificar());
router.delete('/:id', areaController.eliminar);

module.exports = router;