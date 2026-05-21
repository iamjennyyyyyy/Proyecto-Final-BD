const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

routes.get('/', categoriaController.listarTodos());
routes.get('/', categoriaController.obtenerPorId());
routes.post('/', categoriaController.crear());
routes.put('/', categoriaController.modificar());
routes.delete('/', categoriaController.eliminar());

module.exports = router;