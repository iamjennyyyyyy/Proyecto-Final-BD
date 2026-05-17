/**
 * ============================================
 * CONTROLADOR DE [ENTIDAD]
 * ============================================
 * 
 * ¿QUÉ ES UN CONTROLLER?
 * Es el "mesero" de la aplicación. Recibe las peticiones del cliente (navegador),
 * las procesa, llama al Service, y devuelve una respuesta.
 * 
 * ¿QUÉ DEBE HACER UN CONTROLLER?
 * 1. Recibir datos (req.params, req.query, req.body)
 * 2. Validar que llegaron los datos necesarios
 * 3. Llamar al Service correspondiente
 * 4. Devolver una respuesta (res.status().json() o res.render())
 * 5. Manejar errores (try-catch)
 * 
 * ¿QUÉ NO DEBE HACER UN CONTROLLER?
 * ❌ Consultar directamente la base de datos
 * ❌ Tener lógica de negocio compleja
 * ❌ Validar reglas del negocio (solo validaciones básicas de que llegaron datos)
 */

// ============================================
// 1. IMPORTS (librerías y servicios necesarios)
// ============================================

// Importar el servicio que contiene la lógica de negocio
const citaService = require('../services/citaService');

// Opcional: Importar librerías adicionales si son necesarias
// const moment = require('moment'); // Para fechas
// const { validationResult } = require('express-validator'); // Para validaciones


// ============================================
// 2. LA CLASE DEL CONTROLADOR
// ============================================

class CitaController {
  
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
      const datos = await citaService.listarTodos();
      
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
      const dato = await citaService.obtenerPorId(id);
      
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
   * 📌 MÉTODO 4: FILTRAR POR CAMPO ESPECÍFICO
   * GET /api/entidad/filtro/:campo/:valor
   * 
   * ¿QUÉ HACE? Filtra registros donde un campo específico tenga un valor
   * ¿PARA QUÉ SIRVE? Para filtrar por categoría, estado, etc.
   * 
   * EJEMPLO URL: /api/tratamientos/filtro/categoria/1
   * 
   * EJEMPLO RESPUESTA:
   * { "success": true, "count": 5, "data": [...] }
   * 
   * AQUI SERIA FILTRAR POR ESTADO (PENDIENTE, REALIZADA, CANCELADA)
   */
  async filtrarPorCampo(req, res) {
    try {
      const campo = req.params.campo;
      const valor = req.params.valor;
      
      // Validar que los parámetros existan
      if (!campo || !valor) {
        return res.status(400).json({
          success: false,
          message: 'Debe especificar campo y valor para filtrar'
        });
      }
      
      const resultados = await citaService.filtrarPorCampo(campo, valor);
      
      res.status(200).json({
        success: true,
        count: resultados.length,
        data: resultados
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al filtrar',
        error: error.message
      });
    }
  }
  
  /**
   * 📌 MÉTODO 6: OBTENER POR RANGO DE FECHAS
   * GET /api/entidad/fechas?inicio=2024-01-01&fin=2024-12-31
   * 
   * ¿QUÉ HACE? Filtra registros entre dos fechas
   * ¿PARA QUÉ SIRVE? Para reportes mensuales, históricos, etc.
   * 
   * EJEMPLO URL: /api/citas/fechas?inicio=2024-03-01&fin=2024-03-31
   */
  async listarPorRangoFechas(req, res) {
    try {
      const fechaInicio = req.query.inicio;
      const fechaFin = req.query.fin;
      
      // Validar que ambas fechas estén presentes
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          success: false,
          message: 'Debe proporcionar fecha de inicio y fin (?inicio=YYYY-MM-DD&fin=YYYY-MM-DD)'
        });
      }
      
      const resultados = await citaService.listarPorRangoFechas(fechaInicio, fechaFin);
      
      res.status(200).json({
        success: true,
        count: resultados.length,
        data: resultados
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al filtrar por fechas',
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
      const nuevo = await citaService.crear(datos);
      
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
      
      const actualizado = await citaService.actualizarParcial(id, datos);
      
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
      
      await citaService.eliminar(id);
      
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
      const datos = await citaService.listarTodos();
      
      res.render('cita/listar', {
        titulo: 'Listado de [Cita]',
        datos: datos,
        usuario: req.session?.usuario || null,
        mensajeExito: req.query.exito || null,
        mensajeError: req.query.error || null
      });
      
    } catch (error) {
      res.render('cita/listar', {
        titulo: 'Listado de [Cita]',
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
      
      res.render('cita/crear', {
        titulo: 'Crear Nueva [Cita]',
        // opciones: opciones,
        datos: null,
        errores: null
      });
      
    } catch (error) {
      res.redirect('/cita');
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
      const dato = await citaService.obtenerPorId(id);
      
      if (!dato) {
        req.session.error_msg = 'Registro no encontrado';
        return res.redirect('/cita');
      }
      
      // const opciones = await entidadService.obtenerOpciones();
      
      res.render('cita/editar', {
        titulo: 'Editar [Cita]',
        dato: dato,
        // opciones: opciones,
        errores: null
      });
      
    } catch (error) {
      req.session.error_msg = error.message;
      res.redirect('/cita');
    }
  }
}
// ============================================
// 3. EXPORTAR LA CLASE
// ============================================

module.exports = new CitaController();