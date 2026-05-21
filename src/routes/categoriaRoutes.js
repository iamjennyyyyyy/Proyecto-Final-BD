const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

routes.get('/', categoriaController.listarTodos());
routes.get('/:id', categoriaController.obtenerPorId());
routes.post('/', categoriaController.crear());
routes.put('/:id', categoriaController.actualizar());
routes.delete('/:id', categoriaController.eliminar());

module.exports = router;