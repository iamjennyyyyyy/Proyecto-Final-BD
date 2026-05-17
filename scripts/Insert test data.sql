-- =====================================================
-- DATOS DE PRUEBA CON CONSISTENCIA TOTAL
-- =====================================================

-- 1. DISTRITOS
INSERT INTO Distritos (nombreDistrito) VALUES
('San Isidro'), ('Miraflores'), ('Surco'), ('San Borja'), ('La Molina'),
('Jesus Maria'), ('Lince'), ('Magdalena'), ('San Miguel'), ('Pueblo Libre');

-- 2. AREAS
INSERT INTO areas (nombrearea, cantidadPersonalFijo) VALUES
('Estética Facial', 3),
('Estética Corporal', 3),
('Depilación Láser', 2),
('Masoterapia', 2),
('Nutrición', 1),
('Podología', 1),
('Manicura y Pedicura', 2);

-- 3. CATEGORIAS
INSERT INTO categorias (nombrecategoria, idArea) VALUES
-- Area 1: Estética Facial
('Limpiezas Faciales', 1),
('Tratamientos Anti-Edad', 1),
('Peelings', 1),
-- Area 2: Estética Corporal
('Tratamientos Reductores', 2),
('Tratamientos Reafirmantes', 2),
('Drenaje Linfático', 2),
-- Area 3: Depilación Láser
('Depilación Láser Diodo', 3),
-- Area 4: Masoterapia
('Masajes Terapéuticos', 4),
-- Area 5: Nutrición
('Consultas Nutricionales', 5),
-- Area 6: Podología
('Cuidado de Pies', 6),
-- Area 7: Manicura y Pedicura
('Manicura', 7),
('Pedicura', 7);

-- 4. TRATAMIENTOS (con sus categorías)
INSERT INTO tratamientos (nombretratamiento, precio, descripcion, duracion, idCategoria) VALUES
-- Area 1 - Estética Facial
('Limpieza Facial Profunda', 80.00, 'Limpieza profunda', 60, 1),
('Radiofrecuencia Facial', 150.00, 'Estimulación colágeno', 45, 2),
('Peeling Químico', 120.00, 'Renovación celular', 40, 3),
-- Area 2 - Estética Corporal
('Cavitación', 130.00, 'Reducción grasa', 50, 4),
('Radiofrecuencia Corporal', 140.00, 'Reafirmación', 45, 5),
('Drenaje Linfático Manual', 95.00, 'Eliminación líquidos', 50, 6),
-- Area 3 - Depilación Láser
('Depilación Láser Piernas', 150.00, 'Eliminación definitiva', 45, 7),
-- Area 4 - Masoterapia
('Masaje Descontracturante', 85.00, 'Alivio tensiones', 45, 8),
-- Area 5 - Nutrición
('Consulta Nutricional', 70.00, 'Evaluación', 60, 9),
-- Area 6 - Podología
('Tratamiento de Callosidades', 60.00, 'Eliminación callos', 30, 10),
-- Area 7 - Manicura y Pedicura
('Manicura Clásica', 35.00, 'Corte y esmaltado', 30, 11),
('Pedicura Premium', 55.00, 'Exfoliación y masaje', 50, 12);

