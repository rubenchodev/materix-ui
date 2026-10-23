---
title: "Autocomplete"
description: "Text field with filterable suggestions: single or multiple selection with chips, free values, groups and asynchronous loading."
group: "inputs"
icon: "manage_search"
weight: 95
example: "autocomplete"
mui: "https://mui.com/material-ui/react-autocomplete/"
---

`Autocomplete` is a text input enhanced with a list of suggestions: the user types, the list is filtered (ignoring case and accents) and they choose with the mouse or keyboard. It follows the WAI-ARIA 1.2 **combobox with listbox** pattern. Use it when the list is long and searching is faster than scrolling, when values must be loaded from a server or when free values are allowed. For short lists without search, use [Select](../select/) or [NativeSelect](../native-select/); for free text with no suggestions, use [TextField](../text-field/).

{{< callout type="info" title="Select, NativeSelect or Autocomplete?" >}}
| Need | NativeSelect | Select | Autocomplete |
| :--- | :--- | :--- | :--- |
| Short list (≤ 10 options), mobile-first | Best choice | Good | Overkill |
| Type to filter (accent- and case-insensitive) | No | Search box inside the menu (`data-search`) | Yes, in the field itself |
| Long lists (countries, users, products) | Poor | Acceptable with search | Best choice |
| Multiple selection | Native list (Ctrl/Cmd) | Checkboxes and "Select all" | Deletable chips |
| Values outside the list | No | No | Yes (`data-free-solo`) |
| Options loaded from a server while typing | No | No | Yes (`mtx:autocomplete:input` + `setOptions()`) |
| Form value | Native `<select>` | Native `<select>` (hidden) | Hidden inputs with `name` |

Rule of thumb: **NativeSelect** for simple forms, **Select** to pick from a known list with MUI styling, **Autocomplete** when the user needs to *search* or *type*.
{{< /callout >}}

## Basic usage

A single `<input>` with `data-mtx="autocomplete"`, `data-label` and `data-options` pointing to a `<datalist>`. The JavaScript builds the TextField, the buttons, the listbox and the hidden input that submits the option's `value` under the field's `name`.

{{< mtx-demo title="Simplified syntax" layout="block" >}}
<input data-mtx="autocomplete" data-label="Country" data-options="#doc-ac-countries" name="country">
<datalist id="doc-ac-countries">
  <option value="ar">Argentina</option>
  <option value="br">Brazil</option>
  <option value="cl">Chile</option>
  <option value="co">Colombia</option>
  <option value="mx">Mexico</option>
  <option value="pe">Peru</option>
  <option value="es">Spain</option>
  <option value="uy">Uruguay</option>
</datalist>
{{< /mtx-demo >}}

Option sources, in order of priority:

- A `<select data-mtx="autocomplete">` with `<option>` and `<optgroup>` (it is replaced by the field; `selected` options become the initial value and `multiple` enables multiple selection).
- `data-options="#id"`: selector of a `<datalist>` (or `<select>`) anywhere in the page.
- `data-options='[...]'`: JSON with strings or `{value, label, group, disabled, icon, description}` objects.
- The native `list="id"` attribute of the `<input>` (it is removed so the browser does not show its own dropdown).
- The `setOptions()` method, for data loaded at runtime.

## Variants

The same as TextField with `data-variant`: `outlined` (default), `filled` and `standard`.

