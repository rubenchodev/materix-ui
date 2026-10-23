const Le = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), H = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new Set(), Y = /* @__PURE__ */ new WeakMap();
function et(e) {
  return typeof WeakRef == "function" ? new WeakRef(e) : { deref: () => e };
}
function Me(e) {
  H.delete(e);
  const t = Y.get(e);
  t && W.delete(t), Y.delete(e);
}
function Yt(e, t) {
  Le.set(e, t);
}
function _(e) {
  return I.get(e);
}
function Z(e, t) {
  if (!e || !e.nodeType || !t) return;
  I.set(e, t);
  let n = P.get(t);
  n || (n = /* @__PURE__ */ new Set(), P.set(t, n)), n.add(e);
}
function Zt(e) {
  if (!e || !e.nodeType) return;
  const t = I.get(e);
  I.delete(e);
  const n = t && P.get(t);
  n && n.delete(e);
}
function Qt(e, t) {
  if (!e || !t) return;
  let n = H.get(e);
  if (!n) {
    n = /* @__PURE__ */ new Set(), H.set(e, n);
    const r = et(e);
    Y.set(e, r), W.add(r);
  }
  n.add(t);
}
function Te(e) {
  const t = [];
  return Array.from(W).forEach((n) => {
    const r = n.deref();
    if (!r || r.destroyed) {
      W.delete(n), r && Me(r);
      return;
    }
    const o = H.get(r) || [];
    for (const i of o)
      if (i === e || e.contains && e.contains(i)) {
        t.push(r);
        break;
      }
  }), t;
}
function oe(e) {
  if (!e) return;
  Me(e);
  const t = P.get(e);
  t && (t.forEach((n) => {
    I.get(n) === e && I.delete(n), n.removeAttribute && n.removeAttribute("data-mtx-initialized");
  }), P.delete(e));
}
function ie(e) {
  try {
    !e.destroyed && typeof e.destroy == "function" && e.destroy();
  } finally {
    oe(e);
  }
}
function tt(e) {
  const t = _(e);
  if (!t) return !1;
  try {
    ie(t);
  } finally {
    e.removeAttribute && e.removeAttribute("data-mtx-initialized");
  }
  return !0;
}
function Q(e) {
  try {
    return e(), !0;
  } catch (t) {
    return typeof console < "u" && console.error("[Materix UI] Error al destruir una instancia:", t), !1;
  }
}
function nt(e = document) {
  let t = 0;
  if (!e || typeof e.querySelectorAll != "function") return t;
  const n = Array.from(e.querySelectorAll("[data-mtx-initialized]"));
  return e.nodeType === Node.ELEMENT_NODE && e.hasAttribute("data-mtx-initialized") && n.unshift(e), n.reverse().forEach((r) => {
    _(r) && (Q(() => tt(r)), t++);
  }), e !== document && Te(e).forEach((r) => {
    r.destroyed || (Q(() => ie(r)), t++);
  }), t;
}
function R(e, t) {
  if (!e || e.nodeType !== 1 || typeof e.getAttribute != "function") return null;
  const n = typeof t == "string" ? t : null, r = n || e.getAttribute("data-mtx");
  if (!r) return null;
  n && !e.hasAttribute("data-mtx") && e.setAttribute("data-mtx", n);
  const o = _(e);
  if (o) return o;
  const i = Le.get(r);
  if (!i) return null;
  const c = e, s = new i(e);
  return Z(c, s), s.element && Z(s.element, s), c.setAttribute("data-mtx-initialized", ""), s;
}
function Xt(e, t) {
  return R(e, t);
}
function rt(e = document) {
  if (!(!e || typeof e.querySelectorAll != "function")) {
    e.nodeType === Node.ELEMENT_NODE && e.matches("[data-mtx]:not([data-mtx-initialized])") && R(e);
    for (let t = 0; t < 5; t++) {
      const n = e.querySelectorAll("[data-mtx]:not([data-mtx-initialized])");
      if (!n.length) break;
      let r = 0;
      if (n.forEach((o) => {
        _(o) || R(o) && r++;
      }), !r) break;
    }
  }
}
function ot(e) {
  if (!e.isConnected) {
    if (e.nodeType === Node.ELEMENT_NODE) {
      nt(e);
      return;
    }
    Te(e).forEach((t) => {
      Q(() => ie(t));
    });
  }
}
function en(e = document, t = {}) {
  const { destroyOnRemove: n = !1 } = t || {}, r = new MutationObserver((o) => {
    o.forEach((i) => {
      n && i.removedNodes.forEach(ot), i.addedNodes.forEach((c) => {
        c.nodeType !== Node.ELEMENT_NODE || !c.isConnected || (c.hasAttribute && c.hasAttribute("data-mtx") && R(c), c.querySelectorAll && c.querySelectorAll("[data-mtx]").forEach((s) => R(s)));
      });
    });
  });
  return r.observe(e, { childList: !0, subtree: !0 }), r;
}
function it(e, t) {
  const n = (r, o) => typeof o == "function" && o !== st && r instanceof o;
  return n(e, t.constructor) || n(t, e.constructor);
}
function at(e, t) {
  if (!e || !e.nodeType) return;
  const n = _(e);
  if (!(!n || n === t || !it(n, t)))
    try {
      !n.destroyed && typeof n.destroy == "function" && n.destroy();
    } catch {
    } finally {
      oe(n);
    }
}
class st {
  /**
   * Crea la instancia base del componente.
   *
   * Si el elemento ya tiene una instancia del MISMO componente (misma clase o una subclase
   * en cualquier sentido, p. ej. `new Button(el)` dos veces o `new MyButton(el)` sobre un
   * Button), la anterior se destruye antes de registrar la nueva, para no duplicar listeners.
   * Instancias de otras clases sobre el mismo nodo (Tooltip declarativo, TextField interno
   * de DateTimePicker) se conservan.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    this._cleanups = [], this.element = t, at(t, this), t && t.setAttribute && t.setAttribute("data-mtx-initialized", ""), Z(t, this);
  }
  /**
   * Añade un listener que se retira automáticamente en `destroy()`.
   *
   * @param {EventTarget} target Destino (elemento, `document`, `window`...).
   * @param {string} type Tipo de evento.
   * @param {Function} handler Manejador.
   * @param {boolean|AddEventListenerOptions} [options] Opciones del listener.
   * @returns {Function} Función que retira el listener de forma anticipada.
   */
  listen(t, n, r, o) {
    if (!t || typeof t.addEventListener != "function") return () => {
    };
    t.addEventListener(n, r, o);
    const i = () => t.removeEventListener(n, r, o);
    return this.onDestroy(i), i;
  }
  /**
   * Registra una limpieza adicional (observers, temporizadores, nodos portados...).
   *
   * @param {Function} cleanup Función a ejecutar en `destroy()`.
   */
  onDestroy(t) {
    this._cleanups || (this._cleanups = []), typeof t == "function" && this._cleanups.push(t);
  }
  /**
   * Libera listeners y limpiezas registradas y desvincula la instancia del registro.
   * No deshace el auto-scaffolding del DOM. Las subclases que sobrescriban
   * `destroy()` deben llamar a `super.destroy()`. Es idempotente.
   */
  destroy() {
    const t = this._cleanups || [];
    for (this._cleanups = []; t.length; )
      try {
        t.pop()();
      } catch {
      }
    oe(this), this.element && this.element.removeAttribute && this.element.removeAttribute("data-mtx-initialized"), this.destroyed = !0;
  }
  /**
   * Indica si el componente está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.element.disabled === !0;
  }
  /**
   * Deshabilita el componente.
   */
  disable() {
    this.element.disabled = !0;
  }
  /**
   * Habilita el componente.
   */
  enable() {
    this.element.disabled = !1;
  }
}
const ct = "mtx-ripple", me = ["pointerup", "pointercancel", "pointerleave"], he = "mtx-ripple-container", pe = "mtx-ripple--finishing", Ce = 550, lt = Ce * 2;
function ut() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function dt(e) {
  if (e.classList.contains(pe)) return;
  e.classList.add(pe);
  let t = 0;
  const n = () => {
    clearTimeout(t), e.removeEventListener("animationend", n), e.parentElement && e.parentElement.removeChild(e);
  };
  e.addEventListener("animationend", n), t = setTimeout(n, lt);
}
function ft(e, t, n) {
  let r = e.querySelector(`.${he}`);
  r || (r = document.createElement("span"), r.className = he, e.appendChild(r));
  const o = e.getBoundingClientRect(), i = Math.max(Math.abs(o.width - t), t) * 2 + 2, c = Math.max(Math.abs(o.height - n), n) * 2 + 2, s = Math.sqrt(i * i + c * c), l = document.createElement("span");
  return l.className = ct, l.style.width = l.style.height = `${s}px`, l.style.left = `${t - s / 2}px`, l.style.top = `${n - s / 2}px`, r.appendChild(l), l;
}
function tn(e, t, n = {}) {
  if (ut()) return;
  const { centered: r = !1, interactionTarget: o = e } = n, i = e.getBoundingClientRect(), c = r ? i.width / 2 : (t.clientX || 0) - i.left, s = r ? i.height / 2 : (t.clientY || 0) - i.top, l = ft(e, c, s), f = performance.now(), d = () => {
    me.forEach((m) => o.removeEventListener(m, d));
    const g = performance.now() - f, u = Math.max(Ce - g, 0);
    setTimeout(() => dt(l), u);
  };
  me.forEach((g) => o.addEventListener(g, d));
}
let ge = 0;
function nn(e = "mtx") {
  let t;
  do
    ge += 1, t = `${e}-${ge}`;
  while (typeof document < "u" && document.getElementById(t));
  return t;
}
function ae(e, t, n, r = {}) {
  if (!e || typeof e.dispatchEvent != "function") return !0;
  const {
    aliases: o = [],
    bubbles: i = !0,
    cancelable: c = !1,
    composed: s = !1
  } = r, l = { bubbles: i, cancelable: c, composed: s };
  n !== void 0 && (l.detail = n);
  let f = e.dispatchEvent(new CustomEvent(t, l));
  return o.forEach((d) => {
    !d || d === t || e.dispatchEvent(new CustomEvent(d, l)) || (f = !1);
  }), f;
}
let U = !1;
function rn() {
  if (typeof document > "u" || U) return;
  U = !0;
  const e = () => {
    U = !1, rt();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e, { once: !0 }) : queueMicrotask(e);
}
const mt = {
  code: "en",
  name: "English",
  drawer: {
    close: "Close"
  },
  appBar: {
    openNavigation: "Open navigation"
  },
  dateTimePicker: {
    today: "Today",
    cancel: "Cancel",
    ok: "OK",
    date: "Date",
    time: "Time",
    dates: "Dates",
    start: "Start",
    end: "End",
    startTimeHeader: "START TIME",
    endTimeHeader: "END TIME",
    selectRange: "Select range",
    selectEnd: "Select end date",
    enterTime: "Enter time",
    selectTime: "Select time",
    hour: "Hour",
    minute: "Minute",
    switchToClock: "Switch to clock view",
    switchToKeyboard: "Enter time with keyboard",
    chooseDate: "Choose date",
    chooseTime: "Choose time",
    chooseDateTime: "Choose date and time",
    chooseDateRange: "Choose date range",
    chooseWithValue: "{label}, selected: {value}",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    chooseMonth: "Choose month",
    chooseYear: "Choose year",
    monthViewLabel: "{month}, choose month",
    yearViewLabel: "{year}, choose year",
    selectHours: "Select hours",
    selectMinutes: "Select minutes",
    hoursValue: "{value} hours",
    minutesValue: "{value} minutes",
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    monthsShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    weekdays: ["S", "M", "T", "W", "T", "F", "S"],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  select: {
    searchPlaceholder: "Search…",
    searchAriaLabel: "Search options",
    noneResultsText: 'No results found for "{0}"',
    selectAllText: "Select all",
    deselectAllText: "Deselect all",
    selectedCountSingular: "{0} selected",
    selectedCountPlural: "{0} selected"
  },
  tablePagination: {
    rowsPerPage: "Rows per page:",
    all: "All",
    of: "of",
    moreThan: "more than",
    firstPage: "First page",
    previousPage: "Previous page",
    nextPage: "Next page",
    lastPage: "Last page"
  },
  breadcrumbs: {
    label: "breadcrumb",
    showPath: "Show path"
  },
  pagination: {
    label: "pagination navigation",
    page: "page {page}",
    goToPage: "Go to page {page}",
    first: "Go to first page",
    previous: "Go to previous page",
    next: "Go to next page",
    last: "Go to last page"
  },
  textField: {
    showPassword: "Show password",
    counterWords: "{count} words",
    counterWordsShort: "{value} words",
    counterCharsShort: "{value} chars"
  },
  dialog: {
    cancel: "Cancel",
    ok: "OK"
  },
  stepper: {
    optional: "Optional",
    step: "Step {n} of {total}",
    completed: "completed",
    error: "error",
    back: "Back",
    next: "Next",
    fraction: "{n} / {total}"
  },
  progress: {
    loading: "Loading"
  },
  alert: {
    close: "Close"
  },
  chip: {
    delete: "Delete"
  },
  autocomplete: {
    clear: "Clear",
    open: "Open",
    close: "Close",
    noOptions: "No options",
    loading: "Loading…",
    more: "+{0}",
    result: "1 result available",
    results: "{0} results available",
    invalid: "Select an option from the list."
  },
  avatarGroup: {
    surplus: "{count} more"
  },
  speedDial: {
    actions: "Actions"
  },
  card: {
    actions: "Actions"
  },
  slider: {
    minimum: "Minimum",
    maximum: "Maximum",
    thumbLabel: "{label}: {thumb}"
  },
  rating: {
    star: "{value} Star",
    stars: "{value} Stars",
    empty: "Empty",
    readOnly: "Rated {value} out of {max}"
  },
  theme: {
    toggle: "Dark theme",
    switchToDark: "Switch to dark theme",
    switchToLight: "Switch to light theme",
    light: "Light theme",
    dark: "Dark theme",
    system: "System theme"
  }
}, ht = {
  code: "es",
  name: "Español",
  drawer: {
    close: "Cerrar"
  },
  appBar: {
    openNavigation: "Abrir navegación"
  },
  dateTimePicker: {
    today: "Hoy",
    cancel: "Cancelar",
    ok: "Aceptar",
    date: "Fecha",
    time: "Hora",
    dates: "Fechas",
    start: "Inicio",
    end: "Fin",
    startTimeHeader: "HORA DE INICIO",
    endTimeHeader: "HORA DE FIN",
    selectRange: "Selecciona rango",
    selectEnd: "Selecciona fin",
    enterTime: "Ingresar hora",
    selectTime: "Seleccionar hora",
    hour: "Hora",
    minute: "Minuto",
    switchToClock: "Cambiar a reloj radial",
    switchToKeyboard: "Introducir hora con teclado",
    chooseDate: "Elegir fecha",
    chooseTime: "Elegir hora",
    chooseDateTime: "Elegir fecha y hora",
    chooseDateRange: "Elegir rango de fechas",
    chooseWithValue: "{label}, seleccionado: {value}",
    previousMonth: "Mes anterior",
    nextMonth: "Mes siguiente",
    chooseMonth: "Elegir mes",
    chooseYear: "Elegir año",
    monthViewLabel: "{month}, elegir mes",
    yearViewLabel: "{year}, elegir año",
    selectHours: "Seleccionar horas",
    selectMinutes: "Seleccionar minutos",
    hoursValue: "{value} horas",
    minutesValue: "{value} minutos",
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ],
    monthsShort: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic"
    ],
    weekdays: ["D", "L", "M", "M", "J", "V", "S"],
    weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  },
  select: {
    searchPlaceholder: "Buscar…",
    searchAriaLabel: "Buscar opciones",
    noneResultsText: 'No se encontraron resultados para "{0}"',
    selectAllText: "Seleccionar todo",
    deselectAllText: "Deseleccionar todo",
    selectedCountSingular: "{0} seleccionado",
    selectedCountPlural: "{0} seleccionados"
  },
  tablePagination: {
    rowsPerPage: "Filas por página:",
    all: "Todas",
    of: "de",
    moreThan: "más de",
    firstPage: "Primera página",
    previousPage: "Página anterior",
    nextPage: "Página siguiente",
    lastPage: "Última página"
  },
  breadcrumbs: {
    label: "ruta de navegación",
    showPath: "Mostrar ruta"
  },
  pagination: {
    label: "navegación de paginación",
    page: "página {page}",
    goToPage: "Ir a la página {page}",
    first: "Ir a la primera página",
    previous: "Ir a la página anterior",
    next: "Ir a la página siguiente",
    last: "Ir a la última página"
  },
  textField: {
    showPassword: "Mostrar contraseña",
    counterWords: "{count} palabras",
    counterWordsShort: "{value} pal.",
    counterCharsShort: "{value} car."
  },
  dialog: {
    cancel: "Cancelar",
    ok: "Aceptar"
  },
  stepper: {
    optional: "Opcional",
    step: "Paso {n} de {total}",
    completed: "completado",
    error: "error",
    back: "Atrás",
    next: "Siguiente",
    fraction: "{n} / {total}"
  },
  progress: {
    loading: "Cargando"
  },
  alert: {
    close: "Cerrar"
  },
  chip: {
    delete: "Eliminar"
  },
  autocomplete: {
    clear: "Borrar",
    open: "Abrir",
    close: "Cerrar",
    noOptions: "Sin opciones",
    loading: "Cargando…",
    more: "+{0}",
    result: "1 resultado disponible",
    results: "{0} resultados disponibles",
    invalid: "Selecciona una opción de la lista."
  },
  avatarGroup: {
    surplus: "{count} más"
  },
  speedDial: {
    actions: "Acciones"
  },
  card: {
    actions: "Acciones"
  },
  slider: {
    minimum: "Mínimo",
    maximum: "Máximo",
    thumbLabel: "{label}: {thumb}"
  },
  rating: {
    star: "{value} estrella",
    stars: "{value} estrellas",
    empty: "Sin valoración",
    readOnly: "Valoración: {value} de {max}"
  },
  theme: {
    toggle: "Tema oscuro",
    switchToDark: "Cambiar a tema oscuro",
    switchToLight: "Cambiar a tema claro",
    light: "Tema claro",
    dark: "Tema oscuro",
    system: "Tema del sistema"
  }
}, h = {
  en: mt,
  es: ht
};
let M = "en", se = !1;
function Ie(e) {
  if (!e || typeof e != "string") return null;
  const t = e.toLowerCase().trim();
  if (h[t]) return t;
  const n = t.split("-")[0];
  return h[n] ? n : null;
}
function Oe(e, t) {
  const n = { ...e };
  return J(e) && J(t) && Object.keys(t).forEach((r) => {
    J(t[r]) && r in e ? n[r] = Oe(e[r], t[r]) : n[r] = t[r];
  }), n;
}
function J(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
function pt(e, t) {
  return typeof e != "string" || !t ? e : Array.isArray(t) ? e.replace(/\{(\d+)\}/g, (n, r) => {
    const o = parseInt(r, 10);
    return t[o] !== void 0 ? String(t[o]) : n;
  }) : typeof t == "object" ? e.replace(/\{([a-zA-Z0-9_-]+)\}/g, (n, r) => t[r] !== void 0 ? String(t[r]) : n) : e;
}
function ce() {
  return $();
}
function gt(e) {
  if (!e || typeof e != "string") return !1;
  const t = e.toLowerCase().trim();
  if (h[t])
    M = t;
  else {
    const n = t.split("-")[0];
    if (h[n])
      M = n;
    else
      return console.warn(`[Materix UI i18n] El idioma "${e}" no está registrado. Manteniendo "${ce()}".`), !1;
  }
  return se = !0, typeof document < "u" && ae(document, "mtx:locale:change", { locale: M }, { aliases: ["mtx:localechange"] }), !0;
}
function yt() {
  M = "en", se = !1, typeof document < "u" && ae(document, "mtx:locale:change", { locale: ce() }, { aliases: ["mtx:localechange"] });
}
function De(e, t) {
  if (!e || typeof e != "string" || !t) return;
  const n = e.toLowerCase().trim();
  h[n] = {
    ...t,
    code: n
  };
}
function bt(e, t) {
  if (!e || typeof e != "string" || !t) return;
  const n = e.toLowerCase().trim();
  h[n] ? h[n] = Oe(h[n], t) : De(n, t);
}
function ke(e = null) {
  const t = e ? String(e).toLowerCase().trim() : $();
  return h[t] || h.en;
}
function F(e, t, n = null, r = null, o = null) {
  let s = (ke(o)[e] || h.en && h.en[e] || {})[t];
  return s === void 0 && (h.en && h.en[e] && h.en[e][t] !== void 0 ? s = h.en[e][t] : s = r !== null ? r : t), typeof s == "string" && n ? pt(s, n) : s;
}
function $() {
  if (se) return M;
  const e = typeof document < "u" ? document.documentElement : null;
  return e && Ie(e.getAttribute("lang")) || M;
}
function Pe(e) {
  if (!e || typeof e.getAttribute != "function")
    return $();
  const t = typeof document < "u" ? document.documentElement : null;
  for (let n = e; n && n.nodeType === 1; n = n.parentElement) {
    const r = n.getAttribute("data-locale") || n.getAttribute("data-lang") || (n !== t ? n.getAttribute("lang") : null);
    if (r) {
      const o = Ie(r);
      if (o) return o;
      break;
    }
  }
  return $();
}
const on = {
  getLocale: ce,
  setLocale: gt,
  resetLocale: yt,
  addLocale: De,
  updateLocale: bt,
  getDictionary: ke,
  t: F,
  getComponentLocale: Pe
};
function an(e = "mtx-portal") {
  let t = document.getElementById(e);
  return t || (t = document.createElement("div"), t.id = e, t.style.position = "fixed", t.style.top = "0", t.style.left = "0", t.style.width = "0", t.style.height = "0", t.style.overflow = "visible", t.style.zIndex = "1300", t.style.pointerEvents = "none", document.body.appendChild(t)), t;
}
const Re = ["top", "right", "bottom", "left"], X = { top: "bottom", bottom: "top", left: "right", right: "left" };
function Ne(e) {
  const [t, n] = String(e || "bottom").trim().split("-");
  return {
    side: Re.includes(t) ? t : "bottom",
    align: n === "start" || n === "end" ? n : ""
  };
}
function _e(e) {
  const t = e && e.nodeType === 1 ? e : document.documentElement, n = t.closest ? t.closest("[dir]") : null;
  if (n) return n.getAttribute("dir").toLowerCase() === "rtl";
  try {
    return getComputedStyle(t).direction === "rtl";
  } catch {
    return !1;
  }
}
function ze() {
  const e = document.documentElement;
  return {
    width: e.clientWidth || window.innerWidth || 0,
    height: e.clientHeight || window.innerHeight || 0
  };
}
function vt(e) {
  const t = e.offsetWidth, n = e.offsetHeight;
  if (t || n) return { width: t, height: n };
  const r = e.getBoundingClientRect();
  return { width: r.width, height: r.height };
}
function ye(e, t, n, r, o) {
  let i, c;
  return n === "top" || n === "bottom" ? (c = n === "top" ? e.top - t.height - o : e.bottom + o, r === "start" ? i = e.left : r === "end" ? i = e.right - t.width : i = e.left + e.width / 2 - t.width / 2) : (i = n === "left" ? e.left - t.width - o : e.right + o, r === "start" ? c = e.top : r === "end" ? c = e.bottom - t.height : c = e.top + e.height / 2 - t.height / 2), { x: i, y: c };
}
function be(e, t, n, r, o) {
  switch (n) {
    case "top":
      return Math.max(0, o - e.y);
    case "bottom":
      return Math.max(0, e.y + t.height - (r.height - o));
    case "left":
      return Math.max(0, o - e.x);
    default:
      return Math.max(0, e.x + t.width - (r.width - o));
  }
}
function j(e, t, n) {
  return n < t ? t : Math.min(Math.max(e, t), n);
}
function wt(e, t, n = {}) {
  const {
    placement: r = "bottom",
    offset: o = 8,
    flip: i = !0,
    shift: c = !0,
    padding: s = 8
  } = n, l = typeof n.rtl == "boolean" ? n.rtl : _e(e), f = e.getBoundingClientRect(), d = vt(t), g = ze(), u = Ne(r);
  let m = u.side;
  const q = m === "top" || m === "bottom";
  let v = u.align;
  l && q && v && (v = v === "start" ? "end" : "start");
  let p = ye(f, d, m, v, o);
  if (i) {
    const de = be(p, d, m, g, s);
    if (de > 0) {
      const K = X[m], fe = ye(f, d, K, v, o);
      be(fe, d, K, g, s) < de && (m = K, p = fe);
    }
  }
  let { x, y: E } = p;
  const D = m === "top" || m === "bottom";
  c && (D ? x = j(x, s, g.width - s - d.width) : E = j(E, s, g.height - s - d.height));
  const S = D ? d.width : d.height, G = D ? f.left + f.width / 2 - x : f.top + f.height / 2 - E, Xe = j(G, Math.min(12, S / 2), S - Math.min(12, S / 2));
  return {
    x: Math.round(x),
    y: Math.round(E),
    placement: u.align ? `${m}-${u.align}` : m,
    side: m,
    align: v,
    arrowOffset: Math.round(Xe)
  };
}
function sn(e, t, n) {
  let r = !0;
  const o = () => {
    r && n();
  }, i = { capture: !0, passive: !0 };
  window.addEventListener("scroll", o, i), window.addEventListener("resize", o, { passive: !0 });
  let c = null;
  return typeof ResizeObserver < "u" && (c = new ResizeObserver(o), e && e.nodeType === 1 && c.observe(e), t && t.nodeType === 1 && c.observe(t)), n(), function() {
    r = !1, window.removeEventListener("scroll", o, i), window.removeEventListener("resize", o, { passive: !0 }), c && c.disconnect();
  };
}
function cn(e, t, n = {}) {
  const { placement: r = "bottom-start", offset: o = 4, padding: i = 8, matchWidth: c = !1 } = n, s = Re.includes(n.lockSide) ? n.lockSide : null, l = typeof n.rtl == "boolean" ? n.rtl : _e(e), f = e.getBoundingClientRect(), d = ze(), g = Ne(r);
  let u = g.side, m;
  const q = s && (s === "top" || s === "bottom") == (u === "top" || u === "bottom");
  if (q)
    u = s, m = u === "top" ? Math.max(0, f.top - i - o) : u === "bottom" ? Math.max(0, d.height - i - f.bottom - o) : Math.max(0, d.height - i * 2);
  else if (u === "top" || u === "bottom") {
    const x = Math.max(0, d.height - i - f.bottom - o), E = Math.max(0, f.top - i - o), D = (n.content || t).scrollHeight, S = u === "top" ? E : x, G = u === "top" ? x : E;
    D > S && G > S && (u = X[u]), m = u === "top" ? E : x;
  } else
    l && (u = X[u]), m = Math.max(0, d.height - i * 2);
  t.style.position = "fixed", t.style.maxHeight = `${m}px`, t.style.maxWidth = `${Math.max(0, d.width - i * 2)}px`, c && (t.style.minWidth = `${f.width}px`);
  const v = u === "top" || u === "bottom", p = wt(e, t, {
    placement: g.align ? `${u}-${g.align}` : u,
    offset: o,
    padding: i,
    flip: !v && !q,
    shift: !0,
    rtl: l
  });
  return t.style.left = `${p.x}px`, t.style.top = `${p.y}px`, t.style.transformOrigin = v ? p.side === "top" ? "bottom" : "top" : `${p.side === "left" ? "right" : "left"} top`, t.dataset.placement = p.side, { x: p.x, y: p.y, placement: p.placement, side: p.side, maxHeight: m };
}
const ve = { snackbar: 0, modal: 1, popup: 1, tooltip: 2 }, qe = "__mtxEscapeHandled", b = [], O = /* @__PURE__ */ new Map();
let xt = 0, we = !1;
function Et(e) {
  if (typeof e == "function") return () => [].concat(e() || []).filter(Boolean);
  const t = [].concat(e || []).filter(Boolean);
  return () => t;
}
function Fe(e) {
  return b.find((t) => t.owner === e);
}
function At(e) {
  return e.slice().sort((t, n) => t.priority - n.priority || t.order - n.order);
}
function St(e) {
  if (e.key !== "Escape" || e.isComposing || e.defaultPrevented || e[qe]) return;
  const t = le(!0);
  t && (Ct(e), typeof t.onEscape == "function" && t.onEscape(e));
}
function He() {
  for (let e = b.length - 1; e >= 0; e -= 1) {
    const t = b[e].nodes();
    if (t.length && t.every((n) => !n.isConnected)) {
      const [n] = b.splice(e, 1);
      $e(n.owner);
    }
  }
}
function Lt() {
  we || typeof document > "u" || (we = !0, document.addEventListener("keydown", St));
}
function le(e) {
  He();
  const t = At(e ? b : b.filter((n) => !n.transient));
  return t[t.length - 1] || null;
}
function ln(e, { kind: t = "popup", onEscape: n = null, nodes: r, stack: o } = {}) {
  if (!e) return 0;
  Lt(), Tt(e), He();
  const i = b.filter((c) => c.priority === 1).length;
  return i > 0 && o && ve[t] !== 2 && [].concat((typeof o == "function" ? o() : o) || []).forEach((s) => s && s.node && Mt(e, s.node, 2 * i + (s.offset || 0))), b.push({
    owner: e,
    kind: t,
    priority: ve[t] ?? 1,
    transient: t === "tooltip",
    order: ++xt,
    onEscape: n,
    nodes: Et(r)
  }), i;
}
function We(e) {
  const t = O.get(e);
  if (!t) return;
  if (!t.claims.size) {
    e.style.zIndex = t.original, O.delete(e);
    return;
  }
  const n = Math.max(...t.claims.values());
  e.style.zIndex = `calc(var(--mtx-z-index-modal, 1300) + ${n})`;
}
function Mt(e, t, n) {
  if (!t.style) return;
  let r = O.get(t);
  r || (r = { original: t.style.zIndex, claims: /* @__PURE__ */ new Map() }, O.set(t, r)), r.claims.set(e, n), We(t);
}
function $e(e) {
  Array.from(O.keys()).forEach((t) => {
    const n = O.get(t);
    n && n.claims.delete(e) && We(t);
  });
}
function Tt(e) {
  const t = b.findIndex((n) => n.owner === e);
  t >= 0 && b.splice(t, 1), $e(e);
}
function un(e) {
  const t = Fe(e);
  if (!t) return !1;
  const n = le(t.transient);
  return !!(n && n.owner === e);
}
function dn() {
  const e = le(!0);
  return e ? e.owner : null;
}
function fn(e, t) {
  if (!t || typeof t != "object") return !1;
  const n = Fe(e), r = n ? n.order : -1 / 0;
  return b.some((o) => o !== n && o.order > r && o.kind !== "snackbar" && o.nodes().some((i) => i === t || i.contains && i.contains(t)));
}
function Ct(e) {
  if (e) {
    try {
      e[qe] = !0;
    } catch {
    }
    e.cancelable && e.preventDefault();
  }
}
const y = [];
let ee = "", B = !1, T = null;
function It(e) {
  return !!(e && typeof e == "object" && e.isConnected === !1);
}
function Ot() {
  B || typeof document > "u" || !document.body || (ee = document.body.style.overflow, document.body.style.overflow = "hidden", B = !0, kt());
}
function Dt() {
  B && (B = !1, Pt(), !(typeof document > "u" || !document.body) && (document.body.style.overflow === "hidden" && (document.body.style.overflow = ee), ee = ""));
}
function V(e) {
  for (let t = y.length - 1; t >= 0; t -= 1)
    y[t] !== e && It(y[t]) && y.splice(t, 1);
  y.length === 0 && Dt();
}
function kt() {
  T || typeof MutationObserver > "u" || typeof document > "u" || (T = new MutationObserver(() => V()), T.observe(document.documentElement || document, { childList: !0, subtree: !0 }));
}
function Pt() {
  T && (T.disconnect(), T = null);
}
function mn(e) {
  const t = y.indexOf(e);
  t >= 0 && y.splice(t, 1), V(e), y.push(e), Ot();
}
function hn(e) {
  const t = y.lastIndexOf(e);
  t >= 0 && y.splice(t, 1), V();
}
function pn(e) {
  return V(), y[y.length - 1] === e;
}
const Rt = ["light", "dark", "system"], Be = "mtx-theme", Ve = "theme", Ge = "[data-mtx-theme-toggle]", a = {
  initialized: !1,
  mode: "light",
  resolved: "light",
  storageKey: null,
  query: null,
  media: null,
  observer: null
}, xe = /* @__PURE__ */ new WeakSet(), Ee = /* @__PURE__ */ new WeakSet();
function z() {
  return typeof document < "u" ? document.documentElement : null;
}
function w(e) {
  const t = typeof e == "string" ? e.trim().toLowerCase() : "";
  return Rt.includes(t) ? t : null;
}
function Nt() {
  if (!a.media && typeof window < "u" && typeof window.matchMedia == "function") {
    a.media = window.matchMedia("(prefers-color-scheme: dark)");
    const e = () => {
      a.mode === "system" && N("system", !1);
    };
    a.media && typeof a.media.addEventListener == "function" ? a.media.addEventListener("change", e) : a.media && typeof a.media.addListener == "function" && a.media.addListener(e);
  }
  return !!(a.media && a.media.matches);
}
function te(e) {
  return e === "system" ? Nt() ? "dark" : "light" : e === "dark" ? "dark" : "light";
}
function Ke() {
  if (!a.storageKey) return null;
  try {
    return w(localStorage.getItem(a.storageKey));
  } catch {
    return null;
  }
}
function _t(e) {
  if (a.storageKey)
    try {
      localStorage.setItem(a.storageKey, e);
    } catch {
    }
}
function Ue() {
  if (!a.query || typeof window > "u" || !window.location) return null;
  try {
    return w(new URLSearchParams(window.location.search).get(a.query));
  } catch {
    return null;
  }
}
function Je(e) {
  ae(
    document,
    "mtx:theme:change",
    { theme: a.resolved, mode: a.mode, previous: e },
    { bubbles: !1, aliases: ["mtx:theme-change"] }
  );
}
function N(e, t) {
  const n = z();
  if (!n) return;
  je(n);
  const r = a.resolved, o = a.mode;
  a.mode = e, a.resolved = te(e), qt(n, () => {
    n.setAttribute("data-mtx-theme", a.resolved), n.setAttribute("data-mtx-theme-mode", e);
  }), t && _t(e), C(), (r !== a.resolved || o !== e) && Je(r);
}
function Ae(e) {
  if (!Ee.has(e)) {
    Ee.add(e);
    const t = Array.from(e.childNodes).filter((n) => !(n.nodeType === 1 && n.classList.contains("material-icons"))).map((n) => n.textContent).join("").trim();
    (e.hasAttribute("aria-label") || e.hasAttribute("aria-labelledby") || t) && xe.add(e);
  }
  return xe.has(e);
}
function C(e = typeof document < "u" ? document : null) {
  if (!e || typeof e.querySelectorAll != "function") return;
  const t = a.resolved === "dark";
  e.querySelectorAll(Ge).forEach((n) => {
    const r = w(n.getAttribute("data-mtx-theme-toggle")), o = Pe(n);
    if (r) {
      n.setAttribute("aria-pressed", String(a.mode === r)), Ae(n) || n.setAttribute("aria-label", F("theme", r, null, r, o));
      return;
    }
    n.setAttribute("aria-pressed", String(t)), Ae(n) || n.setAttribute("aria-label", F("theme", "toggle", null, "Dark theme", o)), n.setAttribute("title", F("theme", t ? "switchToLight" : "switchToDark", null, "", o));
    const i = n.querySelector(".material-icons, .material-icons-outlined, .material-symbols-outlined");
    i && !n.hasAttribute("data-mtx-theme-static-icon") && (i.textContent = t ? n.getAttribute("data-icon-dark") || "light_mode" : n.getAttribute("data-icon-light") || "dark_mode");
  });
}
function zt() {
  const e = z();
  return Ue() || Ke() || w(e && e.getAttribute("data-mtx-theme-mode")) || w(e && e.getAttribute("data-mtx-theme")) || "light";
}
function je(e) {
  a.observer && a.observer.takeRecords().length && Ye(e);
}
function qt(e, t) {
  je(e), t(), a.observer && a.observer.takeRecords();
}
function Ye(e) {
  const t = w(e.getAttribute("data-mtx-theme")) || "light";
  if (t === "system") {
    N("system", !1);
    return;
  }
  if (t === a.resolved && t === a.mode) return;
  const n = a.resolved;
  a.mode = t, a.resolved = t, e.setAttribute("data-mtx-theme-mode", t), C(), Je(n);
}
function Ft() {
  const e = z();
  !e || a.observer || typeof MutationObserver > "u" || (a.observer = new MutationObserver((t) => {
    t.length && Ye(e);
  }), a.observer.observe(e, { attributes: !0, attributeFilter: ["data-mtx-theme"] }));
}
function Ht() {
  const e = z();
  e && (e.hasAttribute("data-mtx-theme-persist") && e.getAttribute("data-mtx-theme-persist") !== "false" && (a.storageKey = e.getAttribute("data-mtx-theme-persist") || Be), e.hasAttribute("data-mtx-theme-query") && e.getAttribute("data-mtx-theme-query") !== "false" && (a.query = e.getAttribute("data-mtx-theme-query") || Ve));
}
function A() {
  const e = z();
  if (!e || a.initialized) return;
  a.initialized = !0, Ht();
  const t = zt(), n = e.getAttribute("data-mtx-theme");
  t === "system" || t !== (w(n) || "light") || e.hasAttribute("data-mtx-theme-mode") ? (a.mode = t, a.resolved = te(t), N(t, !1)) : (a.mode = t, a.resolved = te(t)), Ft(), document.addEventListener("click", (r) => {
    const o = r.target && r.target.closest ? r.target.closest(Ge) : null;
    if (!o || o.disabled || o.getAttribute("aria-disabled") === "true") return;
    const i = w(o.getAttribute("data-mtx-theme-toggle"));
    i ? ne.set(i) : ne.toggle();
  }), document.addEventListener("mtx:locale:change", () => C()), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => C()) : C();
}
const ne = {
  /**
   * Devuelve el tema efectivo.
   * @returns {'light'|'dark'} Tema aplicado.
   */
  get() {
    return A(), a.resolved;
  },
  /**
   * Devuelve el modo elegido.
   * @returns {'light'|'dark'|'system'} Modo actual.
   */
  getMode() {
    return A(), a.mode;
  },
  /**
   * Aplica un modo de tema.
   * @param {'light'|'dark'|'system'} mode Modo a aplicar.
   * @param {{persist?: boolean}} [options] `persist: false` evita guardar aunque la persistencia esté activa.
   * @returns {'light'|'dark'} Tema efectivo resultante.
   * @throws {TypeError} Si el modo no es `light`, `dark` ni `system`.
   */
  set(e, t = {}) {
    A();
    const n = w(e);
    if (!n) throw new TypeError(`[Materix UI theme] Modo no válido: "${e}". Usa light, dark o system.`);
    return N(n, t.persist !== !1), a.resolved;
  },
  /**
   * Alterna entre claro y oscuro (desde `system` pasa al opuesto del tema efectivo).
   * @returns {'light'|'dark'} Tema efectivo resultante.
   */
  toggle() {
    return A(), ne.set(a.resolved === "dark" ? "light" : "dark");
  },
  /**
   * Configura persistencia y parámetro de URL.
   * @param {{persist?: boolean|string, query?: boolean|string}} [options] `persist`: `true` o clave de
   *   localStorage; `query`: `true` o nombre del parámetro (`theme`). Al activarlos se relee el modo inicial.
   * @returns {'light'|'dark'} Tema efectivo.
   */
  configure(e = {}) {
    A(), "persist" in e && (a.storageKey = e.persist ? typeof e.persist == "string" ? e.persist : Be : null), "query" in e && (a.query = e.query ? typeof e.query == "string" ? e.query : Ve : null);
    const t = Ue() || Ke();
    return t && t !== a.mode && N(t, !1), a.resolved;
  },
  /**
   * Sincroniza los botones `[data-mtx-theme-toggle]` (útil tras insertar contenido dinámico).
   * @param {ParentNode} [root=document] Contenedor.
   */
  sync(e) {
    A(), C(e);
  }
};
A();
const re = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function ue(e) {
  return e ? Array.from(e.querySelectorAll(re)).filter((t) => !t.hidden && t.getAttribute("aria-hidden") !== "true" && t.getClientRects().length > 0) : [];
}
function Wt(e) {
  return e ? e.matches(re) || e.hasAttribute("tabindex") ? e : ue(e)[0] || e.querySelector(re) || null : null;
}
function $t(e, t) {
  const n = Wt(t) || ue(e)[0] || e;
  !n.hasAttribute("tabindex") && n === e && (n.tabIndex = -1), n.focus();
}
function Bt(e) {
  if (e.tabIndex < 0 || e.closest("[inert]")) return !1;
  const t = e.ownerDocument.defaultView;
  if (t && t.getComputedStyle(e).visibility === "hidden") return !1;
  if (e.type === "radio" && e.name && !e.checked) {
    const n = e.form || e.ownerDocument;
    if (Array.from(n.querySelectorAll('input[type="radio"]:checked')).some((o) => o.name === e.name && o !== e)) return !1;
  }
  return !0;
}
function Vt(e) {
  const t = /* @__PURE__ */ new Set();
  return ue(e).filter((n) => {
    if (!Bt(n)) return !1;
    if (n.type === "radio" && n.name && !n.checked) {
      if (t.has(n.name)) return !1;
      t.add(n.name);
    }
    return !0;
  });
}
function gn(e, t) {
  e.preventDefault();
  const n = Vt(t);
  if (!n.length) {
    $t(t);
    return;
  }
  const r = document.activeElement;
  let o = n.indexOf(r);
  if (o === -1 && t.contains(r)) {
    const c = n.findIndex((s) => r.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING);
    o = c === -1 ? n.length : c, e.shiftKey || (o -= 1);
  }
  let i;
  e.shiftKey ? i = o <= 0 ? n.length - 1 : o - 1 : i = o === -1 || o >= n.length - 1 ? 0 : o + 1, n[i].focus();
}
const Gt = 1e3;
function yn(e, t) {
  let n = -1 / 0;
  const r = (o) => {
    const i = Date.now();
    if (o.type === "touchstart") n = i;
    else if (i - n < Gt) return;
    e && e.contains(o.target) || t(o);
  };
  return document.addEventListener("mousedown", r, !0), document.addEventListener("touchstart", r, !0), function() {
    document.removeEventListener("mousedown", r, !0), document.removeEventListener("touchstart", r, !0);
  };
}
const L = {
  entering: "mtx-transition--entering",
  entered: "mtx-transition--entered",
  exiting: "mtx-transition--exiting",
  exited: "mtx-transition--exited"
}, Ze = Object.values(L), Kt = "cubic-bezier(0, 0, 0.2, 1)", k = /* @__PURE__ */ new WeakMap();
function Se(e, t) {
  Object.entries(t).forEach(([n, r]) => {
    e.style[n] = r;
  });
}
function Ut() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function Qe(e) {
  const t = k.get(e);
  return t ? (k.delete(e), t.frame && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(t.frame), clearTimeout(t.timer), t.resolve(!1), !0) : !1;
}
function Jt(e, t, n, { prepare: r, animate: o, done: i }) {
  const c = Qe(e);
  return e.classList.remove(...Ze), Ut() ? (o(c), i && i(), e.classList.add(L.entered), Promise.resolve(!0)) : (r(c), e.classList.add(L.entering), new Promise((s) => {
    const l = { frame: 0, timer: 0, resolve: s }, f = () => {
      l.frame = 0, o(c);
    };
    l.frame = typeof requestAnimationFrame == "function" ? requestAnimationFrame(f) : 0, l.frame || f(), l.timer = setTimeout(() => {
      k.get(e) === l && (k.delete(e), e.classList.remove(L.entering, L.exiting), e.classList.add(L.entered), i && i(), s(!0));
    }, n), k.set(e, l);
  }));
}
function bn(e, t, n = {}) {
  const { transformOrigin: r = "top", duration: o = 225 } = n;
  e.style.transformOrigin = r;
  const i = Kt, c = { transform: "scale(0.6, 0)", opacity: 0 }, s = { transform: "scale(1, 1)", opacity: 1 };
  return Jt(e, t, o, {
    prepare: (l) => {
      e.style.transition = `transform ${o}ms ${i}, opacity ${o}ms ${i}`, l || Se(e, c);
    },
    animate: () => Se(e, s)
  });
}
function vn(e) {
  if (!e) return !1;
  const t = Qe(e);
  return e.classList && e.classList.remove(...Ze), t;
}
export {
  Tt as A,
  _e as B,
  st as C,
  dn as D,
  Ct as E,
  an as F,
  mn as G,
  hn as H,
  pn as I,
  fn as J,
  $t as K,
  gn as L,
  ue as M,
  yn as N,
  Qt as O,
  cn as P,
  bn as Q,
  vn as R,
  Wt as S,
  Ne as T,
  un as U,
  De as a,
  sn as b,
  wt as c,
  tn as d,
  tt as e,
  nt as f,
  ae as g,
  Pe as h,
  ke as i,
  _ as j,
  ce as k,
  on as l,
  Xt as m,
  rt as n,
  R as o,
  ne as p,
  rn as q,
  Yt as r,
  gt as s,
  F as t,
  bt as u,
  nn as v,
  en as w,
  Z as x,
  Zt as y,
  ln as z
};
