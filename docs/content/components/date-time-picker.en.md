---
title: "Date Time Picker"
description: "Date, time, date-time and range pickers with a calendar, MD2 radial clock, popover, modal or static mode, limits and formats."
group: "inputs"
icon: "event"
weight: 100
example: "date-time-picker"
mui: "https://mui.com/x/react-date-pickers/"
---

`DateTimePicker` is a single class that covers **DatePicker**, **TimePicker**, **DateTimePicker** and their **range** versions. It's declared on an `<input>`, which becomes a [TextField]({{< relref "/components/text-field" >}}) with a mask and an end icon button, and opens a calendar or a clock on click. It follows the WAI-ARIA *Date Picker Dialog* pattern: an accessible dialog, a keyboard-navigable day grid and a radial clock operable with the arrow keys. Use it when the date or time must be valid and easy to pick; for a date the user knows by heart (e.g. date of birth) a TextField with `data-mask="date"` may be enough.

## Basic usage

The mode is chosen with the value of `data-mtx`. All TextField attributes (`data-label`, `data-variant`, `data-size`, `data-helper-text`, `data-start-icon`…) work the same way.

{{< mtx-demo title="Date, time and date with time" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="date-picker" data-label="Delivery date" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="time-picker" data-label="Appointment time" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="datetime-picker" data-label="Meeting" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

| `data-mtx` | Mode | Default end icon | Default format (`en` · `es`) |
| :--- | :--- | :--- | :--- |
| `date-picker` (alias `datepicker`) | Date | `event` | `MM/DD/YYYY` · `DD/MM/YYYY` |
| `time-picker` (alias `timepicker`) | Time | `schedule` | `HH:mm` |
| `date-time-picker` (aliases `datetime-picker`, `datetimepicker`) | Date and time | `calendar_month` | `MM/DD/YYYY HH:mm` · `DD/MM/YYYY HH:mm` |
| `date-range-picker` (alias `daterangepicker`) | Date range | `event` | `MM/DD/YYYY - MM/DD/YYYY` · `DD/MM/YYYY - DD/MM/YYYY` |
| `datetime-range-picker` (alias `datetimerangepicker`) | Date-time range | `calendar_month` | Date order of the locale + ` HH:mm` |

`date-time-picker` (matching the component slug) and `datetime-picker` are equivalent. `data-picker="date|time|datetime"` takes precedence over the `data-mtx` name, e.g. `<input data-mtx="date-time-picker" data-picker="date">` is a date-only picker.

The field also accepts typing: a mask matching the format is applied, and only digits, separators (`/ - .`), `:` and the AM/PM letters are allowed, depending on the mode.

## Variants

`data-variant`: `outlined` (default), `filled` and `standard`, inherited from TextField.

{{< mtx-demo title="Variants" layout="block" >}}
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

## Sizes

Medium 56px (default) and small 40px with `data-size="small"`.

{{< mtx-demo title="Medium 56px and small 40px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="Medium · 56px" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="time-picker" data-label="Small · 40px" data-size="small" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## With icons

The end icon is rendered as an accessible IconButton (`aria-label="Choose date"`, `aria-haspopup="dialog"`, `aria-expanded`) that opens and closes the picker. It's chosen based on the mode, but you can change it with `data-end-icon` and add another one with `data-start-icon`.

{{< mtx-demo title="Custom icons" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="Check-in" data-start-icon="hotel" data-end-icon="calendar_today" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="time-picker" data-label="Alarm" data-end-icon="alarm" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## States

Helper text (`data-helper-text`), error (`data-error="message"`), required (`required`), disabled (`disabled`) and read-only (`readonly`), just like in TextField. With `disabled` or `readonly` the calendar button is disabled and the picker can't be opened; `disable()`/`enable()` do the same from JavaScript.

{{< mtx-demo title="Helper, error, required, disabled and read-only" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Start" data-helper-text="MM/DD/YYYY" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Due date" data-error="This date has already passed" value="2020-01-01" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="time-picker" data-label="Time" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Locked" value="2026-08-15" disabled type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="date-picker" data-label="Issued" data-value="2026-03-02" readonly type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Ranges

Range modes pick the start and end with two clicks on the same calendar (highlighting the span on hover). In `datetime-range-picker`, after choosing the dates, start and end time tabs appear. `data-range-separator` changes the separator (`" - "` by default).

{{< mtx-demo title="Date range and date-time range" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="date-range-picker" data-label="Stay" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="datetime-range-picker" data-label="Maintenance window" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Clock and 12-hour format

The time picker opens in keyboard mode by default (editable hour and minute cards, with <kbd>↑</kbd>/<kbd>↓</kbd>). With `data-time-view="dial"` (alias `data-time-mode`, value `clock`) it opens the MD2 radial clock; the bottom-left button toggles between the two. `data-ampm` (or a format with `hh`/`A`) enables the 12-hour format with an AM/PM selector.

{{< mtx-demo title="Keyboard, clock and AM/PM" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="time-picker" data-label="Keyboard · 24 h" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="time-picker" data-label="Clock · 12 h" data-time-view="dial" data-ampm type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <input data-mtx="datetime-picker" data-label="Doctor's appointment" data-format="DD/MM/AAAA hh:mm A" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Popover, modal and static

- **Popover** (default): drops down below the field, anchors to the right or opens upward if there's not enough room. On screens 600px wide or less it's shown centered over a dark backdrop.
- **Modal** (`data-display="modal"`): a centered dialog with an MD2 colored header on any screen size.
- **Static** (`data-static` on a `<div>`): a calendar or clock embedded in the page, with no field and no OK/Cancel buttons; each choice emits `mtx:date-time-picker:change`.

{{< mtx-demo title="Modal" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="Date (modal)" data-display="modal" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="datetime-picker" data-label="Date and time (modal)" data-display="modal" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Static" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <div data-mtx="date-picker" data-static data-locale="en"></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <div data-mtx="time-picker" data-static data-time-view="dial"></div>
  </div>
</div>
{{< /mtx-demo >}}

## Limits and initial value

`data-min` and `data-max` (or `min`/`max`) disable the days outside the interval; they accept `YYYY-MM-DD` (recommended), the field's own format or `today`/`hoy`. The initial value is set with `value`, `data-value` or `data-default-value` (ISO or the active format); it's displayed with the active format and the label floats above it from the start.

{{< mtx-demo title="Min/max and initial value" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="2026 only" data-min="2026-01-01" data-max="2026-12-31" data-helper-text="Between 01/01/2026 and 12/31/2026" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="From today" data-min="today" data-value="2026-12-24" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Format

Without `data-format`, the date order comes from the locale (`en`/`en-US`: `MM/DD/YYYY`; `es`, `es-MX`, `en-GB`…: `DD/MM/YYYY`, resolved with `Intl`), always with `/` as separator. `data-format` defines how the value is displayed and typed (and derives the field mask); typed text is parsed in that same order. Tokens: `YYYY`/`AAAA` year, `YY` short year, `MM` month, `DD` day, `HH` hour 0-23, `hh` hour 1-12, `mm` minutes, `ss` seconds, `A` AM/PM and `a` am/pm. If you need a different mask, `data-mask` replaces it.

{{< mtx-demo title="Formats" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="date-picker" data-label="ISO" data-format="YYYY-MM-DD" type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="datetime-picker" data-label="ISO with time" data-format="YYYY-MM-DD HH:mm" type="text" />
  </div>
</div>
{{< /mtx-demo >}}

## Language and texts

The texts (Today, Cancel, OK, accessible names…) come from the Materix i18n system: the locale is resolved with `data-locale`/`data-lang` on the field or an ancestor, then with the `lang` of the ancestor or of `<html>`, and finally with `Materix.setLocale()`. Regional codes are reduced to their base language for the texts (`es-MX` → `es`) while the full code is used with `Intl` (date order and accessible day names). Months and weekdays come from the i18n dictionary when the language is registered (`en`, `es` or one added with `Materix.addLocale()`) and from `Intl.DateTimeFormat` otherwise (e.g. `fr-FR`); an unregistered local locale does not override the text language, which falls back to `Materix.setLocale()` or `<html lang>`. `data-today-text`, `data-cancel-text` and `data-ok-text` replace the button texts.

{{< mtx-demo title="Locale, region and button texts" layout="block" >}}
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

## Real-world examples

Booking a room: date range, start time and duration in a grid.

{{< mtx-demo title="Booking" layout="block" >}}
<form data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="date-range-picker" data-label="Days" data-min="today" data-locale="en" required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <input data-mtx="time-picker" data-label="Start time" data-ampm required type="text" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <select data-mtx="select" data-label="Duration">
      <option value="60">1 hour</option>
      <option value="120">2 hours</option>
      <option value="240">Half day</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12">
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Book</button>
  </div>
</form>
{{< /mtx-demo >}}

## Full BEM syntax

The picker is mounted on the TextField structure. In manual markup, write the complete TextField and put `data-mtx` on the container; the component generates the popover inside it.

```html
<div class="mtx-text-field mtx-text-field--outlined" data-mtx="date-picker">
  <label class="mtx-text-field__label" for="due">Due date</label>
  <div class="mtx-text-field__container">
    <input class="mtx-text-field__input" id="due" type="text" placeholder=" " />
    <span class="mtx-text-field__adornment mtx-text-field__adornment--end material-icons" aria-hidden="true">event</span>
  </div>
</div>
<!-- Generated on open: div.mtx-picker-popover > .mtx-picker-content > .mtx-date-picker … + .mtx-picker-actions -->
```

## Programmatic usage

```javascript
const input = document.getElementById('delivery');
const picker = Materix.getInstance(input);        // or Materix.init(input, 'date-picker')
// const picker = new Materix.DateTimePicker(input);  (aliases: DatePicker, TimePicker, DateRangePicker, DateTimeRangePicker)

picker.open();                  // moves focus to the selected day (or today)
picker.open({ focus: false });  // keeps focus in the field
picker.close(true);             // true returns focus to the button or field that opened it
picker.toggle();
picker.disable();               // field + calendar button disabled; picker.disabled === true
picker.enable();
picker.destroy();               // removes listeners, popover and backdrops (or Materix.destroy(input))
Materix.DateTimePicker.closeAll();

picker.setDate('2026-12-25');            // Date, timestamp, 'YYYY-MM-DD' or text in the active format
picker.setDateTime('2026-12-25 20:30');
picker.setTime({ hours: 9, minutes: 15 });
picker.setRange('2026-10-01', '2026-10-15');
picker.clear();

picker.getDate();               // Date | null
picker.getDate(true);           // "12/25/2026" (en) · "25/12/2026" (es)
picker.getDate('YYYY-MM-DD');   // "2026-12-25"
picker.getDateTime('iso');      // "2026-12-25T…Z"
picker.getTime();               // "20:30" (or "08:30 PM" in AM/PM mode)
picker.getRange(true);          // { start: "10/01/2026", end: "10/15/2026", value: "10/01/2026 - 10/15/2026" }

input.addEventListener('mtx:date-time-picker:change', (e) => console.log(e.detail.value, e.detail.iso));
```

```javascript
import { DateTimePicker, DatePicker, TimePicker } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="Live API" >}}
<input id="doc-picker-api" data-mtx="datetime-picker" data-label="Delivery" type="text" />
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-picker="open">open()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-picker="set">setDateTime('2026-12-25 20:00')</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-picker="now">setDateTime(new Date())</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-picker="clear">clear()</button>
<output id="doc-picker-out">No value</output>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('doc-picker-api');
  const out = document.getElementById('doc-picker-out');
  if (!input || !window.Materix) return;
  const picker = Materix.getInstance(input);
  if (!picker) return;
  input.addEventListener('mtx:date-time-picker:change', (e) => { out.textContent = 'mtx:date-time-picker:change → ' + (e.detail.value || '(empty)') + (e.detail.iso ? ' · ' + e.detail.iso : ''); });
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
Call `open()` from a button with `event.stopPropagation()`: the picker closes when it detects a click outside of it, and the same click that opens it would otherwise reach the document.
{{< /callout >}}

## API reference

### Data attributes

In addition to the [TextField]({{< relref "/components/text-field#data-attributes" >}}) ones (`data-label`, `data-variant`, `data-size`, `data-color`, `data-start-icon`, `data-end-icon`, `data-helper-text`, `data-error`), these are read on the `<input>` or on the container:

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `date-picker` \| `time-picker` \| `date-time-picker` \| `datetime-picker` \| `date-range-picker` \| `datetime-range-picker` (and aliases without hyphens) | — | Initializes the component and sets the mode. |
| `data-range` | boolean | — | Enables range mode even if `data-mtx` doesn't indicate it. |
| `data-picker` | `date` \| `time` \| `datetime` | — | Forces the mode, taking precedence over the `data-mtx` name (e.g. `date-time-picker` + `date` = date only). |
| `data-range-separator` | text | `" - "` | Separator between start and end. |
| `data-format` | tokens | mode + locale | Display and typing format (see *Format*). |
| `data-mask` | TextField mask | derived from the format | Replaces the automatic mask. |
| `data-ampm` | boolean \| `false` | `false` | 12-hour format with AM/PM. |
| `data-time-view` | `input` \| `dial` \| `clock` | `input` | Initial time view: keyboard or radial clock. Alias `data-time-mode`. |
| `data-display` | `popover` \| `modal` | `popover` | How the picker is presented. |
| `data-static` | boolean | — | On a `<div>`, renders the picker embedded. |
| `data-min` | date | — | Minimum date (`YYYY-MM-DD`, the active format, `today`/`hoy`). Also `min`. |
| `data-max` | date | — | Maximum date. Also `max`. |
| `data-value` | date/time | input `value` | Initial value. Also `data-default-value`. |
| `data-locale` | BCP 47 code (`en`, `es-MX`, `fr-FR`…) | `lang` / global locale | Language of texts, names and default date order. Alias `data-lang`. |
| `data-today-text` | text | i18n | Text of the "Today" button. |
| `data-cancel-text` | text | i18n | Text of the "Cancel" button. |
| `data-ok-text` | text | i18n | Text of the "OK" button. |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-picker-popover` / `--open` | Floating container (popover mode). |
| `mtx-picker-backdrop-mobile` / `--open` | Dark popover backdrop on screens ≤ 600px. |
| `mtx-picker-backdrop` / `--open` | Modal mode backdrop. |
| `mtx-picker-dialog` | Modal mode dialog. |
| `mtx-picker-static` / `--disabled` | Embedded picker (and its disabled state). |
| `mtx-picker-header` | Colored header (modal and static). |
| `mtx-picker-header__year` / `__date` / `__time` / `__time-unit` / `__ampm-group` / `__ampm-btn` | Header parts. |
| `mtx-picker-tabs` / `mtx-picker-tab` / `--active` | Date/Time tabs (or Dates/Start/End in range mode). |
| `mtx-picker-content` | Area of the active view. |
| `mtx-picker-actions` | Button bar (Today, Cancel, OK). |
| `mtx-picker-icon-btn` | Button to toggle keyboard/clock. |
| `mtx-date-picker` | Calendar. |
| `mtx-date-picker__nav` / `__nav-group` / `__nav-btn` / `__title-group` / `__title` | Month and year navigation. |
| `mtx-date-picker__weekdays` / `__weekday` | Weekday header. |
| `mtx-date-picker__grid` / `__days` / `__week` / `__day-cell` / `__day` | Day grid (`role="grid"` › `rowgroup` › `row` › `gridcell`). |
| `mtx-date-picker__day--today` / `--selected` / `--outside` / `--disabled` | Day states. |
| `mtx-date-picker__day--range-start` / `--range-end` / `--in-range` / `--range-preview` | Range states (also on `__day-cell`). |
| `mtx-date-picker__months` / `__month` / `--selected` | Month view. |
| `mtx-date-picker__years` / `__year` / `--selected` | Year view. |
| `mtx-time-picker` | Time picker. |
| `mtx-time-picker__digit-card` / `--active` / `--input` | Hour and minute cards. |
| `mtx-time-picker__clock` / `__hand` / `__pointer` / `__center` / `__number` / `--selected` | Radial clock. |
| `mtx-time-picker__ampm-stack` / `__ampm-opt` / `--active` | AM/PM selector. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `open(options?)` | `void` | Opens the picker (closes any other open one) and focuses the selected day or today; `{ focus: false }` keeps focus in the field. Does nothing when disabled or read-only. |
| `close(focusInput = false)` | `void` | Closes it; with `true` returns focus to the button or field that opened it. |
| `toggle()` | `void` | Toggles open/closed. |
| `DateTimePicker.closeAll(focusInput)` *(static)* | `void` | Closes the open picker on the page. |
| `getDate(format?)` | `Date` \| `string` \| `null` | No argument: `Date`; `true`: text in the active format; `'iso'`: ISO 8601; a pattern: text in that pattern. |
| `getDateTime(format?)` | `Date` \| `string` \| `null` | Same as `getDate`, with `true` = locale date order + `HH:mm` (`hh:mm A` in AM/PM mode). |
| `getTime(asObject?)` | `string` \| `object` \| `null` | `"HH:mm"` (or `"hh:mm AM"`); with `true`, `{ hours, minutes[, ampm] }`. In range mode, start and end. |
| `getISOString()` | `string` \| `null` | Date in ISO 8601 (UTC). |
| `getValue()` | `string` | Current text of the field. |
| `getRange(format?)` | `object` | `{ start, end }` as `Date`; `true` → texts and `value`; `'iso'` → ISO. |
| `setDate(date)` | `this` | Sets the date (`Date`, timestamp or text). `null`/`''` clears it. |
| `setDateTime(dateTime)` | `this` | Alias of `setDate`. |
| `setTime(time)` | `this` | Sets the time (`'HH:mm'`, `'hh:mm PM'`, `{ hours, minutes }` or `Date`). |
| `setValue(value)` | `this` | Alias of `setDate`. |
| `setRange(start, end)` | `this` | Sets a range (also accepts `{ start, end }`; reorders them if reversed). |
| `clear()` | `this` | Clears the selection and the field. |
| `date` / `dateTime` / `time` / `value` / `range` (get/set) | — | Shortcuts for the methods above. |
| `isoString` / `isRange` (get) | `string` / `boolean` | Current ISO / whether it's in range mode. |
| `disable()` / `enable()` / `disabled` (get) | `void` / `boolean` | Disables or enables the field and the calendar button (closes the picker). In static mode, disables the embedded picker. |
| `destroy()` | `void` | Releases document/window listeners, the popover, the backdrops moved to `<body>` and the registry entry. |

### Events

Every event is emitted **once** per action on the `<input>` (it bubbles to the TextField container and its ancestors); in static mode, on the container.

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `mtx:date-time-picker:change` | `{ value, date, dateTime, time, iso, isRange, startDate, endDate, range: { start, end }, picker }` | A selection is applied (OK, a day in date mode, Today, keyboard on the clock, `set*()` or `clear()`). |
| `mtx:date-time-picker:open` | `{ picker }` | The picker opens. |
| `mtx:date-time-picker:close` | `{ picker }` | The picker closes. |
| `input` / `change` | — (native) | The `<input>` value changes through a selection or typing. |

{{< callout type="warning" >}}
**Deprecated:** `mtx:change`, `mtx:open` and `mtx:close` are still emitted right after each canonical event, with the same `detail`, until 1.0. Migrate to `mtx:date-time-picker:*`. Since this version `mtx:change` is no longer duplicated: a listener on the container receives a single event per selection.
{{< /callout >}}

### CSS variables

No variables of its own: it uses the global tokens `--mtx-color-primary`, `--mtx-color-primary-contrast`, `--mtx-color-background-paper`, `--mtx-color-primary-light`, `--mtx-color-action-*`, `--mtx-elevation-*`, `--mtx-backdrop-bg`, `--mtx-z-index-modal`, `--mtx-duration-*`, `--mtx-easing-*`, `--mtx-shape-radius` and the TextField heights. Range highlights are derived from `--mtx-color-primary` with `color-mix()`, so they follow the active theme.

## Accessibility

Materix implements the WAI-ARIA [Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) pattern:

- **Field**: a TextField with `<label for>`, mask and `aria-describedby`; typing is still the fastest path. Clicking the field opens the picker without stealing focus; <kbd>Alt</kbd>+<kbd>↓</kbd> (or <kbd>↓</kbd> when it's open) moves focus into it.
- **Button**: the end icon is a `<button>` with `aria-label="Choose date"` (or *Choose time*, *Choose date and time*, *Choose date range*, plus the current value), `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. It's disabled together with the field (`disabled`/`readonly`).
- **Dialog**: the popover and the modal are `role="dialog"` with an i18n `aria-label`; the modal (and the popover on screens ≤ 600px) adds `aria-modal="true"` and traps focus with <kbd>Tab</kbd>. On open, focus goes to the selected day or today; <kbd>Esc</kbd> closes and returns focus to the button or field that opened it. In popover mode, tabbing out of the picker closes it.
- **Calendar**: `role="grid"` labelled by the month/year title (an `aria-live` region), with `columnheader` cells carrying full weekday names and one `row` per week. Each day is a `gridcell` with a full `aria-label` (*Tuesday, October 20, 2026*; *martes, 20 de octubre de 2026* with `es-MX`), `aria-selected`, `aria-current="date"` for today and `aria-disabled` outside `min`/`max`. Only one day is in the tab order (roving `tabindex`); disabled days are skipped while navigating.
- **Months and years**: `role="radiogroup"` with `radio` options, `aria-checked` and roving `tabindex`.
- **Clock**: `role="slider"` with `aria-label` (*Select hours* / *Select minutes*), `aria-valuemin`/`max`/`now` and `aria-valuetext` (*10 hours*, *45 minutes*); numbers are `aria-hidden`. The hour/minute cards and AM/PM buttons expose `aria-label` and `aria-pressed`; the Date/Time tabs follow the Tabs pattern.
- Visible focus uses `--mtx-color-action-focus` and a primary ring; `prefers-reduced-motion` disables transitions.

| Key | Context | Action |
| :--- | :--- | :--- |
| <kbd>Alt</kbd>+<kbd>↓</kbd> | Field | Opens the picker and focuses the selected day (or today). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Calendar button | Opens or closes the picker. |
| <kbd>←</kbd> / <kbd>→</kbd> | Day grid | Previous / next day (changes month when needed). |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Day grid | Same weekday in the previous / next week. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Day grid | First / last day of the week. |
| <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Day grid | Same day in the previous / next month. |
| <kbd>Shift</kbd>+<kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Day grid | Same day in the previous / next year. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Day, month or year | Selects it. |
| <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd>, <kbd>Home</kbd> / <kbd>End</kbd> | Month / year view | Moves through the options (3 per row). |
| <kbd>↑</kbd> / <kbd>→</kbd>, <kbd>↓</kbd> / <kbd>←</kbd> | Clock | +1 / −1 hour or minute. |
| <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Clock (minutes) | ±5 minutes. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Clock | Minimum / maximum value. |
| <kbd>Enter</kbd> | Clock | Hours → minutes (start → end time in ranges). |
| <kbd>↑</kbd> / <kbd>↓</kbd>, <kbd>Enter</kbd> | Hour/minute card | Increments / decrements; Enter moves to minutes or applies. |
| <kbd>←</kbd> / <kbd>→</kbd> | Date/Time tabs | Switches tab. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Dialog | Moves through the controls (trapped in modal mode). |
| <kbd>Esc</kbd> | Dialog | Closes and returns focus to the button or field. |
