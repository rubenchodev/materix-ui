---
title: "List"
description: "Lista vertical continua de texto, iconos o avatares; con ítems estáticos o interactivos, subcabeceras, densidad y selección."
group: "data-display"
icon: "format_list_bulleted"
weight: 50
example: "list"
mui: "https://mui.com/material-ui/react-list/"
---

`List` agrupa elementos relacionados en una columna continua: menús de navegación, bandejas de entrada, ajustes o resultados. Cada fila puede llevar icono o avatar, texto principal y secundario y una acción al final. Para datos con varias columnas comparables usa [Table](../table/); para un menú flotante usa [Menu](../menu/).

La familia registra estos valores de `data-mtx`: `list`, `list-item` (fila estática), `list-item-button` (fila interactiva), `list-item-text`, `list-item-icon`, `list-item-avatar`, `list-item-secondary-action` y `list-subheader`. Cada uno añade su clase `mtx-*`, así que basta con el atributo.

## Uso básico

Un `<ul data-mtx="list">` con filas `data-mtx="list-item"`. `data-icon` añade un icono inicial y `data-secondary` un texto secundario; el componente construye la estructura interna.

{{< mtx-demo title="Lista con iconos y texto secundario" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Correo">
    <li data-mtx="list-item" data-icon="inbox" data-secondary="3 mensajes nuevos">Bandeja de entrada</li>
    <li data-mtx="list-item" data-icon="drafts" data-secondary="Guardado hace 2 horas">Borradores</li>
    <li data-mtx="list-item" data-icon="send">Enviados</li>
  </ul>
</div>
{{< /mtx-demo >}}

## Contenido de las filas

Una fila puede tener solo texto, icono, avatar, y texto principal con secundario. Para un avatar usa `data-avatar="url"` o escribe el `data-mtx="avatar"` dentro de la fila: el componente lo envuelve en `mtx-list-item-avatar` (56px de ancho, como `ListItemAvatar` de MUI). El texto suelto de la fila pasa a `mtx-list-item-text`; los controles, botones y otros componentes se conservan donde están.

{{< mtx-demo title="Texto, icono y avatar" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Contactos">
    <li data-mtx="list-item">Solo texto</li>
    <li data-mtx="list-item" data-icon="star">Con icono</li>
    <li data-mtx="list-item" data-avatar="https://i.pravatar.cc/120?img=5" data-secondary="ana@ejemplo.com">Ana García</li>
    <li data-mtx="list-item" data-secondary="carlos@ejemplo.com"><span data-mtx="avatar" data-color="primary">CR</span>Carlos Ruiz</li>
  </ul>
</div>
{{< /mtx-demo >}}

`data-align-start` alinea el icono o avatar con la primera línea cuando el texto secundario ocupa varias líneas.

{{< mtx-demo title="Alineación superior" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Mensajes">
    <li data-mtx="list-item" data-align-start data-secondary="Te comparto el resumen de la reunión del lunes con los acuerdos, los responsables de cada tarea y las fechas previstas de entrega."><span data-mtx="avatar" data-color="secondary">LM</span>Resumen del lunes</li>
  </ul>
</div>
{{< /mtx-demo >}}

## Filas interactivas

`data-mtx="list-item-button"` en un `<button>` (o `<a>` para navegación) añade hover, foco visible, ripple y selección. Al pulsar una fila se marca como seleccionada (`mtx-list-item--selected`) y se desmarca la anterior de la misma lista; además emite el evento `mtx:list:select`.

{{< mtx-demo title="Lista seleccionable" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Ajustes">
    <li><button data-mtx="list-item-button" data-icon="person" data-secondary="Nombre, foto y correo">Perfil</button></li>
    <li><button data-mtx="list-item-button" data-icon="settings" data-secondary="Tema e idioma" data-selected>Preferencias</button></li>
    <li><button data-mtx="list-item-button" data-icon="lock">Seguridad</button></li>
  </ul>
</div>
{{< /mtx-demo >}}

`data-selectable="false"` en la lista (o `data-no-select` en una fila) desactiva la selección automática para filas que solo ejecutan una acción.

{{< mtx-demo title="Acciones sin selección" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" data-selectable="false" aria-label="Acciones">
    <li><button data-mtx="list-item-button" data-icon="file_download">Descargar</button></li>
    <li><button data-mtx="list-item-button" data-icon="share">Compartir</button></li>
  </ul>
</div>
{{< /mtx-demo >}}

## Subcabeceras

`list-subheader` titula grupos de filas. Lleva la clase `mtx-list-subheader`; `data-inset` alinea el título con el texto de filas con icono y `data-sticky` lo fija al hacer scroll dentro de la lista.

{{< mtx-demo title="Grupos con subcabecera fija" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Ajustes por categoría" style="max-height: 240px; overflow: auto;">
    <li class="mtx-list-subheader" data-mtx="list-subheader" data-sticky>General</li>
    <li data-mtx="list-item" data-icon="account_circle">Cuenta</li>
    <li data-mtx="list-item" data-icon="security">Privacidad</li>
    <li data-mtx="list-item" data-icon="language">Idioma</li>
    <li class="mtx-list-subheader" data-mtx="list-subheader" data-sticky>Comunicaciones</li>
    <li data-mtx="list-item" data-icon="notifications">Notificaciones</li>
    <li data-mtx="list-item" data-icon="mail">Correo</li>
    <li data-mtx="list-item" data-icon="sms">SMS</li>
  </ul>
</div>
{{< /mtx-demo >}}

## Densidad

`data-dense` en la lista reduce el relleno vertical de todas sus filas (de 8px a 4px).

{{< mtx-demo title="Lista densa" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" data-dense aria-label="Archivos">
    <li data-mtx="list-item" data-icon="folder">Documentos</li>
    <li data-mtx="list-item" data-icon="image">Fotos</li>
    <li data-mtx="list-item" data-icon="videocam">Vídeos</li>
  </ul>
</div>
{{< /mtx-demo >}}

## Listas anidadas

Una lista con `data-nested` dentro de un ítem sangra sus filas 48px. La selección se comparte con la lista raíz.

{{< mtx-demo title="Anidada" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Carpetas">
    <li>
      <button data-mtx="list-item-button" data-icon="inbox">Bandeja de entrada</button>
      <ul data-mtx="list" data-nested aria-label="Subcarpetas">
        <li><button data-mtx="list-item-button" data-icon="star_border">Destacados</button></li>
        <li><button data-mtx="list-item-button" data-icon="label">Facturas</button></li>
      </ul>
    </li>
    <li><button data-mtx="list-item-button" data-icon="send">Enviados</button></li>
  </ul>
</div>
{{< /mtx-demo >}}

## Acciones secundarias

Envuelve la acción en `mtx-list-item-secondary-action` (o `data-mtx="list-item-secondary-action"`), equivalente a `ListItemSecondaryAction` de MUI: queda al final de la fila, admite varias acciones de cualquier ancho y un IconButton final se ajusta al borde como `edge="end"`. Con la sintaxis simplificada, `data-icon` y `data-secondary` construyen el icono y el texto sin tocar la acción.

{{< mtx-demo title="Acciones al final" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Documentos">
    <li data-mtx="list-item" data-icon="description" data-secondary="2,4 MB" data-divider>
      Informe anual.pdf
      <span class="mtx-list-item-secondary-action">
        <button data-mtx="icon-button" data-icon="file_download" aria-label="Descargar Informe anual.pdf"></button>
        <button data-mtx="icon-button" data-icon="delete" aria-label="Eliminar Informe anual.pdf"></button>
      </span>
    </li>
    <li data-mtx="list-item" data-icon="laptop_mac" data-secondary="Madrid · activa ahora">
      MacBook Pro
      <span class="mtx-list-item-secondary-action">
        <button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small">Cerrar sesión</button>
      </span>
    </li>
  </ul>
</div>
{{< /mtx-demo >}}

Para una fila pulsable con una acción independiente (sin anidar botones), usa un `list-item` con `data-disable-padding` que contenga el `list-item-button` y la acción como hermanos.

{{< mtx-demo title="Fila pulsable con acción" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Proyectos">
    <li data-mtx="list-item" data-disable-padding>
      <button data-mtx="list-item-button" data-icon="folder" data-secondary="12 archivos" data-no-select>Proyecto Atlas</button>
      <span class="mtx-list-item-secondary-action">
        <button data-mtx="icon-button" data-icon="more_vert" aria-label="Opciones de Proyecto Atlas"></button>
      </span>
    </li>
  </ul>
</div>
{{< /mtx-demo >}}

## Estados

`data-disabled` deshabilita una fila: en `list-item-button` sobre `<button>` usa el atributo `disabled` nativo; sobre `<a>` usa `aria-disabled="true"` y la retira del orden de tabulación. Pasa el cursor y usa Tab para ver hover y foco.

{{< mtx-demo title="Normal, seleccionada y deshabilitada" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Estados">
    <li><button data-mtx="list-item-button" data-icon="radio_button_unchecked">Normal</button></li>
    <li><button data-mtx="list-item-button" data-icon="check_circle" data-selected>Seleccionada</button></li>
    <li><button data-mtx="list-item-button" data-icon="block" data-disabled>Deshabilitada</button></li>
    <li data-mtx="list-item" data-icon="block" data-disabled>Fila estática deshabilitada</li>
  </ul>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Navegación lateral con enlaces: en `<a>`, la fila seleccionada recibe `aria-current="page"`. Los enlaces no se subrayan y heredan el color de la lista; dentro de un Drawer, Paper, Card, Dialog o Menu la lista es transparente para respetar la superficie.

{{< mtx-demo title="Navegación" layout="block" >}}
<nav data-mtx="paper" data-variant="outlined" aria-label="Secciones">
  <ul data-mtx="list">
    <li><a href="#resumen" data-mtx="list-item-button" data-icon="dashboard" data-selected aria-current="page">Resumen</a></li>
    <li><a href="#pedidos" data-mtx="list-item-button" data-icon="shopping_bag">Pedidos</a></li>
    <li><a href="#clientes" data-mtx="list-item-button" data-icon="people">Clientes</a></li>
    <li class="mtx-list-subheader" data-mtx="list-subheader">Informes</li>
    <li><a href="#ventas" data-mtx="list-item-button" data-icon="bar_chart">Ventas</a></li>
  </ul>
</nav>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Con la estructura completa renderizada en el servidor, el componente no duplica nodos.

```html
<ul class="mtx-list" data-mtx="list">
  <li class="mtx-list-subheader" data-mtx="list-subheader">Correo</li>
  <li class="mtx-list-item" data-mtx="list-item">
    <span class="mtx-list-item-icon"><span class="material-icons" aria-hidden="true">inbox</span></span>
    <span class="mtx-list-item-text">
      <span class="mtx-list-item-text__primary">Bandeja de entrada</span>
      <span class="mtx-list-item-text__secondary">3 mensajes nuevos</span>
    </span>
  </li>
  <li>
    <button class="mtx-list-item mtx-list-item-button mtx-list-item--selected" data-mtx="list-item-button">
      <span class="mtx-list-item-text"><span class="mtx-list-item-text__primary">Ajustes</span></span>
    </button>
  </li>
</ul>
```

## Uso programático

```javascript
// Inicializar una lista generada dinámicamente (y todo su contenido)
Materix.initAll(document.getElementById('results'));

// Instancias
const row = Materix.init(document.getElementById('row-settings')); // ListItemButton
const same = Materix.getInstance(document.getElementById('row-settings'));

row.selected = true;   // marca la fila (no emite evento)
row.disable();         // deshabilita
row.enable();

// Escuchar la selección hecha por el usuario
document.getElementById('settings-list').addEventListener('mtx:list:select', (event) => {
  console.log('Seleccionada:', event.detail.item.textContent.trim());
});
```

Con ES modules:

```javascript
import {
  List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListItemAvatar,
  ListItemSecondaryAction, ListSubheader, getInstance,
} from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="Selección con evento" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul id="doc-list-events" data-mtx="list" aria-label="Vistas">
    <li><button data-mtx="list-item-button" data-icon="view_list">Lista</button></li>
    <li><button data-mtx="list-item-button" data-icon="grid_view">Cuadrícula</button></li>
    <li><button data-mtx="list-item-button" data-icon="calendar_month">Calendario</button></li>
  </ul>
</div>
<p id="doc-list-status" aria-live="polite">Pulsa una fila.</p>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('doc-list-events').addEventListener('mtx:list:select', (event) => {
    document.getElementById('doc-list-status').textContent = 'mtx-select: ' + event.detail.item.textContent.trim();
  });
});
</script>

## Referencia de API

### Atributos data-*

**List** (`data-mtx="list"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-dense` | Booleano (presencia) | ausente | Filas compactas (4px de relleno vertical) en toda la lista. |
| `data-nested` | Booleano (presencia) | ausente | Lista anidada: sin relleno propio y filas sangradas 48px. |
| `data-disable-padding` | Booleano (presencia) | ausente | Quita el relleno vertical de 8px de la lista. |
| `data-selectable` | `false` | selección activa | Con `false`, sus `list-item-button` no se seleccionan al pulsarlos. |

**ListItem** (`data-mtx="list-item"`) y **ListItemButton** (`data-mtx="list-item-button"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-icon` | Nombre de Material Icons | — | Icono inicial dentro de `mtx-list-item-icon`. |
| `data-avatar` | URL de imagen | — | Avatar inicial dentro de `mtx-list-item-avatar`. |
| `data-avatar-alt` | Texto | `""` (decorativo) | Texto alternativo del avatar de `data-avatar`. |
| `data-primary` | Texto | contenido de texto | Texto principal explícito (en lugar del texto suelto de la fila). |
| `data-secondary` | Texto | — | Texto secundario. El texto suelto pasa a `mtx-list-item-text__primary`; acciones, controles y componentes hijos se conservan. |
| `data-dense` | Booleano (presencia) | heredado de la lista | Fila compacta. |
| `data-divider` | Booleano (presencia) | ausente | Borde inferior de 1px. |
| `data-disabled` | Booleano (presencia) | ausente | Fila deshabilitada. |
| `data-align-start` | Booleano (presencia) | ausente | Alinea el icono o avatar con la primera línea. |
| `data-disable-padding` | Booleano (presencia) | ausente | Solo ListItem: sin relleno. |
| `data-disable-gutters` | Booleano (presencia) | ausente | Sin relleno lateral. |
| `data-selected` | Booleano (presencia) | ausente | Solo ListItemButton: seleccionada al iniciar. |
| `data-no-select` | Booleano (presencia) | ausente | Solo ListItemButton: no se selecciona al pulsarla. |

**ListSubheader** (`data-mtx="list-subheader"`, con clase `mtx-list-subheader`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-inset` | Booleano (presencia) | ausente | Sangría de 72px para alinear con el texto de filas con icono. |
| `data-sticky` | Booleano (presencia) | ausente | Queda fijo arriba al desplazar la lista. |

**ListItemText** (`data-mtx="list-item-text"`): admite `data-primary` y `data-secondary`; si no hay `__primary`, envuelve su contenido en él. **ListItemIcon** (`data-mtx="list-item-icon"`): con `data-icon` y sin contenido genera el icono. **ListItemAvatar** y **ListItemSecondaryAction** solo añaden su clase.

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-list` | Contenedor (`padding: 8px 0`, fondo paper; transparente dentro de Drawer, Paper, Card, Dialog y Menu). |
| `mtx-list--dense` / `--nested` / `--nested-2` / `--disable-padding` | Densa, anidada (48px), anidada de 2.º nivel (72px), sin relleno. |
| `mtx-list-item` | Fila (`padding: 8px 16px`, body1). |
| `mtx-list-item--dense` / `--divider` / `--align-start` | Compacta, con borde inferior, alineada arriba. |
| `mtx-list-item--disable-padding` / `--disable-gutters` | Sin relleno / sin relleno lateral. |
| `mtx-list-item--selected` / `--disabled` | Seleccionada / deshabilitada. |
| `mtx-list-item--nested` / `--nested-2` | Sangría de una fila suelta. |
| `mtx-list-item-button` | Fila interactiva (hover, foco, ripple). |
| `mtx-list-item-icon` | Contenedor de icono (24px mínimo, 16px de margen). |
| `mtx-list-item-avatar` | Contenedor de avatar (`ListItemAvatar`, 56px de ancho mínimo). |
| `mtx-list-item-secondary-action` | Acciones al final de la fila (`ListItemSecondaryAction`); un IconButton final se ajusta al borde. |
| `mtx-list-item-text` | Bloque de texto que ocupa el espacio libre. |
| `mtx-list-item-text__primary` / `__secondary` | Texto principal (body1) y secundario (body2, color secundario). |
| `mtx-list-subheader` | Subcabecera (14px, peso 500, color secundario). |
| `mtx-list-subheader--inset` / `--sticky` | Con sangría / fija. |

### Métodos

**ListItemButton**

| Método / propiedad | Retorna | Descripción |
|---|---|---|
| `selected` (get/set) | `boolean` | Lee o cambia la selección (clase y ARIA: `aria-current` o `aria-selected` según el rol). No emite evento. |
| `disabled` (get) | `boolean` | Estado deshabilitado. |
| `disable()` | `void` | Deshabilita (`disabled` en botones, `aria-disabled` y `tabindex="-1"` en otros elementos). |
| `enable()` | `void` | Habilita de nuevo. |
| `destroy()` | `void` | Retira los listeners de ripple y clic. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction y ListSubheader no exponen métodos propios.

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:list:select` | `{ item: HTMLElement }` | El usuario pulsa un `list-item-button` habilitado y seleccionable. Burbujea desde la fila. |

{{< callout type="warning" title="Alias deprecado" >}}
El nombre antiguo `mtx-select` se sigue emitiendo con el mismo `detail` justo después de `mtx:list:select`, pero está deprecado y se eliminará en la 1.0. Escucha `mtx:list:select`.
{{< /callout >}}

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-background-paper` | Fondo de la lista y de subcabeceras fijas. |
| `--mtx-color-action-hover` | Hover de filas interactivas. |
| `--mtx-color-action-selected` | Fondo de la fila seleccionada. |
| `--mtx-color-action-active` | Color de los iconos. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` / `--mtx-color-text-disabled` | Textos principal, secundario y deshabilitado. |
| `--mtx-color-divider` | Borde de `data-divider`. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |

## Accesibilidad

- Usa `<ul>`/`<li>` para que los lectores anuncien el número de elementos, y da un nombre a la lista con `aria-label` cuando no tenga un título visible.
- Para separar ítems usa `data-divider` en los ítems o un `<li data-mtx="divider">` (ver [Divider](../divider/)): sigue siendo un elemento de lista y, vacío, se oculta con `aria-hidden`. No pongas un `<hr>` ni un elemento con `role="separator"` como hijo directo de `<ul>`/`<ol>` (regla axe `list`).
- Las filas interactivas deben ser `<button>` (acciones) o `<a href>` (navegación) dentro de un `<li>`: así son enfocables y se activan con el teclado sin código adicional.
- La selección se comunica con ARIA válido según el elemento: `<a>` recibe `aria-current="page"`; un `<button>`, `aria-current="true"`; solo las filas con `role="option"` o `role="tab"` (u otro rol seleccionable) reciben `aria-selected`. Se sincroniza al pulsar, con `data-selected` y con el setter `selected`.
- Los iconos generados con `data-icon` son decorativos; el texto de la fila es el nombre accesible. Los botones de acción secundaria necesitan su propio `aria-label`.

| Tecla | Acción |
|---|---|
| Tab / Mayús+Tab | Mueve el foco entre filas interactivas y acciones. |
| Enter | Activa la fila enfocada (`<button>` o `<a>`). |
| Espacio | Activa la fila enfocada si es un `<button>`. |
