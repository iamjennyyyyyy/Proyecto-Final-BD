// models/Categoria.js
class Categoria {
    constructor(datos = {}) {
        this.idCategoria = datos.idCategoria || null;
        this.nombre = datos.nombre || '';
        this.idArea = datos.idArea || null;
    }

    validar() {
        if (!this.nombre || this.nombre.trim() === '') {
            throw new Error('El nombre de la categoría es obligatorio');
        }
        if (this.nombre.trim().length < 3) {
            throw new Error('El nombre de la categoría debe tener al menos 3 caracteres');
        }
        if (this.nombre.trim().length > 100) {
            throw new Error('El nombre de la categoría no puede superar los 100 caracteres');
        }
        if (!this.idArea) {
            throw new Error('El área es obligatoria');
        }
        return true;
    }
}

module.exports = Categoria;