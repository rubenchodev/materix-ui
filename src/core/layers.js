/**
 * Pila común de capas flotantes y modales de Materix UI.
 *
 * Cada superficie (Dialog, Drawer temporal, Popover, Menu, Select, Autocomplete,
 * DateTimePicker, SpeedDial, Backdrop, Snackbar, Tooltip) se registra al abrirse y
 * se retira al cerrarse. Un único listener de `keydown` en `document` entrega
 * Escape SOLO a la capa superior y marca el evento como gestionado.
 *
 * Orden: la última capa abierta es la superior, con dos prioridades fijas:
 * - `tooltip` (prioridad 2, transitoria): si hay un tooltip visible, Escape lo
 *   cierra primero y solo a él (WCAG 1.4.13), sin bloquear el resto de capas.
 * - `snackbar` (prioridad 0): solo recibe Escape cuando no hay otra capa abierta.
 * - El resto (`modal`, `popup`) comparte la prioridad 1.
 */

const PRIORITY = { snackbar: 0, modal: 1, popup: 1, tooltip: 2 };
const HANDLED = '__mtxEscapeHandled';

/**
 * @typedef {Object} LayerEntry
 * @property {Object} owner Instancia propietaria.
 * @property {string} kind Tipo de capa.
 * @property {number} priority Prioridad (mayor = más arriba).
 * @property {boolean} transient Capa que no bloquea (tooltip).
 * @property {number} order Orden de apertura.
 * @property {Function|null} onEscape Acción de Escape (`null` consume Escape sin cerrar).
 * @property {Function} nodes Devuelve los nodos que componen la capa.
 */

/** @type {LayerEntry[]} */
const layers = [];

/**
 * Reclamaciones de `z-index` por nodo: valor original y valor pedido por cada capa.
 * @type {Map<HTMLElement, {original: string, claims: Map<Object, number>}>}
 */
const zClaims = new Map();
let sequence = 0;
let installed = false;

/**
 * Normaliza la opción `nodes` a una función que devuelve un array de nodos.
 *
 * @param {Node|Node[]|Function|undefined} nodes Nodos de la capa.
 * @returns {Function} Proveedor de nodos.
 */
function toNodeProvider(nodes) {
  if (typeof nodes === 'function') return () => [].concat(nodes() || []).filter(Boolean);
  const list = [].concat(nodes || []).filter(Boolean);
  return () => list;
}

/**
 * Busca la entrada de una instancia.
 *
 * @param {Object} owner Instancia.
 * @returns {LayerEntry|undefined} Entrada.
 */
function find(owner) {
  return layers.find((entry) => entry.owner === owner);
}

/**
 * Ordena de abajo arriba: prioridad y, a igual prioridad, orden de apertura.
 *
 * @param {LayerEntry[]} list Entradas.
 * @returns {LayerEntry[]} Copia ordenada.
 */
function sorted(list) {
  return list.slice().sort((a, b) => (a.priority - b.priority) || (a.order - b.order));
}

/**
 * Listener global: entrega Escape a la capa superior y lo marca como gestionado.
 *
 * @param {KeyboardEvent} event Evento de teclado.
 */
function handleKeydown(event) {
  if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented || event[HANDLED]) return;
  const top = topEntry(true);
  if (!top) return;
  markEscapeHandled(event);
  if (typeof top.onEscape === 'function') top.onEscape(event);
}

/**
 * Retira capas cuyos nodos ya no están en el documento (contenido eliminado sin `destroy()`).
 */
function pruneDetached() {
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const nodes = layers[i].nodes();
    if (nodes.length && nodes.every((node) => !node.isConnected)) {
      const [entry] = layers.splice(i, 1);
      releaseZ(entry.owner);
    }
  }
}

/** Instala el listener de Escape una sola vez por documento. */
function install() {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  document.addEventListener('keydown', handleKeydown);
}

/**
 * Capa superior.
 *
 * @param {boolean} includeTransient Incluye tooltips.
 * @returns {LayerEntry|null} Entrada superior.
 */
function topEntry(includeTransient) {
  pruneDetached();
  const list = sorted(includeTransient ? layers : layers.filter((entry) => !entry.transient));
  return list[list.length - 1] || null;
}

/**
 * Registra (o sube a la cima) una capa abierta.
 *
 * @param {Object} owner Instancia propietaria.
 * @param {Object} [options] Opciones.
 * @param {'modal'|'popup'|'tooltip'|'snackbar'} [options.kind='popup'] Tipo de capa.
 * @param {Function|null} [options.onEscape] Acción al pulsar Escape siendo la capa superior.
 * @param {Node|Node[]|Function} [options.nodes] Nodos de la capa (para "clic fuera").
 * @param {Array<{node: HTMLElement, offset?: number}>|Function} [options.stack] Nodos que deben
 *   quedar por encima de las capas ya abiertas (p. ej. un Dialog abierto desde un Popover):
 *   reciben `z-index: calc(var(--mtx-z-index-modal) + 2·profundidad + offset)` mientras la capa
 *   está abierta. Sin capas debajo no se toca su `z-index`.
 * @returns {number} Profundidad: capas modales/emergentes abiertas por debajo.
 */
