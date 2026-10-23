---
title: "Initialization"
description: "How and when Materix UI creates and destroys instances: auto-initialization, initAll, init, getInstance, watch, lifecycle (destroy, destroyAll), custom components and mtx:* events."
weight: 30
icon: "play_circle"
---

Materix automatically initializes every `[data-mtx]` element on the page. You only need JavaScript for content added later, to get an instance or to listen for events.

## API overview

| Function | Returns | Usage |
|---|---|---|
| `initAll(root = document)` | `void` | Initializes every pending `[data-mtx]` inside `root` (including `root` itself). |
| `init(element, name?)` | instance or `null` | Initializes a single element. `name` forces the component and writes `data-mtx` if missing. |
| `initElement(element, name?)` | instance or `null` | Same as `init` (`init` is its alias). |
| `getInstance(element)` | instance or `undefined` | Returns the instance already created for that element. |
| `watch(root = document, { destroyOnRemove })` | `MutationObserver` | Automatically initializes whatever is added to `root` (and destroys what is removed with `destroyOnRemove: true`). |
| `destroy(element)` | `boolean` | Destroys the instance of an element: listeners, timers, registry. |
| `destroyAll(root = document)` | `number` | Destroys every instance inside `root`. |
| `registerComponent(name, Class)` | `void` | Registers a class for `data-mtx="name"`. |

All of them are available on the `Materix` global (UMD) and as named exports (ESM).

## Auto-initialization

When it loads, the library runs `initAll()`:

- if the document is still loading, it waits for `DOMContentLoaded`;
- if the DOM is already ready (for example, a `<script type="module">` or a script at the end of the `<body>`), it initializes immediately.

For each element with `data-mtx`, it looks up the class registered under that name, creates the instance, stores it in the registry and marks the element with `data-mtx-initialized`. `data-mtx` values that are not registered are silently ignored.

## Idempotency

Initializing twice does not create two instances:

```javascript
Materix.initAll();
Materix.initAll(); // does nothing: everything has data-mtx-initialized

const a = Materix.init(el);
const b = Materix.init(el);
a === b; // true
```

`initAll` repeats the pass over the container (up to five times) only while the previous pass created new instances. This way it also initializes `[data-mtx]` components that another component generates during its own auto-scaffolding, without rescanning in vain when there are `data-mtx` values that are not registered.

### Calling the constructor twice

`new Materix.Button(el)` on an element that already has an instance **of the same component** (the same class, or a subclass in either direction, such as `new MyButton(el)` over a `Button`) destroys the previous instance first (listeners, timers, registry) and registers the new one, so listeners are never duplicated. Prefer `Materix.init(el)` or `getInstance(el)` when you just want the current instance: they reuse it instead of recreating it. Instances of an *unrelated* class on the same node are kept (for example, a declarative Tooltip on an IconButton).

## Initializing a single element: `init`

```javascript
// Uses the element's data-mtx value
const field = Materix.init(document.querySelector('#email'));

// Forces the component; adds data-mtx="select" if the element doesn't have it
const select = Materix.init(document.querySelector('#country'), 'select');
```

If the element was already initialized, it returns the existing instance. It returns `null` if there is no component name, if the name is not registered or if `element` is not an element (`init(null)` is a safe no-op).

## Getting an instance: `getInstance`

```javascript
const dialog = Materix.getInstance(document.getElementById('confirm'));
dialog?.open();
```

With the simplified syntax, the component may wrap your element in a generated container (TextField, Checkbox, Switch...). The registry stores the instance under **both** elements, so `getInstance` works with your original `<input>` as well as with the `.mtx-*` container. `instance.element` is always the component's root element.

{{< callout type="info" >}}
`getInstance` returns `undefined` if it is called before auto-initialization. Run your code after the library has loaded, and inside `DOMContentLoaded` if your script lives in the `<head>`.
{{< /callout >}}

## Dynamic content and SPAs

### Initializing after inserting HTML: `initAll(container)`

When you insert HTML after the page has loaded, initialize it by passing the container:

