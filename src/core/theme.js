/**
 * API de tema de Materix UI: `Materix.theme.{get, getMode, set, toggle, configure, sync}`.
 *
 * - El tema resuelto (`light` | `dark`) se escribe en `<html data-mtx-theme>`.
 * - El modo (`light` | `dark` | `system`) se refleja en `<html data-mtx-theme-mode>`.
 * - Persistencia opcional: `<html data-mtx-theme-persist>` (valor = clave de localStorage) o `configure({ persist })`.
 * - `?theme=` opcional: `<html data-mtx-theme-query>` (valor = nombre del parámetro) o `configure({ query })`.
 * - Botones `[data-mtx-theme-toggle]` alternan (sin valor) o fijan el modo (`light|dark|system`).
 * - Emite `mtx:theme:change` en `document` con `{ theme, mode, previous }` (alias deprecado `mtx:theme-change`).
 */
import { t, getComponentLocale } from '../i18n/index.js';
import { emit } from './events.js';

const MODES = ['light', 'dark', 'system'];
const DEFAULT_STORAGE_KEY = 'mtx-theme';
const DEFAULT_QUERY = 'theme';
const TOGGLE_SELECTOR = '[data-mtx-theme-toggle]';

const state = {
  initialized: false,
  mode: 'light',
  resolved: 'light',
  storageKey: null,
  query: null,
  media: null,
  observer: null,
};

/** Botones con etiqueta propia del autor (no se sobrescribe). */
const authorLabelled = new WeakSet();
/** Botones ya inspeccionados. */
const inspected = new WeakSet();

/** @returns {HTMLElement|null} Elemento raíz del documento. */
function getRoot() {
  return typeof document !== 'undefined' ? document.documentElement : null;
}

/**
 * Normaliza un modo de tema.
 * @param {*} value Valor recibido.
 * @returns {string|null} `light`, `dark`, `system` o `null` si no es válido.
 */
function normalizeMode(value) {
  const mode = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return MODES.includes(mode) ? mode : null;
}

/** @returns {boolean} `true` si el sistema prefiere el tema oscuro. */
function systemPrefersDark() {
  if (!state.media && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    state.media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (state.mode === 'system') apply('system', false); };
    if (state.media && typeof state.media.addEventListener === 'function') state.media.addEventListener('change', onChange);
    else if (state.media && typeof state.media.addListener === 'function') state.media.addListener(onChange);
  }
  return Boolean(state.media && state.media.matches);
}

/**
 * Resuelve un modo al tema efectivo.
 * @param {string} mode Modo de tema.
 * @returns {'light'|'dark'} Tema efectivo.
 */
