---
title: "Templates"
description: "Complete, responsive pages built only with Materix UI components. Open the live preview, copy the HTML and adapt it to your project."
icon: "dashboard_customize"
weight: 15
---

## How to use a template

Each template is a single, self-contained `index.html` file inside the [`/templates`](https://github.com/rubenchodev/materix-ui/tree/vainilla/templates) folder of the repository. It uses the real library, so what you see in the preview is exactly what you get.

1. Open the **Live preview** to try it, or **Source code** to read it.
2. Copy the HTML into your project. Page-specific styles live in a `<style>` block with `tpl-{slug}-*` classes built on `--mtx-*` tokens, and the interactivity in a short `<script>` at the end of the `<body>`.
3. Point the `<link>` and `<script>` tags to your copy of Materix UI (or to a CDN) and replace the sample content with your own.

## Dependencies

- `materix.min.css` and `materix.umd.js` from the `dist/` folder (or a CDN).
- The **Roboto** and **Material Icons** fonts from Google Fonts.
- `templates/shared/template.js` (optional): light/dark theme switching. If you don't copy it, remove the theme button or wire it to your own logic.

## Dark theme

All templates support both themes. Use the theme button in each template or add `?theme=dark` (or `?theme=light`) to the URL to force one, for example `sign-in/index.html?theme=dark`.

## License

Templates are released under the **MIT license**, like the rest of Materix UI: you can use them in personal and commercial projects, modify them and redistribute them.
