'use client';
/**
 * Ruta de navegación (`Breadcrumbs` de MUI): `<nav>` + `<ol>`, separadores ocultos al lector de
 * pantalla, último ítem con `aria-current="page"` y colapso con botón "Mostrar ruta".
 */
import { Children, cloneElement, forwardRef, isValidElement, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, MouseEvent, ReactElement, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/link.css';
import '@rubenchodev/materix-ui/components/typography.css';
import '@rubenchodev/materix-ui/components/breadcrumbs.css';
import { cx, useForkRef } from '../../core';
import { useT } from '../../i18n';
import { Link } from '../link';
import type { TypographyVariant } from '../typography';

/** Nombre de icono Material: minúsculas, dígitos y guion bajo (3+ caracteres). */
const ICON_NAME_PATTERN = /^[a-z][a-z0-9_]{2,}$/;

/** Ítem declarativo de {@link Breadcrumbs} (`items`), equivalente a `setItems()` de vanilla. */
export interface BreadcrumbItem {
  /** Texto del ítem. */
  label: ReactNode;
  /** URL: renderiza un Link `<a>`. Sin ella (y sin ser la página actual) se renderiza un Link `<button>`. */
  href?: string;
  /** Icono decorativo antes del texto: nombre de Material Icons o un nodo. */
  icon?: ReactNode;
  /** Página actual (`aria-current="page"`). Si ningún ítem lo indica, lo es el último. */
  current?: boolean;
  /** Deshabilita el enlace del ítem. */
  disabled?: boolean;
  /** Datos copiados a atributos `data-*` y devueltos en `onNavigate`. */
  data?: Record<string, string | number | boolean | null | undefined>;
  /** Clave de React (por defecto, el índice). */
  key?: string | number;
}

/** Datos de la navegación que recibe `onNavigate` (detail de `mtx:breadcrumbs:navigate`). */
export interface BreadcrumbsNavigateDetail {
  /** Índice del ítem en la ruta completa. */
  index: number;
  /** `href` del enlace o `null` si es un botón. */
  href: string | null;
  /** Texto del ítem (sin el icono). */
  label: string;
  /** `true` si es la página actual. */
  current: boolean;
  /** Ítem original de `items` o, con `children`, sus datos leídos del DOM. */
  item: BreadcrumbItem;
}

/** Props de {@link Breadcrumbs}. El resto de atributos va al `<nav>` raíz. */
export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Ítems declarativos; si se indica, prevalece sobre `children`. */
  items?: BreadcrumbItem[];
  /** Separador: texto (por defecto `/`), nombre de icono Material o un nodo. */
  separator?: ReactNode;
  /** Máximo de ítems visibles antes de colapsar (por defecto 8; `0` desactiva el colapso). */
  maxItems?: number;
  /** Ítems visibles antes del botón de colapso (por defecto 1). */
  itemsBeforeCollapse?: number;
  /** Ítems visibles después del botón de colapso (por defecto 1). */
  itemsAfterCollapse?: number;
  /** Nombre accesible del botón de colapso; por defecto i18n `breadcrumbs.showPath`. */
  expandText?: string;
  /** Ruta expandida (modo controlado). */
  expanded?: boolean;
  /** Se invoca al revelar los ítems colapsados (equivale a `mtx:breadcrumbs:expand`). */
  onExpand?: () => void;
  /**
   * Se invoca al activar un enlace o botón de la ruta (equivale a `mtx:breadcrumbs:navigate`).
   * Devolver `false` o llamar a `event.preventDefault()` cancela la navegación nativa.
   */
  onNavigate?: (event: MouseEvent<HTMLElement>, detail: BreadcrumbsNavigateDetail) => boolean | void;
  /** Escala tipográfica de la ruta (por defecto `body1`, como MUI); p. ej. `body2` para una ruta compacta. */
  variant?: TypographyVariant;
  /** Idioma de los textos propios (prevalece sobre el `I18nProvider`). */
  locale?: string;
}

