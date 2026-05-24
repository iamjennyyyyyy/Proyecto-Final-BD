async function apiGet(url) {
  const r = await fetch(url);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'Error ' + r.status);
  return j;
}
async function apiPost(url, data) {
  const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'Error ' + r.status);
  return j;
}
async function apiPut(url, data) {
  const r = await fetch(url, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'Error ' + r.status);
  return j;
}
async function apiDelete(url) {
  const r = await fetch(url, { method:'DELETE' });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'Error ' + r.status);
  return j;
}
