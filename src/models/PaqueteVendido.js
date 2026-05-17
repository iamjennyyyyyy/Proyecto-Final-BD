// models/PaqueteVendido.js
const dayjs = require('dayjs');

class PaqueteVendido {
    constructor(datos = {}) {
        this.idPaqueteVendido = datos.idPaqueteVendido || null;
        this.idPaquete = datos.idPaquete || null;
        this.idCliente = datos.idCliente || null;
        this.fechaCompra = datos.fechaCompra || null;
        this.fechaInicio = datos.fechaInicio || null;
        this.fechaFin = datos.fechaFin || null;
    }

    validar() {
        if (!this.idPaquete) {
            throw new Error('El paquete es obligatorio');
        }
        if (!this.idCliente) {
            throw new Error('El cliente es obligatorio');
        }
        if (!this.fechaCompra) {
            throw new Error('La fecha de compra es obligatoria');
        }
        if (!this.fechaInicio) {
            throw new Error('La fecha de inicio es obligatoria');
        }
        if (!this.fechaFin) {
            throw new Error('La fecha de fin es obligatoria');
        }

        const fechaCompra = dayjs(this.fechaCompra);
        const fechaInicio = dayjs(this.fechaInicio);
        const fechaFin = dayjs(this.fechaFin);

        if (!fechaCompra.isValid()) {
            throw new Error('Fecha de compra no válida');
        }
        if (!fechaInicio.isValid()) {
            throw new Error('Fecha de inicio no válida');
        }
        if (!fechaFin.isValid()) {
            throw new Error('Fecha de fin no válida');
        }
        if (fechaInicio.isBefore(fechaCompra)) {
            throw new Error('La fecha de inicio no puede ser anterior a la fecha de compra');
        }
        if (fechaFin.isBefore(fechaInicio)) {
            throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
        if (fechaInicio.isBefore(dayjs())) {
            throw new Error('La fecha de inicio no puede ser pasada');
        }

        return true;
    }
}

module.exports = PaqueteVendido;