---
title: "Materix UI"
description: "Librería de componentes inspirada en Material UI que se usa con atributos data-mtx: sin React, sin Web Components y sin paso de compilación obligatorio."
---

## Uso en 30 segundos

Carga la hoja de estilos y el script, escribe HTML con `data-mtx` y listo: al cargar el DOM los componentes se inicializan solos.

```html
<link rel="stylesheet" href="dist/materix.min.css">

<button class="mtx-button mtx-button--contained" data-mtx="button">Guardar</button>
<input data-mtx="text-field" data-label="Correo electrónico" data-variant="outlined" data-start-icon="email" type="email" />

<script src="dist/materix.umd.js"></script>
```

{{< callout type="info" title="Fuentes recomendadas" >}}
Los componentes usan **Roboto** y la fuente **Material Icons**. Cárgalas desde Google Fonts para obtener el aspecto MUI exacto; sin ellas todo sigue funcionando con la fuente del sistema.
{{< /callout >}}

Para activar el tema oscuro basta con un atributo en `<html>`:

```html
<html data-mtx-theme="dark">
```
