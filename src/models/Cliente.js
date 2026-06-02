class Cliente {
    constructor(datos = {}) {
        this.idcliente = datos.idcliente || null;
        this.nombre = datos.nombre || '';
        this.dni = datos.dni || '';
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

        if (!this.dni || this.dni.trim() === '') {
            throw new Error('La cédula de identidad es obligatoria');
        }
        const dniLimpio = this.dni.toString().replace(/[\s\.\-]/g, '');
        if (!/^\d+$/.test(dniLimpio)) {
            throw new Error('La cédula debe contener solo números');
        }
        if (dniLimpio.length != 11) {
            throw new Error('La cédula debe tener 11 dígitos');
        }
        this.dni = dniLimpio;

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

    static validarActualizacion(datos) {
        if (datos.nombre !== undefined) {
            if (!datos.nombre || datos.nombre.trim() === '') {
                throw new Error('El nombre del cliente es obligatorio');
            }
            if (datos.nombre.trim().length < 3) {
                throw new Error('El nombre debe tener al menos 3 caracteres');
            }
        }

        if (datos.dni !== undefined) {
            if (!datos.dni || datos.dni.trim() === '') {
                throw new Error('La cédula de identidad es obligatoria');
            }
            const dniLimpio = datos.dni.toString().replace(/[\s\.\-]/g, '');
            if (!/^\d+$/.test(dniLimpio)) {
                throw new Error('La cédula debe contener solo números');
            }
            if (dniLimpio.length != 11) {
                throw new Error('La cédula debe tener 11 dígitos');
            }
        }

        if (datos.telefono !== undefined) {
            const telLimpio = datos.telefono.toString().replace(/[\s\-\(\)]/g, '');
            if (!/^\d+$/.test(telLimpio)) {
                throw new Error('El teléfono debe contener solo números');
            }
        }

        if (datos.email !== undefined && datos.email !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(datos.email)) {
                throw new Error('El email no tiene un formato válido');
            }
        }

        return true;
    }
}

module.exports = Cliente;