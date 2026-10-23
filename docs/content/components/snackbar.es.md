---
title: "Snackbar"
description: "Notificación breve y temporal en un borde de la pantalla que confirma una acción y puede ofrecer deshacerla."
group: "feedback"
icon: "chat_bubble"
weight: 30
example: "snackbar"
mui: "https://mui.com/material-ui/react-snackbar/"
---

**Snackbar** muestra un mensaje corto flotante en un borde de la pantalla para confirmar el resultado de una acción («Correo enviado», «Elemento eliminado») y, opcionalmente, ofrecer una única acción como «Deshacer». No interrumpe al usuario y puede cerrarse sola. No la uses para errores que el usuario debe resolver (usa [Alert](../alert/) junto al contenido) ni para decisiones obligatorias (usa [Dialog](../dialog/)).

## Uso básico

Declara el snackbar con `data-message` en cualquier parte del `<body>`: está oculto hasta que llamas a `open()`. No existe un atributo declarativo de apertura, así que el disparador necesita una línea de JavaScript.

{{< mtx-demo title="Snackbar simple" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-doc-snackbar="doc-snack-basic">Mostrar snackbar</button>

<div data-mtx="snackbar" id="doc-snack-basic" data-message="Mensaje archivado" data-duration="4000"></div>
{{< /mtx-demo >}}

```javascript
document.querySelector('[data-doc-snackbar]').addEventListener('click', () => {
  Materix.getInstance(document.getElementById('doc-snack-basic')).open();
});
```

## Con acción

`data-action` genera un botón `.mtx-snackbar__action` a la derecha del mensaje. Con `data-close-on-action` el snackbar se cierra al pulsarlo (`reason: 'action'`); cada pulsación emite además `mtx:snackbar:action`, que puedes escuchar para ejecutar tu lógica.

{{< mtx-demo title="Acción Deshacer" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-action">Eliminar correo</button>

<div data-mtx="snackbar" id="doc-snack-action" data-message="Correo eliminado" data-action="Deshacer" data-close-on-action data-duration="6000"></div>
{{< /mtx-demo >}}

## Posición

`data-anchor` admite seis posiciones. En pantallas de 600 px o menos, el snackbar se estira a todo el ancho con 8 px de margen a cada lado.

{{< mtx-demo title="Seis anclajes" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-tl">top-left</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-tc">top-center</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-tr">top-right</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-bl">bottom-left</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-bc">bottom-center</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-br">bottom-right</button>

<div data-mtx="snackbar" id="doc-snack-tl" data-message="Arriba a la izquierda" data-anchor="top-left" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-tc" data-message="Arriba al centro" data-anchor="top-center" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-tr" data-message="Arriba a la derecha" data-anchor="top-right" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-bl" data-message="Abajo a la izquierda" data-anchor="bottom-left" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-bc" data-message="Abajo al centro" data-anchor="bottom-center" data-duration="3000"></div>
<div data-mtx="snackbar" id="doc-snack-br" data-message="Abajo a la derecha" data-anchor="bottom-right" data-duration="3000"></div>
{{< /mtx-demo >}}

## Duración

`data-duration` fija el auto-cierre en milisegundos. **Si se omite (o vale `none`), el snackbar no se cierra solo**: solo con Escape, clic fuera, la acción o `close()`. El temporizador se pausa mientras el cursor o el foco están dentro y se reinicia con la duración completa al salir.

{{< mtx-demo title="2 s, 8 s y sin auto-cierre" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-short">2 segundos</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-long">8 segundos</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-persistent">Sin auto-cierre</button>

<div data-mtx="snackbar" id="doc-snack-short" data-message="Se cierra en 2 segundos" data-duration="2000"></div>
<div data-mtx="snackbar" id="doc-snack-long" data-message="Pasa el cursor para pausar (8 s)" data-duration="8000"></div>
<div data-mtx="snackbar" id="doc-snack-persistent" data-message="Permanece hasta que lo cierres" data-action="Cerrar" data-close-on-action></div>
{{< /mtx-demo >}}

## Consecutivos

El componente no gestiona una cola: dos snackbars abiertos en la misma posición se superponen. Para mostrarlos de uno en uno (patrón *Consecutive Snackbars* de MUI), cierra el actual y abre el siguiente al recibir `mtx:snackbar:close`.

```javascript
const el = document.getElementById('snack-queue');   // data-message="…" data-duration="2500"
const snackbar = Materix.getInstance(el);
const queue = [];

function showNext() {
  if (!queue.length || snackbar.isOpen) return;
  snackbar.open({ message: queue.shift() });
}

el.addEventListener('mtx:snackbar:close', () => setTimeout(showNext, 200));

function notify(text) {
  queue.push(text);
  snackbar.isOpen ? snackbar.close() : showNext();
}
```

## Avisos rápidos

Para confirmaciones puntuales no hace falta declarar un snackbar: `Materix.snackbar.show(options)` crea un snackbar compartido en `<body>` la primera vez (`role="status"`, 4 s de duración) y lo reutiliza después. Acepta un texto o `{ message, action, onAction, duration, anchor, role }`; `onAction` se ejecuta al pulsar la acción y luego cierra el aviso.

{{< mtx-demo title="Materix.snackbar.show()" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-snack-show">Copiar enlace</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-snack-show-undo">Archivar con deshacer</button>
{{< /mtx-demo >}}

```javascript
Materix.snackbar.show('Enlace copiado');

Materix.snackbar.show({
  message: 'Conversación archivada',
  action: 'Deshacer',
  onAction: () => restoreConversation(),
  duration: 6000,
  anchor: 'bottom-left',
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var simple = document.getElementById('doc-snack-show');
  if (!simple) return;
  simple.addEventListener('click', function () { Materix.snackbar.show('Enlace copiado al portapapeles'); });
  document.getElementById('doc-snack-show-undo').addEventListener('click', function () {
    Materix.snackbar.show({
      message: 'Conversación archivada',
      action: 'Deshacer',
      duration: 6000,
      anchor: 'bottom-left',
      onAction: function () { Materix.snackbar.show('Archivado deshecho'); }
    });
  });
});
</script>

## Casos de uso reales

### Snackbar con Alert

Para notificaciones con severidad, coloca un [Alert](../alert/) dentro de un snackbar sin `data-message` y anula el fondo y el relleno del snackbar con una clase propia.

{{< mtx-demo title="Éxito y error" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-alert-ok">Guardar perfil</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-snackbar="doc-snack-alert-error">Simular error</button>

<div data-mtx="snackbar" class="doc-snackbar-alert" id="doc-snack-alert-ok" data-duration="4000" data-anchor="bottom-left">
  <div data-mtx="alert" data-severity="success" data-variant="filled">Perfil actualizado correctamente.</div>
</div>
<div data-mtx="snackbar" class="doc-snackbar-alert" id="doc-snack-alert-error" data-duration="4000" data-anchor="bottom-left">
  <div data-mtx="alert" data-severity="error" data-variant="filled">No se pudo guardar el perfil.</div>
</div>
{{< /mtx-demo >}}

```css
.doc-snackbar-alert { padding: 0; background-color: transparent; }
.doc-snackbar-alert > .mtx-alert { flex: 1; }
```

<style>
.doc-snackbar-alert { padding: 0; background-color: transparent; }
.doc-snackbar-alert > .mtx-alert { flex: 1; }
</style>

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-doc-snackbar]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.mtx-snackbar--open').forEach(function (el) {
        Materix.getInstance(el).close();
      });
      var target = document.getElementById(btn.getAttribute('data-doc-snackbar'));
      if (target) Materix.getInstance(target).open();
    });
  });
});
</script>

## Sintaxis BEM completa

Si el HTML ya incluye `.mtx-snackbar__message` y `.mtx-snackbar__action`, el componente los reutiliza: solo añade el anclaje, `role` al mensaje (si falta) y los listeners.

```html
<div class="mtx-snackbar mtx-snackbar--bottom-center" id="snack-bem" data-mtx="snackbar"
     data-duration="5000" data-close-on-action>
  <div class="mtx-snackbar__message" role="status">Estructura renderizada en el servidor</div>
  <button class="mtx-snackbar__action" type="button">Cerrar</button>
</div>
```

## Uso programático

Los snackbars se inicializan al cargar la página; para crearlos dinámicamente usa `Materix.init(el, 'snackbar')` o `new Materix.Snackbar(el)`.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.setAttribute('data-message', 'Archivo subido');
el.setAttribute('data-duration', '3000');
document.body.append(el);

const snackbar = Materix.init(el, 'snackbar');
snackbar.open();          // si ya está abierto, reinicia el temporizador
snackbar.open({ message: 'Borrador guardado', action: 'Ver', onAction: () => openDraft(), duration: 5000 });
snackbar.setMessage('Subida completada');   // cambia el texto sin abrir
snackbar.setAction(null);                   // oculta la acción
snackbar.anchor = 'top-right';
snackbar.isOpen;          // true
snackbar.close('done');   // detail.reason === 'done'

document.addEventListener('mtx:snackbar:close', (event) => {
  console.log(event.target.id, event.detail.reason);
});
```

```javascript
// ES modules
import { Snackbar } from '@rubenchodev/materix-ui';

const snackbar = new Snackbar(document.querySelector('#aviso'));
snackbar.open();
```

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `snackbar` | — | Inicializa el componente. |
| `data-message` | texto | — | Genera `.mtx-snackbar__message` con ese texto (si no existe ya). |
| `data-action` | texto | — | Genera el botón `.mtx-snackbar__action` (si no existe ya). |
| `data-close-on-action` | booleano (presencia) | ausente | Cierra al pulsar la acción (`reason: 'action'`). |
| `data-duration` | milisegundos \| `none` | sin auto-cierre | Tiempo hasta el cierre automático (`reason: 'timeout'`). |
| `data-anchor` | `top-left` \| `top-center` \| `top-right` \| `bottom-left` \| `bottom-center` \| `bottom-right` | `bottom-center` | Posición en la pantalla. |
| `data-open` | booleano (presencia) | ausente | Abre el snackbar al inicializarse. |
| `data-role` | rol ARIA | `alert` | `role` aplicado al mensaje si no tiene uno. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-snackbar` | Contenedor fijo (`--mtx-z-index-snackbar`, 1400), superficie oscura en el tema claro y clara en el oscuro (MUI), elevación 6. |
| `.mtx-snackbar--open` | Estado visible (lo gestiona el componente). |
| `.mtx-snackbar--{anchor}` | Posición: `--top-left`, `--top-center`, `--top-right`, `--bottom-left`, `--bottom-center`, `--bottom-right`. |
| `.mtx-snackbar__message` | Texto del mensaje. |
| `.mtx-snackbar__action` | Botón de acción en mayúsculas (`--mtx-snackbar-action-color`). `hidden` lo oculta. |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `open(options?)` | `Snackbar` | Muestra el snackbar, activa el cierre por clic fuera e inicia el temporizador; emite `mtx:snackbar:open`. `options`: `{ message, action, onAction, duration }` (`action: null` oculta la acción; `duration` solo vale para esta apertura; `onAction` se ejecuta al pulsar y cierra con `reason: 'action'`). Si ya está abierto, actualiza el contenido y reinicia el temporizador. |
| `setMessage(text)` | `Snackbar` | Sustituye el texto del mensaje (crea `.mtx-snackbar__message` si falta). |
| `setAction(label)` | `Snackbar` | Fija el texto de la acción y crea el botón si hace falta; `null`/`false` la oculta. |
| `anchor` | `string` | Getter/setter de la posición (`bottom-center`, `top-right`…). |
| `close(reason?)` | `void` | Oculta el snackbar y emite `mtx:snackbar:close`. `reason` por defecto: `'programmatic'`. |
| `isOpen` | `boolean` | Getter: `true` si está visible. |
| `destroy()` | `void` | Cierra y elimina todos los listeners. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |
| `Materix.snackbar.show(options)` | `Snackbar` | Helper: muestra `options` (texto u opciones de `open()` más `anchor` y `role`) en un snackbar compartido creado bajo demanda. En ES modules también se exporta como `showSnackbar`. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:snackbar:open` | — | Se abre (burbujea). |
| `mtx:snackbar:action` | — | Se pulsa el botón de acción (burbujea). |
| `mtx:snackbar:close` | `{ reason }`: `'timeout'`, `'clickaway'`, `'escapeKeyDown'`, `'action'`, `'programmatic'` o el motivo pasado a `close()` | Se cierra (burbujea). |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-snackbar-bg` | Fondo: `background-default` oscurecido un 80 % (claro) o aclarado un 80 % (oscuro), como `emphasize` de MUI. |
| `--mtx-snackbar-color` | Texto: `#fff` (claro) / `rgba(0, 0, 0, 0.87)` (oscuro). |
| `--mtx-snackbar-action-color` | Color y anillo de foco de la acción (primary aclarado en el tema claro, oscurecido en el oscuro). |
| `--mtx-z-index-snackbar` | Nivel de apilamiento (1400). |
| `--mtx-elevation-6` | Sombra. |
| `--mtx-shape-radius` | Radio de las esquinas. |
| `--mtx-font-family` | Tipografía. |
| `--mtx-duration-standard` / `--mtx-easing-standard` | Transición de entrada y salida. |

## Accesibilidad

- El mensaje recibe `role="alert"` (configurable con `data-role`, por ejemplo `status` para avisos no urgentes), de modo que los lectores de pantalla lo anuncian al mostrarse.
- La acción es un `<button type="button">` nativo, alcanzable con `Tab`.
- Mientras el cursor o el foco están dentro, el temporizador se pausa para dar tiempo a leer o actuar (WCAG 2.2.1).
- El snackbar no roba el foco: si la acción es importante, ofrece también otra forma de realizarla.

| Tecla | Acción |
|---|---|
| `Escape` | Cierra el snackbar abierto más reciente (`reason: 'escapeKeyDown'`). Tiene la prioridad más baja de la pila de capas: no hace nada mientras haya un Dialog, Drawer, Menu, Popover o tooltip abierto, ni si otro componente ya gestionó la tecla. |
| `Tab` | Lleva el foco a la acción (pausa el temporizador). |
| `Enter` / `Espacio` | Activa la acción enfocada. |
