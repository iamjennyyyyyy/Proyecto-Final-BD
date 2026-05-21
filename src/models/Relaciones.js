class EmpleadoArea {
    constructor(datos = {}) {
        this.idempleado = datos.idempleado || null;
        this.idarea = datos.idarea || null;
    }

    validar() {
        if (!this.idempleado) {
            throw new Error('El empleado es obligatorio');
        }
        if (!this.idarea) {
            throw new Error('El área es obligatoria');
        }
        return true;
    }
}

class EmpleadoTratamiento {
    constructor(datos = {}) {
        this.idempleado = datos.idempleado || null;
        this.idtratamiento = datos.idtratamiento || null;
    }

    validar() {
        if (!this.idempleado) {
            throw new Error('El empleado es obligatorio');
        }
        if (!this.idtratamiento) {
            throw new Error('El tratamiento es obligatorio');
        }
        return true;
    }
}

class MaterialTratamiento {
    constructor(datos = {}) {
        this.idmaterial = datos.idmaterial || null;
        this.idtratamiento = datos.idtratamiento || null;
        this.cantidad = datos.cantidad || 1;
    }

    validar() {
        if (!this.idmaterial) {
            throw new Error('El material es obligatorio');
        }
        if (!this.idtratamiento) {
            throw new Error('El tratamiento es obligatorio');
        }
        if (this.cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }
        return true;
    }
}

class MaterialCita {
    constructor(datos = {}) {
        this.idcita = datos.idcita || null;
        this.idmaterial = datos.idmaterial || null;
        this.cantidadutilizada = datos.cantidadutilizada || 0;
    }

    validar() {
        if (!this.idcita) {
            throw new Error('La cita es obligatoria');
        }
        if (!this.idmaterial) {
            throw new Error('El material es obligatorio');
        }
        if (this.cantidadutilizada <= 0) {
            throw new Error('La cantidad utilizada debe ser mayor a 0');
        }
        return true;
    }
}

class ContenidoPaquete {
    constructor(datos = {}) {
        this.idpaquete = datos.idpaquete || null;
        this.idtratamiento = datos.idtratamiento || null;
    }

    validar() {
        if (!this.idpaquete) {
            throw new Error('El paquete es obligatorio');
        }
        if (!this.idtratamiento) {
            throw new Error('El tratamiento es obligatorio');
        }
        return true;
    }
}

module.exports = {
    EmpleadoArea,
    EmpleadoTratamiento,
    MaterialTratamiento,
    MaterialCita,
    ContenidoPaquete
};