const tratamientoRepository = require('../repositories/tratamientoRepository');
const Tratamiento = require('../models/Tratamiento');

class TratamientoService {
  async listarTratamientos() {
    return await tratamientoRepository.listarTodos();
  }

  async obtenerTratamientoPorId(id) {
    const tratamiento = await tratamientoRepository.buscarPorId(id);
    if (!tratamiento) throw new Error('Tratamiento no encontrado');
    return tratamiento;
  }

  async crearTratamiento(datos) {
    const tratamiento = new Tratamiento(datos);
    tratamiento.validar();
    if(await tratamientoRepository.buscarPorNombre(tratemiento.nombre)) throw new Error('Ya existe un tratamiento con ese nombre');
    return await tratamientoRepository.crear(datos);
  }

  async actualizarTratamiento(id, datos) {
    const existente = await tratamientoRepository.buscarPorId(id);
    if(!existente) throw new Error('Tratamiento no encontrado');
    if(datos.nombre && datos.nombre !== existente.nombre && await tratamientoRepository.buscarPorNombre(datos.nombre))
      throw new Error('Ya existe un tratamiento con ese nombre');
    const tratamiento = new Tratamiento(datos);
    tratamiento.validar();
    return await tratamientoRepository.actualizar(id, datos);
  }

  async eliminarTratamiento(id) {
    await this.obtenerTratamiento(id);
    await tratamientoRepository.eliminar(id);
  }
}

module.exports = new TratamientoService();