-- 5. EMPLEADOS (fijos y eventuales/suplentes)
INSERT INTO empleados (nombreEmpleado, especialidad, horasTrabajo, direccion, DNI, telefono, idDistrito, esFijo) VALUES
-- EMPLEADOS FIJOS (esFijo = true)
('María González', 'Esteticista Facial', 40, 'Av. Rivera Navarrete 250', '12345678', '987654321', 1, true),
('Carlos Rodríguez', 'Terapeuta Corporal', 40, 'Calle Los Pinos 150', '23456789', '987654322', 2, true),
('Ana Martínez', 'Especialista Láser', 35, 'Av. Aviación 3200', '34567890', '987654323', 3, true),
('Luis Fernández', 'Masajista', 40, 'Calle Las Palmeras 45', '45678901', '987654324', 4, true),
('Elena Torres', 'Nutricionista', 30, 'Av. Javier Prado 890', '56789012', '987654325', 5, true),
('Jorge Ramírez', 'Podólogo', 35, 'Calle Los Alamos 78', '67890123', '987654326', 1, true),
('Patricia Sánchez', 'Manicurista', 40, 'Av. Brasil 560', '78901234', '987654327', 6, true),
('Fernando Castro', 'Masajista Deportivo', 35, 'Calle Los Olivos 120', '89012345', '987654328', 7, false), -- SUPLENTE
('Carolina Mendoza', 'Esteticista Facial', 40, 'Av. Benavides 450', '90123456', '987654329', 2, false), -- SUPLENTE
('Ricardo Vargas', 'Terapeuta Corporal', 30, 'Calle Las Gardenias 200', '01234567', '987654330', 8, false), -- SUPLENTE
('Laura Díaz', 'Asistente Facial', 20, 'Av. Universitaria 1000', '11111111', '987654331', 3, false), -- SUPLENTE
('Pedro Chávez', 'Ayudante Corporal', 15, 'Calle Los Laureles 55', '22222222', '987654332', 4, false); -- SUPLENTE

-- 6. CLIENTES
INSERT INTO clientes (nombrecliente) VALUES
('Ana Lucía Pérez'), ('Juan Carlos Mendoza'), ('María Fernanda Rojas'),
('Roberto Sánchez'), ('Carmen Rosa Flores'), ('Luis Alberto Gómez');

-- 7. PAQUETES
INSERT INTO paquetes (nombrepaquete, precio) VALUES
('Pack Facial Completo', 299.00),
('Pack Corporal Premium', 399.00),
('Pack Bienestar Total', 499.00);

-- 8. MATERIALES
INSERT INTO materiales (nombrematerial) VALUES
('Crema Hidratante'), ('Gel Exfoliante'), ('Mascarilla Facial'), ('Aceite Esencial'),
('Guantes Descartables'), ('Alcohol Gel'), ('Gasas Estériles'), ('Electrodo'),
('Gel de Ultrasonido'), ('Crema Post-Depilación'), ('Palitos de Naranjo'),
('Lima Eléctrica'), ('Cortaúñas'), ('Esmalte'), ('Lámpara UV'), ('Algodón');

-- 9. CONTENIDO DE PAQUETES
INSERT INTO contenidopaquete (idpaquete, idtratamiento) VALUES
-- Pack Facial Completo (idpaquete 1): contiene tratamientos de área facial
(1, 1), -- Limpieza Facial Profunda
(1, 2), -- Radiofrecuencia Facial
(1, 3), -- Peeling Químico
-- Pack Corporal Premium (idpaquete 2): contiene tratamientos de área corporal
(2, 4), -- Cavitación
(2, 5), -- Radiofrecuencia Corporal
(2, 6), -- Drenaje Linfático
-- Pack Bienestar Total (idpaquete 3): combina áreas
(3, 1), -- Limpieza Facial
(3, 4), -- Cavitación
(3, 8); -- Masaje Descontracturante

-- 10. MATERIALES POR TRATAMIENTO (con cantidades disponibles)
INSERT INTO MaterialesPorTratamiento (idtratamiento, idmaterial, cantidad) VALUES
-- Tratamiento 1: Limpieza Facial Profunda
(1, 1, 10), (1, 2, 5), (1, 3, 2), (1, 5, 4), (1, 6, 20),
-- Tratamiento 2: Radiofrecuencia Facial
(2, 1, 8), (2, 6, 10), (2, 8, 2), (2, 9, 5),
-- Tratamiento 3: Peeling Químico
(3, 2, 6), (3, 5, 3), (3, 6, 15), (3, 7, 4),
-- Tratamiento 4: Cavitación
(4, 6, 10), (4, 9, 8), (4, 5, 3),
-- Tratamiento 5: Radiofrecuencia Corporal
(5, 6, 12), (5, 8, 2), (5, 9, 6), (5, 1, 10),
-- Tratamiento 6: Drenaje Linfático
(6, 4, 15), (6, 5, 4), (6, 6, 10),
-- Tratamiento 7: Depilación Láser
(7, 6, 8), (7, 10, 3), (7, 5, 2),
-- Tratamiento 8: Masaje Descontracturante
(8, 4, 20), (8, 5, 4), (8, 6, 8),
-- Tratamiento 9: Consulta Nutricional
(9, 6, 5), (9, 5, 2),
-- Tratamiento 10: Tratamiento Callosidades
(10, 5, 6), (10, 11, 3), (10, 12, 1),
-- Tratamiento 11: Manicura Clásica
(11, 5, 4), (11, 13, 1), (11, 14, 2), (11, 16, 10),
-- Tratamiento 12: Pedicura Premium
(12, 5, 6), (12, 11, 2), (12, 12, 1), (12, 14, 2), (12, 16, 15);

