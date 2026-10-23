---
title: "Speed Dial"
description: "Botón de acción flotante que despliega de tres a seis acciones relacionadas con etiquetas, en cuatro direcciones, por clic o al pasar el cursor."
group: "navigation"
icon: "touch_app"
weight: 50
example: "speed-dial"
mui: "https://mui.com/material-ui/react-speed-dial/"
---

`SpeedDial` es un [Fab](../fab/) principal que, al pulsarlo, despliega varias acciones secundarias como FAB pequeños con etiqueta, igual que el `SpeedDial` de MUI. Úsalo cuando la acción principal de una pantalla tiene de tres a seis variantes relacionadas (crear documento, hoja, presentación). Si solo hay una acción, usa un `Fab`; si las opciones son muchas o no son acciones de creación, usa un [Menu](../menu/).

## Uso básico

Un contenedor `data-mtx="speed-dial"` con `data-icon` (icono del FAB principal) y `data-label` (su nombre accesible), y dentro un `<button>` por acción con `data-icon` y `data-tooltip`. El componente construye el FAB principal, el contenedor de acciones y las etiquetas.

{{< mtx-demo title="SpeedDial hacia arriba" layout="center" height="320px" >}}
<div data-mtx="speed-dial" data-icon="add" data-label="Crear">
  <button data-icon="description" data-tooltip="Documento" aria-label="Documento"></button>
  <button data-icon="table_chart" data-tooltip="Hoja de cálculo" aria-label="Hoja de cálculo"></button>
  <button data-icon="slideshow" data-tooltip="Presentación" aria-label="Presentación"></button>
</div>
{{< /mtx-demo >}}

{{< callout type="warning" title="Nombre accesible de cada acción" >}}
`data-tooltip` crea la etiqueta visible y, si el botón no tiene `aria-label`/`aria-labelledby`, también se copia a `aria-label`, así las acciones de solo icono siempre tienen nombre accesible.
{{< /callout >}}

Cuando está cerrado, las acciones son invisibles pero siguen ocupando su espacio en el flujo, como en MUI: coloca el SpeedDial en una esquina con posicionamiento absoluto o fijo (ver la sección «Posición»).

## Direcciones

`data-direction` define hacia dónde se despliegan las acciones: `up` (predeterminada), `down`, `left` o `right`. En vertical las etiquetas aparecen a la izquierda de cada acción; en horizontal, encima.

{{< mtx-demo title="up · down · left · right" layout="row" height="320px" >}}
<div data-mtx="speed-dial" data-direction="up" data-icon="north" data-label="Hacia arriba">
  <button data-icon="content_copy" data-tooltip="Copiar" aria-label="Copiar"></button>
  <button data-icon="share" data-tooltip="Compartir" aria-label="Compartir"></button>
</div>
<div data-mtx="speed-dial" data-direction="down" data-icon="south" data-label="Hacia abajo">
  <button data-icon="content_copy" data-tooltip="Copiar" aria-label="Copiar"></button>
  <button data-icon="share" data-tooltip="Compartir" aria-label="Compartir"></button>
</div>
<div data-mtx="speed-dial" data-direction="left" data-tooltip-hover data-icon="west" data-label="Hacia la izquierda">
  <button data-icon="content_copy" data-tooltip="Copiar" aria-label="Copiar"></button>
  <button data-icon="share" data-tooltip="Compartir" aria-label="Compartir"></button>
</div>
<div data-mtx="speed-dial" data-direction="right" data-tooltip-hover data-icon="east" data-label="Hacia la derecha">
  <button data-icon="content_copy" data-tooltip="Copiar" aria-label="Copiar"></button>
  <button data-icon="share" data-tooltip="Compartir" aria-label="Compartir"></button>
</div>
{{< /mtx-demo >}}

## Colores

`data-color` en el contenedor colorea el FAB principal (`primary` por defecto) y en cada acción, el FAB de esa acción (`secondary` por defecto). Acepta los colores de la paleta.

