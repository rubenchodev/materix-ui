---
title: "Instalación"
description: "Instala Materix UI con npm, una CDN o archivos directos, importa solo los componentes que usas, usa los tipos TypeScript, carga Roboto y Material Icons y arranca desde una plantilla HTML mínima."
weight: 10
icon: "download"
---

Materix UI se distribuye como **bundle completo** (un CSS y un JS) y como **módulos ES por componente** para bundlers. No tiene dependencias en tiempo de ejecución. Elige npm (con bundler), una CDN o archivos directos (`<link>` + `<script>`).

## Archivos de la distribución

`npm run build` genera `dist/`:

| Archivo | Formato | Úsalo cuando |
|---|---|---|
| `dist/materix.min.css` | CSS único con tokens, base, todos los componentes y las utilidades | Usas el bundle completo. |
| `dist/materix.es.js` | ES module (`import`) con todos los componentes | Trabajas con Vite, webpack, Rollup o `<script type="module">`. |
| `dist/materix.umd.js` | UMD: expone el global `window.Materix` | Cargas la librería con un `<script>` clásico. |
| `dist/materix.umd.cjs` | El mismo UMD como CommonJS | `require('@rubenchodev/materix-ui')` (Node, Jest). |
| `dist/components/{nombre}.js` | Un componente (ES module); importa el CSS que necesita | Importas solo lo que usas. |
| `dist/components/{nombre}.css` / `.bundle.css` | Estilos propios del componente / con sus dependencias | Estilos sin el módulo JS. |
| `dist/core.js` | Registro, ciclo de vida, `ComponentBase`, `emit`, tema, i18n, posicionamiento | Uso por componente. |
| `dist/base.css` / `dist/utilities.css` | Tokens + estilos base / clases de utilidad | Uso por componente. |
| `dist/chunks/*` | Código compartido de los módulos por componente | Nunca se importa directamente. |

El paquete incluye además las declaraciones TypeScript en `types/`.

## Con npm

```bash
npm install @rubenchodev/materix-ui
```

Importa el JS y el CSS en el punto de entrada de tu aplicación:

```javascript
import Materix from '@rubenchodev/materix-ui';
import '@rubenchodev/materix-ui/materix.min.css';
```

`@rubenchodev/materix-ui` resuelve a `dist/materix.es.js` (con `import`) o a `dist/materix.umd.cjs` (con `require`). `@rubenchodev/materix-ui/dist/materix.min.css` sigue funcionando. También puedes importar por nombre:

```javascript
import { initAll, getInstance, Dialog, setLocale } from '@rubenchodev/materix-ui';
```

{{< callout type="info" title="El import ya inicializa" >}}
Importar la librería registra todos los componentes e inicializa los `[data-mtx]` presentes en el documento. No necesitas llamar a `initAll()` salvo para contenido que añadas después. Ver [Inicialización]({{< relref "/guide/initialization" >}}).
{{< /callout >}}

## Imports por componente

Con un bundler puedes incluir solo los componentes que usas. Cada módulo `@rubenchodev/materix-ui/components/{nombre}` registra su componente, programa un `initAll()` automático (al cargar el DOM) e **importa su propio CSS y el de los componentes que usa por dentro**. Basta con importar el módulo; solo añades `base.css` (tokens y estilos base) una vez.

```javascript
import '@rubenchodev/materix-ui/base.css';                    // tokens + estilos base: siempre primero
import '@rubenchodev/materix-ui/components/autocomplete';     // JS + CSS de autocomplete, text-field, chip…
import { Button } from '@rubenchodev/materix-ui/components/button';
import { getInstance, theme, watch } from '@rubenchodev/materix-ui/core';
import '@rubenchodev/materix-ui/utilities.css';               // opcional: siempre al final
```

`{nombre}` es la carpeta del componente: `button`, `text-field`, `date-time-picker`, `toggle-button`, `app-bar`… El núcleo JavaScript compartido y cada archivo CSS se incluyen **una sola vez** aunque los importen varios componentes (el bundler deduplica cada módulo `components/{nombre}.css`). Como referencia, una app Vite que solo usa Button pesa unos 28 kB de JS (9 kB gzip) y 30 kB de CSS (5 kB gzip); una que solo usa Autocomplete, 81 kB de JS (22 kB gzip) y 72 kB de CSS (10 kB gzip). El bundle completo pesa 414 kB / 373 kB.

Los módulos importan archivos `.css`, así que necesitan un bundler que procese imports de CSS (Vite, webpack con `css-loader`, Parcel, Rollup con un plugin de CSS…). Sin bundler, usa el bundle completo.

Hojas de estilo disponibles por componente:

| Archivo | Contenido | Úsalo cuando |
|---|---|---|
| `@rubenchodev/materix-ui/components/{nombre}.css` | Solo los estilos del componente (sin dependencias). | Control fino, o estilos sin el JavaScript. Es el archivo que importa el módulo. |
| `@rubenchodev/materix-ui/components/{nombre}.bundle.css` | El componente y los componentes que usa por dentro, en orden de dependencia (sin `base.css`). | Un `<link>` o un import solo de CSS. No lo combines con el módulo JS ni con otro `.bundle.css` que comparta dependencias: las reglas compartidas se cargarían dos veces. |

Como referencia, estas son las hojas que cada módulo importa además de la suya (generadas a partir del grafo de imports de `src/components` y del marcado que renderiza cada componente):

