---
title: "Divider"
description: "Línea fina que separa y agrupa contenido en listas, menús y diseños, en horizontal o vertical y opcionalmente con texto."
group: "data-display"
icon: "horizontal_rule"
weight: 40
example: "divider"
mui: "https://mui.com/material-ui/react-divider/"
---

`Divider` es una línea de 1px con el color `divider` del tema que separa grupos de contenido. Úsalo entre secciones de una lista, entre bloques de un formulario o entre acciones de una barra. No lo uses como decoración en todas partes: el espacio en blanco suele separar mejor; y si necesitas un contenedor con borde, usa [Paper](../paper/) `outlined`.

## Uso básico

Un `<hr>` con `data-mtx="divider"`. Al ser `<hr>`, ya tiene el rol semántico de separador.

{{< mtx-demo title="Divider horizontal" layout="block" >}}
<p>Contenido de la primera sección.</p>
<hr data-mtx="divider">
<p>Contenido de la segunda sección.</p>
{{< /mtx-demo >}}

## Variantes

`data-variant` ajusta los márgenes laterales: sin valor ocupa todo el ancho; `middle` deja 16px a cada lado; `inset` deja 72px a la izquierda para alinear con el texto de una lista con iconos o avatares.

{{< mtx-demo title="Ancho completo, middle e inset" layout="block" >}}
<p>Ancho completo</p>
<hr data-mtx="divider">
<p>Middle</p>
<hr data-mtx="divider" data-variant="middle">
<p>Inset</p>
<hr data-mtx="divider" data-variant="inset">
{{< /mtx-demo >}}

## Orientación vertical

`data-orientation="vertical"` crea una línea vertical que se estira a la altura de su contenedor flex. Usa un `<div>`: el componente añade `role="separator"` y `aria-orientation="vertical"` por ti. `data-flex-item` hace que un divider funcione como ítem flexible en contenedores que no estiran a sus hijos.

{{< mtx-demo title="Separar acciones" >}}
<button data-mtx="icon-button" data-icon="format_bold" aria-label="Negrita"></button>
<button data-mtx="icon-button" data-icon="format_italic" aria-label="Cursiva"></button>
<div data-mtx="divider" data-orientation="vertical" data-flex-item></div>
<button data-mtx="icon-button" data-icon="format_align_left" aria-label="Alinear a la izquierda"></button>
<button data-mtx="icon-button" data-icon="format_align_center" aria-label="Centrar"></button>
{{< /mtx-demo >}}

## Con texto

Escribe el texto como contenido de un `<div>` o usa `data-text`. `data-text-align` lo coloca a la izquierda o a la derecha (por defecto, centrado).

{{< mtx-demo title="Texto centrado, a la izquierda y a la derecha" layout="column" >}}
<div data-mtx="divider">CENTRO</div>
<div data-mtx="divider" data-text="IZQUIERDA" data-text-align="left"></div>
<div data-mtx="divider" data-text="DERECHA" data-text-align="right"></div>
{{< /mtx-demo >}}

## En listas

Dentro de una lista, usa un `<li>` como divider para mantener HTML válido; `inset` alinea la línea con el texto de los ítems. El componente **no** le pone `role="separator"` a ese `<li>` (una lista solo puede contener elementos de lista, regla axe `list`): si está vacío lo marca `aria-hidden="true"` como decorativo, para que los lectores de pantalla no lo cuenten como ítem. Alternativamente, `data-divider` en cada `list-item` dibuja un borde inferior.

{{< mtx-demo title="Divider inset entre ítems" layout="block" >}}
<ul data-mtx="list" aria-label="Bandeja">
  <li data-mtx="list-item" data-icon="inbox">Bandeja de entrada</li>
  <li data-mtx="divider" data-variant="inset"></li>
  <li data-mtx="list-item" data-icon="drafts">Borradores</li>
  <li data-mtx="divider" data-variant="inset"></li>
  <li data-mtx="list-item" data-icon="send">Enviados</li>
