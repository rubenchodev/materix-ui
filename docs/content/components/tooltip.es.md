---
title: "Tooltip"
description: "Etiqueta informativa breve que aparece en hover, foco de teclado o pulsación larga. Añade data-mtx-tooltip a cualquier elemento: sin inicialización."
group: "data-display"
icon: "info"
weight: 80
example: "tooltip"
mui: "https://mui.com/material-ui/react-tooltip/"
---

Un **Tooltip** muestra una etiqueta de texto breve que identifica o explica un elemento cuando el usuario pasa el cursor, lo enfoca con el teclado o mantiene pulsado en una pantalla táctil, igual que el `Tooltip` de MUI. Es ideal para botones de solo icono y barras de herramientas. No pongas en él información imprescindible ni contenido interactivo (enlaces, botones): para contenido rico usa un [Popover](../popover/) y para mensajes persistentes un texto de ayuda o un [Alert](../alert/).

## Uso básico

Añade `data-mtx-tooltip="Texto"` a cualquier elemento. No hay nada que inicializar: un único listener global (delegación de eventos en `document`) atiende a todos los disparadores, incluido el contenido añadido después.

{{< mtx-demo title="data-mtx-tooltip" >}}
<button data-mtx="icon-button" data-icon="delete" data-mtx-tooltip="Eliminar"></button>
<button data-mtx="icon-button" data-icon="favorite" data-color="error" data-mtx-tooltip="Añadir a favoritos"></button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-tooltip="Se guarda en tu cuenta">Guardar</button>
{{< /mtx-demo >}}

