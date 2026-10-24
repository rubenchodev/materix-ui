'use client';
import { forwardRef, useRef } from 'react';
import type { FocusEvent, HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode, SyntheticEvent } from 'react';
import '@rubenchodev/materix-ui/components/pagination.css';
import { cx, useEnhancedEffect } from '../../core';
import { useT } from '../../i18n';
import { PaginationItem } from './PaginationItem';
import { usePagination } from './usePagination';
import type { UsePaginationItem, UsePaginationItemType, UsePaginationProps } from './usePagination';

/** Variante visual. */
export type PaginationVariant = 'text' | 'outlined';
/** Forma de los ítems. */
export type PaginationShape = 'circular' | 'rounded';
/** Tamaño de los ítems (26/32/40px). */
export type PaginationSize = 'small' | 'medium' | 'large';
/** Color de la página seleccionada. */
export type PaginationColor = 'standard' | 'primary' | 'secondary';

/** Parámetros que recibe `renderItem`: ítem calculado más lo necesario para pintarlo. */
export interface PaginationRenderItemParams extends UsePaginationItem {
  /** Etiqueta accesible calculada con `getItemAriaLabel`. */
  'aria-label'?: string;
  /** URL del ítem en modo enlaces. */
  href?: string;
  /** Ripple desactivado. */
  disableRipple: boolean;
}

/** Props de {@link Pagination}. `className`, `style` y el resto de atributos van al `<nav>`. */
export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'color'>,
    Omit<UsePaginationProps, 'componentName'> {
  /** Variante: `text` (por defecto) u `outlined`. */
  variant?: PaginationVariant;
  /** Forma: `circular` (por defecto) o `rounded` (4px). */
  shape?: PaginationShape;
  /** Tamaño: `small`, `medium` (por defecto) o `large`. */
  size?: PaginationSize;
  /** Color de la página actual: `standard` (por defecto), `primary` o `secondary`. */
  color?: PaginationColor;
  /** Desactiva el ripple de los ítems. */
  disableRipple?: boolean;
  /**
   * Modo enlaces: devuelve la URL de cada página y los ítems se pintan como `<a href>`.
   * Al pulsar un enlace se llama a `onChange`; si este hace `event.preventDefault()`, se cancela la
   * navegación nativa y la página cambia en el cliente (como el evento cancelable de vanilla).
   */
  getItemHref?: (page: number) => string;
  /** Etiqueta accesible de cada ítem (por defecto, textos i18n `pagination.*`). */
  getItemAriaLabel?: (type: UsePaginationItemType, page: number | null, selected: boolean) => string;
  /** Pinta cada ítem (por defecto `<PaginationItem {...item} />`). */
  renderItem?: (item: PaginationRenderItemParams) => ReactNode;
  /** Idioma local de las etiquetas (prevalece sobre el `I18nProvider`). */
  locale?: string;
}

