ALTER TABLE areas ADD CONSTRAINT chk_areas_nombre CHECK (LENGTH(TRIM(nombre)) > 3);
ALTER TABLE areas ADD CONSTRAINT nombre_unique_area UNIQUE (nombre);
ALTER TABLE areas ALTER COLUMN cantidadPersonalFijo SET DEFAULT 0;
ALTER TABLE areas ADD CONSTRAINT chk_cantidad_personal CHECK (cantidadPersonalFijo >= 0);

ALTER TABLE categorias ADD CONSTRAINT chk_categorias_nombre CHECK (LENGTH(TRIM(nombre)) > 3);
ALTER TABLE categorias ADD CONSTRAINT nombre_unique_categoria UNIQUE (nombre);

ALTER TABLE distritos ADD CONSTRAINT chk_distritos_nombre CHECK (LENGTH(TRIM(nombre)) > 3);
ALTER TABLE distritos ADD CONSTRAINT nombre_unique_distrito UNIQUE (nombre);

ALTER TABLE materiales ADD CONSTRAINT chk_materiales_nombre CHECK (LENGTH(TRIM(nombre)) > 3);
ALTER TABLE materiales ADD CONSTRAINT nombre_unique_material UNIQUE (nombre);
ALTER TABLE materiales ADD CONSTRAINT chk_cantidad_positiva CHECK (cantidad>=0);

ALTER TABLE paquetes ADD CONSTRAINT chk_paquetes_nombre CHECK (LENGTH(TRIM(nombre)) > 3);
ALTER TABLE paquetes ADD CONSTRAINT nombre_unique_paquete UNIQUE (nombre);
ALTER TABLE paquetes ADD CONSTRAINT chk_precio_valido_paquete CHECK (precio>0);

ALTER TABLE tratamientos ADD CONSTRAINT chk_tratamientos_nombre CHECK (LENGTH(TRIM(nombre)) > 3);
ALTER table tratamientos ADD CONSTRAINT nombre_unique_tratamiento UNIQUE (nombre);
ALTER TABLE tratamientos ADD CONSTRAINT chk_precio_valido_trat CHECK (precio>0);
ALTER TABLE tratamientos ADD CONSTRAINT chk_duracion_valida CHECK (duracion >0);

ALTER TABLE empleados ADD CONSTRAINT chk_empleados_nombre CHECK (LENGTH(TRIM(nombre)) > 3);
ALTER TABLE empleados ADD CONSTRAINT chk_especialidad_valida  CHECK (especialidad IS NOT NULL AND LENGTH(TRIM(especialidad)) > 0);
ALTER TABLE empleados ADD CONSTRAINT chk_horas_trab_validas CHECK (horastrabajo  > 0);
ALTER TABLE empleados ADD CONSTRAINT chk_direccion_valida  CHECK (direccion  IS NOT NULL AND LENGTH(TRIM(direccion)) > 0);
ALTER TABLE empleados ADD CONSTRAINT chk_telefono_valido_empleado CHECK (telefono ~ '^\+?[0-9]{7,15}$');

ALTER TABLE clientes ADD CONSTRAINT chk_clientes_nombre CHECK (LENGTH(TRIM(nombre)) > 3);
ALTER TABLE clientes ADD CONSTRAINT chk_telefono_valido_cliente CHECK (telefono ~ '^\+?[0-9]{7,15}$');
ALTER TABLE clientes ADD CONSTRAINT chk_ci_valido CHECK (ci ~ '^[0-9]{11}$');
ALTER TABLE clientes ADD CONSTRAINT ci_unique_cliente UNIQUE (ci);
ALTER TABLE clientes ADD CONSTRAINT chk_email_valido CHECK (email LIKE '%@%');

ALTER table citas ADD CONSTRAINT chk_precio_valido_cita CHECK (precio >= 0);
ALTER table citas ADD CONSTRAINT chk_observaciones_validas CHECK (observaciones is null or LENGTH(observaciones) < 500);
ALTER TABLE citas ADD CONSTRAINT chk_fecha_no_pasada CHECK (fecha >= CURRENT_DATE);

alter table paquetevendido add constraint chk_precio_valido_paqueteVend Check(precio>0);
alter table paquetevendido ALTER COLUMN fechacompra SET DEFAULT CURRENT_DATE;
ALTER TABLE paquetevendido ADD CONSTRAINT chk_fechas_validas CHECK (fechainicio <= fechafin);
ALTER TABLE paquetevendido ADD CONSTRAINT chk_fechacompra_no_futura CHECK (fechacompra <= CURRENT_DATE);


alter table materialesportratamiento add constraint chk_cantidad_matPorTrat Check(cantidad>0);
alter table materialesporcita  add constraint chk_cantidad_matPorCita check(cantidadmaterialutilizado  >=0);












