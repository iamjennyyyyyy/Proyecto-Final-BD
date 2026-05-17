const express = require('express');
const router = express.Router();

const entidadController = require('../controllers/entidadController');

// Opcional: Importar middlewares (para autenticación, validación)
// const { verificarToken } = require('../middlewares/authMiddleware');
// const { validarEntidad } = require('../middlewares/validationMiddleware');

router.get('/', entidadController.listarTodos);
router.get('/:id', entidadController.obtenerPorId);
router.get('/buscar', entidadController.buscarPorTermino);
router.get('/filtro/:campo/:valor', entidadController.filtrarPorCampo);
router.get('/paginar', entidadController.listarConPaginacion);
router.get('/fechas', entidadController.listarPorRangoFechas);
router.get('/contar', entidadController.contar);
router.post('/', entidadController.crear);
router.post('/bulk', entidadController.crearMultiples);
router.put('/:id', entidadController.actualizarCompleto);
router.patch('/:id', entidadController.actualizarParcial);
router.delete('/:id', entidadController.eliminar);
router.delete('/bulk', entidadController.eliminarMultiples);
router.delete('/:id/soft', entidadController.eliminarLogico);
router.post('/:id/restaurar', entidadController.restaurar);
router.get('/exportar/csv', entidadController.exportarCSV);
router.get('/exportar/json', entidadController.exportarJSON);
router.get('/', entidadController.mostrarPaginaListado);
router.get('/nuevo', entidadController.mostrarFormularioCrear);
router.get('/editar/:id', entidadController.mostrarFormularioEditar);

// ============================================
// 4. EXPORTAR EL ROUTER
// ============================================

module.exports = router;