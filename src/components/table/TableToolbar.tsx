'use client';
import { forwardRef, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/table.css';
import { cx } from '../../core';
import { useTableStrings } from './strings';

/** Props de {@link TableToolbar}. */
export interface TableToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Título visible sin selección (`.mtx-table-toolbar__title`). */
  title?: ReactNode;
  /** Filas seleccionadas (p. ej. `numSelected` de `useTableSelection`): resalta y anuncia el contador. */
  numSelected?: number;
  /** Texto propio del contador con `{0}` como marcador (`data-selected-text` de vanilla). */
  selectedText?: string;
  /** Acciones visibles sin selección (grupo `data-show="default"`). */
  actions?: ReactNode;
  /** Acciones en lote visibles con selección (grupo `data-show="selected"`). */
  selectedActions?: ReactNode;
  /** Idioma de los textos (prevalece sobre `I18nProvider`). */
  locale?: string;
}

/**
 * Barra de herramientas de tabla (EnhancedTableToolbar de MUI): muestra el título o, con filas
 * seleccionadas, el contador resaltado (región viva) y las acciones en lote.
 */
export const TableToolbar = forwardRef<HTMLDivElement, TableToolbarProps>(function TableToolbar(props, ref) {
  const {
    title,
    numSelected = 0,
    selectedText,
    actions,
    selectedActions,
    locale,
    className,
    children,
    role = 'toolbar',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;
  const t = useTableStrings(locale);
  const titleId = `mtx-table-toolbar-title-${useId().replace(/:/g, '')}`;
  const count = Math.max(0, Math.trunc(numSelected) || 0);
  const selected = count > 0;
  const hasTitle = title !== undefined && title !== null && title !== false && title !== '';
  const text = selectedText
    ? selectedText.replace('{0}', String(count))
    : t(count === 1 ? 'selectedCountSingular' : 'selectedCountPlural', [count]);
  const naming = ariaLabel !== undefined || ariaLabelledBy !== undefined
    ? { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy }
    : hasTitle
      ? { 'aria-labelledby': titleId }
      : { 'aria-label': t('toolbar') };

  return (
    <div
      ref={ref}
      role={role}
      className={cx('mtx-table-toolbar', selected && 'mtx-table-toolbar--highlight', className)}
      {...naming}
      {...rest}
    >
      {hasTitle ? (
        <div className="mtx-table-toolbar__title" id={titleId} hidden={selected}>
          {title}
        </div>
      ) : null}
      <div
        className={cx('mtx-table-toolbar__count', !selected && 'mtx-table-toolbar__count--empty')}
        aria-live="polite"
        aria-atomic="true"
      >
        {selected ? text : ''}
      </div>
      {actions !== undefined ? (
        <div className="mtx-table-toolbar__actions" data-show="default" hidden={selected}>
          {actions}
        </div>
      ) : null}
      {selectedActions !== undefined ? (
        <div className="mtx-table-toolbar__actions" data-show="selected" hidden={!selected}>
          {selectedActions}
        </div>
      ) : null}
      {children}
    </div>
  );
});
