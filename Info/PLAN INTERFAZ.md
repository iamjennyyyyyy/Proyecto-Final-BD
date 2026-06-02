# Especificación de Interfaz Web — SPA Belleza y Relajación

> Documento maestro de especificación funcional, visual y de implementación frontend para una aplicación web de spa enfocada en belleza, relajación, bienestar y experiencia premium.
> El objetivo es que una IA pueda construir una interfaz completa en HTML, CSS y JS, usando Tailwind CSS como sistema principal de estilos, con componentes modernos, elegantes, limpios, responsivos y visualmente sofisticados.

---

## 0. Dirección visual general

### Objetivo estético
La interfaz debe transmitir:
- Relajación.
- Limpieza visual.
- Sensación premium.
- Bienestar, calma y delicadeza.
- Belleza moderna con acabado profesional.

La UI debe sentirse como una experiencia de spa contemporáneo, no como un panel administrativo frío. Aunque tenga funcionalidades de gestión, el diseño debe conservar una identidad suave, elegante y armoniosa.

### Estilo general
- Usar una estética moderna basada en tarjetas elevadas, bordes suaves, sombras difusas y fondos con gradientes sutiles.
- Priorizar espacios amplios, respiración visual y jerarquía clara.
- Mantener consistencia total en espaciado, radios, botones, inputs, badges y modales.
- Evitar bloques densos, bordes duros o estilos demasiado industriales.
- Toda la interfaz debe verse refinada, equilibrada y agradable a la vista.

### Paleta recomendada
La aplicación debe usar una paleta inspirada en spa y belleza:

- Verde menta: `#2ecc71`
- Verde profundo: `#27ae60`
- Morado suave: `#9b59b6`
- Lavanda clara: `#ede7f6`
- Turquesa suave: `#8ed1c6`
- Rosa blush: `#f7d6e0`
- Fondo general claro: `#f5f7fa`
- Blanco cálido: `#ffffff`
- Texto principal: `#2c3e50`
- Texto secundario: `#6b7280`
- Bordes suaves: `#e8ecf1`

La UI puede combinar verde menta y lavanda como colores dominantes, con acentos rosa pastel y turquesa para dar una sensación fresca, elegante y femenina sin exageración.

### Tipografía
- Fuente principal: `Poppins`.
- Uso sugerido:
  - Títulos: 600–700.
  - Subtítulos: 500–600.
  - Texto normal: 400.
- Debe sentirse moderna, redondeada y limpia.
- No usar tipografías pesadas ni demasiado corporativas.

### Forma y profundidad
- Bordes redondeados generosos: `rounded-xl`, `rounded-2xl`, `rounded-3xl`.
- Sombras suaves y elegantes: `shadow-sm`, `shadow-md`, `shadow-lg` con opacidad baja.
- Los elementos deben tener una sensación flotante y ligera.
- Se deben usar transiciones suaves en hover, focus y apertura de modales.

### Decoración visual
La interfaz debe incluir detalles decorativos sutiles, por ejemplo:
- Degradados suaves en fondos de tarjetas destacadas.
- Formas orgánicas difuminadas en esquinas o fondos.
- Líneas finas, brillos y overlays translúcidos tipo glassmorphism ligero.
- Íconos decorativos relacionados con spa, hojas, gotas de agua, flores, velas, piedras calientes, aroma, calma y bienestar.
- Fondos con patrones muy sutiles o manchas difusas de color pastel.
- Separadores visuales delicados, no agresivos.

### Inspiración visual
La interfaz debe inspirarse en:
- Spas de lujo modernos.
- Centros de bienestar minimalistas.
- Hoteles boutique.
- Salones de belleza premium.
- Paneles elegantes tipo dashboard de bienestar.

---

## 0.1. Uso de Tailwind CSS

### Reglas de implementación
La IA debe construir toda la interfaz usando Tailwind CSS como base de estilos principal.

