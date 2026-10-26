---
title: "Date Time Picker"
description: "Date, time, date-time and range pickers with a calendar, MD2 radial clock, popover, modal or static mode, limits and formats."
group: "inputs"
icon: "event"
weight: 100
example: "date-time-picker"
import: "DateTimePicker"
mui: "https://mui.com/x/react-date-pickers/"
---

`DateTimePicker` is a single component that covers **DatePicker**, **TimePicker**, **DateTimePicker** and their **range** versions (the aliases fix the mode for you). It renders a [TextField](../text-field/) with a mask and an end icon button, and opens a calendar or a clock. It follows the WAI-ARIA *Date Picker Dialog* pattern: an accessible dialog, a keyboard-navigable day grid and a radial clock operable with the arrow keys. Use it when the date or time must be valid and easy to pick; for a date the user knows by heart (e.g. date of birth) a TextField with `mask="date"` may be enough.

```tsx
import { DatePicker, TimePicker, DateTimePicker, DateRangePicker } from '@rubenchodev/materix-react';
// or only this component:
import { DatePicker } from '@rubenchodev/materix-react/components/date-time-picker';
```

## Basic usage

Pick the component for the mode. Every TextField prop (`label`, `variant`, `size`, `helperText`, `startIcon`, `name`…) works the same way. The field also accepts typing: a mask matching the format is applied, and only digits, separators (`/ - .`), `:` and the AM/PM letters are allowed, depending on the mode.

{{< react-demo id="date-time-picker/01-basic" layout="block" >}}

| Component | Mode | Default end icon | Default format (`en` · `es`) |
| :--- | :--- | :--- | :--- |
| `DatePicker` | Date | `event` | `MM/DD/YYYY` · `DD/MM/YYYY` |
| `TimePicker` | Time | `schedule` | `HH:mm` |
| `DateTimePicker` | Date and time | `calendar_month` | `MM/DD/YYYY HH:mm` · `DD/MM/YYYY HH:mm` |
| `DateRangePicker` | Date range | `event` | `MM/DD/YYYY - MM/DD/YYYY` |
| `DateTimeRangePicker` | Date-time range | `calendar_month` | Date order of the locale + ` HH:mm` |
| `StaticDatePicker`, `StaticTimePicker`, `StaticDateTimePicker`, `StaticDateRangePicker` | Embedded | — | — |