| Módulo | Importa también el CSS de |
|---|---|
| `app-bar` | `icon-button` |
| `autocomplete` | `form-helper-text`, `icon-button`, `text-field`, `chip`, `progress` |
| `breadcrumbs` | `link` |
| `button-group` | `progress`, `button` |
| `button` | `progress` |
| `card` | `avatar`, `icon-button` |
| `checkbox` | `form-helper-text` |
| `date-time-picker` | `form-helper-text`, `icon-button`, `text-field`, `progress`, `button` |
| `drawer` | `avatar`, `icon-button` |
| `radio` | `form-helper-text`, `checkbox` |
| `speed-dial` | `tooltip`, `fab` |
| `stack` | `divider` |
| `stepper` | `progress`, `button` |
| `switch` | `form-helper-text`, `checkbox` |
| `text-field` | `form-helper-text`, `icon-button` |

{{< callout type="warning" title="No mezcles ambos builds" >}}
En una página usa el bundle completo (`@rubenchodev/materix-ui`) o los módulos por componente (`@rubenchodev/materix-ui/components/*` + `@rubenchodev/materix-ui/core`), no ambos: cada uno tiene su propio registro, de modo que `getInstance()` de uno no ve las instancias del otro.
{{< /callout >}}

## TypeScript

Las declaraciones vienen en el paquete (no hace falta un paquete `@types`): cada clase de componente con sus métodos públicos, la API del núcleo con genéricos y los eventos `mtx:*` tipados como `CustomEvent`.

```typescript
import { getInstance, init, type Dialog } from '@rubenchodev/materix-ui';

const dialog = getInstance<Dialog>(document.getElementById('confirm'));
dialog?.open();

const select = init(element, 'select');           // Select | null
element.addEventListener('mtx:tabs:change', (event) => {
  console.log(event.detail.tab);                  // HTMLElement
});
```

Los módulos por componente tienen sus propios tipos (`@rubenchodev/materix-ui/components/button`, `@rubenchodev/materix-ui/core`). Para el global UMD en scripts sin módulos, añade `/// <reference types="@rubenchodev/materix-ui" />`.

## Desde una CDN

Cualquier CDN que sirva paquetes npm funciona con las mismas rutas. Fija siempre la versión exacta:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rubenchodev/materix-ui@0.3.1/dist/materix.min.css">
<script src="https://cdn.jsdelivr.net/npm/@rubenchodev/materix-ui@0.3.1/dist/materix.umd.js"></script>
```

Con unpkg: `https://unpkg.com/@rubenchodev/materix-ui@0.3.1/dist/materix.umd.js`. Los módulos JavaScript por componente importan archivos CSS, que el navegador no puede cargar como módulos: desde una CDN usa el bundle completo (los archivos `components/{nombre}.bundle.css` se pueden enlazar si solo necesitas estilos).

## Con archivos directos (sin bundler)

Copia `dist/materix.min.css` y `dist/materix.umd.js` a tu proyecto y enlázalos:

```html
<link rel="stylesheet" href="/assets/materix/materix.min.css">
<!-- ... contenido ... -->
<script src="/assets/materix/materix.umd.js"></script>
```

El script expone el global `Materix` con toda la API pública:

```javascript
Materix.initAll();
const dialog = Materix.getInstance(document.getElementById('confirm'));
```

{{< callout type="warning" title="Orden de carga de scripts" >}}
Coloca `materix.umd.js` **al final del `<body>`** (o en el `<head>` con `defer`). Tus propios scripts que usan `Materix` deben ir **después** y, si se ejecutan en el `<head>`, envolver su lógica en `document.addEventListener('DOMContentLoaded', ...)`. Un script que llama a `Materix.getInstance()` antes de que la librería cargue obtiene `Materix is not defined`, y uno que se ejecuta antes del DOM obtiene `undefined` como instancia.
{{< /callout >}}

## Fuentes: Roboto y Material Icons

La tipografía (`--mtx-font-family`) es **Roboto** y los iconos usan la fuente **Material Icons** (clase `.material-icons`). La librería no las incluye: cárgalas tú en el `<head>`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

Los pesos 300, 400, 500 y 700 cubren toda la escala tipográfica (títulos `h1`/`h2` usan 300, botones y `subtitle2` usan 500, `<strong>` usa 700).

Sin Roboto, los componentes funcionan con la alternativa `Helvetica, Arial, sans-serif`. Sin Material Icons, los atributos como `data-start-icon="email"` muestran el nombre del icono como texto.

## Plantilla HTML mínima

Copia, guarda como `index.html` y ábrelo en el navegador:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi app con Materix UI</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="dist/materix.min.css">
</head>
<body class="mtx-root">
  <main style="max-width: 480px; margin: 48px auto; display: grid; gap: 16px;">
    <input data-mtx="text-field" data-label="Correo electrónico" data-variant="outlined" data-start-icon="email" type="email">
    <button class="mtx-button mtx-button--contained" data-mtx="button">Suscribirme</button>
  </main>

  <script src="dist/materix.umd.js"></script>
</body>
</html>
```

La clase `mtx-root` en `<body>` aplica la base de la librería: `box-sizing: border-box`, fuente, color de texto, color de fondo del tema, `color-scheme` y el anillo de foco visible. Sin ella, los componentes se pintan, pero el resto de la página no hereda el tema.

{{< callout type="tip" >}}
`<html lang="es">` también decide el idioma de los textos internos de los componentes (calendario, buscador del Select, paginación). Ver [Internacionalización]({{< relref "/guide/i18n" >}}).
{{< /callout >}}

## Siguiente paso

Lee [Uso rápido]({{< relref "/guide/quick-start" >}}) para entender la sintaxis de un solo elemento y las convenciones de nombres.
