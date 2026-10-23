---
title: "Link"
description: "Enlace de texto con el estilo de MUI sobre un <a> nativo: colores de la paleta y tres modos de subrayado, sin perder semántica."
group: "navigation"
icon: "link"
weight: 20
example: "link"
mui: "https://mui.com/material-ui/react-link/"
---

`Link` aplica el estilo de enlace de MUI (color de la paleta y subrayado siempre visible, el valor por defecto de MUI v5; hereda la tipografía del texto que lo rodea, como `variant="inherit"`) sobre un `<a href>` nativo, de modo que conserva la navegación, el foco y el menú contextual del navegador. Úsalo para navegar a otra página o sección dentro de un texto. Si la acción no navega (guardar, abrir un diálogo, enviar un formulario), usa [Button](../button/) con la variante `text`; para destinos principales de la aplicación, usa [Drawer](../drawer/) o [Tabs](../tabs/).

## Uso básico

Un solo elemento `<a>` con `data-mtx="link"`. El componente añade la clase `mtx-link` y, si los hay, los modificadores de `data-color` y `data-underline`.

{{< mtx-demo title="Enlace simple" >}}
<a data-mtx="link" href="#">Ver documentación</a>
{{< /mtx-demo >}}

## Colores

`data-color` acepta los seis colores de la paleta, `text-primary`, `text-secondary` e `inherit`. Sin atributo, el enlace usa `primary`.

{{< mtx-demo title="Paleta y colores de texto" >}}
<a data-mtx="link" href="#">primary</a>
<a data-mtx="link" data-color="secondary" href="#">secondary</a>
<a data-mtx="link" data-color="error" href="#">error</a>
<a data-mtx="link" data-color="warning" href="#">warning</a>
<a data-mtx="link" data-color="info" href="#">info</a>
<a data-mtx="link" data-color="success" href="#">success</a>
<a data-mtx="link" data-color="text-primary" href="#">text-primary</a>
<a data-mtx="link" data-color="text-secondary" href="#">text-secondary</a>
{{< /mtx-demo >}}

`inherit` toma el color del texto que lo rodea, útil dentro de alertas, barras de aplicación o superficies de color.

{{< mtx-demo title="Color heredado" >}}
<div data-mtx="alert" data-severity="warning">
  Tu suscripción vence mañana. <a data-mtx="link" data-color="inherit" data-underline="always" href="#">Renovar ahora</a>
</div>
{{< /mtx-demo >}}

