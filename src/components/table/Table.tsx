'use client';
import { createContext, forwardRef, useContext, useId, useMemo, useRef, useState } from 'react';
import type { CSSProperties, Dispatch, HTMLAttributes, ReactNode, SetStateAction, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/table.css';
import { cx, useEnhancedEffect, useForkRef } from '../../core';
import { useTableStrings } from './strings';

/** Densidad de la tabla. */
export type TableSize = 'medium' | 'small';
/** Relleno de las celdas. */
export type TablePadding = 'normal' | 'checkbox' | 'none';
/** Alineación de una celda. */
export type TableCellAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify';
/** Dirección de orden. */
export type SortDirection = 'asc' | 'desc';
/** Sección de la tabla que contiene una fila o celda. */
export type TableSection = 'head' | 'body' | 'footer';

interface TableContextValue {
  size: TableSize;
  padding: TablePadding;
  stickyHeader: boolean;
  hover: boolean;
  selectable: boolean;
}

const TableContext = createContext<TableContextValue | null>(null);
const TableContainerContext = createContext<{ stickyHeader: boolean } | null>(null);
const TableSectionContext = createContext<TableSection | null>(null);
const TableCellSortContext = createContext<Dispatch<SetStateAction<SortDirection | false>> | null>(null);

/** @returns {TableContextValue|null} Contexto de la tabla más cercana. */
export const useTableContext = () => useContext(TableContext);
/** @returns {TableSection|null} Sección (head/body/footer) más cercana. */
export const useTableSection = () => useContext(TableSectionContext);
/** @returns {Function|null} Registra el orden de la etiqueta en la celda `<th>` padre (aria-sort). */
export const useTableCellSort = () => useContext(TableCellSortContext);

/** Props de {@link Table}. */
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Densidad: `medium` (16px) o `small` (6px vertical, `mtx-table--small`). */
  size?: TableSize;
  /** Relleno por defecto de las celdas. */
  padding?: TablePadding;
  /** Cabecera fija al desplazar (`mtx-table--sticky-header`). */
  stickyHeader?: boolean;
  /** Resalta las filas del cuerpo al pasar el ratón. */
  hover?: boolean;
  /** Marca la tabla como seleccionable (`mtx-table--selectable`, `aria-selected` en filas). */
  selectable?: boolean;
  /** Cursor de mano en filas que se seleccionan al hacer clic (`data-select-on-click`). */
  selectOnClick?: boolean;
}

/**
 * Tabla de datos (Table de MUI) sobre un `<table>` semántico. Comparte tamaño, relleno,
 * hover y selección con sus secciones, filas y celdas mediante contexto.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(props, ref) {
  const {
    size = 'medium',
    padding = 'normal',
    stickyHeader: stickyProp = false,
    hover = false,
    selectable = false,
    selectOnClick = false,
    className,
    children,
    ...rest
  } = props;
  const container = useContext(TableContainerContext);
  const stickyHeader = stickyProp || Boolean(container?.stickyHeader);
  const value = useMemo(
    () => ({ size, padding, stickyHeader, hover, selectable }),
    [size, padding, stickyHeader, hover, selectable],
  );
  return (
    <TableContext.Provider value={value}>
      <table
        ref={ref}
        className={cx(
          'mtx-table',
          stickyHeader && 'mtx-table--sticky-header',
          size === 'small' && 'mtx-table--small',
          hover && 'mtx-table--hover',
          selectable && 'mtx-table--selectable',
          className,
        )}
        data-select-on-click={selectable && selectOnClick ? '' : undefined}
        {...rest}
      >
        {children}
      </table>
    </TableContext.Provider>
  );
});

/** Props de {@link TableContainer}. */
export interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Altura máxima (número en px o valor CSS); activa el scroll vertical. */
  maxHeight?: number | string;
  /** Fija la cabecera de la tabla interior. */
  stickyHeader?: boolean;
  /** Idioma del nombre accesible por defecto de la región. */
  locale?: string;
}

interface RegionState {
  label?: string;
  labelledBy?: string;
}

/**
 * Contenedor con scroll (TableContainer de MUI). Mientras desplaza contenido es una región
 * enfocable y con nombre (WCAG 2.1.1), recalculada con `ResizeObserver` como en vanilla.
 */
