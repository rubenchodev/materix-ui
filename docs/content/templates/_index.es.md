---
title: "Plantillas"
description: "Páginas completas y responsive construidas solo con componentes de Materix UI. Abre la vista previa, copia el HTML y adáptalo a tu proyecto."
icon: "dashboard_customize"
weight: 15
---

## Cómo usar una plantilla

Cada plantilla es un único archivo `index.html` autocontenido dentro de la carpeta [`/templates`](https://github.com/rubenchodev/materix-ui/tree/vainilla/templates) del repositorio. Usa la librería real, así que lo que ves en la vista previa es exactamente lo que obtienes.

1. Abre la **Vista previa** para probarla o el **Código fuente** para leerla.
2. Copia el HTML a tu proyecto. Los estilos propios de la página están en un bloque `<style>` con clases `tpl-{slug}-*` basadas en tokens `--mtx-*`, y la interactividad en un `<script>` breve al final del `<body>`.
3. Apunta las etiquetas `<link>` y `<script>` a tu copia de Materix UI (o a una CDN) y sustituye el contenido de ejemplo por el tuyo.

Las plantillas están escritas en inglés; cambia los textos al idioma de tu proyecto.

## Dependencias

- `materix.min.css` y `materix.umd.js` de la carpeta `dist/` (o de una CDN).
- Las fuentes **Roboto** y **Material Icons** de Google Fonts.
- `templates/shared/template.js` (opcional): cambio de tema claro/oscuro. Si no lo copias, elimina el botón de tema o conéctalo a tu propia lógica.

## Tema oscuro

Todas las plantillas admiten ambos temas. Usa el botón de tema de cada plantilla o añade `?theme=dark` (o `?theme=light`) a la URL para forzar uno, por ejemplo `sign-in/index.html?theme=dark`.

## Licencia

Las plantillas se publican con **licencia MIT**, como el resto de Materix UI: puedes usarlas en proyectos personales y comerciales, modificarlas y redistribuirlas.