/** Entrada normalizada de la ruta. */
interface Entry {
  key: string | number;
  node: ReactElement;
  icon: ReactNode;
  item?: BreadcrumbItem;
}

/** Icono MoreHoriz de MUI (24×16) del botón de colapso. */
const MORE_HORIZ = (
  <svg className="mtx-breadcrumbs__collapse-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

/**
 * Indica si un nodo tiene contenido visible.
 * @param {ReactNode} node Nodo.
 * @returns {boolean} `true` si no es vacío.
 */
const hasNode = (node: ReactNode): boolean => node !== undefined && node !== null && node !== false && node !== '';

/**
 * Renderiza el icono decorativo de un ítem.
 * @param {ReactNode} icon Nombre de Material Icons o nodo.
 * @returns {ReactNode} Icono con `aria-hidden`.
 */
function renderIcon(icon: ReactNode): ReactNode {
  if (!hasNode(icon)) return null;
  const isName = typeof icon === 'string';
  return (
    <span className={cx('mtx-breadcrumbs__icon', isName && 'material-icons')} aria-hidden="true">
      {isName ? icon.trim() : icon}
    </span>
  );
}

/**
 * Lee un entero no negativo.
 * @param {number | undefined} value Valor recibido.
 * @param {number} fallback Valor por defecto.
 * @returns {number} Entero válido.
 */
function toCount(value: number | undefined, fallback: number): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * Convierte `data` en atributos `data-*`.
 * @param {BreadcrumbItem['data']} data Datos del ítem.
 * @returns {Record<string, string>} Atributos.
 */
function dataAttributes(data: BreadcrumbItem['data']): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (!data || typeof data !== 'object') return attrs;
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    attrs[`data-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`] = String(value);
  });
  return attrs;
}

/**
 * Construye las entradas desde `items` (mismo marcado que `setItems()` de vanilla).
 * @param {BreadcrumbItem[]} items Ítems.
 * @returns {Entry[]} Entradas.
 */
function entriesFromItems(items: BreadcrumbItem[]): Entry[] {
  const explicitCurrent = items.some((item) => item?.current === true);
  return items.map((raw, index) => {
    const item = raw || ({ label: '' } as BreadcrumbItem);
    const current = explicitCurrent ? item.current === true : index === items.length - 1;
    const withIcon = hasNode(item.icon) && 'mtx-breadcrumbs__item--with-icon';
    const content = (
      <>
        {renderIcon(item.icon)}
        {item.label}
      </>
    );
    const common = { ...dataAttributes(item.data), 'aria-current': current ? ('page' as const) : undefined };
    let node: ReactElement;
    if (item.href !== undefined && item.href !== null && item.href !== '') {
      node = (
        <Link
          href={item.href}
          color="inherit"
          underline="hover"
          disabled={item.disabled}
          className={cx('mtx-breadcrumbs__link', withIcon)}
          {...common}
        >
          {content}
        </Link>
      );
    } else if (current) {
      node = (
        <span className={cx('mtx-breadcrumbs__text', withIcon)} {...common}>
          {content}
        </span>
      );
    } else {
      node = (
        <Link
          component="button"
          color="inherit"
          underline="hover"
          disabled={item.disabled}
          className={cx('mtx-breadcrumbs__link', withIcon)}
          {...common}
        >
          {content}
        </Link>
      );
    }
    return { key: item.key ?? index, node, icon: item.icon, item };
  });
}

/**
 * Construye las entradas desde `children`: los `<a>`/`<button>` pasan a ser Link
 * (`color="inherit"`, subrayado en hover) y el resto, texto; `data-icon` añade un icono.
 * @param {ReactNode} children Hijos.
 * @returns {Entry[]} Entradas.
 */
