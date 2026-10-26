'use client';
import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactElement, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/avatar.css';
import { cx } from '../../core';
import { useT } from '../../i18n';

/** Solapamiento: `medium` (8px, por defecto), `small` (16px) o píxeles. */
export type AvatarGroupSpacing = 'small' | 'medium' | number;

/** Propiedades de {@link AvatarGroup}. */
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Máximo de elementos visibles, incluido el indicador `+N` (por defecto 5, mínimo 2). */
  max?: number;
  /** Total lógico de avatares (incluye usuarios no montados). */
  total?: number | null;
  /** Solapamiento entre avatares. */
  spacing?: AvatarGroupSpacing;
  /** Nombre accesible del grupo (`aria-label`). */
  label?: string;
  /** Plantilla accesible del excedente; `{count}` = cantidad (por defecto traducida). */
  surplusLabel?: string;
  /** Idioma local de los textos (prevalece sobre el proveedor). */
  locale?: string;
  /** Avatares del grupo; cuenta cada hijo válido (también un Avatar envuelto en Badge o Tooltip), como MUI. */
  children?: ReactNode;
}

const SPACING_PRESETS: Record<string, number> = { small: 16, medium: 8 };

/**
 * Normaliza un entero con mínimo como en vanilla.
 * @param {unknown} value Valor.
 * @param {number|null} fallback Alternativa.
 * @param {number} minimum Mínimo.
 * @returns {number|null} Entero.
 */
function toInteger(value: unknown, fallback: number | null, minimum: number): number | null {
  if (value === undefined || value === null) return fallback;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? Math.max(minimum, parsed) : fallback;
}

/**
 * Calcula el estado visible de un grupo (lógica de `AvatarGroup.refresh()` de vanilla).
 * @param {number} count Avatares montados.
 * @param {number} max Máximo visible (incluido el excedente).
 * @param {number|null} total Total lógico.
 * @returns {{ visible: number, surplus: number }} Avatares visibles y excedente (0 si no hay).
 */
export function getAvatarGroupLayout(count: number, max: number, total: number | null): { visible: number; surplus: number } {
  const logical = Math.max(total ?? count, count);
  if (logical <= max) return { visible: count, surplus: 0 };
  const visible = Math.max(1, max - 1);
  return { visible, surplus: logical - visible };
}

/**
 * Grupo de avatares (AvatarGroup de MUI): los solapa y resume el excedente con `+N`.
 */
export const AvatarGroup = forwardRef(function AvatarGroup(
  { max: maxProp, total: totalProp, spacing = 'medium', label, surplusLabel, locale, className, style, children, ...rest }: AvatarGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const t = useT('avatarGroup', locale);
  const max = toInteger(maxProp, 5, 2) as number;
  const total = toInteger(totalProp, null, 0);
  const avatars = Children.toArray(children).filter(isValidElement) as ReactElement<{ hidden?: boolean }>[];
  const { visible, surplus } = getAvatarGroupLayout(avatars.length, max, total);

  const overlap = typeof spacing === 'string' && spacing in SPACING_PRESETS
    ? SPACING_PRESETS[spacing]
    : Math.max(0, Number.parseFloat(String(spacing)) || 0);
  const rootStyle = { '--mtx-avatar-group-overlap': `${overlap}px`, ...style } as CSSProperties;

  const template = surplusLabel ?? t('surplus', null, '{count} more');

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('mtx-avatar-group', className)}
      style={rootStyle}
      role={rest.role ?? 'group'}
      aria-label={rest['aria-label'] ?? label}
    >
      {/* Los excedentes se ocultan con `hidden`, como en vanilla, para no desmontarlos. */}
      {avatars.map((avatar, index) => (index < visible ? avatar : cloneElement(avatar, { hidden: true })))}
      {surplus > 0 ? (
        <span className="mtx-avatar mtx-avatar--surplus" role="img" aria-label={template.replace('{count}', String(surplus))}>
          {`+${surplus}`}
        </span>
      ) : null}
    </div>
  );
});

AvatarGroup.displayName = 'AvatarGroup';
