---
title: "Button"
description: "Botón de acción con variantes text, outlined y contained, tres alturas canónicas (48/40/32px), colores de la paleta e iconos."
group: "inputs"
icon: "smart_button"
weight: 10
example: "button"
mui: "https://mui.com/material-ui/react-button/"
---

**Button** permite al usuario ejecutar una acción o confirmar una decisión con un clic: guardar un formulario, abrir un diálogo, enviar un mensaje. Úsalo cuando la acción tenga un texto que la describa. Si la acción solo puede representarse con un icono, usa [Icon Button](../icon-button/); si es la acción principal y persistente de toda la pantalla, usa [Fab](../fab/). Para navegar a otra página, renderiza el botón como enlace `<a href>`.

{{< callout type="tip" title="¿Button, Icon Button o Fab?" >}}
| Componente | Cuándo usarlo | Ejemplo |
| :--- | :--- | :--- |
| **Button** | Acción con texto; jerarquía mediante variante. | «Guardar», «Cancelar» |
| **Icon Button** | Acción compacta y reconocible por su icono, en barras de herramientas o filas. | Buscar, cerrar, más opciones |
| **Fab** | La acción principal de la pantalla, flotando sobre el contenido. | Redactar correo, crear evento |
{{< /callout >}}

## Uso básico

Un único `<button>` con la clase de variante y `data-mtx="button"`. La librería añade el efecto ripple y gestiona el estado deshabilitado; no hay estructura interna que escribir.

