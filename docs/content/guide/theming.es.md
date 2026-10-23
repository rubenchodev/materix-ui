---
title: "Temas y personalización"
description: "Activa el tema oscuro, cámbialo con Materix.theme, sigue la preferencia del sistema, crea un tema de marca sobrescribiendo tokens y consulta todos los --mtx-*."
weight: 40
icon: "palette"
---

Todo el aspecto de Materix sale de **variables CSS `--mtx-*`** (design tokens). Los componentes nunca usan colores fijos: cambiar un token cambia todos los componentes que lo consumen. Un tema es, simplemente, un conjunto de valores para esos tokens.

## Tema claro y oscuro

El tema claro es el predeterminado. Para el oscuro, añade `data-mtx-theme="dark"` a `<html>`:

```html
<html lang="es" data-mtx-theme="dark">
```

Para que el fondo y el texto de la página sigan al tema, pon `class="mtx-root"` en `<body>`: aplica `--mtx-color-background-default`, `--mtx-color-text-primary` y el `color-scheme` adecuado (barras de desplazamiento y controles nativos oscuros).

## API de tema

La librería incluye una pequeña API para leer y cambiar el tema, disponible como `Materix.theme` (UMD) o `import { theme } from 'materix-ui'` (ES modules). Escribe el tema efectivo en `<html data-mtx-theme>` y el modo elegido en `<html data-mtx-theme-mode>`. Al cargar solo lee el atributo actual: si tu página no define nada, no cambia nada.

| Método | Retorna | Descripción |
|---|---|---|
| `theme.get()` | `'light'` \| `'dark'` | Tema efectivo (con `system`, el que prefiere el sistema). |
| `theme.getMode()` | `'light'` \| `'dark'` \| `'system'` | Modo elegido. |
| `theme.set(mode, { persist? })` | `'light'` \| `'dark'` | Aplica `light`, `dark` o `system`. Lo guarda si la persistencia está activa (`persist: false` evita guardarlo una vez). Lanza `TypeError` con otros valores. |
| `theme.toggle()` | `'light'` \| `'dark'` | Alterna entre claro y oscuro (desde `system`, al opuesto del tema efectivo). |
| `theme.configure({ persist, query })` | `'light'` \| `'dark'` | Activa la persistencia (`true` o una clave de localStorage) y el parámetro de URL (`true` o un nombre de parámetro) y aplica el modo guardado/forzado. |
| `theme.sync(root?)` | `void` | Vuelve a sincronizar los botones de tema insertados después de la carga. |

```javascript
Materix.theme.set('dark');
Materix.theme.toggle();           // 'light'
Materix.theme.set('system');      // sigue prefers-color-scheme, también cuando el sistema cambia

document.addEventListener('mtx:theme:change', (event) => {
  const { theme, mode, previous } = event.detail;   // p. ej. 'dark', 'system', 'light'
  chart.setDarkMode(theme === 'dark');
});
```

`mtx:theme:change` (alias deprecado hasta la 1.0: `mtx:theme-change`) se emite en `document` cada vez que cambia el tema efectivo o el modo, también cuando otro código edita `data-mtx-theme` directamente. Escribir `light` o `dark` a mano fija además ese modo, incluso en modo `system` cuando el valor coincide con el tema efectivo actual (deja de seguir al sistema operativo).

### Botones de tema

Cualquier elemento con `data-mtx-theme-toggle` funciona sin JavaScript:

- **Sin valor**: alterna entre claro y oscuro. Recibe `aria-pressed` (`true` en oscuro), un `aria-label` estable del diccionario i18n (`Dark theme` / `Tema oscuro`), un `title` con la acción siguiente (`Cambiar a tema claro`…) y su `.material-icons` cambia entre `dark_mode` y `light_mode` (personalizable con `data-icon-light` / `data-icon-dark`; `data-mtx-theme-static-icon` lo deja intacto).
- **Con valor** (`light`, `dark` o `system`): fija ese modo y marca `aria-pressed="true"` en el botón activo, ideal para un control segmentado.

Nunca se sobrescribe un `aria-label`, `aria-labelledby` o texto visible escrito por ti.

{{< mtx-demo title="Botones de tema declarativos" >}}
<button class="mtx-icon-button" data-mtx="icon-button" data-mtx-theme-toggle>
  <span class="material-icons" aria-hidden="true">dark_mode</span>
</button>

<div role="group" aria-label="Tema" class="mtx-d-flex mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-theme-toggle="light">Claro</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-theme-toggle="dark">Oscuro</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-theme-toggle="system">Sistema</button>
</div>
{{< /mtx-demo >}}

### Persistencia y parámetro de URL

Ambos son opcionales y se declaran en `<html>`:

```html
<!-- Recuerda la elección en localStorage['mtx-theme'] (o la clave que indiques) y respeta ?theme=dark|light|system -->
<html lang="es" data-mtx-theme="light" data-mtx-theme-persist data-mtx-theme-query>
```

| Atributo en `<html>` | Valor | Efecto |
|---|---|---|
| `data-mtx-theme` | `light` \| `dark` \| `system` | Modo inicial (`light` si falta). |
| `data-mtx-theme-persist` | vacío o clave de almacenamiento | Guarda cada `set()`/alternancia y lo restaura al cargar. |
| `data-mtx-theme-query` | vacío o nombre del parámetro | `?theme=` fuerza el modo al cargar sin guardarlo (útil para capturas y enlaces). |

Prioridad al cargar: parámetro de URL, valor guardado, `data-mtx-theme-mode` / `data-mtx-theme`, `light`. Las mismas opciones existen en JavaScript: `Materix.theme.configure({ persist: 'mi-clave', query: true })`.

### Evitar el destello al cargar