{{< mtx-demo title="Colores del FAB y de las acciones" layout="center" height="300px" >}}
<div data-mtx="speed-dial" data-icon="edit" data-color="secondary" data-label="Editar">
  <button data-icon="delete" data-color="error" data-tooltip="Eliminar" aria-label="Eliminar"></button>
  <button data-icon="save" data-color="success" data-tooltip="Guardar" aria-label="Guardar"></button>
  <button data-icon="info" data-color="info" data-tooltip="Detalles" aria-label="Detalles"></button>
</div>
{{< /mtx-demo >}}

## Etiquetas

Por defecto las etiquetas de todas las acciones están visibles mientras el SpeedDial está abierto (equivale a `tooltipOpen` de MUI), con el aspecto del [Tooltip](../tooltip/). Con `data-tooltip-hover` cada acción usa un [Tooltip](../tooltip/) real (`data-mtx-tooltip`) que aparece al pasar el cursor **o al enfocarla con el teclado**, a la izquierda en direcciones verticales y encima en horizontales; recomendado en direcciones horizontales para que no se solapen.

{{< mtx-demo title="Etiquetas solo en hover" layout="center" height="300px" >}}
<div data-mtx="speed-dial" data-tooltip-hover data-icon="add" data-label="Crear">
  <button data-icon="description" data-tooltip="Documento" aria-label="Documento"></button>
  <button data-icon="table_chart" data-tooltip="Hoja de cálculo" aria-label="Hoja de cálculo"></button>
</div>
{{< /mtx-demo >}}

{{< callout type="info" title="Teclado" >}}
En ambos modos la etiqueta es visible al recorrer las acciones con <kbd>Tab</kbd>: en el modo persistente siempre lo está y con `data-tooltip-hover` el Tooltip aparece con el foco de teclado y se oculta con <kbd>Escape</kbd>. El nombre accesible de cada acción sigue siendo su `aria-label` (las etiquetas persistentes son `aria-hidden` para no leerse dos veces).
{{< /callout >}}

## Apertura al pasar el cursor

`data-event="hover"` abre el SpeedDial al entrar con el cursor y lo cierra al salir. El clic en el FAB sigue alternándolo, de modo que funciona también en pantallas táctiles y con teclado.

{{< mtx-demo title="data-event=&quot;hover&quot;" layout="center" height="300px" >}}
<div data-mtx="speed-dial" data-event="hover" data-icon="menu" data-label="Acciones rápidas">
  <button data-icon="print" data-tooltip="Imprimir" aria-label="Imprimir"></button>
  <button data-icon="download" data-tooltip="Descargar" aria-label="Descargar"></button>
</div>
{{< /mtx-demo >}}

## Posición

Las clases `mtx-speed-dial--fixed-br` y `mtx-speed-dial--fixed-bl` lo fijan a 24px de la esquina inferior derecha o izquierda de la ventana, por encima del contenido (`z-index` 1050).

```html
<div data-mtx="speed-dial" class="mtx-speed-dial--fixed-br" data-icon="add" data-label="Crear">
  <button data-icon="description" data-tooltip="Documento" aria-label="Documento"></button>
</div>
```

No existe un modo «siempre abierto» declarativo: para mostrarlo desplegado llama a `open()` (ver «Uso programático»).

## Casos de uso reales

Acciones de una galería de fotos: cada acción ejecuta su tarea y cierra el SpeedDial.

{{< mtx-demo title="Galería" layout="center" height="300px" >}}
<div data-mtx="speed-dial" id="doc-speed-dial-gallery" data-icon="add_a_photo" data-label="Añadir a la galería">
  <button data-icon="photo_camera" data-tooltip="Hacer foto" aria-label="Hacer foto"></button>
  <button data-icon="upload" data-tooltip="Subir archivo" aria-label="Subir archivo"></button>
  <button data-icon="create_new_folder" data-tooltip="Nuevo álbum" aria-label="Nuevo álbum"></button>
</div>
<p id="doc-speed-dial-gallery-status" aria-live="polite">Elige una acción.</p>
{{< /mtx-demo >}}