{{< mtx-demo title="Uso básico" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">Guardar</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button">Vista previa</button>
<button class="mtx-button mtx-button--text" data-mtx="button">Cancelar</button>
{{< /mtx-demo >}}

{{< callout type="info" >}}
Button no tiene `data-variant`: la variante se elige con clases (`mtx-button--contained`, `--outlined`, `--text`). El color admite la clase (`mtx-button--error`) o `data-color`, el tamaño `data-size` y los iconos `data-start-icon` / `data-end-icon`.
{{< /callout >}}

## Variantes

La jerarquía visual se expresa con la variante, igual que en MUI:

- **Contained** (`mtx-button--contained`): énfasis alto, con relleno y elevación. Reservado para la acción principal; idealmente uno por bloque.
- **Outlined** (`mtx-button--outlined`): énfasis medio, para acciones secundarias importantes.
- **Text** (`mtx-button--text`): énfasis bajo, para acciones en diálogos, tarjetas o junto a un contained.

{{< mtx-demo title="Variantes" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">Contained</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button">Outlined</button>
<button class="mtx-button mtx-button--text" data-mtx="button">Text</button>
{{< /mtx-demo >}}

## Tamaños

Tres alturas canónicas con `data-size`. **Medium (40px) es el predeterminado** y mide lo mismo que un [Text Field](../text-field/) small, por lo que ambos se alinean en una misma fila.

| Tamaño | `data-size` | Altura | Se alinea con |
| :--- | :--- | :--- | :--- |
| Large | `large` | 48px | Icon Button large, Fab medium, Fab extendido |
| Medium | — (predeterminado) o `medium` | 40px | Text Field small, Icon Button medium, Fab small |
| Small | `small` | 32px | Icon Button small, Chip |

{{< mtx-demo title="Tamaños" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="large">Large · 48px</button>
<button class="mtx-button mtx-button--contained" data-mtx="button">Medium · 40px</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="small">Small · 32px</button>
{{< /mtx-demo >}}

{{< mtx-demo title="Alineación con Text Field small (40px)" >}}
<div style="width: 280px; max-width: 100%;">
  <input data-mtx="text-field" data-label="Correo electrónico" data-size="small" type="email" />
</div>
<button class="mtx-button mtx-button--contained" data-mtx="button">Suscribirme</button>
{{< /mtx-demo >}}

## Con iconos

Con `data-start-icon` y `data-end-icon` (como `startIcon` / `endIcon` de MUI) basta con el nombre de la ligadura Material: el botón genera `<span class="mtx-button__icon mtx-button__icon--start material-icons" aria-hidden="true">` antes del texto (o `--end` después). El icono es decorativo porque el texto ya nombra la acción, y se acerca 4px al borde (2px en small) como en MUI.

{{< mtx-demo title="Icono inicial y final (sintaxis simplificada)" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-start-icon="add">Nuevo</button>
<button class="mtx-button mtx-button--outlined mtx-button--error" data-mtx="button" data-start-icon="delete">Eliminar</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-end-icon="send">Enviar</button>
<a class="mtx-button mtx-button--text" data-mtx="button" href="#con-iconos" data-end-icon="arrow_forward">Siguiente</a>
{{< /mtx-demo >}}

{{< mtx-demo title="En los tres tamaños" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="large" data-start-icon="save">Large</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-start-icon="save">Medium</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="small" data-start-icon="save">Small</button>
{{< /mtx-demo >}}

Para un SVG u otra fuente de iconos, escribe el `<span class="mtx-button__icon">` a mano (añade `mtx-button__icon--start` / `--end` para el mismo desplazamiento); si ya existe un icono en ese extremo, `data-start-icon` / `data-end-icon` no lo duplican.

{{< mtx-demo title="Icono manual (BEM)" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button">
  <span class="mtx-button__icon mtx-button__icon--start material-icons" aria-hidden="true">download</span>
  Descargar
</button>
{{< /mtx-demo >}}

Con `mtx-button--icon` el botón se vuelve circular y cuadrado (48/40/32px según el tamaño). Necesita `aria-label`. Para iconos sin fondo es preferible [Icon Button](../icon-button/).

{{< mtx-demo title="Solo icono" >}}
<button class="mtx-button mtx-button--contained mtx-button--icon" data-mtx="button" data-size="large" aria-label="Favorito">
  <span class="mtx-button__icon material-icons" aria-hidden="true">star</span>
</button>
<button class="mtx-button mtx-button--contained mtx-button--icon" data-mtx="button" aria-label="Favorito">
  <span class="mtx-button__icon material-icons" aria-hidden="true">star</span>
</button>
<button class="mtx-button mtx-button--contained mtx-button--icon" data-mtx="button" data-size="small" aria-label="Favorito">
  <span class="mtx-button__icon material-icons" aria-hidden="true">star</span>
</button>
{{< /mtx-demo >}}

## Colores

Primary es el color predeterminado (no requiere clase). Los modificadores `mtx-button--secondary`, `--success`, `--error`, `--warning` e `--info` funcionan en las tres variantes.

{{< mtx-demo title="Colores" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">Primary</button>
<button class="mtx-button mtx-button--contained mtx-button--secondary" data-mtx="button">Secondary</button>
<button class="mtx-button mtx-button--contained mtx-button--success" data-mtx="button">Success</button>
<button class="mtx-button mtx-button--contained mtx-button--error" data-mtx="button">Error</button>
<button class="mtx-button mtx-button--contained mtx-button--warning" data-mtx="button">Warning</button>
<button class="mtx-button mtx-button--contained mtx-button--info" data-mtx="button">Info</button>
{{< /mtx-demo >}}

{{< mtx-demo title="Colores en outlined y text" >}}
<button class="mtx-button mtx-button--outlined mtx-button--secondary" data-mtx="button">Secondary</button>
<button class="mtx-button mtx-button--outlined mtx-button--error" data-mtx="button">Error</button>
<button class="mtx-button mtx-button--text mtx-button--success" data-mtx="button">Success</button>
<button class="mtx-button mtx-button--text mtx-button--info" data-mtx="button">Info</button>
{{< /mtx-demo >}}

`data-color` aplica el mismo modificador desde la sintaxis simplificada. Con `inherit` (`mtx-button--inherit`, como `color="inherit"` de MUI) text y outlined toman el color del contenedor: úsalo sobre superficies oscuras o de color (AppBar, banners, llamadas a la acción). En contained usa el gris neutro de MUI.

{{< mtx-demo title="Inherit sobre una superficie de color" layout="block" >}}
<div class="mtx-bg-primary mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2 mtx-p-2 mtx-rounded">
  <button class="mtx-button mtx-button--text" data-mtx="button" data-color="inherit">Más tarde</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="inherit">Ver planes</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="inherit">Empezar</button>
</div>
{{< /mtx-demo >}}

### Sobre una superficie de color

`data-surface="primary"` (o `secondary`) adapta el botón a un fondo de ese color, como una franja de llamada a la acción o una AppBar primary: contained se invierte (fondo papel con texto primary, `mtx-button--on-primary`) y text/outlined toman el color del contenedor, como `inherit`. Úsalo en lugar de `inherit` cuando el contained deba destacar sobre la franja de color. El color del texto lo fija el contenedor; el botón no lo cambia.

{{< mtx-demo title="Contained y outlined sobre una superficie primary" layout="block" >}}
<div class="mtx-bg-primary mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2 mtx-p-2 mtx-rounded">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-surface="primary">Probar gratis</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-surface="primary">Pedir demo</button>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-surface="primary">Más tarde</button>
</div>
{{< /mtx-demo >}}

### Contraste AA

Los botones cumplen WCAG AA (4.5:1) por defecto: text y outlined usan `--mtx-color-{color}-text` (texto `warning`, `info`, `success` y `error` más oscuro en claro) y contained `warning`/`info` usan texto oscuro, donde el blanco de MUI queda entre 3 y 3.9:1; el hover de los botones con texto oscuro aclara en lugar de oscurecer. Los colores de fondo son los de MUI. Para los colores exactos de MUI, añade `data-mtx-contrast="mui"` en `<html>` o en un contenedor. Ver [Contraste de color]({{< relref "/guide/accessibility#contraste-de-color" >}}).

{{< mtx-demo title="Por defecto (AA)" layout="block" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="info">Info</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-color="info">Info</button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Colores exactos de MUI (opt-out)" layout="block" >}}
<div data-mtx-contrast="mui" class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="info">Info</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-color="info">Info</button>
</div>
{{< /mtx-demo >}}

## Estados

Hover, foco visible (navegando con <kbd>Tab</kbd>) y pulsación (ripple) se aplican automáticamente. Para deshabilitar usa el atributo nativo `disabled`: atenúa el botón, lo retira del orden de tabulación y bloquea el ripple.

{{< mtx-demo title="Deshabilitado" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" disabled>Contained</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" disabled>Outlined</button>
<button class="mtx-button mtx-button--text" data-mtx="button" disabled>Text</button>
{{< /mtx-demo >}}

## Carga

Con `data-loading` el botón entra en estado de carga como `loading` de MUI: se deshabilita (`disabled`, o `aria-disabled` en `<a>`), recibe `aria-busy="true"` y muestra un [CircularProgress]({{< relref "/components/progress" >}}) decorativo de 16px con el color del texto. `data-loading-position` elige la posición: `center` (por defecto; el texto se vuelve transparente y el ancho no cambia), `start` o `end` (sustituyen el icono inicial o final, también el generado por `data-start-icon` / `data-end-icon`, sin cambiar el ancho; si no hay icono, el indicador se añade en ese lado). `data-loading-indicator` muestra un texto en lugar del spinner.

{{< mtx-demo title="Posiciones e indicador de texto" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-loading>Guardar</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-loading data-loading-position="start" data-start-icon="save">Guardar</button>
<button class="mtx-button mtx-button--text" data-mtx="button" data-loading data-loading-position="end" data-end-icon="send">Enviar</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-loading data-loading-indicator="Cargando…">Descargar</button>
{{< /mtx-demo >}}

Desde JavaScript usa `setLoading(true|false)` o la propiedad `loading`. Al terminar se restaura el estado previo: si el botón ya estaba deshabilitado, sigue deshabilitado. El botón conserva su nombre accesible; si quieres anunciar el progreso, añade tu propia región `aria-live`.

{{< mtx-demo title="Clic → 2 s cargando" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-doc-loading>Guardar</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-loading data-loading-position="start" data-start-icon="save">Guardar</button>
<span class="mtx-typography--body2" role="status" aria-live="polite" id="doc-button-loading-status"></span>
{{< /mtx-demo >}}

```javascript
const button = Materix.getInstance(el);
button.setLoading(true);
status.textContent = 'Guardando…';      // región aria-live opcional
await saveChanges();
button.setLoading(false);
status.textContent = 'Cambios guardados';
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var status = document.getElementById('doc-button-loading-status');
  document.querySelectorAll('[data-doc-loading]').forEach(function (el) {
    el.addEventListener('click', function () {
      var btn = Materix.getInstance(el);
      btn.setLoading(true);
      status.textContent = 'Guardando…';
      setTimeout(function () { btn.setLoading(false); status.textContent = 'Cambios guardados'; }, 2000);
    });
  });
});
</script>

## Ancho completo

`mtx-button--full-width` hace que el botón ocupe el 100% del contenedor (equivale a `fullWidth` de MUI).

{{< mtx-demo title="Ancho completo" layout="column" >}}
<button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button" data-size="large">Iniciar sesión</button>
<button class="mtx-button mtx-button--outlined mtx-button--full-width" data-mtx="button" data-size="large">Crear cuenta</button>
{{< /mtx-demo >}}

## Sin elevación

`mtx-button--disable-elevation` elimina la sombra de la variante contained en todos sus estados (equivale a `disableElevation` de MUI).

{{< mtx-demo title="Sin elevación" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">Con elevación</button>
<button class="mtx-button mtx-button--contained mtx-button--disable-elevation" data-mtx="button">Sin elevación</button>
{{< /mtx-demo >}}

## Mayúsculas

El texto se muestra tal como se escribe. Añade `mtx-button--uppercase` para obtener el estilo en mayúsculas característico de Material Design 2.

{{< mtx-demo title="Mayúsculas" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">Texto tal cual</button>
<button class="mtx-button mtx-button--contained mtx-button--uppercase" data-mtx="button">Mayúsculas</button>
{{< /mtx-demo >}}

## Como enlace

Si la acción navega a otra URL, usa `<a href>` con las mismas clases: conserva la semántica de enlace (abrir en otra pestaña, copiar la dirección) con apariencia de botón. Como `<a>` no admite `disabled`, el método `disable()` aplica `aria-disabled="true"`, lo saca del orden de tabulación y bloquea la navegación al hacer clic.

{{< mtx-demo title="Como enlace" >}}
<a class="mtx-button mtx-button--contained" data-mtx="button" href="#como-enlace">Ver planes</a>
<a class="mtx-button mtx-button--outlined" data-mtx="button" href="#como-enlace">Documentación</a>
{{< /mtx-demo >}}

## Casos de uso reales

Pie de un formulario: una única acción principal contained acompañada de una acción text.

{{< mtx-demo title="Pie de formulario" layout="column" >}}
<input data-mtx="text-field" data-label="Nombre del proyecto" type="text" />
<div>
  <button class="mtx-button mtx-button--text" data-mtx="button">Cancelar</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-start-icon="check">Crear proyecto</button>
</div>
{{< /mtx-demo >}}

Barra de acciones de una tabla con botones small, que se alinean con chips y filtros de 32px.

{{< mtx-demo title="Barra de acciones" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="small" data-start-icon="add">Añadir</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" data-start-icon="file_download">Exportar</button>
<button class="mtx-button mtx-button--text mtx-button--error" data-mtx="button" data-size="small">Eliminar selección</button>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR o control fino puedes escribir las clases de tamaño (`mtx-button--large`, `--medium`, `--small`) en lugar de `data-size`, y anidar el icono dentro de `mtx-button__icon`. La instancia se vincula al elemento sin modificar su estructura.

```html
<button class="mtx-button mtx-button--contained mtx-button--large" data-mtx="button" type="button">
  <span class="mtx-button__icon" aria-hidden="true">
    <span class="material-icons">save</span>
  </span>
  Guardar
</button>
```

## Uso programático

Todos los `[data-mtx="button"]` se inicializan al cargar la página. Para contenido añadido después, inicializa el elemento o el contenedor:

```javascript
// Inicializar un elemento concreto (usa data-mtx o el nombre indicado)
const button = Materix.init(element, 'button');

// Instanciar directamente
const other = new Materix.Button(element);

// Recuperar la instancia ya creada
const instance = Materix.getInstance(element);

// Inicializar todo un contenedor (idempotente)
Materix.initAll(container);

instance.disable();
instance.enable();
console.log(instance.disabled); // false
```

Con ES modules:

```javascript
import { init, getInstance, Button } from '@rubenchodev/materix-ui';

const button = new Button(document.querySelector('#save'));
button.disable();
```

{{< mtx-demo title="disable() / enable()" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-button-target">Botón controlado</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-button-disable">disable()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-button-enable">enable()</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var target = document.getElementById('doc-button-target');
  document.getElementById('doc-button-disable').addEventListener('click', function () {
    Materix.getInstance(target).disable();
  });
  document.getElementById('doc-button-enable').addEventListener('click', function () {
    Materix.getInstance(target).enable();
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `button` | — | Activa la inicialización automática. |
| `data-size` | `small` \| `medium` \| `large` | `medium` | Añade la clase `mtx-button--{size}` (32 / 40 / 48px). |
| `data-small` | booleano | — | Atajo equivalente a `data-size="small"`. |
| `data-large` | booleano | — | Atajo equivalente a `data-size="large"`. |
| `data-color` | `secondary` \| `success` \| `error` \| `warning` \| `info` \| `inherit` | `primary` | Añade la clase `mtx-button--{color}`. |
| `data-surface` | `primary` \| `secondary` | — | Añade `mtx-button--on-{surface}` para un botón colocado sobre un fondo de ese color. |
| `data-loading` | booleano | — | Activa el estado de carga al inicializar (`"false"` lo ignora). Se refleja mientras carga. |
| `data-loading-position` | `center` \| `start` \| `end` | `center` | Posición del indicador; `start`/`end` sustituyen el icono de ese lado. |
| `data-loading-indicator` | texto | — | Texto en lugar del spinner (como `loadingIndicator` de MUI). |
| `data-start-icon` | ligadura Material | — | Genera el icono inicial `mtx-button__icon--start` (como `startIcon` de MUI). No duplica uno existente. |
| `data-end-icon` | ligadura Material | — | Genera el icono final `mtx-button__icon--end` (como `endIcon` de MUI). |

Atributos nativos relevantes: `disabled` (en `<button>`), `aria-disabled="true"` (en `<a>`), `type`, `href`.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-button` | Clase base. Sin variante se comporta como text. |
| `mtx-button--contained` | Variante con relleno y elevación (énfasis alto). |
| `mtx-button--outlined` | Variante con borde (énfasis medio). |
| `mtx-button--text` | Variante de texto (énfasis bajo). |
| `mtx-button--secondary` | Color secondary. |
| `mtx-button--success` | Color success. |
| `mtx-button--error` | Color error. |
| `mtx-button--warning` | Color warning. |
| `mtx-button--info` | Color info. |
| `mtx-button--inherit` | Hereda el color del contenedor (text/outlined); contained en gris neutro. Para superficies oscuras o de color. |
| `mtx-button--on-primary` · `mtx-button--on-secondary` | Sobre una superficie primary/secondary: contained con fondo papel y el color como texto; text/outlined heredan el color del contenedor. |
| `mtx-button--large` | Altura 48px. |
| `mtx-button--medium` | Altura 40px (equivale al predeterminado). |
| `mtx-button--small` | Altura 32px. |
| `mtx-button--full-width` | Ocupa el 100% del ancho del contenedor. |
| `mtx-button--disable-elevation` | Elimina la sombra de contained en todos los estados. |
| `mtx-button--uppercase` | Muestra el texto en mayúsculas. |
| `mtx-button--icon` | Botón circular de solo icono (48/40/32px según tamaño). |
| `mtx-button__icon` | Contenedor del icono inicial o final. Material Icons a 24px nativos; un `<svg>` dentro se dibuja a 24 × 24px con `currentColor`. |
| `mtx-button__icon--start` · `mtx-button__icon--end` | Desplazamiento MUI del icono hacia el borde (−4px; −2px en small). Los genera `data-start-icon` / `data-end-icon`. |
| `mtx-button--loading` | Estado de carga (con `mtx-button--loading-{center,start,end}`). |
| `mtx-button__loading-indicator` | Contenedor del indicador (`aria-hidden`), con `--center`, `--start`, `--end` y `--text`. |
| `mtx-button__icon--loading-hidden` | Oculta el icono sustituido por el indicador. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `disable()` | `void` | Deshabilita: `disabled` en `<button>`; `aria-disabled="true"` y `tabindex="-1"` en `<a>`. |
| `enable()` | `void` | Revierte `disable()`. |
| `disabled` (getter) | `boolean` | `true` si tiene `disabled` o `aria-disabled="true"`. |
| `destroy()` | `void` | Elimina los listeners de ripple y de bloqueo de clic. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |
| `setLoading(bool)` | instancia | Activa o desactiva la carga: `disabled`/`aria-disabled`, `aria-busy="true"` e indicador. Al desactivarla restaura el `disabled` previo. |
| `loading` (getter/setter) | `boolean` | Estado de carga actual; asignarlo equivale a `setLoading()`. |

### Eventos

Button no emite eventos propios. Escucha el evento nativo `click` del elemento.

### Variables CSS

| Variable | Uso en Button |
| :--- | :--- |
| `--mtx-color-{primary,secondary,success,error,warning,info}` | Fondo en contained. |
| `--mtx-color-{color}-text` | Texto y borde en outlined y text (AA por defecto; el color principal con `data-mtx-contrast="mui"`). |
| `--mtx-color-{color}-dark` | Fondo en hover de contained. |
| `--mtx-color-{color}-contrast` | Texto sobre contained. |
| `--mtx-color-action-disabled`, `--mtx-color-action-disabled-background` | Texto, borde y fondo deshabilitados. |
| `--mtx-size-large-height`, `--mtx-size-medium-height`, `--mtx-size-small-height` | Alturas 48 / 40 / 32px. |
| `--mtx-shape-radius` | Radio de esquina (4px). |
| `--mtx-type-button` | Tipografía del texto. |
| `--mtx-elevation-2`, `-4`, `-6`, `-8` | Sombras de contained (reposo, hover, foco, pulsado). |
| `--mtx-duration-shorter`, `--mtx-easing-standard` | Transiciones. |
| `--mtx-btn-bg`, `--mtx-btn-hover`, `--mtx-btn-fg`, `--mtx-btn-color` | Variables locales del componente; sobrescríbelas en un botón concreto para un color personalizado. |

## Accesibilidad

- Usa siempre `<button>` para acciones y `<a href>` para navegación; no uses `<div role="button">`.
- Los botones de solo icono (`mtx-button--icon`) necesitan `aria-label`. Los iconos junto a texto llevan `aria-hidden="true"` (los generados por `data-start-icon` / `data-end-icon` también).
- `disabled` retira el botón del orden de tabulación. En enlaces, `disable()` aplica `aria-disabled="true"` y `tabindex="-1"`, y bloquea el clic.
- En carga, el botón queda deshabilitado con `aria-busy="true"` y conserva su nombre accesible (en `center` el texto solo se vuelve transparente). El indicador es `aria-hidden`; para anunciar el progreso usa una región `aria-live` propia.
- El ripple respeta `prefers-reduced-motion`.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco al botón siguiente / anterior. |
| <kbd>Enter</kbd> | Activa el botón o sigue el enlace. |
| <kbd>Espacio</kbd> | Activa el botón (`<button>`). |
