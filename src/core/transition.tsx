'use client';
/**
 * Transiciones de entrada/salida estilo MUI (port de `core/transition.js`): `Fade`, `Collapse` y `Grow`
 * más el hook `useTransition`. 225 ms por defecto, cancelación al invertir `in`, `Collapse` termina
 * en `height: auto` y con `prefers-reduced-motion` se aplica directamente el estado final.
 */
import { Children, cloneElement, isValidElement, useRef, useState, version } from 'react';
import type { CSSProperties, ReactElement, Ref } from 'react';
import { prefersReducedMotion } from './dom';
import { useEnhancedEffect, useEventCallback, useForkRef } from './hooks';

export const EASING_ENTER = 'cubic-bezier(0, 0, 0.2, 1)';
export const EASING_EXIT = 'cubic-bezier(0.4, 0, 1, 1)';
export const EASING_STANDARD = 'cubic-bezier(0.4, 0, 0.2, 1)';
/** Duración por defecto (ms). */
export const TRANSITION_DURATION = 225;

/** Fase de la transición. */
export type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited';

/** Duración en ms, común o por fase. */
export type TransitionTimeout = number | { enter?: number; exit?: number };

/** Opciones de `useTransition`. */
export interface UseTransitionOptions {
  /** Anima también el montaje inicial con `in`. */
  appear?: boolean;
  /** Desmonta el contenido al terminar la salida. */
  unmountOnExit?: boolean;
  /** No monta el contenido hasta la primera entrada. */
  mountOnEnter?: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
}

/** Resultado de `useTransition`. */
export interface UseTransitionResult {
  status: TransitionStatus;
  /** Indica si el contenido debe estar montado. */
  mounted: boolean;
}

/**
 * Resuelve la duración de una fase.
 * @param {TransitionTimeout} timeout Duración.
 * @param {'enter'|'exit'} phase Fase.
 * @returns {number} Milisegundos.
 */
export function getTimeout(timeout: TransitionTimeout | undefined, phase: 'enter' | 'exit'): number {
  if (typeof timeout === 'number') return timeout;
  return timeout?.[phase] ?? TRANSITION_DURATION;
}

/**
 * Máquina de estados de una transición (sin estilos): `entering → entered`, `exiting → exited`.
 * Invertir `in` en mitad de una fase cancela la anterior.
 * @param {boolean} inProp Mostrar u ocultar.
 * @param {TransitionTimeout} [timeout=225] Duración.
 * @param {UseTransitionOptions} [options] Montaje y callbacks.
 * @returns {UseTransitionResult} Fase actual y si hay que montar el contenido.
 */
export function useTransition(
  inProp: boolean,
  timeout: TransitionTimeout = TRANSITION_DURATION,
  options: UseTransitionOptions = {},
): UseTransitionResult {
  const { appear = false, unmountOnExit = false, mountOnEnter = false } = options;
  const [status, setStatus] = useState<TransitionStatus>(() => (inProp && !appear ? 'entered' : 'exited'));
  const [mounted, setMounted] = useState(() => inProp || !(unmountOnExit || mountOnEnter));
  const callbacks = useRef(options);
  callbacks.current = options;
  const timeoutRef = useRef(timeout);
  timeoutRef.current = timeout;
  const unmountRef = useRef(unmountOnExit);
  unmountRef.current = unmountOnExit;
  /** Último valor de `in` procesado (`null` fuerza la animación de aparición). */
  const handled = useRef<boolean | null>(inProp && appear ? null : inProp);

  useEnhancedEffect(() => {
    if (handled.current === inProp) return undefined;
    handled.current = inProp;
    const cb = callbacks.current;
    const duration = getTimeout(timeoutRef.current, inProp ? 'enter' : 'exit');
    const instant = duration <= 0 || prefersReducedMotion();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const complete = () => {
      timer = null;
      if (inProp) {
        setStatus('entered');
        callbacks.current.onEntered?.();
      } else {
        setStatus('exited');
        if (unmountRef.current) setMounted(false);
        callbacks.current.onExited?.();
      }
    };

    if (inProp) {
      setMounted(true);
      cb.onEnter?.();
      if (instant) complete();
      else {
        setStatus('entering');
        timer = setTimeout(complete, duration);
      }
    } else {
      cb.onExit?.();
      if (instant) complete();
      else {
        setStatus('exiting');
        timer = setTimeout(complete, duration);
      }
    }
    return () => {
      // Fase interrumpida (cambio de `in` o desmontaje en StrictMode): se podrá relanzar.
      if (timer !== null) {
        clearTimeout(timer);
        handled.current = null;
      }
    };
  }, [inProp]);

  return { status, mounted };
}

