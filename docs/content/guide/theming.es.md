---
title: "Temas"
description: "Temas claro, oscuro y del sistema con ThemeProvider y useTheme, tema sin parpadeos, temas de marca sobrescribiendo tokens --mtx-* y la referencia completa de tokens."
weight: 40
icon: "palette"
---

Todo el aspecto de Materix sale de **variables CSS `--mtx-*`** (design tokens) incluidas en `@rubenchodev/materix-ui/base.css`. Los componentes nunca usan colores fijos: cambiar un token cambia todos los componentes que lo consumen. Los componentes React usan **exactamente el mismo CSS** que la librería vanilla, así que un tema escrito para una sirve para la otra.

## Tema claro y oscuro

El tema claro es el predeterminado. El oscuro se activa con el atributo `data-mtx-theme="dark"` en `<html>`; el CSS hace el resto, sin volver a renderizar React:

```html
<html lang="es" data-mtx-theme="dark">
```

La clase `.mtx-root` (la renderiza `MaterixProvider`) pinta `--mtx-color-background-default`, `--mtx-color-text-primary` y el `color-scheme` correspondiente (barras de desplazamiento y controles nativos oscuros).

## ThemeProvider y useTheme

`ThemeProvider` gestiona ese atributo por ti. Admite tres modos: `light`, `dark` y `system` (sigue `prefers-color-scheme`, también cuando el sistema lo cambia). `MaterixProvider` lo incluye, así que rara vez necesitas renderizarlo directamente.

```tsx
import { ThemeProvider, useTheme, Button } from '@rubenchodev/materix-react';

function ThemeSwitch() {
  const { mode, resolvedMode, setMode, toggle } = useTheme();
  return (
    <>
      <Button onClick={toggle}>{resolvedMode === 'dark' ? 'Tema claro' : 'Tema oscuro'}</Button>
      <Button variant={mode === 'system' ? 'contained' : 'text'} onClick={() => setMode('system')}>
        Sistema
      </Button>
    </>
  );
}

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <ThemeSwitch />
    </ThemeProvider>
  );
}
```

### Props de ThemeProvider

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `defaultMode` | `'light' \| 'dark' \| 'system'` | `'light'` | Modo inicial (no controlado). |
| `mode` | `'light' \| 'dark' \| 'system'` | — | Modo controlado; combínalo con `onModeChange`. |
| `onModeChange` | `(mode, resolvedMode) => void` | — | Se llama cada vez que cambia el modo. |
| `storageKey` | `string \| null \| false` | `'mtx-theme'` | Clave de `localStorage` que persiste el modo; `false` desactiva la persistencia. |
| `query` | `string \| false` | `'theme'` | Parámetro de URL que fuerza un modo (`?theme=dark`); `false` lo desactiva. |
| `target` | `'document' \| 'none'` | `'document'` | `document` escribe `data-mtx-theme` en `<html>`; `none` no escribe nada (temas acotados). |

Precedencia inicial (no controlado): `?theme=` › valor guardado › `defaultMode` › `light`.

### useTheme

`useTheme()` devuelve `{ mode, resolvedMode, setMode, toggle, target }`. `resolvedMode` siempre es `light` o `dark` (el tema efectivo cuando `mode` es `system`). `setMode(mode, { persist: false })` aplica un modo sin guardarlo. Fuera de un proveedor devuelve `light` y acciones vacías.

### Evitar el parpadeo al cargar

Con renderizado en servidor, el tema guardado solo se conoce en el navegador. Añade al `<head>` el script en línea que devuelve `getThemeScript()` (o el componente `<ThemeScript />`) para que `data-mtx-theme` quede aplicado antes del primer pintado. Consulta [Uso con Next.js]({{< relref "/guide/usage-with-nextjs" >}}).

## Tema acotado

`MaterixProvider` con `target="none"` no toca `<html>`: escribe `data-mtx-theme` en su propio contenedor `.mtx-root`, así que solo ese subárbol cambia de tema.

```tsx
<MaterixProvider mode="dark" target="none" className="preview">
  <Button variant="contained">Oscuro solo aquí</Button>
</MaterixProvider>
```

Las capas flotantes renderizadas mediante portales bajo `<body>` (menús, diálogos, snackbars) toman el tema de `<html>`, no el del contenedor. Para un tema completo sin sorpresas, mantén el `target="document"` por defecto.

