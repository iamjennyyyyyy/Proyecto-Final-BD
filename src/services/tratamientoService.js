const tratamientoRepository = require('../repositories/tratamientoRepository');
const Tratamiento = require('../models/Tratamiento');

class TratamientoService {
  async listarTratamientos() {
    return await tratamientoRepository.listarTodos();
  }

  async obtenerTratamiento(id) {
    const tratamiento = await tratamientoRepository.buscarPorId(id);
    if (!tratamiento) throw new Error('Tratamiento no encontrado');
    return tratamiento;
  }

  async crearTratamiento(datos) {
    const tratamiento = new Tratamiento(datos);
    tratamiento.validar();
    return await tratamientoRepository.guardar(datos);
  }

  async eliminarTratamiento(id) {
    await this.obtenerTratamiento(id);
    await tratamientoRepository.eliminar(id);
  }
}

module.exports = new TratamientoService();
