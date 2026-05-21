// models/Empleado.js (versión mejorada)
class Empleado {
    constructor(datos = {}) {
        this.idEmpleado = datos.idEmpleado || null;
        this.nombre = datos.nombre || '';
        this.especialidad = datos.especialidad || '';
        this.horasTrabajo = datos.horasTrabajo || 0;
        this.direccion = datos.direccion || '';
        this.CI = datos.CI || '';
        this.telefono = datos.telefono || '';
        this.idDistrito = datos.idDistrito || null;
        this.esFijo = datos.esFijo !== undefined ? datos.esFijo : false;
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

        if (this.horasTrabajo <= 0) {
            throw new Error('Las horas de trabajo deben ser mayores a 0');
        }
        if (this.horasTrabajo > 40) {
            throw new Error('Las horas de trabajo no pueden superar las 40 semanales');
        }

        if (!this.direccion || this.direccion.trim() === '') {
            throw new Error('La dirección es obligatoria');
        }

        if (!this.CI || this.CI.trim() === '') {
            throw new Error('La cédula es obligatoria');
        }
        const ciLimpio = this.CI.toString().replace(/[\s\.\-]/g, '');
        if (!/^\d+$/.test(ciLimpio)) {
            throw new Error('La cédula debe contener solo números');
        }
        if (ciLimpio.length != 11) {
            throw new Error('La cédula debe tener 11 dígitos');
        }
        this.CI = ciLimpio;

        if (!this.telefono || this.telefono.trim() === '') {
            throw new Error('El teléfono es obligatorio');
        }
        const telLimpio = this.telefono.toString().replace(/[\s\-\(\)]/g, '');
        if (!/^\d+$/.test(telLimpio)) {
            throw new Error('El teléfono debe contener solo números');
        }
        this.telefono = telLimpio;

        if (!this.idDistrito) {
            throw new Error('El distrito es obligatorio');
        }

        if (typeof this.esFijo !== 'boolean') {
            throw new Error('El campo esFijo debe ser true o false');
        }

        return true;
    }
}

module.exports = Empleado;