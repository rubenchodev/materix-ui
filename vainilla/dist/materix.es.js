var ur = Object.defineProperty;
var mr = (r, t, e) => t in r ? ur(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var Kt = (r, t, e) => mr(r, typeof t != "symbol" ? t + "" : t, e);
const ns = /* @__PURE__ */ new Map(), Tt = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new WeakMap(), Qt = /* @__PURE__ */ new WeakMap(), te = /* @__PURE__ */ new Set(), Te = /* @__PURE__ */ new WeakMap();
function pr(r) {
  return typeof WeakRef == "function" ? new WeakRef(r) : { deref: () => r };
}
function ls(r) {
  Qt.delete(r);
  const t = Te.get(r);
  t && te.delete(t), Te.delete(r);
}
function f(r, t) {
  ns.set(r, t);
}
function L(r) {
  return Tt.get(r);
}
function et(r, t) {
  if (!r || !r.nodeType || !t) return;
  Tt.set(r, t);
  let e = Bt.get(t);
  e || (e = /* @__PURE__ */ new Set(), Bt.set(t, e)), e.add(r);
}
function Ft(r) {
  if (!r || !r.nodeType) return;
  const t = Tt.get(r);
  Tt.delete(r);
  const e = t && Bt.get(t);
  e && e.delete(r);
}
function De(r, t) {
  if (!r || !t) return;
  let e = Qt.get(r);
  if (!e) {
    e = /* @__PURE__ */ new Set(), Qt.set(r, e);
    const i = pr(r);
    Te.set(r, i), te.add(i);
  }
  e.add(t);
}
function os(r) {
  const t = [];
  return Array.from(te).forEach((e) => {
    const i = e.deref();
    if (!i || i.destroyed) {
      te.delete(e), i && ls(i);
      return;
    }
    const s = Qt.get(i) || [];
    for (const a of s)
      if (a === r || r.contains && r.contains(a)) {
        t.push(i);
        break;
      }
  }), t;
}
function Ke(r) {
  if (!r) return;
  ls(r);
  const t = Bt.get(r);
  t && (t.forEach((e) => {
    Tt.get(e) === r && Tt.delete(e), e.removeAttribute && e.removeAttribute("data-mtx-initialized");
  }), Bt.delete(r));
}
function We(r) {
  try {
    !r.destroyed && typeof r.destroy == "function" && r.destroy();
  } finally {
    Ke(r);
  }
}
function cs(r) {
  const t = L(r);
  if (!t) return !1;
  try {
    We(t);
  } finally {
    r.removeAttribute && r.removeAttribute("data-mtx-initialized");
  }
  return !0;
}
function Me(r) {
  try {
    return r(), !0;
  } catch (t) {
    return typeof console < "u" && console.error("[Materix UI] Error al destruir una instancia:", t), !1;
  }
}
function ds(r = document) {
  let t = 0;
  if (!r || typeof r.querySelectorAll != "function") return t;
  const e = Array.from(r.querySelectorAll("[data-mtx-initialized]"));
  return r.nodeType === Node.ELEMENT_NODE && r.hasAttribute("data-mtx-initialized") && e.unshift(r), e.reverse().forEach((i) => {
    L(i) && (Me(() => cs(i)), t++);
  }), r !== document && os(r).forEach((i) => {
    i.destroyed || (Me(() => We(i)), t++);
  }), t;
}
function U(r, t) {
  if (!r || r.nodeType !== 1 || typeof r.getAttribute != "function") return null;
  const e = typeof t == "string" ? t : null, i = e || r.getAttribute("data-mtx");
  if (!i) return null;
  e && !r.hasAttribute("data-mtx") && r.setAttribute("data-mtx", e);
  const s = L(r);
  if (s) return s;
  const a = ns.get(i);
  if (!a) return null;
  const n = r, l = new a(r);
  return et(n, l), l.element && et(l.element, l), n.setAttribute("data-mtx-initialized", ""), l;
}
function _r(r, t) {
  return U(r, t);
}
function ee(r = document) {
  if (!(!r || typeof r.querySelectorAll != "function")) {
    r.nodeType === Node.ELEMENT_NODE && r.matches("[data-mtx]:not([data-mtx-initialized])") && U(r);
    for (let t = 0; t < 5; t++) {
      const e = r.querySelectorAll("[data-mtx]:not([data-mtx-initialized])");
      if (!e.length) break;
      let i = 0;
      if (e.forEach((s) => {
        L(s) || U(s) && i++;
      }), !i) break;
    }
  }
}
function fr(r) {
  if (!r.isConnected) {
    if (r.nodeType === Node.ELEMENT_NODE) {
      ds(r);
      return;
    }
    os(r).forEach((t) => {
      Me(() => We(t));
    });
  }
}
function br(r = document, t = {}) {
  const { destroyOnRemove: e = !1 } = t || {}, i = new MutationObserver((s) => {
    s.forEach((a) => {
      e && a.removedNodes.forEach(fr), a.addedNodes.forEach((n) => {
        n.nodeType !== Node.ELEMENT_NODE || !n.isConnected || (n.hasAttribute && n.hasAttribute("data-mtx") && U(n), n.querySelectorAll && n.querySelectorAll("[data-mtx]").forEach((l) => U(l)));
      });
    });
  });
  return i.observe(r, { childList: !0, subtree: !0 }), i;
}
function gr(r, t) {
  const e = (i, s) => typeof s == "function" && s !== g && i instanceof s;
  return e(r, t.constructor) || e(t, r.constructor);
}
function xr(r, t) {
  if (!r || !r.nodeType) return;
  const e = L(r);
  if (!(!e || e === t || !gr(e, t)))
    try {
      !e.destroyed && typeof e.destroy == "function" && e.destroy();
    } catch {
    } finally {
      Ke(e);
    }
}
class g {
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
    this._cleanups = [], this.element = t, xr(t, this), t && t.setAttribute && t.setAttribute("data-mtx-initialized", ""), et(t, this);
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
  listen(t, e, i, s) {
    if (!t || typeof t.addEventListener != "function") return () => {
    };
    t.addEventListener(e, i, s);
    const a = () => t.removeEventListener(e, i, s);
    return this.onDestroy(a), a;
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
    Ke(this), this.element && this.element.removeAttribute && this.element.removeAttribute("data-mtx-initialized"), this.destroyed = !0;
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
const Ar = "mtx-ripple", ui = ["pointerup", "pointercancel", "pointerleave"], mi = "mtx-ripple-container", pi = "mtx-ripple--finishing", hs = 550, yr = hs * 2;
function vr() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Er(r) {
  if (r.classList.contains(pi)) return;
  r.classList.add(pi);
  let t = 0;
  const e = () => {
    clearTimeout(t), r.removeEventListener("animationend", e), r.parentElement && r.parentElement.removeChild(r);
  };
  r.addEventListener("animationend", e), t = setTimeout(e, yr);
}
function wr(r, t, e) {
  let i = r.querySelector(`.${mi}`);
  i || (i = document.createElement("span"), i.className = mi, r.appendChild(i));
  const s = r.getBoundingClientRect(), a = Math.max(Math.abs(s.width - t), t) * 2 + 2, n = Math.max(Math.abs(s.height - e), e) * 2 + 2, l = Math.sqrt(a * a + n * n), o = document.createElement("span");
  return o.className = Ar, o.style.width = o.style.height = `${l}px`, o.style.left = `${t - l / 2}px`, o.style.top = `${e - l / 2}px`, i.appendChild(o), o;
}
function z(r, t, e = {}) {
  if (vr()) return;
  const { centered: i = !1, interactionTarget: s = r } = e, a = r.getBoundingClientRect(), n = i ? a.width / 2 : (t.clientX || 0) - a.left, l = i ? a.height / 2 : (t.clientY || 0) - a.top, o = wr(r, n, l), c = performance.now(), d = () => {
    ui.forEach((m) => s.removeEventListener(m, d));
    const h = performance.now() - c, u = Math.max(hs - h, 0);
    setTimeout(() => Er(o), u);
  };
  ui.forEach((h) => s.addEventListener(h, d));
}
function v(r, t, e, i = {}) {
  if (!r || typeof r.dispatchEvent != "function") return !0;
  const {
    aliases: s = [],
    bubbles: a = !0,
    cancelable: n = !1,
    composed: l = !1
  } = i, o = { bubbles: a, cancelable: n, composed: l };
  e !== void 0 && (o.detail = e);
  let c = r.dispatchEvent(new CustomEvent(t, o));
  return s.forEach((d) => {
    !d || d === t || r.dispatchEvent(new CustomEvent(d, o)) || (c = !1);
  }), c;
}
const Lr = {
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
}, kr = {
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
}, V = {
  en: Lr,
  es: kr
};
let Lt = "en", Ge = !1;
function us(r) {
  if (!r || typeof r != "string") return null;
  const t = r.toLowerCase().trim();
  if (V[t]) return t;
  const e = t.split("-")[0];
  return V[e] ? e : null;
}
function ms(r, t) {
  const e = { ...r };
  return _e(r) && _e(t) && Object.keys(t).forEach((i) => {
    _e(t[i]) && i in r ? e[i] = ms(r[i], t[i]) : e[i] = t[i];
  }), e;
}
function _e(r) {
  return r && typeof r == "object" && !Array.isArray(r);
}
function Sr(r, t) {
  return typeof r != "string" || !t ? r : Array.isArray(t) ? r.replace(/\{(\d+)\}/g, (e, i) => {
    const s = parseInt(i, 10);
    return t[s] !== void 0 ? String(t[s]) : e;
  }) : typeof t == "object" ? r.replace(/\{([a-zA-Z0-9_-]+)\}/g, (e, i) => t[i] !== void 0 ? String(t[i]) : e) : r;
}
function ce() {
  return ie();
}
function ps(r) {
  if (!r || typeof r != "string") return !1;
  const t = r.toLowerCase().trim();
  if (V[t])
    Lt = t;
  else {
    const e = t.split("-")[0];
    if (V[e])
      Lt = e;
    else
      return console.warn(`[Materix UI i18n] El idioma "${r}" no está registrado. Manteniendo "${ce()}".`), !1;
  }
  return Ge = !0, typeof document < "u" && v(document, "mtx:locale:change", { locale: Lt }, { aliases: ["mtx:localechange"] }), !0;
}
function _s() {
  Lt = "en", Ge = !1, typeof document < "u" && v(document, "mtx:locale:change", { locale: ce() }, { aliases: ["mtx:localechange"] });
}
function je(r, t) {
  if (!r || typeof r != "string" || !t) return;
  const e = r.toLowerCase().trim();
  V[e] = {
    ...t,
    code: e
  };
}
function Xe(r, t) {
  if (!r || typeof r != "string" || !t) return;
  const e = r.toLowerCase().trim();
  V[e] ? V[e] = ms(V[e], t) : je(e, t);
}
function ht(r = null) {
  const t = r ? String(r).toLowerCase().trim() : ie();
  return V[t] || V.en;
}
function y(r, t, e = null, i = null, s = null) {
  let l = (ht(s)[r] || V.en && V.en[r] || {})[t];
  return l === void 0 && (V.en && V.en[r] && V.en[r][t] !== void 0 ? l = V.en[r][t] : l = i !== null ? i : t), typeof l == "string" && e ? Sr(l, e) : l;
}
function ie() {
  if (Ge) return Lt;
  const r = typeof document < "u" ? document.documentElement : null;
  return r && us(r.getAttribute("lang")) || Lt;
}
function k(r) {
  if (!r || typeof r.getAttribute != "function")
    return ie();
  const t = typeof document < "u" ? document.documentElement : null;
  for (let e = r; e && e.nodeType === 1; e = e.parentElement) {
    const i = e.getAttribute("data-locale") || e.getAttribute("data-lang") || (e !== t ? e.getAttribute("lang") : null);
    if (i) {
      const s = us(i);
      if (s) return s;
      break;
    }
  }
  return ie();
}
const Cr = {
  getLocale: ce,
  setLocale: ps,
  resetLocale: _s,
  addLocale: je,
  updateLocale: Xe,
  getDictionary: ht,
  t: y,
  getComponentLocale: k
}, Tr = ["light", "dark", "system"], fs = "mtx-theme", bs = "theme", gs = "[data-mtx-theme-toggle]", E = {
  initialized: !1,
  mode: "light",
  resolved: "light",
  storageKey: null,
  query: null,
  media: null,
  observer: null
}, _i = /* @__PURE__ */ new WeakSet(), fi = /* @__PURE__ */ new WeakSet();
function zt() {
  return typeof document < "u" ? document.documentElement : null;
}
function nt(r) {
  const t = typeof r == "string" ? r.trim().toLowerCase() : "";
  return Tr.includes(t) ? t : null;
}
function Dr() {
  if (!E.media && typeof window < "u" && typeof window.matchMedia == "function") {
    E.media = window.matchMedia("(prefers-color-scheme: dark)");
    const r = () => {
      E.mode === "system" && Rt("system", !1);
    };
    E.media && typeof E.media.addEventListener == "function" ? E.media.addEventListener("change", r) : E.media && typeof E.media.addListener == "function" && E.media.addListener(r);
  }
  return !!(E.media && E.media.matches);
}
function Ne(r) {
  return r === "system" ? Dr() ? "dark" : "light" : r === "dark" ? "dark" : "light";
}
function xs() {
  if (!E.storageKey) return null;
  try {
    return nt(localStorage.getItem(E.storageKey));
  } catch {
    return null;
  }
}
function Mr(r) {
  if (E.storageKey)
    try {
      localStorage.setItem(E.storageKey, r);
    } catch {
    }
}
function As() {
  if (!E.query || typeof window > "u" || !window.location) return null;
  try {
    return nt(new URLSearchParams(window.location.search).get(E.query));
  } catch {
    return null;
  }
}
function ys(r) {
  v(
    document,
    "mtx:theme:change",
    { theme: E.resolved, mode: E.mode, previous: r },
    { bubbles: !1, aliases: ["mtx:theme-change"] }
  );
}
function Rt(r, t) {
  const e = zt();
  if (!e) return;
  vs(e);
  const i = E.resolved, s = E.mode;
  E.mode = r, E.resolved = Ne(r), Ir(e, () => {
    e.setAttribute("data-mtx-theme", E.resolved), e.setAttribute("data-mtx-theme-mode", r);
  }), t && Mr(r), kt(), (i !== E.resolved || s !== r) && ys(i);
}
function bi(r) {
  if (!fi.has(r)) {
    fi.add(r);
    const t = Array.from(r.childNodes).filter((e) => !(e.nodeType === 1 && e.classList.contains("material-icons"))).map((e) => e.textContent).join("").trim();
    (r.hasAttribute("aria-label") || r.hasAttribute("aria-labelledby") || t) && _i.add(r);
  }
  return _i.has(r);
}
function kt(r = typeof document < "u" ? document : null) {
  if (!r || typeof r.querySelectorAll != "function") return;
  const t = E.resolved === "dark";
  r.querySelectorAll(gs).forEach((e) => {
    const i = nt(e.getAttribute("data-mtx-theme-toggle")), s = k(e);
    if (i) {
      e.setAttribute("aria-pressed", String(E.mode === i)), bi(e) || e.setAttribute("aria-label", y("theme", i, null, i, s));
      return;
    }
    e.setAttribute("aria-pressed", String(t)), bi(e) || e.setAttribute("aria-label", y("theme", "toggle", null, "Dark theme", s)), e.setAttribute("title", y("theme", t ? "switchToLight" : "switchToDark", null, "", s));
    const a = e.querySelector(".material-icons, .material-icons-outlined, .material-symbols-outlined");
    a && !e.hasAttribute("data-mtx-theme-static-icon") && (a.textContent = t ? e.getAttribute("data-icon-dark") || "light_mode" : e.getAttribute("data-icon-light") || "dark_mode");
  });
}
function Nr() {
  const r = zt();
  return As() || xs() || nt(r && r.getAttribute("data-mtx-theme-mode")) || nt(r && r.getAttribute("data-mtx-theme")) || "light";
}
function vs(r) {
  E.observer && E.observer.takeRecords().length && Es(r);
}
function Ir(r, t) {
  vs(r), t(), E.observer && E.observer.takeRecords();
}
function Es(r) {
  const t = nt(r.getAttribute("data-mtx-theme")) || "light";
  if (t === "system") {
    Rt("system", !1);
    return;
  }
  if (t === E.resolved && t === E.mode) return;
  const e = E.resolved;
  E.mode = t, E.resolved = t, r.setAttribute("data-mtx-theme-mode", t), kt(), ys(e);
}
function Or() {
  const r = zt();
  !r || E.observer || typeof MutationObserver > "u" || (E.observer = new MutationObserver((t) => {
    t.length && Es(r);
  }), E.observer.observe(r, { attributes: !0, attributeFilter: ["data-mtx-theme"] }));
}
function Pr() {
  const r = zt();
  r && (r.hasAttribute("data-mtx-theme-persist") && r.getAttribute("data-mtx-theme-persist") !== "false" && (E.storageKey = r.getAttribute("data-mtx-theme-persist") || fs), r.hasAttribute("data-mtx-theme-query") && r.getAttribute("data-mtx-theme-query") !== "false" && (E.query = r.getAttribute("data-mtx-theme-query") || bs));
}
function bt() {
  const r = zt();
  if (!r || E.initialized) return;
  E.initialized = !0, Pr();
  const t = Nr(), e = r.getAttribute("data-mtx-theme");
  t === "system" || t !== (nt(e) || "light") || r.hasAttribute("data-mtx-theme-mode") ? (E.mode = t, E.resolved = Ne(t), Rt(t, !1)) : (E.mode = t, E.resolved = Ne(t)), Or(), document.addEventListener("click", (i) => {
    const s = i.target && i.target.closest ? i.target.closest(gs) : null;
    if (!s || s.disabled || s.getAttribute("aria-disabled") === "true") return;
    const a = nt(s.getAttribute("data-mtx-theme-toggle"));
    a ? se.set(a) : se.toggle();
  }), document.addEventListener("mtx:locale:change", () => kt()), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => kt()) : kt();
}
const se = {
  /**
   * Devuelve el tema efectivo.
   * @returns {'light'|'dark'} Tema aplicado.
   */
  get() {
    return bt(), E.resolved;
  },
  /**
   * Devuelve el modo elegido.
   * @returns {'light'|'dark'|'system'} Modo actual.
   */
  getMode() {
    return bt(), E.mode;
  },
  /**
   * Aplica un modo de tema.
   * @param {'light'|'dark'|'system'} mode Modo a aplicar.
   * @param {{persist?: boolean}} [options] `persist: false` evita guardar aunque la persistencia esté activa.
   * @returns {'light'|'dark'} Tema efectivo resultante.
   * @throws {TypeError} Si el modo no es `light`, `dark` ni `system`.
   */
  set(r, t = {}) {
    bt();
    const e = nt(r);
    if (!e) throw new TypeError(`[Materix UI theme] Modo no válido: "${r}". Usa light, dark o system.`);
    return Rt(e, t.persist !== !1), E.resolved;
  },
  /**
   * Alterna entre claro y oscuro (desde `system` pasa al opuesto del tema efectivo).
   * @returns {'light'|'dark'} Tema efectivo resultante.
   */
  toggle() {
    return bt(), se.set(E.resolved === "dark" ? "light" : "dark");
  },
  /**
   * Configura persistencia y parámetro de URL.
   * @param {{persist?: boolean|string, query?: boolean|string}} [options] `persist`: `true` o clave de
   *   localStorage; `query`: `true` o nombre del parámetro (`theme`). Al activarlos se relee el modo inicial.
   * @returns {'light'|'dark'} Tema efectivo.
   */
  configure(r = {}) {
    bt(), "persist" in r && (E.storageKey = r.persist ? typeof r.persist == "string" ? r.persist : fs : null), "query" in r && (E.query = r.query ? typeof r.query == "string" ? r.query : bs : null);
    const t = As() || xs();
    return t && t !== E.mode && Rt(t, !1), E.resolved;
  },
  /**
   * Sincroniza los botones `[data-mtx-theme-toggle]` (útil tras insertar contenido dinámico).
   * @param {ParentNode} [root=document] Contenedor.
   */
  sync(r) {
    bt(), kt(r);
  }
};
bt();
class ws extends g {
  /**
   * Crea una instancia del baseline.
   *
   * @param {HTMLElement} element Elemento raíz asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-root");
  }
}
f("css-baseline", ws);
const $r = ["sm", "md", "lg", "xl"];
class Ls extends g {
  /**
   * Crea una instancia del elemento tipográfico.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-typography") || t.classList.add("mtx-typography");
    const e = t.getAttribute("data-variant");
    if (e)
      t.classList.add(`mtx-typography--${e}`);
    else {
      const a = t.tagName.toLowerCase();
      /^h[1-6]$/.test(a) && t.classList.add(`mtx-typography--${a}`);
    }
    $r.forEach((a) => {
      const n = t.getAttribute(`data-variant-${a}`);
      n && t.classList.add(`mtx-typography--${a}-${n}`);
    }), t.hasAttribute("data-responsive") && t.getAttribute("data-responsive") !== "false" && t.classList.add("mtx-typography--responsive");
    const i = t.getAttribute("data-color");
    i && t.classList.add(`mtx-typography--color-${i}`);
    const s = t.getAttribute("data-align");
    s && (t.classList.add(`mtx-typography--${s}`), t.classList.add(`mtx-typography--align-${s}`)), t.hasAttribute("data-no-wrap") && t.classList.add("mtx-typography--no-wrap"), t.hasAttribute("data-gutter-bottom") && t.classList.add("mtx-typography--gutter-bottom"), t.hasAttribute("data-paragraph") && t.classList.add("mtx-typography--paragraph");
  }
}
f("typography", Ls);
const ks = ["xs", "sm", "md", "lg", "xl"], Br = [...ks, "fluid"].map((r) => `mtx-container--${r}`), gi = (r, t) => r.hasAttribute(t) && r.getAttribute(t) !== "false";
class Ss extends g {
  /**
   * Crea la instancia y aplica la configuración declarativa.
   * @param {HTMLElement} element Elemento contenedor.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-container");
    const e = t.getAttribute("data-max-width");
    if (e)
      try {
        this.setMaxWidth(e);
      } catch (i) {
        console.warn(i.message);
      }
    gi(t, "data-disable-gutters") && this.setGutters(!1), gi(t, "data-fixed") && this.setFixed(!0);
  }
  /**
   * Cambia el ancho máximo.
   * @param {'xs'|'sm'|'md'|'lg'|'xl'|false|'false'} value Breakpoint tope o `false` para ancho completo.
   * @throws {RangeError} Si el valor no es válido.
   */
  setMaxWidth(t) {
    const e = t === !1 || t === "false" ? "fluid" : String(t);
    if (e !== "fluid" && !ks.includes(e))
      throw new RangeError(`Container: data-max-width no válido "${t}"`);
    this.element.classList.remove(...Br), this.element.classList.add(`mtx-container--${e}`);
  }
  /**
   * Activa o desactiva los márgenes laterales internos (16px / 24px).
   * @param {boolean} enabled `false` equivale a `data-disable-gutters`.
   */
  setGutters(t) {
    this.element.classList.toggle("mtx-container--disable-gutters", !t);
  }
  /**
   * Activa o desactiva el ancho fijo por breakpoint.
   * @param {boolean} fixed Estado.
   */
  setFixed(t) {
    this.element.classList.toggle("mtx-container--fixed", !!t);
  }
}
f("container", Ss);
const Fr = ["sm", "md", "lg", "xl"], Rr = ["row", "column", "row-reverse", "column-reverse"], Hr = ["0", "0_5", "1", "1_5", "2", "2_5", "3", "4", "5", "6", "8", "10"], qr = { start: "start", "flex-start": "start", center: "center", end: "end", "flex-end": "end", stretch: "stretch", baseline: "baseline" }, zr = {
  start: "start",
  "flex-start": "start",
  center: "center",
  end: "end",
  "flex-end": "end",
  between: "between",
  "space-between": "between",
  around: "around",
  "space-around": "around",
  evenly: "evenly",
  "space-evenly": "evenly"
}, xi = "data-mtx-stack-divider", Vr = (r) => {
  const t = String(r).trim().replace(".", "_");
  return Hr.includes(t) ? t : null;
}, Ai = (r, t) => r.hasAttribute(t) && r.getAttribute(t) !== "false";
class Cs extends g {
  /**
   * Crea la instancia y aplica la configuración declarativa.
   * @param {HTMLElement} element Elemento contenedor.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-stack");
    const e = (a) => {
      const n = t.getAttribute(a);
      return n !== null && n !== "" ? n : null;
    };
    [null, ...Fr].forEach((a) => {
      const n = a ? `-${a}` : "", l = e(`data-direction${n}`);
      l && this._safe(() => this.setDirection(l, a));
      const o = e(`data-spacing${n}`);
      o !== null && this._safe(() => this.setSpacing(o, a));
    });
    const i = e("data-align");
    i && this.setAlign(i);
    const s = e("data-justify");
    s && this.setJustify(s), Ai(t, "data-wrap") && this.setWrap(!0), this._divider = Ai(t, "data-divider"), this.refresh();
  }
  /**
   * Ejecuta una configuración declarativa sin interrumpir la inicialización.
   * @param {Function} fn Configuración a aplicar.
   * @private
   */
  _safe(t) {
    try {
      t();
    } catch (e) {
      console.warn(e.message);
    }
  }
  /**
   * Sustituye las clases que empiezan por un prefijo.
   * @param {string} prefix Prefijo de clase.
   * @param {string|null} next Clase nueva o `null` para solo eliminar.
   * @param {RegExp} [match] Filtro adicional sobre el resto del nombre.
   * @private
   */
  _swap(t, e, i) {
    Array.from(this.element.classList).filter((s) => s.startsWith(t) && (!i || i.test(s.slice(t.length)))).forEach((s) => this.element.classList.remove(s)), e && this.element.classList.add(e);
  }
  /**
   * Cambia la dirección, opcionalmente desde un breakpoint.
   * @param {'row'|'column'|'row-reverse'|'column-reverse'} direction Dirección flex.
   * @param {'sm'|'md'|'lg'|'xl'} [bp] Breakpoint (sin él aplica desde xs).
   * @throws {RangeError} Si la dirección no es válida.
   */
  setDirection(t, e) {
    const i = t === "col" ? "column" : t;
    if (!Rr.includes(i)) throw new RangeError(`Stack: dirección no válida "${t}"`);
    const s = e ? `mtx-stack--${e}-` : "mtx-stack--";
    this._swap(s, `${s}${i}`, /^(row|column|col)(-reverse)?$/);
  }
  /**
   * Cambia la separación entre hijos (escala `n × 8px`).
   * @param {string|number} spacing Valor de la escala (0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10).
   * @param {'sm'|'md'|'lg'|'xl'} [bp] Breakpoint.
   * @throws {RangeError} Si el valor no pertenece a la escala.
   */
  setSpacing(t, e) {
    const i = Vr(t);
    if (i === null) throw new RangeError(`Stack: espaciado no válido "${t}"`);
    const s = e ? `mtx-stack--${e}-spacing-` : "mtx-stack--spacing-";
    this._swap(s, `${s}${i}`);
  }
  /**
   * Alinea los hijos en el eje cruzado.
   * @param {string} align start|center|end|stretch|baseline (acepta flex-start/flex-end).
   */
  setAlign(t) {
    const e = qr[t];
    this._swap("mtx-stack--align-", e ? `mtx-stack--align-${e}` : null);
  }
  /**
   * Distribuye los hijos en el eje principal.
   * @param {string} justify start|center|end|between|around|evenly (acepta valores CSS).
   */
  setJustify(t) {
    const e = zr[t];
    this._swap("mtx-stack--justify-", e ? `mtx-stack--justify-${e}` : null);
  }
  /**
   * Activa o desactiva el ajuste de línea.
   * @param {boolean} wrap Estado.
   */
  setWrap(t) {
    this.element.classList.toggle("mtx-stack--wrap", !!t);
  }
  /**
   * Activa o desactiva los divisores automáticos entre hijos.
   * @param {boolean} enabled Estado.
   */
  setDivider(t) {
    this._divider = !!t, this.refresh();
  }
  /**
   * Regenera los divisores (llamar tras añadir o quitar hijos). Idempotente.
   */
  refresh() {
    if (Array.from(this.element.children).filter((e) => e.hasAttribute(xi)).forEach((e) => e.remove()), !this._divider) return;
    Array.from(this.element.children).slice(1).forEach((e) => {
      const i = document.createElement("hr");
      i.className = "mtx-divider mtx-stack__divider", i.setAttribute(xi, ""), i.setAttribute("aria-hidden", "true"), this.element.insertBefore(i, e);
    });
  }
}
f("stack", Cs);
class Ts extends g {
  /**
   * Crea una instancia de la superficie.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-paper") || t.classList.add("mtx-paper");
    const e = t.getAttribute("data-elevation");
    e !== null && e !== "" && t.classList.add(`mtx-paper--elevation-${e}`), t.getAttribute("data-variant") === "outlined" && t.classList.add("mtx-paper--outlined"), t.hasAttribute("data-square") && t.classList.add("mtx-paper--square");
  }
}
f("paper", Ts);
let yi = 0;
function P(r = "mtx") {
  let t;
  do
    yi += 1, t = `${r}-${yi}`;
  while (typeof document < "u" && document.getElementById(t));
  return t;
}
const Ur = '.mtx-accordion-group, [data-mtx="accordion-group"]', Yr = '.mtx-accordion, [data-mtx="accordion"]', Kr = '.mtx-accordion-actions, [data-mtx="accordion-actions"]', Wr = "expand_more", Gr = ["ArrowDown", "ArrowUp", "Home", "End"];
function jr() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Xr(r) {
  if (!r) return 0;
  const t = r / 36;
  return Math.round((4 + 15 * t ** 0.25 + t / 5) * 10);
}
function Jr() {
  return typeof document < "u" && !!document.body && "onbeforematch" in document.body;
}
function gt(r, t) {
  return !r || !r.hasAttribute(t) ? null : r.getAttribute(t) !== "false";
}
function Ds(r) {
  const t = r.parentElement;
  if (!t) return null;
  const e = t.closest(Ur);
  if (!e) return null;
  const i = t.closest(".mtx-accordion");
  return i && e.contains(i) ? null : e;
}
function ae(r) {
  return Array.from(r.querySelectorAll(Yr)).filter((t) => Ds(t) === r);
}
function Ie(r) {
  return !!r && r.getAttribute("data-exclusive") !== "false";
}
class Ms extends g {
  /**
   * Crea el acordeón y genera su estructura si falta.
   * @param {HTMLElement} element Raíz (`<div>` o `<details>`).
   */
  constructor(t) {
    super(t), this._isDetails = t.tagName === "DETAILS", this._group = Ds(t), this._timer = null, this._untilFound = !this._isDetails && Jr(), t.classList.add("mtx-accordion"), this._applyOptions(), this._isDetails ? this._scaffoldDetails() : this._scaffoldDiv(), this._linkAria();
    let e = this._readInitialExpanded();
    e && Ie(this._group) && this._siblings().some((s) => {
      var a;
      return (a = L(s)) == null ? void 0 : a.expanded;
    }) && (e = !1), this._expanded = !e, this._setState(e, { animate: !1, emit: !1 });
    const i = gt(t, "data-disabled") === !0 || t.classList.contains("mtx-accordion--disabled") || this.summary.disabled === !0 || this.summary.getAttribute("aria-disabled") === "true";
    this._setDisabled(i), this._bindEvents();
  }
  /** Traduce los atributos `data-*` (propios o heredados del grupo) a clases. */
  _applyOptions() {
    const t = this.element, e = this._group, i = (o) => t.hasAttribute(o) ? t : e && e.hasAttribute(o) ? e : null, s = i("data-variant");
    s && s.getAttribute("data-variant") === "outlined" && t.classList.add("mtx-accordion--outlined"), gt(i("data-square"), "data-square") && t.classList.add("mtx-accordion--square");
    const a = i("data-summary-style");
    a && a.getAttribute("data-summary-style") === "plain" && t.classList.add("mtx-accordion--plain-summary"), gt(i("data-disable-gutters"), "data-disable-gutters") && t.classList.add("mtx-accordion--disable-gutters");
    const n = i("data-elevation"), l = n ? n.getAttribute("data-elevation") : "";
    l !== "" && l !== null && t.classList.add(`mtx-accordion--elevation-${l}`);
  }
  /** Construye cabecera, resumen y región para la forma `<div>`. */
  _scaffoldDiv() {
    const t = this.element;
    let e = t.querySelector(":scope > .mtx-accordion__summary, :scope > .mtx-accordion__heading > .mtx-accordion__summary");
    if (!e) {
      e = document.createElement("button"), e.className = "mtx-accordion__summary";
      const i = document.createElement("span");
      i.className = "mtx-accordion__summary-content", i.textContent = t.getAttribute("data-summary") || "", e.appendChild(i);
      const s = t.getAttribute("data-heading-level") || "3";
      let a = e;
      /^[1-6]$/.test(s) && (a = document.createElement(`h${s}`), a.className = "mtx-accordion__heading", a.appendChild(e)), t.insertBefore(a, t.firstChild);
    }
    e.tagName === "BUTTON" && !e.hasAttribute("type") && (e.type = "button"), this.summary = e, this.heading = e.parentElement !== t ? e.parentElement : null, this._ensureSummaryParts(), this._ensureRegion(this.heading || e);
  }
  /** Mejora un `<details>` existente: el `<summary>` nativo hace de AccordionSummary. */
  _scaffoldDetails() {
    const t = this.element;
    let e = t.querySelector(":scope > summary");
    if (!e) {
      e = document.createElement("summary");
      const i = document.createElement("span");
      i.className = "mtx-accordion__summary-content", i.textContent = t.getAttribute("data-summary") || "", e.appendChild(i), t.insertBefore(e, t.firstChild);
    }
    e.classList.add("mtx-accordion__summary"), this.summary = e, this.heading = null, this._ensureSummaryParts(), this._ensureRegion(e);
  }
  /** Garantiza el contenedor de texto y el icono de expansión dentro del resumen. */
  _ensureSummaryParts() {
    const t = this.summary;
    let e = t.querySelector(":scope > .mtx-accordion__expand-icon"), i = t.querySelector(":scope > .mtx-accordion__summary-content");
    i || (i = document.createElement("span"), i.className = "mtx-accordion__summary-content", Array.from(t.childNodes).filter((a) => a !== e).forEach((a) => i.appendChild(a)), t.insertBefore(i, t.firstChild));
    const s = this.element.getAttribute("data-expand-icon");
    if (!e && s !== "false" && s !== "none") {
      e = document.createElement("span"), e.className = "mtx-accordion__expand-icon", e.setAttribute("aria-hidden", "true");
      const a = document.createElement("span");
      a.className = "material-icons", a.textContent = s || Wr, e.appendChild(a), t.appendChild(e);
    } else e && !e.hasAttribute("aria-hidden") && e.setAttribute("aria-hidden", "true");
    this.content = i, this.expandIcon = e || null;
  }
  /**
   * Garantiza la región colapsable con AccordionDetails y AccordionActions.
   * @param {HTMLElement} header Nodo de cabecera que no debe moverse.
   */
  _ensureRegion(t) {
    const e = this.element;
    let i = e.querySelector(":scope > .mtx-accordion__region");
    if (!i) {
      i = document.createElement("div"), i.className = "mtx-accordion__region";
      let s = e.querySelector(":scope > .mtx-accordion__details");
      const a = Array.from(e.children).filter((n) => n.matches(Kr));
      s || (s = document.createElement("div"), s.className = "mtx-accordion__details", Array.from(e.childNodes).filter((n) => n !== t && !a.includes(n)).forEach((n) => s.appendChild(n))), i.appendChild(s), a.forEach((n) => i.appendChild(n)), e.appendChild(i);
    }
    i.querySelectorAll(':scope > [data-mtx="accordion-actions"]').forEach((s) => s.classList.add("mtx-accordion-actions")), this.region = i, this.details = i.querySelector(":scope > .mtx-accordion__details");
  }
  /** Enlaza resumen y región con `aria-controls` / `aria-labelledby`. */
  _linkAria() {
    const t = this.element.id || P("mtx-accordion");
    this.summary.id || (this.summary.id = `${t}-summary`), this.region.id || (this.region.id = `${t}-region`), this.summary.setAttribute("aria-controls", this.region.id), this.region.setAttribute("role", "region"), this.region.setAttribute("aria-labelledby", this.summary.id);
  }
  /** @returns {boolean} Estado inicial declarado. */
  _readInitialExpanded() {
    const t = gt(this.element, "data-expanded");
    return t !== null ? t : this._isDetails ? this.element.open === !0 : this.element.classList.contains("mtx-accordion--expanded") || this.summary.getAttribute("aria-expanded") === "true";
  }
  /** Registra los listeners de interacción. */
  _bindEvents() {
    this._handleClick = (t) => {
      if (this._isDetails && t.preventDefault(), this.disabled) {
        t.preventDefault();
        return;
      }
      this._setState(!this._expanded, { animate: !0, emit: !0 });
    }, this.summary.addEventListener("click", this._handleClick), this._handleKeyDown = (t) => this._onKeyDown(t), this.summary.addEventListener("keydown", this._handleKeyDown), gt(this.element, "data-ripple") && (this._handlePointerDown = (t) => {
      this.disabled || t.button !== 0 || z(this.summary, t);
    }, this.summary.addEventListener("pointerdown", this._handlePointerDown)), this._isDetails ? (this._handleToggle = () => {
      this._timer || this.element.open === this._expanded || this._setState(this.element.open, { animate: !1, emit: !0 });
    }, this.element.addEventListener("toggle", this._handleToggle)) : (this._handleBeforeMatch = () => this._setState(!0, { animate: !1, emit: !0 }), this.region.addEventListener("beforematch", this._handleBeforeMatch));
  }
  /**
   * Navegación WAI-ARIA entre resúmenes de un mismo grupo (flechas, Home, End).
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeyDown(t) {
    if (!this._group || !Gr.includes(t.key)) return;
    const e = ae(this._group).map((a) => L(a)).filter((a) => a && a.summary && !a.disabled).map((a) => a.summary);
    if (e.length < 2) return;
    const i = e.indexOf(this.summary);
    let s;
    t.key === "Home" ? s = 0 : t.key === "End" ? s = e.length - 1 : t.key === "ArrowDown" ? s = (i + 1) % e.length : s = (i - 1 + e.length) % e.length, t.preventDefault(), e[s].focus();
  }
  /** @returns {HTMLElement[]} Otros acordeones del mismo grupo. */
  _siblings() {
    return this._group ? ae(this._group).filter((t) => t !== this.element) : [];
  }
  /**
   * Cambia el estado expandido, anima la región y notifica.
   * @param {boolean} expanded Nuevo estado.
   * @param {{animate: boolean, emit: boolean}} options Opciones.
   */
  _setState(t, { animate: e, emit: i }) {
    t !== this._expanded && (this._expanded = t, this.element.classList.toggle("mtx-accordion--expanded", t), this.summary.setAttribute("aria-expanded", String(t)), this._transition(t, e), t && Ie(this._group) && this._siblings().forEach((s) => {
      const a = L(s);
      a && a !== this && a.expanded && a._setState(!1, { animate: e, emit: i });
    }), i && v(this.element, "mtx:accordion:change", { expanded: t }));
  }
  /** @returns {number|null} Duración fija declarada en `data-duration`, o `null` para automática. */
  _fixedDuration() {
    const t = this.element.getAttribute("data-duration");
    if (t === null || t === "" || t === "auto") return null;
    const e = Number(t);
    return Number.isFinite(e) && e >= 0 ? e : null;
  }
  /**
   * Transición de altura (Collapse) de la región.
   * @param {boolean} expanding `true` al expandir.
   * @param {boolean} animate `false` aplica el estado al instante.
   */
  _transition(t, e) {
    const i = this.region;
    clearTimeout(this._timer), this._timer = null;
    const s = this._fixedDuration();
    if (!e || jr() || s === 0) {
      this._finish(t);
      return;
    }
    const n = (this._isDetails ? !this.element.open : i.hasAttribute("hidden")) ? 0 : i.getBoundingClientRect().height;
    t && this._show();
    const l = t ? i.scrollHeight : 0, o = s ?? Xr(Math.abs(l - n));
    if (!o) {
      this._finish(t);
      return;
    }
    i.style.overflow = "hidden", i.style.transition = "none", i.style.height = `${n}px`, i.offsetHeight, i.style.transition = `height ${o}ms var(--mtx-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))`, i.style.height = `${l}px`, this._timer = setTimeout(() => {
      this._timer = null, this._finish(t);
    }, o);
  }
  /**
   * Fija el estado final de la región y limpia estilos en línea.
   * @param {boolean} expanded Estado final.
   */
  _finish(t) {
    const e = this.region.style;
    e.height = "", e.overflow = "", e.transition = "", t ? this._show() : this._hide();
  }
  /** Muestra la región. */
  _show() {
    this._isDetails ? this.element.open || (this.element.open = !0) : this.region.removeAttribute("hidden");
  }
  /** Oculta la región (con `until-found` cuando el navegador lo soporta). */
  _hide() {
    this._isDetails ? this.element.open && (this.element.open = !1) : this.region.setAttribute("hidden", this._untilFound ? "until-found" : "");
  }
  /**
   * Aplica el estado deshabilitado en raíz y resumen.
   * @param {boolean} disabled Nuevo estado.
   */
  _setDisabled(t) {
    this._disabled = t, this.element.classList.toggle("mtx-accordion--disabled", t), this.summary.tagName === "BUTTON" ? this.summary.disabled = t : t ? (this.summary.setAttribute("aria-disabled", "true"), this.summary.setAttribute("tabindex", "-1")) : (this.summary.removeAttribute("aria-disabled"), this.summary.removeAttribute("tabindex"));
  }
  /** @returns {boolean} `true` si el panel está expandido. */
  get expanded() {
    return this._expanded;
  }
  /** @param {boolean} value Expande (`true`) o contrae (`false`) con animación. */
  set expanded(t) {
    this._setState(!!t, { animate: !0, emit: !0 });
  }
  /** Expande el panel. */
  expand() {
    this._setState(!0, { animate: !0, emit: !0 });
  }
  /** Contrae el panel. */
  collapse() {
    this._setState(!1, { animate: !0, emit: !0 });
  }
  /** Alterna el panel. */
  toggle() {
    this._setState(!this._expanded, { animate: !0, emit: !0 });
  }
  /** @returns {boolean} `true` si está deshabilitado. */
  get disabled() {
    return this._disabled === !0;
  }
  /** Deshabilita el panel (no se puede alternar). */
  disable() {
    this._setDisabled(!0);
  }
  /** Habilita el panel. */
  enable() {
    this._setDisabled(!1);
  }
  /** Elimina listeners y temporizadores. */
  destroy() {
    this._timer && (clearTimeout(this._timer), this._timer = null, this._finish(this._expanded)), this.summary.removeEventListener("click", this._handleClick), this.summary.removeEventListener("keydown", this._handleKeyDown), this._handlePointerDown && this.summary.removeEventListener("pointerdown", this._handlePointerDown), this._handleToggle && this.element.removeEventListener("toggle", this._handleToggle), this._handleBeforeMatch && this.region.removeEventListener("beforematch", this._handleBeforeMatch), super.destroy();
  }
}
class Ns extends g {
  /**
   * Crea el grupo y normaliza el estado inicial si es exclusivo.
   * @param {HTMLElement} element Contenedor del grupo.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-accordion-group"), this.exclusive && this._normalizeInitial();
  }
  /** Deja abierto solo el primer panel declarado como expandido. */
  _normalizeInitial() {
    let t = !1;
    ae(this.element).forEach((e) => {
      const i = L(e);
      if (i ? i.expanded : gt(e, "data-expanded") === !0 || e.tagName === "DETAILS" && e.open || e.classList.contains("mtx-accordion--expanded")) {
        if (!t) {
          t = !0;
          return;
        }
        i ? i._setState(!1, { animate: !1, emit: !1 }) : (e.setAttribute("data-expanded", "false"), e.classList.remove("mtx-accordion--expanded"), e.tagName === "DETAILS" && (e.open = !1));
      }
    });
  }
  /** @returns {boolean} `true` si solo puede haber un panel abierto. */
  get exclusive() {
    return Ie(this.element);
  }
  /** @returns {Accordion[]} Instancias de los acordeones del grupo. */
  get accordions() {
    return ae(this.element).map((t) => L(t)).filter(Boolean);
  }
  /** Expande todos los paneles (solo en grupos no exclusivos). */
  expandAll() {
    this.exclusive || this.accordions.forEach((t) => !t.disabled && t.expand());
  }
  /** Contrae todos los paneles. */
  collapseAll() {
    this.accordions.forEach((t) => t.collapse());
  }
}
class Is extends g {
  /**
   * @param {HTMLElement} element Contenedor de acciones.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-accordion-actions"), gt(t, "data-disable-spacing") && t.classList.add("mtx-accordion-actions--disable-spacing");
  }
}
f("accordion", Ms);
f("accordion-group", Ns);
f("accordion-actions", Is);
const Zr = ["0_5", "1_5", "2_5"];
function Qr(r) {
  const t = String(r).trim().replace(".", "_");
  if (Zr.includes(t)) return t;
  if (!/^\d+$/.test(t)) return null;
  const e = Number(t);
  return e <= 12 ? String(e) : null;
}
class de extends g {
  /**
   * Crea una instancia del componente Grid.
   *
   * @param {HTMLElement} element Elemento HTML contenedor o ítem.
   */
  constructor(t) {
    super(t), this._setupDom();
  }
  /**
   * Configura las clases y atributos de la grilla al inicializar.
   * @private
   */
  _setupDom() {
    this.element.classList.contains("mtx-grid") || this.element.classList.add("mtx-grid"), (this.element.hasAttribute("data-container") || this.element.getAttribute("data-mtx") === "grid-container") && this.element.classList.add("mtx-grid--container"), (this.element.hasAttribute("data-item") || this.element.getAttribute("data-mtx") === "grid-item") && this.element.classList.add("mtx-grid--item"), ["xs", "sm", "md", "lg", "xl"].forEach((s) => {
      const a = this.element.getAttribute(`data-${s}`);
      a !== null && a !== "" && (this.element.classList.add("mtx-grid--item"), this.element.classList.add(`mtx-grid--${s}-${a}`));
    }), !this.isContainer && !this.isItem && this.element.classList.add("mtx-grid--container"), [null, "sm", "md", "lg", "xl"].forEach((s) => {
      const a = s ? `-${s}` : "";
      [["spacing", "setSpacing"], ["row-spacing", "setRowSpacing"], ["column-spacing", "setColumnSpacing"]].forEach(([n, l]) => {
        const o = this.element.getAttribute(`data-${n}${a}`);
        o !== null && o !== "" && this[l](o, s);
      });
    });
    const t = this.element.getAttribute("data-direction");
    t && this.setDirection(t);
    const e = this.element.getAttribute("data-justify");
    e && this.setJustifyContent(e);
    const i = this.element.getAttribute("data-align");
    i && this.setAlignItems(i);
  }
  /**
   * Indica si el elemento es un contenedor de grilla.
   *
   * @returns {boolean} `true` si es un contenedor.
   */
  get isContainer() {
    return this.element.classList.contains("mtx-grid-container") || this.element.classList.contains("mtx-grid--container");
  }
  /**
   * Indica si el elemento es un ítem/columna de grilla.
   *
   * @returns {boolean} `true` si es un ítem.
   */
  get isItem() {
    return this.element.classList.contains("mtx-grid-item") || this.element.classList.contains("mtx-grid--item");
  }
  /**
   * Sustituye una clase de espaciado del contenedor.
   * @param {string} kind `spacing`, `row-spacing` o `column-spacing`.
   * @param {number|string} value Entero de 0 a 12 o medio paso 0.5 / 1.5 / 2.5 (n × 8px).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl` (sin él aplica desde xs).
   * @private
   */
  _setSpacingClass(t, e, i) {
    if (!this.isContainer) return;
    const s = Qr(e);
    if (s === null) {
      console.warn(`Grid: ${t} no válido "${e}" (usa 0–12, 0.5, 1.5 o 2.5)`);
      return;
    }
    const a = i && i !== "xs" ? `mtx-grid--${i}-${t}-` : `mtx-grid--${t}-`;
    Array.from(this.element.classList).filter((n) => n.startsWith(a)).forEach((n) => this.element.classList.remove(n)), this.element.classList.add(`${a}${s}`);
  }
  /**
   * Cambia la separación horizontal y vertical entre ítems (gap de n × 8px).
   *
   * @param {number|string} spacing Entero de 0 a 12 o medio paso (0.5, 1.5, 2.5; también `0_5`).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl` desde el que aplica.
   */
  setSpacing(t, e) {
    this._setSpacingClass("spacing", t, e);
  }
  /**
   * Cambia solo la separación vertical entre filas.
   *
   * @param {number|string} spacing Entero de 0 a 12 o medio paso (0.5, 1.5, 2.5; también `0_5`).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl`.
   */
  setRowSpacing(t, e) {
    this._setSpacingClass("row-spacing", t, e);
  }
  /**
   * Cambia solo la separación horizontal entre columnas.
   *
   * @param {number|string} spacing Entero de 0 a 12 o medio paso (0.5, 1.5, 2.5; también `0_5`).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl`.
   */
  setColumnSpacing(t, e) {
    this._setSpacingClass("column-spacing", t, e);
  }
  /**
   * Establece la dirección flex (`row`, `column`, `row-reverse`, `column-reverse`).
   *
   * @param {string} direction Dirección flex.
   */
  setDirection(t) {
    Array.from(this.element.classList).filter(
      (i) => i.startsWith("mtx-grid--direction-")
    ).forEach((i) => this.element.classList.remove(i)), t && this.element.classList.add(`mtx-grid--direction-${t}`);
  }
  /**
   * Establece la alineación horizontal (`flex-start`, `center`, `flex-end`, etc.).
   *
   * @param {string} justify Justificación flex.
   */
  setJustifyContent(t) {
    Array.from(this.element.classList).filter(
      (i) => i.startsWith("mtx-grid--justify-")
    ).forEach((i) => this.element.classList.remove(i)), t && this.element.classList.add(`mtx-grid--justify-${t}`);
  }
  /**
   * Establece la alineación vertical (`flex-start`, `center`, `flex-end`, `stretch`, `baseline`).
   *
   * @param {string} align Alineación flex.
   */
  setAlignItems(t) {
    Array.from(this.element.classList).filter(
      (i) => i.startsWith("mtx-grid--align-")
    ).forEach((i) => this.element.classList.remove(i)), t && this.element.classList.add(`mtx-grid--align-${t}`);
  }
}
f("grid", de);
f("grid-container", de);
f("grid-item", de);
class he extends g {
  /**
   * Indica si el elemento es un `<li>` hijo directo de una lista.
   *
   * @param {HTMLElement} element Elemento a comprobar.
   * @returns {boolean} `true` si está dentro de `<ul>`, `<ol>` o `role="list"`.
   */
  static isListChild(t) {
    const e = t.parentElement;
    return t.tagName === "LI" && !!e && (e.tagName === "UL" || e.tagName === "OL" || e.getAttribute("role") === "list");
  }
  /**
   * Crea una instancia de la división.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-divider") || t.classList.add("mtx-divider"), t.getAttribute("data-orientation") === "vertical" && t.classList.add("mtx-divider--vertical"), he.isListChild(t) ? !(t.getAttribute("data-text") || t.textContent.trim()) && !t.hasAttribute("role") && !t.hasAttribute("aria-hidden") && t.setAttribute("aria-hidden", "true") : t.tagName !== "HR" && !t.hasAttribute("role") && t.setAttribute("role", "separator"), t.classList.contains("mtx-divider--vertical") && !t.hasAttribute("aria-orientation") && t.setAttribute("aria-orientation", "vertical");
    const i = t.getAttribute("data-variant");
    i === "inset" ? t.classList.add("mtx-divider--inset") : i === "middle" && t.classList.add("mtx-divider--middle"), t.hasAttribute("data-flex-item") && t.classList.add("mtx-divider--flex-item");
    const s = t.getAttribute("data-text") || (t.tagName !== "HR" && t.children.length === 0 && t.textContent.trim() ? t.textContent.trim() : null);
    if (s) {
      t.classList.add("mtx-divider--text");
      const a = t.getAttribute("data-text-align");
      if ((a === "left" || a === "right") && t.classList.add(`mtx-divider--text-${a}`), !t.querySelector(".mtx-divider__text")) {
        t.textContent = "";
        const n = document.createElement("span");
        n.className = "mtx-divider__text", n.textContent = s, t.appendChild(n);
      }
    }
  }
}
f("divider", he);
const vi = "http://www.w3.org/2000/svg", mt = 44, Ei = ["primary", "secondary", "error", "warning", "info", "success", "inherit"];
function ut(r, t) {
  if (r == null || r === "") return t;
  const e = parseFloat(r);
  return Number.isFinite(e) ? e : t;
}
class Os extends g {
  /**
   * @param {HTMLElement} element Elemento raíz.
   * @param {string} block Bloque BEM (`mtx-circular-progress` o `mtx-linear-progress`).
   * @param {string[]} variants Variantes admitidas.
   */
  constructor(t, e, i) {
    super(t), this._block = e, this._variants = i, t.classList.add(e), this._min = ut(t.getAttribute("data-min"), 0), this._max = ut(t.getAttribute("data-max"), 100), this._max <= this._min && (this._max = this._min + 100);
    const s = t.getAttribute("data-variant");
    this._variant = i.includes(s) ? s : this._inferVariant(), this._value = this._clamp(ut(t.getAttribute("data-value"), this._min)), this._color = "primary";
  }
  /** @returns {string} Variante deducida de los atributos presentes. */
  _inferVariant() {
    return this.element.hasAttribute("data-value") ? "determinate" : "indeterminate";
  }
  /**
   * Limita un número al rango [min, max].
   * @param {number} value Valor de entrada.
   * @returns {number} Valor acotado.
   */
  _clamp(t) {
    return Math.min(this._max, Math.max(this._min, t));
  }
  /** @returns {number} Porcentaje 0–100 del valor actual. */
  get percent() {
    return (this._value - this._min) / (this._max - this._min) * 100;
  }
  /** @returns {number} Valor actual dentro de [min, max]. */
  get value() {
    return this._value;
  }
  /** @param {number} next Nuevo valor. */
  set value(t) {
    this.setValue(t);
  }
  /**
   * Fija el valor; una variante indeterminate pasa a determinate.
   * @param {number} next Nuevo valor (se acota a [min, max]).
   * @returns {this} La instancia, para encadenar.
   */
  setValue(t) {
    const e = ut(t, this._value);
    return this._value = this._clamp(e), (this._variant === "indeterminate" || this._variant === "query") && (this._variant = "determinate"), this.element.setAttribute("data-value", String(this._value)), this._render(), this;
  }
  /** @returns {string} Variante actual. */
  get variant() {
    return this._variant;
  }
  /** @param {string} next Variante admitida por el componente. */
  set variant(t) {
    this._variants.includes(t) && (this._variant = t, this._render());
  }
  /** @returns {string} Color de la paleta aplicado. */
  get color() {
    return this._color;
  }
  /** @param {string} next `primary`, `secondary`, `error`, `warning`, `info`, `success` o `inherit`. */
  set color(t) {
    this._applyColor(t);
  }
  /**
   * Aplica la clase de color de la paleta.
   * @param {string|null} next Color solicitado.
   */
  _applyColor(t) {
    const e = Ei.includes(t) ? t : "primary";
    Ei.forEach((i) => this.element.classList.remove(`${this._block}--${i}`)), this.element.classList.add(`${this._block}--${e}`), this._color = e;
  }
  /** Aplica role, nombre accesible y aria-value* según la variante. */
  _syncAria() {
    const { element: t } = this;
    if (t.hasAttribute("data-decorative")) {
      ["role", "aria-label", "aria-valuemin", "aria-valuemax", "aria-valuenow"].forEach((e) => t.removeAttribute(e)), t.setAttribute("aria-hidden", "true");
      return;
    }
    if (t.setAttribute("role", "progressbar"), !t.hasAttribute("aria-labelledby")) {
      const e = t.getAttribute("data-label");
      e ? t.setAttribute("aria-label", e) : t.hasAttribute("aria-label") || t.setAttribute("aria-label", y("progress", "loading", null, "Loading", k(t)));
    }
    this._hasValue() ? (t.setAttribute("aria-valuemin", String(this._min)), t.setAttribute("aria-valuemax", String(this._max)), t.setAttribute("aria-valuenow", String(Math.round(this._value * 100) / 100))) : (t.removeAttribute("aria-valuemin"), t.removeAttribute("aria-valuemax"), t.removeAttribute("aria-valuenow"));
  }
  /** @returns {boolean} `true` si la variante expone un valor. */
  _hasValue() {
    return this._variant === "determinate" || this._variant === "buffer";
  }
  /** Actualiza las clases de variante. */
  _syncVariantClass() {
    this._variants.forEach((t) => this.element.classList.remove(`${this._block}--${t}`)), this.element.classList.add(`${this._block}--${this._variant}`);
  }
  /** Actualiza el texto de porcentaje visible, si existe. */
  _syncLabel() {
    this.labelEl && (this.labelEl.textContent = this._hasValue() ? `${Math.round(this.percent)}%` : "");
  }
}
class Je extends Os {
  /**
   * Crea la instancia y construye el SVG si falta.
   * @param {HTMLElement} element Elemento raíz.
   */
  constructor(t) {
    super(t, "mtx-circular-progress", ["indeterminate", "determinate"]), this._size = Math.max(4, ut(t.getAttribute("data-size"), 40)), this._thickness = Math.max(0.5, ut(t.getAttribute("data-thickness"), 3.6)), t.hasAttribute("data-disable-shrink") && t.classList.add("mtx-circular-progress--disable-shrink"), this._ensureStructure(), this._applyColor(t.getAttribute("data-color")), this._render();
  }
  /** Crea (o reutiliza) el SVG, el círculo, la pista y la etiqueta. */
  _ensureStructure() {
    const { element: t } = this, e = (mt - this._thickness) / 2;
    this._circumference = 2 * Math.PI * e, t.style.setProperty("--mtx-circular-progress-size", `${this._size}px`);
    let i = t.querySelector(".mtx-circular-progress__svg");
    i || (i = document.createElementNS(vi, "svg"), i.setAttribute("class", "mtx-circular-progress__svg"), i.setAttribute("viewBox", `${mt / 2} ${mt / 2} ${mt} ${mt}`), i.setAttribute("focusable", "false"), i.setAttribute("aria-hidden", "true"), t.insertBefore(i, t.firstChild));
    const s = (a) => {
      let n = i.querySelector(`.${a}`);
      return n || (n = document.createElementNS(vi, "circle"), n.setAttribute("class", a), i.appendChild(n)), n.setAttribute("cx", String(mt)), n.setAttribute("cy", String(mt)), n.setAttribute("r", String(e)), n.setAttribute("fill", "none"), n.setAttribute("stroke-width", String(this._thickness)), n;
    };
    (t.hasAttribute("data-track") || i.querySelector(".mtx-circular-progress__track")) && (t.classList.add("mtx-circular-progress--track"), this.trackEl = s("mtx-circular-progress__track"), i.insertBefore(this.trackEl, i.firstChild)), this.circleEl = s("mtx-circular-progress__circle"), this.labelEl = t.querySelector(".mtx-circular-progress__label"), !this.labelEl && t.hasAttribute("data-show-label") && (this.labelEl = document.createElement("span"), this.labelEl.className = "mtx-circular-progress__label", t.appendChild(this.labelEl)), this.labelEl && (this.labelEl.setAttribute("aria-hidden", "true"), t.classList.add("mtx-circular-progress--with-label"));
  }
  /** Pinta el arco según la variante y el valor. */
  _render() {
    if (this._syncVariantClass(), this._variant === "determinate") {
      const t = (100 - this.percent) / 100 * this._circumference;
      this.circleEl.style.strokeDasharray = this._circumference.toFixed(3), this.circleEl.style.strokeDashoffset = `${t.toFixed(3)}px`;
    } else
      this.circleEl.style.strokeDasharray = "", this.circleEl.style.strokeDashoffset = "";
    this._syncLabel(), this._syncAria();
  }
  /** @returns {number} Diámetro en px. */
  get size() {
    return this._size;
  }
}
class Ps extends Os {
  /**
   * Crea la instancia y construye pista y barras si faltan.
   * @param {HTMLElement} element Elemento raíz.
   */
  constructor(t) {
    super(t, "mtx-linear-progress", ["indeterminate", "determinate", "buffer", "query"]), this._buffer = this._clamp(ut(t.getAttribute("data-value-buffer"), this._max)), t.hasAttribute("data-rounded") && t.classList.add("mtx-linear-progress--rounded"), this._ensureStructure(), this._applyColor(t.getAttribute("data-color")), this._render();
  }
  /** @returns {string} Variante deducida (buffer si hay `data-value-buffer`). */
  _inferVariant() {
    return this.element.hasAttribute("data-value-buffer") ? "buffer" : super._inferVariant();
  }
  /** Crea (o reutiliza) la pista, el patrón de buffer, las dos barras y la etiqueta. */
  _ensureStructure() {
    const { element: t } = this;
    let e = t.querySelector(".mtx-linear-progress__track");
    e || (e = document.createElement("span"), e.className = "mtx-linear-progress__track", t.insertBefore(e, t.firstChild));
    const i = (s) => {
      let a = e.querySelector(`.${s.split(" ").join(".")}`);
      return a || (a = document.createElement("span"), a.className = s, e.appendChild(a)), a;
    };
    this.trackEl = e, this.dashedEl = i("mtx-linear-progress__dashed"), this.bar1El = i("mtx-linear-progress__bar mtx-linear-progress__bar1"), this.bar2El = i("mtx-linear-progress__bar mtx-linear-progress__bar2"), this.labelEl = t.querySelector(".mtx-linear-progress__label"), !this.labelEl && t.hasAttribute("data-show-label") && (this.labelEl = document.createElement("span"), this.labelEl.className = "mtx-linear-progress__label", t.appendChild(this.labelEl)), this.labelEl && (this.labelEl.setAttribute("aria-hidden", "true"), t.classList.add("mtx-linear-progress--with-label"));
  }
  /** @returns {number} Valor del buffer dentro de [min, max]. */
  get valueBuffer() {
    return this._buffer;
  }
  /** @param {number} next Nuevo valor de buffer. */
  set valueBuffer(t) {
    this.setBuffer(t);
  }
  /**
   * Fija el valor de buffer y activa la variante `buffer`.
   * @param {number} next Nuevo valor (se acota a [min, max]).
   * @returns {this} La instancia, para encadenar.
   */
  setBuffer(t) {
    return this._buffer = this._clamp(ut(t, this._buffer)), this._variant = "buffer", this.element.setAttribute("data-value-buffer", String(this._buffer)), this._render(), this;
  }
  /** Pinta las barras según la variante. */
  _render() {
    this._syncVariantClass();
    const t = (e) => `translateX(${((e - this._min) / (this._max - this._min) * 100 - 100).toFixed(3)}%)`;
    this._hasValue() ? (this.bar1El.style.transform = t(this._value), this.bar2El.style.transform = this._variant === "buffer" ? t(this._buffer) : "") : (this.bar1El.style.transform = "", this.bar2El.style.transform = ""), this._syncLabel(), this._syncAria();
  }
}
function Ze(r = {}) {
  const {
    size: t = 40,
    thickness: e = 3.6,
    color: i = "primary",
    value: s,
    label: a,
    decorative: n = !1,
    disableShrink: l = !1,
    className: o = "",
    tagName: c = "span"
  } = r, d = document.createElement(c);
  return d.setAttribute("data-mtx", "circular-progress"), d.setAttribute("data-size", String(t)), d.setAttribute("data-thickness", String(e)), d.setAttribute("data-color", i), s != null && d.setAttribute("data-value", String(s)), a && !n && d.setAttribute("data-label", a), n && d.setAttribute("data-decorative", ""), l && d.setAttribute("data-disable-shrink", ""), o && (d.className = o), new Je(d), d;
}
f("circular-progress", Je);
f("linear-progress", Ps);
const fe = ["center", "start", "end"], tn = ["primary", "secondary"];
class $s extends g {
  /**
   * Crea una instancia del botón.
   *
   * @param {HTMLElement} element Elemento `<button>` o `<a>` asociado.
   */
  constructor(t) {
    super(t);
    const e = t.getAttribute("data-size");
    e && !t.classList.contains(`mtx-button--${e}`) && t.classList.add(`mtx-button--${e}`), t.hasAttribute("data-small") && !t.classList.contains("mtx-button--small") ? t.classList.add("mtx-button--small") : t.hasAttribute("data-large") && !t.classList.contains("mtx-button--large") && t.classList.add("mtx-button--large");
    const i = t.getAttribute("data-color");
    i && i !== "primary" && !t.classList.contains(`mtx-button--${i}`) && t.classList.add(`mtx-button--${i}`);
    const s = t.getAttribute("data-surface");
    tn.includes(s) && !t.classList.contains(`mtx-button--on-${s}`) && t.classList.add(`mtx-button--on-${s}`), this._renderIcons(), this._isLink = t.tagName.toLowerCase() === "a", this._handlePointerDown = (a) => {
      if (this.disabled || a.button !== 0) return;
      const n = t.classList.contains("mtx-icon-button");
      z(t, a, { centered: n });
    }, t.addEventListener("pointerdown", this._handlePointerDown), this._isLink && (this._handleClick = (a) => {
      this.disabled && (a.preventDefault(), a.stopPropagation());
    }, t.addEventListener("click", this._handleClick)), this._loading = !1, t.hasAttribute("data-loading") && t.getAttribute("data-loading") !== "false" && this.setLoading(!0);
  }
  /**
   * Genera los iconos de `data-start-icon` / `data-end-icon` (ligadura Material) si aún no existen.
   * Idempotente: no duplica un `.mtx-button__icon` ya presente en ese extremo.
   */
  _renderIcons() {
    const { element: t } = this, e = () => Array.from(t.childNodes).filter((o) => !(o.nodeType === Node.TEXT_NODE && !o.textContent.trim()) && !(o.classList && (o.classList.contains("mtx-ripple-container") || o.classList.contains("mtx-button__loading-indicator")))), i = (o) => !!(o && o.classList && o.classList.contains("mtx-button__icon")), s = (o, c) => {
      const d = document.createElement("span");
      return d.className = `mtx-button__icon mtx-button__icon--${c} material-icons`, d.setAttribute("aria-hidden", "true"), d.textContent = o, d;
    }, a = (t.getAttribute("data-start-icon") || "").trim();
    a && !i(e()[0]) && t.insertBefore(s(a, "start"), t.firstChild);
    const n = (t.getAttribute("data-end-icon") || "").trim(), l = e();
    n && !(l.length > 1 && i(l[l.length - 1])) && t.appendChild(s(n, "end"));
  }
  /** @returns {boolean} `true` mientras el botón está en estado de carga. */
  get loading() {
    return this._loading;
  }
  /** @param {boolean} value Activa o desactiva la carga. */
  set loading(t) {
    this.setLoading(t);
  }
  /**
   * Activa o desactiva el estado de carga: deshabilita, marca `aria-busy` y muestra el indicador.
   * Al desactivarlo restaura el estado `disabled` previo.
   *
   * @param {boolean} value `true` para cargar.
   * @returns {this} La instancia, para encadenar.
   */
  setLoading(t) {
    const e = !!t;
    if (e === this._loading) return this;
    const { element: i } = this;
    if (this._loading = e, e) {
      this._wasDisabled = this.disabled, this._prevTabIndex = i.getAttribute("tabindex"), this._wasDisabled || this.disable();
      const s = i.getAttribute("data-loading-position");
      this._loadingPosition = fe.includes(s) ? s : "center", i.setAttribute("aria-busy", "true"), i.setAttribute("data-loading", ""), i.classList.add("mtx-button--loading", `mtx-button--loading-${this._loadingPosition}`), this._mountIndicator();
    } else
      i.classList.remove("mtx-button--loading", ...fe.map((s) => `mtx-button--loading-${s}`)), i.removeAttribute("aria-busy"), i.removeAttribute("data-loading"), this._indicator && this._indicator.remove(), this._indicator = null, this._hiddenIcon && this._hiddenIcon.classList.remove("mtx-button__icon--loading-hidden"), this._hiddenIcon = null, this._wasDisabled || (this.enable(), this._isLink && (this._prevTabIndex === null ? i.removeAttribute("tabindex") : i.setAttribute("tabindex", this._prevTabIndex)));
    return this;
  }
  /** Inserta (o reutiliza) el indicador y oculta el icono que sustituye. */
  _mountIndicator() {
    const { element: t } = this, e = this._loadingPosition;
    let i = t.querySelector(":scope > .mtx-button__loading-indicator");
    if (!i) {
      i = document.createElement("span");
      const n = t.getAttribute("data-loading-indicator");
      n ? (i.textContent = n, i.classList.add("mtx-button__loading-indicator--text")) : i.appendChild(Ze({ size: 16, color: "inherit", decorative: !0 }));
    }
    i.classList.add("mtx-button__loading-indicator"), fe.forEach((n) => i.classList.toggle(`mtx-button__loading-indicator--${n}`, n === e)), i.setAttribute("aria-hidden", "true");
    const s = Array.from(t.childNodes).filter((n) => n !== i && !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) && !(n.classList && n.classList.contains("mtx-ripple-container"))), a = (n) => n && n.classList && n.classList.contains("mtx-button__icon");
    if (e === "start") {
      const n = s[0];
      a(n) && (this._hiddenIcon = n), t.insertBefore(i, n || null);
    } else if (e === "end") {
      const n = s[s.length - 1];
      a(n) && (this._hiddenIcon = n), t.insertBefore(i, n ? n.nextSibling : null);
    } else
      t.appendChild(i);
    this._hiddenIcon && (this._hiddenIcon.classList.add("mtx-button__icon--loading-hidden"), ["start", "end"].forEach((n) => i.classList.toggle(
      `mtx-button__icon--${n}`,
      this._hiddenIcon.classList.contains(`mtx-button__icon--${n}`)
    ))), this._indicator = i;
  }
  /**
   * Indica si el botón está deshabilitado.
   *
   * Cubre tanto el atributo nativo `disabled` (elementos `<button>`) como
   * `aria-disabled` (necesario cuando el componente se renderiza como
   * `<a>`, que no soporta `disabled` nativamente).
   *
   * @returns {boolean} `true` si el botón está deshabilitado.
   */
  get disabled() {
    return this.element.disabled || this.element.getAttribute("aria-disabled") === "true";
  }
  /**
   * Deshabilita el botón.
   *
   * En elementos de formulario usa el atributo nativo `disabled`; en enlaces
   * (`<a>`) aplica `aria-disabled` y lo retira del orden de tabulación.
   */
  disable() {
    this.element.disabled !== void 0 ? this.element.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.tabIndex = -1);
  }
  /**
   * Habilita el botón.
   */
  enable() {
    this.element.disabled !== void 0 ? this.element.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.tabIndex = 0);
  }
  /**
   * Destruye la instancia del botón y elimina los event listeners asociados.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this._isLink && this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
f("button", $s);
const be = ["contained", "outlined", "text"], wi = ["small", "medium", "large"], Li = ["primary", "secondary", "error", "warning", "info", "success", "inherit"], en = ["first", "middle", "last"];
function ge(r, t) {
  return r.hasAttribute(t) && r.getAttribute(t) !== "false";
}
class Bs extends g {
  /**
   * Crea la instancia, aplica la semántica de grupo y prepara los botones.
   *
   * @param {HTMLElement} element Contenedor del grupo.
   */
  constructor(t) {
    super(t);
    const e = t.getAttribute("data-variant");
    this.variant = be.includes(e) ? e : be.find((l) => t.classList.contains(`mtx-button-group--${l}`)) || "outlined";
    const i = t.getAttribute("data-size");
    this.size = wi.includes(i) ? i : "medium";
    const s = t.getAttribute("data-color");
    this.color = Li.includes(s) ? s : "primary", this.orientation = t.getAttribute("data-orientation") === "vertical" || t.classList.contains("mtx-button-group--vertical") ? "vertical" : "horizontal", this._disabledByGroup = /* @__PURE__ */ new WeakSet();
    const { classList: a } = t;
    a.add("mtx-button-group", `mtx-button-group--${this.variant}`, `mtx-button-group--${this.orientation}`), this.color !== "primary" && a.add(`mtx-button-group--${this.color}`), this.size !== "medium" && a.add(`mtx-button-group--${this.size}`), ge(t, "data-full-width") && a.add("mtx-button-group--full-width"), ge(t, "data-disable-elevation") && a.add("mtx-button-group--disable-elevation"), !t.hasAttribute("role") && t.tagName.toLowerCase() !== "fieldset" && t.setAttribute("role", "group");
    const n = t.getAttribute("data-label");
    n && !t.hasAttribute("aria-label") && t.setAttribute("aria-label", n), this.orientation === "vertical" && t.getAttribute("role") === "toolbar" && t.setAttribute("aria-orientation", "vertical"), this.refresh(), ge(t, "data-disabled") && this.disable();
  }
  /** @returns {HTMLElement[]} Botones directos del grupo. */
  get buttons() {
    return Array.from(this.element.children).filter((t) => t.matches('button, a, .mtx-button, [data-mtx="button"]'));
  }
  /**
   * Prepara los hijos (clases heredadas, Button, posición). Llamar tras añadir o quitar botones.
   *
   * @returns {this} La instancia.
   */
  refresh() {
    const t = this.buttons;
    return t.forEach((e, i) => {
      this._prepareButton(e);
      let s = "middle";
      i === 0 && (s = "first"), i === t.length - 1 && (s = t.length === 1 ? "first" : "last"), en.forEach((a) => e.classList.toggle(`mtx-button-group__${a}`, a === s)), t.length === 1 && e.classList.add("mtx-button-group__last"), this.isDisabled && !e.disabled && e.getAttribute("aria-disabled") !== "true" && this._setButtonDisabled(e, !0);
    }), this;
  }
  /**
   * Aplica al hijo la variante/tamaño/color del grupo si no declara los suyos e inicializa Button.
   * @param {HTMLElement} button Botón hijo.
   */
  _prepareButton(t) {
    const { classList: e } = t;
    e.add("mtx-button", "mtx-button-group__grouped"), be.some((i) => e.contains(`mtx-button--${i}`)) || e.add(`mtx-button--${this.variant}`), !t.hasAttribute("data-size") && !wi.some((i) => e.contains(`mtx-button--${i}`)) && this.size !== "medium" && e.add(`mtx-button--${this.size}`), !t.hasAttribute("data-color") && this.color !== "primary" && !Li.some((i) => e.contains(`mtx-button--${i}`)) && e.add(`mtx-button--${this.color}`), this.element.classList.contains("mtx-button-group--disable-elevation") && e.add("mtx-button--disable-elevation"), this.element.classList.contains("mtx-button-group--full-width") && e.add("mtx-button--full-width"), t.tagName.toLowerCase() === "button" && !t.hasAttribute("type") && (t.type = "button"), t.hasAttribute("data-mtx") || t.setAttribute("data-mtx", "button"), t.getAttribute("data-mtx") === "button" && !L(t) && U(t);
  }
  /**
   * Deshabilita o habilita un botón usando su instancia Button si existe.
   * @param {HTMLElement} button Botón.
   * @param {boolean} disabled Nuevo estado.
   */
  _setButtonDisabled(t, e) {
    const i = L(t);
    e ? (this._disabledByGroup.add(t), i && typeof i.disable == "function" ? i.disable() : "disabled" in t ? t.disabled = !0 : t.setAttribute("aria-disabled", "true")) : (this._disabledByGroup.delete(t), i && typeof i.enable == "function" ? i.enable() : "disabled" in t ? t.disabled = !1 : t.removeAttribute("aria-disabled"));
  }
  /** @returns {boolean} `true` si el grupo está deshabilitado. */
  get isDisabled() {
    return this.element.classList.contains("mtx-button-group--disabled");
  }
  /** @returns {boolean} Alias de `isDisabled` (compatibilidad con ComponentBase). */
  get disabled() {
    return this.isDisabled;
  }
  /**
   * Deshabilita todos los botones del grupo (recuerda los que ya lo estaban).
   *
   * @returns {this} La instancia.
   */
  disable() {
    return this.element.classList.add("mtx-button-group--disabled"), this.element.setAttribute("aria-disabled", "true"), this.buttons.forEach((t) => {
      t.disabled === !0 || t.getAttribute("aria-disabled") === "true" || this._setButtonDisabled(t, !0);
    }), this;
  }
  /**
   * Habilita los botones que deshabilitó el grupo.
   *
   * @returns {this} La instancia.
   */
  enable() {
    return this.element.classList.remove("mtx-button-group--disabled"), this.element.removeAttribute("aria-disabled"), this.buttons.forEach((t) => {
      this._disabledByGroup.has(t) && this._setButtonDisabled(t, !1);
    }), this;
  }
}
f("button-group", Bs);
class Qe extends g {
  /**
   * Crea una instancia del botón de icono.
   *
   * @param {HTMLElement} element Elemento `<button>` asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-icon-button") || t.classList.add("mtx-icon-button");
    const e = t.getAttribute("data-size");
    e && t.classList.add(`mtx-icon-button--${e}`);
    const i = t.getAttribute("data-color");
    i && t.classList.add(`mtx-icon-button--${i}`);
    const s = t.getAttribute("data-edge");
    (s === "start" || s === "end") && t.classList.add(`mtx-icon-button--edge-${s}`);
    const a = t.getAttribute("data-icon");
    if (a && !t.querySelector(".material-icons") && !t.querySelector("svg") && t.children.length === 0) {
      const n = document.createElement("span");
      n.className = "material-icons", n.setAttribute("aria-hidden", "true"), n.textContent = a, t.appendChild(n);
    }
    this._handlePointerDown = (n) => {
      this.disabled || n.button !== 0 || z(t, n, { centered: !0 });
    }, t.addEventListener("pointerdown", this._handlePointerDown);
  }
  /**
   * Destruye la instancia y elimina los event listeners asociados.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
}
f("icon-button", Qe);
class Fs extends g {
  /**
   * Crea una instancia del FAB.
   *
   * @param {HTMLElement} element Elemento `<button>` o `<a>` asociado.
   */
  constructor(t) {
    super(t), this.element.classList.add("mtx-fab"), this._isLink = t.tagName.toLowerCase() === "a";
    const e = t.getAttribute("data-size");
    e && (this.size = e);
    const i = t.getAttribute("data-color");
    i && (this.color = i), t.getAttribute("data-variant") === "extended" && this.element.classList.add("mtx-fab--extended");
    const a = t.getAttribute("data-icon"), n = t.getAttribute("data-label");
    if (n && this.element.classList.add("mtx-fab--extended"), a && !t.querySelector(".material-icons") && !t.querySelector("svg")) {
      const l = document.createElement("span");
      l.className = "material-icons", l.setAttribute("aria-hidden", "true"), l.textContent = a, t.insertBefore(l, t.firstChild);
    }
    if (n && !t.querySelector("span:not(.material-icons)")) {
      const l = document.createElement("span");
      l.textContent = n, t.appendChild(l);
    }
    this._handlePointerDown = (l) => {
      this.disabled || l.button !== 0 || z(t, l);
    }, t.addEventListener("pointerdown", this._handlePointerDown), this._isLink && (this._handleClick = (l) => {
      this.disabled && (l.preventDefault(), l.stopPropagation());
    }, t.addEventListener("click", this._handleClick));
  }
  /**
   * Indica si el FAB está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.element.disabled || this.element.getAttribute("aria-disabled") === "true";
  }
  /**
   * Deshabilita el FAB.
   */
  disable() {
    this.element.disabled !== void 0 ? this.element.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.tabIndex = -1);
  }
  /**
   * Habilita el FAB.
   */
  enable() {
    this.element.disabled !== void 0 ? this.element.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.tabIndex = 0);
  }
  /** @returns {string} Tamaño del FAB (`small`, `medium`, `large`). */
  get size() {
    return this._size || "large";
  }
  /** @param {string} value Nuevo tamaño. */
  set size(t) {
    this._size = t, this.element.classList.remove("mtx-fab--small", "mtx-fab--medium", "mtx-fab--large"), t && t !== "large" && this.element.classList.add(`mtx-fab--${t}`);
  }
  /** @returns {string} Color del FAB. */
  get color() {
    return this._color || "primary";
  }
  /** @param {string} value Nuevo color. */
  set color(t) {
    this._color = t, this.element.classList.remove(
      "mtx-fab--primary",
      "mtx-fab--secondary",
      "mtx-fab--default",
      "mtx-fab--error",
      "mtx-fab--warning",
      "mtx-fab--info",
      "mtx-fab--success",
      "mtx-fab--inherit"
    ), t && t !== "primary" && this.element.classList.add(`mtx-fab--${t}`);
  }
  /**
   * Destruye la instancia del FAB y remueve sus event listeners.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this._isLink && this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
f("fab", Fs);
const Rs = ["top", "right", "bottom", "left"], Oe = { top: "bottom", bottom: "top", left: "right", right: "left" };
function ti(r) {
  const [t, e] = String(r || "bottom").trim().split("-");
  return {
    side: Rs.includes(t) ? t : "bottom",
    align: e === "start" || e === "end" ? e : ""
  };
}
function xt(r) {
  const t = r && r.nodeType === 1 ? r : document.documentElement, e = t.closest ? t.closest("[dir]") : null;
  if (e) return e.getAttribute("dir").toLowerCase() === "rtl";
  try {
    return getComputedStyle(t).direction === "rtl";
  } catch {
    return !1;
  }
}
function Hs() {
  const r = document.documentElement;
  return {
    width: r.clientWidth || window.innerWidth || 0,
    height: r.clientHeight || window.innerHeight || 0
  };
}
function sn(r) {
  const t = r.offsetWidth, e = r.offsetHeight;
  if (t || e) return { width: t, height: e };
  const i = r.getBoundingClientRect();
  return { width: i.width, height: i.height };
}
function ki(r, t, e, i, s) {
  let a, n;
  return e === "top" || e === "bottom" ? (n = e === "top" ? r.top - t.height - s : r.bottom + s, i === "start" ? a = r.left : i === "end" ? a = r.right - t.width : a = r.left + r.width / 2 - t.width / 2) : (a = e === "left" ? r.left - t.width - s : r.right + s, i === "start" ? n = r.top : i === "end" ? n = r.bottom - t.height : n = r.top + r.height / 2 - t.height / 2), { x: a, y: n };
}
function Si(r, t, e, i, s) {
  switch (e) {
    case "top":
      return Math.max(0, s - r.y);
    case "bottom":
      return Math.max(0, r.y + t.height - (i.height - s));
    case "left":
      return Math.max(0, s - r.x);
    default:
      return Math.max(0, r.x + t.width - (i.width - s));
  }
}
function xe(r, t, e) {
  return e < t ? t : Math.min(Math.max(r, t), e);
}
function Vt(r, t, e = {}) {
  const {
    placement: i = "bottom",
    offset: s = 8,
    flip: a = !0,
    shift: n = !0,
    padding: l = 8
  } = e, o = typeof e.rtl == "boolean" ? e.rtl : xt(r), c = r.getBoundingClientRect(), d = sn(t), h = Hs(), u = ti(i);
  let m = u.side;
  const _ = m === "top" || m === "bottom";
  let x = u.align;
  o && _ && x && (x = x === "start" ? "end" : "start");
  let A = ki(c, d, m, x, s);
  if (a) {
    const $ = Si(A, d, m, h, l);
    if ($ > 0) {
      const D = Oe[m], T = ki(c, d, D, x, s);
      Si(T, d, D, h, l) < $ && (m = D, A = T);
    }
  }
  let { x: p, y: b } = A;
  const C = m === "top" || m === "bottom";
  n && (C ? p = xe(p, l, h.width - l - d.width) : b = xe(b, l, h.height - l - d.height));
  const S = C ? d.width : d.height, F = C ? c.left + c.width / 2 - p : c.top + c.height / 2 - b, R = xe(F, Math.min(12, S / 2), S - Math.min(12, S / 2));
  return {
    x: Math.round(p),
    y: Math.round(b),
    placement: u.align ? `${m}-${u.align}` : m,
    side: m,
    align: x,
    arrowOffset: Math.round(R)
  };
}
function Nt(r, t, e) {
  let i = !0;
  const s = () => {
    i && e();
  }, a = { capture: !0, passive: !0 };
  window.addEventListener("scroll", s, a), window.addEventListener("resize", s, { passive: !0 });
  let n = null;
  return typeof ResizeObserver < "u" && (n = new ResizeObserver(s), r && r.nodeType === 1 && n.observe(r), t && t.nodeType === 1 && n.observe(t)), e(), function() {
    i = !1, window.removeEventListener("scroll", s, a), window.removeEventListener("resize", s, { passive: !0 }), n && n.disconnect();
  };
}
function qs(r, t, e = {}) {
  const { placement: i = "bottom-start", offset: s = 4, padding: a = 8, matchWidth: n = !1 } = e, l = Rs.includes(e.lockSide) ? e.lockSide : null, o = typeof e.rtl == "boolean" ? e.rtl : xt(r), c = r.getBoundingClientRect(), d = Hs(), h = ti(i);
  let u = h.side, m;
  const _ = l && (l === "top" || l === "bottom") == (u === "top" || u === "bottom");
  if (_)
    u = l, m = u === "top" ? Math.max(0, c.top - a - s) : u === "bottom" ? Math.max(0, d.height - a - c.bottom - s) : Math.max(0, d.height - a * 2);
  else if (u === "top" || u === "bottom") {
    const p = Math.max(0, d.height - a - c.bottom - s), b = Math.max(0, c.top - a - s), C = (e.content || t).scrollHeight, S = u === "top" ? b : p, F = u === "top" ? p : b;
    C > S && F > S && (u = Oe[u]), m = u === "top" ? b : p;
  } else
    o && (u = Oe[u]), m = Math.max(0, d.height - a * 2);
  t.style.position = "fixed", t.style.maxHeight = `${m}px`, t.style.maxWidth = `${Math.max(0, d.width - a * 2)}px`, n && (t.style.minWidth = `${c.width}px`);
  const x = u === "top" || u === "bottom", A = Vt(r, t, {
    placement: h.align ? `${u}-${h.align}` : u,
    offset: s,
    padding: a,
    flip: !x && !_,
    shift: !0,
    rtl: o
  });
  return t.style.left = `${A.x}px`, t.style.top = `${A.y}px`, t.style.transformOrigin = x ? A.side === "top" ? "bottom" : "top" : `${A.side === "left" ? "right" : "left"} top`, t.dataset.placement = A.side, { x: A.x, y: A.y, placement: A.placement, side: A.side, maxHeight: m };
}
const Ci = { snackbar: 0, modal: 1, popup: 1, tooltip: 2 }, ei = "__mtxEscapeHandled", tt = [], Dt = /* @__PURE__ */ new Map();
let an = 0, Ti = !1;
function rn(r) {
  if (typeof r == "function") return () => [].concat(r() || []).filter(Boolean);
  const t = [].concat(r || []).filter(Boolean);
  return () => t;
}
function zs(r) {
  return tt.find((t) => t.owner === r);
}
function nn(r) {
  return r.slice().sort((t, e) => t.priority - e.priority || t.order - e.order);
}
function ln(r) {
  if (r.key !== "Escape" || r.isComposing || r.defaultPrevented || r[ei]) return;
  const t = ii(!0);
  t && (si(r), typeof t.onEscape == "function" && t.onEscape(r));
}
function Vs() {
  for (let r = tt.length - 1; r >= 0; r -= 1) {
    const t = tt[r].nodes();
    if (t.length && t.every((e) => !e.isConnected)) {
      const [e] = tt.splice(r, 1);
      Ys(e.owner);
    }
  }
}
function on() {
  Ti || typeof document > "u" || (Ti = !0, document.addEventListener("keydown", ln));
}
function ii(r) {
  Vs();
  const t = nn(r ? tt : tt.filter((e) => !e.transient));
  return t[t.length - 1] || null;
}
function X(r, { kind: t = "popup", onEscape: e = null, nodes: i, stack: s } = {}) {
  if (!r) return 0;
  on(), q(r), Vs();
  const a = tt.filter((n) => n.priority === 1).length;
  return a > 0 && s && Ci[t] !== 2 && [].concat((typeof s == "function" ? s() : s) || []).forEach((l) => l && l.node && cn(r, l.node, 2 * a + (l.offset || 0))), tt.push({
    owner: r,
    kind: t,
    priority: Ci[t] ?? 1,
    transient: t === "tooltip",
    order: ++an,
    onEscape: e,
    nodes: rn(i)
  }), a;
}
function Us(r) {
  const t = Dt.get(r);
  if (!t) return;
  if (!t.claims.size) {
    r.style.zIndex = t.original, Dt.delete(r);
    return;
  }
  const e = Math.max(...t.claims.values());
  r.style.zIndex = `calc(var(--mtx-z-index-modal, 1300) + ${e})`;
}
function cn(r, t, e) {
  if (!t.style) return;
  let i = Dt.get(t);
  i || (i = { original: t.style.zIndex, claims: /* @__PURE__ */ new Map() }, Dt.set(t, i)), i.claims.set(r, e), Us(t);
}
function Ys(r) {
  Array.from(Dt.keys()).forEach((t) => {
    const e = Dt.get(t);
    e && e.claims.delete(r) && Us(t);
  });
}
function q(r) {
  const t = tt.findIndex((e) => e.owner === r);
  t >= 0 && tt.splice(t, 1), Ys(r);
}
function Ks(r) {
  const t = zs(r);
  if (!t) return !1;
  const e = ii(t.transient);
  return !!(e && e.owner === r);
}
function Ws() {
  const r = ii(!0);
  return r ? r.owner : null;
}
function lt(r, t) {
  if (!t || typeof t != "object") return !1;
  const e = zs(r), i = e ? e.order : -1 / 0;
  return tt.some((s) => s !== e && s.order > i && s.kind !== "snackbar" && s.nodes().some((a) => a === t || a.contains && a.contains(t)));
}
function si(r) {
  if (r) {
    try {
      r[ei] = !0;
    } catch {
    }
    r.cancelable && r.preventDefault();
  }
}
function dn(r) {
  return !!(r && r[ei]);
}
const hn = '[data-mtx-tooltip], [data-mtx="tooltip"]', Di = 'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]', Q = {
  placement: "bottom",
  enterDelay: 100,
  enterNextDelay: 0,
  leaveDelay: 0,
  enterTouchDelay: 700,
  leaveTouchDelay: 1500,
  hysteresis: 800,
  offset: 14,
  touchOffset: 24,
  exitDuration: 150
}, Ht = /* @__PURE__ */ new WeakMap(), Pe = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new Set();
let Ae = !1, pt = null, ye = !1;
function un(r, t) {
  return r.hasAttribute(t) ? r.getAttribute(t) !== "false" : null;
}
function mn(r) {
  const t = r.cloneNode(!0);
  t.querySelectorAll('[aria-hidden="true"], .material-icons, [class*="material-symbols"], .mtx-ripple, script, style').forEach((i) => i.remove());
  const e = Array.from(t.querySelectorAll("img[alt]")).map((i) => i.getAttribute("alt")).join(" ");
  return `${t.textContent || ""} ${e}`.replace(/\s+/g, " ").trim();
}
function $e(r) {
  const t = (r.getAttribute("aria-label") || "").trim();
  if (t) return t;
  const e = (r.getAttribute("aria-labelledby") || "").trim();
  if (e) {
    const i = e.split(/\s+/).map((s) => document.getElementById(s)).filter(Boolean).map((s) => s.textContent.trim()).join(" ").trim();
    if (i) return i;
  }
  if (r.labels && r.labels.length) {
    const i = Array.from(r.labels).map((s) => s.textContent.trim()).join(" ").trim();
    if (i) return i;
  }
  return r.tagName === "IMG" ? (r.getAttribute("alt") || "").trim() : /^(INPUT|TEXTAREA|SELECT)$/.test(r.tagName) ? (r.getAttribute("title") || r.getAttribute("placeholder") || "").trim() : mn(r) || (r.getAttribute("title") || "").trim();
}
function Mi(r) {
  return String(r || "").replace(/\s+/g, " ").trim().toLowerCase();
}
function Ni(r, t, e, i) {
  const s = (r.getAttribute(t) || "").split(/\s+/).filter(Boolean).filter((a) => a !== e);
  i && s.push(e), s.length ? r.setAttribute(t, s.join(" ")) : r.removeAttribute(t);
}
class re extends g {
  /**
   * Crea el tooltip de un disparador.
   *
   * @param {HTMLElement} element Disparador o contenedor `data-mtx="tooltip"`.
   * @param {Object} [options] Opciones que prevalecen sobre los atributos.
   * @param {string} [options.title] Texto del tooltip.
   * @param {string} [options.placement] Colocación (`top|bottom|left|right` + `-start|-end`).
   * @param {boolean} [options.arrow] Muestra la flecha.
   * @param {number} [options.enterDelay] Retardo de apertura (ms).
   * @param {number} [options.leaveDelay] Retardo de cierre (ms).
   * @param {boolean} [options.followCursor] Sigue al puntero.
   * @param {boolean} [options.declarative] Uso interno: no ocupa el registro del elemento.
   */
  constructor(t, e = {}) {
    const i = L(t), s = t.hasAttribute("data-mtx-initialized");
    super(t), this._declarative = !!e.declarative, this._declarative && (i ? et(t, i) : Ft(t), s || t.removeAttribute("data-mtx-initialized"), Ht.set(t, this)), this.options = { ...e }, delete this.options.declarative, this.id = P("mtx-tooltip"), this.popup = null, this.isOpen = !1, this._timers = {}, this._pointer = null, this._touch = !1, this._stopAutoUpdate = null, this.syncAccessibleName();
  }
  /**
   * Elemento que recibe el foco y los atributos ARIA (el propio o su primer hijo enfocable).
   *
   * @returns {HTMLElement} Destino.
   */
  get target() {
    const t = this.element;
    return t.getAttribute("data-mtx") !== "tooltip" || t.matches(Di) ? t : t.querySelector(Di) || t.firstElementChild || t;
  }
  /**
   * Texto actual del tooltip.
   *
   * @returns {string} Título.
   */
  get title() {
    if (typeof this.options.title == "string") return this.options.title;
    const t = this.element;
    return t.getAttribute("data-mtx") === "tooltip" && t.hasAttribute("data-title") ? t.getAttribute("data-title") : t.getAttribute("data-mtx-tooltip") || t.getAttribute("data-title") || "";
  }
  /**
   * Lee una opción: objeto de opciones, `data-tooltip-{name}` o `data-{name}` (forma avanzada).
   *
   * @param {string} key Clave camelCase.
   * @param {string} attr Sufijo kebab-case del atributo.
   * @param {'string'|'number'|'boolean'} type Tipo esperado.
   * @returns {*} Valor o `undefined`.
   * @private
   */
  _option(t, e, i) {
    if (this.options[t] !== void 0) return this.options[t];
    const s = this.element, a = [`data-tooltip-${e}`];
    s.getAttribute("data-mtx") === "tooltip" && a.push(`data-${e}`);
    for (const n of a) {
      if (!s.hasAttribute(n)) continue;
      if (i === "boolean") return un(s, n);
      const l = s.getAttribute(n);
      if (i === "number") {
        const o = parseInt(l, 10);
        if (!Number.isNaN(o)) return o;
        continue;
      }
      if (l) return l;
    }
  }
  /** @returns {string} Colocación configurada. */
  get placement() {
    return this._option("placement", "placement", "string") || Q.placement;
  }
  /** @returns {boolean} Si muestra flecha. */
  get arrow() {
    return this._option("arrow", "arrow", "boolean") === !0;
  }
  /** @returns {boolean} Si sigue al cursor. */
  get followCursor() {
    return this._option("followCursor", "follow-cursor", "boolean") === !0;
  }
  /** @returns {number} Retardo de apertura (ms). */
  get enterDelay() {
    const t = this._option("enterDelay", "enter-delay", "number");
    return t === void 0 ? Q.enterDelay : Math.max(0, t);
  }
  /** @returns {number} Retardo de cierre (ms). */
  get leaveDelay() {
    const t = this._option("leaveDelay", "leave-delay", "number");
    return t === void 0 ? Q.leaveDelay : Math.max(0, t);
  }
  /**
   * Si el disparador no tiene nombre accesible, usa el título como `aria-label`.
   * Si lo puso Materix antes, lo mantiene sincronizado con el título.
   */
  syncAccessibleName() {
    const t = this.target, e = this.title.trim();
    if (t.hasAttribute("data-mtx-tooltip-label")) {
      e && t.setAttribute("aria-label", e);
      return;
    }
    !e || $e(t) || (t.setAttribute("aria-label", e), t.setAttribute("data-mtx-tooltip-label", ""));
  }
  /**
   * Cambia el texto del tooltip (y el `aria-label` si lo generó Materix).
   *
   * @param {string} title Nuevo texto.
   */
  setTitle(t) {
    const e = String(t ?? ""), i = this.element;
    typeof this.options.title == "string" ? this.options.title = e : i.getAttribute("data-mtx") === "tooltip" ? i.setAttribute("data-title", e) : i.setAttribute("data-mtx-tooltip", e), this.refresh();
  }
  /**
   * Relee el título: sincroniza el nombre accesible y el texto visible (sin escribir atributos de título).
   */
  refresh() {
    const t = this.title;
    this.syncAccessibleName(), this.popup && (this.popup.querySelector(".mtx-tooltip__label").textContent = t), t.trim() ? this.isOpen && this.update() : this.close({ immediate: !0 });
  }
  /**
   * Programa la apertura con el retardo correspondiente (MUI: 0 si otro tooltip acaba de cerrarse).
   *
   * @param {'hover'|'focus'|'touch'} reason Origen.
   * @private
   */
  _scheduleOpen(t) {
    if (this._clearTimer("leave"), this.isOpen && !this._closing) return;
    let e = Ae ? Q.enterNextDelay : this.enterDelay;
    t === "touch" && (e = Q.enterTouchDelay), this._clearTimer("enter");
    const i = () => this.open({ touch: t === "touch" });
    e <= 0 ? i() : this._timers.enter = setTimeout(i, e);
  }
  /**
   * Programa el cierre (mouseleave / fin de pulsación larga).
   *
   * @param {number} [delay] Retardo (ms); por defecto `leaveDelay`.
   * @private
   */
  _scheduleClose(t = this.leaveDelay) {
    this._clearTimer("enter"), this.isOpen && (this._clearTimer("leave"), t <= 0 ? this.close() : this._timers.leave = setTimeout(() => this.close(), t));
  }
  /**
   * Cancela un temporizador.
   *
   * @param {string} name Nombre.
   * @private
   */
  _clearTimer(t) {
    this._timers[t] && (clearTimeout(this._timers[t]), this._timers[t] = null);
  }
  /**
   * Crea la superficie `role="tooltip"` portada a `<body>`.
   *
   * @returns {HTMLElement} Superficie.
   * @private
   */
  _createPopup() {
    const t = document.createElement("div");
    t.className = "mtx-tooltip", t.id = this.id, t.setAttribute("role", "tooltip");
    const e = document.createElement("span");
    return e.className = "mtx-tooltip__label", t.appendChild(e), Pe.set(t, this), t;
  }
  /**
   * Muestra el tooltip de inmediato.
   *
   * @param {Object} [options] Opciones.
   * @param {boolean} [options.touch=false] Estilo táctil (fuente mayor, más separación).
   * @returns {boolean} `true` si se mostró.
   */
  open({ touch: t = !1 } = {}) {
    this._clearTimer("enter"), this._clearTimer("leave"), this._clearTimer("exit");
    const e = this.title;
    if (!e.trim() || !this.element.isConnected) return !1;
    At.forEach((n) => {
      n !== this && n.close({ immediate: !0 });
    }), this.popup || (this.popup = this._createPopup());
    const i = this.popup;
    i.querySelector(".mtx-tooltip__label").textContent = e, this._touch = t, i.classList.toggle("mtx-tooltip--touch", t), i.classList.toggle("mtx-tooltip--arrow", this.arrow);
    let s = i.querySelector(".mtx-tooltip__arrow");
    this.arrow && !s ? (s = document.createElement("span"), s.className = "mtx-tooltip__arrow", s.setAttribute("aria-hidden", "true"), i.appendChild(s)) : !this.arrow && s && s.remove(), i.isConnected || document.body.appendChild(i);
    const a = this.isOpen && !this._closing;
    return this.isOpen = !0, this._closing = !1, At.add(this), X(this, { kind: "tooltip", nodes: () => this.popup, onEscape: () => this.close() }), this._setDescribedBy(!0), this._stopAutoUpdate && this._stopAutoUpdate(), this._stopAutoUpdate = Nt(this.target, i, () => this.update()), a || (i.offsetWidth, i.classList.add("mtx-tooltip--open"), Ae = !0, pt && clearTimeout(pt), pt = null, v(this.element, "mtx:tooltip:open", { tooltip: this })), !0;
  }
  /**
   * Oculta el tooltip.
   *
   * @param {Object} [options] Opciones.
   * @param {boolean} [options.immediate=false] Retira la superficie sin transición.
   */
  close({ immediate: t = !1 } = {}) {
    if (this._clearTimer("enter"), this._clearTimer("leave"), !this.isOpen) return;
    const e = this.popup;
    this.isOpen = !1, this._closing = !t, At.delete(this), q(this), this._setDescribedBy(!1), this._stopAutoUpdate && (this._stopAutoUpdate(), this._stopAutoUpdate = null), e && e.classList.remove("mtx-tooltip--open");
    const i = () => {
      this._closing = !1, this._clearTimer("exit"), !this.isOpen && e && e.remove();
    };
    t ? i() : this._timers.exit = setTimeout(i, Q.exitDuration), pt && clearTimeout(pt), pt = setTimeout(() => {
      Ae = !1, pt = null;
    }, Q.hysteresis + this.leaveDelay), v(this.element, "mtx:tooltip:close", { tooltip: this });
  }
  /**
   * Alterna la visibilidad.
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  /** Alias de `open()` (API de `Materix.tooltip`). */
  show() {
    return this.open();
  }
  /** Alias de `close()`. */
  hide() {
    this.close();
  }
  /**
   * Añade o retira `aria-describedby`. Se omite si el nombre accesible ya coincide con el título.
   *
   * @param {boolean} active `true` al abrir.
   * @private
   */
  _setDescribedBy(t) {
    const e = this.target;
    if (!t) {
      Ni(e, "aria-describedby", this.id, !1);
      return;
    }
    Mi($e(e)) !== Mi(this.title) && Ni(e, "aria-describedby", this.id, !0);
  }
  /**
   * Recalcula la posición (scroll, resize, cursor).
   */
  update() {
    const t = this.popup;
    if (!t || !this.isOpen) return;
    if (!this.element.isConnected) {
      this.close({ immediate: !0 });
      return;
    }
    const e = this._pointer, i = this.followCursor && e ? { getBoundingClientRect: () => ({ top: e.y, bottom: e.y, left: e.x, right: e.x, width: 0, height: 0, x: e.x, y: e.y }) } : this.target, s = this._touch ? Q.touchOffset : Q.offset, a = Vt(i, t, {
      placement: this.placement,
      offset: s,
      flip: !0,
      shift: !0,
      padding: 8,
      rtl: xt(this.target)
    });
    t.style.left = `${a.x}px`, t.style.top = `${a.y}px`, t.style.setProperty("--mtx-tooltip-gap", `${s}px`), t.setAttribute("data-side", a.side), t.setAttribute("data-placement", a.placement);
    const n = t.querySelector(".mtx-tooltip__arrow");
    if (n) {
      const l = a.side === "top" || a.side === "bottom";
      n.style.left = l ? `calc(${a.arrowOffset}px - 0.5em)` : "", n.style.top = l ? "" : `calc(${a.arrowOffset}px - 0.5em)`;
    }
  }
  /**
   * Libera temporizadores, superficie y atributos. En la forma global no toca el registro.
   */
  destroy() {
    Object.keys(this._timers).forEach((e) => this._clearTimer(e)), this.close({ immediate: !0 }), this.popup && (this.popup.remove(), Pe.delete(this.popup), this.popup = null);
    const t = this.target;
    if (t.hasAttribute("data-mtx-tooltip-label") && (t.removeAttribute("aria-label"), t.removeAttribute("data-mtx-tooltip-label")), this._declarative) {
      Ht.delete(this.element);
      const e = this._cleanups || [];
      for (this._cleanups = []; e.length; )
        try {
          e.pop()();
        } catch {
        }
      this.destroyed = !0;
      return;
    }
    super.destroy();
  }
}
function rt(r, t = !0) {
  if (!r || r.nodeType !== 1) return null;
  if (r.getAttribute("data-mtx") === "tooltip") {
    const i = L(r);
    return i instanceof re ? i : t ? U(r) : null;
  }
  const e = Ht.get(r);
  return e || !t || !r.hasAttribute("data-mtx-tooltip") ? e || null : new re(r, { declarative: !0 });
}
function vt(r) {
  return r instanceof Element ? r.closest(hn) : null;
}
function Ii(r) {
  const t = r instanceof Element ? r.closest(".mtx-tooltip") : null;
  return t && Pe.get(t) || null;
}
function Oi(r, t) {
  return t instanceof Node ? r.element.contains(t) || !!(r.popup && r.popup.contains(t)) : !1;
}
let _t = null;
const Be = {
  pointerover(r) {
    if (r.pointerType === "touch") return;
    const t = Ii(r.target);
    if (t) {
      t._clearTimer("leave"), t._closing && t.open({ touch: t._touch });
      return;
    }
    const e = vt(r.target);
    if (!e) return;
    const i = rt(e);
    i && (i.followCursor && (i._pointer = { x: r.clientX, y: r.clientY }), !(r.relatedTarget && Oi(i, r.relatedTarget) && (i.isOpen || i._timers.enter)) && i._scheduleOpen("hover"));
  },
  pointerout(r) {
    if (r.pointerType === "touch") return;
    const t = Ii(r.target), e = t ? null : vt(r.target), i = t || e && rt(e, !1);
    i && (r.relatedTarget && Oi(i, r.relatedTarget) || i._scheduleClose());
  },
  pointermove(r) {
    if (r.pointerType === "touch") return;
    const t = vt(r.target), e = t && rt(t, !1);
    !e || !e.followCursor || (e._pointer = { x: r.clientX, y: r.clientY }, e.isOpen && e.update());
  },
  pointerdown(r) {
    if (ye = !1, r.pointerType !== "touch") return;
    const t = vt(r.target);
    if (At.forEach((i) => {
      (!t || i.element !== t) && i.close();
    }), !t) return;
    const e = rt(t);
    e && (_t && clearTimeout(_t.timer), _t = { instance: e, timer: null }, e._clearTimer("leave"), _t.timer = setTimeout(() => {
      e.open({ touch: !0 });
    }, Q.enterTouchDelay));
  },
  pointerup(r) {
    if (r.pointerType !== "touch" || !_t) return;
    const { instance: t, timer: e } = _t;
    clearTimeout(e), _t = null, t.isOpen && t._scheduleClose(Q.leaveTouchDelay);
  },
  focusin(r) {
    const t = vt(r.target);
    if (!t || !ye) return;
    const e = rt(t);
    e && e._scheduleOpen("focus");
  },
  focusout(r) {
    const t = vt(r.target), e = t && rt(t, !1);
    e && (r.relatedTarget && e.element.contains(r.relatedTarget) || e.close());
  },
  keydown(r) {
    r.key !== "Escape" && (r.metaKey || r.altKey || r.ctrlKey || (ye = !0));
  }
};
Be.pointercancel = Be.pointerup;
let Pi = !1, ve = null;
function jt(r = document) {
  const t = [];
  r.nodeType === 1 && r.hasAttribute("data-mtx-tooltip") && t.push(r), r.querySelectorAll && t.push(...r.querySelectorAll("[data-mtx-tooltip]")), t.forEach((e) => {
    const i = Ht.get(e);
    if (i) {
      i.syncAccessibleName();
      return;
    }
    const s = (e.getAttribute("data-mtx-tooltip") || "").trim();
    e.hasAttribute("data-mtx-tooltip-label") ? s && e.setAttribute("aria-label", s) : s && !$e(e) && (e.setAttribute("aria-label", s), e.setAttribute("data-mtx-tooltip-label", ""));
  });
}
function Gs() {
  if (Pi || typeof document > "u") return;
  Pi = !0, Object.entries(Be).forEach(([t, e]) => {
    document.addEventListener(t, e, t === "focusin" || t === "focusout" ? void 0 : !0);
  });
  const r = () => {
    jt(document), !(typeof MutationObserver > "u" || ve) && (ve = new MutationObserver((t) => {
      t.forEach((e) => {
        if (e.type === "attributes") {
          const i = e.target;
          jt(i);
          const s = Ht.get(i);
          s && s.refresh();
          return;
        }
        e.addedNodes.forEach((i) => {
          i.nodeType === 1 && jt(i);
        }), e.removedNodes.length && At.size && Array.from(At).forEach((i) => {
          (!i.target || !i.target.isConnected) && i.close({ immediate: !0 });
        });
      });
    }), ve.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-mtx-tooltip"]
    }));
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r, { once: !0 }) : r();
}
const Fe = {
  /**
   * Muestra el tooltip de un disparador al instante.
   *
   * @param {HTMLElement} element Disparador.
   * @param {{touch?: boolean}} [options] Opciones (`touch`).
   * @returns {Tooltip|null} Instancia.
   */
  show(r, t) {
    const e = rt(r);
    return e && e.open(t), e;
  },
  /**
   * Oculta el tooltip de un disparador.
   *
   * @param {HTMLElement} element Disparador.
   */
  hide(r) {
    const t = rt(r, !1);
    t && t.close();
  },
  /** Oculta todos los tooltips visibles. */
  hideAll() {
    Array.from(At).forEach((r) => r.close({ immediate: !0 }));
  },
  /**
   * Obtiene (o crea) la instancia del tooltip de un disparador.
   *
   * @param {HTMLElement} element Disparador.
   * @returns {Tooltip|null} Instancia.
   */
  get(r) {
    return rt(r);
  },
  /**
   * Fuerza la sincronización de `aria-label` en un contenedor (contenido añadido sin observador).
   *
   * @param {Document|HTMLElement} [root=document] Contenedor.
   */
  sync(r) {
    jt(r || document);
  },
  /** Instala la delegación global (se hace automáticamente al importar). */
  install: Gs
};
f("tooltip", re);
Gs();
class js extends g {
  /**
   * Crea una instancia de SpeedDial.
   *
   * @param {HTMLElement} element Elemento contenedor `.mtx-speed-dial`.
   */
  constructor(t) {
    super(t), this.element.classList.add("mtx-speed-dial");
    const e = t.getAttribute("data-direction") || "up";
    this.direction = e, this._eventMode = t.getAttribute("data-event") || "click", this._tooltipHover = t.hasAttribute("data-tooltip-hover"), this._tooltipHover && t.classList.add("mtx-speed-dial--tooltip-hover");
    let i = t.querySelector(".mtx-speed-dial__fab") || t.querySelector(".mtx-fab");
    if (!i && t.getAttribute("data-icon")) {
      i = document.createElement("button");
      const a = t.getAttribute("data-color") || "primary";
      i.className = `mtx-fab mtx-fab--${a} mtx-speed-dial__fab`, i.setAttribute("type", "button"), i.setAttribute("aria-label", t.getAttribute("data-label") || y("speedDial", "actions", null, "Actions", k(t)));
      const n = document.createElement("span");
      n.className = "material-icons", n.setAttribute("aria-hidden", "true"), n.textContent = t.getAttribute("data-icon"), i.appendChild(n), t.insertBefore(i, t.firstChild);
    }
    this._fab = i, this._fab && (this._fab.setAttribute("aria-expanded", "false"), this._fab.setAttribute("aria-haspopup", "true"));
    let s = t.querySelector(".mtx-speed-dial__actions");
    if (!s) {
      const a = Array.from(t.querySelectorAll("button:not(.mtx-speed-dial__fab)"));
      a.length > 0 && (s = document.createElement("div"), s.className = "mtx-speed-dial__actions", a.forEach((n) => {
        const l = n.getAttribute("data-color") ? `mtx-fab--${n.getAttribute("data-color")}` : "mtx-fab--secondary";
        n.classList.add("mtx-fab", "mtx-fab--small", l, "mtx-speed-dial__action"), n.getAttribute("type") || n.setAttribute("type", "button");
        const o = n.getAttribute("data-icon");
        if (o && !n.querySelector(".material-icons") && !n.querySelector("svg")) {
          const c = document.createElement("span");
          c.className = "material-icons", c.setAttribute("aria-hidden", "true"), c.textContent = o, n.appendChild(c);
        }
        s.appendChild(n);
      }), t.appendChild(s));
    }
    this._actionsContainer = s, this._setupTooltips(), this._setupActionsA11y(), this._handleFabClick = (a) => {
      a.stopPropagation(), this.toggle();
    }, this._handleMouseEnter = () => {
      this._eventMode === "hover" && this.open();
    }, this._handleMouseLeave = () => {
      this._eventMode === "hover" && this.close();
    }, this._handleDocumentClick = (a) => {
      this.isOpen && !this.element.contains(a.target) && this.close();
    }, this._fab && this.listen(this._fab, "click", this._handleFabClick), this._eventMode === "hover" && (this.listen(this.element, "mouseenter", this._handleMouseEnter), this.listen(this.element, "mouseleave", this._handleMouseLeave)), this.listen(document, "click", this._handleDocumentClick);
  }
  /**
   * Genera las etiquetas de las acciones con `data-tooltip`: estáticas y visibles mientras está
   * abierto (modo por defecto, `tooltipOpen` de MUI) o Tooltip en hover/foco con `data-tooltip-hover`.
   * @private
   */
  _setupTooltips() {
    if (!this._actionsContainer) return;
    this._actionsContainer.querySelectorAll(".mtx-speed-dial__action").forEach((e) => {
      const i = e.getAttribute("data-tooltip");
      if (!i || e.parentElement.classList.contains("mtx-speed-dial__action-wrapper")) return;
      const s = document.createElement("div");
      if (s.className = "mtx-speed-dial__action-wrapper", e.parentNode.insertBefore(s, e), this._tooltipHover)
        e.hasAttribute("data-mtx-tooltip") || (e.setAttribute("data-mtx-tooltip", i), e.setAttribute("data-mtx-speed-dial-tooltip", ""));
      else {
        const a = document.createElement("span");
        a.className = "mtx-speed-dial__tooltip", a.setAttribute("aria-hidden", "true"), a.textContent = i, s.appendChild(a);
      }
      s.appendChild(e);
    }), this._syncTooltipPlacement();
  }
  /**
   * Coloca los Tooltip de las acciones según la dirección (izquierda en vertical, arriba en horizontal).
   * @private
   */
  _syncTooltipPlacement() {
    if (!this._tooltipHover || !this._actionsContainer) return;
    const t = this.direction === "left" || this.direction === "right" ? "top" : "left";
    this._actionsContainer.querySelectorAll("[data-mtx-speed-dial-tooltip]").forEach((e) => {
      e.setAttribute("data-tooltip-placement", t);
    });
  }
  /**
   * Nombra las acciones desde `data-tooltip` y las saca del orden de tabulación mientras está cerrado.
   * @private
   */
  _setupActionsA11y() {
    this._actionsContainer && (this._actionsContainer.id || (this._actionsContainer.id = P("mtx-speed-dial-actions")), this._fab && this._fab.setAttribute("aria-controls", this._actionsContainer.id), this._getActions().forEach((t) => {
      const e = t.getAttribute("data-tooltip");
      e && !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && t.setAttribute("aria-label", e);
    }), this._syncActionsA11y());
  }
  /**
   * Acciones secundarias del SpeedDial.
   * @returns {HTMLElement[]} Botones de acción.
   * @private
   */
  _getActions() {
    return this._actionsContainer ? Array.from(this._actionsContainer.querySelectorAll(".mtx-speed-dial__action")) : [];
  }
  /**
   * Sincroniza `inert`, `aria-hidden` y `tabindex` de las acciones con el estado abierto.
   * @private
   */
  _syncActionsA11y() {
    if (!this._actionsContainer) return;
    const t = this.isOpen;
    this._actionsContainer.inert = !t, t ? this._actionsContainer.removeAttribute("aria-hidden") : this._actionsContainer.setAttribute("aria-hidden", "true"), this._getActions().forEach((e) => {
      if (t) {
        if (e.hasAttribute("data-mtx-speed-dial-tabindex")) {
          const i = e.getAttribute("data-mtx-speed-dial-tabindex");
          i ? e.setAttribute("tabindex", i) : e.removeAttribute("tabindex"), e.removeAttribute("data-mtx-speed-dial-tabindex");
        }
      } else e.hasAttribute("data-mtx-speed-dial-tabindex") || (e.setAttribute("data-mtx-speed-dial-tabindex", e.getAttribute("tabindex") || ""), e.setAttribute("tabindex", "-1"));
    });
  }
  /** @returns {boolean} `true` si el SpeedDial está abierto. */
  get isOpen() {
    return this.element.classList.contains("mtx-speed-dial--open");
  }
  /** @returns {string} Dirección del SpeedDial. */
  get direction() {
    return this._direction || "up";
  }
  /** @param {string} value Nueva dirección (`up`, `down`, `left`, `right`). */
  set direction(t) {
    this._direction = t, this.element.classList.remove(
      "mtx-speed-dial--direction-up",
      "mtx-speed-dial--direction-down",
      "mtx-speed-dial--direction-left",
      "mtx-speed-dial--direction-right"
    ), this.element.classList.add(`mtx-speed-dial--direction-${t}`), this._syncTooltipPlacement();
  }
  /**
   * Abre el menú SpeedDial.
   */
  open() {
    this.isOpen || (this.element.classList.add("mtx-speed-dial--open"), this._fab && this._fab.setAttribute("aria-expanded", "true"), X(this, {
      kind: "popup",
      nodes: this.element,
      onEscape: () => {
        this.close(), this._fab && this._fab.focus();
      }
    }), this._syncActionsA11y(), v(this.element, "mtx:speed-dial:open", { speedDial: this }, { aliases: ["mtx-speed-dial-open"] }));
  }
  /**
   * Cierra el menú SpeedDial.
   */
  close() {
    this.isOpen && (this.element.classList.remove("mtx-speed-dial--open"), q(this), this._fab && this._fab.setAttribute("aria-expanded", "false"), this._getActions().forEach((t) => Fe.hide(t)), this._actionsContainer && this._actionsContainer.contains(document.activeElement) && this._fab && this._fab.focus(), this._syncActionsA11y(), v(this.element, "mtx:speed-dial:close", { speedDial: this }, { aliases: ["mtx-speed-dial-close"] }));
  }
  /**
   * Alterna el estado de apertura.
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  /**
   * Destruye la instancia y remueve event listeners.
   */
  destroy() {
    q(this), this._getActions().forEach((t) => Fe.hide(t)), super.destroy();
  }
}
f("speed-dial", js);
class Xs extends g {
  /**
   * Crea una instancia del enlace.
   *
   * @param {HTMLElement} element Elemento `<a>` o `<button>` asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-link") || t.classList.add("mtx-link"), t.tagName === "BUTTON" && !t.hasAttribute("type") && (t.type = "button");
    const e = t.getAttribute("data-color");
    e && (t.classList.add(`mtx-link--${e}`), t.classList.add(`mtx-link--color-${e}`));
    const i = t.getAttribute("data-underline");
    i && t.classList.add(`mtx-link--underline-${i}`), this._handleClick = (s) => {
      this.disabled && (s.preventDefault(), s.stopImmediatePropagation());
    }, t.addEventListener("click", this._handleClick), t.hasAttribute("data-disabled") && this.disable();
  }
  /**
   * Indica si el enlace está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /**
   * Deshabilita el enlace: `disabled` en `<button>`; `aria-disabled` y fuera del tabulado en `<a>`.
   */
  disable() {
    this.element.tagName === "BUTTON" ? this.element.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.tabIndex = -1);
  }
  /**
   * Habilita el enlace.
   */
  enable() {
    this.element.tagName === "BUTTON" ? this.element.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.removeAttribute("tabindex"));
  }
  /**
   * Destruye la instancia y retira sus listeners.
   */
  destroy() {
    this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
f("link", Xs);
class Js extends g {
  /**
   * Crea una instancia del avatar.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-avatar") || t.classList.add("mtx-avatar");
    const e = t.querySelector("img"), i = t.getAttribute("data-src");
    if (e)
      this.img = e, t.hasAttribute("data-alt") && !e.hasAttribute("alt") && (e.alt = t.getAttribute("data-alt"));
    else if (i) {
      this.img = document.createElement("img"), this.img.alt = t.getAttribute("data-alt") || "";
      const o = t.getAttribute("data-srcset"), c = t.getAttribute("data-sizes");
      o && (this.img.srcset = o), c && (this.img.sizes = c), this.img.src = i, t.appendChild(this.img);
    } else
      t.classList.add("mtx-avatar--fallback");
    this.img && (this._handleImageError = () => {
      if (this.img.hidden = !0, t.classList.add("mtx-avatar--fallback"), !Array.from(t.childNodes).some(
        (c) => c !== this.img && c.textContent && c.textContent.trim()
      )) {
        const c = document.createElement("span");
        c.className = "mtx-avatar__fallback";
        const d = this.img.alt || t.getAttribute("data-alt") || "";
        c.textContent = d.trim().charAt(0).toUpperCase() || "●", t.appendChild(c);
      }
    }, this.img.addEventListener("error", this._handleImageError), this.img.complete && this.img.naturalWidth === 0 && this._handleImageError());
    const s = t.getAttribute("data-icon");
    if (s && !this.img && !t.querySelector(".material-icons") && !t.querySelector("svg")) {
      const o = document.createElement("span");
      o.className = "material-icons", o.setAttribute("aria-hidden", "true"), o.textContent = s, t.appendChild(o), t.classList.remove("mtx-avatar--fallback");
    }
    const a = t.getAttribute("data-variant");
    a && a !== "circular" && t.classList.add(`mtx-avatar--${a}`);
    const n = t.getAttribute("data-color");
    n && t.classList.add(`mtx-avatar--${n}`);
    const l = t.getAttribute("data-size");
    l && (l === "small" ? t.classList.add("mtx-avatar--small") : l === "medium" ? t.classList.add("mtx-avatar--medium") : l === "large" ? t.classList.add("mtx-avatar--large") : isNaN(Number(l)) || (t.style.width = t.style.height = `${l}px`, t.style.fontSize = `${Math.round(Number(l) * 0.45)}px`));
  }
  /** Elimina el listener de error de imagen. */
  destroy() {
    this.img && this._handleImageError && this.img.removeEventListener("error", this._handleImageError), super.destroy();
  }
}
class Zs extends g {
  /**
   * Crea un grupo de avatares.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-avatar-group"), t.hasAttribute("data-label") && !t.hasAttribute("aria-label") && t.setAttribute("aria-label", t.getAttribute("data-label")), this._max = this._readInteger("data-max", 5, 2), this._total = this._readInteger("data-total", null, 0), this._applySpacing(t.getAttribute("data-spacing") || "medium"), this.refresh();
  }
  /** @returns {number} Máximo de avatares visibles, incluido el excedente. */
  get max() {
    return this._max;
  }
  /** @param {number} value Nuevo máximo visible. */
  set max(t) {
    this._max = Math.max(2, Number.parseInt(t, 10) || 5), this.element.setAttribute("data-max", String(this._max)), this.refresh();
  }
  /** @returns {number} Total lógico de avatares. */
  get total() {
    return Math.max(this._total ?? 0, this._getAvatars().length);
  }
  /** @param {number|null} value Nuevo total lógico. */
  set total(t) {
    t == null ? (this._total = null, this.element.removeAttribute("data-total")) : (this._total = Math.max(0, Number.parseInt(t, 10) || 0), this.element.setAttribute("data-total", String(this._total))), this.refresh();
  }
  /** Recalcula avatares visibles e indicador de excedente. */
  refresh() {
    this._surplus && this._surplus.remove(), this._surplus = null;
    const t = this._getAvatars();
    t.forEach((a) => {
      a.hidden = !1;
    });
    const e = Math.max(this._total ?? t.length, t.length);
    if (e <= this._max) return;
    const i = Math.max(1, this._max - 1);
    t.slice(i).forEach((a) => {
      a.hidden = !0;
    });
    const s = e - i;
    this._surplus = document.createElement("span"), this._surplus.className = "mtx-avatar mtx-avatar--surplus", this._surplus.textContent = `+${s}`, this._surplus.setAttribute("aria-label", this._surplusLabel(s)), this.element.appendChild(this._surplus);
  }
  /** Restaura todos los avatares del grupo. */
  destroy() {
    this._surplus && this._surplus.remove(), this._getAvatars().forEach((t) => {
      t.hidden = !1;
    }), this.element.style.removeProperty("--mtx-avatar-group-overlap"), super.destroy();
  }
  /** @returns {HTMLElement[]} Avatares originales del grupo. */
  _getAvatars() {
    return Array.from(this.element.children).filter((t) => (t.classList.contains("mtx-avatar") || t.getAttribute("data-mtx") === "avatar") && !t.classList.contains("mtx-avatar--surplus"));
  }
  /**
   * Lee un entero acotado desde el elemento.
   *
   * @param {string} name Nombre del atributo.
   * @param {number|null} fallback Valor alternativo.
   * @param {number} minimum Mínimo permitido.
   * @returns {number|null} Entero normalizado.
   */
  _readInteger(t, e, i) {
    if (!this.element.hasAttribute(t)) return e;
    const s = Number.parseInt(this.element.getAttribute(t), 10);
    return Number.isFinite(s) ? Math.max(i, s) : e;
  }
  /** @param {string} spacing Espaciado MUI o valor numérico en píxeles. */
  _applySpacing(t) {
    const e = { small: 16, medium: 8 }, i = Number.parseFloat(t), s = Object.prototype.hasOwnProperty.call(e, t) ? e[t] : Math.max(0, i || 0);
    this.element.style.setProperty("--mtx-avatar-group-overlap", `${s}px`);
  }
  /** @param {number} surplus Cantidad excedente. @returns {string} Etiqueta accesible. */
  _surplusLabel(t) {
    return (this.element.getAttribute("data-surplus-label") || y("avatarGroup", "surplus", null, "{count} more", k(this.element))).replace("{count}", String(t));
  }
}
f("avatar", Js);
f("avatar-group", Zs);
class Qs extends g {
  /**
   * Crea una instancia de la insignia.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-badge") || t.classList.add("mtx-badge"), this.variant = t.getAttribute("data-variant") || "standard";
    const e = t.getAttribute("data-max");
    this.max = e === null ? 99 : Number(e), this.showZero = this._getBooleanAttribute("data-show-zero"), this.standalone = this._getBooleanAttribute("data-standalone") || t.classList.contains("mtx-badge--standalone"), this.standalone && t.classList.add("mtx-badge--standalone"), this.labelTemplate = t.getAttribute("data-label"), this.badge = t.querySelector(".mtx-badge__badge") || document.createElement("span"), this.badge.classList.add("mtx-badge__badge"), this.standalone && !this.labelTemplate ? this.badge.removeAttribute("aria-hidden") : this.badge.setAttribute("aria-hidden", "true"), this.badge.parentElement || t.appendChild(this.badge), this.labelTemplate && (this.labelElement = t.querySelector(".mtx-badge__label") || document.createElement("span"), this.labelElement.className = "mtx-badge__label", this.labelElement.parentElement || t.appendChild(this.labelElement)), this.variant === "dot" && t.classList.add("mtx-badge--dot");
    const i = t.getAttribute("data-color") || "default";
    t.classList.add(`mtx-badge--${i}`);
    const s = t.getAttribute("data-anchor");
    s && s !== "top-right" && t.classList.add(`mtx-badge--${s}`), t.getAttribute("data-overlap") === "circular" && t.classList.add("mtx-badge--overlap-circular"), this._content = t.getAttribute("data-content"), this._explicitInvisible = this._getBooleanAttribute("data-invisible"), this._render();
  }
  /**
   * Obtiene un atributo booleano declarativo.
   *
   * @param {string} name Nombre del atributo.
   * @returns {boolean} `true` salvo cuando su valor es `false`.
   */
  _getBooleanAttribute(t) {
    const e = this.element.getAttribute(t);
    return e !== null && e !== "false";
  }
  /** Actualiza contenido y visibilidad de la insignia. */
  _render() {
    if (this.variant !== "dot") {
      const i = this._content !== null && /^-?\d+$/.test(this._content), s = i ? Number(this._content) : null;
      this.badge.textContent = i && Number.isFinite(this.max) && s > this.max ? `${this.max}+` : this._content || "";
    }
    const t = this.variant !== "dot" && (this._content === null || Number(this._content) === 0 && !this.showZero), e = this._explicitInvisible || t;
    this.element.classList.toggle("mtx-badge--invisible", e), this.labelElement && (this.labelElement.textContent = e ? "" : this.labelTemplate.replace("{0}", this.badge.textContent || this._content || ""));
  }
  /** @returns {string|null} Contenido actual de la insignia. */
  get content() {
    return this._content;
  }
  /** @param {string|number|null} value Nuevo contenido. */
  set content(t) {
    this._content = t === null ? null : String(t), this._render();
  }
  /** @returns {boolean} `true` si la insignia está oculta. */
  get invisible() {
    return this.element.classList.contains("mtx-badge--invisible");
  }
  /** @param {boolean} value Estado de visibilidad. */
  set invisible(t) {
    this._explicitInvisible = !!t, this._render();
  }
}
f("badge", Qs);
const pn = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z"/></svg>';
class ai extends g {
  /**
   * Crea una instancia del chip.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), this._ensureStructure(), this._bindDelete(), this._bindClick();
  }
  /**
   * Normaliza la estructura interna del chip (avatar, icono, label, delete).
   */
  _ensureStructure() {
    const { element: t } = this;
    t.classList.contains("mtx-chip") || t.classList.add("mtx-chip");
    let e = t.querySelector(".mtx-chip__label");
    const i = Array.from(t.childNodes).filter(
      (d) => d.nodeType === Node.TEXT_NODE && d.textContent.trim()
    ), s = i.map((d) => d.textContent.trim()).join(" ");
    i.forEach((d) => d.remove()), e || (e = document.createElement("span"), e.className = "mtx-chip__label", t.appendChild(e)), this.labelEl = e, t.hasAttribute("data-label") ? e.textContent = t.getAttribute("data-label") : !e.textContent && s && (e.textContent = s);
    const a = t.getAttribute("data-icon");
    if (a && !t.querySelector(".mtx-chip__icon")) {
      const d = document.createElement("span");
      d.className = "mtx-chip__icon material-icons", d.setAttribute("aria-hidden", "true"), d.textContent = a, t.insertBefore(d, e);
    }
    if (t.hasAttribute("data-deletable")) {
      let d = t.querySelector(".mtx-chip__delete");
      if (d && /^(BUTTON|A|INPUT)$/.test(d.tagName)) {
        const h = document.createElement("span");
        h.className = d.className, h.innerHTML = d.innerHTML, d.replaceWith(h), d = h;
      }
      d || (d = document.createElement("span"), d.className = "mtx-chip__delete", d.innerHTML = t.getAttribute("data-delete-icon") || pn, t.appendChild(d)), d.removeAttribute("tabindex"), d.removeAttribute("role"), d.removeAttribute("aria-label"), d.setAttribute("aria-hidden", "true"), d.title = t.getAttribute("data-delete-label") || y("chip", "delete", null, "Delete", k(t)), t.hasAttribute("aria-keyshortcuts") || t.setAttribute("aria-keyshortcuts", "Delete Backspace"), this.deleteEl = d;
    }
    const n = t.hasAttribute("data-clickable") || t.hasAttribute("data-deletable");
    t.hasAttribute("data-clickable") && t.classList.add("mtx-chip--clickable"), n && !/^(BUTTON|A)$/.test(t.tagName) && (t.setAttribute("role", "button"), t.hasAttribute("tabindex") || (t.tabIndex = 0)), (t.hasAttribute("data-disabled") || t.getAttribute("aria-disabled") === "true") && this.disable();
    const l = t.getAttribute("data-size");
    l && l !== "medium" && t.classList.add(`mtx-chip--${l}`);
    const o = t.getAttribute("data-variant");
    o && o !== "filled" && t.classList.add(`mtx-chip--${o}`);
    const c = t.getAttribute("data-color");
    c && c !== "default" && t.classList.add(`mtx-chip--${c}`);
  }
  /**
   * Vincula el evento de eliminación.
   */
  _bindDelete() {
    this.deleteEl && (this._handleDelete = (t) => {
      t.stopPropagation(), t.preventDefault(), !this.disabled && this.emit("delete");
    }, this.deleteEl.addEventListener("click", this._handleDelete));
  }
  /**
   * Vincula el evento de clic en chips interactivos.
   */
  _bindClick() {
    !this.element.hasAttribute("data-clickable") && !this.deleteEl || (this._handleClick = (t) => {
      this.disabled || t.target.closest(".mtx-chip__delete") || this.element.hasAttribute("data-clickable") && this.emit("click");
    }, this._handleKeydown = (t) => {
      this.disabled || ((t.key === "Enter" || t.key === " ") && this.element.hasAttribute("data-clickable") ? (t.preventDefault(), this.element.click()) : (t.key === "Delete" || t.key === "Backspace") && this.deleteEl ? (t.preventDefault(), this.emit("delete")) : t.key === "Escape" && this.element.blur());
    }, this.element.addEventListener("click", this._handleClick), this.element.addEventListener("keydown", this._handleKeydown));
  }
  /**
   * Texto del chip.
   *
   * @returns {string} Texto del label.
   */
  get label() {
    return this.labelEl.textContent;
  }
  /**
   * Establece el texto del chip.
   *
   * @param {string} text Nuevo texto.
   */
  set label(t) {
    this.labelEl.textContent = t;
  }
  /** @returns {boolean} `true` si el chip está deshabilitado. */
  get disabled() {
    return this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita interacción y retira el chip del orden de tabulación. */
  disable() {
    this.element.classList.add("mtx-chip--disabled"), this.element.setAttribute("aria-disabled", "true"), this.element.hasAttribute("tabindex") && (this.element.tabIndex = -1);
  }
  /** Habilita nuevamente el chip. */
  enable() {
    this.element.classList.remove("mtx-chip--disabled"), this.element.removeAttribute("aria-disabled"), this.element.getAttribute("role") === "button" && (this.element.tabIndex = 0);
  }
  /**
   * Desencadena un evento público personalizado sobre el elemento.
   *
   * @param {string} name Nombre del evento (`delete`, `click`, …).
   * @param {Object} [detail] Datos adicionales.
   */
  emit(t, e = {}) {
    v(this.element, `mtx:chip:${t}`, e);
  }
  /**
   * Destruye la instancia y elimina los event listeners.
   */
  destroy() {
    this.deleteEl && this.deleteEl.removeEventListener("click", this._handleDelete), this._handleClick && this.element.removeEventListener("click", this._handleClick), this._handleKeydown && this.element.removeEventListener("keydown", this._handleKeydown), super.destroy();
  }
}
f("chip", ai);
const $i = {
  success: '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>',
  info: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
  warning: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
  error: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'
};
class ta extends g {
  /**
   * Crea una instancia de la alerta.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t);
    const e = t.getAttribute("data-severity") || "success", i = t.getAttribute("data-variant") || "standard";
    t.classList.add(`mtx-alert--${e}`, `mtx-alert--${i}`), t.hasAttribute("role") || t.setAttribute("role", "alert");
    let s = t.querySelector(".mtx-alert__icon");
    if (!s && t.getAttribute("data-icon") !== "false" && (s = document.createElement("span"), s.className = "mtx-alert__icon", s.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" focusable="false" aria-hidden="true">${$i[e] || $i.success}</svg>`, t.insertBefore(s, t.firstChild)), t.hasAttribute("data-dismissible")) {
      let n = Array.from(t.children).find((l) => l.classList.contains("mtx-alert__close"));
      n || (n = document.createElement("button"), n.type = "button", n.className = "mtx-alert__close", n.setAttribute("aria-label", t.getAttribute("data-close-label") || y("alert", "close", null, "Close", k(t))), n.innerHTML = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', t.appendChild(n)), this._handleClose = () => this.close(), this.listen(n, "click", this._handleClose), this.closeButton = n;
    }
    t.classList.contains("mtx-alert") || t.classList.add("mtx-alert");
    let a = t.querySelector(".mtx-alert__message");
    if (a) {
      const n = t.getAttribute("data-title");
      if (n && !a.querySelector(".mtx-alert__title")) {
        const l = document.createElement("div");
        l.className = "mtx-alert__title", l.textContent = n, a.insertBefore(l, a.firstChild);
      }
    } else {
      a = document.createElement("div"), a.className = "mtx-alert__message";
      const n = t.getAttribute("data-title");
      if (n) {
        const o = document.createElement("div");
        o.className = "mtx-alert__title", o.textContent = n, a.appendChild(o);
      }
      Array.from(t.childNodes).filter((o) => o !== s && o !== this.closeButton).forEach((o) => a.appendChild(o)), this.closeButton ? t.insertBefore(a, this.closeButton) : t.appendChild(a);
    }
  }
  /**
   * Cierra (oculta) la alerta.
   */
  close() {
    if (!this.element.hidden) {
      if (this._prefersReducedMotion()) {
        clearTimeout(this._closeTimer), this._finishClose();
        return;
      }
      this.element.style.opacity = "0", this.element.style.transform = "translateY(-4px)", this.element.style.transition = "opacity 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1)", clearTimeout(this._closeTimer), this._closeTimer = setTimeout(() => this._finishClose(), 200);
    }
  }
  /** Oculta la alerta con `hidden` (sale del flujo) y emite `mtx:alert:close`. */
  _finishClose() {
    this._closeTimer = null, this.element.hidden = !0, v(this.element, "mtx:alert:close");
  }
  /** @returns {boolean} `true` si el usuario pidió reducir animaciones. */
  _prefersReducedMotion() {
    return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  /** Vuelve a mostrar una alerta cerrada. */
  open() {
    clearTimeout(this._closeTimer), this._closeTimer = null, this.element.hidden = !1, requestAnimationFrame(() => {
      this.destroyed || (this.element.style.opacity = "1", this.element.style.transform = "translateY(0)");
    }), v(this.element, "mtx:alert:open");
  }
  /** Elimina listeners y temporizadores. */
  destroy() {
    this._closeTimer && (this.element.hidden = !0), clearTimeout(this._closeTimer), this._closeTimer = null, super.destroy();
  }
}
f("alert", ta);
f("alert-title", g);
const Ee = ["text", "circular", "rectangular", "rounded"], _n = ["pulse", "wave", "false"], fn = (r) => r !== null && r !== "false";
function we(r) {
  if (r == null) return "";
  const t = String(r).trim();
  return t ? /^-?\d+(\.\d+)?$/.test(t) ? `${t}px` : t : "";
}
class ea extends g {
  /**
   * Crea la instancia y aplica variante, tamaño, animación y líneas.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.setAttribute("aria-hidden", "true");
    const e = parseInt(t.getAttribute("data-lines"), 10);
    this._lines = Number.isFinite(e) && e > 1 ? e : 0, this._variant = "text", this._animation = "pulse", this._lines ? this._renderLines() : (t.classList.add("mtx-skeleton"), this._wrapTextNodes(), this.setVariant(t.getAttribute("data-variant") || this._variantFromClass() || "text")), this._applySize(t), this.setAnimation(t.getAttribute("data-animation") || this._animationFromClass() || "pulse");
  }
  /** @returns {string|null} Variante declarada por clase BEM (SSR), si existe. */
  _variantFromClass() {
    return Ee.find((t) => this.element.classList.contains(`mtx-skeleton--${t}`)) || null;
  }
  /** @returns {string|null} Animación declarada por clase BEM (SSR), si existe. */
  _animationFromClass() {
    const { classList: t } = this.element;
    return t.contains("mtx-skeleton--wave") ? "wave" : t.contains("mtx-skeleton--no-animation") ? "false" : null;
  }
  /** Aplica `data-width`/`data-height` al elemento raíz. */
  _applySize(t) {
    const e = we(this.element.getAttribute("data-width")), i = we(this.element.getAttribute("data-height"));
    e && (t.style.width = e), i && !this._lines && (t.style.height = i);
  }
  /** Genera N líneas de texto; la última más corta (`data-last-width`, 60 % por defecto). */
  _renderLines() {
    const { element: t } = this;
    if (t.classList.add("mtx-skeleton-lines"), t.querySelector(":scope > .mtx-skeleton")) return;
    const e = we(t.getAttribute("data-last-width")) || "60%";
    for (let i = 0; i < this._lines; i += 1) {
      const s = document.createElement("span");
      s.className = "mtx-skeleton mtx-skeleton--text", i === this._lines - 1 && (s.style.width = e), t.appendChild(s);
    }
  }
  /**
   * Envuelve el texto directo en `.mtx-skeleton__text` para ocultarlo con `visibility`
   * (como los hijos elemento) en vez de dejar texto transparente que falla el contraste.
   */
  _wrapTextNodes() {
    Array.from(this.element.childNodes).forEach((t) => {
      if (t.nodeType !== 3 || t.textContent.trim() === "") return;
      const e = document.createElement("span");
      e.className = "mtx-skeleton__text", t.replaceWith(e), e.appendChild(t);
    });
  }
  /** @returns {boolean} `true` si envuelve elementos o texto no vacío. */
  _hasContent() {
    return Array.from(this.element.childNodes).some((t) => t.nodeType === 1 || t.nodeType === 3 && t.textContent.trim() !== "");
  }
  /** @returns {HTMLElement[]} Bloques animados (el propio elemento o sus líneas). */
  get blocks() {
    return this._lines ? Array.from(this.element.querySelectorAll(":scope > .mtx-skeleton")) : [this.element];
  }
  /** @returns {string} Variante actual. */
  get variant() {
    return this._variant;
  }
  /** @returns {string} Animación actual (`pulse`, `wave` o `false`). */
  get animation() {
    return this._animation;
  }
  /**
   * Cambia la forma del bloque (sin efecto en modo `data-lines`, siempre texto).
   *
   * @param {'text'|'circular'|'rectangular'|'rounded'} variant Variante.
   * @returns {this} La instancia.
   */
  setVariant(t) {
    if (this._lines) return this;
    const e = Ee.includes(t) ? t : "text", { classList: i } = this.element;
    return Ee.forEach((s) => i.remove(`mtx-skeleton--${s}`)), i.add(`mtx-skeleton--${e}`), i.toggle("mtx-skeleton--with-children", this._hasContent()), this._variant = e, this;
  }
  /**
   * Cambia la animación; `'false'`/`false` la desactiva.
   *
   * @param {'pulse'|'wave'|'false'|false} animation Animación.
   * @returns {this} La instancia.
   */
  setAnimation(t) {
    const e = t === !1 ? "false" : String(t), i = _n.includes(e) ? e : "pulse";
    return this.blocks.forEach((s) => {
      s.classList.remove("mtx-skeleton--pulse", "mtx-skeleton--wave", "mtx-skeleton--no-animation"), s.classList.add(i === "false" ? "mtx-skeleton--no-animation" : `mtx-skeleton--${i}`);
    }), this._animation = i, this;
  }
}
function Bi(r) {
  return typeof r == "string" ? document.querySelector(r) : r && r.nodeType === 1 ? r : null;
}
const Pt = {
  /**
   * Activa o desactiva la carga: `data-loading`, `aria-busy` y evento `mtx:skeleton:change`.
   *
   * @param {HTMLElement|string} target Contenedor o selector.
   * @param {boolean} [loading=true] `true` mientras se carga.
   * @returns {HTMLElement|null} El contenedor o `null` si no existe.
   */
  set(r, t = !0) {
    const e = Bi(r);
    if (!e) return null;
    const i = !!t, s = Pt.isLoading(e);
    return i ? (e.setAttribute("data-loading", ""), e.setAttribute("aria-busy", "true")) : (e.removeAttribute("data-loading"), e.removeAttribute("aria-busy")), e.querySelectorAll(":scope > [data-skeleton-placeholder]").forEach((a) => {
      a.setAttribute("aria-hidden", "true");
    }), s !== i && v(e, "mtx:skeleton:change", { loading: i }), e;
  },
  /**
   * Indica si el contenedor está en estado de carga.
   *
   * @param {HTMLElement|string} target Contenedor o selector.
   * @returns {boolean} `true` si tiene `data-loading` (distinto de `"false"`).
   */
  isLoading(r) {
    const t = Bi(r);
    return !!t && fn(t.getAttribute("data-loading"));
  },
  /**
   * Alterna el estado de carga.
   *
   * @param {HTMLElement|string} target Contenedor o selector.
   * @returns {boolean} Nuevo estado.
   */
  toggle(r) {
    const t = !Pt.isLoading(r);
    return Pt.set(r, t), t;
  }
};
function Fi(r = document) {
  r.querySelectorAll('[data-loading]:not([data-loading="false"])').forEach((t) => {
    t.querySelector(":scope > [data-skeleton-placeholder], :scope > [data-skeleton-content]") && Pt.set(t, !0);
  });
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => Fi()) : Fi());
f("skeleton", ea);
const j = [];
let Re = "", ne = !1, St = null;
function bn(r) {
  return !!(r && typeof r == "object" && r.isConnected === !1);
}
function gn() {
  ne || typeof document > "u" || !document.body || (Re = document.body.style.overflow, document.body.style.overflow = "hidden", ne = !0, An());
}
function xn() {
  ne && (ne = !1, yn(), !(typeof document > "u" || !document.body) && (document.body.style.overflow === "hidden" && (document.body.style.overflow = Re), Re = ""));
}
function ue(r) {
  for (let t = j.length - 1; t >= 0; t -= 1)
    j[t] !== r && bn(j[t]) && j.splice(t, 1);
  j.length === 0 && xn();
}
function An() {
  St || typeof MutationObserver > "u" || typeof document > "u" || (St = new MutationObserver(() => ue()), St.observe(document.documentElement || document, { childList: !0, subtree: !0 }));
}
function yn() {
  St && (St.disconnect(), St = null);
}
function me(r) {
  const t = j.indexOf(r);
  t >= 0 && j.splice(t, 1), ue(r), j.push(r), gn();
}
function pe(r) {
  const t = j.lastIndexOf(r);
  t >= 0 && j.splice(t, 1), ue();
}
function He(r) {
  return ue(), j[j.length - 1] === r;
}
const vn = 'a[href], button, input, select, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
function ft(r, t) {
  return r.hasAttribute(t) && r.getAttribute(t) !== "false";
}
class ri extends g {
  /**
   * Crea la instancia y aplica las opciones declarativas.
   *
   * @param {HTMLElement} element Elemento de la capa.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-backdrop"), ft(t, "data-invisible") && t.classList.add("mtx-backdrop--invisible");
    const e = t.getAttribute("data-z");
    e && /^-?\d+$/.test(e.trim()) && (t.style.zIndex = e.trim()), this._inerted = [], this._isOpen = !1, this._closeTimer = null, this.listen(t, "click", (i) => this._handleClick(i)), this.onDestroy(() => {
      clearTimeout(this._closeTimer), this._isOpen && this._release();
    }), ft(t, "data-open") || t.classList.contains("mtx-backdrop--open") ? (this._isOpen = !1, this.open({ silent: !0 })) : (t.hidden = !0, t.setAttribute("aria-hidden", "true"));
  }
  /** @returns {boolean} `true` si la capa está abierta. */
  get isOpen() {
    return this._isOpen;
  }
  /**
   * Muestra la capa con un fundido.
   *
   * @param {{silent?: boolean}} [options] `silent` evita emitir el evento.
   * @returns {this} La instancia.
   */
  open(t = {}) {
    if (this._isOpen) return this;
    const { element: e } = this;
    return clearTimeout(this._closeTimer), this._isOpen = !0, e.hidden = !1, e.removeAttribute("aria-hidden"), e.setAttribute("data-open", ""), ft(e, "data-lock-scroll") && me(e), ft(e, "data-inert") && this._setInert(!0), ["data-close-on-escape", "data-lock-scroll", "data-inert"].some((i) => ft(e, i)) && X(this, { kind: "modal", nodes: e, onEscape: () => this._handleEscape() }), e.offsetWidth, e.classList.add("mtx-backdrop--open"), t.silent || v(e, "mtx:backdrop:open"), this;
  }
  /**
   * Oculta la capa con un fundido.
   *
   * @param {{reason?: 'api'|'click'|'escape'}} [options] Motivo del cierre (en `detail`).
   * @returns {this} La instancia.
   */
  close(t = {}) {
    if (!this._isOpen) return this;
    const { element: e } = this;
    this._isOpen = !1, e.classList.remove("mtx-backdrop--open"), e.removeAttribute("data-open"), e.setAttribute("aria-hidden", "true"), this._release();
    const i = this._leaveDuration(), s = () => {
      this._isOpen || (e.hidden = !0);
    };
    return i > 0 ? this._closeTimer = setTimeout(s, i) : s(), v(e, "mtx:backdrop:close", { reason: t.reason || "api" }), this;
  }
  /**
   * Alterna entre abierto y cerrado.
   *
   * @returns {this} La instancia.
   */
  toggle() {
    return this._isOpen ? this.close() : this.open();
  }
  /** Libera el bloqueo de scroll y el `inert` aplicados al abrir. */
  _release() {
    pe(this.element), q(this), this._setInert(!1);
  }
  /** @returns {number} Duración de salida en ms (0 con movimiento reducido). */
  _leaveDuration() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
    const e = (getComputedStyle(this.element).transitionDuration || "0s").split(",")[0].trim(), i = parseFloat(e) || 0;
    return e.endsWith("ms") ? i : i * 1e3;
  }
  /**
   * Marca como `inert` los hermanos de la capa y de sus ancestros (patrón aria-hidden de MUI).
   * @param {boolean} active `true` al abrir.
   */
  _setInert(t) {
    if (!t) {
      this._inerted.forEach((i) => i.removeAttribute("inert")), this._inerted = [];
      return;
    }
    let e = this.element;
    for (; e && e.parentElement && e !== document.body; )
      Array.from(e.parentElement.children).forEach((i) => {
        i === e || i.hasAttribute("inert") || /^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(i.tagName) || (i.setAttribute("inert", ""), this._inerted.push(i));
      }), e = e.parentElement;
  }
  /** Cierra al hacer clic si `data-close-on-click` (ignora controles interactivos del contenido). */
  _handleClick(t) {
    if (!this._isOpen) return;
    const e = t.target instanceof Element ? t.target : null;
    if (e && e.closest("[data-mtx-backdrop-close]")) {
      this.close({ reason: "click" });
      return;
    }
    if (!ft(this.element, "data-close-on-click")) return;
    const i = e && e !== this.element && e.closest(vn);
    i && this.element.contains(i) || this.close({ reason: "click" });
  }
  /** Cierra con Escape (entregado por la pila de capas) si `data-close-on-escape`. */
  _handleEscape() {
    !this._isOpen || !ft(this.element, "data-close-on-escape") || this.close({ reason: "escape" });
  }
}
f("backdrop", ri);
typeof document < "u" && document.addEventListener("click", (r) => {
  if (!(r.target instanceof Element)) return;
  const t = r.target.closest("[data-mtx-backdrop-open]");
  if (!t) return;
  const e = (t.getAttribute("data-mtx-backdrop-open") || "").trim().replace(/^#/, ""), i = e && document.getElementById(e), s = i && L(i);
  s instanceof ri && s.toggle();
});
class ia extends g {
  /**
   * Crea una instancia de la tarjeta.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-card") || t.classList.add("mtx-card");
    const e = t.getAttribute("data-title"), i = t.getAttribute("data-subheader"), s = t.getAttribute("data-avatar"), a = t.getAttribute("data-image") || t.getAttribute("data-media");
    if ((e || i || s) && !t.querySelector(".mtx-card__header, .mtx-card-header")) {
      const c = document.createElement("div");
      if (c.className = "mtx-card__header", s) {
        const h = document.createElement("div");
        h.className = "mtx-card__header-avatar";
        const u = document.createElement("div");
        u.className = "mtx-avatar mtx-avatar--primary", u.setAttribute("data-mtx", "avatar"), u.textContent = s, h.appendChild(u), c.appendChild(h);
      }
      const d = document.createElement("div");
      if (d.className = "mtx-card__header-content", e) {
        const h = document.createElement("span");
        h.className = "mtx-card__title", h.textContent = e, d.appendChild(h);
      }
      if (i) {
        const h = document.createElement("span");
        h.className = "mtx-card__subheader", h.textContent = i, d.appendChild(h);
      }
      if (c.appendChild(d), t.hasAttribute("data-action-icon")) {
        const h = document.createElement("div");
        h.className = "mtx-card__header-action";
        const u = document.createElement("button");
        u.className = "mtx-icon-button", u.setAttribute("data-mtx", "icon-button"), u.setAttribute("type", "button"), u.setAttribute("aria-label", t.getAttribute("data-action-label") || y("card", "actions", null, "Actions", k(t)));
        const m = document.createElement("span");
        m.className = "material-icons", m.textContent = t.getAttribute("data-action-icon"), m.setAttribute("aria-hidden", "true"), u.appendChild(m), h.appendChild(u), c.appendChild(h);
      }
      t.insertBefore(c, t.firstChild);
    }
    if (a && !t.querySelector(".mtx-card__media, .mtx-card-media")) {
      const c = document.createElement("div");
      c.className = "mtx-card__media", c.setAttribute("data-mtx", "card-media"), c.style.backgroundImage = `url("${a}")`;
      const d = t.getAttribute("data-image-alt");
      d && c.setAttribute("data-alt", d);
      const h = t.getAttribute("data-media-height") || t.getAttribute("data-height");
      h && (c.style.height = `${h}px`);
      const u = t.querySelector(".mtx-card__header, .mtx-card-header");
      u && !t.hasAttribute("data-media-top") ? u.after(c) : t.insertBefore(c, t.firstChild);
    }
    const n = t.getAttribute("data-actions-align");
    t.querySelectorAll('.mtx-card__actions, .mtx-card-actions, [data-mtx="card-actions"]').forEach((c) => {
      c.closest('.mtx-card, [data-mtx="card"]') === t && qe(c, n);
    }), t.getAttribute("data-variant") === "outlined" && t.classList.add("mtx-card--outlined");
    const o = t.getAttribute("data-elevation");
    o !== null && t.classList.add(`mtx-card--elevation-${o}`), t.hasAttribute("data-raised") && t.classList.add("mtx-card--raised"), t.hasAttribute("data-square") && t.classList.add("mtx-card--square"), this.interactive = t.hasAttribute("data-clickable") || t.classList.contains("mtx-card--clickable"), this.interactive && (t.classList.add("mtx-card--clickable"), /^(BUTTON|A)$/.test(t.tagName) || t.setAttribute("role", "button"), t.hasAttribute("tabindex") || (t.tabIndex = 0), this._handlePointerDown = (c) => {
      this.disabled || c.button !== 0 || z(t, c);
    }, this._handleKeydown = (c) => {
      this.disabled || (c.key === "Enter" || c.key === " ") && (c.preventDefault(), t.click());
    }, t.addEventListener("pointerdown", this._handlePointerDown), t.addEventListener("keydown", this._handleKeydown)), t.hasAttribute("data-disabled") && this.disable();
  }
  /** @returns {boolean} Estado deshabilitado de una tarjeta interactiva. */
  get disabled() {
    return this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita una tarjeta interactiva. */
  disable() {
    this.element.setAttribute("aria-disabled", "true"), this.element.classList.add("mtx-card--disabled"), this.element.tabIndex = -1;
  }
  /** Habilita una tarjeta interactiva. */
  enable() {
    this.element.removeAttribute("aria-disabled"), this.element.classList.remove("mtx-card--disabled"), this.interactive && (this.element.tabIndex = 0);
  }
  /** Enfoca la tarjeta (útil en tarjetas interactivas). */
  focus() {
    this.element.focus();
  }
  /** Elimina listeners de una tarjeta interactiva. */
  destroy() {
    this._handlePointerDown && this.element.removeEventListener("pointerdown", this._handlePointerDown), this._handleKeydown && this.element.removeEventListener("keydown", this._handleKeydown), super.destroy();
  }
}
class sa extends g {
  /**
   * Crea un área interactiva con teclado, foco y ripple.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-card-action-area"), this._nativeInteractive = /^(BUTTON|A)$/.test(t.tagName), t.tagName === "BUTTON" && !t.hasAttribute("type") && (t.type = "button"), this._nativeInteractive || (t.setAttribute("role", "button"), t.hasAttribute("tabindex") || (t.tabIndex = 0)), this._handlePointerDown = (e) => {
      !this.disabled && e.button === 0 && z(t, e);
    }, this._handleKeydown = (e) => {
      this.disabled || this._nativeInteractive || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), t.click());
    }, this._handleClick = (e) => {
      this.disabled && (e.preventDefault(), e.stopImmediatePropagation());
    }, t.addEventListener("pointerdown", this._handlePointerDown), t.addEventListener("keydown", this._handleKeydown), t.addEventListener("click", this._handleClick), (t.hasAttribute("data-disabled") || t.getAttribute("aria-disabled") === "true") && this.disable();
  }
  /** @returns {boolean} Indica si el área está deshabilitada. */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita el área de acción. */
  disable() {
    "disabled" in this.element && (this.element.disabled = !0), this.element.setAttribute("aria-disabled", "true"), this.element.classList.add("mtx-card-action-area--disabled"), (!this._nativeInteractive || this.element.tagName === "A") && (this.element.tabIndex = -1);
  }
  /** Habilita el área de acción. */
  enable() {
    "disabled" in this.element && (this.element.disabled = !1), this.element.removeAttribute("aria-disabled"), this.element.classList.remove("mtx-card-action-area--disabled"), (!this._nativeInteractive || this.element.tagName === "A") && (this.element.tabIndex = 0);
  }
  /** Enfoca el área de acción. */
  focus() {
    this.element.focus();
  }
  /** Elimina los listeners instalados. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.element.removeEventListener("keydown", this._handleKeydown), this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
class aa extends g {
  /** @param {HTMLElement} element Elemento asociado. */
  constructor(t) {
    super(t), t.classList.add("mtx-card__header");
  }
}
class ra extends g {
  /** @param {HTMLElement} element Elemento asociado. */
  constructor(t) {
    super(t), t.classList.add("mtx-card__content");
  }
}
const Xt = ["start", "center", "end", "between"];
function qe(r, t = null) {
  const e = r.getAttribute("data-align"), i = Xt.find((a) => r.classList.contains(`mtx-card__actions--${a}`)), s = [e, i, t].find((a) => Xt.includes(a)) || "end";
  return Xt.forEach((a) => {
    r.classList.toggle(`mtx-card__actions--${a}`, a === s && a !== "end");
  }), s;
}
class na extends g {
  /** @param {HTMLElement} element Elemento asociado. */
  constructor(t) {
    super(t), t.classList.add("mtx-card__actions");
    const e = t.getAttribute("data-disable-spacing");
    e !== null && e !== "false" && t.classList.add("mtx-card__actions--disable-spacing");
    const i = t.closest('.mtx-card, [data-mtx="card"]');
    this._align = qe(t, i ? i.getAttribute("data-actions-align") : null);
  }
  /** @returns {string} Alineación actual (`start`, `center`, `end` o `between`). */
  get align() {
    return this._align;
  }
  /**
   * Cambia la alineación de las acciones.
   *
   * @param {string} value `start`, `center`, `end` o `between`.
   * @throws {RangeError} Si el valor no es una alineación válida.
   */
  set align(t) {
    if (!Xt.includes(t))
      throw new RangeError(`Alineación no válida: ${t}`);
    this.element.setAttribute("data-align", t), this._align = qe(this.element);
  }
}
class la extends g {
  /**
   * Crea el media y aplica `data-image`, `data-alt` y `data-height`.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-card__media");
    const e = Number.parseFloat(t.getAttribute("data-height") || t.getAttribute("data-media-height"));
    Number.isFinite(e) && e >= 0 && (t.style.height = `${e}px`);
    const i = t.getAttribute("data-alt");
    t.tagName === "IMG" ? i ? t.alt = i : t.hasAttribute("alt") || (t.alt = "") : i ? (t.setAttribute("role", "img"), t.setAttribute("aria-label", i)) : !t.hasAttribute("role") && !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && !t.children.length && (t.hasAttribute("data-image") || t.style.backgroundImage) && t.setAttribute("aria-hidden", "true"), t.hasAttribute("data-image") && (this.image = t.getAttribute("data-image"));
  }
  /** @returns {string} URL actual del recurso. */
  get image() {
    return this.element.tagName === "IMG" ? this.element.getAttribute("src") || "" : this.element.style.backgroundImage.replace(/^url\(["']?|["']?\)$/g, "");
  }
  /** @param {string} value URL del recurso. */
  set image(t) {
    if (this.element.tagName === "IMG")
      this.element.src = t;
    else {
      const e = String(t).replace(/["\\\n\r]/g, encodeURIComponent);
      this.element.style.backgroundImage = `url("${e}")`;
    }
  }
}
f("card", ia);
f("card-action-area", sa);
f("card-header", aa);
f("card-content", ra);
f("card-actions", na);
f("card-media", la);
function ni(r) {
  return r == null || r === "false" ? { error: !1, message: "" } : r === "" || r === "true" ? { error: !0, message: "" } : { error: !0, message: String(r) };
}
class oa extends g {
  /**
   * @param {HTMLElement} element Elemento del texto de ayuda.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-form-helper-text"), t.id || (t.id = P("mtx-form-helper-text"));
    const { error: e } = ni(t.getAttribute("data-error"));
    this.error = e;
  }
  /** @returns {boolean} `true` si el texto está en estado de error. */
  get error() {
    return this.element.classList.contains("mtx-form-helper-text--error");
  }
  /**
   * Activa o desactiva el estado de error.
   * @param {boolean} value Nuevo estado.
   */
  set error(t) {
    this.element.classList.toggle("mtx-form-helper-text--error", !!t);
  }
  /**
   * Reemplaza el texto visible.
   * @param {string} text Nuevo texto.
   */
  setText(t) {
    this.element.textContent = t == null ? "" : String(t);
  }
}
class Mt {
  /**
   * @param {object} options Opciones.
   * @param {HTMLElement} options.host Elemento visual que se envuelve (label o grupo).
   * @param {HTMLElement} options.target Elemento que recibe aria-describedby/aria-invalid.
   * @param {string} [options.helperText] Texto de ayuda inicial.
   * @param {string|null} [options.errorAttr] Valor inicial de `data-error`.
   */
  constructor({ host: t, target: e, helperText: i = "", errorAttr: s = null }) {
    this.host = t, this.target = e, this.wrapper = t.parentElement && t.parentElement.classList.contains("mtx-form-control") ? t.parentElement : null, this.helperEl = this.wrapper ? this.wrapper.querySelector(":scope > .mtx-form-helper-text") : null, this._helperText = i || (this.helperEl ? this.helperEl.textContent : ""), this._error = !1, this._baseDescribedBy = (e.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean), this.helperEl && (this._prepareHelper(this.helperEl), this.helperEl.classList.contains("mtx-form-helper-text--error") && (this._error = !0)), i && this.setHelperText(i);
    const { error: a, message: n } = ni(s);
    a ? this.setError(n || !0) : this._sync();
  }
  /** @returns {boolean} `true` si el control está en estado de error. */
  get error() {
    return this._error;
  }
  /**
   * Cambia el texto de ayuda base (se muestra cuando no hay mensaje de error).
   * @param {string} text Texto de ayuda; vacío lo elimina.
   */
  setHelperText(t) {
    this._helperText = t ? String(t) : "", this._errorMessage || this._render(this._helperText), this._sync();
  }
  /**
   * Activa el estado de error.
   * @param {string|boolean} [message=true] Mensaje que reemplaza al texto de ayuda, o `true` sin mensaje.
   */
  setError(t = !0) {
    if (t === !1 || t === null) {
      this.clearError();
      return;
    }
    this._error = !0, this._errorMessage = typeof t == "string" ? t : "", this._render(this._errorMessage || this._helperText), this._sync();
  }
  /** Limpia el estado de error y restaura el texto de ayuda. */
  clearError() {
    this._error = !1, this._errorMessage = "", this._render(this._helperText), this._sync();
  }
  /**
   * Sincroniza el estado deshabilitado del contenedor.
   * @param {boolean} disabled Estado.
   */
  setDisabled(t) {
    this._disabled = !!t, this.wrapper && this.wrapper.classList.toggle("mtx-form-control--disabled", this._disabled), this._syncDisabled();
  }
  /**
   * Marca el texto de ayuda con `aria-disabled` cuando el control está deshabilitado,
   * para que su color atenuado (text-disabled) se trate como contenido deshabilitado.
   * @private
   */
  _syncDisabled() {
    if (!this.helperEl) return;
    this._disabled ?? this.target.disabled === !0 ? this.helperEl.setAttribute("aria-disabled", "true") : this.helperEl.removeAttribute("aria-disabled");
  }
  /** Crea el contenedor `.mtx-form-control` si aún no existe. */
  ensureWrapper() {
    if (this.wrapper) return this.wrapper;
    const t = document.createElement("div");
    return t.className = "mtx-form-control", this.host.parentNode && this.host.parentNode.insertBefore(t, this.host), t.appendChild(this.host), this.wrapper = t, t;
  }
  /** @private */
  _prepareHelper(t) {
    t.classList.add("mtx-form-helper-text"), t.id || (t.id = P("mtx-form-helper-text"));
  }
  /** @private */
  _render(t) {
    if (!t) {
      this.helperEl && this.helperEl.dataset.mtxGenerated === "" ? (this.helperEl.remove(), this.helperEl = null) : this.helperEl && (this.helperEl.textContent = "");
      return;
    }
    if (!this.helperEl) {
      const e = this.ensureWrapper(), i = document.createElement("p");
      i.dataset.mtxGenerated = "", this._prepareHelper(i), e.appendChild(i), this.helperEl = i;
    }
    this.helperEl.textContent = t;
  }
  /** @private */
  _sync() {
    this.helperEl && this.helperEl.classList.toggle("mtx-form-helper-text--error", this._error), this._syncDisabled(), this.wrapper && this.wrapper.classList.toggle("mtx-form-control--error", this._error);
    const t = [...this._baseDescribedBy];
    this.helperEl && this.helperEl.id && this.helperEl.textContent && t.push(this.helperEl.id);
    const e = [...new Set(t)];
    e.length ? this.target.setAttribute("aria-describedby", e.join(" ")) : this.target.removeAttribute("aria-describedby"), this._error ? (this.target.setAttribute("aria-invalid", "true"), this._ownsInvalid = !0) : this._ownsInvalid && (this.target.removeAttribute("aria-invalid"), this._ownsInvalid = !1);
  }
}
f("form-helper-text", oa);
const En = ["primary", "secondary", "error", "warning", "info", "success"];
function li(r, t) {
  const e = document.createElement("label");
  e.className = t;
  const i = r.getAttribute("class");
  return i && (e.className += " " + i), r.parentNode && r.parentNode.insertBefore(e, r), e.appendChild(r), e;
}
function oi(r, t, e) {
  return r.hasAttribute(e) ? r.getAttribute(e) : t && t !== r && t.hasAttribute(e) ? t.getAttribute(e) : null;
}
class ca extends g {
  /**
   * Crea una instancia de la casilla.
   *
   * @param {HTMLElement} root `<input type="checkbox">` o `<label class="mtx-checkbox">`.
   */
  constructor(t) {
    var c;
    let e = t;
    if (t.matches('input[type="checkbox"]') && (e = t.closest(".mtx-checkbox") || li(t, "mtx-checkbox")), super(e), e.classList.add("mtx-checkbox"), this.input = e.matches('input[type="checkbox"]') ? e : e.querySelector('input[type="checkbox"]'), !this.input)
      throw new TypeError('Checkbox requiere un <input type="checkbox">.');
    this.input.classList.add("mtx-checkbox__input");
    const i = (d) => oi(e, this.input, d);
    let s = e.querySelector(".mtx-checkbox__box");
    s || (s = document.createElement("span"), s.className = "mtx-checkbox__box", this.input.insertAdjacentElement("afterend", s)), this.box = s;
    const a = i("data-label") || i("label");
    if (a && !e.querySelector(".mtx-checkbox__label")) {
      const d = document.createElement("span");
      d.className = "mtx-checkbox__label", d.textContent = a, e.appendChild(d);
    }
    (i("data-small") !== null || i("data-size") === "small") && e.classList.add("mtx-checkbox--small");
    const n = i("data-color");
    En.includes(n) && n !== "primary" && e.classList.add(`mtx-checkbox--${n}`), i("data-indeterminate") !== null && i("data-indeterminate") !== "false" && (this.input.indeterminate = !0);
    const l = i("data-helper-text"), o = i("data-error");
    (l || o !== null || (c = e.parentElement) != null && c.classList.contains("mtx-form-control")) && (this.helper = new Mt({ host: e, target: this.input, helperText: l, errorAttr: o })), this._handlePointerDown = (d) => {
      this.input.disabled || i("data-disable-ripple") !== null || d.button !== 0 || z(this.box || e, d, {
        centered: !!this.box,
        interactionTarget: e
      });
    }, e.addEventListener("pointerdown", this._handlePointerDown), this._handleChange = () => this._syncAria(), this.input.addEventListener("change", this._handleChange), this._syncAria();
  }
  /** @returns {boolean} `true` si está comprobada. */
  get checked() {
    return this.input.checked;
  }
  /**
   * Establece el valor comprobado y sincroniza `aria-checked`.
   * @param {boolean} value Nuevo estado.
   */
  set checked(t) {
    this.input.checked = !!t, this._syncAria();
  }
  /** @returns {boolean} `true` si está indeterminada. */
  get indeterminate() {
    return this.input.indeterminate;
  }
  /**
   * Establece el estado indeterminado y sincroniza `aria-checked="mixed"`.
   * @param {boolean} value Nuevo estado.
   */
  set indeterminate(t) {
    this.input.indeterminate = !!t, this._syncAria();
  }
  /** Alterna el estado comprobado (limpia el indeterminado, como el navegador). */
  toggle() {
    this.disabled || (this.input.indeterminate = !1, this.checked = !this.checked);
  }
  /** @returns {boolean} `true` si la casilla está deshabilitada. */
  get disabled() {
    return this.input.disabled;
  }
  /** Deshabilita la casilla. */
  disable() {
    this.input.disabled = !0, this.helper && this.helper.setDisabled(!0);
  }
  /** Habilita la casilla. */
  enable() {
    this.input.disabled = !1, this.helper && this.helper.setDisabled(!1);
  }
  /** Enfoca la casilla nativa. */
  focus() {
    this.input.focus();
  }
  /** @returns {boolean} `true` si está en estado de error. */
  get error() {
    return !!(this.helper && this.helper.error);
  }
  /**
   * Cambia el texto de ayuda (FormHelperText) bajo la casilla.
   * @param {string} text Texto; vacío lo elimina.
   */
  setHelperText(t) {
    this._ensureHelper().setHelperText(t);
  }
  /**
   * Activa el estado de error con `aria-invalid` y texto de error opcional.
   * @param {string|boolean} [message=true] Mensaje o `true` para error sin mensaje.
   */
  setError(t = !0) {
    this._ensureHelper().setError(t);
  }
  /** Limpia el estado de error. */
  clearError() {
    this.helper && this.helper.clearError();
  }
  /** @private */
  _ensureHelper() {
    return this.helper || (this.helper = new Mt({ host: this.element, target: this.input })), this.helper;
  }
  /** Sincroniza `aria-checked` según checked/indeterminate. */
  _syncAria() {
    this.input.setAttribute("aria-checked", this.input.indeterminate ? "mixed" : String(this.input.checked));
  }
  /** Destruye la instancia y elimina los event listeners. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.input.removeEventListener("change", this._handleChange), super.destroy();
  }
}
f("checkbox", ca);
const wn = ["primary", "secondary", "error", "warning", "info", "success"];
class da extends g {
  /**
   * Crea una instancia del radio.
   *
   * @param {HTMLElement} root `<input type="radio">` o `<label class="mtx-radio">`.
   */
  constructor(t) {
    let e = t;
    if (t.matches('input[type="radio"]') && (e = t.closest(".mtx-radio") || li(t, "mtx-radio")), super(e), e.classList.add("mtx-radio"), this.input = e.matches('input[type="radio"]') ? e : e.querySelector('input[type="radio"]'), !this.input)
      throw new TypeError('Radio requiere un <input type="radio">.');
    this.input.classList.add("mtx-radio__input");
    const i = (l) => oi(e, this.input, l);
    let s = e.querySelector(".mtx-radio__box");
    s || (s = document.createElement("span"), s.className = "mtx-radio__box", this.input.insertAdjacentElement("afterend", s)), this.box = s;
    const a = i("data-label") || i("label");
    if (a && !e.querySelector(".mtx-radio__label")) {
      const l = document.createElement("span");
      l.className = "mtx-radio__label", l.textContent = a, e.appendChild(l);
    }
    (i("data-small") !== null || i("data-size") === "small") && e.classList.add("mtx-radio--small");
    const n = i("data-color");
    wn.includes(n) && n !== "primary" && e.classList.add(`mtx-radio--${n}`), this._handlePointerDown = (l) => {
      this.input.disabled || i("data-disable-ripple") !== null || l.button !== 0 || z(this.box || e, l, {
        centered: !!this.box,
        interactionTarget: e
      });
    }, e.addEventListener("pointerdown", this._handlePointerDown), this.input.removeAttribute("aria-checked");
  }
  /** @returns {boolean} `true` si está seleccionado. */
  get checked() {
    return this.input.checked;
  }
  /**
   * Establece el estado seleccionado (el navegador desmarca el resto del grupo).
   * @param {boolean} value Nuevo estado.
   */
  set checked(t) {
    this.input.checked = !!t;
  }
  /** @returns {boolean} `true` si el radio está deshabilitado. */
  get disabled() {
    return this.input.disabled;
  }
  /** Deshabilita el radio. */
  disable() {
    this.input.disabled = !0;
  }
  /** Habilita el radio. */
  enable() {
    this.input.disabled = !1;
  }
  /** Enfoca el control nativo. */
  focus() {
    this.input.focus();
  }
  /** Destruye la instancia. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
}
class ha extends g {
  /**
   * @param {HTMLElement} element Elemento contenedor del grupo.
   */
  constructor(t) {
    var o;
    super(t), t.classList.add("mtx-radio-group"), t.hasAttribute("role") || t.setAttribute("role", "radiogroup");
    const e = t.getAttribute("data-row"), i = t.getAttribute("data-direction");
    (e !== null && e !== "false" || i === "row") && t.classList.add("mtx-radio-group--row"), this.name = t.getAttribute("data-name") || t.getAttribute("name"), this.name && t.querySelectorAll('input[type="radio"]:not([name])').forEach((c) => {
      c.name = this.name;
    });
    const s = t.getAttribute("data-label"), a = t.getAttribute("data-helper-text"), n = t.getAttribute("data-error"), l = (o = t.parentElement) == null ? void 0 : o.classList.contains("mtx-form-control");
    (s || a || n !== null || l) && (this.helper = new Mt({ host: t, target: t, helperText: a, errorAttr: n })), s && this._buildLabel(s), this._handleChange = (c) => {
      c.target.matches('input[type="radio"]') && v(this.element, "mtx:radio-group:change", { value: c.target.value }, { aliases: ["mtx:change"] });
    }, this.element.addEventListener("change", this._handleChange);
  }
  /** @private */
  _buildLabel(t) {
    const e = this.helper.ensureWrapper();
    let i = e.querySelector(":scope > .mtx-form-label");
    i || (i = document.createElement("div"), i.className = "mtx-form-label", i.id = `${this.element.id || P("mtx-radio-group")}-label`, i.textContent = t, e.insertBefore(i, this.element)), this.labelEl = i, !this.element.hasAttribute("aria-label") && !this.element.hasAttribute("aria-labelledby") && this.element.setAttribute("aria-labelledby", i.id);
  }
  /** @private */
  _radios() {
    const t = Array.from(this.element.querySelectorAll('input[type="radio"]'));
    return this.name ? t.filter((e) => e.name === this.name) : t;
  }
  /** @returns {string} Valor del radio seleccionado ('' si ninguno). */
  get value() {
    const t = this._radios().find((e) => e.checked);
    return t ? t.value : "";
  }
  /**
   * Selecciona el radio que coincide con el valor dado.
   * @param {string} val Valor a seleccionar.
   */
  set value(t) {
    this._radios().forEach((e) => {
      e.checked = e.value === String(t);
    });
  }
  /** @returns {boolean} `true` si todos los radios están deshabilitados. */
  get disabled() {
    const t = this._radios();
    return t.length > 0 && t.every((e) => e.disabled);
  }
  /** Deshabilita todos los radios del grupo. */
  disable() {
    this._radios().forEach((t) => {
      t.disabled = !0;
    }), this.element.setAttribute("aria-disabled", "true"), this.helper && this.helper.setDisabled(!0);
  }
  /** Habilita todos los radios del grupo. */
  enable() {
    this._radios().forEach((t) => {
      t.disabled = !1;
    }), this.element.removeAttribute("aria-disabled"), this.helper && this.helper.setDisabled(!1);
  }
  /** @returns {boolean} `true` si el grupo está en estado de error. */
  get error() {
    return !!(this.helper && this.helper.error);
  }
  /**
   * Cambia el texto de ayuda bajo el grupo.
   * @param {string} text Texto; vacío lo elimina.
   */
  setHelperText(t) {
    this._ensureHelper().setHelperText(t);
  }
  /**
   * Activa el estado de error (aria-invalid en el radiogroup) con mensaje opcional.
   * @param {string|boolean} [message=true] Mensaje o `true` para error sin mensaje.
   */
  setError(t = !0) {
    this._ensureHelper().setError(t);
  }
  /** Limpia el estado de error. */
  clearError() {
    this.helper && this.helper.clearError();
  }
  /** @private */
  _ensureHelper() {
    return this.helper || (this.helper = new Mt({ host: this.element, target: this.element })), this.helper;
  }
  /** Destruye la instancia. */
  destroy() {
    this.element.removeEventListener("change", this._handleChange), super.destroy();
  }
}
f("radio", da);
f("radio-group", ha);
const Ln = ["primary", "secondary", "error", "warning", "info", "success"];
class ua extends g {
  /**
   * Crea una instancia del interruptor.
   *
   * @param {HTMLElement} root `<input type="checkbox">` o `<label class="mtx-switch">`.
   */
  constructor(t) {
    var d;
    let e = t;
    if (t.matches('input[type="checkbox"]') && (e = t.closest(".mtx-switch") || li(t, "mtx-switch")), super(e), e.classList.add("mtx-switch"), this.input = e.matches('input[type="checkbox"]') ? e : e.querySelector('input[type="checkbox"]'), !this.input)
      throw new TypeError('Switch requiere un <input type="checkbox">.');
    this.input.classList.add("mtx-switch__input"), this.input.setAttribute("role", "switch");
    const i = (h) => oi(e, this.input, h);
    let s = e.querySelector(".mtx-switch__track"), a = e.querySelector(".mtx-switch__thumb");
    s || (s = document.createElement("span"), s.className = "mtx-switch__track", a = document.createElement("span"), a.className = "mtx-switch__thumb", s.appendChild(a), this.input.insertAdjacentElement("afterend", s)), this.thumb = a || e.querySelector(".mtx-switch__thumb");
    const n = i("data-label") || i("label");
    if (n && !e.querySelector(".mtx-switch__label")) {
      const h = document.createElement("span");
      h.className = "mtx-switch__label", h.textContent = n, e.appendChild(h);
    }
    (i("data-small") !== null || i("data-size") === "small") && e.classList.add("mtx-switch--small");
    const l = i("data-color");
    Ln.includes(l) && l !== "primary" && e.classList.add(`mtx-switch--${l}`);
    const o = i("data-helper-text"), c = i("data-error");
    (o || c !== null || (d = e.parentElement) != null && d.classList.contains("mtx-form-control")) && (this.helper = new Mt({ host: e, target: this.input, helperText: o, errorAttr: c })), this._handlePointerDown = (h) => {
      this.input.disabled || i("data-disable-ripple") !== null || h.button !== 0 || z(this.thumb || e, h, {
        centered: !!this.thumb,
        interactionTarget: e
      });
    }, this._handleReadOnlyClick = (h) => {
      this.input.readOnly && h.preventDefault();
    }, this._handleChange = () => this._syncAria(), e.addEventListener("pointerdown", this._handlePointerDown), this.input.addEventListener("click", this._handleReadOnlyClick), this.input.addEventListener("change", this._handleChange), this._syncAria();
  }
  /** @returns {boolean} `true` si está activado. */
  get checked() {
    return this.input.checked;
  }
  /**
   * Establece el valor comprobado y sincroniza `aria-checked`.
   * @param {boolean} value Nuevo estado.
   */
  set checked(t) {
    this.input.checked = !!t, this._syncAria();
  }
  /** Alterna el estado comprobado. */
  toggle() {
    !this.disabled && !this.input.readOnly && (this.checked = !this.checked);
  }
  /** @returns {boolean} `true` si el interruptor está deshabilitado. */
  get disabled() {
    return this.input.disabled;
  }
  /** Deshabilita el interruptor. */
  disable() {
    this.input.disabled = !0, this.helper && this.helper.setDisabled(!0);
  }
  /** Habilita el interruptor. */
  enable() {
    this.input.disabled = !1, this.helper && this.helper.setDisabled(!1);
  }
  /** Enfoca el control nativo. */
  focus() {
    this.input.focus();
  }
  /** @returns {boolean} `true` si está en estado de error. */
  get error() {
    return !!(this.helper && this.helper.error);
  }
  /**
   * Cambia el texto de ayuda (FormHelperText) bajo el interruptor.
   * @param {string} text Texto; vacío lo elimina.
   */
  setHelperText(t) {
    this._ensureHelper().setHelperText(t);
  }
  /**
   * Activa el estado de error con `aria-invalid` y texto de error opcional.
   * @param {string|boolean} [message=true] Mensaje o `true` para error sin mensaje.
   */
  setError(t = !0) {
    this._ensureHelper().setError(t);
  }
  /** Limpia el estado de error. */
  clearError() {
    this.helper && this.helper.clearError();
  }
  /** @private */
  _ensureHelper() {
    return this.helper || (this.helper = new Mt({ host: this.element, target: this.input })), this.helper;
  }
  /** Sincroniza `aria-checked` con el estado nativo. */
  _syncAria() {
    this.input.setAttribute("aria-checked", String(this.input.checked));
  }
  /** Destruye la instancia y elimina los event listeners. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.input.removeEventListener("click", this._handleReadOnlyClick), this.input.removeEventListener("change", this._handleChange), super.destroy();
  }
}
f("switch", ua);
const kn = ["small", "medium", "large"], Sn = ["standard", "primary", "secondary", "error", "warning", "info", "success"], ma = '.mtx-toggle-button-group, [data-mtx="toggle-button-group"]', Ri = 'button, [data-mtx="toggle-button"], .mtx-toggle-button', wt = (r, t) => r.hasAttribute(t) && r.getAttribute(t) !== "false";
function pa(r, t, e) {
  kn.includes(t) && t !== "medium" && r.classList.add(`mtx-toggle-button--${t}`), Sn.includes(e) && e !== "standard" && r.classList.add(`mtx-toggle-button--${e}`);
}
class _a extends g {
  /**
   * @param {HTMLElement} element Elemento `<button>` asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-toggle-button"), t.tagName === "BUTTON" && !t.hasAttribute("type") && (t.type = "button"), pa(t, t.getAttribute("data-size"), t.getAttribute("data-color"));
    const e = t.getAttribute("data-icon");
    if (e && !t.querySelector(".material-icons, .material-symbols-outlined, svg")) {
      const s = document.createElement("span");
      s.className = "material-icons mtx-toggle-button__icon", s.setAttribute("aria-hidden", "true"), s.textContent = e, t.insertBefore(s, t.firstChild);
    }
    const i = wt(t, "data-selected") || t.classList.contains("mtx-toggle-button--selected") || t.getAttribute("aria-pressed") === "true";
    t.classList.remove("mtx-toggle-button--selected"), this._setPressed(i), wt(t, "data-disabled") && this.disable(), this._handlePointerDown = (s) => {
      this.disabled || s.button !== 0 || z(t, s);
    }, this._handleClick = () => {
      this.disabled || this.group || (this._setPressed(!this.selected), v(t, "mtx:toggle-button:change", { selected: this.selected, value: this.value }));
    }, t.addEventListener("pointerdown", this._handlePointerDown), t.addEventListener("click", this._handleClick);
  }
  /** @returns {HTMLElement|null} Contenedor del grupo, si existe. */
  get group() {
    const t = this.element.parentElement;
    return t ? t.closest(ma) : null;
  }
  /** @returns {string} Valor del botón (`data-value`, `value` o texto). */
  get value() {
    return this.element.getAttribute("data-value") ?? (this.element.getAttribute("value") || this.element.textContent.trim());
  }
  /** @returns {boolean} `true` si está seleccionado (`aria-pressed="true"`). */
  get selected() {
    return this.element.getAttribute("aria-pressed") === "true";
  }
  /**
   * Fija el estado seleccionado sin emitir eventos.
   * @param {boolean} value Nuevo estado.
   */
  set selected(t) {
    this._setPressed(!!t);
  }
  /**
   * Alterna el estado seleccionado sin emitir eventos.
   * @returns {boolean} Nuevo estado.
   */
  toggle() {
    return this._setPressed(!this.selected), this.selected;
  }
  /** @returns {boolean} `true` si está deshabilitado (`disabled` o `aria-disabled`). */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita el botón. */
  disable() {
    this.element.tagName === "BUTTON" ? this.element.disabled = !0 : this.element.setAttribute("aria-disabled", "true");
  }
  /** Habilita el botón. */
  enable() {
    this.element.tagName === "BUTTON" && (this.element.disabled = !1), this.element.removeAttribute("aria-disabled");
  }
  /** Enfoca el botón. */
  focus() {
    this.element.focus();
  }
  /**
   * @private
   * @param {boolean} pressed Estado.
   */
  _setPressed(t) {
    this.element.setAttribute("aria-pressed", String(t));
  }
  /** Destruye la instancia y retira los listeners. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
class fa extends g {
  /**
   * @param {HTMLElement} element Contenedor del grupo.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-toggle-button-group"), t.hasAttribute("role") || t.setAttribute("role", "group");
    const e = t.getAttribute("data-label");
    e && !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && t.setAttribute("aria-label", e), this.exclusive = wt(t, "data-exclusive") || t.classList.contains("mtx-toggle-button-group--exclusive"), this.enforceValueSet = wt(t, "data-enforce-value-set"), this.orientation = t.getAttribute("data-orientation") === "vertical" || t.classList.contains("mtx-toggle-button-group--vertical") ? "vertical" : "horizontal", t.classList.toggle("mtx-toggle-button-group--vertical", this.orientation === "vertical"), wt(t, "data-full-width") && t.classList.add("mtx-toggle-button-group--full-width");
    const i = t.getAttribute("data-size"), s = t.getAttribute("data-color");
    this._buttonElements().forEach((a) => {
      i && !a.hasAttribute("data-size") && a.setAttribute("data-size", i), s && !a.hasAttribute("data-color") && a.setAttribute("data-color", s), a.hasAttribute("data-mtx") || a.setAttribute("data-mtx", "toggle-button"), L(a) ? pa(a, a.getAttribute("data-size"), a.getAttribute("data-color")) : U(a, "toggle-button");
    }), t.hasAttribute("data-value") ? this.value = this._parseValue(t.getAttribute("data-value")) : this.exclusive && (this.value = this.value), wt(t, "data-disabled") && this.disable(), this._handleClick = (a) => this._onClick(a), this._handleKeyDown = (a) => this._onKeyDown(a), t.addEventListener("click", this._handleClick), t.addEventListener("keydown", this._handleKeyDown);
  }
  /**
   * @private
   * @returns {HTMLElement[]} Botones que pertenecen a este grupo (no a grupos anidados).
   */
  _buttonElements() {
    return Array.from(this.element.querySelectorAll(Ri)).filter((t) => t.parentElement && t.parentElement.closest(ma) === this.element);
  }
  /** @returns {ToggleButton[]} Instancias de los botones del grupo. */
  get buttons() {
    return this._buttonElements().map((t) => L(t)).filter(Boolean);
  }
  /**
   * @private
   * @param {string} raw Valor declarativo (lista separada por comas en modo múltiple).
   * @returns {string|string[]|null} Valor normalizado.
   */
  _parseValue(t) {
    return this.exclusive ? t === "" ? null : t : t.split(",").map((e) => e.trim()).filter(Boolean);
  }
  /**
   * Valor actual: `string|null` en modo exclusivo; `string[]` (orden del DOM) en modo múltiple.
   * @returns {string|string[]|null} Valor.
   */
  get value() {
    const t = this.buttons.filter((e) => e.selected).map((e) => e.value);
    return this.exclusive ? t[0] ?? null : t;
  }
  /**
   * Fija el valor sin emitir eventos.
   * @param {string|string[]|null} val Valor (string, array o `null`).
   */
  set value(t) {
    let e;
    t == null || t === "" ? e = [] : e = (Array.isArray(t) ? t : [t]).map(String), this.exclusive && (e = e.slice(0, 1));
    let i = !1;
    this.buttons.forEach((s) => {
      const a = e.includes(s.value) && !(this.exclusive && i);
      a && (i = !0), s.selected = a;
    });
  }
  /**
   * @private
   * @param {MouseEvent} event Clic delegado.
   */
  _onClick(t) {
    const e = t.target.closest ? t.target.closest(Ri) : null;
    if (!e || !this._buttonElements().includes(e)) return;
    const i = L(e);
    if (!i || i.disabled) return;
    const s = this.value;
    let a;
    if (this.exclusive) {
      if (a = s === i.value ? null : i.value, a === null && this.enforceValueSet) return;
    } else if (a = s.includes(i.value) ? s.filter((n) => n !== i.value) : [...s, i.value], a.length === 0 && this.enforceValueSet) return;
    this.value = a, v(this.element, "mtx:toggle-button-group:change", { value: this.value });
  }
  /**
   * Flechas, Inicio y Fin mueven el foco entre los botones habilitados.
   * @private
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeyDown(t) {
    const e = this.buttons.filter((c) => !c.disabled).map((c) => c.element), i = e.indexOf(t.target);
    if (i === -1) return;
    const s = this.orientation === "vertical", a = getComputedStyle(this.element).direction === "rtl", n = s ? "ArrowDown" : a ? "ArrowLeft" : "ArrowRight", l = s ? "ArrowUp" : a ? "ArrowRight" : "ArrowLeft";
    let o = null;
    t.key === n ? o = e[(i + 1) % e.length] : t.key === l ? o = e[(i - 1 + e.length) % e.length] : t.key === "Home" ? o = e[0] : t.key === "End" && (o = e[e.length - 1]), o && (t.preventDefault(), o.focus());
  }
  /** @returns {boolean} `true` si todos los botones están deshabilitados. */
  get disabled() {
    const t = this.buttons;
    return t.length > 0 && t.every((e) => e.disabled);
  }
  /** Deshabilita todos los botones del grupo. */
  disable() {
    this.buttons.forEach((t) => t.disable()), this.element.setAttribute("aria-disabled", "true");
  }
  /** Habilita todos los botones del grupo. */
  enable() {
    this.buttons.forEach((t) => t.enable()), this.element.removeAttribute("aria-disabled");
  }
  /** Destruye la instancia y retira los listeners. */
  destroy() {
    this.element.removeEventListener("click", this._handleClick), this.element.removeEventListener("keydown", this._handleKeyDown), super.destroy();
  }
}
f("toggle-button", _a);
f("toggle-button-group", fa);
const Cn = {
  star: "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  star_border: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z",
  star_outline: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z",
  favorite: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  favorite_border: "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z",
  circle: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z",
  radio_button_unchecked: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
  thumb_up: "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z",
  thumb_up_off_alt: "M21 8h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2zm0 4l-3 7H9V9l4.34-4.34L12.23 10H21v2zM1 9h4v12H1z"
}, Tn = ["small", "medium", "large"], Le = (r, t) => r.hasAttribute(t) && r.getAttribute(t) !== "false";
function Wt(r, t) {
  const e = document.createElement("span");
  e.className = t, e.setAttribute("aria-hidden", "true");
  const i = Cn[r];
  if (i)
    e.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><path d="${i}"/></svg>`;
  else {
    const s = document.createElement("span");
    s.className = "material-icons", s.textContent = r, e.appendChild(s);
  }
  return e;
}
class ba extends g {
  /**
   * @param {HTMLElement} element Contenedor (normalmente un `<span>` vacío).
   */
  constructor(t) {
    super(t), t.classList.add("mtx-rating"), this.max = Math.max(1, parseInt(t.getAttribute("data-max"), 10) || 5);
    const e = parseFloat(t.getAttribute("data-precision"));
    this.precision = e > 0 && e <= 1 && Number.isInteger(Math.round(1 / e * 1e6) / 1e6) ? e : 1, this.readOnly = Le(t, "data-read-only") || t.classList.contains("mtx-rating--read-only"), this.highlightSelectedOnly = Le(t, "data-highlight-selected-only"), this.icon = t.getAttribute("data-icon") || "star", this.emptyIcon = t.getAttribute("data-empty-icon") || (t.hasAttribute("data-icon") ? this.icon : "star_border"), this.name = t.getAttribute("data-name") || t.getAttribute("name") || P("mtx-rating"), this._locale = k(t);
    const i = t.getAttribute("data-size");
    Tn.includes(i) && i !== "medium" && t.classList.add(`mtx-rating--${i}`), t.classList.toggle("mtx-rating--read-only", this.readOnly);
    const s = t.getAttribute("data-label");
    s && !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && t.setAttribute("aria-label", s), this._hover = null, this._value = this._round(parseFloat(t.getAttribute("data-value"))), t.querySelector(".mtx-rating__item") || this._build(), this._bind(), this.readOnly ? t.setAttribute("role", "img") : !t.hasAttribute("role") && (t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby")) && t.setAttribute("role", "radiogroup"), Le(t, "data-disabled") && this.disable(), this._render(), this.readOnly || this._listen();
  }
  /**
   * Redondea y acota un valor a la precisión y al máximo (`null` = sin valoración).
   * @private
   * @param {number} value Valor bruto.
   * @returns {number|null} Valor normalizado.
   */
  _round(t) {
    if (!Number.isFinite(t) || t <= 0) return null;
    const e = Math.round(t / this.precision), i = Math.min(this.max, Number((e * this.precision).toFixed(4)));
    return i > 0 ? i : null;
  }
  /**
   * Formatea un número para las etiquetas accesibles.
   * @private
   * @param {number} value Valor.
   * @returns {string} Texto.
   */
  _format(t) {
    try {
      return new Intl.NumberFormat(this._locale).format(t);
    } catch {
      return String(t);
    }
  }
  /**
   * Etiqueta accesible de un valor ("3 Stars").
   * @private
   * @param {number} value Valor.
   * @returns {string} Etiqueta.
   */
  _labelFor(t) {
    return y("rating", t === 1 ? "star" : "stars", { value: this._format(t) }, `${t} Stars`, this._locale);
  }
  /**
   * Genera la estructura: un ítem por icono y, dentro, un radio + label por cada paso de precisión.
   * @private
   */
  _build() {
    const t = this.element, e = Math.round(1 / this.precision);
    t.textContent = "";
    for (let i = 1; i <= this.max; i += 1) {
      const s = document.createElement("span");
      s.className = "mtx-rating__item", e > 1 && s.classList.add("mtx-rating__item--decimal");
      for (let a = 1; a <= e; a += 1) {
        const n = Number((i - 1 + a / e).toFixed(4)), l = document.createElement(this.readOnly ? "span" : "label");
        if (l.className = "mtx-rating__label", l.setAttribute("data-rating-value", String(n)), a < e && (l.classList.add("mtx-rating__label--partial"), l.style.width = `${a / e * 100}%`, l.style.zIndex = String(e - a)), l.appendChild(Wt(this.icon, "mtx-rating__icon mtx-rating__icon--filled")), l.appendChild(Wt(this.emptyIcon, "mtx-rating__icon mtx-rating__icon--empty")), !this.readOnly) {
          const o = this._createInput(String(n)), c = document.createElement("span");
          c.className = "mtx-rating__visually-hidden", c.textContent = this._labelFor(n), l.setAttribute("for", o.id), l.appendChild(c), s.appendChild(o);
        }
        s.appendChild(l);
      }
      t.appendChild(s);
    }
    if (!this.readOnly) {
      const i = this._createInput("");
      i.classList.add("mtx-rating__input--empty");
      const s = document.createElement("label");
      s.className = "mtx-rating__visually-hidden", s.setAttribute("for", i.id), s.textContent = y("rating", "empty", null, "Empty", this._locale), t.appendChild(i), t.appendChild(s);
    }
  }
  /**
   * @private
   * @param {string} value Valor del radio.
   * @returns {HTMLInputElement} Radio oculto.
   */
  _createInput(t) {
    const e = document.createElement("input");
    return e.type = "radio", e.className = "mtx-rating__input", e.name = this.name, e.value = t, e.id = `${this.name}-${t === "" ? "empty" : String(t).replace(".", "_")}`, e;
  }
  /**
   * Vincula nodos existentes (estructura generada o BEM manual) y completa los iconos que falten.
   * @private
   */
  _bind() {
    if (this.items = Array.from(this.element.querySelectorAll(".mtx-rating__item")), this.visuals = Array.from(this.element.querySelectorAll(".mtx-rating__label[data-rating-value]")), this.visuals.forEach((t) => {
      t.querySelector(".mtx-rating__icon--filled") || t.insertBefore(Wt(this.icon, "mtx-rating__icon mtx-rating__icon--filled"), t.firstChild), t.querySelector(".mtx-rating__icon--empty") || t.insertBefore(
        Wt(this.emptyIcon, "mtx-rating__icon mtx-rating__icon--empty"),
        t.querySelector(".mtx-rating__icon--filled").nextSibling
      );
    }), this.inputs = Array.from(this.element.querySelectorAll("input.mtx-rating__input")), this.inputs.length) {
      this.name = this.inputs[0].name || this.name;
      const t = this.inputs.find((e) => e.checked);
      t && !this.element.hasAttribute("data-value") && (this._value = this._round(parseFloat(t.value)));
    }
  }
  /**
   * Registra la interacción: cambio, vista previa al pasar el cursor y borrado al repetir clic.
   * @private
   */
  _listen() {
    this._pointerClick = !1, this._pointerTimer = null, this.onDestroy(() => clearTimeout(this._pointerTimer)), this._handleChange = (e) => {
      e.target.matches("input.mtx-rating__input") && this._commit(this._round(parseFloat(e.target.value)));
    }, this._handlePointerDown = () => {
      this._pointerClick = !0, clearTimeout(this._pointerTimer), this._pointerTimer = setTimeout(() => {
        this._pointerTimer = null, this._pointerClick = !1;
      }, 600);
    }, this._handleClick = (e) => {
      const i = e.target;
      !i.matches || !i.matches("input.mtx-rating__input") || !this._pointerClick || i.value !== "" && this._round(parseFloat(i.value)) === this._value && (this._pointerClick = !1, this._commit(null));
    }, this._handlePointerMove = (e) => {
      this.disabled || e.pointerType === "touch" || this._setHover(this._valueFromPointer(e.clientX));
    }, this._handlePointerLeave = () => this._setHover(null), this._handleFocusOut = () => this._setHover(null);
    const t = this.element;
    t.addEventListener("change", this._handleChange), t.addEventListener("pointerdown", this._handlePointerDown), t.addEventListener("click", this._handleClick), t.addEventListener("pointermove", this._handlePointerMove), t.addEventListener("pointerleave", this._handlePointerLeave), t.addEventListener("focusout", this._handleFocusOut);
  }
  /**
   * Calcula el valor bajo el puntero según la posición horizontal (respeta RTL).
   * @private
   * @param {number} clientX Coordenada X del puntero.
   * @returns {number|null} Valor resaltado.
   */
  _valueFromPointer(t) {
    const e = getComputedStyle(this.element).direction === "rtl";
    for (let i = 0; i < this.items.length; i += 1) {
      const s = this.items[i].getBoundingClientRect();
      if (s.width !== 0 && t >= s.left && t <= s.right) {
        let a = (t - s.left) / s.width;
        e && (a = 1 - a);
        const n = Math.round(1 / this.precision), l = Math.min(n, Math.max(1, Math.ceil(a * n)));
        return Number((i + l / n).toFixed(4));
      }
    }
    return null;
  }
  /**
   * @private
   * @param {number|null} value Valor resaltado o `null`.
   */
  _setHover(t) {
    t !== this._hover && (this._hover = t, this.element.classList.toggle("mtx-rating--hovering", t !== null), this._render(), v(this.element, "mtx:rating:active", { value: t }));
  }
  /**
   * Aplica un valor elegido por el usuario y emite `mtx:rating:change`.
   * @private
   * @param {number|null} value Nuevo valor.
   */
  _commit(t) {
    t !== this._value && (this.value = t, v(this.element, "mtx:rating:change", { value: this._value }));
  }
  /**
   * Pinta el estado de cada icono y sincroniza radios y etiquetas accesibles.
   * @private
   */
  _render() {
    const t = this._hover !== null ? this._hover : this._value;
    this.visuals.forEach((e) => {
      const i = parseFloat(e.getAttribute("data-rating-value")), s = t !== null && (this.highlightSelectedOnly ? i === t : i <= t);
      e.classList.toggle("mtx-rating__label--filled", s), e.classList.toggle("mtx-rating__label--hover", this._hover !== null && i === this._hover);
    }), this.items.forEach((e) => {
      const i = Array.from(e.querySelectorAll("[data-rating-value]")).map((s) => parseFloat(s.getAttribute("data-rating-value")));
      e.classList.toggle("mtx-rating__item--active", this._hover !== null && i.includes(this._hover));
    }), this.inputs.forEach((e) => {
      e.checked = e.value === "" ? this._value === null : this._round(parseFloat(e.value)) === this._value;
    }), this.readOnly && this.element.setAttribute("aria-label", y(
      "rating",
      "readOnly",
      { value: this._format(this._value || 0), max: this._format(this.max) },
      `Rated ${this._value || 0} out of ${this.max}`,
      this._locale
    ));
  }
  /** @returns {number|null} Valor actual (`null` sin valoración). */
  get value() {
    return this._value;
  }
  /**
   * Fija el valor sin emitir eventos (se redondea a la precisión; 0 o `null` lo vacía).
   * @param {number|null} val Nuevo valor.
   */
  set value(t) {
    this._value = this._round(t == null ? NaN : Number(t)), this._render();
  }
  /** @returns {boolean} `true` si está deshabilitado. */
  get disabled() {
    return this.element.classList.contains("mtx-rating--disabled");
  }
  /** Deshabilita la valoración. */
  disable() {
    this.element.classList.add("mtx-rating--disabled"), this.element.setAttribute("aria-disabled", "true"), this.inputs.forEach((t) => {
      t.disabled = !0;
    }), this._setHover(null);
  }
  /** Habilita la valoración. */
  enable() {
    this.element.classList.remove("mtx-rating--disabled"), this.element.removeAttribute("aria-disabled"), this.inputs.forEach((t) => {
      t.disabled = !1;
    });
  }
  /** Enfoca el radio seleccionado (o el primero). */
  focus() {
    const t = this.inputs.find((e) => e.checked && e.value !== "") || this.inputs[0];
    t && t.focus();
  }
  /** Destruye la instancia y retira los listeners. */
  destroy() {
    if (this.readOnly) {
      super.destroy();
      return;
    }
    const t = this.element;
    t.removeEventListener("change", this._handleChange), t.removeEventListener("pointerdown", this._handlePointerDown), t.removeEventListener("click", this._handleClick), t.removeEventListener("pointermove", this._handlePointerMove), t.removeEventListener("pointerleave", this._handlePointerLeave), t.removeEventListener("focusout", this._handleFocusOut), super.destroy();
  }
}
f("rating", ba);
const Dn = ["primary", "secondary", "error", "warning", "info", "success"], Mn = ["auto", "on", "off"], Nn = ["normal", "inverted", "false"], It = (r) => r !== null && r !== "false";
function Hi(r) {
  if (Math.abs(r) < 1) {
    const e = r.toExponential().split("e-"), i = e[0].split(".")[1];
    return (i ? i.length : 0) + parseInt(e[1] || "0", 10);
  }
  const t = String(r).split(".")[1];
  return t ? t.length : 0;
}
function ot(r) {
  const t = document.createElement("span");
  return t.className = r, t;
}
class ga extends g {
  /**
   * @param {HTMLElement} source `<input type="range">` suelto o contenedor `.mtx-slider` con estructura BEM.
   */
  constructor(t) {
    const e = t.matches('input[type="range"]');
    let i = t, s = !1;
    if (e && (i = t.closest(".mtx-slider"), !i)) {
      i = ot("mtx-slider");
      const A = t.getAttribute("class");
      A && (i.className += " " + A), t.parentNode && t.parentNode.insertBefore(i, t), s = !0;
    }
    super(i), i.classList.add("mtx-slider"), this.source = t, this._generated = s, this._locale = k(i), this._dragging = -1, this._activeIndex = -1, this._cfg = (A) => i.hasAttribute(A) ? i.getAttribute(A) : t !== i && t.hasAttribute(A) ? t.getAttribute(A) : null;
    const a = this._cfg, n = e ? t : i.querySelector('input[type="range"]'), l = (A, p, b) => {
      const C = n ? parseFloat(n.getAttribute(A)) : NaN;
      if (Number.isFinite(C)) return C;
      const S = parseFloat(a(p));
      return Number.isFinite(S) ? S : b;
    };
    this._min = l("min", "data-min", 0), this._max = l("max", "data-max", 100), this._max < this._min && (this._max = this._min);
    const o = l("step", "data-step", 1);
    this._step = o > 0 ? o : 1;
    const c = e ? [t] : Array.from(i.querySelectorAll('input[type="range"]'));
    this.range = It(a("data-range")) || c.length > 1, this.disableSwap = It(a("data-disable-swap")), this.minDistance = Math.max(0, parseFloat(a("data-min-distance")) || 0);
    const d = a("data-value-label-display");
    this.valueLabelDisplay = Mn.includes(d) ? d : "off", this.valueLabelFormat = a("data-value-label-format");
    const h = a("data-track");
    this.track = Nn.includes(h) ? h : "normal", this.orientation = a("data-orientation") === "vertical" ? "vertical" : "horizontal", this.marksOnly = It(a("data-marks-only")), this.marksInset = It(a("data-marks-inset")), a("data-size") === "small" && i.classList.add("mtx-slider--small");
    const m = a("data-color");
    Dn.includes(m) && m !== "primary" && i.classList.add(`mtx-slider--${m}`), i.classList.toggle("mtx-slider--vertical", this.orientation === "vertical"), i.classList.toggle("mtx-slider--track-inverted", this.track === "inverted"), i.classList.toggle("mtx-slider--track-false", this.track === "false"), i.classList.toggle("mtx-slider--marks-inset", this.marksInset), i.classList.add(`mtx-slider--label-${this.valueLabelDisplay}`), this._build(c), this._marksSpec = a("data-marks"), this._buildMarks();
    const _ = a("data-value");
    let x;
    if (_ !== null && _.trim() !== "" ? x = _.split(",").map((A) => parseFloat(A)) : x = this.inputs.map((A) => parseFloat(A.getAttribute("value"))), this.range) {
      const A = Number.isFinite(x[0]) ? x[0] : this._min, p = Number.isFinite(x[1]) ? x[1] : this._max;
      this._values = [A, p];
    } else {
      const A = Number.isFinite(x[0]) ? x[0] : (this._min + this._max) / 2;
      this._values = [A];
    }
    this._values = this._normalize(this._values), this._applyLabels(), (It(a("data-disabled")) || this.inputs.some((A) => A.disabled)) && this.disable(), this._render(), this._listen();
  }
  /**
   * Genera rail, track, thumbs, inputs y value labels que falten.
   * @private
   * @param {HTMLInputElement[]} existingInputs Inputs ya presentes.
   */
  _build(t) {
    const e = this.element;
    this.rail = e.querySelector(".mtx-slider__rail"), this.rail || (this.rail = ot("mtx-slider__rail"), e.insertBefore(this.rail, e.firstChild)), this.trackEl = e.querySelector(".mtx-slider__track"), this.trackEl || (this.trackEl = ot("mtx-slider__track"), this.rail.insertAdjacentElement("afterend", this.trackEl));
    const i = t.slice(0, this.range ? 2 : 1);
    if (this.range && i.length < 2) {
      const a = document.createElement("input");
      a.type = "range", a.setAttribute("data-mtx-generated", ""), i.push(a);
    }
    const s = i[0].getAttribute("name");
    this.range && s && i[1].hasAttribute("data-mtx-generated") && (this._originalName = s, i[0].name = `${s}-start`, i[1].name = `${s}-end`), this.thumbs = [], this.valueLabels = [], i.forEach((a, n) => {
      let l = a.closest(".mtx-slider__thumb");
      (!l || !e.contains(l)) && (l = ot("mtx-slider__thumb"), l.setAttribute("data-mtx-generated", ""), e.appendChild(l), l.appendChild(a)), l.setAttribute("data-index", String(n)), a.classList.add("mtx-slider__input"), a.setAttribute("data-index", String(n)), a.min = String(this._min), a.max = String(this._max), a.step = String(this._step), this.orientation === "vertical" && a.setAttribute("aria-orientation", "vertical");
      let o = l.querySelector(".mtx-slider__value-label");
      o || (o = ot("mtx-slider__value-label"), o.setAttribute("aria-hidden", "true"), o.appendChild(ot("mtx-slider__value-label-text")), l.appendChild(o)), this.thumbs.push(l), this.valueLabels.push(o.querySelector(".mtx-slider__value-label-text") || o);
    }), this.inputs = i;
  }
  /**
   * Interpreta `data-marks`: "true" (cada step), lista "0:0°C,20:20°C" o JSON `[{value,label}]`.
   * @private
   * @returns {{value: number, label: string|null}[]} Marcas.
   */
  _parseMarks() {
    const t = this._marksSpec;
    if (t === null || t === "false") return [];
    if (t === "" || t === "true") {
      const e = Math.floor((this._max - this._min) / this._step);
      if (e > 500) return [];
      const i = [];
      for (let s = 0; s <= e; s += 1) i.push({ value: this._roundStep(this._min + s * this._step), label: null });
      return i;
    }
    if (t.trim().startsWith("["))
      try {
        return JSON.parse(t).filter((e) => e && Number.isFinite(Number(e.value))).map((e) => ({ value: Number(e.value), label: e.label != null ? String(e.label) : null }));
      } catch {
        return [];
      }
    return t.split(",").map((e) => {
      const [i, ...s] = e.split(":"), a = parseFloat(i), n = s.length ? s.join(":").trim() : null;
      return { value: a, label: n || null };
    }).filter((e) => Number.isFinite(e.value));
  }
  /**
   * (Re)genera las marcas y sus etiquetas.
   * @private
   */
  _buildMarks() {
    const t = this.element;
    t.querySelectorAll(".mtx-slider__mark, .mtx-slider__mark-label").forEach((i) => i.remove()), this.marks = this._parseMarks().filter((i) => i.value >= this._min && i.value <= this._max), this.markNodes = [];
    const e = this.thumbs[0];
    this.marks.forEach((i) => {
      const s = ot("mtx-slider__mark");
      s.setAttribute("data-value", String(i.value)), s.setAttribute("aria-hidden", "true"), t.insertBefore(s, e);
      let a = null;
      i.label && (a = ot("mtx-slider__mark-label"), a.setAttribute("aria-hidden", "true"), a.textContent = i.label, t.insertBefore(a, e));
      const n = this._percent(i.value);
      this._place(s, n), a && (this._place(a, n), n <= 0 ? a.classList.add("mtx-slider__mark-label--start") : n >= 100 && a.classList.add("mtx-slider__mark-label--end")), this.markNodes.push({ mark: i, dot: s, text: a });
    }), t.classList.toggle("mtx-slider--marked", this.marks.some((i) => i.label));
  }
  /**
   * Aplica nombres accesibles (data-label / aria-*) y, en rango, "Mínimo"/"Máximo" por thumb.
   * @private
   */
  _applyLabels() {
    const t = this._cfg("data-label"), e = this._cfg("aria-labelledby");
    if (!this.range) {
      const s = this.inputs[0];
      e && !s.hasAttribute("aria-labelledby") && !s.hasAttribute("aria-label") && s.setAttribute("aria-labelledby", e), t && !s.hasAttribute("aria-label") && !s.hasAttribute("aria-labelledby") && s.setAttribute("aria-label", t);
      return;
    }
    let i = t || (this._generated ? this.source.getAttribute("aria-label") : null);
    if (!i && e) {
      const s = document.getElementById(e);
      i = s ? s.textContent.trim() : null;
    }
    this.inputs.forEach((s, a) => {
      if (!this._generated && s.hasAttribute("aria-label") && !s.hasAttribute("data-mtx-thumb-label")) return;
      const n = y("slider", a === 0 ? "minimum" : "maximum", null, a === 0 ? "Minimum" : "Maximum", this._locale), l = i ? y("slider", "thumbLabel", { label: i, thumb: n }, `${i}: ${n}`, this._locale) : n;
      s.setAttribute("aria-label", l), s.setAttribute("data-mtx-thumb-label", ""), s.removeAttribute("aria-labelledby");
    });
  }
  /**
   * Registra los listeners (todos con `this.listen` para liberarlos en `destroy()`).
   * @private
   */
  _listen() {
    const t = this.element;
    this.listen(t, "pointerdown", (e) => this._onPointerDown(e)), this.inputs.forEach((e, i) => {
      this.listen(e, "keydown", (s) => this._onKeyDown(s, i)), this.listen(e, "input", () => {
        if (this._syncing) return;
        const s = parseFloat(e.value);
        Number.isFinite(s) && this._setFromUser(i, s, !0);
      }), this.listen(e, "focus", () => {
        this._activeIndex = i, this._renderActive();
      }), this.listen(e, "blur", () => {
        this._dragging < 0 && (this._activeIndex = -1, this._renderActive());
      });
    });
  }
  /**
   * Inicia el arrastre: elige el thumb más cercano, fija el valor y sigue el puntero.
   * @private
   * @param {PointerEvent} event Evento.
   */
  _onPointerDown(t) {
    if (this.disabled || t.button !== void 0 && t.button !== 0 || t.target && t.target.closest && t.target.closest(".mtx-slider__value-label")) return;
    t.preventDefault();
    const e = this._valueFromPointer(t);
    if (e === null) return;
    const i = this._closestThumb(e);
    this._dragging = i, this._activeIndex = i, this._startValue = this.value, this.element.classList.add("mtx-slider--dragging");
    const s = this.inputs[i];
    try {
      s.focus({ preventScroll: !0 });
    } catch {
      s.focus();
    }
    this._setFromUser(i, e, !1);
    const a = (d) => {
      if (this._dragging < 0) return;
      const h = this._valueFromPointer(d);
      h !== null && this._setFromUser(this._dragging, h, !1);
    }, n = () => {
      l(), o(), c(), this._dragging = -1, this.element.classList.remove("mtx-slider--dragging"), this._renderActive(), this._sameValue(this._startValue, this.value) || this._commit();
    }, l = this.listen(document, "pointermove", a), o = this.listen(document, "pointerup", n), c = this.listen(document, "pointercancel", n);
    this._renderActive();
  }
  /**
   * Teclado (como MUI): flechas ±step, PageUp/PageDown ±10 %, Home/End extremos; respeta RTL.
   * @private
   * @param {KeyboardEvent} event Evento.
   * @param {number} index Índice del thumb.
   */
  _onKeyDown(t, e) {
    if (this.disabled) return;
    const i = this._values[e], s = this._isRtl() && this.orientation === "horizontal", a = Math.max(this._step, this._roundStep(this._min + (this._max - this._min) / 10) - this._min);
    let n = null;
    switch (t.key) {
      case "ArrowUp":
        n = this._stepFrom(i, 1, this._step);
        break;
      case "ArrowDown":
        n = this._stepFrom(i, -1, this._step);
        break;
      case "ArrowRight":
        n = this._stepFrom(i, s ? -1 : 1, this._step);
        break;
      case "ArrowLeft":
        n = this._stepFrom(i, s ? 1 : -1, this._step);
        break;
      case "PageUp":
        n = this._stepFrom(i, 1, a);
        break;
      case "PageDown":
        n = this._stepFrom(i, -1, a);
        break;
      case "Home":
        n = this._min;
        break;
      case "End":
        n = this._max;
        break;
      default:
        return;
    }
    t.preventDefault();
    const l = this.value;
    this._setFromUser(e, n, !1, !0), this._sameValue(l, this.value) || this._commit();
  }
  /**
   * Siguiente valor en una dirección: por marcas (data-marks-only) o por incremento.
   * @private
   * @param {number} current Valor actual.
   * @param {number} dir 1 o -1.
   * @param {number} amount Incremento.
   * @returns {number} Valor siguiente.
   */
  _stepFrom(t, e, i) {
    if (this.marksOnly && this.marks.length) {
      const s = this.marks.map((n) => n.value).sort((n, l) => n - l), a = e > 0 ? s.find((n) => n > t) : s.reverse().find((n) => n < t);
      return a !== void 0 ? a : t;
    }
    return t + e * i;
  }
  /**
   * Aplica un valor elegido por el usuario a un thumb (swap / disableSwap / minDistance) y emite `mtx:slider:input`.
   * @private
   * @param {number} index Thumb movido.
   * @param {number} raw Valor bruto.
   * @param {boolean} fromNative Viene del evento `input` nativo.
   * @param {boolean} [fromKeyboard=false] Viene del teclado (sin swap).
   */
  _setFromUser(t, e, i, s = !1) {
    let a = this._snap(e);
    const n = this._values.slice();
    let l = t;
    if (this.range) {
      const c = 1 - t, d = this.minDistance;
      this.disableSwap || d > 0 || s || i ? (a = t === 0 ? Math.min(a, n[1] - d) : Math.max(a, n[0] + d), a = Math.min(this._max, Math.max(this._min, a)), n[t] = a) : (n[t] = a, (t === 0 && a > n[c] || t === 1 && a < n[c]) && (n.sort((h, u) => h - u), l = n.indexOf(a) === 0 ? 0 : 1, n[0] === n[1] && (l = c)));
    } else
      n[0] = a;
    const o = !this._sameValue(n, this._values);
    if (this._values = n, l !== t) {
      this._dragging = this._dragging >= 0 ? l : this._dragging, this._activeIndex = l;
      const c = this.inputs[l];
      try {
        c.focus({ preventScroll: !0 });
      } catch {
        c.focus();
      }
    }
    this._render(), (o || i) && (i || this._dispatchNative("input"), v(this.element, "mtx:slider:input", { value: this.value, activeThumb: this._activeIndex }));
  }
  /**
   * Emite `mtx:slider:change` (al soltar o tras el teclado) y `change` nativo.
   * @private
   */
  _commit() {
    this._dispatchNative("change"), v(this.element, "mtx:slider:change", { value: this.value });
  }
  /**
   * Notifica a formularios/frameworks con eventos nativos del input activo sin re-entrar.
   * @private
   * @param {string} type `input` o `change`.
   */
  _dispatchNative(t) {
    const e = this.inputs[Math.max(0, this._activeIndex)];
    if (e) {
      this._syncing = !0;
      try {
        e.dispatchEvent(new Event(t, { bubbles: !0 }));
      } finally {
        this._syncing = !1;
      }
    }
  }
  /**
   * Valor bajo el puntero (horizontal, vertical y RTL).
   * @private
   * @param {PointerEvent} event Evento.
   * @returns {number|null} Valor o `null` si el rail no tiene tamaño.
   */
  _valueFromPointer(t) {
    const e = this.rail.getBoundingClientRect();
    let i;
    if (this.orientation === "vertical") {
      if (!e.height) return null;
      i = (e.bottom - t.clientY) / e.height;
    } else {
      if (!e.width) return null;
      i = (t.clientX - e.left) / e.width, this._isRtl() && (i = 1 - i);
    }
    return i = Math.min(1, Math.max(0, i)), this._min + i * (this._max - this._min);
  }
  /**
   * Thumb más cercano a un valor (si coinciden, el que permite moverse hacia el puntero).
   * @private
   * @param {number} value Valor.
   * @returns {number} Índice.
   */
  _closestThumb(t) {
    if (!this.range) return 0;
    const [e, i] = this._values;
    return e === i ? t < e ? 0 : 1 : Math.abs(t - e) <= Math.abs(t - i) ? 0 : 1;
  }
  /**
   * Redondea al step (o a la marca más cercana con data-marks-only) y acota a [min, max].
   * @private
   * @param {number} value Valor bruto.
   * @returns {number} Valor válido.
   */
  _snap(t) {
    let e = Math.min(this._max, Math.max(this._min, Number(t)));
    return Number.isFinite(e) || (e = this._min), this.marksOnly && this.marks.length ? this.marks.reduce((i, s) => Math.abs(s.value - e) < Math.abs(i - e) ? s.value : i, this.marks[0].value) : Math.min(this._max, this._roundStep(e));
  }
  /**
   * Redondea al múltiplo de step más cercano desde min.
   * @private
   * @param {number} value Valor.
   * @returns {number} Valor redondeado.
   */
  _roundStep(t) {
    const e = Math.round((t - this._min) / this._step) * this._step + this._min;
    return Number(e.toFixed(Hi(this._step)));
  }
  /**
   * Normaliza un array de valores (step, límites, orden).
   * @private
   * @param {number[]} values Valores.
   * @returns {number[]} Valores válidos.
   */
  _normalize(t) {
    const e = t.map((i) => this._snap(i));
    return this.range && e.sort((i, s) => i - s), e;
  }
  /** @private */
  _percent(t) {
    const e = this._max - this._min;
    return e ? (t - this._min) * 100 / e : 0;
  }
  /**
   * Coloca un nodo a un porcentaje del eje (inline-start en horizontal, bottom en vertical).
   * @private
   */
  _place(t, e) {
    this.orientation === "vertical" ? (t.style.bottom = `${e}%`, t.style.insetInlineStart = "") : (t.style.insetInlineStart = `${e}%`, t.style.bottom = "");
  }
  /** @private */
  _isRtl() {
    try {
      return getComputedStyle(this.element).direction === "rtl";
    } catch {
      return !1;
    }
  }
  /** @private */
  _sameValue(t, e) {
    const i = [].concat(t), s = [].concat(e);
    return i.length === s.length && i.every((a, n) => a === s[n]);
  }
  /**
   * Texto del valor según `data-value-label-format` (`{value}`) y el locale.
   * @param {number} value Valor.
   * @returns {string} Texto formateado.
   */
  formatValue(t) {
    let e;
    try {
      e = new Intl.NumberFormat(this._locale, { maximumFractionDigits: Math.max(Hi(this._step), 0) }).format(t);
    } catch {
      e = String(t);
    }
    return this.valueLabelFormat ? this.valueLabelFormat.split("{value}").join(e) : e;
  }
  /**
   * Pinta track, thumbs, marcas, value labels y sincroniza los inputs nativos y ARIA.
   * @private
   */
  _render() {
    const t = this._values.map((o) => this._percent(o)), e = this.range ? t[0] : 0, i = this.range ? t[1] : t[0], s = this.track === "inverted" && !this.range ? i : e, a = this.track === "inverted" && !this.range ? 100 - i : i - e;
    this.orientation === "vertical" ? (this.trackEl.style.bottom = `${s}%`, this.trackEl.style.height = `${a}%`, this.trackEl.style.insetInlineStart = "", this.trackEl.style.width = "") : (this.trackEl.style.insetInlineStart = `${s}%`, this.trackEl.style.width = `${a}%`, this.trackEl.style.bottom = "", this.trackEl.style.height = ""), this.thumbs.forEach((o, c) => {
      this._place(o, t[c]);
      const d = this.inputs[c], h = this._values[c];
      this._syncing = !0, d.value = String(h), this._syncing = !1, d.setAttribute("value", String(h));
      const u = this.formatValue(h);
      this.valueLabelFormat ? d.setAttribute("aria-valuetext", u) : d.removeAttribute("aria-valuetext"), this.valueLabels[c] && (this.valueLabels[c].textContent = u);
    });
    const n = this.range ? this._values[0] : this._min, l = this.range ? this._values[1] : this._values[0];
    this.markNodes.forEach(({ mark: o, dot: c, text: d }) => {
      let h;
      this.track === "false" ? h = !1 : this.track === "inverted" ? h = this.range && o.value <= n || o.value >= l : h = o.value >= n && o.value <= l, c.classList.toggle("mtx-slider__mark--active", h), d && d.classList.toggle("mtx-slider__mark-label--active", o.value >= n && o.value <= l);
    }), this._renderActive();
  }
  /**
   * Marca el thumb activo (arrastre o foco) para el halo y el value label `auto`.
   * @private
   */
  _renderActive() {
    this.thumbs.forEach((t, e) => {
      t.classList.toggle("mtx-slider__thumb--active", this._dragging === e), t.classList.toggle("mtx-slider__thumb--focused", this._activeIndex === e);
    });
  }
  /** @returns {number|number[]} Valor actual (`[inicio, fin]` en rango). */
  get value() {
    return this.range ? this._values.slice() : this._values[0];
  }
  /**
   * Fija el valor sin emitir eventos (se redondea al step y se acota).
   * @param {number|number[]|string} val Número, `[a, b]` o "a,b".
   */
  set value(t) {
    let e = Array.isArray(t) ? t : String(t).split(",");
    e = e.map(Number), this.range ? (e.length < 2 && (e = [e[0], this._values[1]]), this._values = this._normalize(e.slice(0, 2))) : this._values = this._normalize([e[0]]), this._render();
  }
  /** @returns {number} Mínimo. */
  get min() {
    return this._min;
  }
  /** @param {number} v Nuevo mínimo (re-acota el valor y regenera marcas). */
  set min(t) {
    this._setBounds({ min: Number(t) });
  }
  /** @returns {number} Máximo. */
  get max() {
    return this._max;
  }
  /** @param {number} v Nuevo máximo. */
  set max(t) {
    this._setBounds({ max: Number(t) });
  }
  /** @returns {number} Incremento. */
  get step() {
    return this._step;
  }
  /** @param {number} v Nuevo incremento (> 0). */
  set step(t) {
    this._setBounds({ step: Number(t) });
  }
  /**
   * Actualiza min/max/step, inputs, marcas y valor.
   * @private
   */
  _setBounds({ min: t = this._min, max: e = this._max, step: i = this._step }) {
    Number.isFinite(t) && (this._min = t), Number.isFinite(e) && (this._max = Math.max(this._min, e)), Number.isFinite(i) && i > 0 && (this._step = i), this.inputs.forEach((s) => {
      s.min = String(this._min), s.max = String(this._max), s.step = String(this._step);
    }), this._buildMarks(), this._values = this._normalize(this._values), this._render();
  }
  /** @returns {boolean} `true` si está deshabilitado. */
  get disabled() {
    return this.element.classList.contains("mtx-slider--disabled");
  }
  /** Deshabilita el slider. */
  disable() {
    this.element.classList.add("mtx-slider--disabled"), this.element.setAttribute("aria-disabled", "true"), this.inputs.forEach((t) => {
      t.disabled = !0;
    });
  }
  /** Habilita el slider. */
  enable() {
    this.element.classList.remove("mtx-slider--disabled"), this.element.removeAttribute("aria-disabled"), this.inputs.forEach((t) => {
      t.disabled = !1;
    });
  }
  /**
   * Enfoca un thumb.
   * @param {number} [index=0] Índice del thumb.
   */
  focus(t = 0) {
    const e = this.inputs[t] || this.inputs[0];
    e && e.focus();
  }
  /**
   * Libera listeners y, si la estructura fue generada desde un `<input>`, restaura el input original.
   */
  destroy() {
    if (super.destroy(), this.source !== this.element && Ft(this.source), !this._generated || !this.element.parentNode) return;
    const t = this.source;
    this._originalName && (t.name = this._originalName), t.classList.remove("mtx-slider__input"), t.removeAttribute("data-index"), this.element.parentNode.insertBefore(t, this.element), this.element.remove(), t.removeAttribute("data-mtx-initialized");
  }
}
f("slider", ga);
class yt extends g {
  /**
   * Crea una instancia del campo de texto.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    const e = t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement, i = e && t.parentElement ? t.parentElement.closest(".mtx-text-field") : null;
    if (i)
      t = i;
    else if (e) {
      const a = document.createElement("div");
      a.className = "mtx-text-field", Array.from(t.attributes).forEach((n) => {
        n.name === "class" ? a.className += " " + n.value : (n.name.startsWith("data-") || n.name === "label") && a.setAttribute(n.name, n.value);
      }), t.parentNode && t.parentNode.insertBefore(a, t), a.appendChild(t), t = a;
    }
    if (super(t), this.input = t.querySelector(".mtx-text-field__input") || t.querySelector("input, textarea, select") || (t.matches("input, textarea, select") ? t : null), !this.input)
      throw new TypeError("TextField requiere un <input>, <textarea> o <select>.");
    this.input.id || (this.input.id = P("mtx-text-field")), this._autoBuildStructure(), this._createdSupport = !1, this._hasCustomError = !1, this._helperText = this.helperEl ? this.helperEl.textContent : this.support ? this.support.textContent : "", this._helperId = this.support ? this.support.id || `${this.input.id}-helper-text` : "", this._baseDescribedBy = (this.input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean), this.support && (this.support.id = this._helperId, this._syncDescribedBy()), this.element.classList.contains("mtx-text-field--outlined") && this._buildOutline();
    const s = ni(this.element.getAttribute("data-error"));
    s.error && this.setError(s.message || !0), this._syncActionsDisabled(), this._handleLocaleChange = () => {
      this._updateCounter(), this._syncPasswordToggle();
    }, this.listen(document, "mtx:locale:change", this._handleLocaleChange), this._initMask(), this._handleInput = (a) => {
      this._mask && this._handleMaskInput(a), this._syncAria(), this._updateCounter(), this._adjustAutoResize();
    }, ["input", "change", "focus", "blur", "keyup"].forEach((a) => this.listen(this.input, a, this._handleInput)), this.listen(this.input, "paste", () => {
      const a = setTimeout(() => {
        this.destroyed || this._handleInput();
      }, 0);
      this.onDestroy(() => clearTimeout(a));
    }), this._syncAria(), this._updateCounter(), this._adjustAutoResize(), this._hasAutoResize && typeof requestAnimationFrame == "function" && requestAnimationFrame(() => {
      this.destroyed || this._adjustAutoResize();
    }), et(this.input, this), this.input.hasAttribute("data-mtx") && this.input.setAttribute("data-mtx-initialized", "");
  }
  /**
   * Construye automáticamente la estructura HTML requerida (label, container, adornments, helper text)
   * cuando el desarrollador utiliza la sintaxis simplificada de un solo elemento.
   * @private
   */
  _autoBuildStructure() {
    const t = this.element;
    t.classList.contains("mtx-text-field") || t.classList.add("mtx-text-field");
    const e = t.getAttribute("data-variant");
    e ? e === "no-label" ? t.classList.add("mtx-text-field--outlined", "mtx-text-field--no-label") : t.classList.add(`mtx-text-field--${e}`) : t.className.match(/mtx-text-field--(outlined|filled|standard|no-label)/) || t.classList.add("mtx-text-field--outlined");
    const i = t.getAttribute("data-size") || this.input.getAttribute("data-size");
    i === "small" || i === "compact" || t.hasAttribute("data-small") || this.input.hasAttribute("data-small") ? t.classList.add("mtx-text-field--small") : i === "large" || t.hasAttribute("data-large") || this.input.hasAttribute("data-large") ? t.classList.add("mtx-text-field--large") : i === "medium" && t.classList.add("mtx-text-field--medium");
    const s = t.getAttribute("data-color");
    s && t.classList.add(`mtx-text-field--${s}`), this.input && !this.input.classList.contains("mtx-text-field__input") && this.input.classList.add("mtx-text-field__input");
    let a = t.querySelector(".mtx-text-field__container");
    a || (a = document.createElement("div"), a.className = "mtx-text-field__container", this.input.parentNode.insertBefore(a, this.input), a.appendChild(this.input)), this.container = a;
    const n = t.getAttribute("data-start-icon") || this.input.getAttribute("data-start-icon");
    if (n && !a.querySelector(".mtx-text-field__adornment--start")) {
      const w = this._createIconOrImage(n, "mtx-text-field__adornment mtx-text-field__adornment--start");
      w && a.insertBefore(w, a.firstChild);
    }
    const l = (w) => t.hasAttribute(w) ? t.getAttribute(w) : this.input.getAttribute(w), o = a.querySelector(".mtx-text-field__action--start");
    o && (this.startAction = o, this._bindActionButton(o, "start"));
    const c = l("data-start-action");
    c && !a.querySelector(".mtx-text-field__adornment--start") && (this.startAction = this._createActionAdornment("start", c, l("data-start-action-label")), t.classList.add("mtx-text-field--adorned-start"));
    const d = l("data-password-toggle"), h = d !== null && d !== "false" && (this.input.getAttribute("type") || "").toLowerCase() === "password", u = l("data-end-action"), m = a.querySelector(".mtx-text-field__action--end");
    m && (h ? this.passwordToggle = m : this.endAction = m, this._bindActionButton(m, "end")), a.querySelector(".mtx-text-field__adornment--end") || (h ? (this.passwordToggle = this._createActionAdornment("end", "visibility", ""), this.passwordToggle.setAttribute("aria-controls", this.input.id), this._syncPasswordToggle()) : u && (this.endAction = this._createActionAdornment("end", u, l("data-end-action-label"))));
    const _ = t.getAttribute("data-end-icon") || this.input.getAttribute("data-end-icon");
    if (_ && !a.querySelector(".mtx-text-field__adornment--end")) {
      const w = this._createIconOrImage(_, "mtx-text-field__adornment mtx-text-field__adornment--end");
      w && a.appendChild(w);
    }
    a.querySelector(".mtx-text-field__adornment--start") && t.classList.add("mtx-text-field--adorned-start"), a.querySelector(".mtx-text-field__adornment--end") && t.classList.add("mtx-text-field--adorned-end");
    let x = t.getAttribute("data-label") || t.getAttribute("label") || this.input.getAttribute("data-label") || this.input.getAttribute("label");
    const A = t.classList.contains("mtx-text-field--no-label") || t.getAttribute("data-variant") === "no-label" || this.input.getAttribute("data-variant") === "no-label";
    if (!x && !A && this.input.hasAttribute("placeholder")) {
      const w = this.input.getAttribute("placeholder").trim();
      w && (x = w, this.input.setAttribute("placeholder", " "));
    }
    let p = t.querySelector(".mtx-text-field__label");
    x && !p && (p = document.createElement("label"), p.className = "mtx-text-field__label", p.setAttribute("for", this.input.id), p.textContent = x, t.insertBefore(p, a)), this.label = p, this.input && !this.input.hasAttribute("placeholder") && this.input.setAttribute("placeholder", " ");
    const b = this.input instanceof HTMLTextAreaElement;
    if (b || t.hasAttribute("data-multiline") || this.input.hasAttribute("data-multiline")) {
      if (t.classList.add("mtx-text-field--multiline"), !b && (t.hasAttribute("data-multiline") || this.input.hasAttribute("data-multiline"))) {
        const st = document.createElement("textarea");
        Array.from(this.input.attributes).forEach((M) => {
          st.setAttribute(M.name, M.value);
        }), st.value = this.input.value, this.input.parentNode && this.input.parentNode.replaceChild(st, this.input), this.input = st;
      }
      if (!this.input.hasAttribute("rows")) {
        const st = t.getAttribute("data-rows") || t.getAttribute("rows") || this.input.getAttribute("data-rows") || this.input.getAttribute("rows") || "3";
        this.input.setAttribute("rows", st);
      }
      const w = t.getAttribute("data-auto-resize") ?? t.getAttribute("data-autoresize") ?? t.getAttribute("data-autosize") ?? this.input.getAttribute("data-auto-resize") ?? this.input.getAttribute("data-autoresize") ?? this.input.getAttribute("data-autosize"), Y = w !== null && w !== "false";
      this._hasAutoResize = Y, this._hasAutoResize && t.classList.add("mtx-text-field--auto-resize");
    }
    const S = t.getAttribute("data-helper-text") || this.input.getAttribute("data-helper-text"), F = (t.getAttribute("data-counter") || this.input.getAttribute("data-counter") || "").toLowerCase(), R = t.getAttribute("data-max-characters") || t.getAttribute("data-max-chars") || this.input.getAttribute("data-max-characters") || this.input.getAttribute("data-max-chars") || (this.input.hasAttribute("maxlength") ? this.input.getAttribute("maxlength") : null), $ = t.getAttribute("data-max-words") || this.input.getAttribute("data-max-words");
    this._maxChars = R ? parseInt(R, 10) : null, this._maxWords = $ ? parseInt($, 10) : null, F === "words" || !F && this._maxWords && !this._maxChars ? this._counterType = "words" : F === "both" || this._maxWords && this._maxChars ? this._counterType = "both" : F || this._maxChars ? this._counterType = "characters" : this._counterType = null;
    const D = !!this._counterType;
    let T = t.querySelector(".mtx-text-field__supporting-text");
    if ((S || D) && !T && (T = document.createElement("div"), T.className = "mtx-text-field__supporting-text", t.appendChild(T)), this.support = T, this.support) {
      let w = this.support.querySelector(".mtx-text-field__helper-text");
      if (!w) {
        w = document.createElement("span"), w.className = "mtx-text-field__helper-text";
        const Y = S || (this.support.childNodes.length === 1 && this.support.firstChild.nodeType === Node.TEXT_NODE ? this.support.textContent.trim() : "");
        Y && (w.textContent = Y), this.support.textContent = "", this.support.appendChild(w);
      }
      if (this.helperEl = w, D) {
        let Y = this.support.querySelector(".mtx-text-field__counter");
        Y || (Y = document.createElement("span"), Y.className = "mtx-text-field__counter", Y.setAttribute("aria-live", "polite"), this.support.appendChild(Y)), this.counterEl = Y;
      }
    }
    if (this.input instanceof HTMLSelectElement && (t.classList.add("mtx-text-field--select"), !a.querySelector(".mtx-text-field__chevron"))) {
      const w = document.createElement("span");
      w.className = "mtx-text-field__chevron", w.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>', a.appendChild(w);
    }
  }
  /**
   * Crea el `fieldset` que dibuja la muesca del borde y sincroniza su
   * contenido con el texto del label.
   */
  _buildOutline() {
    if (this.container.querySelector(".mtx-text-field__outline")) return;
    const t = document.createElement("fieldset");
    if (t.className = "mtx-text-field__outline", t.setAttribute("aria-hidden", "true"), this.label && !this.element.classList.contains("mtx-text-field--hidden-label")) {
      const i = document.createElement("legend");
      i.className = "mtx-text-field__legend";
      const s = document.createElement("span");
      s.textContent = this.label.textContent, i.appendChild(s), t.appendChild(i);
    }
    this.container.appendChild(t);
  }
  /**
   * Valor actual del campo.
   *
   * @returns {string} Valor del input.
   */
  get value() {
    return this.input.value;
  }
  /**
   * Establece el valor del campo.
   *
   * @param {string} value Nuevo valor.
   */
  set value(t) {
    this._mask ? this.input.value = this._formatValue(t != null ? String(t) : "") : this.input.value = t, this._syncAria(), this._updateCounter(), this._adjustAutoResize();
  }
  /**
   * Obtiene el valor limpio sin caracteres de formato de la máscara.
   *
   * @returns {string} Valor desmascarado.
   */
  get unmaskedValue() {
    return this._mask ? this._maskType === "currency" ? this._unmaskCurrency(this.input.value) : this._unmaskPattern(this.input.value, this._pattern) : this.input.value;
  }
  /**
   * Establece el valor limpio y lo formatea automáticamente según la máscara.
   *
   * @param {string|number} val Valor sin formato.
   */
  set unmaskedValue(t) {
    if (!this._mask) {
      this.value = t;
      return;
    }
    const e = t == null ? "" : String(t);
    this.value = this._formatValue(e);
  }
  /**
   * Indica si la máscara actual ha sido completada en todos sus slots.
   *
   * @returns {boolean} `true` si está completa.
   */
  get isMaskComplete() {
    if (!this._mask) return !0;
    if (this._maskType === "currency")
      return !!(this.unmaskedValue && parseFloat(this.unmaskedValue) > 0);
    if (!this._pattern) return !0;
    const t = (this._pattern.match(/[0aA*]/g) || []).length;
    return this.unmaskedValue.length >= t;
  }
  /**
   * Indica si el campo está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.input.disabled;
  }
  /**
   * Deshabilita el campo.
   */
  disable() {
    this.input.disabled = !0, this._syncActionsDisabled();
  }
  /**
   * Habilita el campo.
   */
  enable() {
    this.input.disabled = !1, this._syncActionsDisabled();
  }
  /**
   * Indica si la contraseña se muestra en claro (solo con `data-password-toggle`).
   *
   * @returns {boolean} `true` si el input es de tipo texto.
   */
  get passwordVisible() {
    return !!this.passwordToggle && this.input.type === "text";
  }
  /**
   * Muestra u oculta la contraseña y sincroniza el botón (icono y `aria-pressed`).
   *
   * @param {boolean} [force] Estado deseado; si se omite, alterna.
   * @returns {boolean} `true` si la contraseña queda visible.
   */
  togglePasswordVisibility(t) {
    if (!this.passwordToggle) return !1;
    const e = typeof t == "boolean" ? t : this.input.type === "password", i = document.activeElement === this.input, { selectionStart: s, selectionEnd: a } = this.input;
    if (this.input.type = e ? "text" : "password", i && s !== null)
      try {
        this.input.setSelectionRange(s, a);
      } catch {
      }
    return this._syncPasswordToggle(), v(
      this.element,
      "mtx:text-field:password-visibility",
      { visible: e },
      { aliases: ["mtx:password-visibility"] }
    ), e;
  }
  /**
   * Crea un adorno interactivo (IconButton edge-start/edge-end) dentro del contenedor.
   *
   * @param {'start'|'end'} position Posición del adorno.
   * @param {string} icon Nombre del Material Icon.
   * @param {string|null} label Nombre accesible del botón.
   * @returns {HTMLButtonElement} Botón creado.
   * @private
   */
  _createActionAdornment(t, e, i) {
    const s = document.createElement("span");
    s.className = `mtx-text-field__adornment mtx-text-field__adornment--${t} mtx-text-field__adornment--action`;
    const a = document.createElement("button");
    a.type = "button";
    const n = this.element.classList.contains("mtx-text-field--small");
    a.className = `mtx-icon-button mtx-text-field__action mtx-text-field__action--${t}` + (n ? " mtx-icon-button--small" : ""), a.setAttribute("data-mtx", "icon-button"), i && a.setAttribute("aria-label", i);
    const l = document.createElement("span");
    return l.className = "material-icons", l.setAttribute("aria-hidden", "true"), l.textContent = e, a.appendChild(l), s.appendChild(a), t === "start" ? this.container.insertBefore(s, this.container.firstChild) : this.container.appendChild(s), this._bindActionButton(a, t), a;
  }
  /**
   * Enlaza clic y mousedown de un botón de adorno (liberados en `destroy()`).
   *
   * @param {HTMLButtonElement} button Botón del adorno.
   * @param {'start'|'end'} position Posición del adorno.
   * @private
   */
  _bindActionButton(t, e) {
    this.listen(t, "click", () => {
      if (t === this.passwordToggle) {
        this.togglePasswordVisibility();
        return;
      }
      v(
        this.element,
        "mtx:text-field:adornment-click",
        { position: e, button: t, input: this.input },
        { aliases: ["mtx:adornment-click"] }
      );
    }), this.listen(t, "mousedown", (i) => i.preventDefault()), U(t, "icon-button");
  }
  /**
   * Refleja en el botón de contraseña el estado actual (icono, aria-pressed y nombre i18n).
   * @private
   */
  _syncPasswordToggle() {
    const t = this.passwordToggle;
    if (!t) return;
    const e = this.input.type === "text", s = this.element.getAttribute("data-password-toggle-label") || this.input.getAttribute("data-password-toggle-label") || y("textField", "showPassword", null, "Show password", k(this.element));
    t.setAttribute("aria-pressed", String(e)), t.setAttribute("aria-label", s);
    const a = t.querySelector(".material-icons");
    a && (a.textContent = e ? "visibility_off" : "visibility");
  }
  /**
   * Sincroniza el estado deshabilitado de los adornos interactivos con el input.
   * @private
   */
  _syncActionsDisabled() {
    [this.startAction, this.endAction, this.passwordToggle].forEach((t) => {
      t && (t.disabled = this.input.disabled);
    });
  }
  /**
   * Libera los listeners de la instancia (input, botones y documento).
   */
  destroy() {
    super.destroy();
  }
  /**
   * Enfoca el input.
   */
  focus() {
    this.input.focus();
  }
  /**
   * Muestra el estado de error.
   *
   * @param {string|boolean} message Mensaje de error, `true` para error sin mensaje
   *   (conserva el helper text) o cadena vacía/`false` para limpiar.
   */
  setError(t) {
    if (!t) {
      this.clearError();
      return;
    }
    if (this._hasCustomError = !0, this.element.classList.add("mtx-text-field--error"), this.input.setAttribute("aria-invalid", "true"), t === !0) {
      this._syncDescribedBy();
      return;
    }
    const e = `${this.input.id}-error`;
    this.support || (this.support = document.createElement("div"), this.support.className = "mtx-text-field__supporting-text", this.element.appendChild(this.support), this._createdSupport = !0), this.support.id = e, this.support.dataset.mtxError = "", this.helperEl || (this.helperEl = document.createElement("span"), this.helperEl.className = "mtx-text-field__helper-text", this.support.insertBefore(this.helperEl, this.support.firstChild)), this.helperEl.id = e, this.helperEl.textContent = t, this.helperEl.dataset.mtxError = "", this._syncDescribedBy();
  }
  /**
   * Limpia el estado de error.
   */
  clearError() {
    this._hasCustomError = !1, this.element.classList.remove("mtx-text-field--error"), this.input.removeAttribute("aria-invalid"), this.support && (this._createdSupport && !this.counterEl ? (this.support.remove(), this.support = null, this.helperEl = null, this._createdSupport = !1) : (this.support.id = this._helperId || "", delete this.support.dataset.mtxError, this.helperEl ? (this.helperEl.textContent = this._helperText || "", this.helperEl.id = this._helperId || "", delete this.helperEl.dataset.mtxError) : this.support.textContent = this._helperText || "")), this._updateCounter(), this._syncDescribedBy();
  }
  /** Sincroniza los ids de ayuda y error sin borrar referencias externas. */
  _syncDescribedBy() {
    const t = [...this._baseDescribedBy];
    this.support && this.support.id && t.push(this.support.id);
    const e = [...new Set(t)];
    e.length ? this.input.setAttribute("aria-describedby", e.join(" ")) : this.input.removeAttribute("aria-describedby");
  }
  /** Quita el foco del control. */
  blur() {
    this.input.blur();
  }
  /**
   * Sincroniza la clase de estado si hay un valor, un placeholder de texto visible o tipo fecha/hora.
   */
  _syncAria() {
    const t = this.input.value, e = !!(t && String(t).trim() !== ""), i = this.input.getAttribute("placeholder"), s = !!(i && i.trim() !== "" && i.trim() !== " "), a = (this.input.getAttribute("type") || "").toLowerCase(), n = ["date", "time", "datetime-local", "month", "week"].includes(a), l = this.input instanceof HTMLSelectElement;
    e || s || n || l ? this.element.classList.add("mtx-text-field--has-value") : this.element.classList.remove("mtx-text-field--has-value");
  }
  /**
   * Determina si una cadena corresponde a una URL o ruta de imagen.
   *
   * @param {string} src Ruta o valor a evaluar.
   * @returns {boolean} `true` si es una imagen.
   * @private
   */
  _isImageUrl(t) {
    return typeof t == "string" && (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/") || t.startsWith("./") || t.startsWith("../") || t.startsWith("data:image/") || /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(t));
  }
  /**
   * Crea un elemento <img> para URLs o un <span> con Material Icons.
   *
   * @param {string} val Nombre del icono o URL de la imagen.
   * @param {string} className Clases CSS a aplicar.
   * @param {string} [defaultIconClass] Clase por defecto para iconos de texto.
   * @returns {HTMLElement|null} Elemento DOM generado.
   * @private
   */
  _createIconOrImage(t, e, i) {
    if (!t) return null;
    if (this._isImageUrl(t)) {
      const a = document.createElement("img");
      return a.src = t, a.alt = "", a.className = e ? `${e} mtx-text-field__adornment--image` : "mtx-text-field__adornment--image", a;
    }
    const s = document.createElement("span");
    return s.className = e ? `${e} ${i || "material-icons"}` : i || "material-icons", s.setAttribute("aria-hidden", "true"), s.textContent = t, s;
  }
  /**
   * Inicializa el sistema de máscaras declarativas si data-mask está presente.
   * @private
   */
  _initMask() {
    const t = this.element, e = t.getAttribute("data-mask") || this.input.getAttribute("data-mask");
    if (!e) {
      this._mask = null;
      return;
    }
    this._mask = e.trim();
    const i = {
      "credit-card": "0000 0000 0000 0000",
      date: "00/00/0000",
      "date-short": "00/00",
      time: "00:00",
      "time-ampm": "00:00 AA",
      "time-seconds": "00:00:00",
      phone: "(000) 000-0000",
      "phone-intl": "+00 (000) 000-0000",
      cpf: "000.000.000-00",
      cnpj: "00.000.000/0000-00",
      zip: "00000-000",
      "postal-code": "00000-0000"
    };
    this._mask === "currency" || this._mask === "money" ? (this._maskType = "currency", this._currencyOptions = {
      prefix: t.getAttribute("data-currency-prefix") ?? this.input.getAttribute("data-currency-prefix") ?? "$ ",
      suffix: t.getAttribute("data-currency-suffix") ?? this.input.getAttribute("data-currency-suffix") ?? "",
      thousands: t.getAttribute("data-thousands") ?? this.input.getAttribute("data-thousands") ?? ",",
      decimal: t.getAttribute("data-decimal") ?? this.input.getAttribute("data-decimal") ?? ".",
      precision: parseInt(t.getAttribute("data-precision") ?? this.input.getAttribute("data-precision") ?? "2", 10)
    }) : (this._maskType = "pattern", this._pattern = i[this._mask.toLowerCase()] || this._mask), this.input.value && (this.input.value = this._formatValue(this.input.value));
  }
  /**
   * Formatea un valor según la máscara configurada.
   *
   * @param {string} val Valor a formatear.
   * @returns {string} Valor formateado.
   * @private
   */
  _formatValue(t) {
    return this._mask ? this._maskType === "currency" ? this._applyCurrencyMask(t, this._currencyOptions) : this._applyPatternMask(t, this._pattern) : t;
  }
  /**
   * Evalúa si un carácter es un token de slot en la máscara.
   *
   * @param {string} char Carácter.
   * @returns {boolean} `true` si es token.
   * @private
   */
  _isSlotToken(t) {
    return t === "0" || t === "a" || t === "A" || t === "*";
  }
  /**
   * Evalúa si un carácter coincide con el token de slot.
   *
   * @param {string} token Token de la máscara.
   * @param {string} char Carácter a validar.
   * @returns {boolean} `true` si coincide.
   * @private
   */
  _matchesSlot(t, e) {
    return e ? t === "0" ? /\d/.test(e) : t === "a" || t === "A" ? /[a-zA-Z]/.test(e) : t === "*" ? /[0-9a-zA-Z]/.test(e) : !1 : !1;
  }
  /**
   * Aplica la máscara basada en patrón al texto.
   *
   * @param {string} rawText Texto sin formatear o parcialmente formateado.
   * @param {string} pattern Patrón de máscara.
   * @returns {string} Texto formateado.
   * @private
   */
  _applyPatternMask(t, e) {
    if (!e || !t) return "";
    let i = "";
    for (let l = 0; l < t.length; l++) {
      const o = t[l];
      /[0-9a-zA-Z]/.test(o) && (i += o);
    }
    if (!i) return "";
    let s = 0, a = "", n = !1;
    for (let l = 0; l < e.length && s < i.length; l++) {
      const o = e[l];
      if (this._isSlotToken(o)) {
        for (; s < i.length && !this._matchesSlot(o, i[s]); )
          s++;
        if (s < i.length) {
          let c = i[s++];
          o === "A" ? c = c.toUpperCase() : o === "a" && (c = c.toLowerCase()), a += c, n = !0;
        }
      } else
        a += o;
    }
    if (n) {
      let l = a.length;
      for (; l < e.length && !this._isSlotToken(e[l]); )
        a += e[l++];
    }
    return a;
  }
  /**
   * Extrae los caracteres de slots sin literales.
   *
   * @param {string} formattedValue Valor formateado.
   * @param {string} pattern Patrón.
   * @returns {string} Cadena limpia.
   * @private
   */
  _unmaskPattern(t, e) {
    if (!t || !e) return t || "";
    let i = "", s = 0;
    for (let a = 0; a < t.length && s < e.length; a++) {
      const n = t[a], l = e[s];
      this._isSlotToken(l) ? this._matchesSlot(l, n) && (i += n, s++) : n === l && s++;
    }
    return i;
  }
  /**
   * Aplica formato monetario con prefijo, sufijo y separadores.
   *
   * @param {string} value Valor de entrada.
   * @param {Object} opts Opciones de moneda.
   * @returns {string} Valor formateado.
   * @private
   */
  _applyCurrencyMask(t, e) {
    if (!t) return "";
    const i = String(t).replace(/\D/g, "");
    if (!i) return "";
    const s = e.precision;
    let a = "", n = "";
    if (s > 0) {
      const c = i.padStart(s + 1, "0");
      a = c.slice(0, c.length - s).replace(/^0+(?=\d)/, ""), n = c.slice(c.length - s);
    } else
      a = i.replace(/^0+(?=\d)/, "") || "0";
    const l = a.replace(/\B(?=(\d{3})+(?!\d))/g, e.thousands), o = s > 0 ? `${l}${e.decimal}${n}` : l;
    return `${e.prefix}${o}${e.suffix}`;
  }
  /**
   * Extrae el valor numérico limpio de una cadena de moneda.
   *
   * @param {string} value Cadena formateada.
   * @returns {string} Número como string (ej. "1250.50").
   * @private
   */
  _unmaskCurrency(t) {
    var s;
    if (!t) return "";
    const e = String(t).replace(/\D/g, "");
    if (!e) return "";
    const i = ((s = this._currencyOptions) == null ? void 0 : s.precision) ?? 2;
    if (i > 0) {
      const a = e.padStart(i + 1, "0"), n = a.slice(0, a.length - i).replace(/^0+(?=\d)/, ""), l = a.slice(a.length - i);
      return `${n}.${l}`;
    }
    return e;
  }
  /**
   * Cuenta cuántos caracteres pertenecen a slots antes de una posición dada.
   *
   * @param {string} str Subcadena.
   * @returns {number} Conteo.
   * @private
   */
  _countSlotChars(t) {
    return (t.match(/[0-9a-zA-Z]/g) || []).length;
  }
  /**
   * Calcula la posición del cursor en la cadena formateada basándose en el conteo de slots.
   *
   * @param {string} formatted Cadena formateada.
   * @param {number} targetSlotCount Cantidad de caracteres de slot.
   * @returns {number} Índice del cursor.
   * @private
   */
  _getCursorIndexFromSlotCount(t, e) {
    let i = 0;
    for (let s = 0; s < t.length; s++)
      if (/[0-9a-zA-Z]/.test(t[s]) && i++, i === e)
        return s + 1;
    return t.length;
  }
  /**
   * Gestiona el evento de entrada para actualizar la máscara y preservar la posición del cursor.
   *
   * @param {Event} e Evento de input.
   * @private
   */
  _handleMaskInput(t) {
    var a;
    if (!this._mask) return;
    const e = this.input, i = e.value, s = e.selectionStart || 0;
    if (this._maskType === "currency") {
      const n = this._formatValue(i);
      e.value = n;
      const l = (((a = this._currencyOptions) == null ? void 0 : a.suffix) || "").length, o = Math.max(0, n.length - l);
      e.setSelectionRange(o, o);
    } else {
      const n = this._countSlotChars(i.slice(0, s)), l = this._applyPatternMask(i, this._pattern);
      e.value = l;
      const o = this._getCursorIndexFromSlotCount(l, n);
      e.setSelectionRange(o, o);
    }
  }
  /**
   * Cuenta las palabras contenidas en una cadena de texto.
   *
   * @param {string} text Cadena a evaluar.
   * @returns {number} Número de palabras.
   * @private
   */
  _countWords(t) {
    if (!t || typeof t != "string") return 0;
    const e = t.trim();
    return e ? e.split(/\s+/).filter(Boolean).length : 0;
  }
  /**
   * Actualiza el contenido visual del contador y valida límites máximos.
   * @private
   */
  _updateCounter() {
    if (!this.counterEl) return;
    const t = this.input.value || "", e = t.length, i = this._countWords(t);
    let s = !1, a = "";
    const n = k(this.element);
    if (this._counterType === "both") {
      const l = this._maxWords ? `${i}/${this._maxWords}` : `${i}`, o = this._maxChars ? `${e}/${this._maxChars}` : `${e}`, c = y("textField", "counterWordsShort", { value: l }, "{value} words", n), d = y("textField", "counterCharsShort", { value: o }, "{value} chars", n);
      a = `${c} | ${d}`, this._maxWords && i > this._maxWords && (s = !0), this._maxChars && e > this._maxChars && (s = !0);
    } else this._counterType === "words" ? (a = this._maxWords ? `${i} / ${this._maxWords}` : y("textField", "counterWords", { count: i }, "{count} words", n), this._maxWords && i > this._maxWords && (s = !0)) : (a = this._maxChars ? `${e} / ${this._maxChars}` : `${e}`, this._maxChars && e > this._maxChars && (s = !0));
    this.counterEl.textContent = a, this.counterEl.classList.toggle("mtx-text-field__counter--error", s), s ? (this.element.classList.add("mtx-text-field--error"), this.input.setAttribute("aria-invalid", "true")) : this._hasCustomError || (this.element.classList.remove("mtx-text-field--error"), this.input.removeAttribute("aria-invalid"));
  }
  /**
   * Ajusta automáticamente la altura del textarea según su contenido solo si tiene auto-resize activo.
   * @private
   */
  _adjustAutoResize() {
    if (!this._hasAutoResize || !(this.input instanceof HTMLTextAreaElement))
      return;
    const t = this.input;
    t.style.height = "auto";
    const e = t.scrollHeight;
    if (e <= 0) return;
    const i = this.element.getAttribute("data-max-rows") || t.getAttribute("data-max-rows");
    if (i) {
      const s = parseInt(i, 10);
      if (!isNaN(s) && s > 0) {
        const a = typeof window < "u" && window.getComputedStyle ? window.getComputedStyle(t) : null, n = a && parseFloat(a.lineHeight) || 24, l = a && parseFloat(a.paddingTop) || 0, o = a && parseFloat(a.paddingBottom) || 0, c = n * s + l + o;
        if (e > c) {
          t.style.height = `${c}px`, t.style.overflowY = "auto";
          return;
        }
      }
    }
    t.style.height = `${e}px`, t.style.overflowY = "hidden";
  }
}
f("text-field", yt);
f("input", yt);
f("textarea", yt);
const In = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>', qi = ["standard", "outlined", "filled"];
class xa extends g {
  /**
   * Crea una instancia del select nativo.
   *
   * @param {HTMLElement} element Elemento contenedor o `<select>` directo.
   */
  constructor(t) {
    if (t instanceof HTMLSelectElement && !t.closest(".mtx-native-select")) {
      const a = document.createElement("div");
      a.className = "mtx-native-select", Array.from(t.attributes).forEach((n) => {
        n.name === "class" ? a.className += ` ${n.value}` : (n.name.startsWith("data-") && n.name !== "data-mtx-initialized" || n.name === "label") && a.setAttribute(n.name, n.value);
      }), t.removeAttribute("class"), t.parentNode && t.parentNode.insertBefore(a, t), a.appendChild(t), t = a;
    }
    if (super(t), this.input = t.querySelector("select") || (t instanceof HTMLSelectElement ? t : null), !(this.input instanceof HTMLSelectElement))
      throw new TypeError("NativeSelect requiere un elemento <select>.");
    this.input.classList.add("mtx-native-select__input");
    const e = t.getAttribute("data-variant"), i = qi.find((a) => t.classList.contains(`mtx-native-select--${a}`));
    this.variant = qi.includes(e) ? e : i || "standard", t.classList.add(`mtx-native-select--${this.variant}`), (t.hasAttribute("data-small") || t.getAttribute("data-size") === "small") && t.classList.add("mtx-native-select--small");
    const s = t.getAttribute("data-label") || t.getAttribute("label");
    this.label = t.querySelector(".mtx-native-select__label"), !this.label && s && (this.label = document.createElement("label"), this.label.className = "mtx-native-select__label", this.label.textContent = s, t.insertBefore(this.label, this.input)), this.label && (this.input.id || (this.input.id = P("mtx-native-select")), this.label.tagName === "LABEL" && !this.label.htmlFor && (this.label.htmlFor = this.input.id), this.label.tagName !== "LABEL" && (this.label.id || (this.label.id = `${this.input.id}-label`), this.input.hasAttribute("aria-labelledby") || this.input.setAttribute("aria-labelledby", this.label.id)), t.classList.add("mtx-native-select--has-label")), this.chevron = t.querySelector(".mtx-native-select__chevron"), this.chevron || (this.chevron = document.createElement("span"), this.chevron.className = "mtx-native-select__chevron", t.appendChild(this.chevron)), this.chevron.setAttribute("aria-hidden", "true"), this.chevron.firstElementChild || (this.chevron.innerHTML = In), t.hasAttribute("data-error") && (t.classList.add("mtx-native-select--error"), this.input.setAttribute("aria-invalid", "true")), this.input.multiple && t.classList.add("mtx-native-select--multiple");
  }
  /** @returns {string|string[]} Valor actual. */
  get value() {
    return this.input.multiple ? Array.from(this.input.selectedOptions).map((t) => t.value) : this.input.value;
  }
  /** @param {string|string[]} value Nuevo valor. */
  set value(t) {
    const e = Array.isArray(t) ? t.map(String) : [String(t)];
    Array.from(this.input.options).forEach((i) => {
      i.selected = e.includes(i.value);
    });
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.input.disabled;
  }
  /** Deshabilita el select. */
  disable() {
    this.input.disabled = !0;
  }
  /** Habilita el select. */
  enable() {
    this.input.disabled = !1;
  }
  /** Enfoca el select nativo. */
  focus() {
    this.input.focus();
  }
}
f("native-select", xa);
const On = 1e3;
function qt(r, t) {
  let e = -1 / 0;
  const i = (s) => {
    const a = Date.now();
    if (s.type === "touchstart") e = a;
    else if (a - e < On) return;
    r && r.contains(s.target) || t(s);
  };
  return document.addEventListener("mousedown", i, !0), document.addEventListener("touchstart", i, !0), function() {
    document.removeEventListener("mousedown", i, !0), document.removeEventListener("touchstart", i, !0);
  };
}
function Ct(r = "mtx-portal") {
  let t = document.getElementById(r);
  return t || (t = document.createElement("div"), t.id = r, t.style.position = "fixed", t.style.top = "0", t.style.left = "0", t.style.width = "0", t.style.height = "0", t.style.overflow = "visible", t.style.zIndex = "1300", t.style.pointerEvents = "none", document.body.appendChild(t)), t;
}
const Pn = ["primary", "secondary", "error", "warning", "info", "success"], $n = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>';
class Aa extends g {
  /**
   * Crea una instancia del campo de selección.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(e) {
    const i = e instanceof HTMLSelectElement && e.parentElement ? e.parentElement.closest(".mtx-select") : null;
    if (i)
      e = i;
    else if (e instanceof HTMLSelectElement) {
      const u = document.createElement("div");
      u.className = "mtx-select", Array.from(e.attributes).forEach((m) => {
        m.name === "class" ? u.className += " " + m.value : (m.name.startsWith("data-") || m.name === "label") && u.setAttribute(m.name, m.value);
      }), e.parentNode && e.parentNode.insertBefore(u, e), u.appendChild(e), e = u;
    }
    super(e);
    /**
     * Reposiciona el menú al hacer scroll o resize; lo cierra si el control
     * queda fuera del viewport.
     */
    Kt(this, "_handleReposition", () => {
      if (!this.element.classList.contains("mtx-select--open")) return;
      const e = this.control.getBoundingClientRect();
      if (e.bottom < 0 || e.top > window.innerHeight) {
        this._setOpen(!1);
        return;
      }
      this._positionMenu({ keepSide: !0 });
    });
    if (this.select = e.querySelector("select") || (e instanceof HTMLSelectElement ? e : null), !this.select) throw new TypeError("Select requiere un elemento <select>.");
    let s = e.querySelector(".mtx-select__control");
    s || (s = document.createElement("div"), s.className = "mtx-select__control", this.select.parentNode.insertBefore(s, this.select), s.appendChild(this.select)), this.control = s;
    const a = e.getAttribute("data-label") || e.getAttribute("label") || this.select.getAttribute("data-label");
    let n = e.querySelector(".mtx-select__label");
    a && !n && (n = document.createElement("label"), n.className = "mtx-select__label", n.textContent = a, e.insertBefore(n, s)), this.label = n, this._id = e.id || P("mtx-select"), e.id || (e.id = this._id), this.control.id = this.control.id || `${this._id}-control`, this.readOnly = e.hasAttribute("data-readonly") || this.select.hasAttribute("readonly"), this.placeholder = e.getAttribute("data-placeholder") || this.select.getAttribute("title") || "";
    const l = e.getAttribute("data-variant") || this.select.getAttribute("data-variant") || "outlined";
    this.variant = l, e.classList.add(`mtx-select--${l}`);
    const o = e.getAttribute("data-color") || this.select.getAttribute("data-color");
    this.color = Pn.includes(o) ? o : "primary", e.classList.add(`mtx-select--color-${this.color}`), o && o !== "error" && o !== "primary" && e.classList.add(`mtx-select--${o}`), (e.hasAttribute("data-error") || this.select.hasAttribute("data-error")) && e.classList.add("mtx-select--error"), (e.hasAttribute("data-small") || e.getAttribute("data-size") === "small" || this.select.hasAttribute("data-small") || this.select.getAttribute("data-size") === "small") && e.classList.add("mtx-select--small"), (e.hasAttribute("data-disabled") || this.select.disabled) && (this.select.disabled = !0);
    const c = e.getAttribute("data-helper-text") || this.select.getAttribute("data-helper-text");
    let d = e.querySelector(".mtx-select__helper-text");
    !d && c && (d = document.createElement("div"), d.className = "mtx-select__helper-text", d.id = `${this._id}-helper-text`, d.textContent = c, e.appendChild(d)), this.helperTextElement = d, this.searchEnabled = e.hasAttribute("data-search") || this.select.hasAttribute("data-search"), this._noneResultsTextOverride = e.getAttribute("data-none-results-text") || e.getAttribute("data-no-results-text") || this.select.getAttribute("data-none-results-text") || this.select.getAttribute("data-no-results-text") || null, this.actionsBox = e.hasAttribute("data-actions-box") || this.select.hasAttribute("data-actions-box"), this._selectAllTextOverride = e.getAttribute("data-select-all-text") || this.select.getAttribute("data-select-all-text") || null, this._deselectAllTextOverride = e.getAttribute("data-deselect-all-text") || e.getAttribute("data-clear-all-text") || this.select.getAttribute("data-deselect-all-text") || this.select.getAttribute("data-clear-all-text") || null, this.header = e.getAttribute("data-header") || this.select.getAttribute("data-header") || "";
    const h = e.getAttribute("data-max-options") || this.select.getAttribute("data-max-options");
    this.maxOptions = h ? parseInt(h, 10) : 1 / 0, this.textFormat = e.getAttribute("data-selected-text-format") || this.select.getAttribute("data-selected-text-format") || "values", this._textFormatCount = this._parseCountFormat(this.textFormat), this.placeholder && !this.select.multiple && !Array.from(this.select.options).some((u) => u.defaultSelected) && (this.select.selectedIndex = -1), this._stopAutoUpdate = null, this._openRaf = null, this._searchTimer = null, this.onDestroy(() => {
      this._unbindReposition(), this._clickAwayCleanup && this._clickAwayCleanup(), this._clickAwayCleanup = null, this._openRaf && cancelAnimationFrame(this._openRaf), this._openRaf = null, clearTimeout(this._searchTimer), this._searchTimer = null;
    }), this._buildControl(), this._buildMenu(), this._bindEvents(), this._sync(), et(this.select, this), this.select.hasAttribute("data-mtx") && this.select.setAttribute("data-mtx-initialized", ""), this._handleLocaleChange = () => this._refreshI18nTexts(), this.listen(document, "mtx:locale:change", this._handleLocaleChange);
  }
  /**
   * Interpreta formatos como `count > 3`.
   *
   * @param {string} format Valor de `data-selected-text-format`.
   * @returns {number} Umbral o `Infinity` si no aplica.
   */
  _parseCountFormat(e) {
    const i = /^count\s*>\s*(\d+)$/.exec(e);
    return i ? parseInt(i[1], 10) : 1 / 0;
  }
  /**
   * Añade el chevron, adornments, outline y oculta el `<select>` nativo.
   */
  _buildControl() {
    const e = this.element.getAttribute("data-start-icon") || this.select.getAttribute("data-start-icon");
    let i = this.control.querySelector(".mtx-select__adornment--start");
    !i && e && (/^(https?:|\/|\.\/|\.\.\/|data:image\/)/i.test(e) || /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(e) ? (i = document.createElement("img"), i.className = "mtx-select__adornment mtx-select__adornment--start mtx-select__adornment--image", i.src = e, i.alt = "", i.setAttribute("aria-hidden", "true")) : (i = document.createElement("span"), i.className = "mtx-select__adornment mtx-select__adornment--start material-icons", i.setAttribute("aria-hidden", "true"), i.textContent = e), this.control.insertBefore(i, this.control.firstChild)), i && this.element.classList.add("mtx-select--adorned-start"), this.chevron = this.control.querySelector(".mtx-select__chevron"), this.chevron || (this.chevron = document.createElement("span"), this.chevron.className = "mtx-select__chevron", this.control.appendChild(this.chevron)), this.chevron.innerHTML = $n, this.display = this.control.querySelector(".mtx-select__display"), this.display || (this.display = document.createElement("span"), this.display.className = "mtx-select__display", this.control.insertBefore(this.display, this.chevron)), this.select.classList.add("mtx-select__native"), this.select.setAttribute("tabindex", "-1"), this.select.setAttribute("aria-hidden", "true"), this.variant === "outlined" && this._buildOutline();
  }
  /**
   * Crea el `fieldset` que dibuja la muesca del borde y sincroniza su
   * contenido con el texto del label (NotchedOutline canónico de MUI).
   */
  _buildOutline() {
    if (this.control.querySelector(".mtx-select__outline")) return;
    const e = document.createElement("fieldset");
    if (e.className = "mtx-select__outline", e.setAttribute("aria-hidden", "true"), this.label && !this.element.classList.contains("mtx-select--hidden-label") && !this.element.hasAttribute("data-hidden-label")) {
      const s = document.createElement("legend");
      s.className = "mtx-select__legend";
      const a = document.createElement("span");
      a.textContent = this.label.textContent, s.appendChild(a), e.appendChild(s);
    }
    this.control.appendChild(e), this.outline = e;
  }
  /**
   * Construye el menú desplegable (cabecera, búsqueda, acciones, opciones).
   */
  _buildMenu() {
    if (Array.from(this.element.children).filter((i) => i.classList.contains("mtx-select__menu")).forEach((i) => i.remove()), this.menu = document.createElement("div"), this.menu.className = `mtx-select__menu mtx-select__menu--color-${this.color}`, this.menu.id = `${this._id}-listbox`, this.menu.setAttribute("role", "listbox"), this.select.multiple && this.menu.setAttribute("aria-multiselectable", "true"), this.header) {
      const i = document.createElement("div");
      i.className = "mtx-select__header", i.textContent = this.header, this.menu.appendChild(i);
    }
    if (this.searchEnabled) {
      const i = document.createElement("div");
      i.className = "mtx-select__search-wrap", this.search = document.createElement("input"), this.search.type = "text", this.search.className = "mtx-select__search";
      const s = k(this.element);
      this.search.setAttribute("placeholder", y("select", "searchPlaceholder", null, "Search…", s)), this.search.setAttribute("aria-label", y("select", "searchAriaLabel", null, "Search options", s)), i.appendChild(this.search), this.menu.appendChild(i);
    }
    if (this.actionsBox && this.select.multiple) {
      const i = document.createElement("div");
      i.className = "mtx-select__actions";
      const s = k(this.element), a = document.createElement("button");
      a.type = "button", a.className = "mtx-select__action mtx-select__action--select-all", a.textContent = this._selectAllTextOverride || y("select", "selectAllText", null, "Select all", s), a.addEventListener("click", () => this._selectAll());
      const n = document.createElement("button");
      n.type = "button", n.className = "mtx-select__action mtx-select__action--deselect-all", n.textContent = this._deselectAllTextOverride || y("select", "deselectAllText", null, "Deselect all", s), n.addEventListener("click", () => this._clearAll()), i.append(a, n), this.menu.appendChild(i);
    }
    this.optgroups = [], this.optionItems = [];
    const e = (i) => {
      Array.from(i.children).forEach((s) => {
        if (s.tagName === "OPTGROUP") {
          const a = document.createElement("div");
          a.className = "mtx-select__optgroup", a.textContent = s.label || "", this.menu.appendChild(a), this.optgroups.push({ header: a, options: [] }), e(s);
        } else if (s.tagName === "OPTION") {
          const a = document.createElement("div");
          a.className = "mtx-select__option", a.setAttribute("role", "option"), a.tabIndex = -1, a.dataset.value = s.value, a._mtxOption = s;
          const n = s.disabled || !!s.closest("optgroup:disabled");
          if (a.classList.toggle("mtx-select__option--disabled", n), n && a.setAttribute("aria-disabled", "true"), this.select.multiple) {
            const c = document.createElement("span");
            c.className = "mtx-select__check", a.appendChild(c);
          }
          const l = s.getAttribute("data-icon") || s.getAttribute("data-image");
          if (l) {
            const c = this._createIconOrImage(l, "mtx-select__option");
            c && a.appendChild(c);
          }
          const o = document.createElement("span");
          o.className = "mtx-select__option-text", o.textContent = s.text, a.appendChild(o), this.menu.appendChild(a), this.optionItems.push(a), this.optgroups.length && this.optgroups[this.optgroups.length - 1].options.push(a);
        }
      });
    };
    e(this.select), this.noResults = document.createElement("div"), this.noResults.className = "mtx-select__no-results", this.noResults.hidden = !0, this.menu.appendChild(this.noResults), this.menu.hidden = !0, this.element.appendChild(this.menu);
  }
  /**
   * Vincula los eventos de control, menú y búsqueda.
   */
  _bindEvents() {
    this.control.setAttribute("role", "combobox"), this.control.setAttribute("aria-haspopup", "listbox"), this.control.setAttribute("aria-controls", this.menu.id), this.control.setAttribute("aria-expanded", "false"), this.label ? (this.label.id || (this.label.id = `${this._id}-label`), this.control.setAttribute("aria-labelledby", this.label.id)) : this.select.getAttribute("aria-label") && this.control.setAttribute("aria-label", this.select.getAttribute("aria-label")), this._syncAccessibility(), this._handleControlClick = (e) => {
      this.select.disabled || (e.preventDefault(), this._toggleOpen());
    }, this._handleControlKeydown = (e) => {
      this.select.disabled || this.readOnly || (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " " ? (e.preventDefault(), this._setOpen(!0)) : e.key === "Enter" && (e.preventDefault(), this._toggleOpen()));
    }, this._handleMenuClick = (e) => {
      const i = e.target.closest(".mtx-select__option");
      i && this._onOptionClick(i);
    }, this._handleMenuKeydown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp")
        e.preventDefault(), this._moveFocus(e.key === "ArrowDown" ? 1 : -1);
      else if (e.key === "Enter" || e.key === " ") {
        const i = document.activeElement;
        i && i.classList.contains("mtx-select__option") && (e.preventDefault(), this._onOptionClick(i));
      } else e.key === "Tab" && this._setOpen(!1);
    }, this._handleSearchInput = this._debounce((e) => {
      this._filterOptions(e.target.value);
    }, 150), this.control.addEventListener("click", this._handleControlClick), this.control.addEventListener("keydown", this._handleControlKeydown), this.menu.addEventListener("click", this._handleMenuClick), this.menu.addEventListener("keydown", this._handleMenuKeydown), this.search && this.search.addEventListener("input", this._handleSearchInput), this._handleSelectChange = () => this._sync(), this.select.addEventListener("change", this._handleSelectChange);
  }
  /**
   * Valor(es) seleccionado(s).
   *
   * @returns {string|string[]} Valor único o lista de valores.
   */
  get value() {
    return this.select.multiple ? Array.from(this.select.selectedOptions).map((e) => e.value) : this.select.value;
  }
  /**
   * Establece el valor seleccionado.
   *
   * @param {string|string[]} value Valor único o lista de valores.
   */
  set value(e) {
    if (this.select.multiple) {
      const i = (Array.isArray(e) ? e : [e]).map(String);
      Array.from(this.select.options).forEach((s) => {
        s.selected = i.includes(s.value);
      });
    } else {
      const i = Array.isArray(e) ? e[0] : e, s = Array.from(this.select.options).find((a) => a.value === String(i ?? ""));
      s ? s.selected = !0 : this.select.selectedIndex = -1;
    }
    this._sync();
  }
  /**
   * Indica si la selección es múltiple.
   *
   * @returns {boolean} `true` si es múltiple.
   */
  get multiple() {
    return this.select.multiple;
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.select.disabled;
  }
  /** Deshabilita el componente y cierra el menú. */
  disable() {
    this.select.disabled = !0, this.close(), this._syncAccessibility();
  }
  /** Habilita el componente. */
  enable() {
    this.select.disabled = !1, this._syncAccessibility();
  }
  /** Enfoca el combobox visible. */
  focus() {
    this.control.focus();
  }
  /**
   * Abre el menú desplegable.
   */
  open() {
    this.select.disabled || this.readOnly || this._setOpen(!0);
  }
  /**
   * Cierra el menú desplegable.
   */
  close() {
    this._setOpen(!1);
  }
  /**
   * Alterna la apertura del menú.
   */
  _toggleOpen() {
    this._setOpen(!this.element.classList.contains("mtx-select--open"));
  }
  /**
   * Abre o cierra el menú desplegable.
   *
   * @param {boolean} open `true` para abrir.
   */
  _setOpen(e) {
    e && (this.select.disabled || this.readOnly) || e !== this.element.classList.contains("mtx-select--open") && (this._closeTimer && (clearTimeout(this._closeTimer), this._closeTimer = null), this.element.classList.toggle("mtx-select--open", e), this.control.setAttribute("aria-expanded", String(e)), e ? (this.menu.parentElement !== Ct() && Ct().appendChild(this.menu), this.menu.hidden = !1, this._positionMenu(), this.menu.style.opacity = "0", this.menu.style.transform = "scale(0.85, 0.85)", this._openRaf && cancelAnimationFrame(this._openRaf), this._openRaf = requestAnimationFrame(() => {
      this._openRaf = null, this.menu.style.transition = "transform 225ms cubic-bezier(0, 0, 0.2, 1), opacity 225ms cubic-bezier(0, 0, 0.2, 1)", this.menu.style.opacity = "1", this.menu.style.transform = "scale(1, 1)";
    }), this._clickAwayCleanup = qt(this.control, (i) => {
      this.menu && this.menu.contains(i.target) || lt(this, i.target) || this._setOpen(!1);
    }), X(this, {
      kind: "popup",
      nodes: this.menu,
      stack: [{ node: Ct() }],
      onEscape: () => {
        this._setOpen(!1), this.control.focus();
      }
    }), this._bindReposition(), this._focusInitial()) : (this.menu.style.opacity = "0", this.menu.style.transform = "scale(0.85, 0.85)", this._closeTimer = setTimeout(() => {
      this.menu.hidden = !0, this.menu.parentElement && this.menu.parentElement.removeChild(this.menu), this.element && this.element.appendChild(this.menu), this._closeTimer = null;
    }, 225), this._openRaf && cancelAnimationFrame(this._openRaf), this._openRaf = null, this._clickAwayCleanup && this._clickAwayCleanup(), this._clickAwayCleanup = null, this._unbindReposition(), q(this)));
  }
  /**
   * Posiciona el menú dentro del viewport y lo invierte cuando hay más
   * espacio disponible sobre el control.
   *
   * @param {{keepSide?: boolean}} [options] `keepSide` conserva el lado elegido al abrir.
   */
  _positionMenu({ keepSide: e = !1 } = {}) {
    e || (this._rtl = xt(this.control), this.menu.setAttribute("dir", this._rtl ? "rtl" : "ltr"));
    const i = qs(this.control, this.menu, {
      placement: "bottom-start",
      offset: 4,
      padding: 16,
      matchWidth: !0,
      rtl: this._rtl,
      // Las recolocaciones (scroll, filtrado) mantienen el lado elegido al abrir.
      lockSide: e ? this._side : void 0
    });
    this._side = i.side;
  }
  /**
   * Reposiciona el menú abierto ante scroll, resize o cambios de tamaño (`autoUpdate`).
   */
  _bindReposition() {
    this._unbindReposition();
    let e = !0;
    this._stopAutoUpdate = Nt(this.control, this.menu, () => {
      if (e) {
        e = !1;
        return;
      }
      this._handleReposition();
    });
  }
  /**
   * Detiene el reposicionamiento automático.
   */
  _unbindReposition() {
    this._stopAutoUpdate && (this._stopAutoUpdate(), this._stopAutoUpdate = null);
  }
  /**
   * Enfoca la búsqueda (si existe) o la primera opción seleccionada.
   */
  _focusInitial() {
    if (this.search && this.searchEnabled) {
      this.search.focus();
      return;
    }
    const e = Array.from(this.menu.querySelectorAll(".mtx-select__option")).filter(
      (a) => !a.classList.contains("mtx-select__option--disabled") && !a.classList.contains("mtx-select__option--hidden")
    ), i = Array.from(this.select.selectedOptions), s = e.find((a) => a._mtxOption && i.includes(a._mtxOption)) || e[0];
    s && s.focus();
  }
  /**
   * Maneja el clic en una opción.
   *
   * @param {HTMLElement} option Elemento `.mtx-select__option`.
   */
  _onOptionClick(e) {
    if (this.readOnly || e.classList.contains("mtx-select__option--disabled")) return;
    const i = e._mtxOption || this._findOption(e.dataset.value);
    if (!(!i || i.disabled || i.parentElement.tagName === "OPTGROUP" && i.parentElement.disabled)) {
      if (this.select.multiple) {
        const s = this.select.selectedOptions.length;
        if (!i.selected && s >= this.maxOptions) return;
        i.selected = !i.selected;
      } else
        i.selected = !0;
      this._sync(), this.select.dispatchEvent(new Event("change", { bubbles: !0 })), this.select.multiple || (this._setOpen(!1), this.control.focus());
    }
  }
  /**
   * Selecciona todas las opciones disponibles (solo múltiple).
   */
  _selectAll() {
    if (!this.select.multiple || this.readOnly || this.select.disabled) return;
    let e = 0;
    Array.from(this.select.options).forEach((i) => {
      const s = i.disabled || i.parentElement.tagName === "OPTGROUP" && i.parentElement.disabled;
      i.selected = !s && e < this.maxOptions, i.selected && (e += 1);
    }), this._sync(), this.select.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Limpia todas las opciones seleccionadas (solo múltiple).
   */
  _clearAll() {
    !this.select.multiple || this.readOnly || this.select.disabled || (Array.from(this.select.options).forEach((e) => {
      e.selected = !1;
    }), this._sync(), this.select.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  /**
   * Mueve el foco entre las opciones del menú.
   *
   * @param {number} step Dirección (`1` abajo, `-1` arriba).
   */
  _moveFocus(e) {
    const i = Array.from(this.menu.querySelectorAll(".mtx-select__option")).filter(
      (n) => !n.classList.contains("mtx-select__option--disabled") && !n.classList.contains("mtx-select__option--hidden")
    );
    if (!i.length) return;
    const s = document.activeElement;
    let a = i.indexOf(s);
    a += e, a < 0 && (a = i.length - 1), a >= i.length && (a = 0), i[a].focus();
  }
  /**
   * Busca el `<option>` nativo cuyo valor coincide.
   *
   * @param {string} value Valor a buscar.
   * @returns {HTMLOptionElement|undefined} Opción encontrada.
   */
  _findOption(e) {
    return Array.from(this.select.options).find((i) => i.value === e);
  }
  /**
   * Filtra las opciones del menú según el texto de búsqueda.
   *
   * @param {string} term Texto a buscar.
   */
  _filterOptions(e) {
    const i = (e || "").toLowerCase().trim();
    let s = !1;
    if (this.optionItems.forEach((a) => {
      const n = !i || a.dataset.searchable.includes(i);
      a.classList.toggle("mtx-select__option--hidden", !n), n && (s = !0);
    }), this.optgroups.forEach((a) => {
      const n = a.options.some(
        (l) => !l.classList.contains("mtx-select__option--hidden")
      );
      a.header.classList.toggle("mtx-select__optgroup--hidden", !n);
    }), this.noResults)
      if (!s && i) {
        const a = k(this.element), n = this._noneResultsTextOverride || y("select", "noneResultsText", null, 'No results found for "{0}"', a), l = n.includes("{0}") ? n.replace("{0}", e) : n;
        this.noResults.textContent = l, this.noResults.hidden = !1;
      } else
        this.noResults.hidden = !0;
  }
  /**
   * Sincroniza la interfaz con el estado del select nativo.
   */
  _sync() {
    this._syncAccessibility(), this._renderDisplay(), this._syncMenu();
  }
  /** Sincroniza estado ARIA y tabulación con el select nativo. */
  _syncAccessibility() {
    const e = this.select.disabled;
    this.control.tabIndex = e ? -1 : 0, this.control.setAttribute("aria-disabled", String(e)), this.readOnly ? this.control.setAttribute("aria-readonly", "true") : this.control.removeAttribute("aria-readonly"), this.select.required ? this.control.setAttribute("aria-required", "true") : this.control.removeAttribute("aria-required"), this.element.classList.contains("mtx-select--error") || this.select.getAttribute("aria-invalid") === "true" ? this.control.setAttribute("aria-invalid", "true") : this.control.removeAttribute("aria-invalid");
    let s = this.select.getAttribute("aria-describedby") || "";
    this.helperTextElement && (s ? s.split(/\s+/).includes(this.helperTextElement.id) || (s = `${s} ${this.helperTextElement.id}`) : s = this.helperTextElement.id), s ? this.control.setAttribute("aria-describedby", s) : this.control.removeAttribute("aria-describedby");
  }
  /**
   * Texto de ayuda o soporte del selector.
   *
   * @returns {string} Texto actual.
   */
  get helperText() {
    return this.helperTextElement ? this.helperTextElement.textContent : "";
  }
  /**
   * Actualiza el texto de ayuda o soporte del selector.
   *
   * @param {string} text Nuevo texto.
   */
  set helperText(e) {
    !this.helperTextElement && e && (this.helperTextElement = document.createElement("div"), this.helperTextElement.className = "mtx-select__helper-text", this.helperTextElement.id = `${this._id}-helper-text`, this.element.appendChild(this.helperTextElement)), this.helperTextElement && (this.helperTextElement.textContent = e, e || (this.helperTextElement.remove(), this.helperTextElement = null)), this._syncAccessibility();
  }
  /**
   * Actualiza el texto mostrado en el control.
   */
  _renderDisplay() {
    const e = Array.from(this.select.options).filter((l) => l.selected);
    let i = this.placeholder, s = null, a = !e.length;
    if (this.select.multiple) {
      if (e.length)
        if (this.textFormat === "static")
          i = this.placeholder;
        else if (this.textFormat === "count") {
          const l = k(this.element), o = e.length === 1 ? "selectedCountSingular" : "selectedCountPlural";
          i = y("select", o, [e.length], `${e.length} selected`, l);
        } else if (this.textFormat === "values" || e.length <= this._textFormatCount)
          i = e.map((l) => l.text).join(", ");
        else {
          const l = k(this.element);
          i = y("select", "selectedCountPlural", [e.length], `${e.length} selected`, l);
        }
    } else if (e[0]) {
      const l = e[0];
      l.value === "" && this.placeholder ? a = !0 : (i = l.text, s = l.getAttribute("data-icon") || l.getAttribute("data-image"));
    }
    if (this.display.innerHTML = "", s) {
      const l = this._createIconOrImage(s, "mtx-select__display");
      l && this.display.appendChild(l);
    }
    const n = document.createElement("span");
    n.className = "mtx-select__display-text", n.textContent = i, this.display.appendChild(n), this.display.classList.toggle("mtx-select__display--empty", a);
  }
  /**
   * Actualiza el estado de las opciones del menú y aplica `data-max-options`.
   */
  _syncMenu() {
    if (!this.menu) return;
    const e = Array.from(this.select.selectedOptions), i = this.select.multiple && e.length >= this.maxOptions;
    Array.from(this.menu.querySelectorAll(".mtx-select__option")).forEach((s) => {
      const a = s._mtxOption || this._findOption(s.dataset.value), n = !!(a && a.selected);
      s.classList.toggle("mtx-select__option--selected", n), s.setAttribute("aria-selected", String(n)), s.dataset.searchable === void 0 && a && (s.dataset.searchable = (a.text + " " + a.value).toLowerCase());
      const o = !!(a && (a.disabled || a.parentElement.tagName === "OPTGROUP" && a.parentElement.disabled)) || i && !n;
      s.classList.toggle("mtx-select__option--disabled", o), o ? s.setAttribute("aria-disabled", "true") : s.removeAttribute("aria-disabled");
    });
  }
  /**
   * Retrasa la ejecución de una función hasta que pase un tiempo sin llamadas.
   * El temporizador vive en `_searchTimer` para cancelarlo en `destroy()`.
   *
   * @param {Function} fn Función a ejecutar.
   * @param {number} wait Milisegundos de espera.
   * @returns {Function} Función con debounce.
   */
  _debounce(e, i) {
    return (...s) => {
      clearTimeout(this._searchTimer), this._searchTimer = setTimeout(() => {
        this._searchTimer = null, e.apply(this, s);
      }, i);
    };
  }
  /**
   * Destruye la instancia y elimina los event listeners.
   */
  destroy() {
    q(this), this.control.removeEventListener("click", this._handleControlClick), this.control.removeEventListener("keydown", this._handleControlKeydown), this.menu.removeEventListener("click", this._handleMenuClick), this.menu.removeEventListener("keydown", this._handleMenuKeydown), this.search && this.search.removeEventListener("input", this._handleSearchInput), this.select.removeEventListener("change", this._handleSelectChange), this._closeTimer && clearTimeout(this._closeTimer), this._closeTimer = null, this.menu && this.element && this.menu.parentElement !== this.element && (this.menu.hidden = !0, this.element.appendChild(this.menu)), this.element.classList.remove("mtx-select--open"), this.control && this.control.setAttribute("aria-expanded", "false"), super.destroy();
  }
  /**
   * Refresca los textos del componente cuando cambia el idioma global.
   */
  _refreshI18nTexts() {
    const e = k(this.element);
    if (this.search && (this.search.setAttribute("placeholder", y("select", "searchPlaceholder", null, "Search…", e)), this.search.setAttribute("aria-label", y("select", "searchAriaLabel", null, "Search options", e))), this.actionsBox && this.select.multiple) {
      const i = this.menu.querySelector(".mtx-select__action--select-all"), s = this.menu.querySelector(".mtx-select__action--deselect-all");
      i && !this._selectAllTextOverride && (i.textContent = y("select", "selectAllText", null, "Select all", e)), s && !this._deselectAllTextOverride && (s.textContent = y("select", "deselectAllText", null, "Deselect all", e));
    }
    this._renderDisplay();
  }
  /**
   * Determina si una cadena corresponde a una URL o ruta de imagen.
   *
   * @param {string} src Ruta o valor a evaluar.
   * @returns {boolean} `true` si es una imagen.
   * @private
   */
  _isImageUrl(e) {
    return typeof e == "string" && (/^(https?:|\/|\.\/|\.\.\/|data:image\/)/i.test(e) || /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(e));
  }
  /**
   * Crea un nodo visual (icono tipográfico de Material Icons o etiqueta <img>)
   * dependiendo de si el valor es una URL/ruta de imagen o un nombre de icono.
   *
   * @param {string} value Nombre de icono o ruta/URL de imagen.
   * @param {string} prefix Prefijo de clase BEM.
   * @returns {HTMLElement|null} Elemento span o img creado.
   * @private
   */
  _createIconOrImage(e, i) {
    if (!e) return null;
    if (this._isImageUrl(e)) {
      const a = document.createElement("img");
      return a.className = `${i}-image`, a.src = e, a.alt = "", a.setAttribute("aria-hidden", "true"), a;
    }
    const s = document.createElement("span");
    return s.className = `${i}-icon material-icons`, s.setAttribute("aria-hidden", "true"), s.textContent = e, s;
  }
}
f("select", Aa);
const zi = 5, Bn = [
  "data-label",
  "data-variant",
  "data-size",
  "data-small",
  "data-color",
  "data-start-icon",
  "data-helper-text",
  "data-error"
], Fn = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', Rn = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>';
function dt(r) {
  return String(r ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
function Hn(r, t, e = !1) {
  const i = dt(t);
  if (!i.trim() || !r) return null;
  let s = "";
  const a = [];
  let n = 0;
  for (const o of String(r)) {
    for (const c of dt(o))
      s += c, a.push({ start: n, end: n + o.length });
    n += o.length;
  }
  const l = s.indexOf(i);
  return l === -1 || e && l !== 0 ? null : { start: a[l].start, end: a[l + i.length - 1].end };
}
function Jt(r) {
  if (r == null) return null;
  if (typeof r != "object") {
    const s = String(r);
    return { value: s, label: s };
  }
  const t = r.value !== void 0 && r.value !== null ? String(r.value) : String(r.label ?? ""), e = r.label !== void 0 && r.label !== null ? String(r.label) : t, i = { ...r, value: t, label: e };
  return r.group !== void 0 && r.group !== null && r.group !== "" ? i.group = String(r.group) : delete i.group, i.disabled = !!r.disabled, i.disabled || delete i.disabled, i;
}
function Gt(r) {
  return !r || !r.querySelectorAll ? [] : Array.from(r.querySelectorAll("option")).map((t) => {
    const e = t.hasAttribute("value") ? t.getAttribute("value") : t.textContent.trim();
    if (e === "") return null;
    const i = t.parentElement && t.parentElement.tagName === "OPTGROUP" ? t.parentElement : null;
    return Jt({
      value: e,
      label: t.getAttribute("label") || t.textContent.trim() || e,
      group: i ? i.label : t.getAttribute("data-group") || void 0,
      disabled: t.disabled || !!(i && i.disabled),
      icon: t.getAttribute("data-icon") || void 0,
      description: t.getAttribute("data-description") || void 0
    });
  }).filter(Boolean);
}
class ya extends g {
  /**
   * Crea una instancia del Autocomplete.
   *
   * @param {HTMLElement} element `<input>`, `<select>` o contenedor `.mtx-autocomplete`.
   * @throws {TypeError} Si no hay un `<input>` o `<select>` utilizable.
   */
  constructor(t) {
    let e = t, i = null;
    if (t instanceof HTMLInputElement || t instanceof HTMLSelectElement ? (i = t, e = t.closest(".mtx-autocomplete"), e || (e = document.createElement("div"), e.className = "mtx-autocomplete", t.getAttribute("class") && (e.className += ` ${t.getAttribute("class")}`), t.parentNode && t.parentNode.insertBefore(e, t))) : i = t.querySelector("select") || t.querySelector('input:not([type="hidden"])'), !i) throw new TypeError("Autocomplete requiere un <input> o <select>.");
    super(e), e.classList.add("mtx-autocomplete"), this._configSource = i, this._source = i, this._timers = /* @__PURE__ */ new Set(), this._readConfig(), this._buildInput(i), this._buildField(), this._buildAdornments(), this._buildPopup(), this._loadOptions(i), this._loadInitialValue(i), this._bindEvents(), i instanceof HTMLSelectElement && i.parentNode && i.remove(), et(this.input, this), this.input !== i && et(i, this), this.loading = this._flag("data-loading"), this._syncDisabled(), this._resetInputValue(!1), this._syncState();
  }
  // ------------------------------------------------------------------
  // Configuración y construcción
  // ------------------------------------------------------------------
  /**
   * Lee un atributo de configuración del contenedor o del elemento de origen.
   *
   * @param {string} name Nombre del atributo.
   * @returns {string|null} Valor o `null`.
   */
  _cfg(t) {
    if (this.element.hasAttribute(t)) return this.element.getAttribute(t);
    const e = this._configSource;
    return e && e.hasAttribute(t) ? e.getAttribute(t) : null;
  }
  /**
   * Interpreta un atributo booleano (`data-x`, `data-x="true"`; `"false"` lo desactiva).
   *
   * @param {string} name Nombre del atributo.
   * @returns {boolean} Valor booleano.
   */
  _flag(t) {
    const e = this._cfg(t);
    return e !== null && e !== "false";
  }
  /** Lee todas las opciones de comportamiento desde `data-*`. */
  _readConfig() {
    const t = this._configSource;
    this.multiple = this._flag("data-multiple") || t instanceof HTMLSelectElement && t.multiple, this.freeSolo = this._flag("data-free-solo"), this.disableCloseOnSelect = this._flag("data-disable-close-on-select"), this.clearOnEscape = this._flag("data-clear-on-escape"), this.disableClearable = this._flag("data-disable-clearable"), this.autoHighlight = this._flag("data-auto-highlight"), this.autoSelect = this._flag("data-auto-select"), this.openOnFocus = this._flag("data-open-on-focus"), this.filterSelectedOptions = this._flag("data-filter-selected-options"), this.selectOnFocus = !this.freeSolo, this.handleHomeEndKeys = !this.freeSolo;
    const e = parseInt(this._cfg("data-limit-tags"), 10);
    this.limitTags = Number.isFinite(e) && e >= 0 ? e : -1, this.matchFrom = this._cfg("data-match-from") === "start" ? "start" : "any";
    const i = this._cfg("data-filter");
    this.filterEnabled = i !== "false" && i !== "none";
    const s = parseInt(this._cfg("data-debounce"), 10);
    this.debounce = Number.isFinite(s) && s > 0 ? s : 0, this.valueFormat = this._cfg("data-value-format") === "csv" ? "csv" : "multiple", this.separator = this._cfg("data-separator") ?? ",";
    const a = this._cfg("data-force-popup-icon");
    this.hasPopupIcon = a === null ? !this.freeSolo : a !== "false", this.small = this._cfg("data-size") === "small" || this._flag("data-small");
    const n = this._cfg("data-color");
    this.color = ["secondary", "error", "warning", "info", "success"].includes(n) ? n : "primary", this.required = !!t.required || this._flag("data-required"), this.readOnly = t.hasAttribute("readonly") || this._flag("data-read-only") || this._flag("data-readonly"), this._disabled = !!t.disabled || this._flag("data-disabled");
  }
  /**
   * Prepara el `<input>` visible (lo crea si el origen es un `<select>`).
   *
   * @param {HTMLInputElement|HTMLSelectElement} source Elemento de origen.
   */
  _buildInput(t) {
    let e = t;
    t instanceof HTMLSelectElement && (e = this.element.querySelector("input.mtx-autocomplete__input") || document.createElement("input"), e.type = "text", ["id", "placeholder", "aria-label", "aria-labelledby", "aria-describedby", "form", "autofocus"].forEach((i) => {
      t.hasAttribute(i) && !e.hasAttribute(i) && e.setAttribute(i, t.getAttribute(i));
    }), t.id && t.removeAttribute("id"), !e.parentNode && t.parentNode && t.parentNode.insertBefore(e, t)), this.input = e, e.id || (e.id = P("mtx-autocomplete")), this._id = e.id, this.name = t.getAttribute("name") || this._cfg("data-name") || null, e.hasAttribute("name") && e.removeAttribute("name"), this._formAttr = t.getAttribute("form"), this._listId = e.getAttribute("list"), this._listId && e.removeAttribute("list"), e.removeAttribute("required"), e.required = !1, e.disabled = !1, e.classList.add("mtx-autocomplete__input"), e.setAttribute("role", "combobox"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-expanded", "false"), e.setAttribute("autocomplete", "off"), e.setAttribute("autocapitalize", "none"), e.setAttribute("spellcheck", "false"), this.readOnly && (e.readOnly = !0);
  }
  /** Envuelve el input en un TextField (variantes, tamaños, label, helper y error). */
  _buildField() {
    let t = this.element.querySelector(".mtx-text-field");
    t || (t = document.createElement("div"), t.className = "mtx-text-field", this.input.parentNode && this.element.contains(this.input) ? this.input.parentNode.insertBefore(t, this.input) : this.element.appendChild(t), t.appendChild(this.input)), t.classList.add("mtx-autocomplete__field"), Bn.forEach((i) => {
      const s = this._cfg(i);
      s !== null && !t.hasAttribute(i) && t.setAttribute(i, s);
    }), this.small && !t.hasAttribute("data-size") && t.setAttribute("data-size", "small"), this.textField = L(t) instanceof yt ? L(t) : new yt(t), this.field = t, this.container = this.textField.container, this.container.classList.add("mtx-autocomplete__input-root"), this.label = this.textField.label || null, this.label && !this.label.id && (this.label.id = `${this._id}-label`);
    const e = this.textField._syncAria.bind(this.textField);
    this.textField._syncAria = () => {
      e(), this.multiple && this._values && this._values.length && this.field.classList.add("mtx-text-field--has-value");
    };
  }
  /** Crea el adorno final (cargando, limpiar, abrir), los valores ocultos y la región viva. */
  _buildAdornments() {
    this.element.querySelectorAll(
      ".mtx-autocomplete__end-adornment, .mtx-autocomplete__values, .mtx-autocomplete__live"
    ).forEach((e) => e.remove()), this.container.querySelectorAll(".mtx-autocomplete__tag, .mtx-autocomplete__tag-more").forEach((e) => e.remove());
    const t = document.createElement("span");
    t.className = "mtx-autocomplete__end-adornment", this.loadingSlot = document.createElement("span"), this.loadingSlot.className = "mtx-autocomplete__loading-indicator", this.loadingSlot.hidden = !0, this.clearButton = this._createIndicator("clear", Fn), this.popupButton = this._createIndicator("popup", Rn), this.popupButton.hidden = !this.hasPopupIcon, t.append(this.loadingSlot, this.clearButton, this.popupButton), this.container.appendChild(t), this.endAdornment = t, this.valuesHost = document.createElement("span"), this.valuesHost.className = "mtx-autocomplete__values", this.valuesHost.hidden = !0, this.element.appendChild(this.valuesHost), this.live = document.createElement("div"), this.live.className = "mtx-autocomplete__live", this.live.setAttribute("role", "status"), this.live.setAttribute("aria-live", "polite"), this.live.setAttribute("aria-atomic", "true"), this.element.appendChild(this.live), this._refreshTexts();
  }
  /**
   * Crea un botón indicador (limpiar o abrir) fuera del orden de tabulación, como MUI.
   *
   * @param {'clear'|'popup'} kind Tipo de indicador.
   * @param {string} svg Icono SVG.
   * @returns {HTMLButtonElement} Botón creado.
   */
  _createIndicator(t, e) {
    const i = document.createElement("button");
    return i.type = "button", i.tabIndex = -1, i.className = `mtx-autocomplete__indicator mtx-autocomplete__${t}-indicator`, i.innerHTML = e, i;
  }
  /** Crea la superficie flotante (Paper + listbox + mensaje de estado). */
  _buildPopup() {
    this.popper = document.createElement("div"), this.popper.className = `mtx-autocomplete__popper mtx-autocomplete__popper--${this.color}`, this.paper = document.createElement("div"), this.paper.className = "mtx-autocomplete__paper", this.listbox = document.createElement("ul"), this.listbox.className = "mtx-autocomplete__listbox", this.listbox.id = `${this._id}-listbox`, this.listbox.setAttribute("role", "listbox"), this.label ? this.listbox.setAttribute("aria-labelledby", this.label.id) : this.input.getAttribute("aria-label") && this.listbox.setAttribute("aria-label", this.input.getAttribute("aria-label")), this.multiple && this.listbox.setAttribute("aria-multiselectable", "true"), this.status = document.createElement("div"), this.status.className = "mtx-autocomplete__status", this.paper.append(this.listbox, this.status), this.popper.appendChild(this.paper), this._optionEls = [];
  }
  /**
   * Carga las opciones iniciales: `<select>`, `data-options` (selector o JSON) o `list`.
   *
   * @param {HTMLElement} source Elemento de origen.
   */
  _loadOptions(t) {
    let e = [];
    const i = this._cfg("data-options");
    if (t instanceof HTMLSelectElement)
      e = Gt(t);
    else if (i && i.trim().startsWith("["))
      try {
        e = JSON.parse(i);
      } catch (s) {
        console.warn("[Materix UI] Autocomplete: data-options no es un JSON válido.", s);
      }
    else if (i) {
      let s = null;
      try {
        s = document.querySelector(i);
      } catch {
        s = null;
      }
      e = Gt(s);
    } else this._listId ? e = Gt(document.getElementById(this._listId)) : e = Gt(this.element.querySelector("datalist"));
    this._options = (Array.isArray(e) ? e : []).map(Jt).filter(Boolean), this._filtered = [], this._highlighted = -1;
  }
  /**
   * Determina el valor inicial (`data-value`, `value` del input u opciones `selected`).
   *
   * @param {HTMLElement} source Elemento de origen.
   */
  _loadInitialValue(t) {
    let e = this._cfg("data-value");
    if (e === null)
      if (t instanceof HTMLSelectElement) {
        const s = Array.from(t.options).filter((a) => a.defaultSelected && a.value !== "").map((a) => a.value);
        e = this.multiple ? s : s[0] ?? "";
      } else
        e = t.value || "";
    let i = e;
    if (typeof e == "string") {
      const s = e.trim();
      if (!s) i = [];
      else if (this.multiple && s.startsWith("["))
        try {
          i = JSON.parse(s);
        } catch {
          i = [s];
        }
      else this.multiple ? i = s.split(this.separator).map((a) => a.trim()).filter(Boolean) : i = [s];
    }
    this._values = this._resolveValues(i), this.multiple || (this._values = this._values.slice(0, 1)), this._initialValues = this._values.slice(), this._syncHiddenInputs();
  }
  // ------------------------------------------------------------------
  // Eventos
  // ------------------------------------------------------------------
  /** Registra todos los listeners (se retiran solos en `destroy()`). */
  _bindEvents() {
    this._selectOnFocusPending = !0, this.listen(this.input, "input", (t) => this._onInput(t)), this.listen(this.input, "keydown", (t) => this._onKeyDown(t)), this.listen(this.input, "focus", () => this._onFocus()), this.listen(this.input, "blur", (t) => this._onBlur(t)), this.listen(this.input, "mousedown", (t) => this._onInputMouseDown(t)), this.listen(this.input, "click", () => {
      this.selectOnFocus && this._selectOnFocusPending && this.input.selectionStart === this.input.selectionEnd && this.input.value && this.input.select(), this._selectOnFocusPending = !1;
    }), this.listen(this.container, "mousedown", (t) => {
      t.target !== this.input && (t.target.closest(".mtx-autocomplete__tag, .mtx-autocomplete__indicator") || (t.preventDefault(), !this._disabled && (document.activeElement !== this.input && this.input.focus(), this._onInputMouseDown(t))));
    }), this.listen(this.clearButton, "mousedown", (t) => t.preventDefault()), this.listen(this.clearButton, "click", () => {
      this._disabled || this.readOnly || (this.input.focus(), this._clear("clear"));
    }), this.listen(this.popupButton, "mousedown", (t) => t.preventDefault()), this.listen(this.popupButton, "click", () => {
      this._disabled || this.readOnly || (this.input.focus(), this._setOpen(!this._open, "toggleInput"));
    }), this.listen(this.popper, "mousedown", (t) => t.preventDefault()), this.listen(this.popper, "click", (t) => {
      const e = t.target.closest(".mtx-autocomplete__option");
      if (!e || e.getAttribute("aria-disabled") === "true") return;
      const i = this._filtered[Number(e.dataset.optionIndex)];
      i && this._selectOption(i, "selectOption");
    }), this.listen(this.popper, "mousemove", (t) => {
      const e = t.target.closest(".mtx-autocomplete__option");
      if (!e || e.getAttribute("aria-disabled") === "true") return;
      const i = Number(e.dataset.optionIndex);
      i !== this._highlighted && this._setHighlight(i, { scroll: !1, reason: "mouse" });
    }), this.listen(this.element, "mtx:chip:delete", (t) => {
      const e = t.target.closest(".mtx-autocomplete__tag");
      !e || this._disabled || this.readOnly || (t.stopPropagation(), this._removeValueAt(Number(e.dataset.tagIndex)), this.input.focus());
    }), this.listen(this.element, "keydown", (t) => this._onTagKeyDown(t)), this.listen(this.element, "focusin", () => this._setFocused(!0)), this.listen(this.element, "focusout", (t) => {
      t.relatedTarget && this.element.contains(t.relatedTarget) || this._setFocused(!1);
    }), this.listen(document, "mtx:localechange", () => this._refreshTexts()), this.input.form && this.listen(this.input.form, "reset", () => {
      this._defer(() => {
        this._values = this._initialValues.slice(), this._afterValueChange(), this._resetInputValue(!1), this._setOpen(!1, "reset");
      }, 0);
    });
  }
  /**
   * Programa un temporizador que se cancela en `destroy()`.
   *
   * @param {Function} fn Función a ejecutar.
   * @param {number} ms Milisegundos.
   * @returns {number} Identificador del temporizador.
   */
  _defer(t, e) {
    const i = setTimeout(() => {
      this._timers.delete(i), t();
    }, e);
    return this._timers.add(i), i;
  }
  /**
   * Gestiona la escritura: filtra, abre el popup y emite `mtx:autocomplete:input`.
   */
  _onInput() {
    const t = this.input.value;
    !this._open && t !== "" && this._setOpen(!0, "input", { silentRefresh: !0 }), this._dirty = !0, t === "" && !this.multiple && !this.disableClearable && this._values.length && this._setValues([], "clear"), this._emitInput("input"), this._refresh(), this._syncState();
  }
  /**
   * Emite `mtx:autocomplete:input`, con debounce opcional (`data-debounce`) para escritura.
   *
   * @param {string} reason `input`, `reset` o `clear`.
   */
  _emitInput(t) {
    const e = () => v(this.element, "mtx:autocomplete:input", { inputValue: this.input.value, reason: t });
    t === "input" && this.debounce ? (this._debounceTimer && (clearTimeout(this._debounceTimer), this._timers.delete(this._debounceTimer)), this._debounceTimer = this._defer(e, this.debounce)) : e();
  }
  /**
   * Clic sobre el input: alterna el popup (como `handleInputMouseDown` de MUI).
   *
   * @param {MouseEvent} event Evento de ratón.
   */
  _onInputMouseDown(t) {
    t.button !== void 0 && t.button !== 0 || this._disabled || this.readOnly || (this.input.value === "" || !this._open) && this._setOpen(!this._open, "toggleInput");
  }
  /** Foco en el input: abre si `data-open-on-focus`. */
  _onFocus() {
    this._setFocused(!0), this.openOnFocus && !this._open && this._setOpen(!0, "focus");
  }
  /**
   * Pérdida de foco: autoSelect, confirmación en free solo o restauración del texto.
   */
  _onBlur() {
    if (this._selectOnFocusPending = !0, this._disabled) return;
    const t = this._highlighted >= 0 ? this._filtered[this._highlighted] : null;
    if (this._open && this.autoSelect && t && !t.disabled)
      this._selectOption(t, "blur");
    else if (this.freeSolo && !this.multiple) {
      const e = this.input.value, i = this._values[0];
      e !== "" && (!i || i.label !== e) && this._setValues([this._freeOption(e)], "createOption");
    } else this.freeSolo || this._resetInputValue();
    this._setOpen(!1, "blur"), this._syncState();
  }
  /**
   * Teclado del combobox (patrón WAI-ARIA + atajos de MUI).
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeyDown(t) {
    if (!(t.isComposing || t.keyCode === 229 || this._disabled))
      switch (t.key) {
        case "Home":
        case "End":
          this._open && this.handleHomeEndKeys && this._filtered.length && (t.preventDefault(), this._setHighlight(this._nextIndex(t.key === "Home" ? "start" : "end")));
          break;
        case "PageUp":
        case "PageDown":
          t.preventDefault(), this._openOrMove(t.key === "PageUp" ? -zi : zi);
          break;
        case "ArrowDown":
        case "ArrowUp":
          t.preventDefault(), this._openOrMove(t.key === "ArrowUp" ? -1 : 1);
          break;
        case "ArrowLeft":
          if (this.multiple && this._values.length && this.input.selectionStart === 0 && this.input.selectionEnd === 0) {
            const e = this._tagElements();
            e.length && (t.preventDefault(), e[e.length - 1].focus());
          }
          break;
        case "Enter": {
          const e = this._open && this._highlighted >= 0 ? this._filtered[this._highlighted] : null;
          e ? (t.preventDefault(), e.disabled || this._selectOption(e, "selectOption")) : this.freeSolo && this.input.value !== "" && !this._inputIsSelectedValue() && (this.multiple && t.preventDefault(), this._selectOption(this._freeOption(this.input.value), "createOption"));
          break;
        }
        case "Escape":
          if (this._open) {
            Ws() === this && (si(t), t.stopPropagation(), this._setOpen(!1, "escape"));
            break;
          }
          this.clearOnEscape && !this.readOnly && (this.input.value !== "" || this.multiple && this._values.length) && (t.preventDefault(), t.stopPropagation(), this._clear("clear"));
          break;
        case "Backspace":
          this.multiple && !this.readOnly && this.input.value === "" && this._values.length && (t.preventDefault(), this._removeValueAt(this._values.length - 1));
          break;
        case "Tab": {
          const e = this._open && this._highlighted >= 0 ? this._filtered[this._highlighted] : null;
          this.autoSelect && e && !e.disabled && this._selectOption(e, "selectOption");
          break;
        }
      }
  }
  /**
   * Teclado sobre los chips: flechas para moverse y volver al input.
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onTagKeyDown(t) {
    const e = t.target.closest && t.target.closest(".mtx-autocomplete__tag");
    if (!e) return;
    const i = this._tagElements(), s = i.indexOf(e);
    t.key === "ArrowLeft" && s > 0 ? (t.preventDefault(), i[s - 1].focus()) : t.key === "ArrowRight" && (t.preventDefault(), s < i.length - 1 ? i[s + 1].focus() : this.input.focus());
  }
  /**
   * Abre el popup o, si ya está abierto, mueve la opción activa.
   *
   * @param {number} diff Desplazamiento (±1 o ±PAGE_SIZE).
   */
  _openOrMove(t) {
    if (!this._open) {
      this._setOpen(!0, "keyboard");
      return;
    }
    this._setHighlight(this._nextIndex(t));
  }
  /**
   * Calcula el siguiente índice activo saltando opciones deshabilitadas.
   *
   * @param {number|'start'|'end'} diff Desplazamiento o extremo.
   * @returns {number} Índice o `-1`.
   */
  _nextIndex(t) {
    const e = this._filtered.length;
    if (!e) return -1;
    const i = e - 1;
    let s, a;
    t === "start" ? (s = 0, a = 1) : t === "end" ? (s = i, a = -1) : (a = t > 0 ? 1 : -1, s = this._highlighted + t, s < 0 ? s = Math.abs(t) > 1 ? 0 : i : s > i && (s = Math.abs(t) > 1 ? i : 0));
    for (let n = 0; n < e; n += 1) {
      if (!this._filtered[s].disabled) return s;
      s = (s + a + e) % e;
    }
    return -1;
  }
  // ------------------------------------------------------------------
  // Estado: apertura, filtrado, render
  // ------------------------------------------------------------------
  /**
   * Abre o cierra el popup.
   *
   * @param {boolean} open Estado deseado.
   * @param {string} [reason] Motivo (`keyboard`, `toggleInput`, `escape`, `blur`, `selectOption`…).
   * @param {{silentRefresh?: boolean}} [options] Evita el refresco (lo hace quien llama).
   */
  _setOpen(t, e = "api", i = {}) {
    t && (this._disabled || this.readOnly) || !!t != !!this._open && (this._open = !!t, this._open ? (X(this, {
      kind: "popup",
      nodes: () => [this.popper, this.element],
      stack: () => [{ node: Ct() }],
      onEscape: () => this._setOpen(!1, "escape")
    }), this._dirty = !1, i.silentRefresh ? this._renderPopup() : this._refresh({ sync: !0 }), v(this.element, "mtx:autocomplete:open", { reason: e })) : (q(this), this._setHighlight(-1, { silent: !0 }), this._renderPopup(), v(this.element, "mtx:autocomplete:close", { reason: e })));
  }
  /**
   * Indica si el texto visible coincide con la etiqueta del valor (selección única).
   *
   * @returns {boolean} `true` si coincide.
   */
  _inputIsSelectedValue() {
    return !this.multiple && this._values.length > 0 && this.input.value === this._values[0].label;
  }
  /**
   * Aplica el filtro (sin tildes ni mayúsculas) sobre las opciones.
   *
   * @returns {Object[]} Opciones visibles.
   */
  _computeFiltered() {
    let t = this._options;
    this.multiple && this.filterSelectedOptions && (t = t.filter((s) => !this._isSelected(s)));
    const e = this._inputIsSelectedValue() && !this._dirty ? "" : this.input.value;
    this._query = this.filterEnabled ? e : "";
    const i = dt(e);
    return !this.filterEnabled || !i.trim() ? t.slice() : t.filter((s) => {
      const a = dt(s.label);
      return this.matchFrom === "start" ? a.startsWith(i) : a.includes(i);
    });
  }
  /**
   * Recalcula las opciones filtradas y, si está abierto, vuelve a pintar la lista.
   *
   * @param {{sync?: boolean, keepValue?: string|null}} [options] Sincroniza la opción activa con el valor.
   */
  _refresh({ sync: t = !1, keepValue: e = null } = {}) {
    if (this._filtered = this._computeFiltered(), this._open) {
      this._renderListbox();
      let i = -1;
      if (e !== null)
        i = this._filtered.findIndex((s) => s.value === e && !s.disabled);
      else if (t && this._values.length) {
        const s = this._values[0];
        i = this._filtered.findIndex((a) => a.value === s.value && !a.disabled);
      }
      i === -1 && this.autoHighlight && (i = this._nextIndex("start")), this._highlighted = -1, this._setHighlight(i, { reason: "auto" }), this._announce();
    }
    this._renderPopup();
  }
  /** Pinta las opciones filtradas (con grupos, iconos, descripción y resaltado). */
  _renderListbox() {
    this.listbox.textContent = "";
    let t = null, e;
    this._optionEls = this._filtered.map((i, s) => {
      let a = this.listbox;
      if (i.group !== void 0) {
        if (i.group !== e || !t) {
          e = i.group;
          const l = document.createElement("li");
          l.className = "mtx-autocomplete__group", l.setAttribute("role", "presentation");
          const o = document.createElement("div");
          o.className = "mtx-autocomplete__group-label", o.id = `${this._id}-group-${s}`, o.textContent = i.group, t = document.createElement("ul"), t.className = "mtx-autocomplete__group-list", t.setAttribute("role", "group"), t.setAttribute("aria-labelledby", o.id), l.append(o, t), this.listbox.appendChild(l);
        }
        a = t;
      } else
        e = void 0, t = null;
      const n = this._createOptionElement(i, s);
      return a.appendChild(n), n;
    });
  }
  /**
   * Crea el `<li role="option">` de una opción.
   *
   * @param {Object} opt Opción.
   * @param {number} index Índice en la lista filtrada.
   * @returns {HTMLLIElement} Elemento creado.
   */
  _createOptionElement(t, e) {
    const i = document.createElement("li");
    i.id = `${this._id}-option-${e}`, i.className = "mtx-autocomplete__option", i.setAttribute("role", "option"), i.dataset.optionIndex = String(e);
    const s = this._isSelected(t);
    if (i.setAttribute("aria-selected", String(s)), t.disabled && (i.setAttribute("aria-disabled", "true"), i.classList.add("mtx-autocomplete__option--disabled")), t.icon) {
      const l = document.createElement("span");
      l.className = "mtx-autocomplete__option-icon material-icons", l.setAttribute("aria-hidden", "true"), l.textContent = t.icon, i.appendChild(l);
    }
    const a = document.createElement("span");
    a.className = "mtx-autocomplete__option-content";
    const n = document.createElement("span");
    if (n.className = "mtx-autocomplete__option-label", this._appendHighlighted(n, t.label), a.appendChild(n), t.description) {
      const l = document.createElement("span");
      l.className = "mtx-autocomplete__option-description", l.textContent = t.description, a.appendChild(l);
    }
    return i.appendChild(a), i;
  }
  /**
   * Inserta el texto marcando en negrita el fragmento que coincide con la búsqueda.
   *
   * @param {HTMLElement} target Nodo destino.
   * @param {string} text Texto de la opción.
   */
  _appendHighlighted(t, e) {
    const i = this._query ? Hn(e, this._query, this.matchFrom === "start") : null;
    if (!i) {
      t.textContent = e;
      return;
    }
    const s = document.createElement("mark");
    s.className = "mtx-autocomplete__highlight", s.textContent = e.slice(i.start, i.end), t.append(e.slice(0, i.start), s, e.slice(i.end));
  }
  /** Muestra u oculta la superficie flotante según opciones, carga y free solo. */
  _renderPopup() {
    const t = this._filtered.length > 0, e = !t && (this._loading || !this.freeSolo), i = !!this._open && (t || e);
    this.element.classList.toggle("mtx-autocomplete--open", !!this._open), this.input.setAttribute("aria-expanded", String(!!this._open && t)), this._open && t ? this.input.setAttribute("aria-controls", this.listbox.id) : this.input.removeAttribute("aria-controls"), this._refreshPopupLabel(), i ? (this.listbox.hidden = !t, this.status.hidden = t, t || (this.status.textContent = this._loading ? this._text("loading") : this._text("noOptions"), this.status.classList.toggle("mtx-autocomplete__status--loading", !!this._loading)), this.listbox.setAttribute("aria-busy", String(!!this._loading)), this.popper.isConnected ? this._position() : (Ct().appendChild(this.popper), this._stopAutoUpdate = Nt(this.container, this.popper, () => this._position()))) : this.popper.isConnected && (this._stopAutoUpdate && this._stopAutoUpdate(), this._stopAutoUpdate = null, this.popper.remove());
  }
  /** Coloca el popup bajo el campo (o encima si no cabe), con el ancho del campo. */
  _position() {
    if (!this.popper.isConnected) return;
    const t = this.container.getBoundingClientRect();
    this.popper.style.width = `${t.width}px`;
    const { x: e, y: i, side: s } = Vt(this.container, this.popper, {
      placement: "bottom-start",
      offset: 4,
      flip: !0,
      shift: !0,
      padding: 8
    });
    this.popper.style.left = `${e}px`, this.popper.style.top = `${i}px`, this.popper.dataset.placement = s;
  }
  /**
   * Activa una opción (clase visual + `aria-activedescendant`) y la desplaza a la vista.
   *
   * @param {number} index Índice o `-1` para ninguna.
   * @param {{scroll?: boolean, reason?: string, silent?: boolean}} [options] Opciones.
   */
  _setHighlight(t, { scroll: e = !0, reason: i = "keyboard", silent: s = !1 } = {}) {
    const a = this._highlighted, n = this._optionEls[a];
    n && n.classList.remove("mtx-autocomplete__option--focused");
    const l = t >= 0 ? this._optionEls[t] : null;
    this._highlighted = l ? t : -1, this._highlighted === -1 && a === -1 && (s = !0), l ? (l.classList.add("mtx-autocomplete__option--focused"), this.input.setAttribute("aria-activedescendant", l.id), e && i !== "mouse" && this._scrollIntoView(l)) : this.input.removeAttribute("aria-activedescendant"), s || v(this.element, "mtx:autocomplete:highlight", {
      option: l ? this._filtered[t] : null,
      reason: i
    });
  }
  /**
   * Desplaza el listbox para mostrar la opción (deja hueco para la cabecera de grupo fija).
   *
   * @param {HTMLElement} el Opción activa.
   */
  _scrollIntoView(t) {
    const e = this.listbox;
    if (e.scrollHeight <= e.clientHeight) return;
    const i = this._filtered.some((n) => n.group !== void 0), s = t.offsetTop - (i ? t.offsetHeight * 1.3 : 0), a = t.offsetTop + t.offsetHeight;
    a > e.scrollTop + e.clientHeight ? e.scrollTop = a - e.clientHeight : s < e.scrollTop && (e.scrollTop = Math.max(0, s));
  }
  /** Anuncia en la región viva el número de resultados (con retardo para no saturar). */
  _announce() {
    this._announceTimer && (clearTimeout(this._announceTimer), this._timers.delete(this._announceTimer)), this._announceTimer = this._defer(() => {
      if (!this._open) return;
      const t = this._filtered.length;
      t ? this.live.textContent = t === 1 ? this._text("result") : this._text("results", [t]) : this.live.textContent = this._loading ? this._text("loading") : this._text("noOptions");
    }, 300);
  }
  // ------------------------------------------------------------------
  // Valor
  // ------------------------------------------------------------------
  /**
   * Indica si una opción forma parte del valor.
   *
   * @param {Object} opt Opción.
   * @returns {boolean} `true` si está seleccionada.
   */
  _isSelected(t) {
    return this._values.some((e) => e.value === t.value);
  }
  /**
   * Busca o crea opciones para una lista de valores (texto, objetos u opciones).
   *
   * @param {Array} list Valores.
   * @returns {Object[]} Opciones resueltas.
   */
  _resolveValues(t) {
    const e = /* @__PURE__ */ new Set();
    return (Array.isArray(t) ? t : [t]).map((i) => {
      if (i == null || i === "") return null;
      const s = String(typeof i == "object" ? i.value ?? i.label ?? "" : i), a = this._options.find((c) => c.value === s);
      if (a) return a;
      const n = dt(s), l = this._options.find((c) => dt(c.label) === n);
      if (l) return l;
      const o = Jt(i);
      return o && this.freeSolo && (o.freeSolo = !0), o;
    }).filter((i) => !i || e.has(i.value) ? !1 : (e.add(i.value), !0));
  }
  /**
   * Opción para un texto libre (reutiliza una opción con la misma etiqueta).
   *
   * @param {string} text Texto escrito.
   * @returns {Object} Opción.
   */
  _freeOption(t) {
    const e = dt(t);
    return this._options.find((s) => dt(s.label) === e) || { value: t, label: t, freeSolo: !0 };
  }
  /**
   * Selecciona (o alterna, en múltiple) una opción tras una interacción.
   *
   * @param {Object} option Opción elegida.
   * @param {string} reason Motivo (`selectOption`, `createOption`, `blur`).
   */
  _selectOption(t, e) {
    if (this.readOnly) return;
    let i, s = e;
    if (this.multiple) {
      const a = this._values.findIndex((n) => n.value === t.value);
      a === -1 ? i = [...this._values, t] : e === "createOption" ? i = this._values : (i = this._values.filter((n, l) => l !== a), s = "removeOption");
    } else
      i = [t];
    this._setValues(i, s, t), this._resetInputValue(), this.multiple && this.disableCloseOnSelect ? (this._dirty = !1, this._refresh({ keepValue: t.value })) : (this._setOpen(!1, e === "createOption" ? "createOption" : "selectOption"), this._refresh()), this._syncState();
  }
  /**
   * Quita el valor en una posición (múltiple).
   *
   * @param {number} index Índice del chip.
   */
  _removeValueAt(t) {
    var i;
    const e = this._values[t];
    e && (this._setValues(this._values.filter((s, a) => a !== t), "removeOption", e), this._refresh({ keepValue: this._highlighted >= 0 ? ((i = this._filtered[this._highlighted]) == null ? void 0 : i.value) ?? null : null }), this._syncState());
  }
  /**
   * Vacía el valor y el texto.
   *
   * @param {string} reason Motivo del cambio.
   */
  _clear(t) {
    this.input.value !== "" && (this.input.value = "", this._emitInput("clear")), this._setValues([], t), this._dirty = !1, this._refresh(), this._syncState();
  }
  /**
   * Sustituye el valor y emite `mtx:autocomplete:change` si cambió.
   *
   * @param {Object[]} next Nuevas opciones seleccionadas.
   * @param {string} reason Motivo.
   * @param {Object} [option] Opción afectada.
   * @param {boolean} [silent=false] No emite evento (cambios por API).
   * @returns {boolean} `true` si el valor cambió.
   */
  _setValues(t, e, i = null, s = !1) {
    const a = this._values.map((l) => l.value).join("\0"), n = t.map((l) => l.value).join("\0");
    if (this._values = t.slice(), this._afterValueChange(), a === n) return !1;
    if (!s) {
      const l = this.multiple ? { value: this.value, options: this.selectedOptions, option: i, reason: e } : { value: this.value, option: this.selectedOption, reason: e };
      v(this.element, "mtx:autocomplete:change", l);
    }
    return !0;
  }
  /** Sincroniza todo lo que depende del valor (inputs ocultos, chips, label, validez). */
  _afterValueChange() {
    this._syncHiddenInputs(), this._renderTags(), this.textField._syncAria(), this._syncState();
  }
  /**
   * Restablece el texto visible al valor (etiqueta en único, vacío en múltiple).
   *
   * @param {boolean} [notify=true] Emite `mtx:autocomplete:input` con `reason: 'reset'`.
   */
  _resetInputValue(t = !0) {
    const e = !this.multiple && this._values[0] ? this._values[0].label : "";
    this.input.value !== e && (this.input.value = e, t && this._emitInput("reset")), this.textField._syncAria();
  }
  /** Crea los inputs ocultos con `name` (uno por valor, o CSV con `data-value-format="csv"`). */
  _syncHiddenInputs() {
    if (this.valuesHost.textContent = "", !this.name) return;
    const t = this._values.map((i) => i.value), e = (i) => {
      const s = document.createElement("input");
      s.type = "hidden", s.name = this.name, s.value = i, this._formAttr && s.setAttribute("form", this._formAttr), s.disabled = !!this._disabled, this.valuesHost.appendChild(s);
    };
    this.multiple ? this.valueFormat === "csv" ? e(t.join(this.separator)) : t.forEach(e) : e(t[0] ?? "");
  }
  /** Pinta los chips de la selección múltiple (respeta `data-limit-tags` sin foco). */
  _renderTags() {
    if (this._tagElements().forEach((s) => {
      const a = L(s);
      a && typeof a.destroy == "function" && a.destroy(), s.remove();
    }), this.container.querySelectorAll(".mtx-autocomplete__tag-more").forEach((s) => s.remove()), !this.multiple) return;
    const t = this.element.classList.contains("mtx-autocomplete--focused"), e = this.limitTags >= 0 && !t ? this.limitTags : 1 / 0, i = !this._disabled && !this.readOnly;
    if (this._values.forEach((s, a) => {
      if (a >= e) return;
      const n = document.createElement("div");
      n.className = "mtx-autocomplete__tag", n.setAttribute("data-mtx", "chip"), n.setAttribute("data-label", s.label), n.dataset.tagIndex = String(a), this.small && n.setAttribute("data-size", "small"), s.icon && n.setAttribute("data-icon", s.icon), i && n.setAttribute("data-deletable", "");
      const l = new ai(n);
      n.hasAttribute("tabindex") && (n.tabIndex = -1), this._disabled && l.disable(), this.container.insertBefore(n, this.input);
    }), this._values.length > e) {
      const s = document.createElement("span");
      s.className = "mtx-autocomplete__tag-more", s.textContent = this._text("more", [this._values.length - e]), this.container.insertBefore(s, this.input);
    }
  }
  /**
   * Chips actuales en orden.
   *
   * @returns {HTMLElement[]} Elementos `.mtx-autocomplete__tag`.
   */
  _tagElements() {
    return Array.from(this.container.querySelectorAll(".mtx-autocomplete__tag"));
  }
  /**
   * Marca el estado de foco del componente (muestra todos los chips con foco).
   *
   * @param {boolean} focused Estado de foco.
   */
  _setFocused(t) {
    if (this.element.classList.contains("mtx-autocomplete--focused") !== t && (this.element.classList.toggle("mtx-autocomplete--focused", t), this.multiple && this.limitTags >= 0)) {
      const i = document.activeElement;
      i && i.closest && i.closest(".mtx-autocomplete__tag") || this._renderTags();
    }
  }
  /** Clases de estado, botón limpiar, validez y requerido. */
  _syncState() {
    const t = this._values.length > 0 || this.input.value !== "", e = !this.disableClearable && !this._disabled && !this.readOnly && t;
    this.clearButton.hidden = !e, this.element.classList.toggle("mtx-autocomplete--has-clear", e), this.element.classList.toggle("mtx-autocomplete--has-popup", this.hasPopupIcon), this.element.classList.toggle("mtx-autocomplete--has-end", e || this.hasPopupIcon || !!this._loading), this.element.classList.toggle("mtx-autocomplete--multiple", this.multiple), this.element.classList.toggle("mtx-autocomplete--required", this.required), this.element.classList.toggle("mtx-autocomplete--readonly", this.readOnly);
    const i = this._values.length > 0;
    if (this.input.required = this.required && !i, this.required ? this.input.setAttribute("aria-required", "true") : this.input.removeAttribute("aria-required"), this.readOnly && this.input.setAttribute("aria-readonly", "true"), typeof this.input.setCustomValidity == "function") {
      const s = this.required && !i && !this.freeSolo && this.input.value.trim() !== "";
      this.input.setCustomValidity(s ? this._text("invalid") : "");
    }
  }
  /** Aplica el estado deshabilitado a input, botones, chips y valores ocultos. */
  _syncDisabled() {
    const t = !!this._disabled;
    this.input.disabled = t, this.clearButton.disabled = t, this.popupButton.disabled = t, this.element.classList.toggle("mtx-autocomplete--disabled", t), t && this._setOpen(!1, "disabled"), this._syncHiddenInputs(), this._renderTags(), this._syncState();
  }
  // ------------------------------------------------------------------
  // Textos (i18n)
  // ------------------------------------------------------------------
  /**
   * Texto traducido del componente (con anulaciones por `data-*`).
   *
   * @param {string} key Clave del diccionario `autocomplete`.
   * @param {Array} [params] Parámetros de interpolación.
   * @returns {string} Texto.
   */
  _text(t, e = null) {
    const i = { noOptions: "data-no-options-text", loading: "data-loading-text" }, s = i[t] ? this._cfg(i[t]) : null;
    return s || y("autocomplete", t, e, {
      clear: "Clear",
      open: "Open",
      close: "Close",
      noOptions: "No options",
      loading: "Loading…",
      more: "+{0}",
      result: "1 result available",
      results: "{0} results available",
      invalid: "Select an option from the list."
    }[t] ?? t, k(this.element));
  }
  /** Actualiza el nombre accesible del botón abrir/cerrar. */
  _refreshPopupLabel() {
    const t = this._text(this._open ? "close" : "open");
    this.popupButton.setAttribute("aria-label", t), this.popupButton.setAttribute("title", t);
  }
  /** Refresca todos los textos tras un cambio de idioma. */
  _refreshTexts() {
    const t = this._text("clear");
    this.clearButton.setAttribute("aria-label", t), this.clearButton.setAttribute("title", t), this._refreshPopupLabel(), this.popper && this.popper.isConnected && this._renderPopup(), this._values && this._renderTags();
  }
  // ------------------------------------------------------------------
  // API pública
  // ------------------------------------------------------------------
  /**
   * Valor actual: `string` (vacío si no hay selección) o `string[]` en múltiple.
   *
   * @returns {string|string[]} Valor.
   */
  get value() {
    return this.multiple ? this._values.map((t) => t.value) : this._values[0] ? this._values[0].value : "";
  }
  /**
   * Establece el valor sin emitir `mtx:autocomplete:change`.
   *
   * @param {string|string[]|Object|Object[]|null} value Valor(es) u opción(es).
   */
  set value(t) {
    let e = t == null || t === "" ? [] : t;
    Array.isArray(e) || (e = [e]);
    let i = this._resolveValues(e);
    this.multiple || (i = i.slice(0, 1)), this._setValues(i, "api", null, !0), this._resetInputValue(), this._refresh();
  }
  /** @returns {Object|null} Opción seleccionada (selección única). */
  get selectedOption() {
    return this._values[0] ? { ...this._values[0] } : null;
  }
  /** @returns {Object[]} Opciones seleccionadas (copia). */
  get selectedOptions() {
    return this._values.map((t) => ({ ...t }));
  }
  /** @returns {string} Texto escrito en el input. */
  get inputValue() {
    return this.input.value;
  }
  /**
   * Cambia el texto del input y refiltra (sin emitir eventos).
   *
   * @param {string} text Texto nuevo.
   */
  set inputValue(t) {
    this.input.value = t ?? "", this._dirty = !0, this.textField._syncAria(), this._refresh(), this._syncState();
  }
  /** @returns {Object[]} Copia de las opciones disponibles. */
  get options() {
    return this._options.map((t) => ({ ...t }));
  }
  /**
   * Sustituye las opciones (carga asíncrona) y conserva el valor actual.
   *
   * @param {Array<string|Object>} options Opciones `{value, label, group?, disabled?, icon?, description?}`.
   */
  setOptions(t) {
    var i;
    this._options = (Array.isArray(t) ? t : []).map(Jt).filter(Boolean);
    const e = this._values[0] ? this._values[0].label : null;
    this._values = this._values.map((s) => this._options.find((a) => a.value === s.value) || s), this._afterValueChange(), !this.multiple && e !== null && this.input.value === e && this._resetInputValue(!1), this._refresh({ keepValue: this._highlighted >= 0 ? ((i = this._filtered[this._highlighted]) == null ? void 0 : i.value) ?? null : null });
  }
  /** @returns {boolean} `true` si se muestra el indicador de carga. */
  get loading() {
    return !!this._loading;
  }
  /**
   * Activa o desactiva el estado de carga (CircularProgress + texto "Loading…").
   *
   * @param {boolean} value Estado de carga.
   */
  set loading(t) {
    this._loading = !!t, this._loading && !this.loadingSlot.firstChild && this.loadingSlot.appendChild(Ze({ size: 20, color: "inherit", decorative: !0 })), this.loadingSlot.hidden = !this._loading, this.element.classList.toggle("mtx-autocomplete--loading", this._loading), this._syncState(), this._open && (this._renderPopup(), this._announce());
  }
  /**
   * Alias de `loading` para uso encadenado.
   *
   * @param {boolean} value Estado de carga.
   */
  setLoading(t) {
    this.loading = t;
  }
  /** @returns {boolean} `true` si el popup está abierto. */
  get isOpen() {
    return !!this._open;
  }
  /** Abre el popup de opciones. */
  open() {
    this._setOpen(!0, "api");
  }
  /** Cierra el popup de opciones. */
  close() {
    this._setOpen(!1, "api");
  }
  /** Vacía valor y texto (emite `change` con `reason: 'clear'`). */
  clear() {
    this._clear("clear");
  }
  /** Enfoca el input. */
  focus() {
    this.input.focus();
  }
  /** Quita el foco del input. */
  blur() {
    this.input.blur();
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return !!this._disabled;
  }
  /** Deshabilita el componente. */
  disable() {
    this._disabled = !0, this._syncDisabled();
  }
  /** Habilita el componente. */
  enable() {
    this._disabled = !1, this._syncDisabled();
  }
  /**
   * Muestra un error con mensaje (delegado en TextField).
   *
   * @param {string|boolean} message Mensaje, `true` sin mensaje o vacío para limpiar.
   */
  setError(t) {
    this.textField.setError(t);
  }
  /** Limpia el estado de error. */
  clearError() {
    this.textField.clearError();
  }
  /** Libera listeners, temporizadores, chips y el popup. */
  destroy() {
    this.destroyed || (this._timers.forEach((t) => clearTimeout(t)), this._timers.clear(), this._stopAutoUpdate && this._stopAutoUpdate(), this._stopAutoUpdate = null, this.popper.isConnected && this.popper.remove(), this._open = !1, q(this), this.element.classList.remove("mtx-autocomplete--open", "mtx-autocomplete--focused"), this._tagElements().forEach((t) => {
      const e = L(t);
      e && typeof e.destroy == "function" && e.destroy();
    }), this.name && !this.input.hasAttribute("name") && this.input === this._source && (this.input.setAttribute("name", this.name), this.valuesHost.textContent = ""), this.textField && typeof this.textField.destroy == "function" && this.textField.destroy(), Ft(this.input), Ft(this._source), this._source.removeAttribute && this._source.removeAttribute("data-mtx-initialized"), super.destroy());
  }
}
f("autocomplete", ya);
class va extends g {
  /**
   * Crea una instancia de la lista.
   *
   * @param {HTMLElement} element Elemento `<ul>` o `<nav>` asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-list") || t.classList.add("mtx-list"), t.hasAttribute("data-dense") && t.classList.add("mtx-list--dense"), t.hasAttribute("data-nested") && t.classList.add("mtx-list--nested"), t.hasAttribute("data-disable-padding") && t.classList.add("mtx-list--disable-padding");
  }
}
const qn = [
  ".mtx-list-item-icon",
  ".mtx-list-item-avatar",
  ".mtx-list-item-secondary-action",
  ".mtx-ripple-container",
  "[data-mtx]",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "ul",
  "ol",
  "nav"
].join(","), zn = ["option", "tab", "treeitem", "gridcell", "row", "columnheader", "rowheader"];
function Ea(r) {
  const t = document.createElement("span");
  t.className = "mtx-list-item-icon";
  const e = document.createElement("span");
  return e.className = "material-icons", e.setAttribute("aria-hidden", "true"), e.textContent = r, t.appendChild(e), t;
}
function ze(r, t, e, i) {
  const s = document.createElement("span");
  if (s.className = "mtx-list-item-text__primary", e !== null ? s.textContent = e : t.forEach((a) => s.appendChild(a)), r.appendChild(s), i) {
    const a = document.createElement("span");
    a.className = "mtx-list-item-text__secondary", a.textContent = i, r.appendChild(a);
  }
}
function wa(r) {
  const t = r.getAttribute("data-icon");
  t && !r.querySelector(":scope > .mtx-list-item-icon") && r.insertBefore(Ea(t), r.firstChild);
  const e = r.getAttribute("data-avatar");
  if (e && !r.querySelector(":scope > .mtx-list-item-avatar")) {
    const c = document.createElement("span");
    c.className = "mtx-list-item-avatar";
    const d = document.createElement("span");
    d.setAttribute("data-mtx", "avatar"), d.setAttribute("data-src", e), d.setAttribute("data-alt", r.getAttribute("data-avatar-alt") || ""), c.appendChild(d), r.insertBefore(c, r.firstChild);
  }
  if (Array.from(r.children).forEach((c) => {
    if (c.matches('.mtx-avatar, [data-mtx="avatar"]')) {
      const d = document.createElement("span");
      d.className = "mtx-list-item-avatar", r.insertBefore(d, c), d.appendChild(c);
    }
  }), r.querySelector(":scope > .mtx-list-item-text")) return;
  const i = Array.from(r.childNodes).filter((c) => c.nodeType === Node.TEXT_NODE ? !0 : c.nodeType === Node.ELEMENT_NODE && !c.matches(qn)), s = i.some((c) => c.textContent.trim() !== ""), a = r.getAttribute("data-primary"), n = r.getAttribute("data-secondary");
  if (!s && a === null && !n) return;
  const l = document.createElement("span");
  l.className = "mtx-list-item-text";
  const o = i.find((c) => c.textContent.trim() !== "") || Array.from(r.children).find((c) => !c.matches(".mtx-list-item-icon, .mtx-list-item-avatar")) || null;
  r.insertBefore(l, o), a !== null ? (i.forEach((c) => {
    c.textContent.trim() === "" && c.remove();
  }), ze(l, [], a, n)) : ze(l, i, null, n);
}
function le(r, t) {
  r.classList.toggle("mtx-list-item--selected", t);
  const e = r.getAttribute("role") || "";
  if (zn.includes(e)) {
    r.setAttribute("aria-selected", String(t)), r.removeAttribute("aria-current");
    return;
  }
  r.removeAttribute("aria-selected"), t ? r.setAttribute("aria-current", r.tagName === "A" || e === "link" ? "page" : "true") : r.removeAttribute("aria-current");
}
class La extends g {
  /**
   * Crea una instancia del item.
   *
   * @param {HTMLElement} element Elemento `<li>` asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-list-item") || t.classList.add("mtx-list-item"), t.hasAttribute("data-disabled") && t.classList.add("mtx-list-item--disabled"), t.classList.contains("mtx-list-item--disabled") && !t.hasAttribute("aria-disabled") && t.setAttribute("aria-disabled", "true"), (t.hasAttribute("data-dense") || t.closest(".mtx-list--dense")) && t.classList.add("mtx-list-item--dense"), t.hasAttribute("data-disable-padding") && t.classList.add("mtx-list-item--disable-padding"), t.hasAttribute("data-align-start") && t.classList.add("mtx-list-item--align-start"), t.hasAttribute("data-divider") && t.classList.add("mtx-list-item--divider"), t.hasAttribute("data-disable-gutters") && t.classList.add("mtx-list-item--disable-gutters"), wa(t);
  }
}
class ka extends g {
  /**
   * Crea una instancia del item interactivo.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-list-item") || t.classList.add("mtx-list-item"), t.classList.contains("mtx-list-item-button") || t.classList.add("mtx-list-item-button"), this._isLink = t.tagName === "A", (t.hasAttribute("data-dense") || t.closest(".mtx-list--dense")) && t.classList.add("mtx-list-item--dense"), t.hasAttribute("data-disable-gutters") && t.classList.add("mtx-list-item--disable-gutters"), t.hasAttribute("data-divider") && t.classList.add("mtx-list-item--divider"), t.hasAttribute("data-align-start") && t.classList.add("mtx-list-item--align-start"), t.hasAttribute("data-disabled") && this.disable(), wa(t), this._handlePointerDown = (e) => {
      this.disabled || e.button !== 0 || (e._mtxRippleHandled = !0, z(t, e));
    }, t.addEventListener("pointerdown", this._handlePointerDown), (t.hasAttribute("data-selected") || t.classList.contains("mtx-list-item--selected")) && le(t, !0), this._handleClick = (e) => {
      this.disabled && (e.preventDefault(), e.stopPropagation());
    }, t.addEventListener("click", this._handleClick);
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita el item interactivo. */
  disable() {
    this.element.classList.add("mtx-list-item--disabled"), "disabled" in this.element ? this.element.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.tabIndex = -1);
  }
  /** Habilita el item interactivo. */
  enable() {
    this.element.classList.remove("mtx-list-item--disabled"), "disabled" in this.element ? this.element.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.tabIndex = 0);
  }
  /** @returns {boolean} Estado seleccionado. */
  get selected() {
    return this.element.classList.contains("mtx-list-item--selected");
  }
  /** @param {boolean} value Nuevo estado seleccionado (sincroniza `aria-current` / `aria-selected`). */
  set selected(t) {
    le(this.element, !!t);
  }
  /**
   * Destruye la instancia.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
class Sa extends g {
  /**
   * Crea una instancia de la subcabecera.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-list-subheader"), t.hasAttribute("data-inset") && t.classList.add("mtx-list-subheader--inset"), t.hasAttribute("data-sticky") && t.classList.add("mtx-list-subheader--sticky");
  }
}
class Ca extends g {
  /**
   * Crea una instancia del texto; envuelve el contenido en `__primary` si falta.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    if (super(t), t.classList.add("mtx-list-item-text"), t.querySelector(":scope > .mtx-list-item-text__primary")) return;
    const e = t.getAttribute("data-primary"), i = Array.from(t.childNodes);
    e !== null && i.forEach((s) => s.remove()), ze(t, e !== null ? [] : i, e, t.getAttribute("data-secondary"));
  }
}
class Ta extends g {
  /**
   * Crea una instancia; con `data-icon` y sin contenido genera el Material Icon.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-list-item-icon");
    const e = t.getAttribute("data-icon");
    e && t.children.length === 0 && t.textContent.trim() === "" && t.appendChild(Ea(e).firstChild);
  }
}
class Da extends g {
  /**
   * Crea una instancia del contenedor de avatar.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-list-item-avatar");
  }
}
class Ma extends g {
  /**
   * Crea una instancia de la acción secundaria.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-list-item-secondary-action");
  }
}
f("list", va);
f("list-item", La);
f("list-item-button", ka);
f("list-item-text", Ca);
f("list-item-icon", Ta);
f("list-item-avatar", Da);
f("list-item-secondary-action", Ma);
f("list-subheader", Sa);
typeof document < "u" && (document.addEventListener("pointerdown", (r) => {
  if (r._mtxRippleHandled || r.button !== 0) return;
  const t = r.target.closest('.mtx-list-item-button, [data-mtx="list-item-button"]');
  t && (t.classList.contains("mtx-list-item--disabled") || t.disabled || t.getAttribute("aria-disabled") === "true" || (r._mtxRippleHandled = !0, z(t, r)));
}), document.addEventListener("click", (r) => {
  const t = r.target.closest('.mtx-list-item-button, [data-mtx="list-item-button"]');
  if (!t || t.classList.contains("mtx-list-item--disabled") || t.disabled || t.getAttribute("aria-disabled") === "true" || t.hasAttribute("data-no-select") || t.getAttribute("data-selectable") === "false" || t.closest('[data-selectable="false"]'))
    return;
  const e = t.closest('.mtx-drawer, [data-mtx="drawer"], nav, [data-mtx="nav"]') || t.closest(".mtx-list:not(.mtx-list--nested)") || t.closest(".mtx-list") || t.parentElement;
  e && e.querySelectorAll('.mtx-list-item-button.mtx-list-item--selected, [data-mtx="list-item-button"].mtx-list-item--selected').forEach((i) => {
    i !== t && le(i, !1);
  }), le(t, !0), v(t, "mtx:list:select", { item: t }, { aliases: ["mtx-select"] });
}));
const Et = {
  entering: "mtx-transition--entering",
  entered: "mtx-transition--entered",
  exiting: "mtx-transition--exiting",
  exited: "mtx-transition--exited"
}, Na = Object.values(Et), Vn = "cubic-bezier(0, 0, 0.2, 1)", $t = /* @__PURE__ */ new WeakMap();
function Vi(r, t) {
  Object.entries(t).forEach(([e, i]) => {
    r.style[e] = i;
  });
}
function Un() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function Ia(r) {
  const t = $t.get(r);
  return t ? ($t.delete(r), t.frame && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(t.frame), clearTimeout(t.timer), t.resolve(!1), !0) : !1;
}
function Yn(r, t, e, { prepare: i, animate: s, done: a }) {
  const n = Ia(r);
  return r.classList.remove(...Na), Un() ? (s(n), a && a(), r.classList.add(Et.entered), Promise.resolve(!0)) : (i(n), r.classList.add(Et.entering), new Promise((l) => {
    const o = { frame: 0, timer: 0, resolve: l }, c = () => {
      o.frame = 0, s(n);
    };
    o.frame = typeof requestAnimationFrame == "function" ? requestAnimationFrame(c) : 0, o.frame || c(), o.timer = setTimeout(() => {
      $t.get(r) === o && ($t.delete(r), r.classList.remove(Et.entering, Et.exiting), r.classList.add(Et.entered), a && a(), l(!0));
    }, e), $t.set(r, o);
  }));
}
function Kn(r, t, e = {}) {
  const { transformOrigin: i = "top", duration: s = 225 } = e;
  r.style.transformOrigin = i;
  const a = Vn, n = { transform: "scale(0.6, 0)", opacity: 0 }, l = { transform: "scale(1, 1)", opacity: 1 };
  return Yn(r, t, s, {
    prepare: (o) => {
      r.style.transition = `transform ${s}ms ${a}, opacity ${s}ms ${a}`, o || Vi(r, n);
    },
    animate: () => Vi(r, l)
  });
}
function Wn(r) {
  if (!r) return !1;
  const t = Ia(r);
  return r.classList && r.classList.remove(...Na), t;
}
const Oa = /^menuitem(checkbox|radio)$/;
function Ui(r) {
  const t = r.id;
  if (!t) return [];
  const e = typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t, i = [
    `[data-open-menu="#${e}"]`,
    `[data-mtx-menu-trigger="#${e}"]`,
    `[data-mtx-menu-trigger="${e}"]`,
    `[aria-controls="${e}"]`
  ].join(",");
  return Array.from(document.querySelectorAll(i)).filter((s) => !r.contains(s) || s.hasAttribute("data-submenu-trigger"));
}
function Yi(r, t) {
  r.setAttribute("aria-haspopup", "menu"), r.hasAttribute("aria-expanded") || r.setAttribute("aria-expanded", "false"), t.id && !r.hasAttribute("aria-controls") && r.setAttribute("aria-controls", t.id);
}
function Pa(r, t, e) {
  t && r.getAttribute("role") === "menuitemradio" && (r.closest('[role="group"]') || e || r.parentElement).querySelectorAll('[role="menuitemradio"]').forEach((s) => {
    s !== r && (s.setAttribute("aria-checked", "false"), s.classList.remove("mtx-menu-item--checked"));
  }), r.setAttribute("aria-checked", String(t)), r.classList.toggle("mtx-menu-item--checked", t);
}
function Gn(r, t) {
  const e = r.getAttribute("role") || "";
  if (!Oa.test(e)) return null;
  const i = e === "menuitemradio" ? !0 : r.getAttribute("aria-checked") !== "true";
  return Pa(r, i, t), i;
}
function $a(r) {
  if (r.hasAttribute("data-divider")) {
    r.className = "mtx-menu-item--divider", r.setAttribute("role", "separator"), r.removeAttribute("tabindex"), r.removeAttribute("aria-disabled");
    return;
  }
  r.classList.contains("mtx-menu-item") || r.classList.add("mtx-menu-item");
  const t = r.getAttribute("data-icon");
  if (t && !r.querySelector(".mtx-menu-item__icon, .material-icons, svg")) {
    const e = document.createElement("span");
    e.className = "mtx-menu-item__icon";
    const i = document.createElement("span");
    i.className = "material-icons", i.setAttribute("aria-hidden", "true"), i.textContent = t, e.appendChild(i), r.insertBefore(e, r.firstChild);
  }
  if (r.hasAttribute("data-submenu-trigger") && !r.querySelector(".mtx-menu-item__expand")) {
    const e = document.createElement("span");
    e.className = "material-icons mtx-menu-item__expand", e.setAttribute("aria-hidden", "true"), e.textContent = "chevron_right", r.appendChild(e);
  }
  if (r.hasAttribute("role") || r.setAttribute("role", "menuitem"), r.hasAttribute("tabindex") || (r.tabIndex = -1), r.hasAttribute("data-disabled") && (r.classList.add("mtx-menu-item--disabled"), r.setAttribute("aria-disabled", "true")), r.hasAttribute("data-selected") && r.classList.add("mtx-menu-item--selected"), r.hasAttribute("data-dense") && r.classList.add("mtx-menu-item--dense"), r.hasAttribute("data-disable-gutters") && r.classList.add("mtx-menu-item--disable-gutters"), Oa.test(r.getAttribute("role") || "") && (r.hasAttribute("aria-checked") || r.setAttribute("aria-checked", String(r.hasAttribute("data-checked"))), r.classList.toggle("mtx-menu-item--checked", r.getAttribute("aria-checked") === "true"), !r.querySelector(".mtx-menu-item__check"))) {
    const e = document.createElement("span");
    e.className = "material-icons mtx-menu-item__check", e.setAttribute("aria-hidden", "true"), e.textContent = "check", r.appendChild(e);
  }
}
class Ut extends g {
  /**
   * Crea una instancia del menú.
   *
   * @param {HTMLElement} element Elemento del menú.
   */
  constructor(e) {
    const i = L(e);
    let s = null;
    i instanceof Ut && i.constructor === new.target && !i.destroyed && (s = i._placeholder || null, i._placeholder = null);
    super(e);
    /**
     * Manejador de scroll/resize para mantener el menú adherido al disparador.
     */
    Kt(this, "_handleReposition", () => {
      this.isOpen && (this._repositionRaf && cancelAnimationFrame(this._repositionRaf), this._repositionRaf = requestAnimationFrame(() => {
        if (!this.isOpen) return;
        const e = this._getPositionAnchor();
        if (!e) return;
        const i = e.getBoundingClientRect(), s = window.innerHeight || document.documentElement.clientHeight;
        if (i.bottom < 0 || i.top > s) {
          this.close({ restoreFocus: !1 });
          return;
        }
        this._position({ keepSide: !0 });
      }));
    });
    this._inheritedPlaceholder = s, this.element.classList.add("mtx-menu"), this.element.hidden = !0;
    const a = e.getAttribute("data-anchor");
    this.anchor = a && document.querySelector(a) || Ui(e)[0] || null, this.isSubmenu = e.hasAttribute("data-submenu"), this.childMenu = null, this.parentMenu = null, Array.from(e.querySelectorAll('[data-mtx="menu-item"]')).forEach($a), this._handlePointerDown = (n) => {
      const l = n.target.closest(".mtx-menu-item");
      l && !l.classList.contains("mtx-menu-item--disabled") && !l.hasAttribute("disabled") && n.button === 0 && z(l, n);
    }, this.listen(e, "pointerdown", this._handlePointerDown), this._transitionToken = 0, this._repositionRaf = null, this._stopAutoUpdate = null, this.onDestroy(() => {
      this._unbindReposition(), this._clickAwayCleanup && this._clickAwayCleanup(), this._keydownCleanup && this._keydownCleanup(), this._clickAwayCleanup = null, this._keydownCleanup = null;
    }), this._build(), this._bindTriggers(), e.hasAttribute("data-open") && queueMicrotask(() => {
      this.destroyed || this.open();
    });
  }
  /**
   * Obtiene los items de menú actuales.
   *
   * @returns {HTMLElement[]} Lista de elementos `.mtx-menu-item`.
   */
  get menuItems() {
    return Array.from(this.element.querySelectorAll(".mtx-menu-item"));
  }
  /**
   * Prepara el menú para mostrarse en el portal sin desvincularlo del DOM permanentemente.
   */
  _build() {
    var s;
    this.menuContainer = Ct(), this.container = document.createElement("div"), this.container.className = "mtx-menu__popper", this.container.hidden = !0, this.container.style.opacity = "0", this.container.style.transform = "scale(0.6, 0)";
    const e = document.createElement("div");
    e.className = "mtx-menu__paper", e.setAttribute("role", "presentation");
    const i = this._inheritedPlaceholder;
    this._inheritedPlaceholder = null, i && i.isConnected ? (this._placeholder = i, De(this, i)) : this.element.parentNode && this.element.parentNode !== document.body && !((s = this.element.parentNode.classList) != null && s.contains("mtx-menu__paper")) && (this._placeholder = document.createComment(`mtx-menu${this.element.id ? `:${this.element.id}` : ""}`), this.element.parentNode.insertBefore(this._placeholder, this.element), De(this, this._placeholder)), this.element.setAttribute("role", "menu"), this.element.tabIndex = -1, e.appendChild(this.element), this.paper = e, this.container.appendChild(e), this.menuContainer.appendChild(this.container);
  }
  /**
   * Vincula los disparadores que abren este menú.
   */
  _bindTriggers() {
    this.triggers = Ui(this.element), this.anchor && !this.triggers.includes(this.anchor) && this.triggers.push(this.anchor), this._handleTriggerClick = (e) => {
      e.preventDefault(), e._mtxMenuHandled = !0, this._activeTrigger = e.currentTarget;
      const i = e.detail === 0;
      this.isSubmenu ? this.isOpen || this.open(null, { focusFirstItem: i }) : this._toggle({ focusFirstItem: i });
    }, this._handleTriggerEnter = (e) => {
      const i = e.currentTarget;
      clearTimeout(this._hoverTimeout), this._hoverTimeout = setTimeout(() => {
        this._activeTrigger = i, this.isOpen || this.open(null, { focusFirstItem: !1 });
      }, 100);
    }, this._handleTriggerLeave = () => {
      clearTimeout(this._hoverTimeout);
    }, this.triggers.forEach((e) => {
      this.listen(e, "click", this._handleTriggerClick), Yi(e, this.element), this.isSubmenu && (this.listen(e, "mouseenter", this._handleTriggerEnter), this.listen(e, "mouseleave", this._handleTriggerLeave));
    }), this.onDestroy(() => {
      clearTimeout(this._hoverTimeout), clearTimeout(this._closeChildTimeout);
    }), this._handleItemClick = (e) => {
      const i = e.target.closest(".mtx-menu-item");
      if (i && !i.classList.contains("mtx-menu-item--disabled")) {
        if (i.hasAttribute("data-submenu-trigger"))
          return;
        const s = Gn(i, this.element);
        this.close();
        const a = { item: i };
        s !== null && (a.checked = s), v(this.element, "mtx:menu:select", a, { bubbles: !0, cancelable: !1 });
      }
    }, this.listen(this.element, "click", this._handleItemClick), this._closeChildTimeout = null, this.menuItems.forEach((e) => {
      this.listen(e, "mouseenter", () => {
        this.childMenu && this.childMenu._activeTrigger !== e && (clearTimeout(this._closeChildTimeout), this._closeChildTimeout = setTimeout(() => {
          this.childMenu && this.childMenu._activeTrigger !== e && this.childMenu.close({ restoreFocus: !1 });
        }, 50));
      }), this.listen(e, "mouseleave", () => {
        clearTimeout(this._closeChildTimeout);
      });
    });
  }
  /**
   * Alterna la apertura del menú.
   *
   * @param {Object} [options] Opciones de apertura.
   */
  _toggle(e = {}) {
    this.isOpen ? this.close() : this.open(null, e);
  }
  /**
   * Actualiza `aria-expanded` en los disparadores vinculados y en el activo.
   *
   * @param {boolean} expanded Estado de apertura.
   */
  _setExpanded(e) {
    const i = String(e);
    this.triggers.forEach((s) => s.setAttribute("aria-expanded", i)), this._activeTrigger instanceof HTMLElement && this._activeTrigger.hasAttribute("aria-haspopup") && this._activeTrigger.setAttribute("aria-expanded", i);
  }
  /**
   * Indica si un nodo pertenece a un disparador del menú (vinculado o activo).
   *
   * @param {Node} target Nodo del evento.
   * @returns {boolean} `true` si es parte de un disparador.
   */
  _isTriggerTarget(e) {
    return this.triggers.some((i) => i.contains(e)) ? !0 : this._activeTrigger instanceof HTMLElement && this._activeTrigger.contains(e);
  }
  /**
   * Gestiona el clic de un disparador añadido después de inicializar el menú.
   *
   * @param {HTMLElement} trigger Disparador pulsado.
   * @param {MouseEvent} event Evento de clic.
   */
  _handleDelegatedTrigger(e, i) {
    i.preventDefault(), Yi(e, this.element);
    const s = i.detail === 0;
    if (this.isOpen && this._activeTrigger === e) {
      this.close();
      return;
    }
    this.isOpen && this.close({ restoreFocus: !1 }), this._activeTrigger instanceof HTMLElement && this._activeTrigger !== e && !this.triggers.includes(this._activeTrigger) && this._activeTrigger.setAttribute("aria-expanded", "false"), this._activeTrigger = e, this.open(null, { focusFirstItem: s });
  }
  /**
   * Indica si el menú está abierto.
   *
   * @returns {boolean} `true` si está abierto.
   */
  get isOpen() {
    return this.element.classList.contains("mtx-menu--open");
  }
  /**
   * Ancla de posicionamiento: la de `open(…, { anchorEl })`, `data-position-anchor`,
   * el disparador activo o el ancla por defecto.
   *
   * @returns {HTMLElement|{getBoundingClientRect: Function}|null} Ancla.
   */
  _getPositionAnchor() {
    if (this._openAnchorEl && (this._openAnchorEl.nodeType !== 1 || this._openAnchorEl.isConnected)) return this._openAnchorEl;
    const e = this.element.getAttribute("data-position-anchor");
    let i = null;
    if (e)
      try {
        i = document.querySelector(e);
      } catch {
        i = null;
      }
    return i || this._activeTrigger || this.anchor;
  }
  /**
   * Posiciona el menú relativo al ancla activo o predeterminado.
   *
   * @param {{keepSide?: boolean}} [options] `keepSide` conserva el lado elegido al abrir.
   * @returns {{placement: string, side: string, maxHeight: number}|undefined} Resultado aplicado.
   */
  _position({ keepSide: e = !1 } = {}) {
    const i = this._getPositionAnchor();
    if (!i) return;
    e || (this._rtl = this._resolveRtl(i), this.container.setAttribute("dir", this._rtl ? "rtl" : "ltr"));
    const s = qs(i, this.container, {
      placement: this.isSubmenu ? "right-start" : "bottom-start",
      offset: this.isSubmenu ? 0 : 4,
      padding: 8,
      matchWidth: !this.isSubmenu && this.element.hasAttribute("data-match-width"),
      content: this.paper,
      rtl: this._rtl,
      lockSide: e ? this._side : void 0
    });
    return this._side = s.side, s;
  }
  /**
   * Dirección del contexto: la del menú padre (submenús), la del ancla o la de la ubicación original.
   *
   * @param {HTMLElement|Object} anchor Ancla de posicionamiento.
   * @returns {boolean} `true` en RTL.
   */
  _resolveRtl(e) {
    return this.isSubmenu && this.parentMenu && typeof this.parentMenu._rtl == "boolean" ? this.parentMenu._rtl : e && e.nodeType === 1 && e.isConnected ? xt(e) : this._placeholder && this._placeholder.parentElement ? xt(this._placeholder.parentElement) : xt(document.documentElement);
  }
  /**
   * Reposiciona en tiempo real (scroll, resize y cambios de tamaño) con `autoUpdate`.
   */
  _bindReposition() {
    this._unbindReposition();
    const e = this._getPositionAnchor();
    let i = !0;
    this._stopAutoUpdate = Nt(e, this.container, () => {
      if (i) {
        i = !1;
        return;
      }
      this._handleReposition();
    });
  }
  /**
   * Detiene el reposicionamiento automático.
   */
  _unbindReposition() {
    this._repositionRaf && (cancelAnimationFrame(this._repositionRaf), this._repositionRaf = null), this._stopAutoUpdate && (this._stopAutoUpdate(), this._stopAutoUpdate = null);
  }
  /**
   * Abre el menú.
   *
   * @param {HTMLElement|Object} [anchor] Disparador opcional al que anclar esta apertura.
   * @param {Object} [options] Opciones de apertura.
   * @param {boolean} [options.focusFirstItem=true] Si debe enfocar el primer ítem al abrir.
   * @param {HTMLElement} [options.anchorEl] Elemento al que se ancla la posición (p. ej. el grupo
   *   de un split button); el foco sigue volviendo al disparador.
   */
  open(e = null, { focusFirstItem: i = !0, anchorEl: s = null } = {}) {
    if (e && (this._activeTrigger = e), this.isOpen || (this._openAnchorEl = s || null), this.isOpen) return;
    if (this._activeTrigger && this._activeTrigger instanceof HTMLElement) {
      const l = this._activeTrigger.closest(".mtx-menu");
      l && (this.parentMenu = L(l), this.parentMenu && (this.parentMenu.childMenu && this.parentMenu.childMenu !== this && this.parentMenu.childMenu.close({ restoreFocus: !1 }), this.parentMenu.childMenu = this));
    }
    this._transitionToken += 1, this._transitionToken, this.container.hidden = !1, this.element.hidden = !1, this.container.parentElement !== this.menuContainer && this.menuContainer.appendChild(this.container);
    const a = this._position(), n = this.element.getAttribute("data-transform-origin") || (a ? this.container.style.transformOrigin : "top");
    this.isSubmenu ? (this.container.style.transition = "none", this.container.style.opacity = "1", this.container.style.transform = "scale(1, 1)", this.element.classList.add("mtx-menu--open"), this._setExpanded(!0), v(this.element, "mtx:menu:open", void 0, { bubbles: !0, cancelable: !1 }), this._bindReposition(), this._clickAwayCleanup = qt(this.container, (l) => {
      this._isTriggerTarget(l.target) || lt(this, l.target) || this.childMenu && this.childMenu.container && this.childMenu.container.contains(l.target) || this.close({ restoreFocus: !1 });
    }), this._pushLayer(), this._keydownCleanup = this._bindKeyboard(), this._focusInitial(i)) : (this.element.classList.add("mtx-menu--open"), Kn(this.container, !0, { transformOrigin: n }), this._setExpanded(!0), this._bindReposition(), this._clickAwayCleanup = qt(this.container, (l) => {
      this._isTriggerTarget(l.target) || lt(this, l.target) || this.childMenu && this.childMenu.container && this.childMenu.container.contains(l.target) || this.close({ restoreFocus: !1 });
    }), this._pushLayer(), this._keydownCleanup = this._bindKeyboard(), this._focusInitial(i), v(this.element, "mtx:menu:open", void 0, { bubbles: !0, cancelable: !1 }));
  }
  /**
   * Cierra el menú.
   */
  close({ restoreFocus: e = !0 } = {}) {
    this.isOpen && (this.childMenu && (this.childMenu.close({ restoreFocus: !1 }), this.childMenu = null), this.parentMenu && this.parentMenu.childMenu === this && (this.parentMenu.childMenu = null), this._transitionToken += 1, Wn(this.container), this.container.style.transformOrigin || this.element.getAttribute("data-transform-origin"), this.element.classList.remove("mtx-menu--open"), q(this), this._setExpanded(!1), this._unbindReposition(), this._clickAwayCleanup && (this._clickAwayCleanup(), this._clickAwayCleanup = null), this._keydownCleanup && (this._keydownCleanup(), this._keydownCleanup = null), this.container.style.transition = "none", this.container.style.opacity = "0", this.container.style.transform = "scale(1, 1)", this.container.hidden = !0, this.element.hidden = !0, e && this._activeTrigger && typeof this._activeTrigger.focus == "function" && this._activeTrigger.focus(), v(this.element, "mtx:menu:close", void 0, { bubbles: !0, cancelable: !1 }));
  }
  /**
   * Registra el menú abierto en la pila de capas (Escape cierra solo el superior).
   */
  _pushLayer() {
    X(this, {
      kind: "popup",
      nodes: this.container,
      // El portal compartido sube por encima de un Dialog/Popover abierto debajo.
      stack: [{ node: this.menuContainer }],
      onEscape: () => this.close({ restoreFocus: !0 })
    });
  }
  /**
   * Vincula la navegación por teclado dentro del menú.
   *
   * @returns {Function} Función de limpieza.
   */
  _bindKeyboard() {
    const e = (i) => {
      if (this.childMenu && this.childMenu.isOpen) return;
      const s = this.menuItems.filter(
        (l) => !l.classList.contains("mtx-menu-item--disabled") && !l.hidden
      );
      if (i.key === "Tab") {
        this.close({ restoreFocus: !1 });
        return;
      }
      if (!s.length) return;
      const a = s.indexOf(document.activeElement);
      let n = -1;
      if (i.key === "ArrowDown" ? n = a < 0 ? 0 : (a + 1) % s.length : i.key === "ArrowUp" ? n = a < 0 ? s.length - 1 : (a - 1 + s.length) % s.length : i.key === "Home" ? n = 0 : i.key === "End" && (n = s.length - 1), n >= 0) {
        i.preventDefault(), s[n].focus();
        return;
      }
      if (i.key === "ArrowRight" && document.activeElement && document.activeElement.hasAttribute("data-submenu-trigger")) {
        i.preventDefault(), document.activeElement.click();
        return;
      }
      if (i.key === "ArrowLeft" && this.isSubmenu) {
        i.preventDefault(), this.close({ restoreFocus: !0 });
        return;
      }
      if (i.key === "Enter" || i.key === " ") {
        const l = document.activeElement;
        l && l.classList.contains("mtx-menu-item") && (i.preventDefault(), l.hasAttribute("data-submenu-trigger") ? l.dispatchEvent(new MouseEvent("mouseenter")) : l.click());
        return;
      }
      if (i.key.length === 1 && !i.ctrlKey && !i.metaKey && !i.altKey) {
        const l = i.key.toLocaleLowerCase(), c = s.slice(a + 1).concat(s.slice(0, a + 1)).find((d) => d.textContent.trim().toLocaleLowerCase().startsWith(l));
        c && c.focus();
      }
    };
    return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
  }
  /**
   * Enfoca el item seleccionado o el primer item habilitado.
   *
   * @param {boolean} focusFirstItem Determina si se debe priorizar un ítem sobre el contenedor.
   */
  _focusInitial(e = !0) {
    if (!e) {
      this.element.focus({ preventScroll: !0 });
      return;
    }
    const i = this.menuItems.filter(
      (a) => !a.classList.contains("mtx-menu-item--disabled")
    );
    (i.find((a) => a.classList.contains("mtx-menu-item--selected")) || i[0] || this.element).focus({ preventScroll: !0 });
  }
  /**
   * Libera listeners (disparadores, documento, ventana), retira el popper portado
   * y desvincula la instancia. El elemento del menú sale del DOM con el popper.
   */
  destroy() {
    this.isOpen && this.close({ restoreFocus: !1 }), this.container && this.container.parentElement && this.container.parentElement.removeChild(this.container), this._placeholder && this._placeholder.parentNode && this._placeholder.remove(), this._placeholder = null, super.destroy();
  }
  /**
   * Crea un menú contextual programático basado en JSON.
   *
   * @param {string} targetSelector Selector de los elementos donde aplicar el clic derecho.
   * @param {Array<Object>} items Definición JSON del menú.
   * @returns {Menu|null} Instancia del menú raíz creado.
   */
  static createContextMenu(e, i = []) {
    const s = document.querySelectorAll(e);
    if (!s.length) return null;
    const a = /* @__PURE__ */ new Map(), n = [], l = (d, h = !1) => {
      const u = document.createElement("div");
      return u.className = "mtx-menu", u.setAttribute("data-mtx", "menu"), h && u.setAttribute("data-submenu", "true"), u.id = P("mtx-context-menu"), d.forEach((m) => {
        const _ = document.createElement("div");
        if (_.setAttribute("data-mtx", "menu-item"), m.divider) {
          _.setAttribute("data-divider", ""), u.appendChild(_);
          return;
        }
        _.className = "mtx-menu-item", m.disabled && _.setAttribute("data-disabled", "true");
        const x = P("mtx-context-menu-item");
        if (_.setAttribute("data-value", x), m.action && typeof m.action == "function" && a.set(x, m.action), m.icon)
          _.setAttribute("data-icon", m.icon);
        else if (m.image) {
          const p = document.createElement("img");
          p.src = m.image, p.alt = "", p.className = "mtx-menu-item__image", _.appendChild(p);
        }
        const A = document.createTextNode(m.label || "");
        if (_.appendChild(A), m.submenu && Array.isArray(m.submenu) && m.submenu.length > 0) {
          const p = l(m.submenu, !0);
          _.setAttribute("data-submenu-trigger", "true"), _.setAttribute("data-open-menu", `#${p.id}`);
        }
        u.appendChild(_);
      }), document.body.appendChild(u), n.push(u), u;
    }, o = l(i);
    n.forEach((d) => {
      U(d), d.querySelectorAll("[data-mtx]").forEach((h) => U(h));
    });
    const c = L(o);
    return n.forEach((d) => {
      d.addEventListener("mtx:menu:select", (h) => {
        const u = h.detail.item.getAttribute("data-value"), m = a.get(u);
        m && m(h.detail.item, h);
      });
    }), s.forEach((d) => {
      c.listen(d, "contextmenu", (h) => {
        h.preventDefault();
        const u = {
          getBoundingClientRect: () => ({
            width: 0,
            height: 0,
            top: h.clientY,
            right: h.clientX,
            bottom: h.clientY,
            left: h.clientX
          })
        };
        c.open(u, { focusFirstItem: !1 });
      });
    }), c;
  }
}
class Ba extends g {
  /**
   * Crea una instancia del item de menú.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), $a(t);
  }
  /**
   * Indica si el ítem está marcado (`menuitemcheckbox` / `menuitemradio`).
   *
   * @returns {boolean} Estado de `aria-checked`.
   */
  get checked() {
    return this.element.getAttribute("aria-checked") === "true";
  }
  /**
   * Marca o desmarca el ítem; en `menuitemradio` desmarca los del mismo grupo.
   *
   * @param {boolean} value Nuevo estado.
   */
  set checked(t) {
    Pa(this.element, !!t, this.element.closest(".mtx-menu"));
  }
}
f("menu", Ut);
f("menu-item", Ba);
typeof document < "u" && document.addEventListener("click", (r) => {
  if (r._mtxMenuHandled || !(r.target instanceof Element)) return;
  const t = r.target.closest("[data-open-menu], [data-mtx-menu-trigger]");
  if (!t) return;
  const e = (t.getAttribute("data-open-menu") || t.getAttribute("data-mtx-menu-trigger") || "").trim();
  if (!e) return;
  const i = document.getElementById(e.replace(/^#/, "")), s = i && L(i);
  !(s instanceof Ut) || s.triggers.includes(t) || s._handleDelegatedTrigger(t, r);
});
const jn = {
  en: {
    selectAllRows: "Select all rows",
    selectRow: "Select {0}",
    selectedCountSingular: "{0} selected",
    selectedCountPlural: "{0} selected",
    toolbar: "Table toolbar"
  },
  es: {
    selectAllRows: "Seleccionar todas las filas",
    selectRow: "Seleccionar {0}",
    selectedCountSingular: "{0} seleccionado",
    selectedCountPlural: "{0} seleccionados",
    toolbar: "Barra de herramientas de la tabla"
  }
};
Object.entries(jn).forEach(([r, t]) => {
  const e = (ht(r) || {}).table || {}, i = Object.fromEntries(Object.entries(t).filter(([s]) => e[s] === void 0));
  Object.keys(i).length && Xe(r, { table: i });
});
const Ki = '.mtx-table-cell--padding-checkbox, .mtx-table-cell--checkbox, [data-padding="checkbox"]', Xn = 'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [role="menuitem"], [contenteditable=""], [contenteditable="true"], .mtx-checkbox', Jn = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false" aria-hidden="true"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>';
let Zn = 0;
const Z = (r, t) => r.hasAttribute(t) && r.getAttribute(t) !== "false", Fa = (r) => {
  r.classList.add("mtx-table-cell");
  const t = r.getAttribute("data-align"), e = r.getAttribute("data-padding");
  if (t && r.classList.add(`mtx-table-cell--${t}`), e && r.classList.add(`mtx-table-cell--padding-${e}`), r.tagName === "TH" && !r.hasAttribute("scope")) {
    const i = r.parentElement && r.parentElement.parentElement;
    i && i.tagName === "THEAD" ? r.scope = "col" : i && i.tagName === "TBODY" && (r.scope = "row");
  }
};
class Ra extends g {
  /**
   * Crea una instancia de la tabla.
   *
   * @param {HTMLTableElement} element Elemento `<table>` asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table");
    const e = t.closest('.mtx-table-container, [data-mtx="table-container"]');
    (Z(t, "data-sticky-header") || e && Z(e, "data-sticky-header")) && t.classList.add("mtx-table--sticky-header"), (t.getAttribute("data-size") === "small" || t.hasAttribute("data-dense")) && t.classList.add("mtx-table--small"), this.hover = Z(t, "data-hover"), this.hover && t.classList.add("mtx-table--hover"), this.selectable = Z(t, "data-selectable"), this.selectOnClick = this.selectable && Z(t, "data-select-on-click"), this.selectable && t.classList.add("mtx-table--selectable"), this._selected = /* @__PURE__ */ new Set(), this._rowKeys = /* @__PURE__ */ new WeakMap(), this._seenRows = /* @__PURE__ */ new WeakSet(), this._autoLabelled = /* @__PURE__ */ new WeakSet(), this._handleChange = (i) => this._onChange(i), this._handleClick = (i) => this._onRowClick(i), this._handleLocaleChange = () => this._refreshLabels(), this.listen(t, "change", this._handleChange), this.listen(t, "click", this._handleClick), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this.refresh(), typeof MutationObserver < "u" && (this._observer = new MutationObserver(() => this._scheduleRefresh()), this._observe());
  }
  /** @returns {string[]} Claves (`data-id`) de las filas seleccionadas. */
  get selected() {
    return Array.from(this._selected);
  }
  /** @param {string[]} keys Claves a seleccionar (reemplaza la selección). */
  set selected(t) {
    this._replaceSelection(new Set((t || []).map(String)), "api");
  }
  /**
   * Devuelve las filas del DOM actualmente seleccionadas.
   *
   * @returns {HTMLTableRowElement[]} Filas seleccionadas presentes en la tabla.
   */
  getSelectedRows() {
    return this._bodyRows().filter((t) => this._selected.has(this._keyOf(t)));
  }
  /**
   * Indica si una fila (o clave) está seleccionada.
   *
   * @param {HTMLTableRowElement|string} rowOrKey Fila o clave.
   * @returns {boolean} `true` si está seleccionada.
   */
  isSelected(t) {
    return this._selected.has(this._resolveKey(t));
  }
  /**
   * Alterna la selección de una fila.
   *
   * @param {HTMLTableRowElement|string} rowOrKey Fila o clave.
   * @param {boolean} [force] Estado forzado.
   */
  toggleRow(t, e) {
    this._toggleKey(this._resolveKey(t), e, "api");
  }
  /** Selecciona todas las filas habilitadas del cuerpo. */
  selectAll() {
    this._setAll(!0, "api");
  }
  /** Vacía la selección completa (también claves de filas que ya no están en el DOM). */
  clearSelection() {
    this._replaceSelection(/* @__PURE__ */ new Set(), "api");
  }
  /**
   * Vuelve a aplicar clases, celdas de selección y estado a todas las filas.
   * Se ejecuta automáticamente cuando cambian las filas.
   */
  refresh() {
    this._refreshQueued = !1;
    const t = !!this._observer;
    t && this._observer.disconnect();
    try {
      this._decorate(), this.selectable && this._syncSelection(!0);
    } finally {
      t && this._observe();
    }
  }
  /** Elimina listeners y el observador. */
  destroy() {
    this._observer && this._observer.disconnect(), this._observer = null, this._refreshQueued = !1, super.destroy();
  }
  /** Inicia la observación de filas y celdas. */
  _observe() {
    this._observer.observe(this.element, { childList: !0, subtree: !0 });
  }
  /** Agrupa varias mutaciones en un único `refresh()`. */
  _scheduleRefresh() {
    this._refreshQueued || (this._refreshQueued = !0, queueMicrotask(() => {
      this._refreshQueued && !this.destroyed && this.refresh();
    }));
  }
  /** Aplica clases BEM a leyenda, secciones, filas y celdas. */
  _decorate() {
    const t = this.element;
    t.caption && t.caption.classList.add("mtx-table-caption"), t.tHead && t.tHead.classList.add("mtx-table-head"), Array.from(t.tBodies).forEach((e) => e.classList.add("mtx-table-body")), t.tFoot && t.tFoot.classList.add("mtx-table-footer"), Array.from(t.rows).forEach((e) => {
      e.classList.add("mtx-table-row");
      const i = e.parentElement && e.parentElement.tagName === "TBODY";
      this.hover && i && e.classList.add("mtx-table-row--hover"), this.selectable && this._ensureSelectionCell(e), Array.from(e.cells).forEach(Fa);
    });
  }
  /** @returns {HTMLTableRowElement[]} Filas de todos los `<tbody>`. */
  _bodyRows() {
    return Array.from(this.element.tBodies).flatMap((t) => Array.from(t.rows));
  }
  /**
   * Obtiene (o asigna) la clave estable de una fila.
   *
   * @param {HTMLTableRowElement} row Fila.
   * @returns {string} Clave de `data-id` o generada.
   */
  _keyOf(t) {
    const e = t.getAttribute("data-id");
    return e !== null && e !== "" ? e : (this._rowKeys.has(t) || this._rowKeys.set(t, `mtx-row-${++Zn}`), this._rowKeys.get(t));
  }
  /** @param {HTMLTableRowElement|string} rowOrKey Fila o clave. @returns {string} Clave. */
  _resolveKey(t) {
    return t && t.nodeType === 1 ? this._keyOf(t) : String(t);
  }
  /**
   * Busca la celda de selección (primera celda con checkbox) de una fila.
   *
   * @param {HTMLTableRowElement} row Fila.
   * @returns {HTMLTableCellElement|null} Celda encontrada.
   */
  _selectionCell(t) {
    const e = t.cells[0];
    return e && e.matches(Ki) ? e : null;
  }
  /** @param {HTMLTableRowElement} row Fila. @returns {HTMLInputElement|null} Checkbox de la fila. */
  _rowInput(t) {
    const e = this._selectionCell(t);
    return e ? e.querySelector('input[type="checkbox"]') : null;
  }
  /**
   * Indica si la fila participa en la selección.
   *
   * @param {HTMLTableRowElement} row Fila.
   * @returns {boolean} `true` si es seleccionable.
   */
  _isSelectableRow(t) {
    return !Z(t, "data-no-select") && !!this._rowInput(t);
  }
  /**
   * Inserta la celda de checkbox en una fila si aún no la tiene.
   *
   * @param {HTMLTableRowElement} row Fila.
   */
  _ensureSelectionCell(t) {
    const e = t.parentElement ? t.parentElement.tagName : "";
    if (this._selectionCell(t)) {
      e === "TBODY" && this._readInitialState(t);
      return;
    }
    if (e === "TBODY" && t.cells.length === 1 && t.cells[0].colSpan > 1) {
      this._seenRows.has(t) || (t.cells[0].colSpan += 1), this._seenRows.add(t);
      return;
    }
    const i = e === "TBODY" && Z(t, "data-no-select"), s = e === "THEAD", a = s ? t.parentElement.rows : null, n = e === "TBODY" && !i || s && a[a.length - 1] === t, l = document.createElement(s ? "th" : "td");
    if (l.className = "mtx-table-cell mtx-table-cell--padding-checkbox", l.setAttribute("data-padding", "checkbox"), n) {
      const o = document.createElement("input");
      o.type = "checkbox", o.setAttribute("data-mtx", "checkbox"), this._autoLabelled.add(o), l.appendChild(o);
    }
    s && (l.scope = "col"), t.insertBefore(l, t.cells[0] || null), l.firstChild && (this._labelInput(l.firstChild, t, s), ee(l)), e === "TBODY" && !i && this._readInitialState(t), i && this._seenRows.add(t);
  }
  /**
   * Toma `data-selected` de una fila vista por primera vez.
   *
   * @param {HTMLTableRowElement} row Fila.
   */
  _readInitialState(t) {
    if (this._seenRows.has(t)) return;
    this._seenRows.add(t);
    const e = this._rowInput(t);
    (Z(t, "data-selected") || t.classList.contains("mtx-table-row--selected") || e && e.checked) && (this._initialKeys || (this._initialKeys = /* @__PURE__ */ new Set()), this._initialKeys.add(this._keyOf(t)));
  }
  /**
   * Asigna el nombre accesible traducido a un checkbox autogenerado.
   *
   * @param {HTMLInputElement} input Casilla.
   * @param {HTMLTableRowElement} row Fila.
   * @param {boolean} isHead Es la casilla de cabecera.
   */
  _labelInput(t, e, i) {
    const s = k(this.element);
    if (i) {
      t.setAttribute("aria-label", y("table", "selectAllRows", null, "Select all rows", s));
      return;
    }
    const a = e.getAttribute("data-label"), n = Array.from(e.cells).find((c) => !c.matches(Ki)), o = (a || (n ? n.textContent : "") || "").replace(/\s+/g, " ").trim().slice(0, 80) || String(e.sectionRowIndex + 1);
    t.setAttribute("aria-label", y("table", "selectRow", [o], `Select ${o}`, s));
  }
  /** Actualiza los nombres accesibles autogenerados tras un cambio de idioma. */
  _refreshLabels() {
    Array.from(this.element.rows).forEach((t) => {
      const e = this._selectionCell(t), i = e && e.querySelector('input[type="checkbox"]');
      i && this._autoLabelled.has(i) && this._labelInput(i, t, t.parentElement.tagName === "THEAD");
    });
  }
  /**
   * Gestiona los cambios de las casillas de cabecera y de fila.
   *
   * @param {Event} event Evento `change`.
   */
  _onChange(t) {
    if (!this.selectable) return;
    const e = t.target;
    if (!(e instanceof HTMLInputElement) || e.type !== "checkbox") return;
    const i = e.closest("tr");
    if (!i || i.closest("table") !== this.element || this._rowInput(i) !== e) return;
    const s = i.parentElement.tagName;
    s === "THEAD" ? this._setAll(e.checked, "user") : s === "TBODY" && this._toggleKey(this._keyOf(i), e.checked, "user");
  }
  /**
   * Alterna la fila al hacer clic en ella cuando `data-select-on-click` está activo.
   *
   * @param {MouseEvent} event Evento `click`.
   */
  _onRowClick(t) {
    if (!this.selectOnClick || t.defaultPrevented) return;
    const e = t.target;
    if (!(e instanceof Element) || e.closest(Xn)) return;
    const i = e.closest("tr");
    if (!i || i.closest("table") !== this.element || i.parentElement.tagName !== "TBODY") return;
    const s = this._rowInput(i);
    !s || s.disabled || Z(i, "data-no-select") || this._toggleKey(this._keyOf(i), void 0, "user");
  }
  /**
   * Selecciona o deselecciona todas las filas habilitadas del DOM.
   *
   * @param {boolean} value Nuevo estado.
   * @param {string} reason Motivo del cambio.
   */
  _setAll(t, e) {
    const i = new Set(this._selected);
    this._bodyRows().forEach((s) => {
      const a = this._rowInput(s);
      !this._isSelectableRow(s) || a.disabled || (t ? i.add(this._keyOf(s)) : i.delete(this._keyOf(s)));
    }), this._replaceSelection(i, e);
  }
  /**
   * Cambia el estado de una clave.
   *
   * @param {string} key Clave.
   * @param {boolean} [force] Estado forzado.
   * @param {string} reason Motivo.
   */
  _toggleKey(t, e, i) {
    const s = new Set(this._selected);
    (e === void 0 ? !s.has(t) : !!e) ? s.add(t) : s.delete(t), this._replaceSelection(s, i);
  }
  /**
   * Sustituye la selección y emite `mtx:table:selection-change` si cambió.
   *
   * @param {Set<string>} next Nueva selección.
   * @param {string} reason Motivo.
   */
  _replaceSelection(t, e) {
    const i = t.size !== this._selected.size || Array.from(t).some((s) => !this._selected.has(s));
    this._selected = t, this._syncSelection(!1), i && this._emitSelection(e);
  }
  /**
   * Refleja la selección en filas, casillas y cabecera.
   *
   * @param {boolean} fromRefresh Incorpora el estado inicial de filas nuevas.
   */
  _syncSelection(t) {
    if (!this.selectable) return;
    if (t && this._initialKeys) {
      const s = Array.from(this._initialKeys).filter((a) => !this._selected.has(a));
      if (this._initialKeys = null, s.length) {
        s.forEach((a) => this._selected.add(a)), this._syncSelection(!1), this._emitSelection("refresh");
        return;
      }
    }
    let e = 0, i = 0;
    this._bodyRows().forEach((s) => {
      const a = this._rowInput(s);
      if (!a) return;
      const n = this._selected.has(this._keyOf(s));
      s.classList.toggle("mtx-table-row--selected", n), s.setAttribute("aria-selected", String(n)), this._setInput(a, n, !1), !a.disabled && !Z(s, "data-no-select") && (e += 1, n && (i += 1));
    }), this.element.tHead && Array.from(this.element.tHead.rows).forEach((s) => {
      const a = this._rowInput(s);
      a && (this._setInput(a, e > 0 && i === e, i > 0 && i < e), a.disabled = e === 0);
    });
  }
  /**
   * Fija el estado de una casilla usando su instancia si existe.
   *
   * @param {HTMLInputElement} input Casilla.
   * @param {boolean} checked Marcada.
   * @param {boolean} indeterminate Indeterminada.
   */
  _setInput(t, e, i) {
    const s = L(t);
    if (s && "checked" in s && "indeterminate" in s) {
      s.checked !== e && (s.checked = e), s.indeterminate !== i && (s.indeterminate = i);
      return;
    }
    t.checked = e, t.indeterminate = i, i ? t.setAttribute("aria-checked", "mixed") : t.removeAttribute("aria-checked");
  }
  /** @param {string} reason Motivo del cambio. */
  _emitSelection(t) {
    const e = this.selected;
    v(
      this.element,
      "mtx:table:selection-change",
      { selected: e, rows: this.getSelectedRows(), count: e.length, reason: t }
    );
  }
}
class Ha extends g {
  /**
   * Crea una instancia del contenedor de tabla.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table-container");
    const e = t.getAttribute("data-max-height");
    if (e && (t.style.maxHeight = /^\d+(\.\d+)?$/.test(e) ? `${e}px` : e, t.classList.add("mtx-table-container--scroll")), Z(t, "data-sticky-header")) {
      t.classList.add("mtx-table-container--sticky");
      const i = t.querySelector("table");
      i && i.classList.add("mtx-table--sticky-header");
    }
    if (this._ownsTabindex = !t.hasAttribute("tabindex"), this._syncScrollRegion(), this._ownsTabindex && typeof ResizeObserver == "function") {
      const i = new ResizeObserver(() => this._syncScrollRegion());
      i.observe(t), this.onDestroy(() => i.disconnect());
    }
  }
  /**
   * Indica si el contenedor desplaza contenido (altura máxima o desbordamiento real).
   *
   * @returns {boolean} `true` si hay scroll.
   */
  get scrollable() {
    const t = this.element;
    return this.element.classList.contains("mtx-table-container--scroll") || t.scrollWidth > t.clientWidth + 1 || t.scrollHeight > t.clientHeight + 1;
  }
  /** Hace enfocable y nombra el contenedor solo mientras tiene scroll. */
  _syncScrollRegion() {
    const { element: t } = this;
    if (!this._ownsTabindex) return;
    if (!this.scrollable) {
      this._regionApplied && (t.removeAttribute("tabindex"), this._regionApplied = !1);
      return;
    }
    if (this._regionApplied || (this._regionApplied = !0, t.tabIndex = 0, t.hasAttribute("role")) || (t.setAttribute("role", "region"), t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby"))) return;
    const e = t.querySelector("table"), i = e && e.querySelector("caption");
    i && i.textContent.trim() ? (i.id || (i.id = P("mtx-table-caption")), t.setAttribute("aria-labelledby", i.id)) : e && e.getAttribute("aria-labelledby") ? t.setAttribute("aria-labelledby", e.getAttribute("aria-labelledby")) : e && e.getAttribute("aria-label") ? t.setAttribute("aria-label", e.getAttribute("aria-label")) : t.setAttribute("aria-label", y("table", "scrollRegion", null, "Scrollable table", k(t)));
  }
}
class qa extends g {
  /** @param {HTMLElement} element Elemento `<thead>`. */
  constructor(t) {
    super(t), t.classList.add("mtx-table-head");
  }
}
class za extends g {
  /** @param {HTMLElement} element Elemento `<tbody>`. */
  constructor(t) {
    super(t), t.classList.add("mtx-table-body");
  }
}
class ci extends g {
  /** @param {HTMLElement} element Elemento `<tfoot>`. */
  constructor(t) {
    super(t), t.classList.add("mtx-table-footer");
  }
}
class Va extends g {
  /** @param {HTMLTableRowElement} element Elemento `<tr>`. */
  constructor(t) {
    super(t), t.classList.add("mtx-table-row"), t.hasAttribute("data-hover") && t.classList.add("mtx-table-row--hover"), (t.hasAttribute("data-selected") || t.classList.contains("mtx-table-row--selected")) && (t.classList.add("mtx-table-row--selected"), t.setAttribute("aria-selected", "true"));
  }
}
class Ua extends g {
  /** @param {HTMLTableCellElement} element Celda `<th>` o `<td>`. */
  constructor(t) {
    super(t), Fa(t);
    const e = t.getAttribute("data-sort-direction");
    (e === "asc" || e === "desc") && t.setAttribute("aria-sort", e === "asc" ? "ascending" : "descending");
  }
}
class Ya extends g {
  /**
   * Crea la barra y la vincula a la tabla de `data-table`.
   *
   * @param {HTMLElement} element Elemento contenedor.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table-toolbar"), t.hasAttribute("role") || t.setAttribute("role", "toolbar");
    const e = t.getAttribute("data-title");
    if (this.title = t.querySelector(".mtx-table-toolbar__title"), !this.title && e && (this.title = document.createElement("div"), this.title.className = "mtx-table-toolbar__title", this.title.textContent = e, t.insertBefore(this.title, t.firstChild)), this.title && !this.title.id && (this.title.id = P("mtx-table-toolbar-title")), !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && (this.title ? t.setAttribute("aria-labelledby", this.title.id) : t.setAttribute("aria-label", y("table", "toolbar", null, "Table toolbar", k(t)))), this.countElement = t.querySelector(".mtx-table-toolbar__count"), this.countElement || (this.countElement = document.createElement("div"), this.countElement.className = "mtx-table-toolbar__count", t.insertBefore(this.countElement, this.title ? this.title.nextSibling : t.firstChild)), this.countElement.setAttribute("aria-live", "polite"), this.countElement.setAttribute("aria-atomic", "true"), this._count = 0, this._handleSelection = (s) => {
      this.count = s.detail.count;
    }, this._handleLocaleChange = () => this._render(), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this.table = this._resolveTable(), this.table) {
      this.listen(this.table, "mtx:table:selection-change", this._handleSelection);
      const s = L(this.table);
      s && Array.isArray(s.selected) && (this._count = s.selected.length);
    }
    const i = Number.parseInt(t.getAttribute("data-count"), 10);
    Number.isFinite(i) && (this._count = Math.max(0, i)), this._render();
  }
  /** @returns {number} Número de filas seleccionadas mostrado. */
  get count() {
    return this._count;
  }
  /** @param {number} value Nuevo número de seleccionadas. */
  set count(t) {
    this._count = Math.max(0, Number.parseInt(t, 10) || 0), this._render();
  }
  /** Elimina listeners instalados y suelta la tabla vinculada. */
  destroy() {
    super.destroy(), this.table = null;
  }
  /** @returns {HTMLTableElement|null} Tabla vinculada. */
  _resolveTable() {
    const t = this.element.getAttribute("data-table");
    if (t)
      try {
        return document.querySelector(t);
      } catch {
        return null;
      }
    const e = this.element.parentElement;
    return e ? e.querySelector('table[data-mtx="table"], table.mtx-table') : null;
  }
  /** Actualiza resaltado, contador y grupos visibles. */
  _render() {
    const t = this._count > 0, e = this.element;
    e.classList.toggle("mtx-table-toolbar--highlight", t), this.title && (this.title.hidden = t);
    const i = k(e), s = e.getAttribute("data-selected-text"), a = this._count === 1 ? "selectedCountSingular" : "selectedCountPlural", n = s ? s.replace("{0}", String(this._count)) : y("table", a, [this._count], `${this._count} selected`, i);
    this.countElement.textContent = t ? n : "", this.countElement.classList.toggle("mtx-table-toolbar__count--empty", !t), Array.from(e.querySelectorAll("[data-show]")).forEach((l) => {
      if (l.closest(".mtx-table-toolbar") !== e) return;
      const o = l.getAttribute("data-show");
      o === "selected" ? l.hidden = !t : o === "default" && (l.hidden = t);
    });
  }
}
class Ka extends g {
  /**
   * Crea una etiqueta de ordenación.
   *
   * @param {HTMLElement} element Botón o elemento interactivo asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table-sort-label"), this._nativeButton = t.tagName === "BUTTON", this._nativeButton && !t.hasAttribute("type") && (t.type = "button"), this._nativeButton || (t.setAttribute("role", "button"), t.hasAttribute("tabindex") || (t.tabIndex = 0)), this._icon = t.querySelector(".mtx-table-sort-label__icon"), this._icon || (this._icon = document.createElement("span"), this._icon.className = "mtx-table-sort-label__icon", t.appendChild(this._icon)), this._icon.setAttribute("aria-hidden", "true"), !this._icon.firstElementChild && !this._icon.textContent.trim() && (this._icon.innerHTML = Jn), this.direction = t.getAttribute("data-direction") === "desc" ? "desc" : "asc", this.active = t.hasAttribute("data-active"), this._handleClick = (e) => {
      if (this.disabled) {
        e.preventDefault(), e.stopImmediatePropagation();
        return;
      }
      const i = this.active && this.direction === "asc" ? "desc" : "asc";
      t.hasAttribute("data-disable-auto-toggle") || (this.direction = i, this.active = !0, this._deactivateSiblings()), v(t, "mtx:table:sort", {
        direction: i,
        active: !0,
        key: t.getAttribute("data-key") || null
      });
    }, this._handleKeydown = (e) => {
      this._nativeButton || this.disabled || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), t.click());
    }, this.listen(t, "click", this._handleClick), this.listen(t, "keydown", this._handleKeydown), t.hasAttribute("data-disabled") && this.disable();
  }
  /** Desactiva las demás etiquetas de ordenación de la misma cabecera (una sola columna activa). */
  _deactivateSiblings() {
    const t = this.element.closest("thead") || this.element.closest("table");
    t && t.querySelectorAll('.mtx-table-sort-label, [data-mtx="table-sort-label"]').forEach((e) => {
      if (e === this.element) return;
      const i = L(e);
      if (i && i !== this && "active" in i) {
        i.active = !1;
        return;
      }
      e.classList.remove("mtx-table-sort-label--active"), e.removeAttribute("data-active");
      const s = e.closest("th");
      s && s.removeAttribute("aria-sort");
    });
  }
  /** @returns {boolean} Indica si representa la ordenación activa. */
  get active() {
    return this.element.classList.contains("mtx-table-sort-label--active");
  }
  /** @param {boolean} value Nuevo estado activo. */
  set active(t) {
    this.element.classList.toggle("mtx-table-sort-label--active", !!t), this.element.toggleAttribute("data-active", !!t);
    const e = this.element.closest("th");
    e && (t ? e.setAttribute("aria-sort", this.direction === "asc" ? "ascending" : "descending") : e.removeAttribute("aria-sort"));
  }
  /** @returns {'asc'|'desc'} Dirección actual. */
  get direction() {
    return this._direction;
  }
  /** @param {'asc'|'desc'} value Dirección nueva. */
  set direction(t) {
    if (this._direction = t === "desc" ? "desc" : "asc", this.element.setAttribute("data-direction", this._direction), this.element.classList.toggle("mtx-table-sort-label--desc", this._direction === "desc"), this.active) {
      const e = this.element.closest("th");
      e && e.setAttribute("aria-sort", this._direction === "asc" ? "ascending" : "descending");
    }
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita la etiqueta. */
  disable() {
    "disabled" in this.element && (this.element.disabled = !0), this.element.setAttribute("aria-disabled", "true"), this._nativeButton || (this.element.tabIndex = -1);
  }
  /** Habilita la etiqueta. */
  enable() {
    "disabled" in this.element && (this.element.disabled = !1), this.element.removeAttribute("aria-disabled"), this._nativeButton || (this.element.tabIndex = 0);
  }
  /** Enfoca la etiqueta. */
  focus() {
    this.element.focus();
  }
}
class Wa extends g {
  /**
   * Crea una paginación controlable y, opcionalmente, pagina una tabla local.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table-pagination"), this._hasExplicitCount = t.hasAttribute("data-count"), this._count = this._integer("data-count", 0, -1), this._page = this._integer("data-page", 0, 0), this._rowsPerPage = this._integer("data-rows-per-page", 10, -1), this._resolveTable(), this._build(), this._handleClick = (e) => {
      const i = e.target.closest("[data-pagination-action]");
      if (!i || i.disabled) return;
      const s = i.getAttribute("data-pagination-action");
      s === "first" && this.firstPage(), s === "previous" && this.previousPage(), s === "next" && this.nextPage(), s === "last" && this.lastPage();
    }, this._handleRowsChange = () => this._setRowsPerPage(Number.parseInt(this._select.value, 10), !0), this.listen(t, "click", this._handleClick), this.listen(this._select, "change", this._handleRowsChange), t.hasAttribute("data-disabled") && this.disable(), this._handleLocaleChange = () => this._refreshI18nTexts(), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this.update();
  }
  /** @returns {number} Número total de filas o `-1` si es desconocido. */
  get count() {
    return this._count;
  }
  /** @param {number} value Nuevo total de filas. */
  set count(t) {
    this._hasExplicitCount = !0, this._count = Math.max(-1, Number.parseInt(t, 10) || 0), this.element.setAttribute("data-count", String(this._count)), this.update();
  }
  /** @returns {number} Página actual, con índice base cero. */
  get page() {
    return this._page;
  }
  /** @param {number} value Página nueva. */
  set page(t) {
    this._setPage(t, "programmatic", !1);
  }
  /** @returns {number} Filas mostradas por página. */
  get rowsPerPage() {
    return this._rowsPerPage;
  }
  /** @param {number} value Nuevo tamaño de página. */
  set rowsPerPage(t) {
    this._setRowsPerPage(t, !1);
  }
  /** Actualiza rango, botones y tabla vinculada. */
  update() {
    const t = this._getRows();
    !this._hasExplicitCount && t && (this._count = t.length);
    const e = this._lastPageIndex();
    this._count !== -1 && (this._page = Math.min(this._page, e));
    const i = this._rowsPerPage === -1, s = this._count === 0 ? 0 : i ? 1 : this._page * this._rowsPerPage + 1, a = this._count === 0 ? 0 : i ? this._count === -1 ? s : this._count : this._count === -1 ? s + this._rowsPerPage - 1 : Math.min(this._count, s + this._rowsPerPage - 1), n = k(this.element), l = this.element.getAttribute("data-label-of") || y("tablePagination", "of", null, "of", n), o = this.element.getAttribute("data-label-more-than") || y("tablePagination", "moreThan", null, "more than", n);
    this._displayed.textContent = this._count === -1 ? `${s}–${a} ${l} ${o} ${a}` : `${s}–${a} ${l} ${this._count}`, this._select.value = String(this._rowsPerPage), this._first.disabled = this.disabled || this._page === 0, this._previous.disabled = this.disabled || this._page === 0, this._next.disabled = this.disabled || this._count !== -1 && this._page >= e, this._last.disabled = this.disabled || this._count === -1 || this._page >= e, this._select.disabled = this.disabled, this.element.setAttribute("data-page", String(this._page)), this._applyRows(t);
  }
  /** Va a la primera página. */
  firstPage() {
    this._setPage(0, "firstPage");
  }
  /** Va a la página anterior. */
  previousPage() {
    this._setPage(this._page - 1, "previousPage");
  }
  /** Va a la página siguiente. */
  nextPage() {
    this._setPage(this._page + 1, "nextPage");
  }
  /** Va a la última página conocida. */
  lastPage() {
    this._count !== -1 && this._setPage(this._lastPageIndex(), "lastPage");
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita la paginación. */
  disable() {
    this.element.setAttribute("aria-disabled", "true"), this._select && this.update();
  }
  /** Habilita la paginación. */
  enable() {
    this.element.removeAttribute("aria-disabled"), this._select && this.update();
  }
  /** Elimina listeners instalados. */
  destroy() {
    this._applyRows(null, !0), super.destroy(), this._table = null;
  }
  /**
   * Refresca los textos de la paginación cuando cambia el idioma global.
   */
  _refreshI18nTexts() {
    const t = k(this.element), e = this.element.querySelector(".mtx-table-pagination__select-label");
    if (e && !this.element.hasAttribute("data-label-rows-per-page")) {
      const s = y("tablePagination", "rowsPerPage", null, "Rows per page:", t), a = e.querySelector("select");
      e.textContent = s, a && e.appendChild(a), this._select && this._select.setAttribute("aria-label", s);
    }
    this._select && !this.element.hasAttribute("data-label-all") && Array.from(this._select.options).forEach((s) => {
      s.value === "-1" && (s.textContent = y("tablePagination", "all", null, "All", t));
    }), Object.entries({
      first: "firstPage",
      previous: "previousPage",
      next: "nextPage",
      last: "lastPage"
    }).forEach(([s, a]) => {
      const n = this.element.querySelector(`[data-pagination-action="${s}"]`);
      n && !this.element.hasAttribute(`data-label-${s}`) && n.setAttribute("aria-label", y("tablePagination", a, null, a, t));
    }), this.update();
  }
  /** Construye los controles accesibles. */
  _build() {
    let t = this.element.querySelector(".mtx-table-pagination__toolbar");
    t || (t = document.createElement("div"), t.className = "mtx-table-pagination__toolbar", this.element.appendChild(t));
    const e = k(this.element), i = document.createElement("label");
    i.className = "mtx-table-pagination__select-label", i.textContent = this.element.getAttribute("data-label-rows-per-page") || y("tablePagination", "rowsPerPage", null, "Rows per page:", e), this._select = document.createElement("select"), this._select.className = "mtx-table-pagination__select", this._select.setAttribute("aria-label", i.textContent), this._options().forEach((a) => {
      const n = document.createElement("option");
      n.value = String(a), n.textContent = a === -1 ? this.element.getAttribute("data-label-all") || y("tablePagination", "all", null, "All", e) : String(a), this._select.appendChild(n);
    }), i.appendChild(this._select), this._displayed = document.createElement("p"), this._displayed.className = "mtx-table-pagination__displayed-rows", this._displayed.setAttribute("aria-live", "polite");
    const s = document.createElement("div");
    s.className = "mtx-table-pagination__actions", this._first = this._button("first", "«", y("tablePagination", "firstPage", null, "First page", e)), this._previous = this._button("previous", "‹", y("tablePagination", "previousPage", null, "Previous page", e)), this._next = this._button("next", "›", y("tablePagination", "nextPage", null, "Next page", e)), this._last = this._button("last", "»", y("tablePagination", "lastPage", null, "Last page", e)), this._first.hidden = !this.element.hasAttribute("data-show-first-button"), this._last.hidden = !this.element.hasAttribute("data-show-last-button"), s.append(this._first, this._previous, this._next, this._last), t.append(i, this._displayed, s);
  }
  /** @param {string} action Acción. @param {string} text Texto. @param {string} fallbackLabel Etiqueta. @returns {HTMLButtonElement} Botón creado. */
  _button(t, e, i) {
    const s = document.createElement("button");
    return s.type = "button", s.className = "mtx-table-pagination__button", s.setAttribute("data-pagination-action", t), s.setAttribute("aria-label", this.element.getAttribute(`data-label-${t}`) || i), s.textContent = e, s;
  }
  /** @returns {number[]} Opciones normalizadas. */
  _options() {
    const t = (this.element.getAttribute("data-rows-per-page-options") || "10,25,50,100").split(",").map((e) => Number.parseInt(e.trim(), 10)).filter((e) => e === -1 || e > 0);
    return t.includes(this._rowsPerPage) || t.unshift(this._rowsPerPage), [...new Set(t)];
  }
  /** Resuelve la tabla opcional indicada por selector. */
  _resolveTable() {
    const t = this.element.getAttribute("data-table");
    if (t)
      try {
        this._table = document.querySelector(t);
      } catch {
        this._table = null;
      }
  }
  /** @returns {HTMLElement[]|null} Filas de cuerpo de la tabla vinculada. */
  _getRows() {
    return this._table ? Array.from(this._table.querySelectorAll("tbody > tr")) : null;
  }
  /** @param {HTMLElement[]|null} rows Filas. @param {boolean} [restore=false] Restaura visibilidad. */
  _applyRows(t, e = !1) {
    const i = t || this._getRows();
    if (!i) return;
    const s = this._page * this._rowsPerPage;
    i.forEach((a, n) => {
      a.hidden = e ? !1 : this._rowsPerPage !== -1 && (n < s || n >= s + this._rowsPerPage);
    });
  }
  /** @returns {number} Índice de la última página. */
  _lastPageIndex() {
    return this._count <= 0 || this._rowsPerPage === -1 ? 0 : Math.max(0, Math.ceil(this._count / this._rowsPerPage) - 1);
  }
  /** @param {number} value Página. @param {string} reason Motivo. @param {boolean} [shouldEmit=true] Emite evento. */
  _setPage(t, e, i = !0) {
    const s = this._page, a = this._count === -1 ? Number.MAX_SAFE_INTEGER : this._lastPageIndex();
    this._page = Math.min(a, Math.max(0, Number.parseInt(t, 10) || 0)), this.update(), i && this._page !== s && v(this.element, "mtx:table:page-change", { page: this._page, previousPage: s, reason: e });
  }
  /** @param {number} value Filas por página. @param {boolean} shouldEmit Emite evento. */
  _setRowsPerPage(t, e) {
    const i = t === -1 ? -1 : Math.max(1, Number.parseInt(t, 10) || 10), s = this._rowsPerPage;
    this._rowsPerPage = i, this._page = 0, this.element.setAttribute("data-rows-per-page", String(i)), this.update(), e && i !== s && v(this.element, "mtx:table:rows-per-page-change", { rowsPerPage: i, previousRowsPerPage: s, page: 0 });
  }
  /** @param {string} name Atributo. @param {number} fallback Alternativa. @param {number} minimum Mínimo. @returns {number} Entero normalizado. */
  _integer(t, e, i) {
    const s = Number.parseInt(this.element.getAttribute(t), 10);
    return Number.isFinite(s) ? Math.max(i, s) : e;
  }
}
f("table", Ra);
f("table-container", Ha);
f("table-head", qa);
f("table-body", za);
f("table-footer", ci);
f("table-foot", ci);
f("table-row", Va);
f("table-cell", Ua);
f("table-sort-label", Ka);
f("table-pagination", Wa);
f("table-toolbar", Ya);
class Ga extends g {
  /**
   * Crea una instancia de las pestañas.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-tabs") || t.classList.add("mtx-tabs"), this.tabs = Array.from(t.querySelectorAll('[data-mtx="tab"]'));
    let e = t.querySelector(".mtx-tabs__indicator");
    e || (e = document.createElement("span"), e.className = "mtx-tabs__indicator", t.appendChild(e)), this.indicator = e, this.orientation = t.getAttribute("data-orientation") || "horizontal", this.selectionFollowsFocus = t.hasAttribute("data-selection-follows-focus"), this.orientation === "vertical" && t.classList.add("mtx-tabs--vertical"), t.hasAttribute("data-full") && t.classList.add("mtx-tabs--full"), t.hasAttribute("data-centered") && t.classList.add("mtx-tabs--centered"), t.setAttribute("role", "tablist"), t.setAttribute("aria-orientation", this.orientation), this.panels = /* @__PURE__ */ new Map();
    const i = t.id || P("mtx-tabs");
    if (this.tabs.forEach((a, n) => {
      a.classList.contains("mtx-tab") || a.classList.add("mtx-tab");
      const l = a.getAttribute("data-icon");
      if (l && !a.querySelector(".material-icons") && !a.querySelector("svg")) {
        const h = document.createElement("span");
        h.className = "material-icons mtx-tab__icon", h.setAttribute("aria-hidden", "true"), h.textContent = l, a.insertBefore(h, a.firstChild);
      }
      a.setAttribute("role", "tab"), a.id || (a.id = `${i}-tab-${n + 1}`);
      const o = a.getAttribute("data-panel"), c = o ? document.querySelector(o) : null;
      c && (this.panels.set(a, c), c.setAttribute("role", "tabpanel"), c.setAttribute("aria-labelledby", a.id), c.id || (c.id = `${a.id}-panel`), a.setAttribute("aria-controls", c.id)), (a.hasAttribute("data-disabled") || a.disabled) && (a.setAttribute("aria-disabled", "true"), a.tabIndex = -1);
    }), this._handleKeydown = (a) => {
      if (!a.target.closest(".mtx-tab")) return;
      const n = this.tabs.filter((h) => h.getAttribute("aria-disabled") !== "true"), l = n.indexOf(document.activeElement), o = this.orientation === "vertical" ? ["ArrowUp"] : ["ArrowLeft"], c = this.orientation === "vertical" ? ["ArrowDown"] : ["ArrowRight"];
      let d = null;
      c.includes(a.key) ? d = n[(l + 1 + n.length) % n.length] : o.includes(a.key) ? d = n[(l - 1 + n.length) % n.length] : a.key === "Home" ? d = n[0] : a.key === "End" ? d = n[n.length - 1] : (a.key === "Enter" || a.key === " ") && l >= 0 && (d = n[l]), d && (a.preventDefault(), this.selectionFollowsFocus || a.key === "Enter" || a.key === " " ? this._activate(d, { focus: !0 }) : d.focus());
    }, this._handleClick = (a) => {
      const n = a.target.closest(".mtx-tab");
      n && this._activate(n, { focus: !0 });
    }, t.addEventListener("keydown", this._handleKeydown), t.addEventListener("click", this._handleClick), this._handleResize = () => this._updateIndicator(), this.listen(window, "resize", this._handleResize), this._handleWindowLoad = () => this._updateIndicator(), this.listen(window, "load", this._handleWindowLoad), typeof requestAnimationFrame < "u") {
      const a = requestAnimationFrame(() => this._updateIndicator());
      this.onDestroy(() => cancelAnimationFrame(a));
    }
    typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
      this.destroyed || this._updateIndicator();
    }), typeof ResizeObserver < "u" && (this._resizeObserver = new ResizeObserver(() => {
      this._updateIndicator();
    }), this._resizeObserver.observe(t), this.tabs.forEach((a) => this._resizeObserver.observe(a)), this.onDestroy(() => {
      this._resizeObserver.disconnect(), this._resizeObserver = null;
    }));
    const s = this.tabs.find(
      (a) => (a.hasAttribute("data-active") || a.classList.contains("mtx-tab--active")) && a.getAttribute("aria-disabled") !== "true"
    ) || this.tabs.find((a) => a.getAttribute("aria-disabled") !== "true");
    s && this._activate(s, { focus: !1, emit: !1 });
  }
  /**
   * Activa una pestaña.
   *
   * @param {HTMLElement} tab Pestaña a activar.
   */
  _activate(t, { focus: e = !0, emit: i = !0 } = {}) {
    if (!t || t.getAttribute("aria-disabled") === "true" || t.disabled || t.classList.contains("mtx-tab--active")) return;
    let s = this.panels.get(t) || null, a = this.tabs.find((l) => l.classList.contains("mtx-tab--active")), n = a && this.panels.get(a) || null;
    if (i) {
      const l = v(this.element, "mtx:tabs:before-change", {
        tab: t,
        panel: s,
        previousTab: a,
        previousPanel: n
      }, { cancelable: !0 });
      if (typeof this.onBeforeChange == "function" && this.onBeforeChange(t, s, a, n) === !1 || !l) return;
    }
    this.tabs.forEach((l) => {
      const o = l === t;
      l.classList.toggle("mtx-tab--active", o), l.setAttribute("aria-selected", String(o)), l.tabIndex = o ? 0 : -1;
      const c = this.panels.get(l);
      c && (c.hidden = !o, c.setAttribute("aria-hidden", String(!o)));
    }), this._updateIndicator(), e && t.focus(), i && (typeof this.onChange == "function" && this.onChange(t, s, a, n), v(this.element, "mtx:tabs:change", {
      tab: t,
      panel: s,
      previousTab: a,
      previousPanel: n
    }));
  }
  /** Valor de la pestaña activa (data-value, id o índice). */
  get value() {
    const t = this.tabs.find((e) => e.getAttribute("aria-selected") === "true");
    return t ? t.getAttribute("data-value") || t.id || String(this.tabs.indexOf(t)) : null;
  }
  /** Activa una pestaña por valor, id, índice o elemento. */
  select(t) {
    const e = t instanceof HTMLElement ? t : this.tabs.find((i, s) => i.getAttribute("data-value") === String(t) || i.id === String(t) || s === Number(t));
    this._activate(e, { focus: !1 });
  }
  /**
   * Reposiciona el indicador bajo la pestaña activa.
   */
  _updateIndicator() {
    if (!this.indicator) return;
    const t = this.tabs.find((e) => e.classList.contains("mtx-tab--active")) || this.tabs[0];
    t && (this.orientation === "vertical" ? (this.indicator.style.height = `${t.offsetHeight}px`, this.indicator.style.width = "", this.indicator.style.transform = `translateY(${t.offsetTop}px)`) : (this.indicator.style.width = `${t.offsetWidth}px`, this.indicator.style.height = "", this.indicator.style.transform = `translateX(${t.offsetLeft}px)`));
  }
  /**
   * Destruye la instancia.
   */
  destroy() {
    this.element.removeEventListener("keydown", this._handleKeydown), this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
class ja extends g {
  /**
   * Crea una instancia de la pestaña.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), this._handlePointerDown = (e) => {
      t.hasAttribute("data-disabled") || e.button !== 0 || z(t, e);
    }, t.addEventListener("pointerdown", this._handlePointerDown);
  }
  /**
   * Destruye la instancia.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
}
f("tabs", Ga);
f("tab", ja);
f("tab-panel", g);
const Qn = "M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z", tl = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z", Wi = "http://www.w3.org/2000/svg", el = ["next", "back", "reset"];
function Gi(r, t) {
  const e = document.createElementNS(Wi, "svg");
  e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("class", t), e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
  const i = document.createElementNS(Wi, "path");
  return i.setAttribute("d", r), e.appendChild(i), e;
}
function I(r, t, e) {
  const i = document.createElement(r);
  return t && (i.className = t), e !== void 0 && (i.textContent = e), i;
}
function Ot(r, t) {
  return r.hasAttribute(t) ? r.getAttribute(t) !== "false" : null;
}
function Xa(r) {
  const t = r.getAttribute("data-target"), e = t ? document.querySelector(t) : r.closest(".mtx-stepper, .mtx-mobile-stepper");
  return e && L(e) || null;
}
let ji = !1;
function Ja() {
  ji || typeof document > "u" || (ji = !0, document.addEventListener("click", (r) => {
    const t = r.target.closest && r.target.closest("[data-mtx-stepper-action]");
    if (!t || t.disabled || t.getAttribute("aria-disabled") === "true") return;
    const e = t.getAttribute("data-mtx-stepper-action"), i = Xa(t);
    !i || !el.includes(e) || typeof i[e] != "function" || (r.preventDefault(), i[e]());
  }));
}
class Za extends g {
  /**
   * Número de posiciones navegables (pasos).
   * @returns {number} Total de pasos.
   */
  get length() {
    return 0;
  }
  /** @returns {number} Índice del paso activo (igual a `length` al terminar). */
  get activeStep() {
    return this._active;
  }
  /** @param {number} index Nuevo índice activo. */
  set activeStep(t) {
    this.goTo(t);
  }
  /**
   * Indica si un paso no puede activarse.
   * @param {number} index Índice.
   * @returns {boolean} `true` si está deshabilitado.
   */
  _isDisabled(t) {
    return !1;
  }
  /**
   * Índice máximo alcanzable.
   * @returns {number} Límite superior.
   */
  _maxIndex() {
    return this.length;
  }
  /**
   * Activa un paso emitiendo `mtx:stepper:change` (cancelable).
   * @param {number} index Índice destino.
   * @param {{emit?: boolean}} [options] Opciones.
   * @returns {boolean} `true` si el paso activo cambió.
   */
  goTo(t, { emit: e = !0 } = {}) {
    const i = Math.round(Number(t));
    if (!Number.isFinite(i) || i < 0 || i > this._maxIndex() || i === this._active || i < this.length && this._isDisabled(i)) return !1;
    const s = this._active;
    return e && !v(this.element, "mtx:stepper:change", {
      activeStep: i,
      previousStep: s
    }, { cancelable: !0 }) ? !1 : (this._active = i, this.element.setAttribute("data-active-step", String(i)), this._render(), !0);
  }
  /**
   * Avanza al siguiente paso habilitado.
   * @returns {boolean} `true` si avanzó.
   */
  next() {
    let t = this._active + 1;
    for (; t < this.length && this._isDisabled(t); ) t += 1;
    return this.goTo(t);
  }
  /**
   * Retrocede al paso habilitado anterior.
   * @returns {boolean} `true` si retrocedió.
   */
  back() {
    let t = this._active - 1;
    for (; t > 0 && this._isDisabled(t); ) t -= 1;
    return this.goTo(t);
  }
  /**
   * Sincroniza los disparadores declarativos (`back` deshabilitado en el primer paso, `next` en el último índice alcanzable).
   */
  _syncTriggers() {
    Array.from(document.querySelectorAll("[data-mtx-stepper-action]")).filter((e) => (e.hasAttribute("data-target") || this.element.contains(e)) && Xa(e) === this).forEach((e) => {
      if (e.hasAttribute("data-keep-enabled")) return;
      const i = e.getAttribute("data-mtx-stepper-action");
      let s = !1;
      i === "back" && (s = this._active <= 0), i === "next" && (s = this._active >= this._maxIndex()), (i === "back" || i === "next") && (e.disabled = s);
    });
  }
  /** Repinta el estado (lo implementa cada componente). */
  _render() {
  }
}
class Qa extends Za {
  /**
   * Crea una instancia del stepper.
   * @param {HTMLElement} element Elemento `<ol>` raíz.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-stepper"), this.orientation = t.getAttribute("data-orientation") === "vertical" ? "vertical" : "horizontal", this.alternativeLabel = this.orientation === "horizontal" && Ot(t, "data-alternative-label") === !0, this.nonLinear = Ot(t, "data-non-linear") === !0, t.classList.add(`mtx-stepper--${this.orientation}`), t.classList.toggle("mtx-stepper--alternative-label", this.alternativeLabel), t.classList.toggle("mtx-stepper--non-linear", this.nonLinear), t.tagName !== "OL" && t.tagName !== "UL" && !t.hasAttribute("role") && t.setAttribute("role", "list"), t.hasAttribute("data-label") && !t.hasAttribute("aria-label") && t.setAttribute("aria-label", t.getAttribute("data-label")), this._state = [], this.refresh({ render: !1 });
    const e = parseInt(t.getAttribute("data-active-step") || "0", 10);
    this._active = Number.isFinite(e) ? Math.min(Math.max(e, 0), this.length) : 0, this._handleClick = (i) => {
      const s = i.target.closest(".mtx-step-button");
      if (!s || !this.element.contains(s) || s.disabled) return;
      const a = this.steps.indexOf(s.closest(".mtx-step"));
      a >= 0 && this.goTo(a);
    }, this._handlePointerDown = (i) => {
      const s = i.target.closest(".mtx-step-button");
      !s || s.disabled || i.button !== 0 || z(s, i);
    }, this._handleLocaleChange = () => this._render(), t.addEventListener("click", this._handleClick), t.addEventListener("pointerdown", this._handlePointerDown), this.listen(document, "mtx:locale:change", this._handleLocaleChange), Ja(), this._render();
  }
  /** @returns {number} Número de pasos. */
  get length() {
    return this.steps.length;
  }
  /**
   * Vuelve a leer los `<li>` (pasos añadidos o quitados dinámicamente) y su estado `data-*`.
   * @param {{render?: boolean}} [options] Opciones.
   */
  refresh({ render: t = !0 } = {}) {
    this.steps = Array.from(this.element.children).filter((e) => e.tagName === "LI" || e.classList.contains("mtx-step")), this._state = this.steps.map((e) => {
      const i = e.getAttribute("data-error");
      return {
        completed: Ot(e, "data-completed"),
        error: i === null || i === "false" ? !1 : i,
        disabled: Ot(e, "data-disabled") === !0
      };
    }), this.steps.forEach((e, i) => this._scaffold(e, i)), t && (this._active = Math.min(this._active, this.length), this._render());
  }
  /**
   * Construye (o reutiliza en BEM manual) la anatomía de un paso.
   * @param {HTMLElement} step Elemento `<li>`.
   * @param {number} index Índice.
   */
  _scaffold(t, e) {
    t.classList.add("mtx-step"), t.tagName !== "LI" && !t.hasAttribute("role") && t.setAttribute("role", "listitem");
    let i = t.querySelector(":scope > .mtx-step__label-container");
    if (!i) {
      const o = Array.from(t.childNodes).filter((u) => !(u.nodeType === 1 && u.classList.contains("mtx-step-connector"))), c = o.some((u) => u.nodeType === 1 && !u.classList.contains("mtx-step__content"));
      let d = t.getAttribute("data-label");
      d === null && !c && (d = t.textContent.trim(), o.forEach((u) => {
        u.nodeType === 3 && u.remove();
      }));
      const h = Array.from(t.childNodes).filter((u) => !(u.nodeType === 1 && (u.classList.contains("mtx-step-connector") || u.classList.contains("mtx-step__content"))) && !(u.nodeType === 3 && !u.textContent.trim()));
      if (i = I("span", "mtx-step__label-container"), i.appendChild(I("span", "mtx-step__label", d || "")), h.length && !t.querySelector(":scope > .mtx-step__content")) {
        const u = I("div", "mtx-step__content"), m = I("div", "mtx-step__content-inner");
        h.forEach((_) => m.appendChild(_)), u.appendChild(m), t.appendChild(u);
      }
      t.insertBefore(i, t.querySelector(":scope > .mtx-step__content"));
    }
    if (this.nonLinear && i.tagName !== "BUTTON") {
      const o = I("button", i.className);
      for (o.type = "button"; i.firstChild; ) o.appendChild(i.firstChild);
      i.replaceWith(o), i = o;
    }
    i.tagName === "BUTTON" && i.classList.add("mtx-step-button");
    let s = i.querySelector(".mtx-step__label");
    s || (s = I("span", "mtx-step__label", t.getAttribute("data-label") || ""), i.appendChild(s));
    let a = i.querySelector(".mtx-step__label-text");
    a || (a = I("span", "mtx-step__label-text"), s.replaceWith(a), a.appendChild(s)), i.querySelector(".mtx-step__icon-container") || i.insertBefore(I("span", "mtx-step__icon-container"), i.firstChild), a.querySelector(".mtx-step__sr-prefix") || a.insertBefore(I("span", "mtx-step__sr mtx-step__sr-prefix"), a.firstChild), a.querySelector(".mtx-step__sr-status") || a.appendChild(I("span", "mtx-step__sr mtx-step__sr-status"));
    const n = t.querySelector(":scope > .mtx-step__content");
    if (n && !n.querySelector(":scope > .mtx-step__content-inner")) {
      const o = I("div", "mtx-step__content-inner");
      for (; n.firstChild; ) o.appendChild(n.firstChild);
      n.appendChild(o);
    }
    let l = t.querySelector(":scope > .mtx-step-connector");
    e > 0 && !l ? (l = I("span", "mtx-step-connector"), l.appendChild(I("span", "mtx-step-connector__line")), t.insertBefore(l, t.firstChild)) : e === 0 && l && l.remove(), l && l.setAttribute("aria-hidden", "true");
  }
  /**
   * Indica si un paso está deshabilitado (en modo no lineal solo por `data-disabled`).
   * @param {number} index Índice.
   * @returns {boolean} `true` si no puede activarse.
   */
  _isDisabled(t) {
    const e = this._state[t];
    return !!(e && e.disabled);
  }
  /**
   * Indica si un paso está completado (en modo lineal, los anteriores al activo lo están salvo `data-completed="false"`).
   * @param {number} index Índice.
   * @returns {boolean} `true` si está completado.
   */
  isCompleted(t) {
    const e = this._state[t];
    return e ? e.completed !== null ? e.completed : !this.nonLinear && t < this._active : !1;
  }
  /**
   * Marca o desmarca un paso como completado.
   * @param {number} index Índice.
   * @param {boolean} [completed=true] Estado.
   * @returns {this} La instancia.
   */
  setCompleted(t, e = !0) {
    const i = this._state[t];
    return i ? (i.completed = !!e, this.steps[t].setAttribute("data-completed", String(i.completed)), this._render(), this) : this;
  }
  /**
   * Activa o quita el estado de error de un paso.
   * @param {number} index Índice.
   * @param {string|boolean} message Mensaje visible, `true` (sin mensaje) o `false` para limpiar.
   * @returns {this} La instancia.
   */
  setError(t, e) {
    const i = this._state[t];
    return i ? (e === !1 || e === null || e === void 0 ? (i.error = !1, this.steps[t].removeAttribute("data-error")) : (i.error = e === !0 ? "" : String(e), this.steps[t].setAttribute("data-error", i.error)), this._render(), this) : this;
  }
  /**
   * Habilita o deshabilita un paso.
   * @param {number} index Índice.
   * @param {boolean} [disabled=true] Estado.
   * @returns {this} La instancia.
   */
  setDisabled(t, e = !0) {
    const i = this._state[t];
    return i ? (i.disabled = !!e, this.steps[t].toggleAttribute("data-disabled", i.disabled), this._render(), this) : this;
  }
  /**
   * Vuelve al primer paso y limpia completados y errores definidos por API o atributos.
   * @returns {boolean} `true` si se aplicó (el evento no fue cancelado).
   */
  reset() {
    return this._active !== 0 && !v(this.element, "mtx:stepper:change", {
      activeStep: 0,
      previousStep: this._active,
      reset: !0
    }, { cancelable: !0 }) ? !1 : (this._state.forEach((t, e) => {
      t.completed = null, t.error = !1, this.steps[e].removeAttribute("data-completed"), this.steps[e].removeAttribute("data-error");
    }), this._active = 0, this.element.setAttribute("data-active-step", "0"), this._render(), !0);
  }
  /** @returns {boolean} `true` si todos los pasos se han superado (`activeStep === length`). */
  get finished() {
    return this._active >= this.length;
  }
  /** Aplica clases, iconos, textos accesibles, paneles y disparadores. */
  _render() {
    const t = k(this.element), e = this.length;
    this.element.classList.toggle("mtx-stepper--finished", this.finished), this.steps.forEach((s, a) => {
      const n = this._state[a], l = a === this._active, o = this.isCompleted(a), c = n.error !== !1, d = n.disabled || !this.nonLinear && a > this._active;
      s.classList.toggle("mtx-step--active", l), s.classList.toggle("mtx-step--completed", o), s.classList.toggle("mtx-step--error", c), s.classList.toggle("mtx-step--disabled", d), s.classList.toggle("mtx-step--last", a === e - 1);
      const h = l || Ot(s, "data-expanded") === !0;
      s.classList.toggle("mtx-step--expanded", h);
      const u = s.querySelector(":scope > .mtx-step__label-container"), m = u.tagName === "BUTTON" ? u : s;
      [s, u].forEach((p) => p.removeAttribute("aria-current")), l && m.setAttribute("aria-current", "step"), u.tagName === "BUTTON" && (u.disabled = n.disabled), this._renderIcon(u.querySelector(".mtx-step__icon-container"), s, a, o, c, l), this._renderCaption(u.querySelector(".mtx-step__label-text"), s, n, t), u.querySelector(".mtx-step__sr-prefix").textContent = `${y("stepper", "step", { n: a + 1, total: e }, null, t)}: `;
      const _ = [];
      o && _.push(y("stepper", "completed", null, null, t)), c && !n.error && _.push(y("stepper", "error", null, null, t)), u.querySelector(".mtx-step__sr-status").textContent = _.length ? `, ${_.join(", ")}` : "";
      const x = s.querySelector(":scope > .mtx-step__content");
      if (x) {
        const p = this.orientation === "vertical" && h;
        x.setAttribute("aria-hidden", String(!p)), x.toggleAttribute("inert", !p);
      }
      const A = this._panel(s.getAttribute("data-panel"));
      A && (A.hidden = !l);
    });
    const i = this._panel(this.element.getAttribute("data-finished-panel"));
    i && (i.hidden = !this.finished), this._syncTriggers();
  }
  /**
   * Pinta el StepIcon: número, check, aviso o icono personalizado.
   * @param {HTMLElement} holder Contenedor del icono.
   * @param {HTMLElement} step Paso.
   * @param {number} index Índice.
   * @param {boolean} completed Completado.
   * @param {boolean} hasError En error.
   * @param {boolean} active Activo.
   */
  _renderIcon(t, e, i, s, a, n) {
    const l = e.getAttribute("data-icon"), o = a ? "error" : s ? "completed" : l ? `icon:${l}` : `n:${i + 1}`;
    t.setAttribute("aria-hidden", "true");
    const c = t.querySelector(".mtx-step-icon");
    if (c && c.getAttribute("data-kind") === o) {
      c.classList.toggle("mtx-step-icon--active", n);
      return;
    }
    t.textContent = "";
    let d;
    a ? d = Gi(tl, "mtx-step-icon mtx-step-icon--error") : s ? d = Gi(Qn, "mtx-step-icon mtx-step-icon--completed") : l ? d = I("span", "mtx-step-icon mtx-step-icon--custom material-icons", l) : d = I("span", "mtx-step-icon mtx-step-icon--number", String(i + 1)), d.setAttribute("data-kind", o), n && d.classList.add("mtx-step-icon--active"), t.appendChild(d);
  }
  /**
   * Pinta el caption opcional o el mensaje de error bajo la etiqueta.
   * @param {HTMLElement} text Contenedor de textos.
   * @param {HTMLElement} step Paso.
   * @param {{error: string|false}} state Estado.
   * @param {string} locale Idioma.
   */
  _renderCaption(t, e, i, s) {
    let a = t.querySelector(".mtx-step__optional");
    const n = e.getAttribute("data-optional");
    let l = null;
    if (i.error ? l = i.error : n !== null && n !== "false" && (l = n || y("stepper", "optional", null, null, s)), l === null) {
      a && a.hasAttribute("data-generated") && a.remove();
      return;
    }
    a || (a = I("span", "mtx-step__optional"), a.setAttribute("data-generated", ""), t.insertBefore(a, t.querySelector(".mtx-step__sr-status"))), a.hasAttribute("data-generated") && (a.textContent = l);
  }
  /**
   * Busca un panel asociado por selector.
   * @param {string|null} selector Selector CSS.
   * @returns {HTMLElement|null} Panel.
   */
  _panel(t) {
    if (!t) return null;
    try {
      return document.querySelector(t);
    } catch {
      return null;
    }
  }
  /** Elimina los listeners de la instancia. */
  destroy() {
    this.element.removeEventListener("click", this._handleClick), this.element.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
}
class tr extends Za {
  /**
   * Crea una instancia del stepper móvil.
   * @param {HTMLElement} element Elemento raíz.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-mobile-stepper");
    const e = t.getAttribute("data-variant");
    this.variant = ["dots", "text", "progress"].includes(e) ? e : "dots";
    const i = t.getAttribute("data-position");
    this.position = ["bottom", "top", "static"].includes(i) ? i : "static", t.classList.add(`mtx-mobile-stepper--${this.variant}`, `mtx-mobile-stepper--${this.position}`);
    const s = parseInt(t.getAttribute("data-steps") || "0", 10);
    this._steps = Number.isFinite(s) && s > 0 ? s : 1;
    const a = parseInt(t.getAttribute("data-active-step") || "0", 10);
    this._active = Number.isFinite(a) ? Math.min(Math.max(a, 0), this._steps - 1) : 0, this._build(), this._handleClick = (n) => {
      const l = n.target.closest(".mtx-mobile-stepper__back, .mtx-mobile-stepper__next");
      !l || l.disabled || (l.classList.contains("mtx-mobile-stepper__back") ? this.back() : this.next());
    }, this._handleLocaleChange = () => this._render(), t.addEventListener("click", this._handleClick), this.listen(document, "mtx:locale:change", this._handleLocaleChange), Ja(), this._render();
  }
  /** @returns {number} Total de pasos. */
  get length() {
    return this._steps;
  }
  /** @returns {number} Total de pasos. */
  get steps() {
    return this._steps;
  }
  /**
   * Cambia el número total de pasos.
   * @param {number} count Nuevo total (≥ 1).
   * @returns {this} La instancia.
   */
  setSteps(t) {
    const e = Math.max(1, Math.round(Number(t)) || 1);
    return this._steps = e, this.element.setAttribute("data-steps", String(e)), this._active = Math.min(this._active, e - 1), this._buildIndicator(), this._render(), this;
  }
  /** @returns {number} El último índice (el stepper móvil no tiene estado "terminado"). */
  _maxIndex() {
    return this._steps - 1;
  }
  /**
   * Vuelve al primer paso.
   * @returns {boolean} `true` si cambió.
   */
  reset() {
    return this.goTo(0);
  }
  /** Crea botones, indicador y región de estado accesible (o reutiliza los BEM existentes). */
  _build() {
    const { element: t } = this;
    this.backButton = t.querySelector(".mtx-mobile-stepper__back") || this._createButton("back"), this.nextButton = t.querySelector(".mtx-mobile-stepper__next") || this._createButton("next"), this.backButton.parentNode || t.insertBefore(this.backButton, t.firstChild), this.indicator = t.querySelector(".mtx-mobile-stepper__indicator"), this.indicator || (this.indicator = I("div", "mtx-mobile-stepper__indicator"), this.backButton.after(this.indicator)), this.nextButton.parentNode || t.appendChild(this.nextButton), this.status = t.querySelector(".mtx-mobile-stepper__status"), this.status || (this.status = I("span", "mtx-mobile-stepper__status"), this.status.setAttribute("aria-live", "polite"), t.appendChild(this.status)), this._buildIndicator();
  }
  /**
   * Crea un botón de texto con chevron.
   * @param {'back'|'next'} kind Tipo.
   * @returns {HTMLButtonElement} Botón.
   */
  _createButton(t) {
    const e = I("button", `mtx-button mtx-button--text mtx-button--small mtx-mobile-stepper__${t}`);
    e.type = "button", e.setAttribute("data-mtx", "button");
    const i = I("span", "mtx-button__icon material-icons", t === "back" ? "keyboard_arrow_left" : "keyboard_arrow_right");
    i.setAttribute("aria-hidden", "true");
    const s = I("span", "mtx-mobile-stepper__button-label");
    return t === "back" ? e.append(i, s) : e.append(s, i), U(e), e;
  }
  /** Genera el contenido del indicador según la variante. */
  _buildIndicator() {
    const { indicator: t } = this;
    if (t.setAttribute("aria-hidden", "true"), this.variant === "dots") {
      if (t.children.length === this._steps) return;
      t.textContent = "";
      for (let e = 0; e < this._steps; e += 1)
        t.appendChild(I("span", "mtx-mobile-stepper__dot"));
    } else if (this.variant === "progress") {
      if (t.querySelector(".mtx-mobile-stepper__progress")) return;
      const e = I("div", "mtx-mobile-stepper__progress");
      e.setAttribute("data-mtx", "linear-progress"), e.setAttribute("data-value", "0"), e.setAttribute("data-decorative", ""), t.appendChild(e), U(e);
    }
  }
  /** Actualiza indicador, botones y textos. */
  _render() {
    const t = k(this.element), e = this._steps, i = this._active;
    this.backButton.disabled = i <= 0, this.nextButton.disabled = i >= e - 1;
    const s = this.backButton.querySelector(".mtx-mobile-stepper__button-label"), a = this.nextButton.querySelector(".mtx-mobile-stepper__button-label");
    if (s && (s.textContent = this.element.getAttribute("data-back-label") || y("stepper", "back", null, null, t)), a && (a.textContent = this.element.getAttribute("data-next-label") || y("stepper", "next", null, null, t)), this.variant === "dots")
      Array.from(this.indicator.children).forEach((n, l) => {
        n.classList.toggle("mtx-mobile-stepper__dot--active", l === i);
      });
    else if (this.variant === "text")
      this.indicator.textContent = y("stepper", "fraction", { n: i + 1, total: e }, null, t);
    else {
      const n = this.indicator.querySelector(".mtx-mobile-stepper__progress"), l = e > 1 ? i / (e - 1) * 100 : 100, o = n ? L(n) : null;
      o && typeof o.setValue == "function" ? o.setValue(l) : n && n.style.setProperty("--mtx-mobile-stepper-value", `${l}%`);
    }
    this.status.textContent = y("stepper", "step", { n: i + 1, total: e }, null, t), this._syncTriggers();
  }
  /** Elimina los listeners de la instancia. */
  destroy() {
    this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
f("stepper", Qa);
f("mobile-stepper", tr);
const il = '<svg class="mtx-breadcrumbs__collapse-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>', sl = /^[a-z][a-z0-9_]{2,}$/;
function ke(r, t, e) {
  const i = Number.parseInt(r.getAttribute(t), 10);
  return Number.isFinite(i) && i >= 0 ? i : e;
}
class er extends g {
  /**
   * Crea la instancia y normaliza la estructura.
   *
   * @param {HTMLElement} element `<ol>`, `<ul>`, `<nav>` o contenedor de enlaces.
   */
  constructor(t) {
    super(t), this.source = t, this._expanded = !1, this._maxItems = ke(t, "data-max-items", 8), this._itemsBefore = ke(t, "data-items-before-collapse", 1), this._itemsAfter = ke(t, "data-items-after-collapse", 1), this._separator = t.getAttribute("data-separator") || "/", this._buildStructure(), this._items = Array.from(this.list.children).filter(
      (e) => !e.classList.contains("mtx-breadcrumbs__separator") && !e.classList.contains("mtx-breadcrumbs__collapsed")
    ), this._itemData = this._items.map((e) => this._normalizeItem(e)), this._ensureCurrent(), this._handleClick = (e) => this._onClick(e), this.list.addEventListener("click", this._handleClick), this._handleLocaleChange = () => this._refreshTexts(), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this._render();
  }
  /** @returns {boolean} `true` si la ruta está expandida por el usuario. */
  get expanded() {
    return this._expanded;
  }
  /** @returns {number} Máximo de ítems visibles antes de colapsar. */
  get maxItems() {
    return this._maxItems;
  }
  /** @param {number} value Nuevo máximo de ítems visibles. */
  set maxItems(t) {
    this._maxItems = Math.max(0, Number.parseInt(t, 10) || 0), this._render();
  }
  /**
   * Devuelve una copia de los ítems actuales.
   *
   * @returns {Array<{label: string, href: (string|null), icon: (string|null), current: boolean, data: Object}>} Ítems.
   */
  getItems() {
    return this._itemData.map((t) => ({ ...t, data: { ...t.data } }));
  }
  /**
   * Reemplaza la ruta completa (navegación dinámica / SPA).
   *
   * @param {Array<{label: string, href?: string, icon?: string, current?: boolean, data?: Object}>} items Ítems nuevos.
   * @throws {TypeError} Si `items` no es un array.
   */
  setItems(t) {
    if (!Array.isArray(t)) throw new TypeError("Breadcrumbs.setItems espera un array de ítems.");
    const e = t.some((i) => i && i.current === !0);
    this._items = t.map((i, s) => {
      const a = i || {}, n = e ? a.current === !0 : s === t.length - 1;
      return this._createItem({ ...a, current: n });
    }), this._itemData = this._items.map((i) => this._normalizeItem(i)), this._expanded = !1, this._render();
  }
  /**
   * Muestra todos los ítems ocultos por el colapso.
   *
   * @param {boolean} [focus=false] Mueve el foco al primer ítem revelado.
   */
  expand(t = !1) {
    if (!this._expanded) {
      if (this._expanded = !0, this._render(), t) {
        const e = this._items[this._itemsBefore], i = e && e.querySelector("a[href], button:not(:disabled)") || this.list.querySelector("a[href], button:not(:disabled), [tabindex]");
        i && i.focus();
      }
      v(this.element, "mtx:breadcrumbs:expand");
    }
  }
  /** Vuelve a aplicar el colapso definido por `data-max-items`. */
  collapse() {
    this._expanded && (this._expanded = !1, this._render());
  }
  /** Elimina los listeners instalados. */
  destroy() {
    this.list.removeEventListener("click", this._handleClick), super.destroy();
  }
  /**
   * Crea `<nav>` + `<ol>` a partir del elemento original.
   */
  _buildStructure() {
    const t = this.source, e = k(t);
    let i, s;
    t.tagName === "OL" || t.tagName === "UL" ? (i = t.closest("nav.mtx-breadcrumbs") || document.createElement("nav"), i.contains(t) || (t.parentNode.insertBefore(i, t), i.appendChild(t)), s = t, ["aria-label", "aria-labelledby"].forEach((a) => {
      t.hasAttribute(a) && (i.setAttribute(a, t.getAttribute(a)), t.removeAttribute(a));
    }), Array.from(t.classList).forEach((a) => {
      (a === "mtx-breadcrumbs" || a.startsWith("mtx-breadcrumbs--")) && (t.classList.remove(a), a !== "mtx-breadcrumbs" && (i.className += ` ${a}`));
    })) : (i = t, s = t.querySelector(":scope > ol, :scope > ul"), s || (s = document.createElement("ol"), Array.from(t.childNodes).forEach((a) => {
      if (a.nodeType === Node.ELEMENT_NODE) {
        const n = document.createElement("li");
        n.appendChild(a), s.appendChild(n);
      } else if (a.nodeType === Node.TEXT_NODE && a.textContent.trim()) {
        const n = document.createElement("li");
        n.textContent = a.textContent.trim(), s.appendChild(n), a.remove();
      } else
        a.remove();
    }), t.appendChild(s)), i.tagName !== "NAV" && !i.hasAttribute("role") && i.setAttribute("role", "navigation")), i.classList.add("mtx-breadcrumbs"), s.classList.add("mtx-breadcrumbs__ol"), this._autoLabel = !i.hasAttribute("aria-label") && !i.hasAttribute("aria-labelledby"), this._autoLabel && i.setAttribute("aria-label", y("breadcrumbs", "label", null, "breadcrumb", e)), this.element = i, this.list = s, i !== t && et(i, this);
  }
  /**
   * Normaliza un `<li>` existente y devuelve sus datos.
   *
   * @param {HTMLLIElement} li Ítem.
   * @returns {{label: string, href: (string|null), icon: (string|null), current: boolean, data: Object}} Datos del ítem.
   */
  _normalizeItem(t) {
    t.classList.add("mtx-breadcrumbs__li");
    let e = t.querySelector(":scope > a, :scope > button, :scope > span, :scope > .mtx-breadcrumbs__text");
    e || (e = document.createElement("span"), e.className = "mtx-breadcrumbs__text", e.textContent = t.textContent.trim(), t.textContent = "", t.appendChild(e)), e.tagName === "A" || e.tagName === "BUTTON" ? (e.classList.add("mtx-breadcrumbs__link"), !e.hasAttribute("data-mtx") && !e.classList.contains("mtx-link") && (e.hasAttribute("data-color") || e.setAttribute("data-color", "inherit"), e.hasAttribute("data-underline") || e.setAttribute("data-underline", "hover"), e.setAttribute("data-mtx", "link")), e.getAttribute("data-mtx") === "link" && U(e)) : e.classList.add("mtx-breadcrumbs__text");
    const i = e.getAttribute("data-icon") || t.getAttribute("data-icon");
    if (i && !e.querySelector(".mtx-breadcrumbs__icon")) {
      const n = document.createElement("span");
      n.className = "mtx-breadcrumbs__icon material-icons", n.setAttribute("aria-hidden", "true"), n.textContent = i, e.insertBefore(n, e.firstChild);
    }
    e.querySelector(".mtx-breadcrumbs__icon") && e.classList.add("mtx-breadcrumbs__item--with-icon");
    const s = e.cloneNode(!0);
    s.querySelectorAll(".mtx-breadcrumbs__icon, .mtx-ripple-container").forEach((n) => n.remove());
    const a = {};
    return Object.keys(e.dataset).forEach((n) => {
      ["mtx", "mtxInitialized", "color", "underline", "icon"].includes(n) || (a[n] = e.dataset[n]);
    }), this._contentOf = this._contentOf || /* @__PURE__ */ new WeakMap(), this._contentOf.set(t, e), {
      label: s.textContent.trim(),
      href: e.getAttribute("href"),
      icon: i || null,
      current: e.getAttribute("aria-current") === "page",
      data: a
    };
  }
  /**
   * Construye un `<li>` desde un objeto de `setItems()`.
   *
   * @param {{label: string, href?: string, icon?: string, current: boolean, data?: Object}} item Datos.
   * @returns {HTMLLIElement} Ítem creado.
   */
  _createItem(t) {
    const e = document.createElement("li");
    let i;
    return t.href != null && t.href !== "" ? (i = document.createElement("a"), i.href = t.href) : t.current ? i = document.createElement("span") : (i = document.createElement("button"), i.type = "button"), i.textContent = t.label == null ? "" : String(t.label), t.icon && i.setAttribute("data-icon", t.icon), t.current && i.setAttribute("aria-current", "page"), t.data && typeof t.data == "object" && Object.entries(t.data).forEach(([s, a]) => {
      a != null && (i.dataset[s] = String(a));
    }), e.appendChild(i), e;
  }
  /** Marca el último ítem como página actual si ninguno lo está. */
  _ensureCurrent() {
    if (!this._items.length || this._itemData.some((e) => e.current)) return;
    const t = this._items.length - 1;
    this._contentOf.get(this._items[t]).setAttribute("aria-current", "page"), this._itemData[t].current = !0;
  }
  /**
   * Crea un separador oculto a tecnologías de asistencia.
   *
   * @returns {HTMLLIElement} Separador.
   */
  _createSeparator() {
    const t = document.createElement("li");
    if (t.className = "mtx-breadcrumbs__separator", t.setAttribute("aria-hidden", "true"), sl.test(this._separator)) {
      const e = document.createElement("span");
      e.className = "material-icons", e.textContent = this._separator, t.appendChild(e);
    } else
      t.textContent = this._separator;
    return t;
  }
  /**
   * Crea el ítem con el botón que expande la ruta.
   *
   * @returns {HTMLLIElement} Ítem colapsado.
   */
  _createCollapsed() {
    const t = document.createElement("li");
    t.className = "mtx-breadcrumbs__collapsed";
    const e = document.createElement("button");
    return e.type = "button", e.className = "mtx-breadcrumbs__collapse-button", e.setAttribute("aria-label", this._showPathLabel()), e.innerHTML = il, e.addEventListener("click", () => this.expand(!0)), t.appendChild(e), this._collapseButton = e, t;
  }
  /** @returns {string} Texto accesible del botón de colapso. */
  _showPathLabel() {
    return this.source.getAttribute("data-expand-label") || y("breadcrumbs", "showPath", null, "Show path", k(this.element));
  }
  /** Pinta los ítems visibles, separadores y colapso. */
  _render() {
    const t = this._items, e = t.length;
    let i = t;
    const s = this._itemsBefore + this._itemsAfter < e;
    !this._expanded && this._maxItems > 0 && e > this._maxItems && s ? i = [
      ...t.slice(0, this._itemsBefore),
      this._createCollapsed(),
      ...t.slice(e - this._itemsAfter)
    ] : this._collapseButton = null;
    const a = [];
    i.forEach((n, l) => {
      l > 0 && a.push(this._createSeparator()), a.push(n);
    }), this.list.replaceChildren(...a), this.element.classList.toggle("mtx-breadcrumbs--collapsed", !!this._collapseButton);
  }
  /**
   * Emite `mtx:breadcrumbs:navigate` al activar un enlace (cancelable).
   *
   * @param {MouseEvent} event Clic original.
   */
  _onClick(t) {
    const e = t.target.closest("a, button");
    if (!e || !this.list.contains(e) || e.classList.contains("mtx-breadcrumbs__collapse-button")) return;
    const i = e.closest(".mtx-breadcrumbs__li"), s = this._items.indexOf(i);
    if (s < 0) return;
    const a = this._itemData[s];
    v(this.element, "mtx:breadcrumbs:navigate", {
      index: s,
      href: a.href,
      label: a.label,
      current: a.current,
      item: { ...a, data: { ...a.data } },
      originalEvent: t
    }, { cancelable: !0 }) || t.preventDefault();
  }
  /** Actualiza los textos traducidos al cambiar el idioma. */
  _refreshTexts() {
    const t = k(this.element);
    this._autoLabel && this.element.setAttribute("aria-label", y("breadcrumbs", "label", null, "breadcrumb", t)), this._collapseButton && this._collapseButton.setAttribute("aria-label", this._showPathLabel());
  }
}
f("breadcrumbs", er);
const al = {
  first: "M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z",
  previous: "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  next: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  last: "M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"
}, rl = ["text", "outlined"], nl = ["circular", "rounded"], ll = ["small", "medium", "large"], ol = ["standard", "primary", "secondary"], cl = ["first", "previous", "next", "last"];
function Se(r, t) {
  const e = t - r + 1;
  return e > 0 ? Array.from({ length: e }, (i, s) => r + s) : [];
}
function dl(r) {
  const { count: t, page: e, siblingCount: i, boundaryCount: s } = r, a = Se(1, Math.min(s, t)), n = Se(Math.max(t - s + 1, s + 1), t), l = Math.max(
    Math.min(e - i, t - s - i * 2 - 1),
    s + 2
  ), o = Math.min(
    Math.max(e + i, s + i * 2 + 2),
    n.length > 0 ? n[0] - 2 : t - 1
  );
  let c = [];
  l > s + 2 ? c = ["start-ellipsis"] : s + 1 < t - s && (c = [s + 1]);
  let d = [];
  return o < t - s - 1 ? d = ["end-ellipsis"] : t - s > s && (d = [t - s]), [
    ...r.showFirstButton ? ["first"] : [],
    ...r.hidePrevButton ? [] : ["previous"],
    ...a,
    ...c,
    ...Se(l, o),
    ...d,
    ...n,
    ...r.hideNextButton ? [] : ["next"],
    ...r.showLastButton ? ["last"] : []
  ];
}
class ir extends g {
  /**
   * Crea la paginación y pinta sus ítems.
   *
   * @param {HTMLElement} element `<nav>` (recomendado), `<div>` o `<ul>`.
   */
  constructor(t) {
    super(t), this.source = t;
    const e = (s, a, n) => {
      const l = Number.parseInt(t.getAttribute(s), 10);
      return Number.isFinite(l) ? Math.max(n, l) : a;
    }, i = (s) => t.hasAttribute(s) && t.getAttribute(s) !== "false";
    this._count = e("data-count", 1, 0), this._page = e("data-page", 1, 1), this._siblingCount = e("data-sibling-count", 1, 0), this._boundaryCount = e("data-boundary-count", 1, 0), this._options = {
      showFirstButton: i("data-show-first-button"),
      showLastButton: i("data-show-last-button"),
      hidePrevButton: i("data-hide-prev-button"),
      hideNextButton: i("data-hide-next-button")
    }, this._hrefTemplate = t.getAttribute("data-href-template"), this._disabled = i("data-disabled"), this._buildStructure(), this._handleClick = (s) => this._onClick(s), this._handlePointerDown = (s) => {
      const a = s.target.closest(".mtx-pagination__item");
      !a || s.button !== 0 || this._isItemDisabled(a) || z(a, s);
    }, this._handleLocaleChange = () => {
      this._autoLabel && this.element.setAttribute("aria-label", this._t("label", "pagination navigation")), this._render();
    }, this.list.addEventListener("click", this._handleClick), this.list.addEventListener("pointerdown", this._handlePointerDown), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this._page = this._clamp(this._page), this._render();
  }
  /** @returns {number} Página actual (base 1). */
  get page() {
    return this._page;
  }
  /** @param {number} value Página nueva; se ajusta a `[1, count]` sin emitir evento. */
  set page(t) {
    this._page = this._clamp(t), this._render();
  }
  /** @returns {number} Número total de páginas. */
  get count() {
    return this._count;
  }
  /** @param {number} value Total de páginas; la página actual se ajusta si queda fuera. */
  set count(t) {
    this._count = Math.max(0, Number.parseInt(t, 10) || 0), this._page = this._clamp(this._page), this._render();
  }
  /** @returns {boolean} `true` si la paginación está deshabilitada. */
  get disabled() {
    return this._disabled;
  }
  /** Deshabilita todos los ítems. */
  disable() {
    this._disabled = !0, this._render();
  }
  /** Habilita los ítems. */
  enable() {
    this._disabled = !1, this._render();
  }
  /**
   * Va a una página y emite `mtx:pagination:change` si cambia.
   *
   * @param {number} page Página destino (base 1).
   * @returns {boolean} `true` si la página cambió.
   */
  goTo(t) {
    const e = this._clamp(t);
    if (e === this._page || this._count === 0) return !1;
    const i = this._page;
    return this._page = e, this._render(), v(this.element, "mtx:pagination:change", { page: e, previousPage: i }), !0;
  }
  /** Va a la página siguiente. @returns {boolean} `true` si cambió. */
  next() {
    return this.goTo(this._page + 1);
  }
  /** Va a la página anterior. @returns {boolean} `true` si cambió. */
  previous() {
    return this.goTo(this._page - 1);
  }
  /** Elimina listeners instalados. */
  destroy() {
    this.list.removeEventListener("click", this._handleClick), this.list.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
  /** Crea `<nav>` + `<ul>` y aplica las clases de variante. */
  _buildStructure() {
    const t = this.source;
    let e = t, i;
    t.tagName === "UL" || t.tagName === "OL" ? (e = document.createElement("nav"), t.parentNode.insertBefore(e, t), e.appendChild(t), i = t, ["aria-label", "aria-labelledby"].forEach((a) => {
      t.hasAttribute(a) && (e.setAttribute(a, t.getAttribute(a)), t.removeAttribute(a));
    }), Array.from(t.classList).forEach((a) => {
      a.startsWith("mtx-pagination--") && (t.classList.remove(a), e.className += ` ${a}`);
    }), t.classList.remove("mtx-pagination")) : (i = t.querySelector(":scope > ul.mtx-pagination__ul, :scope > ul"), i || (i = document.createElement("ul"), t.appendChild(i)), t.tagName !== "NAV" && !t.hasAttribute("role") && t.setAttribute("role", "navigation"));
    const s = (a, n, l) => {
      const o = t.getAttribute(a);
      return n.includes(o) ? o : l;
    };
    this._variant = s("data-variant", rl, "text"), this._shape = s("data-shape", nl, "circular"), this._size = s("data-size", ll, "medium"), this._color = s("data-color", ol, "standard"), e.classList.add(
      "mtx-pagination",
      `mtx-pagination--${this._variant}`,
      `mtx-pagination--${this._shape}`,
      `mtx-pagination--${this._size}`,
      `mtx-pagination--color-${this._color}`
    ), i.classList.add("mtx-pagination__ul"), this.element = e, this.list = i, e !== t && et(e, this), this._autoLabel = !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby"), this._autoLabel && e.setAttribute("aria-label", this._t("label", "pagination navigation"));
  }
  /**
   * Traduce una clave del diccionario `pagination`.
   *
   * @param {string} key Clave.
   * @param {string} fallback Texto por defecto.
   * @param {Object} [params] Parámetros de interpolación.
   * @returns {string} Texto traducido.
   */
  _t(t, e, i = null) {
    return y("pagination", t, i, e, k(this.element || this.source));
  }
  /**
   * Ajusta un valor al rango válido de páginas.
   *
   * @param {number} value Página propuesta.
   * @returns {number} Página válida.
   */
  _clamp(t) {
    const e = Number.parseInt(t, 10), i = Math.max(1, this._count);
    return Math.min(Math.max(1, Number.isFinite(e) ? e : 1), i);
  }
  /**
   * Página destino de un tipo de botón de navegación.
   *
   * @param {string} type `first`, `previous`, `next` o `last`.
   * @returns {number} Página destino.
   */
  _targetOf(t) {
    return t === "first" ? 1 : t === "previous" ? this._page - 1 : t === "next" ? this._page + 1 : this._count;
  }
  /**
   * @param {HTMLElement} item Ítem.
   * @returns {boolean} `true` si el ítem no admite interacción.
   */
  _isItemDisabled(t) {
    return t.disabled === !0 || t.getAttribute("aria-disabled") === "true";
  }
  /**
   * Crea un ítem interactivo (botón o enlace).
   *
   * @param {number} page Página destino.
   * @param {string} key Clave de foco (`page-3`, `next`…).
   * @param {boolean} disabled Si está deshabilitado.
   * @returns {HTMLElement} Elemento creado.
   */
  _createControl(t, e, i) {
    let s;
    return this._hrefTemplate ? (s = document.createElement("a"), i ? (s.setAttribute("aria-disabled", "true"), s.setAttribute("role", "link")) : s.href = this._hrefTemplate.replace(/\{page\}/g, String(t))) : (s = document.createElement("button"), s.type = "button", s.disabled = i), s.className = "mtx-pagination__item", s.setAttribute("data-page", String(t)), s.setAttribute("data-key", e), s;
  }
  /** Pinta la lista completa conservando el foco. */
  _render() {
    const t = document.activeElement, e = t && this.list.contains(t) ? t.getAttribute("data-key") : null, s = (this._count > 0 ? dl({
      count: this._count,
      page: this._page,
      siblingCount: this._siblingCount,
      boundaryCount: this._boundaryCount,
      ...this._options
    }) : this._options.hidePrevButton && this._options.hideNextButton ? [] : cl.filter((a) => a === "first" && this._options.showFirstButton || a === "last" && this._options.showLastButton || a === "previous" && !this._options.hidePrevButton || a === "next" && !this._options.hideNextButton)).map((a) => {
      const n = document.createElement("li");
      if (typeof a == "number") {
        const l = a === this._page, o = this._createControl(a, `page-${a}`, this._disabled);
        o.classList.add("mtx-pagination__item--page"), o.textContent = String(a), o.setAttribute("aria-label", l ? this._t("page", "page {page}", { page: a }) : this._t("goToPage", "Go to page {page}", { page: a })), l && (o.setAttribute("aria-current", "page"), o.classList.add("mtx-pagination__item--selected")), n.appendChild(o);
      } else if (a === "start-ellipsis" || a === "end-ellipsis") {
        const l = document.createElement("div");
        l.className = "mtx-pagination__ellipsis", l.textContent = "…", this._disabled && l.classList.add("mtx-pagination__ellipsis--disabled"), n.appendChild(l);
      } else {
        const l = this._targetOf(a), o = this._disabled || this._count === 0 || (a === "first" || a === "previous" ? this._page <= 1 : this._page >= this._count), c = this._createControl(l, a, o);
        c.classList.add("mtx-pagination__item--nav", `mtx-pagination__item--${a}`), c.setAttribute("aria-label", this._t(a, `Go to ${a} page`)), c.innerHTML = `<svg class="mtx-pagination__icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="${al[a]}"/></svg>`, n.appendChild(c);
      }
      return n;
    });
    if (this.list.replaceChildren(...s), this.element.classList.toggle("mtx-pagination--disabled", this._disabled), this.source.setAttribute("data-page", String(this._page)), this.source.setAttribute("data-count", String(this._count)), e) {
      let a = this.list.querySelector(`[data-key="${e}"]`);
      (!a || this._isItemDisabled(a)) && (a = this.list.querySelector('[aria-current="page"]')), a && a.focus();
    }
  }
  /**
   * Gestiona la activación de un ítem.
   *
   * @param {MouseEvent} event Clic original.
   */
  _onClick(t) {
    const e = t.target.closest(".mtx-pagination__item");
    if (!e || !this.list.contains(e)) return;
    if (this._isItemDisabled(e)) {
      t.preventDefault();
      return;
    }
    const i = Number.parseInt(e.getAttribute("data-page"), 10);
    if (!this._hrefTemplate) {
      this.goTo(i);
      return;
    }
    if (i === this._page) return;
    v(this.element, "mtx:pagination:change", {
      page: i,
      previousPage: this._page,
      href: e.getAttribute("href")
    }, { cancelable: !0 }) || (t.preventDefault(), this._page = this._clamp(i), this._render());
  }
}
f("pagination", ir);
const Ve = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function Yt(r) {
  return r ? Array.from(r.querySelectorAll(Ve)).filter((t) => !t.hidden && t.getAttribute("aria-hidden") !== "true" && t.getClientRects().length > 0) : [];
}
function sr(r) {
  return r ? r.matches(Ve) || r.hasAttribute("tabindex") ? r : Yt(r)[0] || r.querySelector(Ve) || null : null;
}
function oe(r, t) {
  const e = sr(t) || Yt(r)[0] || r;
  !e.hasAttribute("tabindex") && e === r && (e.tabIndex = -1), e.focus();
}
function hl(r) {
  if (r.tabIndex < 0 || r.closest("[inert]")) return !1;
  const t = r.ownerDocument.defaultView;
  if (t && t.getComputedStyle(r).visibility === "hidden") return !1;
  if (r.type === "radio" && r.name && !r.checked) {
    const e = r.form || r.ownerDocument;
    if (Array.from(e.querySelectorAll('input[type="radio"]:checked')).some((s) => s.name === r.name && s !== r)) return !1;
  }
  return !0;
}
function ul(r) {
  const t = /* @__PURE__ */ new Set();
  return Yt(r).filter((e) => {
    if (!hl(e)) return !1;
    if (e.type === "radio" && e.name && !e.checked) {
      if (t.has(e.name)) return !1;
      t.add(e.name);
    }
    return !0;
  });
}
function di(r, t) {
  r.preventDefault();
  const e = ul(t);
  if (!e.length) {
    oe(t);
    return;
  }
  const i = document.activeElement;
  let s = e.indexOf(i);
  if (s === -1 && t.contains(i)) {
    const n = e.findIndex((l) => i.compareDocumentPosition(l) & Node.DOCUMENT_POSITION_FOLLOWING);
    s = n === -1 ? e.length : n, r.shiftKey || (s -= 1);
  }
  let a;
  r.shiftKey ? a = s <= 0 ? e.length - 1 : s - 1 : a = s === -1 || s >= e.length - 1 ? 0 : s + 1, e[a].focus();
}
const Xi = '.mtx-dialog__actions, [data-mtx="dialog-actions"]', Zt = ["start", "center", "end", "between"];
function Ue(r, t = null) {
  r.classList.add("mtx-dialog__actions");
  const e = r.getAttribute("data-align"), i = Zt.find((n) => r.classList.contains(`mtx-dialog__actions--${n}`)), s = [e, i, t].find((n) => Zt.includes(n)) || "end";
  Zt.forEach((n) => {
    r.classList.toggle(`mtx-dialog__actions--${n}`, n === s && n !== "end");
  });
  const a = r.getAttribute("data-disable-spacing");
  return a !== null && a !== "false" && r.classList.add("mtx-dialog__actions--disable-spacing"), s;
}
class ar extends g {
  /**
   * Crea una instancia del diálogo.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-dialog") || t.classList.add("mtx-dialog");
    let e = t.querySelector(".mtx-dialog__paper");
    e || (e = this._scaffold(t)), this.paper = e, this.paper.setAttribute("role", this.paper.getAttribute("role") || "dialog"), this.paper.setAttribute("aria-modal", "true"), this.paper.tabIndex = this.paper.hasAttribute("tabindex") ? this.paper.tabIndex : -1, ["aria-labelledby", "aria-describedby", "aria-label"].forEach((i) => {
      t.hasAttribute(i) && !this.paper.hasAttribute(i) && this.paper.setAttribute(i, t.getAttribute(i));
    }), this._linkAria(), this._applyActionsAlign(), this.scroll = t.getAttribute("data-scroll") || "paper", t.classList.add(`mtx-dialog--scroll-${this.scroll}`), this._previousFocus = null, this._handleKeydown = (i) => this._onKeydown(i), this._handleCloseClick = (i) => {
      const s = i.target.closest("[data-mtx-dialog-close]");
      if (!s) return;
      const a = s.classList.contains("mtx-dialog__backdrop");
      a && t.hasAttribute("data-disable-backdrop-close") || this.close(a ? "backdropClick" : "closeButtonClick");
    }, this._handleFocusIn = (i) => {
      this.isOpen && He(this.element) && !this.paper.contains(i.target) && !lt(this, i.target) && oe(this.paper, this.element.querySelector("[data-dialog-autofocus]"));
    }, t.addEventListener("click", this._handleCloseClick), this.listen(document, "keydown", this._handleKeydown), this.listen(document, "focusin", this._handleFocusIn);
  }
  /**
   * Auto-construye backdrop, panel, título, contenido y acciones desde la sintaxis simplificada.
   *
   * @param {HTMLElement} element Contenedor del diálogo.
   * @returns {HTMLElement} Panel creado.
   */
  _scaffold(t) {
    let e = t.querySelector(":scope > .mtx-dialog__backdrop");
    e || (e = document.createElement("div"), e.className = "mtx-dialog__backdrop", e.setAttribute("data-mtx-dialog-close", ""), t.appendChild(e));
    const i = document.createElement("div");
    i.className = "mtx-dialog__paper", i.setAttribute("role", "dialog"), i.setAttribute("aria-modal", "true");
    const s = Array.from(t.childNodes).filter((h) => h !== e), a = (h, u) => h.nodeType === 1 && h.classList.contains(u);
    let n = s.find((h) => a(h, "mtx-dialog__title")) || null;
    const l = s.filter((h) => h.nodeType === 1 && h.matches(Xi));
    let o = s.find((h) => a(h, "mtx-dialog__content")) || null;
    const c = t.getAttribute("data-title");
    !n && c && (n = document.createElement("h2"), n.className = "mtx-dialog__title", n.textContent = c), n && i.appendChild(n), o || (o = document.createElement("div"), o.className = "mtx-dialog__content", s.filter((h) => h !== n && !l.includes(h)).forEach((h) => o.appendChild(h)));
    const d = t.getAttribute("data-description");
    if (d && !o.querySelector(".mtx-dialog__content-text")) {
      const h = document.createElement("p");
      h.className = "mtx-dialog__content-text", h.textContent = d, o.insertBefore(h, o.firstChild);
    }
    return i.appendChild(o), l.forEach((h) => i.appendChild(h)), t.appendChild(i), i;
  }
  /**
   * Da nombre y descripción accesibles al panel: enlaza `aria-labelledby` con el título y
   * `aria-describedby` con `.mtx-dialog__content-text`, generando ids cuando falten.
   */
  _linkAria() {
    const t = this.element.id || P("mtx-dialog"), e = this.paper.hasAttribute("aria-labelledby") || this.paper.hasAttribute("aria-label"), i = this.paper.querySelector(".mtx-dialog__title");
    i && !e && (i.id || (i.id = `${t}-title`), this.paper.setAttribute("aria-labelledby", i.id));
    const s = this.paper.querySelector(".mtx-dialog__content-text");
    s && !this.paper.hasAttribute("aria-describedby") && (s.id || (s.id = `${t}-description`), this.paper.setAttribute("aria-describedby", s.id));
  }
  /**
   * Propaga `data-actions-align` del diálogo a sus contenedores de acciones sin alineación propia.
   */
  _applyActionsAlign() {
    const t = this.element.getAttribute("data-actions-align");
    this.paper.querySelectorAll(Xi).forEach((e) => {
      e.closest(".mtx-dialog__paper") === this.paper && Ue(e, t);
    });
  }
  /**
   * Indica si el diálogo está abierto.
   *
   * @returns {boolean} `true` si está abierto.
   */
  get isOpen() {
    return this.element.classList.contains("mtx-dialog--open");
  }
  /**
   * Abre el diálogo, gestiona el foco y bloquea el scroll.
   */
  open() {
    this.isOpen || (this._previousFocus = this._resolveReturnFocus(), this._openTrigger = null, this.element.classList.add("mtx-dialog--open"), me(this.element), X(this, {
      kind: "modal",
      nodes: this.element,
      // Abierto desde otra capa (p. ej. un Popover portado): queda por encima de ella.
      stack: [{ node: this.element }],
      onEscape: () => {
        this.element.hasAttribute("data-disable-escape") || this.close("escapeKeyDown");
      }
    }), this._focusFirst(), v(this.element, "mtx:dialog:open"));
  }
  /**
   * Destino del foco al cerrar. Un clic en WebKit no enfoca el botón (el foco queda en
   * body o en un ancestro con tabindex="-1"): entonces se usa el disparador pulsado.
   *
   * @returns {HTMLElement|null} Elemento al que devolver el foco.
   */
  _resolveReturnFocus() {
    const t = document.activeElement;
    return t && t !== document.body && t.tabIndex >= 0 && !this.element.contains(t) ? t : this._openTrigger && this._openTrigger.isConnected ? this._openTrigger : t;
  }
  /**
   * Cierra el diálogo y restaura el foco.
   *
   * @param {string} [reason='programmatic'] Motivo de cierre.
   */
  close(t = "programmatic") {
    this.isOpen && (this.element.classList.remove("mtx-dialog--open"), pe(this.element), q(this), this._previousFocus && this._previousFocus.isConnected && this._previousFocus.focus && this._previousFocus.focus(), v(this.element, "mtx:dialog:close", { reason: t }));
  }
  /**
   * Enfoca el primer elemento enfocable del panel, o el marcado con
   * `data-dialog-autofocus` si existe.
   */
  _focusFirst() {
    oe(this.paper, this.element.querySelector("[data-dialog-autofocus]"));
  }
  /**
   * Gestiona Tab para mantener el foco dentro (Escape lo entrega la pila de capas).
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeydown(t) {
    !this.isOpen || !He(this.element) || lt(this, document.activeElement) || t.key === "Tab" && this._trapFocus(t);
  }
  /**
   * Mantiene el foco dentro del diálogo (focus trap).
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _trapFocus(t) {
    di(t, this.paper);
  }
  /**
   * Obtiene los elementos enfocables dentro del panel.
   *
   * @returns {HTMLElement[]} Elementos enfocables.
   */
  _getFocusable() {
    return Yt(this.paper);
  }
  /**
   * Cierra el diálogo si está abierto, libera sus listeners y lo desvincula del registro.
   */
  destroy() {
    this.isOpen && this.close(), this.element.removeEventListener("click", this._handleCloseClick), super.destroy();
  }
}
class rr extends g {
  /**
   * Crea la instancia y aplica alineación y espaciado.
   *
   * @param {HTMLElement} element Contenedor de las acciones.
   */
  constructor(t) {
    super(t);
    const e = t.closest('.mtx-dialog, [data-mtx="dialog"]');
    this._align = Ue(t, e ? e.getAttribute("data-actions-align") : null);
  }
  /** @returns {string} Alineación actual (`start`, `center`, `end` o `between`). */
  get align() {
    return this._align;
  }
  /**
   * Cambia la alineación de las acciones.
   *
   * @param {string} value `start`, `center`, `end` o `between`.
   * @throws {RangeError} Si el valor no es una alineación válida.
   */
  set align(t) {
    if (!Zt.includes(t))
      throw new RangeError(`Alineación no válida: ${t}`);
    this.element.setAttribute("data-align", t), this._align = Ue(this.element);
  }
}
f("dialog", ar);
f("dialog-actions", rr);
typeof document < "u" && document.addEventListener("click", (r) => {
  const t = r.target.closest("[data-mtx-dialog-open]");
  if (!t) return;
  const e = t.getAttribute("data-mtx-dialog-open"), i = document.getElementById(e);
  if (i) {
    const s = L(i);
    s && typeof s.open == "function" && (s.isOpen || (s._openTrigger = t), s.open());
  }
});
const Ji = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }, Zi = "mtx-drawer-trigger--hidden";
class nr extends g {
  /**
   * Crea una instancia del drawer.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-drawer") || t.classList.add("mtx-drawer"), this._userRole = t.getAttribute("role"), this.anchor = t.getAttribute("data-anchor") || "left", this.variant = t.getAttribute("data-variant") || "temporary", this.breakpoint = t.getAttribute("data-breakpoint") || "md", this.mode = null, this.isAbsolute = t.hasAttribute("data-absolute") || t.classList.contains("mtx-drawer--absolute"), this.isAbsolute && t.classList.add("mtx-drawer--absolute"), this._applyWidth(t.getAttribute("data-width"));
    const e = t.getAttribute("data-elevation");
    e !== null && (t.style.boxShadow = `var(--mtx-elevation-${e})`), t.hasAttribute("data-clipped") && t.getAttribute("data-clipped") !== "false" && t.classList.add("mtx-drawer--clipped"), t.classList.add(`mtx-drawer--${this.anchor}`), this.variant === "responsive" && t.classList.add("mtx-drawer--responsive"), this._buildStructure();
    const i = t.classList.contains("mtx-drawer--open") || t.hasAttribute("data-open");
    if (this.variant === "permanent") {
      this._setMode("permanent");
      return;
    }
    this._handleClose = (s) => {
      const a = s.target.closest("[data-mtx-drawer-close]");
      if (a) {
        const n = a.getAttribute("data-mtx-drawer-close");
        (!n || n === this.element.id) && this.close("closeButtonClick");
      }
    }, this.listen(t, "click", this._handleClose), this.variant === "persistent" ? this._setMode("persistent") : this.variant === "responsive" ? this._bindMediaQuery() : this._setMode("temporary"), i && this.mode !== "permanent" && this.open();
  }
  /**
   * Indica si el drawer está abierto (siempre `true` en modo permanente).
   *
   * @returns {boolean} `true` si está abierto.
   */
  get isOpen() {
    return this.element.classList.contains("mtx-drawer--open");
  }
  /**
   * Aplica el ancho declarado en `data-width`.
   *
   * @param {string|null} width Valor del atributo.
   */
  _applyWidth(t) {
    const e = this.element;
    t === "wide" ? e.classList.add("mtx-drawer--wide") : t === "narrow" ? e.classList.add("mtx-drawer--narrow") : t === "full" || t === "full-width" ? e.classList.add("mtx-drawer--full-width") : t && (e.style.width = t, e.style.setProperty("--mtx-drawer-width", t));
  }
  /**
   * Genera cabecera, pie y panel de contenido (sintaxis simplificada) sin duplicar el BEM existente.
   */
  _buildStructure() {
    const t = this.element;
    let e = t.querySelector(".mtx-drawer__header");
    const i = t.getAttribute("data-title"), s = t.getAttribute("data-user-name"), a = t.getAttribute("data-user-email");
    if (!e && (i || s || a)) {
      if (e = document.createElement("div"), e.className = "mtx-drawer__header", s || a)
        e.appendChild(this._buildUser(s, a));
      else {
        const d = document.createElement("div");
        d.className = "mtx-drawer__heading";
        const h = document.createElement("h3");
        h.className = "mtx-drawer__title", h.textContent = i, d.appendChild(h);
        const u = t.getAttribute("data-subtitle");
        if (u) {
          const m = document.createElement("div");
          m.className = "mtx-drawer__subtitle", m.textContent = u, d.appendChild(m);
        }
        e.appendChild(d);
      }
      if (t.getAttribute("data-close-button") !== "false" && this.variant !== "permanent") {
        const d = document.createElement("button");
        d.type = "button", d.className = "mtx-icon-button mtx-drawer__close", d.setAttribute("aria-label", y("drawer", "close", null, "Close", k(t))), d.setAttribute("data-mtx-drawer-close", ""), d.innerHTML = '<span class="material-icons" aria-hidden="true">close</span>', e.appendChild(d);
      }
    }
    e && t.getAttribute("data-header") === "temporary" && e.classList.add("mtx-drawer__temporary-only");
    let n = t.querySelector(".mtx-drawer__footer");
    const l = t.getAttribute("data-footer-version"), o = t.getAttribute("data-footer-action");
    if (!n && (l || o)) {
      if (n = document.createElement("div"), n.className = "mtx-drawer__footer", l) {
        const d = document.createElement("div");
        d.className = "mtx-drawer__footer-info", d.textContent = l, n.appendChild(d);
      }
      if (o) {
        const d = document.createElement("div");
        d.className = "mtx-drawer__footer-actions";
        const h = document.createElement("button");
        h.type = "button", h.className = "mtx-button mtx-button--text mtx-button--small mtx-button--error", h.setAttribute("data-mtx", "button"), h.setAttribute("data-mtx-drawer-close", "");
        const u = document.createElement("span");
        u.className = "material-icons", u.setAttribute("aria-hidden", "true"), u.textContent = t.getAttribute("data-footer-action-icon") || "logout", h.append(u, ` ${o}`), d.appendChild(h), n.appendChild(d);
      }
    }
    let c = t.querySelector(".mtx-drawer__content");
    if (!c) {
      c = document.createElement("div"), c.className = "mtx-drawer__content";
      const d = Array.from(t.childNodes).filter((h) => h !== e && h !== n);
      for (const h of d)
        c.appendChild(h);
      t.appendChild(c);
    }
    e && e.parentElement !== t && t.insertBefore(e, c), n && n.parentElement === t && t.appendChild(n), this.panel = c, this.header = e, this.footer = n, (t.getAttribute("data-padded") === "true" || t.classList.contains("mtx-drawer--padded")) && c.classList.add("mtx-drawer__content--padded"), t.style.padding && (c.style.padding = t.style.padding, t.style.padding = "");
  }
  /**
   * Construye la cabecera de usuario con avatar, nombre y correo.
   *
   * @param {string|null} userName Nombre del usuario.
   * @param {string|null} userEmail Correo del usuario.
   * @returns {HTMLElement} Contenedor `.mtx-drawer__user`.
   */
  _buildUser(t, e) {
    const i = document.createElement("div");
    i.className = "mtx-drawer__user";
    const s = this.element.getAttribute("data-user-avatar") || (t ? t.charAt(0).toUpperCase() : "");
    if (s) {
      const n = document.createElement("div");
      n.className = "mtx-avatar mtx-avatar--circular mtx-drawer__user-avatar", n.setAttribute("data-mtx", "avatar"), n.textContent = s, i.appendChild(n), U(n);
    }
    const a = document.createElement("div");
    if (a.className = "mtx-drawer__user-info", t) {
      const n = document.createElement("div");
      n.className = "mtx-drawer__user-name", n.textContent = t, a.appendChild(n);
    }
    if (e) {
      const n = document.createElement("div");
      n.className = "mtx-drawer__user-email", n.textContent = e, a.appendChild(n);
    }
    return i.appendChild(a), i;
  }
  /**
   * Observa el breakpoint de la variante responsive y cambia de modo al cruzarlo.
   */
  _bindMediaQuery() {
    const t = Ji[this.breakpoint] ?? Ji.md;
    if (typeof window > "u" || typeof window.matchMedia != "function") {
      this._setMode("temporary");
      return;
    }
    this._mql = window.matchMedia(`(min-width: ${t}px)`), this._onMediaChange = () => this._setMode(this._mql.matches ? "permanent" : "temporary"), this._mql.addEventListener ? this.listen(this._mql, "change", this._onMediaChange) : this._mql.addListener && (this._mql.addListener(this._onMediaChange), this.onDestroy(() => this._mql.removeListener(this._onMediaChange))), this._onMediaChange();
  }
  /**
   * Cambia el modo efectivo y sincroniza clases, ARIA, fondo, disparadores y foco.
   *
   * @param {'temporary'|'persistent'|'permanent'} mode Modo destino.
   */
  _setMode(t) {
    if (t === this.mode) return;
    const e = this.mode, i = this.element, s = i.contains(document.activeElement);
    if (e === "temporary" && this.isOpen && this._releaseModal(), i.classList.remove("mtx-drawer--animated", "mtx-drawer--temporary", "mtx-drawer--persistent", "mtx-drawer--permanent", "mtx-drawer--open"), this.mode = t, t === "permanent" ? (i.classList.add("mtx-drawer--permanent", "mtx-drawer--open"), i.setAttribute("aria-hidden", "false"), this._setPanelDialog(!1), this._userRole || i.setAttribute("role", "navigation"), this.backdrop && this.backdrop.classList.remove("mtx-drawer__backdrop--open")) : t === "persistent" ? (i.classList.add("mtx-drawer--persistent"), i.setAttribute("aria-hidden", "true"), this._userRole || i.setAttribute("role", "region"), this.panel.setAttribute("tabindex", "-1")) : (i.classList.add("mtx-drawer--temporary"), i.setAttribute("aria-hidden", "true"), this._userRole || i.removeAttribute("role"), this._setPanelDialog(!0), this._ensureBackdrop()), this._syncTriggers(this.isOpen), e && t === "temporary" && s) {
      const a = this._getTriggers().find((n) => n.offsetParent !== null || n.getClientRects().length > 0);
      a && a.focus ? a.focus() : document.activeElement && document.activeElement.blur && document.activeElement.blur();
    }
    e && v(
      i,
      "mtx:drawer:mode-change",
      { mode: t, previousMode: e },
      { aliases: ["mtx:drawer:modechange"] }
    );
  }
  /**
   * Aplica o retira la semántica de diálogo modal del panel interior.
   *
   * @param {boolean} enabled `true` para el modo temporal.
   */
  _setPanelDialog(t) {
    const e = this.panel;
    if (t) {
      if (e.hasAttribute("role") || (e.setAttribute("role", "dialog"), this._panelRoleAdded = !0), e.setAttribute("aria-modal", "true"), e.hasAttribute("tabindex") || (e.tabIndex = -1, this._panelTabindexAdded = !0), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby")) {
        const i = this.element.getAttribute("aria-label"), s = this.header && this.header.querySelector(".mtx-drawer__title, .mtx-drawer__user-name");
        i ? (e.setAttribute("aria-label", i), this._panelLabelAdded = "aria-label") : s && (s.id || (s.id = P("mtx-drawer-title")), e.setAttribute("aria-labelledby", s.id), this._panelLabelAdded = "aria-labelledby");
      }
      return;
    }
    this._panelRoleAdded && (e.removeAttribute("role"), this._panelRoleAdded = !1), e.removeAttribute("aria-modal"), this._panelTabindexAdded && (e.removeAttribute("tabindex"), this._panelTabindexAdded = !1), this._panelLabelAdded && (e.removeAttribute(this._panelLabelAdded), this._panelLabelAdded = null);
  }
  /**
   * Crea el fondo (backdrop) del modo temporal si procede y aún no existe.
   */
  _ensureBackdrop() {
    const t = this.element;
    this.backdrop || t.getAttribute("data-backdrop") === "false" || t.hasAttribute("data-hide-backdrop") || (this.backdrop = document.createElement("div"), this.backdrop.className = "mtx-drawer__backdrop", this.isAbsolute && t.parentElement ? (this.backdrop.classList.add("mtx-drawer__backdrop--absolute"), t.parentElement.appendChild(this.backdrop)) : document.body.appendChild(this.backdrop), this._handleBackdrop = () => {
      this.element.hasAttribute("data-disable-backdrop-click") || this.close("backdropClick");
    }, this.listen(this.backdrop, "click", this._handleBackdrop));
  }
  /**
   * Abre el drawer. No hace nada en modo permanente.
   */
  open() {
    if (!this.isOpen) {
      if (this._previousFocus = this._resolveReturnFocus(), this._openTrigger = null, this.element.classList.add("mtx-drawer--animated", "mtx-drawer--open"), this.element.setAttribute("aria-hidden", "false"), this._syncTriggers(!0), this.mode === "persistent") {
        v(this.element, "mtx:drawer:open");
        return;
      }
      this.backdrop && this.backdrop.classList.add("mtx-drawer__backdrop--open"), this.isAbsolute || me(this.element), X(this, {
        kind: "modal",
        nodes: () => [this.element, this.backdrop],
        stack: () => [{ node: this.element }, { node: this.backdrop, offset: -1 }],
        onEscape: () => {
          this.element.hasAttribute("data-disable-escape") || this.close("escapeKeyDown");
        }
      }), this._keydownCleanup = this._bindKeyboard(), this._clickAwayCleanup = qt(this.element, (t) => {
        t && lt(this, t.target) || this.element.hasAttribute("data-disable-backdrop-click") || this.close("clickaway");
      }), oe(this.panel, this.element.querySelector("[data-drawer-autofocus]")), v(this.element, "mtx:drawer:open");
    }
  }
  /**
   * Destino del foco al cerrar. Un clic en WebKit no enfoca el botón (el foco queda en
   * body o en un ancestro con tabindex="-1"): entonces se usa el disparador pulsado.
   *
   * @returns {HTMLElement|null} Elemento al que devolver el foco.
   */
  _resolveReturnFocus() {
    const t = document.activeElement;
    return t && t !== document.body && t.tabIndex >= 0 && !this.element.contains(t) ? t : this._openTrigger && this._openTrigger.isConnected ? this._openTrigger : t;
  }
  /**
   * Cierra el drawer. No hace nada en modo permanente.
   *
   * @param {string} [reason='programmatic'] Motivo del cierre.
   */
  close(t = "programmatic") {
    !this.isOpen || this.mode === "permanent" || (this.element.classList.add("mtx-drawer--animated"), this.element.classList.remove("mtx-drawer--open"), this.element.setAttribute("aria-hidden", "true"), this._syncTriggers(!1), this.mode !== "persistent" && this._releaseModal(), this._openTrigger = null, this._previousFocus && this._previousFocus.isConnected && this._previousFocus.focus && this._previousFocus.focus(), v(this.element, "mtx:drawer:close", { reason: t }));
  }
  /**
   * Libera el fondo, el bloqueo de scroll y los listeners del modo temporal.
   */
  _releaseModal() {
    this.backdrop && this.backdrop.classList.remove("mtx-drawer__backdrop--open"), this.isAbsolute || pe(this.element), q(this), this._unbindModalListeners();
  }
  /**
   * Retira los listeners de documento del modo temporal (teclado y click-away). Idempotente.
   */
  _unbindModalListeners() {
    this._keydownCleanup && (this._keydownCleanup(), this._keydownCleanup = null), this._clickAwayCleanup && (this._clickAwayCleanup(), this._clickAwayCleanup = null);
  }
  /**
   * Alterna el estado abierto/cerrado del drawer.
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  /**
   * Devuelve los disparadores declarativos (`open` y `toggle`) asociados a este drawer.
   *
   * @returns {HTMLElement[]} Disparadores encontrados en el documento.
   */
  _getTriggers() {
    if (!this.element.id) return [];
    const t = typeof CSS < "u" && CSS.escape ? CSS.escape(this.element.id) : this.element.id;
    return Array.from(document.querySelectorAll(`[data-mtx-drawer-open="${t}"], [data-mtx-drawer-toggle="${t}"]`));
  }
  /**
   * Sincroniza `aria-controls`/`aria-expanded` de los disparadores y, en la variante
   * responsive, los oculta mientras el drawer es permanente.
   *
   * @param {boolean} [expanded=this.isOpen] Estado expandido.
   */
  syncTriggers(t = this.isOpen) {
    this._syncTriggers(t);
  }
  /**
   * @param {boolean} expanded Estado expandido.
   */
  _syncTriggers(t) {
    const e = this.variant === "responsive" && this.mode === "permanent";
    this._getTriggers().forEach((i) => {
      i.setAttribute("aria-controls", this.element.id), i.setAttribute("aria-expanded", String(t)), this.variant === "responsive" && i.classList.toggle(Zi, e);
    });
  }
  /**
   * Vincula el teclado (Tab trapping; Escape lo entrega la pila de capas).
   *
   * @returns {Function} Función de limpieza.
   */
  _bindKeyboard() {
    const t = (e) => {
      !He(this.element) && !this.isAbsolute || lt(this, document.activeElement) || e.key === "Tab" && di(e, this.panel);
    };
    return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
  }
  /**
   * Cierra el drawer, libera listeners y media queries, retira el backdrop portado
   * y desvincula la instancia (no deshace el auto-scaffolding).
   */
  destroy() {
    this.isOpen && this.mode !== "permanent" && this.close(), this._unbindModalListeners(), q(this), this._mql && this._onMediaChange && this._getTriggers().forEach((t) => t.classList.remove(Zi)), this.backdrop && this.backdrop.parentElement && this.backdrop.remove(), super.destroy(), this._mql = null, this._previousFocus = null, this._openTrigger = null;
  }
}
f("drawer", nr);
typeof document < "u" && document.addEventListener("click", (r) => {
  const t = r.target.closest("[data-mtx-drawer-open]");
  if (t) {
    const a = document.getElementById(t.getAttribute("data-mtx-drawer-open")), n = a ? L(a) : null;
    n && (n._openTrigger = t, n.open());
    return;
  }
  const e = r.target.closest("[data-mtx-drawer-close]");
  if (e) {
    const a = e.getAttribute("data-mtx-drawer-close");
    if (a) {
      const n = document.getElementById(a), l = n ? L(n) : null;
      l && l.close("closeButtonClick");
    }
    return;
  }
  const i = r.target.closest("[data-mtx-drawer-toggle]");
  if (i) {
    const a = document.getElementById(i.getAttribute("data-mtx-drawer-toggle")), n = a ? L(a) : null;
    n && (n._openTrigger = i, n.toggle());
    return;
  }
  const s = r.target.closest("[data-mtx-collapse-trigger]");
  if (s) {
    const a = s.getAttribute("data-mtx-collapse-trigger"), n = document.getElementById(a);
    if (n) {
      const l = s.getAttribute("aria-expanded") !== "true";
      s.setAttribute("aria-expanded", String(l));
      const o = s.querySelector(".mtx-collapse-indicator");
      o && o.textContent.trim() === "expand_more" && (o.textContent = "chevron_right"), l ? (n.removeAttribute("hidden"), n.removeAttribute("inert"), n.classList.remove("mtx-collapse--collapsing"), n.offsetHeight, n.classList.add("mtx-collapse--open")) : (n.setAttribute("hidden", ""), n.setAttribute("inert", ""), n.classList.remove("mtx-collapse--open"), n.classList.add("mtx-collapse--collapsing"), setTimeout(() => {
        n.hasAttribute("hidden") && n.classList.remove("mtx-collapse--collapsing");
      }, 250));
    }
  }
});
class lr extends g {
  /**
   * Crea una instancia de AppBar.
   *
   * @param {HTMLElement} element Elemento HTML asociado.
   */
  constructor(t) {
    super(t), this._autoScaffold(), t.classList.contains("mtx-app-bar") || t.classList.add("mtx-app-bar");
    const e = t.getAttribute("data-position") || "fixed";
    t.classList.contains(`mtx-app-bar--${e}`) || t.classList.add(`mtx-app-bar--${e}`);
    let i = t.getAttribute("data-color");
    i || (t.classList.contains("mtx-app-bar--primary") ? i = "primary" : t.classList.contains("mtx-app-bar--secondary") ? i = "secondary" : t.classList.contains("mtx-app-bar--inherit") ? i = "inherit" : t.classList.contains("mtx-app-bar--transparent") ? i = "transparent" : i = "default"), t.classList.contains(`mtx-app-bar--${i}`) || t.classList.add(`mtx-app-bar--${i}`);
    const s = t.getAttribute("data-elevation"), a = s !== null && s !== "" && !isNaN(Number(s));
    this.defaultElevation = a ? Number(s) : 4, this.isElevated = !0, t.hasAttribute("data-elevate-on-scroll") ? (this._setShadow(!1), this.isElevated = !1) : a && (this.defaultElevation === 0 && t.classList.add("mtx-app-bar--flat"), this._setShadow(!0)), this.hideOnScroll = t.hasAttribute("data-hide-on-scroll"), this.elevateOnScroll = t.hasAttribute("data-elevate-on-scroll"), (this.hideOnScroll || this.elevateOnScroll) && this._bindScroll(), this._enableTransitions();
  }
  /**
   * Activa las transiciones tras el primer frame pintado, para que el estado
   * inicial (color, tema, elevación) no se anime al cargar la página.
   */
  _enableTransitions() {
    const t = this.element;
    if (typeof requestAnimationFrame != "function") {
      t.classList.add("mtx-app-bar--animated");
      return;
    }
    let e = 0;
    const i = requestAnimationFrame(() => {
      e = requestAnimationFrame(() => {
        this.destroyed || t.classList.add("mtx-app-bar--animated");
      });
    });
    this.onDestroy(() => {
      cancelAnimationFrame(i), e && cancelAnimationFrame(e);
    });
  }
  /**
   * Auto-construye la estructura interna de la AppBar si se usa la sintaxis simplificada.
   * Por ejemplo: <header data-mtx="app-bar" data-title="Noticias" data-start-icon="menu"></header>
   */
  _autoScaffold() {
    if (this.element.querySelector(".mtx-toolbar"))
      return;
    const t = this.element.getAttribute("data-title"), e = this.element.getAttribute("data-start-icon"), i = this.element.getAttribute("data-end-icon"), s = this.element.hasAttribute("data-dense");
    if (!t && !e && !i && !this.element.hasChildNodes())
      return;
    const a = document.createElement("div");
    a.className = "mtx-toolbar", s && a.classList.add("mtx-toolbar--dense");
    const n = k(this.element);
    if (e) {
      const l = this.element.getAttribute("data-drawer"), o = e === "menu" || l ? y("appBar", "openNavigation", null, "Open navigation", n) : e, c = this.element.getAttribute("data-start-icon-label") || o, d = this._createIconButton(e, c, "mtx-toolbar__navigation-icon");
      l && (d.setAttribute("data-mtx-drawer-toggle", l), d.setAttribute("aria-controls", l), d.setAttribute("aria-expanded", "false")), a.appendChild(d), this._drawerId = l;
    }
    if (t) {
      const l = document.createElement("span");
      l.className = "mtx-toolbar__title", l.textContent = t, a.appendChild(l);
    } else if (e && i && !this.element.hasChildNodes()) {
      const l = document.createElement("div");
      l.className = "mtx-toolbar__spacer", a.appendChild(l);
    }
    for (; this.element.firstChild; )
      a.appendChild(this.element.firstChild);
    if (i) {
      const l = this.element.getAttribute("data-end-icon-label") || i;
      a.appendChild(this._createIconButton(i, l));
    }
    if (this.element.appendChild(a), this._drawerId) {
      const l = document.getElementById(this._drawerId), o = l ? L(l) : null;
      o && typeof o.syncTriggers == "function" && o.syncTriggers();
    }
  }
  /**
   * Fija la sombra de la barra mediante la variable `--mtx-app-bar-shadow`.
   *
   * @param {boolean} elevated `true` para aplicar la elevación configurada.
   */
  _setShadow(t) {
    this.element.style.setProperty(
      "--mtx-app-bar-shadow",
      t ? `var(--mtx-elevation-${this.defaultElevation})` : "none"
    );
  }
  /**
   * Crea un IconButton de la Toolbar con su `aria-label`.
   *
   * @param {string} icon Nombre del icono de Material Icons.
   * @param {string} label Etiqueta accesible.
   * @param {string} [extraClass] Clase adicional.
   * @returns {HTMLButtonElement} Botón inicializado.
   */
  _createIconButton(t, e, i) {
    const s = document.createElement("button");
    s.className = i ? `mtx-icon-button ${i}` : "mtx-icon-button", s.setAttribute("type", "button"), s.setAttribute("aria-label", e), s.setAttribute("data-mtx", "icon-button");
    const a = document.createElement("span");
    return a.className = "material-icons", a.setAttribute("aria-hidden", "true"), a.textContent = t, s.appendChild(a), new Qe(s), s;
  }
  /**
   * Obtiene la posición vertical de scroll según el objetivo configurado.
   *
   * @returns {number} Posición vertical de scroll en píxeles.
   */
  _getScrollY() {
    return this._scrollTarget && this._scrollTarget !== window ? this._scrollTarget.scrollTop : window.scrollY || document.documentElement.scrollTop;
  }
  /**
   * Vincula el evento de scroll.
   */
  _bindScroll() {
    const t = this.element.getAttribute("data-scroll-target");
    this._scrollTarget = t && document.querySelector(t) || window, this._lastScrollY = this._getScrollY(), this._ticking = !1, this._handleScroll = () => {
      if (this._scrollFrame = 0, this.destroyed) return;
      const e = this._getScrollY();
      if (this.elevateOnScroll) {
        const i = e > 0;
        i && !this.isElevated ? (this._setShadow(!0), this.isElevated = !0) : !i && this.isElevated && (this._setShadow(!1), this.isElevated = !1);
      }
      this.hideOnScroll && (e > this._lastScrollY && e > 50 ? this.element.classList.add("mtx-app-bar--hidden") : e < this._lastScrollY && this.element.classList.remove("mtx-app-bar--hidden")), this._lastScrollY = e, this._ticking = !1;
    }, this._onScroll = () => {
      this._ticking || (this._scrollFrame = window.requestAnimationFrame(this._handleScroll), this._ticking = !0);
    }, this.listen(this._scrollTarget, "scroll", this._onScroll, { passive: !0 }), this.onDestroy(() => {
      this._scrollFrame && window.cancelAnimationFrame(this._scrollFrame), this._scrollFrame = 0;
    });
  }
  /**
   * Cambia la posición de la barra de aplicación.
   *
   * @param {'fixed' | 'static' | 'sticky' | 'absolute' | 'relative'} position Nueva posición.
   */
  setPosition(t) {
    ["fixed", "static", "sticky", "absolute", "relative"].forEach((e) => {
      this.element.classList.remove(`mtx-app-bar--${e}`);
    }), this.element.classList.add(`mtx-app-bar--${t}`);
  }
  /**
   * Cambia el color de la barra de aplicación.
   *
   * @param {'primary' | 'secondary' | 'default' | 'transparent' | 'inherit'} color Nuevo color.
   */
  setColor(t) {
    ["primary", "secondary", "default", "transparent", "inherit"].forEach((e) => {
      this.element.classList.remove(`mtx-app-bar--${e}`);
    }), this.element.classList.add(`mtx-app-bar--${t}`);
  }
}
f("app-bar", lr);
const Qi = ["bottom-left", "bottom-center", "bottom-right", "top-left", "top-center", "top-right"];
function ts(r) {
  if (r == null || r === "none" || r === !1) return null;
  const t = Number(r);
  return Number.isFinite(t) && t >= 0 ? t : null;
}
class hi extends g {
  /**
   * Crea una instancia del snackbar.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-snackbar") || t.classList.add("mtx-snackbar"), this.duration = ts(t.getAttribute("data-duration")), this._activeDuration = this.duration, this.anchor = t.getAttribute("data-anchor") || "bottom-center";
    const e = t.getAttribute("data-action");
    e && !t.querySelector(".mtx-snackbar__action") && (this._createAction().textContent = e);
    const i = t.getAttribute("data-message");
    i && !t.querySelector(".mtx-snackbar__message") && (this._createMessage().textContent = i), this.message = t.querySelector(".mtx-snackbar__message"), this._applyMessageRole(), this._handleAction = (s) => this._onAction(s), this._bindAction(t.querySelector(".mtx-snackbar__action")), this._handlePause = () => this._clearTimer(), this._handleResume = () => this._startTimer(), t.addEventListener("mouseenter", this._handlePause), t.addEventListener("mouseleave", this._handleResume), t.addEventListener("focusin", this._handlePause), t.addEventListener("focusout", this._handleResume), t.hasAttribute("data-open") && this.open();
  }
  /** @returns {boolean} `true` cuando está visible. */
  get isOpen() {
    return this.element.classList.contains("mtx-snackbar--open");
  }
  /** @returns {string} Anclaje actual (`bottom-center`, `top-right`…). */
  get anchor() {
    return this._anchor;
  }
  /** @param {string} value Anclaje; valores no válidos usan `bottom-center`. */
  set anchor(t) {
    const e = Qi.includes(t) ? t : "bottom-center";
    Qi.forEach((i) => this.element.classList.remove(`mtx-snackbar--${i}`)), this.element.classList.add(`mtx-snackbar--${e}`), this._anchor = e;
  }
  /**
   * Cambia el texto del mensaje (crea `.mtx-snackbar__message` si no existe).
   *
   * @param {string} text Texto plano del mensaje.
   * @returns {Snackbar} La instancia, para encadenar.
   */
  setMessage(t) {
    return this.message || (this.message = this._createMessage(), this._applyMessageRole()), this.message.textContent = t == null ? "" : String(t), this;
  }
  /**
   * Cambia, muestra u oculta la acción.
   *
   * @param {string|null|false} label Texto del botón; `null`/`false`/`''` la oculta.
   * @returns {Snackbar} La instancia, para encadenar.
   */
  setAction(t) {
    return t ? (this.action || this._bindAction(this._createAction()), this.action.textContent = String(t), this.action.hidden = !1, this) : (this.action && (this.action.hidden = !0), this);
  }
  /**
   * Muestra el snackbar. Si ya está abierto, actualiza el contenido y reinicia el temporizador.
   *
   * @param {Object} [options] Contenido de esta apertura.
   * @param {string} [options.message] Texto del mensaje.
   * @param {string|null|false} [options.action] Texto de la acción; `null`/`false` la oculta.
   * @param {Function} [options.onAction] Se ejecuta al pulsar la acción y después cierra (`reason: 'action'`).
   * @param {number|null|'none'} [options.duration] Auto-cierre solo para esta apertura.
   * @returns {Snackbar} La instancia, para encadenar.
   */
  open(t = {}) {
    const e = t && typeof t == "object" && !(t instanceof Event) ? t : {};
    return Object.prototype.hasOwnProperty.call(e, "message") && this.setMessage(e.message), Object.prototype.hasOwnProperty.call(e, "action") && this.setAction(e.action), this._onActionCallback = typeof e.onAction == "function" ? e.onAction : null, this._activeDuration = Object.prototype.hasOwnProperty.call(e, "duration") ? ts(e.duration) : this.duration, X(this, { kind: "snackbar", nodes: this.element, onEscape: () => this.close("escapeKeyDown") }), this.isOpen ? (this._startTimer(), this) : (this.element.classList.add("mtx-snackbar--open"), this._clickAwayCleanup = qt(this.element, () => this.close("clickaway")), this._startTimer(), v(this.element, "mtx:snackbar:open"), this);
  }
  /**
   * Oculta el snackbar.
   *
   * @param {string} [reason='programmatic'] Motivo: `timeout`, `clickaway`, `escapeKeyDown`, `action` o propio.
   */
  close(t = "programmatic") {
    this.isOpen && (this.element.classList.remove("mtx-snackbar--open"), q(this), this._clickAwayCleanup && this._clickAwayCleanup(), this._clickAwayCleanup = null, this._clearTimer(), v(this.element, "mtx:snackbar:close", { reason: t }));
  }
  /** Inicia el autocierre si hay duración activa. */
  _startTimer() {
    this._clearTimer(), !(this._activeDuration === null || !this.isOpen) && (this._timer = setTimeout(() => this.close("timeout"), this._activeDuration));
  }
  /** Cancela el temporizador activo. */
  _clearTimer() {
    this._timer && clearTimeout(this._timer), this._timer = null;
  }
  /**
   * Crea el nodo del mensaje al inicio del snackbar.
   * @returns {HTMLElement} Mensaje creado.
   */
  _createMessage() {
    const t = document.createElement("div");
    return t.className = "mtx-snackbar__message", this.element.insertBefore(t, this.element.firstChild), t;
  }
  /**
   * Crea el botón de acción al final del snackbar.
   * @returns {HTMLButtonElement} Botón creado.
   */
  _createAction() {
    const t = document.createElement("button");
    return t.type = "button", t.className = "mtx-snackbar__action", this.element.appendChild(t), t;
  }
  /** Aplica el rol vivo al mensaje (`data-role` o `alert`). */
  _applyMessageRole() {
    this.message && !this.message.hasAttribute("role") && this.message.setAttribute("role", this.element.getAttribute("data-role") || "alert");
  }
  /**
   * Conecta el botón de acción.
   * @param {HTMLElement|null} action Botón de acción.
   */
  _bindAction(t) {
    t && (t.tagName === "BUTTON" && !t.getAttribute("type") && (t.type = "button"), t.addEventListener("click", this._handleAction), this.action = t);
  }
  /**
   * Gestiona el clic en la acción: emite `mtx:snackbar:action` y cierra si corresponde.
   * @param {MouseEvent} event Evento de clic.
   */
  _onAction(t) {
    const e = this._onActionCallback;
    v(this.element, "mtx:snackbar:action"), e ? (this._onActionCallback = null, e(t, this), this.close("action")) : this.element.hasAttribute("data-close-on-action") && this.close("action");
  }
  /**
   * Cierra el snackbar, cancela el temporizador y libera sus listeners.
   */
  destroy() {
    this.close(), this.element.removeEventListener("mouseenter", this._handlePause), this.element.removeEventListener("mouseleave", this._handleResume), this.element.removeEventListener("focusin", this._handlePause), this.element.removeEventListener("focusout", this._handleResume), this.action && this.action.removeEventListener("click", this._handleAction), super.destroy();
  }
}
f("snackbar", hi);
let ct = null;
function or(r = {}) {
  if (typeof document > "u") return null;
  const t = typeof r == "string" ? { message: r } : { ...r };
  if (!ct || ct.destroyed || !ct.element.isConnected) {
    const e = document.createElement("div");
    e.className = "mtx-snackbar", e.setAttribute("data-mtx", "snackbar"), e.setAttribute("data-role", t.role || "status"), e.setAttribute("data-duration", "4000"), document.body.appendChild(e), ct = L(e) || new hi(e);
  }
  return t.anchor && (ct.anchor = t.anchor), t.role && ct.message && ct.message.setAttribute("role", t.role), Object.prototype.hasOwnProperty.call(t, "action") || (t.action = null), delete t.anchor, delete t.role, ct.open(t);
}
const ml = {
  show: or
}, es = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  "[tabindex]"
].join(",");
function is(r) {
  const t = k(r), e = typeof document < "u" ? document.documentElement : null;
  if (r && typeof r.getAttribute == "function")
    for (let s = r; s && s.nodeType === 1; s = s.parentElement) {
      const a = s.getAttribute("data-locale") || s.getAttribute("data-lang") || (s !== e ? s.getAttribute("lang") : null);
      if (a && a.trim()) return a.trim();
    }
  const i = e ? (e.getAttribute("lang") || "").trim() : "";
  return i && cr(i, t) ? i : t;
}
function cr(r, t) {
  const e = String(r).toLowerCase().replace("_", "-"), i = String(t).toLowerCase();
  return e === i || e.startsWith(`${i}-`);
}
function pl(r) {
  return String(r || "en").toLowerCase().trim().split(/[-_]/)[0] || "en";
}
function Ye(r) {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf([String(r).replace("_", "-")])[0] || "en";
  } catch {
    return "en";
  }
}
function ss(r) {
  try {
    const t = new Intl.DateTimeFormat(Ye(r), { year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(2026, 9, 20)), e = { day: "DD", month: "MM", year: "YYYY" }, i = t.filter((s) => e[s.type]).map((s) => e[s.type]);
    if (i.length === 3) return i;
  } catch {
  }
  return pl(r) === "en" ? ["MM", "DD", "YYYY"] : ["DD", "MM", "YYYY"];
}
function _l(r, t) {
  const e = t.replace(/-?range/, "").replace("date-time", "datetime");
  return e === "date" || e === "time" || e === "datetime" ? e : /date-?time/.test(r) ? "datetime" : r.includes("time") ? "time" : "date";
}
function Ce(r, t) {
  return !!(r && t) && r.getFullYear() === t.getFullYear() && r.getMonth() === t.getMonth() && r.getDate() === t.getDate();
}
function as(r) {
  return `${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, "0")}-${String(r.getDate()).padStart(2, "0")}`;
}
function fl(r) {
  if (!r) return "";
  let t = r.replace(/YYYY|AAAA/g, "0000").replace(/YY/g, "00").replace(/MM/g, "00").replace(/DD/g, "00").replace(/HH|hh/g, "00").replace(/mm/g, "00").replace(/ss/g, "00");
  return t = t.replace(new RegExp("\\b[aA]\\b|(?<=\\s|^)[aA](?=\\s|$)|AM|PM|aa|AA", "g"), "AA"), t;
}
const H = class H extends g {
  /**
   * Destruye un picker previo sobre el elemento o su TextField contenedor, para que
   * `new DateTimePicker(el)` repetido no deje dos popovers vivos.
   *
   * @param {HTMLElement} element Elemento que se va a inicializar.
   */
  static _destroyPrevious(t) {
    if (!t || !t.nodeType) return;
    const e = typeof t.closest == "function" ? t.closest(".mtx-text-field") : null;
    [L(t), e ? L(e) : null].forEach((i) => {
      if (!(!(i instanceof H) || i.destroyed))
        try {
          i.destroy();
        } catch {
        }
    });
  }
  /**
   * Crea una instancia de DateTimePicker.
   *
   * @param {HTMLElement} element Elemento asociado (input, div o contenedor).
   */
  constructor(t) {
    H._destroyPrevious(t);
    const e = t.hasAttribute("data-static") || t.classList.contains("mtx-picker-static"), i = (t.getAttribute("data-mtx") || "").toLowerCase(), s = (t.getAttribute("data-picker") || "").toLowerCase(), a = t.getAttribute("data-range") === "true" || t.hasAttribute("data-range") || i.includes("range") || s.includes("range"), n = _l(i, s);
    let l = null, o = "";
    if (!e && (t instanceof HTMLInputElement || !t.classList.contains("mtx-text-field"))) {
      o = (t.value || t.getAttribute("data-value") || t.getAttribute("data-default-value") || "").trim(), "value" in t && (t.value = "");
      const u = n === "time" ? "schedule" : n === "datetime" ? "calendar_month" : "event";
      t.hasAttribute("data-end-action") || (t.setAttribute("data-end-action", t.getAttribute("data-end-icon") || u), t.removeAttribute("data-end-icon"));
      const m = t.getAttribute("data-format") || "", _ = t.getAttribute("data-ampm") === "true" || t.hasAttribute("data-ampm") && t.getAttribute("data-ampm") !== "false" || !!(m && (/(?:^|[\s/_-])(?:a|A|am|pm|AM|PM|aa|AA)(?:[\s/_-]|$)/.test(m) || m.includes("hh"))), x = m || H._defaultFormatFor(n, _, is(t));
      if (!t.hasAttribute("data-mask")) {
        let A;
        if (!m && n === "time" ? A = _ ? "time-ampm" : "time" : A = fl(x), A === "00/00/0000" && (A = "date"), a) {
          const p = A === "date" ? "00/00/0000" : A === "time" ? "00:00" : A === "time-ampm" ? "00:00 AA" : A;
          A = x.includes(" - ") || x.includes(" / ") ? p : `${p} - ${p}`;
        }
        t.setAttribute("data-mask", A);
      }
      l = new yt(t), t = l.element;
    }
    super(t), this._textField = l, this._mode = n, this._isRange = a, this._isStatic = e, this._isOpen = !1, this.input = e ? null : this.element.querySelector(".mtx-text-field__input, input"), this.input && this.input !== this.element && et(this.input, this);
    const c = (u) => this.element.getAttribute(u) ?? (this.input ? this.input.getAttribute(u) : null);
    this._rangeSeparator = c("data-range-separator") || " - ", this._rangeStart = null, this._rangeEnd = null, this._rangeStep = "start", this._hoverDate = null, this._focusedDate = null;
    const d = c("data-time-view") || c("data-time-mode");
    this._timeInputMode = d === "dial" || d === "clock" ? "dial" : "input", this._timeUnit = "hours", this._currentView = n === "time" ? "time" : "calendar", this._activeTab = n === "time" ? "time" : "date", this._format = c("data-format") || this._getDefaultFormat(), this._minDate = this._parseDate(c("data-min") || c("min")), this._maxDate = this._parseDate(c("data-max") || c("max")), this._displayMode = c("data-display") === "modal" ? "modal" : "popover", this._selectedHour = 12, this._selectedMinute = 0, this._selectedAmPm = "PM", this._startHour = 9, this._startMinute = 0, this._startAmPm = "AM", this._endHour = 18, this._endMinute = 0, this._endAmPm = "PM";
    const h = o || (this.input ? this.input.value : "") || c("data-value") || c("data-default-value") || "";
    if (this._isRange && h && (h.includes(this._rangeSeparator) || h.includes(" - "))) {
      const u = h.includes(this._rangeSeparator) ? this._rangeSeparator : " - ", [m, _] = h.split(u);
      this._rangeStart = this._parseDate(m), this._rangeEnd = this._parseDate(_), this._selectedDate = this._rangeStart, this._rangeStart && (this._startHour = this._rangeStart.getHours(), this._startMinute = this._rangeStart.getMinutes(), this._startAmPm = this._startHour >= 12 ? "PM" : "AM"), this._rangeEnd && (this._endHour = this._rangeEnd.getHours(), this._endMinute = this._rangeEnd.getMinutes(), this._endAmPm = this._endHour >= 12 ? "PM" : "AM");
    } else
      this._selectedDate = h ? this._parseDate(h) : null, this._selectedDate && (this._selectedHour = this._selectedDate.getHours(), this._selectedMinute = this._selectedDate.getMinutes(), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM", this._isRange && (this._rangeStart = this._selectedDate, this._startHour = this._selectedHour, this._startMinute = this._selectedMinute, this._startAmPm = this._selectedAmPm));
    this._viewDate = this._selectedDate ? new Date(this._selectedDate) : /* @__PURE__ */ new Date(), this.input && (this._isRange && this._rangeStart ? this.input.value = this._rangeEnd ? `${this._formatDate(this._rangeStart)}${this._rangeSeparator}${this._formatDate(this._rangeEnd)}` : this._formatDate(this._rangeStart) : !this._isRange && this._selectedDate ? this.input.value = this._formatDate(this._selectedDate) : o && !this.input.value && (this.input.value = o), this._syncFieldState()), this._okText = c("data-ok-text"), this._cancelText = c("data-cancel-text"), this._todayText = c("data-today-text"), this.element.mtxDateTimePicker = this, this.input && (this.input.mtxDateTimePicker = this), this._buildPickerDOM(), this._bindEvents(), this._syncToggleButton(), this._isStatic && this._renderCurrentView();
  }
  /**
   * Formato por defecto según modo, AM/PM y locale (`en` → MM/DD/YYYY, `es` → DD/MM/YYYY).
   *
   * @param {'date'|'time'|'datetime'} mode Modo del picker.
   * @param {boolean} isAmPm Formato de 12 horas.
   * @param {string} rawLocale Locale crudo.
   * @returns {string} Patrón de formato.
   */
  static _defaultFormatFor(t, e, i) {
    const s = e ? "hh:mm A" : "HH:mm";
    if (t === "time") return s;
    const a = ss(i).join("/");
    return t === "datetime" ? `${a} ${s}` : a;
  }
  /**
   * Locale crudo de la instancia (p. ej. `es-MX`).
   * @private
   * @returns {string}
   */
  _getLocale() {
    return is(this.element);
  }
  /**
   * Idioma registrado en i18n para los textos (resuelto con `getComponentLocale()`).
   * @private
   * @returns {string}
   */
  _getLang() {
    return k(this.element);
  }
  /**
   * Obtiene una traducción del componente DateTimePicker.
   * @private
   */
  _t(t, e = null, i = null) {
    return y("dateTimePicker", t, e, i, this._getLang());
  }
  /**
   * Diccionario i18n del idioma base, solo si está registrado (si no, se usa `Intl`).
   * @private
   * @returns {object|null}
   */
  _getLangDict() {
    const t = this._getLang();
    if (!cr(this._getLocale(), t)) return null;
    const e = ht(t);
    return e && e.code === t && e.dateTimePicker ? e.dateTimePicker : null;
  }
  /**
   * Nombres de meses o días generados con `Intl` para el locale activo.
   * @private
   * @param {'month'|'weekday'} kind Tipo de nombre.
   * @param {'long'|'short'|'narrow'} width Longitud.
   * @returns {string[]|null} Lista de nombres o `null` si `Intl` no está disponible.
   */
  _intlNames(t, e) {
    try {
      const i = new Intl.DateTimeFormat(Ye(this._getLocale()), { [t]: e });
      return Array.from({ length: t === "month" ? 12 : 7 }, (n, l) => i.format(t === "month" ? new Date(2026, l, 1) : new Date(2026, 1, 1 + l))).map((n) => n.charAt(0).toUpperCase() + n.slice(1));
    } catch {
      return null;
    }
  }
  /**
   * Retorna la lista de nombres completos de meses según el idioma activo.
   * @private
   */
  _getMonthNames() {
    const t = this._getLangDict();
    return t && t.months || this._intlNames("month", "long") || ht("en").dateTimePicker.months;
  }
  /**
   * Retorna la lista de nombres abreviados de meses según el idioma activo.
   * @private
   */
  _getMonthNamesShort() {
    const t = this._getLangDict();
    return t && t.monthsShort || this._intlNames("month", "short") || ht("en").dateTimePicker.monthsShort;
  }
  /**
   * Retorna la lista de iniciales de días de la semana según el idioma activo.
   * @private
   */
  _getWeekdayNames() {
    const t = this._getLangDict();
    return t && t.weekdays || this._intlNames("weekday", "narrow") || ht("en").dateTimePicker.weekdays;
  }
  /**
   * Retorna la lista de nombres abreviados de días de la semana según el idioma activo.
   * @private
   */
  _getWeekdayNamesShort() {
    const t = this._getLangDict();
    return t && t.weekdaysShort || this._intlNames("weekday", "short") || ht("en").dateTimePicker.weekdaysShort;
  }
  /**
   * Nombres completos de los días de la semana (cabeceras accesibles del grid).
   * @private
   */
  _getWeekdayNamesLong() {
    return this._intlNames("weekday", "long") || this._getWeekdayNamesShort();
  }
  /**
   * Etiqueta accesible completa de un día ("Tuesday, October 20, 2026").
   * @private
   * @param {Date} date Fecha.
   * @returns {string} Texto localizado.
   */
  _formatDayLabel(t) {
    try {
      return new Intl.DateTimeFormat(Ye(this._getLocale()), {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(t);
    } catch {
      return `${this._getWeekdayNamesShort()[t.getDay()]}, ${this._getMonthNames()[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`;
    }
  }
  /**
   * Determina si el componente está configurado en formato 12 horas AM/PM.
   * @private
   * @returns {boolean}
   */
  _isAmPmMode() {
    const t = this.element ? this.element.getAttribute("data-ampm") : null;
    if (t === "true" || this.element && this.element.hasAttribute("data-ampm") && t !== "false")
      return !0;
    const e = this.input ? this.input.getAttribute("data-ampm") : null;
    return e === "true" || this.input && this.input.hasAttribute("data-ampm") && e !== "false" ? !0 : this._format ? /(?:^|[\s/_-])(?:a|A|am|pm|AM|PM|aa|AA)(?:[\s/_-]|$)/.test(this._format) || this._format.includes("hh") : !1;
  }
  /**
   * Retorna el formato de fecha por defecto según el modo y el locale activos.
   * @private
   */
  _getDefaultFormat() {
    return H._defaultFormatFor(this._mode, this._isAmPmMode(), this._getLocale());
  }
  /**
   * Orden de los segmentos de fecha del formato activo (o del locale si el formato no los define).
   * @private
   * @returns {string[]} Tokens `DD`, `MM`, `YYYY` ordenados.
   */
  _getDateOrder() {
    const e = ((this._format || "").match(/YYYY|AAAA|YY|MM|DD/g) || []).map((i) => i === "AAAA" || i === "YY" ? "YYYY" : i);
    return e.length === 3 && new Set(e).size === 3 ? e : ss(this._getLocale());
  }
  /**
   * Patrón de solo fecha del locale/formato activo (p. ej. `MM/DD/YYYY`).
   * @private
   * @returns {string}
   */
  _getDatePattern() {
    return this._getDateOrder().join("/");
  }
  /**
   * Sincroniza la clase `--has-value` del TextField tras escribir el valor por código.
   * @private
   */
  _syncFieldState() {
    this.input && (this._textField && typeof this._textField._syncAria == "function" ? this._textField._syncAria() : this.element.classList.contains("mtx-text-field") && this.element.classList.toggle("mtx-text-field--has-value", !!this.input.value.trim()));
  }
  /**
   * Botón que abre el picker (IconButton final o adorno heredado del marcado BEM).
   * @private
   * @returns {HTMLElement|null}
   */
  _getToggleButton() {
    return this._isStatic ? null : this._textField && this._textField.endAction ? this._textField.endAction : this.element.querySelector(".mtx-text-field__action--end, .mtx-text-field__adornment--end");
  }
  /**
   * Nombre accesible del diálogo y del botón según el modo.
   * @private
   * @returns {string}
   */
  _getDialogLabel() {
    return this._mode === "time" ? this._t("chooseTime", null, "Choose time") : this._isRange ? this._t("chooseDateRange", null, "Choose date range") : this._mode === "datetime" ? this._t("chooseDateTime", null, "Choose date and time") : this._t("chooseDate", null, "Choose date");
  }
  /**
   * Refleja en el botón de apertura su nombre, `aria-expanded` y el estado deshabilitado/solo lectura.
   * @private
   */
  _syncToggleButton() {
    const t = this._getToggleButton();
    if (!t) return;
    const e = this._getDialogLabel(), i = this.input ? this.input.value.trim() : "";
    t.setAttribute("aria-label", i ? this._t("chooseWithValue", { label: e, value: i }, `${e}, ${i}`) : e), t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", String(this._isOpen)), this._container && this._container.id && t.setAttribute("aria-controls", this._container.id);
    const s = !!(this.input && (this.input.disabled || this.input.readOnly));
    t.tagName === "BUTTON" ? t.disabled = s : (t.setAttribute("role", "button"), t.setAttribute("tabindex", s ? "-1" : "0"), t.removeAttribute("aria-hidden")), s ? t.setAttribute("aria-disabled", "true") : t.removeAttribute("aria-disabled");
  }
  /**
   * Construye el contenedor DOM del picker (popover, diálogo modal o estático).
   * @private
   */
  _buildPickerDOM() {
    if (this._isStatic) {
      this.element.classList.add("mtx-picker-static"), this._container = this.element, this.element.hasAttribute("role") || (this.element.setAttribute("role", "group"), this._addedRole = !0), !this.element.hasAttribute("aria-label") && !this.element.hasAttribute("aria-labelledby") && (this.element.setAttribute("aria-label", this._getDialogLabel()), this._addedLabel = !0), this.listen(this._container, "keydown", (e) => this._handleContainerKeyDown(e));
      return;
    }
    const t = (e) => e.stopPropagation();
    this._displayMode === "modal" ? (this._backdrop = document.createElement("div"), this._backdrop.className = "mtx-picker-backdrop", this._dialog = document.createElement("div"), this._dialog.className = "mtx-picker-dialog", this._dialog.setAttribute("aria-modal", "true"), this._dialog.addEventListener("click", t), this._dialog.addEventListener("mousedown", t), this._backdrop.appendChild(this._dialog), document.body.appendChild(this._backdrop), this._container = this._dialog) : (this._mobileBackdrop = document.createElement("div"), this._mobileBackdrop.className = "mtx-picker-backdrop-mobile", this._mobileBackdrop.addEventListener("click", (e) => {
      e.stopPropagation(), this.close(!0);
    }), document.body.appendChild(this._mobileBackdrop), this._popover = document.createElement("div"), this._popover.className = "mtx-picker-popover", this._popover.addEventListener("click", t), this._popover.addEventListener("mousedown", t), this.element.appendChild(this._popover), this._container = this._popover), this._container.id = P("mtx-picker-dialog"), this._container.setAttribute("role", "dialog"), this._container.setAttribute("aria-label", this._getDialogLabel()), this.listen(this._container, "keydown", (e) => this._handleContainerKeyDown(e)), this.listen(this._container, "focusout", (e) => this._handleFocusOut(e));
  }
  /**
   * Asocia los eventos interactivos del picker. Todo listener pasa por `listen()` para liberarse en `destroy()`.
   * @private
   */
  _bindEvents() {
    if (this.listen(document, "mtx:locale:change", () => {
      this._container && this._container.getAttribute("role") === "dialog" && this._container.setAttribute("aria-label", this._getDialogLabel()), this._syncToggleButton(), (this._isOpen || this._isStatic) && this._renderCurrentView();
    }), this._isStatic || !this.input) return;
    const t = this._getToggleButton();
    t && (t.style.cursor = "pointer", this.listen(t, "click", (a) => {
      a.stopPropagation(), !this._isLocked() && (this._isOpen ? this.close(!0) : this.open({ focus: !0 }));
    }), t.tagName !== "BUTTON" && this.listen(t, "keydown", (a) => {
      (a.key === "Enter" || a.key === " ") && (a.preventDefault(), t.click());
    })), this.listen(this.input, "click", (a) => {
      a.stopPropagation(), this._isOpen || this.open({ focus: !1 });
    });
    const e = this._mode === "time" ? /^[0-9:\sAPMapm]$/ : this._mode === "date" ? /^[0-9/\-.\s]$/ : /^[0-9/\-.:\sAPMapm]$/, i = this._mode === "time" ? /[^0-9:\sAPMapm]/g : this._mode === "date" ? /[^0-9/\-.\s]/g : /[^0-9/\-.:\sAPMapm]/g;
    this.listen(this.input, "keydown", (a) => {
      if (a.key === "ArrowDown" && (a.altKey || this._isOpen)) {
        a.preventDefault(), this._isOpen ? this._focusActiveView() : this.open({ focus: !0 });
        return;
      }
      a.ctrlKey || a.metaKey || a.altKey || a.key.length > 1 || e.test(a.key) || a.preventDefault();
    }), this.listen(this.input, "paste", (a) => {
      var l;
      const n = (l = a.clipboardData || window.clipboardData) == null ? void 0 : l.getData("text");
      if (n && new RegExp(i.source).test(n)) {
        a.preventDefault();
        const o = n.replace(i, "");
        if (document.queryCommandSupported && document.queryCommandSupported("insertText"))
          document.execCommand("insertText", !1, o);
        else {
          const c = this.input.selectionStart || 0, d = this.input.selectionEnd || 0, h = this.input.value;
          this.input.value = h.slice(0, c) + o + h.slice(d), this.input.dispatchEvent(new Event("input", { bubbles: !0 }));
        }
      }
    });
    const s = () => {
      if (this._isInternalChange) return;
      new RegExp(i.source).test(this.input.value) && (this.input.value = this.input.value.replace(i, ""));
      const a = this.input.value.trim();
      if (!a) {
        this._selectedDate = null, this._rangeStart = null, this._rangeEnd = null, this._isOpen && this._renderCurrentView();
        return;
      }
      if (this._isRange && (a.includes(this._rangeSeparator) || a.includes(" - "))) {
        const l = a.includes(this._rangeSeparator) ? this._rangeSeparator : " - ", [o, c] = a.split(l), d = this._parseDate(o), h = this._parseDate(c);
        d && (this._rangeStart = d), h && (this._rangeEnd = h), this._selectedDate = this._rangeStart || this._rangeEnd, this._isOpen && this._renderCurrentView();
        return;
      }
      const n = this._parseDate(a);
      n && (this._selectedDate = n, this._isRange && (this._rangeStart = n), this._viewDate = new Date(n), this._selectedHour = n.getHours(), this._selectedMinute = n.getMinutes(), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM", this._isOpen && this._renderCurrentView());
    };
    this.listen(this.input, "change", s), this.listen(this.input, "input", s), this.listen(document, "click", (a) => {
      if (!this._isOpen) return;
      if (this._displayMode === "modal") {
        a.target === this._backdrop && this.close(!0);
        return;
      }
      if (this._mobileBackdrop && a.target === this._mobileBackdrop) {
        this.close(!0);
        return;
      }
      const n = a.composedPath ? a.composedPath() : [];
      n.includes(this.element) || n.includes(this._container) || this.element.contains(a.target) || this._container.contains(a.target) || this.close();
    }), this.listen(window, "resize", () => {
      this._isOpen && (this._syncModalState(), this._positionPopover());
    });
  }
  /**
   * Indica si el viewport es móvil (≤ 600px), donde el popover se comporta como modal.
   * @private
   * @returns {boolean}
   */
  _isMobileViewport() {
    return typeof window < "u" && window.innerWidth <= 600;
  }
  /**
   * Indica si el picker actúa como modal (diálogo o popover en móvil).
   * @private
   * @returns {boolean}
   */
  _isModal() {
    return this._displayMode === "modal" || !!(this._popover && this._isMobileViewport());
  }
  /**
   * Ajusta `aria-modal` del popover según el viewport.
   * @private
   */
  _syncModalState() {
    this._popover && (this._isMobileViewport() ? this._popover.setAttribute("aria-modal", "true") : this._popover.removeAttribute("aria-modal"));
  }
  /**
   * Indica si el campo está deshabilitado o es de solo lectura.
   * @private
   * @returns {boolean}
   */
  _isLocked() {
    return this._isStatic ? this.element.getAttribute("aria-disabled") === "true" : !!(this.input && (this.input.disabled || this.input.readOnly));
  }
  /**
   * Cierra el popover cuando el foco sale con Tab fuera del campo y del picker (modo no modal).
   * @private
   * @param {FocusEvent} e Evento focusout.
   */
  _handleFocusOut(t) {
    if (!this._isOpen || this._isModal()) return;
    const e = t.relatedTarget;
    !e || !(e instanceof Node) || this.element.contains(e) || this._container.contains(e) || this.close(!1);
  }
  /**
   * Teclado dentro del picker: trampa de foco, grid de días, meses, años, pestañas y reloj.
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   */
  _handleContainerKeyDown(t) {
    if (t.key === "Tab" && this._isOpen && this._isModal()) {
      this._trapTab(t);
      return;
    }
    const e = t.target;
    e instanceof HTMLElement && (e.classList.contains("mtx-date-picker__day") ? this._handleGridKeyDown(t, e) : e.classList.contains("mtx-date-picker__month") || e.classList.contains("mtx-date-picker__year") ? this._handleOptionGridKeyDown(t, e) : e.getAttribute("role") === "tab" ? this._handleTabKeyDown(t, e) : e.classList.contains("mtx-time-picker__clock") && this._handleClockKeyDown(t));
  }
  /**
   * Mantiene el foco dentro del contenedor modal.
   * @private
   * @param {KeyboardEvent} e Evento Tab.
   */
  _trapTab(t) {
    const e = Array.from(this._container.querySelectorAll(es)).filter((n) => n.getAttribute("tabindex") !== "-1" && !n.hidden && n.getAttribute("aria-hidden") !== "true");
    if (!e.length) {
      t.preventDefault();
      return;
    }
    const i = e[0], s = e[e.length - 1], a = document.activeElement;
    t.shiftKey && (a === i || !this._container.contains(a)) ? (t.preventDefault(), s.focus()) : !t.shiftKey && (a === s || !this._container.contains(a)) && (t.preventDefault(), i.focus());
  }
  /**
   * Posiciona el popover adaptándolo al espacio disponible de la pantalla para evitar desbordamientos.
   * @private
   */
  _positionPopover() {
    if (!this._popover || this._displayMode === "modal" || this._isMobileViewport() || (this._popover.style.left = "0", this._popover.style.right = "auto", this._popover.style.top = "100%", this._popover.style.bottom = "auto", this._popover.style.marginTop = "4px", this._popover.style.marginBottom = "0", typeof window > "u")) return;
    const t = this.element.getBoundingClientRect();
    t.left + 320 > window.innerWidth && (this._popover.style.left = "auto", this._popover.style.right = "0");
    const e = window.innerHeight - t.bottom, i = t.top;
    e < 380 && i > e && (this._popover.style.top = "auto", this._popover.style.bottom = "100%", this._popover.style.marginTop = "0", this._popover.style.marginBottom = "4px");
  }
  /**
   * Abre el selector visual de fecha/hora.
   *
   * @param {{focus?: boolean}} [options] `focus: false` mantiene el foco en el campo (apertura por clic en el input).
   */
  open(t = {}) {
    if (this._isOpen || this._isStatic || this._isLocked()) return;
    H._activePicker && H._activePicker !== this && H._activePicker.close(!1), H._activePicker = this, this._isOpen = !0;
    const e = typeof document < "u" ? document.activeElement : null;
    this._returnFocusEl = e && e !== document.body && this.element.contains(e) ? e : null;
    const i = this.element.getAttribute("data-time-view") || this.element.getAttribute("data-time-mode") || (this.input ? this.input.getAttribute("data-time-view") || this.input.getAttribute("data-time-mode") : null);
    this._timeInputMode = i === "dial" || i === "clock" ? "dial" : "input", this._mode === "time" ? (this._activeTab = "time", this._timeUnit = "hours", this._currentView = "time") : (this._activeTab = "date", this._currentView = "calendar"), this._selectedDate ? (this._viewDate = new Date(this._selectedDate), this._selectedHour = this._selectedDate.getHours(), this._selectedMinute = this._selectedDate.getMinutes(), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM") : this._viewDate = /* @__PURE__ */ new Date(), this._focusedDate = null, this._renderCurrentView(), this._displayMode === "modal" ? this._backdrop.classList.add("mtx-picker-backdrop--open") : (this._mobileBackdrop && this._mobileBackdrop.classList.add("mtx-picker-backdrop-mobile--open"), this._syncModalState(), this._positionPopover(), this._popover.classList.add("mtx-picker-popover--open")), this._syncToggleButton(), X(this, {
      kind: this._displayMode === "modal" ? "modal" : "popup",
      nodes: () => [this._container, this._backdrop, this._mobileBackdrop],
      stack: () => [{ node: this._backdrop }, { node: this._mobileBackdrop, offset: -1 }],
      onEscape: () => this.close(!0)
    }), (t.focus !== !1 || this._isModal()) && this._focusActiveView(), v(this.input || this.element, "mtx:date-time-picker:open", { picker: this }, { aliases: ["mtx:open"] });
  }
  /**
   * Cierra el selector visual de fecha/hora.
   *
   * @param {boolean} [focusInput=false] Si es true, devuelve el foco al elemento que lo abrió (botón o campo).
   */
  close(t = !1) {
    if (!(!this._isOpen || this._isStatic)) {
      if (this._isOpen = !1, this._activeDragEnd && this._activeDragEnd(!1), this._clearTimer(this._clockSwitchTimer), this._clockSwitchTimer = null, H._activePicker === this && (H._activePicker = null), q(this), this._displayMode === "modal" ? this._backdrop.classList.remove("mtx-picker-backdrop--open") : (this._mobileBackdrop && this._mobileBackdrop.classList.remove("mtx-picker-backdrop-mobile--open"), this._popover.classList.remove("mtx-picker-popover--open")), this._syncToggleButton(), t) {
        const e = this._returnFocusEl && this._returnFocusEl.isConnected && !this._returnFocusEl.disabled ? this._returnFocusEl : this.input;
        if (e && typeof e.focus == "function")
          try {
            e.focus({ preventScroll: !0 });
          } catch {
            e.focus();
          }
      }
      this._returnFocusEl = null, v(this.input || this.element, "mtx:date-time-picker:close", { picker: this }, { aliases: ["mtx:close"] });
    }
  }
  /**
   * Alterna entre abierto y cerrado.
   */
  toggle() {
    this._isOpen ? this.close(!0) : this.open();
  }
  /**
   * Cierra cualquier selector de fecha/hora actualmente abierto en la página.
   *
   * @param {boolean} [focusInput=false]
   */
  static closeAll(t = !1) {
    H._activePicker && H._activePicker.close(t);
  }
  /**
   * Indica si el componente está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.input ? this.input.disabled === !0 : this.element.getAttribute("aria-disabled") === "true";
  }
  /**
   * Deshabilita el campo, el botón de apertura y cierra el picker si estaba abierto.
   */
  disable() {
    this._isOpen && this.close(!1), this.input ? this._textField && typeof this._textField.disable == "function" ? this._textField.disable() : this.input.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.setAttribute("inert", ""), this.element.classList.add("mtx-picker-static--disabled")), this._syncToggleButton();
  }
  /**
   * Vuelve a habilitar el campo y el botón de apertura.
   */
  enable() {
    this.input ? this._textField && typeof this._textField.enable == "function" ? this._textField.enable() : this.input.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.removeAttribute("inert"), this.element.classList.remove("mtx-picker-static--disabled")), this._syncToggleButton();
  }
  /**
   * Programa un temporizador que se cancela en `destroy()`.
   *
   * @param {Function} callback Función a ejecutar.
   * @param {number} delay Retardo en milisegundos.
   * @returns {number|null} Id del temporizador, o `null` si la instancia ya se destruyó.
   */
  _setTimer(t, e) {
    if (this.destroyed) return null;
    this._timers || (this._timers = /* @__PURE__ */ new Set());
    const i = setTimeout(() => {
      this._timers.delete(i), this.destroyed || t();
    }, e);
    return this._timers.add(i), i;
  }
  /**
   * Cancela un temporizador programado con `_setTimer()`.
   *
   * @param {number|null} id Id del temporizador.
   */
  _clearTimer(t) {
    t != null && (clearTimeout(t), this._timers && this._timers.delete(t));
  }
  /**
   * Cancela todos los temporizadores pendientes.
   */
  _clearTimers() {
    this._timers && (this._timers.forEach((t) => clearTimeout(t)), this._timers.clear(), this._clockSwitchTimer = null);
  }
  /**
   * Libera listeners, nodos generados (popover, backdrops portados a `<body>`) y el registro.
   */
  destroy() {
    if (this.destroyed) return;
    this._activeDragEnd && this._activeDragEnd(!1), this._isOpen && this.close(!1), H._activePicker === this && (H._activePicker = null), this._clearTimers(), super.destroy(), this._backdrop && this._backdrop.remove(), this._mobileBackdrop && this._mobileBackdrop.remove(), this._popover && this._popover.remove(), this._isStatic && this._container && (this._container.innerHTML = "", this._container.classList.remove("mtx-picker-static", "mtx-picker-static--disabled"), this._addedRole && this._container.removeAttribute("role"), this._addedLabel && this._container.removeAttribute("aria-label"));
    const t = this._getToggleButton();
    t && ["aria-haspopup", "aria-expanded", "aria-controls"].forEach((e) => t.removeAttribute(e)), this._textField && typeof this._textField.destroy == "function" && !this._textField.destroyed && this._textField.destroy(), this.input && (Ft(this.input), this.input.removeAttribute("data-mtx-initialized"), delete this.input.mtxDateTimePicker), delete this.element.mtxDateTimePicker, this._backdrop = null, this._mobileBackdrop = null, this._popover = null, this._dialog = null, this._container = null;
  }
  /**
   * Renderiza el contenido del picker según el modo y la vista activa, conservando el foco.
   * @private
   */
  _renderCurrentView() {
    if (!this._container) return;
    const t = typeof document < "u" ? document.activeElement : null, e = !!(t && this._container.contains(t)), i = e ? t.getAttribute("data-focus-key") : null;
    this._container.innerHTML = "", (this._displayMode === "modal" || this._isStatic) && this._renderHeader(), this._mode === "datetime" && this._renderTabs();
    const s = document.createElement("div");
    s.className = "mtx-picker-content", this._activeTab === "date" ? this._currentView === "years" ? s.appendChild(this._createYearPicker()) : this._currentView === "months" ? s.appendChild(this._createMonthPicker()) : s.appendChild(this._createCalendar()) : s.appendChild(this._createTimePicker()), this._container.appendChild(s), this._renderActions(), e && this._restoreFocus(i);
  }
  /**
   * Devuelve el foco al control equivalente tras re-renderizar (o a la vista activa).
   * @private
   * @param {string|null} key Valor de `data-focus-key` del elemento que tenía el foco.
   */
  _restoreFocus(t) {
    if (!this._container) return;
    let e = null;
    t === "grid" || t === "month" || t === "year" ? e = this._container.querySelector(`[data-focus-key="${t}"][tabindex="0"]`) : t && (e = this._container.querySelector(`[data-focus-key="${t}"]`)), e && !e.disabled ? e.focus() : this._focusActiveView();
  }
  /**
   * Enfoca el elemento principal de la vista activa (día con tabindex 0, mes, año, reloj u hora).
   * @private
   */
  _focusActiveView() {
    if (!this._container) return;
    const t = {
      calendar: '.mtx-date-picker__day[tabindex="0"]',
      months: '.mtx-date-picker__month[tabindex="0"]',
      years: '.mtx-date-picker__year[tabindex="0"]'
    };
    let e = null;
    this._activeTab === "date" ? e = this._container.querySelector(t[this._currentView] || t.calendar) : e = this._container.querySelector(".mtx-time-picker__clock, .mtx-time-picker__digit-card--input"), e || (e = Array.from(this._container.querySelectorAll(es)).find((i) => i.getAttribute("tabindex") !== "-1")), e && (e.focus(), e.classList.contains("mtx-date-picker__year") && typeof e.scrollIntoView == "function" && e.scrollIntoView({ block: "center" }));
  }
  /**
   * Renderiza la cabecera Material Design.
   * @private
   */
  _renderHeader() {
    if (this._mode === "time" || this._activeTab !== "date")
      return;
    const t = document.createElement("div");
    if (t.className = "mtx-picker-header", this._isRange && this._mode === "datetime") {
      const s = document.createElement("div");
      if (s.className = "mtx-picker-header__year", this._activeTab === "date") {
        const a = this._rangeStart ? this._rangeStart.getFullYear() : this._rangeEnd ? this._rangeEnd.getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
        s.textContent = a, s.addEventListener("click", () => {
          this._activeTab = "date", this._currentView = "years", this._renderCurrentView();
        });
      } else this._activeTab === "time-start" ? s.textContent = this._t("startTimeHeader", null, "START TIME") : this._activeTab === "time-end" && (s.textContent = this._t("endTimeHeader", null, "END TIME"));
      if (t.appendChild(s), this._activeTab === "date") {
        const a = document.createElement("div");
        if (a.className = "mtx-picker-header__date", a.style.fontSize = "1.05rem", this._rangeStart && this._rangeEnd) {
          const n = this._rangeStart.getDate(), l = this._getMonthNamesShort()[this._rangeStart.getMonth()], o = this._rangeEnd.getDate(), c = this._getMonthNamesShort()[this._rangeEnd.getMonth()];
          a.textContent = `${n} ${l} - ${o} ${c}`;
        } else if (this._rangeStart) {
          const n = this._rangeStart.getDate(), l = this._getMonthNamesShort()[this._rangeStart.getMonth()];
          a.textContent = `${n} ${l} - ${this._t("selectEnd", null, "Select end date")}`;
        } else
          a.textContent = this._t("selectRange", null, "Select range");
        t.appendChild(a);
      } else {
        const a = this._activeTab === "time-end", n = a ? this._endHour : this._startHour, l = a ? this._endMinute : this._startMinute, o = a ? this._endAmPm : this._startAmPm;
        let c = n % 12;
        c === 0 && (c = 12);
        const d = String(c).padStart(2, "0"), h = String(l).padStart(2, "0"), u = document.createElement("div");
        u.className = "mtx-picker-header__time";
        const m = document.createElement("span");
        m.className = `mtx-picker-header__time-unit ${this._currentView === "clock-hours" ? "mtx-picker-header__time-unit--active" : ""}`, m.textContent = d, m.addEventListener("click", () => {
          this._currentView = "clock-hours", this._renderCurrentView();
        });
        const _ = document.createElement("span");
        _.textContent = ":";
        const x = document.createElement("span");
        x.className = `mtx-picker-header__time-unit ${this._currentView === "clock-minutes" ? "mtx-picker-header__time-unit--active" : ""}`, x.textContent = h, x.addEventListener("click", () => {
          this._currentView = "clock-minutes", this._renderCurrentView();
        });
        const A = document.createElement("div");
        A.className = "mtx-picker-header__ampm-group";
        const p = document.createElement("span");
        p.className = `mtx-picker-header__ampm-btn ${o === "AM" ? "mtx-picker-header__ampm-btn--active" : ""}`, p.textContent = "AM", p.addEventListener("click", () => {
          this._setAmPm("AM");
        });
        const b = document.createElement("span");
        b.className = `mtx-picker-header__ampm-btn ${o === "PM" ? "mtx-picker-header__ampm-btn--active" : ""}`, b.textContent = "PM", b.addEventListener("click", () => {
          this._setAmPm("PM");
        }), A.appendChild(p), A.appendChild(b), u.appendChild(m), u.appendChild(_), u.appendChild(x), u.appendChild(A), t.appendChild(u);
      }
      this._enhanceHeader(t), this._container.appendChild(t);
      return;
    }
    if (this._isRange) {
      const s = document.createElement("div");
      s.className = "mtx-picker-header__year";
      const a = this._rangeStart ? this._rangeStart.getFullYear() : this._rangeEnd ? this._rangeEnd.getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
      s.textContent = a, s.addEventListener("click", () => {
        this._activeTab = "date", this._currentView = "years", this._renderCurrentView();
      }), t.appendChild(s);
      const n = document.createElement("div");
      if (n.className = "mtx-picker-header__date", n.style.fontSize = "1.05rem", this._rangeStart && this._rangeEnd) {
        const l = this._rangeStart.getDate(), o = this._getMonthNamesShort()[this._rangeStart.getMonth()], c = this._rangeEnd.getDate(), d = this._getMonthNamesShort()[this._rangeEnd.getMonth()];
        n.textContent = `${l} ${o} - ${c} ${d}`;
      } else if (this._rangeStart) {
        const l = this._rangeStart.getDate(), o = this._getMonthNamesShort()[this._rangeStart.getMonth()];
        n.textContent = `${l} ${o} - ${this._t("selectEnd", null, "Select end date")}`;
      } else
        n.textContent = this._t("selectRange", null, "Select range");
      t.appendChild(n), this._enhanceHeader(t), this._container.appendChild(t);
      return;
    }
    const e = this._selectedDate || /* @__PURE__ */ new Date(), i = document.createElement("div");
    if (i.className = "mtx-picker-header__year", i.textContent = e.getFullYear(), i.addEventListener("click", () => {
      this._activeTab = "date", this._currentView = "years", this._renderCurrentView();
    }), t.appendChild(i), this._mode === "date" || this._mode === "datetime" && this._activeTab === "date") {
      const s = document.createElement("div");
      s.className = "mtx-picker-header__date";
      const a = this._getWeekdayNamesShort()[e.getDay()], n = this._getMonthNamesShort()[e.getMonth()];
      s.textContent = `${a}, ${e.getDate()} ${n}`, t.appendChild(s);
    } else {
      const s = document.createElement("div");
      s.className = "mtx-picker-header__time";
      let a = this._selectedHour % 12;
      a === 0 && (a = 12);
      const n = String(a).padStart(2, "0"), l = String(this._selectedMinute).padStart(2, "0"), o = document.createElement("span");
      o.className = `mtx-picker-header__time-unit ${this._currentView === "clock-hours" ? "mtx-picker-header__time-unit--active" : ""}`, o.textContent = n, o.addEventListener("click", () => {
        this._currentView = "clock-hours", this._renderCurrentView();
      });
      const c = document.createElement("span");
      c.textContent = ":";
      const d = document.createElement("span");
      d.className = `mtx-picker-header__time-unit ${this._currentView === "clock-minutes" ? "mtx-picker-header__time-unit--active" : ""}`, d.textContent = l, d.addEventListener("click", () => {
        this._currentView = "clock-minutes", this._renderCurrentView();
      });
      const h = document.createElement("div");
      h.className = "mtx-picker-header__ampm-group";
      const u = document.createElement("span");
      u.className = `mtx-picker-header__ampm-btn ${this._selectedAmPm === "AM" ? "mtx-picker-header__ampm-btn--active" : ""}`, u.textContent = "AM", u.addEventListener("click", () => {
        this._setAmPm("AM");
      });
      const m = document.createElement("span");
      m.className = `mtx-picker-header__ampm-btn ${this._selectedAmPm === "PM" ? "mtx-picker-header__ampm-btn--active" : ""}`, m.textContent = "PM", m.addEventListener("click", () => {
        this._setAmPm("PM");
      }), h.appendChild(u), h.appendChild(m), s.appendChild(o), s.appendChild(c), s.appendChild(d), s.appendChild(h), t.appendChild(s);
    }
    this._enhanceHeader(t), this._container.appendChild(t);
  }
  /**
   * Renderiza las pestañas de navegación de DateTimePicker.
   * @private
   */
  _renderTabs() {
    const t = document.createElement("div");
    if (t.className = "mtx-picker-tabs", this._isRange && this._mode === "datetime") {
      let s = this._startHour % 12;
      s === 0 && (s = 12);
      const a = String(s).padStart(2, "0"), n = String(this._startMinute).padStart(2, "0"), l = `${a}:${n} ${this._startAmPm}`;
      let o = this._endHour % 12;
      o === 0 && (o = 12);
      const c = String(o).padStart(2, "0"), d = String(this._endMinute).padStart(2, "0"), h = `${c}:${d} ${this._endAmPm}`, u = document.createElement("button");
      u.className = `mtx-picker-tab ${this._activeTab === "date" ? "mtx-picker-tab--active" : ""}`, u.type = "button", u.innerHTML = `<span class="material-icons">calendar_today</span> ${this._t("dates", null, "Dates")}`, u.addEventListener("click", (x) => {
        x.stopPropagation(), this._activeTab = "date", this._currentView = "calendar", this._renderCurrentView();
      });
      const m = document.createElement("button");
      m.className = `mtx-picker-tab ${this._activeTab === "time-start" ? "mtx-picker-tab--active" : ""}`, m.type = "button", m.innerHTML = `<span class="material-icons">schedule</span> ${this._t("start", null, "Start")} (${l})`, m.addEventListener("click", (x) => {
        x.stopPropagation(), this._activeTab = "time-start", this._currentView = "clock-hours", this._renderCurrentView();
      });
      const _ = document.createElement("button");
      _.className = `mtx-picker-tab ${this._activeTab === "time-end" ? "mtx-picker-tab--active" : ""}`, _.type = "button", _.innerHTML = `<span class="material-icons">schedule</span> ${this._t("end", null, "End")} (${h})`, _.addEventListener("click", (x) => {
        x.stopPropagation(), this._activeTab = "time-end", this._currentView = "clock-hours", this._renderCurrentView();
      }), t.appendChild(u), t.appendChild(m), t.appendChild(_), this._enhanceTabs(t), this._container.appendChild(t);
      return;
    }
    const e = document.createElement("button");
    e.className = `mtx-picker-tab ${this._activeTab === "date" ? "mtx-picker-tab--active" : ""}`, e.type = "button", e.innerHTML = `<span class="material-icons">calendar_today</span> ${this._t("date", null, "Date")}`, e.addEventListener("click", (s) => {
      s.stopPropagation(), this._activeTab = "date", this._currentView = "calendar", this._renderCurrentView();
    });
    const i = document.createElement("button");
    i.className = `mtx-picker-tab ${this._activeTab === "time" ? "mtx-picker-tab--active" : ""}`, i.type = "button", i.innerHTML = `<span class="material-icons">schedule</span> ${this._t("time", null, "Time")}`, i.addEventListener("click", (s) => {
      s.stopPropagation(), this._activeTab = "time", this._currentView = "clock-hours", this._renderCurrentView();
    }), t.appendChild(e), t.appendChild(i), this._enhanceTabs(t), this._container.appendChild(t);
  }
  /**
   * Hace accesibles por teclado los elementos clicables de la cabecera MD2.
   * @private
   * @param {HTMLElement} header Cabecera renderizada.
   */
  _enhanceHeader(t) {
    t.querySelectorAll(".mtx-picker-header__year, .mtx-picker-header__time-unit, .mtx-picker-header__ampm-btn").forEach((e, i) => {
      e.setAttribute("role", "button"), e.setAttribute("tabindex", "0"), e.setAttribute("data-focus-key", `header-${i}`), e.classList.contains("mtx-picker-header__year") && e.setAttribute("aria-label", this._t("yearViewLabel", { year: e.textContent }, `${e.textContent}, choose year`)), e.addEventListener("keydown", (s) => {
        (s.key === "Enter" || s.key === " ") && (s.preventDefault(), e.click());
      });
    });
  }
  /**
   * Aplica el patrón WAI-ARIA Tabs a las pestañas Fecha/Hora (roving tabindex).
   * @private
   * @param {HTMLElement} tabs Contenedor de pestañas.
   */
  _enhanceTabs(t) {
    t.setAttribute("role", "tablist"), t.setAttribute("aria-label", this._getDialogLabel()), t.querySelectorAll(".mtx-picker-tab").forEach((e, i) => {
      const s = e.classList.contains("mtx-picker-tab--active");
      e.setAttribute("role", "tab"), e.setAttribute("aria-selected", String(s)), e.setAttribute("tabindex", s ? "0" : "-1"), e.setAttribute("data-focus-key", `tab-${i}`), e.querySelectorAll(".material-icons").forEach((a) => a.setAttribute("aria-hidden", "true"));
    });
  }
  /**
   * Flechas izquierda/derecha, Inicio y Fin entre pestañas (activación automática).
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   * @param {HTMLElement} tab Pestaña enfocada.
   */
  _handleTabKeyDown(t, e) {
    const i = Array.from(e.parentElement.querySelectorAll('[role="tab"]')), s = i.indexOf(e);
    let a = null;
    if (t.key === "ArrowRight" ? a = i[(s + 1) % i.length] : t.key === "ArrowLeft" ? a = i[(s - 1 + i.length) % i.length] : t.key === "Home" ? a = i[0] : t.key === "End" && (a = i[i.length - 1]), !a) return;
    t.preventDefault();
    const n = a.getAttribute("data-focus-key");
    a.click();
    const l = this._container && this._container.querySelector(`[data-focus-key="${n}"]`);
    l && l.focus();
  }
  /**
   * Día que recibe `tabindex="0"` en el grid: enfocado, seleccionado, hoy o primer día habilitado.
   * @private
   * @returns {Date} Fecha objetivo del roving tabindex.
   */
  _getGridFocusDate() {
    const t = this._viewDate.getFullYear(), e = this._viewDate.getMonth(), i = (l) => l && l.getFullYear() === t && l.getMonth() === e && !this._isDateDisabled(l);
    if (i(this._focusedDate)) return this._focusedDate;
    const s = this._isRange ? this._rangeStart || this._rangeEnd : this._selectedDate;
    if (i(s)) return s;
    const a = /* @__PURE__ */ new Date();
    if (i(a)) return a;
    const n = new Date(t, e + 1, 0).getDate();
    for (let l = 1; l <= n; l++) {
      const o = new Date(t, e, l);
      if (!this._isDateDisabled(o)) return o;
    }
    return new Date(t, e, 1);
  }
  /**
   * Crea el calendario interactivo mensual como `role="grid"` (filas de semanas y roving tabindex).
   * @private
   */
  _createCalendar() {
    const t = document.createElement("div");
    t.className = "mtx-date-picker";
    const e = this._getMonthNames(), i = P("mtx-picker-title"), s = document.createElement("div");
    s.className = "mtx-date-picker__nav";
    const a = document.createElement("div");
    a.className = "mtx-date-picker__title-group", a.id = i, a.setAttribute("aria-live", "polite");
    const n = e[this._viewDate.getMonth()], l = document.createElement("button");
    l.className = "mtx-date-picker__title mtx-date-picker__title--month", l.type = "button", l.setAttribute("data-focus-key", "month-title"), l.setAttribute("aria-label", this._t("monthViewLabel", { month: n }, `${n}, choose month`)), l.innerHTML = '<span class="mtx-date-picker__title-text"></span><span class="material-icons" aria-hidden="true">arrow_drop_down</span>', l.firstChild.textContent = n, l.addEventListener("click", (D) => {
      D.stopPropagation(), this._currentView = "months", this._renderCurrentView();
    });
    const o = String(this._viewDate.getFullYear()), c = document.createElement("button");
    c.className = "mtx-date-picker__title mtx-date-picker__title--year", c.type = "button", c.setAttribute("data-focus-key", "year-title"), c.setAttribute("aria-label", this._t("yearViewLabel", { year: o }, `${o}, choose year`)), c.innerHTML = '<span class="mtx-date-picker__title-text"></span><span class="material-icons" aria-hidden="true">arrow_drop_down</span>', c.firstChild.textContent = o, c.addEventListener("click", (D) => {
      D.stopPropagation(), this._currentView = "years", this._renderCurrentView();
    }), a.appendChild(l), a.appendChild(c);
    const d = (D) => {
      const T = document.createElement("button");
      T.className = "mtx-date-picker__nav-btn", T.type = "button";
      const w = D < 0 ? "previousMonth" : "nextMonth";
      return T.setAttribute("data-focus-key", w), T.setAttribute("aria-label", this._t(w, null, D < 0 ? "Previous month" : "Next month")), T.innerHTML = `<span class="material-icons" aria-hidden="true">${D < 0 ? "chevron_left" : "chevron_right"}</span>`, T.addEventListener("click", (Y) => {
        Y.stopPropagation(), this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + D, 1), this._focusedDate = null, this._renderCurrentView();
      }), T;
    }, h = document.createElement("div");
    h.className = "mtx-date-picker__nav-group", h.appendChild(d(-1)), h.appendChild(d(1)), s.appendChild(a), s.appendChild(h), t.appendChild(s);
    const u = document.createElement("div");
    u.className = "mtx-date-picker__grid", u.setAttribute("role", "grid"), u.setAttribute("aria-labelledby", i);
    const m = document.createElement("div");
    m.className = "mtx-date-picker__weekdays", m.setAttribute("role", "row");
    const _ = this._getWeekdayNamesLong();
    this._getWeekdayNames().forEach((D, T) => {
      const w = document.createElement("div");
      w.className = "mtx-date-picker__weekday", w.setAttribute("role", "columnheader"), w.setAttribute("aria-label", _[T]), w.title = _[T], w.textContent = D, m.appendChild(w);
    }), u.appendChild(m);
    const x = document.createElement("div");
    x.className = "mtx-date-picker__days", x.setAttribute("role", "rowgroup");
    const A = this._viewDate.getFullYear(), p = this._viewDate.getMonth(), b = new Date(A, p, 1).getDay(), C = new Date(A, p + 1, 0).getDate(), S = Math.ceil((b + C) / 7) * 7, F = /* @__PURE__ */ new Date(), R = this._getGridFocusDate();
    this._focusedDate = R;
    let $ = null;
    for (let D = 0; D < S; D++) {
      D % 7 === 0 && ($ = document.createElement("div"), $.className = "mtx-date-picker__week", $.setAttribute("role", "row"), x.appendChild($));
      const T = new Date(A, p, 1 - b + D), w = T.getMonth() !== p;
      $.appendChild(this._createDayCell(T, w, F, R, x));
    }
    return this._isRange && x.addEventListener("mouseleave", () => {
      this._rangeStart && !this._rangeEnd && (this._hoverDate = null, this._renderRangePreview(x));
    }), u.appendChild(x), t.appendChild(u), t;
  }
  /**
   * Crea una celda del grid (`role="gridcell"`) con estado, etiqueta completa y selección.
   * @private
   * @param {Date} dateObj Fecha de la celda.
   * @param {boolean} outside Si pertenece al mes anterior/siguiente.
   * @param {Date} today Fecha actual.
   * @param {Date} focusDate Fecha con tabindex 0.
   * @param {HTMLElement} daysContainer Contenedor de semanas (vista previa de rango).
   * @returns {HTMLElement} Celda creada.
   */
  _createDayCell(t, e, i, s, a) {
    const n = document.createElement("div");
    n.className = "mtx-date-picker__day-cell", n.setAttribute("role", "presentation");
    const l = document.createElement("button");
    l.className = "mtx-date-picker__day", l.type = "button", l.textContent = t.getDate(), l._cellDate = t, l.setAttribute("role", "gridcell"), l.setAttribute("data-date", as(t)), l.setAttribute("data-focus-key", e ? "grid-outside" : "grid"), l.setAttribute("aria-label", this._formatDayLabel(t)), l.setAttribute("tabindex", !e && Ce(t, s) ? "0" : "-1"), Ce(t, i) && (l.classList.add("mtx-date-picker__day--today"), l.setAttribute("aria-current", "date"));
    let o = !1;
    if (e)
      l.classList.add("mtx-date-picker__day--outside");
    else if (this._isRange) {
      const c = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime(), d = this._rangeStart ? new Date(this._rangeStart.getFullYear(), this._rangeStart.getMonth(), this._rangeStart.getDate()).getTime() : null, h = this._rangeEnd ? new Date(this._rangeEnd.getFullYear(), this._rangeEnd.getMonth(), this._rangeEnd.getDate()).getTime() : null, u = d !== null && c === d, m = h !== null && c === h, _ = d !== null && h !== null && c > d && c < h;
      if (u && (n.classList.add("mtx-date-picker__day-cell--range-start"), l.classList.add("mtx-date-picker__day--selected", "mtx-date-picker__day--range-start")), m && (n.classList.add("mtx-date-picker__day-cell--range-end"), l.classList.add("mtx-date-picker__day--selected", "mtx-date-picker__day--range-end")), _ && (n.classList.add("mtx-date-picker__day-cell--in-range"), l.classList.add("mtx-date-picker__day--in-range")), o = u || m || _, this._rangeStart && !this._rangeEnd && this._hoverDate) {
        const x = new Date(this._hoverDate.getFullYear(), this._hoverDate.getMonth(), this._hoverDate.getDate()).getTime();
        c > Math.min(d, x) && c < Math.max(d, x) && (n.classList.add("mtx-date-picker__day-cell--range-preview"), l.classList.add("mtx-date-picker__day--range-preview"));
      }
      this._isDateDisabled(t) || l.addEventListener("mouseenter", () => {
        this._rangeStart && !this._rangeEnd && (this._hoverDate = t, this._renderRangePreview(a));
      });
    } else Ce(t, this._selectedDate) && (l.classList.add("mtx-date-picker__day--selected"), o = !0);
    return l.setAttribute("aria-selected", String(o)), this._isDateDisabled(t) ? (l.disabled = !0, l.setAttribute("aria-disabled", "true"), l.classList.add("mtx-date-picker__day--disabled")) : l.addEventListener("click", () => {
      this._focusedDate = new Date(t), e && (this._viewDate = new Date(t.getFullYear(), t.getMonth(), 1)), this._selectDay(t.getFullYear(), t.getMonth(), t.getDate());
    }), n.appendChild(l), n;
  }
  /**
   * Navegación por teclado del grid de días (flechas, Inicio/Fin, RePág/AvPág, Mayús+RePág/AvPág, Enter/Espacio).
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   * @param {HTMLElement} dayBtn Día enfocado.
   */
  _handleGridKeyDown(t, e) {
    const i = e._cellDate ? new Date(e._cellDate) : new Date(this._focusedDate || /* @__PURE__ */ new Date()), s = i.getFullYear(), a = i.getMonth(), n = i.getDate(), l = (d) => {
      const h = new Date(s, a + d + 1, 0).getDate();
      return new Date(s, a + d, Math.min(n, h));
    };
    let o = null, c = 1;
    switch (t.key) {
      case "ArrowLeft":
        o = new Date(s, a, n - 1), c = -1;
        break;
      case "ArrowRight":
        o = new Date(s, a, n + 1);
        break;
      case "ArrowUp":
        o = new Date(s, a, n - 7), c = -1;
        break;
      case "ArrowDown":
        o = new Date(s, a, n + 7);
        break;
      case "Home":
        o = new Date(s, a, n - i.getDay());
        break;
      case "End":
        o = new Date(s, a, n + (6 - i.getDay())), c = -1;
        break;
      case "PageUp":
        o = l(t.shiftKey ? -12 : -1), c = -1;
        break;
      case "PageDown":
        o = l(t.shiftKey ? 12 : 1);
        break;
      case "Enter":
      case " ":
        t.preventDefault(), e.disabled || e.click();
        return;
      default:
        return;
    }
    t.preventDefault(), this._moveGridFocus(o, c);
  }
  /**
   * Mueve el foco del grid a una fecha (saltando días deshabilitados) y cambia de mes si hace falta.
   * @private
   * @param {Date} target Fecha destino.
   * @param {number} step Dirección de búsqueda si el destino está deshabilitado (1 o -1).
   */
  _moveGridFocus(t, e) {
    let i = new Date(t), s = 0;
    for (; this._isDateDisabled(i) && s < 366; )
      i = new Date(i.getFullYear(), i.getMonth(), i.getDate() + e), s++;
    if (this._isDateDisabled(i)) return;
    this._focusedDate = i, this._isRange && this._rangeStart && !this._rangeEnd && (this._hoverDate = i), i.getFullYear() === this._viewDate.getFullYear() && i.getMonth() === this._viewDate.getMonth() ? this._isRange && this._hoverDate && this._renderRangePreview(this._container.querySelector(".mtx-date-picker__days")) : (this._viewDate = new Date(i.getFullYear(), i.getMonth(), 1), this._renderCurrentView());
    const n = as(i);
    this._container.querySelectorAll(".mtx-date-picker__day").forEach((l) => {
      const o = l.getAttribute("data-date") === n && !l.classList.contains("mtx-date-picker__day--outside");
      l.setAttribute("tabindex", o ? "0" : "-1"), o && l.focus();
    });
  }
  /**
   * Actualiza el resaltado visual interactivo de rango en hover sin reconstruir el calendario.
   *
   * @param {HTMLElement} container Contenedor de días.
   * @private
   */
  _renderRangePreview(t) {
    if (!t || !this._rangeStart || this._rangeEnd) return;
    const e = new Date(this._rangeStart.getFullYear(), this._rangeStart.getMonth(), this._rangeStart.getDate()).getTime(), i = this._hoverDate ? new Date(this._hoverDate.getFullYear(), this._hoverDate.getMonth(), this._hoverDate.getDate()).getTime() : null, s = i !== null ? Math.min(e, i) : null, a = i !== null ? Math.max(e, i) : null;
    t.querySelectorAll(".mtx-date-picker__day-cell").forEach((l) => {
      const o = l.querySelector(".mtx-date-picker__day");
      if (!o || !o._cellDate || o.classList.contains("mtx-date-picker__day--outside")) return;
      const c = new Date(o._cellDate.getFullYear(), o._cellDate.getMonth(), o._cellDate.getDate()).getTime();
      s !== null && a !== null && c > s && c < a ? (l.classList.add("mtx-date-picker__day-cell--range-preview"), o.classList.add("mtx-date-picker__day--range-preview")) : (l.classList.remove("mtx-date-picker__day-cell--range-preview"), o.classList.remove("mtx-date-picker__day--range-preview"));
    });
  }
  /**
   * Crea el selector de meses (`role="radiogroup"` con roving tabindex).
   * @private
   */
  _createMonthPicker() {
    const t = document.createElement("div");
    t.className = "mtx-date-picker__months", t.setAttribute("role", "radiogroup"), t.setAttribute("aria-label", this._t("chooseMonth", null, "Choose month"));
    const e = this._viewDate.getFullYear(), i = this._selectedDate && this._selectedDate.getFullYear() === e ? this._selectedDate.getMonth() : this._viewDate.getMonth(), s = this._getMonthNamesShort();
    return this._getMonthNames().forEach((a, n) => {
      const l = document.createElement("button"), o = n === i;
      l.className = `mtx-date-picker__month ${o ? "mtx-date-picker__month--selected" : ""}`, l.type = "button", l.textContent = s[n], l.title = a, l.setAttribute("role", "radio"), l.setAttribute("aria-checked", String(o)), l.setAttribute("aria-label", a), l.setAttribute("tabindex", o ? "0" : "-1"), l.setAttribute("data-focus-key", "month");
      const c = new Date(e, n, 1), d = new Date(e, n + 1, 0);
      let h = !1;
      this._minDate && d < new Date(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate()) && (h = !0), this._maxDate && c > this._maxDate && (h = !0), h ? (l.disabled = !0, l.setAttribute("aria-disabled", "true")) : l.addEventListener("click", (u) => {
        u.stopPropagation();
        const m = new Date(e, n + 1, 0).getDate();
        this._viewDate = new Date(e, n, Math.min(this._viewDate.getDate(), m)), this._focusedDate = null, this._currentView = "calendar", this._renderCurrentView();
      }), t.appendChild(l);
    }), this._ensureRovingStop(t, ".mtx-date-picker__month"), t;
  }
  /**
   * Crea el selector de años (`role="radiogroup"` con roving tabindex).
   * @private
   */
  _createYearPicker() {
    const t = document.createElement("div");
    t.className = "mtx-date-picker__years", t.setAttribute("role", "radiogroup"), t.setAttribute("aria-label", this._t("chooseYear", null, "Choose year"));
    const e = this._viewDate.getFullYear(), i = this._selectedDate ? this._selectedDate.getFullYear() : e, s = this._minDate ? this._minDate.getFullYear() : 1900, a = this._maxDate ? this._maxDate.getFullYear() : 2100;
    for (let n = s; n <= a; n++) {
      const l = document.createElement("button"), o = n === i;
      l.className = `mtx-date-picker__year ${o ? "mtx-date-picker__year--selected" : ""}`, l.type = "button", l.textContent = n, l.setAttribute("role", "radio"), l.setAttribute("aria-checked", String(o)), l.setAttribute("tabindex", o ? "0" : "-1"), l.setAttribute("data-focus-key", "year"), l.addEventListener("click", (c) => {
        c.stopPropagation();
        const d = new Date(n, this._viewDate.getMonth() + 1, 0).getDate();
        this._viewDate = new Date(n, this._viewDate.getMonth(), Math.min(this._viewDate.getDate(), d)), this._focusedDate = null, this._currentView = "calendar", this._renderCurrentView();
      }), t.appendChild(l);
    }
    return this._ensureRovingStop(t, ".mtx-date-picker__year"), this._setTimer(() => {
      const n = t.querySelector(".mtx-date-picker__year--selected");
      n && typeof n.scrollIntoView == "function" && n.scrollIntoView({ block: "center" });
    }, 0), t;
  }
  /**
   * Garantiza que exista un único elemento con `tabindex="0"` en una lista con roving tabindex.
   * @private
   * @param {HTMLElement} container Lista.
   * @param {string} selector Selector de las opciones.
   */
  _ensureRovingStop(t, e) {
    if (t.querySelector(`${e}[tabindex="0"]:not(:disabled)`)) return;
    const i = t.querySelector(`${e}:not(:disabled)`);
    t.querySelectorAll(e).forEach((s) => s.setAttribute("tabindex", "-1")), i && i.setAttribute("tabindex", "0");
  }
  /**
   * Teclado en las vistas de meses y años: flechas (±1 / ±3 filas), Inicio/Fin y Enter/Espacio.
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   * @param {HTMLElement} option Opción enfocada.
   */
  _handleOptionGridKeyDown(t, e) {
    const i = Array.from(e.parentElement.children).filter((l) => !l.disabled), s = i.indexOf(e), a = 3;
    let n = null;
    switch (t.key) {
      case "ArrowLeft":
        n = i[s - 1];
        break;
      case "ArrowRight":
        n = i[s + 1];
        break;
      case "ArrowUp":
        n = i[s - a];
        break;
      case "ArrowDown":
        n = i[s + a];
        break;
      case "Home":
        n = i[0];
        break;
      case "End":
        n = i[i.length - 1];
        break;
      case "Enter":
      case " ":
        t.preventDefault(), e.click();
        return;
      default:
        return;
    }
    t.preventDefault(), n && (i.forEach((l) => l.setAttribute("tabindex", l === n ? "0" : "-1")), n.focus());
  }
  /**
   * Crea el selector de hora canónico Material Design (MUI / MD2):
   * Modo 1: Dial analógico con tarjetas interactivas superiores ("Select time").
   * Modo 2: Entrada directa por teclado con tarjetas editables ("Enter time").
   * @private
   * @returns {HTMLElement}
   */
  _createTimePicker() {
    const t = document.createElement("div");
    t.className = "mtx-time-picker";
    let e, i, s;
    this._isRange && this._mode === "datetime" ? this._activeTab === "time-end" ? (e = this._endHour, i = this._endMinute, s = this._endAmPm) : (e = this._startHour, i = this._startMinute, s = this._startAmPm) : (e = this._selectedHour, i = this._selectedMinute, s = this._selectedAmPm);
    const a = this._isAmPmMode();
    let n = e;
    a && (n = e % 12, n === 0 && (n = 12));
    const l = this._timeInputMode === "input" || this._timeInputMode === "keyboard", o = this._timeUnit === "hours", c = document.createElement("div");
    c.className = "mtx-time-picker__header-box";
    const d = document.createElement("span");
    d.className = "mtx-time-picker__title", d.textContent = l ? this._t("enterTime", null, "Enter time") : this._t("selectTime", null, "Select time"), c.appendChild(d);
    const h = document.createElement("div");
    h.className = "mtx-time-picker__cards-row";
    const u = document.createElement("div");
    u.className = "mtx-time-picker__card-wrapper";
    let m, _;
    if (l ? (m = document.createElement("input"), m.type = "text", m.inputMode = "numeric", m.maxLength = 2, m.className = `mtx-time-picker__digit-card mtx-time-picker__digit-card--input ${o ? "mtx-time-picker__digit-card--active" : ""}`, m.value = String(n).padStart(2, "0"), m.setAttribute("aria-label", this._t("hour", null, "Hour")), m.setAttribute("data-focus-key", "hour-card"), m.addEventListener("focus", () => {
      this._timeUnit = "hours", m.classList.add("mtx-time-picker__digit-card--active"), _ && _.classList.remove("mtx-time-picker__digit-card--active"), m.select();
    }), m.addEventListener("keydown", (p) => {
      if (p.key === "Enter")
        p.preventDefault(), _ && (_.focus(), _.select());
      else if (p.key === "ArrowUp") {
        p.preventDefault();
        let b = parseInt(m.value, 10) || 0;
        b = a ? b % 12 + 1 : (b + 1) % 24, m.value = String(b).padStart(2, "0"), this._setHour(b), m.select();
      } else if (p.key === "ArrowDown") {
        p.preventDefault();
        let b = parseInt(m.value, 10) || 0;
        b = a ? b <= 1 ? 12 : b - 1 : b <= 0 ? 23 : b - 1, m.value = String(b).padStart(2, "0"), this._setHour(b), m.select();
      }
    }), m.addEventListener("input", () => {
      let p = m.value.replace(/\D/g, "");
      if (m.value = p, p.length > 0) {
        let b = parseInt(p, 10);
        a ? b > 12 && (b = 12, m.value = "12") : b > 23 && (b = 23, m.value = "23"), this._setHour(b), (p.length === 2 || a && b > 1) && _ && (_.focus(), _.select());
      }
    }), m.addEventListener("blur", () => {
      m.value && (m.value = m.value.padStart(2, "0"));
    }), this._setTimer(() => {
      m && document.body.contains(m) && (m.focus(), m.select());
    }, 30)) : (m = document.createElement("button"), m.type = "button", m.className = `mtx-time-picker__digit-card ${o ? "mtx-time-picker__digit-card--active" : ""}`, m.textContent = String(n).padStart(2, "0"), m.setAttribute("aria-label", `${this._t("hour", null, "Hour")} ${String(n).padStart(2, "0")}`), m.setAttribute("aria-pressed", String(o)), m.setAttribute("data-focus-key", "hour-card"), m.addEventListener("click", (p) => {
      p.stopPropagation(), this._timeUnit !== "hours" && (this._timeUnit = "hours", this._renderCurrentView());
    })), u.appendChild(m), l) {
      const p = document.createElement("span");
      p.className = "mtx-time-picker__card-label", p.textContent = this._t("hour", null, "Hour"), u.appendChild(p);
    }
    h.appendChild(u);
    const x = document.createElement("span");
    x.className = "mtx-time-picker__colon", x.textContent = ":", h.appendChild(x);
    const A = document.createElement("div");
    if (A.className = "mtx-time-picker__card-wrapper", l ? (_ = document.createElement("input"), _.type = "text", _.inputMode = "numeric", _.maxLength = 2, _.className = `mtx-time-picker__digit-card mtx-time-picker__digit-card--input ${o ? "" : "mtx-time-picker__digit-card--active"}`, _.value = String(i).padStart(2, "0"), _.setAttribute("aria-label", this._t("minute", null, "Minute")), _.setAttribute("data-focus-key", "minute-card"), _.addEventListener("focus", () => {
      this._timeUnit = "minutes", _.classList.add("mtx-time-picker__digit-card--active"), m && m.classList.remove("mtx-time-picker__digit-card--active"), _.select();
    }), _.addEventListener("keydown", (p) => {
      if (p.key === "Enter")
        p.preventDefault(), this._applySelection(), this._isStatic || this.close(!0);
      else if (p.key === "ArrowUp") {
        p.preventDefault();
        let b = parseInt(_.value, 10) || 0;
        b = (b + 1) % 60, _.value = String(b).padStart(2, "0"), this._setMinute(b), _.select();
      } else if (p.key === "ArrowDown") {
        p.preventDefault();
        let b = parseInt(_.value, 10) || 0;
        b = b <= 0 ? 59 : b - 1, _.value = String(b).padStart(2, "0"), this._setMinute(b), _.select();
      }
    }), _.addEventListener("input", () => {
      let p = _.value.replace(/\D/g, "");
      if (_.value = p, p.length > 0) {
        let b = parseInt(p, 10);
        b > 59 && (b = 59, _.value = "59"), this._setMinute(b);
      }
    }), _.addEventListener("blur", () => {
      _.value && (_.value = _.value.padStart(2, "0"));
    })) : (_ = document.createElement("button"), _.type = "button", _.className = `mtx-time-picker__digit-card ${o ? "" : "mtx-time-picker__digit-card--active"}`, _.textContent = String(i).padStart(2, "0"), _.setAttribute("aria-label", `${this._t("minute", null, "Minute")} ${String(i).padStart(2, "0")}`), _.setAttribute("aria-pressed", String(!o)), _.setAttribute("data-focus-key", "minute-card"), _.addEventListener("click", (p) => {
      p.stopPropagation(), this._timeUnit !== "minutes" && (this._timeUnit = "minutes", this._renderCurrentView());
    })), A.appendChild(_), l) {
      const p = document.createElement("span");
      p.className = "mtx-time-picker__card-label", p.textContent = this._t("minute", null, "Minute"), A.appendChild(p);
    }
    if (h.appendChild(A), a) {
      const p = document.createElement("div");
      p.className = "mtx-time-picker__ampm-stack";
      const b = document.createElement("button");
      b.type = "button", b.className = `mtx-time-picker__ampm-opt ${s === "AM" ? "mtx-time-picker__ampm-opt--active" : ""}`, b.textContent = "AM", b.setAttribute("aria-pressed", String(s === "AM")), b.setAttribute("data-focus-key", "ampm-am"), b.addEventListener("click", (S) => {
        S.stopPropagation(), this._setAmPm("AM"), b.classList.add("mtx-time-picker__ampm-opt--active"), C.classList.remove("mtx-time-picker__ampm-opt--active"), b.setAttribute("aria-pressed", "true"), C.setAttribute("aria-pressed", "false");
      });
      const C = document.createElement("button");
      C.type = "button", C.className = `mtx-time-picker__ampm-opt ${s === "PM" ? "mtx-time-picker__ampm-opt--active" : ""}`, C.textContent = "PM", C.setAttribute("aria-pressed", String(s === "PM")), C.setAttribute("data-focus-key", "ampm-pm"), C.addEventListener("click", (S) => {
        S.stopPropagation(), this._setAmPm("PM"), C.classList.add("mtx-time-picker__ampm-opt--active"), b.classList.remove("mtx-time-picker__ampm-opt--active"), C.setAttribute("aria-pressed", "true"), b.setAttribute("aria-pressed", "false");
      }), p.appendChild(b), p.appendChild(C), h.appendChild(p);
    }
    if (c.appendChild(h), t.appendChild(c), !l) {
      const p = document.createElement("div");
      p.className = "mtx-time-picker__clock";
      const b = a ? n : e;
      p.setAttribute("role", "slider"), p.setAttribute("tabindex", "0"), p.setAttribute("data-focus-key", "clock"), p.setAttribute("aria-orientation", "horizontal"), p.setAttribute("aria-label", o ? this._t("selectHours", null, "Select hours") : this._t("selectMinutes", null, "Select minutes")), p.setAttribute("aria-valuemin", o && a ? "1" : "0"), p.setAttribute("aria-valuemax", o ? a ? "12" : "23" : "59"), p.setAttribute("aria-valuenow", String(o ? b : i)), p.setAttribute("aria-valuetext", o ? this._t("hoursValue", { value: a ? `${b} ${s}` : b }, `${b} hours`) : this._t("minutesValue", { value: i }, `${i} minutes`));
      const C = document.createElement("div");
      C.className = "mtx-time-picker__center", p.appendChild(C);
      const S = document.createElement("div");
      S.className = "mtx-time-picker__hand";
      const F = document.createElement("div");
      F.className = "mtx-time-picker__pointer", S.appendChild(F), p.appendChild(S);
      const R = 104, $ = 128, D = 128;
      let T = 0;
      if (o) {
        let M = e % 12;
        M === 0 && (M = 12), T = M % 12 * 30;
        for (let N = 1; N <= 12; N++) {
          const K = document.createElement("div");
          K.setAttribute("aria-hidden", "true"), K.className = `mtx-time-picker__number ${N === M ? "mtx-time-picker__number--selected" : ""}`, K.textContent = N;
          const it = (N * 30 - 90) * (Math.PI / 180), J = $ + R * Math.cos(it), B = D + R * Math.sin(it);
          K.style.left = `${J}px`, K.style.top = `${B}px`, p.appendChild(K);
        }
      } else {
        T = i * 6;
        for (let M = 0; M < 60; M += 5) {
          const N = document.createElement("div");
          N.setAttribute("aria-hidden", "true");
          const K = Math.round(i / 5) * 5 === M;
          N.className = `mtx-time-picker__number ${K ? "mtx-time-picker__number--selected" : ""}`, N.textContent = String(M).padStart(2, "0");
          const it = (M * 6 - 90) * (Math.PI / 180), J = $ + R * Math.cos(it), B = D + R * Math.sin(it);
          N.style.left = `${J}px`, N.style.top = `${B}px`, p.appendChild(N);
        }
      }
      S.style.height = `${R}px`, S.style.transform = `rotate(${T}deg)`;
      const w = (M) => {
        const N = p.getBoundingClientRect(), K = (M.touches ? M.touches[0].clientX : M.clientX) - N.left - $, it = (M.touches ? M.touches[0].clientY : M.clientY) - N.top - D;
        let J = Math.atan2(it, K) * (180 / Math.PI) + 90;
        if (J < 0 && (J += 360), o) {
          let B = Math.round(J / 30) % 12;
          B === 0 && (B = 12), this._setHour(B), S.style.transform = `rotate(${B % 12 * 30}deg)`, p.querySelectorAll(".mtx-time-picker__number").forEach((at) => {
            at.classList.toggle("mtx-time-picker__number--selected", parseInt(at.textContent, 10) === B);
          }), m.textContent = String(B).padStart(2, "0");
        } else {
          let B = Math.round(J / 6) % 60;
          this._setMinute(B), S.style.transform = `rotate(${B * 6}deg)`;
          const at = Math.round(B / 5) * 5;
          p.querySelectorAll(".mtx-time-picker__number").forEach((G) => {
            G.classList.toggle("mtx-time-picker__number--selected", parseInt(G.textContent, 10) === at);
          }), _.textContent = String(B).padStart(2, "0");
        }
      }, Y = () => {
        let M = 0, N = null;
        o ? (M = 200, N = () => {
          this._timeUnit = "minutes";
        }) : this._isRange && this._mode === "datetime" && this._activeTab === "time-start" && (M = 300, N = () => {
          this._activeTab = "time-end", this._timeUnit = "hours";
        }), N && (this._clearTimer(this._clockSwitchTimer), this._clockSwitchTimer = this._setTimer(() => {
          this._clockSwitchTimer = null, N(), this._renderCurrentView();
        }, M));
      }, st = (M) => {
        this._activeDragEnd && this._activeDragEnd(!1);
        const N = !!M.touches;
        N && M.cancelable && M.preventDefault(), S.classList.add("mtx-time-picker__hand--dragging"), w(M);
        const K = (G) => {
          N && G.cancelable && G.preventDefault(), w(G);
        }, it = N ? ["touchend", "touchcancel"] : ["mouseup"], J = N ? "touchmove" : "mousemove", B = N ? { passive: !1 } : void 0, at = (G) => {
          this._activeDragEnd === at && (this._activeDragEnd = null), S.classList.remove("mtx-time-picker__hand--dragging"), window.removeEventListener(J, K, B), it.forEach((hr) => window.removeEventListener(hr, at)), !(G === !1 || G && G.type === "touchcancel") && !this.destroyed && Y();
        };
        this._activeDragEnd = at, window.addEventListener(J, K, B), it.forEach((G) => window.addEventListener(G, at));
      };
      p.addEventListener("mousedown", st), p.addEventListener("touchstart", st, { passive: !1 }), t.appendChild(p);
    }
    return t;
  }
  /**
   * Hora (0-23) y minuto activos según la pestaña (simple, inicio o fin de rango).
   * @private
   * @returns {{hour: number, minute: number}}
   */
  _getActiveTime() {
    if (this._isRange && this._mode === "datetime") {
      const t = this._activeTab === "time-end";
      return { hour: t ? this._endHour : this._startHour, minute: t ? this._endMinute : this._startMinute };
    }
    return { hour: this._selectedHour, minute: this._selectedMinute };
  }
  /**
   * Fija la hora en formato 24 h (teclado del reloj sin AM/PM).
   * @private
   * @param {number} hour24 Hora 0-23.
   */
  _setHour24(t) {
    const e = t >= 12 ? "PM" : "AM";
    this._isRange && this._mode === "datetime" ? this._activeTab === "time-end" ? this._endAmPm = e : this._startAmPm = e : this._selectedAmPm = e, this._setHour(t % 12 === 0 ? 12 : t % 12), this._isRange && this._mode === "datetime" || (this._selectedHour = t, this._selectedDate && this._selectedDate.setHours(t), this._applySelection());
  }
  /**
   * Teclado del reloj radial: flechas ±1, RePág/AvPág ±5 minutos, Inicio/Fin y Enter para pasar a minutos.
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   */
  _handleClockKeyDown(t) {
    const e = this._timeUnit === "hours", i = this._isAmPmMode(), { hour: s, minute: a } = this._getActiveTime(), n = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 };
    if (t.key === "Enter" || t.key === " ") {
      t.preventDefault(), e ? (this._timeUnit = "minutes", this._renderCurrentView()) : this._isRange && this._mode === "datetime" && this._activeTab === "time-start" && (this._activeTab = "time-end", this._timeUnit = "hours", this._renderCurrentView());
      return;
    }
    if (e) {
      const l = i ? 1 : 0, o = i ? 12 : 23;
      let c = i ? s % 12 || 12 : s;
      if (n[t.key] !== void 0) {
        const d = o - l + 1;
        c = (c - l + Math.sign(n[t.key]) + d) % d + l;
      } else if (t.key === "Home") c = l;
      else if (t.key === "End") c = o;
      else return;
      t.preventDefault(), i ? (this._setHour(c), this._isRange && this._mode === "datetime" || this._applySelection()) : this._setHour24(c);
    } else {
      let l = a;
      if (n[t.key] !== void 0) l = (a + n[t.key] + 60) % 60;
      else if (t.key === "Home") l = 0;
      else if (t.key === "End") l = 59;
      else return;
      t.preventDefault(), this._setMinute(l);
    }
    this._renderCurrentView();
  }
  /**
   * Renderiza la barra de acciones inferiores ("Hoy", "Cancelar", "Aceptar", o botón de alternancia Dial/Teclado).
   * @private
   */
  _renderActions() {
    const t = document.createElement("div");
    if (t.className = "mtx-picker-actions", this._mode === "time" || this._activeTab !== "date") {
      const e = this._timeInputMode === "input" || this._timeInputMode === "keyboard", i = document.createElement("button");
      i.type = "button", i.className = "mtx-picker-icon-btn", i.title = e ? this._t("switchToClock", null, "Switch to clock view") : this._t("switchToKeyboard", null, "Enter time with keyboard"), i.setAttribute("aria-label", i.title), i.setAttribute("data-focus-key", "time-view-toggle"), i.innerHTML = `<span class="material-icons" aria-hidden="true">${e ? "schedule" : "keyboard"}</span>`, i.addEventListener("click", (s) => {
        s.stopPropagation(), this._timeInputMode = e ? "dial" : "input", this._renderCurrentView();
      }), t.appendChild(i);
    } else {
      const e = document.createElement("button");
      e.className = "mtx-button mtx-button--text mtx-button--small", e.type = "button", e.textContent = this._todayText || this._t("today", null, "Today"), e.setAttribute("data-focus-key", "today"), e.addEventListener("click", (i) => {
        i.stopPropagation();
        const s = /* @__PURE__ */ new Date();
        this.setDate(s), !this._isStatic && this._mode !== "datetime" && this.close(!0);
      }), t.appendChild(e);
    }
    if (!this._isStatic) {
      const e = document.createElement("button");
      e.className = "mtx-button mtx-button--text mtx-button--small", e.type = "button", e.textContent = this._cancelText || this._t("cancel", null, "Cancel"), e.addEventListener("click", () => {
        this.close(!0);
      });
      const i = document.createElement("button");
      i.className = "mtx-button mtx-button--contained mtx-button--small", i.type = "button", i.textContent = this._okText || this._t("ok", null, "OK"), i.addEventListener("click", () => {
        this._applySelection(), this.close(!0);
      }), t.appendChild(e), t.appendChild(i);
    }
    this._container.appendChild(t);
  }
  /**
   * Selecciona un día del calendario.
   * @private
   */
  _selectDay(t, e, i) {
    if (this._isRange)
      if (this._rangeStep === "start" || !this._rangeStart || this._rangeStart && this._rangeEnd) {
        const s = this._mode === "datetime" ? this._startHour : 0, a = this._mode === "datetime" ? this._startMinute : 0, n = new Date(t, e, i, s, a);
        this._rangeStart = n, this._rangeEnd = null, this._rangeStep = "end", this._selectedDate = this._rangeStart, this._renderCurrentView();
        return;
      } else {
        const s = this._mode === "datetime" ? this._endHour : 0, a = this._mode === "datetime" ? this._endMinute : 0, n = new Date(t, e, i, s, a), l = new Date(t, e, i).getTime(), o = new Date(this._rangeStart.getFullYear(), this._rangeStart.getMonth(), this._rangeStart.getDate()).getTime();
        if (l < o ? (this._rangeEnd = new Date(this._rangeStart), this._rangeStart = n, this._mode === "datetime" && (this._rangeStart.setHours(this._startHour, this._startMinute), this._rangeEnd.setHours(this._endHour, this._endMinute))) : this._rangeEnd = n, this._rangeStep = "start", this._selectedDate = this._rangeEnd, this._hoverDate = null, this._mode === "datetime") {
          this._activeTab = "time-start", this._timeUnit = "hours", this._currentView = this._timeInputMode === "dial" ? "clock-hours" : "digital-time", this._applySelection(), this._renderCurrentView();
          return;
        }
        this._applySelection(), !this._isStatic && this._displayMode !== "modal" ? this.close(!0) : this._renderCurrentView();
        return;
      }
    this._selectedDate ? this._selectedDate.setFullYear(t, e, i) : this._selectedDate = new Date(t, e, i, this._selectedHour, this._selectedMinute), this._mode === "datetime" ? (this._activeTab = "time", this._timeUnit = "hours", this._currentView = this._timeInputMode === "dial" ? "clock-hours" : "digital-time", this._renderCurrentView()) : (this._applySelection(), !this._isStatic && this._displayMode !== "modal" ? this.close(!0) : this._renderCurrentView());
  }
  /**
   * Modifica la hora seleccionada.
   * @private
   */
  _setHour(t) {
    if (this._isRange && this._mode === "datetime") {
      const i = this._activeTab === "time-end", s = i ? this._endAmPm : this._startAmPm;
      let a = t % 12;
      s === "PM" && (a += 12), i ? (this._endHour = a, this._rangeEnd && this._rangeEnd.setHours(a)) : (this._startHour = a, this._rangeStart && this._rangeStart.setHours(a)), this._applySelection();
      return;
    }
    let e = t % 12;
    this._selectedAmPm === "PM" && (e += 12), this._selectedHour = e, this._selectedDate && this._selectedDate.setHours(this._selectedHour);
  }
  /**
   * Modifica el minuto seleccionado.
   * @private
   */
  _setMinute(t) {
    if (this._isRange && this._mode === "datetime") {
      this._activeTab === "time-end" ? (this._endMinute = t, this._rangeEnd && this._rangeEnd.setMinutes(t)) : (this._startMinute = t, this._rangeStart && this._rangeStart.setMinutes(t)), this._applySelection();
      return;
    }
    this._selectedMinute = t, this._selectedDate && this._selectedDate.setMinutes(t), this._applySelection();
  }
  /**
   * Alterna el período AM/PM.
   * @private
   */
  _setAmPm(t) {
    if (this._isRange && this._mode === "datetime") {
      if (this._activeTab === "time-end") {
        if (this._endAmPm === t) return;
        this._endAmPm = t, t === "PM" && this._endHour < 12 ? this._endHour += 12 : t === "AM" && this._endHour >= 12 && (this._endHour -= 12), this._rangeEnd && this._rangeEnd.setHours(this._endHour);
      } else {
        if (this._startAmPm === t) return;
        this._startAmPm = t, t === "PM" && this._startHour < 12 ? this._startHour += 12 : t === "AM" && this._startHour >= 12 && (this._startHour -= 12), this._rangeStart && this._rangeStart.setHours(this._startHour);
      }
      this._applySelection();
      return;
    }
    this._selectedAmPm !== t && (this._selectedAmPm = t, t === "PM" && this._selectedHour < 12 ? this._selectedHour += 12 : t === "AM" && this._selectedHour >= 12 && (this._selectedHour -= 12), this._selectedDate && (this._selectedDate.setHours(this._selectedHour), this._applySelection()));
  }
  /**
   * Aplica la selección actual al campo de texto y dispara los eventos correspondientes.
   * @private
   */
  _applySelection() {
    this._isInternalChange = !0;
    try {
      let t = "";
      if (this._isRange) {
        this._mode === "datetime" && (this._rangeStart && this._rangeStart.setHours(this._startHour, this._startMinute, 0, 0), this._rangeEnd && this._rangeEnd.setHours(this._endHour, this._endMinute, 0, 0));
        const i = this._rangeStart ? this._formatDate(this._rangeStart) : "", s = this._rangeEnd ? this._formatDate(this._rangeEnd) : "";
        i && s ? t = `${i}${this._rangeSeparator}${s}` : i && (t = i);
      } else
        this._selectedDate || (this._selectedDate = /* @__PURE__ */ new Date(), this._selectedDate.setHours(this._selectedHour, this._selectedMinute, 0, 0)), t = this._formatDate(this._selectedDate);
      const e = {
        isRange: this._isRange,
        date: this._selectedDate ? new Date(this._selectedDate) : null,
        dateTime: this._selectedDate ? new Date(this._selectedDate) : null,
        startDate: this._rangeStart ? new Date(this._rangeStart) : null,
        endDate: this._rangeEnd ? new Date(this._rangeEnd) : null,
        range: {
          start: this._rangeStart ? new Date(this._rangeStart) : null,
          end: this._rangeEnd ? new Date(this._rangeEnd) : null
        },
        time: this.getTime(),
        value: t,
        iso: this.getISOString(),
        picker: this
      };
      this.input && (this.input.value = t, this.input.dispatchEvent(new Event("input", { bubbles: !0 })), this.input.dispatchEvent(new Event("change", { bubbles: !0 })), this._syncFieldState(), this._syncToggleButton()), this._emitChange(e);
    } finally {
      this._isInternalChange = !1;
    }
  }
  /**
   * Emite una única vez `mtx:date-time-picker:change` (y el alias deprecado `mtx:change`).
   * Se despacha en el `<input>` (burbujea al contenedor) o en el contenedor en modo estático.
   * @private
   * @param {object} detail Datos de la selección.
   */
  _emitChange(t) {
    v(this.input || this.element, "mtx:date-time-picker:change", t, { aliases: ["mtx:change"] });
  }
  /**
   * Determina si una fecha está fuera del rango min/max permitido.
   * @private
   */
  _isDateDisabled(t) {
    const e = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
    if (this._minDate) {
      const i = new Date(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate()).getTime();
      if (e < i) return !0;
    }
    if (this._maxDate) {
      const i = new Date(this._maxDate.getFullYear(), this._maxDate.getMonth(), this._maxDate.getDate()).getTime();
      if (e > i) return !0;
    }
    return !1;
  }
  /**
   * Parsea una entrada (Date, timestamp o texto) a Date. Admite ISO `YYYY-MM-DD[THH:mm]`,
   * el formato activo (orden DD/MM o MM/DD según locale/`data-format`) y horas `HH:mm [AM|PM]`.
   *
   * @param {Date|number|string} str Valor a parsear.
   * @returns {Date|null} Objeto Date nativo válido o null.
   * @private
   */
  _parseDate(t) {
    if (t instanceof Date)
      return isNaN(t.getTime()) ? null : new Date(t);
    if (typeof t == "number") {
      const c = new Date(t);
      return isNaN(c.getTime()) ? null : c;
    }
    if (!t || typeof t != "string") return null;
    const e = t.trim();
    if (!e) return null;
    if (/^(today|hoy|now|ahora)$/i.test(e))
      return /* @__PURE__ */ new Date();
    const i = (c) => {
      const d = e.match(/\b(a|p)\.?\s?m?\.?$/i) || e.match(/(am|pm)$/i);
      if (!d) return c;
      const h = d[0].toLowerCase().startsWith("p");
      return h && c < 12 ? c + 12 : !h && c === 12 ? 0 : c;
    }, s = (c, d, h, u = 0, m = 0, _ = 0) => {
      const x = new Date(c, d, h, u, m, _);
      return isNaN(x.getTime()) || x.getFullYear() !== c || x.getMonth() !== d || x.getDate() !== h ? null : x;
    }, a = (c) => {
      const d = (c || "").match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      return d ? [i(parseInt(d[1], 10)), parseInt(d[2], 10), d[3] ? parseInt(d[3], 10) : 0] : [0, 0, 0];
    }, n = e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](.*))?$/);
    if (n) {
      const [c, d, h] = a(n[4]);
      return s(parseInt(n[1], 10), parseInt(n[2], 10) - 1, parseInt(n[3], 10), c, d, h);
    }
    const l = e.match(/^(\d{1,4})[/.-](\d{1,2})[/.-](\d{1,4})(?:[\sT]+(.*))?$/);
    if (l) {
      const c = /^\d{4}$/.test(l[1]) ? ["YYYY", "MM", "DD"] : this._getDateOrder(), d = {};
      c.forEach((p, b) => {
        d[p] = parseInt(l[b + 1], 10);
      });
      let h = d.YYYY;
      l[c.indexOf("YYYY") + 1].length <= 2 && (h += 2e3);
      let u = d.MM, m = d.DD;
      u > 12 && m <= 12 && ([u, m] = [m, u]);
      const [_, x, A] = a(l[4]);
      return s(h, u - 1, m, _, x, A);
    }
    if (/^\d{1,2}:\d{2}/.test(e)) {
      const [c, d, h] = a(e);
      if (c > 23 || d > 59) return null;
      const u = /* @__PURE__ */ new Date();
      return u.setHours(c, d, h, 0), u;
    }
    const o = new Date(e);
    return isNaN(o.getTime()) ? null : o;
  }
  /**
   * Formatea un objeto Date según el formato configurado o uno personalizado.
   *
   * @param {Date} date Objeto Date a formatear.
   * @param {string} [customFormat] Patrón opcional alternativo.
   * @returns {string} Cadena formateada.
   * @private
   */
  _formatDate(t, e = null) {
    if (!t || isNaN(t.getTime())) return "";
    const i = String(t.getDate()).padStart(2, "0"), s = String(t.getMonth() + 1).padStart(2, "0"), a = String(t.getFullYear()), n = a.slice(-2), l = t.getHours(), o = String(l).padStart(2, "0");
    let c = l % 12;
    c === 0 && (c = 12);
    const d = String(c).padStart(2, "0"), h = String(t.getMinutes()).padStart(2, "0"), u = String(t.getSeconds()).padStart(2, "0"), m = l >= 12 ? "PM" : "AM", _ = l >= 12 ? "pm" : "am";
    return (e || this._format).replace(/YYYY|AAAA/g, a).replace(/YY|AA(?!$|[ -])/g, n).replace(/MM/g, s).replace(/DD/g, i).replace(/HH/g, o).replace(/hh/g, d).replace(/mm/g, h).replace(/ss/g, u).replace(new RegExp("\\bA\\b|(?<=\\s|^)A(?=\\s|$)|AM|PM|(?<=\\d|\\s)AA(?=\\s|$)", "g"), m).replace(new RegExp("\\ba\\b|(?<=\\s|^)a(?=\\s|$)|am|pm|(?<=\\d|\\s)aa(?=\\s|$)", "g"), _);
  }
  // =========================================================================
  // API Pública (Obtener e Insertar Fecha / Fecha y Hora)
  // =========================================================================
  /**
   * Obtiene la fecha seleccionada.
   *
   * @param {string|boolean} [format=false] Si es true o un patrón (ej. 'YYYY-MM-DD'),
   *                                        retorna la cadena formateada. Si es 'iso',
   *                                        retorna cadena ISO 8601. Si es false/omitido,
   *                                        retorna una copia del objeto Date nativo.
   * @returns {Date|string|null} Objeto Date seleccionado o cadena formateada.
   */
  getDate(t = !1) {
    return this._selectedDate ? t === !0 ? this._formatDate(this._selectedDate, this._mode === "datetime" ? this._getDatePattern() : null) : typeof t == "string" && t ? t.toLowerCase() === "iso" ? this.getISOString() : this._formatDate(this._selectedDate, t) : new Date(this._selectedDate) : null;
  }
  /**
   * Obtiene la fecha y hora seleccionada como objeto Date o cadena formateada.
   *
   * @param {string|boolean} [format=false] Si es true, retorna fecha y hora con el orden del locale
   *                                        (p. ej. 'MM/DD/YYYY HH:mm' en inglés, 'DD/MM/YYYY HH:mm' en español).
   *                                        Si es 'iso', retorna formato ISO 8601.
   *                                        Si se omite o es false, retorna el objeto Date.
   * @returns {Date|string|null} Objeto Date seleccionado o cadena formateada.
   */
  getDateTime(t = !1) {
    return this._selectedDate ? t === !0 ? this._formatDate(this._selectedDate, `${this._getDatePattern()} ${this._isAmPmMode() ? "hh:mm A" : "HH:mm"}`) : typeof t == "string" && t ? t.toLowerCase() === "iso" ? this.getISOString() : this._formatDate(this._selectedDate, t) : new Date(this._selectedDate) : null;
  }
  /**
   * Obtiene la hora seleccionada como cadena ('HH:mm') o como objeto { hours, minutes }.
   *
   * @param {boolean} [asObject=false] Si es true, retorna { hours, minutes }.
   * @returns {string|{hours: number, minutes: number}|null} Hora formateada o desglose.
   */
  getTime(t = !1) {
    const e = this._isAmPmMode();
    if (this._isRange) {
      if (e) {
        let c = this._startHour % 12;
        c === 0 && (c = 12);
        let d = this._endHour % 12;
        d === 0 && (d = 12);
        const h = String(c).padStart(2, "0"), u = String(this._startMinute).padStart(2, "0"), m = String(d).padStart(2, "0"), _ = String(this._endMinute).padStart(2, "0");
        return t ? {
          start: { hours: this._startHour, minutes: this._startMinute, ampm: this._startAmPm },
          end: { hours: this._endHour, minutes: this._endMinute, ampm: this._endAmPm }
        } : `${h}:${u} ${this._startAmPm} - ${m}:${_} ${this._endAmPm}`;
      }
      const a = String(this._startHour).padStart(2, "0"), n = String(this._startMinute).padStart(2, "0"), l = String(this._endHour).padStart(2, "0"), o = String(this._endMinute).padStart(2, "0");
      return t ? {
        start: { hours: this._startHour, minutes: this._startMinute },
        end: { hours: this._endHour, minutes: this._endMinute }
      } : `${a}:${n} - ${l}:${o}`;
    }
    if (!this._selectedDate && !this._selectedHour) return null;
    if (t)
      return e ? { hours: this._selectedHour, minutes: this._selectedMinute, ampm: this._selectedAmPm } : { hours: this._selectedHour, minutes: this._selectedMinute };
    if (e) {
      let a = this._selectedHour % 12;
      a === 0 && (a = 12);
      const n = String(a).padStart(2, "0"), l = String(this._selectedMinute).padStart(2, "0");
      return `${n}:${l} ${this._selectedAmPm}`;
    }
    const i = String(this._selectedHour).padStart(2, "0"), s = String(this._selectedMinute).padStart(2, "0");
    return `${i}:${s}`;
  }
  /**
   * Obtiene la fecha seleccionada en formato ISO 8601 estándar (UTC).
   *
   * @returns {string|null} Cadena ISO o null si no hay fecha seleccionada.
   */
  getISOString() {
    return this._selectedDate ? this._selectedDate.toISOString() : null;
  }
  /**
   * Obtiene el valor textual actual mostrado en el campo de texto.
   *
   * @returns {string} Valor formateado actual.
   */
  getValue() {
    return this.value;
  }
  /**
   * Inserta o establece programáticamente una fecha (y hora opcional).
   * Admite objetos Date nativos, strings (ISO, local) o timestamps numéricos.
   *
   * @param {Date|string|number|null} date Nueva fecha a asignar.
   * @returns {DateTimePicker} La instancia para permitir encadenamiento.
   */
  setDate(t) {
    if (t == null || t === "")
      return this.clear(), this;
    const e = this._parseDate(t);
    return !e || isNaN(e.getTime()) ? this : (this._selectedDate = e, this._viewDate = new Date(e), this._selectedHour = e.getHours(), this._selectedMinute = e.getMinutes(), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM", this._applySelection(), this._container && this._renderCurrentView(), this);
  }
  /**
   * Inserta o establece programáticamente la fecha y hora completa.
   * Alias explícito de setDate para flujos de DateTimePicker.
   *
   * @param {Date|string|number|null} dateTime Fecha y hora a asignar.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setDateTime(t) {
    return this.setDate(t);
  }
  /**
   * Modifica o inserta únicamente la hora en la selección actual.
   *
   * @param {string|{hours?: number, minutes?: number}|Date} time Hora en formato 'HH:mm', objeto o Date.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setTime(t) {
    if (!t) return this;
    let e = 0, i = 0;
    if (t instanceof Date)
      e = t.getHours(), i = t.getMinutes();
    else if (typeof t == "string") {
      const s = t.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
      if (s) {
        e = parseInt(s[1], 10), i = parseInt(s[2], 10);
        const a = s[3];
        a && (a.toUpperCase() === "PM" && e < 12 ? e += 12 : a.toUpperCase() === "AM" && e === 12 && (e = 0));
      }
    } else typeof t == "object" && (e = parseInt(t.hours ?? t.hour ?? 0, 10), i = parseInt(t.minutes ?? t.minute ?? 0, 10));
    return this._selectedHour = Math.max(0, Math.min(23, e)), this._selectedMinute = Math.max(0, Math.min(59, i)), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM", this._selectedDate || (this._selectedDate = /* @__PURE__ */ new Date()), this._selectedDate.setHours(this._selectedHour, this._selectedMinute, 0, 0), this._applySelection(), this._container && this._renderCurrentView(), this;
  }
  /**
   * Inserta o establece el valor textual actual en el campo.
   *
   * @param {string|Date|number} val Cadena formateada o fecha.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setValue(t) {
    return this.setDate(t);
  }
  /**
   * Propiedad getter para la fecha seleccionada.
   *
   * @returns {Date|null}
   */
  get date() {
    return this.getDate();
  }
  /**
   * Propiedad setter para la fecha seleccionada.
   *
   * @param {Date|string|number|null} val
   */
  set date(t) {
    this.setDate(t);
  }
  /**
   * Propiedad getter para la fecha y hora seleccionada.
   *
   * @returns {Date|null}
   */
  get dateTime() {
    return this.getDateTime();
  }
  /**
   * Propiedad setter para la fecha y hora seleccionada.
   *
   * @param {Date|string|number|null} val
   */
  set dateTime(t) {
    this.setDateTime(t);
  }
  /**
   * Propiedad getter para la hora en formato 'HH:mm'.
   *
   * @returns {string|null}
   */
  get time() {
    return this.getTime();
  }
  /**
   * Propiedad setter para la hora.
   *
   * @param {string|object|Date} val
   */
  set time(t) {
    this.setTime(t);
  }
  /**
   * Propiedad getter para la cadena ISO 8601.
   *
   * @returns {string|null}
   */
  get isoString() {
    return this.getISOString();
  }
  /**
   * Propiedad getter para el valor textual del campo.
   *
   * @returns {string}
   */
  get value() {
    return this.input ? this.input.value : this._selectedDate ? this._formatDate(this._selectedDate) : "";
  }
  /**
   * Propiedad setter para el valor textual o fecha.
   *
   * @param {string|Date|number} val
   */
  set value(t) {
    this.setDate(t);
  }
  /**
   * Obtiene el rango de fechas seleccionado.
   *
   * @param {string|boolean} [format=false] Si es true, retorna valores formateados.
   *                                        Si es 'iso', retorna cadenas ISO 8601.
   *                                        Si es false/omitido, retorna objetos Date nativos.
   * @returns {{start: Date|string|null, end: Date|string|null, value?: string}}
   */
  getRange(t = !1) {
    if (t === !0) {
      const e = this._rangeStart ? this._formatDate(this._rangeStart) : null, i = this._rangeEnd ? this._formatDate(this._rangeEnd) : null;
      return {
        start: e,
        end: i,
        value: e && i ? `${e}${this._rangeSeparator}${i}` : e || ""
      };
    }
    return typeof t == "string" && t.toLowerCase() === "iso" ? {
      start: this._rangeStart ? this._rangeStart.toISOString() : null,
      end: this._rangeEnd ? this._rangeEnd.toISOString() : null
    } : {
      start: this._rangeStart ? new Date(this._rangeStart) : null,
      end: this._rangeEnd ? new Date(this._rangeEnd) : null
    };
  }
  /**
   * Inserta o establece programáticamente un rango de fechas.
   *
   * @param {Date|string|number|null|{start?: any, end?: any}} start Fecha inicial, cadena u objeto con { start, end }.
   * @param {Date|string|number|null} [end=null] Fecha final o cadena.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setRange(t, e = null) {
    if (!t && !e)
      return this._rangeStart = null, this._rangeEnd = null, this.clear(), this;
    t && typeof t == "object" && !(t instanceof Date) && ("start" in t || "end" in t) && (e = t.end, t = t.start);
    const i = this._parseDate(t), s = e ? this._parseDate(e) : null;
    return i && s && i.getTime() > s.getTime() ? (this._rangeStart = s, this._rangeEnd = i) : (this._rangeStart = i, this._rangeEnd = s), this._rangeStart && (this._startHour = this._rangeStart.getHours(), this._startMinute = this._rangeStart.getMinutes(), this._startAmPm = this._startHour >= 12 ? "PM" : "AM"), this._rangeEnd && (this._endHour = this._rangeEnd.getHours(), this._endMinute = this._rangeEnd.getMinutes(), this._endAmPm = this._endHour >= 12 ? "PM" : "AM"), this._selectedDate = this._rangeStart || this._rangeEnd, this._selectedDate && (this._viewDate = new Date(this._selectedDate)), this._applySelection(), this._container && this._renderCurrentView(), this;
  }
  /**
   * Propiedad getter para el rango.
   *
   * @returns {{start: Date|null, end: Date|null}}
   */
  get range() {
    return this.getRange();
  }
  /**
   * Propiedad setter para el rango.
   *
   * @param {{start: Date|string|null, end: Date|string|null}} val
   */
  set range(t) {
    t && typeof t == "object" && this.setRange(t.start, t.end);
  }
  /**
   * Indica si el picker opera en modo de selección de rango.
   *
   * @returns {boolean}
   */
  get isRange() {
    return this._isRange;
  }
  /**
   * Limpia la fecha seleccionada y vacía el campo de texto.
   *
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  clear() {
    return this._selectedDate = null, this._rangeStart = null, this._rangeEnd = null, this._rangeStep = "start", this._hoverDate = null, this.input && (this.input.value = "", this.input.dispatchEvent(new Event("input", { bubbles: !0 })), this.input.dispatchEvent(new Event("change", { bubbles: !0 })), this._syncFieldState(), this._syncToggleButton()), this._emitChange({
      isRange: this._isRange,
      date: null,
      dateTime: null,
      startDate: null,
      endDate: null,
      range: { start: null, end: null },
      time: null,
      value: "",
      iso: null,
      picker: this
    }), this._container && this._renderCurrentView(), this;
  }
};
/** @type {DateTimePicker|null} Referencia al selector actualmente abierto en la página */
Kt(H, "_activePicker", null);
let O = H;
f("date-time-picker", O);
f("datetime-picker", O);
f("datetimepicker", O);
f("date-picker", O);
f("datepicker", O);
f("time-picker", O);
f("timepicker", O);
f("date-range-picker", O);
f("daterangepicker", O);
f("datetime-range-picker", O);
f("datetimerangepicker", O);
const W = 16, bl = 150, gl = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 24], xl = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function rs(r, t, e, i) {
  const [s = i.vertical, a = i.horizontal] = String(r || "").trim().split(/\s+/).filter(Boolean), n = (l, o, c) => {
    if (l in c) return c[l] * o;
    const d = parseFloat(l);
    return Number.isFinite(d) ? d : 0;
  };
  return {
    y: n(s, e, { top: 0, center: 0.5, bottom: 1 }),
    x: n(a, t, { left: 0, center: 0.5, right: 1 })
  };
}
class dr extends g {
  /**
   * Crea el popover y prepara sus disparadores.
   *
   * @param {HTMLElement} element Contenido del popover (`data-mtx="popover"`).
   */
  constructor(t) {
    super(t), t.classList.add("mtx-popover"), t.id || (t.id = P("mtx-popover")), t.hasAttribute("role") || t.setAttribute("role", "dialog"), t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), this.modal && t.setAttribute("aria-modal", "true"), t.hidden = !0, this._applyLabel(), this._applyElevation(), this.isOpen = !1, this._anchor = null, this._session = [], this._exitTimer = null, this._placeholder = null, this.triggers.forEach((e) => this._prepareTrigger(e)), this.listen(document, "click", (e) => {
      const i = this._triggerFrom(e.target);
      !i || document.getElementById(this.element.id) !== this.element || i.disabled || i.getAttribute("aria-disabled") === "true" || (e.preventDefault(), this._prepareTrigger(i), this.isOpen && this._trigger === i ? this.close({ reason: "trigger" }) : this.open(i));
    }), this._bindDocument(), this.listen(t, "click", (e) => {
      const i = e.target instanceof Element ? e.target.closest("[data-mtx-popover-close]") : null;
      i && t.contains(i) && this.close({ reason: "action" });
    });
  }
  /** @returns {boolean} Si el popover es modal (atrapa el foco y bloquea el scroll). */
  get modal() {
    const t = this.element.getAttribute("data-modal");
    return t !== null && t !== "false";
  }
  /**
   * Disparadores declarados: `data-open-popover="#id"` o `aria-controls="id"`.
   *
   * @returns {HTMLElement[]} Disparadores actuales.
   */
  get triggers() {
    const t = this.element.id, e = typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t;
    return Array.from(document.querySelectorAll(
      `[data-open-popover="#${e}"], [data-open-popover="${e}"], [aria-controls="${e}"]`
    )).filter((i) => !this.element.contains(i));
  }
  /**
   * Disparador al que pertenece un nodo, si apunta a este popover.
   *
   * @param {EventTarget} node Nodo del evento.
   * @returns {HTMLElement|null} Disparador.
   * @private
   */
  _triggerFrom(t) {
    if (!(t instanceof Element)) return null;
    const e = t.closest("[data-open-popover], [aria-controls]");
    if (!e || this.element.contains(e)) return null;
    const i = this.element.id, s = (e.getAttribute("data-open-popover") || "").trim().replace(/^#/, "");
    return s ? s === i ? e : null : e.getAttribute("aria-controls") === i ? e : null;
  }
  /**
   * Añade la semántica de disparador (`aria-haspopup`, `aria-controls`, `aria-expanded`).
   *
   * @param {HTMLElement} trigger Disparador.
   * @private
   */
  _prepareTrigger(t) {
    t.hasAttribute("aria-haspopup") || t.setAttribute("aria-haspopup", "dialog"), t.hasAttribute("aria-controls") || t.setAttribute("aria-controls", this.element.id), t.setAttribute("aria-expanded", this.isOpen && this._trigger === t ? "true" : "false");
  }
  /**
   * Nombre accesible: `data-label`, o el primer encabezado interno vía `aria-labelledby`.
   *
   * @private
   */
  _applyLabel() {
    const t = this.element;
    if (t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby")) return;
    const e = t.getAttribute("data-label");
    if (e) {
      t.setAttribute("aria-label", e);
      return;
    }
    const i = t.querySelector("[data-popover-title], h1, h2, h3, h4, h5, h6");
    i && (i.id || (i.id = `${t.id}-title`), t.setAttribute("aria-labelledby", i.id));
  }
  /**
   * Aplica la elevación (`data-elevation`, 8 por defecto como MUI).
   *
   * @private
   */
  _applyElevation() {
    const t = parseInt(this.element.getAttribute("data-elevation"), 10);
    if (Number.isNaN(t)) return;
    const e = gl.reduce((i, s) => Math.abs(s - t) < Math.abs(i - t) ? s : i, 8);
    this.element.style.setProperty("--mtx-popover-shadow", e === 0 ? "none" : `var(--mtx-elevation-${e})`), this.element.style.setProperty("--mtx-popover-overlay", `var(--mtx-overlay-elevation-${e})`);
  }
  /**
   * Ancla efectiva: la indicada, `data-anchor`, el último disparador o el primero declarado.
   *
   * @returns {Element|{getBoundingClientRect: Function}|null} Ancla.
   * @private
   */
  _resolveAnchor() {
    if (this._anchor) return this._anchor;
    const t = this.element.getAttribute("data-anchor");
    return (t ? document.querySelector(t.startsWith("#") ? t : `#${t}`) : null) || this.triggers[0] || null;
  }
  /**
   * Abre el popover.
   *
   * @param {HTMLElement|{x:number, y:number}|{getBoundingClientRect: Function}} [anchor] Ancla:
   *   elemento, punto de viewport (`anchorPosition` de MUI) o ancla virtual.
   * @returns {boolean} `true` si se abrió.
   */
  open(t) {
    if (t) {
      if (t.nodeType === 1 || typeof t.getBoundingClientRect == "function")
        this._anchor = t;
      else if (Number.isFinite(t.x) && Number.isFinite(t.y)) {
        const { x: n, y: l } = t;
        this._anchor = { getBoundingClientRect: () => ({ top: l, bottom: l, left: n, right: n, width: 0, height: 0, x: n, y: l }) };
      }
      t.nodeType === 1 && this._triggerFrom(t) && this._setTrigger(t);
    }
    if (this.isOpen)
      return this.update(), !0;
    const e = this.element;
    if (!this._trigger) {
      const n = this._anchor && this._anchor.nodeType === 1 ? this._anchor : this.triggers[0];
      n && this._setTrigger(n);
    }
    const i = document.activeElement;
    this._returnFocus = i && i !== document.body && i.tabIndex >= 0 && !e.contains(i) ? i : this._trigger || i, clearTimeout(this._exitTimer), this._portal(), e.hidden = !1, this.isOpen = !0, this._trigger && this._trigger.setAttribute("aria-expanded", "true");
    const s = this._resolveAnchor(), a = Nt(s && s.nodeType === 1 ? s : null, e, () => this.update());
    return this._session.push(a), this._wasModal = this.modal, this._wasModal && me(e), X(this, {
      kind: this._wasModal ? "modal" : "popup",
      nodes: e,
      stack: [{ node: e }],
      onEscape: () => this.close({ reason: "escape" })
    }), e.offsetWidth, e.classList.add("mtx-popover--open"), this._focusInitial(), v(e, "mtx:popover:open", { popover: this, anchor: s }), !0;
  }
  /**
   * Cierra el popover.
   *
   * @param {Object} [options] Opciones.
   * @param {boolean} [options.restoreFocus=true] Devuelve el foco al disparador.
   * @param {string} [options.reason='api'] Motivo (`escape`, `click-away`, `tab`, `trigger`, `action`, `api`).
   */
  close({ restoreFocus: t = !0, reason: e = "api" } = {}) {
    if (!this.isOpen) return;
    const i = this.element;
    this.isOpen = !1, this._session.forEach((s) => s()), this._session = [], this._wasModal && pe(i), this._wasModal = !1, q(this), i.classList.remove("mtx-popover--open"), this._trigger && this._trigger.setAttribute("aria-expanded", "false"), t && this._restoreLostFocus(), clearTimeout(this._exitTimer), this._exitTimer = setTimeout(() => {
      this.isOpen || (i.hidden = !0);
    }, bl), v(i, "mtx:popover:close", { popover: this, reason: e });
  }
  /**
   * Devuelve el foco al disparador si quedó perdido tras cerrar sin restauración.
   *
   * @private
   */
  _restoreLostFocus() {
    if (this.isOpen) return;
    const t = this._returnFocus && this._returnFocus.isConnected ? this._returnFocus : this._trigger;
    if (!t || typeof t.focus != "function") return;
    const e = document.activeElement;
    (!e || e === document.body || this.element.contains(e) || e.tabIndex < 0 && e.contains(t)) && t.focus();
  }
  /**
   * Alterna el estado.
   *
   * @param {HTMLElement|{x:number,y:number}} [anchor] Ancla opcional.
   */
  toggle(t) {
    this.isOpen ? this.close() : this.open(t);
  }
  /**
   * Cambia el disparador activo (para `aria-expanded`).
   *
   * @param {HTMLElement} trigger Disparador.
   * @private
   */
  _setTrigger(t) {
    this._trigger && this._trigger !== t && this._trigger.setAttribute("aria-expanded", "false"), this._trigger = t, this._anchor = this._anchor || t;
  }
  /**
   * Porta el popover a `<body>` (evita overflow/z-index de los ancestros); deja un marcador para restaurarlo.
   *
   * @private
   */
  _portal() {
    const t = this.element;
    t.parentElement !== document.body && (!this._placeholder && t.parentNode && (this._placeholder = document.createComment(`mtx-popover:${t.id}`), t.parentNode.insertBefore(this._placeholder, t), De(this, this._placeholder)), document.body.appendChild(t));
  }
  /**
   * Enfoca `[data-autofocus]`, el primer control o el propio panel.
   *
   * @private
   */
  _focusInitial() {
    const t = this.element, i = sr(t.querySelector("[data-autofocus]")) || Yt(t)[0] || t.querySelector(xl) || t;
    try {
      i.focus({ preventScroll: !0 });
    } catch {
      i.focus();
    }
  }
  /**
   * Indica si un nodo pertenece a una capa abierta después de este popover
   * (popover hijo, menú, select, diálogo abierto desde él, tooltip).
   *
   * @param {Node} node Nodo.
   * @returns {boolean} `true` si está en una capa superior.
   * @private
   */
  _inUpperLayer(t) {
    return t instanceof Element ? t.closest(".mtx-tooltip") ? !0 : lt(this, t) : !1;
  }
  /**
   * Listeners de documento (clic fuera, Tab); solo actúan mientras está abierto.
   *
   * @private
   */
  _bindDocument() {
    const t = this.element;
    this._focusTimer = null, this._tabTimer = null, this.onDestroy(() => {
      clearTimeout(this._focusTimer), clearTimeout(this._tabTimer);
    });
    const e = (s) => {
      if (!this.isOpen) return;
      const a = s.target;
      t.contains(a) || this._inUpperLayer(a) || this._triggerFrom(a) || this._anchor && this._anchor.nodeType === 1 && this._anchor.contains(a) || (this.close({ restoreFocus: !1, reason: "click-away" }), clearTimeout(this._focusTimer), this._focusTimer = setTimeout(() => {
        this._focusTimer = null, this.destroyed || this._restoreLostFocus();
      }, 0));
    }, i = (s) => {
      if (!(!this.isOpen || s.key !== "Tab" || !Ks(this))) {
        if (this.modal) {
          di(s, t);
          return;
        }
        clearTimeout(this._tabTimer), this._tabTimer = setTimeout(() => {
          if (this._tabTimer = null, this.destroyed) return;
          const a = document.activeElement;
          this.isOpen && a && a !== document.body && !t.contains(a) && !this._inUpperLayer(a) && this.close({ restoreFocus: !1, reason: "tab" });
        }, 0);
      }
    };
    this.listen(document, "mousedown", e, !0), this.listen(document, "touchstart", e, !0), this.listen(document, "keydown", i);
  }
  /**
   * Recalcula la posición respecto del ancla.
   */
  update() {
    if (!this.isOpen) return;
    const t = this.element, e = this._resolveAnchor(), i = document.documentElement.clientWidth || window.innerWidth, s = document.documentElement.clientHeight || window.innerHeight, a = t.offsetWidth || t.getBoundingClientRect().width, n = t.offsetHeight || t.getBoundingClientRect().height;
    if (!e) {
      t.style.left = `${Math.max(W, (i - a) / 2)}px`, t.style.top = `${Math.max(W, (s - n) / 2)}px`, t.style.transformOrigin = "center center";
      return;
    }
    const l = this.element.getAttribute("data-anchor-origin"), o = this.element.getAttribute("data-transform-origin");
    if (l || o) {
      const A = e.getBoundingClientRect(), p = rs(l, A.width, A.height, { vertical: "bottom", horizontal: "left" }), b = rs(o, a, n, { vertical: "top", horizontal: "left" });
      let C = A.top + p.y - b.y, S = A.left + p.x - b.x, F = b.x, R = b.y;
      const $ = C + n, D = S + a;
      if (C < W)
        R -= W - C, C = W;
      else if ($ > s - W) {
        const T = $ - (s - W);
        C -= T, R += T;
      }
      if (S < W)
        F -= W - S, S = W;
      else if (D > i - W) {
        const T = D - (i - W);
        S -= T, F += T;
      }
      t.style.top = `${Math.round(C)}px`, t.style.left = `${Math.round(S)}px`, t.style.transformOrigin = `${Math.round(F)}px ${Math.round(R)}px`, t.setAttribute("data-placement", "origin");
      return;
    }
    const c = parseFloat(this.element.getAttribute("data-offset")), d = Vt(e, t, {
      placement: this.element.getAttribute("data-placement") || "bottom-start",
      offset: Number.isFinite(c) ? c : 0,
      padding: W
    });
    t.style.left = `${d.x}px`, t.style.top = `${d.y}px`;
    const { side: h, align: u } = ti(`${d.side}-${d.align}`), m = h === "top" || h === "bottom", _ = u === "start" ? m ? "left" : "top" : u === "end" ? m ? "right" : "bottom" : "center", x = { top: "bottom", bottom: "top", left: "right", right: "left" }[h];
    t.style.transformOrigin = m ? `${_} ${x}` : `${x} ${_}`, t.setAttribute("data-placement", d.placement);
  }
  /**
   * Cierra, restaura la posición original en el DOM y libera listeners.
   */
  destroy() {
    this.close({ restoreFocus: !1, reason: "destroy" }), clearTimeout(this._exitTimer), this._exitTimer = null;
    const t = this.element.style;
    this.element.hidden = !0, t.left = "", t.top = "", t.transformOrigin = "", this._placeholder && this._placeholder.parentNode && (this._placeholder.parentNode.insertBefore(this.element, this._placeholder), this._placeholder.remove()), this._placeholder = null, super.destroy();
  }
}
f("popover", dr);
const Al = {
  push: X,
  remove: q,
  isTop: Ks,
  getTop: Ws,
  isInUpper: lt,
  isEscapeHandled: dn,
  markEscapeHandled: si
}, El = {
  // Utilidades
  registerComponent: f,
  initAll: ee,
  initElement: U,
  init: _r,
  getInstance: L,
  watch: br,
  destroy: cs,
  destroyAll: ds,
  ComponentBase: g,
  createRipple: z,
  theme: se,
  // Internacionalización (i18n)
  i18n: Cr,
  getLocale: ce,
  setLocale: ps,
  resetLocale: _s,
  addLocale: je,
  updateLocale: Xe,
  t: y,
  getComponentLocale: k,
  // Componentes
  CssBaseline: ws,
  Typography: Ls,
  Container: Ss,
  Stack: Cs,
  Paper: Ts,
  Accordion: Ms,
  AccordionGroup: Ns,
  AccordionActions: Is,
  Grid: de,
  Divider: he,
  Button: $s,
  IconButton: Qe,
  Fab: Fs,
  SpeedDial: js,
  Link: Xs,
  Avatar: Js,
  AvatarGroup: Zs,
  Badge: Qs,
  Chip: ai,
  Alert: ta,
  CircularProgress: Je,
  LinearProgress: Ps,
  createCircularProgress: Ze,
  ButtonGroup: Bs,
  Skeleton: ea,
  skeleton: Pt,
  Backdrop: ri,
  Card: ia,
  CardActionArea: sa,
  CardHeader: aa,
  CardContent: ra,
  CardActions: na,
  CardMedia: la,
  FormHelperText: oa,
  Checkbox: ca,
  Radio: da,
  RadioGroup: ha,
  Switch: ua,
  ToggleButton: _a,
  ToggleButtonGroup: fa,
  Rating: ba,
  Slider: ga,
  TextField: yt,
  NativeSelect: xa,
  Select: Aa,
  Autocomplete: ya,
  List: va,
  ListItem: La,
  ListItemButton: ka,
  ListSubheader: Sa,
  ListItemText: Ca,
  ListItemIcon: Ta,
  ListItemAvatar: Da,
  ListItemSecondaryAction: Ma,
  Menu: Ut,
  MenuItem: Ba,
  Table: Ra,
  TableContainer: Ha,
  TableHead: qa,
  TableBody: za,
  TableFooter: ci,
  TableRow: Va,
  TableCell: Ua,
  TableSortLabel: Ka,
  TablePagination: Wa,
  TableToolbar: Ya,
  Tabs: Ga,
  Tab: ja,
  Stepper: Qa,
  MobileStepper: tr,
  Breadcrumbs: er,
  Pagination: ir,
  Dialog: ar,
  DialogActions: rr,
  Drawer: nr,
  AppBar: lr,
  Snackbar: hi,
  snackbar: ml,
  showSnackbar: or,
  DateTimePicker: O,
  DatePicker: O,
  TimePicker: O,
  DateRangePicker: O,
  DateTimeRangePicker: O,
  computePosition: Vt,
  autoUpdate: Nt,
  layers: Al,
  Tooltip: re,
  tooltip: Fe,
  Popover: dr
}, wl = O, Ll = O, kl = O, Sl = O;
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => ee()) : ee());
export {
  Ms as Accordion,
  Is as AccordionActions,
  Ns as AccordionGroup,
  ta as Alert,
  lr as AppBar,
  ya as Autocomplete,
  Js as Avatar,
  Zs as AvatarGroup,
  ri as Backdrop,
  Qs as Badge,
  er as Breadcrumbs,
  $s as Button,
  Bs as ButtonGroup,
  ia as Card,
  sa as CardActionArea,
  na as CardActions,
  ra as CardContent,
  aa as CardHeader,
  la as CardMedia,
  ca as Checkbox,
  ai as Chip,
  Je as CircularProgress,
  g as ComponentBase,
  Ss as Container,
  ws as CssBaseline,
  wl as DatePicker,
  kl as DateRangePicker,
  O as DateTimePicker,
  Sl as DateTimeRangePicker,
  ar as Dialog,
  rr as DialogActions,
  he as Divider,
  nr as Drawer,
  Fs as Fab,
  oa as FormHelperText,
  de as Grid,
  Qe as IconButton,
  Ps as LinearProgress,
  Xs as Link,
  va as List,
  La as ListItem,
  Da as ListItemAvatar,
  ka as ListItemButton,
  Ta as ListItemIcon,
  Ma as ListItemSecondaryAction,
  Ca as ListItemText,
  Sa as ListSubheader,
  Ut as Menu,
  Ba as MenuItem,
  tr as MobileStepper,
  xa as NativeSelect,
  ir as Pagination,
  Ts as Paper,
  dr as Popover,
  da as Radio,
  ha as RadioGroup,
  ba as Rating,
  Aa as Select,
  ea as Skeleton,
  ga as Slider,
  hi as Snackbar,
  js as SpeedDial,
  Cs as Stack,
  Qa as Stepper,
  ua as Switch,
  ja as Tab,
  Ra as Table,
  za as TableBody,
  Ua as TableCell,
  Ha as TableContainer,
  ci as TableFooter,
  qa as TableHead,
  Wa as TablePagination,
  Va as TableRow,
  Ka as TableSortLabel,
  Ya as TableToolbar,
  Ga as Tabs,
  yt as TextField,
  Ll as TimePicker,
  _a as ToggleButton,
  fa as ToggleButtonGroup,
  re as Tooltip,
  Ls as Typography,
  je as addLocale,
  Nt as autoUpdate,
  Vt as computePosition,
  Ze as createCircularProgress,
  z as createRipple,
  El as default,
  cs as destroy,
  ds as destroyAll,
  k as getComponentLocale,
  L as getInstance,
  ce as getLocale,
  Cr as i18n,
  _r as init,
  ee as initAll,
  U as initElement,
  Al as layers,
  f as registerComponent,
  _s as resetLocale,
  ps as setLocale,
  or as showSnackbar,
  Pt as skeleton,
  ml as snackbar,
  y as t,
  se as theme,
  Fe as tooltip,
  Xe as updateLocale,
  br as watch
};