Debe priorizar:
- Clases utilitarias.
- Componentes reutilizables.
- Diseño responsivo con `sm`, `md`, `lg`, `xl`, `2xl`.
- Estados visuales con `hover`, `focus`, `active`, `disabled`.
- Transiciones con `transition`, `duration-200`, `duration-300`, `ease-in-out`.

### Principios de maquetación con Tailwind
- Usar `flex`, `grid`, `gap`, `space-y`, `space-x`, `justify-between`, `items-center`.
- Preferir `max-w-*`, `w-full`, `min-h-screen`, `overflow-hidden`, `overflow-auto`.
- Crear layouts limpios con sidebar + header + main.
- Aplicar backgrounds con gradientes suaves usando `bg-gradient-to-r`, `bg-gradient-to-br`, `from-*`, `via-*`, `to-*`.
- Usar `backdrop-blur`, `bg-white/80`, `border-white/40` cuando se necesite un efecto premium.

### Componentes visuales recomendados
La IA debe usar componentes modernos como:
- Cards elevadas con sombra suave.
- Botones con estados claros y buen contraste.
- Inputs con iconos internos.
- Badges redondeados.
- Modales centrados con backdrop blur.
- Toasts flotantes discretos.
- Skeleton loaders.
- Tabs o pills suaves para navegar secciones.
- Gráficos o indicadores visuales cuando aplique.

### Microinteracciones
- Hover con elevación ligera.
- Cambios de color suaves.
- Animaciones de entrada en tarjetas y modales.
- Estados focus claramente visibles.
- Pequeñas transiciones para menús colapsables, dropdowns y alertas.

---

## 0.2. Componentes decorativos sugeridos

La interfaz debe enriquecerse con elementos decorativos modernos, sin recargarla:

### Fondos decorativos
- Degradados suaves en secciones superiores.
- Figuras difusas tipo blur en morado, menta y rosa pastel.
- Ondas suaves o blobs abstractos detrás de hero cards.
- Texturas visuales ligeras inspiradas en agua, vapor, pétalos o luz natural.

### Tarjetas premium
- Header superior con pequeña ilustración o icono decorativo.
- Barra lateral delgada de color acento en algunas cards.
- Efecto glassmorphism leve en tarjetas destacadas.
- Icono circular con fondo degradado.
- Etiquetas pequeñas con estilo elegante para estados y categorías.

### Detalles de ambiente spa
- Iconos de hoja, flor, gota, vela, aroma, piedra, toalla, masaje o brillo.
- Pequeños separadores con líneas suaves y puntos decorativos.
- Chips pastel para tratamientos, paquetes y categorías.
- Fondos con sombras suaves y gradientes sutiles.

### Estados vacíos
Cuando no existan datos, no mostrar un vacío genérico. Debe aparecer:
- Un icono bonito y coherente con el spa.
- Texto amable y elegante.
- Botón de acción con estilo premium.
- Fondo suave con elementos decorativos tenues.

### Carga y feedback
- Skeleton loaders con formas redondeadas.
- Spinners discretos y elegantes.
- Toasts suaves, no invasivos.
- Confirmaciones visuales limpias.

---

## 0.3. Reglas de UX visual

- Todo debe ser claro, intuitivo y visualmente relajante.
- La interfaz no debe parecer una aplicación médica o bancaria.
- Debe equilibrar funcionalidad administrativa con estética de spa.
- Los elementos importantes deben destacarse sin agresividad.
- El usuario debe sentir orden, calma y lujo.

### Buenas prácticas obligatorias
- Mantener alineación consistente.
- No saturar las pantallas con demasiados colores diferentes.
- No usar sombras duras.
- No usar bordes negros o grises pesados.
- No usar fondos completamente planos y vacíos en secciones principales.
- No usar tipografías o iconografía que rompan la atmósfera de bienestar.

---

## 0.4. Patrones visuales por tipo de pantalla

