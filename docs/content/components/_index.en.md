---
title: "Components"
description: "Every Materix UI React component grouped by purpose. Each one is a typed React component that follows the Material UI design."
weight: 1
---

## Common conventions

All components share the same rules, so what you learn in one applies to the rest:

| Convention | Details |
|---|---|
| Import | Named exports from `@rubenchodev/materix-react` (or `@rubenchodev/materix-react/components/{name}` to import just one). |
| Styles | Import `@rubenchodev/materix-ui/base.css` once; each component brings its own CSS. |
| Props | MUI-like names: `variant`, `color`, `size`, `disabled`, `startIcon`… fully typed in TypeScript. |
| Native attributes | Extra props (`id`, `aria-*`, `data-*`, event handlers) are forwarded to the root element; `className` is merged. |
| Refs | `ref` points to the root DOM element. |
| Theme | Light and dark through `--mtx-*` design tokens and `data-mtx-theme` (see [Theming]({{< relref "/guide/theming" >}})). |
| Accessibility | Native semantics, keyboard, visible focus and ARIA managed by the component. |