## Tema de marca

Sobrescribe los tokens en tu propia hoja de estilos, **cargada después** de `base.css`. Declara siempre los dos bloques, claro y oscuro:

```css
/* brand.css — cargar después de base.css */
:root {
  --mtx-color-primary: #00695c;
  --mtx-color-primary-light: #e0f2f1;
  --mtx-color-primary-dark: #004d40;
  --mtx-color-primary-contrast: #ffffff;

  --mtx-color-secondary: #ef6c00;
  --mtx-color-secondary-light: #ffa040;
  --mtx-color-secondary-dark: #b53d00;
  --mtx-color-secondary-contrast: #ffffff;

  --mtx-shape-radius: 8px;
}

[data-mtx-theme='dark'] {
  --mtx-color-primary: #4db6ac;
  --mtx-color-primary-light: #b2dfdb;
  --mtx-color-primary-dark: #00897b;
  --mtx-color-primary-contrast: rgba(0, 0, 0, 0.87);

  --mtx-color-secondary: #ffb74d;
  --mtx-color-secondary-light: #ffe0b2;
  --mtx-color-secondary-dark: #f57c00;
  --mtx-color-secondary-contrast: rgba(0, 0, 0, 0.87);
}
```

{{< callout type="warning" title="Sobrescribe cada token en ambos bloques" >}}
`:root` y `[data-mtx-theme='dark']` tienen la misma especificidad. Cuando `<html>` lleva el tema oscuro coinciden los dos selectores y gana el último declarado. Como tu `:root` se carga después del CSS de Materix, un token que redefinas solo en `:root` también **pisará el valor oscuro de la librería**. Si cambias un color en `:root`, dale también su valor oscuro en tu bloque `[data-mtx-theme='dark']`.
{{< /callout >}}

Reglas para elegir valores:

- `-contrast` es el color del texto **sobre** el color principal: debe tener contraste mínimo 4.5:1 (WCAG AA).
- `-dark` se usa en el hover de los botones y FAB contained; `-light` en fondos suaves (rango del calendario) y en la acción del Snackbar.
- `-text` (`--mtx-color-{color}-text`) es el color para texto e iconos de ese color **sobre el fondo** (Button text/outlined, Link, Typography…). Por defecto alcanza 4.5:1 (WCAG AA): es el color principal cuando basta, o un tono más oscuro (tema claro) o más claro (tema oscuro) del mismo; `data-mtx-contrast="mui"` restaura los valores exactos de MUI (ver [Contraste de color](https://qualitycode.dev/materix-ui/vainilla/es/guide/accessibility/#contraste-de-color)). Si cambias un color principal, revisa también su `-text` y su `-contrast` (el [generador de tema](https://qualitycode.dev/materix-ui/vainilla/es/guide/theme-builder/) los calcula).
- En oscuro, usa tonos más claros y desaturados del mismo color, como hace MUI.

Los tokens de tipografía (`--mtx-type-*`) se construyen con `--mtx-font-family`. Para cambiar la fuente basta con un token:

```css
:root {
  --mtx-font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
}
```

## Referencia de tokens

Valores extraídos de `src/styles/tokens.css` de `@rubenchodev/materix-ui`. "Igual" significa que el tema oscuro no redefine el token.

### Paleta

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--mtx-color-primary` | `#4818d0` | `#b388ff` | Color principal: botones, foco, selección, controles activos. |
| `--mtx-color-primary-light` | `#e0d8f0` | `#e3d5ff` | Fondos suaves del primario (rango del calendario, acción del Snackbar). |
| `--mtx-color-primary-dark` | `#3813a6` | `#7c4dff` | Hover de Button y Fab contained. |
| `--mtx-color-primary-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Texto sobre `primary`. |
| `--mtx-color-{color}-text` | `primary`/`secondary`: el color; `error`/`info`/`success`: `-dark`; `warning`: `#ac3d00` | `error`: `-light` 70 % + blanco; el resto: el color | Texto e iconos del color sobre el fondo, ≥ 4.5:1 (AA). `data-mtx-contrast="mui"` → `var(--mtx-color-{color})`. |
| `--mtx-color-secondary` | `#9c27b0` | `#ce93d8` | Color secundario (`--secondary` en los componentes). |
| `--mtx-color-secondary-light` | `#ba68c8` | `#f3e5f5` | Variante clara. |
| `--mtx-color-secondary-dark` | `#7b1fa2` | `#ab47bc` | Hover del secundario. |
| `--mtx-color-secondary-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Texto sobre `secondary`. |
| `--mtx-color-error` | `#d32f2f` | `#f44336` | Errores de validación, acciones destructivas. |
| `--mtx-color-error-light` | `#ef5350` | `#e57373` | Variante clara. |
| `--mtx-color-error-dark` | `#c62828` | `#d32f2f` | Hover. |
| `--mtx-color-error-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Texto sobre `error` (oscuro: `#ffffff` con `data-mtx-contrast="mui"`). |
| `--mtx-color-warning` | `#ed6c02` | `#ffa726` | Advertencias. |
| `--mtx-color-warning-light` | `#ff9800` | `#ffb74d` | Variante clara. |
| `--mtx-color-warning-dark` | `#e65100` | `#f57c00` | Hover. |
| `--mtx-color-warning-contrast` | `rgba(0, 0, 0, 0.87)` | `rgba(0, 0, 0, 0.87)` | Texto sobre `warning` (claro: `#ffffff` con `data-mtx-contrast="mui"`). |
| `--mtx-color-info` | `#0288d1` | `#64b5f6` | Mensajes informativos. |
| `--mtx-color-info-light` | `#03a9f4` | `#90caf9` | Variante clara. |
| `--mtx-color-info-dark` | `#01579b` | `#42a5f5` | Hover. |
| `--mtx-color-info-contrast` | `rgba(0, 0, 0, 0.87)` | `rgba(0, 0, 0, 0.87)` | Texto sobre `info` (claro: `#ffffff` con `data-mtx-contrast="mui"`). |
| `--mtx-color-success` | `#2e7d32` | `#66bb6a` | Confirmaciones. |
| `--mtx-color-success-light` | `#4caf50` | `#81c784` | Variante clara. |
| `--mtx-color-success-dark` | `#1b5e20` | `#388e3c` | Hover. |
| `--mtx-color-success-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Texto sobre `success`. |
| `--mtx-color-common-white` | `#fff` | Igual | Blanco puro (MUI `common.white`). |
| `--mtx-color-common-black` | `#000` | Igual | Negro puro (MUI `common.black`). |
| `--mtx-color-grey-50` | `#fafafa` | Igual | Gris auxiliar. |
| `--mtx-color-grey-100` | `#f5f5f5` | Igual | Botón de colapso de Breadcrumbs (claro). |
| `--mtx-color-grey-200` | `#eeeeee` | Igual | Gris auxiliar. |
| `--mtx-color-grey-300` | `#e0e0e0` | Igual | Fondo de Chip (claro). |
| `--mtx-color-grey-400` | `#bdbdbd` | Igual | Gris auxiliar. |
| `--mtx-color-grey-600` | `#757575` | Igual | Gris auxiliar. |
| `--mtx-color-grey-700` | `#616161` | Igual | Botón de colapso de Breadcrumbs (oscuro). |
| `--mtx-color-grey-800` | `#424242` | Igual | Fondo de Chip y Avatar (oscuro). |

### Texto, fondo y divisores

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--mtx-color-text-primary` | `rgba(0, 0, 0, 0.87)` | `#ffffff` | Texto principal. |
| `--mtx-color-text-secondary` | `rgba(0, 0, 0, 0.6)` | `rgba(255, 255, 255, 0.7)` | Texto secundario, labels, helper text. |
| `--mtx-color-text-disabled` | `rgba(0, 0, 0, 0.38)` | `rgba(255, 255, 255, 0.5)` | Texto deshabilitado. |
| `--mtx-color-background-default` | `#f8fafc` | `#121212` | Fondo de página (`.mtx-root`). |
| `--mtx-color-background-paper` | `#ffffff` | `#1e1e1e` | Superficies: Paper, Card, Dialog, Menu. |
| `--mtx-color-divider` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.12)` | Divider, bordes de tablas y listas. |
| `--mtx-color-input-filled` | `rgba(0, 0, 0, 0.06)` | `rgba(255, 255, 255, 0.09)` | Fondo de campos `filled`. |
| `--mtx-color-input-filled-hover` | `rgba(0, 0, 0, 0.09)` | `rgba(255, 255, 255, 0.13)` | Hover de campos `filled`. |

### Estados (action)

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--mtx-color-action-active` | `rgba(0, 0, 0, 0.54)` | `rgba(255, 255, 255, 0.56)` | Iconos activos. |
| `--mtx-color-action-hover` | `rgba(0, 0, 0, 0.04)` | `rgba(255, 255, 255, 0.08)` | Capa de hover. |
| `--mtx-color-action-selected` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.16)` | Elementos seleccionados (listas, menús, filas). |
| `--mtx-color-action-focus` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.12)` | Capa de foco. |
| `--mtx-color-action-disabled` | `rgba(0, 0, 0, 0.26)` | `rgba(255, 255, 255, 0.3)` | Contenido deshabilitado. |
| `--mtx-color-action-disabled-background` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.12)` | Fondo deshabilitado (botones contained). |
| `--mtx-disabled-opacity` | `0.38` | Igual | Opacidad de elementos deshabilitados. |
| `--mtx-focus-ring-width` | `2px` | Igual | Grosor del anillo de foco visible. |
| `--mtx-focus-ring-color` | `var(--mtx-color-primary)` | Igual | Color del anillo de foco visible. |

### Tipografía

Cada token `--mtx-type-*` es un valor completo de la propiedad `font` (peso, tamaño/interlineado y familia): úsalo como `font: var(--mtx-type-body1)`.

| Token | Valor | Uso |
|---|---|---|
| `--mtx-font-family` | `'Roboto', 'Helvetica', 'Arial', sans-serif` | Familia de toda la librería. |
| `--mtx-type-h1` | `300 6rem/1.167` | Titular 1. |
| `--mtx-type-h2` | `300 3.75rem/1.2` | Titular 2. |
| `--mtx-type-h3` | `400 3rem/1.167` | Titular 3. |
| `--mtx-type-h4` | `400 2.125rem/1.235` | Titular 4. |
| `--mtx-type-h5` | `400 1.5rem/1.334` | Titular 5. |
| `--mtx-type-h6` | `500 1.25rem/1.6` | Titular 6, títulos de Dialog y Drawer. |
| `--mtx-type-subtitle1` | `400 1rem/1.75` | Subtítulo 1. |
| `--mtx-type-subtitle2` | `500 0.875rem/1.57` | Subtítulo 2. |
| `--mtx-type-body1` | `400 1rem/1.5` | Texto base. |
| `--mtx-type-body2` | `400 0.875rem/1.43` | Texto secundario, celdas, listas. |
| `--mtx-type-button` | `500 0.875rem/1.75` | Botones. |
| `--mtx-type-caption` | `400 0.75rem/1.66` | Helper text, leyendas. |
| `--mtx-type-overline` | `400 0.75rem/2.66` | Rótulos en mayúsculas. |

Los tokens tipográficos no cambian con el tema.

### Forma

| Token | Valor | Uso |
|---|---|---|
| `--mtx-shape-radius` | `4px` | Radio por defecto (botones, campos, Paper, Card). |
| `--mtx-shape-small` | `8px` | Radio alternativo. |
| `--mtx-shape-full` | `50%` | Formas circulares (Avatar, IconButton, botón de cierre de Alert). |

### Elevación

Sombras MUI. Iguales en ambos temas. Solo existen los niveles listados.

| Token | Uso típico |
|---|---|
| `--mtx-elevation-0` | Sin sombra (`none`). |
| `--mtx-elevation-1` | Paper y Card por defecto. |
| `--mtx-elevation-2` | Button contained en reposo. |
| `--mtx-elevation-3` … `--mtx-elevation-7` | Niveles intermedios (`mtx-paper--elevation-N`). |
| `--mtx-elevation-8` | Menús y popovers. |
| `--mtx-elevation-12` | Fab presionado. |
| `--mtx-elevation-16` | Drawer (`--mtx-drawer-elevation`). |
| `--mtx-elevation-24` | Dialog. |

No hay tokens para los niveles 9-11, 13-15 ni 17-23.

#### Capa del tema oscuro

En tema oscuro, como en MUI, las superficies elevadas reciben además una capa blanca que las aclara cuanto más altas están. `--mtx-overlay-elevation-0` … `--mtx-overlay-elevation-24` contienen un `linear-gradient` con alfa = (4,5·ln(N+1) + 2) / 100 (0,05 en el nivel 1, 0,12 en el 8, 0,16 en el 24) y valen `none` en el tema claro. Paper, Card, Accordion, Menu, el menú de Select y Dialog los aplican mediante `background-image`; tus superficies propias pueden hacer lo mismo:

```css
.mi-panel {
  background-color: var(--mtx-color-background-paper);
  box-shadow: var(--mtx-elevation-4);
  background-image: var(--mtx-overlay-elevation-4);
}
```

### Espaciado

Unidad base de 8px. Lo consumen Grid, Stack y las utilidades `mtx-m-*`/`mtx-p-*` (importa `@rubenchodev/materix-ui/utilities.css` para usarlas).

| Token | Valor |
|---|---|
| `--mtx-spacing-0_5` | `4px` |
| `--mtx-spacing-1` | `8px` |
| `--mtx-spacing-1_5` | `12px` |
| `--mtx-spacing-2` | `16px` |
| `--mtx-spacing-3` | `24px` |
| `--mtx-spacing-4` | `32px` |
| `--mtx-spacing-5` | `40px` |
| `--mtx-spacing-6` | `48px` |
| `--mtx-spacing-8` | `64px` |
| `--mtx-spacing-10` | `80px` |

### Alturas de control

| Token | Valor | Uso |
|---|---|---|
| `--mtx-size-large-height` | `48px` | Button / IconButton large. |
| `--mtx-size-medium-height` | `40px` | Button / IconButton medium (por defecto). |
| `--mtx-size-small-height` | `32px` | Button / IconButton small. |
| `--mtx-field-height-medium` | `56px` | TextField / Select por defecto. |
| `--mtx-field-height-small` | `40px` | TextField / Select small. |
| `--mtx-control-height-*` | alias de `--mtx-field-height-*` | Alturas por variante (`outlined`, `filled`, `standard`, `borderless`). |

### Motion

| Token | Valor | Uso |
|---|---|---|
| `--mtx-duration-shortest` | `150ms` | Hover, cambios de color. |
| `--mtx-duration-shorter` | `200ms` | Transiciones breves. |
| `--mtx-duration-short` | `250ms` | Transiciones cortas. |
| `--mtx-duration-standard` | `300ms` | Transición estándar. |
| `--mtx-duration-complex` | `375ms` | Transiciones complejas. |
| `--mtx-duration-ripple` | `550ms` | Expansión del ripple. |
| `--mtx-easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Curva por defecto. |
| `--mtx-easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entradas (desaceleración). |
| `--mtx-easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Salidas (aceleración). |