function resolve(mode) {
  if (mode === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return mode === 'dark' ? 'dark' : 'light';
}

/** @returns {string|null} Modo guardado en localStorage, si la persistencia está activa. */
function readStored() {
  if (!state.storageKey) return null;
  try {
    return normalizeMode(localStorage.getItem(state.storageKey));
  } catch (e) {
    return null;
  }
}

/** @param {string} mode Modo a guardar si la persistencia está activa. */
function writeStored(mode) {
  if (!state.storageKey) return;
  try {
    localStorage.setItem(state.storageKey, mode);
  } catch (e) {
    /* almacenamiento no disponible */
  }
}

/** @returns {string|null} Modo forzado por la URL, si `query` está activo. */
function readQuery() {
  if (!state.query || typeof window === 'undefined' || !window.location) return null;
  try {
    return normalizeMode(new URLSearchParams(window.location.search).get(state.query));
  } catch (e) {
    return null;
  }
}

/**
 * Emite `mtx:theme:change` (y el alias deprecado `mtx:theme-change`).
 * @param {string} previous Tema efectivo anterior.
 */
function emitChange(previous) {
  emit(document, 'mtx:theme:change',
    { theme: state.resolved, mode: state.mode, previous },
    { bubbles: false, aliases: ['mtx:theme-change'] });
}

/**
 * Aplica un modo al documento y sincroniza los botones.
 * @param {string} mode Modo de tema.
 * @param {boolean} persist Guardar en localStorage si está activo.
 */
function apply(mode, persist) {
  const root = getRoot();
  if (!root) return;
  flushExternal(root);
  const previous = state.resolved;
  const previousMode = state.mode;
  state.mode = mode;
  state.resolved = resolve(mode);
  writeRoot(root, () => {
    root.setAttribute('data-mtx-theme', state.resolved);
    root.setAttribute('data-mtx-theme-mode', mode);
  });
  if (persist) writeStored(mode);
  sync();
  if (previous !== state.resolved || previousMode !== mode) emitChange(previous);
}

/**
 * Indica si el botón tiene un nombre accesible puesto por el autor.
 * @param {HTMLElement} button Botón de tema.
 * @returns {boolean} `true` si no se debe sobrescribir su etiqueta.
 */
function hasAuthorLabel(button) {
  if (!inspected.has(button)) {
    inspected.add(button);
    const visibleText = Array.from(button.childNodes)
      .filter((node) => !(node.nodeType === 1 && node.classList.contains('material-icons')))
      .map((node) => node.textContent)
      .join('')
      .trim();
    if (button.hasAttribute('aria-label') || button.hasAttribute('aria-labelledby') || visibleText) {
      authorLabelled.add(button);
    }
  }
  return authorLabelled.has(button);
}

/**
 * Sincroniza icono, `aria-pressed`, `aria-label` y `title` de los botones `[data-mtx-theme-toggle]`.
 * @param {ParentNode} [root=document] Contenedor a sincronizar.
 */
function sync(root = typeof document !== 'undefined' ? document : null) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  const isDark = state.resolved === 'dark';
  root.querySelectorAll(TOGGLE_SELECTOR).forEach((button) => {
    const target = normalizeMode(button.getAttribute('data-mtx-theme-toggle'));
    const locale = getComponentLocale(button);
    if (target) {
      // Botón de valor fijo (grupo light/dark/system).
      button.setAttribute('aria-pressed', String(state.mode === target));
      if (!hasAuthorLabel(button)) button.setAttribute('aria-label', t('theme', target, null, target, locale));
      return;
    }
    // Interruptor: etiqueta estable y estado en aria-pressed (patrón WAI-ARIA de toggle button).
    button.setAttribute('aria-pressed', String(isDark));
    if (!hasAuthorLabel(button)) button.setAttribute('aria-label', t('theme', 'toggle', null, 'Dark theme', locale));
    button.setAttribute('title', t('theme', isDark ? 'switchToLight' : 'switchToDark', null, '', locale));
    const icon = button.querySelector('.material-icons, .material-icons-outlined, .material-symbols-outlined');
    if (icon && !button.hasAttribute('data-mtx-theme-static-icon')) {
      icon.textContent = isDark ? (button.getAttribute('data-icon-dark') || 'light_mode')
        : (button.getAttribute('data-icon-light') || 'dark_mode');
    }
  });
}

/**
 * Lee el modo inicial: URL (si `query`), almacenamiento (si `persist`) y atributos de `<html>`.
 * @returns {string} Modo inicial.
 */
function readInitialMode() {
  const root = getRoot();
  return readQuery()
    || readStored()
    || normalizeMode(root && root.getAttribute('data-mtx-theme-mode'))
    || normalizeMode(root && root.getAttribute('data-mtx-theme'))
    || 'light';
}

/**
 * Procesa ya los cambios externos de `data-mtx-theme` que el observer aún no entregó.
 *
 * @param {HTMLElement} root Elemento `<html>`.
 */
function flushExternal(root) {
  if (state.observer && state.observer.takeRecords().length) handleExternalChange(root);
}

/**
 * Escribe en `<html>` sin que el observer trate la escritura como externa.
 *
 * El `MutationObserver` es asíncrono, así que un flag síncrono no sirve: tras escribir
 * se descartan con `takeRecords()` los registros generados por la propia escritura
 * (los externos previos ya se procesaron con `flushExternal()`).
 *
 * @param {HTMLElement} root Elemento `<html>`.
 * @param {Function} write Escrituras a realizar.
 */
function writeRoot(root, write) {
  flushExternal(root);
  write();
  if (state.observer) state.observer.takeRecords();
}

/**
 * Adopta un `data-mtx-theme` escrito por el autor: fija el modo explícito aunque
 * coincida con el tema resuelto (p. ej. en modo `system`).
 *
 * @param {HTMLElement} root Elemento `<html>`.
 */
function handleExternalChange(root) {
  const external = normalizeMode(root.getAttribute('data-mtx-theme')) || 'light';
  if (external === 'system') {
    apply('system', false);
    return;
  }
  if (external === state.resolved && external === state.mode) return;
  const previous = state.resolved;
  state.mode = external;
  state.resolved = external;
  root.setAttribute('data-mtx-theme-mode', external);
  sync();
  emitChange(previous);
}

/** Observa cambios externos de `data-mtx-theme` para mantener estado, botones y evento coherentes. */
function observeRoot() {
  const root = getRoot();
  if (!root || state.observer || typeof MutationObserver === 'undefined') return;
  // Solo llegan registros externos: las escrituras propias se descartan en `writeRoot()`.
  state.observer = new MutationObserver((records) => {
    if (records.length) handleExternalChange(root);
  });
  state.observer.observe(root, { attributes: true, attributeFilter: ['data-mtx-theme'] });
}

