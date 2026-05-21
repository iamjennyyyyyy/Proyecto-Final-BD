const distritoService = require('../services/distritoService');

const distritoController = {
  async listarTodos(req, res) {
    try {
      const datos = await distritoService.listarDistritos();
      res.json({ success: true, count: datos.length, data: datos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const dato = await distritoService.obtenerDistrito(id);
      res.json({ success: true, data: dato });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  },

  async crear(req, res) {
    try {
      const dato = await distritoService.crearDistrito(req.body);
      res.status(201).json({ success: true, data: dato });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await distritoService.eliminarDistrito(parseInt(req.params.id));
      res.json({ success: true, message: 'Distrito eliminado' });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
};

module.exports = distritoController;
