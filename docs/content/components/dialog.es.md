---
title: "Dialog"
description: "Ventana modal que interrumpe la tarea para pedir una decisión o mostrar información crítica, con foco atrapado y cierre por Escape."
group: "feedback"
icon: "open_in_browser"
weight: 20
example: "dialog"
mui: "https://mui.com/material-ui/react-dialog/"
---

**Dialog** abre un panel modal sobre la página: bloquea el scroll, atrapa el foco del teclado y obliga a resolver una decisión antes de continuar. Úsalo para confirmaciones, formularios cortos o información que el usuario no debe pasar por alto. No lo uses para avisos que no requieren respuesta (usa [Snackbar](../snackbar/) o [Alert](../alert/)) ni para navegación lateral (usa [Drawer](../drawer/)).

## Uso básico

Declara el contenedor con `data-mtx="dialog"` y `data-title`: el componente genera el fondo (`.mtx-dialog__backdrop`), el panel (`.mtx-dialog__paper`), el título y el contenido. Cualquier elemento con `data-mtx-dialog-open="id"` lo abre sin escribir JavaScript.

{{< mtx-demo title="Diálogo simple" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-basic">Abrir diálogo</button>

<div data-mtx="dialog" id="doc-dlg-basic" data-title="Usar la ubicación del dispositivo">
  <p>Permite que las aplicaciones determinen tu ubicación. Pulsa Escape o haz clic fuera para cerrar.</p>
</div>
{{< /mtx-demo >}}

## Con acciones

Envuelve los botones en `.mtx-dialog__actions`: el componente los coloca siempre al final del panel, fuera del contenido, aunque no uses `.mtx-dialog__content`. `data-description` genera el texto de apoyo (`.mtx-dialog__content-text`, equivalente a `DialogContentText` de MUI) y lo enlaza con `aria-describedby`. Todo elemento con `data-mtx-dialog-close` cierra el diálogo. Sigue la convención de MUI: acción principal `contained`, secundaria `text`.

{{< mtx-demo title="Título, contenido y acciones" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-actions">Abrir con acciones</button>

<div data-mtx="dialog" id="doc-dlg-actions" data-title="¿Activar la sincronización?">
  <div class="mtx-dialog__content">Tus documentos se copiarán en la nube y estarán disponibles en todos tus dispositivos.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancelar</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Activar</button>
  </div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="data-description y acciones sin contenedor de contenido" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-description">Descartar borrador</button>

<div data-mtx="dialog" id="doc-dlg-description" class="mtx-dialog--max-sm" data-title="¿Descartar el borrador?" data-description="El mensaje se eliminará y no podrás recuperarlo.">
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close data-dialog-autofocus>Cancelar</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Descartar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Alineación de acciones

Como en `DialogActions` de MUI, las acciones van **a la derecha** por defecto (`end`) en todas las formas: sintaxis simplificada, BEM completo y `data-mtx="dialog-actions"`. Cámbiala con `data-align="start|center|end|between"` en `.mtx-dialog__actions` (o `data-mtx="dialog-actions"`), o fíjala para todas las filas de acciones de un diálogo con `data-actions-align` en el diálogo; el `data-align` propio de una fila tiene prioridad. `between` coloca una acción auxiliar a la izquierda y las principales a la derecha. `data-disable-spacing` elimina la separación entre botones (`disableSpacing` de MUI). El atributo `data-align` funciona también sin JavaScript (HTML renderizado en servidor).

{{< mtx-demo title="Alineación de acciones" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-align-end">end (predeterminado)</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-align-start">start</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-align-center">center</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-align-between">between</button>
</div>

<div data-mtx="dialog" id="doc-dlg-align-end" class="mtx-dialog--max-sm" data-title="Acciones a la derecha" data-description="Sin atributos, las acciones se alinean al final del panel.">
  <div data-mtx="dialog-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancelar</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Aceptar</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-align-start" class="mtx-dialog--max-sm" data-title="Acciones al inicio" data-description="data-actions-align=&quot;start&quot; en el diálogo se aplica a sus acciones." data-actions-align="start">
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Aceptar</button>
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancelar</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-align-center" class="mtx-dialog--max-sm" data-title="Acción centrada" data-description="Útil para confirmaciones con una única acción.">
  <div data-mtx="dialog-actions" data-align="center">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Entendido</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-align-between" class="mtx-dialog--max-sm" data-title="Exportar informe" data-description="La acción auxiliar queda a la izquierda y las principales a la derecha.">
  <div data-mtx="dialog-actions" data-align="between">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-start-icon="help_outline">Ayuda</button>
    <div class="mtx-d-flex mtx-gap-1">
      <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancelar</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Exportar</button>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

```html
<!-- Predeterminado: a la derecha -->
<div data-mtx="dialog" id="d1" data-title="Acciones a la derecha">
  <div data-mtx="dialog-actions">…</div>
</div>

<!-- En todo el diálogo -->
<div data-mtx="dialog" id="d2" data-title="…" data-actions-align="start">…</div>

<!-- En una fila concreta: start | center | end | between -->
<div class="mtx-dialog__actions" data-align="between">
  <button class="mtx-button mtx-button--text" data-mtx="button">Ayuda</button>
  <div class="mtx-d-flex mtx-gap-1">…</div>
</div>
```

## Tamaños

El ancho máximo se fija con una clase en el contenedor. El panel ocupa el 100 % del ancho disponible hasta ese límite; `mtx-dialog--full` lo convierte en pantalla completa (equivalente a `fullScreen` de MUI).

| Clase | Ancho máximo |
|---|---|
| `mtx-dialog--max-sm` | 24rem |
| `mtx-dialog--max-md` | 32rem (predeterminado) |
| `mtx-dialog--max-lg` | 48rem |
| `mtx-dialog--max-xl` | 64rem |
| `mtx-dialog--full` | 100 % del ancho y del alto, sin radio |

{{< mtx-demo title="Anchos máximos y pantalla completa" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-sm">SM</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-lg">LG</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-full">Pantalla completa</button>

<div data-mtx="dialog" id="doc-dlg-sm" class="mtx-dialog--max-sm" data-title="Tamaño SM">
  <div class="mtx-dialog__content">Ancho máximo de 24rem.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cerrar</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-lg" class="mtx-dialog--max-lg" data-title="Tamaño LG">
  <div class="mtx-dialog__content">Ancho máximo de 48rem.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cerrar</button>
  </div>
</div>

<div data-mtx="dialog" id="doc-dlg-full" class="mtx-dialog--full" data-title="Editar publicación">
  <div class="mtx-dialog__content">El panel ocupa toda la ventana: recomendado en móviles para tareas largas.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Descartar</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Guardar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Confirmación

Para acciones irreversibles formula el título como pregunta, explica la consecuencia y usa `mtx-button--error`. `data-dialog-autofocus` en «Cancelar» hace que el foco inicial caiga en la opción segura.

{{< mtx-demo title="Confirmación destructiva" >}}
<button class="mtx-button mtx-button--contained mtx-button--error" data-mtx="button" data-mtx-dialog-open="doc-dlg-confirm">Eliminar proyecto</button>

<div data-mtx="dialog" id="doc-dlg-confirm" class="mtx-dialog--max-sm" data-title="¿Eliminar el proyecto?">
  <div class="mtx-dialog__content">Se borrarán sus 24 archivos y no podrás recuperarlos.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close data-dialog-autofocus>Cancelar</button>
    <button class="mtx-button mtx-button--contained mtx-button--error" data-mtx="button" data-mtx-dialog-close>Eliminar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Scroll

`data-scroll="paper"` (predeterminado) limita el panel a la altura de la ventana menos 64 px y desplaza el contenido dentro de él. `mtx-dialog__content--dividers` añade bordes arriba y abajo del contenido, y `mtx-dialog__actions--sticky` (o `mtx-dialog__title--sticky`) hace que solo el contenido se desplace. `data-scroll="body"` (`scroll="body"` de MUI) quita el límite de altura: el panel crece con su contenido y se desplaza el contenedor completo del diálogo, mientras el fondo queda fijo.

{{< mtx-demo title="scroll = paper con divisores" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-scroll">Términos y condiciones</button>

<div data-mtx="dialog" id="doc-dlg-scroll" data-scroll="paper" data-title="Términos y condiciones">
  <div class="mtx-dialog__content mtx-dialog__content--dividers">
    <p>1. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    <p>2. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl.</p>
    <p>3. Aenean lacinia bibendum nulla sed consectetur. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    <p>4. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    <p>5. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl.</p>
    <p>6. Aenean lacinia bibendum nulla sed consectetur. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    <p>7. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    <p>8. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl.</p>
    <p>9. Aenean lacinia bibendum nulla sed consectetur. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    <p>10. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    <p>11. Fin del documento.</p>
  </div>
  <div class="mtx-dialog__actions mtx-dialog__actions--sticky">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Rechazar</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Aceptar</button>
  </div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="scroll = body" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-scroll-body">Notas de la versión</button>

<div data-mtx="dialog" id="doc-dlg-scroll-body" data-scroll="body" data-title="Notas de la versión">
  <div class="mtx-dialog__content">
    <p class="mtx-dialog__content-text">El panel no tiene límite de altura: desplázate con la rueda, el teclado o arrastrando.</p>
    <p>1. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>2. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>3. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>4. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>5. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>6. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>7. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>8. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>9. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>10. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>11. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>12. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>13. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>14. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
    <p>15. Versión 1.x: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de tema para los componentes de feedback.</p>
  </div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Entendido</button>
  </div>
</div>
{{< /mtx-demo >}}

## Comportamiento modal

Por defecto el diálogo se cierra al hacer clic en el fondo y al pulsar Escape. `data-disable-backdrop-close` y `data-disable-escape` desactivan cada vía para forzar una elección explícita. Mientras hay un diálogo abierto, `<body>` recibe `overflow: hidden`; con varios diálogos apilados, solo el superior responde al teclado.

{{< mtx-demo title="Sin cierre por fondo ni Escape" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-dialog-open="doc-dlg-strict">Abrir diálogo estricto</button>

<div data-mtx="dialog" id="doc-dlg-strict" class="mtx-dialog--max-sm" data-disable-backdrop-close data-disable-escape data-title="Acepta para continuar">
  <div class="mtx-dialog__content">Ni el fondo ni Escape cierran este diálogo: solo el botón.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Aceptar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

### Formulario en un diálogo

El primer campo recibe el foco al abrir (o el marcado con `data-dialog-autofocus`, que funciona directamente sobre un `<input data-mtx="text-field">`) y `Tab` no sale del panel. El botón de envío está en las acciones y se asocia al formulario con el atributo `form`. Usa `.mtx-dialog__content-text` para el texto explicativo; si el contenido empieza directamente con un campo, el componente añade relleno superior para que el label flotante no se recorte.

{{< mtx-demo title="Suscripción" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-open="doc-dlg-form">Suscribirse</button>

<div data-mtx="dialog" id="doc-dlg-form" class="mtx-dialog--max-sm" data-title="Suscribirse al boletín">
  <div class="mtx-dialog__content">
    <form class="mtx-stack mtx-stack--col mtx-stack--spacing-2" id="doc-dlg-form-el">
      <p class="mtx-dialog__content-text">Recibe una vez al mes las novedades de Materix UI.</p>
      <input data-mtx="text-field" data-label="Nombre" type="text" name="name" required />
      <input data-mtx="text-field" data-label="Correo electrónico" type="email" name="email" required data-dialog-autofocus />
    </form>
  </div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancelar</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit" form="doc-dlg-form-el">Suscribirse</button>
  </div>
</div>
{{< /mtx-demo >}}

```javascript
const form = document.getElementById('doc-dlg-form-el');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  Materix.getInstance(document.getElementById('doc-dlg-form')).close('submit');
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('doc-dlg-form-el');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    Materix.getInstance(document.getElementById('doc-dlg-form')).close('submit');
    form.reset();
  });
});
</script>

### Formulario de dos columnas

Dentro del contenido puedes usar [Grid](../grid/); combínalo con `mtx-dialog--max-lg`.

```html
<div data-mtx="dialog" id="dlg-address" class="mtx-dialog--max-lg" data-title="Nueva dirección">
  <div class="mtx-dialog__content">
    <div data-mtx="grid" data-spacing="2">
      <div data-mtx="grid" data-xs="12" data-sm="6"><input data-mtx="text-field" data-label="Nombre" /></div>
      <div data-mtx="grid" data-xs="12" data-sm="6"><input data-mtx="text-field" data-label="Apellidos" /></div>
      <div data-mtx="grid" data-xs="12"><input data-mtx="text-field" data-label="Dirección" /></div>
    </div>
  </div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancelar</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Guardar</button>
  </div>
</div>
```

## Sintaxis BEM completa

Usa la estructura completa para SSR o control fino. `aria-labelledby`, `aria-describedby` y `aria-label` del contenedor se copian al panel; si faltan, el componente enlaza el panel con el `.mtx-dialog__title` y el `.mtx-dialog__content-text` existentes (generando ids cuando haga falta). Si el panel ya existe, no se genera nada nuevo.

```html
<div class="mtx-dialog mtx-dialog--max-sm" id="dlg-bem" data-mtx="dialog"
     aria-labelledby="dlg-bem-title" aria-describedby="dlg-bem-desc">
  <div class="mtx-dialog__backdrop" data-mtx-dialog-close></div>
  <div class="mtx-dialog__paper" role="dialog" aria-modal="true">
    <h2 class="mtx-dialog__title mtx-dialog__title--sticky" id="dlg-bem-title">Estructura BEM</h2>
    <div class="mtx-dialog__content" id="dlg-bem-desc">Renderizada en el servidor.</div>
    <div class="mtx-dialog__actions mtx-dialog__actions--sticky">
      <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancelar</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Aceptar</button>
    </div>
  </div>
</div>
```

## Uso programático

Los diálogos se inicializan al cargar la página. Para contenido dinámico usa `Materix.init(el)` o `new Materix.Dialog(el)`, y `Materix.getInstance(el)` para recuperar la instancia.

```javascript
// UMD (window.Materix)
const dialog = Materix.getInstance(document.getElementById('dlg-api'));
dialog.open();
dialog.isOpen;            // true
dialog.close('saved');    // detail.reason === 'saved'

document.addEventListener('mtx:dialog:close', (event) => {
  console.log(event.target.id, event.detail.reason);
  // 'escapeKeyDown' | 'backdropClick' | 'closeButtonClick' | 'programmatic' | motivo propio
});
```

```javascript
// ES modules
import { Dialog } from 'materix-ui';

const dialog = new Dialog(document.querySelector('#mi-dialogo'));
dialog.open();
```

{{< mtx-demo title="open() y registro de eventos" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-dlg-api-open">open()</button>
<span class="doc-demo-status" id="doc-dlg-api-log" role="status">Sin eventos todavía.</span>

<div data-mtx="dialog" id="doc-dlg-api" class="mtx-dialog--max-sm" data-title="Diálogo programático">
  <div class="mtx-dialog__content">Ciérralo con Escape, con el fondo o con el botón y mira el motivo.</div>
  <div class="mtx-dialog__actions">
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-dialog-close>Cerrar</button>
  </div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-dlg-api');
  if (!el) return;
  var out = document.getElementById('doc-dlg-api-log');
  document.getElementById('doc-dlg-api-open').addEventListener('click', function () { Materix.getInstance(el).open(); });
  el.addEventListener('mtx:dialog:open', function () { out.textContent = 'mtx:dialog:open'; });
  el.addEventListener('mtx:dialog:close', function (e) { out.textContent = 'mtx:dialog:close — reason: ' + e.detail.reason; });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `dialog` | — | Inicializa el componente. |
| `data-title` | texto | — | Genera un `<h2 class="mtx-dialog__title">` con `id` (`{id del diálogo}-title`) referenciado por `aria-labelledby` del panel (solo con auto-construcción). |
| `data-description` | texto | — | Genera `<p class="mtx-dialog__content-text">` al inicio del contenido, referenciado por `aria-describedby` (solo con auto-construcción). |
| `data-scroll` | `paper` \| `body` | `paper` | Desplazamiento dentro del panel, o panel de altura libre que desplaza el contenedor del diálogo. |
| `data-disable-backdrop-close` | booleano (presencia) | ausente | El clic en el fondo no cierra. |
| `data-disable-escape` | booleano (presencia) | ausente | Escape no cierra. |
| `data-mtx-dialog-open` | id del diálogo | — | En cualquier elemento: lo abre al hacer clic. |
| `data-mtx-dialog-close` | booleano (presencia) | — | En un elemento del diálogo: lo cierra al hacer clic (`reason: 'closeButtonClick'`, o `'backdropClick'` en el fondo). |
| `data-actions-align` | `start` \| `center` \| `end` \| `between` | `end` | Alineación que se aplica a las filas de acciones del diálogo que no declaran su propio `data-align`. |
| `data-dialog-autofocus` | booleano (presencia) | — | Elemento que recibe el foco al abrir (por defecto, el primer elemento enfocable). Si el marcado no es enfocable (p. ej. el contenedor que genera `<input data-mtx="text-field" data-dialog-autofocus>`), el foco va a su primer descendiente enfocable. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-dialog` | Contenedor fijo a pantalla completa (`--mtx-z-index-modal`, 1300). |
| `.mtx-dialog--open` | Estado abierto (lo gestiona el componente). |
| `.mtx-dialog--scroll-paper` / `--scroll-body` | Modo de desplazamiento (según `data-scroll`). |
| `.mtx-dialog--max-sm` / `--max-md` / `--max-lg` / `--max-xl` | Ancho máximo: 24 / 32 / 48 / 64rem. |
| `.mtx-dialog--full` | Pantalla completa sin radio ni márgenes. |
| `.mtx-dialog__backdrop` | Fondo semitransparente. |
| `.mtx-dialog__paper` | Panel con elevación 24 y `role="dialog"`. |
| `.mtx-dialog__title` | Título (tipografía h6). |
| `.mtx-dialog__title--sticky` | Título fijo con borde inferior; solo el contenido se desplaza. |
| `.mtx-dialog__content` | Zona de contenido (body1, color secundario). Recibe 16 px de relleno superior si empieza con un TextField/Select, para que el label no se recorte. |
| `.mtx-dialog__content-text` | Texto de apoyo (`DialogContentText` de MUI): body1, color secundario, sin márgenes. |
| `.mtx-dialog__content--dividers` | Bordes superior e inferior en el contenido. |
| `.mtx-dialog__actions` | Fila de botones, alineada a la derecha por defecto (`justify-content: flex-end`). En su propio elemento admite `data-mtx="dialog-actions"`, `data-align="start\|center\|end\|between"` y `data-disable-spacing`. |
| `.mtx-dialog__actions--start` / `--center` / `--between` | Alineación de las acciones (se añade desde `data-align` / `data-actions-align`; `end` no necesita clase). |
| `.mtx-dialog__actions--disable-spacing` | Sin separación entre acciones (`data-disable-spacing`). |
| `.mtx-dialog__actions--sticky` | Acciones fijas con borde superior. |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `open()` | `void` | Abre, bloquea el scroll, guarda el foco previo, enfoca el primer control y emite `mtx:dialog:open`. |
| `close(reason?)` | `void` | Cierra, restaura el foco previo y emite `mtx:dialog:close`. `reason` por defecto: `'programmatic'`. |
| `isOpen` | `boolean` | Getter: `true` si está abierto. |
| `destroy()` | `void` | Cierra si está abierto y elimina los listeners de clic, teclado y foco. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |
| `DialogActions#align` | `string` | Getter/setter de una instancia `data-mtx="dialog-actions"`: `start`, `center`, `end` o `between` (lanza `RangeError` con otro valor). |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:dialog:open` | — | El diálogo se abre (burbujea). |
| `mtx:dialog:close` | `{ reason }`: `'escapeKeyDown'`, `'backdropClick'`, `'closeButtonClick'`, `'programmatic'` o el motivo pasado a `close()` | El diálogo se cierra (burbujea). |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-background-paper` | Fondo del panel y de título/acciones fijos. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` | Color del título y del contenido. |
| `--mtx-color-divider` | Bordes de `--dividers` y `--sticky`. |
| `--mtx-elevation-24` | Sombra del panel. |
| `--mtx-overlay-elevation-24` | Capa blanca del panel en tema oscuro (elevación 24 de MUI). |
| `--mtx-shape-radius` | Radio del panel. |
| `--mtx-type-h6` / `--mtx-type-body1` | Tipografía del título y del contenido. |
| `--mtx-duration-short` / `--mtx-easing-standard` | Animación de entrada (escala y opacidad). |
| `--mtx-spacing-1` | Separación entre acciones. |
| `--mtx-z-index-modal` | Nivel de apilamiento (1300). |

## Accesibilidad

- El panel recibe `role="dialog"` y `aria-modal="true"`. Su nombre accesible sale del título: `aria-labelledby` apunta a `.mtx-dialog__title` (generado desde `data-title` o escrito a mano) salvo que el contenedor ya tenga `aria-labelledby` o `aria-label`, que se copian al panel. `.mtx-dialog__content-text` (o `data-description`) pasa a ser la descripción `aria-describedby`.
- Al abrir, el foco pasa al elemento con `data-dialog-autofocus` o al primer control enfocable (o al propio panel si no hay ninguno). Al cerrar vuelve al elemento que tenía el foco antes de abrir; si no era tabulable (en WebKit/Safari un clic no enfoca el botón), vuelve al disparador `data-mtx-dialog-open` pulsado.
- El foco queda atrapado en el panel: `Tab` y `Mayús+Tab` se interceptan siempre y el foco se mueve explícitamente entre sus controles tabulables (enlaces incluidos, también en WebKit/Safari); si el foco escapa, se devuelve al panel.
- La raíz fija (`.mtx-dialog`) fija `margin: 0`, así que los márgenes de estilos de la página (p. ej. `* + * { margin-top }`) nunca desplazan el diálogo ni su fondo.
- La animación de entrada se desactiva con `prefers-reduced-motion: reduce`.

| Tecla | Acción |
|---|---|
| `Tab` / `Mayús+Tab` | Recorre los controles del panel sin salir de él. |
| `Escape` | Cierra el diálogo cuando es la capa superior (`reason: 'escapeKeyDown'`), salvo con `data-disable-escape`. Antes se cierran un tooltip visible o un menú/popover abierto desde el diálogo ([pila de capas]({{< relref "/guide/accessibility" >}}#escape-y-capas-apiladas)). |
| `Enter` / `Espacio` | Activa el botón enfocado. |
