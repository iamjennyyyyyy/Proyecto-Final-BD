// models/Distrito.js
class Distrito {
    constructor(datos = {}) {
        this.idDistrito = datos.idDistrito || null;
        this.nombreDistrito = datos.nombreDistrito || '';
    }

    validar() {
        if (!this.nombreDistrito || this.nombreDistrito.trim() === '') {
            throw new Error('El nombre del distrito es obligatorio');
        }
        if (this.nombreDistrito.trim().length < 3) {
            throw new Error('El nombre del distrito debe tener al menos 3 caracteres');
        }
        return true;
    }
}

module.exports = Distrito;