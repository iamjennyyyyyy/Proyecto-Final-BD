// 🔗 CONEXIÓN 5: Importo el Repository
const tratamientoRepository = require('../repositories/tratamientoRepository');

class TratamientoService {
  
  async crearTratamiento(datos) {
    // Regla de negocio: el nombre no puede repetirse
    const existe = await tratamientoRepository.buscarPorNombre(datos.nombre);
    if (existe) {
      throw new Error(`Ya existe un tratamiento llamado "${datos.nombre}"`);
    }
    
    // Regla de negocio: precio máximo 500
    if (datos.precio > 500) {
      throw new Error('El precio no puede superar los 500');
    }
    
    // Regla de negocio: duración no mayor a 4 horas
    if (datos.duracion > 240) {
      throw new Error('La duración no puede superar los 240 minutos');
    }
    
    // 🔗 CONEXIÓN 6: Llamo al repository para guardar
    const nuevo = await tratamientoRepository.guardar(datos);
    return nuevo;
  }
  
  async listarTratamientos() {
    // 🔗 CONEXIÓN 7: Llamo al repository para listar
    return await tratamientoRepository.listarTodos();
  }
  
  async obtenerTratamiento(id) {
    // 🔗 CONEXIÓN 8: Llamo al repository para buscar
    const tratamiento = await tratamientoRepository.buscarPorId(id);
    if (!tratamiento) {
      throw new Error('Tratamiento no encontrado');
    }
    return tratamiento;
  }
  
  async eliminarTratamiento(id) {
    // Verificar que existe antes de eliminar
    const existe = await tratamientoRepository.buscarPorId(id);
    if (!existe) {
      throw new Error('Tratamiento no encontrado');
    }
    
    // 🔗 CONEXIÓN 9: Llamo al repository para eliminar
    return await tratamientoRepository.eliminar(id);
  }
}

// 🔗 CONEXIÓN 10: Exporto el service para que otros lo usen
module.exports = new TratamientoService();