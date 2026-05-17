const express = require('express');
const router = express.Router();

const paqueteController = require('../controllers/paqueteController');

// Opcional: Importar middlewares (para autenticación, validación)
// const { verificarToken } = require('../middlewares/authMiddleware');
// const { validarEntidad } = require('../middlewares/validationMiddleware');

router.get('/', paqueteController.listarTodos);
router.get('/:id', paqueteController.obtenerPorId);
router.get('/buscar', paqueteController.buscarPorTermino);
router.get('/filtro/:campo/:valor', paqueteController.filtrarPorCampo);
router.post('/', paqueteController.crear);
router.patch('/:id', paqueteController.actualizarParcial);
router.delete('/:id', paqueteController.eliminar);
router.get('/', paqueteController.mostrarPaginaListado);
router.get('/nuevo', paqueteController.mostrarFormularioCrear);
router.get('/editar/:id', paqueteController.mostrarFormularioEditar);

// ============================================
// 4. EXPORTAR EL ROUTER
// ============================================

module.exports = router;