{{< callout type="tip" title="Nombre accesible incluido" >}}
Si el disparador no tiene nombre accesible (botón de solo icono sin `aria-label`), el texto se aplica como su `aria-label`. Si ya lo tiene, el tooltip se enlaza con `aria-describedby` mientras está visible. Consulta [Accesibilidad](#accesibilidad).
{{< /callout >}}

## Colocación

`data-tooltip-placement` admite 12 posiciones: `top`, `bottom`, `left`, `right`, cada una con `-start` o `-end` opcional. Por defecto `bottom`, como MUI. Si no cabe, voltea al lado opuesto y se desplaza para no salir del viewport.

{{< mtx-demo title="Colocaciones" layout="column" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="top-start" data-tooltip-placement="top-start">top-start</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="top" data-tooltip-placement="top">top</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="top-end" data-tooltip-placement="top-end">top-end</button>
</div>
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="left" data-tooltip-placement="left">left</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="right" data-tooltip-placement="right">right</button>
</div>
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="bottom-start" data-tooltip-placement="bottom-start">bottom-start</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="bottom" data-tooltip-placement="bottom">bottom</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="bottom-end" data-tooltip-placement="bottom-end">bottom-end</button>
</div>
{{< /mtx-demo >}}

En documentos de derecha a izquierda (`dir="rtl"`), `-start` y `-end` de `top`/`bottom` se reflejan, como en el Popper de MUI.

## Flecha

`data-tooltip-arrow` añade una flecha que apunta al centro del disparador, incluso cuando el tooltip se ha desplazado para caber.

{{< mtx-demo title="data-tooltip-arrow" >}}
<button data-mtx="icon-button" data-icon="add" data-mtx-tooltip="Añadir" data-tooltip-arrow></button>
<button data-mtx="icon-button" data-icon="edit" data-mtx-tooltip="Editar" data-tooltip-arrow data-tooltip-placement="top"></button>
<button data-mtx="icon-button" data-icon="arrow_back" data-mtx-tooltip="Atrás" data-tooltip-arrow data-tooltip-placement="left"></button>
<button data-mtx="icon-button" data-icon="arrow_forward" data-mtx-tooltip="Siguiente" data-tooltip-arrow data-tooltip-placement="right"></button>
{{< /mtx-demo >}}

## Con iconos

Funciona en botones de texto, botones con icono inicial o final y, sobre todo, en botones de solo icono (IconButton, Fab), donde además aporta el nombre accesible.

{{< mtx-demo title="Con y sin iconos" >}}
<button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-tooltip="Descarta los cambios">Cancelar</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="upload" data-mtx-tooltip="PDF o PNG, máximo 5 MB">Subir</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-end-icon="send" data-mtx-tooltip="Se enviará a 3 destinatarios">Enviar</button>
<button data-mtx="icon-button" data-icon="share" data-mtx-tooltip="Compartir"></button>
<button data-mtx="fab" data-icon="add" data-size="small" data-mtx-tooltip="Nuevo documento" data-tooltip-placement="right"></button>
{{< /mtx-demo >}}

## Estados

Los elementos deshabilitados no reciben eventos de puntero ni foco. Como recomienda MUI, envuélvelos en un elemento con `data-mtx="tooltip"` y `data-title` para seguir explicando por qué no están disponibles.

{{< mtx-demo title="Disparador deshabilitado" >}}
<span data-mtx="tooltip" data-title="Completa los campos obligatorios para continuar">
  <button class="mtx-button mtx-button--contained" data-mtx="button" disabled>Continuar</button>
</span>
<span data-mtx="tooltip" data-title="No tienes permisos para eliminar">
  <button data-mtx="icon-button" data-icon="delete" aria-label="Eliminar" disabled></button>
</span>
{{< /mtx-demo >}}

Un `data-mtx-tooltip=""` vacío no muestra nada (útil para desactivarlo temporalmente).

## Retardos

Aparece a los 100 ms (el `enterDelay` de MUI) y se oculta en cuanto sale el puntero. Cambia ambos con `data-tooltip-enter-delay` y `data-tooltip-leave-delay` (ms). Tras cerrarse uno, el siguiente se abre sin retardo durante 800 ms, así recorrer una barra de herramientas resulta inmediato.

{{< mtx-demo title="Retardos" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="Aparece a los 100 ms">Por defecto</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="Aparece a los 500 ms" data-tooltip-enter-delay="500">enter 500 ms</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-tooltip="Se queda 1 s al salir" data-tooltip-leave-delay="1000">leave 1000 ms</button>
{{< /mtx-demo >}}

## Seguir el cursor

`data-tooltip-follow-cursor` ancla el tooltip al puntero mientras se mueve sobre el disparador.

{{< mtx-demo title="data-tooltip-follow-cursor" layout="block" >}}
<div class="mtx-p-3 mtx-border mtx-rounded" data-mtx-tooltip="Sigo al cursor" data-tooltip-follow-cursor>
  Mueve el puntero por esta zona.
</div>
{{< /mtx-demo >}}

## Dispositivos táctiles

En pantallas táctiles el tooltip aparece tras una **pulsación larga de 700 ms** (el `enterTouchDelay` de MUI) y se oculta **1,5 s** después de soltar (`leaveTouchDelay`). Entonces usa una fuente mayor (`0.875rem`) y más separación con el disparador (24 px). Un toque normal no lo muestra, para no interrumpir la acción.

## Casos de uso reales

Barra de formato de un editor: los tooltips incluyen el atajo de teclado mientras el botón conserva su nombre corto.

{{< mtx-demo title="Barra de herramientas" >}}
<div role="toolbar" aria-label="Formato de texto">
  <button data-mtx="icon-button" data-icon="format_bold" data-size="small" aria-label="Negrita" data-mtx-tooltip="Negrita (Ctrl+B)"></button>
  <button data-mtx="icon-button" data-icon="format_italic" data-size="small" aria-label="Cursiva" data-mtx-tooltip="Cursiva (Ctrl+I)"></button>
  <button data-mtx="icon-button" data-icon="format_underlined" data-size="small" aria-label="Subrayado" data-mtx-tooltip="Subrayado (Ctrl+U)"></button>
  <button data-mtx="icon-button" data-icon="link" data-size="small" aria-label="Insertar enlace" data-mtx-tooltip="Insertar enlace (Ctrl+K)"></button>
</div>
{{< /mtx-demo >}}

Información adicional junto a una cifra:

{{< mtx-demo title="Ayuda junto a un valor" >}}
<span>Saldo disponible: <strong>1.240,50 €</strong></span>
<button data-mtx="icon-button" data-icon="info" data-size="small" data-mtx-tooltip="Incluye los cobros pendientes de confirmar" data-tooltip-arrow data-tooltip-placement="right"></button>
{{< /mtx-demo >}}

## Sintaxis BEM completa

La forma avanzada `data-mtx="tooltip"` crea una instancia registrada en el registro (disponible con `Materix.getInstance`). Envuelve al disparador (o va directamente sobre él), lee `data-title` y las opciones sin el prefijo `tooltip-`: `data-placement`, `data-arrow`, `data-enter-delay`, `data-leave-delay`, `data-follow-cursor`. Los atributos ARIA se aplican al primer descendiente enfocable.

```html
<span data-mtx="tooltip" data-title="Exportar a CSV" data-placement="right" data-arrow>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="download">Exportar</button>
</span>
```

La superficie generada se porta a `<body>` y se retira al cerrarse:

```html
<div class="mtx-tooltip mtx-tooltip--open mtx-tooltip--arrow" role="tooltip" id="mtx-tooltip-1"
     data-side="right" data-placement="right">
  <span class="mtx-tooltip__label">Exportar a CSV</span>
  <span class="mtx-tooltip__arrow" aria-hidden="true"></span>
</div>
```

## Uso programático

`Materix.tooltip` controla cualquier disparador, declarativo o avanzado:

```javascript
const button = document.getElementById('copy');

Materix.tooltip.show(button);          // lo muestra al instante
Materix.tooltip.hide(button);          // lo oculta
Materix.tooltip.hideAll();             // oculta todos los visibles

const instance = Materix.tooltip.get(button); // instancia Tooltip (se crea si hace falta)
instance.setTitle('¡Copiado!');        // cambia el texto (y el aria-label generado)
instance.open();
instance.close();

button.addEventListener('mtx:tooltip:open', () => console.log('visible'));
```

Con módulos ES:

```javascript
import { Tooltip, tooltip } from '@rubenchodev/materix-ui';

// Forma avanzada sobre un contenedor
const instance = new Tooltip(document.getElementById('export-wrapper'));

// Las opciones programáticas tienen prioridad sobre los atributos
const custom = new Tooltip(element, { title: 'Hola', placement: 'top', arrow: true });
```

{{< mtx-demo title="show(), hide() y setTitle()" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-start-icon="content_copy" id="doc-tooltip-target" data-mtx-tooltip="Copiar enlace" data-tooltip-placement="top">Copiar</button>
<button class="mtx-button mtx-button--text" data-mtx="button" data-doc-tooltip="show">show()</button>
<button class="mtx-button mtx-button--text" data-mtx="button" data-doc-tooltip="hide">hide()</button>
<button class="mtx-button mtx-button--text" data-mtx="button" data-doc-tooltip="title">setTitle('¡Copiado!')</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const target = document.getElementById('doc-tooltip-target');
  document.querySelectorAll('[data-doc-tooltip]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.docTooltip;
      if (action === 'show') Materix.tooltip.show(target);
      if (action === 'hide') Materix.tooltip.hide(target);
      if (action === 'title') {
        Materix.tooltip.get(target).setTitle('¡Copiado!');
        Materix.tooltip.show(target);
      }
    });
  });
});
</script>

## Referencia de API

### Atributos data-*

**Forma global** (en cualquier elemento)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx-tooltip` | Texto | — | Texto del tooltip. Vacío = sin tooltip. |
| `data-tooltip-placement` | `top`, `bottom`, `left`, `right` + `-start`/`-end` | `bottom` | Colocación preferida (voltea y se desplaza automáticamente). |
| `data-tooltip-arrow` | booleano | — | Muestra la flecha. |
| `data-tooltip-enter-delay` | ms | `100` | Retardo antes de mostrarse en hover o foco. |
| `data-tooltip-leave-delay` | ms | `0` | Retardo antes de ocultarse al salir el puntero. |
| `data-tooltip-follow-cursor` | booleano | — | El tooltip sigue al puntero. |

**Forma avanzada** (`data-mtx="tooltip"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-title` | Texto | — | Texto del tooltip. |
| `data-placement`, `data-arrow`, `data-enter-delay`, `data-leave-delay`, `data-follow-cursor` | Como arriba | Como arriba | Las mismas opciones sin el prefijo `tooltip-` (las prefijadas también funcionan). |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-tooltip` | Superficie (`role="tooltip"`), posición fija, portada a `<body>`. |
| `mtx-tooltip--open` | Estado visible (transición grow/fade). |
| `mtx-tooltip--arrow` | Tooltip con flecha. |
| `mtx-tooltip--touch` | Abierto por pulsación larga: fuente y relleno mayores. |
| `mtx-tooltip__label` | Texto. |
| `mtx-tooltip__arrow` | Flecha (1em × 0.71em). |
| `[data-side]` | Lado final (`top`, `bottom`, `left`, `right`) tras el volteo; orienta la flecha y el origen de la transformación. |

### Métodos

`Materix.tooltip` (ayudante global):

| Método | Retorna | Descripción |
|---|---|---|
| `show(el, options?)` | `Tooltip \| null` | Muestra al instante el tooltip de `el` (`{ touch: true }` para el estilo táctil). |
| `hide(el)` | `void` | Lo oculta. |
| `hideAll()` | `void` | Oculta todos los tooltips visibles. |
| `get(el)` | `Tooltip \| null` | Instancia del disparador (la crea si hace falta). |
| `sync(root?)` | `void` | Aplica `aria-label` a los disparadores sin nombre dentro de `root` (lo hace automáticamente un `MutationObserver`). |

Instancia `Tooltip`:

| Método | Retorna | Descripción |
|---|---|---|
| `open(options?)` / `show()` | `boolean` | Lo muestra; `false` si el texto está vacío. |
| `close(options?)` / `hide()` | `void` | Lo oculta (`{ immediate: true }` sin transición). |
| `toggle()` | `void` | Alterna la visibilidad. |
| `setTitle(text)` | `void` | Cambia el texto y el `aria-label` generado por Materix. |
| `update()` | `void` | Recalcula la posición. |
| `isOpen` | `boolean` | Estado visible. |
| `destroy()` | `void` | Retira la superficie, los temporizadores y el `aria-label` generado. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:tooltip:open` | `{ tooltip }` | Aparece el tooltip (burbujea desde el disparador). |
| `mtx:tooltip:close` | `{ tooltip }` | Se oculta el tooltip. |

### Variables CSS

| Variable | Predeterminado | Uso |
|---|---|---|
| `--mtx-tooltip-bg` | `rgba(97, 97, 97, 0.92)` | Fondo y flecha (grey 700 de MUI al 92 %, igual en claro y oscuro). |
| `--mtx-tooltip-color` | `#ffffff` | Texto. |
| `--mtx-tooltip-font-size` | `0.6875rem` | Tamaño de fuente (peso 500, interlineado 1.4). |
| `--mtx-tooltip-font-size-touch` | `0.875rem` | Tamaño de fuente al abrirse por pulsación. |
| `--mtx-tooltip-max-width` | `300px` | Ancho máximo. |
| `--mtx-z-index-tooltip` | `1500` | Nivel de apilamiento, por encima de dialogs y snackbars. |

## Accesibilidad

- La superficie tiene `role="tooltip"` y se enlaza con el disparador según el patrón tooltip de WAI-ARIA:
  - Si el disparador **no tiene nombre accesible** (botón de solo icono sin `aria-label`/`aria-labelledby`/texto), el texto se aplica como su `aria-label` en cuanto carga la página (y para el contenido añadido después). Es lo que hace el `Tooltip` de MUI por defecto.
  - Si **ya tiene nombre**, se conserva y el tooltip se enlaza con `aria-describedby` mientras está visible. Si ambos textos son idénticos no se duplica.
- Aparece con el foco de teclado (heurística `:focus-visible`: Tab sí, clic de ratón no) y se oculta al perder el foco.
- **Hoverable** (WCAG 1.4.13): el puntero puede pasar del disparador al tooltip sin que desaparezca (un puente invisible cubre la separación).
- **Descartable**: <kbd>Escape</kbd> lo oculta sin mover el foco.
- No pongas contenido interactivo en un tooltip; usa un [Popover](../popover/).
- Respeta `prefers-reduced-motion` (sin animación de escala) y dibuja un borde en modo de colores forzados.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> | Al enfocar un disparador, su tooltip aparece tras el retardo. |
| <kbd>Escape</kbd> | Oculta el tooltip visible, y solo a él: un menú, popover o diálogo abierto debajo sigue abierto hasta el siguiente <kbd>Escape</kbd>. |