### Pantallas de login
- Deben sentirse como una bienvenida de spa premium.
- Fondo con gradiente o imagen difuminada suave.
- Card central tipo vidrio o blanco limpio.
- Logo elegante, breve frase de bienvenida y detalle visual decorativo.

### Dashboards
- Tarjetas resumen con color acento y mini iconos.
- Bloques visuales bien separados.
- Indicadores numéricos grandes y claros.
- Uso de iconografía amable y moderna.

### Formularios
- Inputs amplios, con bordes suaves.
- Labels claros.
- Ayudas visuales sutiles.
- Validación visual elegante.
- Botones grandes, redondeados y bien espaciados.

### Tablas
- No deben verse pesadas.
- Encabezados claros.
- Filas limpias, alternadas y con hover suave.
- En móvil, transformarse en cards o bloques apilados.

---

## 1. Pantalla de Login

### Layout
- Fondo con imagen decorativa de SPA difuminada o gradiente suave en tonos verdes y morados (`#2ecc71 → #9b59b6`).
- Debe incluir una capa decorativa sutil con blur, círculos orgánicos difuminados o manchas pastel.
- Tarjeta centrada vertical y horizontalmente, ancho máximo 420px, sombra suave, bordes redondeados 20px.
- Logo del SPA en la parte superior de la tarjeta, con placeholder elegante “Belleza & Relax”.
- Debajo del logo, incluir una frase breve de bienvenida como “Tu espacio de calma, cuidado y bienestar”.
- Añadir pequeños elementos decorativos, como una línea degradada, una flor minimalista o un icono de hoja.

### Elementos del formulario
- Campo “Usuario” con icono de persona a la izquierda.
- Campo “Contraseña” con icono de candado.
- Botón “Iniciar Sesión” verde menta, texto blanco, hover más oscuro y leve elevación.
- Mensaje de error en rojo suave debajo del botón si las credenciales son inválidas.
- Opción visual de mostrar/ocultar contraseña con icono moderno.

### Comportamiento
- Al hacer clic en “Iniciar Sesión”:
  1. Enviar POST a `/api/auth/login` con `{ username, contrasena }`.
  2. Si el backend responde con el rol (`dependiente` o `administrador`), redirigir a la pantalla correspondiente.
  3. Si hay error, mostrar “Credenciales inválidas” sin recargar la página.
  4. Guardar sesión en servidor; el frontend solo verifica existencia de usuario logueado vía `req.session.usuario`.
- El login debe tener animación de entrada suave de la tarjeta y fade-in del fondo.

---

## 2. Layout General (post-login)

### Estructura base
- Toda la app debe dividirse en:
  - Sidebar lateral.
  - Header superior.
  - Contenido principal.
- La estructura debe sentirse moderna, limpia y bien proporcionada.
- El contenido principal debe ocupar el espacio restante con padding generoso.

### Menú lateral
- Ancho 260px en escritorio, fondo blanco, sombra derecha suave.
- En estado colapsado, ancho 70px.
- Logo/ícono del sistema en la parte superior, seguido del nombre “SPA Belleza”.
- Ítems del menú en filas con icono + texto, padding 12px 20px, border-radius 14px.
- Hover con fondo gris muy claro o lavanda suave.
- Ítem activo: fondo verde menta con texto blanco, icono destacado.
- Botón hamburguesa en la esquina superior izquierda para colapsar.
- Al colapsar, solo se muestran iconos y se mantiene la navegación clara.
- En móvil, el menú se oculta inicialmente y se abre como overlay con backdrop semitransparente y animación de slide.

### Header superior
- Barra delgada de 56px pegada arriba del contenido principal.
- A la izquierda: breadcrumb o título de la página actual.
- A la derecha: nombre del usuario logueado + inicial en un círculo elegante.
- Incluir opcionalmente botón de notificaciones, avatar y separadores sutiles.
- Fondo blanco con borde inferior suave y ligera transparencia si se desea efecto premium.

