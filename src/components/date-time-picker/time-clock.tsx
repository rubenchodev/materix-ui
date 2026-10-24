'use client';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { cx, useEventCallback } from '../../core';
import {
  CLOCK_CENTER,
  CLOCK_RADIUS,
  angleToHour,
  angleToMinute,
  clockHandAngle,
  clockPosition,
  pointToClockAngle,
  to24Hour,
} from '../../utils/dates';
import { isTimeValueDisabled } from './time-utils';
import type { TimeConstraints, TimeParts, TimeViewName } from './time-utils';

/** Retardo (ms) del cambio de vista al soltar el gesto (vanilla: horas → minutos). */
export const CLOCK_SWITCH_DELAY = 200;

/** Props de {@link TimeClock}. */
export interface TimeClockProps {
  /** Unidad mostrada. */
  unit: TimeViewName;
  /** Hora actual. */
  parts: TimeParts;
  /** Formato de 12 horas. */
  ampm: boolean;
  /** Restricciones de selección. */
  constraints: TimeConstraints;
  /** Bloquea la interacción. */
  disabled: boolean;
  /** Solo lectura. */
  readOnly: boolean;
  /** Etiqueta accesible del slider. */
  label: string;
  /** Texto accesible del valor. */
  valueText: string;
  /** Cambio de valor durante el gesto (hora 0-23, minuto o segundo). */
  onSelect: (unit: TimeViewName, value: number) => void;
  /** Fin del gesto con un valor válido (no se llama si se cancela). */
  onCommit: (unit: TimeViewName) => void;
  /** Teclado del slider. */
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * Reloj radial MD2 (`.mtx-time-picker__clock`): números, aguja y arrastre con puntero.
 */
export const TimeClock = forwardRef<HTMLDivElement, TimeClockProps>(function TimeClock(props, ref) {
  const { unit, parts, ampm, constraints, disabled, readOnly, label, valueText, onSelect, onCommit, onKeyDown } = props;
  const clockRef = useRef<HTMLDivElement | null>(null);
  const endDragRef = useRef<((commit: boolean) => void) | null>(null);
  const [dragging, setDragging] = useState(false);

  const isHours = unit === 'hours';
  const current = isHours ? parts.hour24 : unit === 'minutes' ? parts.minute : parts.second;
  const sliderValue = isHours && ampm ? parts.hour24 % 12 || 12 : current;

  // Al desmontar, el gesto en curso se cierra sin confirmar y retira sus listeners de document.
  useEffect(() => () => endDragRef.current?.(false), []);

  /**
   * Valor bajo el puntero o `null` si está deshabilitado.
   * @param {number} clientX Coordenada X.
   * @param {number} clientY Coordenada Y.
   * @returns {number|null} Hora 0-23, minuto o segundo.
   */
  const valueAt = (clientX: number, clientY: number): number | null => {
    const rect = clockRef.current!.getBoundingClientRect();
    const deg = pointToClockAngle(clientX - rect.left - CLOCK_CENTER, clientY - rect.top - CLOCK_CENTER);
    let value: number;
    if (isHours) value = to24Hour(angleToHour(deg), parts.meridiem);
    else {
      value = angleToMinute(deg);
      const step = unit === 'minutes' ? constraints.minutesStep : 1;
      if (step > 1) value = (Math.round(value / step) * step) % 60;
    }
    return isTimeValueDisabled(unit, value, parts, constraints) ? null : value;
  };

  const handlePointerDown = useEventCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || readOnly || (event.pointerType === 'mouse' && event.button !== 0)) return;
    endDragRef.current?.(false);
    const clock = clockRef.current!;
    const doc = clock.ownerDocument;
    const pointerId = event.pointerId;
    let last = current;
    let valid = !isTimeValueDisabled(unit, current, parts, constraints);

    const apply = (x: number, y: number) => {
      const value = valueAt(x, y);
      if (value === null) return;
      valid = true;
      if (value !== last) {
        last = value;
        onSelect(unit, value);
      }
    };

    try {
      clock.setPointerCapture?.(pointerId);
    } catch {
      /* jsdom o puntero ya liberado */
    }
    setDragging(true);
    apply(event.clientX, event.clientY);

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      apply(ev.clientX, ev.clientY);
    };
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      end(ev.type !== 'pointercancel');
    };
    /**
     * Termina el gesto y retira los listeners.
     * @param {boolean} commit `false` en cancelación o desmontaje.
     */
    const end = (commit: boolean) => {
      if (endDragRef.current === end) endDragRef.current = null;
      doc.removeEventListener('pointermove', onMove);
      doc.removeEventListener('pointerup', onUp);
      doc.removeEventListener('pointercancel', onUp);
      try {
        if (clock.hasPointerCapture?.(pointerId)) clock.releasePointerCapture(pointerId);
      } catch {
        /* sin captura */
      }
      setDragging(false);
      if (commit && valid) onCommit(unit);
    };
    endDragRef.current = end;
    doc.addEventListener('pointermove', onMove);
    doc.addEventListener('pointerup', onUp);
    doc.addEventListener('pointercancel', onUp);
  });

  const setRefs = (node: HTMLDivElement | null) => {
    clockRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const numbers: Array<{ value: number; text: string; deg: number; selected: boolean; disabled: boolean }> = [];
  if (isHours) {
    const shown = parts.hour24 % 12 || 12;
    for (let h = 1; h <= 12; h++) {
      numbers.push({
        value: h,
        text: String(h),
        deg: h * 30,
        selected: h === shown,
        disabled: isTimeValueDisabled('hours', to24Hour(h, parts.meridiem), parts, constraints),
      });
    }
  } else {
    for (let m = 0; m < 60; m += 5) {
      numbers.push({
        value: m,
        text: String(m).padStart(2, '0'),
        deg: m * 6,
        selected: Math.round(current / 5) * 5 === m,
        disabled: isTimeValueDisabled(unit, m, parts, constraints),
      });
    }
  }

  return (
    <div
      ref={setRefs}
      className="mtx-time-picker__clock"
      role="slider"
      tabIndex={disabled ? -1 : 0}
      data-focus-key="clock"
      aria-orientation="horizontal"
      aria-label={label}
      aria-valuemin={isHours ? (ampm ? 1 : 0) : 0}
      aria-valuemax={isHours ? (ampm ? 12 : 23) : 59}
      aria-valuenow={sliderValue}
      aria-valuetext={valueText}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      onPointerDown={handlePointerDown}
      onKeyDown={onKeyDown}
    >
      <div className="mtx-time-picker__center" />
      <div
        className={cx('mtx-time-picker__hand', dragging && 'mtx-time-picker__hand--dragging')}
        style={{ height: `${CLOCK_RADIUS}px`, transform: `rotate(${clockHandAngle(isHours ? 'hours' : 'minutes', current)}deg)` }}
      >
        <div className="mtx-time-picker__pointer" />
      </div>
      {numbers.map((num) => {
        const pos = clockPosition(num.deg);
        return (
          <div
            key={num.value}
            aria-hidden="true"
            className={cx('mtx-time-picker__number', num.selected && 'mtx-time-picker__number--selected')}
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              ...(num.disabled && !num.selected ? { color: 'var(--mtx-color-text-disabled)' } : null),
            }}
          >
            {num.text}
          </div>
        );
      })}
    </div>
  );
});