function entriesFromChildren(children: ReactNode): Entry[] {
  const list = Children.toArray(children).filter(
    (child) => isValidElement(child) || typeof child === 'string' || typeof child === 'number',
  );
  const hasCurrent = list.some(
    (child) => isValidElement(child) && (child.props as Record<string, unknown>)['aria-current'] !== undefined,
  );
  return list.map((child, index) => {
    const isLast = index === list.length - 1;
    const currentProps = !hasCurrent && isLast ? { 'aria-current': 'page' as const } : {};
    if (!isValidElement(child)) {
      return {
        key: index,
        icon: null,
        node: (
          <span className="mtx-breadcrumbs__text" {...currentProps}>
            {String(child)}
          </span>
        ),
      };
    }
    const { 'data-icon': icon, ...props } = child.props as Record<string, unknown> & { 'data-icon'?: ReactNode };
    const childProps = props as { className?: string; children?: ReactNode; color?: unknown; underline?: unknown };
    const withIcon = hasNode(icon) && 'mtx-breadcrumbs__item--with-icon';
    const inner = hasNode(icon) ? (
      <>
        {renderIcon(icon)}
        {childProps.children}
      </>
    ) : (
      childProps.children
    );
    const key = child.key ?? index;
    let node: ReactElement;
    if (child.type === 'a' || child.type === 'button') {
      node = (
        <Link
          component={child.type}
          color="inherit"
          underline="hover"
          {...(props as Record<string, unknown>)}
          {...currentProps}
          className={cx(childProps.className, 'mtx-breadcrumbs__link', withIcon)}
        >
          {inner}
        </Link>
      );
    } else if (child.type === Link) {
      node = cloneElement(
        child as ReactElement<Record<string, unknown>>,
        {
          ...currentProps,
          'data-icon': undefined,
          color: childProps.color ?? 'inherit',
          underline: childProps.underline ?? 'hover',
          className: cx(childProps.className, 'mtx-breadcrumbs__link', withIcon),
        },
        inner,
      );
    } else {
      node = cloneElement(
        child as ReactElement<Record<string, unknown>>,
        { ...currentProps, 'data-icon': undefined, className: cx(childProps.className, 'mtx-breadcrumbs__text', withIcon) },
        inner,
      );
    }
    return { key, node, icon: icon as ReactNode };
  });
}

/**
 * Describe el ítem activado a partir de su elemento del DOM.
 * @param {Element} target Enlace o botón activado.
 * @param {Entry} entry Entrada del ítem.
 * @param {number} index Índice en la ruta completa.
 * @returns {BreadcrumbsNavigateDetail} Datos de la navegación.
 */
function describe(target: Element, entry: Entry, index: number): BreadcrumbsNavigateDetail {
  const clone = target.cloneNode(true) as Element;
  clone.querySelectorAll('.mtx-breadcrumbs__icon, .mtx-ripple-container').forEach((node) => node.remove());
  const label = (clone.textContent ?? '').trim();
  const href = target.getAttribute('href');
  const current = target.getAttribute('aria-current') === 'page';
  let item: BreadcrumbItem;
  if (entry.item) {
    item = { ...entry.item, data: entry.item.data ? { ...entry.item.data } : undefined };
  } else {
    const data: Record<string, string> = {};
    Object.entries((target as HTMLElement).dataset ?? {}).forEach(([key, value]) => {
      if (value !== undefined) data[key] = value;
    });
    item = { label, href: href ?? undefined, icon: typeof entry.icon === 'string' ? entry.icon : undefined, current, data };
  }
  return { index, href, label, current, item };
}