</ul>
{{< /mtx-demo >}}

## Casos de uso reales

Separador «o» entre un acceso social y el formulario clásico de inicio de sesión.

{{< mtx-demo title="Inicio de sesión" layout="column" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button">Continuar con Google</button>
<div data-mtx="divider">o</div>
<input data-mtx="text-field" data-label="Correo electrónico" data-variant="outlined" type="email">
{{< /mtx-demo >}}

## Sintaxis BEM completa

Las clases funcionan sin JavaScript; el componente solo las añade a partir de los atributos `data-*` y genera el `<span>` del texto.

```html
<hr class="mtx-divider mtx-divider--middle">

<div class="mtx-divider mtx-divider--vertical mtx-divider--flex-item"
     role="separator" aria-orientation="vertical"></div>

<div class="mtx-divider mtx-divider--text mtx-divider--text-left" role="separator">
  <span class="mtx-divider__text">Sección</span>
</div>
```

## Uso programático

Divider no tiene métodos ni eventos propios; solo necesitas inicializarlo si lo creas dinámicamente.

```javascript
const divider = document.createElement('div');
divider.setAttribute('data-text', 'Nuevos');
container.append(divider);

Materix.init(divider, 'divider');          // o new Materix.Divider(divider)
Materix.getInstance(divider);              // instancia existente
Materix.initAll(container);                // todo lo que haya en un contenedor
```

Con ES modules:

```javascript
import { Divider } from 'materix-ui';
new Divider(document.querySelector('#separator'));
```

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-orientation` | `horizontal`, `vertical` | `horizontal` | Dirección de la línea. |
| `data-variant` | `middle`, `inset` | ancho completo | Márgenes laterales: 16px a cada lado o 72px a la izquierda. |
| `data-flex-item` | Booleano (presencia) | ausente | Altura automática y `align-self: stretch` dentro de un contenedor flex. |
| `data-text` | Texto | contenido del elemento | Texto central. Si falta, se usa el texto del elemento (excepto en `<hr>`). |
| `data-text-align` | `left`, `right` | centrado | Posición del texto. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-divider` | Línea horizontal de 1px con `--mtx-color-divider`. |
| `mtx-divider--vertical` | Línea vertical de 1px que se estira en su contenedor. |
| `mtx-divider--middle` | Márgenes laterales de 16px. |
| `mtx-divider--inset` | Margen izquierdo de 72px. |
| `mtx-divider--flex-item` | Comportamiento de ítem flexible. |
| `mtx-divider--text` | Divider con texto (línea, texto, línea). |
| `mtx-divider--text-left` / `--text-right` | Texto desplazado a un lado. |
| `mtx-divider__text` | Texto generado (body2, color secundario). |

### Métodos

Divider no expone métodos propios.

### Eventos

Divider no emite eventos.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-divider` | Color de la línea. |
| `--mtx-color-text-secondary` | Color del texto. |
| `--mtx-type-body2` | Tipografía del texto. |
| `--mtx-spacing-1_5` | Separación entre el texto y las líneas. |

## Accesibilidad

- `<hr>` tiene el rol implícito `separator`; es la opción recomendada para dividers horizontales.
- En un `<div>` (o un `<li>` fuera de una lista), el componente añade `role="separator"` (salvo que pongas tu propio `role`) y, en los verticales, `aria-orientation="vertical"`, como MUI. El marcado sin JavaScript (solo clases CSS) debe añadirlos a mano.
- Un divider `<li>` hijo directo de `<ul>`, `<ol>` o `role="list"` conserva su rol de elemento de lista; vacío recibe `aria-hidden="true"` (decorativo) y con texto sigue siendo legible.
- Un divider puramente decorativo dentro de una barra de herramientas puede llevar `aria-hidden="true"`, o `role="presentation"` para que el componente no añada `separator`.
- El texto de un divider con texto es contenido legible: escríbelo con sentido («o», «Sección 2»), no con símbolos.
