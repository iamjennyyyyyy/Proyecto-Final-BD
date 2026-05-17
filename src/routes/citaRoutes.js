/**
 * ============================================
 * RUTAS DE [ENTIDAD]
 * ============================================
 * 
 * ¿QUÉ ES UN ROUTER?
 * Es el "mapa" que le dice al servidor: 
 * "Cuando llegue esta URL, ejecuta este método del Controller"
 * 
 * ¿QUÉ HACE UN ARCHIVO DE ROUTES?
 * 1. Define las URLs que van a existir
 * 2. Conecta cada URL con un método del Controller
 * 3. Agrupa rutas por tema (tratamientos, empleados, etc.)
 * 4. Aplica middlewares si es necesario (autenticación, validación)
 * 
 * ¿QUÉ NO DEBE HACER UN ROUTES?
 * ❌ Tener lógica de negocio
 * ❌ Consultar la base de datos
 * ❌ Validar datos (solo conecta URLs con métodos)
 */

// ============================================
// 1. IMPORTS
// ============================================

const express = require('express');
const router = express.Router();

// Importar el controlador
const citaController = require('../controllers/citaController');

// Opcional: Importar middlewares (para autenticación, validación)
// const { verificarToken } = require('../middlewares/authMiddleware');
// const { validarEntidad } = require('../middlewares/validationMiddleware');


// ============================================
// 2. RUTAS PARA API (devuelven JSON)
// ============================================
// Estas rutas empiezan con /api/entidad

// ===== MÉTODOS DE LECTURA (GET) =====

/**
 * GET /api/entidad
 * Listar todos los registros
 * Ejemplo: GET http://localhost:3000/api/entidad
 */
router.get('/', citaController.listarTodos);

/**
 * GET /api/entidad/:id
 * Obtener un registro por ID
 * Ejemplo: GET http://localhost:3000/api/entidad/5
 */
router.get('/:id', citaController.obtenerPorId);


/**
 * GET /api/entidad/filtro/:campo/:valor
 * Filtrar por campo específico
 * Ejemplo: GET http://localhost:3000/api/entidad/filtro/categoria/1
 */
router.get('/filtro/:campo/:valor', citaController.filtrarPorCampo);


/**
 * GET /api/entidad/fechas
 * Filtrar por rango de fechas
 * Ejemplo: GET http://localhost:3000/api/entidad/fechas?inicio=2024-01-01&fin=2024-12-31
 */
router.get('/fechas', citaController.listarPorRangoFechas);


// ===== MÉTODOS DE ESCRITURA (POST, PUT, DELETE) =====

/**
 * POST /api/entidad
 * Crear un nuevo registro
 * Ejemplo: POST http://localhost:3000/api/entidad
 * Body: { "nombre": "Masaje", "precio": 80 }
 */
router.post('/', citaController.crear);


/**
 * PATCH /api/entidad/:id
 * Actualizar PARCIALMENTE un registro
 * Ejemplo: PATCH http://localhost:3000/api/entidad/5
 * Body: { "precio": 90 }  (solo actualiza el precio)
 */
router.patch('/:id', citaController.actualizarParcial);

/**
 * DELETE /api/entidad/:id
 * Eliminar un registro (físico)
 * Ejemplo: DELETE http://localhost:3000/api/entidad/5
 */
router.delete('/:id', citaController.eliminar);

// ============================================
// 3. RUTAS PARA VISTAS HTML (devuelven páginas)
// ============================================
// ⚠️ OPCIONAL: Solo si tu backend genera HTML directamente
// Estas rutas NO tienen /api/ al inicio

// ===== RUTAS DE VISTAS (sin /api/) =====

/**
 * GET /entidad
 * Mostrar página con listado de registros (HTML)
 * Ejemplo: GET http://localhost:3000/entidad
 */
router.get('/', citaController.mostrarPaginaListado);

/**
 * GET /entidad/nuevo
 * Mostrar formulario para crear (HTML)
 * Ejemplo: GET http://localhost:3000/entidad/nuevo
 */
router.get('/nuevo', citaController.mostrarFormularioCrear);

/**
 * GET /entidad/editar/:id
 * Mostrar formulario para editar (HTML)
 * Ejemplo: GET http://localhost:3000/entidad/editar/5
 */
router.get('/editar/:id', citaController.mostrarFormularioEditar);


// ============================================
// 4. EXPORTAR EL ROUTER
// ============================================

module.exports = router;