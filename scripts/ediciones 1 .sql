-- 1. Modificar tabla clientes: agregar CI, teléfono y email
ALTER TABLE clientes 
ADD COLUMN CI VARCHAR(15) NOT NULL UNIQUE,
ADD COLUMN telefono VARCHAR(15),
ADD COLUMN email VARCHAR(100) UNIQUE;

-- 2. Modificar tabla citas: agregar precio (puede ser 0)
ALTER TABLE citas 
ADD COLUMN precio NUMERIC(10,2) not null;

