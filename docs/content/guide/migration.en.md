---
title: "Migrating from vanilla"
description: "Move from the vanilla library to React: data-* attributes become props, mtx:* events become callbacks, Materix.theme becomes useTheme and initialization disappears."
weight: 60
icon: "swap_horiz"
---

The React version keeps the CSS, the `--mtx-*` tokens and the look of [Materix UI vanilla](https://qualitycode.dev/materix-ui/vainilla/). What changes is how you describe and control components: React owns the DOM, so there are no `data-mtx` attributes, no auto-initialization and no instances to look up.

## Mental model

| Vanilla | React |
|---|---|
| `<link>` to `materix.min.css` + `<script>` UMD | `import '@rubenchodev/materix-ui/base.css'` once + named imports |
| `data-mtx="dialog"` on an element | `<Dialog>` component |
| `data-*` attributes (`data-variant`, `data-label`…) | Props (`variant`, `label`…) |
| Auto-generated inner structure (single-element syntax) | The component renders its own structure |
| `Materix.initAll()`, `Materix.watch()`, `getInstance()` | Not needed: React mounts and updates components |
| Instance methods (`dialog.open()`, `button.disable()`) | State + props (`open`, `disabled`) or a `ref` |
| `mtx:{component}:{action}` events on the element | Callback props (`onClose`, `onChange`…) |
| `Materix.theme.set()` / `toggle()` | `useTheme().setMode()` / `toggle()` |
| `data-mtx-theme-toggle` buttons | A button that calls `useTheme().toggle` |
| `Materix.i18n` / `data-mtx-locale` | `I18nProvider`, `locale` prop, `addLocale()` |

## Attributes become props

`data-*` attributes map to camelCase props with the same meaning. Boolean attributes become boolean props.

```html
<!-- Vanilla -->
<input data-mtx="text-field" data-label="Email" data-variant="outlined"
       data-start-icon="email" data-helper-text="We never share it" required />
```

```tsx
// React
<TextField label="Email" variant="outlined" startIcon="email"
           helperText="We never share it" required />
```

BEM modifier classes (`mtx-button--contained`, `mtx-button--small`) also become props (`variant="contained"`, `size="small"`). Each component page lists its exact props and types.

## Imperative calls become state

```js
// Vanilla
const dialog = Materix.getInstance(document.querySelector('#confirm'));
dialog.open();
document.querySelector('#confirm').addEventListener('mtx:dialog:close', save);
```

```tsx
// React
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Delete</Button>
<Dialog open={open} onClose={() => { setOpen(false); save(); }}>…</Dialog>
```

## Theme and language

```js
// Vanilla
Materix.theme.configure({ persist: true });
Materix.theme.toggle();
```

```tsx
// React
<MaterixProvider defaultMode="system">   {/* persists in localStorage by default */}
  <App />
</MaterixProvider>

const { toggle } = useTheme();
```

Both versions use the same `data-mtx-theme` attribute on `<html>`, so custom CSS written for vanilla themes keeps working. See [Theming]({{< relref "/guide/theming" >}}) and [Internationalization]({{< relref "/guide/i18n" >}}).

{{< callout type="tip" title="Gradual migration" >}}
Both packages share the same stylesheet, so a page can mix server-rendered vanilla markup and React islands during the migration. Load the CSS only once and let each part manage its own DOM.
{{< /callout >}}