{{< callout type="warning" title="Contraste" >}}
Sobre fondo blanco, `warning` (#ed6c02) y `info` (#0288d1) quedan por debajo de 4.5:1 en texto de 14px. Úsalos para enlaces secundarios o junto a texto que ya explique el destino, y prefiere `primary` para enlaces dentro de párrafos.
{{< /callout >}}

## Subrayado

`data-underline` controla la decoración: `always` (predeterminado, como en MUI v5: subrayado suave al 40% del color del enlace que se vuelve sólido en hover; obligatorio dentro de párrafos), `hover` (solo al pasar el cursor) y `none` (nunca, ni siquiera en hover). Usa `hover` o `none` solo en enlaces que no estén dentro de un texto corrido (navegación, listas, pies de página).

{{< callout type="warning" title="Cambio de comportamiento" >}}
Antes de esta versión el valor por defecto era `hover`. Para conservar el aspecto anterior en un enlace concreto, añade `data-underline="hover"` (o la clase `mtx-link--underline-hover`). Los enlaces que genera [Breadcrumbs](../breadcrumbs/) mantienen el subrayado en hover.
{{< /callout >}}

{{< mtx-demo title="Modos de subrayado" >}}
<a data-mtx="link" href="#">always (predeterminado)</a>
<a data-mtx="link" data-underline="hover" href="#">hover</a>
<a data-mtx="link" data-underline="none" href="#">none</a>
{{< /mtx-demo >}}

## Dentro de un párrafo

Dentro de un texto corrido el color no debe ser la única pista: conserva el subrayado por defecto (`always`) para que el enlace se distinga también sin percibir el color.

{{< mtx-demo title="Enlaces en texto" layout="block" >}}
<p data-mtx="typography" data-variant="body2">
  Al crear la cuenta aceptas los <a data-mtx="link" href="#">términos del servicio</a>
  y la <a data-mtx="link" href="#">política de privacidad</a>.
  Puedes cambiar tus preferencias en cualquier momento desde el panel de ajustes.
</p>
{{< /mtx-demo >}}

{{< callout type="info" title="Tipografía del enlace" >}}
`mtx-link` hereda la tipografía del texto que lo rodea (familia, tamaño, peso e interlineado), como `variant="inherit"` en MUI: encaja igual en párrafos `body1`, `body2`, captions o pies de formulario.
{{< /callout >}}

## Estados

Los estados interactivos son nativos del navegador. `data-disabled` deshabilita el enlace: en `<a>` aplica `aria-disabled="true"`, lo saca del orden de tabulación y bloquea el clic; en `<button>` usa `disabled`.

{{< mtx-demo title="Hover, foco y deshabilitado" >}}
<a data-mtx="link" href="#">Pasa el cursor: el subrayado se vuelve sólido</a>
<a data-mtx="link" href="#">Usa Tab: anillo de foco visible</a>
<a data-mtx="link" href="#" data-disabled>Enlace deshabilitado</a>
{{< /mtx-demo >}}

## Como botón

Para una acción que no navega pero debe verse como enlace dentro de un texto («Reenviar código», «¿Olvidaste tu contraseña?»), usa `<button data-mtx="link">` (equivale a `component="button"` de MUI): sin fondo, borde ni relleno nativos, con la tipografía del texto. Si no indicas `type`, el componente pone `type="button"` para que no envíe formularios.

{{< mtx-demo title="Link sobre button" >}}
<p class="mtx-typography--body2">¿No recibiste el código? <button data-mtx="link">Reenviar código</button></p>
<button data-mtx="link" disabled>Reenviar en 30 s</button>
{{< /mtx-demo >}}

## Enlaces externos

Para abrir en otra pestaña añade `target="_blank"` y `rel="noopener noreferrer"`, y avisa del cambio de contexto en el propio texto del enlace (o en su `aria-label`, que sustituye al texto visible para los lectores de pantalla).

{{< mtx-demo title="Enlace a otro sitio" >}}
<a data-mtx="link" href="https://mui.com/material-ui/react-link/" target="_blank" rel="noopener noreferrer">Guía de MUI (abre otra pestaña)</a>
<a data-mtx="link" href="https://github.com/" target="_blank" rel="noopener noreferrer"
   aria-label="Repositorio en GitHub (se abre en una pestaña nueva)">Repositorio en GitHub</a>
{{< /mtx-demo >}}

## Casos de uso reales

Pie de un formulario de acceso con enlaces secundarios y migas de pan con enlaces de texto.

{{< mtx-demo title="Pie de formulario de acceso" layout="column" >}}
<input data-mtx="text-field" data-label="Correo electrónico" data-variant="outlined" type="email" autocomplete="email">
<button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Iniciar sesión</button>
<p data-mtx="typography" data-variant="body2">
  <a data-mtx="link" href="#">¿Olvidaste tu contraseña?</a> ·
  <a data-mtx="link" data-color="text-secondary" href="#">Crear una cuenta</a>
</p>
{{< /mtx-demo >}}

{{< mtx-demo title="Migas de pan" >}}
<nav aria-label="Ruta de navegación">
  <a data-mtx="link" data-color="text-secondary" href="#">Inicio</a> /
  <a data-mtx="link" data-color="text-secondary" href="#">Proyectos</a> /
  <span aria-current="page">Materix UI</span>
</nav>
{{< /mtx-demo >}}

## Sintaxis BEM completa

El estilo es puramente CSS: con las clases escritas a mano no hace falta JavaScript. `data-mtx="link"` solo es necesario si quieres que la instancia quede registrada.

```html
<a class="mtx-link" href="/inicio">Inicio</a>
<a class="mtx-link mtx-link--secondary mtx-link--underline-always" href="/terminos">Términos</a>
<a class="mtx-link mtx-link--text-secondary mtx-link--underline-none" data-mtx="link" href="/ayuda">Ayuda</a>
```

## Uso programático

Los enlaces declarativos se inicializan solos. Para enlaces creados dinámicamente:

```javascript
// Inicializar un elemento creado en tiempo de ejecución
const anchor = document.createElement('a');
anchor.href = '/perfil';
anchor.textContent = 'Mi perfil';
anchor.setAttribute('data-color', 'secondary');
document.querySelector('#acciones').append(anchor);
Materix.init(anchor, 'link'); // añade data-mtx="link" y las clases

// Instanciación directa y recuperación
const link = new Materix.Link(document.getElementById('enlace-ayuda'));
const same = Materix.getInstance(document.getElementById('enlace-ayuda'));

// Inicializar todo lo que haya dentro de un contenedor
Materix.initAll(document.getElementById('resultados'));
```

Con ES modules:

```javascript
import { Link, init, getInstance } from 'materix-ui';
```

Los atributos se leen solo al crear la instancia: para cambiar el color después, cambia la clase (`mtx-link--secondary`, etc.) directamente.

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `link` | — | Inicializa el componente sobre el `<a>` o `<button>`. |
| `data-color` | `primary`, `secondary`, `error`, `warning`, `info`, `success`, `inherit`, `text-primary`, `text-secondary` | `primary` (por CSS) | Añade `mtx-link--{color}` y su alias `mtx-link--color-{color}`. |
| `data-underline` | `always`, `hover`, `none` | `always` (por CSS) | Añade `mtx-link--underline-{valor}`. |
| `data-disabled` | booleano | — | Deshabilita al iniciar (`disabled` en `<button>`; `aria-disabled` y `tabindex="-1"` en `<a>`). |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-link` | Bloque base: color primario, hereda la tipografía (`font: inherit`), subrayado suave (`text-decoration-color` al 40%) que se vuelve sólido en hover, anillo de foco. Sobre `<button>` elimina fondo, borde y relleno nativos. Con `:disabled` o `aria-disabled="true"`, color de texto deshabilitado y sin interacción. |
| `mtx-link--primary` … `mtx-link--success` | Color de la paleta (`primary`, `secondary`, `error`, `warning`, `info`, `success`). |
| `mtx-link--text-primary` / `mtx-link--text-secondary` | Color de texto principal o secundario. |
| `mtx-link--inherit` | Hereda el color del contenedor. |
| `mtx-link--color-{color}` | Alias de cada clase de color anterior (las añade también `data-color`). |
| `mtx-link--underline-hover` | Subrayado solo en hover. |
| `mtx-link--underline-always` | Subrayado siempre visible (comportamiento por defecto). |
| `mtx-link--underline-none` | Sin subrayado, tampoco en hover. |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `disable()` | `void` | Deshabilita el enlace (`disabled` o `aria-disabled` según la etiqueta). |
| `enable()` | `void` | Lo habilita de nuevo. |
| `disabled` (getter) | `boolean` | Estado deshabilitado. |
| `destroy()` | `void` | Retira el listener que bloquea el clic deshabilitado. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

`Link` no emite eventos; usa el evento `click` nativo del `<a>`.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-text-disabled` | Color deshabilitado. |
| `--mtx-color-primary`, `--mtx-color-secondary`, `--mtx-color-error`, `--mtx-color-warning`, `--mtx-color-info`, `--mtx-color-success` | Color de cada variante. |
| `--mtx-color-text-primary`, `--mtx-color-text-secondary` | Colores de texto. |
| `--mtx-duration-shorter`, `--mtx-easing-standard` | Transición de color. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco (`:focus-visible`). |

## Accesibilidad

- Usa siempre un `<a>` con `href`: así el enlace es enfocable, se activa con <kbd>Enter</kbd> y los lectores de pantalla lo anuncian como enlace. Para una acción sin destino dentro de un texto usa `<button data-mtx="link">`; para acciones destacadas, `Button`.
- El texto debe describir el destino («Ver la política de privacidad»), no «haz clic aquí».
- Dentro de párrafos conserva el subrayado por defecto (`always`) para no depender solo del color (WCAG 1.4.1, regla axe `link-in-text-block`); no uses `hover`/`none` ahí.
- Enlaces externos con `target="_blank"`: añade `rel="noopener noreferrer"` y avisa del cambio de contexto en el texto o en `aria-label` (Materix no incluye una clase de texto solo para lectores de pantalla).
- El foco por teclado muestra un anillo de `--mtx-focus-ring-width` con desplazamiento de 2px.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco al enlace siguiente o anterior. |
| <kbd>Enter</kbd> | Sigue el enlace. |
