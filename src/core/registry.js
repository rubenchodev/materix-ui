/**
 * Registro central de componentes de Materix UI.
 *
 * Se encarga de registrar las clases, inicializar los componentes de forma
 * declarativa y evitar inicializaciones duplicadas (idempotencia).
 */

/** @type {Map<string, typeof import('./component-base.js').ComponentBase>} */
const components = new Map();

/** @type {WeakMap<HTMLElement, Object>} Referencias débiles: un nodo eliminado no retiene su instancia. */
const instances = new WeakMap();

/** @type {WeakMap<Object, Set<HTMLElement>>} Elementos vinculados a cada instancia (original y raíz generada). */
const elementsByInstance = new WeakMap();

/**
 * Nodos de origen de instancias cuyo elemento vive portado fuera de su sitio
 * (menú, popover): marcador o nodo original que sigue en el árbol del consumidor.
 * Claves débiles: una instancia abandonada (contenedor eliminado sin `destroy()`) no queda retenida.
 * @type {WeakMap<Object, Set<Node>>}
 */
const homeNodes = new WeakMap();

/**
 * Referencias débiles a las instancias con nodos de origen, para poder recorrerlas.
 * @type {Set<{deref: Function}>}
 */
const homedRefs = new Set();

/** @type {WeakMap<Object, {deref: Function}>} Referencia débil de cada instancia en `homedRefs`. */
const refByInstance = new WeakMap();

/**
 * Crea una referencia débil (o fuerte si el entorno no tiene `WeakRef`).
 *
 * @param {Object} instance Instancia.
 * @returns {{deref: Function}} Referencia.
 */
function weakRef(instance) {
  return typeof WeakRef === 'function' ? new WeakRef(instance) : { deref: () => instance };
}

/**
 * Elimina la instancia del índice de nodos de origen.
 *
 * @param {Object} instance Instancia.
 */
function forgetHome(instance) {
  homeNodes.delete(instance);
  const ref = refByInstance.get(instance);
  if (ref) homedRefs.delete(ref);
  refByInstance.delete(instance);
}

/**
 * Registra una clase de componente por su nombre `data-mtx`.
 *
 * @param {string} name Nombre del componente (valor de `data-mtx`).
 * @param {Function} ComponentClass Clase del componente.
 */
export function registerComponent(name, ComponentClass) {
  components.set(name, ComponentClass);
}

/**
 * Obtiene la instancia asociada a un elemento, si existe.
 *
 * @param {HTMLElement} element Elemento del DOM.
 * @returns {Object|undefined} Instancia del componente o `undefined`.
 */
export function getInstance(element) {
  return instances.get(element);
}

/**
 * Vincula una instancia a su elemento en el registro.
 *
 * @param {HTMLElement} element Elemento del DOM.
 * @param {Object} instance Instancia del componente.
 */
export function registerInstance(element, instance) {
  if (!element || !element.nodeType || !instance) return;
  instances.set(element, instance);
  let set = elementsByInstance.get(instance);
  if (!set) {
    set = new Set();
    elementsByInstance.set(instance, set);
  }
  set.add(element);
}

/**
 * Desvincula un elemento de su instancia (no destruye la instancia).
 *
 * @param {HTMLElement} element Elemento del DOM.
 */
export function unregisterInstance(element) {
  if (!element || !element.nodeType) return;
  const instance = instances.get(element);
  instances.delete(element);
  const set = instance && elementsByInstance.get(instance);
  if (set) set.delete(element);
}

/**
 * Asocia a una instancia un nodo de origen (p. ej. el marcador que deja al portar su
 * elemento a `<body>`): si ese nodo sale del DOM dentro de un contenedor destruido con
 * `destroyAll()` o `watch({ destroyOnRemove })`, la instancia también se destruye.
 *
 * @param {Object} instance Instancia del componente.
 * @param {Node} node Nodo de origen.
 */
export function registerHomeNode(instance, node) {
  if (!instance || !node) return;
  let set = homeNodes.get(instance);
  if (!set) {
    set = new Set();
    homeNodes.set(instance, set);
    const ref = weakRef(instance);
    refByInstance.set(instance, ref);
    homedRefs.add(ref);
  }
  set.add(node);
}

