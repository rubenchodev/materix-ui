---
title: "Breadcrumbs"
description: "Ruta de navegación jerárquica: muestra dónde está el usuario y permite volver a cualquier nivel superior."
group: "navigation"
icon: "more_horiz"
weight: 5
example: "breadcrumbs"
mui: "https://mui.com/material-ui/react-breadcrumbs/"
---

`Breadcrumbs` pinta la ruta desde la raíz del sitio o de la aplicación hasta la página actual, como `Breadcrumbs` de MUI: un `<nav>` con una lista ordenada, separadores ocultos a las tecnologías de asistencia y el último ítem marcado con `aria-current="page"`. Úsalo en jerarquías de tres o más niveles (catálogos, documentación, administradores de archivos). No lo uses como navegación principal ni para flujos lineales: para secciones usa [Drawer](../drawer/) o [Tabs](../tabs/), y para pasos un stepper.

## Uso básico

Un único `<ol data-mtx="breadcrumbs">`. El componente lo envuelve en `<nav aria-label>`, convierte cada `<a>` en un [Link](../link/) de Materix (`color="inherit"`, subrayado al pasar el cursor), inserta los separadores y marca el último ítem como página actual.

{{< mtx-demo title="Ruta simple" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#">Inicio</a></li>
  <li><a href="#">Catálogo</a></li>
  <li>Accesorios</li>
</ol>
{{< /mtx-demo >}}

Si el último ítem debe seguir siendo un enlace (por ejemplo, para recargar la página), añade tú `aria-current="page"`: el componente lo respeta y no marca ningún otro ítem.

{{< mtx-demo title="Página actual como enlace" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#">Inicio</a></li>
  <li><a href="#">Catálogo</a></li>
  <li><a href="#" aria-current="page">Auriculares</a></li>
</ol>
{{< /mtx-demo >}}

## Separadores

`data-separator` acepta cualquier texto (por defecto `/`) o el nombre de un icono Material: un valor en minúsculas, dígitos y guion bajo de tres o más caracteres (`navigate_next`, `chevron_right`) se pinta como icono.

{{< mtx-demo title="Separadores de texto e icono" layout="column" >}}
<ol data-mtx="breadcrumbs" data-separator="›">
  <li><a href="#">Inicio</a></li>
  <li><a href="#">Catálogo</a></li>
  <li>Accesorios</li>
</ol>
<ol data-mtx="breadcrumbs" data-separator="-">
  <li><a href="#">Inicio</a></li>
  <li><a href="#">Catálogo</a></li>
  <li>Accesorios</li>
</ol>
<ol data-mtx="breadcrumbs" data-separator="navigate_next">
  <li><a href="#">Inicio</a></li>
  <li><a href="#">Catálogo</a></li>
  <li>Accesorios</li>
</ol>
{{< /mtx-demo >}}

## Con iconos

`data-icon` en el enlace (o en el `<span>` de texto) añade un icono Material decorativo antes de la etiqueta. Como en MUI, el subrayado de hover y el anillo de foco mantienen el icono alineado: solo se subraya la etiqueta.

{{< mtx-demo title="Ruta con iconos" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#" data-icon="home">Inicio</a></li>
  <li><a href="#" data-icon="whatshot">Proyectos</a></li>
  <li><span data-icon="grain">Rediseño web</span></li>
</ol>
{{< /mtx-demo >}}

## Ruta colapsada

Cuando hay más ítems que `data-max-items` (8 por defecto) solo se muestran `data-items-before-collapse` (1) y `data-items-after-collapse` (1), separados por un botón «Mostrar ruta». Al activarlo se revelan los ítems ocultos y el foco pasa al primero de ellos.

{{< mtx-demo title="data-max-items" layout="column" >}}
<ol data-mtx="breadcrumbs" data-max-items="2">
  <li><a href="#">Inicio</a></li>
  <li><a href="#">Catálogo</a></li>
  <li><a href="#">Accesorios</a></li>
  <li><a href="#">Nueva colección</a></li>
  <li>Cinturones</li>
</ol>
<ol data-mtx="breadcrumbs" data-max-items="4" data-items-before-collapse="2" data-items-after-collapse="2" data-separator="navigate_next">
  <li><a href="#">Inicio</a></li>
  <li><a href="#">Documentos</a></li>
  <li><a href="#">2026</a></li>
  <li><a href="#">Contabilidad</a></li>
  <li><a href="#">Trimestre 3</a></li>
  <li>Facturas</li>
</ol>
{{< /mtx-demo >}}

## Tipografía

Como en MUI, usa `body1` en `text.secondary` y la página actual en `text.primary`. Para una ruta más compacta añade una clase de Typography (`mtx-typography--body2`) al elemento.

{{< mtx-demo title="body1 y body2" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#">Ajustes</a></li>
  <li>Seguridad</li>
</ol>
<ol data-mtx="breadcrumbs" class="mtx-typography--body2">
  <li><a href="#">Ajustes</a></li>
  <li>Seguridad</li>
</ol>
{{< /mtx-demo >}}

## Estados

Los enlaces muestran los estados de Link (subrayado en hover, anillo de foco con <kbd>Tab</kbd>). Un enlace de la ruta puede deshabilitarse con `data-disabled`, y `data-color` en el `<a>` cambia su color.

{{< mtx-demo title="Ítem deshabilitado y color de enlace" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#">Inicio</a></li>
  <li><a href="#" data-disabled>Archivado</a></li>
  <li>Pedido #4821</li>
</ol>
<ol data-mtx="breadcrumbs">
  <li><a href="#" data-color="primary">Inicio</a></li>
  <li><a href="#" data-color="primary">Clientes</a></li>
  <li>Ana Torres</li>
</ol>
{{< /mtx-demo >}}

## Desde una lista de enlaces

También se puede inicializar sobre un `<nav>` cuyos hijos directos son los enlaces: el componente crea el `<ol>` y un `<li>` por hijo. Sobre un `<div>` añade `role="navigation"`.

{{< mtx-demo title="nav con enlaces directos" layout="column" >}}
<nav data-mtx="breadcrumbs" aria-label="Ubicación en la ayuda">
  <a href="#">Ayuda</a>
  <a href="#">Facturación</a>
  <span>Cambiar método de pago</span>
</nav>
{{< /mtx-demo >}}

## Casos de uso reales

Cabecera de página de un panel de administración: ruta, título y acción principal.

{{< mtx-demo title="Cabecera de página" layout="block" >}}
<div class="mtx-d-flex mtx-flex-column mtx-gap-1">
  <ol data-mtx="breadcrumbs" class="mtx-typography--body2">
    <li><a href="#" data-icon="dashboard">Panel</a></li>
    <li><a href="#">Usuarios</a></li>
    <li>Editar perfil</li>
  </ol>
  <div class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-justify-content-between mtx-gap-2">
    <h3 data-mtx="typography" data-variant="h5">Editar perfil</h3>
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Guardar cambios</button>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Estructura prerenderizada (SSR). Sin JavaScript ya se ve correcta; con `data-mtx` el componente reutiliza los nodos y vuelve a pintar los separadores sin duplicarlos.

```html
<nav class="mtx-breadcrumbs" data-mtx="breadcrumbs" aria-label="breadcrumb">
  <ol class="mtx-breadcrumbs__ol">
    <li class="mtx-breadcrumbs__li"><a class="mtx-link mtx-link--inherit mtx-breadcrumbs__link" href="/">Inicio</a></li>
    <li class="mtx-breadcrumbs__separator" aria-hidden="true">/</li>
    <li class="mtx-breadcrumbs__li"><a class="mtx-link mtx-link--inherit mtx-breadcrumbs__link" href="/blog">Blog</a></li>
    <li class="mtx-breadcrumbs__separator" aria-hidden="true">/</li>
    <li class="mtx-breadcrumbs__li"><span class="mtx-breadcrumbs__text" aria-current="page">Novedades de octubre</span></li>
  </ol>
</nav>
```

## Uso programático

`setItems()` reconstruye la ruta completa, ideal para SPA y navegación de carpetas. Los ítems sin `href` que no son la página actual se pintan como Link sobre `<button>`; `data` se copia a atributos `data-*` y vuelve en el evento. El evento `mtx:breadcrumbs:navigate` es cancelable: llama a `preventDefault()` para gestionar tú la navegación.

{{< mtx-demo title="Navegación de carpetas" layout="column" >}}
<ol data-mtx="breadcrumbs" data-separator="chevron_right" data-max-items="4" id="doc-bc-folders">
  <li><span data-icon="folder">Mi unidad</span></li>
</ol>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" id="doc-bc-open">Abrir subcarpeta</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var folders = ['Mi unidad', 'Proyectos', 'Cliente Andina', 'Entregables', 'Informe Q3'];
  var depth = 0;
  var crumbs = Materix.getInstance(document.getElementById('doc-bc-folders'));
  function render() {
    crumbs.setItems(folders.slice(0, depth + 1).map(function (name, index) {
      return { label: name, icon: index === 0 ? 'folder' : null, data: { depth: index } };
    }));
  }
  crumbs.element.addEventListener('mtx:breadcrumbs:navigate', function (event) {
    event.preventDefault();
    depth = event.detail.index;
    render();
  });
  document.getElementById('doc-bc-open').addEventListener('click', function () {
    depth = Math.min(depth + 1, folders.length - 1);
    render();
  });
});
</script>

```javascript
const crumbs = Materix.getInstance(document.querySelector('#carpetas'));

crumbs.setItems([
  { label: 'Mi unidad', icon: 'folder', data: { folder: 'root' } },
  { label: 'Proyectos', data: { folder: 'p1' } },
  { label: 'Informe Q3' }              // último: página actual
]);

crumbs.element.addEventListener('mtx:breadcrumbs:navigate', (event) => {
  event.preventDefault();               // navegación SPA
  openFolder(event.detail.item.data.folder);
});

// Instanciación directa
const trail = new Materix.Breadcrumbs(document.querySelector('ol.ruta'));
trail.expand();                         // muestra los ítems colapsados
```

Con ES modules:

```javascript
import { Breadcrumbs, getInstance } from '@rubenchodev/materix-ui';
```

`Materix.getInstance()` devuelve la misma instancia para el `<ol>` original y para el `<nav>` que lo envuelve; `instance.element` es siempre el `<nav>`.

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `breadcrumbs` | — | Inicializa el componente sobre un `<ol>`/`<ul>` (se envuelve en `<nav>`), un `<nav>` con `<ol>` o un `<nav>`/`<div>` con enlaces directos. |
| `data-separator` | texto o nombre de icono | `/` | Separador entre ítems. Los nombres en minúsculas con `_` y 3+ caracteres se pintan como icono Material. |
| `data-max-items` | entero | `8` | Máximo de ítems visibles antes de colapsar. `0` desactiva el colapso. |
| `data-items-before-collapse` | entero | `1` | Ítems visibles antes del botón de colapso. |
| `data-items-after-collapse` | entero | `1` | Ítems visibles después del botón de colapso. |
| `data-expand-label` | texto | i18n `breadcrumbs.showPath` | Etiqueta accesible del botón de colapso. |
| `data-icon` (en `<a>`, `<span>` o `<li>`) | nombre de icono | — | Icono decorativo antes de la etiqueta. |
| `data-color`, `data-underline`, `data-disabled` (en `<a>`) | ver [Link](../link/) | `inherit`, `hover` | Opciones de Link para cada ítem. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-breadcrumbs` | `<nav>` raíz: tipografía `body1` (especificidad cero, para que `mtx-typography--*` pueda cambiarla) en `text.secondary`. |
| `mtx-breadcrumbs--collapsed` | Presente mientras hay ítems ocultos. |
| `mtx-breadcrumbs__ol` | Lista flex con salto de línea, sin viñetas ni márgenes. |
| `mtx-breadcrumbs__li` | Ítem. |
| `mtx-breadcrumbs__link` | Enlace del ítem (un Link de Materix). |
| `mtx-breadcrumbs__text` | Ítem sin enlace (normalmente la página actual). |
| `mtx-breadcrumbs__item--with-icon` | Enlace o texto con icono: reserva 24px + 4px para el icono y deja el subrayado de hover solo bajo el texto. |
| `mtx-breadcrumbs__icon` | Icono decorativo de 24px (`aria-hidden`), centrado verticalmente y fuera del flujo del texto, por lo que nunca se subraya. |
| `mtx-breadcrumbs__separator` | `<li>` separador con `aria-hidden="true"` y margen horizontal de 8px. |
| `mtx-breadcrumbs__collapsed` | `<li>` que contiene el botón de colapso. |
| `mtx-breadcrumbs__collapse-button` | Botón «Mostrar ruta» (icono MoreHoriz 24×16). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `setItems(items)` | `void` | Reemplaza la ruta. `items`: `[{ label, href?, icon?, current?, data? }]`. Sin `current`, el último ítem es la página actual. Lanza `TypeError` si no es un array. |
| `getItems()` | `Array` | Copia de los ítems: `{ label, href, icon, current, data }`. |
| `expand(focus?)` | `void` | Muestra todos los ítems; con `focus = true` mueve el foco al primer ítem revelado. |
| `collapse()` | `void` | Vuelve a aplicar el colapso. |
| `expanded` (getter) | `boolean` | Indica si la ruta se expandió. |
| `maxItems` (getter/setter) | `number` | Máximo de ítems visibles. |
| `destroy()` | `void` | Elimina los listeners. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:breadcrumbs:navigate` | `{ index, href, label, current, item, originalEvent }` | Se activa un enlace o botón de la ruta. Cancelable: `preventDefault()` cancela la navegación nativa. |
| `mtx:breadcrumbs:expand` | — | Se revelan los ítems colapsados. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-breadcrumbs-separator-gap` | Margen horizontal del separador (8px). |
| `--mtx-breadcrumbs-collapse-bg`, `--mtx-breadcrumbs-collapse-bg-hover`, `--mtx-breadcrumbs-collapse-color` | Colores del botón de colapso (grey 100/200/700, invertidos en tema oscuro). |
| `--mtx-type-body1`, `--mtx-color-text-secondary`, `--mtx-color-text-primary` | Tipografía y colores de la ruta y de la página actual. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco del botón de colapso. |

## Accesibilidad

- Landmark `<nav>` con `aria-label` traducido (i18n `breadcrumbs.label`: «breadcrumb» / «ruta de navegación»); se respeta tu propio `aria-label` o `aria-labelledby`. Sobre un `<div>` se añade `role="navigation"`.
- Lista ordenada (`<ol>`): los lectores de pantalla anuncian el número de niveles.
- Los separadores son `<li aria-hidden="true">` y no se leen.
- La página actual lleva `aria-current="page"`.
- El botón de colapso es un `<button>` real con la etiqueta traducida «Mostrar ruta»; tras expandir, el foco pasa al primer ítem revelado para no perderse.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre los enlaces de la ruta y el botón de colapso. |
| <kbd>Enter</kbd> | Sigue el enlace o expande la ruta. |
| <kbd>Espacio</kbd> | Expande la ruta (botón de colapso) o activa un ítem pintado como botón. |
