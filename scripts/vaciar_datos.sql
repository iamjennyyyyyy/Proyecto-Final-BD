-- Vaciar todos los datos de todas las tablas
-- Resetea las secuencias de ids a 1
-- Orden respeta dependencias de FK para evitar errores

truncate table
  -- Tablas intermedias (sin dependencias hacia otras intermedias)
  materialesporcita,
  materialesportratamiento,
  contenidopaquete,
  empleadosfijosportratamiento,
  empleadosporarea,

  -- Tablas que dependen de otras principales
  citas,
  paquetevendido,
  tratamientos,
  empleados,

  -- Tablas principales (dependen de otras principales)
  categorias,
  paquetes,
  clientes,
  materiales,
  distritos,
  areas

restart identity cascade;