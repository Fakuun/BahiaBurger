'use strict';

/* =========================================================
   CONFIGURACIÓN DEL LOCAL  (el dueño edita solo este bloque)
   ========================================================= */
const CONFIG = {
  nombre: 'Bahía Burger',
  whatsapp: '5493442000000',          // formato internacional, sin + ni espacios
  whatsappVisible: '+54 9 3442 00-0000',
  instagram: 'bahiaburger',
  direccion: 'Concepción del Uruguay, Entre Ríos',
  zonaHoraria: 'America/Argentina/Buenos_Aires',
  // Días: 0=Domingo, 1=Lunes ... 6=Sábado. "cierra: 24" = medianoche.
  horario: { dias: [4, 5, 6, 0], abre: 20, cierra: 24 },
};

/* Slides del carrusel. Para usar fotos reales: poné la ruta en "img",
   por ejemplo img: 'img/cheddar-burger.jpg'. Sin foto se muestra un placeholder. */
const GALERIA = [
  { nombre: 'Cheddar Burger', detalle: 'Cheddar, panceta y cebolla salteada', img: '' },
  { nombre: 'Dorito Burger',  detalle: 'Doritos, cheddar y cebolla crispy',   img: '' },
  { nombre: 'Barbacoa Burger', detalle: 'Barbacoa, cheddar y panceta',        img: '' },
  { nombre: 'Old Burger',     detalle: 'Huevo frito, panceta y cheddar',      img: '' },
  { nombre: 'Tuki Burger',    detalle: 'Alioli, aros de cebolla y panceta',   img: '' },
];

/* =========================================================
   UTILIDADES
   ========================================================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const NOMBRES_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const hh = (n) => String(n % 24).padStart(2, '0') + ':00';

/* Hora actual en la zona horaria del local (no depende del celular del cliente) */
function ahoraEnLocal() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CONFIG.zonaHoraria, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { dia, hora: (parseInt(get('hour'), 10) % 24) + parseInt(get('minute'), 10) / 60 };
}

/* =========================================================
   ESTADO ABIERTO / CERRADO
   ========================================================= */
function textoHorarios() {
  const { dias, abre, cierra } = CONFIG.horario;
  const orden = [1, 2, 3, 4, 5, 6, 0];
  const lista = orden.filter((d) => dias.includes(d));
  const rango = lista.length > 1
    ? `${cap(NOMBRES_DIA[lista[0]])} a ${NOMBRES_DIA[lista[lista.length - 1]]}`
    : cap(NOMBRES_DIA[lista[0]]);
  return `${rango} de ${hh(abre)} a ${hh(cierra)}`;
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function estaAbierto() {
  const { dias, abre, cierra } = CONFIG.horario;
  const { dia, hora } = ahoraEnLocal();
  return dias.includes(dia) && hora >= abre && hora < cierra;
}

function renderEstado() {
  const badge = $('#statusBadge');
  const abierto = estaAbierto();
  badge.textContent = abierto
    ? '● ABIERTO AHORA'
    : `● CERRADO (Abrimos a las ${hh(CONFIG.horario.abre)})`;
  badge.className = 'status__badge ' + (abierto ? 'is-open' : 'is-closed');
  $('#statusHours').textContent = textoHorarios();
}

/* =========================================================
   CONTACTO / FOOTER
   ========================================================= */
function renderContacto() {
  $('#waLink').href = `https://wa.me/${CONFIG.whatsapp}`;
  $('#waText').textContent = CONFIG.whatsappVisible;
  $('#igLink').href = `https://instagram.com/${CONFIG.instagram}`;
  $('#igText').textContent = '@' + CONFIG.instagram;
  $('#addrText').textContent = CONFIG.direccion;
  $('#footerHours').textContent = textoHorarios() + '. Solo delivery.';
  $('#year').textContent = new Date().getFullYear();
}

/* =========================================================
   ROUTER SPA (sin recargar)
   ========================================================= */
const Router = {
  vistas: ['inicio', 'carta'],
  ir(destino) {
    if (destino === 'contacto') {
      $('#contacto').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!this.vistas.includes(destino)) destino = 'inicio';
    $$('.view').forEach((v) => v.classList.toggle('is-active', v.dataset.view === destino));
    $$('.nav__links a').forEach((a) => a.classList.toggle('is-active', a.dataset.nav === destino));
    window.scrollTo({ top: 0 });
    if (location.hash !== '#' + destino) history.pushState(null, '', '#' + destino);
    if (destino === 'inicio') Carrusel.iniciar(); else Carrusel.pausar();
  },
  init() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-nav]');
      if (!el) return;
      e.preventDefault();
      this.ir(el.dataset.nav);
    });
    window.addEventListener('popstate', () => this.ir(location.hash.slice(1) || 'inicio'));
    this.ir(location.hash.slice(1) || 'inicio');
  },
};

