'use client';
import { forwardRef, useMemo } from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react';
import '@rubenchodev/materix-ui/components/card.css';
import { cx, useRipple } from '../../core';
import { Avatar } from '../avatar';
import { IconButton } from '../icon-button';
import { useT } from '../../i18n';
import { CardContext } from './CardContext';
import type { CardActionsAlign, CardContextValue } from './CardContext';
import { CardHeader } from './CardHeader';
import { CardMedia } from './CardMedia';
import { composePointerHandlers } from './utils';

/** Elevaciones con estilo propio (MUI): 0–8, 12, 16 y 24. */
export type CardElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12 | 16 | 24;

/** Propiedades propias de {@link Card}. */
export interface CardOwnProps {
  /** `elevation` (sombra, por defecto) u `outlined` (borde sin sombra). */
  variant?: 'elevation' | 'outlined';
  /** Elevación `mtx-card--elevation-{n}`; sin valor, elevación 1. */
  elevation?: CardElevation | number;
  /** Eleva la tarjeta a 8 (`raised` de MUI). */
  raised?: boolean;
  /** Esquinas rectas. */
  square?: boolean;
  /** Toda la tarjeta es interactiva (`role="button"`, foco, ripple, Enter y Espacio). */
  clickable?: boolean;
  /** Deshabilita la tarjeta (`aria-disabled`, sin foco). */
  disabled?: boolean;
  /** Alineación por defecto de sus `CardActions` (`end` por defecto). */
  actionsAlign?: CardActionsAlign;
  /** Atajo: título del encabezado generado. */
  title?: ReactNode;
  /** Atajo: subtítulo del encabezado generado. */
  subheader?: ReactNode;
  /** Atajo: avatar del encabezado; una cadena se pinta como Avatar primario con ese texto. */
  avatar?: ReactNode;
  /** Atajo: acción del encabezado (p. ej. un `IconButton`); se ignora sin `title`, `subheader` ni `avatar`, como en vanilla. */
  action?: ReactNode;
  /** Atajo: Material Icon de un IconButton en el encabezado; se ignora sin `title`, `subheader` ni `avatar`. */
  actionIcon?: string;
  /** `aria-label` del IconButton de `actionIcon` (por defecto i18n `card.actions`). */
  actionLabel?: string;
  /** Atajo: URL de la imagen generada (`CardMedia`). */
  image?: string;
  /** Texto alternativo de la imagen generada; sin él es decorativa. */
  imageAlt?: string;
  /** Alto de la imagen generada (194px por defecto). */
  mediaHeight?: number | string;
  /** Coloca la imagen generada antes del encabezado. */
  mediaTop?: boolean;
}

/** Propiedades de {@link Card}; `component` cambia la etiqueta raíz (por defecto `div`). */
export type CardProps<C extends ElementType = 'div'> = CardOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof CardOwnProps | 'component'>;

type CardComponent = (<C extends ElementType = 'div'>(
  props: CardProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Tarjeta de Materix UI (Card de MUI): superficie con encabezado, media, contenido y acciones.
 */
export const Card = forwardRef(function Card(
  {
    component,
    variant = 'elevation',
    elevation,
    raised = false,
    square = false,
    clickable = false,
    disabled = false,
    actionsAlign,
    title,
    subheader,
    avatar,
    action,
    actionIcon,
    actionLabel,
    image,
    imageAlt,
    mediaHeight,
    mediaTop = false,
    className,
    children,
    onClick,
    onKeyDown,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  }: CardProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const t = useT('card');
  const Root: ElementType = component ?? 'div';
  const nativeInteractive = Root === 'button' || Root === 'a';
  const ripple = useRipple<HTMLElement>({ disabled: !clickable || disabled });
  const context = useMemo<CardContextValue>(() => ({ actionsAlign }), [actionsAlign]);
  const props = rest as Record<string, unknown>;

  const headerAction =
    action ?? (actionIcon ? <IconButton icon={actionIcon} aria-label={actionLabel ?? t('actions', null, 'Actions')} /> : null);
  const headerAvatar =
    typeof avatar === 'string' || typeof avatar === 'number' ? (
      <Avatar color="primary">{avatar}</Avatar>
    ) : (
      avatar
    );
  const hasHeader = title != null || subheader != null || avatar != null;
  const header = hasHeader ? (
    <CardHeader avatar={headerAvatar} title={title} subheader={subheader} action={headerAction} />
  ) : null;
  const media = image ? <CardMedia image={image} alt={imageAlt} height={mediaHeight} /> : null;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled && clickable) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (!clickable || disabled || nativeInteractive || event.defaultPrevented) return;
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const extra: Record<string, unknown> = {};
  if (Root === 'button') extra.type = (props.type as string | undefined) ?? 'button';
  if (clickable && !nativeInteractive) extra.role = (props.role as string | undefined) ?? 'button';
  if (clickable) extra.tabIndex = disabled ? -1 : (props.tabIndex as number | undefined) ?? 0;
  else if (disabled) extra.tabIndex = -1;
  if (disabled) extra['aria-disabled'] = 'true';

  const pointer = clickable
    ? composePointerHandlers(ripple.handlers, { onPointerDown, onPointerUp, onPointerLeave, onPointerCancel })
    : { onPointerDown, onPointerUp, onPointerLeave, onPointerCancel };

  return (
    <CardContext.Provider value={context}>
      <Root
        ref={ref}
        {...rest}
        {...extra}
        className={cx(
          'mtx-card',
          variant === 'outlined' && 'mtx-card--outlined',
          elevation !== undefined && elevation !== null && `mtx-card--elevation-${elevation}`,
          raised && 'mtx-card--raised',
          square && 'mtx-card--square',
          clickable && 'mtx-card--clickable',
          disabled && 'mtx-card--disabled',
          className,
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...pointer}
      >
        {mediaTop ? media : header}
        {mediaTop ? header : media}
        {children}
        {ripple.element}
      </Root>
    </CardContext.Provider>
  );
}) as CardComponent;

Card.displayName = 'Card';