/**
 * Instancias con algún nodo de origen dentro de `root` (o igual a él).
 *
 * @param {Node} root Contenedor.
 * @returns {Object[]} Instancias afectadas.
 */
function instancesHomedIn(root) {
  const found = [];
  Array.from(homedRefs).forEach((ref) => {
    const instance = ref.deref();
    // Instancia recolectada o ya destruida: se purga del índice.
    if (!instance || instance.destroyed) {
      homedRefs.delete(ref);
      if (instance) forgetHome(instance);
      return;
    }
    const nodes = homeNodes.get(instance) || [];
    for (const node of nodes) {
      if (node === root || (root.contains && root.contains(node))) {
        found.push(instance);
        break;
      }
    }
  });
  return found;
}

/**
 * Desvincula todos los elementos asociados a una instancia y retira `data-mtx-initialized`.
 *
 * @param {Object} instance Instancia del componente.
 */
export function releaseInstance(instance) {
  if (!instance) return;
  forgetHome(instance);
  const set = elementsByInstance.get(instance);
  if (set) {
    set.forEach((element) => {
      if (instances.get(element) === instance) instances.delete(element);
      if (element.removeAttribute) element.removeAttribute('data-mtx-initialized');
    });
    elementsByInstance.delete(instance);
  }
}

/**
 * Ejecuta `instance.destroy()` y desvincula la instancia aunque lance.
 *
 * @param {Object} instance Instancia del componente.
 * @throws {*} Relanza el error de `destroy()` tras desvincular.
 */
function destroyInstance(instance) {
  try {
    if (!instance.destroyed && typeof instance.destroy === 'function') instance.destroy();
  } finally {
    // Por si la subclase no llamó a super.destroy() o lanzó: desvincula igualmente.
    releaseInstance(instance);
  }
}

/**
 * Destruye la instancia asociada a un elemento, si existe.
 * Si `destroy()` lanza, la instancia queda igualmente desvinculada y el error se relanza.
 *
 * @param {HTMLElement} element Elemento del DOM.
 * @returns {boolean} `true` si había instancia y se destruyó.
 */
export function destroy(element) {
  const instance = getInstance(element);
  if (!instance) return false;
  try {
    destroyInstance(instance);
  } finally {
    if (element.removeAttribute) element.removeAttribute('data-mtx-initialized');
  }
  return true;
}

/**
 * Destruye sin propagar errores (recorridos masivos: un componente roto no corta el resto).
 *
 * @param {Function} fn Acción de destrucción.
 * @returns {boolean} `true` si terminó sin errores.
 */
function safely(fn) {
  try {
    fn();
    return true;
  } catch (error) {
    if (typeof console !== 'undefined') console.error('[Materix UI] Error al destruir una instancia:', error);
    return false;
  }
}

/**
 * Destruye todas las instancias dentro de un contenedor (incluido el propio contenedor).
 *
 * @param {Document|HTMLElement} [root=document] Contenedor raíz.
 * @returns {number} Número de instancias destruidas.
 */
export function destroyAll(root = document) {
  let count = 0;
  if (!root || typeof root.querySelectorAll !== 'function') return count;
  const nodes = Array.from(root.querySelectorAll('[data-mtx-initialized]'));
  if (root.nodeType === Node.ELEMENT_NODE && root.hasAttribute('data-mtx-initialized')) nodes.unshift(root);
  // Del más profundo al más externo: los hijos se liberan antes que sus contenedores.
  nodes.reverse().forEach((node) => {
    if (!getInstance(node)) return;
    safely(() => destroy(node));
    count++;
  });
  // Instancias portadas (menú, popover) cuyo marcador de origen está dentro de `root`.
  if (root !== document) {
    instancesHomedIn(root).forEach((instance) => {
      if (instance.destroyed) return;
      safely(() => destroyInstance(instance));
      count++;
    });
  }
  return count;
}

