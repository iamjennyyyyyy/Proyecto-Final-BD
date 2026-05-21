// models/Material.js
class Material {
    constructor(datos = {}) {
        this.idMaterial = datos.idMaterial || null;
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
        if (this.cantidad < 0) {
            throw new Error('El stock no puede ser negativo');
        }
        return true;
    }
}

module.exports = Material;