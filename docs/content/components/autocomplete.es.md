---
title: "Autocomplete"
description: "Campo de texto con sugerencias filtrables: selección única o múltiple con chips, valores libres, grupos y carga asíncrona."
group: "inputs"
icon: "manage_search"
weight: 95
example: "autocomplete"
import: "Autocomplete"
mui: "https://mui.com/material-ui/react-autocomplete/"
---

`Autocomplete` es un campo de texto enriquecido con una lista de sugerencias: el usuario escribe, la lista se filtra (sin distinguir mayúsculas ni tildes) y elige con el ratón o el teclado. Sigue el patrón WAI-ARIA 1.2 **combobox con listbox**. Úsalo cuando la lista es larga y buscar es más rápido que desplazarse, cuando los valores vienen de un servidor o cuando se admiten valores libres. Para listas cortas sin búsqueda usa [Select](../select/) o [NativeSelect](../native-select/); para texto libre sin sugerencias, [TextField](../text-field/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Autocomplete } from '@rubenchodev/materix-react';

<Autocomplete
  label="País"
  name="country"
  options={[
    { value: 'co', label: 'Colombia' },
    { value: 'mx', label: 'México' },
  ]}
/>
```

{{< callout type="info" title="¿Select, NativeSelect o Autocomplete?" >}}
| Necesidad | NativeSelect | Select | Autocomplete |
| :--- | :--- | :--- | :--- |
| Lista corta (≤ 10 opciones), móvil primero | La mejor opción | Bien | Excesivo |
| Escribir para filtrar (sin tildes ni mayúsculas) | No | Caja de búsqueda en el menú (`search`) | Sí, en el propio campo |
| Listas largas (países, usuarios, productos) | Pobre | Aceptable con búsqueda | La mejor opción |
| Selección múltiple | Lista nativa (Ctrl/Cmd) | Casillas y "Seleccionar todo" | Chips eliminables |
| Valores fuera de la lista | No | No | Sí (`freeSolo`) |
| Opciones cargadas de un servidor al escribir | No | No | Sí (`onInputChange` + `options`) |
| Valor del formulario | `<select>` nativo | `<select>` nativo (oculto) | Inputs ocultos con `name` |
{{< /callout >}}

## Uso básico

Basta un elemento con `label` y `options`: el componente pinta el TextField (label, borde con muesca), los botones de limpiar y abrir, el listbox en un portal y el input oculto que envía el `value` de la opción con el `name`. Escribe para filtrar, sin distinguir mayúsculas ni tildes.

{{< react-demo "autocomplete/01-basic" >}}

Las opciones pueden ser textos u objetos `{ value, label, group?, disabled?, icon?, description? }`, el mismo formato que vanilla. Cualquier otra forma funciona con `getOptionLabel` (y `getOptionValue` para la clave enviada).

## Variantes

Las mismas que TextField con `variant`: `outlined` (por defecto), `filled` y `standard`.

{{< react-demo id="autocomplete/02-variants" layout="block" >}}

## Tamaños

Medium 56px (por defecto) y small 40px con `size="small"`, las mismas alturas que TextField, Select y un Button medium. En múltiple los chips pasan a 24px y el campo crece cuando se reparten en varias líneas.

{{< react-demo id="autocomplete/03-sizes" layout="block" >}}

## Con y sin iconos

`startIcon` añade un icono inicial (nombre de Material Icons, URL de imagen o nodo; el label se alinea con el texto). En cada opción, `icon` muestra un icono de Material y `description` una línea secundaria. La flecha final es el indicador del popup y la ✕ (visible al pasar el ratón o con foco) es el botón de limpiar.

{{< react-demo id="autocomplete/04-icons" layout="block" >}}

## Colores

`color` cambia el color de foco del campo (como en TextField) y el fondo de las opciones seleccionadas: `primary` (por defecto), `secondary`, `success`, `warning`, `info` (y `error` para las opciones).

{{< react-demo id="autocomplete/05-colors" layout="block" >}}

## Estados

`helperText`, `error`, `disabled`, `readOnly` (muestra el valor; ni abre ni borra), `required` (validación nativa mientras no haya valor), `loading` (CircularProgress en el campo y "Cargando…" en la lista) y el mensaje "Sin opciones" (personalizable con `noOptionsText`).

{{< react-demo id="autocomplete/06-states" layout="block" >}}

## Grupos y opciones deshabilitadas

`group` en cada opción (o `groupBy`) muestra una cabecera fija; las opciones consecutivas del mismo grupo se agrupan, como en MUI. Las opciones deshabilitadas (`disabled` o `getOptionDisabled`) se saltan con el teclado y no admiten clic. El campo de zona horaria usa objetos propios con `getOptionLabel`, `getOptionValue` y `groupBy`.

{{< react-demo id="autocomplete/07-groups" layout="block" >}}

## Valores múltiples

`multiple` muestra cada valor como un [Chip](../chip/) eliminable (su ✕, <kbd>Retroceso</kbd> con el texto vacío, o <kbd>Supr</kbd>/<kbd>Retroceso</kbd> sobre un chip con foco; <kbd>←</kbd>/<kbd>→</kbd> se mueven entre chips). `limitTags` limita los chips visibles sin foco ("+N"), `disableCloseOnSelect` mantiene la lista abierta y `filterSelectedOptions` oculta las opciones ya elegidas.

{{< react-demo id="autocomplete/08-multiple" layout="block" >}}

## Valores libres (free solo)

`freeSolo` acepta valores que no están en la lista: <kbd>Enter</kbd> confirma el texto (en selección única también al salir del campo) y se reutiliza una opción con la misma etiqueta. Sin opciones coincidentes no se muestran ni el popup ni el botón de abrir (`forcePopupIcon` recupera el botón).

{{< react-demo id="autocomplete/09-free-solo" layout="block" >}}

## Opciones de comportamiento

<kbd>↓</kbd>/<kbd>↑</kbd> abren y se mueven, <kbd>Re Pág</kbd>/<kbd>Av Pág</kbd> saltan 5, <kbd>Inicio</kbd>/<kbd>Fin</kbd> van a los extremos, <kbd>Enter</kbd> selecciona y <kbd>Esc</kbd> cierra (y, cerrado, limpia con `clearOnEscape`). Opciones: `autoHighlight` (activa la primera), `autoSelect` (<kbd>Tab</kbd> o la pérdida de foco aceptan la activa), `clearOnEscape`, `openOnFocus`, `disableClearable`, `matchFrom="start"` e `includeInputInList` (las flechas vuelven al campo en los extremos).

{{< react-demo id="autocomplete/10-behavior" layout="block" >}}

## Carga asíncrona

Escucha `onInputChange` (con `debounce={300}` el motivo `input` espera a que el usuario deje de escribir), activa `loading`, pide los datos y pasa las nuevas `options`. `filterOptions={false}` deja el filtrado al servidor (y desactiva el resaltado). La demo simula 800 ms de latencia y cancela la petición pendiente en cada búsqueda nueva y al desmontar.

{{< react-demo "autocomplete/11-async" >}}

```tsx
const [options, setOptions] = useState([]);
const [loading, setLoading] = useState(false);