export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(function TableContainer(props, ref) {
  const { maxHeight, stickyHeader = false, locale, className, style, children, ...rest } = props;
  const t = useTableStrings(locale);
  const innerRef = useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(innerRef, ref);
  const captionFallbackId = useId();
  const [region, setRegion] = useState<RegionState | null>(null);
  const hasMaxHeight = maxHeight !== undefined && maxHeight !== null && maxHeight !== '';
  const ownsTabindex = rest.tabIndex === undefined;
  const scrollLabel = t('scrollRegion');

  useEnhancedEffect(() => {
    const el = innerRef.current;
    if (!el || !ownsTabindex) return undefined;
    const sync = () => {
      const scrollable = hasMaxHeight || el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
      if (!scrollable) {
        setRegion(null);
        return;
      }
      const table = el.querySelector('table');
      const caption = table?.querySelector('caption');
      let next: RegionState;
      if (caption && caption.textContent?.trim()) {
        if (!caption.id) caption.id = `mtx-table-caption-${captionFallbackId.replace(/:/g, '')}`;
        next = { labelledBy: caption.id };
      } else if (table?.getAttribute('aria-labelledby')) {
        next = { labelledBy: table.getAttribute('aria-labelledby')! };
      } else if (table?.getAttribute('aria-label')) {
        next = { label: table.getAttribute('aria-label')! };
      } else {
        next = { label: scrollLabel };
      }
      setRegion((prev) => (prev && prev.label === next.label && prev.labelledBy === next.labelledBy ? prev : next));
    };
    sync();
    if (typeof ResizeObserver !== 'function') return undefined;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMaxHeight, ownsTabindex, scrollLabel, captionFallbackId]);

  const ownLabel = rest['aria-label'] !== undefined || rest['aria-labelledby'] !== undefined;
  const regionProps = region
    ? {
        tabIndex: 0,
        role: rest.role ?? 'region',
        ...(rest.role || ownLabel ? {} : { 'aria-label': region.label, 'aria-labelledby': region.labelledBy }),
      }
    : {};
  const containerValue = useMemo(() => ({ stickyHeader }), [stickyHeader]);
  const mergedStyle: CSSProperties | undefined = hasMaxHeight
    ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight, ...style }
    : style;

  return (
    <TableContainerContext.Provider value={containerValue}>
      <div
        ref={handleRef}
        className={cx(
          'mtx-table-container',
          hasMaxHeight && 'mtx-table-container--scroll',
          stickyHeader && 'mtx-table-container--sticky',
          className,
        )}
        style={mergedStyle}
        {...regionProps}
        {...rest}
      >
        {children}
      </div>
    </TableContainerContext.Provider>
  );
});

/** Props de las secciones `<thead>`, `<tbody>` y `<tfoot>`. */
export type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;

/** Crea una sección de la tabla que publica su tipo a filas y celdas. */
function createSection(section: TableSection, Tag: 'thead' | 'tbody' | 'tfoot', block: string, displayName: string) {
  const Component = forwardRef<HTMLTableSectionElement, TableSectionProps>(function TableSectionComponent(props, ref) {
    const { className, ...rest } = props;
    return (
      <TableSectionContext.Provider value={section}>
        <Tag ref={ref} className={cx(block, className)} {...rest} />
      </TableSectionContext.Provider>
    );
  });
  Component.displayName = displayName;
  return Component;
}

/** Cabecera de la tabla (`<thead class="mtx-table-head">`): sus celdas son `<th scope="col">`. */
export const TableHead = createSection('head', 'thead', 'mtx-table-head', 'TableHead');
/** Cuerpo de la tabla (`<tbody class="mtx-table-body">`). */
export const TableBody = createSection('body', 'tbody', 'mtx-table-body', 'TableBody');
/** Pie de la tabla (`<tfoot class="mtx-table-footer">`) con estilo de totales. */
export const TableFooter = createSection('footer', 'tfoot', 'mtx-table-footer', 'TableFooter');

/** Props de {@link TableCaption}. */
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

/** Leyenda de la tabla (`<caption class="mtx-table-caption">`), mostrada bajo la tabla. */
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(function TableCaption(props, ref) {
  const { className, id, ...rest } = props;
  const generated = useId();
  return (
    <caption
      ref={ref}
      id={id ?? `mtx-table-caption-${generated.replace(/:/g, '')}`}
      className={cx('mtx-table-caption', className)}
      {...rest}
    />
  );
});