/**
 * Ruta de navegación jerárquica. Acepta `children` (Link, `<a>`, texto) o `items`.
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(props, ref) {
  const {
    items,
    separator = '/',
    maxItems: maxItemsProp,
    itemsBeforeCollapse: beforeProp,
    itemsAfterCollapse: afterProp,
    expandText,
    expanded: expandedProp,
    onExpand,
    onNavigate,
    locale,
    variant,
    className,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;

  const t = useT('breadcrumbs', locale);
  const listRef = useRef<HTMLOListElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const handleRef = useForkRef(rootRef, ref);
  const focusOnExpand = useRef(false);

  const maxItems = toCount(maxItemsProp, 8);
  const itemsBefore = toCount(beforeProp, 1);
  const itemsAfter = toCount(afterProp, 1);

  const entries = Array.isArray(items) ? entriesFromItems(items) : entriesFromChildren(children);
  // El estado expandido se asocia a la ruta: si cambia, se vuelve a colapsar (como `setItems()`).
  const signature = Array.isArray(items)
    ? `i${items.length}:${items.map((item) => `${typeof item?.label === 'string' ? item.label : ''}|${item?.href ?? ''}`).join('\n')}`
    : `c${entries.length}`;
  const [expandedFor, setExpandedFor] = useState<string | null>(null);
  const expanded = expandedProp ?? expandedFor === signature;

  const total = entries.length;
  const collapsed = !expanded && maxItems > 0 && total > maxItems && itemsBefore + itemsAfter < total;

  useEffect(() => {
    if (!expanded || !focusOnExpand.current) return;
    focusOnExpand.current = false;
    const list = listRef.current;
    if (!list) return;
    const revealed = list.querySelectorAll('.mtx-breadcrumbs__li')[itemsBefore];
    const target =
      revealed?.querySelector<HTMLElement>('a[href], button:not(:disabled)') ??
      list.querySelector<HTMLElement>('a[href], button:not(:disabled), [tabindex]');
    target?.focus();
  }, [expanded, itemsBefore]);

  const handleExpand = () => {
    focusOnExpand.current = true;
    setExpandedFor(signature);
    onExpand?.();
  };

  const handleItemClick = (entry: Entry, index: number) => (event: MouseEvent<HTMLLIElement>) => {
    if (!onNavigate) return;
    const target = (event.target as Element).closest?.('a, button');
    if (!target || !event.currentTarget.contains(target)) return;
    if (onNavigate(event, describe(target, entry, index)) === false) event.preventDefault();
  };

  const renderSeparator = (key: string) => (
    <li key={key} className="mtx-breadcrumbs__separator" aria-hidden="true">
      {typeof separator === 'string' && ICON_NAME_PATTERN.test(separator) ? (
        <span className="material-icons">{separator}</span>
      ) : (
        separator
      )}
    </li>
  );

  const renderEntry = (entry: Entry, index: number) => (
    <li key={`item-${entry.key}`} className="mtx-breadcrumbs__li" onClick={handleItemClick(entry, index)}>
      {entry.node}
    </li>
  );

  const visible: ReactNode[] = collapsed
    ? [
        ...entries.slice(0, itemsBefore).map((entry, i) => renderEntry(entry, i)),
        <li key="collapsed" className="mtx-breadcrumbs__collapsed">
          <button
            type="button"
            className="mtx-breadcrumbs__collapse-button"
            aria-label={expandText || t('showPath', null, 'Show path')}
            onClick={handleExpand}
          >
            {MORE_HORIZ}
          </button>
        </li>,
        ...entries.slice(total - itemsAfter).map((entry, i) => renderEntry(entry, total - itemsAfter + i)),
      ]
    : entries.map((entry, i) => renderEntry(entry, i));

  const nodes: ReactNode[] = [];
  visible.forEach((node, index) => {
    if (index > 0) nodes.push(renderSeparator(`sep-${index}`));
    nodes.push(node);
  });

  return (
    <nav
      ref={handleRef}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : t('label', null, 'breadcrumb'))}
      aria-labelledby={ariaLabelledBy}
      {...rest}
      className={cx(
        'mtx-breadcrumbs',
        collapsed && 'mtx-breadcrumbs--collapsed',
        variant && variant !== 'body1' && `mtx-typography--${variant}`,
        className,
      )}
    >
      <ol ref={listRef} className="mtx-breadcrumbs__ol">
        {nodes}
      </ol>
    </nav>
  );
});
Breadcrumbs.displayName = 'Breadcrumbs';
