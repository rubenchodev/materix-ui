---
title: "Menu"
description: "Lista temporal de opciones anclada a un disparador: iconos, separadores, selección, submenús, menú contextual y navegación completa por teclado."
group: "navigation"
icon: "more_vert"
weight: 30
example: "menu"
mui: "https://mui.com/material-ui/react-menu/"
---

`Menu` muestra una lista temporal de acciones u opciones sobre una superficie elevada, anclada al elemento que la abre, como el `Menu` de MUI (Popper + Paper + List). Úsalo para acciones contextuales de un elemento (editar, duplicar, eliminar), menús de cuenta o barras de herramientas compactas. Para elegir un valor de un formulario usa [Select](../select/); para la navegación principal de la aplicación, [Drawer](../drawer/) o [Tabs](../tabs/).

## Uso básico

Un disparador con `data-open-menu="#id"` y un contenedor `data-mtx="menu"` con ese id, que contiene ítems `data-mtx="menu-item"`. Al hacer clic se abre bajo el disparador; un clic en una opción, fuera del menú, <kbd>Escape</kbd> o <kbd>Tab</kbd> lo cierran.

{{< mtx-demo title="Menú básico" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-basic">Abrir menú</button>
<div data-mtx="menu" id="doc-menu-basic">
  <div data-mtx="menu-item">Perfil</div>
  <div data-mtx="menu-item">Mi cuenta</div>
  <div data-mtx="menu-item">Cerrar sesión</div>
</div>
{{< /mtx-demo >}}

Al abrirse, el contenedor del menú se traslada a un portal al final del `<body>` para no quedar recortado por `overflow` ni `z-index` de sus ancestros. Sigue accesible con `document.getElementById`.

## Disparadores

El menú necesita un `id` y un disparador explícito; no hay disparador implícito. Tres formas, de la más recomendada a la menos:

1. `data-open-menu="#id"` (o su alias `data-mtx-menu-trigger="#id"`) en el botón. Funciona también con disparadores añadidos después de inicializar el menú (por ejemplo, el botón de acciones de cada fila de una tabla generada por JavaScript): el clic se gestiona por delegación.
2. `aria-controls="id"` en un elemento que ya exista al inicializar.
3. `data-anchor="selector"` en el propio menú: ese elemento sirve de ancla y de disparador.

El componente añade al disparador `aria-haspopup="menu"`, `aria-expanded` sincronizado y `aria-controls` (si falta). Sin ninguno de estos mecanismos el menú solo se abre por código con `open(anchor)`.

{{< mtx-demo title="Disparadores por fila (delegación)" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Archivos">
    <li data-mtx="list-item" data-icon="description">
      Informe anual.pdf
      <span class="mtx-list-item-secondary-action">
        <button data-mtx="icon-button" data-icon="more_vert" aria-label="Acciones de Informe anual.pdf" data-open-menu="#doc-menu-rows"></button>
      </span>
    </li>
    <li data-mtx="list-item" data-icon="description">
      Presupuesto.xlsx
      <span class="mtx-list-item-secondary-action">
        <button data-mtx="icon-button" data-icon="more_vert" aria-label="Acciones de Presupuesto.xlsx" data-open-menu="#doc-menu-rows"></button>
      </span>
    </li>
  </ul>
</div>
<div data-mtx="menu" id="doc-menu-rows">
  <div data-mtx="menu-item" data-icon="edit">Renombrar</div>
  <div data-mtx="menu-item" data-icon="delete">Eliminar</div>
</div>
{{< /mtx-demo >}}

## Con iconos

`data-icon` inserta un icono de Material Icons antes del texto del ítem.

{{< mtx-demo title="Iconos" >}}
<button class="mtx-icon-button" data-mtx="icon-button" data-icon="more_vert" aria-label="Más opciones" data-open-menu="#doc-menu-icons"></button>
<div data-mtx="menu" id="doc-menu-icons">
  <div data-mtx="menu-item" data-icon="edit">Editar</div>
  <div data-mtx="menu-item" data-icon="content_copy">Duplicar</div>
  <div data-mtx="menu-item" data-icon="share">Compartir</div>
  <div data-mtx="menu-item" data-icon="delete">Eliminar</div>
</div>
{{< /mtx-demo >}}

## Separadores

Para separar grupos usa un `<hr class="mtx-menu-item--divider">` o, con la sintaxis simplificada, un `<div data-mtx="menu-item" data-divider>`: ambos son separadores accesibles (`role="separator"`), dejan 8px de margen vertical y el teclado no se detiene en ellos.

{{< mtx-demo title="Grupos separados" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-divider">Archivo</button>
<div data-mtx="menu" id="doc-menu-divider">
  <div data-mtx="menu-item" data-icon="description">Nuevo</div>
  <div data-mtx="menu-item" data-icon="folder_open">Abrir…</div>
  <hr class="mtx-menu-item--divider">
  <div data-mtx="menu-item" data-icon="save">Guardar</div>
  <div data-mtx="menu-item" data-icon="print">Imprimir</div>
  <div data-mtx="menu-item" data-divider></div>
  <div data-mtx="menu-item" data-icon="logout">Cerrar</div>
</div>
{{< /mtx-demo >}}

## Densidad

`data-dense` en cada ítem reduce su alto mínimo de 48px a 32px, para menús largos en escritorio. `data-disable-gutters` quita el relleno lateral.

{{< mtx-demo title="Ítems densos" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-dense">Formato</button>
<div data-mtx="menu" id="doc-menu-dense">
  <div data-mtx="menu-item" data-dense>Interlineado 1</div>
  <div data-mtx="menu-item" data-dense>Interlineado 1,15</div>
  <div data-mtx="menu-item" data-dense>Interlineado 1,5</div>
  <div data-mtx="menu-item" data-dense>Doble</div>
</div>
{{< /mtx-demo >}}

## Estados

`data-selected` marca la opción actual con el fondo `action-selected` y recibe el foco al abrir con teclado. `data-disabled` atenúa la opción, la excluye del teclado y del clic (`aria-disabled="true"`). Pasa el cursor para el fondo de hover.

{{< mtx-demo title="Seleccionado y deshabilitado" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-states">Vista: Lista</button>
<div data-mtx="menu" id="doc-menu-states">
  <div data-mtx="menu-item" data-icon="view_list" data-selected>Lista</div>
  <div data-mtx="menu-item" data-icon="grid_view">Cuadrícula</div>
  <div data-mtx="menu-item" data-icon="view_timeline" data-disabled>Cronología (próximamente)</div>
</div>
{{< /mtx-demo >}}

## Opciones marcables

Con `role="menuitemcheckbox"` el ítem alterna `aria-checked` al pulsarlo; con `role="menuitemradio"` se marca y desmarca a los demás de su grupo (`role="group"` o el menú). `data-checked` fija el estado inicial y el componente añade la marca `mtx-menu-item__check`, visible solo cuando está marcado. `mtx:menu:select` incluye `detail.checked`.

{{< mtx-demo title="Casillas y opción única" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-checkable">Ver</button>
<div data-mtx="menu" id="doc-menu-checkable">
  <div data-mtx="menu-item" role="menuitemcheckbox" data-checked>Regla</div>
  <div data-mtx="menu-item" role="menuitemcheckbox">Cuadrícula</div>
  <div data-mtx="menu-item" data-divider></div>
  <div role="group" aria-label="Densidad">
    <div data-mtx="menu-item" role="menuitemradio" data-checked>Cómoda</div>
    <div data-mtx="menu-item" role="menuitemradio">Compacta</div>
  </div>
</div>
{{< /mtx-demo >}}

## Posicionamiento

El menú se coloca bajo el disparador, alineado a su borde izquierdo y con 4px de separación. Si no cabe debajo y hay más espacio arriba, se abre hacia arriba; su alto máximo es el espacio disponible (con scroll interno). Mientras está abierto sigue al disparador al desplazar la página, redimensionar la ventana o cambiar de tamaño el disparador o el menú, y se cierra si el disparador sale de la ventana. Los submenús se abren a la derecha de su ítem (a la izquierda en RTL, `dir="rtl"`), cambian de lado si no caben y se desplazan en vertical para no salir de la ventana.

- `data-anchor="selector"` usa otro elemento como ancla (y también lo convierte en disparador). `data-position-anchor="selector"` solo posiciona el menú respecto de otro elemento sin convertirlo en disparador (por ejemplo el [ButtonGroup]({{< relref "/components/button-group" >}}) completo de un split button); el foco vuelve igualmente al disparador. El hermano anterior del menú ya no se usa como ancla implícita: declara siempre el disparador (ver «Disparadores»).
- `data-match-width` iguala el ancho mínimo del menú al del ancla.
- `data-transform-origin` fuerza el origen de la animación de apertura (`top`, `bottom`…).

{{< mtx-demo title="Mismo ancho que el disparador" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-open-menu="#doc-menu-match">Ordenar por: relevancia</button>
<div data-mtx="menu" id="doc-menu-match" data-match-width>
  <div data-mtx="menu-item" data-selected>Relevancia</div>
  <div data-mtx="menu-item">Más recientes</div>
  <div data-mtx="menu-item">Precio</div>
</div>
{{< /mtx-demo >}}

## Scroll largo

Con muchas opciones el menú se limita al espacio libre de la ventana y desplaza su contenido. Escribe una letra para saltar a la siguiente opción que empiece por ella.

{{< mtx-demo title="Lista larga con búsqueda por letra" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-long">País</button>
<div data-mtx="menu" id="doc-menu-long">
  <div data-mtx="menu-item" data-dense>Argentina</div>
  <div data-mtx="menu-item" data-dense>Bolivia</div>
  <div data-mtx="menu-item" data-dense>Brasil</div>
  <div data-mtx="menu-item" data-dense>Chile</div>
  <div data-mtx="menu-item" data-dense>Colombia</div>
  <div data-mtx="menu-item" data-dense>Costa Rica</div>
  <div data-mtx="menu-item" data-dense>Cuba</div>
  <div data-mtx="menu-item" data-dense>Ecuador</div>
  <div data-mtx="menu-item" data-dense>El Salvador</div>
  <div data-mtx="menu-item" data-dense>España</div>
  <div data-mtx="menu-item" data-dense>Guatemala</div>
  <div data-mtx="menu-item" data-dense>Honduras</div>
  <div data-mtx="menu-item" data-dense>México</div>
  <div data-mtx="menu-item" data-dense>Nicaragua</div>
  <div data-mtx="menu-item" data-dense>Panamá</div>
  <div data-mtx="menu-item" data-dense>Paraguay</div>
  <div data-mtx="menu-item" data-dense>Perú</div>
  <div data-mtx="menu-item" data-dense>Puerto Rico</div>
  <div data-mtx="menu-item" data-dense>República Dominicana</div>
  <div data-mtx="menu-item" data-dense>Uruguay</div>
  <div data-mtx="menu-item" data-dense>Venezuela</div>
</div>
{{< /mtx-demo >}}

## Submenús

Un ítem con `data-submenu-trigger` y `data-open-menu="#id"` abre otro menú marcado con `data-submenu` a su derecha (o a su izquierda si no cabe). Se abre al pasar el cursor, al hacer clic o con <kbd>→</kbd>, y se cierra con <kbd>←</kbd>. El indicador `chevron_right` se añade solo.

{{< mtx-demo title="Menú anidado" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-parent">Insertar</button>
<div data-mtx="menu" id="doc-menu-parent">
  <div data-mtx="menu-item" data-icon="image">Imagen</div>
  <div data-mtx="menu-item" data-icon="table_chart">Tabla</div>
  <div data-mtx="menu-item" data-icon="insert_chart" data-submenu-trigger data-open-menu="#doc-menu-child">Gráfico</div>
</div>
<div data-mtx="menu" id="doc-menu-child" data-submenu>
  <div data-mtx="menu-item">Barras</div>
  <div data-mtx="menu-item">Líneas</div>
  <div data-mtx="menu-item">Circular</div>
</div>
{{< /mtx-demo >}}

## Menú contextual

`Materix.Menu.createContextMenu(selector, items)` crea desde JSON un menú que se abre con clic derecho en la posición del puntero. Cada ítem acepta `label`, `icon`, `image`, `disabled`, `divider`, `submenu` y `action(item, event)`.

{{< mtx-demo title="Clic derecho en el área" layout="block" >}}
<div id="doc-context-area" class="mtx-paper mtx-paper--outlined mtx-p-4">Haz clic derecho aquí</div>
{{< /mtx-demo >}}

```javascript
Materix.Menu.createContextMenu('#doc-context-area', [
  { label: 'Copiar', icon: 'content_copy', action: () => console.log('copiar') },
  { label: 'Pegar', icon: 'content_paste', disabled: true },
  { divider: true },
  { label: 'Compartir', icon: 'share', submenu: [
    { label: 'Correo', icon: 'mail', action: () => console.log('correo') },
    { label: 'Enlace', icon: 'link', action: () => console.log('enlace') },
  ] },
]);
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const area = document.getElementById('doc-context-area');
  Materix.Menu.createContextMenu('#doc-context-area', [
    { label: 'Copiar', icon: 'content_copy', action: () => { area.textContent = 'Acción: copiar'; } },
    { label: 'Pegar', icon: 'content_paste', disabled: true },
    { divider: true },
    { label: 'Compartir', icon: 'share', submenu: [
      { label: 'Correo', icon: 'mail', action: () => { area.textContent = 'Acción: compartir por correo'; } },
      { label: 'Enlace', icon: 'link', action: () => { area.textContent = 'Acción: copiar enlace'; } },
    ] },
  ]);
});
</script>

## Casos de uso reales

Menú de cuenta en una barra de aplicación: un botón de icono abre las opciones del usuario.

{{< mtx-demo title="Menú de cuenta" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-title="Mi aplicación">
  <button class="mtx-icon-button" data-mtx="icon-button" data-icon="account_circle" aria-label="Cuenta de Ana García" data-open-menu="#doc-menu-account"></button>
</header>
<div data-mtx="menu" id="doc-menu-account">
  <div data-mtx="menu-item" data-icon="person">Perfil</div>
  <div data-mtx="menu-item" data-icon="settings">Ajustes</div>
  <hr class="mtx-menu-item--divider">
  <div data-mtx="menu-item" data-icon="logout">Cerrar sesión</div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

```html
<button class="mtx-button mtx-button--text" data-mtx="button" data-open-menu="#menu-acciones">Acciones</button>
<div class="mtx-menu" id="menu-acciones" data-mtx="menu">
  <button type="button" class="mtx-menu-item" data-mtx="menu-item" data-value="edit">
    <span class="mtx-menu-item__icon material-icons" aria-hidden="true">edit</span>Editar
  </button>
  <button type="button" class="mtx-menu-item mtx-menu-item--selected" data-mtx="menu-item" data-value="view">
    <span class="mtx-menu-item__icon material-icons" aria-hidden="true">visibility</span>Ver
    <span class="mtx-menu-item__check material-icons" aria-hidden="true">check</span>
  </button>
  <hr class="mtx-menu-item--divider">
  <button type="button" class="mtx-menu-item mtx-menu-item--disabled" data-mtx="menu-item" aria-disabled="true">Archivar</button>
</div>
```

## Uso programático

```javascript
const menu = Materix.getInstance(document.getElementById('menu-acciones'));

menu.open();                                     // abre anclado al disparador
menu.open(otroBoton, { focusFirstItem: false }); // ancla a otro elemento
menu.close();                                    // devuelve el foco al disparador
menu.close({ restoreFocus: false });
console.log(menu.isOpen, menu.menuItems.length);

menu.element.addEventListener('mtx:menu:select', (event) => {
  console.log(event.detail.item.dataset.value);
});
```

Con ES modules:

```javascript
import { Menu, MenuItem, getInstance } from '@rubenchodev/materix-ui';
Menu.createContextMenu('.fila', [{ label: 'Eliminar', icon: 'delete', action: (item) => {} }]);
```

{{< mtx-demo title="open(), close() y mtx:menu:select" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-menu-api-anchor">Ancla</button>
<div data-mtx="menu" id="doc-menu-api" data-anchor="#doc-menu-api-anchor">
  <div data-mtx="menu-item" data-value="guardar">Guardar</div>
  <div data-mtx="menu-item" data-value="exportar">Exportar</div>
</div>
<button class="mtx-button mtx-button--text" data-mtx="button" id="doc-menu-api-open">menu.open()</button>
<span id="doc-menu-api-status" aria-live="polite">Sin selección</span>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-menu-api');
  const menu = Materix.getInstance(el);
  const status = document.getElementById('doc-menu-api-status');
  document.getElementById('doc-menu-api-open').addEventListener('click', (event) => {
    event.stopPropagation();
    menu.open();
  });
  el.addEventListener('mtx:menu:select', (event) => {
    status.textContent = 'mtx:menu:select → ' + event.detail.item.dataset.value;
  });
});
</script>

## Referencia de API

### Atributos data-*

**Disparador**

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-open-menu` | `#id` del menú | — | El elemento abre y cierra (alterna) ese menú al hacer clic y sirve de ancla. Recibe `aria-haspopup="menu"`, `aria-expanded` y `aria-controls`. Funciona también si se añade después de inicializar (delegación). |
| `data-mtx-menu-trigger` | `#id` o `id` del menú | — | Alias de `data-open-menu`. |
| `aria-controls` | `id` del menú | — | Un elemento existente al inicializar con `aria-controls` igual al id del menú también es disparador. |

**Menu** (`data-mtx="menu"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-anchor` | Selector CSS | — | Ancla de posicionamiento y disparador adicional (tiene prioridad como ancla sobre `data-open-menu`). Sin disparador declarado, el menú solo se abre con `open(anchor)`. |
| `data-position-anchor` | Selector CSS | — | Ancla solo de posicionamiento (no abre el menú), p. ej. el grupo de un split button. |
| `data-match-width` | booleano | — | Ancho mínimo igual al del ancla. |
| `data-transform-origin` | Valor CSS (`top`, `bottom`…) | según la colocación | Origen de la animación de apertura. |
| `data-open` | booleano | — | Abre el menú al inicializarse. |
| `data-submenu` | booleano | — | Lo convierte en submenú: se abre a la derecha del ítem disparador y también al pasar el cursor. |

**MenuItem** (`data-mtx="menu-item"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-icon` | Nombre de Material Icons | — | Inserta un icono decorativo antes del texto. |
| `data-selected` | booleano | — | Estado seleccionado (`mtx-menu-item--selected`). |
| `data-disabled` | booleano | — | Deshabilita el ítem (`mtx-menu-item--disabled`, `aria-disabled`). |
| `data-dense` | booleano | — | Alto mínimo de 32px. |
| `data-disable-gutters` | booleano | — | Sin relleno lateral. |
| `data-submenu-trigger` | booleano | — | El ítem abre un submenú (con `data-open-menu`) y no cierra el menú al pulsarlo. |
| `data-divider` | booleano | — | Convierte el ítem en separador (`role="separator"`, clase `mtx-menu-item--divider`, no enfocable). |
| `role` | `menuitem`, `menuitemcheckbox`, `menuitemradio` | `menuitem` | Con `menuitemcheckbox` el clic alterna `aria-checked`; con `menuitemradio` lo marca y desmarca el resto de su grupo. |
| `data-checked` | booleano | — | Con `role="menuitemcheckbox"` o `menuitemradio`, estado `aria-checked` inicial. |
| `data-value` | Texto | — | Valor libre para identificar la opción en `mtx:menu:select`. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-menu` | Lista del menú (`role="menu"`). |
| `mtx-menu--open` | Estado abierto. |
| `mtx-menu__popper` | Contenedor flotante en el portal (`position: fixed`, `z-index: var(--mtx-z-index-modal)`, 1300). |
| `mtx-menu__paper` | Superficie: fondo `paper`, elevación 8, radio, relleno vertical 4px, mínimo 112px de ancho, scroll vertical. |
| `mtx-menu-item` | Opción: 48px de alto mínimo, relleno 6px × 16px, `body1`. |
| `mtx-menu-item--dense` | 32px de alto mínimo. |
| `mtx-menu-item--selected` | Fondo seleccionado. |
| `mtx-menu-item--disabled` | Texto deshabilitado, sin interacción. |
| `mtx-menu-item--disable-gutters` | Sin relleno lateral. |
| `mtx-menu-item--divider` | Separador de 1px con margen de 8px (para usar en un `<hr>`). |
| `mtx-menu-item__icon` | Contenedor del icono inicial (lo genera `data-icon`): 36px de ancho mínimo, como `ListItemIcon` en MUI, color `action-active`. |
| `mtx-menu-item__check` | Marca final alineada a la derecha; oculta mientras `aria-checked="false"`. |
| `mtx-menu-item--checked` | Ítem marcable en estado marcado. |
| `mtx-menu-item__image` | Imagen de 24px de los ítems con `image` en `createContextMenu`. |
| `mtx-menu-item__expand` | Indicador de submenú (lo añade `data-submenu-trigger`). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `open(anchor?, { focusFirstItem = true, anchorEl }?)` | `void` | Abre el menú; `anchor` opcional cambia el ancla. `anchorEl` posiciona esta apertura respecto de otro elemento (el foco vuelve a `anchor`). Enfoca la opción seleccionada o la primera habilitada. |
| `close({ restoreFocus = true }?)` | `void` | Cierra el menú (y sus submenús) y devuelve el foco al disparador. |
| `isOpen` (getter) | `boolean` | Estado abierto. |
| `menuItems` (getter) | `HTMLElement[]` | Ítems `.mtx-menu-item` actuales. |
| `destroy()` | `void` | Retira listeners y elimina el contenedor del portal. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |
| `Menu.createContextMenu(selector, items)` (estático) | `Menu \| null` | Crea un menú contextual desde JSON y lo abre con clic derecho sobre `selector`. |
| `MenuItem#checked` (get/set) | `boolean` | Lee o fija `aria-checked` de un ítem marcable (en radio desmarca su grupo). |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:menu:open` | — | El menú termina de abrirse. |
| `mtx:menu:close` | — | El menú se cierra (por cualquier motivo). |
| `mtx:menu:select` | `{ item, checked? }` | Se pulsa una opción habilitada (no se emite para disparadores de submenú). El menú se cierra antes de emitirlo. `checked` solo en ítems marcables. |

Los eventos se emiten sobre el elemento del menú y burbujean.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-background-paper`, `--mtx-elevation-8`, `--mtx-shape-radius` | Superficie del menú. |
| `--mtx-overlay-elevation-8` | Capa blanca de la superficie en tema oscuro (elevación 8 de MUI). |
| `--mtx-color-text-primary`, `--mtx-color-text-disabled` | Texto normal y deshabilitado. |
| `--mtx-color-action-hover`, `--mtx-color-action-selected` | Fondos de hover y seleccionado. |
| `--mtx-color-action-active` | Iconos `__icon`, `__check` y `__expand`. |
| `--mtx-color-divider` | Separador. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Foco del ítem con teclado. |
| `--mtx-font-family`, `--mtx-duration-shorter`, `--mtx-easing-standard` | Tipografía y transición de fondo. |

## Accesibilidad

- El menú recibe `role="menu"` y cada ítem `role="menuitem"` (o el `menuitemcheckbox` / `menuitemradio` que declares, con `aria-checked` sincronizado) y `tabindex="-1"`; los separadores, `role="separator"`. El disparador recibe `aria-haspopup="menu"`, `aria-controls` y `aria-expanded` sincronizado.
- Al abrir con teclado el foco va a la opción seleccionada o a la primera habilitada; al abrir con el ratón, al contenedor del menú. Al cerrar con <kbd>Escape</kbd> o tras elegir, el foco vuelve al disparador.
- Los iconos generados son decorativos (`aria-hidden`). Si el disparador es un botón de solo icono, dale `aria-label`.
- Los ítems deshabilitados llevan `aria-disabled="true"` y el teclado los salta.

| Tecla | Acción |
|---|---|
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> (en el disparador) | Abre el menú y enfoca la primera opción. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Opción siguiente / anterior, con ciclo. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primera / última opción habilitada. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa la opción enfocada. |
| Letra | Salta a la siguiente opción que empieza por esa letra. |
| <kbd>→</kbd> | Abre el submenú del ítem enfocado. |
| <kbd>←</kbd> | Cierra el submenú y vuelve al menú padre. |
| <kbd>Escape</kbd> | Cierra el menú y devuelve el foco al disparador. |
| <kbd>Tab</kbd> | Cierra el menú y deja que el foco continúe. |
