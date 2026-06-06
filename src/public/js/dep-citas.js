/* dep-citas.js — Pantalla Citas (dependiente): listado, modal, edición, estado */
// Screen: Citas
let citasFilterFechaDesde='',citasFilterFechaHasta='',citasFilterPrecioMin='',citasFilterPrecioMax='';
SCREENS.citas=async()=>{
  const ct=$('pageContent');
  ct.innerHTML=showLoading();
  try{
    // Build the API call with backend filtering
    let url='/api/citas';
    if(citasFilterEstado!=='todas'||citasFilterFechaDesde||citasFilterFechaHasta||citasFilterPrecioMin||citasFilterPrecioMax){
      const params=[];
      if(citasFilterEstado!=='todas')params.push('estado='+encodeURIComponent(citasFilterEstado));
      if(citasFilterPrecioMin||citasFilterPrecioMax)params.push('precioMin='+(citasFilterPrecioMin||'0')+'&precioMax='+(citasFilterPrecioMax||'999999'));
      if(citasFilterFechaDesde&&citasFilterFechaHasta)params.push('fecha1='+encodeURIComponent(citasFilterFechaDesde)+'&fecha2='+encodeURIComponent(citasFilterFechaHasta));
      else if(citasFilterFechaDesde)params.push('fecha='+encodeURIComponent(citasFilterFechaDesde));
      else if(citasFilterFechaHasta)params.push('fecha='+encodeURIComponent(citasFilterFechaHasta));
      // Try to use the most specific endpoint
      if(citasFilterEstado!=='todas'&&!citasFilterFechaDesde&&!citasFilterFechaHasta&&!citasFilterPrecioMin&&!citasFilterPrecioMax)
        url='/api/citas/estado?estado='+encodeURIComponent(citasFilterEstado);
      else if(citasFilterFechaDesde&&citasFilterFechaHasta&&!citasFilterPrecioMin&&!citasFilterPrecioMax&&citasFilterEstado==='todas')
        url='/api/citas/intervalo/fechas?fecha1='+encodeURIComponent(citasFilterFechaDesde)+'&fecha2='+encodeURIComponent(citasFilterFechaHasta);
      else if(citasFilterPrecioMin||citasFilterPrecioMax){
        // Use all data and filter client-side for combined filters
        url='/api/citas';
      }
    }
    const d=await api.get(url);
    if(!d.success){ct.innerHTML=showEmpty('fa-regular fa-calendar-xmark','Sin datos','No se pudieron cargar las citas.','Reintentar','navigate(\'citas\')');return;}
    let citas=d.data||[];
    // Additional client-side filtering for combined filters
    if(citasFilterEstado!=='todas'&&url==='/api/citas')citas=citas.filter(c=>c.estado===citasFilterEstado);
    if(citasFilterFechaDesde)citas=citas.filter(c=>!c.fecha||c.fecha>=citasFilterFechaDesde);
    if(citasFilterFechaHasta)citas=citas.filter(c=>!c.fecha||c.fecha<=citasFilterFechaHasta);
    if(citasFilterPrecioMin)citas=citas.filter(c=>Number(c.precio||0)>=Number(citasFilterPrecioMin));
    if(citasFilterPrecioMax)citas=citas.filter(c=>Number(c.precio||0)<=Number(citasFilterPrecioMax));
    citas.sort((a,b)=>new Date(a.fecha||0)-new Date(b.fecha||0));
    const filtrosActivos=citasFilterEstado!=='todas'||citasFilterFechaDesde||citasFilterFechaHasta||citasFilterPrecioMin||citasFilterPrecioMax;
    ct.innerHTML='<div class="fade-in relative"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5"><div class="flex items-center gap-2"><h3 class="text-lg font-semibold text-[#2c3e50]">Citas</h3><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+citas.length+'</span></div><div class="flex items-center gap-2"><div class="flex bg-[#f1f5f9] rounded-xl p-1"><button class="btn-filtro px-3 py-1.5 text-xs font-medium rounded-lg transition-all '+(citasFilterEstado==='todas'?'bg-white text-[#2c3e50] shadow-sm':'text-[#6b7280] hover:text-[#2c3e50]')+'" onclick="citasFilterEstado=\'todas\';SCREENS.citas()">Todas</button><button class="btn-filtro px-3 py-1.5 text-xs font-medium rounded-lg transition-all '+(citasFilterEstado==='pendiente'?'bg-white text-[#2c3e50] shadow-sm':'text-[#6b7280] hover:text-[#2c3e50]')+'" onclick="citasFilterEstado=\'pendiente\';SCREENS.citas()">Pendientes</button><button class="btn-filtro px-3 py-1.5 text-xs font-medium rounded-lg transition-all '+(citasFilterEstado==='realizada'?'bg-white text-[#2c3e50] shadow-sm':'text-[#6b7280] hover:text-[#2c3e50]')+'" onclick="citasFilterEstado=\'realizada\';SCREENS.citas()">Realizadas</button><button class="btn-filtro px-3 py-1.5 text-xs font-medium rounded-lg transition-all '+(citasFilterEstado==='cancelada'?'bg-white text-[#2c3e50] shadow-sm':'text-[#6b7280] hover:text-[#2c3e50]')+'" onclick="citasFilterEstado=\'cancelada\';SCREENS.citas()">Canceladas</button></div></div></div><div class="flex flex-wrap items-center gap-2 mb-4 p-3 bg-[#f8fafc] rounded-xl border border-[#e8ecf1]"><i class="fa-solid fa-filter text-xs text-[#6b7280]"></i><input type="date" id="filtroFechaDesde" value="'+citasFilterFechaDesde+'" class="px-2.5 py-1.5 border border-[#d1d5db] rounded-lg text-xs w-36" onchange="citasFilterFechaDesde=this.value;SCREENS.citas()"><span class="text-xs text-[#6b7280]">a</span><input type="date" id="filtroFechaHasta" value="'+citasFilterFechaHasta+'" class="px-2.5 py-1.5 border border-[#d1d5db] rounded-lg text-xs w-36" onchange="citasFilterFechaHasta=this.value;SCREENS.citas()"><input type="number" id="filtroPrecioMin" placeholder="Precio min" value="'+citasFilterPrecioMin+'" class="px-2.5 py-1.5 border border-[#d1d5db] rounded-lg text-xs w-24" onchange="citasFilterPrecioMin=this.value;SCREENS.citas()"><span class="text-xs text-[#6b7280]">-</span><input type="number" id="filtroPrecioMax" placeholder="Precio max" value="'+citasFilterPrecioMax+'" class="px-2.5 py-1.5 border border-[#d1d5db] rounded-lg text-xs w-24" onchange="citasFilterPrecioMax=this.value;SCREENS.citas()">'+(filtrosActivos?'<button onclick="citasFilterFechaDesde=\'\';citasFilterFechaHasta=\'\';citasFilterPrecioMin=\'\';citasFilterPrecioMax=\'\';citasFilterEstado=\'todas\';SCREENS.citas()" class="px-3 py-1.5 bg-gray-200 text-[#6b7280] text-xs font-medium rounded-lg hover:bg-gray-300">Limpiar</button>':'')+'</div><div class="flex justify-end mb-4"><button onclick="citaModal()" class="px-4 py-2 bg-menta text-white text-sm font-medium rounded-xl hover:bg-menta-600 shadow-sm flex items-center gap-1.5"><i class="fa-solid fa-plus"></i> Agendar Cita</button></div><button onclick="citaModal()" class="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-menta to-menta-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center text-xl sm:hidden"><i class="fa-solid fa-plus"></i></button>';
    if(citas.length){
      ct.querySelector('.fade-in').insertAdjacentHTML('beforeend',renderTable([{label:'Fecha',render:c=>formatDateShort(c.fecha)},{label:'Hora',render:c=>formatTime(c.hora)},{label:'Cliente',render:c=>c.clientenombre||'-'},{label:'Teléfono',render:c=>c.telefonocliente||'-'},{label:'Tratamiento',render:c=>c.tratamientonombre||'-'},{label:'Precio',render:c=>$$(c.precio)},{label:'Estado',render:c=>'<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full border '+sc(c.estado)+' cursor-pointer" onclick="cambioEstadoCita('+c.idcita+',\''+c.estado+'\')">'+cap(c.estado)+'</span>'},{label:'',render:c=>'<div class="flex gap-1.5 justify-end">'+(c.estado==='pendiente'?'<button onclick="realizarCita('+c.idcita+')" class="px-2 py-1 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg flex items-center gap-1"><i class="fa-solid fa-check"></i> Realizar</button><button onclick="cancelarCita('+c.idcita+')" class="px-2 py-1 text-xs font-semibold text-white bg-red-400 hover:bg-red-500 rounded-lg flex items-center gap-1"><i class="fa-solid fa-xmark"></i> Cancelar</button>':'')+'<button onclick="verCita('+c.idcita+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg transition-all" title="Ver"><i class="fa-regular fa-eye"></i></button><button onclick="editarCita('+c.idcita+')" class="p-1.5 text-[#6b7280] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button></div>'}],citas));
    }else{
      ct.querySelector('.fade-in').insertAdjacentHTML('beforeend',showEmpty((citasFilterEstado==='todas'?'fa-regular fa-calendar-check':'fa-regular fa-filter'),(citasFilterEstado==='todas'?'No hay citas registradas':'No hay citas '+citasFilterEstado),'Agenda la primera cita para comenzar.','Agendar Cita','citaModal()'));
    }
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error.','Reintentar','navigate(\'citas\')')}
};
async function verCita(id){
  try{
    const d=await api.get('/api/citas/'+id);
    if(!d.success)return toast(d.error||'Error',false);
    const c=d.data;
    openModal('<div class="p-6" style="max-width: 520px"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]"><i class="fa-regular fa-circle-info text-menta mr-2"></i>Detalle de Cita</h3><span class="px-2.5 py-0.5 text-xs font-semibold rounded-full border '+sc(c.estado)+'">'+cap(c.estado)+'</span></div><div class="space-y-3 text-sm"><div class="flex justify-between py-2 border-b border-[#e8ecf1]"><span class="text-[#6b7280]">Cliente</span><span class="font-medium text-[#2c3e50]">'+c.clientenombre+'</span></div><div class="flex justify-between py-2 border-b border-[#e8ecf1]"><span class="text-[#6b7280]">Teléfono</span><span class="font-medium text-[#2c3e50]">'+c.telefonocliente+'</span></div><div class="flex justify-between py-2 border-b border-[#e8ecf1]"><span class="text-[#6b7280]">Tratamiento</span><span class="font-medium text-[#2c3e50]">'+c.tratamientonombre+'</span></div><div class="flex justify-between py-2 border-b border-[#e8ecf1]"><span class="text-[#6b7280]">Precio</span><span class="font-medium text-[#2c3e50]">'+$$(c.precio)+'</span></div><div class="flex justify-between py-2 border-b border-[#e8ecf1]"><span class="text-[#6b7280]">Fecha</span><span class="font-medium text-[#2c3e50]">'+formatDate(c.fecha)+'</span></div><div class="flex justify-between py-2 border-b border-[#e8ecf1]"><span class="text-[#6b7280]">Hora</span><span class="font-medium text-[#2c3e50]">'+formatTime(c.hora)+'</span></div>'+(c.empleadonombre?'<div class="flex justify-between py-2 border-b border-[#e8ecf1]"><span class="text-[#6b7280]">Empleado</span><span class="font-medium text-[#2c3e50]">'+c.empleadonombre+'</span></div>':'')+(c.observaciones?'<div class="flex justify-between py-2 border-b border-[#e8ecf1]"><span class="text-[#6b7280]">Observaciones</span><span class="font-medium text-[#2c3e50]">'+c.observaciones+'</span></div>':'')+'</div><div class="flex gap-2 mt-6 justify-end"><button onclick="closeModal()" class="px-5 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cerrar</button>'+(c.estado==='pendiente'?'<button onclick=\"closeModal();cancelarCita('+id+')\" class=\"px-5 py-2.5 bg-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-200\"><i class=\"fa-solid fa-xmark mr-1.5\"></i>Cancelar</button><button onclick=\"closeModal();realizarCita('+id+')\" class=\"px-5 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm hover:bg-menta-600\"><i class=\"fa-solid fa-check mr-1.5\"></i>Realizar</button>':'<button onclick=\"closeModal();editarCita('+id+')\" class=\"px-5 py-2.5 bg-amber-100 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-200\"><i class=\"fa-regular fa-pen-to-square mr-1.5\"></i>Editar</button>')+'</div></div>');
  }catch(e){toast('Error al cargar detalle',false)}
}
async function cambioEstadoCita(id,estadoActual){
  const estados=['pendiente','realizada','cancelada'];let idx=estados.indexOf(estadoActual);if(idx<0)idx=0;
  const nuevos=estados.filter(e=>e!==estadoActual);
  openModal('<div class="p-6" style="max-width: 380px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-4"><i class="fa-regular fa-pen-to-square text-menta mr-2"></i>Cambiar Estado</h3><p class="text-sm text-[#6b7280] mb-4">Selecciona el nuevo estado para la cita:</p><div class="space-y-2">'+nuevos.map(s=>'<button onclick="aplicarCambioEstado('+id+',\''+s+'\')" class="w-full text-left px-4 py-3 rounded-xl border border-[#e8ecf1] hover:border-menta-200 hover:bg-menta-50 transition-all flex items-center gap-3"><div class="w-3 h-3 rounded-full" style="background:'+sb(s)+'"></div><span class="font-medium text-sm text-[#2c3e50]">'+cap(s)+'</span></button>').join('')+'</div><button onclick="closeModal()" class="mt-4 w-full px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button></div>');
}
async function aplicarCambioEstado(id,estado){
  try{
    const d=await api.put('/api/citas/'+id,{estado});
    if(!d.success)return toast(d.error||'Error al actualizar',false);
    toast('Estado actualizado a '+cap(estado));closeModal();SCREENS.citas();
  }catch(e){toast(e.message||'Error de conexión',false)}
}
function eliminarCita(id){toast('Las citas no se pueden eliminar. Puedes cancelarlas o marcarlas como realizadas.',false);}
async function citaModal(editData) {
  editId = editData?.idcita || null;
  try {
    const t = await api.get('/api/tratamientos');
    if (!t.success) {
      toast('Error al cargar tratamientos', false);
      return;
    }
    
    const loadEmps = async (tratId) => {
      var sel = $('citaEmpleado');
      if (!tratId) {
        if (sel) sel.innerHTML = '<option value="">Selecciona un tratamiento primero</option>';
        return;
      }
      try {
        const e = await api.get('/api/tratamientos/' + tratId + '/empleados-fijos');
        if (e.success && e.data) {
          sel.innerHTML = '';
          if (!e.data.length) {
            sel.innerHTML = '<option value="">No hay empleados fijos para este tratamiento</option>';
            return;
          }
          e.data.forEach(function(en) {
            var opt = document.createElement('option');
            opt.value = en.idempleado;
            if (editData && editData.idempleado == en.idempleado) opt.selected = true;
            opt.textContent = en.nombre;
            sel.appendChild(opt);
          });
        } else {
          sel.innerHTML = '<option value="">Error al cargar empleados</option>';
        }
      } catch (e2) {
        var sel2 = $('citaEmpleado');
        if (sel2) sel2.innerHTML = '<option value="">Error</option>';
      }
    };
    
    // Construir opciones del tratamiento con data-precio
    var tratOpts = '';
    t.data.forEach(function(tr) {
      tratOpts += '<option value="' + tr.idtratamiento + '" data-precio="' + tr.precio + '"' + 
        (editData && editData.idtratamiento == tr.idtratamiento ? ' selected' : '') + '>' + 
        tr.nombre + '</option>';
    });
    
    var obsVal = editData ? editData.observaciones || '' : '';
    
    // Calcular precio inicial
    let precioInicial = 0;
    if (editData && editData.precio) {
      precioInicial = editData.precio;
    } else if (t.data && t.data.length > 0) {
      precioInicial = t.data[0].precio;
    }
    
    var body = '<div class="p-6" style="max-width:520px">' +
      '<h3 class="text-lg font-semibold text-[#2c3e50] mb-5">' +
      '<i class="fa-regular fa-calendar-plus text-menta mr-2"></i>' + (editData ? 'Editar Cita' : 'Agendar Cita') + '</h3>';
    
    body += '<div class="space-y-3.5">';
    
    // Cliente
    body += '<div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Cliente *</label>' +
      '<div class="relative">' +
      '<input type="text" id="citaClienteInput" autocomplete="off" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm" placeholder="Nombre del cliente" value="' + (editData ? editData.clientenombre || '' : '') + '">' +
      '<input type="hidden" id="citaClienteId" value="' + (editData ? editData.idcliente || '' : '') + '">' +
      '<div id="clienteAutocomplete" class="absolute z-50 w-full bg-white border border-[#e8ecf1] rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto hidden"></div>' +
      '</div></div>';
    
    // Tratamiento
    body += '<div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Tratamiento *</label>' +
      '<select id="citaTratamiento" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm" onchange="actualizarPrecioMostrado()">' + 
      tratOpts + '</select></div>';
    
    // Precio (SOLO LECTURA)
    body += '<div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Precio</label>' +
      '<div class="w-full px-4 py-2.5 bg-gray-100 border border-[#e8ecf1] rounded-xl text-sm text-[#6b7280] flex items-center gap-2">' +
      '<i class="fa-solid fa-dollar-sign text-menta text-xs"></i>' +
      '<span id="precioMostrado">' + $$(precioInicial) + '</span>' +
      '<span class="ml-auto text-xs text-[#9ca3af]"><i class="fa-solid fa-lock mr-1"></i>El precio lo asigna el sistema</span>' +
      '</div></div>';
    
    // Fecha
    body += '<div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Fecha *</label>' +
      '<input type="date" id="citaFecha" value="' + (editData ? editData.fecha || '' : todayStr()) + '" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"></div>';
    
    // Hora
    body += '<div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Hora *</label>' +
      '<input type="time" id="citaHora" value="' + (editData ? editData.hora || '' : '09:00') + '" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"></div>';
    
    // Empleado
    body += '<div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Empleado *</label>' +
      '<select id="citaEmpleado" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"><option value="">Cargando...</option></select></div>';
    
    // Observaciones
    body += '<div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Observaciones</label>' +
      '<textarea id="citaObservaciones" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm">' + obsVal + '</textarea></div>';
    
    body += '</div><div class="flex gap-2 mt-6">' +
      '<button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button>' +
      '<button onclick="guardarCita()" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm hover:bg-menta-600">' + 
      (editData ? 'Guardar Cambios' : 'Agendar') + '</button></div></div>';
    
    openModal(body, function() {
      var inp = $('citaClienteInput');
      if (inp) inp.addEventListener('input', debounce(autocompleteClientes, 300));
      
      var selTrat = $('citaTratamiento');
      if (selTrat && selTrat.value) loadEmps(selTrat.value);
       actualizarPrecioMostrado();
      selTrat.addEventListener('change', function() {
        if (this.value) loadEmps(this.value);
        actualizarPrecioMostrado(); // Asegurar que se actualice
      });
    });
    
  } catch (e) {
    toast(e.message || 'Error al cargar formulario', false);
  }
}
function autoFillPrecio(){
  const sel=$('citaTratamiento');
  if(!sel)return;
  const opt=sel.options[sel.selectedIndex];
  const precioInput=$('citaPrecio');
  // Always fill price from treatment when field is empty OR when changed
  if(opt&&opt.dataset.precio&&precioInput&&(!precioInput.value||precioInput.value==='0')){
    precioInput.value=opt.dataset.precio;
  }
}
async function editarCita(id){
  try{
    const d=await api.get('/api/citas/'+id);
    if(!d.success)return toast(d.error||'Error al cargar cita',false);
    citaModal(d.data);
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function autocompleteClientes(){
  const q=$('citaClienteInput')?.value;if(!q||q.length<2){$('clienteAutocomplete').classList.add('hidden');return;}
  try{
    const d=await api.get('/api/clientes?q='+encodeURIComponent(q));
    if(!d.success)return;
    const ac=$('clienteAutocomplete');
    let html='<div class="p-2 space-y-1">';
    if(d.data.length){
      html+=d.data.map(c=>'<div class="px-3 py-2 hover:bg-menta-50 rounded-lg cursor-pointer text-sm text-[#2c3e50] flex items-center justify-between" onclick="seleccionarCliente('+c.idcliente+',\''+c.nombre.replace(/'/g,"\\'")+'\')"><span>'+c.nombre+'</span><span class="text-xs text-[#6b7280]">'+c.telefono+'</span></div>').join('');
    }else{
      html+='<div class="px-3 py-2 text-sm text-[#9ca3af]">Sin resultados</div>';
    }
    html+='<div class="border-t border-[#e8ecf1] mt-1 pt-1"><div class="px-3 py-2 hover:bg-menta-50 rounded-lg cursor-pointer text-sm text-menta font-medium flex items-center gap-2" onclick="crearClienteRapido(\'cita\')"><i class="fa-solid fa-plus"></i> Agregar nuevo cliente</div></div></div>';
    ac.innerHTML=html;ac.classList.remove('hidden');
  }catch(e){}
}
function seleccionarCliente(id,nombre){$('citaClienteId').value=id;$('citaClienteInput').value=nombre;$('clienteAutocomplete').classList.add('hidden');}
async function guardarCita() {
  const idcliente = $('citaClienteId').value;
  const idtratamiento = $('citaTratamiento').value;
  const fecha = $('citaFecha').value;
  const hora = $('citaHora').value;
  const idempleado = $('citaEmpleado').value;
  const observaciones = $('citaObservaciones')?.value || '';
  const estado = editId ? ($('citaEstado')?.value || null) : null;
  
  // Obtener el precio del tratamiento seleccionado
  const selTrat = $('citaTratamiento');
  const precio = selTrat ? selTrat.options[selTrat.selectedIndex]?.dataset?.precio : null;
  
  if (!idcliente) return toast('Selecciona un cliente', false);
  if (!idtratamiento) return toast('Selecciona un tratamiento', false);
  if (!fecha) return toast('Selecciona una fecha', false);
  if (!hora) return toast('Selecciona una hora', false);
  if (!idempleado) return toast('Selecciona un empleado', false);
  
  // ✅ Incluir precio en el objeto data
  const data = {
    idcliente: Number(idcliente),
    idtratamiento: Number(idtratamiento),
    fecha,
    hora,
    idempleado: Number(idempleado),
    observaciones,
    precio: Number(precio) || 0  // ← AGREGAR PRECIO
  };
  if (estado) data.estado = estado;
  
  try {
    const d = editId ? await api.put('/api/citas/' + editId, data) : await api.post('/api/citas', data);
    if (!d.success) {
      toast(d.error || 'Error al guardar', false);
      return;
    }
    toast(editId ? 'Cita actualizada' : 'Cita agendada exitosamente');
    closeModal();
    SCREENS.citas();
  } catch (e) {
    toast(e.message || 'Error de conexión', false);
  }
}
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)};}

