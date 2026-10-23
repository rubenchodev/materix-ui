---
title: "Button Group"
description: "Agrupa botones relacionados en una sola pieza con bordes unidos, separadores y la variante, tamaño y color heredados."
group: "inputs"
icon: "view_week"
weight: 15
example: "button-group"
mui: "https://mui.com/material-ui/react-button-group/"
---

**Button Group** une varios [Button]({{< relref "/components/button" >}}) relacionados en una sola pieza: bordes compartidos, separadores entre botones y una única variante, tamaño y color. Úsalo para acciones hermanas (copiar / cortar / pegar, anterior / siguiente) o para el patrón *split button*. Si los botones representan una **selección** (alineación activa, vista de lista o cuadrícula), usa [Toggle Button]({{< relref "/components/toggle-button" >}}), que gestiona el estado pulsado.

## Uso básico

Un contenedor con `data-mtx="button-group"` y botones simples dentro: el grupo los convierte en Button, les aplica su variante (`outlined` por defecto) y añade `role="group"`. Dale nombre accesible con `data-label` o `aria-label`.

{{< mtx-demo title="Sintaxis simplificada" >}}
<div data-mtx="button-group" data-variant="contained" data-label="Acciones básicas">
  <button>Uno</button>
  <button>Dos</button>
  <button>Tres</button>
</div>
{{< /mtx-demo >}}

## Variantes

`data-variant="outlined|contained|text"`, como en MUI. **Outlined** solapa los bordes 1px; **contained** separa con el tono oscuro del color y mueve la elevación al grupo; **text** separa con una línea del color al 50 %.

{{< mtx-demo title="outlined, contained y text" layout="column" >}}
<div data-mtx="button-group" data-label="Outlined"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-variant="contained" data-label="Contained"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-variant="text" data-label="Text"><button>Uno</button><button>Dos</button><button>Tres</button></div>
{{< /mtx-demo >}}

## Tamaños

`data-size="small|medium|large"` se hereda en todos los botones: 32, 40 (predeterminado) y 48px, las mismas alturas que IconButton y TextField.

{{< mtx-demo title="large, medium y small" layout="column" >}}
<div data-mtx="button-group" data-size="large" data-label="Grande"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-label="Mediano"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-size="small" data-label="Pequeño"><button>Uno</button><button>Dos</button><button>Tres</button></div>
{{< /mtx-demo >}}

## Con iconos

Cada hijo admite los atributos de Button (`data-start-icon`, `data-end-icon`). Para botones de solo icono usa un `.material-icons` directo con `aria-hidden="true"` y pon `aria-label` en el botón: el grupo compacta su padding.

{{< mtx-demo title="Icono inicial, final y solo icono" layout="column" >}}
<div data-mtx="button-group" data-variant="contained" data-label="Portapapeles">
  <button data-start-icon="content_copy">Copiar</button>
  <button data-start-icon="content_cut">Cortar</button>
  <button data-start-icon="content_paste">Pegar</button>
</div>
<div data-mtx="button-group" data-label="Navegación">
  <button data-start-icon="arrow_back">Anterior</button>
  <button data-end-icon="arrow_forward">Siguiente</button>
</div>
<div data-mtx="button-group" data-label="Alineación del texto">
  <button aria-label="Alinear a la izquierda"><span class="material-icons" aria-hidden="true">format_align_left</span></button>
  <button aria-label="Centrar"><span class="material-icons" aria-hidden="true">format_align_center</span></button>
  <button aria-label="Alinear a la derecha"><span class="material-icons" aria-hidden="true">format_align_right</span></button>
</div>
{{< /mtx-demo >}}

## Colores

`data-color` acepta `primary` (predeterminado), `secondary`, `success`, `error`, `warning`, `info` e `inherit`. Un hijo con su propio `data-color` o clase de color la conserva.

{{< mtx-demo title="Colores de la paleta" layout="column" >}}
<div data-mtx="button-group" data-variant="contained" data-color="secondary" data-label="Secundario"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-color="success" data-label="Éxito"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-variant="text" data-color="error" data-label="Error"><button>Uno</button><button>Dos</button><button>Tres</button></div>
{{< /mtx-demo >}}

## Orientación

`data-orientation="vertical"` apila los botones. No añade `aria-orientation`: ese atributo no está permitido en `role="group"` (solo se añade si declaras tú `role="toolbar"`).

{{< mtx-demo title="Vertical" >}}
<div data-mtx="button-group" data-orientation="vertical" data-label="Vertical outlined"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-orientation="vertical" data-variant="contained" data-label="Vertical contained"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-orientation="vertical" data-variant="text" data-label="Vertical text"><button>Uno</button><button>Dos</button><button>Tres</button></div>
{{< /mtx-demo >}}

## Ancho completo

`data-full-width` ocupa todo el ancho del contenedor y reparte el espacio por igual entre los botones.

{{< mtx-demo title="data-full-width" layout="block" >}}
<div data-mtx="button-group" data-full-width data-variant="contained" data-label="Ancho completo"><button>Uno</button><button>Dos</button><button>Tres</button></div>
{{< /mtx-demo >}}