/**
 * Inicializa un único elemento si aún no ha sido inicializado.
 * Permite especificar opcionalmente el nombre del componente.
 *
 * @param {HTMLElement|null} element Elemento del DOM a inicializar (`null` o un no-elemento: no-op).
 * @param {string} [componentName] Nombre opcional del componente (ej: 'text-field', 'checkbox').
 * @returns {Object|null} Instancia creada o existente, o `null`.
 */
export function initElement(element, componentName) {
  if (!element || element.nodeType !== 1 || typeof element.getAttribute !== 'function') return null;
  const validName = typeof componentName === 'string' ? componentName : null;
  const name = validName || element.getAttribute('data-mtx');
  if (!name) return null;

  if (validName && !element.hasAttribute('data-mtx')) {
    element.setAttribute('data-mtx', validName);
  }

  const existing = getInstance(element);
  if (existing) return existing;

  const ComponentClass = components.get(name);
  if (!ComponentClass) return null;

  const originalElement = element;
  const instance = new ComponentClass(element);
  registerInstance(originalElement, instance);
  if (instance.element) {
    registerInstance(instance.element, instance);
  }
  originalElement.setAttribute('data-mtx-initialized', '');
  return instance;
}

/**
 * Alias de inicialización individual de un único elemento desde JavaScript.
 *
 * Uso:
 * ```javascript
 * const field = Materix.init(element);
 * const select = Materix.init(element, 'select');
 * ```
 *
 * @param {HTMLElement} element Elemento del DOM.
 * @param {string} [name] Nombre del componente opcional.
 * @returns {Object|null} Instancia del componente.
 */
export function init(element, name) {
  return initElement(element, name);
}

/**
 * Inicializa todos los componentes dentro de un contenedor.
 *
 * Es idempotente: ejecutarla varias veces no crea instancias duplicadas.
 *
 * @param {Document|HTMLElement} [root=document] Contenedor raíz.
 */
export function initAll(root = document) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  if (root.nodeType === Node.ELEMENT_NODE && root.matches('[data-mtx]:not([data-mtx-initialized])')) {
    initElement(root);
  }

  // Componentes anidados que otro genera en su auto-scaffolding: se repite la pasada
  // (máximo 5) solo si la anterior creó alguna instancia nueva.
  for (let pass = 0; pass < 5; pass++) {
    const pending = root.querySelectorAll('[data-mtx]:not([data-mtx-initialized])');
    if (!pending.length) break;
    let created = 0;
    pending.forEach((el) => {
      if (getInstance(el)) return;
      if (initElement(el)) created++;
    });
    if (!created) break;
  }
}

/**
 * Destruye las instancias de un subárbol eliminado del documento.
 *
 * @param {Node} node Nodo eliminado.
 */
function destroyDetached(node) {
  if (node.isConnected) return;
  if (node.nodeType === Node.ELEMENT_NODE) {
    destroyAll(node);
    return;
  }
  // Marcador de origen eliminado por sí solo (comentario de un popover/menú portado).
  instancesHomedIn(node).forEach((instance) => {
    safely(() => destroyInstance(instance));
  });
}

/**
 * Observa un contenedor para inicializar componentes añadidos
 * dinámicamente (aplicaciones SPA o contenido asíncrono).
 *
 * Con `destroyOnRemove: true` también destruye las instancias de los nodos
 * eliminados (solo si siguen desconectados al procesar la mutación, de modo
 * que mover un nodo o el auto-scaffolding no lo destruyen).
 *
 * Devuelve un `MutationObserver` que puede detenerse con `disconnect()`.
 *
 * @param {HTMLElement|Document} [root=document] Contenedor a observar.
 * @param {{destroyOnRemove?: boolean}} [options] Opciones.
 * @returns {MutationObserver} Observador activo.
 */
export function watch(root = document, options = {}) {
  const { destroyOnRemove = false } = options || {};
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (destroyOnRemove) mutation.removedNodes.forEach(destroyDetached);
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE || !node.isConnected) return;
        if (node.hasAttribute && node.hasAttribute('data-mtx')) {
          initElement(node);
        }

        if (node.querySelectorAll) {
          node.querySelectorAll('[data-mtx]').forEach((el) => initElement(el));
        }
      });
    });
  });

  observer.observe(root, { childList: true, subtree: true });
  return observer;
}
