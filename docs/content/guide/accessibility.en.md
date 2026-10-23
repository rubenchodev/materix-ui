---
title: "Accessibility"
description: "What Materix UI guarantees for accessibility, what you need to provide, and which keys each interactive component supports."
weight: 50
icon: "accessibility_new"
---

Materix starts from native HTML and adds ARIA only where HTML falls short. The library handles the mechanics (roles, states, focus, keyboard); you provide the content (accessible names, text and page structure).

## What the library does

### Native semantics first

Components are built on the right element: `<button>` for Button, IconButton and Fab; `<input type="checkbox">` for Checkbox and Switch; `<input type="radio">` for Radio; `<input>`, `<textarea>` and `<select>` for fields; `<table>` for Table. That's why they work with forms, native validation, autofill and screen readers with no extra work.

When the element is not natively interactive (a `<div>` such as a clickable Chip, CardActionArea or TableSortLabel), the library adds `role="button"`, `tabindex="0"` and activation with `Enter` and `Space`.

### Automatically managed ARIA

| Component | ARIA applied by the library |
|---|---|
| TextField | `aria-invalid` on error, `aria-describedby` pointing to the helper text and counter, `aria-live="polite"` on the counter, automatic `id` to link the `<label>`. |
| Select | `role="combobox"` + `aria-expanded`, `aria-required`, `aria-invalid`, `aria-describedby`; `role="listbox"` menu with `role="option"` and `aria-selected`; `aria-multiselectable` in multiple mode. |
| NativeSelect | `aria-invalid` on error. |
| Checkbox | `aria-checked="mixed"` in the indeterminate state. |
| Switch | `role="switch"` on the native checkbox. |
| Tabs | `role="tablist"`, `role="tab"` with `aria-selected` and roving tabindex, `role="tabpanel"`, `aria-orientation` when vertical. |
| Menu | `role="menu"`, `role="menuitem"`; on the trigger, `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`. |
| Dialog | `role="dialog"`, `aria-modal="true"`; copies `aria-labelledby` and `aria-describedby` from the container to the paper. |
| Drawer | `role="dialog"` in temporary mode; `navigation` or `region` in persistent/permanent mode; `aria-expanded` and `aria-controls` on the triggers. |
| Alert | `role="alert"`. |
| Snackbar | `role="alert"` on the message (configurable with `data-role`). |
| Table | `aria-sort` on the sorted column, `aria-selected` on selected rows, `aria-live="polite"` on the pagination range, `aria-label` on the navigation buttons. |
| List | `aria-selected` and `aria-current="page"` on the selected item. |
| Generated icons | Icons inserted by the library (field adornments, Alert icons, chevrons) get `aria-hidden="true"`. |

### Focus

- **Visible focus.** Inside `.mtx-root`, every keyboard-focused element shows a `--mtx-focus-ring-width` (2px) ring in `--mtx-focus-ring-color`. Text fields don't use it: they indicate focus with their outline or underline, as in MUI.
- **Focus trap.** Dialog and the temporary Drawer keep `Tab` inside the panel while they are open.
- **Initial focus.** Dialog focuses the element marked with `data-dialog-autofocus` or, if there is none, the first focusable element.
- **Focus restoration.** When Dialog, Menu (with `Esc`), Select (with `Esc`) and SpeedDial (with `Esc`) close, focus returns to the element that opened them.

### Escape and stacked layers

Every floating or modal surface (Dialog, temporary Drawer, Popover, Menu and submenus, Select, Autocomplete, DateTimePicker, SpeedDial, Backdrop, Snackbar and Tooltip) joins a **shared layer stack** (`src/core/layers.js`) when it opens and leaves it when it closes. A single `keydown` listener on `document` delivers `Escape` **only to the top layer** and marks the event as handled (`preventDefault()` plus an internal flag), so the layers below ignore it:

- **Order.** The last surface opened is the top one: a popover opened inside a dialog closes before the dialog, a submenu before its menu, a dialog opened from a popover before the popover.
- **Tooltips first.** If a tooltip is visible, `Escape` hides it first and only it (WCAG 1.4.13, *dismissible*). Tooltips never block the other layers: they don't count for focus trapping or "click outside".
- **Snackbars last.** A snackbar only receives `Escape` when no other layer is open.
- **Non-dismissible layers.** A Dialog or Drawer with `data-disable-escape`, or a Backdrop that locks the page (`data-lock-scroll` / `data-inert`) without `data-close-on-escape`, consumes `Escape` without closing, so nothing underneath closes either.
- **Click outside.** Interacting with a layer opened from another one (a Dialog opened from a Popover, a Menu inside a temporary Drawer) is not a "click outside" for the lower layer, and Dialog's focus trap lets focus move into the menus and popovers it opened.
- **Your own handlers.** If your code calls `event.preventDefault()` on an `Escape` keydown before it reaches `document`, Materix closes nothing. `Materix.layers.isEscapeHandled(event)` tells you whether a Materix layer already handled it; `Materix.layers.push(owner, { kind, onEscape, nodes })` / `remove(owner)` let your own overlays join the stack.

