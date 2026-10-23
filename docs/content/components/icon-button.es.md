---
title: "Icon Button"
description: "Botón circular de solo icono para acciones compactas en barras de herramientas, tarjetas y filas de tabla. Siempre con aria-label."
group: "inputs"
icon: "ads_click"
weight: 20
example: "icon-button"
mui: "https://mui.com/material-ui/react-button/#icon-button"
---

**Icon Button** ejecuta una acción representada únicamente por un icono reconocible: buscar, cerrar, compartir, abrir un menú. Es la opción adecuada en barras de herramientas, cabeceras de tarjetas y acciones por fila, donde el espacio es limitado. Si el icono no es inequívoco, usa un [Button](../button/) con texto; si es la acción principal de la pantalla, usa un [Fab](../fab/).

{{< callout type="warning" title="aria-label obligatorio" >}}
Un Icon Button no tiene texto visible: sin `aria-label` (o `aria-labelledby`) los lectores de pantalla solo anunciarían «botón». Describe la acción, no el icono: «Eliminar factura», no «papelera».
{{< /callout >}}

## Uso básico

Un `<button>` vacío con `data-mtx="icon-button"` y `data-icon`. La librería añade la clase `mtx-icon-button`, inyecta el icono de Material Icons (24px, con `aria-hidden="true"`) y el ripple centrado.

{{< mtx-demo title="Uso básico" >}}
<button data-mtx="icon-button" data-icon="search" aria-label="Buscar"></button>
<button data-mtx="icon-button" data-icon="favorite" data-color="error" aria-label="Añadir a favoritos"></button>
<button data-mtx="icon-button" data-icon="share" data-color="primary" aria-label="Compartir"></button>
<button data-mtx="icon-button" data-icon="delete" aria-label="Eliminar"></button>
{{< /mtx-demo >}}

## Tamaños

Tres tamaños con `data-size`. El icono conserva siempre su rejilla nativa de 24px (nunca se reescala); lo que cambia es el área táctil.

| Tamaño | `data-size` | Área | Se alinea con |
| :--- | :--- | :--- | :--- |
| Large | `large` | 48px | Button large, Fab medium |
| Medium | — (predeterminado) | 40px | Button medium, Text Field small |
| Small | `small` | 32px | Button small, Chip |

{{< mtx-demo title="Tamaños" >}}
<button data-mtx="icon-button" data-icon="edit" data-size="large" aria-label="Editar (grande)"></button>
<button data-mtx="icon-button" data-icon="edit" aria-label="Editar"></button>
<button data-mtx="icon-button" data-icon="edit" data-size="small" aria-label="Editar (pequeño)"></button>
{{< /mtx-demo >}}

{{< mtx-demo title="Alineación con Text Field small y Button (40px)" >}}
<div style="width: 280px; max-width: 100%;">
  <input data-mtx="text-field" data-label="Buscar archivos" data-size="small" type="search" />
</div>
<button data-mtx="icon-button" data-icon="filter_list" aria-label="Filtrar"></button>
<button class="mtx-button mtx-button--outlined" data-mtx="button">Subir</button>
{{< /mtx-demo >}}

## Iconos

Puedes indicar el icono con `data-icon` o escribirlo dentro del botón (útil para Material Symbols u otra familia). Si el botón ya tiene contenido, `data-icon` se ignora.

{{< mtx-demo title="data-icon e icono anidado" >}}
<button data-mtx="icon-button" data-icon="print" aria-label="Imprimir"></button>
<button data-mtx="icon-button" aria-label="Descargar">
  <span class="material-icons" aria-hidden="true">download</span>
</button>
<a href="#iconos" data-mtx="icon-button" data-icon="open_in_new" aria-label="Abrir en otra pestaña"></a>
{{< /mtx-demo >}}

Un `<svg>` dentro del botón se dibuja a 24 × 24px con `currentColor` (cuadrícula nativa de MUI). Como `<a>`, el botón no se subraya.

{{< mtx-demo title="Icono SVG" >}}
<button data-mtx="icon-button" aria-label="GitHub">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
</button>
{{< /mtx-demo >}}

## Colores

Sin `data-color` el icono usa el gris de acción activa (`--mtx-color-action-active`), como en MUI. `data-color` acepta cualquier color de la paleta o `inherit` para heredar el color del texto que lo rodea.

{{< mtx-demo title="Colores" >}}
<button data-mtx="icon-button" data-icon="star" aria-label="Predeterminado"></button>
<button data-mtx="icon-button" data-icon="star" data-color="primary" aria-label="Primary"></button>
<button data-mtx="icon-button" data-icon="star" data-color="secondary" aria-label="Secondary"></button>
<button data-mtx="icon-button" data-icon="star" data-color="success" aria-label="Success"></button>
<button data-mtx="icon-button" data-icon="star" data-color="error" aria-label="Error"></button>
<button data-mtx="icon-button" data-icon="star" data-color="warning" aria-label="Warning"></button>
<button data-mtx="icon-button" data-icon="star" data-color="info" aria-label="Info"></button>
{{< /mtx-demo >}}