<Autocomplete
  label="Repositorio"
  debounce={300}
  filterOptions={false}
  options={options}
  loading={loading}
  onInputChange={async (_event, text, reason) => {
    if (reason !== 'input') return;
    setLoading(true);
    setOptions(await searchRepos(text)); // [{ value, label, description }]
    setLoading(false);
  }}
/>
```

El valor seleccionado conserva su etiqueta cuando llegan opciones nuevas: un `defaultValue="co"` muestra "co" hasta que se carga una opción con ese `value` y entonces "Colombia".

## Formularios

`name` pasa a inputs ocultos: uno con el valor en selección única; uno por valor en múltiple (como `<select multiple>`) o un único campo con `valueFormat="csv"` (y `separator`). `required` usa la validación nativa (un texto escrito que no es una opción no es válido salvo con `freeSolo`); el `reset` del formulario restaura el valor inicial.

{{< react-demo id="autocomplete/12-form" layout="block" >}}

## Maquetación en grilla

Ocupa el 100% de su columna en [Grid](../grid/).

{{< react-demo id="autocomplete/13-grid" layout="block" >}}

## Uso controlado

Con `value` + `onChange`, `inputValue` + `onInputChange` y `open` + `onOpen`/`onClose` el padre controla el estado; los métodos de la instancia vanilla pasan a ser cambios de estado (`value = 'matrix'`, `open()`, `clear()`, `setOptions()`, `disable()`) y `focus()` usa `inputRef`. `value` admite una opción, la clave de una opción (`'matrix'`) o, en `freeSolo`, un texto; `onChange` devuelve la opción.

{{< react-demo id="autocomplete/14-controlled" layout="block" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `options` | `T[]` | — | Textos u objetos `{ value, label, group?, disabled?, icon?, description? }` (o cualquier objeto con `getOptionLabel`). |
| `getOptionLabel` | `(option) => string` | `label` / `value` | Etiqueta visible. |
| `getOptionValue` | `(option) => string` | `value` / etiqueta | Clave única: inputs ocultos y comparación. |
| `isOptionEqualToValue` | `(option, value) => boolean` | comparación de claves | Igualdad entre opción y valor. |
| `getOptionDisabled` | `(option) => boolean` | `option.disabled` | Opción deshabilitada. |
| `groupBy` | `(option) => string` | `option.group` | Grupo de la opción (consecutivas). |
| `renderOption` | `(option, state) => ReactNode` | — | Contenido propio de cada opción (`state`: `index`, `selected`, `inputValue`). |
| `filterOptions` | `(options, state) => T[] \| false` | filtro sin tildes | Filtro propio; `false` no filtra ni resalta (filtrado en servidor). |
| `matchFrom` | `'any' \| 'start'` | `'any'` | Coincidencia en cualquier posición o al inicio. |
| `multiple` | `boolean` | `false` | Selección múltiple con chips. |
| `freeSolo` | `boolean` | `false` | Acepta valores fuera de la lista. |
| `value` / `defaultValue` | `T \| string \| null` (`array` con `multiple`) | — / `null` | Valor (controlado / no controlado): opción, clave de opción o texto libre. |
| `onChange` | `(event, value, reason, { option }) => void` | — | `reason`: `selectOption`, `createOption`, `removeOption`, `clear`, `blur`. |
| `inputValue` | `string` | — | Texto del campo (controlado). |
| `onInputChange` | `(event, text, reason) => void` | — | `reason`: `input`, `reset`, `clear`. |
| `debounce` | `number` | `0` | Ms de espera antes de notificar `input` (se ignora con `inputValue` controlado). |
| `open` | `boolean` | — | Popup abierto (controlado). |
| `onOpen` / `onClose` | `(event, reason) => void` | — | Apertura (`input`, `keyboard`, `toggleInput`, `focus`) y cierre (`escape`, `blur`, `selectOption`, `createOption`, `toggleInput`, `reset`, `disabled`). |
| `onHighlightChange` | `(event, option \| null, reason) => void` | — | Opción activa (`keyboard`, `mouse`, `auto`). |
| `limitTags` | `number` | `-1` | Chips visibles sin foco ("+N"). |
| `filterSelectedOptions` | `boolean` | `false` | Oculta las seleccionadas (múltiple). |
| `disableClearable` | `boolean` | `false` | Sin botón de limpiar. |
| `clearOnEscape` | `boolean` | `false` | <kbd>Esc</kbd> con la lista cerrada limpia. |
| `disableCloseOnSelect` | `boolean` | `false` | Mantiene la lista abierta al elegir (múltiple). |
| `openOnFocus` | `boolean` | `false` | Abre al enfocar. |
| `autoHighlight` | `boolean` | `false` | Activa la primera opción al filtrar. |
| `autoSelect` | `boolean` | `false` | <kbd>Tab</kbd>/pérdida de foco aceptan la opción activa. |
| `includeInputInList` | `boolean` | `false` | Las flechas vuelven al campo en los extremos. |
| `forcePopupIcon` | `boolean \| 'auto'` | `'auto'` | Botón de abrir (`auto`: oculto en `freeSolo`). |
| `disabled` / `readOnly` / `required` | `boolean` | `false` | Estados. |
| `loading` | `boolean` | `false` | CircularProgress y "Cargando…". |
| `loadingText` / `noOptionsText` | `ReactNode` | i18n | Textos de estado. |
| `variant` | `'outlined' \| 'filled' \| 'standard'` | `'outlined'` | Variante del campo. |
| `size` | `'medium' \| 'small'` | `'medium'` | 56px o 40px. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Color de foco y de selección. |
| `label` / `placeholder` | `ReactNode` / `string` | — | Label flotante; sin `label` el placeholder hace de label. |
| `helperText` / `error` | `ReactNode` / `boolean` | — | Texto de ayuda y estado de error (`aria-invalid`). |
| `startIcon` | `ReactNode` | — | Icono inicial. |
| `name` / `form` | `string` | — | Inputs ocultos. |
| `valueFormat` / `separator` | `'multiple' \| 'csv'` / `string` | `'multiple'` / `','` | Envío de valores múltiples. |
| `locale` | `string` | contexto | Idioma de los textos. |
| `id` | `string` | auto | Id del input; listbox, label y opciones derivan de él. |
| `autoFocus` | `boolean` | — | Enfoca al montar. |
| `inputRef` / `inputProps` | | — | Ref y atributos del `<input>`. |
| `aria-label`, `aria-labelledby`, `aria-describedby` | | — | Se aplican al combobox. |
| `popperClassName` | `string` | — | Clase extra del popup en el portal. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref al `<div>` raíz. |

`className`, `style` y cualquier otro atributo van al `<div>` raíz.

### Clases CSS

| Clase | Elemento |
| :--- | :--- |
| `.mtx-autocomplete` | Contenedor raíz. |
| `.mtx-autocomplete--open` / `--focused` / `--multiple` / `--loading` / `--disabled` / `--readonly` / `--required` | Estados. |
| `.mtx-autocomplete--has-clear` / `--has-popup` / `--has-end` | Reservan espacio para los botones finales. |
| `.mtx-autocomplete__field` | El `.mtx-text-field` (con sus variantes y tamaños). |
| `.mtx-autocomplete__input-root` | Caja del campo (`.mtx-text-field__container`). |
| `.mtx-autocomplete__input` | `<input role="combobox">`. |
| `.mtx-autocomplete__tag` / `__tag-more` | Chips y contador "+N". |
| `.mtx-autocomplete__end-adornment` | Contenedor de carga, limpiar y abrir. |
| `.mtx-autocomplete__loading-indicator`, `__indicator`, `__clear-indicator`, `__popup-indicator` | Botones finales. |
| `.mtx-autocomplete__popper` / `--{color}` | Superficie flotante (portal). |
| `.mtx-autocomplete__paper`, `__listbox`, `__status` | Paper, lista y mensaje de estado. |
| `.mtx-autocomplete__option`, `--focused`, `--disabled` | Opción y estados (`aria-selected="true"` en las elegidas). |
| `.mtx-autocomplete__option-icon`, `__option-content`, `__option-label`, `__option-description`, `__highlight` | Partes de la opción. |
| `.mtx-autocomplete__group`, `__group-label`, `__group-list` | Grupos. |
| `.mtx-autocomplete__values`, `__live` | Inputs ocultos y región viva. |

### Variables CSS

`--mtx-ac-accent` (la fija `color` en el popup), además de `--mtx-field-height-*`, `--mtx-elevation-8`, `--mtx-color-action-hover` y `--mtx-z-index-modal`.

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<input data-mtx="autocomplete" data-label="…" data-options="#list">` | `<Autocomplete label="…" options={[…]} />` |
| `<datalist>` / `<select>` / `data-options='[…]'` / `list` | `options` |
| `data-variant`, `data-size`, `data-color`, `data-start-icon` | `variant`, `size`, `color`, `startIcon` |
| `data-helper-text`, `data-error="…"` | `helperText`, `error` |
| `data-value` | `defaultValue` (o `value`) |
| `data-multiple`, `data-limit-tags`, `data-filter-selected-options`, `data-disable-close-on-select` | `multiple`, `limitTags`, `filterSelectedOptions`, `disableCloseOnSelect` |
| `data-free-solo`, `data-force-popup-icon` | `freeSolo`, `forcePopupIcon` |
| `data-auto-highlight`, `data-auto-select`, `data-clear-on-escape`, `data-open-on-focus`, `data-disable-clearable`, `data-match-from` | `autoHighlight`, `autoSelect`, `clearOnEscape`, `openOnFocus`, `disableClearable`, `matchFrom` |
| `data-filter="false"` | `filterOptions={false}` |
| `data-debounce` | `debounce` |
| `data-value-format`, `data-separator` | `valueFormat`, `separator` |
| `data-loading`, `data-loading-text`, `data-no-options-text` | `loading`, `loadingText`, `noOptionsText` |
| `disabled`, `readonly`, `required` | `disabled`, `readOnly`, `required` |
| `mtx:autocomplete:change` | `onChange(event, value, reason, { option })` |
| `mtx:autocomplete:input` | `onInputChange(event, text, reason)` |
| `mtx:autocomplete:open` / `close` | `onOpen` / `onClose` |
| `mtx:autocomplete:highlight` | `onHighlightChange` |
| `value = …`, `inputValue = …`, `setOptions()`, `loading = …` | Actualizar las props `value`, `inputValue`, `options` y `loading` |
| `open()` / `close()` / `clear()` | `open` + `onOpen`/`onClose`; `value={null}` |
| `disable()` / `enable()`, `setError()` | `disabled`, `error` + `helperText` |
| `focus()` / `blur()` | `inputRef.current.focus()` / `.blur()` |

