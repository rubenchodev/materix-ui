---
title: "Toggle Button"
description: "Los botones de alternancia agrupan opciones relacionadas con selección exclusiva o múltiple; solos funcionan como interruptor de una única acción."
group: "inputs"
icon: "toggle_off"
weight: 110
example: "toggle-button"
import: "ToggleButton, ToggleButtonGroup"
mui: "https://mui.com/material-ui/react-toggle-button/"
---

**Toggle Button** agrupa opciones relacionadas en un bloque de bordes unidos: alineación de texto, formato, vista de lista o cuadrícula. Un **ToggleButtonGroup** gestiona la selección exclusiva (como un radio) o múltiple (como casillas), y un **ToggleButton** independiente activa y desactiva una sola acción, como marcar un favorito. Para elegir entre muchas opciones usa un Select; para un ajuste que se aplica al instante, un [Switch](../switch/).

{{< callout type="warning" title="aria-label obligatorio en botones de solo icono" >}}
Un botón sin texto visible necesita un `aria-label` (o `aria-labelledby`) que describa la opción: "Alinear a la izquierda", no "flecha". Nombra también el grupo con `aria-label` o `label`.
{{< /callout >}}

## Importación

```tsx
import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react';
```

## Uso básico

Un `<ToggleButtonGroup>` con hijos `<ToggleButton>`. Cada botón solo necesita `value` y, si es de solo icono, `icon` y `aria-label`; el grupo une sus bordes, gestiona `aria-pressed` y propaga por contexto su tamaño, color y estado deshabilitado.

{{< react-demo "toggle-button/01-basic" >}}

## Selección exclusiva y múltiple

Con `exclusive` solo un botón puede estar activo y el valor es un `string` (o `null`). Sin él la selección es **múltiple** (lo predeterminado en MUI) y el valor es un `string[]` en orden del DOM.

{{< react-demo "toggle-button/02-exclusive-multiple" >}}

## Tamaños

`size` en el grupo (o en cada botón). El icono conserva su cuadrícula nativa de 24px; cambia el padding (7, 11 y 15px, como en MUI). Cada fila alinea con el [Text Field](../text-field/) y el [Button](../button/) de la misma altura.

| Tamaño | `size` | Altura | Alinea con |
| :--- | :--- | :--- | :--- |
| Large | `large` | 56px | Text Field medium |
| Medium | — (por defecto) | 48px | Button large, IconButton large |
| Small | `small` | 40px | Button medium, Text Field small |

{{< react-demo id="toggle-button/03-sizes" layout="block" >}}

## Con y sin iconos

Solo texto, icono y texto (`icon` se pinta antes del texto) o solo icono con `aria-label`. `icon` acepta un nombre de Material Icons o cualquier nodo (un SVG, por ejemplo).

{{< react-demo id="toggle-button/04-icons" layout="block" >}}

## Colores

`color` colorea el estado seleccionado: `standard` (por defecto, texto primario) o un color de la paleta.

{{< react-demo id="toggle-button/05-colors" layout="block" >}}

## Estados

El hover muestra un fondo sutil, el foco de teclado un anillo primario y la pulsación el ripple (`disableRipple` lo desactiva). `disabled` en un botón lo atenúa; `disabled` en el grupo los deshabilita todos y marca `aria-disabled="true"` en él.

{{< react-demo id="toggle-button/06-states" layout="block" >}}

## Orientación

`orientation="vertical"` apila los botones; las flechas arriba/abajo mueven entonces el foco.

{{< react-demo "toggle-button/07-orientation" >}}

## Ancho completo

`fullWidth` reparte el ancho disponible entre los botones.

{{< react-demo id="toggle-button/08-full-width" layout="block" >}}

## Valor siempre definido

`enforceValueSet` impide deseleccionar el último botón activo, de modo que el grupo siempre tiene valor (patrón *enforce value set* de MUI), en modo exclusivo y múltiple.

{{< react-demo "toggle-button/09-enforce-value-set" >}}

## Botón independiente

Un `ToggleButton` fuera de un grupo alterna su propio estado (`defaultSelected`) o se controla con `selected` + `onChange(event, selected, value)`.

{{< react-demo "toggle-button/10-standalone" >}}

## Ejemplo real

La barra de un editor: formato múltiple y alineación exclusiva obligatoria, ambos controlados.

{{< react-demo id="toggle-button/11-use-cases" layout="block" >}}

## Maquetación en grilla

Con `fullWidth` el grupo se adapta a la columna de la grilla.

{{< react-demo id="toggle-button/12-grid" layout="block" >}}

## Uso programático

El grupo se controla con `value` + `onChange(event, value)`: escribir `value` desde código no dispara `onChange`, igual que el setter de vanilla.

{{< react-demo id="toggle-button/13-programmatic" layout="block" >}}

```tsx
const [formats, setFormats] = useState<ToggleButtonGroupValue>(['bold']);

<ToggleButtonGroup value={formats} onChange={(event, next) => setFormats(next)} aria-label="Formato">
  <ToggleButton value="bold" icon="format_bold" aria-label="Negrita" />
  <ToggleButton value="italic" icon="format_italic" aria-label="Cursiva" />
</ToggleButtonGroup>
```

