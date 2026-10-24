'use client';

import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { I18nProvider } from '../i18n/I18nProvider';
import type { LocaleMessages } from '../i18n/types';
import { ThemeProvider, useTheme } from './ThemeProvider';
import type { ThemeProviderProps } from './ThemeProvider';

/** Props de {@link MaterixProvider}. */
export interface MaterixProviderProps
  extends Omit<ThemeProviderProps, 'children'>,
    Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Idioma de los textos (`es`, `es-MX`); prevalece sobre `<html lang>`. */
  locale?: string;
  /** Textos que sobrescriben el registro, por idioma. */
  messages?: LocaleMessages;
  /** Elemento raíz (`div` por defecto). */
  as?: ElementType;
  /** No renderiza el contenedor `.mtx-root` (p. ej. si `<body class="mtx-root">` ya existe). */
  disableRoot?: boolean;
  children?: ReactNode;
}

type RootProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  as?: ElementType;
  disableRoot?: boolean;
  lang?: string;
  children?: ReactNode;
};

/**
 * Contenedor `.mtx-root` (tipografía, box-sizing, `[hidden]` y `:focus-visible` de base.css).
 * Con `target="none"` lleva `data-mtx-theme` para un tema acotado al subárbol.
 */
function MaterixRoot({ as: Root = 'div', disableRoot, className, children, ...rest }: RootProps) {
  const { resolvedMode, target } = useTheme();
  if (disableRoot) return <>{children}</>;
  const classes = className ? `mtx-root ${className}` : 'mtx-root';
  return (
    <Root
      {...rest}
      className={classes}
      data-mtx-theme={target === 'none' ? resolvedMode : undefined}
    >
      {children}
    </Root>
  );
}

/**
 * Proveedor raíz de Materix UI: tema + idioma + contenedor `.mtx-root`.
 */
export function MaterixProvider({
  mode,
  defaultMode,
  storageKey,
  query,
  target,
  onModeChange,
  locale,
  messages,
  children,
  ...rootProps
}: MaterixProviderProps) {
  return (
    <ThemeProvider
      mode={mode}
      defaultMode={defaultMode}
      storageKey={storageKey}
      query={query}
      target={target}
      onModeChange={onModeChange}
    >
      <I18nProvider locale={locale} messages={messages}>
        <MaterixRoot lang={rootProps.lang ?? locale} {...rootProps}>
          {children}
        </MaterixRoot>
      </I18nProvider>
    </ThemeProvider>
  );
}
