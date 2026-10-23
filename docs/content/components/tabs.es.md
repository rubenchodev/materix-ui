---
title: "Tabs"
description: "Pestañas para alternar entre vistas del mismo nivel con indicador animado, iconos, orientación vertical y navegación completa por teclado."
group: "navigation"
icon: "tab"
weight: 40
example: "tabs"
mui: "https://mui.com/material-ui/react-tabs/"
---

`Tabs` organiza contenido relacionado en vistas del mismo nivel y permite cambiar entre ellas sin salir de la página, con un indicador que se desliza bajo la pestaña activa. Úsalo cuando haya entre dos y unas siete secciones hermanas que el usuario consulta de una en una (perfil, seguridad, notificaciones). No lo uses para pasos secuenciales (usa un asistente con botones) ni para navegar entre páginas de primer nivel en móvil (usa [Drawer](../drawer/)).

## Uso básico

Un contenedor `data-mtx="tabs"` con botones `data-mtx="tab"`. Cada pestaña apunta a su panel con `data-panel="#id"`; el componente añade los roles ARIA, el indicador, oculta los paneles inactivos y activa la pestaña con `data-active` (o la primera habilitada).

{{< mtx-demo title="Pestañas con paneles" layout="block" >}}
<div class="mtx-tabs-container">
  <div id="doc-tabs-1" data-mtx="tabs">
    <button data-mtx="tab" data-panel="#doc-tab-1" data-active>Resumen</button>
    <button data-mtx="tab" data-panel="#doc-tab-2">Actividad</button>
    <button data-mtx="tab" data-panel="#doc-tab-3">Ajustes</button>
  </div>
  <div class="mtx-tab-panel" id="doc-tab-1">Resumen del proyecto: 12 tareas abiertas.</div>
  <div class="mtx-tab-panel" id="doc-tab-2" hidden>Última actividad hace 5 minutos.</div>
  <div class="mtx-tab-panel" id="doc-tab-3" hidden>Preferencias del proyecto.</div>
</div>
{{< /mtx-demo >}}

`mtx-tabs-container` es opcional: agrupa pestañas y paneles en una superficie con borde. Sin él, las pestañas quedan sobre la línea divisoria inferior, como en MUI.

{{< callout type="info" title="Ids generados" >}}
Los ids de las pestañas se generan a partir del id del contenedor (`{id}-tab-1`, `{id}-tab-2`…). Si el contenedor no tiene id, se genera un prefijo único por grupo (`mtx-tabs-1`, `mtx-tabs-2`…), así que varios grupos sin id nunca producen ids duplicados. Las pestañas y paneles que ya tienen id lo conservan.
{{< /callout >}}

## Con iconos

`data-icon` inserta un icono de Material Icons antes del texto. Si la pestaña no tiene texto, queda como pestaña de solo icono: añade entonces `aria-label`.

{{< mtx-demo title="Icono y texto" layout="block" >}}
<div id="doc-tabs-2" data-mtx="tabs">
  <button data-mtx="tab" data-icon="phone" data-active>Llamadas</button>
  <button data-mtx="tab" data-icon="favorite">Favoritos</button>
  <button data-mtx="tab" data-icon="person_pin">Contactos</button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Solo icono" layout="block" >}}
<div id="doc-tabs-3" data-mtx="tabs">
  <button data-mtx="tab" data-icon="phone" aria-label="Llamadas" data-active></button>
  <button data-mtx="tab" data-icon="favorite" aria-label="Favoritos"></button>
  <button data-mtx="tab" data-icon="person_pin" aria-label="Contactos"></button>
</div>
{{< /mtx-demo >}}

El icono siempre se coloca a la izquierda del texto (equivale a `iconPosition="start"` de MUI); no hay posición superior.

## Ancho completo y centrado

`data-full` reparte el ancho entre todas las pestañas (equivale a `variant="fullWidth"`), útil en móvil con pocas pestañas. `data-centered` las centra.

{{< mtx-demo title="data-full" layout="block" >}}
<div id="doc-tabs-4" data-mtx="tabs" data-full>
  <button data-mtx="tab" data-active>Inventario</button>
  <button data-mtx="tab">Ventas</button>
  <button data-mtx="tab">Clientes</button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="data-centered" layout="block" >}}
<div id="doc-tabs-5" data-mtx="tabs" data-centered>
  <button data-mtx="tab">Ayer</button>
  <button data-mtx="tab" data-active>Hoy</button>
  <button data-mtx="tab">Mañana</button>
