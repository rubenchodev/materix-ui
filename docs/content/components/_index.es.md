---
title: "Componentes"
description: "Todos los componentes React de Materix UI agrupados por propósito. Cada uno es un componente React tipado que sigue el diseño de Material UI."
weight: 1
---

## Convenciones comunes

Todos los componentes comparten las mismas reglas, así que lo que aprendes en uno sirve para el resto:

| Convención | Detalle |
|---|---|
| Import | Exportaciones con nombre desde `@rubenchodev/materix-react` (o `@rubenchodev/materix-react/components/{nombre}` para importar solo uno). |
| Estilos | Importa `@rubenchodev/materix-ui/base.css` una vez; cada componente trae su propio CSS. |
| Props | Nombres al estilo MUI: `variant`, `color`, `size`, `disabled`, `startIcon`… totalmente tipados en TypeScript. |
| Atributos nativos | Las props adicionales (`id`, `aria-*`, `data-*`, manejadores de eventos) llegan al elemento raíz; `className` se combina. |
| Refs | `ref` apunta al elemento DOM raíz. |
| Tema | Claro y oscuro mediante los design tokens `--mtx-*` y `data-mtx-theme` (ver [Temas]({{< relref "/guide/theming" >}})). |
| Accesibilidad | Semántica nativa, teclado, foco visible y ARIA gestionados por el componente. |
