'use client';
import { createContext, useCallback, useContext, useId, useMemo, useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import { useControlled, useEventCallback } from '../../core';

/** Valor de una pestaña (cadena o índice). */
export type TabValue = string | number;

/** Contexto compartido por `Tabs` y `TabPanel` (TabContext de MUI Lab). */
export interface TabContextValue {
  /** Valor activo. */
  value: TabValue | null;
  /** Prefijo de ids de pestañas y paneles. */
  idPrefix: string;
  /** Cambia el valor activo (emite `onChange` del contexto). */
  setValue: (event: SyntheticEvent | null, value: TabValue) => void;
  /** Fija el valor inicial sin emitir `onChange` (pestaña por defecto elegida por `Tabs`). */
  ensureValue: (value: TabValue) => void;
  /** Valores con `TabPanel` montado (para enlazar `aria-controls` solo si existe el panel). */
  panels: ReadonlySet<string>;
  /** Registra un panel y devuelve su baja. */
  registerPanel: (value: TabValue) => () => void;
}

export const TabContextInternal = createContext<TabContextValue | null>(null);

/**
 * Contexto de pestañas activo, si lo hay.
 * @returns {TabContextValue|null} Contexto o `null` fuera de `TabContext`.
 */
export function useTabContext(): TabContextValue | null {
  return useContext(TabContextInternal);
}

/**
 * Normaliza un valor para usarlo dentro de un id.
 * @param {TabValue} value Valor.
 * @returns {string} Fragmento seguro para ids.
 */
export function idSegment(value: TabValue): string {
  return String(value).replace(/[^\w-]/g, '_');
}

/** Props de {@link TabContext}. */
export interface TabContextProps {
  /** Valor activo (modo controlado). */
  value?: TabValue | null;
  /** Valor activo inicial (modo no controlado). */
  defaultValue?: TabValue | null;
  /** Se invoca al cambiar de pestaña. */
  onChange?: (event: SyntheticEvent | null, value: TabValue) => void;
  /** Prefijo de ids (por defecto, uno único por grupo). */
  id?: string;
  children?: ReactNode;
}

/**
 * Comparte el valor activo entre `Tabs` y sus `TabPanel` y enlaza sus ids y atributos ARIA.
 * No renderiza DOM propio.
 */
export function TabContext(props: TabContextProps) {
  const { value: valueProp, defaultValue = null, onChange, id, children } = props;
  const autoId = `mtx-tabs-${useId().replace(/:/g, '')}`;
  const [value, setValueState] = useControlled<TabValue | null>({
    controlled: valueProp,
    default: defaultValue,
    name: 'TabContext',
    state: 'value',
  });
  const [panels, setPanels] = useState<ReadonlySet<string>>(() => new Set());

  const setValue = useEventCallback((event: SyntheticEvent | null, next: TabValue) => {
    setValueState(next);
    onChange?.(event, next);
  });

  const ensureValue = useEventCallback((next: TabValue) => {
    if (value == null) setValueState(next);
  });

  const registerPanel = useCallback((panelValue: TabValue) => {
    const key = String(panelValue);
    setPanels((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
    return () =>
      setPanels((prev) => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
  }, []);

  const context = useMemo<TabContextValue>(
    () => ({ value: value ?? null, idPrefix: id ?? autoId, setValue, ensureValue, panels, registerPanel }),
    [value, id, autoId, setValue, ensureValue, panels, registerPanel],
  );

  return <TabContextInternal.Provider value={context}>{children}</TabContextInternal.Provider>;
}

/** Contexto interno de `Tabs` hacia cada `Tab`. */
export interface TabsContextValue {
  value: TabValue | null;
  /** Pestaña con `tabIndex=0` (la activa o, si no es alcanzable, la primera habilitada). */
  tabStop: TabValue | null;
  idPrefix: string;
  selectionFollowsFocus: boolean;
  hasPanel: (value: TabValue) => boolean;
  select: (event: SyntheticEvent, value: TabValue) => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);