{{< mtx-demo title="Variants" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Outlined" data-options='["Bogotá","Lima","Madrid","Mexico City","Santiago"]'>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Filled" data-variant="filled" data-options='["Bogotá","Lima","Madrid","Mexico City","Santiago"]'>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Standard" data-variant="standard" data-options='["Bogotá","Lima","Madrid","Mexico City","Santiago"]'>
  </div>
</div>
{{< /mtx-demo >}}

## Sizes

Medium 56px (default) and small 40px with `data-size="small"`, the same heights as TextField, Select and a medium Button. The field grows in height when chips wrap onto several lines.

{{< mtx-demo title="Medium 56px and small 40px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Medium · 56px" data-options='["Design","Engineering","Marketing","Sales"]' data-value="Design">
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Small · 40px" data-size="small" data-options='["Design","Engineering","Marketing","Sales"]' data-value="Sales">
  </div>
</div>
{{< /mtx-demo >}}

## With icons

`data-start-icon` adds a start icon (the label lines up with the text). On each option, `data-icon` shows a Material icon and `data-description` a secondary line. The trailing arrow is the popup indicator and the ✕ (visible on hover or focus) is the clear button.

{{< mtx-demo title="Start icon, icons and descriptions" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Search movie" data-start-icon="search" data-options="#doc-ac-films">
    <datalist id="doc-ac-films">
      <option value="godfather" data-description="1972">The Godfather</option>
      <option value="dark-knight" data-description="2008">The Dark Knight</option>
      <option value="pulp-fiction" data-description="1994">Pulp Fiction</option>
      <option value="matrix" data-description="1999">The Matrix</option>
    </datalist>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="autocomplete" data-label="Action">
      <option value="edit" data-icon="edit" data-description="Change the document">Edit</option>
      <option value="share" data-icon="share" data-description="Send a link">Share</option>
      <option value="archive" data-icon="archive" data-description="Hide it from the inbox">Archive</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Colors

`data-color` changes the field's focus color (as in TextField) and the background of selected options: `primary` (default), `secondary`, `success`, `warning`, `info`.

{{< mtx-demo title="Colors" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Primary" data-options='["Alpha","Beta","Gamma"]' data-value="Beta">
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Secondary" data-color="secondary" data-options='["Alpha","Beta","Gamma"]' data-value="Beta">
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Success" data-color="success" data-options='["Alpha","Beta","Gamma"]' data-value="Beta">
  </div>
</div>
{{< /mtx-demo >}}

## States

`disabled`, `readonly`, `required`, `data-error` with `data-helper-text`, `data-loading` (CircularProgress in the field and "Loading…" in the list) and the "No options" message (customizable with `data-no-options-text`).

{{< mtx-demo title="States" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Disabled" data-options='["Alpha","Beta"]' data-value="Alpha" disabled>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Read-only" data-options='["Alpha","Beta"]' data-value="Beta" readonly>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Required" data-options='["Alpha","Beta"]' required>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Error" data-options='["Alpha","Beta"]' data-error="Choose an option from the list">
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Loading" data-loading>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="No options" data-options="[]" data-no-options-text="Nothing here yet">
  </div>
</div>
{{< /mtx-demo >}}

## Grouping

With a `<select>` source, each `<optgroup>` becomes a group with a sticky subheader. In a `<datalist>` or JSON use `data-group` / `group` on each option; consecutive options with the same group are grouped (sort them beforehand, as in MUI). `disabled` options are shown dimmed and skipped by the keyboard.

{{< mtx-demo title="Groups and disabled options" layout="block" >}}
<select data-mtx="autocomplete" data-label="Time zone" name="tz">
  <optgroup label="America">
    <option value="America/Bogota">Bogotá (GMT-5)</option>
    <option value="America/Mexico_City">Mexico City (GMT-6)</option>
    <option value="America/Santiago">Santiago (GMT-4)</option>
  </optgroup>
  <optgroup label="Europe">
    <option value="Europe/Madrid">Madrid (GMT+1)</option>
    <option value="Europe/Paris" disabled>Paris (unavailable)</option>
  </optgroup>
</select>
{{< /mtx-demo >}}

## Multiple values

`data-multiple` shows each value as a deletable [Chip](../chip/): a click on its delete icon, <kbd>Backspace</kbd> with an empty field, or <kbd>←</kbd>/<kbd>→</kbd> to move between chips and <kbd>Backspace</kbd>/<kbd>Delete</kbd> on the focused chip. `data-limit-tags="N"` shows only N chips while the field is not focused (plus "+X"); `data-disable-close-on-select` keeps the list open; `data-filter-selected-options` hides the options already chosen.

{{< mtx-demo title="Chips, limit and stay open" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="autocomplete" data-label="Skills" data-multiple data-disable-close-on-select data-options="#doc-ac-skills" data-value="js,css" name="skills">
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="autocomplete" data-label="Skills (limit 2)" data-multiple data-limit-tags="2" data-options="#doc-ac-skills" data-value="html,css,js,ts">
  </div>
</div>
<datalist id="doc-ac-skills">
  <option value="html" data-group="Frontend">HTML</option>
  <option value="css" data-group="Frontend">CSS</option>
  <option value="js" data-group="Frontend">JavaScript</option>
  <option value="ts" data-group="Frontend">TypeScript</option>
  <option value="node" data-group="Backend">Node.js</option>
  <option value="python" data-group="Backend">Python</option>
</datalist>
{{< /mtx-demo >}}

## Free solo

`data-free-solo` accepts values that are not in the list (search boxes, free tags). <kbd>Enter</kbd> confirms the text; in single selection the text is also confirmed when leaving the field, so it is submitted with the form. If the text matches an option's label, that option is used. The popup indicator is hidden (force it with `data-force-popup-icon`) and no "No options" message is shown.

{{< mtx-demo title="Free values" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="autocomplete" data-label="Search" data-free-solo data-start-icon="search" data-options='["materix ui","material design","mui autocomplete"]'>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="autocomplete" data-label="Keywords" data-free-solo data-multiple data-options='["vanilla","css","a11y"]' data-value="vanilla">
  </div>
</div>
{{< /mtx-demo >}}

## Behavior options

| Attribute | Effect (MUI equivalent) |
| :--- | :--- |
| `data-auto-highlight` | Highlights the first option while filtering (`autoHighlight`). |
| `data-auto-select` | <kbd>Tab</kbd> or leaving the field selects the highlighted option (`autoSelect`). |
| `data-clear-on-escape` | <kbd>Esc</kbd> with the list closed clears the value (`clearOnEscape`). |
| `data-open-on-focus` | Opens the list on focus (`openOnFocus`). |
| `data-disable-clearable` | No clear button; deleting the text does not clear the value (`disableClearable`). |
| `data-match-from="start"` | Only options that **start** with the text (`createFilterOptions({ matchFrom: 'start' })`). |
| `data-filter="false"` | Does not filter locally: the server decides (`filterOptions={(x) => x}`). |

{{< mtx-demo title="auto-highlight + auto-select and clear-on-escape" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Type and press Tab" data-auto-highlight data-auto-select data-options='["Apple","Banana","Cherry","Grape","Mango"]'>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Esc clears" data-clear-on-escape data-options='["Apple","Banana","Cherry"]' data-value="Cherry">
  </div>
</div>
{{< /mtx-demo >}}

## Asynchronous loading

To search on a server, listen to `mtx:autocomplete:input` (fired on each keystroke with `{inputValue, reason}`), turn on `loading`, request the data and call `setOptions()`. `data-debounce="300"` delays the `input` event until the user stops typing for 300 ms (no need to write your own debounce), and `data-filter="false"` avoids filtering locally what the server already filtered. Discard stale responses by comparing them with the latest search.

{{< mtx-demo title="Remote search (simulated, 800 ms)" layout="block" >}}
<input id="doc-ac-async" data-mtx="autocomplete" data-label="Repository" data-start-icon="search" data-debounce="300" data-filter="false" name="repo">
{{< /mtx-demo >}}

```javascript
const field = document.getElementById('doc-ac-async');
const ac = Materix.getInstance(field);
let latest = '';

ac.element.addEventListener('mtx:autocomplete:input', async (event) => {
  if (event.detail.reason !== 'input') return;   // ignore 'reset' and 'clear'
  const query = event.detail.inputValue.trim();
  latest = query;
  if (!query) { ac.setOptions([]); return; }
  ac.loading = true;
  const response = await fetch(`/api/repos?q=${encodeURIComponent(query)}`);
  const repos = await response.json();
  if (query !== latest) return;                   // stale response
  ac.setOptions(repos.map((r) => ({ value: r.id, label: r.name, description: r.stars + ' stars' })));
  ac.loading = false;
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const field = document.getElementById('doc-ac-async');
  if (!field || !window.Materix) return;
  const ac = Materix.getInstance(field);
  if (!ac) return;
  const repos = ['materix-ui', 'material-ui', 'mui-x', 'vite', 'vitest', 'hugo', 'react', 'vue', 'svelte', 'lit', 'preact', 'htmx'];
  let latest = '';
  ac.element.addEventListener('mtx:autocomplete:input', (event) => {
    if (event.detail.reason !== 'input') return;
    const query = event.detail.inputValue.trim().toLowerCase();
    latest = query;
    if (!query) { ac.setOptions([]); ac.loading = false; return; }
    ac.loading = true;
    setTimeout(() => {
      if (query !== latest) return;
      ac.setOptions(repos.filter((name) => name.includes(query)).map((name, i) => ({ value: name, label: name, description: (1200 - i * 57) + ' stars' })));
      ac.loading = false;
    }, 800);
  });
});
</script>

## Forms

The field's `name` moves to hidden inputs (the visible text is not submitted):

- **Single selection**: one `<input type="hidden">` with the option's `value` (empty if there is no selection).
- **Multiple selection**: one hidden input per value with the same `name`, like `<select multiple>` (`FormData.getAll(name)`), or a single field with the values joined by commas using `data-value-format="csv"` (separator configurable with `data-separator`).

`required` uses native validation: the field is invalid while there is no value, and if the user typed text that matches no option it shows "Select an option from the list." (i18n). The form's `reset` restores the initial value.

{{< mtx-demo title="Form with required, multiple and CSV" layout="block" >}}
<form id="doc-ac-form" class="mtx-d-flex mtx-flex-column mtx-gap-2">
  <input data-mtx="autocomplete" data-label="Country of residence" name="country" required data-options='[{"value":"co","label":"Colombia"},{"value":"mx","label":"Mexico"},{"value":"es","label":"Spain"}]'>
  <input data-mtx="autocomplete" data-label="Languages" name="languages" data-multiple data-value="en" data-options='[{"value":"en","label":"English"},{"value":"es","label":"Spanish"},{"value":"pt","label":"Portuguese"}]'>
  <input data-mtx="autocomplete" data-label="Interests (CSV)" name="interests" data-multiple data-free-solo data-value-format="csv" data-options='["design","music","travel"]'>
  <div class="mtx-d-flex mtx-gap-2">
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Submit</button>
    <button class="mtx-button mtx-button--text" data-mtx="button" type="reset">Reset</button>
  </div>
  <output id="doc-ac-form-out">FormData will appear here</output>
</form>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('doc-ac-form');
  const out = document.getElementById('doc-ac-form-out');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    out.textContent = Array.from(new FormData(form)).map(([k, v]) => `${k}=${v}`).join('&');
  });
});
</script>

## Real-world examples

A shipping form with a country (single, required), the cities to cover (multiple with a limit) and a free reference.

{{< mtx-demo title="Shipping zone" layout="block" >}}
<div data-mtx="paper" data-variant="outlined" class="mtx-p-3">
  <div data-mtx="grid" data-spacing="2">
    <div data-mtx="grid" data-xs="12" data-md="4">
      <select data-mtx="autocomplete" data-label="Country" data-start-icon="public" name="ship-country" required>
        <option value="co">Colombia</option>
        <option value="mx">Mexico</option>
        <option value="pe">Peru</option>
      </select>
    </div>
    <div data-mtx="grid" data-xs="12" data-md="8">
      <input data-mtx="autocomplete" data-label="Cities" data-multiple data-limit-tags="3" data-filter-selected-options name="ship-cities" data-options='["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga"]' data-value="Bogotá,Medellín">
    </div>
    <div data-mtx="grid" data-xs="12">
      <input data-mtx="autocomplete" data-label="Carrier" data-free-solo data-helper-text="Pick one or type another" data-options='["DHL","FedEx","UPS","Servientrega"]'>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR or fine-grained control: a `.mtx-autocomplete` container with the TextField already rendered and an inner `<datalist>`. The component reuses the existing nodes and only adds what is missing (buttons, listbox, hidden inputs).

```html
<div class="mtx-autocomplete" data-mtx="autocomplete">
  <div class="mtx-text-field mtx-text-field--outlined">
    <label class="mtx-text-field__label" for="city">City</label>
    <div class="mtx-text-field__container">
      <input class="mtx-text-field__input" id="city" name="city">
    </div>
  </div>
  <datalist>
    <option value="bog">Bogotá</option>
    <option value="med">Medellín</option>
  </datalist>
</div>
```

Generated structure (simplified):

```html
<div class="mtx-autocomplete mtx-autocomplete--has-popup">
  <div class="mtx-text-field mtx-text-field--outlined mtx-autocomplete__field">
    <label class="mtx-text-field__label" id="city-label" for="city">City</label>
    <div class="mtx-text-field__container mtx-autocomplete__input-root">
      <!-- multiple: <div class="mtx-autocomplete__tag mtx-chip">…</div> -->
      <input class="mtx-text-field__input mtx-autocomplete__input" id="city" role="combobox"
             aria-autocomplete="list" aria-expanded="false">
      <span class="mtx-autocomplete__end-adornment">
        <span class="mtx-autocomplete__loading-indicator" hidden></span>
        <button class="mtx-autocomplete__indicator mtx-autocomplete__clear-indicator" aria-label="Clear" tabindex="-1"></button>
        <button class="mtx-autocomplete__indicator mtx-autocomplete__popup-indicator" aria-label="Open" tabindex="-1"></button>
      </span>
      <fieldset class="mtx-text-field__outline">…</fieldset>
    </div>
  </div>
  <span class="mtx-autocomplete__values" hidden><input type="hidden" name="city" value=""></span>
  <div class="mtx-autocomplete__live" role="status" aria-live="polite"></div>
</div>
<!-- In the portal while open -->
<div class="mtx-autocomplete__popper">
  <div class="mtx-autocomplete__paper">
    <ul class="mtx-autocomplete__listbox" role="listbox" id="city-listbox">
      <li class="mtx-autocomplete__option" role="option" id="city-option-0" aria-selected="false">…</li>
    </ul>
    <div class="mtx-autocomplete__status" hidden></div>
  </div>
</div>
```

## Programmatic usage

```javascript
// Existing instance (from the original <input>, the generated input or the container)
const ac = Materix.getInstance(document.querySelector('#country'));

// Elements created at runtime
const input = document.createElement('input');
input.dataset.label = 'City';
container.appendChild(input);
const city = new Materix.Autocomplete(input);   // or Materix.init(input, 'autocomplete')

city.setOptions([{ value: 'bog', label: 'Bogotá', group: 'Colombia' }, 'Lima']);
city.value = 'bog';             // does not emit change
city.open();
city.close();
city.clear();                   // emits change with reason 'clear'
city.loading = true;            // or city.setLoading(true)
city.setError('Required');
city.element.addEventListener('mtx:autocomplete:change', (e) => console.log(e.detail));
city.destroy();
```

```javascript
import { Autocomplete, init, getInstance } from 'materix-ui';
```

{{< mtx-demo title="Live API" >}}
<div class="mtx-w-100">
  <input id="doc-ac-api" data-mtx="autocomplete" data-label="Movie" data-options='[{"value":"alien","label":"Alien"},{"value":"matrix","label":"The Matrix"},{"value":"up","label":"Up"}]'>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ac="value">value = 'matrix'</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ac="open">open()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ac="clear">clear()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ac="toggle">disable() / enable()</button>
<output id="doc-ac-api-out">value: ""</output>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-ac-api');
  const out = document.getElementById('doc-ac-api-out');
  if (!el || !window.Materix) return;
  const ac = Materix.getInstance(el);
  if (!ac) return;
  ac.element.addEventListener('mtx:autocomplete:change', (e) => { out.textContent = 'change → ' + JSON.stringify(e.detail.value) + ' (' + e.detail.reason + ')'; });
  document.querySelectorAll('[data-doc-ac]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-doc-ac');
      if (action === 'value') { ac.value = 'matrix'; out.textContent = 'value: ' + JSON.stringify(ac.value); }
      if (action === 'open') { ac.focus(); ac.open(); }
      if (action === 'clear') ac.clear();
      if (action === 'toggle') { if (ac.disabled) ac.enable(); else ac.disable(); out.textContent = 'disabled: ' + ac.disabled; }
    });
  });
});
</script>

## API reference

### Data attributes

They are read from the original element (`<input>` or `<select>`) or from the `.mtx-autocomplete` container.

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `autocomplete` | — | Initializes the component. |
| `data-label` | text | — | Floating label (TextField). |
| `data-variant` | `outlined` \| `filled` \| `standard` | `outlined` | Visual variant. |
| `data-size` | `small` \| `medium` | `medium` (56px) | `small` = 40px. Also `data-small`. |
| `data-color` | `primary` \| `secondary` \| `success` \| `warning` \| `info` | `primary` | Focus color and selected-option background. |
| `data-start-icon` | icon \| URL | — | Start icon or image. |
| `data-helper-text` | text | — | Helper text. |
| `data-error` | text \| boolean | — | Error state (with message, or keeping the helper text). |
| `data-options` | `#selector` \| JSON | — | Options: `<datalist>`/`<select>` or array of strings/objects. |
| `data-value` | text \| CSV \| JSON | — | Initial value (option `value`; in multiple, CSV with `data-separator` or a JSON array). Otherwise the input's `value` or the `<option selected>` are used. |
| `data-multiple` | boolean | — | Multiple selection with chips (also `multiple` on a `<select>`). |
| `data-free-solo` | boolean | — | Accepts values outside the list. |
| `data-limit-tags` | number | all | Visible chips while not focused (rest as "+N"). |
| `data-disable-close-on-select` | boolean | — | Keeps the list open after selecting (multiple). |
| `data-filter-selected-options` | boolean | — | Hides selected options (multiple). |
| `data-clear-on-escape` | boolean | — | <kbd>Esc</kbd> with the list closed clears the value. |
| `data-disable-clearable` | boolean | — | No clear button. |
| `data-auto-highlight` | boolean | — | Highlights the first option while filtering. |
| `data-auto-select` | boolean | — | <kbd>Tab</kbd>/blur accepts the highlighted option. |
| `data-open-on-focus` | boolean | — | Opens on focus. |
| `data-force-popup-icon` | boolean | `!free-solo` | Shows or hides the popup indicator. |
| `data-match-from` | `any` \| `start` | `any` | Where the text must match. |
| `data-filter` | `false` | — | Disables local filtering (server-side filtering). |
| `data-debounce` | ms | `0` | Delays `mtx:autocomplete:input` while typing. |
| `data-loading` | boolean | — | Initial loading state. |
| `data-loading-text` | text | i18n "Loading…" | Text while loading with no options. |
| `data-no-options-text` | text | i18n "No options" | Text when nothing matches. |
| `data-value-format` | `multiple` \| `csv` | `multiple` | How multiple values are submitted. |
| `data-separator` | text | `,` | Separator for `data-value` and CSV. |
| `name`, `required`, `disabled`, `readonly`, `placeholder` | native | — | Native attributes of the original `<input>`/`<select>`. |
| `data-icon`, `data-description`, `data-group`, `disabled` *(on `<option>`)* | — | — | Icon, secondary text, group and disabled option. |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-autocomplete` | Root container. |
| `mtx-autocomplete--open` / `--focused` | List open / focus inside the component. |
| `mtx-autocomplete--multiple` / `--loading` / `--disabled` / `--readonly` / `--required` | States. |
| `mtx-autocomplete--has-clear` / `--has-popup` / `--has-end` | Reserve room for the trailing buttons. |
| `mtx-autocomplete__field` | Inner TextField (`mtx-text-field--*` classes apply). |
| `mtx-autocomplete__input-root` | Field box (wraps chips and input). |
| `mtx-autocomplete__input` | Combobox `<input>`. |
| `mtx-autocomplete__tag` / `__tag-more` | Chip of each value / "+N" indicator. |
| `mtx-autocomplete__end-adornment` | Container of the trailing buttons. |
| `mtx-autocomplete__loading-indicator` | CircularProgress (20px). |
| `mtx-autocomplete__indicator` / `__clear-indicator` / `__popup-indicator` | Clear and open/close buttons. |
| `mtx-autocomplete__values` | Hidden inputs with `name`. |
| `mtx-autocomplete__live` | Live region (visually hidden). |
| `mtx-autocomplete__popper` / `--{color}` / `__paper` | Floating surface (portal) and its Paper. |
| `mtx-autocomplete__listbox` | `role="listbox"`. |
| `mtx-autocomplete__group` / `__group-label` / `__group-list` | Group, sticky subheader and `role="group"` list. |
| `mtx-autocomplete__option` / `--focused` / `--disabled` | Option and its states (`aria-selected` styles the selection). |
| `mtx-autocomplete__option-icon` / `__option-content` / `__option-label` / `__option-description` | Option content. |
| `mtx-autocomplete__highlight` | `<mark>` with the matching fragment (bold). |
| `mtx-autocomplete__status` | "Loading…" / "No options" message. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `value` (get/set) | `string` \| `string[]` | Option `value` (`''` with no selection; array in multiple). Accepts values, labels or `{value}` objects. Setting it does not emit `change`. |
| `selectedOption` (get) | `Object \| null` | Selected option (single). |
| `selectedOptions` (get) | `Object[]` | Selected options. |
| `inputValue` (get/set) | `string` | Visible text; setting it filters again (no events). |
| `options` (get) | `Object[]` | Copy of the options. |
| `setOptions(options)` | `void` | Replaces the options (strings or `{value, label, group?, disabled?, icon?, description?}`; extra properties are kept). The current value keeps its selection and refreshes its label. |
| `loading` (get/set) / `setLoading(bool)` | `boolean` / `void` | Loading state. |
| `isOpen` (get) | `boolean` | Whether the list is open. |
| `open()` / `close()` | `void` | Opens or closes the list. |
| `clear()` | `void` | Clears value and text (emits `change` with `reason: 'clear'`). |
| `focus()` / `blur()` | `void` | Focus on the input. |
| `disable()` / `enable()` / `disabled` (get) | `void` / `boolean` | Disabled state. |
| `setError(message)` / `clearError()` | `void` | Error state (delegated to TextField). |
| `destroy()` | `void` | Removes listeners, timers, chips and the popup, and restores `name` on the input. |

Useful properties: `element` (container), `input`, `field`, `textField`, `listbox`, `popper`.

### Events

They are emitted on the container (`instance.element`) and bubble.

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `mtx:autocomplete:change` | `{value, option, reason}` (single) · `{value, options, option, reason}` (multiple) | The value changes by user action. `reason`: `selectOption`, `removeOption`, `createOption`, `clear`, `blur`. |
| `mtx:autocomplete:input` | `{inputValue, reason}` | The text changes: `input` (typing, with `data-debounce`), `reset` (text synchronized with the value), `clear`. |
| `mtx:autocomplete:open` | `{reason}` | The list opens (`keyboard`, `toggleInput`, `input`, `focus`, `api`). |
| `mtx:autocomplete:close` | `{reason}` | The list closes (`escape`, `blur`, `selectOption`, `createOption`, `toggleInput`, `api`…). |
| `mtx:autocomplete:highlight` | `{option, reason}` | The highlighted option changes (`keyboard`, `mouse`, `auto`). |

It listens to `mtx:localechange` to translate its texts when the language changes.

### CSS variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--mtx-ac-end-offset` | `9px` (`0` in standard) | Distance of the trailing buttons from the edge. |
| `--mtx-ac-accent` | `--mtx-color-primary` | Background color of selected options (popper). |

It also uses `--mtx-field-height-medium|small`, `--mtx-elevation-8`, `--mtx-overlay-elevation-8` (dark theme), `--mtx-color-background-paper`, `--mtx-color-action-hover|focus|active` and `--mtx-z-index-modal`.

## Accessibility

- WAI-ARIA 1.2 *combobox with listbox* pattern: focus stays on the `<input role="combobox">` with `aria-autocomplete="list"`, `aria-expanded` (true when there are options visible), `aria-controls` (the listbox while open) and `aria-activedescendant` (the highlighted option).
- The list is a `role="listbox"` labelled by the label (`aria-labelledby`), with `aria-multiselectable` in multiple mode and `aria-busy` while loading; each option is a `role="option"` with `aria-selected` and `aria-disabled`. Groups use `role="group"` labelled by their subheader.
- A `role="status"` live region announces "N results available", "No options" or "Loading…" after filtering.
- The clear and open/close buttons have a translated `aria-label` and stay out of the tab order (`tabindex="-1"`), as in MUI: everything can be done from the keyboard in the field.
- `aria-required`, `aria-readonly`, `aria-invalid` and `aria-describedby` (helper/error) are synchronized; `required` uses native validation.
- Chips are focusable with the arrow keys from the field (`tabindex="-1"`, outside the tab order, as in MUI) and are deleted with <kbd>Backspace</kbd>/<kbd>Delete</kbd>; their delete icon is not a nested focusable control.

| Key | Action |
| :--- | :--- |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Opens the list; when open, moves the highlighted option (wrapping, skipping disabled ones). |
| <kbd>Page Down</kbd> / <kbd>Page Up</kbd> | Moves 5 options. |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last option (when open; not in free solo). |
| <kbd>Enter</kbd> | Selects the highlighted option (in free solo, confirms the text). |
| <kbd>Esc</kbd> | Closes the list; when closed and with `data-clear-on-escape`, clears. |
| <kbd>Tab</kbd> | Leaves the field (with `data-auto-select`, accepts the highlighted option). |
| <kbd>Backspace</kbd> (empty field, multiple) | Removes the last chip. |
| <kbd>←</kbd> / <kbd>→</kbd> (multiple) | Moves between chips and back to the field. |
