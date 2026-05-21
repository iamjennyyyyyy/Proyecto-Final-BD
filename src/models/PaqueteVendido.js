// models/PaqueteVendido.js
const dayjs = require('dayjs');

class PaqueteVendido {
    constructor(datos = {}) {
        this.idpaquetevendido = datos.idpaquetevendido || null;
        this.idpaquete = datos.idpaquete || null;
        this.idcliente = datos.idcliente || null;
        this.fechacompra = datos.fechacompra || null;
        this.fechainicio = datos.fechainicio || null;
        this.fechafin = datos.fechafin || null;
    }

    validar() {
        if (!this.idpaquete) {
            throw new Error('El paquete es obligatorio');
        }
        if (!this.idcliente) {
            throw new Error('El cliente es obligatorio');
        }
        if (!this.fechacompra) {
            throw new Error('La fecha de compra es obligatoria');
        }
        if (!this.fechainicio) {
            throw new Error('La fecha de inicio es obligatoria');
        }
        if (!this.fechafin) {
            throw new Error('La fecha de fin es obligatoria');
        }

        const fechacompra = dayjs(this.fechacompra);
        const fechainicio = dayjs(this.fechainicio);
        const fechafin = dayjs(this.fechafin);

        if (!fechacompra.isValid()) {
            throw new Error('Fecha de compra no válida');
        }
        if (!fechainicio.isValid()) {
            throw new Error('Fecha de inicio no válida');
        }
        if (!fechafin.isValid()) {
            throw new Error('Fecha de fin no válida');
        }
        if (fechainicio.isBefore(fechacompra)) {
            throw new Error('La fecha de inicio no puede ser anterior a la fecha de compra');
        }
        if (fechafin.isBefore(fechainicio)) {
            throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
        if (fechainicio.isBefore(dayjs())) {
            throw new Error('La fecha de inicio no puede ser pasada');
        }

        return true;
    }
}

module.exports = PaqueteVendido;