-- ========================================
-- SCRIPT DE DATOS DE PRUEBA — SPA Belleza & Relax
-- Cumple con todos los triggers, checks y constraints
-- 2026-06-02
-- ========================================

BEGIN;

-- ========================================
-- 1. DISTRITOS
-- ========================================
INSERT INTO distritos (nombre) VALUES
  ('Centro'),
  ('Norte'),
  ('Surco'),
  ('Este'),
  ('Oeste');

-- ========================================
-- 2. AREAS
-- ========================================
INSERT INTO areas (nombre, cantidadpersonalfijo) VALUES
  ('Estetica Facial',  0),
  ('Masoterapia',      0),
  ('Estetica Corporal',0);

-- ========================================
-- 3. CATEGORIAS
-- ========================================
INSERT INTO categorias (nombre, idarea) VALUES
  ('Limpiezas Faciales',  1),
  ('Tratamientos Anti-Edad', 1),
  ('Masajes Terapeuticos',   2),
  ('Tratamientos Reductores',3);

-- ========================================
-- 4. TRATAMIENTOS
-- ========================================
INSERT INTO tratamientos (nombre, precio, descripcion, duracion, idcategoria) VALUES
  ('Limpieza Facial Profunda',  80.00,  'Limpieza profunda con extraccion y mascarilla',        60, 1),
  ('Radiofrecuencia Facial',   150.00,  'Estimulacion de colageno con radiofrecuencia',         45, 2),
  ('Masaje Descontracturante',  85.00,  'Masaje profundo para liberar tensiones musculares',    45, 3),
  ('Cavitacion',               130.00,  'Reduccion de grasa localizada por ultrasonido',        50, 4);

-- ========================================
-- 5. EMPLEADOS
-- DNI: 11 dígitos formato YYMMDDSCCCC (siglo 0-5=1900, 6-8=2000)
-- ========================================
INSERT INTO empleados (nombre, especialidad, horastrabajo, direccion, dni, telefono, iddistrito, esfijo) VALUES
  ('Maria Gonzalez',     'Esteticista Facial',    40, 'Av. Rivera Navarrete 250',  '85061501234', '987654321', 1, true),
  ('Carlos Rodriguez',   'Masajista Terapeutico', 40, 'Calle Los Pinos 150',      '90051251234', '987654322', 2, true),
  ('Ana Martinez',       'Esteticista Corporal',  35, 'Av. Aviacion 3200',        '92080831234', '987654323', 1, false),
  ('Luis Fernandez',     'Terapeuta Corporal',    40, 'Calle Las Palmeras 45',    '88022521234', '987654324', 3, true),
  ('Elena Torres',       'Masajista Deportiva',   30, 'Av. Javier Prado 890',     '95041041234', '987654325', 2, false),
  ('Pedro Chavez',       'Ayudante Corporal',     20, 'Calle Los Laureles 55',    '01051561234', '987654326', 4, false);

-- ========================================
-- 6. CLIENTES
-- CI: 11 dígitos formato YYMMDDSCCCC
-- ========================================
INSERT INTO clientes (nombre, ci, telefono, email) VALUES
  ('Ana Lucia Perez',        '88031501234', '912345678', 'ana@email.com'),
  ('Juan Carlos Mendoza',    '92072251234', '923456789', 'juan@email.com'),
  ('Maria Fernanda Rojas',   '00110561234', '934567890', 'maria@email.com'),
  ('Roberto Sanchez',        '75011001234', '945678901', 'roberto@email.com'),
  ('Carmen Rosa Flores',     '95093031234', '956789012', 'carmen@email.com'),
  ('Luis Alberto Gomez',     '82121821234', '967890123', 'luis@email.com');

-- ========================================
-- 7. MATERIALES
-- ========================================
INSERT INTO materiales (nombre, cantidad) VALUES
  ('Crema Hidratante',   100),
  ('Gel Exfoliante',      50),
  ('Electrodo',           20),
  ('Aceite Esencial',    100),
  ('Guantes Descartables', 50),
  ('Alcohol Gel',         30),
  ('Gasas Esteriles',     40),
  ('Mascarilla Facial',   25);

-- ========================================
-- 8. MATERIALES POR TRATAMIENTO
-- ========================================
INSERT INTO materialesportratamiento (idtratamiento, idmaterial, cantidad) VALUES
  (1, 1, 10),   -- Limpieza Facial → Crema Hidratante 10u
  (1, 2,  5),   -- Limpieza Facial → Gel Exfoliante 5u
  (2, 1,  8),   -- Radiofrecuencia → Crema Hidratante 8u
  (2, 3,  2),   -- Radiofrecuencia → Electrodo 2u
  (3, 4, 20),   -- Masaje → Aceite Esencial 20ml
  (3, 5,  4),   -- Masaje → Guantes 4u
  (4, 3,  3),   -- Cavitacion → Electrodo 3u
  (4, 5,  2);   -- Cavitacion → Guantes 2u

