---
title: "Quick start"
description: "The Materix UI mental model: write one element with data-mtx and the library builds the structure, the state and the accessibility."
weight: 20
icon: "bolt"
---

You write **a single HTML element with `data-mtx`** plus `data-*` attributes. When the page loads, Materix builds the internal structure (label, outline, icons, helper text), wires up the events and applies the ARIA attributes. No JavaScript required.

## A form in five lines

{{< mtx-demo title="Sign-up form" layout="column" >}}
<input data-mtx="text-field" data-label="Full name" data-variant="outlined" name="name" required>
<input data-mtx="text-field" data-label="Email" data-variant="outlined" data-start-icon="email" data-helper-text="We'll never share it" type="email" name="email">
<select data-mtx="select" data-label="Country" name="country">
  <option value="co">Colombia</option>
  <option value="mx">Mexico</option>
  <option value="es">Spain</option>
</select>
<input type="checkbox" data-mtx="checkbox" data-label="I accept the terms" name="terms">
<button type="submit" class="mtx-button mtx-button--contained" data-mtx="button">Create account</button>
{{< /mtx-demo >}}

The controls are still native `<input>`, `<select>` and `<button>` elements: they are submitted with the form, honor `name`, `required`, `disabled` and `value`, and work with the browser's built-in validation.

## Simplified syntax (recommended)

A single semantic element. Configuration goes in `data-*` attributes:

```html
<input data-mtx="text-field" data-label="Name" data-variant="filled" data-start-icon="person">
```

What happens on initialization:

1. Materix wraps the `<input>` in a `.mtx-text-field` container and moves the `data-*` attributes and classes onto it.
2. It generates the floating `<label>`, the notched outline (`outlined`), the icons and the helper text.
3. It preserves the `<input>`'s original attributes (`id`, `name`, `value`, `required`, `disabled`...) and assigns it an `id` if it has none, to link the label.
4. It marks the element with `data-mtx-initialized` and stores the instance in the registry.

This process is called **auto-scaffolding** and it is idempotent: initializing twice does not duplicate anything.

## Full BEM syntax

If you render on the server and want to control every node, write the full structure. Materix detects that it already exists and simply binds to it:

```html
<div class="mtx-text-field mtx-text-field--outlined" data-mtx="text-field">
  <label class="mtx-text-field__label" for="name">Name</label>
  <div class="mtx-text-field__container">
    <input class="mtx-text-field__input" id="name" type="text" placeholder=" ">
  </div>
</div>
```

Both syntaxes produce the same visual result. Each component page documents its BEM structure in the **Full BEM syntax** section.

{{< callout type="info" title="Buttons: classes, not data-variant" >}}
`Button`, `IconButton` and `Fab` are built on the native `<button>` and their variant is declared with classes: `class="mtx-button mtx-button--contained"`. `data-mtx="button"` adds the ripple, the size (`data-size`) and the disabled state on links. See the modifiers on the [Button]({{< relref "/components/button" >}}) page.
{{< /callout >}}

## Conventions

| Convention | Form | Example |
|---|---|---|
| Prefix | Everything in the library starts with `mtx-` | `mtx-card`, `--mtx-color-primary` |
| BEM block | `mtx-{component}` | `mtx-text-field` |
| BEM element | `mtx-{component}__{element}` | `mtx-text-field__label` |
| BEM modifier | `mtx-{component}--{modifier}` | `mtx-button--outlined`, `mtx-button--small` |
| Initialization | `data-mtx="{component}"` in kebab-case | `data-mtx="date-picker"` |
| Options | `data-{option}` in kebab-case | `data-start-icon`, `data-helper-text` |
| Internal state | `data-mtx-initialized` (set by the library; don't write it) | — |
| Tokens | `--mtx-*` CSS variables | `--mtx-shape-radius` |
| Events | `mtx:{component}:{action}` | `mtx:dialog:close` |
| Theme | `data-mtx-theme` on `<html>` | `data-mtx-theme="dark"` |
| Global API | `Materix` object (UMD) or named imports (ESM) | `Materix.getInstance(el)` |

## Declarative and programmatic

The declarative syntax covers the common cases. When you need to control a component from code, retrieve the instance that auto-initialization already created:

```javascript
const dialog = Materix.getInstance(document.getElementById('confirm'));
dialog.open();
```

For an element without `data-mtx` (for example, one created from JavaScript), instantiate the class directly:

```javascript
const el = document.createElement('button');
el.className = 'mtx-button mtx-button--outlined';
el.textContent = 'Save';
document.body.append(el);

const button = new Materix.Button(el);
button.disable();
```

{{< callout type="warning" >}}
Don't use `new Materix.X(el)` on an element that already has `data-mtx`: auto-initialization has already created an instance and you would end up with two, with duplicated events. Use `Materix.getInstance(el)` or `Materix.init(el)`, which returns the existing one.
{{< /callout >}}

Each component's methods are listed in its **API reference** section. The full lifecycle (when initialization happens, dynamic content, events) is covered in [Initialization]({{< relref "/guide/initialization" >}}).
