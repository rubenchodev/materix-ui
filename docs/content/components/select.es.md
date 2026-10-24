---
title: "Select"
description: "Selector con menú propio al estilo MUI: búsqueda, selección múltiple, acciones masivas, grupos, límites e iconos o imágenes en las opciones."
group: "inputs"
icon: "list"
weight: 80
example: "select"
import: "Select"
mui: "https://mui.com/material-ui/react-select/"
---

`Select` permite elegir uno o varios valores de una lista mediante un menú propio con estética MUI: búsqueda, selección múltiple con casillas, acciones masivas, grupos y opciones con icono o imagen. Un `<select>` nativo oculto refleja la selección, de modo que el valor se envía con el formulario y el navegador valida `required`. Si solo necesitas el desplegable del sistema operativo, más ligero y mejor en móviles, usa [NativeSelect](../native-select/); para texto libre, usa [TextField](../text-field/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Select } from '@rubenchodev/materix-react';

<Select label="Ciudad" name="city">
  <option value="mdx">Ciudad de México</option>
  <option value="gdl">Guadalajara</option>
</Select>
```

## Uso básico

Basta un elemento con `label`: el componente genera el contenedor, el label flotante, el combobox, el `<select>` nativo oculto, el chevron y, en `outlined`, el borde con muesca. Las opciones se escriben como children `<option>`/`<optgroup>` (con `data-icon`/`data-image` como en vanilla) o se pasan con la prop `options`. Sin `defaultValue` queda seleccionada la primera opción habilitada, como en un select nativo.

{{< react-demo "select/01-basic" >}}

## Variantes

`variant`: `outlined` (por defecto, con muesca), `filled` y `standard`.

{{< react-demo id="select/02-variants" layout="block" >}}

## Tamaños

Medium 56px (por defecto) y small 40px con `size="small"`: las mismas alturas que TextField y NativeSelect, así que un Select small se alinea en la misma fila con un TextField small y un Button medium.

{{< react-demo id="select/03-sizes" layout="block" >}}

## Con y sin iconos

`startIcon` en el control (nombre de Material Icons, URL de imagen o nodo React) e `icon` / `image` en cada opción. El icono de la opción elegida aparece también en el control. `secondary` añade una segunda línea a la opción en el menú.

{{< react-demo id="select/04-icons" layout="block" >}}

## Colores

`color` acepta toda la paleta MUI (`primary`, `secondary`, `error`, `warning`, `info`, `success`): cambia el label, el borde o subrayado con foco y la opción seleccionada del menú. `color="error"` no activa el estado de error.

{{< react-demo id="select/05-colors" layout="block" >}}

## Estados

`helperText`, `error`, `disabled` y `readOnly` (muestra el valor pero no abre el menú). `required` añade el atributo nativo y el asterisco. Dentro de un [FormControl](../form-helper-text/) el select hereda `error`, `disabled` y `required`.

{{< react-demo id="select/06-states" layout="block" >}}

## Placeholder y texto largo

En selección única, `placeholder` se muestra mientras no hay valor (el select oculto queda vacío, así que `required` lo valida). Una opción con valor vacío cuenta como "sin selección" si hay placeholder. El texto largo se recorta con puntos suspensivos sin ensanchar el campo.

{{< react-demo id="select/07-placeholder" layout="block" >}}

## Búsqueda

`search` añade una caja que filtra por texto y valor, sin distinguir mayúsculas ni tildes (con un debounce de 150 ms). `header` añade una cabecera y `noResultsText` el mensaje sin coincidencias (`{0}` = término buscado). Prueba a escribir "zz".

{{< react-demo "select/08-search" >}}

## Selección múltiple

Con `multiple` cada opción lleva una casilla y el menú permanece abierto. `actionsBox` añade "Seleccionar todo / Deseleccionar todo" y `selectedTextFormat` controla el texto del control: `values` (por defecto), `count`, `count > N` o `static` (siempre el placeholder). `renderValue` sustituye el texto, por ejemplo por [Chips](../chip/).

{{< react-demo id="select/09-multiple" layout="block" >}}

## Grupos y límite de selección

`<optgroup>` (o un elemento con `options`) se muestra como subtítulo; las opciones y grupos deshabilitados no se pueden elegir y `maxOptions` bloquea el resto al alcanzar el límite.

{{< react-demo id="select/10-groups" layout="block" >}}

## Posicionamiento automático

El menú se monta en un portal con el ancho del control, se recoloca con scroll y resize, se abre hacia arriba cuando no cabe debajo (y conserva ese lado al filtrar) y limita su alto al espacio disponible. Se cierra cuando el control sale del viewport y respeta RTL.

{{< react-demo "select/11-positioning" >}}

## Grilla y formulario

Un formulario de envío en `mtx-grid` que combina Select, [TextField](../text-field/) y Button: cada campo ocupa el ancho de su columna (una en móvil, tres en escritorio). `name` se envía con el formulario (varias entradas con `multiple`) y el `reset` del formulario restaura el valor inicial.

{{< react-demo id="select/12-grid-form" layout="block" >}}

## Uso controlado

Con `value` + `onChange` y `open` + `onOpen`/`onClose` el estado lo lleva el padre; los métodos de la instancia vanilla pasan a ser cambios de estado (`value = …`, `open()`, `disable()`, `helperText = …`) y `focus()` usa `controlRef`.

{{< react-demo id="select/13-controlled" layout="block" >}}

## Dentro de un Dialog

El menú portado se registra como capa superior: la trampa de foco del [Dialog](../dialog/) deja entrar el foco en su caja de búsqueda, <kbd>Esc</kbd> cierra solo el menú (una segunda pulsación cierra el diálogo) y su z-index queda por encima del diálogo.

{{< react-demo "select/14-dialog" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `'outlined' \| 'filled' \| 'standard'` | `'outlined'` | Variante visual. |
| `size` | `'medium' \| 'small'` | `'medium'` | 56px o 40px. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Color de foco y selección. |
| `label` | `ReactNode` | — | Label flotante (y muesca en `outlined`). |
| `options` | `Array<SelectOption \| SelectOptionGroup>` | — | `{ value, label, icon?, image?, secondary?, disabled? }` o `{ label, options, disabled? }`. Se pintan antes que `children`. |
| `children` | `<option>` / `<optgroup>` | — | Opciones declarativas; se leen `data-icon`, `data-image` y `data-secondary`. |
| `multiple` | `boolean` | `false` | Selección múltiple con casillas. |
| `value` | `string \| number \| Array` | — | Valor (modo controlado); un array con `multiple`. |
| `defaultValue` | `string \| number \| Array` | — | Valor inicial (no controlado). |
| `onChange` | `(event, value: string \| string[]) => void` | — | Se invoca cuando el usuario cambia la selección. |
| `open` / `defaultOpen` | `boolean` | — / `false` | Apertura del menú (controlada / no controlada). |
| `onOpen` / `onClose` | `(event) => void` | — | Peticiones de apertura y cierre (clic, teclado, clic fuera, Escape, Tab). |
| `placeholder` | `string` | `''` | Texto sin selección. |
| `startIcon` | `ReactNode` | — | Icono inicial: nombre de Material Icons, URL de imagen o nodo. |
| `search` | `boolean` | `false` | Caja de búsqueda en el menú. |
| `searchPlaceholder` | `string` | i18n | Placeholder de la búsqueda. |
| `noResultsText` | `string` | i18n | Mensaje sin coincidencias; `{0}` es el término. |
| `actionsBox` | `boolean` | `false` | Seleccionar / deseleccionar todo (solo múltiple). |
| `selectAllText` / `deselectAllText` | `string` | i18n | Textos de las acciones masivas. |
| `header` | `ReactNode` | — | Cabecera dentro del menú. |
| `maxOptions` | `number` | — | Máximo de opciones seleccionadas (múltiple). |
| `selectedTextFormat` | `'values' \| 'count' \| 'count > N' \| 'static'` | `'values'` | Texto de la selección múltiple. |
| `renderValue` | `(selected) => ReactNode` | — | Contenido propio del control cuando hay selección. |
| `error` | `boolean` | de `FormControl` | Colores de error y `aria-invalid`. |
| `helperText` | `ReactNode` | — | Texto de ayuda o error, enlazado con `aria-describedby`. |
| `disabled` | `boolean` | de `FormControl` | Deshabilita el campo. |
| `readOnly` | `boolean` | `false` | Muestra el valor pero no abre. |
| `required` | `boolean` | de `FormControl` | `required` nativo y asterisco. |
| `fullWidth` | `boolean` | `true` | Ocupa el ancho del contenedor (como vanilla). |
| `name`, `form` | `string` | — | Van al `<select>` oculto. |
| `autoFocus` | `boolean` | — | Enfoca el combobox al montar. |
| `locale` | `string` | contexto | Idioma de los textos del componente. |
| `id` | `string` | automático | Id de la raíz; de él derivan los del control, listbox, label y ayuda. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Se aplican al combobox. |
| `inputRef` / `inputProps` | | — | Ref y atributos del `<select>` oculto. |
| `controlRef` | `Ref<HTMLDivElement>` | — | Ref al combobox (`focus()`). |
| `menuClassName` | `string` | — | Clase extra del menú portado. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref al `<div>` raíz. |

`className`, `style` y cualquier otro atributo van al `<div>` raíz.

### Clases CSS

| Clase | Elemento |
| :--- | :--- |
| `.mtx-select` | Contenedor raíz. |
| `.mtx-select--outlined` / `--filled` / `--standard` | Variantes. |
| `.mtx-select--small` | Altura de 40px. |
| `.mtx-select--color-{color}` | Color de la paleta (también en el menú como `.mtx-select__menu--color-{color}`). |
| `.mtx-select--error` / `--open` / `--adorned-start` | Error, menú abierto, icono inicial. |
| `.mtx-select__label` / `__control` / `__display` / `__display-text` / `__chevron` | Label, combobox, valor mostrado y flecha. |
| `.mtx-select__outline` / `__legend` | Borde con muesca (`outlined`). |
| `.mtx-select__adornment--start` | Icono inicial. |
| `.mtx-select__native` | `<select>` nativo oculto. |
| `.mtx-select__helper-text` | Texto de ayuda. |
| `.mtx-select__menu`, `__header`, `__search`, `__actions`, `__action`, `__optgroup`, `__option`, `__check`, `__no-results` | Partes del menú. |
| `.mtx-select__option--selected` / `--disabled` / `--focused` | Estados de la opción (`--focused` = opción activa del teclado). |

### Variables CSS

`--mtx-select-accent` y `--mtx-select-accent-text` (las fija `color`), además de `--mtx-control-height-*`, `--mtx-color-input-filled`, `--mtx-color-divider`, `--mtx-elevation-8` y `--mtx-z-index-modal`.

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<select data-mtx="select" data-label="…">` | `<Select label="…">` |
| `data-variant`, `data-size`, `data-color` | `variant`, `size`, `color` |
| `data-start-icon` | `startIcon` |
| `data-icon` / `data-image` en `<option>` | Los mismos atributos en los `<option>` hijos, o `icon` / `image` en `options` |
| `data-search`, `data-header`, `data-none-results-text` | `search`, `header`, `noResultsText` |
| `data-actions-box`, `data-select-all-text`, `data-deselect-all-text` | `actionsBox`, `selectAllText`, `deselectAllText` |
| `data-max-options`, `data-selected-text-format` | `maxOptions`, `selectedTextFormat` |
| `data-placeholder` / `title` | `placeholder` |
| `data-helper-text`, `data-error`, `data-readonly`, `disabled` | `helperText`, `error`, `readOnly`, `disabled` |
| `instance.value = …` | Actualizar el estado `value` |
| `open()` / `close()` | `open` + `onOpen` / `onClose` |
| `disable()` / `enable()` | `disabled` |
| `focus()` | `controlRef.current.focus()` |
| Evento nativo `change` | `onChange(event, value)` |

