/**
 * Posicionamiento de superficies flotantes (port de `core/position.js`).
 *
 * Coordenadas de viewport (para `position: fixed`) con colocación `top|bottom|left|right`
 * y alineación `-start|-end`, volteo (flip), desplazamiento (shift) y soporte RTL.
 */

/** Lado físico. */
export type Side = 'top' | 'right' | 'bottom' | 'left';
/** Alineación en el eje cruzado. */
export type Align = '' | 'start' | 'end';
/** Colocación (`bottom`, `top-start`, `right-end`...). */
export type Placement = Side | `${Side}-start` | `${Side}-end`;

/** Ancla virtual (p. ej. el cursor). */
export interface VirtualElement {
  getBoundingClientRect(): DOMRect | { top: number; left: number; right: number; bottom: number; width: number; height: number };
  nodeType?: undefined;
}

/** Ancla real o virtual. */
export type PositionAnchor = Element | VirtualElement;

const SIDES: Side[] = ['top', 'right', 'bottom', 'left'];
const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

interface Size {
  width: number;
  height: number;
}
interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Descompone una colocación en lado y alineación.
 * @param {string} placement Colocación.
 * @returns {{side: Side, align: Align}} Lado y alineación.
 */
export function parsePlacement(placement?: string | null): { side: Side; align: Align } {
  const [side, align] = String(placement || 'bottom').trim().split('-');
  return {
    side: SIDES.includes(side as Side) ? (side as Side) : 'bottom',
    align: align === 'start' || align === 'end' ? align : '',
  };
}

/**
 * Indica si un elemento se renderiza en dirección derecha-a-izquierda.
 * @param {PositionAnchor|null} element Elemento o ancla virtual.
 * @returns {boolean} `true` en RTL.
 */
export function isRtl(element?: PositionAnchor | Node | null): boolean {
  if (typeof document === 'undefined') return false;
  const el = (element && (element as Node).nodeType === 1 ? element : document.documentElement) as Element;
  const dirEl = el.closest ? el.closest('[dir]') : null;
  if (dirEl) return (dirEl.getAttribute('dir') || '').toLowerCase() === 'rtl';
  try {
    return getComputedStyle(el).direction === 'rtl';
  } catch {
    return false;
  }
}

function getViewport(): Size {
  const root = document.documentElement;
  return {
    width: root.clientWidth || window.innerWidth || 0,
    height: root.clientHeight || window.innerHeight || 0,
  };
}

