'use client';
/**
 * AccordionGroup: grupo de acordeones, exclusivo por defecto, con navegación por flechas entre resúmenes.
 */
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import '@rubenchodev/materix-ui/components/accordion.css';
import { cx } from '../../core';
import { AccordionGroupContext } from './context';
import type {
  AccordionElevation,
  AccordionGroupContextValue,
  AccordionGroupItem,
  AccordionSummaryStyle,
  AccordionVariant,
} from './context';

const NAV_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

/** Acciones imperativas del grupo (equivalen a los métodos de `AccordionGroup` vanilla). */
export interface AccordionGroupActions {
  /** Expande todos los paneles habilitados (solo en grupos no exclusivos). */
  expandAll: () => void;
  /** Contrae todos los paneles. */
  collapseAll: () => void;
}

/** Props de {@link AccordionGroup}. */
export interface AccordionGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Solo un panel abierto a la vez (por defecto `true`). */
  exclusive?: boolean;
  /** Variante heredada por los paneles que no la declaran. */
  variant?: AccordionVariant;
  /** Elevación heredada. */
  elevation?: AccordionElevation;
  /** Esquinas rectas heredadas. */
  square?: boolean;
  /** Sin gutters al expandir (heredado). */
  disableGutters?: boolean;
  /** Estilo del resumen heredado. */
  summaryStyle?: AccordionSummaryStyle;
  /** Recibe `expandAll()` y `collapseAll()`. */
  actionRef?: Ref<AccordionGroupActions>;
}

/**
 * Ordena los paneles por su posición en el documento.
 * @param {AccordionGroupItem[]} items Paneles.
 * @returns {AccordionGroupItem[]} Paneles ordenados.
 */
function sortByDocument(items: AccordionGroupItem[]): AccordionGroupItem[] {
  return items.slice().sort((a, b) => {
    const na = a.getSummary();
    const nb = b.getSummary();
    if (!na || !nb || na === nb) return 0;
    return na.compareDocumentPosition(nb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
}

/**
 * Contenedor de acordeones: exclusividad, opciones heredadas y teclado WAI-ARIA (flechas, Home, End).
 */
export const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>(function AccordionGroup(props, ref) {
  const {
    exclusive = true,
    variant,
    elevation,
    square,
    disableGutters,
    summaryStyle,
    actionRef,
    className,
    children,
    ...rest
  } = props;

  const itemsRef = useRef(new Map<string, AccordionGroupItem>());
  const claimedRef = useRef<string | null>(null);
  const exclusiveRef = useRef(exclusive);
  exclusiveRef.current = exclusive;

  const api = useMemo(
    () => ({
      register: (item: AccordionGroupItem) => {
        itemsRef.current.set(item.key, item);
        return () => {
          if (itemsRef.current.get(item.key) === item) itemsRef.current.delete(item.key);
        };
      },
      claimInitial: (key: string) => {
        if (claimedRef.current === null || claimedRef.current === key) {
          claimedRef.current = key;
          return true;
        }
        return false;
      },
      notifyExpand: (key: string, event: Parameters<AccordionGroupItem['setExpanded']>[1]) => {
        if (!exclusiveRef.current) return;
        itemsRef.current.forEach((item) => {
          if (item.key !== key && item.isExpanded()) item.setExpanded(false, event);
        });
      },
      focusSibling: (key: string, navKey: string) => {
        if (!NAV_KEYS.includes(navKey)) return false;
        const summaries = sortByDocument(Array.from(itemsRef.current.values()))
          .filter((item) => !item.isDisabled())
          .map((item) => ({ key: item.key, node: item.getSummary() }))
          .filter((entry): entry is { key: string; node: HTMLElement } => !!entry.node);
        if (summaries.length < 2) return false;
        const index = summaries.findIndex((entry) => entry.key === key);
        let next: number;
        if (navKey === 'Home') next = 0;
        else if (navKey === 'End') next = summaries.length - 1;
        else if (navKey === 'ArrowDown') next = (index + 1) % summaries.length;
        else next = (index - 1 + summaries.length) % summaries.length;
        summaries[next].node.focus();
        return true;
      },
    }),
    [],
  );

  useImperativeHandle(
    actionRef,
    () => ({
      expandAll: () => {
        if (exclusiveRef.current) return;
        itemsRef.current.forEach((item) => {
          if (!item.isDisabled()) item.setExpanded(true, null);
        });
      },
      collapseAll: () => {
        itemsRef.current.forEach((item) => item.setExpanded(false, null));
      },
    }),
    [],
  );

  const value = useMemo<AccordionGroupContextValue>(
    () => ({ ...api, exclusive, variant, elevation, square, disableGutters, summaryStyle }),
    [api, exclusive, variant, elevation, square, disableGutters, summaryStyle],
  );

  return (
    <AccordionGroupContext.Provider value={value}>
      <div ref={ref} className={cx('mtx-accordion-group', className)} {...rest}>
        {children}
      </div>
    </AccordionGroupContext.Provider>
  );
});
