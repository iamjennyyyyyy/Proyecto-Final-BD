const $ = id => document.getElementById(id);
const qq = sel => document.querySelectorAll(sel);

const ENT = {
  areas: {
    label: 'Área', labelP: 'Áreas', icon: '🏢',
    id: 'idarea',
    cols: [
      { h: 'Nombre', v: r => `<strong>${r.nombre||''}</strong>` },
      { h: 'Personal Fijo', v: r => `<span class="badge badge-num">${r.cantidadpersonalfijo??0}</span>` }
    ],
    form: `
      <div class="f-group"><label>Nombre del Área <span class="req">*</span></label>
      <input name="nombre" required minlength="3" placeholder="Ej: Masajes, Facial"></div>`,
    btn: 'Crear Área'
  },
  tratamientos: {
    label: 'Tratamiento', labelP: 'Tratamientos', icon: '💆',
    id: 'idtratamiento',
    cols: [
      { h: 'Nombre', v: r => `<strong>${r.nombre||''}</strong>` },
      { h: 'Precio', v: r => `<span class="precio">$${Number(r.precio).toFixed(2)}</span>` },
      { h: 'Duración', v: r => `${r.duracion||0} min` }
    ],
    form: `
      <div class="f-group"><label>Nombre <span class="req">*</span></label>
      <input name="nombre" required minlength="3" placeholder="Ej: Masaje Relajante"></div>
      <div class="f-row">
        <div class="f-group"><label>Precio ($) <span class="req">*</span></label>
        <input name="precio" type="number" step="0.01" required min="1" max="999.99" placeholder="80"></div>
        <div class="f-group"><label>Duración (min) <span class="req">*</span></label>
        <input name="duracion" type="number" required min="15" max="240" step="15" placeholder="60"></div>
      </div>
      <div class="f-group"><label>ID Categoría</label>
      <input name="idCategoria" type="number" placeholder="1"></div>
      <div class="f-group"><label>Descripción</label>
      <textarea name="descripcion" rows="2" placeholder="Opcional"></textarea></div>`,
    btn: 'Crear Tratamiento'
  },
  clientes: {
    label: 'Cliente', labelP: 'Clientes', icon: '👤',
    id: 'idcliente',
    cols: [
      { h: 'Nombre', v: r => `<strong>${r.nombre||''}</strong>` }
    ],
    form: `
      <div class="f-group"><label>Nombre Completo <span class="req">*</span></label>
      <input name="nombre" required minlength="3" placeholder="Ej: María García"></div>
      <div class="f-row">
        <div class="f-group"><label>Cédula (CI) <span class="req">*</span></label>
        <input name="ci" required pattern="[0-9]{7,11}" placeholder="12345678"></div>
        <div class="f-group"><label>Teléfono</label>
        <input name="telefono" pattern="[0-9]{8}" placeholder="98765432"></div>
      </div>
      <div class="f-group"><label>Email</label>
      <input name="email" type="email" placeholder="usuario@correo.com"></div>`,
    btn: 'Crear Cliente'
  },
  distritos: {
    label: 'Distrito', labelP: 'Distritos', icon: '📍',
    id: 'iddistrito',
    cols: [
      { h: 'Nombre', v: r => `<strong>${r.nombredistrito||''}</strong>` }
    ],
    form: `
      <div class="f-group"><label>Nombre del Distrito <span class="req">*</span></label>
      <input name="nombreDistrito" required minlength="3" placeholder="Ej: Miraflores"></div>`,
    btn: 'Crear Distrito'
  }
};