## Estados

Hover y foco se ven al pasar el cursor o con <kbd>Tab</kbd>: el botón activo se dibuja por encima de los bordes vecinos. `data-disabled` deshabilita todo el grupo (y `enable()` restaura solo los botones que deshabilitó el grupo); un hijo puede deshabilitarse por separado. `data-disable-elevation` quita la sombra del grupo contained.

{{< mtx-demo title="Deshabilitado y sin elevación" layout="column" >}}
<div data-mtx="button-group" data-variant="contained" data-disabled data-label="Grupo deshabilitado"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-variant="contained" data-label="Un hijo deshabilitado"><button>Uno</button><button disabled>Dos</button><button>Tres</button></div>
<div data-mtx="button-group" data-variant="contained" data-disable-elevation data-label="Sin elevación"><button>Uno</button><button>Dos</button></div>
{{< /mtx-demo >}}

## Split button

Patrón de MUI: la acción principal y una flecha que abre un [Menu]({{< relref "/components/menu" >}}) con `data-open-menu="#id"`. El menú gestiona `aria-haspopup`, `aria-expanded`, `aria-controls`, el teclado y el cierre; al elegir una opción (`mtx:menu:select`) actualiza el texto de la acción principal. Los ítems `role="menuitemradio"` muestran la opción activa. Con `data-position-anchor="#id-del-grupo"` en el menú, este se ancla al **grupo completo** (como MUI) y no solo a la flecha; el foco vuelve igualmente a la flecha al cerrar.

{{< mtx-demo title="Split button con Menu" height="240px" >}}
<div data-mtx="button-group" data-variant="contained" data-label="Fusionar pull request" id="doc-split-group">
  <button id="doc-split-main">Squash and merge</button>
  <button aria-label="Elegir estrategia de fusión" data-open-menu="#doc-split-menu">
    <span class="material-icons" aria-hidden="true">arrow_drop_down</span>
  </button>
</div>
<div data-mtx="menu" id="doc-split-menu" data-position-anchor="#doc-split-group">
  <div data-mtx="menu-item" role="menuitemradio" data-value="Create a merge commit">Create a merge commit</div>
  <div data-mtx="menu-item" role="menuitemradio" data-value="Squash and merge" data-checked>Squash and merge</div>
  <div data-mtx="menu-item" role="menuitemradio" data-value="Rebase and merge" data-disabled>Rebase and merge</div>
</div>
{{< /mtx-demo >}}

```javascript
document.getElementById('doc-split-menu').addEventListener('mtx:menu:select', (event) => {
  document.getElementById('doc-split-main').textContent = event.detail.item.dataset.value;
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('doc-split-menu').addEventListener('mtx:menu:select', function (event) {
    document.getElementById('doc-split-main').textContent = event.detail.item.getAttribute('data-value');
  });
});
</script>

## Casos de uso reales

### Barra de herramientas del editor

{{< mtx-demo title="Formato y deshacer" >}}
<div data-mtx="button-group" data-size="small" data-label="Historial">
  <button aria-label="Deshacer"><span class="material-icons" aria-hidden="true">undo</span></button>
  <button aria-label="Rehacer"><span class="material-icons" aria-hidden="true">redo</span></button>
</div>
<div data-mtx="button-group" data-size="small" data-label="Formato de texto">
  <button aria-label="Negrita"><span class="material-icons" aria-hidden="true">format_bold</span></button>
  <button aria-label="Cursiva"><span class="material-icons" aria-hidden="true">format_italic</span></button>
  <button aria-label="Subrayado"><span class="material-icons" aria-hidden="true">format_underlined</span></button>
</div>
<div data-mtx="button-group" data-size="small" data-variant="contained" data-disable-elevation data-label="Publicar">
  <button data-start-icon="publish">Publicar</button>
</div>
{{< /mtx-demo >}}

### Paginación de una tabla

{{< mtx-demo title="Anterior / siguiente" >}}
<div data-mtx="button-group" data-label="Paginación de resultados">
  <button data-start-icon="chevron_left" disabled>Anterior</button>
  <button data-end-icon="chevron_right">Siguiente</button>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Estructura para SSR: el grupo con sus clases y los Button ya marcados. Las clases de posición `mtx-button-group__first|middle|last` las calcula el JavaScript (también en `refresh()`).

```html
<div class="mtx-button-group mtx-button-group--contained mtx-button-group--horizontal"
     role="group" aria-label="Formato" data-mtx="button-group">
  <button type="button" class="mtx-button mtx-button--contained" data-mtx="button">Negrita</button>
  <button type="button" class="mtx-button mtx-button--contained" data-mtx="button">Cursiva</button>
  <button type="button" class="mtx-button mtx-button--contained" data-mtx="button">Subrayado</button>
</div>
```

## Uso programático

Los `[data-mtx="button-group"]` se inicializan solos; para contenido dinámico usa `Materix.init(el)` o `new Materix.ButtonGroup(el)`.

```javascript
// UMD (window.Materix)
const group = Materix.getInstance(document.querySelector('#acciones'));
group.disable();            // deshabilita todos los botones
group.enable();             // restaura solo los que deshabilitó el grupo

