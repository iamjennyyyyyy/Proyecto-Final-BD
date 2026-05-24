const paqueteVendidoService = require('../services/paqueteVendidoService');

const paqueteVendidoController = {
  async listarTodos(req, res) {
    try {
      const paquetes = await paqueteVendidoService.listarPaquetesV();
      res.json({ success: true, count: paquetes.length, data: paquetes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const paquete = await paqueteVendidoService.obtenerPaqueteVPorId(id);
      res.json({ success: true, data: paquete });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  },

  async crear(req, res) {
    try {
      const paquete = await paqueteVendidoService.crearPaqueteV(req.body);
      res.status(201).json({ success: true, data: paquete });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async actualizar(req,res){
    try{
      const id = parseInt(req.params.id);
      const paquete = await paqueteVendidoService.actualizarPaqueteV(id, req.body);
      res.json({success: true, data: paquete});
    }
    catch(error){
      res.status(500).json({success: false, error: error.message});
    }
  },

  async eliminar(req, res) {
    try {
      await paqueteVendidoService.eliminarPaqueteV(parseInt(req.params.id));
      res.json({ success: true, message: 'Paquete eliminado' });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
};

module.exports = paqueteVendidoController;
