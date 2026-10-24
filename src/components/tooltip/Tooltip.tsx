'use client';
/**
 * Tooltip de Materix UI: etiqueta breve al pasar el puntero, enfocar con teclado o mantener pulsado
 * (patrón `Tooltip` de MUI, port de `tooltip.js` de Materix UI vanilla). Envuelve un único hijo.
 */
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  version,
} from 'react';
import type {
  CSSProperties,
  FocusEvent as ReactFocusEvent,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  ReactElement,
  ReactNode,
  Ref,
  SyntheticEvent,
} from 'react';
import '@rubenchodev/materix-ui/components/tooltip.css';
import {
  Portal,
  cx,
  isRtl,
  useControlled,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
  useLayer,
  usePosition,
  useTransition,
} from '../../core';
import type { Placement, PortalProps, VirtualElement } from '../../core';

/** Valores por defecto de MUI (ms y px), iguales a vanilla. */
export const TOOLTIP_DEFAULTS = {
  placement: 'bottom' as Placement,
  enterDelay: 100,
  enterNextDelay: 0,
  leaveDelay: 0,
  enterTouchDelay: 700,
  leaveTouchDelay: 1500,
  hysteresis: 800,
  offset: 14,
  touchOffset: 24,
  exitDuration: 150,
} as const;

const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]';
const LABEL_MARKER = 'data-mtx-tooltip-label';

/** Evento que abre o cierra el tooltip (`undefined` desde la API imperativa). */
export type TooltipEvent = SyntheticEvent | Event | undefined;

/** API imperativa (equivale a `Materix.tooltip.show/hide` y a la instancia vanilla). */
export interface TooltipActions {
  /** Muestra el tooltip al instante (`{ touch: true }` para el estilo táctil). */
  open: (options?: { touch?: boolean }) => void;
  /** Oculta el tooltip (`{ immediate: true }` sin transición). */
  close: (options?: { immediate?: boolean }) => void;
  /** Alterna la visibilidad. */
  toggle: () => void;
  /** Recalcula la posición. */
  update: () => void;
  /** Indica si está visible. */
  readonly isOpen: boolean;
}

/** Propiedades de {@link Tooltip}. */
export interface TooltipProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Contenido del tooltip; vacío (`''`, `null`, `false`) desactiva el tooltip. */
  title: ReactNode;
  /** Único hijo disparador; debe reenviar `ref` y los manejadores de puntero y foco. */
  children: ReactElement;
  /** Colocación preferida (`top|bottom|left|right` + `-start|-end`); voltea y se desplaza si no cabe. */
  placement?: Placement;
  /** Muestra la flecha apuntando al centro del disparador. */
  arrow?: boolean;
  /** Retardo de apertura por hover o foco (ms). */
  enterDelay?: number;
  /** Retardo de apertura si otro tooltip acaba de cerrarse (ms, histéresis de 800 ms). */
  enterNextDelay?: number;
  /** Retardo de cierre al salir el puntero (ms). */
  leaveDelay?: number;
  /** Duración de la pulsación larga táctil (ms). */
  enterTouchDelay?: number;
  /** Tiempo visible tras soltar la pulsación táctil (ms). */
  leaveTouchDelay?: number;
  /** El tooltip sigue al puntero sobre el disparador. */
  followCursor?: boolean;
  /** Visibilidad controlada. */
  open?: boolean;
  /** Solicitud de apertura (equivale a `mtx:tooltip:open`). */
  onOpen?: (event: TooltipEvent) => void;
  /** Solicitud de cierre (equivale a `mtx:tooltip:close`). */
  onClose?: (event: TooltipEvent) => void;
  /** No abre con hover. */
  disableHoverListener?: boolean;
  /** No abre con el foco de teclado. */
  disableFocusListener?: boolean;
  /** No abre con pulsación larga. */
  disableTouchListener?: boolean;
  /** El tooltip no retiene el puntero (deja de ser hoverable); implícito con `followCursor`. */
  disableInteractive?: boolean;
  /** El título describe al hijo (`aria-describedby`) en lugar de nombrarlo. */
  describeChild?: boolean;
  /** Id de la superficie (generado por defecto). */
  id?: string;
  /** API imperativa. */
  action?: Ref<TooltipActions>;
  /** Contenedor del portal (por defecto `document.body`). */
  container?: PortalProps['container'];
  /** Renderiza la superficie en su sitio, sin portal. */
  disablePortal?: boolean;
  /** Props extra de la superficie (`tooltip`) y de la flecha (`arrow`). */
  slotProps?: {
    tooltip?: HTMLAttributes<HTMLDivElement> & { [key: `data-${string}`]: string | undefined };
    arrow?: HTMLAttributes<HTMLSpanElement>;
  };
}