/** Props de {@link TableRow}. */
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Resalta la fila al pasar el ratón (`mtx-table-row--hover`). */
  hover?: boolean;
  /** Fila seleccionada (`mtx-table-row--selected` y `aria-selected`). */
  selected?: boolean;
}

/**
 * Fila de la tabla. En tablas `hover` las filas del cuerpo se resaltan solas; en tablas
 * `selectable` publica `aria-selected="true|false"`.
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(props, ref) {
  const { hover = false, selected, className, ...rest } = props;
  const table = useContext(TableContext);
  const section = useContext(TableSectionContext);
  const inBody = section === 'body' || section === null;
  const autoHover = Boolean(table?.hover) && inBody;
  let ariaSelected: 'true' | 'false' | undefined;
  if (selected) ariaSelected = 'true';
  else if (selected === false && table?.selectable && inBody) ariaSelected = 'false';
  return (
    <tr
      ref={ref}
      className={cx(
        'mtx-table-row',
        (hover || autoHover) && 'mtx-table-row--hover',
        selected && 'mtx-table-row--selected',
        className,
      )}
      aria-selected={ariaSelected}
      {...rest}
    />
  );
});

type CellAttributes = Omit<ThHTMLAttributes<HTMLTableCellElement> & TdHTMLAttributes<HTMLTableCellElement>, 'align'>;

/** Props de {@link TableCell}. */
export interface TableCellProps extends CellAttributes {
  /** Alineación del contenido (`mtx-table-cell--{align}`). */
  align?: TableCellAlign;
  /** Columna numérica: alineada a la derecha (`mtx-table-cell--numeric`). */
  numeric?: boolean;
  /** Relleno (`normal`, `checkbox` para casillas o `none`); por defecto, el de la tabla. */
  padding?: TablePadding;
  /** Densidad de esta celda; por defecto, la de la tabla. */
  size?: TableSize;
  /** Variante; por defecto según la sección (head/body/footer). */
  variant?: TableSection;
  /** Columna ordenada: publica `aria-sort` (`ascending`/`descending`). */
  sortDirection?: SortDirection | false;
  /** Elemento HTML; por defecto `th` en la cabecera y `td` en el resto. */
  component?: 'th' | 'td';
  /** Atributo `scope`; por defecto `col` en `<th>` de cabecera y `row` en `<th>` del cuerpo. */
  scope?: string;
}

const CELL_PADDING: Record<TableSize, string> = { medium: '16px', small: '6px 16px' };

/**
 * Celda de la tabla (`<th>`/`<td>` con `mtx-table-cell`): alineación, relleno, densidad,
 * variante por contexto y `aria-sort` (por prop o por un {@link TableSortLabel} interior).
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(props, ref) {
  const {
    align = 'inherit',
    numeric = false,
    padding: paddingProp,
    size: sizeProp,
    variant: variantProp,
    sortDirection,
    component,
    scope: scopeProp,
    className,
    style,
    children,
    ...rest
  } = props;
  const table = useContext(TableContext);
  const section = useContext(TableSectionContext);
  const [labelSort, setLabelSort] = useState<SortDirection | false>(false);
  const variant = variantProp ?? section ?? 'body';
  const Tag = component ?? (variant === 'head' ? 'th' : 'td');
  const padding = paddingProp ?? table?.padding ?? 'normal';
  const tableSize = table?.size ?? 'medium';
  let scope = scopeProp;
  if (scope === undefined && Tag === 'th') {
    if (section === 'head') scope = 'col';
    else if (section === 'body') scope = 'row';
  }
  const sort = sortDirection ?? labelSort;
  const ariaSort = sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined;
  // Una celda con tamaño distinto al de la tabla ajusta solo su variable de relleno.
  const cellStyle = sizeProp && sizeProp !== tableSize
    ? ({ '--mtx-table-cell-padding': CELL_PADDING[sizeProp], ...style } as CSSProperties)
    : style;

  return (
    <TableCellSortContext.Provider value={setLabelSort}>
      <Tag
        ref={ref}
        className={cx(
          'mtx-table-cell',
          align !== 'inherit' && `mtx-table-cell--${align}`,
          numeric && 'mtx-table-cell--numeric',
          padding !== 'normal' && `mtx-table-cell--padding-${padding}`,
          className,
        )}
        scope={scope}
        aria-sort={ariaSort}
        style={cellStyle}
        {...rest}
      >
        {children as ReactNode}
      </Tag>
    </TableCellSortContext.Provider>
  );
});