### Contenido principal
- Margen izquierdo igual al ancho del menú.
- Padding 24px a 32px.
- Scroll vertical.
- Fondo general `#f5f7fa`.
- Altura mínima 100vh.
- Se pueden añadir secciones con cards, tabs, banners o hero panels según la pantalla.

### Tipografía y colores
- Fuente: Poppins.
- Fondo general: `#f5f7fa`.
- Tarjetas: blanco, border-radius 20px, box-shadow suave, padding 20px o 24px.
- Acento primario: `#2ecc71`.
- Acento secundario: `#9b59b6`.
- Texto principal: `#2c3e50`.
- Texto secundario: `#6b7280`.
- Bordes: `#e8ecf1`.

---

## 3. Perfil Dependiente

### 3.1 Menú lateral
1. Inicio — Icono: `fa-home`.
2. Citas — Icono: `fa-calendar-check`.
3. Paquetes — Icono: `fa-box`.
4. Tratamientos — Icono: `fa-spa`.
5. Reportes — Icono: `fa-chart-bar`.
6. Mapa y Contactos — Icono: `fa-map-marker-alt`.

El menú debe conservar una estética suave, con iconos redondeados y estados activos visibles pero elegantes.

### 3.2 Pantalla Inicio

#### Tarjeta de bienvenida
- Fondo con gradiente suave verde menta a verde oscuro (`#2ecc71 → #27ae60`), texto blanco.
- Agregar una capa decorativa con blur, pétalos o líneas suaves.
- Mensaje: “Bienvenido/a, [nombre del dependiente]”.
- Subtítulo: “Hoy es [fecha actual formateada]”.
- Acompañar con un icono de spa, flor o brillo.

#### Resumen rápido
- Grid de 2 columnas con tarjetas:
  1. Citas de hoy: número grande, etiqueta y icono de calendario.
  2. Ventas del día: monto en formato moneda, etiqueta e icono financiero elegante.
- Las tarjetas deben incluir una mini barra de color, un icono circular o un detalle visual suave.
- Los datos se cargan vía:
  - `GET /api/citas/fecha?fecha=YYYY-MM-DD` para contar citas de hoy.
  - `GET /api/citas/fecha?fecha=YYYY-MM-DD&estado=realizada` para sumar precios.

#### Bloque adicional decorativo
- Incluir una sección breve tipo “Ambiente del día” con una frase motivadora o un indicador de estado del spa.
- Este bloque debe ser visualmente cálido, no solo funcional.

### 3.3 Pantalla Citas

#### Vista general
- Header con título “Citas” y contador visible.
- Mostrar un filtro superior por estado y fecha con estilo pills.
- Lista de citas en tarjetas responsivas.
- Cada tarjeta debe mostrar:
  - Nombre del cliente.
  - Tratamiento.
  - Fecha y hora.
  - Estado con badge de color suave.
  - Botón “Ver detalle”.

#### Diseño de cada tarjeta
- Fondo blanco.
- Una franja lateral de color según estado.
- Ícono pequeño de calendario o reloj.
- Microanimación al hover: leve elevación y sombra más definida.
- Estado pendiente: amarillo suave.
- Estado realizada: verde menta.
- Estado cancelada: rojo suave.

#### Botón flotante
- FAB en esquina inferior derecha: “+ Agendar cita”.
- Debe ser redondeado, llamativo pero elegante, con sombra y hover.
- En móvil debe ser más grande y fácil de tocar.

