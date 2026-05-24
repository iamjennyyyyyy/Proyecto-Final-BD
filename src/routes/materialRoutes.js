const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

routes.get('/', materialController.listarTodos);
routes.get('/:id', materialController.obtenerPorId);
routes.post('/', materialController.crear);
router.put('/:id', materialController.actualizar);
routes.delete('/:id', materialController.eliminar);

module.exports = router;