const paqueteVendidoService = require('../services/paqueteVendidoService');

const paqueteVendidoController = {
  async listarTodos(req, res) {
    try {
      const items = await paqueteVendidoService.listarVendidos();
      res.json({ success: true, count: items.length, data: items });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const item = await paqueteVendidoService.obtenerVendidoPorId(id);
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  },

  async crear(req, res) {
    try {
      const item = await paqueteVendidoService.crearVendido(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const item = await paqueteVendidoService.actualizarVendido(id, req.body);
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await paqueteVendidoService.eliminarVendido(parseInt(req.params.id));
      res.json({ success: true, message: 'Paquete vendido eliminado' });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
};

module.exports = paqueteVendidoController;
