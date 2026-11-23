'use strict';

/* =========================================================
   CONFIGURACIÓN DEL LOCAL  (el dueño edita solo este bloque)
   ========================================================= */
const CONFIG = {
  nombre: 'Bahía Burger',
  whatsapp: '59898110272',          // formato internacional, sin + ni espacios
  whatsappVisible: '+598 98110272',
  instagram: 'bahia_burger_',
  direccion: 'Paysandu, Uruguay',
  zonaHoraria: 'America/Uruguay/Montevideo',
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
   NAVEGACIÓN (una sola página con scroll suave)
   ========================================================= */
const Nav = {
  secciones: ['inicio', 'carta', 'contacto'],
  init() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-nav]');
      if (!el) return;
      e.preventDefault();
      const id = el.dataset.nav;
      $('#' + id).scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', '#' + id);
    });
    // Marca el enlace de la sección que se está viendo
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$('.nav__links a').forEach((a) => a.classList.toggle('is-active', a.dataset.nav === en.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    this.secciones.forEach((id) => obs.observe($('#' + id)));
  },
};

/* =========================================================
   CARTA VIRTUAL (se dibuja desde menuData.js)
   ========================================================= */
const money = (n) => '$' + n.toLocaleString('es-AR');
const Carta = {
  filtro: 'todos',
  init() {
    $('#tabs').innerHTML = MENU.categorias.map((c) =>
      `<button class="tab" role="tab" data-cat="${c.id}">${c.nombre}</button>`).join('');
    $('#tabs').addEventListener('click', (e) => {
      const t = e.target.closest('.tab');
      if (t) { this.filtro = t.dataset.cat; this.render(); }
    });
    $('#menuGrid').addEventListener('click', (e) => {
      const b = e.target.closest('[data-add]');
      if (b) this.personalizar(b.dataset.add);
    });
    this.render();
  },
  render() {
    $$('.tab').forEach((t) => {
      const on = t.dataset.cat === this.filtro;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
    });
    const lista = MENU.productos.filter((p) => this.filtro === 'todos' || p.cat === this.filtro);
    $('#menuGrid').innerHTML = lista.map((p) => {
      const esBurger = p.cat === 'hamburguesas';
      const precio = esBurger ? `Desde ${money(MENU.tamanos[0].precio)}` : money(p.precio);
      const foto = p.img ? `<img src="${p.img}" alt="${p.nombre}" loading="lazy">` : `<div class="slide__ph">${ICONO_BURGER}</div>`;
      return `<article class="card">
        <div class="card__img">${foto}</div>
        <div class="card__body">
          <h3 class="card__name">${p.nombre}</h3>
          <p class="card__desc">${p.ingredientes.join(', ')}.</p>
          <div class="card__foot"><span class="card__price">${precio}</span>
            <button class="btn btn--primary" data-add="${p.id}">Agregar / Personalizar</button></div>
        </div></article>`;
    }).join('');
  },
  personalizar(id) {
    // ETAPA 2 (siguiente paso): abre el modal de personalización
    Toast.mostrar('La personalización llega en el próximo paso.');
  },
};

const Toast = {
  t: null,
  mostrar(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('is-on');
    clearTimeout(this.t); this.t = setTimeout(() => el.classList.remove('is-on'), 2500);
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
  i: 0, pv: 1, timer: null, intervalo: 4500,
  porVista() { return innerWidth >= 1000 ? 3 : innerWidth >= 640 ? 2 : 1; },
  max() { return Math.max(0, GALERIA.length - this.pv); },
  init() {
    const track = $('#carouselTrack');
    GALERIA.forEach((s, idx) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = (s.img
        ? `<img src="${s.img}" alt="${s.nombre}" loading="${idx < 3 ? 'eager' : 'lazy'}">`
        : `<div class="slide__ph">${ICONO_BURGER}</div>`) +
        `<div class="slide__caption"><strong>${s.nombre}</strong><span>${s.detalle}</span></div>`;
      track.appendChild(slide);
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
    let x0 = null;
    car.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; this.pausar(); }, { passive: true });
    car.addEventListener('touchend', (e) => {
      if (x0 !== null) {
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) this.mostrar(this.i + (dx < 0 ? 1 : -1));
      }
      x0 = null; this.iniciar();
    });
    addEventListener('resize', () => this.layout());
    this.layout();
    this.iniciar();
  },
  layout() {
    this.pv = this.porVista();
    $('#carouselTrack').style.setProperty('--pv', this.pv);
    const dots = $('#carouselDots');
    dots.innerHTML = '';
    for (let n = 0; n <= this.max(); n++) {
      const d = document.createElement('button');
      d.setAttribute('aria-label', `Ir a la posición ${n + 1}`);
      d.addEventListener('click', () => { this.mostrar(n); this.iniciar(); });
      dots.appendChild(d);
    }
    this.mostrar(Math.min(this.i, this.max()));
  },
  mostrar(n) {
    const max = this.max();
    this.i = n > max ? 0 : n < 0 ? max : n;
    $('#carouselTrack').style.transform = `translateX(-${this.i * (100 / this.pv)}%)`;
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
  Carta.init();
  Nav.init();
});