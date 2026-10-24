'use client';
/**
 * Piezas internas del DateTimePicker: cabecera MD2 (modal y estático), pestañas Fecha/Hora
 * (o Fechas/Inicio/Fin en rangos) y barra de acciones. Reproducen el DOM de vanilla.
 */
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import './picker-tabs.css';
import { cx } from '../../core';
import type { TranslateFn } from '../../i18n';
import { getMonthNames, getWeekdayNames } from '../../utils/dates';
import { timeText } from './picker-utils';

/** Pestaña activa del picker. */
export type PickerTab = 'date' | 'time' | 'time-start' | 'time-end';

/** Acciones disponibles en la barra inferior. */
export type PickerAction = 'today' | 'clear' | 'cancel' | 'accept';

/**
 * Activa con Enter/Espacio un elemento con `role="button"`.
 * @param {ReactKeyboardEvent<HTMLElement>} event Evento de teclado.
 */
function pressOnKey(event: ReactKeyboardEvent<HTMLElement>): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

/** Propiedades de {@link PickerHeader}. */
export interface PickerHeaderProps {
  range: boolean;
  date: Date | null;
  start: Date | null;
  end: Date | null;
  locale: string;
  t: TranslateFn;
  onYearClick: () => void;
}

/**
 * Cabecera MD2 de la pestaña de fecha: año (abre la vista de años) y fecha o rango elegido.
 */
export function PickerHeader({ range, date, start, end, locale, t, onYearClick }: PickerHeaderProps) {
  const shortMonths = getMonthNames(locale, 'short');
  let year: number;
  let text: string;
  if (range) {
    year = start ? start.getFullYear() : end ? end.getFullYear() : new Date().getFullYear();
    if (start && end) {
      text = `${start.getDate()} ${shortMonths[start.getMonth()]} - ${end.getDate()} ${shortMonths[end.getMonth()]}`;
    } else if (start) {
      text = `${start.getDate()} ${shortMonths[start.getMonth()]} - ${t('selectEnd', null, 'Select end date')}`;
    } else {
      text = t('selectRange', null, 'Select range');
    }
  } else {
    const cur = date || new Date();
    year = cur.getFullYear();
    text = `${getWeekdayNames(locale, 'short')[cur.getDay()]}, ${cur.getDate()} ${shortMonths[cur.getMonth()]}`;
  }
  const yearText = String(year);
  return (
    <div className="mtx-picker-header">
      <div
        className="mtx-picker-header__year"
        role="button"
        tabIndex={0}
        data-focus-key="header-0"
        aria-label={t('yearViewLabel', { year: yearText }, `${yearText}, choose year`)}
        onClick={onYearClick}
        onKeyDown={pressOnKey}
      >
        {yearText}
      </div>
      <div className="mtx-picker-header__date" style={range ? { fontSize: '1.05rem' } : undefined}>
        {text}
      </div>
    </div>
  );
}

/** Propiedades de {@link PickerTabs}. */
export interface PickerTabsProps {
  range: boolean;
  activeTab: PickerTab;
  label: string;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
  t: TranslateFn;
  onSelect: (tab: PickerTab) => void;
}

/**
 * Pestañas Fecha/Hora (o Fechas/Inicio/Fin) con el patrón WAI-ARIA Tabs y activación automática.
 */
export function PickerTabs({ range, activeTab, label, startTime, endTime, t, onSelect }: PickerTabsProps) {
  const tabs: Array<{ id: PickerTab; icon: string; text: string; time?: string }> = range
    ? [
        { id: 'date', icon: 'calendar_today', text: t('dates', null, 'Dates') },
        { id: 'time-start', icon: 'schedule', text: t('start', null, 'Start'), time: timeText(startTime.hour, startTime.minute, true) },
        { id: 'time-end', icon: 'schedule', text: t('end', null, 'End'), time: timeText(endTime.hour, endTime.minute, true) },
      ]
    : [
        { id: 'date', icon: 'calendar_today', text: t('date', null, 'Date') },
        { id: 'time', icon: 'schedule', text: t('time', null, 'Time') },
      ];

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    event.preventDefault();
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[next]?.focus();
    onSelect(tabs[next].id);
  };

  return (
    <div className={cx('mtx-picker-tabs', range && 'mtx-picker-tabs--range')} role="tablist" aria-label={label}>
      {tabs.map((tab, index) => {
        const selected = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            className={cx('mtx-picker-tab', selected && 'mtx-picker-tab--active')}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            data-focus-key={`tab-${index}`}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(tab.id);
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className="material-icons" aria-hidden="true">{tab.icon}</span>{' '}
            {range ? (
              <span className="mtx-picker-tab__text">
                {tab.time ? `${tab.text} ` : tab.text}
                {tab.time ? (
                  <span className="mtx-picker-tab__time">
                    <span className="mtx-picker-tab__paren">(</span>
                    {tab.time}
                    <span className="mtx-picker-tab__paren">)</span>
                  </span>
                ) : null}
              </span>
            ) : (
              tab.text
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Propiedades de {@link PickerActions}. */
export interface PickerActionsProps {
  /** Vista de hora activa (muestra el conmutador teclado/reloj en lugar de "Hoy"). */
  timeTab: boolean;
  /** Modo de entrada de la hora. */
  timeInput: boolean;
  actions: PickerAction[];
  texts: { today: ReactNode; clear: ReactNode; cancel: ReactNode; accept: ReactNode };
  t: TranslateFn;
  onToggleTimeInput: () => void;
  onAction: (action: PickerAction) => void;
}

/**
 * Barra inferior: conmutador de hora o "Hoy" a la izquierda; Borrar, Cancelar y Aceptar a la derecha.
 */
export function PickerActions({ timeTab, timeInput, actions, texts, t, onToggleTimeInput, onAction }: PickerActionsProps) {
  const toggleLabel = timeInput
    ? t('switchToClock', null, 'Switch to clock view')
    : t('switchToKeyboard', null, 'Enter time with keyboard');
  const textButton = (action: PickerAction, contained = false) => (
    <button
      key={action}
      type="button"
      className={cx('mtx-button', contained ? 'mtx-button--contained' : 'mtx-button--text', 'mtx-button--small')}
      data-focus-key={action === 'today' ? 'today' : undefined}
      onClick={(event) => {
        event.stopPropagation();
        onAction(action);
      }}
    >
      {texts[action]}
    </button>
  );
  return (
    <div className="mtx-picker-actions">
      {timeTab ? (
        <button
          type="button"
          className="mtx-picker-icon-btn"
          title={toggleLabel}
          aria-label={toggleLabel}
          data-focus-key="time-view-toggle"
          onClick={(event) => {
            event.stopPropagation();
            onToggleTimeInput();
          }}
        >
          <span className="material-icons" aria-hidden="true">{timeInput ? 'schedule' : 'keyboard'}</span>
        </button>
      ) : actions.includes('today') ? (
        textButton('today')
      ) : null}
      {actions.includes('clear') ? textButton('clear') : null}
      {actions.includes('cancel') ? textButton('cancel') : null}
      {actions.includes('accept') ? textButton('accept', true) : null}
    </div>
  );
}