function toast(msg, ok = true) {
  const t = document.createElement('div');
  t.style.cssText = `padding:10px 18px;border-radius:8px;font-size:13px;font-weight:500;background:${ok?'#10b981':'#ef4444'};color:#fff;box-shadow:0 6px 12px rgba(0,0,0,0.15);margin-bottom:8px;animation:slideIn .25s ease`;
  t.textContent = msg;
  const c = $('toastBox');
  if (!c) return;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

function loadSpin() {
  return '<div class="spin-wrap"><div class="spin"></div><p>Cargando...</p></div>';
}

/* Router */
window.addEventListener('hashchange', route);
window.addEventListener('load', route);

function route() {
  const hash = (location.hash || '#/').slice(1) || '/';
  const page = hash.split('/').filter(Boolean)[0] || 'dashboard';

  qq('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));

  $('pageTitle').textContent = page === 'dashboard' ? 'Dashboard' : (ENT[page]?.labelP || 'Dashboard');

  if (page === 'dashboard') loadDashboard();
  else if (ENT[page]) loadEntity(page);
  else loadDashboard();
}

/* ========= DASHBOARD ========= */
async function loadDashboard() {
  const ct = $('pageContent');
  if (!ct) return;
  ct.innerHTML = loadSpin();
  try {
    const [ar, tr, cl, di] = await Promise.all([
      fetch('/api/areas').then(r=>r.json()),
      fetch('/api/tratamientos').then(r=>r.json()),
      fetch('/api/clientes').then(r=>r.json()),
      fetch('/api/distritos').then(r=>r.json())
    ]);
    const a = ar.data||[], t = tr.data||[], c = cl.data||[], d = di.data||[];
    ct.innerHTML = `
      <div class="stat-grid">
        <div class="stat-c"><div class="stat-i">🏢</div><div class="stat-l">Áreas</div><div class="stat-v">${a.length}</div></div>
        <div class="stat-c"><div class="stat-i">💆</div><div class="stat-l">Tratamientos</div><div class="stat-v">${t.length}</div></div>
        <div class="stat-c"><div class="stat-i">👤</div><div class="stat-l">Clientes</div><div class="stat-v">${c.length}</div></div>
        <div class="stat-c"><div class="stat-i">📍</div><div class="stat-l">Distritos</div><div class="stat-v">${d.length}</div></div>
      </div>
      <div class="dash-flex">
        <div class="dash-c"><div class="dash-ch">Áreas</div><div class="dash-cb">${listRender(a,'nombre','cantidadpersonalfijo')}</div></div>
        <div class="dash-c"><div class="dash-ch">Tratamientos</div><div class="dash-cb">${listRender(t,'nombre','precio',v=>`$${Number(v).toFixed(2)}`)}</div></div>
      </div>
      <div class="dash-flex" style="margin-top:16px">
        <div class="dash-c"><div class="dash-ch">Clientes</div><div class="dash-cb">${listRender(c,'nombre')}</div></div>
        <div class="dash-c"><div class="dash-ch">Distritos</div><div class="dash-cb">${listRender(d,'nombredistrito')}</div></div>
      </div>`;
  } catch(e) {
    ct.innerHTML = `<div class="empty"><div style="font-size:40px">⚠️</div><h3>Error de conexión</h3><p>${e.message}</p><button class="btn btn-p" onclick="loadDashboard()" style="margin-top:12px">Reintentar</button></div>`;
  }
}

function listRender(arr, name, val, fmt) {
  if (!arr || !arr.length) return '<div class="empty" style="padding:20px">Sin datos</div>';
  return arr.slice(0, 5).map(x => {
    const v = val ? (fmt ? fmt(x[val]) : (x[val]??'')) : '';
    return `<div class="dash-row"><span>${x[name]||''}</span>${v ? `<span class="meta">${v}</span>` : ''}</div>`;
  }).join('');
}

/* ========= ENTITY PAGE ========= */
async function loadEntity(e) {
  const ct = $('pageContent');
  if (!ct) return;
  ct.innerHTML = loadSpin();
  const c = ENT[e];
  try {
    const res = await fetch(`/api/${e}`).then(r => r.json());
    const items = res.data || [];

    const rows = items.map(r => {
      const id = r[c.id];
      return `<tr>
        <td class="cid">${id}</td>
        ${c.cols.map(col => `<td>${col.v(r)}</td>`).join('')}
        <td><button class="btn btn-d btn-s" onclick="del('${e}',${id})">Eliminar</button></td>
      </tr>`;
    }).join('');

    const table = items.length
      ? `<table><thead><tr><th>ID</th>${c.cols.map(x=>`<th>${x.h}</th>`).join('')}<th style="width:80px">Acción</th></tr></thead><tbody>${rows}</tbody></table>`
      : `<div class="empty"><div style="font-size:36px">📭</div><h3>No hay ${c.labelP.toLowerCase()}</h3><p>Usa el formulario de arriba para crear uno</p></div>`;

    ct.innerHTML = `
      <div id="toastBox" style="position:fixed;top:16px;right:16px;z-index:999"></div>
      <div class="card form-card">
        <div class="card-h"><span>➕ Nuevo ${c.label}</span></div>
        <div class="card-b">
          <form onsubmit="return crear('${e}')" id="frm">
            ${c.form}
            <div style="margin-top:14px">
              <button type="submit" class="btn btn-p" id="btnS">${c.btn}</button>
              <span id="fb" style="margin-left:10px;font-size:13px;color:#94a3b8"></span>
            </div>
          </form>
        </div>
      </div>
      <div class="card list-card" style="margin-top:20px">
        <div class="card-h"><span>📋 ${c.labelP}</span><span class="badge badge-info">${items.length}</span></div>
        <div class="card-b" style="padding:0">${table}</div>
      </div>`;
  } catch(e) {
    ct.innerHTML = `<div class="empty"><div style="font-size:40px">⚠️</div><h3>Error</h3><p>${e.message}</p><button class="btn btn-p" onclick="loadEntity('${e}')" style="margin-top:12px">Reintentar</button></div>`;
  }
}

/* ========= CREATE ========= */
async function crear(e) {
  const frm = $('frm');
  if (!frm) return false;
  const data = Object.fromEntries(new FormData(frm));
  const btn = $('btnS');
  const fb = $('fb');
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }
  if (fb) fb.textContent = '';
  try {
    const r = await fetch(`/api/${e}`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error||'Error al crear');
    toast(`${ENT[e].label} creado`);
    loadEntity(e);
  } catch(err) {
    toast(err.message, false);
    if (fb) { fb.textContent = err.message; fb.style.color = '#ef4444'; }
    if (btn) { btn.disabled = false; btn.textContent = ENT[e].btn; }
  }
  return false;
}

/* ========= DELETE ========= */
async function del(e, id) {
  if (!confirm(`¿Eliminar ${ENT[e].label.toLowerCase()} #${id}?`)) return;
  try {
    const r = await fetch(`/api/${e}/${id}`, { method: 'DELETE' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error||'Error al eliminar');
    toast(`${ENT[e].label} eliminado`);
    loadEntity(e);
  } catch(err) {
    toast(err.message, false);
  }
}
