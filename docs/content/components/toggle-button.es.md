---
title: "Toggle Button"
description: "Botones de alternancia para agrupar opciones relacionadas con selección exclusiva o múltiple; también sirven solos como interruptor de una acción."
group: "inputs"
icon: "toggle_off"
weight: 110
example: "toggle-button"
mui: "https://mui.com/material-ui/react-toggle-button/"
---

**Toggle Button** agrupa opciones relacionadas en un bloque con bordes unidos: alineación de texto, formato, vista de lista o cuadrícula. Un **ToggleButtonGroup** gestiona la selección exclusiva (como un radio) o múltiple (como casillas) y un **ToggleButton** suelto alterna una acción de encendido/apagado, como marcar favorito. Para elegir entre muchas opciones usa un [Select](../select/); para un ajuste que se aplica al instante, un [Switch](../switch/).

{{< callout type="warning" title="aria-label obligatorio en botones de solo icono" >}}
Un botón sin texto visible necesita `aria-label` (o `aria-labelledby`) que describa la opción: "Alinear a la izquierda", no "flecha". Nombra también el grupo con `aria-label` o `data-label`.
{{< /callout >}}

## Uso básico

Un contenedor `data-mtx="toggle-button-group"` con `<button>` simples. Cada botón solo necesita `data-value` y, si es de solo icono, `data-icon` y `aria-label`; el grupo inicializa los botones (no hace falta `data-mtx` en cada uno), une sus bordes y gestiona `aria-pressed`.

{{< mtx-demo title="Uso básico" >}}
<div data-mtx="toggle-button-group" data-exclusive data-value="left" aria-label="Alineación del texto">
  <button data-value="left" data-icon="format_align_left" aria-label="Alinear a la izquierda"></button>
  <button data-value="center" data-icon="format_align_center" aria-label="Centrar"></button>
  <button data-value="right" data-icon="format_align_right" aria-label="Alinear a la derecha"></button>
  <button data-value="justify" data-icon="format_align_justify" aria-label="Justificar" disabled></button>
</div>
{{< /mtx-demo >}}

## Selección exclusiva y múltiple

Con `data-exclusive` solo puede haber un botón activo y el valor es un texto (o `null`). Sin él la selección es **múltiple** (predeterminado en MUI) y el valor es un array en el orden del DOM; `data-value` acepta una lista separada por comas.

{{< mtx-demo title="Exclusivo" >}}
<div data-mtx="toggle-button-group" data-exclusive data-value="center" aria-label="Alineación">
  <button data-value="left" data-icon="format_align_left" aria-label="Izquierda"></button>
  <button data-value="center" data-icon="format_align_center" aria-label="Centro"></button>
  <button data-value="right" data-icon="format_align_right" aria-label="Derecha"></button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Múltiple" >}}
<div data-mtx="toggle-button-group" data-value="bold,italic" aria-label="Formato del texto">
  <button data-value="bold" data-icon="format_bold" aria-label="Negrita"></button>
  <button data-value="italic" data-icon="format_italic" aria-label="Cursiva"></button>
  <button data-value="underlined" data-icon="format_underlined" aria-label="Subrayado"></button>
  <button data-value="color" data-icon="format_color_fill" aria-label="Color de relleno"></button>
</div>
{{< /mtx-demo >}}

## Tamaños

`data-size` en el grupo (o en cada botón). El icono conserva su cuadrícula nativa de 24px; cambia el padding (7, 11 y 15px, como MUI).

| Tamaño | `data-size` | Alto | Alinea con |
| :--- | :--- | :--- | :--- |
| Large | `large` | 56px | Text Field medium |
| Medium | — (predeterminado) | 48px | Button large, IconButton large |
| Small | `small` | 40px | Button medium, Text Field small |

