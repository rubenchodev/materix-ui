'use client';
import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, Ref } from 'react';
import { cx, useRipple } from '../../core';
import type { UsePaginationItemType } from './usePagination';

/** Trazados SVG de MUI (FirstPage, NavigateBefore, NavigateNext, LastPage). */
const ICONS = {
  first: 'M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z',
  previous: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  next: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  last: 'M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z',
} as const;

/** Props de {@link PaginationItem}. El resto de atributos va al `<button>` o `<a>`. */
export interface PaginationItemProps
  extends Omit<ButtonHTMLAttributes<HTMLElement> & AnchorHTMLAttributes<HTMLElement>, 'type' | 'onClick'> {
  /** Tipo de ítem (`page`, `first`, `previous`, `next`, `last` o elipsis). */
  type?: UsePaginationItemType;
  /** Página destino (`null` en las elipsis). */
  page?: number | null;
  /** Página actual: añade `aria-current="page"` y `--selected`. */
  selected?: boolean;
  /** Deshabilita el ítem (`disabled` o `aria-disabled` en modo enlace). */
  disabled?: boolean;
  /** URL del ítem: renderiza `<a>` en lugar de `<button>` (modo enlaces). */
  href?: string;
  /** Desactiva el ripple. */
  disableRipple?: boolean;
  /** Clic sobre el ítem. */
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
}

/**
 * Ítem de la paginación (PaginationItem de MUI): página, botón de navegación con icono SVG o elipsis.
 */
export const PaginationItem = forwardRef<HTMLElement, PaginationItemProps>(function PaginationItem(props, ref) {
  const {
    type = 'page',
    page = null,
    selected = false,
    disabled = false,
    href,
    disableRipple = false,
    className,
    children,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  } = props;
  const ripple = useRipple<HTMLElement>({ disabled: disabled || disableRipple });

  if (type === 'start-ellipsis' || type === 'end-ellipsis') {
    return (
      <div ref={ref as Ref<HTMLDivElement>} className={cx('mtx-pagination__ellipsis', disabled && 'mtx-pagination__ellipsis--disabled', className)}>
        {children ?? '…'}
      </div>
    );
  }

  const isPage = type === 'page';
  const classes = cx(
    'mtx-pagination__item',
    isPage && 'mtx-pagination__item--page',
    isPage && selected && 'mtx-pagination__item--selected',
    !isPage && 'mtx-pagination__item--nav',
    !isPage && `mtx-pagination__item--${type}`,
    className,
  );
  const content = isPage ? (
    children ?? page
  ) : (
    <svg className="mtx-pagination__icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d={ICONS[type]} />
    </svg>
  );
  const common = {
    className: classes,
    'data-page': page ?? undefined,
    'data-key': isPage ? `page-${page}` : type,
    'aria-current': isPage && selected ? ('page' as const) : undefined,
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      onPointerDown?.(event);
      ripple.handlers.onPointerDown(event);
    },
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => {
      onPointerUp?.(event);
      ripple.handlers.onPointerUp(event);
    },
    onPointerLeave: (event: ReactPointerEvent<HTMLElement>) => {
      onPointerLeave?.(event);
      ripple.handlers.onPointerLeave(event);
    },
    onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => {
      onPointerCancel?.(event);
      ripple.handlers.onPointerCancel(event);
    },
  };

  if (href !== undefined) {
    const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        {...common}
        ref={ref as Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        role={disabled ? 'link' : rest.role}
        aria-disabled={disabled ? true : undefined}
        onClick={handleClick}
      >
        {content}
        {ripple.element}
      </a>
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      {...common}
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {content}
      {ripple.element}
    </button>
  );
});