/**
 * Lee la configuración declarativa de `<html>` (`data-mtx-theme-persist`, `data-mtx-theme-query`).
 */
function readDeclarativeConfig() {
  const root = getRoot();
  if (!root) return;
  if (root.hasAttribute('data-mtx-theme-persist') && root.getAttribute('data-mtx-theme-persist') !== 'false') {
    state.storageKey = root.getAttribute('data-mtx-theme-persist') || DEFAULT_STORAGE_KEY;
  }
  if (root.hasAttribute('data-mtx-theme-query') && root.getAttribute('data-mtx-theme-query') !== 'false') {
    state.query = root.getAttribute('data-mtx-theme-query') || DEFAULT_QUERY;
  }
}

/**
 * Inicializa la API de tema (idempotente). Se ejecuta al importar la librería.
 * Solo escribe en `<html>` si hay un modo distinto del actual (URL, almacenamiento o `system`).
 */
function init() {
  const root = getRoot();
  if (!root || state.initialized) return;
  state.initialized = true;
  readDeclarativeConfig();
  const mode = readInitialMode();
  const current = root.getAttribute('data-mtx-theme');
  if (mode === 'system' || mode !== (normalizeMode(current) || 'light') || root.hasAttribute('data-mtx-theme-mode')) {
    state.mode = mode;
    state.resolved = resolve(mode);
    apply(mode, false);
  } else {
    state.mode = mode;
    state.resolved = resolve(mode);
  }
  observeRoot();
  document.addEventListener('click', (event) => {
    const button = event.target && event.target.closest ? event.target.closest(TOGGLE_SELECTOR) : null;
    if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return;
    const target = normalizeMode(button.getAttribute('data-mtx-theme-toggle'));
    if (target) theme.set(target);
    else theme.toggle();
  });
  document.addEventListener('mtx:locale:change', () => sync());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => sync());
  } else {
    sync();
  }
}

/**
 * API pública del tema.
 */
export const theme = {
  /**
   * Devuelve el tema efectivo.
   * @returns {'light'|'dark'} Tema aplicado.
   */
  get() {
    init();
    return state.resolved;
  },

  /**
   * Devuelve el modo elegido.
   * @returns {'light'|'dark'|'system'} Modo actual.
   */
  getMode() {
    init();
    return state.mode;
  },

  /**
   * Aplica un modo de tema.
   * @param {'light'|'dark'|'system'} mode Modo a aplicar.
   * @param {{persist?: boolean}} [options] `persist: false` evita guardar aunque la persistencia esté activa.
   * @returns {'light'|'dark'} Tema efectivo resultante.
   * @throws {TypeError} Si el modo no es `light`, `dark` ni `system`.
   */
  set(mode, options = {}) {
    init();
    const normalized = normalizeMode(mode);
    if (!normalized) throw new TypeError(`[Materix UI theme] Modo no válido: "${mode}". Usa light, dark o system.`);
    apply(normalized, options.persist !== false);
    return state.resolved;
  },

  /**
   * Alterna entre claro y oscuro (desde `system` pasa al opuesto del tema efectivo).
   * @returns {'light'|'dark'} Tema efectivo resultante.
   */
  toggle() {
    init();
    return theme.set(state.resolved === 'dark' ? 'light' : 'dark');
  },

  /**
   * Configura persistencia y parámetro de URL.
   * @param {{persist?: boolean|string, query?: boolean|string}} [options] `persist`: `true` o clave de
   *   localStorage; `query`: `true` o nombre del parámetro (`theme`). Al activarlos se relee el modo inicial.
   * @returns {'light'|'dark'} Tema efectivo.
   */
  configure(options = {}) {
    init();
    if ('persist' in options) {
      state.storageKey = options.persist ? (typeof options.persist === 'string' ? options.persist : DEFAULT_STORAGE_KEY) : null;
    }
    if ('query' in options) {
      state.query = options.query ? (typeof options.query === 'string' ? options.query : DEFAULT_QUERY) : null;
    }
    const forced = readQuery() || readStored();
    if (forced && forced !== state.mode) apply(forced, false);
    return state.resolved;
  },

  /**
   * Sincroniza los botones `[data-mtx-theme-toggle]` (útil tras insertar contenido dinámico).
   * @param {ParentNode} [root=document] Contenedor.
   */
  sync(root) {
    init();
    sync(root);
  },
};

init();

export default theme;
