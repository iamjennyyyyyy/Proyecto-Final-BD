const distritoRepository = require('../repositories/distritoRepository');
const Distrito = require('../models/Distrito');

class DistritoService {
  async listarDistritos() {
    return await distritoRepository.listarTodos();
  }

  async obtenerDistrito(id) {
    const distrito = await distritoRepository.buscarPorId(id);
    if (!distrito) throw new Error('Distrito no encontrado');
    return distrito;
  }

  async crearDistrito(datos) {
    const distrito = new Distrito(datos);
    distrito.validar();
    return await distritoRepository.guardar(datos);
  }

  async eliminarDistrito(id) {
    await this.obtenerDistrito(id);
    await distritoRepository.eliminar(id);
  }
}

module.exports = new DistritoService();
