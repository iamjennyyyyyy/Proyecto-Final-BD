-- DATOS DE PRUEBA ADAPTADOS AL SCHEMA ACTUAL

-- 1. DISTRITOS
INSERT INTO distritos (nombredistrito) VALUES
('San Isidro'), ('Miraflores'), ('Surco'), ('San Borja'), ('La Molina'),
('Jesús María'), ('Lince'), ('Magdalena'), ('San Miguel'), ('Pueblo Libre');

-- 2. AREAS
INSERT INTO areas (nombre, cantidadpersonalfijo) VALUES
('Estética Facial', 3),
('Estética Corporal', 3),
('Depilación Láser', 2),
('Masoterapia', 2),
('Nutrición', 1),
('Podología', 1),
('Manicura y Pedicura', 2);

-- 3. CATEGORIAS
INSERT INTO categorias (nombre, idarea) VALUES
('Limpiezas Faciales', 1),
('Tratamientos Anti-Edad', 1),
('Peelings', 1),
('Tratamientos Reductores', 2),
('Tratamientos Reafirmantes', 2),
('Drenaje Linfático', 2),
('Depilación Láser Diodo', 3),
('Masajes Terapéuticos', 4),
('Consultas Nutricionales', 5),
('Cuidado de Pies', 6),
('Manicura', 7),
('Pedicura', 7);

-- 4. TRATAMIENTOS
INSERT INTO tratamientos (nombre, precio, descripcion, duracion, idcategoria) VALUES
('Limpieza Facial Profunda', 80.00, 'Limpieza profunda', 60, 1),
('Radiofrecuencia Facial', 150.00, 'Estimulación colágeno', 45, 2),
('Peeling Químico', 120.00, 'Renovación celular', 40, 3),
('Cavitación', 130.00, 'Reducción grasa', 50, 4),
('Radiofrecuencia Corporal', 140.00, 'Reafirmación', 45, 5),
('Drenaje Linfático Manual', 95.00, 'Eliminación líquidos', 50, 6),
('Depilación Láser Piernas', 150.00, 'Eliminación definitiva', 45, 7),
('Masaje Descontracturante', 85.00, 'Alivio tensiones', 45, 8),
('Consulta Nutricional', 70.00, 'Evaluación', 60, 9),
('Tratamiento de Callosidades', 60.00, 'Eliminación callos', 30, 10),
('Manicura Clásica', 35.00, 'Corte y esmaltado', 30, 11),
('Pedicura Premium', 55.00, 'Exfoliación y masaje', 50, 12);

-- 5. EMPLEADOS
INSERT INTO empleados (nombre, especialidad, horastrabajo, direccion, dni, telefono, iddistrito, esfijo) VALUES
('María González', 'Esteticista Facial', 40, 'Av. Rivera Navarrete 250', '12345678', '987654321', 1, true),
('Carlos Rodríguez', 'Terapeuta Corporal', 40, 'Calle Los Pinos 150', '23456789', '987654322', 2, true),
('Ana Martínez', 'Especialista Láser', 35, 'Av. Aviación 3200', '34567890', '987654323', 3, true),
('Luis Fernández', 'Masajista', 40, 'Calle Las Palmeras 45', '45678901', '987654324', 4, true),
('Elena Torres', 'Nutricionista', 30, 'Av. Javier Prado 890', '56789012', '987654325', 5, true),
('Jorge Ramírez', 'Podólogo', 35, 'Calle Los Alamos 78', '67890123', '987654326', 1, true),
('Patricia Sánchez', 'Manicurista', 40, 'Av. Brasil 560', '78901234', '987654327', 6, true),
('Fernando Castro', 'Masajista Deportivo', 35, 'Calle Los Olivos 120', '89012345', '987654328', 7, false),
('Carolina Mendoza', 'Esteticista Facial', 40, 'Av. Benavides 450', '90123456', '987654329', 2, false),
('Ricardo Vargas', 'Terapeuta Corporal', 30, 'Calle Las Gardenias 200', '01234567', '987654330', 8, false),
('Laura Díaz', 'Asistente Facial', 20, 'Av. Universitaria 1000', '11111111', '987654331', 3, false),
('Pedro Chávez', 'Ayudante Corporal', 15, 'Calle Los Laureles 55', '22222222', '987654332', 4, false);

