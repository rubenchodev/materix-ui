'use client';
/**
 * AppBar: barra superior de la aplicación (port de `app-bar.js` de Materix UI vanilla).
 */
import { Children, forwardRef, isValidElement, useEffect, useState } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/app-bar.css';
import { cx, resolveTarget } from '../../core';
import type { ElementTarget } from '../../core';
import { useT } from '../../i18n';
import { IconButton } from '../icon-button';
import { Toolbar, ToolbarTitle } from './Toolbar';
import type { ToolbarVariant } from './Toolbar';

/** Posición de la barra. */
export type AppBarPosition = 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';

/** Color de la barra; `default` es la superficie paper. */
export type AppBarColor = 'default' | 'primary' | 'secondary' | 'transparent' | 'inherit';

/** Contenedor cuyo scroll se observa: elemento, ref, función, `window` o selector CSS. */
export type AppBarScrollTarget = ElementTarget<HTMLElement | Window> | string;

/** Umbral (px) a partir del cual `hideOnScroll` oculta la barra al bajar. */
const HIDE_THRESHOLD = 50;

/** Props de {@link AppBar}. */
export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'color'> {
  /** Posición (por defecto `fixed`). */
  position?: AppBarPosition;
  /** Color (por defecto `default`). */
  color?: AppBarColor;
  /** Sombra `0`–`24` (sin ella, la elevación 4 del CSS). `0` añade `--flat`. */
  elevation?: number;
  /** Sin sombra arriba del todo; la elevación aparece al desplazarse. */
  elevateOnScroll?: boolean;
  /** Se oculta al bajar (más de 50px) y reaparece al subir. */
  hideOnScroll?: boolean;
  /** Contenedor observado por `elevateOnScroll`/`hideOnScroll` (por defecto `window`). */
  scrollTarget?: AppBarScrollTarget;
  /** Ancla la barra abajo (con `fixed` o `absolute`). */
  bottom?: boolean;
  /** `z-index` por encima de un Drawer recortado (patrón clipped). */
  clipped?: boolean;
  /** Título generado (`.mtx-toolbar__title`). */
  title?: ReactNode;
  /** Icono del botón de navegación inicial (nombre de Material Icons o nodo). */
  startIcon?: ReactNode;
  /** `aria-label` del botón de navegación (por defecto "Open navigation" con `menu` o `navigationControls`). */
  startIconLabel?: string;
  /** Clic en el botón de navegación (p. ej. abrir un Drawer). */
  onNavigationClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  /** Id del elemento que controla el botón de navegación (`aria-controls`, p. ej. un Drawer). */
  navigationControls?: string;
  /** Estado `aria-expanded` del botón de navegación cuando hay `navigationControls`. */
  navigationExpanded?: boolean;
  /** Icono de la acción final (tras los hijos). */
  endIcon?: ReactNode;
  /** `aria-label` de la acción final (por defecto el nombre del icono). */
  endIconLabel?: string;
  /** Clic en la acción final. */
  onEndIconClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  /** Toolbar densa de 48px (atajo de `toolbarVariant="dense"`). */
  dense?: boolean;
  /** Altura de la Toolbar generada. */
  toolbarVariant?: ToolbarVariant;
  /** Quita los márgenes laterales de la Toolbar generada. */
  disableGutters?: boolean;
  /** Elemento raíz (por defecto `header`). */
  component?: ElementType;
  /** Contenido; si incluye una `Toolbar` no se genera ninguna (sintaxis completa). */
  children?: ReactNode;
}

/**
 * Lee la posición vertical de scroll del objetivo.
 * @param {HTMLElement|Window} target Objetivo.
 * @returns {number} Píxeles desplazados.
 */
function getScrollY(target: HTMLElement | Window): number {
  if (target !== window && 'scrollTop' in target) return (target as HTMLElement).scrollTop;
  return window.scrollY || document.documentElement.scrollTop;
}

/**
 * Resuelve el objetivo del scroll; si no existe se usa `window`.
 * @param {AppBarScrollTarget} [target] Objetivo declarado.
 * @returns {HTMLElement|Window} Objetivo.
 */
function resolveScrollTarget(target?: AppBarScrollTarget): HTMLElement | Window {
  if (typeof target === 'string') return (document.querySelector(target) as HTMLElement | null) ?? window;
  return resolveTarget(target) ?? window;
}

/**
 * Barra de aplicación con Toolbar generada (título, navegación y acción final) o compuesta a mano.
 */
