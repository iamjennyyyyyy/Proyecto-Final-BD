class Tratamiento {
    constructor(datos = {}) {
      this.id = datos.id || null;
      this.nombre = datos.nombre || '';
      this.precio = datos.precio || 0;
      this.duracion = datos.duracion || 0;
    }
    validar() {
      if (!this.nombre || this.nombre.trim() === '') {
        throw new Error('El nombre es obligatorio');
      }
      if (this.precio <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }
      if (this.duracion <= 0) {
        throw new Error('La duración debe ser mayor a 0');
      }
      return true;
    }
  }
  
  // 🔗 CONEXIÓN 1: Exporto la clase para que otros la usen
  module.exports = Tratamiento;