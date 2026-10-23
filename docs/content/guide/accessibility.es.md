---
title: "Accesibilidad"
description: "Qué garantiza Materix UI en accesibilidad, qué debes aportar tú y qué teclas soporta cada componente interactivo."
weight: 50
icon: "accessibility_new"
---

Materix parte de HTML nativo y añade ARIA solo donde el HTML no basta. La librería resuelve la mecánica (roles, estados, foco, teclado); tú aportas el contenido (nombres accesibles, textos y estructura de la página).

## Lo que hace la librería

### Semántica nativa primero

Los componentes se construyen sobre el elemento correcto: `<button>` para Button, IconButton y Fab; `<input type="checkbox">` para Checkbox y Switch; `<input type="radio">` para Radio; `<input>`, `<textarea>` y `<select>` para los campos; `<table>` para Table. Por eso funcionan con formularios, validación nativa, autocompletado y lectores de pantalla sin trabajo extra.

Cuando el elemento no es nativamente interactivo (una `<div>` como Chip clicable, CardActionArea o TableSortLabel), la librería añade `role="button"`, `tabindex="0"` y la activación con `Enter` y `Espacio`.

### ARIA gestionado automáticamente

| Componente | ARIA que aplica la librería |
|---|---|
| TextField | `aria-invalid` en error, `aria-describedby` hacia helper text y contador, `aria-live="polite"` en el contador, `id` automático para enlazar el `<label>`. |
| Select | `role="combobox"` + `aria-expanded`, `aria-required`, `aria-invalid`, `aria-describedby`; menú `role="listbox"` con `role="option"` y `aria-selected`; `aria-multiselectable` en múltiple. |
| NativeSelect | `aria-invalid` en error. |
| Checkbox | `aria-checked="mixed"` en estado indeterminado. |
| Switch | `role="switch"` sobre el checkbox nativo. |
| Tabs | `role="tablist"`, `role="tab"` con `aria-selected` y tabindex itinerante, `role="tabpanel"`, `aria-orientation` en vertical. |
| Menu | `role="menu"`, `role="menuitem"`; en el disparador `aria-haspopup="menu"`, `aria-expanded` y `aria-controls`. |
| Dialog | `role="dialog"`, `aria-modal="true"`; copia `aria-labelledby` y `aria-describedby` del contenedor al panel. |
| Drawer | `role="dialog"` en modo temporal; `navigation` o `region` en persistente/permanente; `aria-expanded` y `aria-controls` en los disparadores. |
| Alert | `role="alert"`. |
| Snackbar | `role="alert"` en el mensaje (configurable con `data-role`). |
| Table | `aria-sort` en la columna ordenada, `aria-selected` en filas seleccionadas, `aria-live="polite"` en el rango de la paginación, `aria-label` en los botones de navegación. |
| List | `aria-selected` y `aria-current="page"` en el ítem seleccionado. |
| Iconos generados | Los iconos que la librería inserta (adornos de campos, iconos de Alert, chevrons) llevan `aria-hidden="true"`. |

### Foco

- **Foco visible.** Dentro de `.mtx-root`, todo elemento enfocado con teclado muestra un anillo de `--mtx-focus-ring-width` (2px) en `--mtx-focus-ring-color`. Los campos de texto no lo usan: indican el foco con su borde o subrayado, como MUI.
- **Trampa de foco.** Dialog y Drawer temporal retienen `Tab` dentro del panel mientras están abiertos.
- **Foco inicial.** Dialog enfoca el elemento marcado con `data-dialog-autofocus` o, si no hay, el primer enfocable.
- **Restauración.** Al cerrar Dialog, Menu (con `Escape`), Select (con `Escape`) y SpeedDial (con `Escape`) el foco vuelve al elemento que los abrió.

### Escape y capas apiladas

Toda superficie flotante o modal (Dialog, Drawer temporal, Popover, Menu y submenús, Select, Autocomplete, DateTimePicker, SpeedDial, Backdrop, Snackbar y Tooltip) entra en una **pila común de capas** (`src/core/layers.js`) al abrirse y sale al cerrarse. Un único listener de `keydown` en `document` entrega `Escape` **solo a la capa superior** y marca el evento como gestionado (`preventDefault()` más una marca interna), de modo que las capas inferiores lo ignoran:

- **Orden.** La última superficie abierta es la superior: un popover abierto dentro de un diálogo se cierra antes que el diálogo, un submenú antes que su menú y un diálogo abierto desde un popover antes que el popover.
- **Tooltips primero.** Si hay un tooltip visible, `Escape` lo oculta primero y solo a él (WCAG 1.4.13, *descartable*). Los tooltips nunca bloquean al resto: no cuentan para la trampa de foco ni para el «clic fuera».
- **Snackbars al final.** Un snackbar solo recibe `Escape` cuando no hay ninguna otra capa abierta.
- **Capas no descartables.** Un Dialog o Drawer con `data-disable-escape`, o un Backdrop que bloquea la página (`data-lock-scroll` / `data-inert`) sin `data-close-on-escape`, consume `Escape` sin cerrarse, así que tampoco se cierra nada debajo.
- **Clic fuera.** Interactuar con una capa abierta desde otra (un Dialog abierto desde un Popover, un Menu dentro de un Drawer temporal) no es un «clic fuera» para la capa inferior, y la trampa de foco del Dialog deja que el foco entre en los menús y popovers que abrió.
- **Tus manejadores.** Si tu código llama a `event.preventDefault()` en un `keydown` de `Escape` antes de que llegue a `document`, Materix no cierra nada. `Materix.layers.isEscapeHandled(event)` indica si una capa de Materix ya lo gestionó; `Materix.layers.push(owner, { kind, onEscape, nodes })` / `remove(owner)` permiten que tus propias superposiciones entren en la pila.

```javascript
// Una superposición propia que participa en el orden de Escape.
const overlay = { name: 'mi-overlay' };
Materix.layers.push(overlay, { kind: 'popup', nodes: panel, onEscape: () => closePanel() });
// …y al cerrarla:
Materix.layers.remove(overlay);
```

### Movimiento reducido

Con `prefers-reduced-motion: reduce`, `base.css` reduce a 0.01ms las animaciones y transiciones de los elementos de Materix (clases `mtx-*`), y el ripple y las transiciones de JavaScript no se ejecutan.

## Contraste de color