/** Pasos imperativos de una transición sobre el nodo. */
interface TransitionSpec {
  /** Estado inicial (síncrono, antes del frame). */
  prepare: (el: HTMLElement, inValue: boolean, interrupted: boolean, duration: number) => void;
  /** Estado final (en el siguiente frame o directo sin animación). */
  animate: (el: HTMLElement, inValue: boolean) => void;
  /** Ajustes al terminar. */
  done?: (el: HTMLElement, inValue: boolean) => void;
  /** Estilos en línea con la fase `exited`. */
  exitedStyle: CSSProperties;
  /** Estilos en línea en las fases distintas de `entered`. */
  activeStyle?: CSSProperties;
}

/** Props comunes de las transiciones. */
export interface TransitionProps {
  /** Muestra (`true`) u oculta el hijo. */
  in?: boolean;
  timeout?: TransitionTimeout;
  appear?: boolean;
  unmountOnExit?: boolean;
  mountOnEnter?: boolean;
  onEnter?: (node: HTMLElement | null) => void;
  onEntered?: (node: HTMLElement | null) => void;
  onExit?: (node: HTMLElement | null) => void;
  onExited?: (node: HTMLElement | null) => void;
  /** Único hijo: debe aceptar `ref` y `style`. */
  children: ReactElement;
}

const REACT_MAJOR = Number.parseInt(version, 10);

/** Ref del elemento hijo (React 19 la expone en `props.ref`). */
function getElementRef(element: ReactElement): Ref<HTMLElement> | undefined {
  if (REACT_MAJOR >= 19) return (element.props as { ref?: Ref<HTMLElement> }).ref;
  return (element as unknown as { ref?: Ref<HTMLElement> }).ref;
}

function applyStyle(el: HTMLElement, style: Record<string, string>): void {
  Object.entries(style).forEach(([key, value]) => {
    (el.style as unknown as Record<string, string>)[key] = value;
  });
}

/** Motor común: clona el hijo con `ref` y estilos y aplica los pasos de `spec` en cada fase. */
function TransitionBase({
  spec,
  in: inProp = false,
  timeout = TRANSITION_DURATION,
  appear = false,
  unmountOnExit = false,
  mountOnEnter = false,
  onEnter,
  onEntered,
  onExit,
  onExited,
  children,
}: TransitionProps & { spec: TransitionSpec }) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const child = Children.only(children);
  const handleRef = useForkRef(nodeRef, isValidElement(child) ? getElementRef(child) : undefined);
  const node = () => nodeRef.current;
  const { status, mounted } = useTransition(inProp, timeout, {
    appear,
    unmountOnExit,
    mountOnEnter,
    onEnter: useEventCallback(() => onEnter?.(node())),
    onEntered: useEventCallback(() => onEntered?.(node())),
    onExit: useEventCallback(() => onExit?.(node())),
    onExited: useEventCallback(() => onExited?.(node())),
  });
  const prevStatus = useRef(status);

  useEnhancedEffect(() => {
    const prev = prevStatus.current;
    prevStatus.current = status;
    const el = nodeRef.current;
    if (!el || prev === status) return undefined;
    if (status === 'entering' || status === 'exiting') {
      const inValue = status === 'entering';
      const interrupted = prev === 'entering' || prev === 'exiting';
      spec.prepare(el, inValue, interrupted, getTimeout(timeout, inValue ? 'enter' : 'exit'));
      if (typeof requestAnimationFrame !== 'function') {
        spec.animate(el, inValue);
        return undefined;
      }
      const frame = requestAnimationFrame(() => spec.animate(el, inValue));
      return () => cancelAnimationFrame(frame);
    }
    const inValue = status === 'entered';
    if (prev !== (inValue ? 'entering' : 'exiting')) {
      // Sin animación (movimiento reducido o duración 0): estado final directo.
      el.style.transition = '';
      spec.animate(el, inValue);
    }
    spec.done?.(el, inValue);
    return undefined;
  }, [status]);

  if (!mounted || !isValidElement(child)) return null;
  const childStyle = (child.props as { style?: CSSProperties }).style;
  const style: CSSProperties = {
    ...childStyle,
    ...(status !== 'entered' ? spec.activeStyle : undefined),
    ...(status === 'exited' ? spec.exitedStyle : undefined),
  };
  return cloneElement(child as ReactElement<{ style?: CSSProperties; ref?: Ref<HTMLElement> }>, {
    style,
    ref: handleRef ?? undefined,
  });
}

