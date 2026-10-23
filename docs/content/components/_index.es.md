---
title: "Componentes"
description: "Todos los componentes de Materix UI agrupados por función. Cada uno se inicializa con un atributo data-mtx y sigue el diseño de Material UI."
weight: 1
---

## Convenciones comunes

Todos los componentes comparten las mismas reglas, así que lo que aprendes en uno sirve para el resto:

| Convención | Detalle |
|---|---|
| Prefijo | Clases CSS `mtx-*` con nomenclatura BEM (`mtx-button--contained`). |
| Inicialización | Atributo `data-mtx="{nombre}"`; la librería lo detecta al cargar el DOM. |
| Sintaxis simplificada | Un único elemento con atributos `data-*`; la estructura interna se genera sola. |
| Uso programático | `new Materix.X(element)` o `Materix.init(element)`. |
| Tema | Claro y oscuro mediante design tokens `--mtx-*` y `data-mtx-theme="dark"`. |
| Accesibilidad | Semántica nativa, teclado, foco visible y ARIA gestionado por el componente. |

## Registro central e inicialización manual

Los componentes se registran en un registro central y se auto-inicializan de forma **idempotente**. Para contenido dinámico también puedes inicializarlos a mano:

```javascript
// Inicializar un elemento (detecta data-mtx o recibe el nombre)
const instance = Materix.init(element);
const button = Materix.init(element, 'button');

// Instanciación directa con la clase
const dialog = new Materix.Dialog(element);

// Recuperar la instancia ya creada
const same = Materix.getInstance(element);

// Inicializar un contenedor con contenido dinámico (SPA, AJAX)
Materix.initAll(container);

// Observar el DOM y auto-inicializar lo que se añada
Materix.watch(container);
```

{{< callout type="tip" title="Ejemplos en vivo" >}}
Cada componente tiene una página de ejemplos exhaustiva en la carpeta `/examples` que consume la librería real. Ábrela desde el enlace **Ejemplo en vivo** de la cabecera de cada componente.
{{< /callout >}}
