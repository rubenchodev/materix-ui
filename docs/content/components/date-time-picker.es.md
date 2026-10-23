---
title: "Date Time Picker"
description: "Selectores de fecha, hora, fecha y hora y rangos con calendario, reloj radial MD2, popover, modal o modo estático, límites y formatos."
group: "inputs"
icon: "event"
weight: 100
example: "date-time-picker"
mui: "https://mui.com/x/react-date-pickers/"
---

`DateTimePicker` es una única clase que cubre **DatePicker**, **TimePicker**, **DateTimePicker** y sus versiones de **rango**. Se declara sobre un `<input>`, que se convierte en un [TextField](../text-field/) con máscara y un botón de icono final, y abre un calendario o un reloj al hacer clic. Sigue el patrón WAI-ARIA *Date Picker Dialog*: diálogo accesible, rejilla de días navegable con teclado y reloj radial manejable con las flechas. Úsalo cuando la fecha u hora deba ser válida y cómoda de elegir; para una fecha que el usuario conoce de memoria (p. ej. nacimiento) un TextField con `data-mask="date"` puede ser suficiente.

## Uso básico

El modo se elige con el valor de `data-mtx`. Todos los atributos de TextField (`data-label`, `data-variant`, `data-size`, `data-helper-text`, `data-start-icon`…) funcionan igual.