`data-color="inherit"` es la opción para superficies oscuras o de color (AppBar, banners): el icono toma el color del contenedor.

{{< mtx-demo title="Inherit sobre una superficie de color" layout="block" >}}
<div class="mtx-bg-primary mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2 mtx-p-2 mtx-rounded">
  <button data-mtx="icon-button" data-icon="menu" data-color="inherit" aria-label="Abrir menú"></button>
  <span class="mtx-flex-1">Panel</span>
  <button data-mtx="icon-button" data-icon="search" data-color="inherit" aria-label="Buscar"></button>
</div>
{{< /mtx-demo >}}

## Estados

Hover muestra un fondo sutil, el foco con teclado un anillo del color primario y la pulsación un ripple centrado. Deshabilita con el atributo nativo `disabled`.

{{< mtx-demo title="Habilitado y deshabilitado" >}}
<button data-mtx="icon-button" data-icon="lock_open" aria-label="Desbloquear"></button>
<button data-mtx="icon-button" data-icon="lock" aria-label="Bloqueado" disabled></button>
<button data-mtx="icon-button" data-icon="lock" data-color="primary" aria-label="Bloqueado (primary)" disabled></button>
{{< /mtx-demo >}}

## Posición de borde

`data-edge="start|end"` (o las clases `mtx-icon-button--edge-start` y `mtx-icon-button--edge-end`) aplican un margen negativo de 12px para que el glifo quede alineado ópticamente con el borde del contenido, como el prop `edge` de MUI. Úsalos en el primer o último elemento de una barra.

{{< mtx-demo title="edge-start" >}}
<button data-mtx="icon-button" data-icon="menu" data-edge="start" aria-label="Abrir menú"></button>
<span>Bandeja de entrada</span>
{{< /mtx-demo >}}

## Con badge

Envuelve el Icon Button en un [Badge](../badge/) para mostrar contadores. Incluye el número en el `aria-label`. El botón no recorta su contenido (el ripple se recorta en un contenedor interno), así que el badge también puede ir dentro del botón.

{{< mtx-demo title="Con badge" >}}
<div data-mtx="badge" data-content="4" data-color="error">
  <button data-mtx="icon-button" data-icon="notifications" aria-label="Notificaciones: 4 sin leer"></button>
</div>
{{< /mtx-demo >}}

## Con tooltip

Un icono solo no siempre se explica por sí mismo. Añade `data-mtx-tooltip` para mostrar su nombre al pasar el cursor, al enfocar con teclado o con una pulsación larga (consulta [Tooltip](../tooltip/)); sin inicialización. Si el botón no tiene `aria-label`, el texto del tooltip pasa a ser su nombre accesible; si ya lo tiene, el tooltip se enlaza como descripción (`aria-describedby`).

{{< mtx-demo title="data-mtx-tooltip" >}}
<button data-mtx="icon-button" data-icon="delete" data-mtx-tooltip="Eliminar"></button>
<button data-mtx="icon-button" data-icon="archive" aria-label="Archivar" data-mtx-tooltip="Archivar (E)"></button>
<button data-mtx="icon-button" data-icon="more_vert" data-mtx-tooltip="Más opciones" data-tooltip-placement="top" data-tooltip-arrow></button>
{{< /mtx-demo >}}

{{< callout type="tip" title="Recomendado en botones de solo icono" >}}
MUI recomienda acompañar todo botón de solo icono con un Tooltip. Con Materix es un atributo: `data-mtx-tooltip="Acción"`. Un botón deshabilitado no recibe eventos de puntero: envuélvelo en `<span data-mtx="tooltip" data-title="…">`.
{{< /callout >}}

## Casos de uso reales

Barra de formato de un editor: un grupo de Icon Button small con `role="toolbar"`.

{{< mtx-demo title="Barra de herramientas" >}}
<div role="toolbar" aria-label="Formato de texto">
  <button data-mtx="icon-button" data-icon="format_bold" data-size="small" aria-label="Negrita"></button>
  <button data-mtx="icon-button" data-icon="format_italic" data-size="small" aria-label="Cursiva"></button>
  <button data-mtx="icon-button" data-icon="format_underlined" data-size="small" aria-label="Subrayado"></button>
  <button data-mtx="icon-button" data-icon="link" data-size="small" aria-label="Insertar enlace"></button>
</div>
{{< /mtx-demo >}}

Acciones de un elemento de una lista: cada `aria-label` nombra también el objeto.

