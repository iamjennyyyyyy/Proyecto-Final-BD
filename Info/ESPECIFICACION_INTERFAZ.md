# Especificación de Interfaz Web — SPA Belleza y Relajación

> Documento de especificación funcional y visual para el desarrollo del frontend.
> Versión: 1.0

---

## 1. Pantalla de Login

### Layout
- Fondo con imagen decorativa de SPA (difuminada) o gradiente suave en tonos verdes y morados (#2ecc71 → #9b59b6).
- Tarjeta centrada vertical/horizontalmente, ancho máximo 400px, sombra suave, bordes redondeados 12px.
- Logo del SPA en la parte superior de la tarjeta (placeholder con texto "Belleza & Relax").

### Elementos del formulario
- Campo "Usuario" (text input, icono de persona a la izquierda).
- Campo "Contraseña" (password input, icono de candado).
- Botón "Iniciar Sesión" verde menta (#2ecc71), texto blanco, hover más oscuro.
- Mensaje de error en rojo debajo del botón si las credenciales son inválidas.

### Comportamiento
- Al hacer clic en "Iniciar Sesión":
  1. Enviar POST a `/api/auth/login` con `{ username, contrasena }`.
  2. Si el backend responde con el rol (`dependiente` o `administrador`), redirigir a la pantalla correspondiente.
  3. Si hay error, mostrar "Credenciales inválidas" sin recargar la página.
  4. Guardar sesión (cookie/session del lado servidor, el frontend solo verifica existencia de usuario logueado vía `req.session.usuario`).

---

## 2. Layout General (post-login)

### Estructura base
```
+------------------------------------------+
|  Menú Lateral (260px / 70px colapsado)   |  Contenido Principal
|  +--------------------------------------+|
|  | Logo/Brand                          ||  |  (padding 24px)
|  |                                      ||  |
|  | [Icono] Inicio                       ||  |  +---------------------------+
|  | [Icono] Citas                        ||  |  |                           |
|  | [Icono] ...                          ||  |  |  (Contenido dinámico)     |
|  |                                      ||  |  |                           |
|  |  ────────────────────               ||  |  +---------------------------+
|  |  Cerrar Sesión                       ||  |
|  +--------------------------------------+|
+------------------------------------------+
```

### Menú lateral
- Ancho 260px en escritorio, fondo blanco, sombra derecha suave (box-shadow 2px 0 12px rgba(0,0,0,0.06)).
- Logo/ícono del sistema en la parte superior (40px de alto), debajo el nombre "SPA Belleza".
- Ítems del menú: fila con icono de FontAwesome (24px) + texto a la derecha, padding 12px 20px, border-radius 8px, hover con fondo gris muy claro (#f0f4f8).
- Ítem activo: fondo verde menta (#2ecc71) con texto blanco.
- Botón hamburguesa (☰) en la esquina superior izquierda del menú para colapsar a 70px (solo íconos visibles, texto oculto con transición).
- Versión móvil (< 768px): menú oculto inicialmente, se abre como overlay con backdrop semitransparente al tocar el hamburguesa.

### Header superior
- Barra delgada (56px) pegada arriba del contenido principal.
- A la izquierda: breadcrumb o título de la página actual.
- A la derecha: nombre del usuario logueado + inicial en un círculo de color.
- Color de fondo: blanco, borde inferior 1px solid #e8ecf1.

### Contenido principal
- Margen izquierdo igual al ancho del menú (260px o 70px), transición suave.
- Padding 24px, scroll vertical, fondo #f5f7fa.
- Altura mínima: 100vh.

### Tipografía y colores
- Fuente: Poppins (Google Fonts), pesos 400, 500, 600, 700.
- Fondo general: #f5f7fa.
- Tarjetas: fondo blanco, border-radius 12px, box-shadow 0 2px 8px rgba(0,0,0,0.06), padding 20px.
- Acento primario: #2ecc71 (verde menta).
- Acento secundario: #9b59b6 (morado suave).
- Texto principal: #2c3e50.
- Texto secundario: #7f8c8d.
- Bordes: #e8ecf1.

---

## 3. Perfil Dependiente

### 3.1 Menú lateral (íconos + texto)
1. **Inicio** — Icono: fa-home
2. **Citas** — Icono: fa-calendar-check
3. **Paquetes** — Icono: fa-box
4. **Tratamientos** — Icono: fa-spa
5. **Reportes** — Icono: fa-chart-bar
6. **Mapa y Contactos** — Icono: fa-map-marker-alt

### 3.2 Pantalla Inicio

#### Tarjeta de bienvenida
- Fondo con gradiente suave verde-menta a verde-oscuro (#2ecc71 → #27ae60), texto blanco.
- Mensaje: "Bienvenido/a, [nombre del dependiente]" (obtenido de `usuario.nombre` desde la sesión).
- Subtítulo: "Hoy es [fecha actual formateada]".

#### Resumen rápido
- Grid de 2 columnas con tarjetas:
  1. **Citas de hoy**: Número grande (ej: 5), etiqueta "Citas agendadas para hoy", icono de calendario.
  2. **Ventas del día**: Monto en formato moneda (ej: $450.00), etiqueta "Ingresos por citas realizadas", icono de dólar/moneda.
- Los datos se cargan via:
  - `GET /api/citas/fecha?fecha=YYYY-MM-DD` para contar citas de hoy.
  - `GET /api/citas/fecha?fecha=YYYY-MM-DD&estado=realizada` para sumar precios.

### 3.3 Pantalla Citas

#### Vista general
- Header con título "Citas" y contador (ej: "12 citas totales").
- Lista de citas en tarjetas (grid 1-2 columnas según ancho).
- Cada tarjeta muestra:
  - Nombre del cliente (negrita, 16px).
  - Tratamiento (texto secundario, 14px).
  - Fecha y hora (ej: "15 Jun 2026, 10:00 AM").
  - Estado con badge de color: pendiente (amarillo #f1c40f), realizada (verde #2ecc71), cancelada (rojo #e74c3c).
  - Botón "Ver detalle" que abre modal con toda la info de la cita + botones para cambiar estado.
- Botón flotante (FAB) en esquina inferior derecha: "+ Agendar cita", fondo verde menta, sombra, border-radius 999px.

#### Modal "Agendar Cita"
- Título: "Agendar Nueva Cita".
- Campo "Cliente": input con autocompletado. Al escribir, se dispara `GET /api/clientes?q=[texto]` y muestra sugerencias en dropdown debajo del input. Cada sugerencia: nombre + CI.
- Si no hay coincidencias, aparece botón "+ Nuevo Cliente" que abre sub-modal con campos: nombre, CI, teléfono, email. Al guardar, se crea via `POST /api/clientes` y se auto-selecciona en el campo.
- Campo "Fecha": date picker nativo (input type="date"), valor mínimo = hoy.
- Campo "Hora": time picker nativo (input type="time").
- Selector "Tratamiento": dropdown con lista de tratamientos (`GET /api/tratamientos`). Muestra nombre + precio + duración.
- Al seleccionar tratamiento, se muestra el precio y duración.
- Campo "Empleado": dropdown con empleados disponibles (`GET /api/empleados`).
- Botón "Guardar Cita" → `POST /api/citas`. Al éxito, toast verde y recarga de lista.
- Validaciones en frontend:
  - Cliente requerido.
  - Fecha no puede ser domingo ni pasada.
  - Hora entre 09:00 y 18:00.
  - Tratamiento requerido.

#### Modal "Ver Detalle de Cita"
- Título: "Cita #ID — [Nombre Cliente]".
- Información completa: cliente, tratamiento, empleado, fecha, hora, precio, estado, observaciones, paquete asociado (si aplica).
- Si estado es "pendiente": botones "Marcar como Realizada" y "Cancelar Cita" (con confirmación).
  - `PUT /api/citas/:id` con `{ estado: 'realizada' }` o `{ estado: 'cancelada' }`.
- Si estado es "realizada" o "cancelada": solo lectura, sin botones de acción.
- Botón "Cerrar".

### 3.4 Pantalla Paquetes

#### Galería de paquetes
- Grid responsivo (3-4 columnas en escritorio, 2 en tablet, 1 en móvil).
- Cada tarjeta de paquete:
  - Imagen placeholder decorativa (gradiente de color, o un div con icono de spa alt).
  - Nombre del paquete (18px, bold).
  - Precio en formato moneda (verde menta, 20px, bold).
  - Duración total: "X minutos".
  - Lista de tratamientos incluidos (tags/chips pequeños, ej: "Masaje", "Facial", "Hidroterapia").
  - Botón "Vender Paquete" — ancho completo, verde menta.

#### Modal "Vender Paquete"
- Título: "Vender Paquete: [Nombre Paquete]".
- Paquete preseleccionado (nombre + precio, solo lectura).
- Campo "Cliente": igual que en Agendar Cita (autocompletado + opción nuevo cliente).
- Precio total mostrado.
- Botón "Registrar Venta" → `POST /api/paquetes-vendidos` con `{ idpaquete, idcliente, fechacompra: hoy, fechainicio: hoy, fechafin: hoy+30 }`.
- Toast de éxito: "Paquete vendido correctamente a [Cliente]".

### 3.5 Pantalla Tratamientos

#### Galería de tratamientos
- Mismo grid que paquetes (3-4 columnas).
- Cada tarjeta:
  - Imagen placeholder (tono morado suave, icono de spa).
  - Nombre del tratamiento (bold).
  - Precio y duración.
  - Descripción corta.
  - Materiales listados como tags: "Aceite esencial", "Arcilla", etc.
  - Categoría y área como badges: "Facial", "Rostro".
  - Botón "Agendar Cita" → abre el mismo modal de Agendar Cita con el tratamiento preseleccionado.

### 3.6 Pantalla Reportes

#### Tarjetas de resumen
- Grid de 4 tarjetas (2x2 en escritorio, 1 columna en móvil):
  1. **Citas hoy**: número grande + etiqueta.
  2. **Ventas de la semana**: monto total.
  3. **Clientes nuevos este mes**: conteo.
  4. **Citas canceladas hoy**: conteo.
- Datos via:
  - `GET /api/citas/fecha?fecha=YYYY-MM-DD` → conteo.
  - `GET /api/citas/intervalo/fechas?fecha1=YYYY-MM-DD&fecha2=YYYY-MM-DD` para suma de precios (estado=realizada).
  - `GET /api/clientes` + filtro por fecha de creación.

### 3.7 Pantalla Mapa y Contactos

#### Layout de 2 columnas
- **Columna izquierda (mapa)**: Iframe de mapa embebido (placeholder con texto "Mapa de ubicación — Av. Principal 123, Santiago"). Se puede usar un div estilizado simulando mapa con marcador.
- **Columna derecha (contactos)**: Tarjeta con:
  - Dirección: "Av. Principal 123, Santiago, Chile".
  - Teléfono: "+56 2 1234 5678".
  - Email: "spa@bellezarelax.com".
  - Horario: "Lun – Sáb: 9:00 – 18:00".
  - Redes sociales: iconos de Instagram, Facebook, WhatsApp (mock, sin enlaces).

---

## 4. Perfil Administrador

### 4.1 Menú lateral
1. **Tratamientos** — Icono: fa-spa
2. **Paquetes** — Icono: fa-box
3. **Empleados** — Icono: fa-user-tie
4. **Clientes** — Icono: fa-users
5. **Materiales** — Icono: fa-oil-can
6. **Distritos** — Icono: fa-map-pin
7. **Áreas** — Icono: fa-building
8. **Reportes** — Icono: fa-chart-bar
9. **Informe de Ingresos** — Icono: fa-file-invoice-dollar
10. **Informe de Discrepancia** — Icono: fa-file-excel

### 4.2 Pantalla Tratamientos

#### Vista general
- Header con título "Tratamientos" y botón "+ Agregar Tratamiento".
- Tabla HTML con columnas: ID, Nombre, Precio, Duración (min), Categoría, Acciones (Editar/Eliminar).
- Botón "Editar" → abre modal con formulario precargado.
- Botón "Eliminar" → confirmación "¿Eliminar [nombre]?", al confirmar `DELETE /api/tratamientos/:id`.
- Click en fila o botón "Ver detalles" → expande panel inferior con secciones.

#### Panel de detalles (sección expandida debajo de la tabla)
- Título: "Detalles de [Nombre Tratamiento]".

##### Subsección "Materiales Asociados"
- Tabla: Material, Cantidad, Acciones (+, -, Eliminar).
- Botón "+" envía `PUT /api/materiales-por-tratamiento/:id` con cantidad incrementada.
- Botón "-" envía PUT con cantidad decrementada (mínimo 1).
- Botón "Eliminar" envía `DELETE /api/materiales-por-tratamiento/:id` con confirmación.
- Botón "+ Agregar Material" → modal con dropdown de materiales disponibles + campo cantidad. POST a `/api/materiales-por-tratamiento`.

##### Subsección "Empleados Fijos Asignados"
- Lista de empleados con nombre y especialidad, cada uno con botón "Eliminar".
- Botón "+ Agregar Empleado" → modal con dropdown de empleados (solo empleados con `esFijo = true` y que no estén ya asignados). POST a `/api/empleados-fijos-por-tratamiento`.

#### Modal "Agregar/Editar Tratamiento"
- Campos: Nombre, Precio, Duración (min, múltiplo de 15), Descripción (textarea), ID Categoría (dropdown con lista de categorías cargada de BD).
- Si es edición, campos precargados.
- Botón "Guardar" → POST (crear) o PUT (editar) según corresponda.

### 4.3 Pantalla Paquetes

#### Vista general
- Tabla de paquetes con columnas: ID, Nombre, Precio, Duración Total, Descuento (%), Acciones (Editar/Eliminar).
- Botón "+ Agregar Paquete".

#### Modal "Agregar/Editar Paquete"
- Campos: Nombre, Precio, Duración Total (solo lectura o calculable), Descuento.
- Sección "Tratamientos incluidos":
  - Lista de tratamientos con nombre y precio, cada uno con botón "Quitar" (icono X rojo).
  - Botón "+ Agregar Tratamiento" → modal con dropdown de tratamientos (excluyendo los ya agregados). POST a `/api/contenido-paquete`.
- Si edición, cargar tratamientos existentes desde `GET /api/paquetes/:id/tratamientos`.

### 4.4 Pantalla Empleados

#### Tabla general
- Columnas: ID, Nombre, DNI, Especialidad, Teléfono, Distrito, Áreas, Horas/Sem, ¿Fijo?, Acciones.
- Botones "+ Agregar", "Editar", "Eliminar" (con confirmación).

#### Modal "Agregar/Editar Empleado"
- Todos los campos del modelo:
  - Nombre (requerido, min 3 caracteres).
  - DNI (11 dígitos, input con pattern).
  - Especialidad.
  - Horas Trabajo (4–40, si es suplente máx 20).
  - Dirección.
  - Teléfono.
  - ID Distrito (dropdown cargado de BD).
  - ¿Es Fijo? (toggle/switch).
- Si se edita, campos precargados.

### 4.5 Pantalla Clientes

#### Tabla general
- Columnas: ID, Nombre, CI, Teléfono, Email, Acciones.
- Botones "+ Agregar", "Editar", "Eliminar".

#### Modal "Agregar/Editar Cliente"
- Campos: Nombre, CI (11 dígitos), Teléfono, Email.
- Validación frontend: email con formato válido, CI solo dígitos.

### 4.6 Pantalla Materiales

#### Lista de materiales
- Tabla: ID, Nombre, Stock, Acciones (+, -, Eliminar).
- Botones "+" y "-" al lado del stock para ajustar (±1, con confirmación si stock queda negativo).
- Botón "Eliminar" con confirmación.
- Botón "+ Agregar Material".

#### Modal "Agregar Material"
- Campos: Nombre, Cantidad Inicial (number, min 0).

### 4.7 Pantalla Distritos

#### Lista de distritos
- Tabla: ID, Nombre, Empleados (cantidad), Acciones (Editar, Eliminar, Ver).
- Botón "+ Agregar Distrito".

#### Al hacer clic en un distrito ("Ver")
- Panel expandido: "Empleados en [Nombre Distrito]" — lista alfabética con nombre, DNI, especialidad.
- Botón "Cerrar".

#### Modal "Agregar/Editar Distrito"
- Un solo campo: Nombre.

#### Al eliminar un distrito
- Modal de confirmación: "Al eliminar [Nombre Distrito], sus empleados deben ser reasignados. Selecciona un distrito destino:".
- Dropdown con otros distritos disponibles.
- Botón "Confirmar y Reasignar" → `DELETE /api/distritos/:id?migrarA=[idDistritoDestino]`.

### 4.8 Pantalla Áreas

#### Lista de áreas
- Tabla: ID, Nombre, Personal Fijo (cantidad), Acciones (Ver/Editar, Eliminar).
- Botón "+ Agregar Área".

#### Panel "Ver/Editar Área"
Al hacer clic en "Ver/Editar" de un área, se abre panel dividido en:

##### Subsección "Empleados Asignados"
- Lista de empleados (nombre, especialidad).
- Botón "Agregar Empleado" → modal con dropdown de empleados fijos no asignados aún.
- Cada empleado tiene botón "Quitar" con confirmación.

##### Subsección "Categorías"
- Lista de categorías del área, cada una con botón "Editar" y "Eliminar".
- Botón "+ Agregar Categoría".
- Al hacer clic en una categoría → se expande sub-lista de tratamientos que pertenecen a esa categoría.
- Cada tratamiento tiene opción "Cambiar Categoría" (dropdown con otras categorías).

##### Modal "Agregar/Editar Categoría"
- Campo: Nombre.
- Área preseleccionada (solo lectura).

##### Al eliminar una categoría
- Modal: "La categoría [nombre] tiene X tratamientos. ¿Qué deseas hacer?"
  - Opción 1: "Mover tratamientos a otra categoría" + dropdown.
  - Opción 2: "Eliminar también los tratamientos".

### 4.9 Pantalla Reportes (Admin)

#### Igual que perfil Dependiente
- Mismas 4 tarjetas de resumen con los mismos datos.

### 4.10 Pantalla Informe de Ingresos

#### Vista general
- Grid de tarjetas, una por cada mes con datos. Por defecto, últimos 12 meses.
- Cada tarjeta mensual:
  - Título: "Enero 2026".
  - Cant. Tratamientos: X.
  - Ingresos por Tratamientos: $X.XX.
  - Cant. Paquetes Vendidos: X.
  - Ingresos por Paquetes: $X.XX.
  - Ingresos Totales: $X.XX (negrita, resaltado).
- Botón "Descargar PDF" en la esquina superior derecha → alert("Simulación: descarga de PDF").

### 4.11 Pantalla Informe de Discrepancia

#### Selector de mes
- Dropdown "Seleccionar Mes" con formato "Enero 2026", "Febrero 2026", etc.
- Botón "Generar Informe".

#### Tabla jerárquica
Una vez seleccionado el mes, mostrar tabla:

| Código | Tratamiento | Planificados | Realizados | Diferencia | Materiales |
|--------|-------------|-------------|------------|------------|------------|
| TR001  | Masaje Relajante | 20 | 15 | -5 | ▸ Arcilla: Planif 10kg, Usado 8kg, Dif -2kg ▸ Aceite: Planif 5L, Usado 5L, Dif 0 |

- La columna "Materiales" es expandible (toggle) con tabla interna de: Material, Cantidad Planificada, Cantidad Utilizada, Diferencia.
- Color rojo si diferencia negativa, verde si positiva o cero.
- Botón "Descargar PDF" → alert("Simulación: descarga de PDF").

---

## 5. Datos desde Backend

### Endpoints requeridos (GET)

| Endpoint | Propósito |
|----------|-----------|
| `/api/areas` | Lista de áreas (para dropdowns) |
| `/api/categorias` | Lista de categorías (para dropdowns) |
| `/api/tratamientos` | Lista de tratamientos |
| `/api/tratamientos/:id` | Detalle de tratamiento |
| `/api/tratamientos/:id/materiales` | Materiales asociados a un tratamiento |
| `/api/tratamientos/:id/empleados-fijos` | Empleados fijos asignados a un tratamiento |
| `/api/paquetes` | Lista de paquetes |
| `/api/paquetes/:id/tratamientos` | Tratamientos dentro de un paquete |
| `/api/paquetes-vendidos` | Paquetes vendidos |
| `/api/empleados` | Lista de empleados |
| `/api/empleados?esFijo=true` | Solo empleados fijos |
| `/api/clientes` | Lista de clientes |
| `/api/clientes?q=texto` | Búsqueda de clientes (autocompletado) |
| `/api/materiales` | Lista de materiales |
| `/api/distritos` | Lista de distritos |
| `/api/distritos/:id/empleados` | Empleados de un distrito |
| `/api/citas` | Lista de citas |
| `/api/citas/fecha?fecha=YYYY-MM-DD` | Citas por fecha |
| `/api/citas/cliente/:idCliente` | Citas de un cliente |
| `/api/citas/empleado/:idEmpleado` | Citas de un empleado |
| `/api/citas/intervalo/fechas?fecha1=X&fecha2=Y` | Citas en rango de fechas |
| `/api/areas/:id/categorias` | Categorías de un área |
| `/api/areas/:id/empleados` | Empleados asignados a un área |

### Endpoints POST

| Endpoint | Datos |
|----------|-------|
| `/api/auth/login` | `{ username, contrasena }` |
| `/api/clientes` | `{ nombre, ci, telefono, email }` |
| `/api/citas` | `{ idcliente, idtratamiento, fecha, hora, idempleado, idpaquetevendido?, observaciones? }` |
| `/api/paquetes-vendidos` | `{ idpaquete, idcliente, fechacompra, fechainicio, fechafin }` |
| `/api/tratamientos` | `{ nombre, precio, duracion, descripcion?, idcategoria }` |
| `/api/paquetes` | `{ nombre, precio, duraciontotal, descuento }` |
| `/api/empleados` | `{ nombre, dni, especialidad, horastrabajo, direccion, telefono, iddistrito, esfijo }` |
| `/api/materiales` | `{ nombre, cantidad }` |
| `/api/distritos` | `{ nombre }` |
| `/api/areas` | `{ nombre, cantidadpersonalfijo }` |
| `/api/categorias` | `{ nombre, idarea }` |
| `/api/contenido-paquete` | `{ idpaquete, idtratamiento }` |
| `/api/empleados-por-area` | `{ idempleado, idarea }` |
| `/api/materiales-por-tratamiento` | `{ idtratamiento, idmaterial, cantidad }` |
| `/api/empleados-fijos-por-tratamiento` | `{ idempleado, idtratamiento }` |

### Endpoints PUT

| Endpoint | Datos |
|----------|-------|
| `/api/clientes/:id` | Campos a actualizar |
| `/api/citas/:id` | Campos a actualizar (estado, fecha, hora, etc.) |
| `/api/tratamientos/:id` | Campos a actualizar |
| `/api/paquetes/:id` | Campos a actualizar |
| `/api/empleados/:id` | Campos a actualizar |
| `/api/materiales/:id` | `{ cantidad }` o `{ nombre }` |
| `/api/distritos/:id` | `{ nombre }` |
| `/api/areas/:id` | `{ nombre, cantidadpersonalfijo }` |
| `/api/categorias/:id` | `{ nombre, idarea }` |
| `/api/materiales-por-tratamiento/:id` | `{ cantidad }` |

### Endpoints DELETE

| Endpoint | Notas |
|----------|-------|
| `/api/clientes/:id` | Eliminar cliente |
| `/api/citas/:id` | Eliminar cita |
| `/api/tratamientos/:id` | Eliminar tratamiento |
| `/api/paquetes/:id` | Eliminar paquete |
| `/api/empleados/:id` | Eliminar empleado |
| `/api/materiales/:id` | Eliminar material |
| `/api/distritos/:id?migrarA=[id]` | Eliminar distrito, migrar empleados |
| `/api/areas/:id` | Eliminar área |
| `/api/categorias/:id?migrarTratamientosA=[id]` | Eliminar categoría, migrar o no tratamientos |
| `/api/contenido-paquete/:idpaquete/:idtratamiento` | Quitar tratamiento de paquete |
| `/api/empleados-por-area/:idempleado/:idarea` | Desasignar empleado de área |
| `/api/materiales-por-tratamiento/:idtratamiento/:idmaterial` | Quitar material de tratamiento |
| `/api/empleados-fijos-por-tratamiento/:idempleado/:idtratamiento` | Desasignar empleado de tratamiento |
| `/api/materiales-por-cita/:idcita/:idmaterial` | Quitar material de cita |

---

## 6. Comportamiento General

### Modales
- Overlay semitransparente (rgba(0,0,0,0.4), z-index 1000).
- Modal centrado vertical/horizontal, ancho máximo 600px, border-radius 12px, padding 24px, animación de entrada (fadeIn + scale).
- Botón "Cerrar" (X) en esquina superior derecha.
- Click fuera del modal → cierra.
- Tecla Escape → cierra.

### Toasts
- Aparecen en esquina superior derecha, fondo verde (éxito) o rojo (error), padding 12px 20px, border-radius 8px, sombra.
- Auto-desvanecerse después de 3 segundos.

### Confirmaciones
- Modal pequeño con título, mensaje, botones "Cancelar" (gris) y "Confirmar" (rojo para eliminar, verde para acción).

### Tablas
- Encabezados con fondo #f8fafc, texto bold, borde inferior 2px #e8ecf1.
- Filas alternadas (zebra striping).
- Hover con fondo #f1f5f9.
- Responsive: en móvil, tabla se vuelve scroll horizontal o se convierte en cards.

### Estados vacíos
- Cuando no hay datos: icono grande + mensaje + botón de acción (ej: "No hay citas hoy. Agenda una nueva cita").

### Estados de carga
- Spinner animado (CSS puro, círculo giratorio) mientras se cargan datos.
- Esqueleto/placeholder para tarjetas mientras se renderiza.

---

## 7. Responsive Design

### Escritorio (>1024px)
- Menú lateral fijo de 260px.
- Grid de 3-4 columnas para tarjetas.
- Tablas completas.

### Tablet (768px–1024px)
- Menú colapsable (70px) con íconos.
- Grid de 2 columnas para tarjetas.
- Tablas con scroll horizontal si es necesario.

### Móvil (<768px)
- Menú oculto, overlay al tocar hamburguesa.
- Grid de 1 columna.
- Tablas convertidas a cards (cada fila es una card independiente).
- FAB más grande para fácil toque.

---

## 8. Flujo de autenticación

1. Usuario no autenticado ve solo pantalla de login.
2. Si hay sesión activa (verificar con `GET /api/auth/me` al cargar la página), redirigir automáticamente al dashboard correspondiente según rol.
3. Al hacer logout: `POST /api/auth/logout` → redirigir a login.
4. Si cualquier API responde 401, redirigir a login.
