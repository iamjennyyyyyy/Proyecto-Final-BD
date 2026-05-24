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
        this.precio = datos.precio || null;
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
         if (!this.precio) {
            throw new Error('El precio no puede ser null');
        }
        if (!this.fechaFin) {
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