#### Modal “Agendar Cita”
- Título: “Agendar Nueva Cita”.
- Campo Cliente: input con autocompletado. Al escribir, se dispara `GET /api/clientes?q=[texto]` y muestra sugerencias en dropdown.
- Si no hay coincidencias, aparece botón “+ Nuevo Cliente”.
- Campo Fecha: date picker, mínimo hoy.
- Campo Hora: time picker.
- Selector Tratamiento: dropdown con `GET /api/tratamientos`.
- Al seleccionar tratamiento, se muestra el precio y duración en una tarjeta compacta.
- Campo Empleado: dropdown con `GET /api/empleados`.
- Botón “Guardar Cita”.
- Validaciones:
  - Cliente requerido.
  - Fecha no puede ser domingo ni pasada.
  - Hora entre 09:00 y 18:00.
  - Tratamiento requerido.
- El modal debe incluir una cabecera visual, íconos ligeros y espaciado cómodo.

#### Modal “Ver Detalle de Cita”
- Título: `Cita #ID — [Nombre Cliente]`.
- Información completa: cliente, tratamiento, empleado, fecha, hora, precio, estado, observaciones, paquete asociado si aplica.
- Si estado es pendiente:
  - Botones “Marcar como Realizada” y “Cancelar Cita”.
- Si estado es realizada o cancelada:
  - Solo lectura.
- Botón “Cerrar”.
- El modal debe verse limpio, jerarquizado y elegante.

### 3.4 Pantalla Paquetes

#### Galería de paquetes
- Grid responsivo:
  - 3-4 columnas en escritorio.
  - 2 en tablet.
  - 1 en móvil.
- Cada tarjeta de paquete debe incluir:
  - Imagen placeholder decorativa con gradiente o icono spa.
  - Nombre del paquete.
  - Precio destacado.
  - Duración total.
  - Lista de tratamientos en chips pequeños.
  - Botón “Vender Paquete”.

#### Estilo de las tarjetas
- Tarjetas más visuales que las de tablas.
- Añadir un header con degradado suave.
- Incluir pequeños elementos decorativos tipo brillos, hojas o líneas curvas.
- Hover con elevación ligera y transición.

#### Modal “Vender Paquete”
- Título: “Vender Paquete: [Nombre Paquete]”.
- Paquete preseleccionado, solo lectura.
- Campo Cliente con autocompletado.
- Precio total mostrado claramente.
- Botón “Registrar Venta”.
- Toast de éxito: “Paquete vendido correctamente a [Cliente]”.
- El modal debe mantener un tono refinado, simple y visualmente agradable.

### 3.5 Pantalla Tratamientos

#### Galería de tratamientos
- Mismo grid que paquetes.
- Cada tarjeta debe incluir:
  - Imagen placeholder de tono morado suave.
  - Nombre del tratamiento.
  - Precio y duración.
  - Descripción corta.
  - Materiales listados como tags.
  - Categoría y área como badges.
  - Botón “Agendar Cita”.

#### Estilo visual
- Cada tarjeta debe tener una identidad propia, pero consistente.
- Usar un pequeño icono del tipo de tratamiento.
- El fondo de la tarjeta puede llevar un degradado tenue o una textura muy ligera.
- Los tags deben verse redondeados, modernos y suaves.

### 3.6 Pantalla Reportes

#### Tarjetas de resumen
- Grid de 4 tarjetas:
  1. Citas hoy.
  2. Ventas de la semana.
  3. Clientes nuevos este mes.
  4. Citas canceladas hoy.
- Cada tarjeta debe incluir icono, número grande, subtítulo y color de acento.
- Datos via:
  - `GET /api/citas/fecha?fecha=YYYY-MM-DD`.
  - `GET /api/citas/intervalo/fechas?fecha1=YYYY-MM-DD&fecha2=YYYY-MM-DD`.
  - `GET /api/clientes` + filtro por fecha de creación.

### 3.7 Pantalla Mapa y Contactos

#### Layout de 2 columnas
- Columna izquierda: mapa o simulación visual de mapa.
- Columna derecha: tarjeta con contactos.