-- 11. EMPLEADOS POR AREA (suplentes pueden estar en múltiples áreas)
INSERT INTO empleadosPorArea (idEmpleado, idArea) VALUES
-- Empleados FIJOS (pueden estar en sus áreas principales)
(1, 1), -- María González en Estética Facial
(2, 2), -- Carlos Rodríguez en Estética Corporal
(3, 3), -- Ana Martínez en Depilación Láser
(4, 4), -- Luis Fernández en Masoterapia
(5, 5), -- Elena Torres en Nutrición
(6, 6), -- Jorge Ramírez en Podología
(7, 7), -- Patricia Sánchez en Manicura/Pedicura

-- Empleados SUPLENTES (pueden cubrir varias áreas)
(8, 4),  -- Fernando Castro en Masoterapia
(9, 1),  -- Carolina Mendoza en Estética Facial
(9, 7),  -- Carolina Mendoza también en Manicura/Pedicura
(10, 2), -- Ricardo Vargas en Estética Corporal
(10, 4), -- Ricardo Vargas también en Masoterapia
(11, 1), -- Laura Díaz en Estética Facial
(12, 2); -- Pedro Chávez en Estética Corporal

-- 12. EMPLEADOS FIJOS POR TRATAMIENTO (SOLO empleados con esFijo=true)
INSERT INTO EmpleadosFijosPorTratamiento (idEmpleadoFijo, idTratamiento) VALUES
-- María González (id 1, esFijo) - Área Estética Facial
(1, 1),  -- Limpieza Facial Profunda
(1, 2),  -- Radiofrecuencia Facial
(1, 3),  -- Peeling Químico

-- Carlos Rodríguez (id 2, esFijo) - Área Estética Corporal
(2, 4),  -- Cavitación
(2, 5),  -- Radiofrecuencia Corporal
(2, 6),  -- Drenaje Linfático

-- Ana Martínez (id 3, esFijo) - Área Depilación Láser
(3, 7),  -- Depilación Láser

-- Luis Fernández (id 4, esFijo) - Área Masoterapia
(4, 8),  -- Masaje Descontracturante

-- Elena Torres (id 5, esFijo) - Área Nutrición
(5, 9),  -- Consulta Nutricional

-- Jorge Ramírez (id 6, esFijo) - Área Podología
(6, 10), -- Tratamiento Callosidades

-- Patricia Sánchez (id 7, esFijo) - Área Manicura/Pedicura
(7, 11), -- Manicura Clásica
(7, 12); -- Pedicura Premium

-- 13. PAQUETES VENDIDOS
INSERT INTO paquetevendido (idpaquete, idcliente, fechacompra, fechainicio, fechafin) VALUES
(1, 1, '2024-03-01', '2024-03-10', '2024-06-10'),
(2, 2, '2024-03-05', '2024-03-15', '2024-06-15'),
(3, 3, '2024-03-10', '2024-03-20', '2024-06-20'),
(NULL, 4, '2024-03-15', '2024-03-20', '2024-03-20'), -- Tratamiento individual (sin paquete)
(NULL, 5, '2024-03-20', '2024-03-25', '2024-03-25'), -- Tratamiento individual
(1, 6, '2024-03-25', '2024-04-01', '2024-07-01');

-- 14. CITAS (CUMPLIENDO TODAS LAS REGLAS)
-- =====================================================
INSERT INTO citas (idcliente, idtratamiento, fecha, hora, observaciones, idpaquetevendido, idEmpleado, estado) VALUES

