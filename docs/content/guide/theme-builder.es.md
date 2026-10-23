---
title: "Generador de tema"
description: "Elige la paleta de tu marca, modo claro u oscuro, forma y tipografía, previsualiza componentes Materix reales en vivo y exporta el CSS de override."
weight: 45
icon: "palette"
wide: true
toc: false
---

Elige un color **main** para cada entrada de la paleta. El generador calcula `-light` y `-dark` igual que `augmentColor` de MUI (`lighten(main, 0.2)`, `darken(main, 0.3)`), además de `-contrast` (texto blanco o `rgba(0, 0, 0, 0.87)` sobre el color) y `-text` (el color del texto sobre el fondo). En el modo de contraste **WCAG AA**, el predeterminado y el que usa la librería por defecto, `-contrast` usa `contrastThreshold: 4.5` de MUI y `-text` es el color main, o un tono más oscuro (modo claro) o más claro (modo oscuro) del mismo, hasta alcanzar 4.5:1 sobre el fondo más exigente (el gris de los campos filled). El modo **MUI exacto** usa `contrastThreshold: 3` y el color main como `-text`, como los valores por defecto de MUI, y señala cada combinación por debajo de **4.5:1**. Las paletas clara y oscura se editan por separado: cambia el modo para editar y previsualizar cada una. Tus elecciones se guardan en este navegador.

{{< theme-builder >}}

## Usar el CSS generado

Guarda el archivo (por ejemplo `materix-theme.css`) y cárgalo **después** de la hoja de estilos de la librería, para que sus tokens prevalezcan sobre los valores por defecto:

```html
<link rel="stylesheet" href="materix.min.css">
<link rel="stylesheet" href="materix-theme.css">
```

El bloque `:root` contiene la paleta clara, la forma y la fuente; el bloque `[data-mtx-theme="dark"]` solo sobrescribe la paleta del tema oscuro. Si eliges una fuente distinta de Roboto o la del sistema, añade también el `<link>` de Google Fonts que aparece en el comentario al inicio del archivo. El resto de tokens (texto, fondos, estados de acción, elevación…) se describe en [Temas y personalización]({{< relref "/guide/theming" >}}).

{{< callout type="tip" title="Avisos de contraste" >}}
Los avisos solo aparecen en el modo **MUI exacto** (o con colores en los que ni el texto blanco ni el oscuro alcanzan 4.5:1). Un aviso sobre el texto **contained** indica que el texto blanco u oscuro sobre el color main queda por debajo de 4.5:1 (los propios valores por defecto `warning` e `info` de MUI están en ese caso). Un aviso sobre el **fondo** indica que el texto o los botones outlined de ese color se leen mal: cambia a WCAG AA o elige un tono más oscuro en modo claro o uno más claro en modo oscuro. Ver [Contraste de color]({{< relref "/guide/accessibility#contraste-de-color" >}}).
{{< /callout >}}