`<DateTimePicker mode="date" />` is equivalent to `DatePicker` (vanilla's `data-picker`), and `range` turns on range mode.

## Variants

`variant`: `outlined` (default), `filled` and `standard`, inherited from TextField.

{{< react-demo id="date-time-picker/02-variants" layout="block" >}}

## Sizes

Medium 56px (default) and small 40px with `size="small"`. The small field aligns 1:1 with a medium Button.

{{< react-demo id="date-time-picker/03-sizes" layout="block" >}}

## With icons

The end icon is an accessible IconButton (`aria-label="Choose date"` plus the current value, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`) that opens and closes the picker. It depends on the mode; change it with `endIcon` and add another one with `startIcon`.

{{< react-demo id="date-time-picker/04-icons" layout="block" >}}

## States

`helperText`, `error`, `required`, `disabled` and `readOnly`, just like in TextField. With `disabled` or `readOnly` the calendar button is disabled and the picker can't be opened.

{{< react-demo id="date-time-picker/05-states" layout="block" >}}

## Keyboard and accessibility

Focus the calendar button and press <kbd>Enter</kbd>, or type in the field and press <kbd>Alt</kbd>+<kbd>↓</kbd>: focus moves to the selected day (or today). The full key map is in [Accessibility](#accessibility).

{{< react-demo id="date-time-picker/06-keyboard" layout="block" >}}

## Ranges

Range modes pick the start and end with two clicks on the same calendar (highlighting the span on hover; a click before the start swaps them). In `DateTimeRangePicker`, after choosing the dates, the **Start** and **End** time tabs appear (09:00 and 18:00 by default); releasing the clock on the start minutes moves on to the end time. `rangeSeparator` changes the separator (`" - "` by default). The value is `{ start, end }`.

{{< react-demo id="date-time-picker/07-ranges" layout="block" >}}

## Clock and 12-hour format

The time view opens in keyboard mode by default (editable hour and minute cards, with <kbd>↑</kbd>/<kbd>↓</kbd>; <kbd>Enter</kbd> on the minutes applies and closes). With `timeView="dial"` it opens the MD2 radial clock; the bottom-left button toggles between the two. `ampm` (or a format with `hh`/`A`) enables the 12-hour format with an AM/PM selector. `views` (`['hours', 'minutes', 'seconds']`), `minutesStep`, `minTime` and `maxTime` are passed to the clock.

{{< react-demo id="date-time-picker/08-time" layout="block" >}}

## Popover, modal and static

- **Popover** (default): drops down below the field (inside the TextField, as in vanilla), anchors to the right or opens upward if there's not enough room. On screens 600px wide or less it's shown centered over a dark backdrop, with `aria-modal` and a focus trap.
- **Modal** (`display="modal"`): a centered dialog with an MD2 colored header on any screen size. Picking a day applies it at once (`onChange`) but keeps the dialog open; OK closes it.
- **Static** (`displayStatic` or the `Static*` aliases): a calendar or clock embedded in the page, with no field and no OK/Cancel buttons; each choice calls `onChange`.

{{< react-demo id="date-time-picker/09-presentation" layout="block" >}}

## Limits, initial value and format

`minDate` and `maxDate` disable the days outside the interval; they accept a `Date`, `YYYY-MM-DD`, the field's own format or `today`/`hoy`. `shouldDisableDate(date)` disables specific days (they are skipped while navigating with the keyboard). `defaultValue` (uncontrolled) or `value` (controlled) accept a `Date`, a timestamp, ISO text or text in the active format.

Without `format`, the date order comes from the locale (`en`/`en-US`: `MM/DD/YYYY`; `es`, `es-MX`, `en-GB`…: `DD/MM/YYYY`, resolved with `Intl`). `format` defines how the value is displayed and typed (and derives the field mask). Tokens: `YYYY`/`AAAA` year, `YY` short year, `MM` month, `DD` day, `HH` hour 0-23, `hh` hour 1-12, `mm` minutes, `ss` seconds, `A` AM/PM and `a` am/pm. `mask` replaces the automatic mask.

{{< react-demo id="date-time-picker/10-limits" layout="block" >}}

## Language and texts

The texts (Today, Cancel, OK, accessible names…) come from the Materix i18n system: the `locale` prop, then the [I18nProvider](../../guide/i18n/) and `<html lang>`. Regional codes are reduced to their base language for the texts (`es-MX` → `es`) while the full code is used with `Intl` (date order and accessible day names). Months and weekdays come from the dictionary when the language is registered and from `Intl.DateTimeFormat` otherwise (e.g. `fr-FR`). `todayText`, `cancelText`, `okText` and `clearText` replace the button texts, and `actions` chooses the buttons (`today`, `clear`, `cancel`, `accept`).

{{< react-demo id="date-time-picker/11-language" layout="block" >}}

## Grid

A room booking form in `Grid` combining a date range, a time, a Select and a Button. `name` goes to the `<input>`, so the formatted text is submitted with the form.

{{< react-demo id="date-time-picker/12-grid" layout="block" >}}

## Programmatic usage

`value`/`onChange` make it controlled; `open`/`onOpen`/`onClose` control the popover. The `action` ref is the equivalent of vanilla's methods.

{{< react-demo id="date-time-picker/13-programmatic" layout="block" >}}

```tsx
const action = useRef<DateTimePickerActions>(null);
const [value, setValue] = useState<Date | null>(null);

<DateTimePicker
  label="Delivery"
  value={value}
  onChange={(next, detail) => setValue(next as Date | null)}   // detail.value, detail.iso, detail.time…
  onAccept={(next) => save(next)}                               // OK, or a choice that closes the picker
  onOpen={() => {}}
  onClose={(reason) => {}}                                      // accept | cancel | select | escapeKeyDown | clickaway…
  action={action}                                               // action.current.open() / close() / toggle() / clear()
/>
```

## Standalone DateCalendar

`DateCalendar` is the calendar used by the pickers: single or range selection, month and year views (`view`/`onViewChange`), visible month (`month`/`onMonthChange`), `minDate`, `maxDate` and `shouldDisableDate`. It has no surface of its own: place it in a [Paper](../paper/) or a card.

{{< react-demo id="date-time-picker/14-calendar" layout="block" >}}

## API reference

### DateTimePicker props

Besides these, the TextField props go to the field (`label`, `variant`, `size`, `color`, `helperText`, `error`, `required`, `fullWidth`, `margin`, `startIcon`, `placeholder`, `name`, `id`, `inputRef`, `inputProps`, `className`, `style`…).

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'date' \| 'time' \| 'datetime'` | `'datetime'` | Mode (`data-picker`). Fixed by the aliases. |
| `range` | `boolean` | `false` | Range selection (`data-range`). |
| `value` | `Date \| string \| number \| null`, or `{ start, end }` | — | Value (controlled). |
| `defaultValue` | same | — | Initial value (`data-value`). |
| `onChange` | `(value, detail) => void` | — | Applied change (`mtx:date-time-picker:change`). |
| `onAccept` | `(value, detail) => void` | — | OK, or a choice that closes the picker. |
| `open` / `defaultOpen` | `boolean` | — | Open state (controlled / initial). |
| `onOpen` / `onClose` | `() => void` / `(reason) => void` | — | `mtx:date-time-picker:open` / `:close`. |
| `format` | tokens | mode + locale | Display and typing format (`data-format`). |
| `mask` | TextField mask | derived | Replaces the automatic mask (`data-mask`). |
| `locale` | BCP 47 | context | Language, names and default date order (`data-locale`). |
| `ampm` | `boolean` | from format | 12-hour format (`data-ampm`). |
| `minDate` / `maxDate` | `Date \| string` | — | Limits; accept `today` (`data-min`/`data-max`). |
| `shouldDisableDate` | `(date) => boolean` | — | Disables specific days. |
| `openTo` | `'day' \| 'month' \| 'year'` | `'day'` | Initial calendar view. |
| `views` | `('hours' \| 'minutes' \| 'seconds')[]` | hours, minutes | Clock views. |
| `minTime` / `maxTime` / `minutesStep` | `Date` / `Date` / `number` | — | Clock limits and step. |
| `timeView` | `'input' \| 'dial'` | `'input'` | Initial time view (`data-time-view`; `clock`/`keyboard` aliases). |
| `display` | `'popover' \| 'modal'` | `'popover'` | Presentation (`data-display`). |
| `displayStatic` | `boolean` | `false` | Embedded picker (`data-static`). |
| `rangeSeparator` | `string` | `' - '` | Separator (`data-range-separator`). |
| `actions` | `('today' \| 'clear' \| 'cancel' \| 'accept')[]` | today, cancel, accept | Buttons of the bar (static: today). |
| `todayText` / `cancelText` / `okText` / `clearText` | `ReactNode` | i18n | Button texts. |
| `endIcon` | `string` | by mode | Icon of the open button (`data-end-icon`). |
| `disabled` / `readOnly` | `boolean` | `false` | Disables the field and the button. In static mode, `disabled` makes it `inert`. |
| `action` | `Ref<DateTimePickerActions>` | — | `open({ focus })`, `close(focusInput)`, `toggle()`, `clear()`. |

### onChange detail

`{ value, date, dateTime, time, iso, isRange, startDate, endDate, range: { start, end } }`, the same as vanilla's `detail` (without `picker`). `onChange` fires once per applied selection: a day in date mode, the range end, each time change, Today, OK, typing a complete valid value, or clearing. In a complete range, `date`, `dateTime` and `iso` refer to the range end, as in vanilla.

{{< callout type="warning" >}}
**Cancel closes without reverting changes already emitted.** As in vanilla, every applied change calls `onChange` immediately (a day in the modal, each hour or minute), so Cancel only discards what was not applied yet (for example the day picked in `DateTimePicker` before choosing the time). Clear calls `onChange` and `onAccept` with `null`.
{{< /callout >}}

In controlled mode the field always shows `value`: if the parent ignores `onChange`, the field and the calendar go back to `value`.

### DateCalendar props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `value` / `defaultValue` / `onChange(date)` | `Date \| null` | Single selection. |
| `range`, `rangeValue` / `defaultRangeValue` / `onRangeChange(range, { complete })` | `{ start, end }` | Range selection. |
| `view` / `defaultView` / `onViewChange` | `'day' \| 'month' \| 'year'` | Active view. |
| `month` / `onMonthChange` / `referenceDate` | `Date` | Visible month. |
| `minDate`, `maxDate`, `shouldDisableDate` | — | Disabled days. |
| `disabled`, `readOnly`, `locale`, `autoFocus` | — | State, language and initial focus. |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-picker-popover` / `--open` | Floating container (popover mode), inside the TextField. |
| `mtx-picker-backdrop-mobile` / `--open` | Dark popover backdrop on screens ≤ 600px. |
| `mtx-picker-backdrop` / `--open`, `mtx-picker-dialog` | Modal mode. |
| `mtx-picker-static` / `--disabled` | Embedded picker. |
| `mtx-picker-header` (`__year`, `__date`) | Colored header (modal and static). |
| `mtx-picker-tabs` / `mtx-picker-tab` / `--active` | Date/Time tabs (or Dates/Start/End). |
| `mtx-picker-tabs--range`, `mtx-picker-tab__text`, `mtx-picker-tab__time`, `mtx-picker-tab__paren` | **React only** (`picker-tabs.css`): range tabs. On screens ≤ 600px the time moves to a second line so the three tabs fit without horizontal scroll (in vanilla the End tab is clipped at 390px). A justified CSS divergence; the rest of the CSS comes unchanged from `@rubenchodev/materix-ui`. |
| `mtx-picker-content`, `mtx-picker-actions`, `mtx-picker-icon-btn` | View area, button bar and keyboard/clock toggle. |
| `mtx-date-picker` (`__nav`, `__title`, `__nav-btn`, `__grid`, `__weekday`, `__week`, `__day-cell`, `__day`) | Calendar. |
| `mtx-date-picker__day--today` / `--selected` / `--outside` / `--disabled` | Day states. |
| `mtx-date-picker__day--range-start` / `--range-end` / `--in-range` / `--range-preview` | Range states (also on `__day-cell`). |
| `mtx-date-picker__months` / `__month`, `mtx-date-picker__years` / `__year` (`--selected`) | Month and year views. |
| `mtx-time-picker` (`__digit-card`, `__clock`, `__hand`, `__number`, `__ampm-stack`…) | Time view. |

### CSS variables

No variables of its own: it uses the global tokens `--mtx-color-primary`, `--mtx-color-primary-contrast`, `--mtx-color-background-paper`, `--mtx-color-action-*`, `--mtx-elevation-*`, `--mtx-backdrop-bg`, `--mtx-z-index-modal`, `--mtx-duration-*` and `--mtx-shape-radius`.

## Accessibility

- **Field**: a TextField with `<label for>`, mask and `aria-describedby`. Clicking the field opens the picker without stealing focus; <kbd>Alt</kbd>+<kbd>↓</kbd> (or <kbd>↓</kbd> when it's open) moves focus into it.
- **Button**: `aria-label` (*Choose date*, *Choose time*, *Choose date and time*, *Choose date range*, plus the current value), `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. Disabled together with the field.
- **Dialog**: `role="dialog"` with an i18n `aria-label`; the modal (and the popover on screens ≤ 600px) adds `aria-modal="true"` and traps <kbd>Tab</kbd>. On open, focus goes to the selected day or today; <kbd>Esc</kbd> closes it (only if it's the top layer) and returns focus. In popover mode, tabbing out closes it; only one picker is open at a time.
- **Calendar**: `role="grid"` labelled by the month/year title (`aria-live`), `columnheader` cells with full weekday names and one `row` per week. Each day is a `gridcell` with a full `aria-label` (*Tuesday, October 20, 2026*), `aria-selected`, `aria-current="date"` for today and `aria-disabled`. Roving `tabindex`; disabled days are skipped.
- **Months and years**: `role="radiogroup"` with `radio` options, `aria-checked` and roving `tabindex`.
- **Clock**: `role="slider"` with `aria-valuemin`/`max`/`now` and `aria-valuetext`; cards and AM/PM expose `aria-label` and `aria-pressed`; the tabs follow the Tabs pattern.

| Key | Context | Action |
| :--- | :--- | :--- |
| <kbd>Alt</kbd>+<kbd>↓</kbd> | Field | Opens the picker and focuses the selected day (or today). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Calendar button | Opens or closes the picker. |
| <kbd>←</kbd> / <kbd>→</kbd> | Day grid | Previous / next day (changes month when needed). |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Day grid | Same weekday in the previous / next week. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Day grid | First / last day of the week. |
| <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Day grid | Same day in the previous / next month (<kbd>Shift</kbd>: year). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Day, month or year | Selects it. |
| Arrows, <kbd>Home</kbd> / <kbd>End</kbd> | Month / year view | Moves through the options (3 per row). |
| Arrows, <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Clock | ±1 hour or minute; ±5 minutes. |
| <kbd>Enter</kbd> | Clock | Hours → minutes (start → end time in ranges). |
| <kbd>←</kbd> / <kbd>→</kbd> | Date/Time tabs | Switches tab. |
| <kbd>Esc</kbd> | Dialog | Closes and returns focus to the button or field. |

## Vanilla equivalence

| Vanilla | React |
| :--- | :--- |
| `data-mtx="date-picker"`, `time-picker`, `datetime-picker`, `date-range-picker`, `datetime-range-picker` | `DatePicker`, `TimePicker`, `DateTimePicker`, `DateRangePicker`, `DateTimeRangePicker` |
| `data-picker`, `data-range` | `mode`, `range` |
| `data-static` | `displayStatic` / `Static*` |
| `data-display="modal"` | `display="modal"` |
| `data-format`, `data-mask`, `data-ampm`, `data-locale` | `format`, `mask`, `ampm`, `locale` |
| `data-min`, `data-max`, `min`/`max` of the input | `minDate`, `maxDate` (+ `shouldDisableDate`) |
| `data-value`, `data-default-value` | `defaultValue` (or `value`) |
| `data-time-view`, `data-time-mode` | `timeView` |
| `data-range-separator` | `rangeSeparator` |
| `data-today-text`, `data-cancel-text`, `data-ok-text` | `todayText`, `cancelText`, `okText` |
| `data-end-icon` | `endIcon` |
| `setDate()`, `setDateTime()`, `setTime()`, `setRange()`, `setValue()` | `value` (controlled) |
| `getDate()`, `getTime()`, `getRange()`, `getISOString()` | `onChange(value, detail)` (`detail.value`, `.time`, `.range`, `.iso`) |
| `open()`, `close()`, `toggle()`, `clear()` | `action.current.*` or `open` |
| `DateTimePicker.closeAll()` | Not needed: opening a picker closes the one already open (only one at a time); close a specific one with `open={false}` or `action.current.close()`. |
| `disable()` / `enable()` | `disabled` |
| `mtx:date-time-picker:change` / `:open` / `:close` | `onChange` / `onOpen` / `onClose` (+ `onAccept`) |
