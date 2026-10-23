---
title: "Components"
description: "Every Materix UI component grouped by purpose. Each one is initialized with a data-mtx attribute and follows the Material UI design."
weight: 1
---

## Common conventions

All components share the same rules, so what you learn in one applies to the rest:

| Convention | Details |
|---|---|
| Prefix | `mtx-*` CSS classes with BEM naming (`mtx-button--contained`). |
| Initialization | `data-mtx="{name}"` attribute; the library detects it when the DOM loads. |
| Simplified syntax | A single element with `data-*` attributes; the internal structure is generated automatically. |
| Programmatic usage | `new Materix.X(element)` or `Materix.init(element)`. |
| Theme | Light and dark through `--mtx-*` design tokens and `data-mtx-theme="dark"`. |
| Accessibility | Native semantics, keyboard, visible focus and ARIA managed by the component. |

## Central registry and manual initialization

Components are registered in a central registry and auto-initialize **idempotently**. For dynamic content you can also initialize them by hand:

```javascript
// Initialize one element (detects data-mtx or receives the name)
const instance = Materix.init(element);
const button = Materix.init(element, 'button');

// Direct instantiation with the class
const dialog = new Materix.Dialog(element);

// Retrieve the instance that was already created
const same = Materix.getInstance(element);

// Initialize a container with dynamic content (SPA, AJAX)
Materix.initAll(container);

// Observe the DOM and auto-initialize whatever gets added
Materix.watch(container);
```

{{< callout type="tip" title="Live examples" >}}
Each component has an exhaustive examples page in the `/examples` folder that uses the real library. Open it from the **Live example** link in the header of each component.
{{< /callout >}}