/* =========================================================
   CARRITO (contador; la lógica completa llega en la Etapa 3)
   ========================================================= */
const Carrito = {
  items: [],
  total() { return this.items.reduce((n, i) => n + (i.cantidad || 1), 0); },
  renderContador() {
    const n = this.total();
    $('#cartCount').textContent = n;
    $('#cartBtn').setAttribute('aria-label', `Carrito, ${n} ítems`);
  },
};

/* =========================================================
   CARRUSEL
   ========================================================= */
const ICONO_BURGER = `<svg viewBox="0 0 64 64" fill="none" stroke="#FFA300" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 28c0-11 10-18 24-18s24 7 24 18z"/><path d="M6 36h52"/><path d="M8 43h48"/><path d="M10 50c0 4 4 6 8 6h28c4 0 8-2 8-6z"/></svg>`;

const Carrusel = {
  i: 0, timer: null, intervalo: 4500,
  init() {
    const track = $('#carouselTrack');
    const dots = $('#carouselDots');
    GALERIA.forEach((s, idx) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', `${idx + 1} de ${GALERIA.length}`);
      slide.innerHTML = (s.img
        ? `<img src="${s.img}" alt="${s.nombre}" loading="${idx ? 'lazy' : 'eager'}">`
        : `<div class="slide__ph">${ICONO_BURGER}</div>`) +
        `<div class="slide__caption"><strong>${s.nombre}</strong><span>${s.detalle}</span></div>`;
      track.appendChild(slide);

      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Ir a ${s.nombre}`);
      dot.addEventListener('click', () => { this.mostrar(idx); this.iniciar(); });
      dots.appendChild(dot);
    });

    $('#prevBtn').addEventListener('click', () => { this.mostrar(this.i - 1); this.iniciar(); });
    $('#nextBtn').addEventListener('click', () => { this.mostrar(this.i + 1); this.iniciar(); });

    const car = $('#carousel');
    car.addEventListener('mouseenter', () => this.pausar());
    car.addEventListener('mouseleave', () => this.iniciar());
    car.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.mostrar(this.i - 1);
      if (e.key === 'ArrowRight') this.mostrar(this.i + 1);
    });

    // Deslizar con el dedo
    let x0 = null;
    car.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; this.pausar(); }, { passive: true });
    car.addEventListener('touchend', (e) => {
      if (x0 !== null) {
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) this.mostrar(this.i + (dx < 0 ? 1 : -1));
      }
      x0 = null; this.iniciar();
    });

    this.mostrar(0);
  },
  mostrar(n) {
    const total = GALERIA.length;
    this.i = (n + total) % total;
    $('#carouselTrack').style.transform = `translateX(-${this.i * 100}%)`;
    $$('#carouselDots button').forEach((d, idx) => d.classList.toggle('is-active', idx === this.i));
  },
  iniciar() {
    this.pausar();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.timer = setInterval(() => this.mostrar(this.i + 1), this.intervalo);
  },
  pausar() { clearInterval(this.timer); },
};

/* =========================================================
   FASE 2 (futuro): conectar a base de datos / panel del dueño
   ========================================================= */
// async function enviarPedidoBackend(orderObject) {
//   const res = await fetch('https://TU-API/pedidos', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(orderObject),
//   });
//   return res.json();
// }

/* =========================================================
   ARRANQUE
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  renderContacto();
  renderEstado();
  setInterval(renderEstado, 60 * 1000);   // se actualiza solo cada minuto
  Carrito.renderContador();
  Carrusel.init();
  Router.init();
});