-- CASO 1: Cita con paquete 1 (facial) - fecha DENTRO del rango [2024-03-10, 2024-06-10]
(1, 1, '2024-03-10', '10:00:00', 'Empleado fijo asignado - primera cita del pack', 1, 1, 'realizada'),

-- CASO 2: Cita con paquete 1 - otra fecha DENTRO del rango
(1, 2, '2024-03-20', '11:30:00', 'Segunda sesión pack facial', 1, 9, 'realizada'),

-- CASO 3: Cita con paquete 1 - tercera cita DENTRO del rango
(1, 3, '2024-04-05', '09:00:00', 'Tercera sesión - peeling', 1, 1, 'pendiente'),

-- CASO 4: Cita con paquete 2 (corporal) - fecha DENTRO del rango [2024-03-15, 2024-06-15]
(2, 4, '2024-03-15', '15:00:00', 'Primera cita pack corporal', 2, 2, 'realizada'),

-- CASO 5: Cita con paquete 2 - segunda cita DENTRO del rango
(2, 5, '2024-03-28', '14:00:00', 'Segunda sesión corporal', 2, 10, 'pendiente'),

-- CASO 6: Cita con paquete 2 - tercera cita DENTRO del rango
(2, 6, '2024-04-10', '16:00:00', 'Drenaje linfático', 2, 2, 'pendiente'),

-- CASO 7: Cita con paquete 3 (bienestar total) - fecha DENTRO del rango [2024-03-20, 2024-06-20]
(3, 1, '2024-03-20', '10:30:00', 'Primera cita pack bienestar', 3, 9, 'realizada'),

-- CASO 8: Cita con paquete 3 - segunda cita DENTRO del rango
(3, 4, '2024-04-01', '12:00:00', 'Segundo tratamiento del pack', 3, 10, 'realizada'),

-- CASO 9: Cita con paquete 3 - tercera cita DENTRO del rango
(3, 8, '2024-04-15', '11:00:00', 'Masaje descontracturante', 3, 8, 'pendiente'),

-- CASO 10: Cita con paquete 6 - fecha DENTRO del rango [2024-04-01, 2024-07-01]
(6, 11, '2024-04-01', '17:00:00', 'Manicura - pack bienestar', 6, 7, 'pendiente'),

-- CASO 11: Cita con paquete 6 - segunda cita DENTRO del rango
(6, 12, '2024-04-20', '16:00:00', 'Pedicura premium', 6, 7, 'pendiente'),

-- CASO 12: Cita INDIVIDUAL (sin paquete) - fecha libre
(4, 8, '2024-03-25', '14:00:00', 'Tratamiento individual - Masaje', NULL, 4, 'realizada'),

-- CASO 13: Cita INDIVIDUAL (sin paquete) - fecha libre
(5, 6, '2024-03-30', '09:00:00', 'Individual drenaje linfático', NULL, 10, 'realizada'),

-- CASO 14: Cita INDIVIDUAL (sin paquete) - fecha libre
(4, 2, '2024-04-05', '13:00:00', 'Radiofrecuencia individual', NULL, 9, 'pendiente'),

-- CASO 15: Cita INDIVIDUAL (sin paquete) - fecha libre
(5, 7, '2024-04-08', '11:30:00', 'Depilación láser individual', NULL, 3, 'pendiente'),

-- CASO 16: Cita CANCELADA con paquete 1 - fecha DENTRO del rango
(1, 2, '2024-04-12', '10:00:00', 'Cancelada por cliente', 1, 1, 'cancelada'),

-- CASO 17: Cita CANCELADA con paquete 2 - fecha DENTRO del rango
(2, 5, '2024-04-18', '15:30:00', 'Cancelada por reprogramación', 2, 2, 'cancelada'),

-- CASO 18: Cita CANCELADA individual
(3, 3, '2024-04-22', '12:00:00', 'Cancelación anticipada', NULL, 9, 'cancelada'),

