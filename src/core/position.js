/**
 * Posicionamiento de superficies flotantes (Tooltip, Popover, Autocomplete...).
 *
 * Calcula coordenadas de viewport (para `position: fixed`) con colocación
 * `top|bottom|left|right` y alineación `-start|-end`, volteo (flip) cuando no
 * cabe, desplazamiento (shift) para no salir del viewport y soporte RTL.
 */

const SIDES = ['top', 'right', 'bottom', 'left'];
const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * Descompone una colocación en lado y alineación.
 *
 * @param {string} placement Colocación (`bottom`, `top-start`, `right-end`...).
 * @returns {{side: string, align: string}} Lado y alineación (`''`, `start`, `end`).
 */
export function parsePlacement(placement) {
  const [side, align] = String(placement || 'bottom').trim().split('-');
  return {
    side: SIDES.includes(side) ? side : 'bottom',
    align: align === 'start' || align === 'end' ? align : '',
  };
}

/**
 * Indica si un elemento se renderiza en dirección derecha-a-izquierda.
 *
 * @param {Element|Object} element Elemento (o ancla virtual).
 * @returns {boolean} `true` en RTL.
 */
export function isRtl(element) {
  const el = element && element.nodeType === 1 ? element : document.documentElement;
  const dirEl = el.closest ? el.closest('[dir]') : null;
  if (dirEl) return dirEl.getAttribute('dir').toLowerCase() === 'rtl';
  try {
    return getComputedStyle(el).direction === 'rtl';
  } catch (e) {
    return false;
  }
}

/**
 * Tamaño del viewport visible (sin barras de desplazamiento).
 *
 * @returns {{width: number, height: number}} Dimensiones en px.
 */
function getViewport() {
  const root = document.documentElement;
  return {
    width: root.clientWidth || window.innerWidth || 0,
    height: root.clientHeight || window.innerHeight || 0,
  };
}

/**
 * Tamaño de la superficie sin transformaciones (las animaciones de escala no lo alteran).
 *
 * @param {HTMLElement} floating Superficie flotante.
 * @returns {{width: number, height: number}} Dimensiones en px.
 */