-- 6. CLIENTES
INSERT INTO clientes (nombre) VALUES
('Ana Lucía Pérez'), ('Juan Carlos Mendoza'), ('María Fernanda Rojas'),
('Roberto Sánchez'), ('Carmen Rosa Flores'), ('Luis Alberto Gómez');

-- 7. PAQUETES
INSERT INTO paquetes (nombre, precio) VALUES
('Pack Facial Completo', 299.00),
('Pack Corporal Premium', 399.00),
('Pack Bienestar Total', 499.00);

-- 8. MATERIALES
INSERT INTO materiales (nombre) VALUES
('Crema Hidratante'), ('Gel Exfoliante'), ('Mascarilla Facial'), ('Aceite Esencial'),
('Guantes Descartables'), ('Alcohol Gel'), ('Gasas Estériles'), ('Electrodo'),
('Gel de Ultrasonido'), ('Crema Post-Depilación'), ('Palitos de Naranjo'),
('Lima Eléctrica'), ('Cortaúñas'), ('Esmalte'), ('Lámpara UV'), ('Algodón');

-- 9. CONTENIDO DE PAQUETES
INSERT INTO contenidopaquete (idpaquete, idtratamiento) VALUES
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5), (2, 6),
(3, 1), (3, 4), (3, 8);

-- 10. MATERIALES POR TRATAMIENTO
INSERT INTO materialesportratamiento (idtratamiento, idmaterial, cantidad) VALUES
(1, 1, 10), (1, 2, 5), (1, 3, 2), (1, 5, 4), (1, 6, 20),
(2, 1, 8), (2, 6, 10), (2, 8, 2), (2, 9, 5),
(3, 2, 6), (3, 5, 3), (3, 6, 15), (3, 7, 4),
(4, 6, 10), (4, 9, 8), (4, 5, 3),
(5, 6, 12), (5, 8, 2), (5, 9, 6), (5, 1, 10),
(6, 4, 15), (6, 5, 4), (6, 6, 10),
(7, 6, 8), (7, 10, 3), (7, 5, 2),
(8, 4, 20), (8, 5, 4), (8, 6, 8),
(9, 6, 5), (9, 5, 2),
(10, 5, 6), (10, 11, 3), (10, 12, 1),
(11, 5, 4), (11, 13, 1), (11, 14, 2), (11, 16, 10),
(12, 5, 6), (12, 11, 2), (12, 12, 1), (12, 14, 2), (12, 16, 15);

-- 11. EMPLEADOS POR AREA
INSERT INTO empleadosporarea (idempleado, idarea) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7),
(8, 4), (9, 1), (9, 7), (10, 2), (10, 4), (11, 1), (12, 2);

-- 12. EMPLEADOS FIJOS POR TRATAMIENTO
INSERT INTO empleadosfijosportratamiento (idempleadofijo, idtratamiento) VALUES
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5), (2, 6),
(3, 7), (4, 8), (5, 9), (6, 10), (7, 11), (7, 12);

-- 13. PAQUETES VENDIDOS
INSERT INTO paquetevendido (idpaquete, idcliente, fechacompra, fechainicio, fechafin) VALUES
(1, 1, '2024-03-01', '2024-03-10', '2024-06-10'),
(2, 2, '2024-03-05', '2024-03-15', '2024-06-15'),
(3, 3, '2024-03-10', '2024-03-20', '2024-06-20'),
(NULL, 4, '2024-03-15', '2024-03-20', '2024-03-20'),
(NULL, 5, '2024-03-20', '2024-03-25', '2024-03-25'),
(1, 6, '2024-03-25', '2024-04-01', '2024-07-01');

