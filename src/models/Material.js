// models/Material.js
class Material {
    constructor(datos = {}) {
        this.idMaterial = datos.idMaterial || null;
        this.nombre = datos.nombre || '';
        this.stock = datos.stock || 0;
        this.unidad = datos.unidad || 'unidad';
    }

    validar() {
        if (!this.nombre || this.nombre.trim() === '') {
            throw new Error('El nombre del material es obligatorio');
        }
        if (this.nombre.trim().length < 3) {
            throw new Error('El nombre del material debe tener al menos 3 caracteres');
        }
        if (this.stock < 0) {
            throw new Error('El stock no puede ser negativo');
        }
        const unidadesValidas = ['unidad', 'litro', 'kg', 'ml', 'gr'];
        if (!unidadesValidas.includes(this.unidad)) {
            throw new Error('Unidad de medida no válida');
        }
        return true;
    }
}

module.exports = Material;