## Referencia de la API

### Props de ToggleButton

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `value` | `string` | texto de `children` | Valor que aporta al grupo; obligatorio dentro de un grupo (si falta: aviso en desarrollo y valor generado). |
| `selected` | `boolean` | — | Estado seleccionado (controlado; se ignora dentro de un grupo). |
| `defaultSelected` | `boolean` | `false` | Estado inicial (no controlado). |
| `onChange` | `(event, selected, value) => void` | — | El usuario alterna el botón; dentro de un grupo, solo si el grupo aplica el cambio. |
| `icon` | `ReactNode` | — | Nombre de Material Icons o nodo, antes del texto (`aria-hidden`). |
| `size` | `'small' \| 'medium' \| 'large'` | grupo o `'medium'` | Altura 40 / 48 / 56px. |
| `color` | `'standard' \| 'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | grupo o `'standard'` | Color del estado seleccionado. |
| `disabled` | `boolean` | `false` | `disabled` nativo (también heredado del grupo). |
| `disableRipple` | `boolean` | `false` | Desactiva el ripple. |

El resto de props va al `<button>` nativo (`type="button"`); `ref` apunta a él. Un `onClick` que llame a `preventDefault()` cancela la alternancia.

### Props de ToggleButtonGroup

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `exclusive` | `boolean` | `false` | Un solo botón activo; el valor es `string \| null`. |
| `value` | `string \| string[] \| null` | — | Valor seleccionado (controlado). |
| `defaultValue` | `string \| string[] \| null` | `null` / `[]` | Valor inicial (no controlado). |
| `onChange` | `(event, value) => void` | — | El usuario cambia la selección. |
| `enforceValueSet` | `boolean` | `false` | Impide deseleccionar el último botón activo. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Dirección del grupo y de las flechas. |
| `size`, `color` | igual que ToggleButton | — | Heredados por los botones que no fijan el suyo. |
| `fullWidth` | `boolean` | `false` | Ocupa todo el ancho y reparte los botones. |
| `disabled` | `boolean` | `false` | Deshabilita todos los botones; `aria-disabled` en el grupo. |
| `label` | `string` | — | Nombre accesible (`aria-label`). |
| `role` | `string` | `'group'` | Rol de la raíz. |

El resto de props va al `<div>` raíz; `ref` apunta a él.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-toggle-button` | Botón base (borde divider de 1px, radio 4px, tipografía button en mayúsculas). |
| `mtx-toggle-button__icon` | Icono generado desde `icon`. |
| `mtx-toggle-button--small`, `--large` | Tamaños de 40 y 56px. |
| `mtx-toggle-button--{primary,secondary,error,warning,info,success}` | Color del estado seleccionado. |
| `mtx-toggle-button-group` | Contenedor de bordes unidos. |
| `mtx-toggle-button-group--vertical` · `--full-width` | Grupo apilado / a todo el ancho. |

El estado seleccionado se pinta desde `[aria-pressed="true"]`. Variables CSS locales: `--mtx-tb-color` (color seleccionado) y `--mtx-tb-size` (altura).

### Equivalencia con la versión vanilla

| Vanilla | React |
| :--- | :--- |
| `data-value` · `data-icon` · `data-selected` | `value` · `icon` · `defaultSelected` |
| `data-size` · `data-color` · `data-disabled` | `size` · `color` · `disabled` |
| `data-exclusive` · `data-value` (grupo) · `data-enforce-value-set` | `exclusive` · `defaultValue` / `value` · `enforceValueSet` |
| `data-orientation` · `data-full-width` · `data-label` | `orientation` · `fullWidth` · `label` |
| `mtx:toggle-button-group:change` `{ value }` | `onChange(event, value)` en el grupo |
| `mtx:toggle-button:change` `{ selected, value }` | `onChange(event, selected, value)` en el botón |
| `group.value = …` · `button.selected = …` · `toggle()` | `value` / `selected` controlados |
| `disable()` / `enable()` | prop `disabled` |

## Accesibilidad

- Cada botón es un `<button>` nativo con `aria-pressed` (patrón *toggle button* de WAI-ARIA), también en modo exclusivo. Como en MUI, el grupo usa `role="group"` y no `radiogroup`: los botones conservan su semántica de botón, todos son tabulables y pueden deseleccionarse. Si necesitas semántica estricta de opción única, usa [Radio](../radio/).
- Nombra el grupo con `aria-label`, `aria-labelledby` o `label`, y cada botón de solo icono con `aria-label`.
- Los iconos llevan `aria-hidden="true"`. Los botones deshabilitados usan el `disabled` nativo.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre los botones (todos tabulables, como en MUI). |
| <kbd>→</kbd> / <kbd>←</kbd> | Botón habilitado siguiente/anterior en grupos horizontales (circular; invertido en RTL). |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Igual en grupos verticales. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primer / último botón habilitado. |
| <kbd>Espacio</kbd> / <kbd>Enter</kbd> | Alterna el botón enfocado. |