La accesibilidad es una prioridad de Materix UI, así que **todos los colores cumplen WCAG AA (4.5:1 para texto normal) por defecto**. La paleta por defecto de MUI no lo hace en algunas combinaciones: `warning` (#ed6c02) e `info` (#0288d1) como texto sobre blanco o con texto blanco encima, y `error` con texto blanco en modo oscuro, quedan entre 3.0 y 3.9:1. El propio MUI recomienda subir `contrastThreshold` a 4.5 para alcanzar AA; Materix trae esa decisión como valor por defecto, el equivalente a `createTheme({ palette: { contrastThreshold: 4.5 } })`.

Los fondos de marca no cambian (warning, info y error conservan los colores de MUI en botones contained, chips filled, badges y alerts): solo cambian los colores de texto, a través de los tokens `--mtx-color-{color}-text` y `--mtx-color-{color}-contrast`.

Para obtener los valores exactos de MUI (por ejemplo, para igualar píxel a píxel una aplicación MUI existente), desactívalo con `data-mtx-contrast="mui"`:

```html
<html lang="es" data-mtx-contrast="mui">
```

El atributo funciona en `<html>` o en cualquier contenedor, y se combina con los temas claro y oscuro (también cuando uno de ellos está en un contenedor anidado). `data-mtx-contrast="aa"` se sigue aceptando como alias del valor por defecto (útil para volver a AA dentro de un contenedor `mui`).

{{< mtx-demo title="Por defecto (AA) y el opt-out mui" layout="column" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-1">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="info">Info</button>
  <span data-mtx="chip" data-label="Warning" data-variant="outlined" data-color="warning"></span>
  <a data-mtx="link" data-color="info" href="#contraste-de-color">Enlace info</a>
</div>
<div data-mtx-contrast="mui" class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-1">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="info">Info</button>
  <span data-mtx="chip" data-label="Warning" data-variant="outlined" data-color="warning"></span>
  <a data-mtx="link" data-color="info" href="#contraste-de-color">Enlace info</a>
</div>
{{< /mtx-demo >}}

### Tokens

| Token | Por defecto (AA) claro | Por defecto (AA) oscuro | `mui` |
| :--- | :--- | :--- | :--- |
| `--mtx-color-{color}-text` | `error`, `info`, `success` → `-dark`; `warning` → `-dark` 75 % + negro (#ac3d00); `primary`, `secondary` → el color | `error` → `-light` 70 % + blanco; el resto → el color | `var(--mtx-color-{color})` |
| `--mtx-color-warning-contrast`, `--mtx-color-info-contrast` | `rgba(0, 0, 0, 0.87)` | `rgba(0, 0, 0, 0.87)` | `#ffffff` en claro |
| `--mtx-color-error-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | `#ffffff` |

`--mtx-color-{color}-text` es el color accesible para texto e iconos **sobre el fondo** (papel, default o el gris de los campos filled). Lo usan los Button text y outlined, el Chip outlined, Link, Typography con `data-color`, el ToggleButton seleccionado, el icono de Alert (standard y outlined), el label y el texto de ayuda de error de TextField, Select, NativeSelect, Autocomplete y DateTimePicker, y las utilidades `mtx-color-{color}`. `-contrast` es el texto **sobre el color**: Button contained, Chip filled, Badge, Alert filled y Fab. Los Button contained y los Chip filled clicables con texto oscuro aclaran en hover en lugar de oscurecer. También puedes sobrescribir cualquier token `-text` en tu propio tema.

`--mtx-color-text-disabled` (38 % / 50 %) es solo para contenido deshabilitado, que WCAG exime del requisito de contraste. La librería lo marca como deshabilitado para las tecnologías de asistencia (`disabled` o `aria-disabled="true"`): filas estáticas de List con `data-disabled` y el texto de ayuda de un Checkbox o Switch deshabilitado. Los días de otros meses del DatePicker son seleccionables, así que usan `text-secondary`.

### Ratios medidos

Ratios medidos en Chromium sobre `background-default` (#f8fafc claro, #121212 oscuro), el fondo más exigente; sobre papel son iguales o mayores. Button outlined, Chip outlined, Link y Typography comparten los valores de "texto sobre el fondo"; Chip filled, Badge y Alert filled comparten los de "texto sobre el color". Los valores en **negrita** están por debajo del umbral (4.5:1 para texto, 3:1 para iconos).

| Color | Combinación | Claro (por defecto) | Claro `mui` | Oscuro (por defecto) | Oscuro `mui` |
| :--- | :--- | ---: | ---: | ---: | ---: |
| `primary` | Texto sobre el fondo | 8.66 | 8.66 | 7.03 | 7.03 |
| `secondary` | Texto sobre el fondo | 6.03 | 6.03 | 7.84 | 7.84 |
| `error` | Texto sobre el fondo | 5.37 | 4.76 | 8.84 | 5.09 |
| `warning` | Texto sobre el fondo | 5.83 | **2.97** | 9.64 | 9.64 |
| `info` | Texto sobre el fondo | 7.07 | **3.69** | 8.46 | 8.46 |
| `success` | Texto sobre el fondo | 7.52 | 4.90 | 7.92 | 7.92 |
| `primary` | Texto sobre el color | 9.06 | 9.06 | 6.90 | 6.90 |
| `secondary` | Texto sobre el color | 6.30 | 6.30 | 7.61 | 7.61 |
| `error` | Texto sobre el color | 4.98 | 4.98 | 5.18 | **3.68** |
| `warning` | Texto sobre el color | 6.02 | **3.11** | 9.17 | 9.17 |
| `info` | Texto sobre el color | 4.95 | **3.86** | 8.15 | 8.15 |
| `success` | Texto sobre el color | 5.13 | 5.13 | 7.68 | 7.68 |
| `primary` | Contained en hover | 11.59 | 11.59 | 7.97 | **4.01** |
| `secondary` | Contained en hover | 8.20 | 8.20 | 8.63 | **4.01** |
| `error` | Contained en hover | 5.62 | 5.62 | 5.97 | 4.98 |
| `warning` | Contained en hover | 6.96 | **3.79** | 9.95 | 6.84 |
| `info` | Contained en hover | 5.97 | 7.40 | 9.09 | 6.95 |
| `success` | Contained en hover | 7.87 | 7.87 | 8.67 | 4.63 |
| `primary` | ToggleButton seleccionado | 7.54 | 7.54 | 5.51 | 5.51 |
| `secondary` | ToggleButton seleccionado | 5.33 | 5.33 | 6.01 | 6.01 |
| `error` | ToggleButton seleccionado | 4.76 | **4.25** | 6.67 | **4.32** |
| `warning` | ToggleButton seleccionado | 5.20 | **2.73** | 7.15 | 7.15 |
| `info` | ToggleButton seleccionado | 6.27 | **3.36** | 6.43 | 6.43 |
| `success` | ToggleButton seleccionado | 6.65 | **4.44** | 6.09 | 6.09 |
| `error` | Label de error en campo filled | 4.93 | **4.37** | 6.02 | **3.47** |
| `success` | Alert standard (texto) | 12.33 | 12.33 | 13.66 | 13.66 |
| `info` | Alert standard (texto) | 11.20 | 11.20 | 13.86 | 13.86 |
| `warning` | Alert standard (texto) | 10.25 | 10.25 | 14.26 | 14.26 |
| `error` | Alert standard (texto) | 12.21 | 12.21 | 11.43 | 11.43 |
| `success` | Alert standard (icono, 3:1) | 6.89 | 4.49 | 7.99 | 7.99 |
| `info` | Alert standard (icono, 3:1) | 6.54 | 3.41 | 8.52 | 8.52 |
| `warning` | Alert standard (icono, 3:1) | 5.45 | **2.78** | 9.60 | 9.60 |
| `error` | Alert standard (icono, 3:1) | 4.83 | 4.28 | 9.25 | 5.32 |
| `success` | Alert outlined (icono, 3:1) | 7.52 | 4.90 | 7.92 | 7.92 |
| `info` | Alert outlined (icono, 3:1) | 7.07 | 3.69 | 8.46 | 8.46 |
| `warning` | Alert outlined (icono, 3:1) | 5.83 | **2.97** | 9.64 | 9.64 |
| `error` | Alert outlined (icono, 3:1) | 5.37 | 4.76 | 8.84 | 5.09 |

El texto de Alert standard y outlined ya supera 10:1 en ambos modos (MUI mezcla el color con negro o blanco), así que el modo de contraste solo cambia su icono.

## Lo que te toca a ti

- **Nombre accesible en botones de solo icono.** IconButton, Fab circular y los botones con solo un icono necesitan `aria-label`:

  ```html
  <button class="mtx-icon-button" data-mtx="icon-button" aria-label="Eliminar">
    <span class="material-icons" aria-hidden="true">delete</span>
  </button>
  ```

- **Iconos decorativos.** Si escribes tú el `<span class="material-icons">`, añade `aria-hidden="true"`; si no, el lector anuncia el nombre del icono ("delete").
- **Label en cada campo.** Usa `data-label` (o un `<label>` en la sintaxis BEM). El `placeholder` no sustituye al label. Si el diseño no muestra label, añade `aria-label` al `<input>`.
- **Errores con texto.** Acompaña `data-error` con `data-helper-text` que explique el problema; el color rojo solo no basta.
- **Título del diálogo.** Usa `data-title` o pon `aria-labelledby` apuntando al título del Dialog.
- **Etiquetas que genera la librería.** Las etiquetas ARIA internas pasan por i18n y siguen el idioma de la página o del componente (`lang`, `data-locale`): el botón de cerrar de Alert, el icono de borrar de Chip (icono no enfocable con `title`; el chip se elimina con `Supr`/`Retroceso`), el botón de cerrar del Drawer, el de acciones de la cabecera de Card, el FAB del SpeedDial y el botón de navegación de AppBar («Abrir navegación»). Puedes cambiarlas por instancia con `data-close-label`, `data-delete-label`, `data-action-label`, `data-label` o `data-start-icon-label`/`data-end-icon-label`.
- **Idioma.** Declara `<html lang="...">`: lo usan los lectores de pantalla y también Materix para elegir el idioma de sus textos.

## Teclado por componente

Los componentes nativos (Button, IconButton, Fab, Link, Checkbox, Radio, Switch, TextField, NativeSelect) usan el teclado del navegador: `Tab` para enfocar, `Espacio` para marcar o pulsar, `Enter` para activar botones y enlaces, y las flechas para moverse entre radios del mismo `name`.

| Componente | Tecla | Acción |
|---|---|---|
| Select | `Flecha abajo` / `Flecha arriba` / `Espacio` | Con el control enfocado, abre el menú. |
| | `Enter` | Con el control enfocado, abre o cierra el menú. |
| | `Flecha abajo` / `Flecha arriba` | Con el menú abierto, mueve el foco entre opciones. |
| | `Enter` / `Espacio` | Selecciona la opción enfocada. |
| | `Escape` | Cierra el menú y devuelve el foco al control. |
| | `Tab` | Cierra el menú. |
| Menu | `Flecha abajo` / `Flecha arriba` | Mueve el foco entre ítems (cíclico). |
| | `Inicio` / `Fin` | Primer / último ítem. |
| | `Enter` / `Espacio` | Activa el ítem enfocado. |
| | `Flecha derecha` | Abre el submenú del ítem enfocado. |
| | `Flecha izquierda` | Cierra el submenú actual. |
| | `Escape` | Cierra el menú y devuelve el foco al disparador. |
| | `Tab` | Cierra el menú. |
| Tabs | `Flecha izquierda` / `Flecha derecha` | Pestaña anterior / siguiente (cíclico). En vertical: `Flecha arriba` / `Flecha abajo`. |
| | `Inicio` / `Fin` | Primera / última pestaña. |
| | `Enter` / `Espacio` | Activa la pestaña enfocada. Con `data-selection-follows-focus`, las flechas activan directamente. |
| Dialog | `Escape` | Cierra (salvo `data-disable-escape`). |
| | `Tab` / `Mayús + Tab` | Recorre los enfocables sin salir del diálogo. |
| Drawer (temporal) | `Escape` | Cierra (salvo `data-disable-escape`). |
| | `Tab` / `Mayús + Tab` | Recorre los enfocables sin salir del panel. |
| Snackbar | `Escape` | Cierra el snackbar abierto. |
| SpeedDial | `Escape` | Cierra las acciones y devuelve el foco al FAB. |
| Chip | `Enter` / `Espacio` | Activa un chip con `data-clickable`. |
| | `Supr` / `Retroceso` | Emite `mtx:chip:delete` en un chip borrable. |
| | `Escape` | Quita el foco del chip. |
| CardActionArea | `Enter` / `Espacio` | Activa el área. |
| Card interactiva | `Enter` / `Espacio` | Activa la tarjeta. |
| TableSortLabel | `Enter` / `Espacio` | Cambia el orden de la columna. |
| TablePagination | `Tab` + `Enter` | Botones nativos de primera, anterior, siguiente y última página. |
| DateTimePicker | `Escape` | Cierra el selector. |
| | `Flecha arriba` / `Flecha abajo` | En la entrada de hora por teclado, suma o resta una hora o un minuto. |
| | `Tab` + `Enter` | Días, meses, años y botones del calendario son botones nativos. |
| ListItemButton | `Tab` + `Enter` | Usa el elemento nativo (`<button>` o `<a>`). |

{{< callout type="info" title="Diferencias con MUI" >}}
El calendario del DateTimePicker no admite todavía navegación con flechas entre días, y Select no admite `Inicio`/`Fin` ni búsqueda por tecleo fuera del campo de búsqueda (`data-search`). Se navegan con `Tab`.
{{< /callout >}}

## Lista de verificación

Antes de publicar una pantalla:

1. Recórrela solo con teclado: todo lo interactivo se alcanza con `Tab` y muestra el anillo de foco.
2. Cada botón de solo icono tiene `aria-label`.
3. Cada campo tiene label visible o `aria-label`.
4. Los errores tienen texto, no solo color.
5. Los diálogos tienen título enlazado.
6. Revisa ambos temas: el contraste debe mantenerse en claro y en oscuro.
7. Activa "reducir movimiento" en el sistema y comprueba que nada depende de una animación para entenderse.