-- CASO 19: Cita con paquete 1 - fecha límite (último día)
(1, 1, '2024-06-10', '09:00:00', 'Última cita antes de vencer', 1, 1, 'pendiente'),

-- CASO 20: Cita con paquete 2 - fecha límite
(2, 4, '2024-06-15', '14:00:00', 'Cita en fecha de vencimiento', 2, 2, 'pendiente'),

-- CASO 21: Cita con paquete 3 - penúltimo día
(3, 1, '2024-06-19', '16:00:00', 'Cita antes de vencer', 3, 9, 'pendiente'),

-- CASO 22: Cita con paquete 6 - cita intermedia
(6, 11, '2024-05-15', '11:00:00', 'Manicura de mantenimiento', 6, 7, 'pendiente'),

-- CASO 23: Cita REALIZADA con paquete 1 - fecha temprana
(1, 3, '2024-03-15', '08:30:00', 'Peeling realizado', 1, 1, 'realizada'),

-- CASO 24: Cita REALIZADA con paquete 2 - fecha temprana
(2, 6, '2024-03-18', '10:00:00', 'Drenaje realizado', 2, 2, 'realizada'),

-- CASO 25: Cita REALIZADA con paquete 3 - fecha temprana
(3, 4, '2024-03-25', '15:00:00', 'Cavitación realizada', 3, 10, 'realizada');

-- 16. MATERIALES POR CITA (actualizado para las nuevas citas)
-- =====================================================
INSERT INTO MaterialesPorCita (idCita, idMaterial, cantidadMaterialUtilizado) VALUES

-- Cita 1: Tratamiento 1 - Limpieza Facial (usando paquete 1, fecha 2024-03-10)
(1, 1, 5), (1, 2, 3), (1, 3, 1), (1, 5, 2),

-- Cita 2: Tratamiento 2 - Radiofrecuencia Facial (paquete 1, fecha 2024-03-20)
(2, 1, 4), (2, 6, 5), (2, 8, 1),

-- Cita 3: Tratamiento 3 - Peeling (paquete 1, fecha 2024-04-05)
(3, 2, 3), (3, 5, 2), (3, 6, 8),

-- Cita 4: Tratamiento 4 - Cavitación (paquete 2, fecha 2024-03-15)
(4, 6, 6), (4, 9, 4),

-- Cita 5: Tratamiento 5 - Radiofrecuencia Corporal (paquete 2, fecha 2024-03-28)
(5, 1, 6), (5, 6, 8), (5, 8, 1),

-- Cita 6: Tratamiento 6 - Drenaje Linfático (paquete 2, fecha 2024-04-10)
(6, 4, 8), (6, 5, 2),

-- Cita 7: Tratamiento 1 - Limpieza (paquete 3, fecha 2024-03-20)
(7, 1, 4), (7, 2, 2),

-- Cita 8: Tratamiento 4 - Cavitación (paquete 3, fecha 2024-04-01)
(8, 6, 5), (8, 9, 3),

-- Cita 9: Tratamiento 8 - Masaje (paquete 3, fecha 2024-04-15)
(9, 4, 10), (9, 5, 2),

-- Cita 10: Tratamiento 11 - Manicura (paquete 6, fecha 2024-04-01)
(10, 5, 2), (10, 13, 1), (10, 14, 1),

-- Cita 11: Tratamiento 12 - Pedicura (paquete 6, fecha 2024-04-20)
(11, 5, 3), (11, 11, 1), (11, 12, 1), (11, 14, 1),

-- Cita 12: Tratamiento 8 - Masaje individual (sin paquete)
(12, 4, 12), (12, 5, 2),

-- Cita 13: Tratamiento 6 - Drenaje individual
(13, 4, 6), (13, 5, 2),

-- Cita 14: Tratamiento 2 - Radiofrecuencia individual
(14, 1, 5), (14, 6, 6), (14, 8, 1),

-- Cita 15: Tratamiento 7 - Depilación individual
(15, 6, 4), (15, 10, 2), (15, 5, 1),

-- Cita 16: Tratamiento 2 - Radiofrecuencia cancelada (paquete 1)
(16, 1, 3), (16, 6, 4),