#### Diseño visual
- El mapa debe verse como una tarjeta grande con borde suave, sombra, marcador y fondo agradable.
- La tarjeta de contactos debe incluir iconos pequeños para dirección, teléfono, email, horario y redes.
- Añadir un bloque decorativo de “Visítanos” con estilo premium.
- Redes sociales: Instagram, Facebook, WhatsApp, como iconos visuales sin enlaces reales.

---

## 4. Perfil Administrador

### 4.1 Menú lateral
1. Tratamientos — `fa-spa`.
2. Paquetes — `fa-box`.
3. Empleados — `fa-user-tie`.
4. Clientes — `fa-users`.
5. Materiales — `fa-oil-can`.
6. Distritos — `fa-map-pin`.
7. Áreas — `fa-building`.
8. Reportes — `fa-chart-bar`.
9. Informe de Ingresos — `fa-file-invoice-dollar`.
10. Informe de Discrepancia — `fa-file-excel`.

El administrador debe conservar la misma estética elegante, pero con mayor densidad de información sin perder orden visual.

### 4.2 Pantalla Tratamientos

#### Vista general
- Header con título y botón “+ Agregar Tratamiento”.
- Tabla HTML moderna con columnas: ID, Nombre, Precio, Duración, Categoría, Acciones.
- La tabla debe verse limpia, con encabezado destacado, filas alternadas y hover suave.
- Al pasar el mouse sobre una fila, debe resaltarse con suavidad.

#### Panel de detalles
- Al seleccionar una fila, mostrar un panel expandido debajo de la tabla.
- Título: “Detalles de [Nombre Tratamiento]”.

##### Subsección Materiales Asociados
- Tabla interna con material, cantidad y acciones.
- Botones pequeños para sumar/restar.
- Botón “+ Agregar Material”.
- El panel debe tener separadores suaves y badges para cantidades.

##### Subsección Empleados Fijos Asignados
- Lista de empleados con nombre y especialidad.
- Botón “+ Agregar Empleado”.
- Mostrar chips o mini tarjetas para cada empleado.

#### Modal “Agregar/Editar Tratamiento”
- Campos: Nombre, Precio, Duración, Descripción, ID Categoría.
- Diseño de formulario en grid de 2 columnas cuando sea posible.
- Botón “Guardar”.
- En edición, mostrar valor precargado y un pequeño título contextual.

### 4.3 Pantalla Paquetes

#### Vista general
- Tabla de paquetes con columnas: ID, Nombre, Precio, Duración Total, Descuento, Acciones.
- Botón “+ Agregar Paquete”.

#### Modal “Agregar/Editar Paquete”
- Campos: Nombre, Precio, Duración Total, Descuento.
- Sección “Tratamientos incluidos”.
- Lista visual de tratamientos con chips y botón “Quitar”.
- Botón “+ Agregar Tratamiento”.
- Si edición, cargar tratamientos existentes.
- Debe verse como un editor de composición elegante y claro.

### 4.4 Pantalla Empleados

#### Tabla general
- Columnas: ID, Nombre, DNI, Especialidad, Teléfono, Distrito, Áreas, Horas/Sem, ¿Fijo?, Acciones.
- Los datos deben presentarse en una tabla moderna y fácil de leer.
- Incluir chips de estado y badges para “Fijo” o “Suplente”.

#### Modal “Agregar/Editar Empleado”
- Campos:
  - Nombre.
  - DNI.
  - Especialidad.
  - Horas de trabajo.
  - Dirección.
  - Teléfono.
  - ID Distrito.
  - ¿Es fijo? (switch visual moderno).
- El formulario debe usar distribución visual clara.
- Añadir ayuda contextual pequeña bajo algunos campos.

### 4.5 Pantalla Clientes

#### Tabla general
- Columnas: ID, Nombre, CI, Teléfono, Email, Acciones.
- Botones “+ Agregar”, “Editar”, “Eliminar”.
- Debe conservar estilo claro, ordenado y sin saturación.

#### Modal “
