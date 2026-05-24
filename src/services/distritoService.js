const distritoRepository = require('../repositories/distritoRepository');
const Distrito = require('../models/Distrito');

class DistritoService {
  async listarDistritos() {
    return await distritoRepository.listarTodos();
  }

  async obtenerDistritoPorId(id) {
    const distrito = await distritoRepository.buscarPorId(id);
    if (!distrito) throw new Error('Distrito no encontrado');
    return distrito;
  }

  async crearDistrito(datos) {
    const distrito = new Distrito(datos);
    distrito.validar();
    if(await distritoRepository.buscarPorNombre(distrito.nombre)) throw new Error('Ya existe un distrito con ese nombre');
    return await distritoRepository.crear(datos);
  }

  async actualizarDistrito(id, datos) {
    const existente = await distritoRepository.buscarPorId(id);
    if(!existente) throw new Error('Distrito no encontrado');
    if(datos.nombre && datos.nombre !== existente.nombre && await distritoRepository.buscarPorNombre(datos.nombre))
      throw new Error('Ya existe un distrito con ese nombre');
    const distrito = new Distrito(datos);
    distrito.validar();
    return await distritoRepository.actualizar(id, datos);
  }

  async eliminarDistrito(id) {
    await distritoRepository.eliminar(id);
  }
}

module.exports = new DistritoService();