export function pushLayer(owner, { kind = 'popup', onEscape = null, nodes, stack } = {}) {
  if (!owner) return 0;
  install();
  removeLayer(owner);
  pruneDetached();
  const depth = layers.filter((entry) => entry.priority === 1).length;
  if (depth > 0 && stack && PRIORITY[kind] !== 2) {
    const list = [].concat((typeof stack === 'function' ? stack() : stack) || []);
    list.forEach((item) => item && item.node && claimZ(owner, item.node, 2 * depth + (item.offset || 0)));
  }
  layers.push({
    owner,
    kind,
    priority: PRIORITY[kind] ?? 1,
    transient: kind === 'tooltip',
    order: ++sequence,
    onEscape,
    nodes: toNodeProvider(nodes),
  });
  return depth;
}

/**
 * Aplica el `z-index` más alto reclamado sobre un nodo, o restaura el original.
 *
 * @param {HTMLElement} node Nodo.
 */
function applyZ(node) {
  const record = zClaims.get(node);
  if (!record) return;
  if (!record.claims.size) {
    node.style.zIndex = record.original;
    zClaims.delete(node);
    return;
  }
  const value = Math.max(...record.claims.values());
  node.style.zIndex = `calc(var(--mtx-z-index-modal, 1300) + ${value})`;
}

/**
 * Registra el `z-index` que una capa necesita sobre un nodo.
 *
 * @param {Object} owner Instancia.
 * @param {HTMLElement} node Nodo.
 * @param {number} value Incremento sobre `--mtx-z-index-modal`.
 */
function claimZ(owner, node, value) {
  if (!node.style) return;
  let record = zClaims.get(node);
  if (!record) {
    record = { original: node.style.zIndex, claims: new Map() };
    zClaims.set(node, record);
  }
  record.claims.set(owner, value);
  applyZ(node);
}

/**
 * Libera los `z-index` reclamados por una capa.
 *
 * @param {Object} owner Instancia.
 */
function releaseZ(owner) {
  Array.from(zClaims.keys()).forEach((node) => {
    const record = zClaims.get(node);
    if (record && record.claims.delete(owner)) applyZ(node);
  });
}

/**
 * Retira la capa de una instancia (idempotente).
 *
 * @param {Object} owner Instancia propietaria.
 */
export function removeLayer(owner) {
  const index = layers.findIndex((entry) => entry.owner === owner);
  if (index >= 0) layers.splice(index, 1);
  releaseZ(owner);
}

/**
 * Indica si la instancia es la capa superior. Los tooltips no cuentan salvo
 * que se pregunte por un tooltip, así que no bloquean el foco ni el teclado.
 *
 * @param {Object} owner Instancia.
 * @returns {boolean} `true` si es la superior.
 */
export function isTopLayer(owner) {
  const entry = find(owner);
  if (!entry) return false;
  const top = topEntry(entry.transient);
  return Boolean(top && top.owner === owner);
}

/**
 * Instancia de la capa superior (incluye tooltips).
 *
 * @returns {Object|null} Instancia o `null`.
 */
export function getTopLayer() {
  const top = topEntry(true);
  return top ? top.owner : null;
}

/**
 * Indica si la instancia tiene una capa abierta registrada.
 *
 * @param {Object} owner Instancia.
 * @returns {boolean} `true` si está registrada.
 */
export function hasLayer(owner) {
  return Boolean(find(owner));
}

/**
 * Número de capas abiertas (sin contar tooltips con `includeTransient = false`).
 *
 * @param {boolean} [includeTransient=true] Cuenta tooltips.
 * @returns {number} Capas abiertas.
 */
export function layerCount(includeTransient = true) {
  return includeTransient ? layers.length : layers.filter((entry) => !entry.transient).length;
}

/**
 * Indica si un nodo pertenece a una capa abierta DESPUÉS de la indicada (p. ej. un
 * Dialog o Menu abierto desde un Popover), para no tratarlo como "clic fuera".
 *
 * @param {Object} owner Instancia de referencia.
 * @param {Node} node Nodo del evento.
 * @returns {boolean} `true` si el nodo está en una capa superior.
 */
export function isInUpperLayer(owner, node) {
  if (!node || typeof node !== 'object') return false;
  const entry = find(owner);
  const since = entry ? entry.order : -Infinity;
  return layers.some((other) => other !== entry && other.order > since && other.kind !== 'snackbar'
    && other.nodes().some((root) => root === node || (root.contains && root.contains(node))));
}

/**
 * Marca un Escape como gestionado: ninguna otra capa lo procesará.
 *
 * @param {KeyboardEvent} event Evento de teclado.
 */
export function markEscapeHandled(event) {
  if (!event) return;
  try { event[HANDLED] = true; } catch (e) { /* evento congelado */ }
  if (event.cancelable) event.preventDefault();
}

/**
 * Indica si un Escape ya fue gestionado por una capa de Materix.
 *
 * @param {KeyboardEvent} event Evento de teclado.
 * @returns {boolean} `true` si se gestionó.
 */
export function isEscapeHandled(event) {
  return Boolean(event && event[HANDLED]);
}