/* ---------- Estado global compartido (igual que vanilla) ---------- */

interface OpenEntry {
  contains: (node: Node) => boolean;
  close: (immediate: boolean) => void;
}

const openTooltips = new Set<OpenEntry>();
let hysteresisOpen = false;
let hysteresisTimer: ReturnType<typeof setTimeout> | null = null;
let keyboardModality = false;
let installed = false;

/** Instala una vez los listeners de modalidad (teclado/puntero) y el cierre táctil fuera. */
function installGlobal(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' || event.metaKey || event.altKey || event.ctrlKey) return;
      keyboardModality = true;
    },
    true,
  );
  document.addEventListener(
    'pointerdown',
    (event) => {
      keyboardModality = false;
      if (event.pointerType !== 'touch') return;
      const target = event.target as Node | null;
      Array.from(openTooltips).forEach((entry) => {
        if (!target || !entry.contains(target)) entry.close(false);
      });
    },
    true,
  );
}

/**
 * Oculta al instante todos los tooltips visibles (equivale a `Materix.tooltip.hideAll()`).
 */
export function hideAllTooltips(): void {
  Array.from(openTooltips).forEach((entry) => entry.close(true));
}

/* ---------- Nombre accesible (port de getAccessibleName de vanilla) ---------- */

/**
 * Texto visible de un elemento, sin iconos tipográficos, ripple ni nodos `aria-hidden`.
 * @param {Element} el Elemento.
 * @returns {string} Texto normalizado.
 */
function getVisibleText(el: Element): string {
  const clone = el.cloneNode(true) as Element;
  clone
    .querySelectorAll(
      '[aria-hidden="true"], .material-icons, [class*="material-symbols"], .mtx-ripple, .mtx-ripple-container, script, style',
    )
    .forEach((node) => node.remove());
  const alts = Array.from(clone.querySelectorAll('img[alt]'))
    .map((img) => img.getAttribute('alt'))
    .join(' ');
  return `${clone.textContent || ''} ${alts}`.replace(/\s+/g, ' ').trim();
}

/**
 * Nombre accesible aproximado (aria-label, aria-labelledby, label, alt, title/placeholder o texto).
 * @param {Element} el Elemento.
 * @returns {string} Nombre (vacío si no tiene).
 */
export function getAccessibleName(el: Element): string {
  const label = (el.getAttribute('aria-label') || '').trim();
  if (label) return label;
  const labelledby = (el.getAttribute('aria-labelledby') || '').trim();
  if (labelledby) {
    const doc = el.ownerDocument || document;
    const text = labelledby
      .split(/\s+/)
      .map((id) => doc.getElementById(id))
      .filter(Boolean)
      .map((node) => (node as Element).textContent?.trim() || '')
      .join(' ')
      .trim();
    if (text) return text;
  }
  const labels = (el as HTMLInputElement).labels;
  if (labels && labels.length) {
    const text = Array.from(labels)
      .map((node) => node.textContent?.trim() || '')
      .join(' ')
      .trim();
    if (text) return text;
  }
  if (el.tagName === 'IMG') return (el.getAttribute('alt') || '').trim();
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) {
    return (el.getAttribute('title') || el.getAttribute('placeholder') || '').trim();
  }
  return getVisibleText(el) || (el.getAttribute('title') || '').trim();
}

const normalizeText = (value: string): string => value.replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * Añade o quita un id de un atributo de lista de ids.
 * @param {Element} el Elemento.
 * @param {string} attr Atributo.
 * @param {string} id Identificador.
 * @param {boolean} add `true` para añadir.
 */