{{< mtx-demo title="Fecha, hora y fecha con hora" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="date-picker" data-label="Fecha de entrega" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="time-picker" data-label="Hora de la cita" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="datetime-picker" data-label="Reunión" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

| `data-mtx` | Modo | Icono final por defecto | Formato por defecto (`en` · `es`) |
| :--- | :--- | :--- | :--- |
| `date-picker` (alias `datepicker`) | Fecha | `event` | `MM/DD/AAAA` · `DD/MM/AAAA` |
| `time-picker` (alias `timepicker`) | Hora | `schedule` | `HH:mm` |
| `date-time-picker` (alias `datetime-picker`, `datetimepicker`) | Fecha y hora | `calendar_month` | `MM/DD/AAAA HH:mm` · `DD/MM/AAAA HH:mm` |
| `date-range-picker` (alias `daterangepicker`) | Rango de fechas | `event` | `MM/DD/AAAA - MM/DD/AAAA` · `DD/MM/AAAA - DD/MM/AAAA` |
| `datetime-range-picker` (alias `datetimerangepicker`) | Rango de fecha y hora | `calendar_month` | Orden de fecha del locale + ` HH:mm` |

`date-time-picker` (igual que el slug del componente) y `datetime-picker` son equivalentes. `data-picker="date|time|datetime"` tiene prioridad sobre el nombre de `data-mtx`: p. ej. `<input data-mtx="date-time-picker" data-picker="date">` es un selector solo de fecha.

El campo acepta también escritura directa: se aplica una máscara acorde al formato y solo se permiten dígitos, separadores (`/ - .`), `:` y las letras de AM/PM según el modo.

## Variantes

`data-variant`: `outlined` (predeterminada), `filled` y `standard`, heredadas de TextField.

{{< mtx-demo title="Variantes" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="date-picker" data-label="Outlined" data-variant="outlined" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="date-picker" data-label="Filled" data-variant="filled" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="date-picker" data-label="Standard" data-variant="standard" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Tamaños

Medium 56px (predeterminado) y small 40px con `data-size="small"`.

{{< mtx-demo title="Medium 56px y small 40px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="Medium · 56px" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="time-picker" data-label="Small · 40px" data-size="small" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Con iconos

El icono final se renderiza como un IconButton accesible (`aria-label="Elegir fecha"`, `aria-haspopup="dialog"`, `aria-expanded`) que abre y cierra el selector. Se elige según el modo, pero puedes cambiarlo con `data-end-icon` y añadir otro con `data-start-icon`.

{{< mtx-demo title="Iconos personalizados" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="Check-in" data-start-icon="hotel" data-end-icon="calendar_today" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="time-picker" data-label="Alarma" data-end-icon="alarm" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Estados

Texto de ayuda (`data-helper-text`), error (`data-error="mensaje"`), requerido (`required`), deshabilitado (`disabled`) y solo lectura (`readonly`), igual que en TextField. Con `disabled` o `readonly` el botón del calendario queda deshabilitado y el selector no se abre; `disable()`/`enable()` hacen lo mismo desde JavaScript.

{{< mtx-demo title="Ayuda, error, requerido, deshabilitado y solo lectura" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Inicio" data-helper-text="DD/MM/AAAA" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Vencimiento" data-error="La fecha ya pasó" value="2020-01-01" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="time-picker" data-label="Hora" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Bloqueado" value="2026-08-15" disabled type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Emitida" data-value="2026-03-02" readonly type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Rangos

Los modos de rango eligen inicio y fin con dos clics en el mismo calendario (resaltando la franja al pasar el ratón). En `datetime-range-picker`, tras elegir las fechas aparecen las pestañas de hora de inicio y fin. `data-range-separator` cambia el separador (por defecto `" - "`).

{{< mtx-demo title="Rango de fechas y de fecha y hora" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="date-range-picker" data-label="Estancia" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="datetime-range-picker" data-label="Ventana de mantenimiento" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Reloj y formato de 12 horas

El selector de hora abre por defecto en modo teclado (tarjetas de hora y minuto editables, con <kbd>↑</kbd>/<kbd>↓</kbd>). Con `data-time-view="dial"` (alias `data-time-mode`, valor `clock`) abre el reloj radial MD2; el botón inferior izquierdo alterna entre ambos. `data-ampm` (o un formato con `hh`/`A`) activa el formato de 12 horas con selector AM/PM.

{{< mtx-demo title="Teclado, reloj y AM/PM" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="time-picker" data-label="Teclado · 24 h" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="time-picker" data-label="Reloj · 12 h" data-time-view="dial" data-ampm type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="datetime-picker" data-label="Cita médica" data-format="DD/MM/AAAA hh:mm A" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Popover, modal y estático

- **Popover** (predeterminado): se despliega bajo el campo, se ancla a la derecha o se abre hacia arriba si no cabe. En pantallas de 600px o menos se muestra centrado sobre un fondo oscuro.
- **Modal** (`data-display="modal"`): diálogo centrado con cabecera de color MD2 en cualquier tamaño de pantalla.
- **Estático** (`data-static` sobre un `<div>`): calendario o reloj incrustado en la página, sin campo ni botones Aceptar/Cancelar; cada elección emite `mtx:date-time-picker:change`.

{{< mtx-demo title="Modal" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="Fecha (modal)" data-display="modal" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="datetime-picker" data-label="Fecha y hora (modal)" data-display="modal" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Estático" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <div data-mtx="date-picker" data-static data-locale="es"></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <div data-mtx="time-picker" data-static data-time-view="dial"></div>
  </div>
</div>
{{< /mtx-demo >}}

## Límites y valor inicial

`data-min` y `data-max` (o `min`/`max`) deshabilitan los días fuera del intervalo; aceptan `AAAA-MM-DD` (recomendado), el formato del propio campo u `hoy`/`today`. El valor inicial se indica con `value`, `data-value` o `data-default-value` (ISO o formato activo); se muestra con el formato activo y el label flota sobre él desde el inicio.

{{< mtx-demo title="Min/max y valor inicial" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="Solo 2026" data-min="2026-01-01" data-max="2026-12-31" data-helper-text="Entre el 01/01/2026 y el 31/12/2026" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="Desde hoy" data-min="today" data-value="2026-12-24" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Formato

Sin `data-format`, el orden de la fecha sale del locale (`en`/`en-US`: `MM/DD/AAAA`; `es`, `es-MX`, `en-GB`…: `DD/MM/AAAA`, resuelto con `Intl`), siempre con `/` como separador. `data-format` define cómo se muestra y escribe el valor (y deriva la máscara del campo); el texto escrito se interpreta en ese mismo orden. Tokens: `YYYY`/`AAAA` año, `YY` año corto, `MM` mes, `DD` día, `HH` hora 0-23, `hh` hora 1-12, `mm` minutos, `ss` segundos, `A` AM/PM y `a` am/pm. Si necesitas otra máscara, `data-mask` la sustituye.

{{< mtx-demo title="Formatos" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="ISO" data-format="YYYY-MM-DD" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="datetime-picker" data-label="ISO con hora" data-format="YYYY-MM-DD HH:mm" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Idioma y textos

Los textos (Hoy, Cancelar, Aceptar, nombres accesibles…) salen del sistema de i18n de Materix: el locale se resuelve con `data-locale`/`data-lang` en el campo o un ancestro, después con `lang` del ancestro o de `<html>` y por último con `Materix.setLocale()`. Los códigos regionales se reducen a su idioma base para los textos (`es-MX` → `es`) y el código completo se usa con `Intl` (orden de la fecha y nombres accesibles de los días). Meses y días salen del diccionario i18n cuando el idioma está registrado (`en`, `es` o uno añadido con `Materix.addLocale()`) y de `Intl.DateTimeFormat` en otro caso (p. ej. `fr-FR`); un locale local no registrado no cambia el idioma de los textos, que sigue a `Materix.setLocale()` o a `<html lang>`. `data-today-text`, `data-cancel-text` y `data-ok-text` sustituyen los textos de los botones.

{{< mtx-demo title="Locale, región y textos de botones" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Fecha (es-MX)" data-locale="es-MX" data-value="2026-10-20" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Date (en-US)" data-locale="en-US" data-value="2026-10-20" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Date (fr-FR, Intl)" data-locale="fr-FR" data-value="2026-10-20" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="English" data-locale="en" data-today-text="Now" data-ok-text="Done" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Reserva de una sala: rango de fechas, hora de inicio y duración en una grilla.

{{< mtx-demo title="Reserva" layout="block" >}}
<form data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="date-range-picker" data-label="Días" data-min="today" data-locale="es" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="time-picker" data-label="Hora de inicio" data-ampm required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <select data-mtx="select" data-label="Duración">
      <option value="60">1 hora</option>
      <option value="120">2 horas</option>
      <option value="240">Media jornada</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12">
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Reservar</button>
  </div>
</form>
{{< /mtx-demo >}}

## Sintaxis BEM completa

El picker se monta sobre la estructura de TextField. En marcado manual escribe el TextField completo y pon `data-mtx` en el contenedor; el componente genera el popover dentro de él.

```html
<div class="mtx-text-field mtx-text-field--outlined" data-mtx="date-picker">
  <label class="mtx-text-field__label" for="due">Vencimiento</label>
  <div class="mtx-text-field__container">
    <input class="mtx-text-field__input" id="due" type="text" placeholder=" " />
    <span class="mtx-text-field__adornment mtx-text-field__adornment--end material-icons" aria-hidden="true">event</span>
  </div>
</div>
<!-- Generado al abrir: div.mtx-picker-popover > .mtx-picker-content > .mtx-date-picker … + .mtx-picker-actions -->
```

## Uso programático

```javascript
const input = document.getElementById('entrega');
const picker = Materix.getInstance(input);        // o Materix.init(input, 'date-picker')
// const picker = new Materix.DateTimePicker(input);  (alias: DatePicker, TimePicker, DateRangePicker, DateTimeRangePicker)

picker.open();                  // mueve el foco al día seleccionado (o a hoy)
picker.open({ focus: false });  // mantiene el foco en el campo
picker.close(true);             // true devuelve el foco al botón o campo que lo abrió
picker.toggle();
picker.disable();               // campo + botón del calendario deshabilitados; picker.disabled === true
picker.enable();
picker.destroy();               // retira listeners, popover y backdrops (o Materix.destroy(input))
Materix.DateTimePicker.closeAll();

picker.setDate('2026-12-25');            // Date, timestamp, 'AAAA-MM-DD' o texto en el formato activo
picker.setDateTime('2026-12-25 20:30');
picker.setTime({ hours: 9, minutes: 15 });
picker.setRange('2026-10-01', '2026-10-15');
picker.clear();

picker.getDate();               // Date | null
picker.getDate(true);           // "25/12/2026" (es) · "12/25/2026" (en)
picker.getDate('YYYY-MM-DD');   // "2026-12-25"
picker.getDateTime('iso');      // "2026-12-25T…Z"
picker.getTime();               // "20:30" (o "08:30 PM" en modo AM/PM)
picker.getRange(true);          // { start: "01/10/2026", end: "15/10/2026", value: "01/10/2026 - 15/10/2026" }

input.addEventListener('mtx:date-time-picker:change', (e) => console.log(e.detail.value, e.detail.iso));
```

```javascript
import { DateTimePicker, DatePicker, TimePicker } from 'materix-ui';
```

{{< mtx-demo title="API en vivo" >}}
<input id="doc-picker-api" data-mtx="datetime-picker" data-label="Entrega" type="text" />
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-picker="open">open()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-picker="set">setDateTime('2026-12-25 20:00')</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-picker="now">setDateTime(new Date())</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-picker="clear">clear()</button>
<output id="doc-picker-out">Sin valor</output>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('doc-picker-api');
  const out = document.getElementById('doc-picker-out');
  if (!input || !window.Materix) return;
  const picker = Materix.getInstance(input);
  if (!picker) return;
  input.addEventListener('mtx:date-time-picker:change', (e) => { out.textContent = 'mtx:date-time-picker:change → ' + (e.detail.value || '(vacío)') + (e.detail.iso ? ' · ' + e.detail.iso : ''); });
  document.querySelectorAll('[data-doc-picker]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const action = btn.getAttribute('data-doc-picker');
      if (action === 'open') picker.open();
      if (action === 'set') picker.setDateTime('2026-12-25 20:00');
      if (action === 'now') picker.setDateTime(new Date());
      if (action === 'clear') picker.clear();
    });
  });
});
</script>

{{< callout type="tip" >}}
Llama a `open()` desde un botón con `event.stopPropagation()`: el picker se cierra al detectar un clic fuera de él, y el mismo clic que lo abre llegaría al documento.
{{< /callout >}}

## Referencia de API

### Atributos data-*

Además de los de [TextField](../text-field/#atributos-data-) (`data-label`, `data-variant`, `data-size`, `data-color`, `data-start-icon`, `data-end-icon`, `data-helper-text`, `data-error`), se leen en el `<input>` o en el contenedor:

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `date-picker` \| `time-picker` \| `date-time-picker` \| `datetime-picker` \| `date-range-picker` \| `datetime-range-picker` (y alias sin guion) | — | Inicializa el componente y fija el modo. |
| `data-range` | booleano | — | Activa el modo rango aunque `data-mtx` no lo indique. |
| `data-picker` | `date` \| `time` \| `datetime` | — | Fuerza el modo con prioridad sobre el nombre de `data-mtx` (p. ej. `date-time-picker` + `date` = solo fecha). |
| `data-range-separator` | texto | `" - "` | Separador entre inicio y fin. |
| `data-format` | tokens | modo + locale | Formato de visualización y escritura (ver *Formato*). |
| `data-mask` | máscara de TextField | derivada del formato | Sustituye la máscara automática. |
| `data-ampm` | booleano \| `false` | `false` | Formato de 12 horas con AM/PM. |
| `data-time-view` | `input` \| `dial` \| `clock` | `input` | Vista inicial de la hora: teclado o reloj radial. Alias `data-time-mode`. |
| `data-display` | `popover` \| `modal` | `popover` | Presentación del selector. |
| `data-static` | booleano | — | En un `<div>`, renderiza el selector incrustado. |
| `data-min` | fecha | — | Fecha mínima (`AAAA-MM-DD`, el formato activo, `today`/`hoy`). También `min`. |
| `data-max` | fecha | — | Fecha máxima. También `max`. |
| `data-value` | fecha/hora | `value` del input | Valor inicial. También `data-default-value`. |
| `data-locale` | código BCP 47 (`en`, `es-MX`, `fr-FR`…) | `lang` / locale global | Idioma de textos, nombres y orden de fecha por defecto. Alias `data-lang`. |
| `data-today-text` | texto | i18n | Texto del botón "Hoy". |
| `data-cancel-text` | texto | i18n | Texto del botón "Cancelar". |
| `data-ok-text` | texto | i18n | Texto del botón "Aceptar". |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-picker-popover` / `--open` | Contenedor flotante (modo popover). |
| `mtx-picker-backdrop-mobile` / `--open` | Fondo oscuro del popover en pantallas ≤ 600px. |
| `mtx-picker-backdrop` / `--open` | Fondo del modo modal. |
| `mtx-picker-dialog` | Diálogo del modo modal. |
| `mtx-picker-static` / `--disabled` | Selector incrustado (y su estado deshabilitado). |
| `mtx-picker-header` | Cabecera de color (modal y estático). |
| `mtx-picker-header__year` / `__date` / `__time` / `__time-unit` / `__ampm-group` / `__ampm-btn` | Partes de la cabecera. |
| `mtx-picker-tabs` / `mtx-picker-tab` / `--active` | Pestañas Fecha/Hora (o Fechas/Inicio/Fin en rango). |
| `mtx-picker-content` | Área de la vista activa. |
| `mtx-picker-actions` | Barra de botones (Hoy, Cancelar, Aceptar). |
| `mtx-picker-icon-btn` | Botón para alternar teclado/reloj. |
| `mtx-date-picker` | Calendario. |
| `mtx-date-picker__nav` / `__nav-group` / `__nav-btn` / `__title-group` / `__title` | Navegación de mes y año. |
| `mtx-date-picker__weekdays` / `__weekday` | Cabecera de días. |
| `mtx-date-picker__grid` / `__days` / `__week` / `__day-cell` / `__day` | Rejilla de días (`role="grid"` › `rowgroup` › `row` › `gridcell`). |
| `mtx-date-picker__day--today` / `--selected` / `--outside` / `--disabled` | Estados del día. |
| `mtx-date-picker__day--range-start` / `--range-end` / `--in-range` / `--range-preview` | Estados del rango (también en `__day-cell`). |
| `mtx-date-picker__months` / `__month` / `--selected` | Vista de meses. |
| `mtx-date-picker__years` / `__year` / `--selected` | Vista de años. |
| `mtx-time-picker` | Selector de hora. |
| `mtx-time-picker__digit-card` / `--active` / `--input` | Tarjetas de hora y minuto. |
| `mtx-time-picker__clock` / `__hand` / `__pointer` / `__center` / `__number` / `--selected` | Reloj radial. |
| `mtx-time-picker__ampm-stack` / `__ampm-opt` / `--active` | Selector AM/PM. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `open(options?)` | `void` | Abre el selector (cierra cualquier otro abierto) y enfoca el día seleccionado u hoy; `{ focus: false }` mantiene el foco en el campo. No hace nada si está deshabilitado o es de solo lectura. |
| `close(focusInput = false)` | `void` | Cierra; con `true` devuelve el foco al botón o campo que lo abrió. |
| `toggle()` | `void` | Alterna abierto/cerrado. |
| `DateTimePicker.closeAll(focusInput)` *(estático)* | `void` | Cierra el picker abierto en la página. |
| `getDate(format?)` | `Date` \| `string` \| `null` | Sin argumento, `Date`; `true`, texto con el formato; `'iso'`, ISO 8601; un patrón, texto con ese patrón. |
| `getDateTime(format?)` | `Date` \| `string` \| `null` | Igual que `getDate`, con `true` = orden de fecha del locale + `HH:mm` (`hh:mm A` en modo AM/PM). |
| `getTime(asObject?)` | `string` \| `object` \| `null` | `"HH:mm"` (o `"hh:mm AM"`); con `true`, `{ hours, minutes[, ampm] }`. En rango, inicio y fin. |
| `getISOString()` | `string` \| `null` | Fecha en ISO 8601 (UTC). |
| `getValue()` | `string` | Texto actual del campo. |
| `getRange(format?)` | `object` | `{ start, end }` como `Date`; `true` → textos y `value`; `'iso'` → ISO. |
| `setDate(date)` | `this` | Asigna fecha (`Date`, timestamp o texto). `null`/`''` limpia. |
| `setDateTime(dateTime)` | `this` | Alias de `setDate`. |
| `setTime(time)` | `this` | Asigna la hora (`'HH:mm'`, `'hh:mm PM'`, `{ hours, minutes }` o `Date`). |
| `setValue(value)` | `this` | Alias de `setDate`. |
| `setRange(start, end)` | `this` | Asigna un rango (acepta también `{ start, end }`; ordena si vienen invertidos). |
| `clear()` | `this` | Vacía la selección y el campo. |
| `date` / `dateTime` / `time` / `value` / `range` (get/set) | — | Atajos de los métodos anteriores. |
| `isoString` / `isRange` (get) | `string` / `boolean` | ISO actual / si está en modo rango. |
| `disable()` / `enable()` / `disabled` (get) | `void` / `boolean` | Deshabilita o habilita el campo y el botón del calendario (cierra el selector). En modo estático, deshabilita el selector incrustado. |
| `destroy()` | `void` | Libera los listeners de document/window, el popover, los backdrops movidos a `<body>` y el registro. |

### Eventos

Cada evento se emite **una sola vez** por acción en el `<input>` (burbujea al contenedor del TextField y a sus ancestros); en modo estático, en el contenedor.

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `mtx:date-time-picker:change` | `{ value, date, dateTime, time, iso, isRange, startDate, endDate, range: { start, end }, picker }` | Se aplica una selección (Aceptar, día en modo fecha, Hoy, teclado en el reloj, `set*()` o `clear()`). |
| `mtx:date-time-picker:open` | `{ picker }` | Se abre el selector. |
| `mtx:date-time-picker:close` | `{ picker }` | Se cierra el selector. |
| `input` / `change` | — (nativos) | El valor del `<input>` cambia por una selección o por escritura. |

{{< callout type="warning" >}}
**Obsoletos:** `mtx:change`, `mtx:open` y `mtx:close` se siguen emitiendo justo después de cada evento canónico, con el mismo `detail`, hasta la 1.0. Migra a `mtx:date-time-picker:*`. Desde esta versión `mtx:change` ya no se duplica: un listener en el contenedor recibe un único evento por selección.
{{< /callout >}}

### Variables CSS

Sin variables propias: usa los tokens globales `--mtx-color-primary`, `--mtx-color-primary-contrast`, `--mtx-color-background-paper`, `--mtx-color-primary-light`, `--mtx-color-action-*`, `--mtx-elevation-*`, `--mtx-backdrop-bg`, `--mtx-z-index-modal`, `--mtx-duration-*`, `--mtx-easing-*`, `--mtx-shape-radius` y las alturas de TextField. Los resaltados de rango se derivan de `--mtx-color-primary` con `color-mix()`, por lo que siguen el tema activo.

## Accesibilidad

Materix implementa el patrón WAI-ARIA [Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/):

- **Campo**: un TextField con `<label for>`, máscara y `aria-describedby`; escribir sigue siendo la vía más rápida. El clic en el campo abre el selector sin robar el foco; <kbd>Alt</kbd>+<kbd>↓</kbd> (o <kbd>↓</kbd> con el selector abierto) mueve el foco dentro.
- **Botón**: el icono final es un `<button>` con `aria-label="Elegir fecha"` (o *Elegir hora*, *Elegir fecha y hora*, *Elegir rango de fechas*, más el valor actual), `aria-haspopup="dialog"`, `aria-expanded` y `aria-controls`. Se deshabilita junto con el campo (`disabled`/`readonly`).
- **Diálogo**: el popover y el modal son `role="dialog"` con `aria-label` traducido; el modal (y el popover en pantallas ≤ 600px) añade `aria-modal="true"` y atrapa el foco con <kbd>Tab</kbd>. Al abrir, el foco va al día seleccionado u hoy; <kbd>Esc</kbd> cierra y devuelve el foco al botón o campo que lo abrió. En modo popover, salir con <kbd>Tab</kbd> lo cierra.
- **Calendario**: `role="grid"` etiquetado por el título de mes/año (región `aria-live`), con `columnheader` con el nombre completo del día y una `row` por semana. Cada día es un `gridcell` con `aria-label` completo (*martes, 20 de octubre de 2026*; *Tuesday, October 20, 2026* en inglés), `aria-selected`, `aria-current="date"` para hoy y `aria-disabled` fuera de `min`/`max`. Solo un día está en el orden de tabulación (roving `tabindex`); los días deshabilitados se saltan al navegar.
- **Meses y años**: `role="radiogroup"` con opciones `radio`, `aria-checked` y roving `tabindex`.
- **Reloj**: `role="slider"` con `aria-label` (*Seleccionar horas* / *Seleccionar minutos*), `aria-valuemin`/`max`/`now` y `aria-valuetext` (*10 horas*, *45 minutos*); los números son `aria-hidden`. Las tarjetas de hora/minuto y los botones AM/PM exponen `aria-label` y `aria-pressed`; las pestañas Fecha/Hora siguen el patrón Tabs.
- El foco visible usa `--mtx-color-action-focus` y un anillo primary; `prefers-reduced-motion` desactiva las transiciones.

| Tecla | Contexto | Acción |
| :--- | :--- | :--- |
| <kbd>Alt</kbd>+<kbd>↓</kbd> | Campo | Abre el selector y enfoca el día seleccionado (u hoy). |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Botón del calendario | Abre o cierra el selector. |
| <kbd>←</kbd> / <kbd>→</kbd> | Rejilla de días | Día anterior / siguiente (cambia de mes si hace falta). |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Rejilla de días | Mismo día de la semana anterior / siguiente. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Rejilla de días | Primer / último día de la semana. |
| <kbd>RePág</kbd> / <kbd>AvPág</kbd> | Rejilla de días | Mismo día del mes anterior / siguiente. |
| <kbd>Mayús</kbd>+<kbd>RePág</kbd> / <kbd>AvPág</kbd> | Rejilla de días | Mismo día del año anterior / siguiente. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Día, mes o año | Lo selecciona. |
| <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd>, <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Vista de meses / años | Recorre las opciones (3 por fila). |
| <kbd>↑</kbd> / <kbd>→</kbd>, <kbd>↓</kbd> / <kbd>←</kbd> | Reloj | +1 / −1 hora o minuto. |
| <kbd>RePág</kbd> / <kbd>AvPág</kbd> | Reloj (minutos) | ±5 minutos. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Reloj | Valor mínimo / máximo. |
| <kbd>Enter</kbd> | Reloj | Horas → minutos (hora de inicio → fin en rangos). |
| <kbd>↑</kbd> / <kbd>↓</kbd>, <kbd>Enter</kbd> | Tarjeta de hora/minuto | Incrementa / decrementa; Enter pasa a minutos o aplica. |
| <kbd>←</kbd> / <kbd>→</kbd> | Pestañas Fecha/Hora | Cambia de pestaña. |
| <kbd>Tab</kbd> / <kbd>Mayús</kbd>+<kbd>Tab</kbd> | Diálogo | Recorre los controles (atrapado en modo modal). |
| <kbd>Esc</kbd> | Diálogo | Cierra y devuelve el foco al botón o al campo. |