/**
 * Paginación (Pagination de MUI): páginas con elipsis, anterior/siguiente y primera/última opcionales,
 * variantes, formas, tamaños, colores y modo enlaces para SSR.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(props, ref) {
  const {
    count,
    page: pageProp,
    defaultPage,
    onChange,
    siblingCount,
    boundaryCount,
    showFirstButton,
    showLastButton,
    hidePrevButton,
    hideNextButton,
    disabled = false,
    variant = 'text',
    shape = 'circular',
    size = 'medium',
    color = 'standard',
    disableRipple = false,
    getItemHref,
    getItemAriaLabel,
    renderItem,
    locale,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;

  const t = useT('pagination', locale);
  const { items, page, setPage } = usePagination({
    count,
    page: pageProp,
    defaultPage,
    onChange,
    siblingCount,
    boundaryCount,
    showFirstButton,
    showLastButton,
    hidePrevButton,
    hideNextButton,
    disabled,
    componentName: 'Pagination',
  });

  const listRef = useRef<HTMLUListElement>(null);
  /** Clave (`data-key`) del ítem enfocado, para restaurar el foco tras repintar. */
  const focusedKey = useRef<string | null>(null);

  // Si el ítem enfocado queda deshabilitado (p. ej. «siguiente» en la última página), el foco pasa a la página actual.
  useEnhancedEffect(() => {
    const list = listRef.current;
    const key = focusedKey.current;
    if (!list || !key) return;
    const active = list.ownerDocument.activeElement as HTMLElement | null;
    const lost = !active || active === list.ownerDocument.body || !list.contains(active);
    const activeDisabled = !!active && list.contains(active) && isItemDisabled(active);
    if (!lost && !activeDisabled) return;
    let target = list.querySelector<HTMLElement>(`[data-key="${key}"]`);
    if (!target || isItemDisabled(target)) target = list.querySelector<HTMLElement>('[aria-current="page"]');
    target?.focus();
  }, [page, disabled]);

  const handleFocus = (event: FocusEvent<HTMLUListElement>) => {
    focusedKey.current = (event.target as HTMLElement).getAttribute('data-key');
  };
  const handleBlur = (event: FocusEvent<HTMLUListElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && !event.currentTarget.contains(next)) focusedKey.current = null;
  };

  const defaultLabel = (type: UsePaginationItemType, target: number | null, selected: boolean): string => {
    if (type === 'page') {
      return selected
        ? t('page', { page: target }, 'page {page}')
        : t('goToPage', { page: target }, 'Go to page {page}');
    }
    return t(type, null, `Go to ${type} page`);
  };

  const linkClick = (item: UsePaginationItem) => (event: ReactMouseEvent<HTMLElement>) => {
    if (item.disabled || item.page === null || item.page === page) return;
    const target = item.page;
    onChange?.(event as SyntheticEvent, target);
    const prevented = () => event.defaultPrevented || event.nativeEvent.defaultPrevented;
    if (prevented()) {
      setPage(target);
      return;
    }
    // Un `Link` de router en `renderItem` cancela tras llamar a `onClick`: se revisa en un microtask.
    queueMicrotask(() => {
      if (prevented()) setPage(target);
    });
  };

  const render = renderItem ?? ((item: PaginationRenderItemParams) => <PaginationItem {...item} />);
  const navLabel = ariaLabel ?? (ariaLabelledBy ? undefined : t('label', null, 'pagination navigation'));

  return (
    <nav
      ref={ref}
      className={cx(
        'mtx-pagination',
        `mtx-pagination--${variant}`,
        `mtx-pagination--${shape}`,
        `mtx-pagination--${size}`,
        `mtx-pagination--color-${color}`,
        disabled && 'mtx-pagination--disabled',
        className,
      )}
      aria-label={navLabel}
      aria-labelledby={ariaLabelledBy}
      {...rest}
    >
      <ul ref={listRef} className="mtx-pagination__ul" onFocus={handleFocus} onBlur={handleBlur}>
        {items.map((item, index) => {
          const isEllipsis = item.type === 'start-ellipsis' || item.type === 'end-ellipsis';
          const params: PaginationRenderItemParams = {
            ...item,
            disableRipple,
            'aria-label': isEllipsis
              ? undefined
              : (getItemAriaLabel ?? defaultLabel)(item.type, item.page, item.selected),
          };
          if (getItemHref && !isEllipsis && item.page !== null) {
            params.href = getItemHref(item.page);
            params.onClick = linkClick(item);
          }
          const key = item.type === 'page' ? `page-${item.page}` : isEllipsis ? item.type : `${item.type}-${index}`;
          return <li key={key}>{render(params)}</li>;
        })}
      </ul>
    </nav>
  );
});

/**
 * @param {HTMLElement} el Ítem.
 * @returns {boolean} `true` si no admite interacción.
 */
function isItemDisabled(el: HTMLElement): boolean {
  return (el as HTMLButtonElement).disabled === true || el.getAttribute('aria-disabled') === 'true';
}
