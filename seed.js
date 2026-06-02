const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost', user: 'postgres', password: 'jenn126*', database: 'SPA', port: 1234
});

async function seed() {
  console.log('🌱 Sembrando datos de prueba...\n');

  // 1. Distritos
  const distritos = [
    'Miraflores', 'San Isidro', 'Barranco', 'La Molina', 'San Borja',
    'Santiago de Surco', 'Jesus Maria', 'Lince', 'Magdalena', 'San Miguel'
  ];
  const distritoRows = [];
  for (const nombre of distritos) {
    const r = await pool.query(
      `INSERT INTO distritos (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING RETURNING iddistrito`,
      [nombre]
    );
    if (r.rows.length) distritoRows.push(r.rows[0].iddistrito);
  }
  console.log(`  ${distritoRows.length} distritos creados`);

  // 2. Areas
  const areas = ['Masajes', 'Faciales', 'Corporales', 'Estetica', 'Bienestar'];
  const areaRows = [];
  for (const nombre of areas) {
    const r = await pool.query(
      `INSERT INTO areas (nombre, cantidadpersonalfijo) VALUES ($1, 0) ON CONFLICT (nombre) DO NOTHING RETURNING idarea`,
      [nombre]
    );
    if (r.rows.length) areaRows.push(r.rows[0].idarea);
  }
  console.log(`  ${areaRows.length} areas creadas`);

  // 3. Categorias
  const catsData = [
    ['Masajes Relajantes', areaRows[0]],
    ['Masajes Terapeuticos', areaRows[0]],
    ['Limpieza Facial', areaRows[1]],
    ['Tratamiento Antiaging', areaRows[1]],
    ['Envolturas Corporales', areaRows[2]],
    ['Exfoliaciones', areaRows[2]],
    ['Manicure y Pedicure', areaRows[3]],
    ['Depilacion', areaRows[3]],
    ['Yoga y Meditacion', areaRows[4]],
    ['Aromaterapia', areaRows[4]],
  ];
  const catRows = [];
  for (const [nombre, idarea] of catsData) {
    const r = await pool.query(
      `INSERT INTO categorias (nombre, idarea) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING RETURNING idcategoria`,
      [nombre, idarea]
    );
    if (r.rows.length) catRows.push(r.rows[0].idcategoria);
  }
  console.log(`  ${catRows.length} categorias creadas`);

  // 4. Empleados
  function makeDni(yy, mm, dd, extra) {
    // Siglo 0-5 = 1900s, 6-8 = 2000s. If YY > 25 → born 19YY, sigo 0.
    const siglo = yy > 25 ? '0' : '7';
    return String(yy).padStart(2,'0') + String(mm).padStart(2,'0') + String(dd).padStart(2,'0') + siglo + String(extra).padStart(4,'0');
  }
  const empleadosData = [
    ['Carlos Martinez', 'Masoterapeuta', 8, 'Av. Principal 123', makeDni(95,1,1,2345), '999111001', distritoRows[0], true],
    ['Maria Garcia', 'Esteticista', 6, 'Jr. Las Flores 456', makeDni(88,5,12,6789), '999111002', distritoRows[1], true],
    ['Ana Lopez', 'Terapeuta Corporal', 8, 'Calle Los Olivos 789', makeDni(92,12,3,3456), '999111003', distritoRows[2], false],
    ['Luis Torres', 'Masajista Deportivo', 6, 'Av. Del Parque 321', makeDni(90,8,15,2345), '999111004', distritoRows[0], true],
    ['Sofia Ramirez', 'Cosmetologa', 7, 'Jr. Union 654', makeDni(97,7,28,5678), '999111005', distritoRows[3], false],
    ['Diego Herrera', 'Instructor Yoga', 5, 'Av. La Paz 987', makeDni(85,3,10,6789), '999111006', distritoRows[1], false],
    ['Valentina Rios', 'Aromaterapeuta', 6, 'Calle Bonita 147', makeDni(99,11,22,7890), '999111007', distritoRows[4], true],
    ['Jorge Castillo', 'Masajista', 8, 'Av. Los Alamos 258', makeDni(88,6,5,4567), '999111008', distritoRows[2], false],
    ['Camila Nuñez', 'Esteticista Integral', 7, 'Jr. Las Orquideas 369', makeDni(95,9,18,5678), '999111009', distritoRows[3], true],
    ['Andres Vega', 'Terapeuta', 6, 'Calle Sol 159', makeDni(93,2,1,8901), '999111010', distritoRows[0], false],
  ];
  const empRows = [];
  for (const [nombre, especialidad, horastrabajo, direccion, dni, telefono, iddistrito, esfijo] of empleadosData) {
    try {
      const r = await pool.query(
        `INSERT INTO empleados (nombre, especialidad, horastrabajo, direccion, dni, telefono, iddistrito, esfijo)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (nombre) DO NOTHING RETURNING idempleado`,
        [nombre, especialidad, horastrabajo, direccion, dni, telefono, iddistrito, esfijo]
      );
      if (r.rows.length) empRows.push(r.rows[0].idempleado);
    } catch (e) { console.log(`    ⚠ ${nombre}: ${e.message}`); }
  }
  console.log(`  ${empRows.length} empleados creados`);

  // 5. Empleados por Area
  const empAreaPairs = [
    [empRows[0], areaRows[0]], [empRows[1], areaRows[1]], [empRows[2], areaRows[2]],
    [empRows[3], areaRows[0]], [empRows[4], areaRows[3]], [empRows[5], areaRows[4]],
    [empRows[6], areaRows[4]], [empRows[7], areaRows[2]], [empRows[8], areaRows[3]],
    [empRows[9], areaRows[0]],
  ];
  let empAreaCount = 0;
  for (const [idempleado, idarea] of empAreaPairs) {
    try {
      await pool.query(
        `INSERT INTO empleadosporarea (idempleado, idarea) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [idempleado, idarea]
      );
      empAreaCount++;
    } catch (e) { /* ignore */ }
  }
  console.log(`  ${empAreaCount} empleados x area creados`);

  // 6. Materiales
  const matsData = [
    ['Aceite de Almendras', 50],
    ['Crema Facial Hidratante', 30],
    ['Arcilla Blanca', 25],
    ['Aceite Esencial de Lavanda', 40],
    ['Exfoliante Corporal Natural', 20],
    ['Mascarilla Facial Purificante', 15],
    ['Gel de Aloe Vera', 35],
    ['Aceite de Coco Virgen', 45],
    ['Sales de Baño Aromaticas', 28],
    ['Crema Antiaging', 18],
    ['Incienso Natural', 60],
    ['Toallas Desechables', 100],
  ];
  const matRows = [];
  for (const [nombre, cantidad] of matsData) {
    const r = await pool.query(
      `INSERT INTO materiales (nombre, cantidad) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING RETURNING idmaterial`,
      [nombre, cantidad]
    );
    if (r.rows.length) matRows.push(r.rows[0].idmaterial);
  }
  console.log(`  ${matRows.length} materiales creados`);

  // 7. Tratamientos
  const tratData = [
    ['Masaje Relajante Full Body', 120.00, 'Masaje relajante de cuerpo completo con aceites esenciales', 60, catRows[0]],
    ['Masaje Descontracturante', 150.00, 'Masaje profundo para aliviar tensiones musculares', 45, catRows[1]],
    ['Limpieza Facial Profunda', 80.00, 'Limpieza facial con extraccion de puntos negros', 45, catRows[2]],
    ['Tratamiento Antiaging Premium', 200.00, 'Tratamiento facial rejuvenecedor con radiofrecuencia', 75, catRows[3]],
    ['Envoltura de Arcilla', 130.00, 'Envoltura corporal con arcilla blanca y aceites esenciales', 60, catRows[4]],
    ['Exfoliacion Corporal con Cafe', 90.00, 'Exfoliacion corporal con cafe y aceite de coco', 40, catRows[5]],
    ['Manicure Spa', 55.00, 'Manicure con tratamiento hidratante y esmalte', 35, catRows[6]],
    ['Pedicure Spa', 65.00, 'Pedicure completo con exfoliacion y masaje', 40, catRows[6]],
    ['Depilacion con Cera Natural', 45.00, 'Depilacion con cera natural hipoalergenica', 30, catRows[7]],
    ['Clase de Yoga Grupal', 35.00, 'Clase grupal de yoga para principiantes', 60, catRows[8]],
    ['Masaje con Aromaterapia', 140.00, 'Masaje relajante con aceites esenciales aromaticos', 55, catRows[9]],
    ['Sesion de Meditacion Guiada', 40.00, 'Sesion de meditacion guiada con tecnicas de respiracion', 45, catRows[9]],
  ];
  const tratRows = [];
  for (const [nombre, precio, descripcion, duracion, idcategoria] of tratData) {
    try {
      const r = await pool.query(
        `INSERT INTO tratamientos (nombre, precio, descripcion, duracion, idcategoria)
         VALUES ($1,$2,$3,$4,$5) ON CONFLICT (nombre) DO NOTHING RETURNING idtratamiento`,
        [nombre, precio, descripcion, duracion, idcategoria]
      );
      if (r.rows.length) tratRows.push(r.rows[0].idtratamiento);
    } catch (e) { console.log(`    ⚠ ${nombre}: ${e.message}`); }
  }
  console.log(`  ${tratRows.length} tratamientos creados`);

  // 8. Materiales por Tratamiento
  const matTratPairs = [
    [tratRows[0], matRows[0], 3], [tratRows[0], matRows[6], 2],
    [tratRows[1], matRows[0], 2], [tratRows[1], matRows[3], 1],
    [tratRows[2], matRows[1], 2], [tratRows[2], matRows[5], 1], [tratRows[2], matRows[11], 2],
    [tratRows[3], matRows[3], 1], [tratRows[3], matRows[9], 2],
    [tratRows[4], matRows[2], 4], [tratRows[4], matRows[3], 2],
    [tratRows[5], matRows[4], 2], [tratRows[5], matRows[7], 1],
    [tratRows[6], matRows[1], 1],
    [tratRows[7], matRows[4], 2],
    [tratRows[10], matRows[0], 2], [tratRows[10], matRows[3], 2], [tratRows[10], matRows[8], 1],
  ];
  let matTratCount = 0;
  for (const [idtratamiento, idmaterial, cantidad] of matTratPairs) {
    try {
      await pool.query(
        `INSERT INTO materialesportratamiento (idtratamiento, idmaterial, cantidad) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
        [idtratamiento, idmaterial, cantidad]
      );
      matTratCount++;
    } catch (e) { /* ignore */ }
  }
  console.log(`  ${matTratCount} materiales x tratamiento creados`);

  // 9. Empleados Fijos por Tratamiento (solo empleados with esfijo = true)
  const fijos = empRows.filter((_, i) => empleadosData[i][7] === true);
  const empTratPairs = [
    [fijos[0], tratRows[0]], [fijos[0], tratRows[1]],
    [fijos[1], tratRows[2]], [fijos[1], tratRows[3]], [fijos[1], tratRows[6]], [fijos[1], tratRows[7]],
    [fijos[2], tratRows[4]], [fijos[2], tratRows[5]],
    [fijos[3], tratRows[10]],
    [fijos[4], tratRows[8]],
    [fijos[5], tratRows[9]],
  ];
  let empTratCount = 0;
  for (const [idempleadofijo, idtratamiento] of empTratPairs) {
    try {
      await pool.query(
        `INSERT INTO empleadosfijosportratamiento (idempleadofijo, idtratamiento) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [idempleadofijo, idtratamiento]
      );
      empTratCount++;
    } catch (e) { /* ignore */ }
  }
  console.log(`  ${empTratCount} empleados fijos x tratamiento creados`);

  // 10. Paquetes
  const paqData = [
    ['Spa Express', 150.00, 80, 15],
    ['Spa Completo', 280.00, 140, 20],
    ['Pareja Relax', 350.00, 120, 25],
    ['Bienestar Total', 220.00, 105, 18],
  ];
  const paqRows = [];
  for (const [nombre, precio, duraciontotal, descuento] of paqData) {
    try {
      const r = await pool.query(
        `INSERT INTO paquetes (nombre, precio, duraciontotal, descuento)
         VALUES ($1,$2,$3,$4) ON CONFLICT (nombre) DO NOTHING RETURNING idpaquete`,
        [nombre, precio, duraciontotal, descuento]
      );
      if (r.rows.length) paqRows.push(r.rows[0].idpaquete);
    } catch (e) { console.log(`    ⚠ ${nombre}: ${e.message}`); }
  }
  console.log(`  ${paqRows.length} paquetes creados`);

  // 11. Contenido de Paquetes
  const contentData = [
    [paqRows[0], tratRows[0]], [paqRows[0], tratRows[6]],
    [paqRows[1], tratRows[0]], [paqRows[1], tratRows[2]], [paqRows[1], tratRows[4]], [paqRows[1], tratRows[7]],
    [paqRows[2], tratRows[0]], [paqRows[2], tratRows[2]],
    [paqRows[3], tratRows[9]], [paqRows[3], tratRows[10]], [paqRows[3], tratRows[5]],
  ];
  let contentCount = 0;
  for (const [idpaquete, idtratamiento] of contentData) {
    try {
      await pool.query(
        `INSERT INTO contenidopaquete (idpaquete, idtratamiento) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [idpaquete, idtratamiento]
      );
      contentCount++;
    } catch (e) { /* ignore */ }
  }
  console.log(`  ${contentCount} contenidos de paquete creados`);

  // 12. Clientes
  const clientesData = [
    ['Elena Torres', makeDni(93,4,15,2345), '999888001', 'elena@email.com'],
    ['Roberto Sanchez', makeDni(89,11,20,6789), '999888002', 'roberto@email.com'],
    ['Carmen Flores', makeDni(97,8,3,3456), '999888003', 'carmen@email.com'],
    ['Miguel Angel Ruiz', makeDni(86,5,12,2345), '999888004', 'miguel@email.com'],
    ['Patricia Mendoza', makeDni(95,12,31,5678), '999888005', 'patricia@email.com'],
    ['Fernando Castro', makeDni(88,7,18,8901), '999888006', 'fernando@email.com'],
    ['Gabriela Vargas', makeDni(99,2,26,9012), '999888007', 'gabriela@email.com'],
    ['Alberto Morales', makeDni(91,6,9,4567), '999888008', 'alberto@email.com'],
  ];
  const clienteRows = [];
  for (const [nombre, ci, telefono, email] of clientesData) {
    try {
      const r = await pool.query(
        `INSERT INTO clientes (nombre, ci, telefono, email)
         VALUES ($1,$2,$3,$4) ON CONFLICT (nombre) DO NOTHING RETURNING idcliente`,
        [nombre, ci, telefono, email]
      );
      if (r.rows.length) clienteRows.push(r.rows[0].idcliente);
    } catch (e) { console.log(`    ⚠ ${nombre}: ${e.message}`); }
  }
  console.log(`  ${clienteRows.length} clientes creados`);

  // 13. Citas (this month for testing)
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const citasData = [
    [clienteRows[0], tratRows[0], `${y}-${m}-10`, '10:00', 'Primera visita', empRows[1], 'realizada'],
    [clienteRows[1], tratRows[2], `${y}-${m}-11`, '15:30', '', empRows[2], 'realizada'],
    [clienteRows[2], tratRows[1], `${y}-${m}-12`, '09:00', 'Dolor de espalda', empRows[0], 'realizada'],
    [clienteRows[3], tratRows[4], `${y}-${m}-15`, '14:00', '', empRows[3], 'pendiente'],
    [clienteRows[4], tratRows[6], `${y}-${m}-16`, '11:00', '', empRows[4], 'pendiente'],
    [clienteRows[0], tratRows[3], `${y}-${m}-18`, '16:00', 'Sesion de seguimiento', empRows[5], 'cancelada'],
    [clienteRows[5], tratRows[5], `${y}-${m}-20`, '10:30', '', empRows[6], 'pendiente'],
    [clienteRows[6], tratRows[10], `${y}-${m}-22`, '12:00', 'Alergica a lavanda', empRows[0], 'pendiente'],
    [clienteRows[7], tratRows[9], `${y}-${m}-25`, '08:30', '', empRows[7], 'pendiente'],
    [clienteRows[2], tratRows[7], `${y}-${m}-28`, '17:00', '', empRows[8], 'pendiente'],
  ];
  const citaRows = [];
  for (const [idcliente, idtratamiento, fecha, hora, observaciones, idempleado, estado] of citasData) {
    // Get precio from tratamiento
    const p = await pool.query(`SELECT precio FROM tratamientos WHERE idtratamiento = $1`, [idtratamiento]);
    const precio = p.rows[0].precio;
    try {
      const r = await pool.query(
        `INSERT INTO citas (idcliente, idtratamiento, fecha, hora, observaciones, idempleado, estado, precio)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING idcita`,
        [idcliente, idtratamiento, fecha, hora, observaciones, idempleado, estado, precio]
      );
      citaRows.push(r.rows[0].idcita);
    } catch (e) { console.log(`    ⚠ Cita ${fecha} ${hora}: ${e.message}`); }
  }
  console.log(`  ${citaRows.length} citas creadas`);

  // 14. Materiales por Cita (for realizada citas)
  const matCitaData = [
    [citaRows[0], matRows[0], 1],
    [citaRows[0], matRows[6], 1],
    [citaRows[1], matRows[1], 2],
    [citaRows[1], matRows[11], 1],
    [citaRows[2], matRows[0], 2],
    [citaRows[2], matRows[3], 1],
  ];
  let matCitaCount = 0;
  for (const [idcita, idmaterial, cantidad] of matCitaData) {
    try {
      await pool.query(
        `INSERT INTO materialesporcita (idcita, idmaterial, cantidadmaterialutilizado) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
        [idcita, idmaterial, cantidad]
      );
      matCitaCount++;
    } catch (e) { console.log(`    ⚠ Materiales x cita: ${e.message}`); }
  }
  console.log(`  ${matCitaCount} materiales x cita creados`);

  console.log('\n✅ Seed completado exitosamente!');
  await pool.end();
}

seed().catch(e => { console.error('❌ Error en seed:', e); process.exit(1); });
