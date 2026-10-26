"use client";
import {
  Children,
  cloneElement,
  Fragment,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactElement,
  ReactNode,
  SyntheticEvent,
} from "react";
import "@rubenchodev/materix-ui/components/tabs.css";
import {
  cx,
  isDev,
  isRtl,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
} from "../../core";
import { TabsContext, useTabContext } from "./TabContext";
import type { TabValue, TabsContextValue } from "./TabContext";

/** Orientación de la barra de pestañas. */
export type TabsOrientation = "horizontal" | "vertical";
/** Variante: ancho natural (`standard`) o repartido (`fullWidth`). */
export type TabsVariant = "standard" | "fullWidth";

/** Props de {@link Tabs}. `className`, `style` y el resto de atributos van al `role="tablist"`. */
export interface TabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Valor activo (modo controlado). Dentro de `TabContext` se toma del contexto. */
  value?: TabValue | null;
  /** Valor inicial (modo no controlado). Por defecto, la primera pestaña habilitada. */
  defaultValue?: TabValue | null;
  /** Se invoca tras cambiar de pestaña (`mtx:tabs:change` en vanilla). */
  onChange?: (event: SyntheticEvent, value: TabValue) => void;
  /** Se invoca antes del cambio; si devuelve `false`, lo cancela (`mtx:tabs:before-change`). */
  onBeforeChange?: (
    value: TabValue,
    previousValue: TabValue | null,
  ) => boolean | void;
  /** Orientación (`horizontal` por defecto); fija `aria-orientation` y las flechas de navegación. */
  orientation?: TabsOrientation;
  /** `fullWidth` reparte el ancho entre las pestañas (`mtx-tabs--full`). */
  variant?: TabsVariant;
  /** Centra las pestañas. */
  centered?: boolean;
  /** Activa la pestaña al moverse con las flechas (activación automática). */
  selectionFollowsFocus?: boolean;
}

interface ChildInfo {
  value: TabValue;
  disabled: boolean;
}

