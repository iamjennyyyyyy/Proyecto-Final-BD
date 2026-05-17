const express = require('express');
const router = express.Router();

const empleadoController = require('../controllers/empleadoController');

// Opcional: Importar middlewares (para autenticación, validación)
// const { verificarToken } = require('../middlewares/authMiddleware');
// const { validarEntidad } = require('../middlewares/validationMiddleware');


router.get('/', empleadoController.listarTodos);
router.get('/:id', empleadoController.obtenerPorId);
router.get('/buscar', empleadoController.buscarPorTermino);
router.get('/filtro/:campo/:valor', empleadoController.filtrarPorCampo);
router.post('/', empleadoController.crear);
router.patch('/:id', empleadoController.actualizarParcial);
router.delete('/:id', empleadoController.eliminar);
router.get('/', empleadoController.mostrarPaginaListado);
router.get('/nuevo', empleadoController.mostrarFormularioCrear);
router.get('/editar/:id', empleadoController.mostrarFormularioEditar);


// ============================================
// 4. EXPORTAR EL ROUTER
// ============================================

module.exports = router;