export const AppBar = forwardRef<HTMLElement, AppBarProps>(function AppBar(props, ref) {
  const {
    position = 'fixed',
    color = 'default',
    elevation,
    elevateOnScroll = false,
    hideOnScroll = false,
    scrollTarget,
    bottom = false,
    clipped = false,
    title,
    startIcon,
    startIconLabel,
    onNavigationClick,
    navigationControls,
    navigationExpanded = false,
    endIcon,
    endIconLabel,
    onEndIconClick,
    dense = false,
    toolbarVariant,
    disableGutters = false,
    component: Tag = 'header',
    className,
    style,
    children,
    ...rest
  } = props;

  const t = useT('appBar');
  const [elevated, setElevated] = useState(!elevateOnScroll);
  const [hidden, setHidden] = useState(false);
  const [animated, setAnimated] = useState(false);

  // Transiciones tras el primer frame pintado: el estado inicial no se anima.
  useEffect(() => {
    if (typeof requestAnimationFrame !== 'function') {
      setAnimated(true);
      return undefined;
    }
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setAnimated(true));
    });
    return () => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
    };
  }, []);

  // Elevación y ocultación ligadas al scroll (un cálculo por frame).
  useEffect(() => {
    if (!elevateOnScroll && !hideOnScroll) {
      setHidden(false);
      return undefined;
    }
    const target = resolveScrollTarget(scrollTarget);
    let lastScrollY = getScrollY(target);
    let frame = 0;
    if (elevateOnScroll) setElevated(lastScrollY > 0);

    const update = () => {
      frame = 0;
      const current = getScrollY(target);
      if (elevateOnScroll) setElevated(current > 0);
      if (hideOnScroll) {
        if (current > lastScrollY && current > HIDE_THRESHOLD) setHidden(true);
        else if (current < lastScrollY) setHidden(false);
      }
      lastScrollY = current;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    target.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      target.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [elevateOnScroll, hideOnScroll, scrollTarget]);

  // Sombra por variable para que --transparent y --flat puedan anularla.
  let shadow: string | undefined;
  if (elevateOnScroll) shadow = elevated ? `var(--mtx-elevation-${elevation ?? 4})` : 'none';
  else if (elevation !== undefined) shadow = `var(--mtx-elevation-${elevation})`;
  const rootStyle = shadow === undefined ? style : ({ ...style, '--mtx-app-bar-shadow': shadow } as CSSProperties);

  const hasToolbar = Children.toArray(children).some((child) => isValidElement(child) && child.type === Toolbar);
  const hasChildren = Children.count(children) > 0;
  const scaffold = !hasToolbar && (title != null || startIcon != null || endIcon != null || hasChildren);

  let content: ReactNode = children;
  if (scaffold) {
    const navLabel =
      startIconLabel ??
      (startIcon === 'menu' || navigationControls
        ? t('openNavigation', null, 'Open navigation')
        : typeof startIcon === 'string'
          ? startIcon
          : undefined);
    content = (
      <Toolbar variant={toolbarVariant ?? (dense ? 'dense' : 'regular')} disableGutters={disableGutters}>
        {startIcon != null && (
          <IconButton
            className="mtx-toolbar__navigation-icon"
            icon={startIcon}
            aria-label={navLabel}
            aria-controls={navigationControls}
            aria-expanded={navigationControls ? navigationExpanded : undefined}
            onClick={onNavigationClick}
          />
        )}
        {title != null ? (
          <ToolbarTitle>{title}</ToolbarTitle>
        ) : (
          startIcon != null && endIcon != null && !hasChildren && <div className="mtx-toolbar__spacer" />
        )}
        {children}
        {endIcon != null && (
          <IconButton
            icon={endIcon}
            aria-label={endIconLabel ?? (typeof endIcon === 'string' ? endIcon : undefined)}
            onClick={onEndIconClick}
          />
        )}
      </Toolbar>
    );
  }

  return (
    <Tag
      ref={ref}
      className={cx(
        'mtx-app-bar',
        `mtx-app-bar--${position}`,
        `mtx-app-bar--${color}`,
        !elevateOnScroll && elevation === 0 && 'mtx-app-bar--flat',
        bottom && 'mtx-app-bar--bottom',
        clipped && 'mtx-app-bar--clipped',
        hidden && 'mtx-app-bar--hidden',
        animated && 'mtx-app-bar--animated',
        className,
      )}
      style={rootStyle}
      {...rest}
    >
      {content}
    </Tag>
  );
});