La librería suele cargarse al final del `<body>`, así que un tema oscuro guardado se aplicaría después del primer pintado. Genera `data-mtx-theme` en el servidor o añade este fragmento **en el `<head>`, antes del CSS**; después la librería toma el mismo valor:

```html
<script>
  (function () {
    var root = document.documentElement;
    var mode = null;
    try { mode = localStorage.getItem('mtx-theme'); } catch (e) {}
    mode = mode || root.getAttribute('data-mtx-theme') || 'light';
    var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-mtx-theme-mode', mode);
    root.setAttribute('data-mtx-theme', dark ? 'dark' : 'light');
  })();
</script>
```

Cualquier valor de `data-mtx-theme` distinto de `dark` mantiene los tokens claros: el CSS solo lee `[data-mtx-theme='dark']`.

## Tema de marca

Sobrescribe los tokens en tu propia hoja de estilos, **cargada después** de `materix.min.css`. Declara siempre los dos bloques, claro y oscuro:

```css
/* brand.css — cargar después de materix.min.css */
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
- `-text` (`--mtx-color-{color}-text`) es el color para texto e iconos de ese color **sobre el fondo** (Button text/outlined, Link, Typography…). Por defecto alcanza 4.5:1 (WCAG AA): es el color principal cuando basta, o un tono más oscuro (tema claro) o más claro (tema oscuro) del mismo; `data-mtx-contrast="mui"` restaura los valores exactos de MUI (ver [Contraste de color]({{< relref "/guide/accessibility#contraste-de-color" >}})). Si cambias un color principal, revisa también su `-text` y su `-contrast` (el [generador de tema]({{< relref "/guide/theme-builder" >}}) los calcula).
- En oscuro, usa tonos más claros y desaturados del mismo color, como hace MUI.

Los tokens de tipografía (`--mtx-type-*`) se construyen con `--mtx-font-family`. Para cambiar la fuente basta con un token:

```css
:root {
  --mtx-font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
}
```

## Tema por contenedor

Los tokens oscuros se declaran con el selector de atributo `[data-mtx-theme='dark']`, no solo en `:root`. Por eso puedes oscurecer una sección concreta:

{{< mtx-demo title="Sección en tema oscuro" layout="block" >}}
<section data-mtx-theme="dark" class="mtx-root mtx-p-3 mtx-rounded">
  <div class="mtx-d-flex mtx-flex-column mtx-flex-sm-row mtx-align-items-sm-center mtx-gap-2">
    <input class="mtx-flex-1" data-mtx="text-field" data-label="Buscar" data-variant="outlined" data-start-icon="search" />
    <button class="mtx-button mtx-button--contained" data-mtx="button">Aplicar</button>
  </div>
</section>
{{< /mtx-demo >}}

Añade `class="mtx-root"` al contenedor para que pinte su fondo y su color de texto. Limitaciones conocidas:

- **No hay selector para volver al claro.** No existe `[data-mtx-theme='light']`: una sección clara dentro de una página oscura no recupera los valores claros.
- **Tokens derivados.** Los tokens que se definen a partir de otros en `:root` se resuelven en `:root` y el contenedor hereda el valor ya calculado. Afecta a `--mtx-focus-ring-color` (sigue el `primary` de `<html>`), `--mtx-type-*` (siguen el `--mtx-font-family` de `<html>`) y `--mtx-chip-bg-hover`. Para cambiarlos en un contenedor, redeclara también el token derivado.
- **Capas flotantes.** Los menús de Select y Menu se montan en un portal bajo `<body>` (`#mtx-portal`), y los fondos del Drawer y del DateTimePicker también cuelgan de `<body>`. Esas capas toman el tema de `<html>`/`<body>`, no el del contenedor.

Para un tema completo y sin sorpresas, pon `data-mtx-theme` en `<html>`.

## Paleta

{{< mtx-demo title="Colores de la paleta" >}}
<div style="width: 112px; padding: 16px; border-radius: 4px; background: var(--mtx-color-primary); color: var(--mtx-color-primary-contrast);">primary</div>
<div style="width: 112px; padding: 16px; border-radius: 4px; background: var(--mtx-color-secondary); color: var(--mtx-color-secondary-contrast);">secondary</div>
<div style="width: 112px; padding: 16px; border-radius: 4px; background: var(--mtx-color-error); color: var(--mtx-color-error-contrast);">error</div>
<div style="width: 112px; padding: 16px; border-radius: 4px; background: var(--mtx-color-warning); color: var(--mtx-color-warning-contrast);">warning</div>
<div style="width: 112px; padding: 16px; border-radius: 4px; background: var(--mtx-color-info); color: var(--mtx-color-info-contrast);">info</div>
<div style="width: 112px; padding: 16px; border-radius: 4px; background: var(--mtx-color-success); color: var(--mtx-color-success-contrast);">success</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Variantes light, main y dark de primary" >}}
<div style="width: 112px; padding: 16px; border-radius: 4px; background: var(--mtx-color-primary-light); color: var(--mtx-color-text-primary);">light</div>
<div style="width: 112px; padding: 16px; border-radius: 4px; background: var(--mtx-color-primary); color: var(--mtx-color-primary-contrast);">main</div>
<div style="width: 112px; padding: 16px; border-radius: 4px; background: var(--mtx-color-primary-dark); color: var(--mtx-color-primary-contrast);">dark</div>
{{< /mtx-demo >}}

Usa el selector de tema de la cabecera para ver los valores oscuros.

## Referencia de tokens

Valores extraídos de `src/styles/tokens.css`. "Igual" significa que el tema oscuro no redefine el token.

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

Unidad base de 8px. Lo consumen Grid, Stack, Box y las utilidades `mtx-m-*`/`mtx-p-*`.

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