-- ========================================
-- 9. EMPLEADOS POR AREA
-- (dispara trg_actualizar_personal_fijo)
-- ========================================
INSERT INTO empleadosporarea (idempleado, idarea) VALUES
  (1, 1),   -- Maria → Estetica Facial
  (2, 2),   -- Carlos → Masoterapia
  (3, 1),   -- Ana → Estetica Facial
  (4, 3),   -- Luis → Estetica Corporal
  (5, 2),   -- Elena → Masoterapia
  (6, 3);   -- Pedro → Estetica Corporal

-- ========================================
-- 10. PAQUETES
-- ========================================
INSERT INTO paquetes (nombre, precio) VALUES
  ('Pack Facial Completo',   299.99),
  ('Pack Corporal Premium',  399.99);

-- ========================================
-- 11. CONTENIDO DE PAQUETES
-- ========================================
INSERT INTO contenidopaquete (idpaquete, idtratamiento) VALUES
  (1, 1), (1, 2),   -- Pack Facial → Limpieza + Radiofrecuencia
  (2, 3), (2, 4);   -- Pack Corporal → Masaje + Cavitacion

-- ========================================
-- 12. EMPLEADOS FIJOS POR TRATAMIENTO
-- (dispara trg_verificar_empleado_fijo: solo esfijo=true)
-- ========================================
INSERT INTO empleadosfijosportratamiento (idempleadofijo, idtratamiento) VALUES
  (1, 1),   -- Maria → Limpieza Facial
  (2, 3),   -- Carlos → Masaje Descontracturante
  (4, 4);   -- Luis → Cavitacion

-- ========================================
-- 13. PAQUETES VENDIDOS
-- (dispara trg_verificar_fechas_paquete y trg_registrar_precio_paquete_vendido)
-- fechacompra debe ser CURRENT_DATE
-- ========================================
INSERT INTO paquetevendido (idpaquete, idcliente, fechacompra, fechainicio, fechafin) VALUES
  (1, 1, CURRENT_DATE, CURRENT_DATE + 1, CURRENT_DATE + 20),
  (2, 2, CURRENT_DATE, CURRENT_DATE + 3, CURRENT_DATE + 25);

-- ========================================
-- 14. CITAS
-- (dispara múltiples triggers: verificar_fecha, verificar_cantidad_suficiente,
--  verificar_disponibilidad_empleado, registrar_precio_cita, verificar_precio_cita)
-- Fechas futuras para evitar error de fecha/hora pasada
-- Horarios escalonados para evitar solapamiento del mismo empleado
-- ========================================
INSERT INTO citas (idcliente, idtratamiento, fecha, hora, observaciones, idpaquetevendido, idempleado, estado, precio) VALUES
  (1, 1, CURRENT_DATE + 1, '10:00:00', 'Primera sesion de limpieza facial', NULL, 1, 'realizada', 0),
  (2, 2, CURRENT_DATE + 1, '11:00:00', 'Radiofrecuencia facial',          NULL, 1, 'realizada', 0),
  (3, 3, CURRENT_DATE + 1, '10:00:00', 'Masaje descontracturante',        NULL, 2, 'realizada', 0),
  (4, 4, CURRENT_DATE + 1, '11:00:00', 'Cavitacion reductora',            NULL, 4, 'realizada', 0),
  (1, 1, CURRENT_DATE + 1, '14:00:00', 'Segunda sesion pack facial',        1, 3, 'pendiente', 0),
  (5, 1, CURRENT_DATE + 2, '10:00:00', 'Limpieza facial individual',      NULL, 1, 'pendiente', 0),
  (6, 2, CURRENT_DATE + 2, '15:00:00', 'Radiofrecuencia individual',      NULL, 2, 'pendiente', 0);

-- ========================================
-- 15. MATERIALES POR CITA
-- (dispara trg_verificar_estado_cita: la cita debe estar 'realizada'
--  y trg_actualizar_cantidad_materiales: descuenta stock)
-- Solo para citas con estado = 'realizada'
-- ========================================
INSERT INTO materialesporcita (idcita, idmaterial, cantidadmaterialutilizado) VALUES
  (1, 1, 5),   -- Cita 1: Crema Hidratante 5u
  (1, 2, 3),   -- Cita 1: Gel Exfoliante 3u
  (2, 1, 4),   -- Cita 2: Crema Hidratante 4u
  (2, 3, 1),   -- Cita 2: Electrodo 1u
  (3, 4, 15),  -- Cita 3: Aceite Esencial 15ml
  (3, 5, 2),   -- Cita 3: Guantes 2u
  (4, 3, 2),   -- Cita 4: Electrodo 2u
  (4, 5, 2);   -- Cita 4: Guantes 2u

COMMIT;