## Accesibilidad

- Patrón WAI-ARIA *select-only combobox*: el control tiene `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded` y `aria-controls`; el menú contiene un `role="listbox"` con elementos `role="option"` (`aria-selected`, `aria-disabled`) y `role="group"` para los grupos. Con `multiple`, el listbox lleva `aria-multiselectable`.
- El foco se queda en el combobox y la opción activa se anuncia con `aria-activedescendant`; con `search`, el foco pasa a la caja de búsqueda, que lleva `aria-activedescendant`.
- El label da nombre al combobox (`aria-labelledby`); sin label usa `aria-label`. `error` añade `aria-invalid`, `required` `aria-required`, `readOnly` `aria-readonly` y `helperText` se enlaza con `aria-describedby`.
- El `<select>` nativo oculto es `aria-hidden` y queda fuera del orden de tabulación; Escape llega por la pila común de capas (solo se cierra la capa superior).

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Enfoca el combobox; con el menú abierto, lo cierra y avanza. |
| <kbd>↓</kbd> / <kbd>↑</kbd> / <kbd>Espacio</kbd> / <kbd>Enter</kbd> | Abre el menú. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Mueve la opción activa (de forma circular). |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primera / última opción. |
| Letras | Typeahead: salta a la opción que empieza por lo tecleado. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Selecciona la opción activa (la alterna en `multiple`). |
| <kbd>Esc</kbd> | Cierra el menú y devuelve el foco al combobox. |