-- 14. CITAS
INSERT INTO citas (idcliente, idtratamiento, fecha, hora, observaciones, idpaquetevendido, idempleado, estado) VALUES
(1, 1, '2024-03-10', '10:00:00', 'Empleado fijo asignado - primera cita del pack', 1, 1, 'realizada'),
(1, 2, '2024-03-20', '11:30:00', 'Segunda sesión pack facial', 1, 9, 'realizada'),
(1, 3, '2024-04-05', '09:00:00', 'Tercera sesión - peeling', 1, 1, 'pendiente'),
(2, 4, '2024-03-15', '15:00:00', 'Primera cita pack corporal', 2, 2, 'realizada'),
(2, 5, '2024-03-28', '14:00:00', 'Segunda sesión corporal', 2, 10, 'pendiente'),
(2, 6, '2024-04-10', '16:00:00', 'Drenaje linfático', 2, 2, 'pendiente'),
(3, 1, '2024-03-20', '10:30:00', 'Primera cita pack bienestar', 3, 9, 'realizada'),
(3, 4, '2024-04-01', '12:00:00', 'Segundo tratamiento del pack', 3, 10, 'realizada'),
(3, 8, '2024-04-15', '11:00:00', 'Masaje descontracturante', 3, 8, 'pendiente'),
(6, 11, '2024-04-01', '17:00:00', 'Manicura - pack bienestar', 6, 7, 'pendiente'),
(6, 12, '2024-04-20', '16:00:00', 'Pedicura premium', 6, 7, 'pendiente'),
(4, 8, '2024-03-25', '14:00:00', 'Tratamiento individual - Masaje', NULL, 4, 'realizada'),
(5, 6, '2024-03-30', '09:00:00', 'Individual drenaje linfático', NULL, 10, 'realizada'),
(4, 2, '2024-04-05', '13:00:00', 'Radiofrecuencia individual', NULL, 9, 'pendiente'),
(5, 7, '2024-04-08', '11:30:00', 'Depilación láser individual', NULL, 3, 'pendiente'),
(1, 2, '2024-04-12', '10:00:00', 'Cancelada por cliente', 1, 1, 'cancelada'),
(2, 5, '2024-04-18', '15:30:00', 'Cancelada por reprogramación', 2, 2, 'cancelada'),
(3, 3, '2024-04-22', '12:00:00', 'Cancelación anticipada', NULL, 9, 'cancelada'),
(1, 1, '2024-06-10', '09:00:00', 'Última cita antes de vencer', 1, 1, 'pendiente'),
(2, 4, '2024-06-15', '14:00:00', 'Cita en fecha de vencimiento', 2, 2, 'pendiente'),
(3, 1, '2024-06-19', '16:00:00', 'Cita antes de vencer', 3, 9, 'pendiente'),
(6, 11, '2024-05-15', '11:00:00', 'Manicura de mantenimiento', 6, 7, 'pendiente'),
(1, 3, '2024-03-15', '08:30:00', 'Peeling realizado', 1, 1, 'realizada'),
(2, 6, '2024-03-18', '10:00:00', 'Drenaje realizado', 2, 2, 'realizada'),
(3, 4, '2024-03-25', '15:00:00', 'Cavitación realizada', 3, 10, 'realizada');

-- 15. MATERIALES POR CITA
INSERT INTO materialesporcita (idcita, idmaterial, cantidadusada) VALUES
(1, 1, 5), (1, 2, 3), (1, 3, 1), (1, 5, 2),
(2, 1, 4), (2, 6, 5), (2, 8, 1),
(3, 2, 3), (3, 5, 2), (3, 6, 8),
(4, 6, 6), (4, 9, 4),
(5, 1, 6), (5, 6, 8), (5, 8, 1),
(6, 4, 8), (6, 5, 2),
(7, 1, 4), (7, 2, 2),
(8, 6, 5), (8, 9, 3),
(9, 4, 10), (9, 5, 2),
(10, 5, 2), (10, 13, 1), (10, 14, 1),
(11, 5, 3), (11, 11, 1), (11, 12, 1), (11, 14, 1),
(12, 4, 12), (12, 5, 2),
(13, 4, 6), (13, 5, 2),
(14, 1, 5), (14, 6, 6), (14, 8, 1),
(15, 6, 4), (15, 10, 2), (15, 5, 1),
(16, 1, 3), (16, 6, 4),
(17, 1, 4), (17, 6, 5),
(18, 2, 2), (18, 5, 1),
(19, 1, 5), (19, 2, 3), (19, 3, 1),
(20, 6, 5), (20, 9, 3),
(21, 1, 4), (21, 2, 2),
(22, 5, 2), (22, 13, 1), (22, 14, 1),
(23, 2, 3), (23, 5, 2), (23, 6, 6),
(24, 4, 6), (24, 5, 2),
(25, 6, 4), (25, 9, 3);
