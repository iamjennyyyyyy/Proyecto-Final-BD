/* SPA Belleza & Relax */
try{dayjs.locale('es')}catch(e){} // CDN fallback
const $=id=>document.getElementById(id);
const qq=sel=>document.querySelectorAll(sel);
let user=null,token=null,sidebarCollapsed=false,currentPage='';
let editId=null,expandedTratamiento=null,expandedDistrito=null,expandedArea=null,citasFilterEstado='todas';
const $$=n=>'$'+Number(n||0).toFixed(2);
function cap(s){return s?s[0].toUpperCase()+s.slice(1):''}
function todayStr(){return dayjs().format('YYYY-MM-DD')}
function today(){return dayjs().format('DD [de] MMMM [de] YYYY')}
function formatDate(d){return d?dayjs(d).format('DD [de] MMMM [de] YYYY'):'-'}
function formatDateShort(d){return d?dayjs(d).format('DD/MM/YYYY'):'-'}
function formatTime(t){return t?t.slice(0,5):'-'}
function togglePassword(){const pwd=$('loginPassword'),ico=$('passIcon');if(!pwd||!ico)return;const isPassword=pwd.type==='password';pwd.type=isPassword?'text':'password';ico.className=isPassword?'fa-regular fa-eye-slash':'fa-regular fa-eye'}
const EST={pendiente:'bg-amber-100 text-amber-700 border-amber-200',realizada:'bg-mentaverde-100 text-mentaverde-700 border-mentaverde-200',cancelada:'bg-red-100 text-red-600 border-red-200'};
function sc(e){return EST[e]||'bg-gray-100 text-gray-600'}
function sb(e){return{pendiente:'#f59e0b',realizada:'#34d399',cancelada:'#ef4444'}[e]||'#9ca3af'}
function toast(msg,ok=true){
  const c=$('toastContainer');if(!c)return;
  const t=document.createElement('div');
  t.className='toast-enter pointer-events-auto flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium '+(ok?'bg-white text-[#2c3e50] border-mentaverde-200':'bg-white text-red-600 border-red-200');
  t.innerHTML=(ok?'<i class="fa-solid fa-circle-check text-menta"></i>':'<i class="fa-solid fa-circle-exclamation text-red-500"></i>')+msg;
  c.appendChild(t);setTimeout(()=>{t.className=t.className.replace('toast-enter','toast-exit');setTimeout(()=>t.remove(),300)},3000);
}
function openModal(html,cb){
  const mc=$('modalContainer'),mb=$('modalBody');
  mc.classList.remove('hidden');mc.style.display='flex';document.body.style.overflow='hidden';
  mb.innerHTML=html;modalCallback=cb;if(cb)setTimeout(cb,50);
}
function closeModal(e){if(e&&e.target!==$('modalContainer'))return;$('modalContainer').classList.add('hidden');$('modalContainer').style.display='none';document.body.style.overflow=''}
let modalCallback=null;
function openConfirm(title,msg,cb,danger=true){
  const cc=$('confirmContainer'),cbEl=$('confirmBody');
  cc.classList.remove('hidden');cc.style.display='flex';
  cbEl.innerHTML='<div class="text-center"><div class="w-14 h-14 mx-auto mb-4 rounded-full '+(danger?'bg-red-100':'bg-menta-100')+' flex items-center justify-center"><i class="fa-solid '+(danger?'fa-triangle-exclamation text-red-500':'fa-circle-check text-menta')+' text-xl"></i></div><h3 class="text-lg font-semibold text-[#2c3e50] mb-2">'+title+'</h3><p class="text-sm text-[#6b7280] mb-6">'+msg+'</p><div class="flex gap-3 justify-center"><button onclick="closeConfirm()" class="px-5 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button id="confirmOkBtn" class="px-5 py-2.5 '+(danger?'bg-red-500 hover:bg-red-600':'bg-menta hover:bg-menta-600')+' text-white rounded-xl text-sm font-medium shadow-sm">Confirmar</button></div></div>';
  confirmCallback=cb;$('confirmOkBtn').onclick=()=>{closeConfirm();if(confirmCallback)confirmCallback()};
}
function closeConfirm(e){if(e&&e.target!==$('confirmContainer'))return;$('confirmContainer').classList.add('hidden');$('confirmContainer').style.display='none'}
function showLoading(m='Cargando...'){return'<div class="space-y-4 p-4 fade-in"><div class="flex items-center justify-center py-8"><div class="w-10 h-10 border-3 border-[#e8ecf1] border-t-menta rounded-full spin mb-4"></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="bg-white rounded-2xl p-5 border border-[#e8ecf1]"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-16 mb-2"></div><div class="skeleton h-3 w-32"></div></div><div class="bg-white rounded-2xl p-5 border border-[#e8ecf1]"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-16 mb-2"></div><div class="skeleton h-3 w-32"></div></div><div class="bg-white rounded-2xl p-5 border border-[#e8ecf1]"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-16 mb-2"></div><div class="skeleton h-3 w-32"></div></div></div><div class="bg-white rounded-2xl p-5 border border-[#e8ecf1]"><div class="skeleton h-5 w-40 mb-4"></div><div class="space-y-3"><div class="skeleton h-12 w-full"></div><div class="skeleton h-12 w-full"></div><div class="skeleton h-12 w-full"></div></div></div></div>'}
function showEmpty(icon,title,desc,btnText,btnAction){return'<div class="flex flex-col items-center justify-center py-20 fade-in"><div class="w-20 h-20 rounded-full bg-lavender-100 flex items-center justify-center mb-5"><i class="'+icon+' text-spa text-3xl"></i></div><h3 class="text-lg font-semibold text-[#2c3e50] mb-1.5">'+title+'</h3><p class="text-sm text-[#6b7280] mb-6 max-w-xs text-center">'+desc+'</p>'+(btnText?'<button onclick="'+btnAction+'" class="px-6 py-2.5 bg-menta text-white rounded-xl text-sm font-medium hover:bg-menta-600 shadow-sm">'+btnText+'</button>':'')+'</div>'}
function renderTable(cols,rows,emptyMsg){
  if(!rows||!rows.length)return'<div class="text-center py-12 text-sm text-[#6b7280]"><i class="fa-regular fa-folder-open text-2xl text-[#d1d5db] mb-3 block"></i>'+(emptyMsg||'No hay datos')+'</div>';
  return'<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b-2 border-[#e8ecf1]">'+cols.map(c=>'<th class="text-left py-3 px-4 font-semibold text-[#6b7280] text-xs uppercase tracking-wider">'+c.label+'</th>').join('')+'</tr></thead><tbody class="divide-y divide-[#f1f5f9]">'+rows.map((r,i)=>'<tr class="hover:bg-[#f8fafc] transition-colors '+(i%2===0?'bg-white':'bg-[#fafbfc]')+'">'+cols.map(c=>'<td class="py-3 px-4 text-[#2c3e50]">'+(c.render?c.render(r):r[c.field]??'-')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}

// Auth
$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();const btn=$('loginBtn'),err=$('loginError'),fd=new FormData(e.target);
  btn.disabled=true;btn.innerHTML='<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin"></div>';err.classList.add('hidden');
  try{
    const j=await(await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:fd.get('username'),contrasena:fd.get('contrasena')})})).json();
    if(!j.success)throw new Error(j.error||'Credenciales inválidas');
    setSession(j.token,j.usuario);user=j.usuario;token=j.token;enterApp();
  }catch(e){err.querySelector('span').textContent=e.message;err.classList.remove('hidden');btn.disabled=false;btn.innerHTML='<span>Iniciar Sesión</span><i class="fa-solid fa-arrow-right text-xs"></i>'}
});
function logout(){clearSession();user=null;token=null;$('appLayout').classList.add('hidden');$('loginScreen').classList.remove('hidden');$('loginScreen').style.display='flex';}
async function checkAuth(){
  // Always show login first; hide it if valid session confirmed
  const ls=$('loginScreen');if(ls){ls.style.display='flex';ls.classList.remove('hidden');}
  token=getToken();user=getUser();
  if(token&&user){
    try{await api.get('/api/tratamientos?limit=1');enterApp();return true}
    catch(e){clearSession();}
  }
  return false;
}
if(location.search.includes('clear=1')&&clearSession)clearSession();
function enterApp(){$('loginScreen').classList.add('hidden');$('loginScreen').style.display='none';$('appLayout').classList.remove('hidden');const init=user.rol==='administrador'?'admin-tratamientos':'inicio';$('userAvatar').textContent=(user.username||'U')[0].toUpperCase();$('userName').textContent=user.username;renderSidebar();navigate(init);window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(h)navigate(h)});}

// Sidebar & Navigation
const MENU_DEP=[{id:'inicio',icon:'fa-house',label:'Inicio'},{id:'citas',icon:'fa-calendar-check',label:'Citas'},{id:'paquetes',icon:'fa-box',label:'Paquetes'},{id:'tratamientos',icon:'fa-spa',label:'Tratamientos'},{id:'reportes',icon:'fa-chart-bar',label:'Reportes'},{id:'mapa',icon:'fa-map-location-dot',label:'Mapa y Contactos'}];
const MENU_ADM=[{id:'admin-tratamientos',icon:'fa-spa',label:'Tratamientos'},{id:'admin-paquetes',icon:'fa-box',label:'Paquetes'},{id:'admin-empleados',icon:'fa-user-tie',label:'Empleados'},{id:'admin-clientes',icon:'fa-users',label:'Clientes'},{id:'admin-materiales',icon:'fa-oil-can',label:'Materiales'},{id:'admin-categorias',icon:'fa-tags',label:'Categorías'},{id:'admin-distritos',icon:'fa-map-pin',label:'Distritos'},{id:'admin-areas',icon:'fa-building',label:'Áreas'},{id:'admin-reportes',icon:'fa-chart-bar',label:'Reportes'},{id:'admin-informe-ingresos',icon:'fa-file-invoice-dollar',label:'Informe Ingresos'},{id:'admin-informe-discrepancia',icon:'fa-file-excel',label:'Informe Discrepancia'}];
const TITLES={inicio:'Inicio',citas:'Citas',paquetes:'Paquetes',tratamientos:'Tratamientos',reportes:'Reportes',mapa:'Mapa y Contactos','admin-tratamientos':'Tratamientos','admin-paquetes':'Paquetes','admin-empleados':'Empleados','admin-clientes':'Clientes','admin-materiales':'Materiales','admin-categorias':'Categorías','admin-distritos':'Distritos','admin-areas':'Áreas','admin-reportes':'Reportes','admin-informe-ingresos':'Informe de Ingresos','admin-informe-discrepancia':'Informe de Discrepancia'};
const SCREENS={};
function renderSidebar(){const nav=$('sidebarNav');if(!nav)return;const items=user?.rol==='administrador'?MENU_ADM:MENU_DEP;nav.innerHTML=items.map(i=>'<a href="#'+i.id+'" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all '+(currentPage===i.id?'bg-menta text-white font-medium shadow-sm':'text-[#6b7280] hover:bg-lavender-50 hover:text-[#2c3e50]')+'"><i class="fa-solid '+i.icon+' w-5 text-center text-base"></i><span class="sidebar-text">'+i.label+'</span></a>').join('');}
function toggleSidebar(){const sb=$('sidebar'),mc=$('mainContent');if(window.innerWidth<=768){sb.style.transform=sb.style.transform==='translateX(0%)'?'translateX(-100%)':'translateX(0%)';$('sidebarOverlay').classList.toggle('hidden')}else{sidebarCollapsed=!sidebarCollapsed;sb.style.width=sidebarCollapsed?'70px':'260px';mc.style.marginLeft=sidebarCollapsed?'70px':'260px';qq('.sidebar-text').forEach(el=>el.style.display=sidebarCollapsed?'none':'');$('sidebarBrand').style.display=sidebarCollapsed?'none':'';}}
function navigate(page){currentPage=page;renderSidebar();$('pageTitle').textContent=TITLES[page]||'Inicio';location.hash='#'+page;expandedTratamiento=null;expandedDistrito=null;expandedArea=null;const fn=SCREENS[page];if(fn)fn();else if(user?.rol==='administrador')SCREENS['admin-tratamientos']();else SCREENS.inicio();}
document.addEventListener('click',e=>{if(window.innerWidth>768)return;const sb=$('sidebar');if(!sb?.contains(e.target)){sb.style.transform='translateX(-100%)';$('sidebarOverlay')?.classList.add('hidden')}});
document.addEventListener('DOMContentLoaded',()=>checkAuth());

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
    citas.sort((a,b)=>new Date(b.fecha||0)-new Date(a.fecha||0));
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