```javascript
const container = document.getElementById('results');

const response = await fetch('/partials/filters.html');
container.innerHTML = await response.text();

Materix.initAll(container);
```

`initAll(container)` only walks that subtree and skips whatever was already initialized, so it is safe to call it every time the content changes.

### Automatic initialization: `watch`

`watch(root)` creates a `MutationObserver` on `root` (`childList` and `subtree`). For every added node, it initializes the node itself if it has `data-mtx`, plus all of its `[data-mtx]` descendants. It returns the observer so you can stop it:

```javascript
const observer = Materix.watch(document.getElementById('app'));

// Anything added inside #app is initialized automatically
document.getElementById('app').insertAdjacentHTML(
  'beforeend',
  '<input data-mtx="text-field" data-label="City" data-variant="outlined">'
);

// When the view unmounts
observer.disconnect();
```

`watch` is not active by default. It only reacts to **added** nodes (see [Lifecycle](#lifecycle) for `destroyOnRemove`): changing the `data-mtx` attribute of an existing element does not initialize it. Observe the smallest container possible; observing `document` on a page with many mutations has a cost.

## Lifecycle

### Destroying instances: `destroy`, `destroyAll` and `instance.destroy()`

Every component extends `ComponentBase`, so every instance has `destroy()`. It **frees resources and unlinks** the instance:

- removes the listeners it registered on `document`, `window` and on external elements (triggers, scroll containers…);
- cancels its timers, animation frames and observers (`ResizeObserver`, `MutationObserver`, `matchMedia`);
- closes it first if it is open (Dialog, Drawer, Menu, Select, Snackbar) and removes the nodes it moved to `<body>` (Menu popper, Drawer backdrop) or brings them back (Select menu);
- removes it from the registry and removes `data-mtx-initialized` from its elements (the original one and the generated root): afterwards `getInstance(el)` returns `undefined` and `initAll()` can initialize it again.

```javascript
// One element
Materix.destroy(document.getElementById('confirm')); // true if there was an instance

// A whole subtree (deepest first), e.g. before removing a view
Materix.destroyAll(document.getElementById('view'));
document.getElementById('view').remove();

// Directly on the instance
Materix.getInstance(el)?.destroy();
```

| Function | Returns | Usage |
|---|---|---|
| `destroy(element)` | `boolean` | Destroys the instance linked to `element` (original or generated root). `false` if there was none. If the component's `destroy()` throws, the instance is unlinked anyway and the error is rethrown; `destroyAll()` logs it and continues with the rest. |
| `destroyAll(root = document)` | `number` | Destroys every initialized component inside `root` (including `root`), deepest first. |
| `instance.destroy()` | `void` | Same as `destroy(element)`. Idempotent: calling it twice does nothing. |

{{< callout type="info" title="destroy() does not undo the auto-scaffolding" >}}
The generated DOM (wrappers, labels, icons, ARIA attributes) stays as it is: `destroy()` releases resources and unlinks, it does not "un-scaffold". It is meant to be called right before removing the element, or to re-initialize it with `initAll()` (the component reuses the existing structure).
{{< /callout >}}

### SPAs: `watch(root, { destroyOnRemove: true })`

With `destroyOnRemove`, the observer also destroys the instances of the nodes **removed** from `root`. A node that is only moved (removed and inserted again in the same batch of mutations, as the auto-scaffolding does) is not destroyed.

```javascript
const observer = Materix.watch(document.getElementById('app'), { destroyOnRemove: true });

router.on('navigate', (html) => {
  document.getElementById('app').innerHTML = html; // old view destroyed, new view initialized
});
```

Components whose surface is moved to `<body>` (Menu's popper, an open Popover) leave a marker comment in their original place: when that place is removed, `destroyOnRemove` (and `destroyAll(view)`) destroys them as well, so nothing is left orphaned in `<body>`. Tooltips close by themselves when their trigger leaves the DOM.

### Your own components: `this.listen()` and `this.onDestroy()`

Inside a `ComponentBase` subclass, register listeners with `this.listen(target, type, handler, options)` and any other cleanup with `this.onDestroy(fn)`: `destroy()` runs them all. If you override `destroy()`, call `super.destroy()`.

```javascript
class StickyHeader extends Materix.ComponentBase {
  constructor(element) {
    super(element);
    this.listen(window, 'scroll', () => this.update(), { passive: true });
    const observer = new ResizeObserver(() => this.update());
    observer.observe(element);
    this.onDestroy(() => observer.disconnect());
  }

  update() {
    this.element.classList.toggle('is-stuck', window.scrollY > 0);
  }
}
```

| Method | Returns | Usage |
|---|---|---|
| `listen(target, type, handler, options?)` | `Function` | Adds a listener that `destroy()` removes. Returns a function to remove it earlier. |
| `onDestroy(fn)` | `void` | Registers a cleanup (observer, timer, portaled node…) for `destroy()`. |
| `destroy()` | `void` | Runs the cleanups, unlinks the instance and sets `instance.destroyed = true`. |

## Custom components: `registerComponent`

Extend `ComponentBase` and register the class under the name you will use in `data-mtx`:

```javascript
class CopyButton extends Materix.ComponentBase {
  constructor(element) {
    super(element); // stores this.element, sets data-mtx-initialized and registers the instance
    this.listen(element, 'click', () => navigator.clipboard.writeText(element.dataset.copy || ''));
  }
}

Materix.registerComponent('copy-button', CopyButton);
Materix.initAll(); // initializes the data-mtx="copy-button" elements already on the page
```

```html
<button class="mtx-button mtx-button--outlined" data-mtx="copy-button" data-copy="npm install materix-ui">
  Copy command
</button>
```

`ComponentBase` provides `element`, `listen()`, `onDestroy()`, `destroy()`, the `disabled` getter and the `disable()` and `enable()` methods (backed by the native `disabled` property).

{{< callout type="warning" title="Register first, or call initAll again" >}}
Auto-initialization runs when the library loads. If you register your component afterwards, its elements stay uninitialized until you call `initAll()`. Registering an existing name silently replaces the previous class: use your own name that doesn't collide with Materix's.
{{< /callout >}}

## Events

Components dispatch `CustomEvent`s with `bubbles: true`, so you can listen on the element itself or delegate to an ancestor. The data lives in `event.detail`.

### Convention

Every event is named `mtx:{component}:{action}`: `{component}` is the `data-mtx` name in kebab-case and `{action}` a verb or a kebab-case noun (`open`, `close`, `change`, `page-change`…). Global events use the module name (`mtx:locale:change`, `mtx:theme:change`).

```javascript
document.addEventListener('mtx:dialog:close', (event) => {
  console.log(event.target.id, event.detail.reason); // 'escapeKeyDown', 'backdropClick'...
});
```

| Event | Component | `detail` | Fired when |
|---|---|---|---|
| `mtx:accordion:change` | Accordion | `{ expanded }` | The panel expands or collapses. |
| `mtx:alert:open` / `mtx:alert:close` | Alert | — | The alert is shown / closed. |
| `mtx:breadcrumbs:expand` | Breadcrumbs | — | The collapsed items are expanded. |
| `mtx:breadcrumbs:navigate` | Breadcrumbs | `{ index, href, label, … }` | An item is activated. **Cancelable**. |
| `mtx:chip:click` / `mtx:chip:delete` | Chip | `{}` | A clickable chip is activated / the delete action runs. |
| `mtx:dialog:open` / `mtx:dialog:close` | Dialog | — / `{ reason }` | The dialog opens / closes. |
| `mtx:drawer:open` / `mtx:drawer:close` | Drawer | — / `{ reason }` | The drawer opens / closes. |
| `mtx:drawer:mode-change` | Drawer | `{ mode, previousMode }` | A `responsive` drawer crosses its breakpoint. |
| `mtx:list:select` | ListItemButton | `{ item }` | A list item is selected. |
| `mtx:menu:open` / `mtx:menu:close` | Menu | — | The menu opens / closes. |
| `mtx:menu:select` | Menu | `{ item, checked? }` | An item is chosen. |
| `mtx:pagination:change` | Pagination | `{ page, previousPage, href? }` | The page changes (cancelable in link mode). |
| `mtx:radio-group:change` | RadioGroup | `{ value }` | The group's selected option changes. |
| `mtx:rating:change` / `mtx:rating:active` | Rating | `{ value }` | The value changes / the hovered value changes. |
| `mtx:snackbar:open` / `mtx:snackbar:close` / `mtx:snackbar:action` | Snackbar | — / `{ reason }` / — | Shown / closed / action clicked. |
| `mtx:speed-dial:open` / `mtx:speed-dial:close` | SpeedDial | `{ speedDial }` | The SpeedDial opens / closes. |
| `mtx:stepper:change` | Stepper, MobileStepper | `{ activeStep, previousStep, reset? }` | The active step changes. **Cancelable**. |
| `mtx:table:selection-change` | Table | `{ selected, rows, count, reason }` | The row selection changes. |
| `mtx:table:sort` | TableSortLabel | `{ direction, active, key }` | A column's sort order changes. |
| `mtx:table:page-change` / `mtx:table:rows-per-page-change` | TablePagination | `{ page, previousPage, reason }` / `{ rowsPerPage, previousRowsPerPage, page }` | The page / rows per page change. |
| `mtx:tabs:before-change` | Tabs | `{ tab, panel, previousTab, previousPanel }` | Before switching tabs. **Cancelable**. |
| `mtx:tabs:change` | Tabs | `{ tab, panel, previousTab, previousPanel }` | After switching tabs. |
| `mtx:text-field:password-visibility` | TextField | `{ visible }` | The password is shown or hidden. |
| `mtx:text-field:adornment-click` | TextField | `{ position, button, input }` | A `data-start-action` / `data-end-action` button is clicked. |
| `mtx:toggle-button:change` / `mtx:toggle-button-group:change` | ToggleButton / ToggleButtonGroup | `{ selected, value }` / `{ value }` | The selection changes. |
| `mtx:locale:change` | i18n (on `document`) | `{ locale }` | `setLocale()` changes the global language. |
| `mtx:theme:change` | theme (on `document`, doesn't bubble) | `{ theme, mode, previous }` | The effective theme or the mode changes. |
| `mtx:change` · `mtx:open` / `mtx:close` | DateTimePicker | `{ value, iso, … }` · `{ picker }` | See the DateTimePicker page. |

### Deprecated aliases

Events renamed to the convention keep dispatching their old name, with the same `detail`, right after the new one. The aliases will be removed in **1.0**: migrate your listeners.

| Old name (deprecated) | New name |
|---|---|
| `mtx-select` | `mtx:list:select` |
| `mtx:change` (RadioGroup) | `mtx:radio-group:change` |
| `mtx:password-visibility` | `mtx:text-field:password-visibility` |
| `mtx:adornment-click` | `mtx:text-field:adornment-click` |
| `mtx:drawer:modechange` | `mtx:drawer:mode-change` |
| `mtx-speed-dial-open` / `mtx-speed-dial-close` | `mtx:speed-dial:open` / `mtx:speed-dial:close` |
| `mtx:localechange` | `mtx:locale:change` |
| `mtx:theme-change` | `mtx:theme:change` |

{{< callout type="warning" title="Don't listen to both names" >}}
Both the new event and its alias are dispatched for the same action. Listening to both would run your handler twice.
{{< /callout >}}

Your own components can follow the same pattern with the `emit(target, name, detail, { aliases, cancelable })` helper of `src/core/events.js` (it returns `false` if the event or an alias was canceled).

Form controls (TextField, Select, NativeSelect, Checkbox, Radio, Switch) also fire the native `input` and `change` events on the `<input>` or `<select>`. Select and DateTimePicker fire a native `change` when the value changes through their UI.

### Canceling a tab change

```javascript
document.getElementById('settings-tabs').addEventListener('mtx:tabs:before-change', (event) => {
  if (formHasUnsavedChanges() && !confirm('You have unsaved changes. Leave anyway?')) {
    event.preventDefault();
  }
});
```
