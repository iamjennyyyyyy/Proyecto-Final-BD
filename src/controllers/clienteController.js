const clienteService = require('../services/clienteService');

const clienteController = {
  async listarTodos(req, res) {
    try {
      const datos = await clienteService.listarClientes();
      res.json({ success: true, count: datos.length, data: datos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const dato = await clienteService.obtenerCliente(id);
      res.json({ success: true, data: dato });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  },

  async crear(req, res) {
    try {
      const dato = await clienteService.crearCliente(req.body);
      res.status(201).json({ success: true, data: dato });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await clienteService.eliminarCliente(parseInt(req.params.id));
      res.json({ success: true, message: 'Cliente eliminado' });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
};

module.exports = clienteController;
