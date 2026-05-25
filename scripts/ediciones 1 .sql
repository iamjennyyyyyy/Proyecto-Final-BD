-- 1. Modificar tabla clientes: agregar CI, teléfono y email
ALTER TABLE clientes 
ADD COLUMN CI VARCHAR(15) NOT NULL UNIQUE,
ADD COLUMN telefono VARCHAR(15),
ADD COLUMN email VARCHAR(100) UNIQUE;

-- 2. Modificar tabla citas: agregar precio (puede ser 0)
ALTER TABLE citas 
ADD COLUMN precio NUMERIC(10,2) not null;

ALTER TABLE paquetevendido
ADD COLUMN precio NUMERIC(10,2) not null;

-- 1. Areas
ALTER TABLE areas RENAME COLUMN nombrearea TO nombre;

-- 2. Categorias
ALTER TABLE categorias RENAME COLUMN nombrecategoria TO nombre;

-- 3. Tratamientos
ALTER TABLE tratamientos RENAME COLUMN nombretratamiento TO nombre;

-- 4. Distritos
ALTER TABLE distritos RENAME COLUMN nombredistrito TO nombre;

-- 5. Empleados
ALTER TABLE empleados RENAME COLUMN nombreempleado TO nombre;

-- 6. Clientes
ALTER TABLE clientes RENAME COLUMN nombrecliente TO nombre;

-- 7. Paquetes
ALTER TABLE paquetes RENAME COLUMN nombrepaquete TO nombre;

-- 8. Materiales
ALTER TABLE materiales RENAME COLUMN nombrematerial TO nombre;