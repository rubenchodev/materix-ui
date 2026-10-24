'use client';
/**
 * Partes del acordeón: AccordionSummary, AccordionDetails y AccordionActions.
 */
import { forwardRef } from 'react';
import type {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import { cx, useForkRef, useRipple } from '../../core';
import { useAccordionContext } from './context';

/**
 * Convierte un nombre de Material Icons en su `<span>`; otros nodos se devuelven tal cual.
 * @param {ReactNode} icon Icono.
 * @returns {ReactNode} Nodo del icono.
 */
export function renderAccordionIcon(icon: ReactNode): ReactNode {
  if (typeof icon === 'string') return <span className="material-icons">{icon}</span>;
  return icon;
}

/** Props de {@link AccordionSummary}. Los atributos nativos van al `<button>` (o `<summary>`). */
export interface AccordionSummaryProps extends HTMLAttributes<HTMLElement> {
  /** Contenido del resumen (`.mtx-accordion__summary-content`). */
  children?: ReactNode;
  /** Texto secundario tras el contenido (`.mtx-accordion__summary-secondary`). */
  secondary?: ReactNode;
  /** Icono de expansión; sustituye al del Accordion. `false` lo omite. */
  expandIcon?: ReactNode | false;
}

/**
 * Cabecera pulsable del panel: `<hN>` + `<button aria-expanded>` (o el `<summary>` nativo).
 */
export const AccordionSummary = forwardRef<HTMLElement, AccordionSummaryProps>(function AccordionSummary(props, ref) {
  const {
    children,
    secondary,
    expandIcon: expandIconProp,
    className,
    onClick,
    onKeyDown,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  } = props;
  const ctx = useAccordionContext('AccordionSummary');
  const handleRef = useForkRef<HTMLElement>(ref, ctx.summaryRef);
  const ripple = useRipple<HTMLElement>({ disabled: !ctx.ripple || ctx.disabled });
  const icon = expandIconProp === undefined ? ctx.expandIcon : expandIconProp;

  /** Encadena el manejador del usuario con el del ripple. */
  const chain =
    (own: (event: ReactPointerEvent<HTMLElement>) => void, user?: (event: ReactPointerEvent<HTMLElement>) => void) =>
    (event: ReactPointerEvent<HTMLElement>) => {
      user?.(event);
      own(event);
    };

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    onClick?.(event);
    ctx.onSummaryClick(event);
  };
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (!event.defaultPrevented) ctx.onSummaryKeyDown(event);
  };

  const content = (
    <>
      <span className="mtx-accordion__summary-content">
        {children}
        {secondary != null && secondary !== false && (
          <span className="mtx-accordion__summary-secondary">{secondary}</span>
        )}
      </span>
      {icon != null && icon !== false && (
        <span className="mtx-accordion__expand-icon" aria-hidden="true">
          {renderAccordionIcon(icon)}
        </span>
      )}
      {ripple.element}
    </>
  );

  const shared = {
    ...rest,
    ref: handleRef,
    id: ctx.summaryId,
    className: cx('mtx-accordion__summary', className),
    'aria-expanded': ctx.expanded,
    'aria-controls': ctx.regionId,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onPointerDown: chain(ripple.handlers.onPointerDown, onPointerDown),
    onPointerUp: chain(ripple.handlers.onPointerUp, onPointerUp),
    onPointerLeave: chain(ripple.handlers.onPointerLeave, onPointerLeave),
    onPointerCancel: chain(ripple.handlers.onPointerCancel, onPointerCancel),
  };

  if (ctx.isDetails) {
    return (
      <summary
        {...shared}
        aria-disabled={ctx.disabled ? true : undefined}
        tabIndex={ctx.disabled ? -1 : rest.tabIndex}
      >
        {content}
      </summary>
    );
  }

  const button = (
    <button {...shared} type="button" disabled={ctx.disabled}>
      {content}
    </button>
  );
  if (ctx.headingLevel === 'none') return button;
  const Heading = `h${ctx.headingLevel}` as 'h3';
  return <Heading className="mtx-accordion__heading">{button}</Heading>;
});

/** Props de {@link AccordionDetails}. */
export type AccordionDetailsProps = HTMLAttributes<HTMLDivElement>;

/**
 * Contenido del panel (`.mtx-accordion__details`, padding `8px 16px 16px`).
 */
export const AccordionDetails = forwardRef<HTMLDivElement, AccordionDetailsProps>(function AccordionDetails(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('mtx-accordion__details', className)} {...rest} />;
});

/** Props de {@link AccordionActions}. */
export interface AccordionActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Quita los 8px entre acciones. */
  disableSpacing?: boolean;
}

/**
 * Barra de acciones al pie del panel; dentro de un Accordion se coloca tras los detalles.
 */
export const AccordionActions = forwardRef<HTMLDivElement, AccordionActionsProps>(function AccordionActions(
  { disableSpacing = false, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('mtx-accordion-actions', disableSpacing && 'mtx-accordion-actions--disable-spacing', className)}
      {...rest}
    />
  );
});
