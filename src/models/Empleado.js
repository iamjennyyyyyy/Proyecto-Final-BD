// models/Empleado.js
class Empleado {
    constructor(datos = {}) {
        this.idempleado = datos.idempleado || null;
        this.nombre = datos.nombre || '';
        this.especialidad = datos.especialidad || '';
        this.horastrabajo = datos.horastrabajo || 0;
        this.direccion = datos.direccion || '';
        this.dni = datos.dni || '';
        this.telefono = datos.telefono || '';
        this.iddistrito = datos.iddistrito || null;
        this.esfijo = datos.esfijo !== undefined ? datos.esfijo : false;
    }

    validar() {
        if (!this.nombre || this.nombre.trim() === '') {
            throw new Error('El nombre del empleado es obligatorio');
        }
        if (this.nombre.trim().length < 3) {
            throw new Error('El nombre debe tener al menos 3 caracteres');
        }

        if (!this.especialidad || this.especialidad.trim() === '') {
            throw new Error('La especialidad es obligatoria');
        }

        if (this.horastrabajo <= 0) {
            throw new Error('Las horas de trabajo deben ser mayores a 0');
        }
        if (this.horastrabajo > 40) {
            throw new Error('Las horas de trabajo no pueden superar las 40 semanales');
        }

        if (!this.direccion || this.direccion.trim() === '') {
            throw new Error('La dirección es obligatoria');
        }

        if (!this.dni || this.dni.trim() === '') {
            throw new Error('La cédula es obligatoria');
        }
        const dniLimpio = this.dni.toString().replace(/[\s\.\-]/g, '');
        if (!/^\d+$/.test(dniLimpio)) {
            throw new Error('La cédula debe contener solo números');
        }
        if (dniLimpio.length != 11) {
            throw new Error('La cédula debe tener 11 dígitos');
        }
        this.dni = dniLimpio;

        if (!this.telefono || this.telefono.trim() === '') {
            throw new Error('El teléfono es obligatorio');
        }
        const telLimpio = this.telefono.toString().replace(/[\s\-\(\)]/g, '');
        if (!/^\d+$/.test(telLimpio)) {
            throw new Error('El teléfono debe contener solo números');
        }
        this.telefono = telLimpio;

        if (!this.iddistrito) {
            throw new Error('El distrito es obligatorio');
        }

        if (typeof this.esfijo !== 'boolean') {
            throw new Error('El campo esFijo debe ser true o false');
        }

        return true;
    }

    static validarActualizacion(datos) {
        if (datos.nombre !== undefined) {
            if (!datos.nombre || datos.nombre.trim() === '') {
                throw new Error('El nombre del empleado es obligatorio');
            }
            if (datos.nombre.trim().length < 3) {
                throw new Error('El nombre debe tener al menos 3 caracteres');
            }
        }

        if (datos.especialidad !== undefined && (!datos.especialidad || datos.especialidad.trim() === '')) {
            throw new Error('La especialidad es obligatoria');
        }

        if (datos.horastrabajo !== undefined) {
            if (datos.horastrabajo <= 0) {
                throw new Error('Las horas de trabajo deben ser mayores a 0');
            }
            if (datos.horastrabajo > 40) {
                throw new Error('Las horas de trabajo no pueden superar las 40 semanales');
            }
        }

        if (datos.direccion !== undefined && (!datos.direccion || datos.direccion.trim() === '')) {
            throw new Error('La dirección es obligatoria');
        }

        if (datos.dni !== undefined) {
            if (!datos.dni || datos.dni.trim() === '') {
                throw new Error('La cédula es obligatoria');
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
            if (!datos.telefono || datos.telefono.trim() === '') {
                throw new Error('El teléfono es obligatorio');
            }
            const telLimpio = datos.telefono.toString().replace(/[\s\-\(\)]/g, '');
            if (!/^\d+$/.test(telLimpio)) {
                throw new Error('El teléfono debe contener solo números');
            }
        }

        if (datos.iddistrito !== undefined && !datos.iddistrito) {
            throw new Error('El distrito es obligatorio');
        }

        if (datos.esfijo !== undefined && typeof datos.esfijo !== 'boolean') {
            throw new Error('El campo esFijo debe ser true o false');
        }

        return true;
    }
}

module.exports = Empleado;