{{< mtx-demo title="Tamaños" layout="column" >}}
<div data-mtx="toggle-button-group" data-exclusive data-size="large" data-value="list" aria-label="Vista (grande)">
  <button data-value="list" data-icon="view_list" aria-label="Lista"></button>
  <button data-value="module" data-icon="view_module" aria-label="Módulos"></button>
  <button data-value="quilt" data-icon="view_quilt" aria-label="Mosaico"></button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-value="list" aria-label="Vista (mediana)">
  <button data-value="list" data-icon="view_list" aria-label="Lista"></button>
  <button data-value="module" data-icon="view_module" aria-label="Módulos"></button>
  <button data-value="quilt" data-icon="view_quilt" aria-label="Mosaico"></button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-size="small" data-value="list" aria-label="Vista (pequeña)">
  <button data-value="list" data-icon="view_list" aria-label="Lista"></button>
  <button data-value="module" data-icon="view_module" aria-label="Módulos"></button>
  <button data-value="quilt" data-icon="view_quilt" aria-label="Mosaico"></button>
</div>
{{< /mtx-demo >}}

## Con iconos

Solo texto, icono y texto (`data-icon` se inserta antes del texto) o solo icono con `aria-label`.

{{< mtx-demo title="Texto, icono y texto, solo icono" layout="column" >}}
<div data-mtx="toggle-button-group" data-exclusive data-value="web" aria-label="Plataforma">
  <button data-value="web">Web</button>
  <button data-value="android">Android</button>
  <button data-value="ios">iOS</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-value="month" aria-label="Periodo">
  <button data-value="day" data-icon="today">Día</button>
  <button data-value="week" data-icon="view_week">Semana</button>
  <button data-value="month" data-icon="calendar_month">Mes</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-value="phone" aria-label="Dispositivo">
  <button data-value="laptop" data-icon="laptop" aria-label="Portátil"></button>
  <button data-value="tv" data-icon="tv" aria-label="Televisión"></button>
  <button data-value="phone" data-icon="phone_android" aria-label="Teléfono"></button>
</div>
{{< /mtx-demo >}}

## Colores

`data-color` colorea el estado seleccionado: `standard` (predeterminado, texto primario) o un color de la paleta.

{{< mtx-demo title="Colores" layout="column" >}}
<div data-mtx="toggle-button-group" data-exclusive data-value="web" aria-label="Standard">
  <button data-value="web">Web</button><button data-value="android">Android</button><button data-value="ios">iOS</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-color="primary" data-value="web" aria-label="Primary">
  <button data-value="web">Web</button><button data-value="android">Android</button><button data-value="ios">iOS</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-color="secondary" data-value="android" aria-label="Secondary">
  <button data-value="web">Web</button><button data-value="android">Android</button><button data-value="ios">iOS</button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-color="success" data-value="ios" aria-label="Success">
  <button data-value="web">Web</button><button data-value="android">Android</button><button data-value="ios">iOS</button>
</div>
{{< /mtx-demo >}}

## Estados

Hover muestra un fondo sutil, el foco de teclado un anillo primario y la pulsación el ripple. `disabled` (o `data-disabled`) en un botón lo atenúa; `data-disabled` en el grupo deshabilita todos.

{{< mtx-demo title="Seleccionado, normal y deshabilitado" layout="column" >}}
<div data-mtx="toggle-button-group" data-value="bold" aria-label="Estados de formato">
  <button data-value="bold" data-icon="format_bold" aria-label="Negrita"></button>
  <button data-value="italic" data-icon="format_italic" aria-label="Cursiva"></button>
  <button data-value="underlined" data-icon="format_underlined" aria-label="Subrayado" disabled></button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-disabled data-value="day" aria-label="Periodo (deshabilitado)">
  <button data-value="day">Día</button>
  <button data-value="week">Semana</button>
  <button data-value="month">Mes</button>
</div>
{{< /mtx-demo >}}

## Orientación y ancho completo

`data-orientation="vertical"` apila los botones (las flechas arriba/abajo mueven el foco); `data-full-width` reparte el ancho disponible.

