const paqueteVendidoRepository = require('../repositories/paqueteVendidoRepository');
const PaqueteVendido = require('../models/PaqueteVendido');

class PaqueteVendidoService {
  async listarVendidos() {
    return await paqueteVendidoRepository.listarTodos();
  }

  async obtenerVendidoPorId(id) {
    const item = await paqueteVendidoRepository.buscarPorId(id);
    if (!item) throw new Error('Paquete vendido no encontrado');
    return item;
  }

  async crearVendido(datos) {
    const pv = new PaqueteVendido(datos);
    pv.validar();
    return await paqueteVendidoRepository.crear(datos);
  }

  async actualizarVendido(id, datos) {
    await this.obtenerVendidoPorId(id);
    const pv = new PaqueteVendido(datos);
    pv.validar();
    return await paqueteVendidoRepository.actualizar(id, datos);
  }

  async eliminarVendido(id) {
    await this.obtenerVendidoPorId(id);
    await paqueteVendidoRepository.eliminar(id);
  }
}

module.exports = new PaqueteVendidoService();
