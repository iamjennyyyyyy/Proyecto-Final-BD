const express = require('express');
const router = express.Router();

const tratamientoController = require('../controllers/tratamientoController');

// Opcional: Importar middlewares (para autenticación, validación)
// const { verificarToken } = require('../middlewares/authMiddleware');
// const { validarEntidad } = require('../middlewares/validationMiddleware');

router.get('/', tratamientoController.listarTodos);
router.get('/:id', tratamientoController.obtenerPorId);
router.get('/buscar', tratamientoController.buscarPorTermino);
router.get('/filtro/:campo/:valor', tratamientoController.filtrarPorCampo);
router.get('/contar', tratamientoController.contar);
router.post('/', tratamientoController.crear);
router.patch('/:id', tratamientoController.actualizarParcial);
router.delete('/:id', tratamientoController.eliminar);
router.get('/', tratamientoController.mostrarPaginaListado);
router.get('/nuevo', tratamientoController.mostrarFormularioCrear);
router.get('/editar/:id', tratamientoController.mostrarFormularioEditar);

// ============================================
// 4. EXPORTAR EL ROUTER
// ============================================

module.exports = router;