```javascript
const el = document.getElementById('doc-speed-dial-gallery');
el.querySelectorAll('.mtx-speed-dial__action').forEach((action) => {
  action.addEventListener('click', () => {
    console.log(action.getAttribute('aria-label'));
    Materix.getInstance(el).close();
  });
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-speed-dial-gallery');
  const status = document.getElementById('doc-speed-dial-gallery-status');
  el.querySelectorAll('.mtx-speed-dial__action').forEach((action) => {
    action.addEventListener('click', () => {
      status.textContent = 'Acción: ' + action.getAttribute('aria-label');
      Materix.getInstance(el).close();
    });
  });
});
</script>

## Sintaxis BEM completa

Con la estructura escrita a mano el componente reutiliza el FAB y el contenedor de acciones, y solo envuelve cada acción con `data-tooltip` en `mtx-speed-dial__action-wrapper`.

```html
<div class="mtx-speed-dial" data-mtx="speed-dial" data-direction="up">
  <button type="button" class="mtx-fab mtx-fab--primary mtx-speed-dial__fab" aria-label="Crear">
    <span class="material-icons" aria-hidden="true">add</span>
  </button>
  <div class="mtx-speed-dial__actions">
    <button type="button" class="mtx-fab mtx-fab--small mtx-fab--secondary mtx-speed-dial__action"
            data-tooltip="Documento" aria-label="Documento">
      <span class="material-icons" aria-hidden="true">description</span>
    </button>
  </div>
</div>
```

## Uso programático

```javascript
const dial = Materix.getInstance(document.getElementById('acciones'));
dial.open();
dial.close();
dial.toggle();
console.log(dial.isOpen);
dial.direction = 'left';      // cambia la clase de dirección

dial.element.addEventListener('mtx:speed-dial:open', (event) => {
  console.log('abierto', event.detail.speedDial);
});
dial.element.addEventListener('mtx:speed-dial:close', () => console.log('cerrado'));
```

Con ES modules:

```javascript
import { SpeedDial, getInstance } from 'materix-ui';
const dial = new SpeedDial(document.getElementById('acciones'));
```

{{< mtx-demo title="open(), close() y dirección" layout="row" height="300px" >}}
<div data-mtx="speed-dial" id="doc-speed-dial-api" data-icon="add" data-label="Acciones">
  <button data-icon="mail" data-tooltip="Correo" aria-label="Correo"></button>
  <button data-icon="link" data-tooltip="Enlace" aria-label="Enlace"></button>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-dial="open">open()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-dial="close">close()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-dial="direction">direction = right / up</button>
<span id="doc-speed-dial-status" aria-live="polite"></span>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-speed-dial-api');
  const dial = Materix.getInstance(el);
  const status = document.getElementById('doc-speed-dial-status');
  document.querySelectorAll('[data-doc-dial]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const action = btn.dataset.docDial;
      if (action === 'direction') dial.direction = dial.direction === 'up' ? 'right' : 'up';
      else dial[action]();
    });
  });
  el.addEventListener('mtx:speed-dial:open', () => { status.textContent = 'mtx:speed-dial:open'; });
  el.addEventListener('mtx:speed-dial:close', () => { status.textContent = 'mtx:speed-dial:close'; });
});
</script>

## Referencia de API

### Atributos data-*

**SpeedDial** (`data-mtx="speed-dial"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-icon` | Nombre de Material Icons | — | Genera el FAB principal si no existe `.mtx-speed-dial__fab` ni `.mtx-fab`. El icono gira 45° al abrir. |
| `data-label` | Texto | i18n `speedDial.actions` (`Actions` / `Acciones`) | `aria-label` del FAB principal generado. |
| `data-color` | `primary`, `secondary`, `error`, `warning`, `info`, `success` | `primary` | Color del FAB principal generado. |
| `data-direction` | `up`, `down`, `left`, `right` | `up` | Dirección de despliegue. |
| `data-event` | `click`, `hover` | `click` | Con `hover` también abre al entrar con el cursor y cierra al salir. |
| `data-tooltip-hover` | booleano | — | Sustituye las etiquetas persistentes por un [Tooltip](../tooltip/) por acción (hover y foco de teclado). |

**Acción** (`<button>` hijo, sintaxis simplificada)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-icon` | Nombre de Material Icons | — | Icono de la acción. |
| `data-tooltip` | Texto | — | Etiqueta visible junto a la acción; también su `aria-label` si no tiene uno. |
| `data-color` | Colores de la paleta | `secondary` | Color del FAB pequeño de la acción. |
| `aria-label` | Texto | — | Nombre accesible (obligatorio; no se genera). |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-speed-dial` | Contenedor flex (`z-index` 1050). |
| `mtx-speed-dial--direction-up` / `--down` / `--left` / `--right` | Dirección de despliegue. |
| `mtx-speed-dial--open` | Estado abierto: acciones visibles e icono principal girado 45°. |
| `mtx-speed-dial--tooltip-hover` | Modo de etiquetas con Tooltip (hover/foco). |
| `mtx-speed-dial--fixed-br` / `mtx-speed-dial--fixed-bl` | Fijo a 24px de la esquina inferior derecha / izquierda. |
| `mtx-speed-dial__fab` | FAB principal. |
| `mtx-speed-dial__actions` | Contenedor de acciones (separación de 12px). |
| `mtx-speed-dial__action` | FAB pequeño de cada acción. |
| `mtx-speed-dial__action-wrapper` | Envoltorio de acción + etiqueta, con animación escalonada. |
| `mtx-speed-dial__tooltip` | Etiqueta persistente de la acción (modo por defecto, `aria-hidden`). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `open()` | `void` | Despliega las acciones y pone `aria-expanded="true"` en el FAB. |
| `close()` | `void` | Pliega las acciones. |
| `toggle()` | `void` | Alterna el estado. |
| `isOpen` (getter) | `boolean` | Estado abierto. |
| `direction` (get/set) | `string` | Dirección actual; al asignarla cambia la clase. |
| `destroy()` | `void` | Retira los listeners del FAB, del contenedor y del documento. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:speed-dial:open` | `{ speedDial }` | Se abre (clic, hover u `open()`). |
| `mtx:speed-dial:close` | `{ speedDial }` | Se cierra (clic, clic fuera, <kbd>Escape</kbd>, salida del cursor o `close()`). |