Con `prefers-reduced-motion: reduce`, la librería reduce todas las animaciones y transiciones a 0.01ms, sin importar estos valores.

### Z-index

| Token | Valor | Uso |
|---|---|---|
| `--mtx-z-index-mobile-stepper` | `1000` | Reservado. |
| `--mtx-z-index-speed-dial` | `1050` | SpeedDial. |
| `--mtx-z-index-app-bar` | `1100` | AppBar. |
| `--mtx-z-index-drawer` | `1200` | Drawer. |
| `--mtx-z-index-modal` | `1300` | Dialog, Menu y portal de capas flotantes. |
| `--mtx-z-index-snackbar` | `1400` | Snackbar. |
| `--mtx-z-index-tooltip` | `1500` | Tooltips. |

{{< callout type="info" >}}
AppBar, Drawer, Dialog y Snackbar leen sus tokens de z-index. Menu, el portal y SpeedDial siguen usando los mismos valores escritos en su CSS, así que sobrescribir `--mtx-z-index-speed-dial` (o `--mtx-z-index-modal` para los menús) aún no les afecta.
{{< /callout >}}

### Tokens de componente

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--mtx-drawer-width` | `300px` | Igual | Ancho del Drawer. |
| `--mtx-drawer-width-tablet` | `280px` | Igual | Ancho en tablet. |
| `--mtx-drawer-width-mobile` | `min(85vw, 320px)` | Igual | Ancho en móvil. |
| `--mtx-drawer-width-narrow` | `200px` | Igual | Variante estrecha. |
| `--mtx-drawer-width-wide` | `360px` | Igual | Variante ancha. |
| `--mtx-drawer-elevation` | `var(--mtx-elevation-16)` | Igual | Sombra del Drawer. |
| `--mtx-avatar-default-bg` / `--mtx-avatar-default-color` | grey 600 / `#ffffff` | Igual | Avatar por defecto (contraste AA; MUI usa grey 400). |
| `--mtx-switch-track` | `rgba(0, 0, 0, 0.38)` | `rgba(255, 255, 255, 0.3)` | Pista del Switch apagado. |
| `--mtx-switch-track-checked` | `rgba(0, 0, 0, 0.5)` | `rgba(255, 255, 255, 0.5)` | Pista del Switch encendido. |
| `--mtx-switch-track-disabled` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.2)` | Pista deshabilitada. |
| `--mtx-switch-thumb` | `#ffffff` | `#e0e0e0` | Pulgar del Switch. |
| `--mtx-switch-thumb-disabled` | `#fafafa` | `#757575` | Pulgar deshabilitado. |
| `--mtx-chip-height` | `32px` | Igual | Alto del Chip medium. |
| `--mtx-chip-height-small` | `24px` | Igual | Alto del Chip small. |
| `--mtx-chip-radius` | `16px` | Igual | Radio del Chip medium. |
| `--mtx-chip-radius-small` | `12px` | Igual | Radio del Chip small. |
| `--mtx-chip-font-size` | `0.8125rem` | Igual | Texto del Chip medium. |
| `--mtx-chip-font-size-small` | `0.75rem` | Igual | Texto del Chip small. |
| `--mtx-chip-label-padding` | `0 12px` | Igual | Relleno de la etiqueta. |
| `--mtx-chip-label-padding-small` | `0 8px` | Igual | Relleno en small. |
| `--mtx-chip-delete-size` | `22px` | Igual | Icono de borrar. |
| `--mtx-chip-delete-size-small` | `16px` | Igual | Icono de borrar en small. |
| `--mtx-chip-bg` | `var(--mtx-color-grey-300)` | `var(--mtx-color-grey-800)` | Fondo del Chip filled default. |
| `--mtx-chip-bg-hover` | mezcla de grey-300 y grey-400 | mezcla de grey-800 y grey-700 | Hover del Chip. |
| `--mtx-chip-text` | `var(--mtx-color-text-primary)` | Igual | Texto del Chip. |
| `--mtx-chip-delete-color` | `rgba(0, 0, 0, 0.26)` | `rgba(255, 255, 255, 0.26)` | Icono de borrar. |
| `--mtx-chip-delete-color-hover` | `rgba(0, 0, 0, 0.4)` | `rgba(255, 255, 255, 0.4)` | Icono de borrar en hover. |
| `--mtx-breadcrumbs-collapse-bg` | `var(--mtx-color-grey-100)` | `var(--mtx-color-grey-700)` | Fondo del botón de colapso de Breadcrumbs. |
| `--mtx-breadcrumbs-collapse-bg-hover` | `var(--mtx-color-grey-200)` | `var(--mtx-color-grey-600)` | Hover del botón de colapso de Breadcrumbs. |
| `--mtx-breadcrumbs-collapse-color` | `var(--mtx-color-grey-700)` | `var(--mtx-color-grey-100)` | Icono del botón de colapso de Breadcrumbs. |
| `--mtx-rating-color` | `#faaf00` | Igual | Iconos llenos de Rating. |
| `--mtx-alert-text-mix` | `#000` | `#fff` | Texto de Alert `standard`/`outlined`: 40 % del color de la severidad + este tono. |
| `--mtx-alert-bg-mix` | `#fff` | `#000` | Fondo de Alert `standard`: 10 % del color de la severidad + este tono. |
| `--mtx-snackbar-bg` | `background-default` + 80 % negro | `background-default` + 80 % blanco | Superficie del Snackbar (`emphasize` de MUI). |
| `--mtx-snackbar-color` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | Texto del Snackbar. |
| `--mtx-snackbar-action-color` | primary + 55 % blanco | primary + 45 % negro | Acción del Snackbar. |

Las páginas de cada componente documentan, en **Variables CSS**, los tokens que consume.