```javascript
// A custom overlay that takes part in the Escape order.
const overlay = { name: 'my-overlay' };
Materix.layers.push(overlay, { kind: 'popup', nodes: panel, onEscape: () => closePanel() });
// …and when it closes:
Materix.layers.remove(overlay);
```

### Reduced motion

With `prefers-reduced-motion: reduce`, `base.css` shortens every animation and transition of Materix elements (`mtx-*` classes) to 0.01ms, and the ripple and JavaScript-driven transitions don't run.

## Color contrast

Accessibility is a priority of Materix UI, so **every color meets WCAG AA (4.5:1 for normal text) by default**. MUI's default palette doesn't in some combinations: `warning` (#ed6c02) and `info` (#0288d1) as text on white or with white text on top, and `error` with white text in dark mode, stay between 3.0 and 3.9:1. MUI itself recommends raising `contrastThreshold` to 4.5 to reach AA; Materix ships that choice as the default, the equivalent of `createTheme({ palette: { contrastThreshold: 4.5 } })`.

Brand backgrounds don't change (warning, info and error keep MUI's colors in contained buttons, filled chips, badges and alerts): only the text colors do, through the `--mtx-color-{color}-text` and `--mtx-color-{color}-contrast` tokens.

To get MUI's exact values (for example, to match an existing MUI app pixel by pixel), opt out with `data-mtx-contrast="mui"`:

```html
<html lang="en" data-mtx-contrast="mui">
```

The attribute works on `<html>` or on any container, and combines with light and dark themes (also when one of them is set on a nested container). `data-mtx-contrast="aa"` is still accepted as an alias of the default (useful to return to AA inside a `mui` container).

