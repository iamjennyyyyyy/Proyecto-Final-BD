// ============================================
// 1. IMPORTS (librerías y servicios necesarios)
// ============================================

// Importar el servicio que contiene la lógica de negocio
const clienteService = require('../services/clienteService');

// Opcional: Importar librerías adicionales si son necesarias
// const moment = require('moment'); // Para fechas
// const { validationResult } = require('express-validator'); // Para validaciones


// ============================================
// 2. LA CLASE DEL CONTROLADOR
// ============================================

class ClienteController {
  
  // ==========================================
  // SECCIÓN 1: MÉTODOS DE LECTURA (GET)
  // ==========================================
  
  /**
   * 📌 MÉTODO 1: LISTAR TODOS LOS REGISTROS
   * GET /api/entidad
   * 
   * ¿QUÉ HACE? Devuelve un array con TODOS los registros de la entidad
   * ¿PARA QUÉ SIRVE? Para mostrar listados, tablas, reportes
   * 
   * EJEMPLO RESPUESTA:
   * {
   *   "success": true,
   *   "count": 10,
   *   "data": [{ id:1, nombre:"..." }, ...]
   * }
   */
  async listarTodos(req, res) {
    try {
      // 1. Llamar al servicio para obtener los datos
      const datos = await clienteService.listarTodos();
      
      // 2. Enviar respuesta exitosa
      res.status(200).json({
        success: true,
        count: datos.length,
        data: datos
      });
      
    } catch (error) {
      // 3. Manejar error
      res.status(500).json({
        success: false,
        message: 'Error al listar los registros',
        error: error.message
      });
    }
  }
  
