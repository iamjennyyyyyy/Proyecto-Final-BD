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
    const tratamiento = new Tratamiento(datos);
    tratamiento.validar();
    if(!this.obtenerTratamientoPorId(id)) throw new Error('Tratamiento no encontrado');
    if(await tratamientoRepository.buscarPorNombre(tratamiento.nombre)) throw new Error('Ya existe un tratamiento con ese nombre');
    return await tratamientoRepository.actualizar(datos);
  }

  async eliminarTratamiento(id) {
    await this.obtenerTratamiento(id);
    await tratamientoRepository.eliminar(id);
  }
}

module.exports = new TratamientoService();