/**
 * Barra de pestañas (Tabs de MUI) con indicador animado, roving tabindex y teclado WAI-ARIA.
 * Cada hijo `Tab` sin `value` recibe su índice.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  function Tabs(props, ref) {
    const {
      value: valueProp,
      defaultValue = null,
      onChange,
      onBeforeChange,
      orientation = "horizontal",
      variant = "standard",
      centered = false,
      selectionFollowsFocus = false,
      className,
      children,
      onKeyDown,
      id,
      ...rest
    } = props;

    const tabContext = useTabContext();
    const autoId = `mtx-tabs-${useId().replace(/:/g, "")}`;
    const idPrefix = tabContext?.idPrefix ?? id ?? autoId;
    const [internalValue, setInternalValue] = useState<TabValue | null>(
      defaultValue,
    );
    const rootRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLSpanElement>(null);
    const handleRef = useForkRef(rootRef, ref);

    // Hijos: se inyecta el índice como `value` y se anotan los valores para elegir la pestaña por defecto.
    const infos: ChildInfo[] = [];
    let childIndex = 0;
    const items = flattenFragments(children).map((child) => {
      if (!isValidElement(child)) return child;
      const element = child as ReactElement<{
        value?: TabValue;
        disabled?: boolean;
      }>;
      const value = element.props.value ?? childIndex;
      childIndex += 1;
      infos.push({ value, disabled: !!element.props.disabled });
      return element.props.value === undefined
        ? cloneElement(element, { value })
        : element;
    });

    const isControlled = valueProp !== undefined;
    const requested = isControlled
      ? valueProp
      : tabContext
        ? tabContext.value
        : internalValue;
    const fallback = infos.find((info) => !info.disabled)?.value ?? null;
    const current: TabValue | null = requested ?? fallback;
    // Si el valor no corresponde a una pestaña habilitada, la primera habilitada mantiene el tablist alcanzable.
    const tabStop = infos.some(
      (info) => !info.disabled && info.value === current,
    )
      ? current
      : fallback;

    // Dentro de TabContext, un `value` propio se refleja en el contexto para que los paneles lo sigan.
    const syncValue = tabContext?.syncValue;
    useEnhancedEffect(() => {
      if (!syncValue || !isControlled) return undefined;
      syncValue(valueProp);
      return () => syncValue(undefined);
    }, [syncValue, isControlled, valueProp]);

    useEffect(() => {
      if (isDev && tabContext && defaultValue != null) {
        console.warn(
          "Materix: Tabs ignora `defaultValue` dentro de TabContext; usa `defaultValue` en TabContext.",
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Dentro de TabContext sin valor inicial, la pestaña por defecto también activa su panel.
    const ensureValue = tabContext?.ensureValue;
    useEnhancedEffect(() => {
      if (ensureValue && !isControlled && requested == null && fallback != null)
        ensureValue(fallback);
    }, [ensureValue, isControlled, requested, fallback]);

    const select = useEventCallback((event: SyntheticEvent, next: TabValue) => {
      if (next === current) return;
      if (onBeforeChange?.(next, current) === false) return;
      if (tabContext) tabContext.setValue(event, next);
      else if (!isControlled) setInternalValue(next);
      onChange?.(event, next);
    });

    const panels = tabContext?.panels;
    const hasPanel = useCallback(
      (value: TabValue) => !!panels?.has(String(value)),
      [panels],
    );
    const context = useMemo<TabsContextValue>(
      () => ({
        value: current,
        tabStop,
        idPrefix,
        selectionFollowsFocus,
        hasPanel,
        select,
      }),
      [current, tabStop, idPrefix, selectionFollowsFocus, hasPanel, select],
    );

    /** Coloca el indicador bajo (o junto a) la pestaña activa. */
    const updateIndicator = useCallback(() => {
      const root = rootRef.current;
      const indicator = indicatorRef.current;
      if (!root || !indicator) return;
      const tabs = getTabs(root);
      const active =
        tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ??
        tabs[0];
      if (!active) return;
      if (orientation === "vertical") {
        indicator.style.height = `${active.offsetHeight}px`;
        indicator.style.width = "";
        indicator.style.transform = `translateY(${active.offsetTop}px)`;
      } else {
        indicator.style.width = `${active.offsetWidth}px`;
        indicator.style.height = "";
        indicator.style.transform = `translateX(${active.offsetLeft}px)`;
      }
    }, [orientation]);

    const observerRef = useRef<ResizeObserver | null>(null);
    const observedRef = useRef<HTMLElement[]>([]);

    // Medición tras cada render (cambio de pestaña, etiquetas, variante…) y re-observación si cambian los nodos.
    useEnhancedEffect(() => {
      updateIndicator();
      const root = rootRef.current;
      const observer = observerRef.current;
      if (!root || !observer) return;
      const tabs = getTabs(root);
      const previous = observedRef.current;
      if (
        tabs.length === previous.length &&
        tabs.every((tab, i) => tab === previous[i])
      )
        return;
      observer.disconnect();
      observer.observe(root);
      tabs.forEach((tab) => observer.observe(tab));
      observedRef.current = tabs;
    });

    useEffect(() => {
      const root = rootRef.current;
      if (!root) return undefined;
      const view = root.ownerDocument.defaultView ?? window;
      view.addEventListener("resize", updateIndicator);
      view.addEventListener("load", updateIndicator);
      let cancelled = false;
      root.ownerDocument.fonts?.ready?.then(() => {
        if (!cancelled) updateIndicator();
      });
      let observer: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(() => updateIndicator());
        observer.observe(root);
        const tabs = getTabs(root);
        tabs.forEach((tab) => observer!.observe(tab));
        observerRef.current = observer;
        observedRef.current = tabs;
      }
      return () => {
        cancelled = true;
        view.removeEventListener("resize", updateIndicator);
        view.removeEventListener("load", updateIndicator);
        observer?.disconnect();
        observerRef.current = null;
        observedRef.current = [];
      };
    }, [updateIndicator]);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      const root = rootRef.current;
      const tab = (event.target as HTMLElement).closest<HTMLElement>(
        '[role="tab"]',
      );
      if (event.defaultPrevented || !root || !tab || !root.contains(tab))
        return;
      const enabled = getTabs(root).filter((item) => !isTabDisabled(item));
      if (!enabled.length) return;
      const index = enabled.indexOf(tab);
      const vertical = orientation === "vertical";
      const rtl = !vertical && isRtl(root);
      const nextKey = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
      const previousKey = vertical
        ? "ArrowUp"
        : rtl
          ? "ArrowRight"
          : "ArrowLeft";
      let target: HTMLElement | undefined;
      if (event.key === nextKey) target = enabled[(index + 1) % enabled.length];
      else if (event.key === previousKey)
        target = enabled[(index - 1 + enabled.length) % enabled.length];
      else if (event.key === "Home") target = enabled[0];
      else if (event.key === "End") target = enabled[enabled.length - 1];
      if (!target) return;
      event.preventDefault();
      // Con `selectionFollowsFocus`, el `onFocus` de la pestaña la activa.
      target.focus();
    };

    return (
      <TabsContext.Provider value={context}>
        <div
          ref={handleRef}
          id={id}
          className={cx(
            "mtx-tabs",
            orientation === "vertical" && "mtx-tabs--vertical",
            variant === "fullWidth" && "mtx-tabs--full",
            centered && "mtx-tabs--centered",
            className,
          )}
          role="tablist"
          aria-orientation={orientation}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {items}
          <span ref={indicatorRef} className="mtx-tabs__indicator" />
        </div>
      </TabsContext.Provider>
    );
  },
);

/**
 * Aplana los `Fragment` para que sus `Tab` cuenten como hijos directos.
 * @param {ReactNode} children Hijos.
 * @returns {ReactNode[]} Hijos aplanados con claves estables.
 */
function flattenFragments(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement(child) && child.type === Fragment
      ? flattenFragments(
          (child.props as { children?: ReactNode }).children,
        ).map((inner) =>
          isValidElement(inner)
            ? cloneElement(inner, { key: `${child.key}${inner.key}` })
            : inner,
        )
      : [child],
  );
}

/**
 * Pestañas propias del tablist (excluye grupos anidados).
 * @param {HTMLElement} root Tablist.
 * @returns {HTMLElement[]} Pestañas en orden de documento.
 */
function getTabs(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[role="tab"]')).filter(
    (tab) => tab.closest('[role="tablist"]') === root,
  );
}

/**
 * @param {HTMLElement} tab Pestaña.
 * @returns {boolean} `true` si está deshabilitada.
 */
function isTabDisabled(tab: HTMLElement): boolean {
  return (
    tab.getAttribute("aria-disabled") === "true" ||
    (tab as HTMLButtonElement).disabled === true
  );
}