// Dependiente: Tratamientos (read-only list)
SCREENS.tratamientos=async()=>{
  const ct=$('pageContent');ct.innerHTML=showLoading();
  try{
    const d=await api.get('/api/tratamientos');
    if(!d.success){ct.innerHTML=showEmpty('fa-regular fa-spa','Sin datos','No hay tratamientos disponibles.');return;}
    ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]">Tratamientos</h3><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+d.data.length+'</span></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">'+d.data.map(t=>'<div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5 hover:shadow-md transition-shadow"><div class="flex items-start gap-3"><div class="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-spa text-spa"></i></div><div class="min-w-0"><h4 class="font-semibold text-[#2c3e50] truncate">'+t.nombre+'</h4><p class="text-xs text-[#6b7280] mt-0.5 line-clamp-2">'+(t.descripcion||'Sin descripción')+'</p></div></div><div class="flex items-center justify-between mt-4 pt-3 border-t border-[#e8ecf1]"><span class="text-lg font-bold text-menta">'+$$(t.precio)+'</span><div class="text-right"><span class="text-xs text-[#6b7280]">'+t.duracion+' min</span>'+(t.categorianombre?'<br><span class="text-xs text-menta font-medium">'+t.categorianombre+'</span>':'')+'</div></div></div>').join('')+'</div></div>';
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error al cargar tratamientos.','Reintentar','navigate(\'tratamientos\')')}
};
function actualizarPrecioMostrado() {
  const sel = document.getElementById('citaTratamiento');
  if (!sel) {
    console.log('No se encontró el select citaTratamiento');
    return;
  }
  
  const selectedOption = sel.options[sel.selectedIndex];
  if (!selectedOption) {
    console.log('No hay opción seleccionada');
    return;
  }
  
  const precio = selectedOption.getAttribute('data-precio');
  console.log('Precio obtenido:', precio);
  
  const precioSpan = document.getElementById('precioMostrado');
  if (precioSpan && precio) {
    precioSpan.textContent = $$(Number(precio));
  } else if (precioSpan) {
    precioSpan.textContent = '$0.00';
  }
}
// Dependiente: Paquetes (read-only w/ detail)
SCREENS.paquetes=async()=>{
  const ct=$('pageContent');ct.innerHTML=showLoading();
  try{
    const d=await api.get('/api/paquetes');
    if(!d.success){ct.innerHTML=showEmpty('fa-regular fa-box','Sin datos','No hay paquetes disponibles.');return;}
    let content='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]">Paquetes</h3><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+d.data.length+'</span></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">'+d.data.map(p=>'<div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5 hover:shadow-md transition-shadow"><div class="flex items-start gap-3"><div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-gift text-amber-500"></i></div><div class="min-w-0"><h4 class="font-semibold text-[#2c3e50]">'+p.paquetenombre+'</h4></div></div><div class="flex items-center justify-between mt-4 pt-3 border-t border-[#e8ecf1]"><span class="text-lg font-bold text-menta">'+$$(p.precio)+'</span><div class="flex gap-2"><button onclick="venderPaquete('+p.idpaquete+',\''+p.paquetenombre.replace(/'/g,"\\'")+'\','+p.precio+')" class="px-3 py-1.5 bg-menta text-white text-xs font-medium rounded-xl hover:bg-menta-600 shadow-sm">Vender</button><button onclick="verPaqueteDetalle('+p.idpaquete+')" class="text-xs text-menta hover:text-menta-600 font-medium">Ver <i class="fa-solid fa-chevron-right ml-0.5 text-xs"></i></button></div></div></div>').join('')+'</div></div>';
    ct.innerHTML=content;
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error.','Reintentar','navigate(\'paquetes\')')}
};
async function verPaqueteDetalle(id){
  try{
    const d=await api.get('/api/paquetes/'+id);
    if(!d.success)return toast(d.error,false);
    const p=d.data;const trat=p.tratamientos||[];
    openModal('<div class="p-6" style="max-width: 480px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-4"><i class="fa-solid fa-gift text-amber-500 mr-2"></i>'+p.paquetenombre+'</h3>'+(trat.length?'<div class="mb-4"><p class="text-xs font-semibold text-[#6b7280] mb-2 uppercase tracking-wider">Tratamientos incluidos</p><div class="space-y-2">'+trat.map(t=>'<div class="flex items-center gap-3 px-3 py-2.5 bg-lavender-50 rounded-xl text-sm"><div class="w-2 h-2 rounded-full bg-menta"></div><span class="text-[#2c3e50]">'+t.nombre+'</span></div>').join('')+'</div></div>':'')+'<div class="flex items-center justify-between py-3 border-t border-[#e8ecf1]"><span class="text-sm text-[#6b7280]">Precio Total</span><span class="text-xl font-bold text-menta">'+$$(p.precio)+'</span></div><button onclick="closeModal()" class="mt-4 w-full px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm hover:bg-menta-600">Cerrar</button></div>');
  }catch(e){toast('Error al cargar detalle',false)}
}
async function venderPaquete(id,nombre,precio){
  try{
    const cl=await api.get('/api/clientes');
    if(!cl.success)return toast('Error al cargar clientes',false);
    openModal('<div class="p-6" style="max-width: 460px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-5"><i class="fa-solid fa-gift text-amber-500 mr-2"></i>Vender Paquete</h3><div class="bg-amber-50 rounded-xl px-4 py-3 mb-4 border border-amber-100"><p class="font-semibold text-[#2c3e50]">'+nombre+'</p><p class="text-lg font-bold text-menta mt-1">'+$$(precio)+'</p></div><div class="space-y-3.5"><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Cliente *</label><div class="relative"><input type="text" id="vtaClienteInput" autocomplete="off" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all" placeholder="Nombre del cliente"><input type="hidden" id="vtaClienteId"><div id="vtaClienteAutocomplete" class="absolute z-50 w-full bg-white border border-[#e8ecf1] rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto hidden"></div></div></div><input type="hidden" id="vtaPaqueteId" value="'+id+'"></div><div class="flex gap-2 mt-6"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="guardarVentaPaquete()" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm hover:bg-menta-600">Registrar Venta</button></div></div>',()=>{
      const inp=$('vtaClienteInput');
      if(inp)inp.addEventListener('input',debounce(function(){vtaAutocomplete()},300));
    });
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function vtaAutocomplete(){
  const q=$('vtaClienteInput')?.value;if(!q||q.length<2){$('vtaClienteAutocomplete')?.classList.add('hidden');return;}
  try{
    const d=await api.get('/api/clientes?q='+encodeURIComponent(q));
    if(!d.success)return;
    const filtrados=d.data||[];
    const ac=$('vtaClienteAutocomplete');if(!ac)return;
    let html='<div class="p-2 space-y-1">';
    if(filtrados.length){
      html+=filtrados.map(c=>'<div class="px-3 py-2 hover:bg-menta-50 rounded-lg cursor-pointer text-sm text-[#2c3e50] flex items-center justify-between" onclick="vtaSelCliente('+c.idcliente+',\''+c.nombre.replace(/'/g,"\\'")+'\')"><span>'+c.nombre+'</span><span class="text-xs text-[#6b7280]">'+(c.telefono||'')+'</span></div>').join('');
    }else{
      html+='<div class="px-3 py-2 text-sm text-[#9ca3af]">Sin resultados</div>';
    }
    html+='<div class="border-t border-[#e8ecf1] mt-1 pt-1"><div class="px-3 py-2 hover:bg-menta-50 rounded-lg cursor-pointer text-sm text-menta font-medium flex items-center gap-2" onclick="crearClienteRapido(\'vta\')"><i class="fa-solid fa-plus"></i> Agregar nuevo cliente</div></div></div>';
    ac.innerHTML=html;ac.classList.remove('hidden');
  }catch(e){}
}
function vtaSelCliente(id,nombre){$('vtaClienteId').value=id;$('vtaClienteInput').value=nombre;$('vtaClienteAutocomplete').classList.add('hidden');}
async function crearClienteRapido(origen){
  openSubModal('<div class="p-6" style="max-width:420px"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]"><i class="fa-solid fa-user-plus text-menta mr-2"></i>Nuevo Cliente</h3><button onclick="closeSubModal()" class="text-[#9ca3af] hover:text-[#6b7280] text-xl"><i class="fa-solid fa-xmark"></i></button></div><div class="space-y-3.5"><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Nombre *</label><input type="text" id="rapidClienteNombre" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"></div><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">CI *</label><input type="text" id="rapidClienteCi" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"></div><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Teléfono</label><input type="text" id="rapidClienteTelefono" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"></div><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Email</label><input type="email" id="rapidClienteEmail" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"></div></div><div class="flex gap-2 mt-6"><button onclick="closeSubModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="guardarClienteRapido(\''+origen+'\')" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm">Crear Cliente</button></div></div>');
}
async function guardarClienteRapido(origen){
  const nombre=$('rapidClienteNombre')?.value?.trim(),ci=$('rapidClienteCi')?.value?.trim(),telefono=$('rapidClienteTelefono')?.value?.trim(),email=$('rapidClienteEmail')?.value?.trim();
  if(!nombre)return toast('El nombre es requerido',false);
  if(!ci)return toast('La CI es requerida',false);
  try{
    const d=await api.post('/api/clientes',{nombre,ci,telefono:telefono||null,email:email||null});
    if(!d.success){toast(d.error||'Error al crear cliente',false);return;}
    toast('Cliente creado');closeSubModal();
    if(origen==='cita'){$('citaClienteId').value=d.data.idcliente;$('citaClienteInput').value=d.data.nombre;const ac=$('clienteAutocomplete');if(ac)ac.classList.add('hidden');}
    else if(origen==='vta'){$('vtaClienteId').value=d.data.idcliente;$('vtaClienteInput').value=d.data.nombre;const ac=$('vtaClienteAutocomplete');if(ac)ac.classList.add('hidden');}
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function guardarVentaPaquete(){
  const idcliente=$('vtaClienteId').value,idpaquete=$('vtaPaqueteId').value;
  if(!idcliente)return toast('Selecciona un cliente',false);
  const hoy=todayStr(),fin=dayjs().add(30,'day').format('YYYY-MM-DD');
  try{
    const pkg=await api.get('/api/paquetes/'+idpaquete);
    if(!pkg.success)return toast('Error al obtener paquete',false);
    const d=await api.post('/api/paquetes-vendidos',{idpaquete,idcliente,precio:pkg.data.precio,fechacompra:hoy,fechainicio:hoy,fechafin:fin});
    if(!d.success)return toast(d.error||'Error al registrar venta',false);
    toast('Paquete vendido correctamente');closeModal();SCREENS.paquetes();
  }catch(e){toast(e.message||'Error de conexión',false);}
}
// Reportes — dependiente y admin comparten el mismo render
async function _renderReporteScreen(ct){
  ct.innerHTML=showLoading('Generando reportes...');
  try{
    const hoy=todayStr();
    const[hoyRes,topRes]=await Promise.all([
      api.get('/api/citas/fecha?fecha='+hoy),
      api.get('/api/reportes/top-tratamientos')
    ]);
    const hoyCitas=hoyRes.success?hoyRes.data||[]:[];
    const realizadas=hoyCitas.filter(c=>c.estado==='realizada');
    const pendientes=hoyCitas.filter(c=>c.estado==='pendiente');
    const canceladas=hoyCitas.filter(c=>c.estado==='cancelada');
    const ventasHoy=realizadas.reduce((s,c)=>s+Number(c.precio||0),0);
    const inicioSem=dayjs().startOf('week').format('YYYY-MM-DD'),finSem=dayjs().endOf('week').format('YYYY-MM-DD');
    let semData={data:[]};
    try{semData=await api.get('/api/citas/intervalo/fechas?fecha1='+inicioSem+'&fecha2='+finSem)}catch(e){}
    const semReal=(semData.data||[]).filter(c=>c.estado==='realizada');
    const ventasSem=semReal.reduce((s,c)=>s+Number(c.precio||0),0);
    const topData=topRes.success?topRes.data||[]:[];
    const topColors=['bg-amber-100 text-amber-600','bg-gray-100 text-gray-500','bg-orange-50 text-orange-400'];
    const topHtml=topData.length?topData.map((t,i)=>'<div class="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e8ecf1]"><div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold '+topColors[i]+'">'+(i+1)+'</div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-[#2c3e50] truncate">'+(t.tratamientonombre||t.nombre||'-')+'</p><p class="text-xs text-[#6b7280]">'+(t.totalcitas||t.cantidad||0)+' citas</p></div><span class="text-sm font-semibold text-menta">'+$$(t.ingresos||t.total||0)+'</span></div>').join(''):'<p class="text-sm text-[#9ca3af] py-3 text-center">Sin datos disponibles</p>';
    ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]"><i class="fa-solid fa-chart-bar text-menta mr-2"></i>Reportes</h3></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5"><div class="flex items-center gap-3 mb-2"><div class="w-9 h-9 rounded-xl bg-lavender-100 flex items-center justify-center"><i class="fa-solid fa-calendar-check text-spa text-sm"></i></div><p class="text-xs text-[#6b7280]">Citas Hoy</p></div><p class="text-3xl font-bold text-[#2c3e50]">'+hoyCitas.length+'</p><p class="text-xs text-[#6b7280] mt-1">'+pendientes.length+' pendientes</p></div><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5"><div class="flex items-center gap-3 mb-2"><div class="w-9 h-9 rounded-xl bg-menta-50 flex items-center justify-center"><i class="fa-solid fa-coins text-menta text-sm"></i></div><p class="text-xs text-[#6b7280]">Ventas Hoy</p></div><p class="text-3xl font-bold text-menta">'+$$(ventasHoy)+'</p><p class="text-xs text-[#6b7280] mt-1">'+realizadas.length+' realizadas</p></div><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5"><div class="flex items-center gap-3 mb-2"><div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center"><i class="fa-solid fa-calendar-week text-amber-500 text-sm"></i></div><p class="text-xs text-[#6b7280]">Ventas Semana</p></div><p class="text-3xl font-bold text-[#2c3e50]">'+$$(ventasSem)+'</p><p class="text-xs text-[#6b7280] mt-1">'+semReal.length+' realizadas</p></div><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5"><div class="flex items-center gap-3 mb-2"><div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center"><i class="fa-solid fa-ban text-red-400 text-sm"></i></div><p class="text-xs text-[#6b7280]">Canceladas Hoy</p></div><p class="text-3xl font-bold text-red-400">'+canceladas.length+'</p><p class="text-xs text-[#6b7280] mt-1">citas canceladas</p></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-5"><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5"><h4 class="font-semibold text-[#2c3e50] mb-3 flex items-center gap-2"><i class="fa-solid fa-trophy text-amber-500 text-sm"></i>Top 3 Tratamientos</h4><div class="space-y-2">'+topHtml+'</div></div><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5"><h4 class="font-semibold text-[#2c3e50] mb-3 flex items-center gap-2"><i class="fa-solid fa-user-clock text-menta text-sm"></i>Historial de Cliente</h4><div class="space-y-2"><div class="relative"><input type="text" id="rptClienteInput" autocomplete="off" placeholder="Buscar cliente..." class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm" oninput="debounce(rptAutocomplete,300)()"><input type="hidden" id="rptClienteId"><div id="rptClienteAC" class="absolute z-50 w-full bg-white border border-[#e8ecf1] rounded-xl shadow-lg mt-1 max-h-40 overflow-y-auto hidden"></div></div><div class="flex gap-2"><input type="date" id="rptFechaDesde" class="flex-1 px-3 py-2 border border-[#d1d5db] rounded-xl text-sm"><input type="date" id="rptFechaHasta" class="flex-1 px-3 py-2 border border-[#d1d5db] rounded-xl text-sm"></div><div class="flex gap-2"><button onclick="rptEmpleadosPorCliente()" class="flex-1 px-3 py-2 bg-lavender-100 text-spa text-xs font-medium rounded-xl hover:bg-lavender-200">Ver empleados</button><button onclick="rptServiciosCliente()" class="flex-1 px-3 py-2 bg-menta-50 text-menta text-xs font-medium rounded-xl hover:bg-menta-100">Ver servicios por fechas</button></div><div id="rptClienteResultado" class="text-xs text-[#9ca3af] text-center py-2">Selecciona un cliente</div></div></div></div></div>';
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error al cargar reportes.','Reintentar','navigate(\'reportes\')')}
}
SCREENS.reportes=async()=>_renderReporteScreen($('pageContent'));
// Dependiente: Mapa y Contactos
SCREENS.mapa=async()=>{
  const ct=$('pageContent');
  ct.innerHTML=showLoading();
  try{
    const redesHtml=['instagram','facebook','whatsapp'].map(s=>'<div class="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center text-spa hover:bg-menta-50 hover:text-menta transition-all cursor-pointer"><i class="fa-brands fa-'+s+'"></i></div>').join('');
    let distritosHtml='';
    try{
      const d=await api.get('/api/distritos');
      if(d.success&&d.data&&d.data.length){
        distritosHtml=d.data.filter(di=>di.nombre).slice(0,4).map(di=>'<div class="flex items-center gap-2 px-3 py-2 bg-[#f8fafc] rounded-xl border border-[#e8ecf1]"><i class="fa-solid fa-circle text-[6px] text-menta"></i><span class="text-sm text-[#2c3e50]">'+di.nombre+'</span><span class="text-xs text-[#6b7280] ml-auto">'+(di.empleados||0)+' emp.</span></div>').join('');
      }
    }catch(e2){}
    ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]"><i class="fa-solid fa-map-location-dot text-menta mr-2"></i>Mapa y Contactos</h3></div><div class="grid grid-cols-1 lg:grid-cols-5 gap-5"><div class="lg:col-span-3 bg-white rounded-2xl border border-[#e8ecf1] shadow-sm overflow-hidden"><div class="bg-gradient-to-br from-menta-50 to-lavender-100 h-48 lg:h-64 flex items-center justify-center relative"><div class="absolute inset-0 opacity-10"><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><path fill="#2ecc71" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.2,88.6,-0.7C87.2,14.9,81.8,29.8,73.1,42.8C64.4,55.8,52.5,66.9,39,74.5C25.5,82.1,10.5,86.2,-3.8,83.5C-18.1,80.8,-31.6,71.3,-43.7,60.2C-55.9,49.1,-66.7,36.4,-73.1,21.5C-79.5,6.6,-81.5,-10.5,-76.1,-24.8C-70.8,-39.1,-58,-50.6,-44.1,-57.8C-30.2,-65.1,-15.1,-68.1,-0.2,-67.8C14.7,-67.5,30.6,-63.6,44.7,-76.4Z" transform="translate(100 100)" /></svg></div><div class="text-center relative z-10"><div class="w-16 h-16 mx-auto mb-3 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"><i class="fa-solid fa-location-dot text-red-400 text-xl"></i></div><p class="font-semibold text-[#2c3e50]">Av. Principal 123, Santiago</p><p class="text-sm text-[#6b7280]">SPA Belleza & Relax</p></div></div>'+(distritosHtml?'<div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">'+distritosHtml+'</div>':'')+'</div><div class="lg:col-span-2 space-y-4"><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5"><h4 class="font-semibold text-[#2c3e50] mb-4 flex items-center gap-2"><i class="fa-solid fa-address-card text-menta"></i>Contacto</h4><div class="space-y-3 text-sm"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-menta-50 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-location-dot text-menta text-xs"></i></div><div><p class="font-medium text-[#2c3e50]">Dirección</p><p class="text-[#6b7280] text-xs">Av. Principal 123, Santiago, Chile</p></div></div><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-menta-50 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-phone text-menta text-xs"></i></div><div><p class="font-medium text-[#2c3e50]">Teléfono</p><p class="text-[#6b7280] text-xs">+56 2 1234 5678</p></div></div><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-menta-50 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-envelope text-menta text-xs"></i></div><div><p class="font-medium text-[#2c3e50]">Email</p><p class="text-[#6b7280] text-xs">spa@bellezarelax.com</p></div></div><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-menta-50 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-clock text-menta text-xs"></i></div><div><p class="font-medium text-[#2c3e50]">Horario</p><p class="text-[#6b7280] text-xs">Lun – Sáb: 9:00 – 18:00</p></div></div></div></div><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5"><h4 class="font-semibold text-[#2c3e50] mb-4 flex items-center gap-2"><i class="fa-solid fa-hashtag text-menta"></i>Redes Sociales</h4><div class="flex gap-3">'+redesHtml+'</div></div></div></div></div>';
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error.','Reintentar','navigate(\'mapa\')')}
};
// CRUD Builder
const _crudConfigs={};
function crudScreen(opts){
  const{page,endpoint,entity,fields,titleField,customCols,customRender,onCreated}=opts;
  _crudConfigs[page]={endpoint,entity,fields,onCreated};
  SCREENS[page]=async()=>{
    const ct=$('pageContent');ct.innerHTML=showLoading();
    try{
      const d=await api.get(endpoint);
      if(!d.success){ct.innerHTML=showEmpty('fa-regular fa-database','Sin datos','No se pudieron cargar los datos.');return;}
      const data=d.data||[];
      const cols=customCols||[{label:entity,field:titleField,render:r=>r[titleField]||'-'},{label:'Acciones',render:r=>'<div class="flex gap-1.5 justify-end"><button onclick="editCRUD(\''+page+'\','+r[Object.keys(r).find(k=>k.toLowerCase().includes('id'))]+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg transition-all" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button onclick="deleteCRUD(\''+endpoint+'\','+r[Object.keys(r).find(k=>k.toLowerCase().includes('id'))]+',\''+page+'\')" class="p-1.5 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div>'}];
      ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]">'+entity+'</h3><div class="flex items-center gap-2"><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+data.length+'</span><button onclick="window[\'openModalCRUD_'+page+'\']()" class="px-3 py-1.5 bg-menta text-white text-xs font-medium rounded-xl hover:bg-menta-600 shadow-sm flex items-center gap-1"><i class="fa-solid fa-plus"></i> Agregar</button></div></div><div class="bg-white rounded-2xl shadow-sm border border-[#e8ecf1] overflow-hidden">'+(customRender?customRender(data):renderTable(cols,data))+'</div></div>';
    }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error al cargar.','Reintentar','navigate(\''+page+'\')')}
  };
  window['openModalCRUD_'+page]=()=>crudForm(page,endpoint,entity,fields,null,onCreated);
}
window['editCRUD']=async(p,id)=>{
  const cfg=_crudConfigs[p];if(!cfg)return toast('Configuración no encontrada',false);
  try{
    const d=await api.get(cfg.endpoint+'/'+id);
    if(!d.success)return toast(d.error||'Error',false);
    crudForm(p,cfg.endpoint,cfg.entity,cfg.fields,d.data,cfg.onCreated);
  }catch(e){toast('Error al cargar datos',false)}
};
async function crudForm(page,endpoint,entity,fields,editData,onCreated){
  editId=editData?editData[Object.keys(editData).find(k=>k.toLowerCase().includes('id'))]:null;
  let body='<div class="p-6" style="max-width: 480px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-5"><i class="fa-regular fa-'+(editData?'pen-to-square':'square-plus')+' text-menta mr-2"></i>'+(editData?'Editar ':'Nuevo ')+entity+'</h3><form id="crudForm" class="space-y-3.5" onsubmit="return false">';
  fields.forEach(f=>{
    const name=f.field||f.name,label=f.label||f.name,type=f.type||'text';
    // Safely get edit value; handle boolean fields
    let val='';
    if(editData){
      const raw=editData[name];
      if(raw!==undefined&&raw!==null) val=raw;
    }
    body+='<div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">'+label+(f.required?' *':'')+'</label>';
    if(type==='select'){
      body+='<select name="'+name+'" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all">'+(f.options?f.options.map(o=>'<option value="'+o.value+'"'+(editData&&String(editData[name])===String(o.value)?' selected':'')+'>'+o.label+'</option>').join(''):'')+'</select>';
    }else if(type==='checkbox'){
      // Proper boolean check: true, 1, 'true', 't' all mean checked
      const isChecked=val===true||val===1||val==='true'||val==='1'||val==='t';
      body+='<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="'+name+'"'+(isChecked?' checked':'')+' class="w-4 h-4 rounded border-[#d1d5db] text-menta focus:ring-menta/30"><span class="text-sm text-[#2c3e50]">Sí</span></label>';
    }else{
      body+='<input type="'+type+'" name="'+name+'" value="'+val+'" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all"'+(f.required?' required':'')+(f.placeholder?' placeholder="'+f.placeholder+'"':'')+'>';
    }
    body+='</div>';
  });
  body+='</form><div id="crudFormError" class="hidden mt-2 text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2 border border-red-100"></div><div class="flex gap-2 mt-6"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="saveCRUD(\''+endpoint+'\',\''+page+'\')" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm hover:bg-menta-600">'+(editData?'Guardar Cambios':'Crear '+entity)+'</button></div></div>';
  openModal(body,()=>{if(onCreated)setTimeout(onCreated,50);});
}
async function saveCRUD(endpoint,page,hasCallback){
  const form=$('crudForm');if(!form)return;
  const fd=new FormData(form);const data={};
  fd.forEach((v,k)=>{data[k]=v});
  // Handle checkboxes: convert to proper boolean, not '0'/'1'
  form.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
    data[cb.name]=cb.checked;
  });
  // Convert numeric-looking fields to numbers
  ['precio','duracion','cantidad','iddistrito','idcategoria','idarea','horastrabajo'].forEach(k=>{
    if(data[k]!==undefined&&data[k]!=='')data[k]=isNaN(Number(data[k]))?data[k]:Number(data[k]);
  });
  try{
    const d=editId?await api.put(endpoint+'/'+editId,data):await api.post(endpoint,data);
    if(!d.success){toast(d.error||'Error al guardar',false);return;} // Keep modal open on error
    toast(editId?'Actualizado':'Creado exitosamente');closeModal();navigate(page);
  }catch(e){toast(e.message||'Error de conexión',false);} // Keep modal open on error
}
window.deleteCRUD=async(endpoint,id,page)=>{
  openConfirm('Eliminar','¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.',async()=>{
    try{
      const d=await api.del(endpoint+'/'+id);
      if(!d.success){
        const msg=d.error||'';
        if(/foreign key|llave foranea|referenced|constraint|violat|asociad/i.test(msg)){
          toast('No se puede eliminar: este registro está siendo utilizado en otra parte del sistema. Elimina primero los registros relacionados.',false);
        }else{
          toast(msg||'Error al eliminar',false);
        }
        return;
      }
      toast('Eliminado correctamente');navigate(page);
    }catch(e){
      const msg=e.message||'';
      if(/foreign key|constraint|referenced|23503|23000/i.test(msg)){
        toast('No se puede eliminar: tiene registros asociados que deben eliminarse primero.',false);
      }else{
        toast(msg||'Error de conexión',false);
      }
    }
  });
};

// Admin: Tratamientos (w/ expandible panel for materiales/empleados)
let tratFilterCategoria='';
SCREENS['admin-tratamientos']=async()=>{
  const ct=$('pageContent');ct.innerHTML=showLoading();
  try{
    const[r,cat]=await Promise.all([api.get('/api/tratamientos'),api.get('/api/categorias')]);
    if(!r.success){ct.innerHTML=showEmpty('fa-regular fa-spa','Sin datos','No hay tratamientos registrados.','Agregar','crudTratamientoForm(null)');return;}
    const data=(r.data||[]).filter(t=>!tratFilterCategoria||t.idcategoria==tratFilterCategoria);
    const catData=cat.success?cat.data||[]:[];
    ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]">Tratamientos</h3><div class="flex items-center gap-2"><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+data.length+'</span><select id="tratFiltroCat" class="px-3 py-1.5 border border-[#d1d5db] rounded-lg text-xs" onchange="tratFilterCategoria=this.value;navigate(\'admin-tratamientos\')"><option value="">Todas las categorías</option>'+(catData.map(c=>'<option value="'+c.idcategoria+'"'+(tratFilterCategoria==c.idcategoria?' selected':'')+'>'+(c.categorianombre||c.nombre||'')+'</option>').join(''))+'</select><button onclick="crudTratamientoForm(null)" class="px-3 py-1.5 bg-menta text-white text-xs font-medium rounded-xl hover:bg-menta-600 shadow-sm flex items-center gap-1"><i class="fa-solid fa-plus"></i> Agregar</button></div></div><div class="space-y-3">'+data.map(t=>'<div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm overflow-hidden"><div class="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors" onclick="toggleTratamiento('+t.idtratamiento+')"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-lavender-100 flex items-center justify-center"><i class="fa-solid fa-spa text-spa text-sm"></i></div><div><h4 class="font-medium text-[#2c3e50]">'+t.nombre+'</h4><p class="text-xs text-[#6b7280]">'+$$(t.precio)+' | '+t.duracion+' min</p></div></div><div class="flex items-center gap-2"><div class="flex gap-1"><button onclick="event.stopPropagation();editTratamiento('+t.idtratamiento+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button onclick="event.stopPropagation();deleteCRUD(\'/api/tratamientos\','+t.idtratamiento+',\'admin-tratamientos\')" class="p-1.5 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div><i class="fa-solid fa-chevron-down text-[#9ca3af] transition-transform '+(expandedTratamiento===t.idtratamiento?'rotate-180':'')+'"></i></div></div><div id="tratPanel_'+t.idtratamiento+'" class="'+(expandedTratamiento===t.idtratamiento?'':'hidden')+' border-t border-[#e8ecf1] bg-[#f8fafc]"><div class="p-4" id="tratContent_'+t.idtratamiento+'">'+showLoading()+'</div></div></div>').join('')+'</div></div>';
    if(expandedTratamiento)loadTratamientoPanel(expandedTratamiento);
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error.','Reintentar','navigate(\'admin-tratamientos\')')}
};
async function loadTratamientoPanel(id){
  const ct=$('tratContent_'+id);if(!ct)return;
  try{
    const[m,emps]=await Promise.all([api.get('/api/tratamientos/'+id+'/materiales'),api.get('/api/tratamientos/'+id+'/empleados-fijos')]);
    let html='<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    html+='<div><div class="flex items-center justify-between mb-2"><h5 class="text-xs font-semibold text-[#6b7280] uppercase tracking-wider"><i class="fa-solid fa-oil-can text-menta mr-1"></i>Materiales</h5><button onclick="agregarMaterialTratamiento('+id+')" class="text-xs text-menta hover:text-menta-600 font-medium"><i class="fa-solid fa-plus"></i> Agregar</button></div>'+(m.success&&m.data.length?'<div class="space-y-1.5">'+m.data.map(mat=>'<div class="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-[#e8ecf1] text-sm"><span class="text-[#2c3e50]">'+mat.nombrematerial+'</span><span class="text-xs text-[#6b7280]">'+mat.cantidad+'</span></div>').join('')+'</div>':'<p class="text-xs text-[#9ca3af] py-2">Sin materiales asignados</p>')+'</div>';
    html+='<div><div class="flex items-center justify-between mb-2"><h5 class="text-xs font-semibold text-[#6b7280] uppercase tracking-wider"><i class="fa-solid fa-user-tie text-menta mr-1"></i>Empleados</h5><button onclick="agregarEmpleadoTratamiento('+id+')" class="text-xs text-menta hover:text-menta-600 font-medium"><i class="fa-solid fa-plus"></i> Agregar</button></div>'+(emps.success&&emps.data.length?'<div class="space-y-1.5">'+emps.data.map(e=>'<div class="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-[#e8ecf1] text-sm"><span class="text-[#2c3e50]">'+e.nombre+'</span></div>').join('')+'</div>':'<p class="text-xs text-[#9ca3af] py-2">Sin empleados asignados</p>')+'</div>';
    html+='</div>';ct.innerHTML=html;
  }catch(e){ct.innerHTML='<p class="text-xs text-red-400">Error al cargar panel</p>'}
}
function toggleTratamiento(id){
  const panel=$(('tratPanel_'+id));
  if(expandedTratamiento===id){expandedTratamiento=null;panel.classList.add('hidden');return;}
  if(expandedTratamiento){const old=$(('tratPanel_'+expandedTratamiento));if(old)old.classList.add('hidden')}
  expandedTratamiento=id;panel.classList.remove('hidden');loadTratamientoPanel(id);
}
async function editTratamiento(id){
  try{
    const d=await api.get('/api/tratamientos/'+id);
    if(!d.success)return toast(d.error,false);
    crudTratamientoForm(d.data);
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function crudTratamientoForm(editData){
  editId=editData?.idtratamiento||null;
  try{
    const[cat,area]=await Promise.all([api.get('/api/categorias'),api.get('/api/areas')]);
    let body='<div class="p-6" style="max-width: 480px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-5"><i class="fa-solid fa-spa text-menta mr-2"></i>'+(editData?'Editar':'Nuevo')+' Tratamiento</h3><form id="crudForm" class="space-y-3.5" onsubmit="return false"><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Nombre *</label><input type="text" name="nombre" value="'+(editData?.nombre||'')+'" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all" required></div><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Descripción</label><textarea name="descripcion" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all">'+(editData?.descripcion||'')+'</textarea></div><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Precio *</label><input type="number" step="0.01" name="precio" value="'+(editData?.precio||'')+'" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all" required></div><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Duración (min) *</label><input type="number" name="duracion" value="'+(editData?.duracion||'')+'" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all" required></div><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Categoría *</label><select name="idcategoria" required class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all"><option value="">Seleccionar categoría</option>'+(cat.success?cat.data.map(c=>'<option value="'+c.idcategoria+'"'+(editData?.idcategoria==c.idcategoria?' selected':'')+'>'+(c.categorianombre||c.nombre||'Sin nombre')+'</option>').join(''):'')+'</select></div></form><div id="tratFormError" class="hidden mt-2 text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2 border border-red-100"></div><div class="flex gap-2 mt-6"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="saveCRUDTratamiento()" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm hover:bg-menta-600">'+(editData?'Guardar Cambios':'Crear')+'</button></div></div>';
    openModal(body);
  }catch(e){toast('Error al cargar formulario',false)}
}
async function saveCRUDTratamiento(){
  const form=$('crudForm');if(!form)return;
  const fd=new FormData(form);const data={};
  fd.forEach((v,k)=>{if(v!==''&&v!==undefined)data[k]=v});
  // Convert to numbers where needed
  if(data.precio)data.precio=Number(data.precio);
  if(data.duracion)data.duracion=Number(data.duracion);
  if(data.idcategoria)data.idcategoria=Number(data.idcategoria);
  if(!data.nombre)return toast('El nombre es requerido',false);
  if(!data.precio)return toast('El precio es requerido',false);
  if(!data.duracion)return toast('La duración es requerida',false);
  if(!data.idcategoria)return toast('Selecciona una categoría',false);
  try{
    const d=editId?await api.put('/api/tratamientos/'+editId,data):await api.post('/api/tratamientos',data);
    if(!d.success){toast(d.error||'Error al guardar',false);return;} // keep modal open
    toast(editId?'Actualizado':'Creado exitosamente');closeModal();navigate('admin-tratamientos');
  }catch(e){toast(e.message||'Error de conexión',false);} // keep modal open
}
async function agregarMaterialTratamiento(idTrat){
  try{
    const mats=await api.get('/api/materiales');
    if(!mats.success)return toast('Error al cargar materiales',false);
    if(!mats.data||!mats.data.length)return toast('No hay materiales registrados',false);
    openModal('<div class="p-6" style="max-width: 420px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-5"><i class="fa-solid fa-oil-can text-menta mr-2"></i>Agregar Material</h3><div class="space-y-3.5"><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Material *</label><select id="matSelect" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"><option value="">Seleccionar material...</option>'+mats.data.map(m=>'<option value="'+m.idmaterial+'">'+m.nombre+'</option>').join('')+'</select></div><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Cantidad *</label><input type="number" id="matCantidad" value="1" min="1" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"></div></div><div class="flex gap-2 mt-6"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="guardarMatTrat('+idTrat+')" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm">Agregar</button></div></div>');
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function guardarMatTrat(idTrat){
  const idmaterial=$('matSelect')?.value,cantidad=$('matCantidad')?.value;
  if(!idmaterial||idmaterial==='')return toast('Selecciona un material',false);
  if(!cantidad||Number(cantidad)<1)return toast('Ingresa una cantidad válida',false);
  try{
    const d=await api.post('/api/tratamientos/'+idTrat+'/materiales/'+idmaterial,{cantidad:Number(cantidad)});
    if(!d.success){toast(d.error||'Error',false);return;}
    toast('Material agregado');closeModal();loadTratamientoPanel(idTrat);
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function agregarEmpleadoTratamiento(idTrat){
  try{
    const emps=await api.get('/api/tratamientos/'+idTrat+'/empleados-fijos');
    // Get all fixed employees and filter out already assigned ones
    const todosEmps=await api.get('/api/empleados');
    if(!todosEmps.success)return toast('Error al cargar empleados',false);
    const yaAsignados=(emps.success?(emps.data||[]):[]).map(e=>e.idempleado);
    const disponibles=(todosEmps.data||[]).filter(e=>(e.esfijo===true||e.esfijo===1||e.esfijo==='true'||e.esfijo==='t')&&!yaAsignados.includes(e.idempleado));
    if(!disponibles.length)return toast('No hay empleados fijos disponibles para asignar',false);
    openModal('<div class="p-6" style="max-width: 420px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-5"><i class="fa-solid fa-user-tie text-menta mr-2"></i>Agregar Empleado Fijo</h3><div class="space-y-3.5"><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Empleado *</label><select id="empSelect" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"><option value="">Seleccionar empleado...</option>'+disponibles.map(e=>'<option value="'+e.idempleado+'">'+e.nombre+'</option>').join('')+'</select></div></div><div class="flex gap-2 mt-6"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="guardarEmpTrat('+idTrat+')" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm">Agregar</button></div></div>');
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function guardarEmpTrat(idTrat){
  const idempleado=$('empSelect')?.value;
  if(!idempleado||idempleado==='')return toast('Selecciona un empleado',false);
  try{
    const d=await api.post('/api/tratamientos/'+idTrat+'/empleados-fijos/'+idempleado);
    if(!d.success){toast(d.error||'Error',false);return;}
    toast('Empleado agregado');closeModal();loadTratamientoPanel(idTrat);
  }catch(e){toast(e.message||'Error de conexión',false)}
}

// Admin: Paquetes
crudScreen({page:'admin-paquetes',endpoint:'/api/paquetes',entity:'Paquetes',fields:[{name:'nombre',label:'Nombre',type:'text',required:true},{name:'precio',label:'Precio',type:'number',required:true},{name:'duraciontotal',label:'Duración Total (min)',type:'number'}],titleField:'paquetenombre',customCols:[{label:'Nombre',render:r=>r.paquetenombre||r.nombre||'-'},{label:'Precio',render:r=>$$(r.precio)},{label:'Duración',render:r=>r.duraciontotal?r.duraciontotal+' min':'-'},{label:'',render:r=>'<div class="flex gap-1.5 justify-end"><button onclick="window.verPaqueteAdmin('+r.idpaquete+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Contenido"><i class="fa-solid fa-list"></i></button><button onclick="editCRUD(\'admin-paquetes\','+r.idpaquete+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button onclick="deleteCRUD(\'/api/paquetes\','+r.idpaquete+',\'admin-paquetes\')" class="p-1.5 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div>'}]});
window.verPaqueteAdmin=async(id)=>{
  try{
    const[pkg,trat]=await Promise.all([api.get('/api/paquetes/'+id),api.get('/api/paquetes/'+id+'/tratamientos')]);
    if(!pkg.success)return toast(pkg.error,false);
    const p=pkg.data;const tratList=trat.success?trat.data:[];
    openModal('<div class="p-6" style="max-width: 500px"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-[#2c3e50]"><i class="fa-solid fa-gift text-amber-500 mr-2"></i>'+p.paquetenombre+'</h3><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+$$(p.precio)+'</span></div><div class="mb-4"><div class="flex items-center justify-between mb-2"><p class="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Tratamientos incluidos</p><button onclick="agregarTratamientoPaquete('+id+')" class="text-xs text-menta hover:text-menta-600 font-medium"><i class="fa-solid fa-plus"></i> Agregar</button></div>'+(tratList.length?'<div class="space-y-1.5">'+tratList.map(t=>'<div class="flex items-center justify-between px-3 py-2.5 bg-lavender-50 rounded-xl text-sm"><span>'+t.tratamientonombre+' <span class="text-xs text-[#6b7280]">'+$$(t.precio)+'</span></span><button onclick="quitarTratamientoPaquete('+id+','+t.idtratamiento+',\''+t.tratamientonombre.replace(/'/g,"\\'")+'\')" class="text-xs text-red-400 hover:text-red-500"><i class="fa-regular fa-circle-xmark"></i></button></div>').join('')+'</div>':'<p class="text-xs text-[#9ca3af] py-2">Sin tratamientos asignados</p>')+'</div><div class="flex gap-2 mt-4"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cerrar</button></div></div>');
  }catch(e){toast(e.message||'Error de conexión',false)}
};
async function agregarTratamientoPaquete(idPaq){
  try{
    const tr=await api.get('/api/tratamientos');
    if(!tr.success)return toast('Error al cargar tratamientos',false);
    openModal('<div class="p-6" style="max-width: 420px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-5"><i class="fa-solid fa-spa text-menta mr-2"></i>Agregar Tratamiento</h3><div class="space-y-3.5"><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Tratamiento *</label><select id="paqTratSelect" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm">'+tr.data.map(t=>'<option value="'+t.idtratamiento+'">'+t.nombre+' - '+$$(t.precio)+'</option>').join('')+'</select></div></div><div class="flex gap-2 mt-6"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="guardarTratPaquete('+idPaq+')" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm">Agregar</button></div></div>');
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function guardarTratPaquete(idPaq){
  const idtratamiento=$('paqTratSelect')?.value;
  if(!idtratamiento)return toast('Selecciona un tratamiento',false);
  try{
    const d=await api.post('/api/paquetes/'+idPaq+'/tratamientos/'+idtratamiento);
    if(!d.success)return toast(d.error||'Error',false);
    toast('Tratamiento agregado');closeModal();window.verPaqueteAdmin(idPaq);
  }catch(e){toast(e.message||'Error de conexión',false);closeModal();}
}
async function quitarTratamientoPaquete(idPaq,idTrat,nombre){
  openConfirm('Quitar tratamiento','¿Quitar "'+nombre+'" del paquete?',async()=>{
    try{
      const d=await api.del('/api/paquetes/'+idPaq+'/tratamientos/'+idTrat);
      if(!d.success)return toast(d.error||'Error',false);
      toast('Tratamiento quitado');closeModal();window.verPaqueteAdmin(idPaq);
    }catch(e){toast(e.message||'Error de conexión',false)}
  });
}

// Admin: Empleados
crudScreen({page:'admin-empleados',endpoint:'/api/empleados',entity:'Empleados',titleField:'nombre',customCols:[{label:'Nombre',render:r=>r.nombre||'-'},{label:'DNI',render:r=>r.dni||'-'},{label:'Teléfono',render:r=>r.telefono||'-'},{label:'Especialidad',render:r=>r.especialidad||'-'},{label:'Fijo',render:r=>{const esFijo=r.esfijo===true||r.esfijo===1||r.esfijo==='true'||r.esfijo==='t';return esFijo?'<span class="text-menta"><i class="fa-solid fa-check"></i></span>':'<span class="text-[#d1d5db]"><i class="fa-solid fa-xmark"></i></span>'}},{label:'Distrito',render:r=>r.distritonombre||'-'},{label:'Horas',render:r=>r.horastrabajo!=null?r.horastrabajo+' h':'-'},{label:'',render:r=>'<div class="flex gap-1.5 justify-end"><button onclick="editCRUD(\'admin-empleados\','+r.idempleado+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button onclick="deleteCRUD(\'/api/empleados\','+r.idempleado+',\'admin-empleados\')" class="p-1.5 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div>'}],fields:[{name:'nombre',label:'Nombre',type:'text',required:true},{name:'dni',label:'DNI',type:'text',required:true},{name:'telefono',label:'Teléfono',type:'text'},{name:'especialidad',label:'Especialidad',type:'text'},{name:'direccion',label:'Dirección',type:'text'},{name:'iddistrito',label:'Distrito',type:'select',loadEndpoint:'/api/distritos',optionValue:'iddistrito',optionLabel:'nombre'},{name:'esfijo',label:'Es Fijo',type:'checkbox'}]});
// Custom modal for empleados to load distrito options
const _empleadoFields=[
  {name:'nombre',label:'Nombre',type:'text',required:true},{name:'dni',label:'DNI',type:'text',required:true},{name:'telefono',label:'Teléfono',type:'text'},{name:'especialidad',label:'Especialidad',type:'text'},{name:'direccion',label:'Dirección',type:'text'},{name:'iddistrito',label:'Distrito',type:'select',options:[]},{name:'esfijo',label:'Es Fijo',type:'checkbox'}
];
async function _loadDistritoSelect(fields){try{const d=await api.get('/api/distritos');if(d.success&&d.data)return fields.map(f=>f.name==='iddistrito'?{...f,options:d.data.map(r=>({value:r.iddistrito,label:r.nombre}))}:f);}catch(e){}return fields;}
async function _loadAreaSelect(fields){try{const d=await api.get('/api/areas');if(d.success&&d.data)return fields.map(f=>f.name==='idarea'?{...f,options:d.data.map(r=>({value:r.idarea,label:r.nombre}))}:f);}catch(e){}return fields;}
const _origEditCRUD=window.editCRUD;
window.editCRUD=async(p,id)=>{
  const cfg=_crudConfigs[p];if(!cfg)return toast('Configuración no encontrada',false);
  try{
    const d=await api.get(cfg.endpoint+'/'+id);
    if(!d.success)return toast(d.error||'Error',false);
    let fields=cfg.fields;
    if(p==='admin-empleados')fields=await _loadDistritoSelect(fields);
    if(p==='admin-categorias')fields=await _loadAreaSelect(fields);
    crudForm(p,cfg.endpoint,cfg.entity,fields,d.data,cfg.onCreated);
  }catch(e){toast(e.message||'Error al cargar datos',false)}
};
const _origOpenEmpleados=window['openModalCRUD_admin-empleados'];
window['openModalCRUD_admin-empleados']=async()=>{
  try{
    const d=await api.get('/api/distritos');
    if(d.success&&d.data){
      const fields=_empleadoFields.map(f=>f.name==='iddistrito'?{...f,options:d.data.map(r=>({value:r.iddistrito,label:r.nombre}))}:f);
      crudForm('admin-empleados','/api/empleados','Empleados',fields,null);
    }else _origOpenEmpleados();
  }catch(e){_origOpenEmpleados()}
};

// Admin: Clientes
crudScreen({page:'admin-clientes',endpoint:'/api/clientes',entity:'Cliente',fields:[{name:'nombre',label:'Nombre',type:'text',required:true},{name:'ci',label:'CI',type:'text',required:true},{name:'telefono',label:'Teléfono',type:'text'},{name:'email',label:'Email',type:'email'}],titleField:'nombre'});
let clientesSearch='';
SCREENS['admin-clientes']=async()=>{
  const ct=$('pageContent');ct.innerHTML=showLoading();
  try{
    const d=await api.get('/api/clientes');
    if(!d.success){ct.innerHTML=showEmpty('fa-regular fa-users','Sin datos','No hay clientes registrados.');return;}
    const data=(d.data||[]).filter(c=>!clientesSearch||(c.nombre||'').toLowerCase().includes(clientesSearch.toLowerCase())||(c.ci||'').includes(clientesSearch));
    ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]">Clientes</h3><div class="flex items-center gap-2"><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+data.length+'</span><button onclick="window[\'openModalCRUD_admin-clientes\']()" class="px-3 py-1.5 bg-menta text-white text-xs font-medium rounded-xl hover:bg-menta-600 shadow-sm flex items-center gap-1"><i class="fa-solid fa-plus"></i> Agregar</button></div></div><div class="mb-3"><input type="text" id="clienteSearch" placeholder="Buscar por nombre o CI..." value="'+clientesSearch+'" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all" oninput="clientesSearch=this.value;clearTimeout(window._clienteSearchTimer);window._clienteSearchTimer=setTimeout(function(){const prevFocus=document.activeElement?.id;SCREENS[\'admin-clientes\']().then(function(){if(prevFocus){const el=document.getElementById(prevFocus);if(el){el.focus();const v=el.value;el.value=\'\';el.value=v;}}})},400)"></div><div class="bg-white rounded-2xl shadow-sm border border-[#e8ecf1] overflow-hidden">'+renderTable([{label:'Nombre',render:r=>r.nombre},{label:'CI',render:r=>r.ci||'-'},{label:'Teléfono',field:'telefono'},{label:'Email',field:'email'},{label:'Citas',render:r=>'<span class="px-2 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+(r.total_citas||0)+'</span>'},{label:'Gasto Total',render:r=>$$(r.total_gastado||0)},{label:'',render:r=>'<div class="flex gap-1.5 justify-end"><button onclick="verHistorialCliente('+r.idcliente+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Ver historial"><i class="fa-regular fa-clock"></i></button><button onclick="editCRUD(\'admin-clientes\','+r.idcliente+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button onclick="deleteCRUD(\'/api/clientes\','+r.idcliente+',\'admin-clientes\')" class="p-1.5 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div>'}],data,'No hay clientes registrados.')+'</div></div>';
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error.','Reintentar','navigate(\'admin-clientes\')')}
};
async function verHistorialCliente(id){
  try{
    const d=await api.get('/api/clientes/'+id);
    if(!d.success)return toast(d.error,false);
    const c=d.data;const citas=c.citas||[];
    openModal('<div class="p-6" style="max-width: 520px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-4"><i class="fa-regular fa-clock text-menta mr-2"></i>Historial: '+c.nombre+'</h3>'+(citas.length?'<div class="space-y-2">'+citas.map(ci=>'<div class="flex items-center justify-between px-3 py-2.5 bg-[#f8fafc] rounded-xl border border-[#e8ecf1]"><div><p class="text-sm font-medium text-[#2c3e50]">'+ci.tratamientonombre+'</p><p class="text-xs text-[#6b7280]">'+formatDateShort(ci.fecha)+' a las '+formatTime(ci.hora)+'</p></div><span class="px-2 py-0.5 text-xs font-semibold rounded-full border '+sc(ci.estado)+'">'+cap(ci.estado)+'</span></div>').join('')+'</div>':'<p class="text-sm text-[#6b7280] py-4 text-center">Sin citas registradas</p>')+'<button onclick="closeModal()" class="mt-4 w-full px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm hover:bg-menta-600">Cerrar</button></div>');
  }catch(e){toast(e.message||'Error de conexión',false)}
}
// Admin: Materiales
crudScreen({page:'admin-materiales',endpoint:'/api/materiales',entity:'Materiales',fields:[{name:'nombre',label:'Nombre',type:'text',required:true},{name:'cantidad',label:'Stock Inicial',type:'number',required:true}],titleField:'nombre',customCols:[{label:'Nombre',render:r=>r.nombre||'-'},{label:'Stock',render:r=>'<span class="font-semibold '+(Number(r.cantidad||0)<=5?'text-red-500':'text-[#2c3e50]')+'">'+(r.cantidad||0)+'</span>'},{label:'',render:r=>'<div class="flex gap-1.5 justify-end"><button onclick="editCRUD(\'admin-materiales\','+r.idmaterial+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button onclick="deleteCRUD(\'/api/materiales\','+r.idmaterial+',\'admin-materiales\')" class="p-1.5 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div>'}]});

// Admin: Categorías (with area select)
const _catFields=[
  {name:'nombre',label:'Nombre',type:'text',required:true},
  {name:'idarea',label:'Área',type:'select',required:true,options:[]}
];
crudScreen({page:'admin-categorias',endpoint:'/api/categorias',entity:'Categoría',fields:_catFields,titleField:'nombre',customCols:[{label:'Nombre',render:r=>r.categorianombre||r.nombre||'-'},{label:'Área',render:r=>r.areanombre||'-'},{label:'',render:r=>'<div class="flex gap-1.5 justify-end"><button onclick="editCRUD(\'admin-categorias\','+r.idcategoria+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button onclick="deleteCRUD(\'/api/categorias\','+r.idcategoria+',\'admin-categorias\')" class="p-1.5 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div>'}]});
const _origOpenCats=window['openModalCRUD_admin-categorias'];
window['openModalCRUD_admin-categorias']=async()=>{
  try{
    const d=await api.get('/api/areas');
    if(d.success&&d.data){
      const fields=_catFields.map(f=>f.name==='idarea'?{...f,options:d.data.map(r=>({value:r.idarea,label:r.nombre}))}:f);
      crudForm('admin-categorias','/api/categorias','Categoría',fields,null);
    }else _origOpenCats();
  }catch(e){_origOpenCats()}
};

// Admin: Distritos
crudScreen({page:'admin-distritos',endpoint:'/api/distritos',entity:'Distrito',fields:[{name:'nombre',label:'Nombre',type:'text',required:true}],titleField:'nombre'});
let distritosSearch='';
SCREENS['admin-distritos']=async()=>{
  const ct=$('pageContent');ct.innerHTML=showLoading();
  try{
    const d=await api.get('/api/distritos');
    if(!d.success){ct.innerHTML=showEmpty('fa-regular fa-map-pin','Sin datos','No hay distritos registrados.','Agregar','window[\'openModalCRUD_admin-distritos\']()');return;}
    const allData=d.data||[];
    const data=allData.filter(di=>!distritosSearch||(di.nombre||'').toLowerCase().includes(distritosSearch.toLowerCase()));
    ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]">Distritos</h3><div class="flex items-center gap-2"><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+data.length+'</span><button onclick="window[\'openModalCRUD_admin-distritos\']()" class="px-3 py-1.5 bg-menta text-white text-xs font-medium rounded-xl hover:bg-menta-600 shadow-sm flex items-center gap-1"><i class="fa-solid fa-plus"></i> Agregar</button></div></div><div class="mb-3"><input type="text" placeholder="Buscar distrito..." value="'+distritosSearch+'" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all" oninput="distritosSearch=this.value;navigate(\'admin-distritos\')"></div><div class="space-y-2">'+data.map(di=>'<div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm overflow-hidden"><div class="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors" onclick="toggleDistrito('+di.iddistrito+')"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center"><i class="fa-solid fa-map-pin text-red-400"></i></div><div><h4 class="font-medium text-[#2c3e50]">'+di.nombre+'</h4></div></div><div class="flex items-center gap-2"><div class="flex gap-1"><button onclick="event.stopPropagation();editCRUD(\'admin-distritos\','+di.iddistrito+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button onclick="event.stopPropagation();deleteCRUD(\'/api/distritos\','+di.iddistrito+',\'admin-distritos\')" class="p-1.5 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div><i class="fa-solid fa-chevron-down text-[#9ca3af] transition-transform '+(expandedDistrito===di.iddistrito?'rotate-180':'')+'"></i></div></div><div id="distPanel_'+di.iddistrito+'" class="'+(expandedDistrito===di.iddistrito?'':'hidden')+' border-t border-[#e8ecf1] bg-[#f8fafc]"><div class="p-4 flex items-center gap-3 text-sm text-[#6b7280]"><i class="fa-solid fa-people-group text-menta"></i><span>Empleados asignados: <strong>'+(di.empleados||0)+'</strong></span></div></div></div>').join('')+'</div></div>';
    if(expandedDistrito){const p=$(('distPanel_'+expandedDistrito));if(p)p.classList.remove('hidden');}
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error.','Reintentar','navigate(\'admin-distritos\')')}
};
function toggleDistrito(id){const p=$(('distPanel_'+id));if(expandedDistrito===id){expandedDistrito=null;p.classList.add('hidden');return;}if(expandedDistrito){const old=$(('distPanel_'+expandedDistrito));if(old)old.classList.add('hidden')}expandedDistrito=id;p.classList.remove('hidden');}
function deleteDistritoMigrar(id,nombre,data){
  const otros=data.filter(d=>d.iddistrito!==id);
  openModal('<div class="p-6" style="max-width: 420px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-4"><i class="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>Eliminar Distrito</h3><p class="text-sm text-[#6b7280] mb-4">Al eliminar <strong>'+nombre+'</strong>, los empleados deben ser reasignados. Selecciona un distrito destino:</p><select id="migrarADistrito" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm mb-4">'+(otros.length?otros.map(o=>'<option value="'+o.iddistrito+'">'+o.nombre+'</option>').join(''):'<option value="">No hay otros distritos</option>')+'</select><div class="flex gap-2"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="confirmarDeleteDistrito('+id+')" class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-red-600" '+(otros.length?'':'disabled')+'>Confirmar y Reasignar</button></div></div>');
}
async function confirmarDeleteDistrito(id){
  const migrarA=$('migrarADistrito')?.value;
  if(!migrarA)return toast('Selecciona un distrito destino',false);
  try{
    const d=await api.del('/api/distritos/'+id+'?migrarA='+migrarA);
    if(!d.success)return toast(d.error||'Error',false);
    toast('Distrito eliminado y empleados reasignados');closeModal();navigate('admin-distritos');
  }catch(e){toast(e.message||'Error de conexión',false)}
}
// Patch delete button for distritos
setTimeout(()=>{const oldDelete=window.deleteCRUD;if(!oldDelete)return;window.deleteCRUD=function(ep,id,page){if(ep==='/api/distritos'){const data=window._distritosData||[];const item=data.find(d=>d.iddistrito===id);if(item){deleteDistritoMigrar(id,item.nombre,data);return}}oldDelete(ep,id,page)};const scr=SCREENS['admin-distritos'];const orig=scr;SCREENS['admin-distritos']=async function(){const ct=$('pageContent');ct.innerHTML='<div class="flex items-center justify-center py-24"><div class="w-10 h-10 border-3 border-[#e8ecf1] border-t-menta rounded-full spin"></div></div>';try{const d=await api.get('/api/distritos');if(d.success)window._distritosData=d.data;return orig.apply(this,arguments)}catch(e){return orig.apply(this,arguments)}}},100);

// Admin: Áreas
// Admin: Áreas — solo nombre, cantidadpersonalfijo es automático
crudScreen({page:'admin-areas',endpoint:'/api/areas',entity:'Área',fields:[{name:'nombre',label:'Nombre',type:'text',required:true}],titleField:'nombre'});
let areasSearch='';
SCREENS['admin-areas']=async()=>{
  const ct=$('pageContent');ct.innerHTML=showLoading();
  try{
    const d=await api.get('/api/areas');
    if(!d.success){ct.innerHTML=showEmpty('fa-regular fa-building','Sin datos','No hay áreas registradas.','Agregar','window[\'openModalCRUD_admin-areas\']()');return;}
    const allData=d.data||[];
    const data=allData.filter(a=>!areasSearch||(a.nombre||'').toLowerCase().includes(areasSearch.toLowerCase()));
    ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]">Áreas</h3><div class="flex items-center gap-2"><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+data.length+'</span><button onclick="window[\'openModalCRUD_admin-areas\']()" class="px-3 py-1.5 bg-menta text-white text-xs font-medium rounded-xl hover:bg-menta-600 shadow-sm flex items-center gap-1"><i class="fa-solid fa-plus"></i> Agregar</button></div></div><div class="mb-3"><input type="text" placeholder="Buscar área..." value="'+areasSearch+'" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm focus:ring-2 focus:ring-menta/30 focus:border-menta outline-none transition-all" oninput="areasSearch=this.value;navigate(\'admin-areas\')"></div><div class="space-y-2">'+data.map(a=>'<div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm overflow-hidden"><div class="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors" onclick="toggleArea('+a.idarea+')"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-lavender-100 flex items-center justify-center"><i class="fa-solid fa-building text-spa"></i></div><div><h4 class="font-medium text-[#2c3e50]">'+a.nombre+'</h4><p class="text-xs text-[#6b7280]" id="areaEmpCount_'+a.idarea+'">'+(a.cantidadpersonalfijo!=null?a.cantidadpersonalfijo+' empleados fijos':'')+'</p></div></div><div class="flex items-center gap-2"><div class="flex gap-1"><button onclick="event.stopPropagation();editCRUD(\'admin-areas\','+a.idarea+')" class="p-1.5 text-[#6b7280] hover:text-menta hover:bg-menta-50 rounded-lg" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button onclick="event.stopPropagation();deleteCRUD(\'/api/areas\','+a.idarea+',\'admin-areas\')" class="p-1.5 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div><i class="fa-solid fa-chevron-down text-[#9ca3af] transition-transform '+(expandedArea===a.idarea?'rotate-180':'')+'"></i></div></div><div id="areaPanel_'+a.idarea+'" class="'+(expandedArea===a.idarea?'':'hidden')+' border-t border-[#e8ecf1] bg-[#f8fafc]"><div class="p-4" id="areaContent_'+a.idarea+'">'+(expandedArea===a.idarea?showLoading():'')+'</div></div></div>').join('')+'</div></div>';
    if(expandedArea)loadAreaPanel(expandedArea);
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error.','Reintentar','navigate(\'admin-areas\')')}
};
async function loadAreaPanel(id){
  const ct=$('areaContent_'+id);if(!ct)return;
  try{
    const[emps,cat]=await Promise.all([api.get('/api/areas/'+id+'/empleados'),api.get('/api/categorias/area/'+id)]);
    const empList=emps.success?emps.data||[]:[];
    const catList=cat.success?cat.data||[]:[];
    // Update counter badge in the card header
    const badge=$('areaEmpCount_'+id);
    if(badge)badge.textContent=empList.length+' empleados fijos';
    var empHtml=empList.length?'<div class="space-y-1.5">'+empList.map(function(e){return '<div class="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-[#e8ecf1] text-sm"><span>'+e.nombre+'</span><button onclick="quitarEmpleadoArea('+id+','+e.idempleado+',\''+e.nombre.replace(/'/g,"\\'")+'\')" class="text-xs text-red-400 hover:text-red-500"><i class="fa-regular fa-circle-xmark"></i></button></div>'}).join('')+'</div>':'<p class="text-xs text-[#9ca3af] py-2">Sin empleados asignados</p>';
    var catHtml=catList.length?'<div class="space-y-1.5">'+catList.map(function(c){return '<div class="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-[#e8ecf1] text-sm"><span>'+(c.categorianombre||c.nombre||'')+'</span><button onclick="eliminarCategoria('+c.idcategoria+',\''+((c.categorianombre||c.nombre||'')).replace(/'/g,"\\'")+'\')" class="text-xs text-red-400 hover:text-red-500"><i class="fa-regular fa-trash-can"></i></button></div>'}).join('')+'</div>':'<p class="text-xs text-[#9ca3af] py-2">Sin categorías</p>';
    ct.innerHTML='<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><div class="flex items-center justify-between mb-2"><h5 class="text-xs font-semibold text-[#6b7280] uppercase tracking-wider"><i class="fa-solid fa-user-tie text-menta mr-1"></i>Empleados</h5><button onclick="agregarEmpleadoArea('+id+')" class="text-xs text-menta hover:text-menta-600 font-medium"><i class="fa-solid fa-plus"></i> Agregar</button></div>'+empHtml+'</div><div><div class="flex items-center justify-between mb-2"><h5 class="text-xs font-semibold text-[#6b7280] uppercase tracking-wider"><i class="fa-solid fa-tags text-menta mr-1"></i>Categorías</h5><button onclick="agregarCategoriaArea('+id+')" class="text-xs text-menta hover:text-menta-600 font-medium"><i class="fa-solid fa-plus"></i> Agregar</button></div>'+catHtml+'</div></div>';
  }catch(e){ct.innerHTML='<p class="text-xs text-red-400">Error al cargar panel</p>'}
}
function toggleArea(id){const p=$(('areaPanel_'+id));if(expandedArea===id){expandedArea=null;p.classList.add('hidden');return;}if(expandedArea){const old=$(('areaPanel_'+expandedArea));if(old)old.classList.add('hidden')}expandedArea=id;p.classList.remove('hidden');loadAreaPanel(id);}
async function agregarCategoriaArea(idArea){
  try{
    const cats=await api.get('/api/categorias');
    if(!cats.success)return toast('Error al cargar categorías',false);
    const existentes=cats.data||[];
    openModal('<div class="p-6" style="max-width: 380px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-5"><i class="fa-solid fa-tag text-menta mr-2"></i>Agregar Categoría</h3><div class="space-y-3.5"><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Categoría *</label><select id="catSelect" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"><option value="">Seleccionar categoría</option>'+(existentes.length?existentes.map(c=>'<option value="'+c.idcategoria+'">'+(c.categorianombre||c.nombre||'')+'</option>').join(''):'')+'</select></div></div><div class="flex gap-2 mt-6"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="guardarCategoriaArea('+idArea+')" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm">Agregar</button></div></div>');
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function guardarCategoriaArea(idArea){
  const idcategoria=$('catSelect')?.value;
  if(!idcategoria)return toast('Selecciona una categoría',false);
  try{
    const d=await api.put('/api/categorias/'+idcategoria,{idarea:idArea});
    if(!d.success)return toast(d.error||'Error',false);
    toast('Categoría asignada al área');closeModal();loadAreaPanel(idArea);
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function eliminarCategoria(id,nombre){
  openConfirm('Eliminar Categoría','¿Eliminar "'+nombre+'"?',async()=>{
    try{
      const d=await api.del('/api/categorias/'+id);
      if(!d.success)return toast(d.error||'Error',false);
      toast('Categoría eliminada');
      for(const k of Object.keys(SCREENS))if(k.startsWith('admin-areas')){navigate(k);break;}
    }catch(e){toast(e.message||'Error de conexión',false)}
  });
}
async function agregarEmpleadoArea(idArea){
  try{
    const[todosR,yaR]=await Promise.all([api.get('/api/empleados'),api.get('/api/areas/'+idArea+'/empleados')]);
    if(!todosR.success)return toast('Error al cargar empleados',false);
    const yaIds=(yaR.success?(yaR.data||[]):[]).map(e=>e.idempleado);
    const disponibles=(todosR.data||[]).filter(e=>!yaIds.includes(e.idempleado));
    if(!disponibles.length)return toast('Todos los empleados ya están asignados a esta área',false);
    openModal('<div class="p-6" style="max-width:380px"><h3 class="text-lg font-semibold text-[#2c3e50] mb-5"><i class="fa-solid fa-user-tie text-menta mr-2"></i>Agregar Empleado</h3><div class="space-y-3.5"><div><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Empleado *</label><select id="empAreaSelect" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm"><option value="">Seleccionar empleado...</option>'+disponibles.map(function(e){return '<option value="'+e.idempleado+'">'+e.nombre+'</option>'}).join('')+'</select></div></div><div class="flex gap-2 mt-6"><button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button><button onclick="guardarEmpleadoArea('+idArea+')" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm">Agregar</button></div></div>');
  }catch(e){toast(e.message||'Error de conexión',false)}
}
async function guardarEmpleadoArea(idArea){
  var idempleado=$('empAreaSelect')?.value;
  if(!idempleado)return toast('Selecciona un empleado',false);
  try{
    var d=await api.post('/api/areas/'+idArea+'/empleados/'+idempleado);
    if(!d.success)return toast(d.error||'Error',false);
    toast('Empleado asignado al área');closeModal();loadAreaPanel(idArea);
  }catch(e){toast(e.message||'Error de conexión',false)}
}
function quitarEmpleadoArea(idArea,idEmpleado,nombre){
  openConfirm('Quitar Empleado','¿Quitar "'+nombre+'" del área?',async function(){
    try{
      var d=await api.del('/api/areas/'+idArea+'/empleados/'+idEmpleado);
      if(!d.success)return toast(d.error||'Error',false);
      toast('Empleado quitado del área');loadAreaPanel(idArea);
    }catch(e){toast(e.message||'Error de conexión',false)}
  });
}

// Admin: Reportes hub — acceso a informes + reportes generales
SCREENS['admin-reportes']=async()=>{
  const ct=$('pageContent');
  ct.innerHTML='<div class="fade-in"><h3 class="text-lg font-semibold text-[#2c3e50] mb-5"><i class="fa-solid fa-chart-pie text-menta mr-2"></i>Informes y Reportes</h3><div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6"><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onclick="navigate(\'admin-informe-ingresos\')"><div class="flex items-center gap-4"><div class="w-14 h-14 rounded-2xl bg-menta-50 flex items-center justify-center"><i class="fa-solid fa-file-invoice-dollar text-menta text-2xl"></i></div><div><h4 class="font-semibold text-[#2c3e50]">Informe de Ingresos</h4><p class="text-sm text-[#6b7280] mt-0.5">Resumen mensual de ingresos por tratamientos y paquetes</p></div></div></div><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onclick="navigate(\'admin-informe-discrepancia\')"><div class="flex items-center gap-4"><div class="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center"><i class="fa-solid fa-file-excel text-amber-500 text-2xl"></i></div><div><h4 class="font-semibold text-[#2c3e50]">Informe de Discrepancia</h4><p class="text-sm text-[#6b7280] mt-0.5">Comparativa de materiales planificados vs. utilizados</p></div></div></div><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onclick="_renderReporteScreen($(\'pageContent\'))"><div class="flex items-center gap-4"><div class="w-14 h-14 rounded-2xl bg-lavender-100 flex items-center justify-center"><i class="fa-solid fa-chart-bar text-spa text-2xl"></i></div><div><h4 class="font-semibold text-[#2c3e50]">Reportes Generales</h4><p class="text-sm text-[#6b7280] mt-0.5">Top tratamientos, historial de clientes, estadísticas del día</p></div></div></div></div></div>';
};

// Admin: Informe Ingresos — usa endpoint real /api/reportes/ingresos + top tratamientos
SCREENS['admin-informe-ingresos']=async()=>{
  const ct=$('pageContent');ct.innerHTML=showLoading('Generando informe de ingresos...');
  try{
    const mesesNom=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const[ingRes,topRes]=await Promise.all([
      api.get('/api/reportes/ingresos'),
      api.get('/api/reportes/top-tratamientos')
    ]);
    // Informe ingresos por mes desde la BD
    const ingData=ingRes.success?ingRes.data||[]:[];
    const topData=topRes.success?topRes.data||[]:[];
    const totalGeneral=ingData.reduce((s,m)=>s+Number(m.total||m.ingresos||0),0);
    const topColors=['bg-amber-100 text-amber-600','bg-gray-100 text-gray-500','bg-orange-50 text-orange-400'];
    const topHtml=topData.length?'<div class="space-y-2">'+topData.map((t,i)=>'<div class="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e8ecf1]"><div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold '+topColors[i]+'">'+(i+1)+'</div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-[#2c3e50] truncate">'+(t.tratamientonombre||t.nombre||'-')+'</p><p class="text-xs text-[#6b7280]">'+(t.totalcitas||t.cantidad||0)+' citas</p></div><span class="text-sm font-semibold text-menta">'+$$(t.ingresos||t.total||0)+'</span></div>').join('')+'</div>':'<p class="text-sm text-[#9ca3af] py-3 text-center">Sin datos de top tratamientos</p>';
    // Construir tarjetas por mes
    let mesCards='';
    if(ingData.length){
      // BD devuelve filas con mes/anio/total — construir display
      const sorted=[...ingData].sort((a,b)=>{
        const ka=(a.anio||a.year||0)+'-'+(String(a.mes||a.month||0).padStart(2,'0'));
        const kb=(b.anio||b.year||0)+'-'+(String(b.mes||b.month||0).padStart(2,'0'));
        return kb.localeCompare(ka);
      });
      mesCards=sorted.map(m=>{
        const mes=Number(m.mes||m.month||1)-1;
        const anio=m.anio||m.year||'';
        const label=(mesesNom[mes]||'')+' '+anio;
        const tot=Number(m.total||m.ingresos||0);
        const citasCnt=Number(m.citas||m.totalcitas||0);
        const paqCnt=Number(m.paquetes||m.totalpaquetes||0);
        return '<div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5 hover:shadow-md transition-shadow"><div class="flex items-center justify-between mb-3"><h4 class="font-semibold text-[#2c3e50] text-sm">'+label+'</h4><span class="text-lg font-bold text-menta">'+$$(tot)+'</span></div><div class="space-y-2 text-xs"><div class="flex justify-between"><span class="text-[#6b7280]">Tratamientos</span><span>'+citasCnt+' citas</span></div><div class="flex justify-between"><span class="text-[#6b7280]">Paquetes</span><span>'+paqCnt+' vendidos</span></div></div></div>';
      }).join('');
    }else{
      // Fallback: construir desde citas locales
      const[citas,pqv]=await Promise.all([api.get('/api/citas'),api.get('/api/paquetes-vendidos')]);
      const realizadas = (citas.success ? (citas.data || []) : []).filter(c => c.estado === 'realizada');
      const paqVend=pqv.success?pqv.data||[]:[];
      const meses={};
      for(let i=0;i<12;i++){
        const m2=dayjs().subtract(i,'month');const key=m2.format('YYYY-MM');
        meses[key]={label:mesesNom[m2.month()]+' '+m2.format('YYYY'),citas:0,ingresosCitas:0,paquetes:0,ingresosPaq:0,ingresosTotal:0};
      }
      realizadas.forEach(c=>{if(!c.fecha)return;const key=dayjs(c.fecha).format('YYYY-MM');if(meses[key]){meses[key].citas++;meses[key].ingresosCitas+=Number(c.precio||0)}});
      paqVend.forEach(p=>{if(!p.fechacompra)return;const key=dayjs(p.fechacompra).format('YYYY-MM');if(meses[key]){meses[key].paquetes++;meses[key].ingresosPaq+=Number(p.precio||0)}});
      Object.keys(meses).forEach(k=>{meses[k].ingresosTotal=meses[k].ingresosCitas+meses[k].ingresosPaq});
      const sorted2=Object.keys(meses).sort().reverse();
      const totalGeneral2=sorted2.reduce((s,k)=>s+meses[k].ingresosTotal,0);
      mesCards=sorted2.map(k=>{const m2=meses[k];return '<div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5 hover:shadow-md transition-shadow"><div class="flex items-center justify-between mb-3"><h4 class="font-semibold text-[#2c3e50] text-sm">'+m2.label+'</h4><span class="text-lg font-bold text-menta">'+$$(m2.ingresosTotal)+'</span></div><div class="space-y-2 text-xs"><div class="flex justify-between"><span class="text-[#6b7280]">Tratamientos</span><span>'+m2.citas+' citas — '+$$(m2.ingresosCitas)+'</span></div><div class="flex justify-between"><span class="text-[#6b7280]">Paquetes</span><span>'+m2.paquetes+' vendidos — '+$$(m2.ingresosPaq)+'</span></div></div></div>';}).join('');
    }
    ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]"><i class="fa-solid fa-file-invoice-dollar text-menta mr-2"></i>Informe de Ingresos</h3><span class="px-3 py-1.5 bg-menta-50 text-menta-700 text-sm font-semibold rounded-full">Total: '+$$(totalGeneral)+'</span></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6"><div class="lg:col-span-2"><h4 class="font-semibold text-[#2c3e50] mb-3 text-sm"><i class="fa-solid fa-calendar-alt text-menta mr-1.5"></i>Por Mes</h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-4">'+mesCards+'</div></div><div><h4 class="font-semibold text-[#2c3e50] mb-3 text-sm"><i class="fa-solid fa-trophy text-amber-500 mr-1.5"></i>Top 3 Tratamientos</h4>'+topHtml+'</div></div></div>';
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error.','Reintentar','navigate(\'admin-informe-ingresos\')')}
};

// Admin: Informe Discrepancia — usa endpoint real /api/reportes/discrepancias/:anio/:mes
SCREENS['admin-informe-discrepancia']=async()=>{
  const ct=$('pageContent');ct.innerHTML=showLoading('Cargando informe de discrepancia...');
  try{
    const mesesNom=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const mesesOp=[];for(let i=0;i<12;i++){const m=dayjs().subtract(i,'month');mesesOp.push({val:m.format('YYYY-MM'),anio:m.year(),mes:m.month()+1,label:mesesNom[m.month()]+' '+m.format('YYYY')})}
    ct.innerHTML='<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]"><i class="fa-solid fa-file-excel text-menta mr-2"></i>Informe de Discrepancia</h3></div><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5 mb-5"><div class="flex flex-wrap items-end gap-3"><div class="flex-1 min-w-48"><label class="block text-xs font-semibold text-[#6b7280] mb-1.5">Seleccionar Mes</label><select id="discMes" class="w-full px-4 py-2.5 border border-[#d1d5db] rounded-xl text-sm">'+mesesOp.map(m=>'<option value="'+m.anio+'/'+m.mes+'">'+m.label+'</option>').join('')+'</select></div><button onclick="generarInformeDiscrepancia()" class="px-5 py-2.5 bg-menta text-white text-sm font-medium rounded-xl hover:bg-menta-600 shadow-sm"><i class="fa-solid fa-magnifying-glass-chart mr-1.5"></i>Generar Informe</button></div></div><div id="discResultado"><div class="text-center py-12 text-sm text-[#6b7280]"><i class="fa-regular fa-hand-point-up text-2xl text-[#d1d5db] block mb-3"></i>Selecciona un mes y haz clic en "Generar Informe"</div></div></div>';
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error.','Reintentar','navigate(\'admin-informe-discrepancia\')')}
};
async function generarInformeDiscrepancia(){
  const mesVal=$('discMes')?.value;if(!mesVal)return toast('Selecciona un mes',false);
  const ct=$('discResultado');if(!ct)return;
  ct.innerHTML='<div class="flex items-center justify-center py-10"><div class="w-8 h-8 border-2 border-[#e8ecf1] border-t-menta rounded-full spin"></div></div>';
  try{
    const d=await api.get('/api/reportes/discrepancias/'+mesVal);
    if(!d.success){ct.innerHTML='<div class="text-center py-8 text-sm text-red-400"><i class="fa-solid fa-circle-exclamation mr-1.5"></i>'+( d.error||'Error al cargar discrepancias')+'</div>';return;}
    const data=d.data||[];
    if(!data.length){ct.innerHTML='<div class="text-center py-12 text-sm text-[#6b7280]"><i class="fa-regular fa-calendar-xmark text-2xl text-[#d1d5db] block mb-3"></i>No hay datos de discrepancia para este mes</div>';return;}
    // data es array de {material, cantidadplanificada, cantidadusada, diferencia, ...}
    const hayDiferencia=data.some(r=>Number(r.diferencia||r.discrepancia||0)!==0);
    ct.innerHTML='<div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-[#e8ecf1] flex items-center justify-between"><h4 class="font-semibold text-[#2c3e50]">Discrepancias de Materiales</h4>'+(hayDiferencia?'<span class="px-2.5 py-0.5 bg-red-50 text-red-500 text-xs font-semibold rounded-full border border-red-100"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Hay discrepancias</span>':'<span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full border border-mentaverde-200"><i class="fa-solid fa-check mr-1"></i>Sin discrepancias</span>')+'</div>'+renderTable([{label:'Material',render:r=>r.nombrematerial||r.material||r.nombre||'-'},{label:'Planificado',render:r=>'<span class="font-medium">'+Number(r.cantidadplanificada||r.planificado||0)+'</span>'},{label:'Utilizado',render:r=>'<span class="font-medium">'+Number(r.cantidadusada||r.usado||r.utilizado||0)+'</span>'},{label:'Diferencia',render:r=>{const diff=Number(r.diferencia||r.discrepancia||0);return'<span class="font-semibold '+(diff<0?'text-red-500':diff>0?'text-amber-500':'text-menta')+'">'+(diff>0?'+':'')+diff+'</span>'}},{label:'Estado',render:r=>{const diff=Number(r.diferencia||r.discrepancia||0);return diff<0?'<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-50 text-red-500 border border-red-100">Déficit</span>':diff>0?'<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-600 border border-amber-100">Exceso</span>':'<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-menta-50 text-menta-700 border border-mentaverde-200">OK</span>';}}],data,'No hay datos de materiales')+'</div>';
  }catch(e){ct.innerHTML='<div class="text-center py-8 text-sm text-red-400"><i class="fa-solid fa-circle-exclamation mr-1.5"></i>'+(e.message||'Error al conectar')+'</div>'}
}
SCREENS.inicio=async()=>{
  const ct=$('pageContent');
  ct.innerHTML=showLoading();
  try{
    const d=await api.get('/api/citas');
    if(!d.success){ct.innerHTML=showEmpty('fa-regular fa-calendar-xmark','Sin datos','No se pudieron cargar las citas.');return;}
    const hoy=dayjs().format('YYYY-MM-DD'),hoyCitas=d.data.filter(c=>c.fecha===hoy),pendientes=hoyCitas.filter(c=>c.estado==='pendiente'),realizadasHoy=hoyCitas.filter(c=>c.estado==='realizada');
    const ventasHoy=realizadasHoy.reduce((s,c)=>s+Number(c.precio||c.costo||0),0);
    const frases=['"El cuidado personal es la forma más profunda de amor propio." —','"Donde la calma y la belleza se encuentran." —','"Cada día es una oportunidad para renovarte." —','"Tu bienestar es nuestra inspiración." —'];
    const frase=frases[dayjs().day()%frases.length];
    ct.innerHTML='<div class="fade-in"><div class="bg-gradient-to-br from-menta via-menta-600 to-menta-700 rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden shadow-md"><div class="absolute inset-0 pointer-events-none"><div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div><div class="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div><div class="absolute top-1/2 left-1/4 w-32 h-32 bg-spa-300/10 rounded-full blur-xl"></div></div><div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"><i class="fa-solid fa-spa text-white text-lg"></i></div><h2 class="text-white font-semibold text-lg">Bienvenido/a, '+(user?.username||'Usuario')+'</h2></div><p class="text-white/80 text-sm">Hoy es '+today()+'</p></div><div class="flex gap-3"><div class="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center"><p class="text-xs text-white/70">Citas Hoy</p><p class="text-xl font-bold text-white">'+hoyCitas.length+'</p></div><div class="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center"><p class="text-xs text-white/70">Ventas Hoy</p><p class="text-xl font-bold text-white">'+$$(ventasHoy)+'</p></div></div></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div class="bg-white rounded-2xl p-5 border border-[#e8ecf1] shadow-sm card-hover"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-menta-50 flex items-center justify-center"><i class="fa-solid fa-calendar-day text-menta"></i></div><div><p class="text-xs text-[#6b7280]">Citas Hoy</p><p class="text-2xl font-bold text-[#2c3e50]">'+hoyCitas.length+'</p></div></div></div><div class="bg-white rounded-2xl p-5 border border-[#e8ecf1] shadow-sm card-hover"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><i class="fa-solid fa-hourglass-half text-amber-500"></i></div><div><p class="text-xs text-[#6b7280]">Pendientes</p><p class="text-2xl font-bold text-[#2c3e50]">'+pendientes.length+'</p></div></div></div><div class="bg-white rounded-2xl p-5 border border-[#e8ecf1] shadow-sm card-hover"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center"><i class="fa-solid fa-spa text-spa"></i></div><div><p class="text-xs text-[#6b7280]">Hoy</p><p class="text-lg font-semibold text-[#2c3e50]">'+today()+'</p></div></div></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-5"><div class="lg:col-span-2 bg-white rounded-2xl border border-[#e8ecf1] shadow-sm overflow-hidden"><div class="px-5 py-4 border-b border-[#e8ecf1] flex items-center justify-between"><h3 class="font-semibold text-[#2c3e50]"><i class="fa-regular fa-clock text-menta mr-2"></i>Citas de Hoy</h3><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">'+hoyCitas.length+'</span></div>'+(hoyCitas.length?renderTable([{label:'Hora',render:c=>formatTime(c.hora)},{label:'Cliente',render:c=>c.clientenombre||'-'},{label:'Tratamiento',render:c=>c.tratamientonombre||'-'},{label:'Estado',render:c=>'<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full border '+sc(c.estado)+'">'+cap(c.estado)+'</span>'}],hoyCitas):'<div class="p-12 flex flex-col items-center gap-2 text-[#9ca3af]"><i class="fa-regular fa-calendar-check text-3xl"></i><p class="text-sm font-medium">¡Sin citas hoy!</p><p class="text-xs">Un día libre para ti y tu equipo.</p></div>')+'</div><div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm p-5"><div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center"><i class="fa-solid fa-leaf text-menta"></i></div><h3 class="font-semibold text-[#2c3e50] text-sm">Ambiente del Día</h3></div><p class="text-sm text-[#6b7280] italic leading-relaxed">'+frase+'</p><p class="text-xs text-[#9ca3af] mt-2">Un espacio de calma y bienestar.</p><div class="flex gap-2 mt-4"><span class="w-2 h-2 rounded-full bg-menta"></span><span class="w-2 h-2 rounded-full bg-spa-300"></span><span class="w-2 h-2 rounded-full bg-blush"></span><span class="w-2 h-2 rounded-full bg-turquesa"></span></div></div></div></div>';
  }catch(e){ct.innerHTML=showEmpty('fa-regular fa-circle-exclamation','Error','Ocurrió un error al cargar el resumen.','Reintentar','navigate(\'inicio\')')}
};
// ============================================================
// SUB-MODAL: second layer on top of the main modal
// Used for "Agregar cliente" while cita modal stays open
// ============================================================
function openSubModal(html, cb) {
  let sm = document.getElementById('subModalContainer');
  if (!sm) {
    sm = document.createElement('div');
    sm.id = 'subModalContainer';
    sm.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4';
    sm.style.cssText = 'background:rgba(0,0,0,0.45);backdrop-filter:blur(2px)';
    sm.addEventListener('click', function(e){ if(e.target===sm) closeSubModal(); });
    document.body.appendChild(sm);
  }
  sm.innerHTML = '<div id="subModalBody" class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scale-in" onclick="event.stopPropagation()">' + html + '</div>';
  sm.style.display = 'flex';
  if (cb) setTimeout(cb, 50);
}
function closeSubModal() {
  const sm = document.getElementById('subModalContainer');
  if (sm) sm.style.display = 'none';
}

// ============================================================
// CANCELAR CITA
// ============================================================
function cancelarCita(id) {
  openConfirm(
    'Cancelar Cita',
    '¿Confirmas la cancelación de esta cita? Solo podrás reactivarla editándola.',
    async function() {
      try {
        const d = await api.put('/api/citas/' + id, { estado: 'cancelada' });
        if (!d.success) return toast(d.error || 'Error al cancelar', false);
        toast('Cita cancelada');
        SCREENS.citas();
      } catch(e) { toast(e.message || 'Error de conexión', false); }
    },
    true
  );
}

// ============================================================
// REALIZAR CITA — opens materials screen
// ============================================================
let _realizarMateriales = []; // working list of materials for this realization

async function realizarCita(idCita) {
  try {
    // Load cita details
    const citaRes = await api.get('/api/citas/' + idCita);
    if (!citaRes.success) { 
      toast('Error al cargar la cita', false); 
      return; 
    }
    const cita = citaRes.data;

    // Get treatment materials from the database using the correct endpoint
    const tratMatRes = await api.get('/api/tratamientos/' + cita.idtratamiento + '/materiales');
    
    // Get all available materials (for adding new ones)
    const allMatRes = await api.get('/api/materiales');

    // Build working materials list - set cantidad to 0 initially
    _realizarMateriales = [];
    if (tratMatRes.success && tratMatRes.data && tratMatRes.data.length) {
      tratMatRes.data.forEach(function(m) {
        _realizarMateriales.push({
          idmaterial: m.idmaterial,
          // ✅ CORREGIDO: usar 'nombrematerial' en lugar de 'nombre'
          nombre: m.nombrematerial || m.nombre || 'Material',
          cantidad: 0,
          cantidadPredeterminada: m.cantidad || 0,
          esPredeterminado: true
        });
      });
    } else {
      toast('Este tratamiento no tiene materiales asignados', false);
    }

    const todosLosMat = (allMatRes.success && allMatRes.data) ? allMatRes.data : [];

    _renderRealizarModal(idCita, cita, todosLosMat);
  } catch(e) {
    console.error('Error al cargar materiales:', e);
    toast(e.message || 'Error al cargar materiales', false);
  }
}

function _renderRealizarModal(idCita, cita, todosLosMat) {
  const matUsados = new Set(_realizarMateriales.map(m => m.idmaterial));
  const matDisponibles = todosLosMat.filter(m => !matUsados.has(m.idmaterial));

  const matListHtml = _realizarMateriales.length
    ? _realizarMateriales.map(function(m, i) {
        // Show default quantity in a small badge
        const defaultBadge = m.cantidadPredeterminada ? 
          `<span class="text-xs text-gray-400 ml-1">(default: ${m.cantidadPredeterminada})</span>` : '';
        
        return '<div class="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[#e8ecf1] mb-2">'
          + '<div class="flex-1 min-w-0">'
          + '<p class="text-sm font-medium text-[#2c3e50] truncate">' + m.nombre + defaultBadge + '</p>'
          + (m.esPredeterminado ? '<span class="text-xs text-menta font-medium">Material del tratamiento</span>' : '<span class="text-xs text-[#9ca3af]">Agregado</span>')
          + '</div>'
          + '<div class="flex items-center gap-2 flex-shrink-0">'
          + '<label class="text-xs text-[#6b7280]">Cant.:</label>'
          + '<input type="number" min="0" step="0.01" value="' + m.cantidad + '" class="w-20 px-2 py-1.5 border border-[#d1d5db] rounded-lg text-sm text-center" onchange="window._realizarCantidad(' + i + ',this.value)">'
          + '<button onclick="window._realizarQuitarMat(' + i + ')" class="p-1.5 text-[#d1d5db] hover:text-red-400 transition-colors" title="Quitar"><i class="fa-solid fa-xmark"></i></button>'
          + '</div></div>';
      }).join('')
    : '<p class="text-sm text-[#9ca3af] py-2 text-center">No hay materiales asignados a este tratamiento</p>';

  const addSelectHtml = matDisponibles.length
    ? '<select id="realizarAddSelect" class="flex-1 px-3 py-2 border border-[#d1d5db] rounded-xl text-sm">'
        + '<option value="">Seleccionar material a agregar...</option>'
        + matDisponibles.map(m => '<option value="' + m.idmaterial + '">' + m.nombre + '</option>').join('')
        + '</select>'
        + '<button onclick="window._realizarAgregarMat(' + idCita + ')" class="px-3 py-2 bg-menta text-white rounded-xl text-sm font-medium hover:bg-menta-600 flex-shrink-0"><i class="fa-solid fa-plus mr-1"></i>Agregar</button>'
    : '<p class="text-xs text-[#9ca3af]">No hay más materiales disponibles</p>';

  const html = '<div class="p-6" style="max-width:600px">'
    + '<div class="flex items-center justify-between mb-5">'
    + '<div><h3 class="text-lg font-semibold text-[#2c3e50]"><i class="fa-solid fa-check-circle text-menta mr-2"></i>Realizar Cita</h3>'
    + '<p class="text-xs text-[#6b7280] mt-1">' + (cita.clientenombre || '') + ' — ' + (cita.tratamientonombre || '') + '</p></div>'
    + '<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full border bg-amber-100 text-amber-700 border-amber-200">Pendiente</span>'
    + '</div>'
    + '<div class="mb-4">'
    + '<h4 class="text-sm font-semibold text-[#2c3e50] mb-2"><i class="fa-solid fa-box-open text-menta mr-1.5"></i>Materiales utilizados</h4>'
    + '<div class="text-xs text-[#6b7280] mb-2">Ingresa las cantidades utilizadas para cada material:</div>'
    + matListHtml
    + '</div>'
    + '<div class="border-t border-[#e8ecf1] pt-4 mb-4">'
    + '<h4 class="text-sm font-semibold text-[#2c3e50] mb-2"><i class="fa-solid fa-plus text-mentaverde-500 mr-1.5"></i>Agregar material extra</h4>'
    + '<div class="flex gap-2 items-center">' + addSelectHtml + '</div>'
    + '</div>'
    + '<div class="flex gap-2 mt-6">'
    + '<button onclick="closeModal()" class="flex-1 px-4 py-2.5 bg-gray-100 text-[#6b7280] rounded-xl text-sm font-medium hover:bg-gray-200">Cancelar</button>'
    + '<button onclick="window._confirmarRealizarCita(' + idCita + ')" class="flex-1 px-4 py-2.5 bg-menta text-white rounded-xl text-sm font-medium shadow-sm hover:bg-menta-600 flex items-center justify-center gap-2"><i class="fa-solid fa-check"></i>Confirmar Realizada</button>'
    + '</div></div>';

  openModal(html);

  // Store data for later use
  window._todosLosMat = todosLosMat;
  window._realizarCitaId = idCita;
  window._realizarCitaData = cita;
}

// Update quantity for a material in the working list
window._realizarCantidad = function(idx, val) {
  if (_realizarMateriales[idx]) _realizarMateriales[idx].cantidad = parseFloat(val) || 0;
};

// Remove a material from working list and re-render
window._realizarQuitarMat = function(idx) {
  _realizarMateriales.splice(idx, 1);
  _renderRealizarModal(window._realizarCitaId, window._realizarCitaData, window._todosLosMat);
};

// Add a material from the dropdown
window._realizarAgregarMat = function(idCita) {
  const sel = document.getElementById('realizarAddSelect');
  if (!sel || !sel.value) { 
    toast('Selecciona un material', false); 
    return; 
  }
  const idm = parseInt(sel.value);
  const mat = window._todosLosMat.find(function(m){ return m.idmaterial === idm; });
  if (!mat) return;
  
  _realizarMateriales.push({ 
    idmaterial: mat.idmaterial, 
    nombre: mat.nombre, 
    cantidad: 0, // Start with 0
    cantidadPredeterminada: 0,
    esPredeterminado: false 
  });
  _renderRealizarModal(window._realizarCitaId, window._realizarCitaData, window._todosLosMat);
};

// Confirm: assign materials to cita and mark as realizada
// Confirm: assign materials to cita and mark as realizada
window._confirmarRealizarCita = async function(idCita) {
  console.log('=== INICIANDO CONFIRMACIÓN ===');
  console.log('ID Cita:', idCita);
  
  const citaId = Number(idCita);
  
  const hasMaterialsWithQuantity = _realizarMateriales.some(m => m.cantidad > 0);
  
  if (!hasMaterialsWithQuantity) {
    const userConfirmed = confirm('⚠️ No has registrado ningún material.\n¿Deseas continuar?');
    if (!userConfirmed) return;
  }

  try {
    const btn = document.querySelector('button[onclick*="_confirmarRealizarCita"]');
    if (btn) { 
      btn.disabled = true; 
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i>Guardando...'; 
    }

    // PASO 1: Marcar cita como realizada
    console.log('Paso 1: Actualizando estado de la cita...');
    const updateRes = await api.put(`/api/citas/${citaId}`, { estado: 'realizada' });
    
    if (!updateRes.success) {
      toast(updateRes.error || 'Error al actualizar cita', false);
      if (btn) btn.disabled = false;
      return;
    }
    console.log('✅ Cita actualizada a realizada');

    // Esperar un momento
    await new Promise(resolve => setTimeout(resolve, 200));

    // PASO 2: Insertar materiales con el campo correcto: 'cantidadutilizada'
    let assignedCount = 0;
    for (const m of _realizarMateriales) {
      if (m.cantidad > 0) {
        try {
          console.log(`Registrando material: ${m.nombre}, cantidad: ${m.cantidad}`);
          
          // ✅ CAMBIO IMPORTANTE: usar 'cantidadutilizada' en lugar de 'cantidad'
          const matRes = await api.post(`/api/citas/${citaId}/materiales/${m.idmaterial}`, {
            cantidadutilizada: m.cantidad
          });
          
          if (matRes.success) {
            assignedCount++;
            console.log(`✅ ${m.nombre} registrado`);
          } else {
            console.error(`Error con ${m.nombre}:`, matRes.error);
            toast(`Error: ${matRes.error}`, false);
          }
        } catch(e) {
          console.error(`Excepción con ${m.nombre}:`, e);
          toast(`Error al registrar ${m.nombre}: ${e.message}`, false);
        }
      }
    }

    toast(`✅ Cita realizada. ${assignedCount} material(es) registrado(s).`);
    closeModal();
    SCREENS.citas();
    
  } catch(e) {
    console.error('Error general:', e);
    toast(e.message || 'Error de conexión', false);
    const btn = document.querySelector('button[onclick*="_confirmarRealizarCita"]');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>Confirmar Realizada';
    }
  }
};


async function _renderPaqVendidosScreen(ct) {
  ct.innerHTML = showLoading('Cargando paquetes vendidos...');
  try {
    const d = await api.get('/api/paquetes-vendidos');
    if (!d.success) { ct.innerHTML = showEmpty('fa-regular fa-receipt', 'Sin datos', 'No se pudieron cargar los paquetes vendidos.'); return; }
    const paqList = d.data || [];
    ct.innerHTML = '<div class="fade-in"><div class="flex items-center justify-between mb-5"><h3 class="text-lg font-semibold text-[#2c3e50]"><i class="fa-solid fa-receipt text-menta mr-2"></i>Paquetes Vendidos</h3><span class="px-2.5 py-0.5 bg-menta-50 text-menta-700 text-xs font-semibold rounded-full">' + paqList.length + '</span></div>'
      + (paqList.length ? '<div class="space-y-3">' + paqList.map(pv => {
          const estadoBadge = pv.activo === false || pv.activo === 0 || pv.activo === 'false'
            ? '<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">Inactivo</span>'
            : '<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-menta-50 text-menta-700">Activo</span>';
          return '<div class="bg-white rounded-2xl border border-[#e8ecf1] shadow-sm overflow-hidden">'
            + '<div class="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors" onclick="togglePaqVendidoPanel(' + pv.idpaquete + ')">'
            + '<div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center"><i class="fa-solid fa-box text-amber-500 text-sm"></i></div>'
            + '<div><h4 class="font-medium text-[#2c3e50]">' + (pv.paquetenombre || pv.nombre || 'Paquete #' + pv.idpaquete) + '</h4>'
            + '<p class="text-xs text-[#6b7280]">' + (pv.clientenombre || 'Cliente') + ' &bull; Compra: ' + formatDateShort(pv.fechacompra) + '</p></div></div>'
            + '<div class="flex items-center gap-2">' + estadoBadge
            + '<span class="text-base font-bold text-menta">' + $$(pv.precio || 0) + '</span>'
            + '<i class="fa-solid fa-chevron-down text-[#9ca3af] transition-transform" id="paqVChev_' + pv.idpaquete + '"></i></div></div>'
            + '<div id="paqVPanel_' + pv.idpaquete + '" class="hidden border-t border-[#e8ecf1] bg-[#f8fafc]"><div class="p-4" id="paqVContent_' + pv.idpaquete + '">' + showLoading() + '</div></div>'
            + '</div>';
        }).join('') + '</div>'
      : showEmpty('fa-regular fa-receipt', 'Sin paquetes vendidos', 'Aun no se han vendido paquetes.'))
      + '</div>';
  } catch(e) { ct.innerHTML = showEmpty('fa-regular fa-circle-exclamation', 'Error', 'Ocurrio un error.', 'Reintentar', navigate('paquetes-vendidos')); }
}
SCREENS['paquetes-vendidos'] = async () => _renderPaqVendidosScreen($('pageContent'));
SCREENS['admin-paquetes-vendidos'] = async () => _renderPaqVendidosScreen($('pageContent'));

let _expandedPaqV = null;
function togglePaqVendidoPanel(id) {
  const panel = $('paqVPanel_' + id);
  const chev = $('paqVChev_' + id);
  if (_expandedPaqV === id) {
    _expandedPaqV = null;
    if (panel) panel.classList.add('hidden');
    if (chev) chev.classList.remove('rotate-180');
    return;
  }
  if (_expandedPaqV) {
    const oldPanel = $('paqVPanel_' + _expandedPaqV);
    const oldChev = $('paqVChev_' + _expandedPaqV);
    if (oldPanel) oldPanel.classList.add('hidden');
    if (oldChev) oldChev.classList.remove('rotate-180');
  }
  _expandedPaqV = id;
  if (panel) panel.classList.remove('hidden');
  if (chev) chev.classList.add('rotate-180');
  _loadPaqVendidoContent(id);
}
async function _loadPaqVendidoContent(id) {
  const ct = $('paqVContent_' + id); if (!ct) return;
  try {
    const d = await api.get('/api/paquetes-vendidos/' + id);
    if (!d.success) { ct.innerHTML = '<p class="text-xs text-red-400">Error al cargar detalle</p>'; return; }
    const pv = d.data;
    // Build detail view
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    // Info del paquete
    html += '<div><h5 class="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2"><i class="fa-solid fa-circle-info text-menta mr-1"></i>Información</h5>'
      + '<div class="space-y-1.5">'
      + '<div class="flex justify-between text-sm px-3 py-2 bg-white rounded-xl border border-[#e8ecf1]"><span class="text-[#6b7280]">Paquete</span><span class="font-medium">' + (pv.paquetenombre || '-') + '</span></div>'
      + '<div class="flex justify-between text-sm px-3 py-2 bg-white rounded-xl border border-[#e8ecf1]"><span class="text-[#6b7280]">Cliente</span><span class="font-medium">' + (pv.clientenombre || '-') + '</span></div>'
      + '<div class="flex justify-between text-sm px-3 py-2 bg-white rounded-xl border border-[#e8ecf1]"><span class="text-[#6b7280]">Precio</span><span class="font-bold text-menta">' + $$(pv.precio || 0) + '</span></div>'
      + '<div class="flex justify-between text-sm px-3 py-2 bg-white rounded-xl border border-[#e8ecf1]"><span class="text-[#6b7280]">Compra</span><span class="font-medium">' + formatDateShort(pv.fechacompra) + '</span></div>'
      + '<div class="flex justify-between text-sm px-3 py-2 bg-white rounded-xl border border-[#e8ecf1]"><span class="text-[#6b7280]">Inicio</span><span class="font-medium">' + formatDateShort(pv.fechainicio) + '</span></div>'
      + '<div class="flex justify-between text-sm px-3 py-2 bg-white rounded-xl border border-[#e8ecf1]"><span class="text-[#6b7280]">Fin</span><span class="font-medium">' + formatDateShort(pv.fechafin) + '</span></div>'
      + '</div></div>';
    // Citas asociadas a este paquete
    let citasHtml = '<p class="text-xs text-[#9ca3af] py-2">Cargando citas...</p>';
    try {
      const cRes = await api.get('/api/citas/paquete/' + id);
      const citas = cRes.success ? cRes.data || [] : [];
      citasHtml = citas.length
        ? '<div class="space-y-1.5">' + citas.map(c =>
            '<div class="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-[#e8ecf1] text-sm">'
            + '<div><p class="font-medium text-[#2c3e50]">' + (c.tratamientonombre || '-') + '</p>'
            + '<p class="text-xs text-[#6b7280]">' + formatDateShort(c.fecha) + ' ' + formatTime(c.hora) + '</p></div>'
            + '<span class="px-2 py-0.5 text-xs font-semibold rounded-full border ' + sc(c.estado) + '">' + cap(c.estado) + '</span>'
            + '</div>').join('') + '</div>'
        : '<p class="text-xs text-[#9ca3af] py-2">Sin citas registradas para este paquete</p>';
    } catch(e2) { citasHtml = '<p class="text-xs text-red-300">Error al cargar citas</p>'; }
    html += '<div><h5 class="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2"><i class="fa-solid fa-calendar-check text-menta mr-1"></i>Citas del Paquete</h5>' + citasHtml + '</div>';
    html += '</div>';
    ct.innerHTML = html;
  } catch(e) { ct.innerHTML = '<p class="text-xs text-red-400">Error al cargar detalle</p>'; }
}

// ============================================================
// REPORTES — Funciones auxiliares: autocomplete cliente + acciones
// ============================================================
async function rptAutocomplete() {
  const q = $('rptClienteInput')?.value; if (!q || q.length < 2) { $('rptClienteAC')?.classList.add('hidden'); return; }
  try {
    const d = await api.get('/api/clientes?q=' + encodeURIComponent(q));
    if (!d.success) return;
    const ac = $('rptClienteAC'); if (!ac) return;
    let html = '<div class="p-2 space-y-1">';
    if (d.data.length) {
      html += d.data.map(c => '<div class="px-3 py-2 hover:bg-menta-50 rounded-lg cursor-pointer text-sm text-[#2c3e50] flex items-center justify-between" onclick="rptSelCliente(' + c.idcliente + ',\'' + c.nombre.replace(/'/g, "\\'") + '\')"><span>' + c.nombre + '</span><span class="text-xs text-[#6b7280]">' + (c.telefono || '') + '</span></div>').join('');
    } else { html += '<div class="px-3 py-2 text-sm text-[#9ca3af]">Sin resultados</div>'; }
    html += '</div>';
    ac.innerHTML = html; ac.classList.remove('hidden');
  } catch(e) {}
}
function rptSelCliente(id, nombre) {
  const hi = $('rptClienteId'); const inp = $('rptClienteInput'); const ac = $('rptClienteAC');
  if (hi) hi.value = id; if (inp) inp.value = nombre; if (ac) ac.classList.add('hidden');
}
async function rptEmpleadosPorCliente() {
  const idcliente = $('rptClienteId')?.value;
  if (!idcliente) return toast('Selecciona un cliente primero', false);
  const res = $('rptClienteResultado'); if (!res) return;
  res.innerHTML = '<div class="flex justify-center py-3"><div class="w-5 h-5 border-2 border-[#e8ecf1] border-t-menta rounded-full spin"></div></div>';
  try {
    const d = await api.get('/api/reportes/empleados-por-cliente/' + idcliente);
    if (!d.success) { res.innerHTML = '<p class="text-xs text-red-400 text-center py-2">' + (d.error || 'Error') + '</p>'; return; }
    const emps = d.data || [];
    res.innerHTML = emps.length
      ? '<div class="mt-1"><p class="text-xs font-semibold text-[#6b7280] mb-1.5">Empleados que atendieron a este cliente:</p><div class="space-y-1">'
        + emps.map(e => '<div class="flex items-center gap-2 px-3 py-2 bg-[#f8fafc] rounded-lg border border-[#e8ecf1]"><div class="w-6 h-6 rounded-full bg-menta-50 flex items-center justify-center"><i class="fa-solid fa-user-tie text-menta text-xs"></i></div><span class="text-xs font-medium text-[#2c3e50]">' + (e.nombre || '-') + '</span><span class="ml-auto text-xs text-[#6b7280]">' + (e.totalcitas || e.citas || '') + ' cita(s)</span></div>').join('')
        + '</div></div>'
      : '<p class="text-xs text-[#9ca3af] text-center py-2">No hay empleados registrados para este cliente</p>';
  } catch(e) { res.innerHTML = '<p class="text-xs text-red-400 text-center py-2">Error: ' + (e.message || '') + '</p>'; }
}
async function rptServiciosCliente() {
  const idcliente = $('rptClienteId')?.value;
  if (!idcliente) return toast('Selecciona un cliente primero', false);
  const desde = $('rptFechaDesde')?.value; const hasta = $('rptFechaHasta')?.value;
  if (!desde || !hasta) return toast('Selecciona las fechas de inicio y fin', false);
  const res = $('rptClienteResultado'); if (!res) return;
  res.innerHTML = '<div class="flex justify-center py-3"><div class="w-5 h-5 border-2 border-[#e8ecf1] border-t-menta rounded-full spin"></div></div>';
  try {
    const d = await api.get('/api/reportes/servicios-cliente/' + idcliente + '?fechaInicio=' + desde + '&fechaFin=' + hasta);
    if (!d.success) { res.innerHTML = '<p class="text-xs text-red-400 text-center py-2">' + (d.error || 'Error') + '</p>'; return; }
    const svcs = d.data || [];
    res.innerHTML = svcs.length
      ? '<div class="mt-1"><p class="text-xs font-semibold text-[#6b7280] mb-1.5">Servicios de ' + formatDateShort(desde) + ' a ' + formatDateShort(hasta) + ':</p><div class="space-y-1">'
        + svcs.map(s => '<div class="flex items-center justify-between px-3 py-2 bg-[#f8fafc] rounded-lg border border-[#e8ecf1]"><div><p class="text-xs font-medium text-[#2c3e50]">' + (s.tratamientonombre || s.nombre || '-') + '</p><p class="text-xs text-[#6b7280]">' + formatDateShort(s.fecha) + ' ' + formatTime(s.hora) + '</p></div><span class="text-xs font-semibold text-menta">' + $$(s.precio || 0) + '</span></div>').join('')
        + '</div></div>'
      : '<p class="text-xs text-[#9ca3af] text-center py-2">Sin servicios en el intervalo seleccionado</p>';
  } catch(e) { res.innerHTML = '<p class="text-xs text-red-400 text-center py-2">Error: ' + (e.message || '') + '</p>'; }
}
