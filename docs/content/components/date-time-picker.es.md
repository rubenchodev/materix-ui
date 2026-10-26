---
title: "Date Time Picker"
description: "Selectores de fecha, hora, fecha y hora y rangos con calendario, reloj radial MD2, popover, modal o modo estático, límites y formatos."
group: "inputs"
icon: "event"
weight: 100
example: "date-time-picker"
import: "DateTimePicker"
mui: "https://mui.com/x/react-date-pickers/"
---

`DateTimePicker` es un único componente que cubre **DatePicker**, **TimePicker**, **DateTimePicker** y sus versiones de **rango** (los alias fijan el modo por ti). Pinta un [TextField](../text-field/) con máscara y un botón de icono final, y abre un calendario o un reloj. Sigue el patrón WAI-ARIA *Date Picker Dialog*: un diálogo accesible, una cuadrícula de días navegable con teclado y un reloj radial manejable con las flechas. Úsalo cuando la fecha o la hora deban ser válidas y fáciles de elegir; para una fecha que el usuario conoce de memoria (p. ej. la de nacimiento) puede bastar un TextField con `mask="date"`.

```tsx
import { DatePicker, TimePicker, DateTimePicker, DateRangePicker } from '@rubenchodev/materix-react';
// o solo este componente:
import { DatePicker } from '@rubenchodev/materix-react/components/date-time-picker';
```

## Uso básico

Elige el componente según el modo. Todas las props de TextField (`label`, `variant`, `size`, `helperText`, `startIcon`, `name`…) funcionan igual. El campo también admite escritura: se aplica una máscara acorde al formato y, según el modo, solo se permiten dígitos, separadores (`/ - .`), `:` y las letras de AM/PM.

{{< react-demo id="date-time-picker/01-basic" layout="block" >}}

| Componente | Modo | Icono final por defecto | Formato por defecto (`en` · `es`) |
| :--- | :--- | :--- | :--- |
| `DatePicker` | Fecha | `event` | `MM/DD/YYYY` · `DD/MM/YYYY` |
| `TimePicker` | Hora | `schedule` | `HH:mm` |
| `DateTimePicker` | Fecha y hora | `calendar_month` | `MM/DD/YYYY HH:mm` · `DD/MM/YYYY HH:mm` |
| `DateRangePicker` | Rango de fechas | `event` | `DD/MM/YYYY - DD/MM/YYYY` |
| `DateTimeRangePicker` | Rango de fecha y hora | `calendar_month` | Orden de fecha del locale + ` HH:mm` |
| `StaticDatePicker`, `StaticTimePicker`, `StaticDateTimePicker`, `StaticDateRangePicker` | Incrustado | — | — |

`<DateTimePicker mode="date" />` equivale a `DatePicker` (el `data-picker` de vanilla) y `range` activa el modo rango.

## Variantes

`variant`: `outlined` (por defecto), `filled` y `standard`, heredadas de TextField.

{{< react-demo id="date-time-picker/02-variants" layout="block" >}}

## Tamaños

Mediano 56px (por defecto) y pequeño 40px con `size="small"`. El campo pequeño alinea 1:1 con un Button mediano.

{{< react-demo id="date-time-picker/03-sizes" layout="block" >}}

## Con iconos

