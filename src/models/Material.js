// models/Material.js
class Material {
    constructor(datos = {}) {
        this.idmaterial = datos.idmaterial || null;
        this.nombre = datos.nombre || '';
        this.cantidad = datos.cantidad || 0;
    }

    validar() {
        if (!this.nombre || this.nombre.trim() === '') {
            throw new Error('El nombre del material es obligatorio');
        }
        if (this.nombre.trim().length < 3) {
            throw new Error('El nombre del material debe tener al menos 3 caracteres');
        }
        if(this.cantidad !== undefined && (isNaN(this.cantidad) || this.cantidad < 0))
            throw new Error('La cantidad del material debe ser un número no negativo');
        return true;
    }
}

module.exports = Material;