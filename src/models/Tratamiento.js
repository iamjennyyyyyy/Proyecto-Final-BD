// models/Tratamiento.js
class Tratamiento {
  constructor(datos = {}) {
      this.idTratamiento = datos.idTratamiento || null;
      this.idCategoria = datos.idCategoria || null;
      this.nombre = datos.nombre || '';
      this.precio = datos.precio || 0;
      this.duracion = datos.duracion || 0;
      this.descripcion = datos.descripcion || '';
      this.frecuenciaSolicitudMensual = datos.frecuenciaSolicitudMensual || 0;
  }

  validar() {
      if (!this.nombre || this.nombre.trim() === '') {
          throw new Error('El nombre del tratamiento es obligatorio');
      }
      if (this.nombre.trim().length < 3) {
          throw new Error('El nombre debe tener al menos 3 caracteres');
      }
      if (this.nombre.trim().length > 100) {
          throw new Error('El nombre no puede superar los 100 caracteres');
      }
      if (this.precio <= 0) {
          throw new Error('El precio debe ser mayor a 0');
      }
      if (this.precio > 1000) {
          throw new Error('El precio no puede superar los 1000');
      }
      if (this.duracion <= 0) {
          throw new Error('La duración debe ser mayor a 0');
      }
      if (this.duracion > 240) {
          throw new Error('La duración no puede superar los 240 minutos');
      }
      if (this.duracion % 15 !== 0) {
          throw new Error('La duración debe ser múltiplo de 15 minutos');
      }
      if (!this.idCategoria) {
          throw new Error('La categoría es obligatoria');
      }
      if (this.frecuenciaSolicitudMensual < 0) {
          throw new Error('La frecuencia mensual no puede ser negativa');
      }
      return true;
  }
}

module.exports = Tratamiento;