## Accesibilidad

- Patrón WAI-ARIA 1.2 *combobox con listbox*: el foco permanece en el `<input role="combobox">` con `aria-autocomplete="list"`, `aria-expanded` (verdadero cuando hay opciones visibles), `aria-controls` (el listbox mientras está abierto) y `aria-activedescendant` (la opción activa).
- La lista es un `role="listbox"` nombrado por el label (`aria-labelledby`, o `aria-label` sin label), con `aria-multiselectable` en múltiple y `aria-busy` durante la carga; cada opción es un `role="option"` con `aria-selected` y `aria-disabled`. Los grupos usan `role="group"` nombrado por su cabecera.
- Una región viva `role="status"` anuncia "N resultados disponibles", "Sin opciones" o "Cargando…" tras filtrar.
- Los botones de limpiar y abrir/cerrar tienen `aria-label` traducido y quedan fuera del orden de tabulación (`tabindex="-1"`), como en MUI: todo se puede hacer con el teclado desde el campo.
- `aria-required`, `aria-readonly`, `aria-invalid` y `aria-describedby` (texto de ayuda) se sincronizan; `required` usa la validación nativa.
- Escape pasa por la pila común de capas: solo cierra la capa superior y no llega a un [Dialog](../dialog/) contenedor.
- Los chips se alcanzan con las flechas desde el campo (`tabindex="-1"`, fuera del orden de tabulación, como en MUI) y se eliminan con <kbd>Retroceso</kbd>/<kbd>Supr</kbd>.

| Tecla | Acción |
| :--- | :--- |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Abre la lista; abierta, mueve la opción activa (envuelve y salta las deshabilitadas). |
| <kbd>Av Pág</kbd> / <kbd>Re Pág</kbd> | Avanza o retrocede 5 opciones. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primera / última opción (con la lista abierta; no en free solo). |
| <kbd>Enter</kbd> | Selecciona la opción activa (en free solo, confirma el texto). |
| <kbd>Esc</kbd> | Cierra la lista; cerrada y con `clearOnEscape`, limpia. |
| <kbd>Tab</kbd> | Sale del campo (con `autoSelect`, acepta la opción activa). |
| <kbd>Retroceso</kbd> (campo vacío, múltiple) | Elimina el último chip. |
| <kbd>←</kbd> / <kbd>→</kbd> (múltiple) | Se mueve entre chips y vuelve al campo. |
