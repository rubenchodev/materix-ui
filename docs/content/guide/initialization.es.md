---
title: "Inicialización"
description: "Cómo y cuándo Materix UI crea y destruye las instancias: autoinicialización, initAll, init, getInstance, watch, ciclo de vida (destroy, destroyAll), componentes propios y eventos mtx:*."
weight: 30
icon: "play_circle"
---

Materix inicializa sola todos los `[data-mtx]` de la página. Solo necesitas JavaScript para contenido que llegue después, para obtener una instancia o para escuchar eventos.

## Resumen de la API

| Función | Retorna | Uso |
|---|---|---|
| `initAll(root = document)` | `void` | Inicializa todos los `[data-mtx]` pendientes dentro de `root` (incluido `root`). |
| `init(element, name?)` | instancia o `null` | Inicializa un elemento. `name` fuerza el componente y escribe `data-mtx` si falta. |
| `initElement(element, name?)` | instancia o `null` | Igual que `init` (`init` es su alias). |
| `getInstance(element)` | instancia o `undefined` | Devuelve la instancia ya creada para ese elemento. |
| `watch(root = document, { destroyOnRemove })` | `MutationObserver` | Inicializa automáticamente lo que se añada a `root` (y destruye lo que se elimine con `destroyOnRemove: true`). |
| `destroy(element)` | `boolean` | Destruye la instancia de un elemento: listeners, temporizadores, registro. |
| `destroyAll(root = document)` | `number` | Destruye todas las instancias dentro de `root`. |
| `registerComponent(name, Class)` | `void` | Registra una clase para `data-mtx="name"`. |

Todas están en el global `Materix` (UMD) y como exportaciones con nombre (ESM).

## Autoinicialización

Al cargarse, la librería ejecuta `initAll()`:

- si el documento aún se está cargando, espera a `DOMContentLoaded`;
- si el DOM ya está listo (por ejemplo, un `<script type="module">` o un script al final del `<body>`), inicializa de inmediato.

Para cada elemento con `data-mtx`, busca la clase registrada con ese nombre, crea la instancia, la guarda en el registro y marca el elemento con `data-mtx-initialized`. Los valores de `data-mtx` que no estén registrados se ignoran sin error.

## Idempotencia

Inicializar dos veces no crea dos instancias:

```javascript
Materix.initAll();
Materix.initAll(); // no hace nada: todo tiene data-mtx-initialized

const a = Materix.init(el);
const b = Materix.init(el);
a === b; // true
```

`initAll` repite la pasada sobre el contenedor (hasta cinco veces) solo mientras la anterior haya creado instancias nuevas. Así se inicializan también los componentes `[data-mtx]` que otro componente genera durante su propio auto-scaffolding, sin recorrer en vano cuando hay valores de `data-mtx` no registrados.

### Llamar al constructor dos veces

`new Materix.Button(el)` sobre un elemento que ya tiene una instancia **del mismo componente** (la misma clase o una subclase en cualquier sentido, como `new MyButton(el)` sobre un `Button`) destruye primero la anterior (listeners, temporizadores, registro) y registra la nueva, de modo que los listeners nunca se duplican. Si solo quieres la instancia actual, usa `Materix.init(el)` o `getInstance(el)`: la reutilizan en lugar de recrearla. Las instancias de una clase *no relacionada* sobre el mismo nodo se conservan (por ejemplo, un Tooltip declarativo sobre un IconButton).

## Inicializar un elemento: `init`

```javascript
// Usa el valor de data-mtx del elemento
const field = Materix.init(document.querySelector('#email'));

// Fuerza el componente; añade data-mtx="select" si el elemento no lo tiene
const select = Materix.init(document.querySelector('#country'), 'select');
```

Si el elemento ya estaba inicializado, devuelve la instancia existente. Devuelve `null` si no hay nombre de componente, si el nombre no está registrado o si `element` no es un elemento (`init(null)` es un no-op seguro).

## Obtener una instancia: `getInstance`

```javascript
const dialog = Materix.getInstance(document.getElementById('confirm'));
dialog?.open();
```

Con la sintaxis simplificada, el componente puede envolver tu elemento en un contenedor generado (TextField, Checkbox, Switch...). El registro guarda la instancia con **ambos** elementos, así que `getInstance` funciona tanto con tu `<input>` original como con el contenedor `.mtx-*`. `instance.element` es siempre el elemento raíz del componente.

{{< callout type="info" >}}
`getInstance` devuelve `undefined` si se llama antes de la autoinicialización. Ejecuta tu código después de cargar la librería y dentro de `DOMContentLoaded` si tu script está en el `<head>`.
{{< /callout >}}

