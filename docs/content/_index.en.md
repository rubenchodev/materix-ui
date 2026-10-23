---
title: "Materix UI"
description: "A component library inspired by Material UI that you use through data-mtx attributes: no React, no Web Components and no mandatory build step."
---

## Up and running in 30 seconds

Load the stylesheet and the script, write HTML with `data-mtx` and you are done: components initialize themselves when the DOM loads.

```html
<link rel="stylesheet" href="dist/materix.min.css">

<button class="mtx-button mtx-button--contained" data-mtx="button">Save</button>
<input data-mtx="text-field" data-label="Email" data-variant="outlined" data-start-icon="email" type="email" />

<script src="dist/materix.umd.js"></script>
```

{{< callout type="info" title="Recommended fonts" >}}
Components use **Roboto** and the **Material Icons** font. Load them from Google Fonts to get the exact MUI look; without them everything still works with the system font.
{{< /callout >}}

To enable the dark theme, a single attribute on `<html>` is enough:

```html
<html data-mtx-theme="dark">
```
