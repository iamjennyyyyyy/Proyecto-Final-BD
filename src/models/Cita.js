// models/Cita.js
const dayjs = require('dayjs');

class Cita {
    constructor(datos = {}) {
        this.idCita = datos.idCita || null;
        this.idTratamiento = datos.idTratamiento || null;
        this.idCliente = datos.idCliente || null;
        this.idEmpleado = datos.idEmpleado || null;
        this.idPaqVendido = datos.idPaqVendido || null;
        this.observaciones = datos.observaciones || '';
        this.fecha = datos.fecha || null;
        this.hora = datos.hora || null;
        this.estado = datos.estado || 'pendiente';
        this.precio = datos.precio || null;
    }

    validar() {
        if (!this.idTratamiento) {
            throw new Error('El tratamiento es obligatorio');
        }
        if (!this.idCliente) {
            throw new Error('El cliente es obligatorio');
        }
        if (!this.idEmpleado) {
            throw new Error('El empleado es obligatorio');
        }
        if (!this.fecha) {
            throw new Error('La fecha es obligatoria');
        }
        if (!this.hora) {
            throw new Error('La hora es obligatoria');
        }
         if (!precio) {
            throw new Error('El precio no puede ser null');
        }

        const fechaCita = dayjs(`${this.fecha} ${this.hora}`);
        
        if (!fechaCita.isValid()) {
            throw new Error('La fecha y hora no son válidas');
        }
        
        if (fechaCita.isBefore(dayjs())) {
            throw new Error('No se puede agendar citas en fecha pasada');
        }
        
        if (dayjs(this.fecha).day() === 0) {
            throw new Error('No se atienden los domingos');
        }

        const horasValidas = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        if (!horasValidas.includes(this.hora)) {
            throw new Error('Horario no válido. El horario de atención es de 9:00 a 18:00');
        }

        const estadosValidos = ['pendiente', 'realizada', 'cancelada'];
        if (!estadosValidos.includes(this.estado)) {
            throw new Error('Estado de cita no válido');
        }
        return true;
    }
}

module.exports = Cita;