{{< mtx-demo title="Vertical" >}}
<div data-mtx="toggle-button-group" data-exclusive data-orientation="vertical" data-value="list" aria-label="Vista">
  <button data-value="list" data-icon="view_list" aria-label="Lista"></button>
  <button data-value="module" data-icon="view_module" aria-label="Módulos"></button>
  <button data-value="quilt" data-icon="view_quilt" aria-label="Mosaico"></button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Ancho completo" layout="block" >}}
<div data-mtx="toggle-button-group" data-exclusive data-full-width data-color="primary" data-value="monthly" aria-label="Facturación">
  <button data-value="monthly">Mensual</button>
  <button data-value="yearly">Anual</button>
</div>
{{< /mtx-demo >}}

## Valor obligatorio

`data-enforce-value-set` impide deseleccionar el último botón activo, así el grupo siempre tiene valor (patrón *enforce value set* de MUI).

{{< mtx-demo title="data-enforce-value-set" >}}
<div data-mtx="toggle-button-group" data-exclusive data-enforce-value-set data-value="left" aria-label="Alineación obligatoria">
  <button data-value="left" data-icon="format_align_left" aria-label="Izquierda"></button>
  <button data-value="center" data-icon="format_align_center" aria-label="Centro"></button>
  <button data-value="right" data-icon="format_align_right" aria-label="Derecha"></button>
</div>
{{< /mtx-demo >}}

## Botón independiente

Un único `data-mtx="toggle-button"` fuera de un grupo alterna su propio estado y emite `mtx:toggle-button:change`. `data-selected` fija el estado inicial.

{{< mtx-demo title="Standalone" >}}
<button data-mtx="toggle-button" data-value="favorite" data-icon="star" data-color="warning" aria-label="Marcar como favorito"></button>
<button data-mtx="toggle-button" data-value="done" data-icon="check" data-color="success" data-selected aria-label="Marcar como hecho"></button>
<button data-mtx="toggle-button" data-value="wifi" data-icon="wifi" data-size="small" data-selected>Wi-Fi</button>
{{< /mtx-demo >}}

## Casos de uso reales

Barra de herramientas de un editor: formato múltiple y alineación exclusiva obligatoria.

{{< mtx-demo title="Barra de herramientas" >}}
<div data-mtx="toggle-button-group" data-size="small" data-value="bold" aria-label="Formato">
  <button data-value="bold" data-icon="format_bold" aria-label="Negrita"></button>
  <button data-value="italic" data-icon="format_italic" aria-label="Cursiva"></button>
  <button data-value="underlined" data-icon="format_underlined" aria-label="Subrayado"></button>
</div>
<div data-mtx="toggle-button-group" data-exclusive data-enforce-value-set data-size="small" data-value="left" aria-label="Alineación">
  <button data-value="left" data-icon="format_align_left" aria-label="Izquierda"></button>
  <button data-value="center" data-icon="format_align_center" aria-label="Centro"></button>
  <button data-value="right" data-icon="format_align_right" aria-label="Derecha"></button>
</div>
{{< /mtx-demo >}}

Selector de tema con la [API de tema]({{< relref "/guide/theming" >}}): cada botón lleva `data-mtx-theme-toggle="light|system|dark"`, de modo que `Materix.theme` aplica el modo y sincroniza `aria-pressed`. Usa `data-enforce-value-set` para que siempre haya un modo activo.

{{< mtx-demo title="Selector de tema" >}}
<div data-mtx="toggle-button-group" data-exclusive data-enforce-value-set data-size="small" data-color="primary" aria-label="Tema">
  <button data-value="light" data-icon="light_mode" data-mtx-theme-toggle="light">Claro</button>
  <button data-value="system" data-icon="settings_brightness" data-mtx-theme-toggle="system">Sistema</button>
  <button data-value="dark" data-icon="dark_mode" data-mtx-theme-toggle="dark">Oscuro</button>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Clases y `aria-pressed` escritos a mano; la librería reutiliza los nodos y el icono existente.