</div>
{{< /mtx-demo >}}

## Desplazables

Cuando las pestañas no caben, la barra se desplaza en horizontal (scroll táctil, rueda o teclado) y el indicador acompaña a la pestaña activa. La barra de scroll está oculta y no hay botones de flecha, a diferencia de `variant="scrollable"` de MUI.

{{< mtx-demo title="Muchas pestañas" layout="block" >}}
<div id="doc-tabs-6" data-mtx="tabs">
  <button data-mtx="tab" data-active>Enero</button>
  <button data-mtx="tab">Febrero</button>
  <button data-mtx="tab">Marzo</button>
  <button data-mtx="tab">Abril</button>
  <button data-mtx="tab">Mayo</button>
  <button data-mtx="tab">Junio</button>
  <button data-mtx="tab">Julio</button>
  <button data-mtx="tab">Agosto</button>
  <button data-mtx="tab">Septiembre</button>
  <button data-mtx="tab">Octubre</button>
  <button data-mtx="tab">Noviembre</button>
  <button data-mtx="tab">Diciembre</button>
</div>
{{< /mtx-demo >}}

## Vertical

`data-orientation="vertical"` apila las pestañas, coloca el indicador a la derecha y cambia las flechas de navegación a <kbd>↑</kbd>/<kbd>↓</kbd>.

{{< mtx-demo title="Pestañas verticales" layout="row" >}}
<div id="doc-tabs-7" data-mtx="tabs" data-orientation="vertical">
  <button data-mtx="tab" data-panel="#doc-vtab-1" data-active>Cuenta</button>
  <button data-mtx="tab" data-panel="#doc-vtab-2">Seguridad</button>
  <button data-mtx="tab" data-panel="#doc-vtab-3">Notificaciones</button>
</div>
<div class="mtx-tab-panel" id="doc-vtab-1">Datos de la cuenta.</div>
<div class="mtx-tab-panel" id="doc-vtab-2" hidden>Contraseña y verificación en dos pasos.</div>
<div class="mtx-tab-panel" id="doc-vtab-3" hidden>Correo, push y resumen semanal.</div>
{{< /mtx-demo >}}

## Estados

Una pestaña con `data-disabled` (y `disabled` en el `<button>`) se muestra atenuada, no responde al clic y el teclado la salta. Pasa el cursor para ver el fondo de hover y usa <kbd>Tab</kbd> para ver el anillo de foco.

{{< mtx-demo title="Pestaña deshabilitada" layout="block" >}}
<div id="doc-tabs-8" data-mtx="tabs">
  <button data-mtx="tab" data-active>Activa</button>
  <button data-mtx="tab" data-disabled disabled>Deshabilitada</button>
  <button data-mtx="tab">Disponible</button>
</div>
{{< /mtx-demo >}}

{{< callout type="info" title="Colores" >}}
La pestaña activa y el indicador usan siempre `--mtx-color-primary`; no hay atributos equivalentes a `textColor` o `indicatorColor` de MUI. Para otro color, redefine `--mtx-color-primary` en un contenedor de las pestañas.
{{< /callout >}}

## Activación automática y manual

Por defecto las flechas solo mueven el foco y la pestaña se activa con <kbd>Enter</kbd> o <kbd>Espacio</kbd> (activación manual, patrón WAI-ARIA recomendado cuando cargar un panel es costoso). Con `data-selection-follows-focus` la pestaña se activa en cuanto recibe el foco (activación automática, como MUI por defecto).

{{< mtx-demo title="data-selection-follows-focus" layout="block" >}}
<div id="doc-tabs-9" data-mtx="tabs" data-selection-follows-focus>
  <button data-mtx="tab" data-panel="#doc-auto-1" data-active>Día</button>
  <button data-mtx="tab" data-panel="#doc-auto-2">Semana</button>
  <button data-mtx="tab" data-panel="#doc-auto-3">Mes</button>
</div>
<div class="mtx-tab-panel" id="doc-auto-1">Vista diaria.</div>
<div class="mtx-tab-panel" id="doc-auto-2" hidden>Vista semanal.</div>
<div class="mtx-tab-panel" id="doc-auto-3" hidden>Vista mensual.</div>
{{< /mtx-demo >}}

## Casos de uso reales

Ajustes de perfil con pestañas de ancho completo, iconos y paneles con formularios.