Los nombres anteriores `mtx-speed-dial-open` y `mtx-speed-dial-close` se siguen emitiendo como alias deprecados hasta la 1.0.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-duration-short`, `--mtx-duration-shorter`, `--mtx-easing-standard` | Giro del icono, aparición de acciones y etiquetas. |
| `--mtx-tooltip-bg`, `--mtx-tooltip-color`, `--mtx-tooltip-font-size`, `--mtx-tooltip-max-width` | Etiquetas persistentes (los mismos tokens que el [Tooltip](../tooltip/)). |
| `--mtx-font-family` | Tipografía de las etiquetas. |

El FAB principal y las acciones usan las variables de [Fab](../fab/).

## Accesibilidad

- El FAB principal recibe `aria-haspopup="true"` y `aria-expanded` sincronizado; su nombre sale de `data-label` (o del `aria-label` que escribas en la sintaxis BEM).
- Las acciones son `<button>` nativos con icono decorativo (`aria-hidden`): necesitan `aria-label`.
- Con el SpeedDial cerrado, el contenedor de acciones recibe `inert` y `aria-hidden="true"` y cada acción `tabindex="-1"`, así las acciones invisibles salen del orden de tabulación; al abrir se restauran. El FAB tiene `aria-controls` apuntando al contenedor de acciones.
- Las etiquetas persistentes llevan `aria-hidden="true"` (el nombre ya está en el `aria-label`); con `data-tooltip-hover` el Tooltip no duplica el nombre si coincide con el texto.
- Respeta `prefers-reduced-motion` a través de la regla global de `CssBaseline`.

| Tecla | Acción |
|---|---|
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en el FAB | Abre o cierra el SpeedDial. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre las acciones. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en una acción | Ejecuta la acción. |
| <kbd>Escape</kbd> | Cierra el SpeedDial y devuelve el foco al FAB (y oculta el Tooltip visible). |