El icono final es un IconButton accesible (`aria-label="Elegir fecha"` más el valor actual, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`) que abre y cierra el selector. Depende del modo; cámbialo con `endIcon` y añade otro con `startIcon`.

{{< react-demo id="date-time-picker/04-icons" layout="block" >}}

## Estados

`helperText`, `error`, `required`, `disabled` y `readOnly`, igual que en TextField. Con `disabled` o `readOnly` el botón del calendario se deshabilita y el selector no se puede abrir.

{{< react-demo id="date-time-picker/05-states" layout="block" >}}

## Teclado y accesibilidad

Enfoca el botón del calendario y pulsa <kbd>Enter</kbd>, o escribe en el campo y pulsa <kbd>Alt</kbd>+<kbd>↓</kbd>: el foco pasa al día seleccionado (o a hoy). El mapa completo de teclas está en [Accesibilidad](#accesibilidad).

{{< react-demo id="date-time-picker/06-keyboard" layout="block" >}}

## Rangos

Los modos de rango eligen inicio y fin con dos clics en el mismo calendario (resaltando el tramo al pasar el ratón; un clic anterior al inicio los intercambia). En `DateTimeRangePicker`, tras elegir las fechas aparecen las pestañas de hora **Inicio** y **Fin** (09:00 y 18:00 por defecto); al soltar el reloj en los minutos de inicio se pasa a la hora de fin. `rangeSeparator` cambia el separador (`" - "` por defecto). El valor es `{ start, end }`.

{{< react-demo id="date-time-picker/07-ranges" layout="block" >}}

## Reloj y formato de 12 horas

La vista de hora se abre por defecto en modo teclado (tarjetas editables de hora y minuto, con <kbd>↑</kbd>/<kbd>↓</kbd>; <kbd>Enter</kbd> en los minutos aplica y cierra). Con `timeView="dial"` abre el reloj radial MD2; el botón inferior izquierdo alterna entre ambos. `ampm` (o un formato con `hh`/`A`) activa el formato de 12 horas con selector AM/PM. `views` (`['hours', 'minutes', 'seconds']`), `minutesStep`, `minTime` y `maxTime` se pasan al reloj.

{{< react-demo id="date-time-picker/08-time" layout="block" >}}

## Popover, modal y estático

- **Popover** (por defecto): se despliega bajo el campo (dentro del TextField, como en vanilla), se ancla a la derecha o se abre hacia arriba si no hay espacio. En pantallas de 600px o menos se muestra centrado sobre un fondo oscuro, con `aria-modal` y trampa de foco.
- **Modal** (`display="modal"`): un diálogo centrado con cabecera de color MD2 en cualquier tamaño de pantalla. Elegir un día lo aplica al momento (`onChange`) pero mantiene el diálogo abierto; Aceptar lo cierra.
- **Estático** (`displayStatic` o los alias `Static*`): calendario o reloj incrustado en la página, sin campo ni botones Cancelar/Aceptar; cada elección llama a `onChange`.

{{< react-demo id="date-time-picker/09-presentation" layout="block" >}}

## Límites, valor inicial y formato

`minDate` y `maxDate` deshabilitan los días fuera del intervalo; aceptan un `Date`, `YYYY-MM-DD`, el formato del propio campo o `today`/`hoy`. `shouldDisableDate(date)` deshabilita días concretos (se saltan al navegar con el teclado). `defaultValue` (no controlado) o `value` (controlado) aceptan un `Date`, un timestamp, texto ISO o texto en el formato activo.

Sin `format`, el orden de la fecha sale del locale (`en`/`en-US`: `MM/DD/YYYY`; `es`, `es-MX`, `en-GB`…: `DD/MM/YYYY`, resuelto con `Intl`). `format` define cómo se muestra y se escribe el valor (y deriva la máscara del campo). Tokens: `YYYY`/`AAAA` año, `YY` año corto, `MM` mes, `DD` día, `HH` hora 0-23, `hh` hora 1-12, `mm` minutos, `ss` segundos, `A` AM/PM y `a` am/pm. `mask` sustituye la máscara automática.

{{< react-demo id="date-time-picker/10-limits" layout="block" >}}

## Idioma y textos

Los textos (Hoy, Cancelar, Aceptar, nombres accesibles…) salen del sistema i18n de Materix: la prop `locale`, luego el [I18nProvider](../../guide/i18n/) y `<html lang>`. Los códigos regionales se reducen a su idioma base para los textos (`es-MX` → `es`) mientras que el código completo se usa con `Intl` (orden de fecha y nombres accesibles de los días). Meses y días de la semana salen del diccionario cuando el idioma está registrado y de `Intl.DateTimeFormat` en caso contrario (p. ej. `fr-FR`). `todayText`, `cancelText`, `okText` y `clearText` sustituyen los textos de los botones y `actions` elige los botones (`today`, `clear`, `cancel`, `accept`).

{{< react-demo id="date-time-picker/11-language" layout="block" >}}

## Grilla

Un formulario de reserva de sala en `Grid` que combina un rango de fechas, una hora, un Select y un Button. `name` va al `<input>`, así que el texto formateado se envía con el formulario.

{{< react-demo id="date-time-picker/12-grid" layout="block" >}}

## Uso programático

`value`/`onChange` lo hacen controlado; `open`/`onOpen`/`onClose` controlan el popover. La ref `action` equivale a los métodos de vanilla.

{{< react-demo id="date-time-picker/13-programmatic" layout="block" >}}

```tsx
const action = useRef<DateTimePickerActions>(null);
const [value, setValue] = useState<Date | null>(null);

<DateTimePicker
  label="Entrega"
  value={value}
  onChange={(next, detail) => setValue(next as Date | null)}   // detail.value, detail.iso, detail.time…
  onAccept={(next) => save(next)}                               // Aceptar, o una elección que cierra el selector
  onOpen={() => {}}
  onClose={(reason) => {}}                                      // accept | cancel | select | escapeKeyDown | clickaway…
  action={action}                                               // action.current.open() / close() / toggle() / clear()
/>
```

## DateCalendar independiente

`DateCalendar` es el calendario que usan los pickers: selección simple o de rango, vistas de meses y años (`view`/`onViewChange`), mes visible (`month`/`onMonthChange`), `minDate`, `maxDate` y `shouldDisableDate`. No tiene superficie propia: colócalo en un [Paper](../paper/) o una tarjeta.

{{< react-demo id="date-time-picker/14-calendar" layout="block" >}}

## Referencia de la API

### Props de DateTimePicker

Además de estas, las props de TextField van al campo (`label`, `variant`, `size`, `color`, `helperText`, `error`, `required`, `fullWidth`, `margin`, `startIcon`, `placeholder`, `name`, `id`, `inputRef`, `inputProps`, `className`, `style`…).

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `mode` | `'date' \| 'time' \| 'datetime'` | `'datetime'` | Modo (`data-picker`). Lo fijan los alias. |
| `range` | `boolean` | `false` | Selección de rango (`data-range`). |
| `value` | `Date \| string \| number \| null`, o `{ start, end }` | — | Valor (controlado). |
| `defaultValue` | ídem | — | Valor inicial (`data-value`). |
| `onChange` | `(value, detail) => void` | — | Cambio aplicado (`mtx:date-time-picker:change`). |
| `onAccept` | `(value, detail) => void` | — | Aceptar, o una elección que cierra el selector. |
| `open` / `defaultOpen` | `boolean` | — | Estado abierto (controlado / inicial). |
| `onOpen` / `onClose` | `() => void` / `(reason) => void` | — | `mtx:date-time-picker:open` / `:close`. |
| `format` | tokens | modo + locale | Formato de visualización y escritura (`data-format`). |
| `mask` | máscara de TextField | derivada | Sustituye la máscara automática (`data-mask`). |
| `locale` | BCP 47 | contexto | Idioma, nombres y orden de fecha por defecto (`data-locale`). |
| `ampm` | `boolean` | según el formato | Formato de 12 horas (`data-ampm`). |
| `minDate` / `maxDate` | `Date \| string` | — | Límites; aceptan `today` (`data-min`/`data-max`). |
| `shouldDisableDate` | `(date) => boolean` | — | Deshabilita días concretos. |
| `openTo` | `'day' \| 'month' \| 'year'` | `'day'` | Vista inicial del calendario. |
| `views` | `('hours' \| 'minutes' \| 'seconds')[]` | horas, minutos | Vistas del reloj. |
| `minTime` / `maxTime` / `minutesStep` | `Date` / `Date` / `number` | — | Límites y paso del reloj. |
| `timeView` | `'input' \| 'dial'` | `'input'` | Vista inicial de la hora (`data-time-view`; alias `clock`/`keyboard`). |
| `display` | `'popover' \| 'modal'` | `'popover'` | Presentación (`data-display`). |
| `displayStatic` | `boolean` | `false` | Selector incrustado (`data-static`). |
| `rangeSeparator` | `string` | `' - '` | Separador (`data-range-separator`). |
| `actions` | `('today' \| 'clear' \| 'cancel' \| 'accept')[]` | today, cancel, accept | Botones de la barra (estático: today). |
| `todayText` / `cancelText` / `okText` / `clearText` | `ReactNode` | i18n | Textos de los botones. |
| `endIcon` | `string` | según el modo | Icono del botón de apertura (`data-end-icon`). |
| `disabled` / `readOnly` | `boolean` | `false` | Deshabilita el campo y el botón. En estático, `disabled` lo vuelve `inert`. |
| `action` | `Ref<DateTimePickerActions>` | — | `open({ focus })`, `close(focusInput)`, `toggle()`, `clear()`. |

### Detalle de onChange

`{ value, date, dateTime, time, iso, isRange, startDate, endDate, range: { start, end } }`, igual que el `detail` de vanilla (sin `picker`). `onChange` se llama una vez por selección aplicada: un día en modo fecha, el fin del rango, cada cambio de hora, Hoy, Aceptar, escribir un valor completo y válido, o vaciar el campo. En un rango completo, `date`, `dateTime` e `iso` corresponden al fin del rango, como en vanilla.

{{< callout type="warning" >}}
**Cancelar cierra sin deshacer los cambios ya emitidos.** Como en vanilla, cada cambio aplicado llama a `onChange` al momento (un día en el modal, cada hora o minuto), así que Cancelar solo descarta lo que aún no se aplicó (por ejemplo, el día elegido en `DateTimePicker` antes de elegir la hora). Borrar llama a `onChange` y `onAccept` con `null`.
{{< /callout >}}

En modo controlado el campo siempre muestra `value`: si el padre ignora `onChange`, el campo y el calendario vuelven a `value`.

### Props de DateCalendar

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `value` / `defaultValue` / `onChange(date)` | `Date \| null` | Selección simple. |
| `range`, `rangeValue` / `defaultRangeValue` / `onRangeChange(range, { complete })` | `{ start, end }` | Selección de rango. |
| `view` / `defaultView` / `onViewChange` | `'day' \| 'month' \| 'year'` | Vista activa. |
| `month` / `onMonthChange` / `referenceDate` | `Date` | Mes visible. |
| `minDate`, `maxDate`, `shouldDisableDate` | — | Días deshabilitados. |
| `disabled`, `readOnly`, `locale`, `autoFocus` | — | Estado, idioma y foco inicial. |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-picker-popover` / `--open` | Contenedor flotante (modo popover), dentro del TextField. |
| `mtx-picker-backdrop-mobile` / `--open` | Fondo oscuro del popover en pantallas ≤ 600px. |
| `mtx-picker-backdrop` / `--open`, `mtx-picker-dialog` | Modo modal. |
| `mtx-picker-static` / `--disabled` | Selector incrustado. |
| `mtx-picker-header` (`__year`, `__date`) | Cabecera de color (modal y estático). |
| `mtx-picker-tabs` / `mtx-picker-tab` / `--active` | Pestañas Fecha/Hora (o Fechas/Inicio/Fin). |
| `mtx-picker-tabs--range`, `mtx-picker-tab__text`, `mtx-picker-tab__time`, `mtx-picker-tab__paren` | **Solo React** (`picker-tabs.css`): pestañas de rango. En pantallas ≤ 600px la hora pasa a una segunda línea para que las tres pestañas quepan sin scroll horizontal (en vanilla la pestaña Fin queda cortada a 390px). Divergencia de CSS justificada; el resto del CSS llega sin cambios de `@rubenchodev/materix-ui`. |
| `mtx-picker-content`, `mtx-picker-actions`, `mtx-picker-icon-btn` | Área de la vista, barra de botones y conmutador teclado/reloj. |
| `mtx-date-picker` (`__nav`, `__title`, `__nav-btn`, `__grid`, `__weekday`, `__week`, `__day-cell`, `__day`) | Calendario. |
| `mtx-date-picker__day--today` / `--selected` / `--outside` / `--disabled` | Estados del día. |
| `mtx-date-picker__day--range-start` / `--range-end` / `--in-range` / `--range-preview` | Estados de rango (también en `__day-cell`). |
| `mtx-date-picker__months` / `__month`, `mtx-date-picker__years` / `__year` (`--selected`) | Vistas de meses y años. |
| `mtx-time-picker` (`__digit-card`, `__clock`, `__hand`, `__number`, `__ampm-stack`…) | Vista de hora. |

### Variables CSS

Sin variables propias: usa los tokens globales `--mtx-color-primary`, `--mtx-color-primary-contrast`, `--mtx-color-background-paper`, `--mtx-color-action-*`, `--mtx-elevation-*`, `--mtx-backdrop-bg`, `--mtx-z-index-modal`, `--mtx-duration-*` y `--mtx-shape-radius`.

## Accesibilidad

- **Campo**: un TextField con `<label for>`, máscara y `aria-describedby`. Un clic en el campo abre el selector sin robar el foco; <kbd>Alt</kbd>+<kbd>↓</kbd> (o <kbd>↓</kbd> con él abierto) mueve el foco dentro.
- **Botón**: `aria-label` (*Elegir fecha*, *Elegir hora*, *Elegir fecha y hora*, *Elegir rango de fechas*, más el valor actual), `aria-haspopup="dialog"`, `aria-expanded` y `aria-controls`. Se deshabilita junto con el campo.
- **Diálogo**: `role="dialog"` con `aria-label` traducido; el modal (y el popover en pantallas ≤ 600px) añade `aria-modal="true"` y atrapa <kbd>Tab</kbd>. Al abrir, el foco va al día seleccionado o a hoy; <kbd>Esc</kbd> lo cierra (solo si es la capa superior) y devuelve el foco. En modo popover, salir con Tab lo cierra; solo hay un selector abierto a la vez.
- **Calendario**: `role="grid"` etiquetado por el título de mes/año (`aria-live`), celdas `columnheader` con el nombre completo del día y una `row` por semana. Cada día es un `gridcell` con `aria-label` completo (*martes, 20 de octubre de 2026* con `es-MX`), `aria-selected`, `aria-current="date"` para hoy y `aria-disabled`. `tabindex` itinerante; los días deshabilitados se saltan.
- **Meses y años**: `role="radiogroup"` con opciones `radio`, `aria-checked` y `tabindex` itinerante.
- **Reloj**: `role="slider"` con `aria-valuemin`/`max`/`now` y `aria-valuetext`; tarjetas y AM/PM exponen `aria-label` y `aria-pressed`; las pestañas siguen el patrón Tabs.

| Tecla | Contexto | Acción |
| :--- | :--- | :--- |
| <kbd>Alt</kbd>+<kbd>↓</kbd> | Campo | Abre el selector y enfoca el día seleccionado (o hoy). |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Botón del calendario | Abre o cierra el selector. |
| <kbd>←</kbd> / <kbd>→</kbd> | Cuadrícula | Día anterior / siguiente (cambia de mes si hace falta). |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Cuadrícula | Mismo día de la semana anterior / siguiente. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Cuadrícula | Primer / último día de la semana. |
| <kbd>RePág</kbd> / <kbd>AvPág</kbd> | Cuadrícula | Mismo día del mes anterior / siguiente (<kbd>Mayús</kbd>: año). |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Día, mes o año | Lo selecciona. |
| Flechas, <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Vista de meses / años | Recorre las opciones (3 por fila). |
| Flechas, <kbd>RePág</kbd> / <kbd>AvPág</kbd> | Reloj | ±1 hora o minuto; ±5 minutos. |
| <kbd>Enter</kbd> | Reloj | Horas → minutos (inicio → fin en rangos). |
| <kbd>←</kbd> / <kbd>→</kbd> | Pestañas Fecha/Hora | Cambia de pestaña. |
| <kbd>Esc</kbd> | Diálogo | Cierra y devuelve el foco al botón o al campo. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `data-mtx="date-picker"`, `time-picker`, `datetime-picker`, `date-range-picker`, `datetime-range-picker` | `DatePicker`, `TimePicker`, `DateTimePicker`, `DateRangePicker`, `DateTimeRangePicker` |
| `data-picker`, `data-range` | `mode`, `range` |
| `data-static` | `displayStatic` / `Static*` |
| `data-display="modal"` | `display="modal"` |
| `data-format`, `data-mask`, `data-ampm`, `data-locale` | `format`, `mask`, `ampm`, `locale` |
| `data-min`, `data-max`, `min`/`max` del input | `minDate`, `maxDate` (+ `shouldDisableDate`) |
| `data-value`, `data-default-value` | `defaultValue` (o `value`) |
| `data-time-view`, `data-time-mode` | `timeView` |
| `data-range-separator` | `rangeSeparator` |
| `data-today-text`, `data-cancel-text`, `data-ok-text` | `todayText`, `cancelText`, `okText` |
| `data-end-icon` | `endIcon` |
| `setDate()`, `setDateTime()`, `setTime()`, `setRange()`, `setValue()` | `value` (controlado) |
| `getDate()`, `getTime()`, `getRange()`, `getISOString()` | `onChange(value, detail)` (`detail.value`, `.time`, `.range`, `.iso`) |
| `open()`, `close()`, `toggle()`, `clear()` | `action.current.*` u `open` |
| `DateTimePicker.closeAll()` | No hace falta: abrir un selector cierra el que ya estaba abierto (solo uno a la vez); cierra uno concreto con `open={false}` o `action.current.close()`. |
| `disable()` / `enable()` | `disabled` |
| `mtx:date-time-picker:change` / `:open` / `:close` | `onChange` / `onOpen` / `onClose` (+ `onAccept`) |