-- Cita 17: Tratamiento 5 - Radiofrecuencia Corporal cancelada (paquete 2)
(17, 1, 4), (17, 6, 5),

-- Cita 18: Tratamiento 3 - Peeling cancelado individual
(18, 2, 2), (18, 5, 1),

-- Cita 19: Tratamiento 1 - Limpieza fecha límite (paquete 1)
(19, 1, 5), (19, 2, 3), (19, 3, 1),

-- Cita 20: Tratamiento 4 - Cavitación fecha límite (paquete 2)
(20, 6, 5), (20, 9, 3),

-- Cita 21: Tratamiento 1 - Limpieza penúltimo día (paquete 3)
(21, 1, 4), (21, 2, 2),

-- Cita 22: Tratamiento 11 - Manicura (paquete 6)
(22, 5, 2), (22, 13, 1), (22, 14, 1),

-- Cita 23: Tratamiento 3 - Peeling realizado temprano (paquete 1)
(23, 2, 3), (23, 5, 2), (23, 6, 6),

-- Cita 24: Tratamiento 6 - Drenaje realizado temprano (paquete 2)
(24, 4, 6), (24, 5, 2),

-- Cita 25: Tratamiento 4 - Cavitación realizada temprano (paquete 3)
(25, 6, 4), (25, 9, 3);

-- =====================================================
-- VERIFICACIONES DE CONSISTENCIA
-- =====================================================

-- Verificación 1: Empleados en EmpleadosFijosPorTratamiento SOLO con esFijo=true
-- SELECT e.idEmpleado, e.nombreEmpleado, e.esFijo 
-- FROM empleados e 
-- INNER JOIN EmpleadosFijosPorTratamiento eft ON e.idEmpleado = eft.idEmpleadoFijo 
-- WHERE e.esFijo = false;  -- Debe devolver 0 filas

-- Verificación 2: En citas, el empleado debe ser fijo del tratamiento O suplente del área
-- SELECT c.idcita, c.idEmpleado, e.nombreEmpleado, e.esFijo, c.idtratamiento, t.idCategoria, cat.idArea
-- FROM citas c
-- JOIN empleados e ON c.idEmpleado = e.idEmpleado
-- JOIN tratamientos t ON c.idtratamiento = t.idtratamiento
-- JOIN categorias cat ON t.idCategoria = cat.idCategoria
-- WHERE NOT EXISTS (
--     SELECT 1 FROM EmpleadosFijosPorTratamiento eft 
--     WHERE eft.idEmpleadoFijo = c.idEmpleado AND eft.idTratamiento = c.idtratamiento
-- ) AND NOT EXISTS (
--     SELECT 1 FROM empleadosPorArea epa 
--     WHERE epa.idEmpleado = c.idEmpleado AND epa.idArea = cat.idArea
-- );  -- Debe devolver 0 filas

-- Verificación 3: Si idpaquetevendido no es NULL, el tratamiento debe estar en contenidopaquete
-- SELECT c.idcita, c.idpaquetevendido, c.idtratamiento, pv.idpaquete
-- FROM citas c
-- JOIN paquetevendido pv ON c.idpaquetevendido = pv.idpaquetevendido
-- WHERE c.idpaquetevendido IS NOT NULL
-- AND NOT EXISTS (
--     SELECT 1 FROM contenidopaquete cp 
--     WHERE cp.idpaquete = pv.idpaquete AND cp.idtratamiento = c.idtratamiento
-- );  -- Debe devolver 0 filas

-- Verificación 4: Materiales por cita no exceden cantidades de MaterialesPorTratamiento
-- SELECT mpc.idCita, mpc.idMaterial, mpc.cantidadMaterialUtilizado, mpt.cantidad as maximo_permitido
-- FROM MaterialesPorCita mpc
-- JOIN MaterialesPorTratamiento mpt ON mpc.idMaterial = mpt.idmaterial AND mpc.idCita IN (
--     SELECT idcita FROM citas WHERE idtratamiento = mpt.idtratamiento
-- )
-- WHERE mpc.cantidadMaterialUtilizado > mpt.cantidad;  -- Debe devolver 0 filas