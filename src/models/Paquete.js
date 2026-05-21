// models/Paquete.js
class Paquete {
    constructor(datos = {}) {
        this.idpaquete = datos.idpaquete || null;
        this.nombre = datos.nombre || '';
        this.precio = datos.precio || 0;
        this.duraciontotal = datos.duraciontotal || 0;
        this.descuento = datos.descuento || 0;
    }

    validar() {
        if (!this.nombre || this.nombre.trim() === '') {
            throw new Error('El nombre del paquete es obligatorio');
        }
        if (this.nombre.trim().length < 3) {
            throw new Error('El nombre del paquete debe tener al menos 3 caracteres');
        }
        if (this.precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }
        if (this.precio > 10000) {
            throw new Error('El precio no puede superar los 10,000');
        }
        if (this.duraciontotal <= 0) {
            throw new Error('La duración total debe ser mayor a 0');
        }
        if (this.duraciontotal > 480) {
            throw new Error('La duración total no puede superar las 8 horas');
        }
        if (this.descuento < 0 || this.descuento > 100) {
            throw new Error('El descuento debe estar entre 0 y 100');
        }
        return true;
    }
}

module.exports = Paquete;