/** Tamaño sin transformaciones (las animaciones de escala no lo alteran). */
function getFloatingSize(floating: HTMLElement): Size {
  const width = floating.offsetWidth;
  const height = floating.offsetHeight;
  if (width || height) return { width, height };
  const rect = floating.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function getCoords(ref: Rect, size: Size, side: Side, align: Align, offset: number): { x: number; y: number } {
  let x: number;
  let y: number;
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

function getMainOverflow(coords: { x: number; y: number }, size: Size, side: Side, viewport: Size, padding: number): number {
  switch (side) {
    case 'top':
      return Math.max(0, padding - coords.y);
    case 'bottom':
      return Math.max(0, coords.y + size.height - (viewport.height - padding));
    case 'left':
      return Math.max(0, padding - coords.x);
    default:
      return Math.max(0, coords.x + size.width - (viewport.width - padding));
  }
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

/** Opciones de `computePosition`. */
export interface ComputePositionOptions {
  placement?: Placement | string;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  padding?: number;
  rtl?: boolean;
}

/** Resultado de `computePosition`. */
export interface ComputePositionResult {
  x: number;
  y: number;
  /** Colocación final lógica. */
  placement: string;
  side: Side;
  /** Alineación física aplicada. */
  align: Align;
  /** Centro del ancla en el eje cruzado relativo a la superficie (flecha). */
  arrowOffset: number;
}

/**
 * Calcula la posición de una superficie flotante respecto de un ancla.
 * @param {PositionAnchor} anchor Ancla real o virtual.
 * @param {HTMLElement} floating Superficie (en el DOM y medible).
 * @param {ComputePositionOptions} [options] Colocación, offset (8), flip, shift, padding (8) y rtl.
 * @returns {ComputePositionResult} Coordenadas de viewport y colocación final.
 */
export function computePosition(
  anchor: PositionAnchor,
  floating: HTMLElement,
  options: ComputePositionOptions = {},
): ComputePositionResult {
  const { placement = 'bottom', offset = 8, flip = true, shift = true, padding = 8 } = options;
  const rtl = typeof options.rtl === 'boolean' ? options.rtl : isRtl(anchor);
  const ref = anchor.getBoundingClientRect() as Rect;
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
 * Mantiene actualizada una superficie mientras está visible (scroll, resize y cambios de tamaño).
 * Ejecuta `update` una vez al empezar.
 * @param {PositionAnchor|null} anchor Ancla.
 * @param {HTMLElement|null} floating Superficie.
 * @param {Function} update Recalcula la posición.
 * @returns {Function} Limpieza.
 */
export function autoUpdate(anchor: PositionAnchor | null, floating: HTMLElement | null, update: () => void): () => void {
  let active = true;
  const handler = () => {
    if (active) update();
  };
  const scrollOptions: AddEventListenerOptions = { capture: true, passive: true };
  window.addEventListener('scroll', handler, scrollOptions);
  window.addEventListener('resize', handler, { passive: true });

  let observer: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(handler);
    if (anchor && (anchor as Node).nodeType === 1) observer.observe(anchor as Element);
    if (floating && floating.nodeType === 1) observer.observe(floating);
  }

  update();

  return function cleanup() {
    active = false;
    window.removeEventListener('scroll', handler, scrollOptions);
    window.removeEventListener('resize', handler, { passive: true } as EventListenerOptions);
    if (observer) observer.disconnect();
  };
}

/** Opciones de `positionDropdown`. */
export interface PositionDropdownOptions {
  placement?: Placement | string;
  offset?: number;
  padding?: number;
  matchWidth?: boolean;
  rtl?: boolean;
  /** Elemento que hace scroll (mide el alto natural); por defecto `floating`. */
  content?: HTMLElement | null;
  /** Lado físico a conservar (recolocaciones): sin elegir lado ni voltear. */
  lockSide?: Side | null;
}

/** Resultado de `positionDropdown`. */
export interface PositionDropdownResult {
  x: number;
  y: number;
  placement: string;
  side: Side;
  maxHeight: number;
}

/**
 * Posiciona un desplegable (Menu, Select, submenús) limitando su alto al espacio disponible
 * y aplica los estilos (`position: fixed`, `left/top`, `max-height`, `transform-origin`, `data-placement`).
 * @param {PositionAnchor} anchor Ancla real o virtual.
 * @param {HTMLElement} floating Superficie (en el DOM).
 * @param {PositionDropdownOptions} [options] Colocación (`bottom-start`), offset (4), padding (8)...
 * @returns {PositionDropdownResult} Resultado aplicado.
 */
export function positionDropdown(
  anchor: PositionAnchor,
  floating: HTMLElement,
  options: PositionDropdownOptions = {},
): PositionDropdownResult {
  const { placement = 'bottom-start', offset = 4, padding = 8, matchWidth = false } = options;
  const lockSide = options.lockSide && SIDES.includes(options.lockSide) ? options.lockSide : null;
  const rtl = typeof options.rtl === 'boolean' ? options.rtl : isRtl(anchor);
  const ref = anchor.getBoundingClientRect() as Rect;
  const viewport = getViewport();
  const parsed = parsePlacement(placement);
  let side = parsed.side;
  let maxHeight: number;
  const sameAxis = Boolean(
    lockSide && (lockSide === 'top' || lockSide === 'bottom') === (side === 'top' || side === 'bottom'),
  );

  if (sameAxis && lockSide) {
    side = lockSide;
    maxHeight =
      side === 'top'
        ? Math.max(0, ref.top - padding - offset)
        : side === 'bottom'
          ? Math.max(0, viewport.height - padding - ref.bottom - offset)
          : Math.max(0, viewport.height - padding * 2);
  } else if (side === 'top' || side === 'bottom') {
    const below = Math.max(0, viewport.height - padding - ref.bottom - offset);
    const above = Math.max(0, ref.top - padding - offset);
    // El alto natural se mide en el elemento que hace scroll.
    const natural = (options.content || floating).scrollHeight;
    const preferred = side === 'top' ? above : below;
    const other = side === 'top' ? below : above;
    if (natural > preferred && other > preferred) side = OPPOSITE[side];
    maxHeight = side === 'top' ? above : below;
  } else {
    // Submenú: en RTL se abre hacia la izquierda; el alto se limita al viewport.
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
    ? result.side === 'top'
      ? 'bottom'
      : 'top'
    : `${result.side === 'left' ? 'right' : 'left'} top`;
  floating.dataset.placement = result.side;
  return { x: result.x, y: result.y, placement: result.placement, side: result.side, maxHeight };
}