function getFloatingSize(floating) {
  const width = floating.offsetWidth;
  const height = floating.offsetHeight;
  if (width || height) return { width, height };
  const rect = floating.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

/**
 * Coordenadas para un lado y una alineación física concretos.
 *
 * @param {DOMRect} ref Rectángulo del ancla.
 * @param {{width:number,height:number}} size Tamaño de la superficie.
 * @param {string} side Lado.
 * @param {string} align Alineación física (`''`, `start`, `end`).
 * @param {number} offset Separación respecto del ancla.
 * @returns {{x: number, y: number}} Coordenadas.
 */
function getCoords(ref, size, side, align, offset) {
  let x;
  let y;
  if (side === 'top' || side === 'bottom') {
    y = side === 'top' ? ref.top - size.height - offset : ref.bottom + offset;
    if (align === 'start') x = ref.left;
    else if (align === 'end') x = ref.right - size.width;
    else x = ref.left + ref.width / 2 - size.width / 2;
  } else {
    x = side === 'left' ? ref.left - size.width - offset : ref.right + offset;
    if (align === 'start') y = ref.top;
    else if (align === 'end') y = ref.bottom - size.height;
    else y = ref.top + ref.height / 2 - size.height / 2;
  }
  return { x, y };
}

/**
 * Desbordamiento (px) en el eje principal para un lado.
 *
 * @param {{x:number,y:number}} coords Coordenadas.
 * @param {{width:number,height:number}} size Tamaño.
 * @param {string} side Lado.
 * @param {{width:number,height:number}} viewport Viewport.
 * @param {number} padding Margen mínimo.
 * @returns {number} Píxeles que sobresalen (0 si cabe).
 */
function getMainOverflow(coords, size, side, viewport, padding) {
  switch (side) {
    case 'top': return Math.max(0, padding - coords.y);
    case 'bottom': return Math.max(0, coords.y + size.height - (viewport.height - padding));
    case 'left': return Math.max(0, padding - coords.x);
    default: return Math.max(0, coords.x + size.width - (viewport.width - padding));
  }
}

/**
 * Limita un valor a un rango; si el rango es inválido devuelve el mínimo.
 *
 * @param {number} value Valor.
 * @param {number} min Mínimo.
 * @param {number} max Máximo.
 * @returns {number} Valor limitado.
 */
function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Calcula la posición de una superficie flotante respecto de un ancla.
 *
 * @param {Element|{getBoundingClientRect: Function}} anchor Ancla real o virtual (p. ej. el cursor).
 * @param {HTMLElement} floating Superficie flotante (en el DOM y medible).
 * @param {Object} [options] Opciones.
 * @param {string} [options.placement='bottom'] `top|bottom|left|right` con `-start|-end` opcional.
 * @param {number} [options.offset=8] Separación respecto del ancla (px).
 * @param {boolean} [options.flip=true] Cambia al lado opuesto si no cabe.
 * @param {boolean} [options.shift=true] Desplaza en el eje cruzado para no salir del viewport.
 * @param {number} [options.padding=8] Margen mínimo con el borde del viewport (px).
 * @param {boolean} [options.rtl] Fuerza RTL (por defecto se detecta en el ancla).
 * @returns {{x: number, y: number, placement: string, side: string, align: string, arrowOffset: number}}
 *   Coordenadas de viewport, colocación final (lógica), lado y alineación físicos y centro del ancla
 *   en el eje cruzado relativo a la superficie (para la flecha).
 */
export function computePosition(anchor, floating, options = {}) {
  const {
    placement = 'bottom',
    offset = 8,
    flip = true,
    shift = true,
    padding = 8,
  } = options;
  const rtl = typeof options.rtl === 'boolean' ? options.rtl : isRtl(anchor);
  const ref = anchor.getBoundingClientRect();
  const size = getFloatingSize(floating);
  const viewport = getViewport();
  const parsed = parsePlacement(placement);

  let side = parsed.side;
  const vertical = side === 'top' || side === 'bottom';
  // En RTL, start/end de top/bottom se reflejan (igual que el Popper de MUI).
  let align = parsed.align;
  if (rtl && vertical && align) align = align === 'start' ? 'end' : 'start';

  let coords = getCoords(ref, size, side, align, offset);
  if (flip) {
    const overflow = getMainOverflow(coords, size, side, viewport, padding);
    if (overflow > 0) {
      const opposite = OPPOSITE[side];
      const altCoords = getCoords(ref, size, opposite, align, offset);
      const altOverflow = getMainOverflow(altCoords, size, opposite, viewport, padding);
      if (altOverflow < overflow) {
        side = opposite;
        coords = altCoords;
      }
    }
  }

  let { x, y } = coords;
  const isVertical = side === 'top' || side === 'bottom';
  if (shift) {
    if (isVertical) x = clamp(x, padding, viewport.width - padding - size.width);
    else y = clamp(y, padding, viewport.height - padding - size.height);
  }

  const crossSize = isVertical ? size.width : size.height;
  const anchorCenter = isVertical ? ref.left + ref.width / 2 - x : ref.top + ref.height / 2 - y;
  const arrowOffset = clamp(anchorCenter, Math.min(12, crossSize / 2), crossSize - Math.min(12, crossSize / 2));

  return {
    x: Math.round(x),
    y: Math.round(y),
    placement: parsed.align ? `${side}-${parsed.align}` : side,
    side,
    align,
    arrowOffset: Math.round(arrowOffset),
  };
}

/**
 * Mantiene actualizada una superficie flotante mientras está visible:
 * escucha scroll (incluidos contenedores), resize y cambios de tamaño del ancla y la superficie.
 * Ejecuta `update` una vez al empezar.
 *
 * @param {Element|{getBoundingClientRect: Function}} anchor Ancla.
 * @param {HTMLElement} floating Superficie flotante.
 * @param {Function} update Callback que recalcula la posición.
 * @returns {Function} Limpieza que retira todos los listeners y observadores.
 */
export function autoUpdate(anchor, floating, update) {
  let active = true;
  const handler = () => {
    if (active) update();
  };
  const scrollOptions = { capture: true, passive: true };
  window.addEventListener('scroll', handler, scrollOptions);
  window.addEventListener('resize', handler, { passive: true });

  let observer = null;
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(handler);
    if (anchor && anchor.nodeType === 1) observer.observe(anchor);
    if (floating && floating.nodeType === 1) observer.observe(floating);
  }

  update();

  return function cleanup() {
    active = false;
    window.removeEventListener('scroll', handler, scrollOptions);
    window.removeEventListener('resize', handler, { passive: true });
    if (observer) observer.disconnect();
  };
}