{{< mtx-demo title="Ajustes de cuenta" layout="block" >}}
<div class="mtx-tabs-container">
  <div id="doc-tabs-10" data-mtx="tabs" data-full>
    <button data-mtx="tab" data-icon="person" data-panel="#doc-case-1" data-active>Perfil</button>
    <button data-mtx="tab" data-icon="lock" data-panel="#doc-case-2">Seguridad</button>
    <button data-mtx="tab" data-icon="notifications" data-panel="#doc-case-3">Avisos</button>
  </div>
  <div class="mtx-tab-panel" id="doc-case-1">
    <input data-mtx="text-field" data-label="Nombre visible" data-variant="outlined" type="text" value="Ana García">
  </div>
  <div class="mtx-tab-panel" id="doc-case-2" hidden>
    <input data-mtx="text-field" data-label="Contraseña actual" data-variant="outlined" type="password">
  </div>
  <div class="mtx-tab-panel" id="doc-case-3" hidden>
    <input type="checkbox" data-mtx="switch" data-label="Resumen semanal por correo" checked>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Con la estructura escrita a mano el componente reutiliza el indicador existente y respeta `mtx-tab--active` como pestaña inicial.

```html
<div class="mtx-tabs-container">
  <div class="mtx-tabs" data-mtx="tabs">
    <button class="mtx-tab mtx-tab--active" data-mtx="tab" data-panel="#panel-uno">
      <span class="material-icons mtx-tab__icon" aria-hidden="true">home</span>Uno
    </button>
    <button class="mtx-tab" data-mtx="tab" data-panel="#panel-dos">Dos</button>
    <span class="mtx-tabs__indicator"></span>
  </div>
  <div class="mtx-tab-panel" id="panel-uno">Contenido del panel 1.</div>
  <div class="mtx-tab-panel" id="panel-dos" hidden>Contenido del panel 2.</div>
</div>
```

## Uso programático

```javascript
const tabs = Materix.getInstance(document.getElementById('ajustes'));

tabs.select('seguridad');   // por data-value, id, índice (número) o elemento
console.log(tabs.value);     // data-value, id o índice de la pestaña activa

// Cancelar un cambio
tabs.element.addEventListener('mtx:tabs:before-change', (event) => {
  if (formIsDirty) event.preventDefault();
});

// Escuchar cambios
tabs.element.addEventListener('mtx:tabs:change', (event) => {
  const { tab, panel, previousTab } = event.detail;
});

// Alternativa con callbacks
tabs.onBeforeChange = (tab, panel, previousTab, previousPanel) => tab.dataset.value !== 'bloqueada';
tabs.onChange = (tab) => console.log(tab.textContent);
```

Con ES modules:

