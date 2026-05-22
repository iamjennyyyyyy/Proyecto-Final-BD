const paqueteRepository = require('../repositories/paqueteRepository');
const Paquete = require('../models/Paquete');

class PaqueteService {
  async listarPaquetes() {
    return await paqueteRepository.listarTodos();
  }

  async obtenerPaquetePorId(id) {
    const paquete = await paqueteRepository.buscarPorId(id);
    if (!paquete) throw new Error('Paquete no encontrado');
    return paquete;
  }

  async crearPaquete(datos) {
    const paquete = new Paquete(datos);
    paquete.validar();
    return await paqueteRepository.crear(datos);
  }

  async actualizarPaquete(id, datos) {
    await this.obtenerPaquetePorId(id);
    const paquete = new Paquete(datos);
    paquete.validar();
    return await paqueteRepository.actualizar(id, datos);
  }

  async eliminarPaquete(id) {
    await this.obtenerPaquetePorId(id);
    await paqueteRepository.eliminar(id);
  }
}

module.exports = new PaqueteService();