/**
 * Posiciona una superficie desplegable (Menu, Select, submenús) limitando su alto al espacio
 * disponible: en `top|bottom` elige el lado con más espacio si no cabe; en `left|right`
 * (submenús) refleja el lado en RTL, voltea si no cabe y desplaza en vertical.
 *
 * @param {Element|{getBoundingClientRect: Function}} anchor Ancla real o virtual.
 * @param {HTMLElement} floating Superficie flotante (`position: fixed`, en el DOM).
 * @param {Object} [options] Opciones.
 * @param {string} [options.placement='bottom-start'] Colocación preferida.
 * @param {number} [options.offset=4] Separación respecto del ancla (px).
 * @param {number} [options.padding=8] Margen mínimo con el viewport (px).
 * @param {boolean} [options.matchWidth=false] Iguala el ancho mínimo al del ancla.
 * @param {boolean} [options.rtl] Fuerza RTL (por defecto se detecta en el ancla).
 * @param {HTMLElement} [options.content] Elemento que hace scroll (mide el alto natural); por defecto `floating`.
 * @param {string} [options.lockSide] Lado físico a conservar (recolocaciones): sin elegir lado ni voltear.
 * @returns {{x: number, y: number, placement: string, side: string, maxHeight: number}} Resultado aplicado.
 */
export function positionDropdown(anchor, floating, options = {}) {
  const { placement = 'bottom-start', offset = 4, padding = 8, matchWidth = false } = options;
  const lockSide = SIDES.includes(options.lockSide) ? options.lockSide : null;
  const rtl = typeof options.rtl === 'boolean' ? options.rtl : isRtl(anchor);
  const ref = anchor.getBoundingClientRect();
  const viewport = getViewport();
  const parsed = parsePlacement(placement);
  let side = parsed.side;
  let maxHeight;
  const sameAxis = lockSide
    && ((lockSide === 'top' || lockSide === 'bottom') === (side === 'top' || side === 'bottom'));

  if (sameAxis) {
    side = lockSide;
    maxHeight = side === 'top'
      ? Math.max(0, ref.top - padding - offset)
      : side === 'bottom'
        ? Math.max(0, viewport.height - padding - ref.bottom - offset)
        : Math.max(0, viewport.height - padding * 2);
  } else if (side === 'top' || side === 'bottom') {
    const below = Math.max(0, viewport.height - padding - ref.bottom - offset);
    const above = Math.max(0, ref.top - padding - offset);
    // El alto natural se mide en el elemento que hace scroll (no le afecta el maxHeight previo).
    const natural = (options.content || floating).scrollHeight;
    const preferred = side === 'top' ? above : below;
    const other = side === 'top' ? below : above;
    if (natural > preferred && other > preferred) side = OPPOSITE[side];
    maxHeight = side === 'top' ? above : below;
  } else {
    // Submenú: en RTL se abre hacia la izquierda; el alto se limita al viewport y `shift` lo ajusta.
    if (rtl) side = OPPOSITE[side];
    maxHeight = Math.max(0, viewport.height - padding * 2);
  }

  floating.style.position = 'fixed';
  floating.style.maxHeight = `${maxHeight}px`;
  floating.style.maxWidth = `${Math.max(0, viewport.width - padding * 2)}px`;
  if (matchWidth) floating.style.minWidth = `${ref.width}px`;

  const vertical = side === 'top' || side === 'bottom';
  const result = computePosition(anchor, floating, {
    placement: parsed.align ? `${side}-${parsed.align}` : side,
    offset,
    padding,
    flip: !vertical && !sameAxis,
    shift: true,
    rtl,
  });

  floating.style.left = `${result.x}px`;
  floating.style.top = `${result.y}px`;
  floating.style.transformOrigin = vertical
    ? (result.side === 'top' ? 'bottom' : 'top')
    : `${result.side === 'left' ? 'right' : 'left'} top`;
  floating.dataset.placement = result.side;
  return { x: result.x, y: result.y, placement: result.placement, side: result.side, maxHeight };
}