const extra = document.createElement('button');
extra.textContent = 'Cuatro';
group.element.appendChild(extra);
group.refresh();            // aplica variante/tamaño/color y recalcula bordes
```

```javascript
// ES modules
import { ButtonGroup } from '@rubenchodev/materix-ui';

const group = new ButtonGroup(document.querySelector('#acciones'));
console.log(group.buttons.length, group.disabled);
```

{{< mtx-demo title="disable() / enable()" >}}
<div data-mtx="button-group" id="doc-group-api" data-label="Grupo programático"><button>Uno</button><button>Dos</button><button>Tres</button></div>
<button class="mtx-button mtx-button--text" data-mtx="button" id="doc-group-toggle">Alternar disabled</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var group = Materix.getInstance(document.getElementById('doc-group-api'));
  document.getElementById('doc-group-toggle').addEventListener('click', function () {
    if (group.disabled) group.enable(); else group.disable();
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `button-group` | — | Inicializa el componente. |
| `data-variant` | `outlined`, `contained`, `text` | `outlined` | Variante heredada por los botones sin variante propia. |
| `data-size` | `small`, `medium`, `large` | `medium` | Tamaño heredado (32 / 40 / 48px). |
| `data-color` | `primary`, `secondary`, `success`, `error`, `warning`, `info`, `inherit` | `primary` | Color heredado por los botones sin color propio. |
| `data-orientation` | `horizontal`, `vertical` | `horizontal` | Dirección del grupo. |
| `data-full-width` | booleano | — | Ocupa todo el ancho y reparte el espacio. |
| `data-disable-elevation` | booleano | — | Sin sombra en contained. |
| `data-disabled` | booleano | — | Deshabilita todos los botones al iniciar. |
| `data-label` | texto | — | Nombre accesible (`aria-label`) del grupo. |

En los hijos siguen disponibles todos los atributos de [Button]({{< relref "/components/button" >}}) (`data-start-icon`, `data-end-icon`, `data-color`, `data-size`, `data-loading`…), que tienen prioridad sobre los del grupo.

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-button-group` | Contenedor flex en línea con radio de 4px. |
| `.mtx-button-group--outlined` / `--contained` / `--text` | Variante del grupo (bordes y separadores). |
| `.mtx-button-group--horizontal` / `--vertical` | Orientación. |
| `.mtx-button-group--full-width` | Ancho completo. |
| `.mtx-button-group--disable-elevation` | Sin elevación. |
| `.mtx-button-group--disabled` | Grupo deshabilitado. |
| `.mtx-button-group--{color}` / `--small` / `--large` | Color y tamaño declarados en el grupo. |
| `.mtx-button-group__grouped` | Cada botón del grupo. |
| `.mtx-button-group__first` / `__middle` / `__last` | Posición del botón (esquinas y separadores). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `disable()` | `this` | Deshabilita todos los botones y marca `aria-disabled` en el grupo. |
| `enable()` | `this` | Habilita los botones que deshabilitó el grupo; los deshabilitados por el autor siguen así. |
| `refresh()` | `this` | Prepara los botones añadidos o quitados y recalcula sus posiciones. |
| `disabled` | `boolean` | Getter: `true` si el grupo está deshabilitado. |
| `buttons` | `HTMLElement[]` | Getter: botones directos del grupo. |
| `destroy()` | `void` | Libera la instancia. |

### Variables CSS

El grupo reutiliza las variables de Button: el separador contained usa `--mtx-btn-hover` (tono oscuro del color) y el de text `--mtx-btn-color` al 50 %. La elevación usa `--mtx-elevation-2`.

## Accesibilidad

- El contenedor recibe `role="group"` (salvo que ya tenga un rol o sea `<fieldset>`); nómbralo con `data-label` o `aria-label` para que el lector anuncie el propósito del conjunto.
- Cada hijo es un `<button>` nativo (o `<a>`): el orden de tabulación es el natural, sin *roving tabindex*. <kbd>Tab</kbd> recorre los botones y <kbd>Enter</kbd> / <kbd>Espacio</kbd> los activan.
- En vertical se mantiene `role="group"` sin `aria-orientation` (no permitido en ese rol, como en MUI). Si declaras `role="toolbar"` e implementas la navegación con flechas, el grupo añade `aria-orientation="vertical"`.
- Los botones de solo icono necesitan `aria-label`; el icono, `aria-hidden="true"`.
- `disable()` usa el `disabled` nativo (o `aria-disabled` en enlaces) y marca `aria-disabled="true"` en el grupo.
- En el split button, la flecha recibe `aria-haspopup="menu"`, `aria-controls` y `aria-expanded` del Menu, y el foco vuelve a ella al cerrar el menú.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco entre los botones del grupo. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa el botón enfocado (en la flecha del split button, abre el menú). |
| <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>Escape</kbd> | Dentro del menú del split button: navegar y cerrar. |
