---
title: "Backdrop"
description: "Capa a pantalla completa que oscurece la página y centra un indicador mientras dura una operación; no sustituye a un diálogo."
group: "feedback"
icon: "gradient"
weight: 15
example: "backdrop"
mui: "https://mui.com/material-ui/react-backdrop/"
---

**Backdrop** cubre toda la pantalla con una capa semitransparente y centra su contenido, normalmente un [CircularProgress]({{< relref "/components/progress" >}}). Úsalo para señalar que la página está ocupada durante una operación breve (guardar, sincronizar, procesar un pago). **No es un diálogo**: no tiene rol, no atrapa el foco ni ofrece título o acciones; si el usuario debe leer un mensaje o decidir algo, usa [Dialog]({{< relref "/components/dialog" >}}), que ya incluye su propio fondo.

## Uso básico

Un elemento `data-mtx="backdrop"` con el contenido a centrar y un disparador `data-mtx-backdrop-open="id"` (alterna abierto/cerrado). Con `data-close-on-click` un clic en la capa la cierra. El contenido es blanco por defecto, así que un CircularProgress con `data-color="inherit"` contrasta en ambos temas.

{{< mtx-demo title="Sintaxis simplificada" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-basic">Mostrar backdrop</button>
<div data-mtx="backdrop" id="doc-backdrop-basic" data-close-on-click data-close-on-escape>
  <div data-mtx="circular-progress" data-color="inherit" data-label="Cargando"></div>
</div>
{{< /mtx-demo >}}

## Variantes

La capa usa `rgba(0, 0, 0, 0.5)` en ambos temas (token `--mtx-backdrop-bg`). `data-invisible` la vuelve transparente: sigue capturando clics, útil para cerrar superficies propias al pulsar fuera.

{{< mtx-demo title="Invisible" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-invisible">Backdrop invisible</button>
<div data-mtx="backdrop" id="doc-backdrop-invisible" data-invisible data-close-on-click data-close-on-escape>
  <div data-mtx="paper" data-elevation="8" class="mtx-p-3 mtx-color-text-primary">
    <p class="mtx-typography--body1">Capa invisible: haz clic en cualquier lugar para cerrar.</p>
  </div>
</div>
{{< /mtx-demo >}}

## Con contenido

El contenido se centra con flexbox. Acompaña el indicador con un texto que explique qué ocurre, o usa una barra de progreso determinada si conoces el avance.

{{< mtx-demo title="Spinner con texto y barra lineal" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-text">Spinner con texto</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-linear">Barra de progreso</button>
<div data-mtx="backdrop" id="doc-backdrop-text" data-close-on-click data-close-on-escape>
  <div class="mtx-d-flex mtx-flex-column mtx-align-items-center mtx-gap-2">
    <div data-mtx="circular-progress" data-color="inherit" data-size="56" data-decorative></div>
    <span class="mtx-typography--subtitle1">Sincronizando 24 archivos…</span>
  </div>
</div>
<div data-mtx="backdrop" id="doc-backdrop-linear" data-close-on-click data-close-on-escape>
  <div class="mtx-d-flex mtx-flex-column mtx-gap-1 mtx-w-50">
    <span class="mtx-typography--subtitle1">Importando contactos</span>
    <div data-mtx="linear-progress" data-color="inherit" data-value="64" data-show-label></div>
  </div>
</div>
{{< /mtx-demo >}}

## Cierre

Tres mecanismos opcionales y combinables: `data-close-on-click` (clic en la capa o en contenido no interactivo; los botones, enlaces y campos del contenido no la cierran), `data-close-on-escape` y cualquier elemento interno con `data-mtx-backdrop-close`. Sin ninguno, solo se cierra por código.

{{< mtx-demo title="Botón cancelar con data-mtx-backdrop-close" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-cancel">Subir foto</button>
<div data-mtx="backdrop" id="doc-backdrop-cancel" data-close-on-escape>
  <div class="mtx-d-flex mtx-flex-column mtx-align-items-center mtx-gap-2">
    <div data-mtx="circular-progress" data-color="inherit" data-label="Subiendo"></div>
    <span class="mtx-typography--subtitle1">Subiendo foto.jpg</span>
    <button class="mtx-button mtx-button--outlined mtx-button--inherit" data-mtx="button" data-mtx-backdrop-close>Cancelar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Estados

- `data-open`: se muestra abierto al inicializar.
- `data-lock-scroll`: bloquea el scroll del `body` mientras está abierto, con el gestor de modales compartido con Dialog y Drawer.
- `data-inert`: marca como `inert` el resto de la página (hermanos de la capa y de sus ancestros) para que <kbd>Tab</kbd> y los lectores de pantalla no lleguen al contenido tapado; lo restaura al cerrar.
- `data-z`: z-index propio. Por defecto es `--mtx-backdrop-z-index` = z-index del Drawer + 1 (1201), por encima de AppBar y Drawer y por debajo de Dialog (1300) y Snackbar (1400).

{{< mtx-demo title="Bloqueo de scroll e inert (se cierra a los 3 s)" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-backdrop-open="doc-backdrop-lock">Procesar pago</button>
<div data-mtx="backdrop" id="doc-backdrop-lock" data-lock-scroll data-inert>
  <div data-mtx="circular-progress" data-color="inherit" data-label="Procesando pago"></div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var lock = document.getElementById('doc-backdrop-lock');
  lock.addEventListener('mtx:backdrop:open', function () {
    setTimeout(function () { Materix.getInstance(lock).close(); }, 3000);
  });
});
</script>

{{< callout type="warning" title="No es un diálogo" >}}
Backdrop no tiene `role="dialog"`, no mueve ni atrapa el foco y no lo devuelve al cerrar. Si necesitas bloquear la interacción con un mensaje, botones o un formulario, usa **Dialog**. Si lo usas como bloqueo, combina `data-inert` y `data-lock-scroll` y ciérralo siempre por código al terminar la operación.
{{< /callout >}}

## Casos de uso reales

### Guardar un formulario

El backdrop cubre la página mientras dura la petición y se cierra al terminar; después un Snackbar confirma el resultado.

{{< mtx-demo title="Guardar con backdrop y snackbar" layout="column" >}}
<input data-mtx="text-field" data-label="Nombre del proyecto" data-variant="outlined" value="Materix UI" type="text">
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-backdrop-save" data-start-icon="save">Guardar</button>
<div data-mtx="backdrop" id="doc-backdrop-saving" data-lock-scroll>
  <div class="mtx-d-flex mtx-flex-column mtx-align-items-center mtx-gap-2">
    <div data-mtx="circular-progress" data-color="inherit" data-decorative></div>
    <span class="mtx-typography--subtitle1" role="status">Guardando cambios…</span>
  </div>
</div>
{{< /mtx-demo >}}

```javascript
const saving = Materix.getInstance(document.getElementById('doc-backdrop-saving'));
saving.open();
await guardarProyecto();
saving.close();
Materix.snackbar.show('Proyecto guardado');
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var saving = Materix.getInstance(document.getElementById('doc-backdrop-saving'));
  document.getElementById('doc-backdrop-save').addEventListener('click', function () {
    saving.open();
    setTimeout(function () {
      saving.close();
      if (Materix.snackbar) Materix.snackbar.show('Proyecto guardado');
    }, 2000);
  });
});
</script>

## Sintaxis BEM completa

Para SSR: inicialmente cerrado con `hidden` y `aria-hidden="true"`. La clase `mtx-backdrop--open` o `data-open` lo muestran al inicializar.

```html
<div class="mtx-backdrop" id="cargando" data-mtx="backdrop" data-close-on-click hidden aria-hidden="true">
  <div data-mtx="circular-progress" data-color="inherit" data-label="Cargando"></div>
</div>
```

## Uso programático

Los `[data-mtx="backdrop"]` se inicializan solos; para contenido dinámico usa `Materix.init(el)` o `new Materix.Backdrop(el)`.

```javascript
// UMD (window.Materix)
const backdrop = Materix.getInstance(document.getElementById('cargando'));
backdrop.open();
setTimeout(() => backdrop.close(), 1500);
backdrop.toggle();
console.log(backdrop.isOpen);

document.addEventListener('mtx:backdrop:close', (e) => console.log(e.detail.reason)); // api | click | escape
```

```javascript
// ES modules
import { Backdrop } from '@rubenchodev/materix-ui';

const el = document.createElement('div');
el.setAttribute('data-close-on-escape', '');
document.body.append(el);
const backdrop = new Backdrop(el);
backdrop.open();
```

{{< mtx-demo title="open() y close() tras 1,5 s" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-backdrop-api-open">Abrir 1,5 s</button>
<div data-mtx="backdrop" id="doc-backdrop-api" data-close-on-click data-close-on-escape>
  <div data-mtx="circular-progress" data-color="inherit" data-label="Cargando"></div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var api = Materix.getInstance(document.getElementById('doc-backdrop-api'));
  document.getElementById('doc-backdrop-api-open').addEventListener('click', function () {
    api.open();
    setTimeout(function () { api.close(); }, 1500);
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `backdrop` | — | Inicializa el componente. |
| `data-open` | booleano | — | Abierto al inicializar (refleja el estado mientras está abierto). |
| `data-invisible` | booleano | — | Fondo transparente que sigue capturando clics. |
| `data-close-on-click` | booleano | — | Cierra con un clic en la capa o en contenido no interactivo. |
| `data-close-on-escape` | booleano | — | Cierra con <kbd>Escape</kbd> (si no hay otro modal encima). |
| `data-lock-scroll` | booleano | — | Bloquea el scroll del `body` mientras está abierto. |
| `data-inert` | booleano | — | Marca `inert` el resto de la página mientras está abierto. |
| `data-z` | entero | `--mtx-backdrop-z-index` (1201) | z-index propio. |
| `data-mtx-backdrop-open` | id (con o sin `#`) | — | En cualquier elemento: al hacer clic alterna ese backdrop. |
| `data-mtx-backdrop-close` | — | — | En un elemento interno: al hacer clic cierra el backdrop. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-backdrop` | Capa fija a pantalla completa con contenido centrado (oculta y transparente por defecto). |
| `.mtx-backdrop--open` | Estado visible (fundido de entrada 225 ms, salida 195 ms). |
| `.mtx-backdrop--invisible` | Fondo transparente. |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `open()` | `this` | Muestra la capa y emite `mtx:backdrop:open`. |
| `close()` | `this` | Oculta la capa y emite `mtx:backdrop:close` (`reason: 'api'`). |
| `toggle()` | `this` | Alterna entre abierto y cerrado. |
| `isOpen` | `boolean` | Getter: `true` si está abierto. |
| `destroy()` | `void` | Retira listeners y libera bloqueo de scroll e `inert`. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:backdrop:open` | — | La capa se abre (burbujea). |
| `mtx:backdrop:close` | `{ reason: 'api' \| 'click' \| 'escape' }` | La capa se cierra (burbujea). |

### Variables CSS

| Variable | Predeterminado | Descripción |
|---|---|---|
| `--mtx-backdrop-bg` | `rgba(0, 0, 0, 0.5)` | Color de la capa. |
| `--mtx-backdrop-color` | `#ffffff` | Color del contenido (spinners `inherit`, textos). |
| `--mtx-backdrop-z-index` | `calc(var(--mtx-z-index-drawer) + 1)` | z-index por defecto (1201). |

## Accesibilidad

- Cerrado, el elemento tiene `hidden` y `aria-hidden="true"`; abierto, ambos se retiran.
- Backdrop **no** tiene rol ni nombre accesible: describe la operación con el propio contenido (`data-label` en el CircularProgress, que expone `role="progressbar"`, o un texto con `role="status"`).
- No mueve ni atrapa el foco. Con `data-inert` el resto de la página deja de ser enfocable y de estar en el árbol de accesibilidad mientras está abierto; sin él, el usuario de teclado puede seguir interactuando con lo que hay debajo.
- `prefers-reduced-motion: reduce` desactiva el fundido.

| Tecla | Acción |
|---|---|
| <kbd>Escape</kbd> | Cierra el backdrop si tiene `data-close-on-escape` y es la capa superior. Con `data-lock-scroll` o `data-inert` pero sin `data-close-on-escape`, consume <kbd>Escape</kbd> sin cerrarse. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Sobre un disparador `data-mtx-backdrop-open`, alterna el backdrop. |