/** Spec de `Fade`: opacidad. */
const fadeSpec: TransitionSpec = {
  prepare: (el, inValue, interrupted, duration) => {
    // Interrumpida otra transición, se parte de la opacidad actual.
    if (!interrupted) el.style.opacity = inValue ? '0' : '1';
    el.style.transition = `opacity ${duration}ms ${inValue ? EASING_ENTER : EASING_EXIT}`;
  },
  animate: (el, inValue) => {
    el.style.opacity = inValue ? '1' : '0';
  },
  exitedStyle: { opacity: 0, visibility: 'hidden' },
};

/**
 * Transición de opacidad (equivalente a `Fade` de MUI).
 * @param {TransitionProps} props Props de transición.
 * @returns {ReactElement|null} Hijo clonado.
 */
export function Fade(props: TransitionProps) {
  return <TransitionBase {...props} spec={fadeSpec} />;
}

/** Alto mínimo natural del elemento (sin el valor en línea aplicado por la transición). */
function naturalMinHeight(el: HTMLElement): string {
  const inline = el.style.minHeight;
  el.style.minHeight = '';
  const value = getComputedStyle(el).minHeight || '0px';
  el.style.minHeight = inline;
  return value;
}

/** Spec de `Collapse`: altura. */
const collapseSpec: TransitionSpec = {
  prepare: (el, inValue, interrupted, duration) => {
    const minHeight = naturalMinHeight(el);
    if (inValue) {
      // Interrumpida una salida, se parte de la altura actual en lugar de 0.
      const start = interrupted ? `${el.getBoundingClientRect().height}px` : '0px';
      applyStyle(el, { height: start, minHeight: '0px' });
    } else {
      const current = interrupted ? el.getBoundingClientRect().height : el.scrollHeight;
      applyStyle(el, { height: `${current}px`, minHeight });
    }
    el.style.transition = `height ${duration}ms ${inValue ? EASING_STANDARD : EASING_EXIT}`;
  },
  animate: (el, inValue) => {
    if (inValue) applyStyle(el, { height: `${el.scrollHeight}px`, minHeight: naturalMinHeight(el) });
    else applyStyle(el, { height: '0px', minHeight: '0px' });
  },
  done: (el, inValue) => {
    if (inValue) el.style.height = 'auto';
  },
  exitedStyle: { height: '0px', visibility: 'hidden' },
  activeStyle: { overflow: 'hidden' },
};

/**
 * Plegado/desplegado de altura (equivalente a `Collapse` de MUI); al entrar queda en `height: auto`.
 * @param {TransitionProps} props Props de transición.
 * @returns {ReactElement|null} Hijo clonado.
 */
export function Collapse(props: TransitionProps) {
  return <TransitionBase {...props} spec={collapseSpec} />;
}

/** Props de `Grow`. */
export interface GrowProps extends TransitionProps {
  /** Origen de la escala; sin él se respeta el actual (p. ej. el que fija `usePosition`). */
  transformOrigin?: string;
}

const GROW_HIDDEN = { transform: 'scale(0.6, 0)', opacity: '0' };
const GROW_SHOWN = { transform: 'scale(1, 1)', opacity: '1' };

/**
 * Escala de 0 a 1 con opacidad (equivalente a `Grow` de MUI).
 * @param {GrowProps} props Props de transición y `transformOrigin`.
 * @returns {ReactElement|null} Hijo clonado.
 */
export function Grow({ transformOrigin, ...props }: GrowProps) {
  const originRef = useRef(transformOrigin);
  originRef.current = transformOrigin;
  const [spec] = useState<TransitionSpec>(() => ({
    prepare: (el, inValue, interrupted, duration) => {
      if (originRef.current) el.style.transformOrigin = originRef.current;
      const cubic = inValue ? EASING_ENTER : EASING_EXIT;
      el.style.transition = `transform ${duration}ms ${cubic}, opacity ${duration}ms ${cubic}`;
      if (!interrupted) applyStyle(el, inValue ? GROW_HIDDEN : GROW_SHOWN);
    },
    animate: (el, inValue) => applyStyle(el, inValue ? GROW_SHOWN : GROW_HIDDEN),
    exitedStyle: { transform: 'scale(0.6, 0)', opacity: 0, visibility: 'hidden' },
  }));
  return <TransitionBase {...props} spec={spec} />;
}
