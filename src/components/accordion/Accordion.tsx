'use client';
/**
 * Accordion: panel plegable con resumen pulsable (port de `accordion.js` de Materix UI vanilla).
 */
import { Children, forwardRef, isValidElement, useContext, useId, useRef, useState } from 'react';
import type {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
  SyntheticEvent,
} from 'react';
import { flushSync } from 'react-dom';
// button.css antes que accordion.css: el `> * + *` de AccordionActions debe ganar al `margin: 0` de `.mtx-button`.
import '@rubenchodev/materix-ui/components/button.css';
import '@rubenchodev/materix-ui/components/accordion.css';
import { Collapse, cx, useControlled, useEnhancedEffect, useEventCallback, useForkRef } from '../../core';
import { AccordionActions, AccordionDetails, AccordionSummary } from './AccordionParts';
import { AccordionContext, AccordionGroupContext } from './context';
import type {
  AccordionContextValue,
  AccordionElevation,
  AccordionGroupItem,
  AccordionInheritedOptions,
  AccordionSummaryStyle,
  AccordionVariant,
} from './context';

const DEFAULT_EXPAND_ICON = 'expand_more';

/**
 * Duración automática de Collapse según la altura (fórmula `getAutoHeightDuration` de MUI).
 * @param {number} height Altura a recorrer en px.
 * @returns {number} Duración en ms.
 */
export function getAutoHeightDuration(height: number): number {
  if (!height) return 0;
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

/**
 * Indica si el navegador soporta `hidden="until-found"` (búsqueda en página en paneles cerrados).
 * @returns {boolean} `true` si existe el evento `beforematch`.
 */
function supportsUntilFound(): boolean {
  return typeof document !== 'undefined' && !!document.body && 'onbeforematch' in document.body;
}

/**
 * Altura del contenido de la región, ignorando temporalmente `hidden` (que la anula).
 * @param {HTMLElement|null} region Región.
 * @returns {number} Altura en px.
 */
function measureRegion(region: HTMLElement | null): number {
  if (!region) return 0;
  const hidden = region.getAttribute('hidden');
  if (hidden !== null) region.removeAttribute('hidden');
  const height = region.scrollHeight;
  if (hidden !== null) region.setAttribute('hidden', hidden);
  return height;
}

/** Firma de `onChange`: el evento es `null` en cambios sin evento de React (búsqueda en página). */
export type AccordionChangeHandler = (event: SyntheticEvent | null, expanded: boolean) => void;

/** Props de {@link Accordion}. `className`, `style` y el resto de atributos van a la raíz. */
export interface AccordionProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Texto del resumen (sintaxis simplificada); los `children` pasan a ser los detalles. */
  summary?: ReactNode;
  /** Estado expandido (modo controlado). */
  expanded?: boolean;
  /** Estado expandido inicial (modo no controlado). */
  defaultExpanded?: boolean;
  /** Cambio de estado (clic, teclado, búsqueda en página o cierre por exclusividad). Equivale a `mtx:accordion:change`. */
  onChange?: AccordionChangeHandler;
  /** Deshabilita el panel. */
  disabled?: boolean;
  /** `elevation` (sombra, por defecto) u `outlined` (borde de 1px). Heredable del grupo. */
  variant?: AccordionVariant;
  /** Sombra `0`–`4`, `6` u `8` (sin ella se usa la elevación 1 del CSS). Heredable del grupo. */
  elevation?: AccordionElevation;
  /** Sin esquinas redondeadas. Heredable del grupo. */
  square?: boolean;
  /** Sin margen de 16px ni cambio de altura al expandir. Heredable del grupo. */
  disableGutters?: boolean;
  /** `plain`: resumen plano de MUI (peso 400, sin fondo ni divisor). Heredable del grupo. */
  summaryStyle?: AccordionSummaryStyle;
  /** Icono de expansión (nombre de Material Icons o nodo); `false` lo omite. */
  expandIcon?: ReactNode | false;
  /** Nivel de la cabecera que envuelve el resumen (`none` la omite). Solo en la forma `div`. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 'none';
  /** Activa el ripple al pulsar el resumen (MUI no lo usa por defecto). */
  ripple?: boolean;
  /** Duración del plegado en ms; `auto` la deriva de la altura (fórmula MUI). `0` = sin animación. */
  duration?: number | 'auto';
  /** `details` usa `<details>/<summary>` nativos (funciona sin JavaScript). */
  component?: 'div' | 'details';
  /** Contenido: detalles, o `AccordionSummary` + `AccordionDetails` + `AccordionActions`. */
  children?: ReactNode;
}