```javascript
import { Tabs, Tab, getInstance } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="select() y eventos" layout="block" >}}
<div id="doc-tabs-api" data-mtx="tabs">
  <button data-mtx="tab" data-value="general" data-active>General</button>
  <button data-mtx="tab" data-value="avanzado">Avanzado</button>
  <button data-mtx="tab" data-value="bloqueada">Bloqueada por evento</button>
</div>
<div class="mtx-mt-2">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-tabs-select="general">select('general')</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-tabs-select="avanzado">select('avanzado')</button>
  <span class="mtx-ml-2" id="doc-tabs-status" aria-live="polite"></span>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-tabs-api');
  const tabs = Materix.getInstance(el);
  const status = document.getElementById('doc-tabs-status');
  document.querySelectorAll('[data-doc-tabs-select]').forEach((btn) => {
    btn.addEventListener('click', () => tabs.select(btn.dataset.docTabsSelect));
  });
  el.addEventListener('mtx:tabs:before-change', (event) => {
    if (event.detail.tab.dataset.value === 'bloqueada') {
      event.preventDefault();
      status.textContent = 'Cambio cancelado con preventDefault()';
    }
  });
  el.addEventListener('mtx:tabs:change', (event) => {
    status.textContent = 'mtx:tabs:change → ' + tabs.value;
  });
});
</script>

## Referencia de API

### Atributos data-*

**Tabs** (`data-mtx="tabs"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-orientation` | `horizontal`, `vertical` | `horizontal` | Orientación; también fija `aria-orientation` y las flechas de navegación. |
| `data-full` | booleano | — | Reparte el ancho entre las pestañas (`mtx-tabs--full`). |
| `data-centered` | booleano | — | Centra las pestañas (`mtx-tabs--centered`). |
| `data-selection-follows-focus` | booleano | — | Activa la pestaña al moverse con las flechas (activación automática). |

**Tab** (`data-mtx="tab"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-panel` | Selector CSS | — | Panel que controla la pestaña; recibe `role="tabpanel"` y se oculta cuando no está activa. |
| `data-active` | booleano | primera habilitada | Pestaña activa inicial (también vale la clase `mtx-tab--active`). |
| `data-icon` | Nombre de Material Icons | — | Inserta un icono decorativo antes del texto. |
| `data-value` | Texto | id o índice | Valor que devuelven `value` y acepta `select()`. |
| `data-disabled` | booleano | — | Deshabilita la pestaña (añade `aria-disabled`). Combínalo con `disabled` en el `<button>`. |

`data-mtx="tab-panel"` está registrado como componente genérico: no añade comportamiento, la clase `mtx-tab-panel` se escribe a mano.

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-tabs` | Barra de pestañas (flex, 48px, línea divisoria inferior, scroll horizontal sin barra visible). |
| `mtx-tabs--full` | Pestañas de igual ancho. |
| `mtx-tabs--centered` | Pestañas centradas. |
| `mtx-tabs--vertical` | Orientación vertical con divisoria a la derecha. |
| `mtx-tabs__indicator` | Indicador de 2px (se crea si no existe). |
| `mtx-tabs-container` | Superficie opcional con borde, radio y fondo `paper` para pestañas + paneles. |
| `mtx-tabs-container--borderless` | Variante del contenedor sin borde ni fondo. |
| `mtx-tab` | Pestaña: botón de 48px de alto, mínimo 90px, texto en mayúsculas. |
| `mtx-tab--active` | Pestaña activa (color primario). |
| `mtx-tab__icon` | Icono generado por `data-icon`. |
| `mtx-tab-panel` | Panel de contenido (relleno 16px × 24px; oculto con `hidden`). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `select(valor)` | `void` | Activa la pestaña por `data-value`, id, índice numérico o elemento. Emite los eventos. |
| `value` (getter) | `string \| null` | `data-value`, id o índice de la pestaña activa. |
| `onBeforeChange` (propiedad) | — | Función `(tab, panel, previousTab, previousPanel)`; si devuelve `false`, cancela el cambio. |
| `onChange` (propiedad) | — | Función `(tab, panel, previousTab, previousPanel)` llamada tras el cambio. |
| `destroy()` | `void` | Retira los listeners y el `ResizeObserver`. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:tabs:before-change` | `{ tab, panel, previousTab, previousPanel }` | Antes de cambiar de pestaña. Es cancelable con `preventDefault()`. |
| `mtx:tabs:change` | `{ tab, panel, previousTab, previousPanel }` | Después de activar otra pestaña (clic, teclado o `select()`). No se emite en la activación inicial. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-primary` | Texto de la pestaña activa e indicador. |
| `--mtx-color-text-secondary`, `--mtx-color-text-primary` | Texto en reposo y en hover. |
| `--mtx-color-action-hover` | Fondo en hover. |
| `--mtx-color-action-disabled` | Texto deshabilitado. |
| `--mtx-color-divider` | Línea divisoria y borde del contenedor. |
| `--mtx-color-background-paper`, `--mtx-shape-radius` | Fondo y radio de `mtx-tabs-container`. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-duration-standard`, `--mtx-duration-shorter`, `--mtx-easing-standard` | Animación del indicador y del color. |
| `--mtx-spacing-1`, `--mtx-font-family` | Separación icono-texto y tipografía. |

## Accesibilidad

- El contenedor recibe `role="tablist"` y `aria-orientation`; cada pestaña `role="tab"`, `aria-selected` y `aria-controls`; cada panel `role="tabpanel"` y `aria-labelledby`. Los ids se generan si faltan.
- Solo la pestaña activa está en el orden de tabulación (`tabindex="0"`); las demás usan `tabindex="-1"` y se alcanzan con las flechas (*roving tabindex*).
- Las pestañas deshabilitadas llevan `aria-disabled="true"` y el teclado las salta.
- Las pestañas de solo icono necesitan `aria-label`; el icono generado es decorativo (`aria-hidden`).

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> | Entra en la pestaña activa; el siguiente <kbd>Tab</kbd> sale de la barra. |
| <kbd>→</kbd> / <kbd>←</kbd> | Pestaña siguiente / anterior (horizontal), con ciclo. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Pestaña siguiente / anterior (vertical), con ciclo. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primera / última pestaña habilitada. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa la pestaña enfocada (activación manual). |