{{< mtx-demo title="Default (AA) and the mui opt-out" layout="column" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-1">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="info">Info</button>
  <span data-mtx="chip" data-label="Warning" data-variant="outlined" data-color="warning"></span>
  <a data-mtx="link" data-color="info" href="#color-contrast">Info link</a>
</div>
<div data-mtx-contrast="mui" class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-1">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="info">Info</button>
  <span data-mtx="chip" data-label="Warning" data-variant="outlined" data-color="warning"></span>
  <a data-mtx="link" data-color="info" href="#color-contrast">Info link</a>
</div>
{{< /mtx-demo >}}

### Tokens

| Token | Default (AA) light | Default (AA) dark | `mui` |
| :--- | :--- | :--- | :--- |
| `--mtx-color-{color}-text` | `error`, `info`, `success` → `-dark`; `warning` → `-dark` 75 % + black (#ac3d00); `primary`, `secondary` → the color | `error` → `-light` 70 % + white; the rest → the color | `var(--mtx-color-{color})` |
| `--mtx-color-warning-contrast`, `--mtx-color-info-contrast` | `rgba(0, 0, 0, 0.87)` | `rgba(0, 0, 0, 0.87)` | `#ffffff` in light |
| `--mtx-color-error-contrast` | `#ffffff` | `rgba(0, 0, 0, 0.87)` | `#ffffff` |

`--mtx-color-{color}-text` is the accessible color for text and icons **on the background** (paper, default or the grey of filled fields). It is used by the text and outlined Buttons, outlined Chip, Link, Typography with `data-color`, the selected ToggleButton, the Alert icon (standard and outlined), the error label and helper text of TextField, Select, NativeSelect, Autocomplete and DateTimePicker, and the `mtx-color-{color}` utilities. `-contrast` is the text **on the color**: contained Button, filled Chip, Badge, filled Alert and Fab. Contained Buttons and clickable filled Chips with dark text lighten on hover instead of darkening. You can also override any `-text` token in your own theme.

`--mtx-color-text-disabled` (38 % / 50 %) is only for disabled content, which WCAG exempts from contrast. The library marks it as disabled for assistive technology (`disabled` or `aria-disabled="true"`): static List rows with `data-disabled` and the helper text of a disabled Checkbox or Switch. Days of other months in the DatePicker are selectable, so they use `text-secondary`.

### Measured ratios

Ratios measured in Chromium on `background-default` (#f8fafc light, #121212 dark), the strictest background; on paper they are equal or higher. Outlined Button, outlined Chip, Link and Typography share the "text on the background" values; Chip filled, Badge and Alert filled share the "text on the color" values. Values in **bold** are below the threshold (4.5:1 for text, 3:1 for icons).

| Color | Combination | Light (default) | Light `mui` | Dark (default) | Dark `mui` |
| :--- | :--- | ---: | ---: | ---: | ---: |
| `primary` | Text on the background | 8.66 | 8.66 | 7.03 | 7.03 |
| `secondary` | Text on the background | 6.03 | 6.03 | 7.84 | 7.84 |
| `error` | Text on the background | 5.37 | 4.76 | 8.84 | 5.09 |
| `warning` | Text on the background | 5.83 | **2.97** | 9.64 | 9.64 |
| `info` | Text on the background | 7.07 | **3.69** | 8.46 | 8.46 |
| `success` | Text on the background | 7.52 | 4.90 | 7.92 | 7.92 |
| `primary` | Text on the color | 9.06 | 9.06 | 6.90 | 6.90 |
| `secondary` | Text on the color | 6.30 | 6.30 | 7.61 | 7.61 |
| `error` | Text on the color | 4.98 | 4.98 | 5.18 | **3.68** |
| `warning` | Text on the color | 6.02 | **3.11** | 9.17 | 9.17 |
| `info` | Text on the color | 4.95 | **3.86** | 8.15 | 8.15 |
| `success` | Text on the color | 5.13 | 5.13 | 7.68 | 7.68 |
| `primary` | Contained on hover | 11.59 | 11.59 | 7.97 | **4.01** |
| `secondary` | Contained on hover | 8.20 | 8.20 | 8.63 | **4.01** |
| `error` | Contained on hover | 5.62 | 5.62 | 5.97 | 4.98 |
| `warning` | Contained on hover | 6.96 | **3.79** | 9.95 | 6.84 |
| `info` | Contained on hover | 5.97 | 7.40 | 9.09 | 6.95 |
| `success` | Contained on hover | 7.87 | 7.87 | 8.67 | 4.63 |
| `primary` | ToggleButton selected | 7.54 | 7.54 | 5.51 | 5.51 |
| `secondary` | ToggleButton selected | 5.33 | 5.33 | 6.01 | 6.01 |
| `error` | ToggleButton selected | 4.76 | **4.25** | 6.67 | **4.32** |
| `warning` | ToggleButton selected | 5.20 | **2.73** | 7.15 | 7.15 |
| `info` | ToggleButton selected | 6.27 | **3.36** | 6.43 | 6.43 |
| `success` | ToggleButton selected | 6.65 | **4.44** | 6.09 | 6.09 |
| `error` | Error label on filled field | 4.93 | **4.37** | 6.02 | **3.47** |
| `success` | Alert standard (text) | 12.33 | 12.33 | 13.66 | 13.66 |
| `info` | Alert standard (text) | 11.20 | 11.20 | 13.86 | 13.86 |
| `warning` | Alert standard (text) | 10.25 | 10.25 | 14.26 | 14.26 |
| `error` | Alert standard (text) | 12.21 | 12.21 | 11.43 | 11.43 |
| `success` | Alert standard (icon, 3:1) | 6.89 | 4.49 | 7.99 | 7.99 |
| `info` | Alert standard (icon, 3:1) | 6.54 | 3.41 | 8.52 | 8.52 |
| `warning` | Alert standard (icon, 3:1) | 5.45 | **2.78** | 9.60 | 9.60 |
| `error` | Alert standard (icon, 3:1) | 4.83 | 4.28 | 9.25 | 5.32 |
| `success` | Alert outlined (icon, 3:1) | 7.52 | 4.90 | 7.92 | 7.92 |
| `info` | Alert outlined (icon, 3:1) | 7.07 | 3.69 | 8.46 | 8.46 |
| `warning` | Alert outlined (icon, 3:1) | 5.83 | **2.97** | 9.64 | 9.64 |
| `error` | Alert outlined (icon, 3:1) | 5.37 | 4.76 | 8.84 | 5.09 |

Alert standard and outlined text already exceeds 10:1 in both modes (MUI mixes the color with black or white), so the contrast mode only changes its icon.

## What you need to provide

- **Accessible name on icon-only buttons.** IconButton, the circular Fab and any button with only an icon need `aria-label`:

  ```html
  <button class="mtx-icon-button" data-mtx="icon-button" aria-label="Delete">
    <span class="material-icons" aria-hidden="true">delete</span>
  </button>
  ```

- **Decorative icons.** If you write the `<span class="material-icons">` yourself, add `aria-hidden="true"`; otherwise the screen reader announces the icon name ("delete").
- **A label on every field.** Use `data-label` (or a `<label>` in the BEM syntax). A `placeholder` is not a substitute for a label. If the design shows no label, add `aria-label` to the `<input>`.
- **Errors with text.** Pair `data-error` with a `data-helper-text` that explains the problem; red color alone is not enough.
- **Dialog title.** Use `data-title` or set `aria-labelledby` pointing to the Dialog's title.
- **Labels the library generates.** Internal ARIA labels go through i18n and follow the page or component language (`lang`, `data-locale`): the Alert close button, the Chip delete icon (a non-focusable icon with a `title`; the chip itself is removed with `Delete`/`Backspace`), the Drawer close button, the Card header actions button, the SpeedDial FAB and the AppBar navigation button ("Open navigation"). Override any of them per instance with `data-close-label`, `data-delete-label`, `data-action-label`, `data-label` or `data-start-icon-label`/`data-end-icon-label`.
- **Language.** Declare `<html lang="...">`: screen readers use it, and so does Materix to choose the language of its built-in strings.

## Keyboard support by component

Native components (Button, IconButton, Fab, Link, Checkbox, Radio, Switch, TextField, NativeSelect) rely on the browser's keyboard behavior: `Tab` to focus, `Space` to check or press, `Enter` to activate buttons and links, and the Arrow keys to move between radios that share the same `name`.

| Component | Key | Action |
|---|---|---|
| Select | `Arrow Down` / `Arrow Up` / `Space` | With the control focused, opens the menu. |
| | `Enter` | With the control focused, opens or closes the menu. |
| | `Arrow Down` / `Arrow Up` | With the menu open, moves focus between options. |
| | `Enter` / `Space` | Selects the focused option. |
| | `Esc` | Closes the menu and returns focus to the control. |
| | `Tab` | Closes the menu. |
| Menu | `Arrow Down` / `Arrow Up` | Moves focus between items (wraps around). |
| | `Home` / `End` | First / last item. |
| | `Enter` / `Space` | Activates the focused item. |
| | `Arrow Right` | Opens the focused item's submenu. |
| | `Arrow Left` | Closes the current submenu. |
| | `Esc` | Closes the menu and returns focus to the trigger. |
| | `Tab` | Closes the menu. |
| Tabs | `Arrow Left` / `Arrow Right` | Previous / next tab (wraps around). When vertical: `Arrow Up` / `Arrow Down`. |
| | `Home` / `End` | First / last tab. |
| | `Enter` / `Space` | Activates the focused tab. With `data-selection-follows-focus`, the Arrow keys activate tabs directly. |
| Dialog | `Esc` | Closes it (unless `data-disable-escape` is set). |
| | `Tab` / `Shift+Tab` | Cycles through focusable elements without leaving the dialog. |
| Drawer (temporary) | `Esc` | Closes it (unless `data-disable-escape` is set). |
| | `Tab` / `Shift+Tab` | Cycles through focusable elements without leaving the panel. |
| Snackbar | `Esc` | Closes the open snackbar. |
| SpeedDial | `Esc` | Closes the actions and returns focus to the FAB. |
| Chip | `Enter` / `Space` | Activates a chip with `data-clickable`. |
| | `Delete` / `Backspace` | Dispatches `mtx:chip:delete` on a deletable chip. |
| | `Esc` | Removes focus from the chip. |
| CardActionArea | `Enter` / `Space` | Activates the area. |
| Interactive Card | `Enter` / `Space` | Activates the card. |
| TableSortLabel | `Enter` / `Space` | Changes the column's sort order. |
| TablePagination | `Tab` + `Enter` | Native first, previous, next and last page buttons. |
| DateTimePicker | `Esc` | Closes the picker. |
| | `Arrow Up` / `Arrow Down` | In the keyboard time input, adds or subtracts one hour or one minute. |
| | `Tab` + `Enter` | Calendar days, months, years and buttons are native buttons. |
| ListItemButton | `Tab` + `Enter` | Uses the native element (`<button>` or `<a>`). |

{{< callout type="info" title="Differences from MUI" >}}
The DateTimePicker calendar doesn't support Arrow-key navigation between days yet, and Select doesn't support `Home`/`End` or type-ahead outside the search field (`data-search`). They are navigated with `Tab`.
{{< /callout >}}

## Checklist

Before shipping a screen:

1. Go through it using only the keyboard: everything interactive is reachable with `Tab` and shows the focus ring.
2. Every icon-only button has an `aria-label`.
3. Every field has a visible label or an `aria-label`.
4. Errors have text, not just color.
5. Dialogs have a linked title.
6. Check both themes: contrast must hold in light and dark mode.
7. Turn on "reduce motion" in your OS and confirm that nothing relies on an animation to be understood.