{{< mtx-demo title="Acciones por elemento" >}}
<span>informe-trimestral.pdf</span>
<button data-mtx="icon-button" data-icon="download" aria-label="Descargar informe-trimestral.pdf"></button>
<button data-mtx="icon-button" data-icon="delete" data-color="error" aria-label="Eliminar informe-trimestral.pdf"></button>
{{< /mtx-demo >}}

## Sintaxis BEM completa

La estructura extendida escribe la clase base, los modificadores y el icono anidado. Útil para SSR o plantillas.

```html
<button class="mtx-icon-button mtx-icon-button--large mtx-icon-button--primary"
        data-mtx="icon-button" type="button" aria-label="Editar">
  <span class="material-icons" aria-hidden="true">edit</span>
</button>
```

## Uso programático

```javascript
// Inicializar un elemento creado dinámicamente
const el = document.createElement('button');
el.setAttribute('data-icon', 'bookmark');
el.setAttribute('aria-label', 'Guardar en marcadores');
toolbar.appendChild(el);
const iconButton = Materix.init(el, 'icon-button');

// Instanciar directamente o recuperar una instancia existente
const other = new Materix.IconButton(element);
const instance = Materix.getInstance(element);

instance.disable();
instance.enable();
```

Con ES modules:

```javascript
import { init, getInstance, IconButton } from 'materix-ui';
```

{{< mtx-demo title="disable() / enable()" >}}
<button data-mtx="icon-button" data-icon="favorite" data-color="error" aria-label="Me gusta" id="doc-icon-button-target"></button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-icon-button-disable">disable()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-icon-button-enable">enable()</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var target = document.getElementById('doc-icon-button-target');
  document.getElementById('doc-icon-button-disable').addEventListener('click', function () {
    Materix.getInstance(target).disable();
  });
  document.getElementById('doc-icon-button-enable').addEventListener('click', function () {
    Materix.getInstance(target).enable();
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `icon-button` | — | Activa la inicialización automática. |
| `data-icon` | nombre de Material Icons | — | Inyecta `<span class="material-icons" aria-hidden="true">` si el botón está vacío. |
| `data-size` | `small` \| `large` | medium (40px) | Añade `mtx-icon-button--{size}` (32 / 48px). |
| `data-color` | `primary` \| `secondary` \| `success` \| `error` \| `warning` \| `info` \| `inherit` | gris de acción | Añade `mtx-icon-button--{color}`. `inherit` toma el color del contenedor (superficies oscuras). |
| `data-edge` | `start` \| `end` | — | Añade `mtx-icon-button--edge-{edge}` (margen negativo de 12px). |

Atributos nativos: `aria-label` (obligatorio), `disabled`, `type`.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-icon-button` | Clase base: círculo de 40px con icono de 24px (también `<svg>` a 24px). No recorta su contenido; como `<a>` no se subraya. La añade el JS si falta. |
| `mtx-icon-button--small` | Área de 32px. |
| `mtx-icon-button--large` | Área de 48px. |
| `mtx-icon-button--primary`, `--secondary`, `--success`, `--error`, `--warning`, `--info` | Color del icono. |
| `mtx-icon-button--inherit` | Hereda el color del contenedor. |
| `mtx-icon-button--edge-start` | Margen izquierdo de -12px. |
| `mtx-icon-button--edge-end` | Margen derecho de -12px. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `disable()` | `void` | Aplica el atributo nativo `disabled`. |
| `enable()` | `void` | Retira `disabled`. |
| `disabled` (getter) | `boolean` | Estado deshabilitado del `<button>`. |
| `destroy()` | `void` | Elimina el listener de ripple. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

Icon Button no emite eventos propios. Escucha el `click` nativo.

### Variables CSS

| Variable | Uso en Icon Button |
| :--- | :--- |
| `--mtx-color-action-active` | Color predeterminado del icono. |
| `--mtx-color-action-hover` | Fondo en hover. |
| `--mtx-color-action-selected` | Fondo al pulsar. |
| `--mtx-color-action-disabled` | Icono deshabilitado. |
| `--mtx-color-{primary,secondary,success,error,warning,info}` | Colores de `data-color`. |
| `--mtx-size-large-height`, `--mtx-size-medium-height`, `--mtx-size-small-height` | Áreas 48 / 40 / 32px. |
| `--mtx-shape-full` | Forma circular. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-ic-color` | Variable local con el color del icono; sobrescríbela para un color personalizado. |

## Accesibilidad

- Es un `<button>` nativo: se enfoca y activa con teclado sin JavaScript adicional.
- `aria-label` es obligatorio; el icono generado lleva `aria-hidden="true"`.
- Para botones que alternan un estado (favorito, negrita) añade `aria-pressed="true|false"` y actualízalo en tu código.
- El anillo de foco usa `--mtx-focus-ring-color` y solo aparece con navegación por teclado (`:focus-visible`).

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco al siguiente / anterior. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa la acción. |
