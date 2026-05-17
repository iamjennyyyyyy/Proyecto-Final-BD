// models/Cliente.js
class Cliente {
    constructor(datos = {}) {
        this.idCliente = datos.idCliente || null;
        this.nombre = datos.nombre || '';
        this.ci = datos.ci || '';
        this.telefono = datos.telefono || '';
        this.email = datos.email || '';
    }

    validar() {
        if (!this.nombre || this.nombre.trim() === '') {
            throw new Error('El nombre del cliente es obligatorio');
        }
        if (this.nombre.trim().length < 3) {
            throw new Error('El nombre debe tener al menos 3 caracteres');
        }

        if (!this.ci || this.ci.trim() === '') {
            throw new Error('La cédula de identidad es obligatoria');
        }
        const ciLimpio = this.ci.toString().replace(/[\s\.\-]/g, '');
        if (!/^\d+$/.test(ciLimpio)) {
            throw new Error('La cédula debe contener solo números');
        }
        if (ciLimpio.length < 7 || ciLimpio.length > 11) {
            throw new Error('La cédula debe tener entre 7 y 11 dígitos');
        }
        this.ci = ciLimpio;

        if (this.telefono) {
            const telLimpio = this.telefono.toString().replace(/[\s\-\(\)]/g, '');
            if (!/^\d+$/.test(telLimpio)) {
                throw new Error('El teléfono debe contener solo números');
            }
            this.telefono = telLimpio;
        }

        if (this.email && this.email !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                throw new Error('El email no tiene un formato válido');
            }
        }

        return true;
    }
}

module.exports = Cliente;