  /**
   * 📌 MÉTODO 2: OBTENER UN REGISTRO POR ID
   * GET /api/entidad/:id
   * 
   * ¿QUÉ HACE? Devuelve UN SOLO registro según su ID
   * ¿PARA QUÉ SIRVE? Para ver detalle, editar, mostrar información específica
   * 
   * EJEMPLO RESPUESTA (éxito):
   * { "success": true, "data": { id:1, nombre:"..." } }
   * 
   * EJEMPLO RESPUESTA (error):
   * { "success": false, "message": "Registro no encontrado" }
   */
  async obtenerPorId(req, res) {
    try {
      // 1. Obtener el ID de los parámetros de la URL
      const id = parseInt(req.params.id);
      
      // 2. Validar que el ID sea válido
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'El ID debe ser un número válido'
        });
      }
      
      // 3. Llamar al servicio
      const dato = await clienteService.obtenerPorId(id);
      
      // 4. Si no existe, responder 404
      if (!dato) {
        return res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
      }
      
      // 5. Enviar respuesta
      res.status(200).json({
        success: true,
        data: dato
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener el registro',
        error: error.message
      });
    }
  }
  
  /**
   * 📌 MÉTODO 3: BUSCAR POR TÉRMINO (LIKE)
   * GET /api/entidad/buscar?q=termino
   * 
   * ¿QUÉ HACE? Busca registros que contengan el término en nombre o descripción
   * ¿PARA QUÉ SIRVE? Para barras de búsqueda, autocompletado, filtros
   * 
   * EJEMPLO URL: /api/tratamientos/buscar?q=masaje
   * 
   * EJEMPLO RESPUESTA:
   * { "success": true, "count": 3, "data": [...] }
   */
  async buscarPorTermino(req, res) {
    try {
      // 1. Obtener el término de búsqueda de los query params
      const termino = req.query.q;
      
      // 2. Validar que se envió un término
      if (!termino || termino.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Debe proporcionar un término de búsqueda (?q=texto)'
        });
      }
      
      // 3. Llamar al servicio
      const resultados = await clienteService.buscarPorTermino(termino);
      
      // 4. Enviar respuesta
      res.status(200).json({
        success: true,
        count: resultados.length,
        data: resultados
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al buscar',
        error: error.message
      });
    }
  }
  
  /**
   * 📌 MÉTODO 5: OBTENER CON PAGINACIÓN
   * GET /api/entidad/paginar?page=1&limit=10
   * 
   * ¿QUÉ HACE? Devuelve los registros divididos en páginas
   * ¿PARA QUÉ SIRVE? Para listados muy largos, mejora el rendimiento
   * 
   * EJEMPLO URL: /api/tratamientos/paginar?page=2&limit=5
   * 
   * EJEMPLO RESPUESTA:
   * {
   *   "success": true,
   *   "data": [...],
   *   "pagination": {
   *     "page": 2,
   *     "limit": 5,
   *     "total": 50,
   *     "pages": 10
   *   }
   * }
   */
  async listarConPaginacion(req, res) {
    try {
      // 1. Obtener parámetros de paginación (con valores por defecto)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // 2. Validar que sean números positivos
      if (page < 1 || limit < 1) {
        return res.status(400).json({
          success: false,
          message: 'Page y limit deben ser mayores a 0'
        });
      }
      
      // 3. Calcular offset (desde qué registro empezar)
      const offset = (page - 1) * limit;
      
      // 4. Llamar al servicio
      const { datos, total } = await clienteService.listarConPaginacion(limit, offset);
      
      // 5. Calcular total de páginas
      const totalPages = Math.ceil(total / limit);
      
      // 6. Enviar respuesta con metadatos de paginación
      res.status(200).json({
        success: true,
        data: datos,
        pagination: {
          page: page,
          limit: limit,
          total: total,
          pages: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al paginar',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // SECCIÓN 2: MÉTODOS DE CREACIÓN (POST)
  // ==========================================
  
  /**
   * 📌 MÉTODO 8: CREAR UN NUEVO REGISTRO
   * POST /api/entidad
   * 
   * ¿QUÉ HACE? Crea un nuevo registro en la base de datos
   * ¿PARA QUÉ SIRVE? Para agregar nuevos tratamientos, empleados, citas, etc.
   * 
   * EJEMPLO BODY (JSON):
   * {
   *   "nombre": "Masaje Relajante",
   *   "precio": 80,
   *   "duracion": 60
   * }
   * 
   * EJEMPLO RESPUESTA:
   * { "success": true, "message": "Creado exitosamente", "data": { "id": 5, ... } }
   */
  async crear(req, res) {
    try {
      // 1. Obtener los datos del body
      const datos = req.body;
      
      // 2. VALIDACIONES BÁSICAS (solo que llegaron, no reglas de negocio)
      if (!datos || Object.keys(datos).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debe enviar datos para crear el registro'
        });
      }
      
      // 3. Validar campos obligatorios (esto varía según la entidad)
      // Ejemplo: if (!datos.nombre) { return res.status(400).json(...) }
      
      // 4. Llamar al servicio
      const nuevo = await clienteService.crear(datos);
      
      // 5. Responder con código 201 (Created)
      res.status(201).json({
        success: true,
        message: 'Registro creado exitosamente',
        data: nuevo
      });
      
    } catch (error) {
      // 6. Manejar errores (400 para errores de validación, 500 para otros)
      const statusCode = error.message.includes('ya existe') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  
  // ==========================================
  // SECCIÓN 3: MÉTODOS DE ACTUALIZACIÓN (PUT / PATCH)
  // ==========================================
  /**
   * 📌 MÉTODO 11: ACTUALIZAR PARCIALMENTE (PATCH)
   * PATCH /api/entidad/:id
   * 
   * ¿QUÉ HACE? Actualiza SOLO los campos que envías
   * ¿PARA QUÉ SIRVE? Para actualizar un campo específico sin enviar todo
   * 
   * EJEMPLO: Actualizar solo el precio de un tratamiento
   * PATCH /api/tratamientos/5
   * Body: { "precio": 90 }
   */
  async actualizarParcial(req, res) {
    try {
      const id = parseInt(req.params.id);
      const datos = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }
      
      const actualizado = await clienteService.actualizarParcial(id, datos);
      
      res.status(200).json({
        success: true,
        message: 'Registro actualizado',
        data: actualizado
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  
  // ==========================================
  // SECCIÓN 4: MÉTODOS DE ELIMINACIÓN (DELETE)
  // ==========================================
  
  /**
   * 📌 MÉTODO 12: ELIMINAR UN REGISTRO
   * DELETE /api/entidad/:id
   * 
   * ¿QUÉ HACE? Elimina un registro de la base de datos
   * ¿PARA QUÉ SIRVE? Para borrar tratamientos, empleados, etc.
   * 
   * EJEMPLO RESPUESTA:
   * { "success": true, "message": "Registro eliminado" }
   */
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }
      
      await clienteService.eliminar(id);
      
      res.status(200).json({
        success: true,
        message: 'Registro eliminado exitosamente'
      });
      
    } catch (error) {
      const statusCode = error.message === 'Registro no encontrado' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * 📌 MÉTODO 14: ELIMINACIÓN LÓGICA (SOFT DELETE)
   * DELETE /api/entidad/:id/soft
   * 
   * ¿QUÉ HACE? Marca el registro como eliminado pero no lo borra de la BD
   * ¿PARA QUÉ SIRVE? Para mantener historial, recuperar datos borrados
   * 
   * REQUIERE: Un campo "activo" o "eliminado" en la tabla (boolean)
   */
  async eliminarLogico(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      await clienteService.eliminarLogico(id);
      
      res.status(200).json({
        success: true,
        message: 'Registro marcado como eliminado'
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * 📌 MÉTODO 15: RESTAURAR REGISTRO ELIMINADO
   * POST /api/entidad/:id/restaurar
   * 
   * ¿QUÉ HACE? Restaura un registro que fue eliminado lógicamente
   * ¿PARA QUÉ SIRVE? Para deshacer un soft delete
   */
  async restaurar(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      const restaurado = await clienteService.restaurar(id);
      
      res.status(200).json({
        success: true,
        message: 'Registro restaurado',
        data: restaurado
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  
  // ==========================================
  // SECCIÓN 5: MÉTODOS PARA VISTAS HTML (RENDER)
  // ==========================================
  
  /**
   * 📌 MÉTODO 16: MOSTRAR PÁGINA DE LISTADO (HTML)
   * GET /entidad
   * 
   * ¿QUÉ HACE? Renderiza una página HTML con la lista de registros
   * ¿PARA QUÉ SIRVE? Para mostrar la interfaz de usuario
   * 
   * DIFERENCIA: Este devuelve HTML, no JSON
   */
  async mostrarPaginaListado(req, res) {
    try {
      const datos = await clienteService.listarTodos();
      
      res.render('cliente/listar', {
        titulo: 'Listado de [Cliente]',
        datos: datos,
        usuario: req.session?.usuario || null,
        mensajeExito: req.query.exito || null,
        mensajeError: req.query.error || null
      });
      
    } catch (error) {
      res.render('cliente/listar', {
        titulo: 'Listado de [Cliente]',
        datos: [],
        error: error.message
      });
    }
  }
  
  /**
   * 📌 MÉTODO 17: MOSTRAR FORMULARIO DE CREACIÓN (HTML)
   * GET /entidad/nuevo
   * 
   * ¿QUÉ HACE? Renderiza un formulario HTML para crear nuevos registros
   * ¿PARA QUÉ SIRVE? Para que el usuario ingrese datos mediante un formulario
   */
  async mostrarFormularioCrear(req, res) {
    try {
      // Si el formulario necesita selects con opciones dinámicas
      // const opciones = await entidadService.obtenerOpciones();
      
      res.render('cliente/crear', {
        titulo: 'Crear Nuevo [Cliente]',
        // opciones: opciones,
        datos: null,
        errores: null
      });
      
    } catch (error) {
      res.redirect('/cliente');
    }
  }
  
  /**
   * 📌 MÉTODO 18: MOSTRAR FORMULARIO DE EDICIÓN (HTML)
   * GET /entidad/editar/:id
   * 
   * ¿QUÉ HACE? Renderiza un formulario HTML con los datos del registro para editar
   * ¿PARA QUÉ SIRVE? Para que el usuario modifique datos existentes
   */
  async mostrarFormularioEditar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const dato = await clienteService.obtenerPorId(id);
      
      if (!dato) {
        req.session.error_msg = 'Registro no encontrado';
        return res.redirect('/cliente');
      }
      
      // const opciones = await entidadService.obtenerOpciones();
      
      res.render('cliente/editar', {
        titulo: 'Editar [Cliente]',
        dato: dato,
        // opciones: opciones,
        errores: null
      });
      
    } catch (error) {
      req.session.error_msg = error.message;
      res.redirect('/cliente');
    }
  }
  
  
  // ==========================================
  // SECCIÓN 6: MÉTODOS DE EXPORTACIÓN
  // ==========================================
  
  /**
   * 📌 MÉTODO 22: EXPORTAR A CSV
   * GET /api/entidad/exportar/csv
   * 
   * ¿QUÉ HACE? Devuelve un archivo CSV con todos los registros
   * ¿PARA QUÉ SIRVE? Para descargar datos y abrirlos en Excel
   */
  async exportarCSV(req, res) {
    try {
      const datos = await clienteService.listarTodos();
      
      // Crear cabeceras CSV
      const cabeceras = Object.keys(datos[0] || {}).join(',');
      
      // Crear filas CSV
      const filas = datos.map(row => Object.values(row).join(',')).join('\n');
      
      const csv = `${cabeceras}\n${filas}`;
      
      // Configurar cabeceras para descarga
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=datos.csv');
      
      res.status(200).send(csv);
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * 📌 MÉTODO 23: EXPORTAR A EXCEL (JSON)
   * GET /api/entidad/exportar/json
   * 
   * ¿QUÉ HACE? Devuelve los datos en formato JSON para descargar
   * ¿PARA QUÉ SIRVE? Para exportar datos a otros sistemas
   */
  async exportarJSON(req, res) {
    try {
      const datos = await clienteService.listarTodos();
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=datos.json');
      
      res.status(200).json(datos);
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

// ============================================
// 3. EXPORTAR LA CLASE
// ============================================

module.exports = new ClienteController();