```html
<div class="mtx-toggle-button-group" data-mtx="toggle-button-group" data-exclusive role="group" aria-label="Vista">
  <button type="button" class="mtx-toggle-button" data-mtx="toggle-button" data-value="list" aria-pressed="true" aria-label="Lista">
    <span class="material-icons" aria-hidden="true">view_list</span>
  </button>
  <button type="button" class="mtx-toggle-button" data-mtx="toggle-button" data-value="grid" aria-pressed="false" aria-label="Cuadrícula">
    <span class="material-icons" aria-hidden="true">grid_view</span>
  </button>
</div>
```

## Uso programático

`Materix.getInstance(grupo)` devuelve el ToggleButtonGroup: `value` se lee y escribe (sin emitir eventos) y `mtx:toggle-button-group:change` informa de los cambios del usuario.

```javascript
const groupEl = document.querySelector('#formatting');
const group = Materix.getInstance(groupEl);

console.log(group.value);          // ['bold'] (múltiple) o 'left' / null (exclusivo)
group.value = ['bold', 'italic'];  // no emite eventos

groupEl.addEventListener('mtx:toggle-button-group:change', (event) => {
  console.log('Nuevo valor:', event.detail.value);
});

group.disable();
group.enable();

// Botón independiente
const fav = new Materix.ToggleButton(document.querySelector('#fav'));
fav.selected = true;
fav.toggle();
```

Con módulos ES:

```javascript
import { init, getInstance, ToggleButton, ToggleButtonGroup } from 'materix-ui';
```

{{< mtx-demo title="value y mtx:toggle-button-group:change" >}}
<div data-mtx="toggle-button-group" id="doc-tb-group" data-value="bold" aria-label="Formato">
  <button data-value="bold" data-icon="format_bold" aria-label="Negrita"></button>
  <button data-value="italic" data-icon="format_italic" aria-label="Cursiva"></button>
  <button data-value="underlined" data-icon="format_underlined" aria-label="Subrayado"></button>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-tb-set">group.value = ['italic', 'underlined']</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var groupEl = document.getElementById('doc-tb-group');
  var group = Materix.init(groupEl);
  var status = groupEl.closest('.doc-demo').querySelector('.doc-demo-status');
  groupEl.addEventListener('mtx:toggle-button-group:change', function (event) {
    if (status) status.textContent = 'mtx:toggle-button-group:change → ' + JSON.stringify(event.detail.value);
  });
  document.getElementById('doc-tb-set').addEventListener('click', function () {
    group.value = ['italic', 'underlined'];
    if (status) status.textContent = 'value = ' + JSON.stringify(group.value);
  });
});
</script>

## Referencia de API

### Atributos data-* (ToggleButton)

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `toggle-button` | — | Inicialización (opcional dentro de un grupo). |
| `data-value` | texto | `value` o texto del botón | Valor que aporta al grupo. |
| `data-icon` | nombre de Material Icons | — | Inserta el icono (24px, `aria-hidden`) antes del texto. Se ignora si ya hay un icono o SVG. |
| `data-selected` | booleano | — | Estado inicial seleccionado (`aria-pressed="true"`). |
| `data-disabled` | booleano | — | Deshabilita el botón (también el `disabled` nativo). |
| `data-size` | `small` \| `medium` \| `large` | `medium` | Alto 40 / 48 / 56px. |
| `data-color` | `standard` \| `primary` \| `secondary` \| `error` \| `warning` \| `info` \| `success` | `standard` | Color del estado seleccionado. |

