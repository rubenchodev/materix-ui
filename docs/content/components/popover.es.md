---
title: "Popover"
description: "Paper flotante con contenido arbitrario anclado a un disparador. Se cierra al hacer clic fuera o con Escape y devuelve el foco al disparador."
group: "surfaces"
icon: "picture_in_picture"
weight: 40
example: "popover"
mui: "https://mui.com/material-ui/react-popover/"
---

Un **Popover** muestra cualquier contenido (texto, formularios, tarjetas) en una superficie [Paper](../paper/) flotante anclada a otro elemento, como el `Popover` de MUI. Úsalo para filtros, detalles rápidos, pequeñas confirmaciones o una tarjeta de cuenta. Para una lista de acciones usa un [Menu](../menu/); para una etiqueta de texto breve, un [Tooltip](../tooltip/); para una tarea que bloquea la página, un [Dialog](../dialog/).

## Uso básico

Un elemento con `data-mtx="popover"` e `id`, y un disparador con `data-open-popover="#id"`. Se abre debajo del disparador, alineado a su borde inicial, con elevación 8. El foco pasa al primer control (o al panel) y vuelve al disparador al cerrarse.

{{< mtx-demo title="data-open-popover" height="200px" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-open-popover="#doc-popover-basic">Abrir popover</button>
<div data-mtx="popover" id="doc-popover-basic" data-label="Popover básico" class="mtx-p-2">
  El contenido del popover.
</div>
{{< /mtx-demo >}}

El panel se porta a `<body>` al abrirse, así que los ancestros con `overflow: hidden` o `z-index` propio nunca lo recortan. El relleno del contenido lo decides tú: usa utilidades como `mtx-p-2`.

## Colocación

`data-placement` usa el mismo motor que Tooltip (`top|bottom|left|right` con `-start|-end`; por defecto `bottom-start`), con volteo y desplazamiento automáticos. `data-offset` fija la separación en px (0 por defecto, como MUI).

{{< mtx-demo title="data-placement" height="220px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-top">top</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-end">bottom-end</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-right">right · offset 8</button>
<div data-mtx="popover" id="doc-popover-top" data-placement="top" data-offset="8" data-label="Arriba" class="mtx-p-2">Arriba y centrado.</div>
<div data-mtx="popover" id="doc-popover-end" data-placement="bottom-end" data-label="Abajo al final" class="mtx-p-2">Abajo, alineado al final.</div>
<div data-mtx="popover" id="doc-popover-right" data-placement="right" data-offset="8" data-label="Derecha" class="mtx-p-2">A la derecha.</div>
{{< /mtx-demo >}}

## Orígenes de ancla

La API de MUI: `data-anchor-origin="vertical horizontal"` es el punto del ancla y `data-transform-origin` el punto del popover que se le une. Valores `top|center|bottom` y `left|center|right`, o píxeles. El popover se mantiene a 16 px de los bordes del viewport (el `marginThreshold` de MUI) y la animación grow parte del origen de transformación.

{{< mtx-demo title="anchorOrigin / transformOrigin" height="220px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-o1">bottom left → top left</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-o2">center center → center center</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-o3">top right → bottom right</button>
<div data-mtx="popover" id="doc-popover-o1" data-anchor-origin="bottom left" data-transform-origin="top left" data-label="Origen 1" class="mtx-p-2">anchor: bottom left · transform: top left</div>
<div data-mtx="popover" id="doc-popover-o2" data-anchor-origin="center center" data-transform-origin="center center" data-label="Origen 2" class="mtx-p-2">anchor: center center · transform: center center</div>
<div data-mtx="popover" id="doc-popover-o3" data-anchor-origin="top right" data-transform-origin="bottom right" data-label="Origen 3" class="mtx-p-2">anchor: top right · transform: bottom right</div>
{{< /mtx-demo >}}

Si hay cualquiera de los dos atributos de origen, tiene prioridad sobre `data-placement`.

## Con iconos

Cualquier botón puede ser el disparador. Los de solo icono necesitan nombre accesible: `aria-label` o un `data-mtx-tooltip`, que lo aporta. El disparador recibe `aria-haspopup="dialog"`, `aria-controls` y `aria-expanded` sincronizado.

{{< mtx-demo title="Disparadores" height="200px" >}}
<button data-mtx="icon-button" data-icon="info" data-mtx-tooltip="Información del pedido" data-open-popover="#doc-popover-info"></button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="tune" data-open-popover="#doc-popover-info">Detalles</button>
<div data-mtx="popover" id="doc-popover-info" class="mtx-p-2">
  <h3 class="mtx-typography--subtitle2">Pedido #48213</h3>
  <p class="mtx-typography--body2 mtx-color-text-secondary">Enviado el 12 de octubre con entrega estimada en 48 h.</p>
</div>
{{< /mtx-demo >}}

El encabezado interno del popover pasa a ser su nombre automáticamente (`aria-labelledby`).

## Estados

Un disparador deshabilitado no abre el popover. Los botones con `data-mtx-popover-close` dentro del popover lo cierran (y devuelven el foco).

{{< mtx-demo title="Disparador deshabilitado y botones de cierre" height="220px" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-open-popover="#doc-popover-confirm" disabled>Deshabilitado</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-open-popover="#doc-popover-confirm">Archivar proyecto</button>
<div data-mtx="popover" id="doc-popover-confirm" class="mtx-p-2">
  <h3 class="mtx-typography--subtitle2 mtx-mb-1">¿Archivar el proyecto?</h3>
  <p class="mtx-typography--body2 mtx-mb-2">Podrás restaurarlo durante 30 días.</p>
  <div class="mtx-d-flex mtx-justify-content-end mtx-gap-1">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-popover-close>Cancelar</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-popover-close>Archivar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Modal

Por defecto el popover es **no modal**: no atrapa el foco ni bloquea el scroll, y al salir de él con Tab se cierra. Con `data-modal` se comporta como el Popover de MUI (basado en Modal): atrapa <kbd>Tab</kbd>, bloquea el scroll de la página y fija `aria-modal="true"`. `data-autofocus` en un control elige el foco inicial.

{{< mtx-demo title="data-modal" height="260px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-popover="#doc-popover-modal">Renombrar</button>
<div data-mtx="popover" id="doc-popover-modal" data-modal class="mtx-p-2">
  <h3 class="mtx-typography--subtitle2 mtx-mb-2">Renombrar</h3>
  <input data-mtx="text-field" data-label="Nombre" data-size="small" value="Informe Q3" data-autofocus>
  <div class="mtx-d-flex mtx-justify-content-end mtx-gap-1 mtx-mt-2">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-popover-close>Cancelar</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-popover-close>Guardar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Posición por coordenadas

`open({ x, y })` ancla el popover a un punto del viewport en lugar de a un elemento (el `anchorPosition` de MUI), por ejemplo la posición del cursor en un evento `contextmenu`.

```javascript
const popover = Materix.getInstance(document.getElementById('point-details'));
area.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  popover.open({ x: event.clientX, y: event.clientY });
});
```

## Casos de uso reales

Tarjeta de cuenta abierta desde el avatar de una barra de aplicación, alineada al final:

{{< mtx-demo title="Cuenta" height="240px" layout="center" >}}
<button class="mtx-icon-button" data-mtx="icon-button" data-open-popover="#doc-popover-profile">
  <span data-mtx="avatar" data-size="small" data-color="primary" aria-hidden="true">LG</span>
  <span class="mtx-visually-hidden">Cuenta de Laura Gómez</span>
</button>
<div data-mtx="popover" id="doc-popover-profile" data-placement="bottom-end" data-label="Cuenta">
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-2 mtx-p-2">
    <span data-mtx="avatar" data-color="primary" aria-hidden="true">LG</span>
    <div>
      <div class="mtx-typography--subtitle2">Laura Gómez</div>
      <div class="mtx-typography--body2 mtx-color-text-secondary">laura@example.com</div>
    </div>
  </div>
  <hr data-mtx="divider">
  <div class="mtx-d-flex mtx-justify-content-end mtx-p-1">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-start-icon="logout" data-mtx-popover-close>Cerrar sesión</button>
  </div>
</div>
{{< /mtx-demo >}}

Filtros de una tabla:

{{< mtx-demo title="Filtros" height="260px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="filter_list" data-open-popover="#doc-popover-filters">Filtros</button>
<div data-mtx="popover" id="doc-popover-filters" class="mtx-p-2">
  <h3 class="mtx-typography--subtitle2 mtx-mb-1">Filtrar pedidos</h3>
  <input type="checkbox" data-mtx="checkbox" data-label="Pendientes" checked>
  <input type="checkbox" data-mtx="checkbox" data-label="Enviados">
  <input type="checkbox" data-mtx="checkbox" data-label="Devueltos">
  <div class="mtx-d-flex mtx-justify-content-end mtx-mt-1">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-popover-close>Aplicar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Dialog desde un popover

Un botón dentro del popover puede abrir un [Dialog]({{< relref "/components/dialog" >}}). Ambas superficies comparten la [pila de capas]({{< relref "/guide/accessibility" >}}#escape-y-capas-apiladas): interactuar con el diálogo no es un «clic fuera» para el popover, el primer <kbd>Escape</kbd> cierra solo el diálogo (el foco vuelve al botón dentro del popover) y el segundo cierra el popover.

{{< mtx-demo title="Dialog abierto desde un popover" height="300px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="tune" data-open-popover="#doc-popover-advanced">Opciones</button>
<div data-mtx="popover" id="doc-popover-advanced" class="mtx-p-2" data-label="Opciones">
  <input type="checkbox" data-mtx="checkbox" data-label="Solo los míos" checked>
  <div class="mtx-d-flex mtx-justify-content-end mtx-mt-1">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-open="doc-popover-dialog">Avanzado…</button>
  </div>
</div>
<div data-mtx="dialog" id="doc-popover-dialog" class="mtx-dialog--max-xs" data-title="Opciones avanzadas" data-description="Pulsa Escape una vez para cerrar este diálogo; el popover sigue abierto.">
  <div data-mtx="dialog-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cerrar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Tras inicializarse, el popover tiene esta estructura. Puedes escribirla tal cual para SSR: el componente respeta `role`, `aria-label`/`aria-labelledby` y `tabindex` existentes. Un disparador también puede declararse con `aria-controls`.

```html
<button class="mtx-button mtx-button--outlined" data-mtx="button"
        aria-controls="details" aria-haspopup="dialog" aria-expanded="false">Abrir</button>
<div class="mtx-popover mtx-p-2" data-mtx="popover" id="details" role="dialog" tabindex="-1"
     aria-labelledby="details-title" hidden>
  <h3 class="mtx-typography--subtitle2" id="details-title">Detalles</h3>
  …
</div>
```

## Uso programático

```javascript
const el = document.getElementById('filters');
const popover = Materix.getInstance(el);   // o Materix.init(el)

popover.open(document.getElementById('filter-button')); // elemento ancla
popover.open({ x: 200, y: 120 });          // punto del viewport
popover.close();
popover.toggle(anchorButton);
popover.update();                          // recalcula la posición
console.log(popover.isOpen);

el.addEventListener('mtx:popover:open', (event) => console.log(event.detail.anchor));
el.addEventListener('mtx:popover:close', (event) => console.log(event.detail.reason));
```

Con módulos ES:

```javascript
import { Popover, computePosition, autoUpdate } from 'materix-ui';
const popover = new Popover(document.getElementById('filters'));
```

{{< mtx-demo title="open(), toggle() y close()" height="200px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-popover="open" id="doc-popover-anchor">open(this)</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-popover="toggle">toggle(this)</button>
<span id="doc-popover-status" aria-live="polite"></span>
<div data-mtx="popover" id="doc-popover-api" data-label="Popover programático" class="mtx-p-2">
  <p class="mtx-mb-1">Abierto por código.</p>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-doc-popover="close">close()</button>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-popover-api');
  const popover = Materix.getInstance(el);
  const status = document.getElementById('doc-popover-status');
  document.querySelectorAll('[data-doc-popover]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.docPopover;
      if (action === 'open') popover.open(button);
      if (action === 'toggle') popover.toggle(button);
      if (action === 'close') popover.close();
    });
  });
  el.addEventListener('mtx:popover:open', () => { status.textContent = 'mtx:popover:open'; });
  el.addEventListener('mtx:popover:close', (event) => { status.textContent = 'mtx:popover:close · ' + event.detail.reason; });
});
</script>

### Motor de posicionamiento

`Materix.computePosition(anchor, floating, options)` y `Materix.autoUpdate(anchor, floating, update)` son públicos, para tus propias superficies flotantes:

```javascript
const { x, y, placement } = Materix.computePosition(button, panel, {
  placement: 'bottom-start', // top|bottom|left|right + -start|-end
  offset: 8,                 // separación en px
  flip: true,                // cambia al lado opuesto si no cabe
  shift: true,               // lo mantiene dentro del viewport en el eje cruzado
  padding: 8,                // distancia mínima al borde del viewport
});
panel.style.left = `${x}px`;
panel.style.top = `${y}px`;   // con position: fixed

const stop = Materix.autoUpdate(button, panel, () => { /* recalcular */ });
stop(); // retira los listeners de scroll/resize y el ResizeObserver
```

El resultado incluye además `side`, `align` (físicos, tras el volteo y RTL) y `arrowOffset` (centro del ancla relativo a la superficie). El ancla puede ser virtual: cualquier objeto con `getBoundingClientRect()`.

## Referencia de API

### Atributos data-*

**Popover** (`data-mtx="popover"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `id` | Texto | auto | Necesario para los disparadores declarativos. |
| `data-placement` | `top`, `bottom`, `left`, `right` + `-start`/`-end` | `bottom-start` | Colocación con volteo y desplazamiento. |
| `data-offset` | px | `0` | Separación con el ancla (con `data-placement`). |
| `data-anchor-origin` | `"vertical horizontal"` (`top/center/bottom`, `left/center/right` o px) | `bottom left` | Punto del ancla (algoritmo de MUI). Prevalece sobre `data-placement`. |
| `data-transform-origin` | Igual | `top left` | Punto del popover que se une al ancla. |
| `data-anchor` | Selector | — | Elemento ancla fijo (si no, el disparador que lo abrió). |
| `data-label` | Texto | — | `aria-label` del diálogo (si no hay encabezado). |
| `data-elevation` | `0`–`8`, `12`, `16`, `24` | `8` | Sombra (y overlay en tema oscuro). |
| `data-modal` | booleano | — | Atrapa el foco, bloquea el scroll y fija `aria-modal="true"`. |

**Dentro y fuera del popover**

| Atributo | En | Descripción |
|---|---|---|
| `data-open-popover="#id"` | Disparador | Abre/cierra el popover (funciona con disparadores añadidos después). |
| `aria-controls="id"` | Disparador | Alternativa a `data-open-popover`. |
| `data-mtx-popover-close` | Hijo | Cierra el popover al pulsarlo. |
| `data-autofocus` | Hijo | Control que recibe el foco inicial. |
| `data-popover-title` | Hijo | Elemento usado como nombre (`aria-labelledby`) en lugar del primer encabezado. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-popover` | Superficie: Paper con radio 4px, elevación 8, `max-width`/`max-height` `calc(100% - 32px)` y scroll propio. |
| `mtx-popover--open` | Estado visible (transición grow desde el origen de transformación). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `open(anchor?)` | `boolean` | Abre anclado a un elemento, a un punto `{ x, y }` o a un ancla virtual. |
| `close(options?)` | `void` | Lo cierra; `{ restoreFocus: false }` no devuelve el foco. |
| `toggle(anchor?)` | `void` | Alterna el estado. |
| `update()` | `void` | Recalcula la posición (se hace solo en scroll/resize). |
| `isOpen` | `boolean` | Estado abierto. |
| `triggers` | `HTMLElement[]` | Disparadores declarados actuales. |
| `destroy()` | `void` | Lo cierra, lo devuelve a su lugar original del DOM y retira los listeners. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:popover:open` | `{ popover, anchor }` | Se abre. |
| `mtx:popover:close` | `{ popover, reason }` | Se cierra. `reason`: `escape`, `click-away`, `tab`, `trigger`, `action`, `api`. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-popover-shadow` | Sombra (la fija `data-elevation`; por defecto `--mtx-elevation-8`). |
| `--mtx-popover-overlay` | Overlay de elevación en tema oscuro. |
| `--mtx-color-background-paper`, `--mtx-color-text-primary` | Superficie y texto. |
| `--mtx-z-index-modal` | Nivel de apilamiento (1300). |

## Accesibilidad

- El popover tiene `role="dialog"`. Su nombre sale de `data-label` (`aria-label`), de `data-popover-title` o del primer encabezado interno (`aria-labelledby`). Con `data-modal` además recibe `aria-modal="true"`.
- El disparador recibe `aria-haspopup="dialog"`, `aria-controls` y `aria-expanded` sincronizado con el estado.
- Al abrirse, el foco pasa a `[data-autofocus]`, al primer control enfocable o al propio panel (`tabindex="-1"`). Al cerrarse con <kbd>Escape</kbd>, con el disparador o con un botón de cierre, el foco vuelve al elemento que lo tenía.
- Al abrirse desde un disparador, este se guarda como destino de retorno del foco aunque el navegador no lo enfoque al hacer clic (WebKit/Safari), así que <kbd>Escape</kbd> y las acciones de cierre siempre le devuelven el foco.
- Un clic fuera lo cierra sin robar el foco al elemento pulsado; si el clic cae en una zona no enfocable y el foco se perdería, vuelve al disparador.
- Si el disparador solo muestra un avatar o iniciales, nómbralo con texto oculto visualmente (`<span class="mtx-visually-hidden">…</span>`) en lugar de un `aria-label` que no contenga el texto visible (WCAG 2.5.3 *Etiqueta en el nombre*).

| Tecla | Acción |
|---|---|
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en el disparador | Abre o cierra el popover. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre sus controles. No modal: salir del popover lo cierra. Modal: el foco circula dentro. |
| <kbd>Escape</kbd> | Lo cierra y devuelve el foco al disparador, solo si es la capa superior (antes se cierran un tooltip visible, un menú o un diálogo abiertos desde él). |