function toggleIdRef(el: Element, attr: string, id: string, add: boolean): void {
  const ids = (el.getAttribute(attr) || '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((value) => value !== id);
  if (add) ids.push(id);
  if (ids.length) el.setAttribute(attr, ids.join(' '));
  else el.removeAttribute(attr);
}

/**
 * Elemento que recibe los atributos ARIA: el hijo si es enfocable o su primer descendiente enfocable
 * (envoltorio `<span>` de un botón deshabilitado), como la forma avanzada de vanilla.
 * @param {HTMLElement} el Hijo disparador.
 * @returns {HTMLElement} Destino.
 */
function resolveAriaTarget(el: HTMLElement): HTMLElement {
  if (el.matches(FOCUSABLE_SELECTOR)) return el;
  return (el.querySelector(FOCUSABLE_SELECTOR) as HTMLElement | null) || el;
}

/**
 * Retira los atributos ARIA que puso el tooltip.
 * @param {HTMLElement} target Destino.
 * @param {string} id Id de la superficie.
 */
function clearAria(target: HTMLElement, id: string): void {
  toggleIdRef(target, 'aria-describedby', id, false);
  toggleIdRef(target, 'aria-labelledby', id, false);
  if (target.hasAttribute(LABEL_MARKER)) {
    target.removeAttribute('aria-label');
    target.removeAttribute(LABEL_MARKER);
  }
}

const REACT_MAJOR = Number.parseInt(version, 10);

/** Ref del elemento hijo (React 19 la expone en `props.ref`). */
function getElementRef(element: ReactElement): Ref<HTMLElement> | undefined {
  if (REACT_MAJOR >= 19) return (element.props as { ref?: Ref<HTMLElement> }).ref;
  return (element as unknown as { ref?: Ref<HTMLElement> }).ref;
}

type Timer = ReturnType<typeof setTimeout> | null;
type ChildHandlers = {
  onPointerEnter?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerDown?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel?: (event: ReactPointerEvent<HTMLElement>) => void;
  onFocus?: (event: ReactFocusEvent<HTMLElement>) => void;
  onBlur?: (event: ReactFocusEvent<HTMLElement>) => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * Tooltip MUI: hoverable, descartable con Escape y persistente (WCAG 1.4.13), con pulsación larga
 * táctil, portal a `<body>` y posicionamiento con volteo y desplazamiento.
 * El `ref` y las props no reconocidas van al hijo.
 */
export const Tooltip = forwardRef<HTMLElement, TooltipProps>(function Tooltip(props, ref) {
  const {
    title,
    children,
    placement = TOOLTIP_DEFAULTS.placement,
    arrow = false,
    enterDelay = TOOLTIP_DEFAULTS.enterDelay,
    enterNextDelay = TOOLTIP_DEFAULTS.enterNextDelay,
    leaveDelay = TOOLTIP_DEFAULTS.leaveDelay,
    enterTouchDelay = TOOLTIP_DEFAULTS.enterTouchDelay,
    leaveTouchDelay = TOOLTIP_DEFAULTS.leaveTouchDelay,
    followCursor = false,
    open: openProp,
    onOpen,
    onClose,
    disableHoverListener = false,
    disableFocusListener = false,
    disableTouchListener = false,
    disableInteractive: disableInteractiveProp = false,
    describeChild = false,
    id: idProp,
    action,
    container,
    disablePortal = false,
    slotProps,
    ...other
  } = props;

  // Con `followCursor` la superficie no puede alcanzarse: no retiene el puntero.
  const disableInteractive = disableInteractiveProp || followCursor;
  const autoId = useId();
  const id = idProp || `mtx-tooltip-${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const hasTitle = typeof title === 'number' || Boolean(title);
  const titleText = typeof title === 'string' || typeof title === 'number' ? String(title).trim() : '';

  const [openState, setOpenState] = useControlled({ controlled: openProp, default: false, name: 'Tooltip', state: 'open' });
  const open = hasTitle && openState;
  const openRef = useRef(open);
  openRef.current = open;

  const [childNode, setChildNode] = useState<HTMLElement | null>(null);
  const [popupNode, setPopupNode] = useState<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  popupRef.current = popupNode;
  const childRef = useRef<HTMLElement | null>(null);
  childRef.current = childNode;

  const [touch, setTouch] = useState(false);
  const [instantExit, setInstantExit] = useState(false);
  const [entered, setEntered] = useState(false);

  const timers = useRef<{ enter: Timer; leave: Timer; touch: Timer }>({ enter: null, leave: null, touch: null });
  const pointer = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = (name: 'enter' | 'leave' | 'touch') => {
    const timer = timers.current[name];
    if (timer) clearTimeout(timer);
    timers.current[name] = null;
  };

  useEffect(() => {
    installGlobal();
    const pending = timers.current;
    return () => {
      Object.values(pending).forEach((timer) => timer && clearTimeout(timer));
    };
  }, []);

  /** Muestra el tooltip de inmediato. */
  const handleOpen = useEventCallback((event: TooltipEvent, asTouch: boolean = false) => {
    clearTimer('enter');
    clearTimer('leave');
    if (!hasTitle) return;
    Array.from(openTooltips).forEach((entry) => {
      if (entry !== registryEntry) entry.close(true);
    });
    setTouch(asTouch);
    setInstantExit(false);
    hysteresisOpen = true;
    if (hysteresisTimer) clearTimeout(hysteresisTimer);
    hysteresisTimer = null;
    if (openRef.current) return;
    setOpenState(true);
    if (openProp === undefined) openRef.current = true;
    onOpen?.(event);
  });

  /** Oculta el tooltip (`immediate` sin transición de salida). */
  const handleClose = useEventCallback((event: TooltipEvent, immediate: boolean = false) => {
    clearTimer('enter');
    clearTimer('leave');
    if (!openRef.current) return;
    setInstantExit(immediate);
    setOpenState(false);
    if (openProp === undefined) openRef.current = false;
    if (hysteresisTimer) clearTimeout(hysteresisTimer);
    hysteresisTimer = setTimeout(() => {
      hysteresisOpen = false;
      hysteresisTimer = null;
    }, TOOLTIP_DEFAULTS.hysteresis + leaveDelay);
    onClose?.(event);
  });

  /** Programa la apertura (0 ms si otro tooltip acaba de cerrarse, como MUI). */
  const scheduleOpen = (event: TooltipEvent) => {
    clearTimer('leave');
    if (openRef.current && !closing) return;
    const delay = Math.max(0, hysteresisOpen ? enterNextDelay : enterDelay);
    clearTimer('enter');
    if (delay <= 0) handleOpen(event, false);
    else {
      const persisted = event;
      timers.current.enter = setTimeout(() => handleOpen(persisted, false), delay);
    }
  };

  /** Programa el cierre con `leaveDelay` (o el retardo indicado). */
  const scheduleClose = (event: TooltipEvent, delay = leaveDelay) => {
    clearTimer('enter');
    if (!openRef.current) return;
    clearTimer('leave');
    if (delay <= 0) handleClose(event);
    else timers.current.leave = setTimeout(() => handleClose(event), delay);
  };

  // Entrada del registro global (un solo tooltip visible y cierre táctil fuera).
  const registryEntry = useMemo<OpenEntry>(
    () => ({
      contains: (node) => Boolean(childRef.current?.contains(node) || popupRef.current?.contains(node)),
      close: (immediate) => handleClose(undefined, immediate),
    }),
    [handleClose],
  );

  useEffect(() => {
    if (!open) return undefined;
    // También al abrir por `open` controlado: solo un tooltip visible a la vez.
    Array.from(openTooltips).forEach((entry) => {
      if (entry !== registryEntry) entry.close(true);
    });
    openTooltips.add(registryEntry);
    return () => {
      openTooltips.delete(registryEntry);
    };
  }, [open, registryEntry]);

  // Montaje con transición de salida (150 ms, como vanilla).
  const { mounted } = useTransition(
    open,
    { enter: 0, exit: instantExit ? 0 : TOOLTIP_DEFAULTS.exitDuration },
    { mountOnEnter: true, unmountOnExit: true },
  );
  const closing = mounted && !open;

  // Escape cierra primero el tooltip (capa transitoria) sin afectar a menús o diálogos.
  useLayer({
    open,
    kind: 'tooltip',
    onEscape: (event) => handleClose(event),
    nodes: () => popupRef.current,
  });

  // Ancla virtual para `followCursor` (cae al disparador hasta conocer el puntero).
  const virtualAnchor = useMemo<VirtualElement>(
    () => ({
      getBoundingClientRect: () => {
        const p = pointer.current;
        if (!p) {
          const rect = childRef.current?.getBoundingClientRect();
          return rect || { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
        }
        return { top: p.y, bottom: p.y, left: p.x, right: p.x, width: 0, height: 0 };
      },
    }),
    [],
  );

  const gap = touch ? TOOLTIP_DEFAULTS.touchOffset : TOOLTIP_DEFAULTS.offset;
  const position = usePosition(followCursor ? virtualAnchor : childNode, popupNode, {
    open: mounted,
    placement,
    offset: gap,
    padding: 8,
    flip: true,
    shift: true,
    rtl: followCursor && childNode ? isRtl(childNode) : undefined,
  });

  // Reflujo forzado: la transición de entrada parte del estado inicial (opacidad 0, escala 0.75).
  useEnhancedEffect(() => {
    if (!popupNode) {
      setEntered(false);
      return;
    }
    if (open && !entered) {
      void popupNode.offsetWidth;
      setEntered(true);
    }
  }, [popupNode, open, entered]);

  // ARIA: aria-label si el disparador no tiene nombre; aria-describedby mientras es visible.
  const ariaTarget = useRef<HTMLElement | null>(null);
  useEnhancedEffect(() => {
    const target = childNode ? resolveAriaTarget(childNode) : null;
    if (ariaTarget.current && ariaTarget.current !== target) clearAria(ariaTarget.current, id);
    ariaTarget.current = target;
    if (!target) return;
    if (describeChild) {
      if (target.hasAttribute(LABEL_MARKER)) {
        target.removeAttribute('aria-label');
        target.removeAttribute(LABEL_MARKER);
      }
      toggleIdRef(target, 'aria-describedby', id, open);
      return;
    }
    if (target.hasAttribute(LABEL_MARKER)) {
      if (titleText) target.setAttribute('aria-label', titleText);
      else {
        target.removeAttribute('aria-label');
        target.removeAttribute(LABEL_MARKER);
      }
    } else if (titleText && !getAccessibleName(target)) {
      target.setAttribute('aria-label', titleText);
      target.setAttribute(LABEL_MARKER, '');
    }
    const name = getAccessibleName(target);
    if (!titleText) {
      // Título no textual: nombra al disparador sin nombre o lo describe mientras es visible.
      toggleIdRef(target, 'aria-labelledby', id, open && !name);
      toggleIdRef(target, 'aria-describedby', id, open && Boolean(name));
      return;
    }
    toggleIdRef(target, 'aria-describedby', id, open && normalizeText(name) !== normalizeText(titleText));
  });

  useEffect(
    () => () => {
      if (ariaTarget.current) clearAria(ariaTarget.current, id);
    },
    [id],
  );

  useImperativeHandle(
    action,
    () => ({
      open: (options) => handleOpen(undefined, Boolean(options?.touch)),
      close: (options) => handleClose(undefined, Boolean(options?.immediate)),
      toggle: () => (openRef.current ? handleClose(undefined) : handleOpen(undefined)),
      update: () => position.update(),
      get isOpen() {
        return openRef.current;
      },
    }),
    [handleOpen, handleClose, position],
  );

  /* ---------- Manejadores del hijo ---------- */

  const child = isValidElement(children) ? children : null;
  const childProps = (child?.props || {}) as ChildHandlers;
  const handleRef = useForkRef<HTMLElement>(child ? getElementRef(child) : undefined, setChildNode, ref);

  const isTouchEvent = (event: ReactPointerEvent) => event.pointerType === 'touch';
  const insidePopup = (node: EventTarget | null) =>
    Boolean(node && popupRef.current && node instanceof Node && popupRef.current.contains(node));
  const insideChild = (node: EventTarget | null) =>
    Boolean(node && childRef.current && node instanceof Node && childRef.current.contains(node));

  const onPointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    childProps.onPointerEnter?.(event);
    if (isTouchEvent(event) || disableHoverListener) return;
    if (followCursor) pointer.current = { x: event.clientX, y: event.clientY };
    if (insidePopup(event.relatedTarget) && (openRef.current || timers.current.enter)) {
      clearTimer('leave');
      return;
    }
    scheduleOpen(event);
  };

  const onPointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    childProps.onPointerLeave?.(event);
    if (isTouchEvent(event)) return;
    if (!disableInteractive && insidePopup(event.relatedTarget)) return;
    scheduleClose(event);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    childProps.onPointerMove?.(event);
    if (isTouchEvent(event) || !followCursor) return;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (openRef.current) position.update();
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    childProps.onPointerDown?.(event);
    if (!isTouchEvent(event) || disableTouchListener) return;
    clearTimer('touch');
    clearTimer('leave');
    timers.current.touch = setTimeout(() => {
      timers.current.touch = null;
      handleOpen(event, true);
    }, enterTouchDelay);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    (event.type === 'pointercancel' ? childProps.onPointerCancel : childProps.onPointerUp)?.(event);
    if (!isTouchEvent(event)) return;
    clearTimer('touch');
    if (openRef.current) scheduleClose(event, leaveTouchDelay);
  };

  const onFocus = (event: ReactFocusEvent<HTMLElement>) => {
    childProps.onFocus?.(event);
    if (disableFocusListener || !keyboardModality) return;
    scheduleOpen(event);
  };

  const onBlur = (event: ReactFocusEvent<HTMLElement>) => {
    childProps.onBlur?.(event);
    if (insideChild(event.relatedTarget)) return;
    handleClose(event);
  };

  /* ---------- Manejadores de la superficie (hoverable) ---------- */

  const tooltipSlot = slotProps?.tooltip || {};
  const arrowSlot = slotProps?.arrow || {};

  const onPopupPointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    tooltipSlot.onPointerEnter?.(event);
    if (isTouchEvent(event) || disableInteractive) return;
    clearTimer('leave');
    if (closing) handleOpen(event, touch);
  };

  const onPopupPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    tooltipSlot.onPointerLeave?.(event);
    if (isTouchEvent(event) || disableInteractive) return;
    if (insideChild(event.relatedTarget)) return;
    scheduleClose(event);
  };

  if (!child) return null;

  const { className: otherClassName, style: otherStyle, ...otherRest } = other;
  const clonedChild = cloneElement(child, {
    ...otherRest,
    ...(child.props as object),
    className: cx(otherClassName, childProps.className) || undefined,
    style: otherStyle || childProps.style ? { ...otherStyle, ...childProps.style } : undefined,
    ref: handleRef,
    onPointerEnter,
    onPointerLeave,
    onPointerMove,
    onPointerDown,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onFocus,
    onBlur,
  } as Record<string, unknown>);

  const side = position.side;
  const vertical = side === 'top' || side === 'bottom';
  const arrowOffset = position.arrowOffset;
  const arrowStyle: CSSProperties | undefined =
    arrowOffset === undefined
      ? arrowSlot.style
      : {
          ...(vertical ? { left: `calc(${arrowOffset}px - 0.5em)` } : { top: `calc(${arrowOffset}px - 0.5em)` }),
          ...arrowSlot.style,
        };

  const {
    className: tooltipClassName,
    style: tooltipStyle,
    onPointerEnter: _enter,
    onPointerLeave: _leave,
    ...tooltipRest
  } = tooltipSlot;
  void _enter;
  void _leave;
  const { className: arrowClassName, style: _arrowStyle, ...arrowRest } = arrowSlot;
  void _arrowStyle;

  return (
    <>
      {clonedChild}
      {mounted ? (
        <Portal container={container} disablePortal={disablePortal}>
          <div
            {...tooltipRest}
            ref={setPopupNode}
            id={id}
            role="tooltip"
            className={cx(
              'mtx-tooltip',
              open && entered && 'mtx-tooltip--open',
              arrow && 'mtx-tooltip--arrow',
              touch && 'mtx-tooltip--touch',
              tooltipClassName,
            )}
            data-side={side}
            style={
              {
                '--mtx-tooltip-gap': `${gap}px`,
                ...(disableInteractive ? { pointerEvents: 'none' } : null),
                ...tooltipStyle,
              } as CSSProperties
            }
            onPointerEnter={onPopupPointerEnter}
            onPointerLeave={onPopupPointerLeave}
          >
            <span className="mtx-tooltip__label">{title}</span>
            {arrow ? (
              <span {...arrowRest} className={cx('mtx-tooltip__arrow', arrowClassName)} aria-hidden="true" style={arrowStyle} />
            ) : null}
          </div>
        </Portal>
      ) : null}
    </>
  );
});