## Contenido dinámico y SPA

### Inicializar tras insertar HTML: `initAll(container)`

Cuando insertas HTML después de la carga, inicialízalo pasando el contenedor:

```javascript
const container = document.getElementById('results');

const response = await fetch('/partials/filters.html');
container.innerHTML = await response.text();

Materix.initAll(container);
```

`initAll(container)` solo recorre ese subárbol y omite lo que ya estaba inicializado, así que es seguro llamarlo cada vez que el contenido cambie.

### Inicialización automática: `watch`

`watch(root)` crea un `MutationObserver` sobre `root` (`childList` y `subtree`). Por cada nodo añadido, inicializa el propio nodo si tiene `data-mtx` y todos sus descendientes `[data-mtx]`. Devuelve el observador para que puedas detenerlo:

```javascript
const observer = Materix.watch(document.getElementById('app'));

// Todo lo que se añada dentro de #app se inicializa solo
document.getElementById('app').insertAdjacentHTML(
  'beforeend',
  '<input data-mtx="text-field" data-label="Ciudad" data-variant="outlined">'
);

// Al desmontar la vista
observer.disconnect();
```

`watch` no está activo por defecto. Solo reacciona a nodos **añadidos** (consulta [Ciclo de vida](#ciclo-de-vida) para `destroyOnRemove`): cambiar el atributo `data-mtx` de un elemento existente no lo inicializa. Observa el contenedor más pequeño posible; observar `document` en una página con muchas mutaciones tiene coste.

## Ciclo de vida

### Destruir instancias: `destroy`, `destroyAll` e `instance.destroy()`

Todos los componentes extienden `ComponentBase`, así que toda instancia tiene `destroy()`. **Libera recursos y desvincula** la instancia:

- retira los listeners que registró en `document`, `window` y en elementos externos (disparadores, contenedores de scroll…);
- cancela sus temporizadores, frames de animación y observers (`ResizeObserver`, `MutationObserver`, `matchMedia`);
- lo cierra antes si está abierto (Dialog, Drawer, Menu, Select, Snackbar) y retira los nodos que movió a `<body>` (popper de Menu, backdrop de Drawer) o los devuelve a su sitio (menú de Select);
- lo quita del registro y retira `data-mtx-initialized` de sus elementos (el original y la raíz generada): después `getInstance(el)` devuelve `undefined` e `initAll()` puede volver a inicializarlo.

```javascript
// Un elemento
Materix.destroy(document.getElementById('confirm')); // true si había instancia

// Un subárbol completo (del más profundo al más externo), p. ej. antes de retirar una vista
Materix.destroyAll(document.getElementById('vista'));
document.getElementById('vista').remove();

// Directamente sobre la instancia
Materix.getInstance(el)?.destroy();
```

| Función | Retorna | Uso |
|---|---|---|
| `destroy(element)` | `boolean` | Destruye la instancia vinculada a `element` (original o raíz generada). `false` si no había. Si el `destroy()` del componente lanza, la instancia queda desvinculada igualmente y el error se relanza; `destroyAll()` lo registra en consola y sigue con el resto. |
| `destroyAll(root = document)` | `number` | Destruye todos los componentes inicializados dentro de `root` (incluido `root`), del más profundo al más externo. |
| `instance.destroy()` | `void` | Igual que `destroy(element)`. Idempotente: llamarlo dos veces no hace nada. |

{{< callout type="info" title="destroy() no deshace el auto-scaffolding" >}}
El DOM generado (contenedores, labels, iconos, atributos ARIA) se queda como está: `destroy()` libera recursos y desvincula, no «des-scaffoldea». Está pensado para llamarlo justo antes de retirar el elemento, o para volver a inicializarlo con `initAll()` (el componente reutiliza la estructura existente).
{{< /callout >}}

### SPA: `watch(root, { destroyOnRemove: true })`

Con `destroyOnRemove`, el observador también destruye las instancias de los nodos **eliminados** de `root`. Un nodo que solo se mueve (se quita y se vuelve a insertar en el mismo lote de mutaciones, como hace el auto-scaffolding) no se destruye.

```javascript
const observer = Materix.watch(document.getElementById('app'), { destroyOnRemove: true });

router.on('navigate', (html) => {
  document.getElementById('app').innerHTML = html; // la vista anterior se destruye y la nueva se inicializa
});
```

Los componentes cuya superficie se mueve a `<body>` (el popper de Menu, un Popover abierto) dejan un comentario marcador en su sitio original: al eliminarse ese sitio, `destroyOnRemove` (y `destroyAll(vista)`) también los destruye, sin dejar nada huérfano en `<body>`. Los tooltips se cierran solos cuando su disparador sale del DOM.

### Componentes propios: `this.listen()` y `this.onDestroy()`

Dentro de una subclase de `ComponentBase`, registra los listeners con `this.listen(target, type, handler, options)` y cualquier otra limpieza con `this.onDestroy(fn)`: `destroy()` las ejecuta todas. Si sobrescribes `destroy()`, llama a `super.destroy()`.

```javascript
class StickyHeader extends Materix.ComponentBase {
  constructor(element) {
    super(element);
    this.listen(window, 'scroll', () => this.update(), { passive: true });
    const observer = new ResizeObserver(() => this.update());
    observer.observe(element);
    this.onDestroy(() => observer.disconnect());
  }

  update() {
    this.element.classList.toggle('is-stuck', window.scrollY > 0);
  }
}
```

| Método | Retorna | Uso |
|---|---|---|
| `listen(target, type, handler, options?)` | `Function` | Añade un listener que `destroy()` retira. Devuelve una función para retirarlo antes. |
| `onDestroy(fn)` | `void` | Registra una limpieza (observer, temporizador, nodo portado…) para `destroy()`. |
| `destroy()` | `void` | Ejecuta las limpiezas, desvincula la instancia y marca `instance.destroyed = true`. |

## Componentes propios: `registerComponent`

Extiende `ComponentBase` y registra la clase con el nombre que usarás en `data-mtx`:

```javascript
class CopyButton extends Materix.ComponentBase {
  constructor(element) {
    super(element); // guarda this.element, marca data-mtx-initialized y registra la instancia
    this.listen(element, 'click', () => navigator.clipboard.writeText(element.dataset.copy || ''));
  }
}

Materix.registerComponent('copy-button', CopyButton);
Materix.initAll(); // inicializa los data-mtx="copy-button" que ya estaban en la página
```

```html
<button class="mtx-button mtx-button--outlined" data-mtx="copy-button" data-copy="npm install @rubenchodev/materix-ui">
  Copiar comando
</button>
```

`ComponentBase` aporta `element`, `listen()`, `onDestroy()`, `destroy()`, el getter `disabled` y los métodos `disable()` y `enable()` (sobre la propiedad nativa `disabled`).

{{< callout type="warning" title="Registra antes o vuelve a llamar a initAll" >}}
La autoinicialización corre al cargar la librería. Si registras tu componente después, sus elementos se quedan sin inicializar hasta que llames a `initAll()`. Registrar un nombre ya existente reemplaza la clase anterior sin aviso: usa un nombre propio que no choque con los de Materix.
{{< /callout >}}

## Eventos

Los componentes emiten `CustomEvent` con `bubbles: true`, así que puedes escucharlos en el propio elemento o delegarlos en un ancestro. Los datos van en `event.detail`.

### Convención

Todos los eventos se llaman `mtx:{componente}:{acción}`: `{componente}` es el nombre `data-mtx` en kebab-case y `{acción}` un verbo o un sustantivo en kebab-case (`open`, `close`, `change`, `page-change`…). Los eventos globales usan el nombre del módulo (`mtx:locale:change`, `mtx:theme:change`).

```javascript
document.addEventListener('mtx:dialog:close', (event) => {
  console.log(event.target.id, event.detail.reason); // 'escapeKeyDown', 'backdropClick'...
});
```

| Evento | Componente | `detail` | Se emite cuando |
|---|---|---|---|
| `mtx:accordion:change` | Accordion | `{ expanded }` | El panel se expande o se contrae. |
| `mtx:alert:open` / `mtx:alert:close` | Alert | — | Se muestra / se cierra la alerta. |
| `mtx:breadcrumbs:expand` | Breadcrumbs | — | Se expanden los elementos colapsados. |
| `mtx:breadcrumbs:navigate` | Breadcrumbs | `{ index, href, label, … }` | Se activa un elemento. **Cancelable**. |
| `mtx:chip:click` / `mtx:chip:delete` | Chip | `{}` | Se activa un chip clicable / se ejecuta la acción de borrar. |
| `mtx:dialog:open` / `mtx:dialog:close` | Dialog | — / `{ reason }` | Se abre / se cierra el diálogo. |
| `mtx:drawer:open` / `mtx:drawer:close` | Drawer | — / `{ reason }` | Se abre / se cierra el drawer. |
| `mtx:drawer:mode-change` | Drawer | `{ mode, previousMode }` | Un drawer `responsive` cruza su breakpoint. |
| `mtx:list:select` | ListItemButton | `{ item }` | Se selecciona un elemento de la lista. |
| `mtx:menu:open` / `mtx:menu:close` | Menu | — | Se abre / se cierra el menú. |
| `mtx:menu:select` | Menu | `{ item, checked? }` | Se elige un ítem. |
| `mtx:pagination:change` | Pagination | `{ page, previousPage, href? }` | Cambia la página (cancelable en modo enlaces). |
| `mtx:radio-group:change` | RadioGroup | `{ value }` | Cambia la opción seleccionada del grupo. |
| `mtx:rating:change` / `mtx:rating:active` | Rating | `{ value }` | Cambia el valor / cambia el valor bajo el cursor. |
| `mtx:snackbar:open` / `mtx:snackbar:close` / `mtx:snackbar:action` | Snackbar | — / `{ reason }` / — | Se muestra / se cierra / se pulsa la acción. |
| `mtx:speed-dial:open` / `mtx:speed-dial:close` | SpeedDial | `{ speedDial }` | Se abre / se cierra el SpeedDial. |
| `mtx:stepper:change` | Stepper, MobileStepper | `{ activeStep, previousStep, reset? }` | Cambia el paso activo. **Cancelable**. |
| `mtx:table:selection-change` | Table | `{ selected, rows, count, reason }` | Cambia la selección de filas. |
| `mtx:table:sort` | TableSortLabel | `{ direction, active, key }` | Cambia el orden de una columna. |
| `mtx:table:page-change` / `mtx:table:rows-per-page-change` | TablePagination | `{ page, previousPage, reason }` / `{ rowsPerPage, previousRowsPerPage, page }` | Cambia la página / las filas por página. |
| `mtx:tabs:before-change` | Tabs | `{ tab, panel, previousTab, previousPanel }` | Antes de cambiar de pestaña. **Cancelable**. |
| `mtx:tabs:change` | Tabs | `{ tab, panel, previousTab, previousPanel }` | Después de cambiar de pestaña. |
| `mtx:text-field:password-visibility` | TextField | `{ visible }` | Se muestra u oculta la contraseña. |
| `mtx:text-field:adornment-click` | TextField | `{ position, button, input }` | Se pulsa un botón de `data-start-action` / `data-end-action`. |
| `mtx:toggle-button:change` / `mtx:toggle-button-group:change` | ToggleButton / ToggleButtonGroup | `{ selected, value }` / `{ value }` | Cambia la selección. |
| `mtx:locale:change` | i18n (en `document`) | `{ locale }` | `setLocale()` cambia el idioma global. |
| `mtx:theme:change` | tema (en `document`, no burbujea) | `{ theme, mode, previous }` | Cambia el tema efectivo o el modo. |
| `mtx:change` · `mtx:open` / `mtx:close` | DateTimePicker | `{ value, iso, … }` · `{ picker }` | Consulta la página de DateTimePicker. |

### Alias deprecados

Los eventos renombrados a la convención siguen emitiendo su nombre antiguo, con el mismo `detail`, justo después del nuevo. Los alias se eliminarán en la **1.0**: migra tus listeners.

| Nombre antiguo (deprecado) | Nombre nuevo |
|---|---|
| `mtx-select` | `mtx:list:select` |
| `mtx:change` (RadioGroup) | `mtx:radio-group:change` |
| `mtx:password-visibility` | `mtx:text-field:password-visibility` |
| `mtx:adornment-click` | `mtx:text-field:adornment-click` |
| `mtx:drawer:modechange` | `mtx:drawer:mode-change` |
| `mtx-speed-dial-open` / `mtx-speed-dial-close` | `mtx:speed-dial:open` / `mtx:speed-dial:close` |
| `mtx:localechange` | `mtx:locale:change` |
| `mtx:theme-change` | `mtx:theme:change` |

{{< callout type="warning" title="No escuches ambos nombres" >}}
Para una misma acción se emiten el evento nuevo y su alias. Escuchar los dos ejecutaría tu manejador dos veces.
{{< /callout >}}

Tus componentes propios pueden seguir el mismo patrón con el helper `emit(target, name, detail, { aliases, cancelable })` de `src/core/events.js` (devuelve `false` si el evento o algún alias se canceló).

Los controles de formulario (TextField, Select, NativeSelect, Checkbox, Radio, Switch) emiten además los eventos nativos `input` y `change` en el `<input>` o `<select>`. Select y DateTimePicker disparan un `change` nativo cuando el valor cambia desde su interfaz.

### Cancelar un cambio de pestaña

```javascript
document.getElementById('settings-tabs').addEventListener('mtx:tabs:before-change', (event) => {
  if (formHasUnsavedChanges() && !confirm('Tienes cambios sin guardar. ¿Salir igualmente?')) {
    event.preventDefault();
  }
});
```