/**
 * Panel plegable con resumen y región animada (Accordion + AccordionSummary + AccordionDetails de MUI).
 */
export const Accordion = forwardRef<HTMLElement, AccordionProps>(function Accordion(props, ref) {
  const {
    summary,
    expanded: expandedProp,
    defaultExpanded = false,
    onChange,
    disabled = false,
    variant: variantProp,
    elevation: elevationProp,
    square: squareProp,
    disableGutters: disableGuttersProp,
    summaryStyle: summaryStyleProp,
    expandIcon = DEFAULT_EXPAND_ICON,
    headingLevel = 3,
    ripple = false,
    duration = 'auto',
    component = 'div',
    id: idProp,
    className,
    children,
    ...rest
  } = props;

  const group = useContext(AccordionGroupContext);
  const autoId = useId();
  const key = autoId;
  const baseId = idProp ?? `mtx-accordion-${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const isDetails = component === 'details';

  // Estado inicial: en un grupo exclusivo solo el primer panel abierto lo conserva.
  const [initialExpanded] = useState(() => {
    if (expandedProp !== undefined || !defaultExpanded) return defaultExpanded;
    return group?.exclusive ? group.claimInitial(key) : true;
  });
  const [expanded, setExpandedState] = useControlled({
    controlled: expandedProp,
    default: initialExpanded,
    name: 'Accordion',
    state: 'expanded',
  });

  const rootRef = useRef<HTMLElement | null>(null);
  const summaryRef = useRef<HTMLElement | null>(null);
  const regionRef = useRef<HTMLDivElement | null>(null);
  const handleRootRef = useForkRef<HTMLElement>(ref, rootRef);

  // `open`: región visible (expandida o cerrándose). Se pone a `false` al terminar la salida.
  const [open, setOpen] = useState(expanded);
  if (expanded && !open) setOpen(true);
  const openRef = useRef(open);
  openRef.current = open;
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  // Duración del cambio en curso: fija, automática según la altura o 0 (cambios instantáneos).
  const instantRef = useRef(false);
  const lastExpandedRef = useRef(expanded);
  const timeoutRef = useRef(0);
  if (lastExpandedRef.current !== expanded) {
    lastExpandedRef.current = expanded;
    if (instantRef.current) {
      timeoutRef.current = 0;
      instantRef.current = false;
    } else if (typeof duration === 'number' && Number.isFinite(duration) && duration >= 0) {
      timeoutRef.current = duration;
    } else {
      timeoutRef.current = getAutoHeightDuration(measureRegion(regionRef.current));
    }
  }

  /** Cambia el estado, notifica y cierra los demás paneles de un grupo exclusivo. */
  const change = useEventCallback((next: boolean, event: SyntheticEvent | null, instant = false) => {
    if (next === expandedRef.current) return;
    if (instant) instantRef.current = true;
    setExpandedState(next);
    onChange?.(event, next);
    if (next && group?.exclusive) group.notifyExpand(key, event);
  });

  // Registro en el grupo (exclusividad y navegación con flechas).
  useEnhancedEffect(() => {
    if (!group) return undefined;
    const item: AccordionGroupItem = {
      key,
      getSummary: () => summaryRef.current,
      isDisabled: () => disabledRef.current,
      isExpanded: () => expandedRef.current,
      setExpanded: (next, event) => change(next, event),
    };
    return group.register(item);
  }, [group, key, change]);

  // Panel cerrado encontrable con Ctrl+F (`hidden="until-found"`) en la forma `div`.
  useEnhancedEffect(() => {
    const region = regionRef.current;
    if (isDetails || !region || !supportsUntilFound()) return;
    if (open) region.removeAttribute('hidden');
    else region.setAttribute('hidden', 'until-found');
  }, [open, isDetails]);

  useEnhancedEffect(() => {
    const region = regionRef.current;
    if (isDetails || !region) return undefined;
    const handleBeforeMatch = () => flushSync(() => change(true, null, true));
    region.addEventListener('beforematch', handleBeforeMatch);
    return () => region.removeEventListener('beforematch', handleBeforeMatch);
  }, [isDetails, change]);

  const handleSummaryClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (isDetails) event.preventDefault();
    if (disabled) {
      event.preventDefault();
      return;
    }
    change(!expanded, event);
  };

  const handleSummaryKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (group && group.focusSibling(key, event.key)) event.preventDefault();
  };

  /** Sincroniza aperturas externas del `<details>` (búsqueda en página, `details.open = …`). */
  const handleToggle = (event: SyntheticEvent<HTMLElement>) => {
    const el = event.currentTarget as HTMLDetailsElement;
    if (el.open === openRef.current) return;
    change(el.open, event, true);
  };

  const groupOpts: AccordionInheritedOptions = group ?? {};
  const variant = variantProp ?? groupOpts.variant;
  const elevation = elevationProp ?? groupOpts.elevation;
  const square = squareProp ?? groupOpts.square ?? false;
  const disableGutters = disableGuttersProp ?? groupOpts.disableGutters ?? false;
  const summaryStyle = summaryStyleProp ?? groupOpts.summaryStyle;

  // Reparto de hijos: resumen, detalles y acciones (estas siempre al final de la región).
  const items = Children.toArray(children);
  const isType = (node: ReactNode, type: unknown): node is ReactElement => isValidElement(node) && node.type === type;
  const summaryChild = items.find((node) => isType(node, AccordionSummary));
  const actions = items.filter((node) => isType(node, AccordionActions));
  const others = items.filter((node) => !isType(node, AccordionSummary) && !isType(node, AccordionActions));
  const hasDetails = others.some((node) => isType(node, AccordionDetails));
  const regionContent = (
    <>
      {hasDetails ? others : <AccordionDetails>{others}</AccordionDetails>}
      {actions}
    </>
  );

  const summaryId = `${baseId}-summary`;
  const regionId = `${baseId}-region`;
  const ctx: AccordionContextValue = {
    expanded,
    disabled,
    isDetails,
    headingLevel: isDetails ? 'none' : headingLevel,
    expandIcon: expandIcon === false ? null : expandIcon,
    ripple,
    summaryId,
    regionId,
    summaryRef,
    onSummaryClick: handleSummaryClick,
    onSummaryKeyDown: handleSummaryKeyDown,
  };

  const Root = (isDetails ? 'details' : 'div') as 'div';
  const detailsProps = isDetails ? { open, onToggle: handleToggle } : {};

  return (
    <AccordionContext.Provider value={ctx}>
      <Root
        ref={handleRootRef as never}
        id={idProp}
        className={cx(
          'mtx-accordion',
          variant === 'outlined' && 'mtx-accordion--outlined',
          square && 'mtx-accordion--square',
          summaryStyle === 'plain' && 'mtx-accordion--plain-summary',
          disableGutters && 'mtx-accordion--disable-gutters',
          elevation !== undefined && `mtx-accordion--elevation-${elevation}`,
          expanded && 'mtx-accordion--expanded',
          disabled && 'mtx-accordion--disabled',
          className,
        )}
        {...detailsProps}
        {...rest}
      >
        {summaryChild ?? <AccordionSummary>{summary}</AccordionSummary>}
        <Collapse in={expanded} timeout={timeoutRef.current} onExited={() => setOpen(false)}>
          <div ref={regionRef} id={regionId} className="mtx-accordion__region" role="region" aria-labelledby={summaryId}>
            {/* Un acordeón anidado no pertenece al grupo exterior. */}
            <AccordionGroupContext.Provider value={null}>{regionContent}</AccordionGroupContext.Provider>
          </div>
        </Collapse>
      </Root>
    </AccordionContext.Provider>
  );
});
