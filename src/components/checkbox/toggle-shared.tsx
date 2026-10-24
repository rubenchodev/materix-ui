'use client';
/**
 * Piezas internas compartidas por Checkbox, Radio y Switch (equivalente a `wrapToggleInput`,
 * `readConfig` y `HelperTextController` de vanilla).
 */
import { useId, useRef } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { useRipple } from '../../core';
import { FormControl } from '../form-helper-text/FormControl';
import { FormControlContext, useFormControl } from '../form-helper-text/FormControlContext';
import { FormHelperText, hasContent } from '../form-helper-text/FormHelperText';

/** Colores de la paleta aceptados por los controles de selección. */
export type ToggleColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

/** Tamaños de los controles de selección. */
export type ToggleSize = 'small' | 'medium';

const COLORS: ToggleColor[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

/**
 * Clases de tamaño y color de un bloque (`mtx-{block}--small`, `mtx-{block}--{color}`; primary no añade clase).
 * @param {string} block Bloque BEM (`checkbox`, `radio`, `switch`).
 * @param {ToggleSize} [size] Tamaño.
 * @param {ToggleColor} [color] Color.
 * @returns {string[]} Clases.
 */
export function toggleModifiers(block: string, size?: ToggleSize, color?: ToggleColor): string[] {
  const classes: string[] = [];
  if (size === 'small') classes.push(`mtx-${block}--small`);
  if (color && color !== 'primary' && COLORS.includes(color)) classes.push(`mtx-${block}--${color}`);
  return classes;
}

/** Manejadores de puntero del contenedor que disparan el ripple. */
export interface ToggleRippleHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLLabelElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLLabelElement>) => void;
  onPointerLeave: (event: ReactPointerEvent<HTMLLabelElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLLabelElement>) => void;
}

/**
 * Ripple centrado en un nodo interno (caja o thumb) que se activa al pulsar el `<label>` contenedor,
 * como `createRipple(box, event, { centered, interactionTarget: element })` de vanilla.
 * @param {boolean} disabled Desactiva el efecto.
 * @returns {{targetRef: object, handlers: ToggleRippleHandlers, element: ReactNode}} Ref del nodo, manejadores y ripple.
 */
export function useToggleRipple(disabled: boolean) {
  const targetRef = useRef<HTMLSpanElement>(null);
  const ripple = useRipple<HTMLSpanElement>({ disabled, centered: true });
  const handlers: ToggleRippleHandlers = {
    onPointerDown: (event) => {
      const target = targetRef.current;
      if (!target) return;
      // useRipple mide `currentTarget`: se le pasa la caja en lugar del <label>.
      ripple.handlers.onPointerDown({
        button: event.button,
        clientX: event.clientX,
        clientY: event.clientY,
        currentTarget: target,
      } as unknown as ReactPointerEvent<HTMLSpanElement>);
    },
    onPointerUp: (event) => ripple.handlers.onPointerUp(event as unknown as ReactPointerEvent<HTMLSpanElement>),
    onPointerLeave: (event) => ripple.handlers.onPointerLeave(event as unknown as ReactPointerEvent<HTMLSpanElement>),
    onPointerCancel: (event) => ripple.handlers.onPointerCancel(event as unknown as ReactPointerEvent<HTMLSpanElement>),
  };
  return { targetRef, handlers, element: ripple.element };
}

/**
 * Combina un manejador del usuario con uno interno (primero el del usuario).
 * @param {Function} [user] Manejador del usuario.
 * @param {Function} own Manejador interno.
 * @returns {Function} Manejador combinado.
 */
export function chain<E>(user: ((event: E) => void) | undefined, own: (event: E) => void) {
  return (event: E) => {
    user?.(event);
    own(event);
  };
}

/** Opciones de {@link useHelperField}. */
export interface HelperFieldOptions {
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  helperText?: ReactNode;
  describedBy?: string;
  /** El control ocupa todo el ancho: el contenedor (con texto o label) también se estira. */
  fullWidth?: boolean;
}

/** Contenedor sin caja: no altera el layout respecto a vanilla mientras no hay texto ni label. */
const CONTENTS_STYLE: CSSProperties = { display: 'contents' };
/** Contenedor a todo el ancho para controles `fullWidth`. */
const FULL_WIDTH_STYLE: CSSProperties = { display: 'flex', width: '100%' };

/**
 * Resuelve `error`/`disabled`/`required` (props o FormControl), `aria-describedby` y envuelve el control
 * en un `.mtx-form-control` estable con su FormHelperText (HelperTextController de vanilla).
 * @param {HelperFieldOptions} options Estado propio del control.
 * @returns {object} Estado resuelto y función `wrap`.
 */
export function useHelperField({
  error: errorProp,
  disabled: disabledProp,
  required: requiredProp,
  helperText,
  describedBy,
  fullWidth = false,
}: HelperFieldOptions) {
  const formControl = useFormControl();
  const autoId = useId();
  const helperId = `mtx-form-helper-text-${autoId.replace(/:/g, '')}`;
  const error = errorProp ?? formControl?.error ?? false;
  const disabled = disabledProp ?? formControl?.disabled ?? false;
  const required = requiredProp ?? formControl?.required ?? false;
  const filled = hasContent(helperText);

  // Con helper propio no se enlazan los del FormControl; los helpers propios de cada control no se
  // registran en el contexto, así que `helperTextIds` solo contiene los de nivel FormControl.
  const ids = [
    ...(describedBy ?? '').split(/\s+/),
    filled ? helperId : '',
    ...(filled ? [] : (formControl?.helperTextIds ?? [])),
  ].filter(Boolean);
  const ariaDescribedBy = ids.length ? Array.from(new Set(ids)).join(' ') : undefined;

  /**
   * Coloca el control junto a su texto de ayuda. El árbol es siempre el mismo (con o sin texto) para que
   * el control no se remonte ni pierda el foco al cambiar `helperText`: dentro de un FormControl externo,
   * fragmento con hermanos; si no, un `.mtx-form-control` propio permanente. Sin texto no se renderiza el `<p>`.
   * @param {ReactNode} control Control renderizado.
   * @param {ReactNode} [leading] Nodo previo al control (FormLabel de RadioGroup).
   * @returns {ReactNode} Control con su texto de ayuda.
   */
  const wrap = (control: ReactNode, leading?: ReactNode): ReactNode => {
    // El helper propio no se registra en ningún FormControl: no debe describir a otros controles.
    const helper = filled ? (
      <FormControlContext.Provider value={undefined}>
        <FormHelperText id={helperId} error={error} aria-disabled={disabled ? true : undefined}>
          {helperText}
        </FormHelperText>
      </FormControlContext.Provider>
    ) : null;
    if (formControl) {
      return (
        <>
          {leading}
          {control}
          {helper}
        </>
      );
    }
    // Sin texto ni label el contenedor es `display: contents` (mismo layout que vanilla, sin wrapper);
    // con contenido es el `.mtx-form-control` de vanilla, estirado si el control es fullWidth.
    const boxless = !filled && !leading;
    const style = boxless ? CONTENTS_STYLE : fullWidth ? FULL_WIDTH_STYLE : undefined;
    return (
      <FormControl error={error} disabled={disabled} style={style}>
        {leading}
        {control}
        {helper}
      </FormControl>
    );
  };

  return { error, disabled, required, ariaDescribedBy, wrap, formControl };
}