### Atributos data-* (ToggleButtonGroup)

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `toggle-button-group` | — | Inicialización. Inicializa sus `<button>` descendientes. |
| `data-exclusive` | booleano | múltiple | Solo un botón activo; el valor es `string` o `null`. |
| `data-value` | texto (lista con comas en múltiple) | — | Valor inicial. |
| `data-enforce-value-set` | booleano | — | Impide deseleccionar el último botón activo. |
| `data-orientation` | `horizontal` \| `vertical` | `horizontal` | Dirección del grupo y de las flechas. |
| `data-full-width` | booleano | — | El grupo ocupa todo el ancho y reparte los botones. |
| `data-size`, `data-color` | igual que ToggleButton | — | Se aplican a los botones que no tengan los suyos. |
| `data-disabled` | booleano | — | Deshabilita todos los botones. |
| `data-label` | texto | — | Nombre accesible (`aria-label`) si no hay otro. |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-toggle-button` | Botón base (borde 1px divider, radio 4px, tipografía button en mayúsculas). |
| `mtx-toggle-button__icon` | Icono generado por `data-icon`. |
| `mtx-toggle-button--small`, `--large` | Tamaños 40 y 56px. |
| `mtx-toggle-button--primary`, `--secondary`, `--error`, `--warning`, `--info`, `--success` | Color del estado seleccionado. |
| `mtx-toggle-button--selected` | Solo en BEM manual: se convierte en `aria-pressed="true"` al iniciar. El estilo se basa en `[aria-pressed="true"]`. |
| `mtx-toggle-button-group` | Contenedor con bordes unidos. |
| `mtx-toggle-button-group--vertical` | Grupo apilado. |
| `mtx-toggle-button-group--full-width` | Grupo a ancho completo. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `ToggleButton.selected` (get/set) | `boolean` | Estado de `aria-pressed`; el setter no emite eventos. |
| `ToggleButton.toggle()` | `boolean` | Alterna el estado y devuelve el nuevo (sin eventos). |
| `ToggleButton.value` (getter) | `string` | `data-value`, `value` o texto. |
| `ToggleButton.disable()` / `enable()` / `disabled` | `void` / `boolean` | Estado deshabilitado. |
| `ToggleButton.focus()` / `destroy()` | `void` | Enfoca / retira listeners. |
| `ToggleButtonGroup.value` (get/set) | `string \| null` o `string[]` | Valor del grupo; el setter no emite eventos. |
| `ToggleButtonGroup.buttons` (getter) | `ToggleButton[]` | Instancias de los botones. |
| `ToggleButtonGroup.disable()` / `enable()` / `disabled` | `void` / `boolean` | Deshabilita o habilita todos los botones. |
| `ToggleButtonGroup.destroy()` | `void` | Retira los listeners. |

### Eventos

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `mtx:toggle-button-group:change` (en el grupo, burbujea) | `{ value }` (`string \| null` o `string[]`) | El usuario cambia la selección del grupo. |
| `mtx:toggle-button:change` (en el botón, burbujea) | `{ selected, value }` | El usuario alterna un botón independiente (fuera de un grupo). |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-tb-color` | Color local del estado seleccionado (lo fija `data-color`). |
| `--mtx-tb-size` | Alto y ancho mínimo local (40 / 48 / 56px). |
| `--mtx-color-divider` | Borde. |
| `--mtx-color-action-active`, `--mtx-color-action-hover` | Color normal y hover. |
| `--mtx-color-action-disabled`, `--mtx-color-action-disabled-background` | Estado deshabilitado. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |

## Accesibilidad

- Cada botón es un `<button>` nativo con `aria-pressed` (patrón WAI-ARIA *toggle button*), también en modo exclusivo. Igual que MUI, el grupo usa `role="group"` y no `radiogroup`: así los botones conservan su semántica de botón, todos son tabulables y se pueden deseleccionar. Si necesitas la semántica estricta de opción única, usa [Radio](../radio/).
- Nombra el grupo con `aria-label`, `aria-labelledby` o `data-label`, y cada botón de solo icono con `aria-label`.
- Los iconos generados llevan `aria-hidden="true"`. Los botones deshabilitados usan el `disabled` nativo.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre los botones (todos son tabulables, como MUI). |
| <kbd>→</kbd> / <kbd>←</kbd> | Mueve el foco al botón siguiente/anterior en grupos horizontales (cíclico; invertido en RTL). |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Igual en grupos verticales. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primer / último botón habilitado. |
| <kbd>Espacio</kbd> / <kbd>Enter</kbd> | Activa o desactiva el botón enfocado. |
