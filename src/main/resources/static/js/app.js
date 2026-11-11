/* ServiAsigna · panel de la central (Dashboard + Usuarios + Mapa)
 * Lee la API REST existente (/api/*) y dibuja todo aquí. No depende del controlador de vistas. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);

  // ---------- Estado ----------
  const datos = { servicios: [], domiciliarios: [], centrales: [], clientes: [] };
  let filtroServicios = sessionStorage.getItem('sa_filtro') || 'open';
  let filtroUsuarios = 'all', textoServicios = '';

  const COLOR = { PENDING: '#d97706', ASSIGNED: '#2563eb', IN_TRANSIT: '#7c3aed', DELIVERED: '#059669', CANCELLED: '#dc2626' };
  const ESTADO = { PENDING: ['Pendiente', 'bi-hourglass-split'], ASSIGNED: ['Asignado', 'bi-person-check'], IN_TRANSIT: ['En ruta', 'bi-bicycle'],
                   DELIVERED: ['Entregado', 'bi-check-circle'], CANCELLED: ['Cancelado', 'bi-x-circle'] };
  const grupoDe = (s) => s === 'PENDING' ? 'pending' : (s === 'ASSIGNED' || s === 'IN_TRANSIT' ? 'active' : 'closed');
  const activo = (u) => u.status === 'ACTIVE';

  // ---------- Utilidades ----------
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const dinero = (n) => '$' + Number(n || 0).toLocaleString('es-CO');
  const aFecha = (v) => !v ? null : (Array.isArray(v) ? new Date(v[0], v[1] - 1, v[2], v[3] || 0, v[4] || 0) : new Date(v));
  const minutos = (v) => { const d = aFecha(v); return d && !isNaN(d) ? Math.max(0, Math.round((Date.now() - d) / 60000)) : null; };
  function hace(v) {
    const m = minutos(v); if (m === null) return '';
    if (m < 1) return 'ahora'; if (m < 60) return 'hace ' + m + ' min';
    if (m < 1440) return 'hace ' + Math.floor(m / 60) + ' h';
    return aFecha(v).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
  }
  const iniciales = (n) => String(n || '?').trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

  function toast(msg, tipo) {
    const el = document.createElement('div');
    el.className = 'toast align-items-center text-bg-' + (tipo || 'success') + ' border-0';
    el.setAttribute('role', 'status');
    el.innerHTML = '<div class="d-flex"><div class="toast-body"></div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>';
    el.querySelector('.toast-body').textContent = msg;
    $('toasts').appendChild(el);
    el.addEventListener('hidden.bs.toast', () => el.remove());
    new bootstrap.Toast(el, { delay: 4000 }).show();
  }

  // Llama a la API → { ok, msg }
  async function api(metodo, url, cuerpo) {
    try {
      const r = await fetch(url, { method: metodo, headers: cuerpo ? { 'Content-Type': 'application/json' } : {}, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
      if (r.ok) return { ok: true };
      let msg = ''; try { msg = (await r.json()).message || ''; } catch (e) { /* sin cuerpo */ }
      return { ok: false, msg: msg || ({ 400: 'Datos inválidos', 404: 'No encontrado', 409: 'Ya existe un registro igual' }[r.status] || 'Error del servidor (' + r.status + ')') };
    } catch (e) { return { ok: false, msg: 'Sin conexión con el servidor' }; }
  }

  // Muestra spinner en un botón mientras corre una acción
  async function ocupado(btn, fn) {
    const html = btn.innerHTML; btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';
    try { return await fn(); } finally { btn.disabled = false; btn.innerHTML = html; }
  }
  const cerrarModales = () => document.querySelectorAll('.modal.show').forEach((m) => bootstrap.Modal.getInstance(m)?.hide());

  // ---------- Carga de datos ----------
  function setVivo(ok) { $('estadoVivo').classList.toggle('off', !ok); $('textoVivo').textContent = ok ? 'En vivo' : 'Sin conexión'; }

  async function cargarDatos() {
    try {
      const r = await Promise.all(['/api/services', '/api/couriers', '/api/centrals', '/api/clients'].map(async (u) => {
        const res = await fetch(u); if (!res.ok) throw new Error(u + ' respondió ' + res.status); return res.json();
      }));
      [datos.servicios, datos.domiciliarios, datos.centrales, datos.clientes] = r;
      $('errorCarga').classList.add('d-none'); setVivo(true);
      pintarTodo();
      $('ultimaAct').textContent = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      setVivo(false);
      $('errorCarga').textContent = 'No se pudieron cargar los datos: ' + e.message + '. Revisa que el backend y Oracle estén funcionando.';
      $('errorCarga').classList.remove('d-none');
    }
  }

  // ---------- Dibujar ----------
  function pintarTodo() { pintarStats(); pintarServicios(); pintarDomiciliarios(); pintarUsuarios(); pintarMapa(); }

  function pintarStats() {
    const n = (g) => datos.servicios.filter((o) => grupoDe(o.status) === g).length;
    const pend = n('pending'), curso = n('active');
    $('statPend').textContent = pend; $('statCurso').textContent = curso;
    $('statEntregados').textContent = datos.servicios.filter((o) => o.status === 'DELIVERED').length;
    $('statActivos').textContent = datos.domiciliarios.filter(activo).length + ' / ' + datos.domiciliarios.length;
    $('cntPend').textContent = pend; $('cntCurso').textContent = curso;
    $('navPend').textContent = pend; $('navPend').classList.toggle('d-none', pend === 0);
    document.title = (pend ? '(' + pend + ') ' : '') + 'ServiAsigna · Centro de control';
  }

  function tarjeta(o) {
    const [txt, ico] = ESTADO[o.status] || [o.status, 'bi-dot'];
    const espera = o.status === 'PENDING' ? minutos(o.createdAt) : null;
    const acc = [];
    if (o.status === 'PENDING') acc.push('<button class="btn btn-primary btn-sm" data-action="asignar" data-id="' + o.id + '"><i class="bi bi-person-plus"></i> Asignar</button>');
    if (o.status === 'ASSIGNED') acc.push('<button class="btn btn-primary btn-sm" data-action="estado" data-status="IN_TRANSIT" data-id="' + o.id + '"><i class="bi bi-play-fill"></i> Iniciar ruta</button>');
    if (o.status === 'IN_TRANSIT') acc.push('<button class="btn btn-success btn-sm" data-action="estado" data-status="DELIVERED" data-id="' + o.id + '"><i class="bi bi-check2"></i> Entregado</button>');
    if (grupoDe(o.status) !== 'closed') acc.push('<button class="btn btn-outline-danger btn-sm" data-action="cancelar" data-id="' + o.id + '" aria-label="Cancelar servicio ' + o.id + '" title="Cancelar"><i class="bi bi-x-lg"></i></button>');
    return '<article class="servicio sa-card st-' + esc(o.status) + '" data-id="' + o.id + '" tabindex="0">' +
      '<div class="d-flex justify-content-between align-items-start gap-2">' +
        '<div><strong>#' + o.id + '</strong> <span class="text-muted small ms-1" title="' + esc(aFecha(o.createdAt)?.toLocaleString('es-CO') || '') + '">' + esc(hace(o.createdAt)) + '</span>' +
        (espera !== null && espera >= 10 ? ' <span class="chip-alerta"><i class="bi bi-exclamation-triangle"></i> Esperando ' + espera + ' min</span>' : '') + '</div>' +
        '<span class="badge-estado est-' + esc(o.status) + '"><i class="bi ' + ico + '"></i> ' + txt + '</span></div>' +
      '<ul class="ruta"><li><span class="nodo nodo-p"></span><div><small>Recogida</small>' + esc(o.pickupAddress) + '</div></li>' +
        '<li><span class="nodo nodo-d"></span><div><small>Entrega</small>' + esc(o.deliveryAddress) + '</div></li></ul>' +
      '<div class="small text-muted mb-2">' + (o.client ? '<i class="bi bi-person"></i> ' + esc(o.client.name) : 'Sin cliente') +
        (o.central ? ' · <i class="bi bi-building"></i> ' + esc(o.central.name) : '') + ' · ' + dinero(o.shippingCost) +
        (o.payAtPickup ? ' · <span class="fw-semibold">Paga en recogida</span>' : '') + '</div>' +
      '<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">' +
        (o.courier ? '<span class="small fw-semibold"><i class="bi bi-bicycle"></i> ' + esc(o.courier.name) + '</span>' : '<span class="small text-muted"><i class="bi bi-person-dash"></i> Sin domiciliario</span>') +
        '<div class="d-flex gap-1">' + acc.join('') + '</div></div></article>';
  }

  function pintarServicios() {
    document.querySelectorAll('.filtros [data-filtro]').forEach((b) => b.classList.toggle('active', b.dataset.filtro === filtroServicios));
    const q = textoServicios.toLowerCase();
    const lista = datos.servicios.filter((o) => {
      const g = grupoDe(o.status);
      const okF = filtroServicios === 'all' || (filtroServicios === 'open' ? g !== 'closed' : g === filtroServicios);
      const okQ = !q || [o.id, o.pickupAddress, o.deliveryAddress, o.client?.name, o.courier?.name, o.description].join(' ').toLowerCase().includes(q);
      return okF && okQ;
    }).sort((a, b) => b.id - a.id);
    if (lista.length) { $('listaServicios').innerHTML = lista.map(tarjeta).join(''); return; }
    $('listaServicios').innerHTML = datos.servicios.length === 0
      ? '<div class="vacio"><i class="bi bi-inbox"></i><p class="mb-2">Aún no hay servicios.</p><button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalServicio">Crear el primero</button></div>'
      : '<div class="vacio"><i class="bi bi-funnel"></i><p class="mb-2">No hay servicios con este filtro.</p><button class="btn btn-outline-secondary btn-sm" data-filtro="all">Ver todos</button></div>';
  }

  function pintarDomiciliarios() {
    if (!datos.domiciliarios.length) { $('listaDomiciliarios').innerHTML = '<span class="chip"><span class="dot dot-off"></span>Sin domiciliarios — usa <strong>Agregar</strong></span>'; return; }
    $('listaDomiciliarios').innerHTML = datos.domiciliarios.map((d) => {
      const n = datos.servicios.filter((o) => o.courier && o.courier.document === d.document && grupoDe(o.status) === 'active').length;
      const [cls, txt] = !activo(d) ? ['dot-off', 'Inactivo'] : n ? ['dot-busy', 'En servicio (' + n + ')'] : ['dot-ok', 'Disponible'];
      return '<span class="chip"><span class="dot ' + cls + '"></span><strong>' + esc(d.name) + '</strong><span class="text-muted">' + txt + '</span></span>';
    }).join('');
  }

  function pintarUsuarios() {
    const T = { central: ['Central', '/api/centrals'], domiciliario: ['Domiciliario', '/api/couriers'], cliente: ['Cliente', '/api/clients'] };
    const filas = [].concat(datos.centrales.map((u) => ({ t: 'central', u })), datos.domiciliarios.map((u) => ({ t: 'domiciliario', u })), datos.clientes.map((u) => ({ t: 'cliente', u })))
      .sort((a, b) => a.u.name.localeCompare(b.u.name));
    $('cntTodos').textContent = filas.length; $('cntCentrales').textContent = datos.centrales.length;
    $('cntDomiciliarios').textContent = datos.domiciliarios.length; $('cntClientes').textContent = datos.clientes.length;
    document.querySelectorAll('[data-tipo-filtro]').forEach((b) => b.classList.toggle('active', b.dataset.tipoFiltro === filtroUsuarios));
    const q = $('buscarUsuario').value.trim().toLowerCase();
    const vis = filas.filter((f) => (filtroUsuarios === 'all' || f.t === filtroUsuarios) && [f.u.document, f.u.name, f.u.phone, f.u.address].join(' ').toLowerCase().includes(q));
    const vacio = $('sinUsuarios'); vacio.classList.toggle('d-none', vis.length > 0);
    vacio.innerHTML = filas.length ? '<i class="bi bi-search"></i>No hay usuarios que coincidan.' : '<i class="bi bi-people"></i>Aún no hay usuarios. Usa <strong>Agregar</strong> para crear el primero.';
    $('tablaUsuarios').innerHTML = vis.map((f) => {
      const on = activo(f.u);
      return '<tr><td data-label="Usuario"><div class="d-flex align-items-center gap-2"><span class="avatar av-' + f.t + '">' + esc(iniciales(f.u.name)) + '</span><span class="fw-semibold">' + esc(f.u.name) + '</span></div></td>' +
        '<td data-label="Tipo">' + T[f.t][0] + '</td><td data-label="Cédula">' + esc(f.u.document) + '</td><td data-label="Teléfono">' + esc(f.u.phone) + '</td>' +
        '<td data-label="Dirección">' + (f.u.address ? esc(f.u.address) : '<span class="text-muted">—</span>') + '</td>' +
        '<td data-label="Estado"><div class="form-check form-switch mb-0"><input class="form-check-input" type="checkbox" role="switch" id="sw-' + f.t + '-' + esc(f.u.document) + '" data-switch-estado data-api="' + T[f.t][1] + '" data-doc="' + esc(f.u.document) + '"' + (on ? ' checked' : '') + '>' +
        '<label class="form-check-label small" for="sw-' + f.t + '-' + esc(f.u.document) + '">' + (on ? 'Activo' : 'Inactivo') + '</label></div></td></tr>';
    }).join('');
  }

  // ---------- Mapa (Leaflet) ----------
  let mapa = null, capa = null, marcadores = {}, firmaMapa = '', ajustado = false, geoBusy = false;
  const cola = [], enCola = new Set();
  const geoCache = (() => { try { return JSON.parse(localStorage.getItem('sa_geo') || '{}'); } catch (e) { return {}; } })();
  const clave = (d) => String(d || '').trim().toLowerCase();

  function iniciarMapa() {
    if (typeof L === 'undefined') { $('mapa').innerHTML = '<div class="vacio">No se pudo cargar el mapa (revisa tu conexión a internet).</div>'; return; }
    mapa = L.map('mapa').setView([10.4631, -73.2532], 13);
    const claro = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd', attribution: '&copy; OpenStreetMap &copy; CARTO' }).addTo(mapa);
    const calles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' });
    L.control.layers({ 'Mapa claro': claro, 'Calles': calles }, null, { position: 'topright' }).addTo(mapa);
    capa = L.layerGroup().addTo(mapa);
    new ResizeObserver(() => mapa.invalidateSize()).observe($('mapa'));
  }

  async function geocodificar(dir) {
    const k = clave(dir);
    if (k in geoCache) return geoCache[k];
    const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=co&accept-language=es&viewbox=-73.40,10.60,-73.10,10.35&bounded=1&q=' + encodeURIComponent(dir + ', Valledupar, Cesar, Colombia');
    try {
      const j = await (await fetch(url)).json();
      geoCache[k] = j[0] ? [+j[0].lat, +j[0].lon] : null;
      localStorage.setItem('sa_geo', JSON.stringify(geoCache));
      return geoCache[k];
    } catch (e) { return undefined; }
  }

  async function procesarCola() {
    if (geoBusy) return; geoBusy = true;
    while (cola.length) {
      const dir = cola.shift(); const p = await geocodificar(dir); enCola.delete(dir);
      if (p !== undefined) pintarMapa();
      await new Promise((r) => setTimeout(r, 1100)); // Nominatim pide máx. 1 consulta por segundo
    }
    geoBusy = false;
  }

  const icono = (color, ico) => L.divIcon({ className: '', html: '<span class="pin" style="background:' + color + '"><i class="bi ' + ico + '"></i></span>', iconSize: [26, 26], iconAnchor: [13, 13] });

  function pintarMapa() {
    if (!mapa) return;
    const abiertos = datos.servicios.filter((o) => grupoDe(o.status) !== 'closed').slice(0, 40);
    abiertos.forEach((o) => [o.pickupAddress, o.deliveryAddress].forEach((d) => {
      if (d && !(clave(d) in geoCache) && !enCola.has(d)) { enCola.add(d); cola.push(d); }
    }));
    const items = abiertos.map((o) => ({ o, p: geoCache[clave(o.pickupAddress)], d: geoCache[clave(o.deliveryAddress)] }));
    const ubicados = items.filter((i) => i.p || i.d).length;
    $('mapaInfo').textContent = abiertos.length ? ubicados + ' de ' + abiertos.length + ' servicios abiertos ubicados' + (ubicados < abiertos.length ? ' (algunas direcciones no se pudieron ubicar)' : '') : 'Sin servicios abiertos';
    const firma = items.map((i) => i.o.id + i.o.status + (i.p || '') + (i.d || '')).join('|');
    if (firma !== firmaMapa) {
      firmaMapa = firma; capa.clearLayers(); marcadores = {};
      items.forEach(({ o, p, d }) => {
        const c = COLOR[o.status], pop = '<strong>#' + o.id + '</strong> · ' + (ESTADO[o.status] || [o.status])[0] + '<br>Recogida: ' + esc(o.pickupAddress) + '<br>Entrega: ' + esc(o.deliveryAddress);
        const ms = [];
        if (p) ms.push(L.marker(p, { icon: icono(c, 'bi-box-seam') }));
        if (d) ms.push(L.marker(d, { icon: icono(c, 'bi-flag-fill') }));
        if (p && d) L.polyline([p, d], { color: c, weight: 3, dashArray: '6 6', opacity: .7 }).addTo(capa);
        ms.forEach((m) => { m.bindPopup(pop).on('click', () => resaltarTarjeta(o.id)).addTo(capa); });
        marcadores[o.id] = ms;
      });
      if (!ajustado && capa.getLayers().length) { ajustarVista(); ajustado = true; }
    }
    procesarCola();
  }

  function ajustarVista() {
    if (!mapa) return;
    const pts = []; capa.eachLayer((l) => { if (l.getLatLng) pts.push(l.getLatLng()); });
    pts.length ? mapa.fitBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 16 }) : mapa.setView([10.4631, -73.2532], 13);
  }

  function enfocarServicio(id) {
    const ms = marcadores[id]; if (!mapa || !ms || !ms.length) return;
    ms.length > 1 ? mapa.fitBounds(L.latLngBounds(ms.map((m) => m.getLatLng())), { padding: [80, 80], maxZoom: 16 }) : mapa.setView(ms[0].getLatLng(), 16);
    ms[0].openPopup();
  }

  function resaltarTarjeta(id) {
    const el = document.querySelector('.servicio[data-id="' + id + '"]'); if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1500);
  }

  function pantallaCompleta(on) {
    $('mapaCard').classList.toggle('mapa-full', on);
    document.body.classList.toggle('overflow-hidden', on);
    $('btnPantalla').innerHTML = '<i class="bi ' + (on ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen') + '"></i>';
  }

  // ---------- Vistas ----------
  function mostrarVista(v) {
    const u = v === 'usuarios';
    $('vista-dashboard').classList.toggle('d-none', u); $('vista-usuarios').classList.toggle('d-none', !u);
    $('tituloVista').textContent = u ? 'Usuarios' : 'Centro de control';
    document.querySelectorAll('[data-vista]').forEach((a) => a.classList.toggle('active', a.dataset.vista === (u ? 'usuarios' : 'dashboard')));
    bootstrap.Offcanvas.getInstance($('menu'))?.hide();
    setTimeout(() => mapa && mapa.invalidateSize(), 60);
  }
  window.addEventListener('hashchange', () => mostrarVista(location.hash.replace('#', '')));

  // ---------- Modales ----------
  $('modalServicio').addEventListener('show.bs.modal', () => {
    const cl = datos.clientes.filter(activo), ce = datos.centrales.filter(activo);
    const op = (l) => l.map((x) => '<option value="' + esc(x.document) + '">' + esc(x.name) + '</option>').join('');
    $('sClient').innerHTML = op(cl); $('sCentral').innerHTML = op(ce);
    $('avisoServicio').classList.toggle('d-none', cl.length > 0 && ce.length > 0);
  });
  document.addEventListener('shown.bs.modal', (e) => e.target.querySelector('input:not([type=hidden]),select')?.focus());
  document.addEventListener('hidden.bs.modal', (e) => {
    const f = e.target.querySelector('form'); if (!f) return;
    f.reset(); f.classList.remove('was-validated'); f.querySelector('.form-error')?.classList.add('d-none');
  });

  function abrirAsignar(id) {
    const act = datos.domiciliarios.filter(activo);
    $('asignarId').value = id; $('asignarTitulo').textContent = '#' + id;
    $('asignarCourier').innerHTML = act.map((d) => '<option value="' + esc(d.document) + '">' + esc(d.name) + ' · ' + esc(d.phone) + '</option>').join('');
    $('avisoAsignar').classList.toggle('d-none', act.length > 0);
    bootstrap.Modal.getOrCreateInstance($('modalAsignar')).show();
  }

  // ---------- Formularios ----------
  const V = (id) => $(id).value.trim();
  const formularios = {
    servicio: () => ['POST', '/api/services', { pickupAddress: V('sPickup'), deliveryAddress: V('sDelivery'), shippingCost: parseFloat($('sShipping').value), itemValue: parseFloat($('sItemVal').value),
      payAtPickup: $('sPayPickup').checked, description: V('sDesc'), client: { document: $('sClient').value }, central: { document: $('sCentral').value } }],
    cliente: () => ['POST', '/api/clients', { document: V('clDoc'), name: V('clName'), phone: V('clPhone'), address: V('clAddress'), status: 'ACTIVE' }],
    domiciliario: () => ['POST', '/api/couriers', { document: V('dDoc'), name: V('dName'), phone: V('dPhone'), status: 'ACTIVE' }],
    central: () => ['POST', '/api/centrals', { document: V('cDoc'), name: V('cName'), phone: V('cPhone'), status: 'ACTIVE' }],
    asignar: () => ['PATCH', '/api/services/' + $('asignarId').value + '/assign?courierDocument=' + encodeURIComponent($('asignarCourier').value)],
    cancelar: () => ['PATCH', '/api/services/' + $('cancelarId').value + '/cancel']
  };
  const OK = { servicio: 'Servicio creado', cliente: 'Cliente guardado', domiciliario: 'Domiciliario guardado', central: 'Central guardada', asignar: 'Domiciliario asignado', cancelar: 'Servicio cancelado' };

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-form]'); if (!form) return;
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); form.querySelector(':invalid')?.focus(); return; }
    const tipo = form.dataset.form, [m, url, body] = formularios[tipo]();
    const r = await ocupado(form.querySelector('[type=submit]'), () => api(m, url, body));
    if (r.ok) { cerrarModales(); toast(OK[tipo]); cargarDatos(); }
    else { const box = form.querySelector('.form-error'); box.textContent = r.msg; box.classList.remove('d-none'); }
  });

  // ---------- Clicks y teclado ----------
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (btn) {
      const id = btn.dataset.id;
      if (btn.dataset.action === 'asignar') abrirAsignar(id);
      if (btn.dataset.action === 'cancelar') { $('cancelarId').value = id; $('cancelarTitulo').textContent = '#' + id; bootstrap.Modal.getOrCreateInstance($('modalCancelar')).show(); }
      if (btn.dataset.action === 'estado') {
        const r = await ocupado(btn, () => api('PATCH', '/api/services/' + id + '/status?status=' + btn.dataset.status));
        if (r.ok) { toast(btn.dataset.status === 'DELIVERED' ? 'Servicio entregado' : 'Servicio en ruta'); cargarDatos(); } else toast(r.msg, 'danger');
      }
      return;
    }
    const f = e.target.closest('[data-filtro]');
    if (f) { filtroServicios = f.dataset.filtro; sessionStorage.setItem('sa_filtro', filtroServicios); pintarServicios(); return; }
    const t = e.target.closest('[data-tipo-filtro]');
    if (t) { filtroUsuarios = t.dataset.tipoFiltro; pintarUsuarios(); return; }
    const card = e.target.closest('.servicio'); if (card) enfocarServicio(card.dataset.id);
  });

  document.addEventListener('change', async (e) => {
    const sw = e.target.closest('[data-switch-estado]'); if (!sw) return;
    const r = await api('PATCH', sw.dataset.api + '/' + sw.dataset.doc + '/status?status=' + (sw.checked ? 'ACTIVE' : 'INACTIVE'));
    if (r.ok) { toast('Estado actualizado'); cargarDatos(); } else { sw.checked = !sw.checked; toast(r.msg, 'danger'); }
  });

  $('buscarUsuario').addEventListener('input', pintarUsuarios);
  $('buscarServicio').addEventListener('input', (e) => { textoServicios = e.target.value.trim(); pintarServicios(); });
  $('btnCentrar').addEventListener('click', ajustarVista);
  $('btnPantalla').addEventListener('click', () => pantallaCompleta(!$('mapaCard').classList.contains('mapa-full')));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $('mapaCard').classList.contains('mapa-full')) return pantallaCompleta(false);
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || document.querySelector('.modal.show') || e.ctrlKey || e.metaKey) return;
    if (e.key.toLowerCase() === 'n') { e.preventDefault(); bootstrap.Modal.getOrCreateInstance($('modalServicio')).show(); }
    if (e.key === '/') { e.preventDefault(); $('buscarServicio').focus(); }
  });

  // ---------- Arranque ----------
  iniciarMapa();
  mostrarVista(location.hash.replace('#', ''));
  cargarDatos();
  setInterval(() => { if (!document.hidden && !document.querySelector('.modal.show')) cargarDatos(); }, 15000);
})();
