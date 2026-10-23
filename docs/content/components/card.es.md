---
title: "Card"
description: "Superficie que agrupa contenido y acciones sobre un único tema: cabecera, imagen, texto y botones."
group: "surfaces"
icon: "web"
weight: 20
example: "card"
mui: "https://mui.com/material-ui/react-card/"
---

**Card** agrupa en una superficie elevada la información y las acciones de un único elemento: un producto, una receta, un perfil. Se compone de partes opcionales —cabecera, media, contenido, acciones y área de acción— que se generan desde atributos `data-*`. Úsala cuando el bloque sea autónomo y escaneable en una colección; para una superficie genérica sin estructura usa [Paper](../paper/) y para listas densas usa [List](../list/).

## Uso básico

`data-title`, `data-subheader`, `data-avatar` y `data-image` generan la cabecera y la imagen; el contenido y las acciones se declaran con `data-mtx="card-content"` y `data-mtx="card-actions"`.

{{< mtx-demo title="Tarjeta completa" >}}
<div data-mtx="card" class="doc-card-sample"
     data-avatar="R"
     data-title="Paella valenciana"
     data-subheader="14 de septiembre de 2026"
     data-action-icon="more_vert"
     data-image="https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80">
  <div data-mtx="card-content">Plato mediterráneo con arroz bomba, azafrán, pollo de corral y verduras frescas.</div>
  <div data-mtx="card-actions">
    <button data-mtx="icon-button" data-icon="favorite" aria-label="Añadir a favoritos"></button>
    <button data-mtx="icon-button" data-icon="share" aria-label="Compartir"></button>
  </div>
</div>
{{< /mtx-demo >}}

<style>.doc-card-sample { width: 100%; max-width: 345px; }</style>

## Variantes

Por defecto la tarjeta tiene elevación 1. `data-variant="outlined"` la delimita con un borde y sin sombra; `data-raised` la eleva a 8 (como `raised` de MUI); `data-elevation` acepta 0–8, 12, 16 y 24; `data-square` elimina el radio.

{{< mtx-demo title="Elevation, outlined, raised y square" >}}
<div data-mtx="card">
  <div data-mtx="card-content"><h3>Predeterminada</h3><p>Elevación 1.</p></div>
</div>
<div data-mtx="card" data-variant="outlined">
  <div data-mtx="card-content"><h3>Outlined</h3><p>Borde sin sombra.</p></div>
</div>
<div data-mtx="card" data-raised>
  <div data-mtx="card-content"><h3>Raised</h3><p>Elevación 8.</p></div>
</div>
<div data-mtx="card" data-elevation="4" data-square>
  <div data-mtx="card-content"><h3>Square</h3><p>Elevación 4, sin radio.</p></div>
</div>
{{< /mtx-demo >}}

## Cabecera

La cabecera (`.mtx-card__header`) se genera si hay `data-title`, `data-subheader` o `data-avatar`. El avatar es un [Avatar](../avatar/) primario con el texto indicado; `data-action-icon` añade un IconButton a la derecha con el icono de Material Icons indicado.

{{< mtx-demo title="Variantes de cabecera" layout="row" >}}
<div data-mtx="card" class="doc-card-sample" data-title="Informe trimestral">
  <div data-mtx="card-content">Solo título.</div>
</div>
<div data-mtx="card" class="doc-card-sample" data-avatar="AM" data-title="Ana Martín" data-subheader="Diseño de producto" data-action-icon="more_vert">
  <div data-mtx="card-content">Avatar, título, subtítulo y acción.</div>
</div>
{{< /mtx-demo >}}

## Media

`data-image` (o `data-media`) genera un `.mtx-card__media` a sangre de 194 px. Por defecto se coloca después de la cabecera; `data-media-top` lo pone arriba y `data-media-height` (o `data-height`) fija la altura en píxeles. La imagen generada así es decorativa: si transmite información, usa un `data-mtx="card-media"` propio con `data-alt`.

{{< mtx-demo title="Imagen arriba, 140 px" >}}
<div data-mtx="card" class="doc-card-sample" data-variant="outlined" data-media-top data-media-height="140"
     data-title="Lagarto verde" data-subheader="Reptilia · Squamata"
     data-image="https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80">
  <div data-mtx="card-content">Más de 6000 especies en todos los continentes salvo la Antártida.</div>
  <div data-mtx="card-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button">Compartir</button>
    <button class="mtx-button mtx-button--text" data-mtx="button">Saber más</button>
  </div>
</div>
{{< /mtx-demo >}}

## Acciones

`card-actions` es una fila con 8 px de relleno y de separación; los botones adoptan el tamaño compacto de MUI (32 px de alto, 13 px de texto) y se alinean a la derecha por defecto (consulta [Alineación de acciones](#alineación-de-acciones)). `mtx-card__actions-end` empuja un elemento al extremo derecho dejando el resto al inicio y `data-disable-spacing` elimina la separación.

{{< mtx-demo title="Acciones" >}}
<div data-mtx="card" class="doc-card-sample">
  <div data-mtx="card-content"><h3>Receta guardada</h3><p>Tiempo de preparación: 45 minutos.</p></div>
  <div data-mtx="card-actions">
    <button data-mtx="icon-button" data-icon="favorite_border" aria-label="Me gusta"></button>
    <button data-mtx="icon-button" data-icon="share" aria-label="Compartir"></button>
    <button class="mtx-button mtx-button--contained mtx-card__actions-end" data-mtx="button">Cocinar</button>
  </div>
</div>
{{< /mtx-demo >}}

## Alineación de acciones

Las acciones de la tarjeta van **a la derecha** por defecto, igual que las de un diálogo. Cámbialo con `data-align="start|center|end|between"` en `card-actions`, o fíjalo para todas las filas de acciones de una tarjeta con `data-actions-align` en la tarjeta (el `data-align` propio de una fila tiene prioridad). El atributo funciona también sin JavaScript.

{{< callout type="info" title="Desviación consciente de MUI" >}}
`CardActions` de MUI alinea sus botones a la **izquierda**. Materix los alinea a la derecha por defecto para que tarjetas y diálogos coloquen las acciones en el mismo sitio. Usa `data-align="start"` (o `data-actions-align="start"` en la tarjeta) para recuperar la disposición original de MUI.
{{< /callout >}}

{{< mtx-demo title="Alineación de acciones" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-2">
  <div data-mtx="card" class="doc-card-sample">
    <div data-mtx="card-content"><h3 class="mtx-card__title">Copia de seguridad</h3><p>Última copia hace 2 horas. (end)</p></div>
    <div data-mtx="card-actions">
      <button class="mtx-button mtx-button--text" data-mtx="button">Historial</button>
      <button class="mtx-button mtx-button--text" data-mtx="button">Restaurar</button>
    </div>
  </div>
  <div data-mtx="card" class="doc-card-sample">
    <div data-mtx="card-content"><h3 class="mtx-card__title">Copia de seguridad</h3><p>Última copia hace 2 horas. (start)</p></div>
    <div data-mtx="card-actions" data-align="start">
      <button class="mtx-button mtx-button--text" data-mtx="button">Historial</button>
      <button class="mtx-button mtx-button--text" data-mtx="button">Restaurar</button>
    </div>
  </div>
  <div data-mtx="card" class="doc-card-sample">
    <div data-mtx="card-content"><h3 class="mtx-card__title">Plan gratuito</h3><p>Hasta 3 proyectos. (center)</p></div>
    <div data-mtx="card-actions" data-align="center">
      <button class="mtx-button mtx-button--contained" data-mtx="button">Empezar</button>
    </div>
  </div>
  <div data-mtx="card" class="doc-card-sample" data-actions-align="between">
    <div data-mtx="card-content"><h3 class="mtx-card__title">Pedido #1042</h3><p>En reparto. (between)</p></div>
    <div data-mtx="card-actions">
      <button data-mtx="icon-button" data-icon="more_vert" aria-label="Más opciones"></button>
      <button class="mtx-button mtx-button--contained" data-mtx="button">Seguir</button>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

```html
<div data-mtx="card-actions">…</div>                      <!-- derecha (predeterminado) -->
<div data-mtx="card-actions" data-align="start">…</div>   <!-- izquierda, como MUI -->
<div data-mtx="card-actions" data-align="center">…</div>
<div data-mtx="card" data-actions-align="between">…</div> <!-- todas las filas de acciones de la tarjeta -->
```

## Área de acción

`data-mtx="card-action-area"` convierte imagen y texto en una única zona pulsable con ripple, hover y anillo de foco, sin afectar a los botones de `card-actions`. Si es un `<button>` o `<a>` se usa su semántica nativa; en otro elemento añade `role="button"`, `tabindex="0"` y soporte de Enter y Espacio. Con `data-clickable` en la propia tarjeta, toda ella se vuelve interactiva.

{{< mtx-demo title="CardActionArea y tarjeta clickable" layout="row" >}}
<div data-mtx="card" class="doc-card-sample">
  <button data-mtx="card-action-area">
    <div data-mtx="card-media" data-height="140" data-alt="Cúpulas de colores de la catedral de San Basilio"
         data-image="https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80"></div>
    <div data-mtx="card-content">
      <div class="mtx-card__title">Descubre Moscú</div>
      <div>Museos, teatros y el metro más ornamentado del mundo.</div>
    </div>
  </button>
  <div data-mtx="card-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button">Reservar</button>
  </div>
</div>
<div data-mtx="card" class="doc-card-sample" data-variant="outlined" data-clickable
     data-avatar="C" data-title="Configuración" data-subheader="Cuenta y privacidad">
  <div data-mtx="card-content">Toda la tarjeta responde al clic y al teclado.</div>
</div>
{{< /mtx-demo >}}

## Estados

Las tarjetas clickables y las áreas de acción admiten `data-disabled`: quedan con `aria-disabled="true"`, opacidad reducida, sin eventos de puntero y fuera del orden de tabulación. Hover eleva una tarjeta clickable a 4 y el foco por teclado muestra el anillo `--mtx-focus-ring-color`.

{{< mtx-demo title="Normal y deshabilitada" >}}
<div data-mtx="card" data-clickable data-title="Normal" data-subheader="Pasa el cursor o usa Tab">
  <div data-mtx="card-content">Interactiva.</div>
</div>
<div data-mtx="card" data-clickable data-disabled data-title="Deshabilitada" data-subheader="aria-disabled=true">
  <div data-mtx="card-content">No interactiva.</div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

### Grilla de productos

Las tarjetas ocupan el ancho de su columna de [Grid](../grid/): una columna en móvil, dos en tableta y tres en escritorio.

{{< mtx-demo title="Catálogo" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <div data-mtx="card" data-media-top data-media-height="160"
         data-image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80">
      <div data-mtx="card-content"><h3>Reloj clásico</h3><p>Correa de cuero. 89,00 €</p></div>
      <div data-mtx="card-actions">
        <button class="mtx-button mtx-button--contained" data-mtx="button">Añadir al carrito</button>
        <button data-mtx="icon-button" data-icon="favorite_border" aria-label="Guardar reloj" class="mtx-card__actions-end"></button>
      </div>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <div data-mtx="card" data-media-top data-media-height="160"
         data-image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80">
      <div data-mtx="card-content"><h3>Auriculares</h3><p>30 h de batería. 149,00 €</p></div>
      <div data-mtx="card-actions">
        <button class="mtx-button mtx-button--contained" data-mtx="button">Añadir al carrito</button>
        <button data-mtx="icon-button" data-icon="favorite_border" aria-label="Guardar auriculares" class="mtx-card__actions-end"></button>
      </div>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <div data-mtx="card" data-media-top data-media-height="160"
         data-image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80">
      <div data-mtx="card-content"><h3>Zapatillas</h3><p>Ligeras y transpirables. 75,00 €</p></div>
      <div data-mtx="card-actions">
        <button class="mtx-button mtx-button--contained" data-mtx="button">Añadir al carrito</button>
        <button data-mtx="icon-button" data-icon="favorite_border" aria-label="Guardar zapatillas" class="mtx-card__actions-end"></button>
      </div>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Si la tarjeta ya contiene `.mtx-card__header` (o `.mtx-card-header`) o `.mtx-card__media` (o `.mtx-card-media`), no se generan: el componente solo añade comportamiento.

```html
<article class="mtx-card" data-mtx="card">
  <header class="mtx-card__header" data-mtx="card-header">
    <div class="mtx-card__header-avatar">
      <div class="mtx-avatar mtx-avatar--secondary" data-mtx="avatar">JS</div>
    </div>
    <div class="mtx-card__header-content">
      <span class="mtx-card__title">Desarrollo web moderno</span>
      <span class="mtx-card__subheader">Arquitectura limpia en JavaScript</span>
    </div>
    <div class="mtx-card__header-action">
      <button class="mtx-icon-button" data-mtx="icon-button" aria-label="Opciones del curso">
        <span class="material-icons" aria-hidden="true">more_vert</span>
      </button>
    </div>
  </header>
  <div class="mtx-card__media" data-mtx="card-media" data-image="curso.jpg" data-height="160" data-alt="Portátil con código"></div>
  <div class="mtx-card__content" data-mtx="card-content">Construye librerías de componentes sin frameworks.</div>
  <div class="mtx-card__actions" data-mtx="card-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button">Ver proyecto</button>
  </div>
</article>
```

## Uso programático

Las tarjetas se inicializan al cargar la página. `Card` y `CardActionArea` exponen `disable()`, `enable()`, `focus()` y el getter `disabled`; `CardMedia` expone la propiedad `image`. No emiten eventos propios: escucha el `click` nativo, que también se dispara con Enter y Espacio en las zonas interactivas.

```javascript
// UMD (window.Materix)
const el = document.getElementById('card-settings');      // con data-clickable
const card = Materix.getInstance(el);
el.addEventListener('click', () => openSettings());
card.disable();      // aria-disabled="true", tabindex=-1
card.enable();
card.focus();

const media = Materix.getInstance(document.querySelector('#hero [data-mtx="card-media"]'));
media.image = 'nueva-portada.jpg';   // background-image (o src si es <img>)
```

```javascript
// ES modules
import { Card, CardActionArea, CardMedia } from '@rubenchodev/materix-ui';

const card = new Card(document.querySelector('#producto'));
```

## Referencia de API

### Atributos data-*

**Card** (`data-mtx="card"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-title` | texto | — | Título de la cabecera generada. |
| `data-subheader` | texto | — | Subtítulo de la cabecera generada. |
| `data-avatar` | texto | — | Texto de un Avatar primario en la cabecera. |
| `data-action-icon` | nombre de Material Icon | — | IconButton a la derecha de la cabecera. |
| `data-action-label` | texto | i18n `card.actions` (`Actions` / `Acciones`) | `aria-label` del IconButton de la cabecera. |
| `data-image` / `data-media` | URL | — | Genera `.mtx-card__media` con esa imagen de fondo. |
| `data-image-alt` | texto | — | Texto alternativo de la media generada (`role="img"` + `aria-label`); sin él la media es decorativa (`aria-hidden`). |
| `data-media-height` / `data-height` | píxeles | `194` (CSS) | Altura de la media generada. |
| `data-media-top` | booleano (presencia) | ausente | Coloca la media antes de la cabecera. |
| `data-variant` | `outlined` | — | Borde en lugar de sombra. |
| `data-elevation` | `0`–`8`, `12`, `16`, `24` | — (elevación 1) | Sombra `--mtx-elevation-{n}`. |
| `data-raised` | booleano (presencia) | ausente | Elevación 8. |
| `data-square` | booleano (presencia) | ausente | Sin radio. |
| `data-clickable` | booleano (presencia) | ausente | Toda la tarjeta es interactiva (`role="button"`, `tabindex="0"`, ripple, Enter/Espacio). |
| `data-disabled` | booleano (presencia) | ausente | Deshabilita la tarjeta (`aria-disabled`). |
| `data-actions-align` | `start` \| `center` \| `end` \| `between` | `end` | Alineación de las filas de acciones de la tarjeta que no declaran su propio `data-align`. |

**Partes**

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx="card-content"` | — | — | Añade `.mtx-card__content`. |
| `data-mtx="card-actions"` | — | — | Añade `.mtx-card__actions`. |
| `data-align` (en card-actions) | `start` \| `center` \| `end` \| `between` | `end` | Alineación de las acciones. `start` es la disposición de MUI. |
| `data-disable-spacing` (en card-actions) | booleano | ausente | Quita la separación entre acciones. |
| `data-mtx="card-header"` | — | — | Añade `.mtx-card__header` (sintaxis BEM). |
| `data-mtx="card-media"` | — | — | Añade `.mtx-card__media`. |
| `data-image` (en card-media) | URL | — | Imagen de fondo (o `src` si es `<img>`). |
| `data-height` / `data-media-height` (en card-media) | píxeles | `194` (CSS) | Altura. |
| `data-alt` (en card-media) | texto | — | `alt` en `<img>`; en otro elemento, `role="img"` y `aria-label`. Sin él, una `<img>` recibe `alt=""` y una imagen de fondo `aria-hidden="true"`. |
| `data-mtx="card-action-area"` | — | — | Zona pulsable con ripple y foco. |
| `data-disabled` (en card-action-area) | booleano | ausente | Deshabilita el área. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-card` | Superficie flex en columna, elevación 1, `overflow: hidden`. |
| `.mtx-card--outlined` | Borde `--mtx-color-divider` sin sombra. |
| `.mtx-card--elevation-{n}` | Sombra para n = 0–8, 12, 16, 24. |
| `.mtx-card--raised` | Elevación 8. |
| `.mtx-card--square` | Sin radio. |
| `.mtx-card--clickable` | Cursor, elevación 4 al pasar el cursor y anillo de foco. |
| `.mtx-card--disabled` | Opacidad reducida y sin eventos de puntero. |
| `.mtx-card-action-area` | Zona interactiva con capa de hover (4 %) y foco (12 %). |
| `.mtx-card-action-area--disabled` | Área deshabilitada. |
| `.mtx-card__header` | Fila de cabecera (16 px de relleno). |
| `.mtx-card__header-avatar` / `__header-content` / `__header-action` | Zonas de la cabecera. |
| `.mtx-card__title` / `.mtx-card__subheader` | Textos de la cabecera. |
| `.mtx-card__media` | Imagen a sangre, 194 px por defecto, `background-size: cover`. |
| `.mtx-card__content` | Contenido (16 px; 24 px abajo si es el último hijo). Estiliza `h1`–`h6` y `p` hijos con especificidad 0 (`:where`): una clase `mtx-typography--*` o una utilidad sobre ellos siempre gana. |
| `.mtx-card__actions` | Fila de acciones con 8 px de relleno y separación, alineada a la derecha por defecto (`justify-content: flex-end`). |
| `.mtx-card__actions--start` / `--center` / `--between` | Alineación de las acciones (se añade desde `data-align` / `data-actions-align`; `end` no necesita clase). |
| `.mtx-card__actions--disable-spacing` | Sin separación entre acciones. |
| `.mtx-card__actions-end` | Empuja el elemento a la derecha (`margin-left: auto`). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `Card#disable()` | `void` | `aria-disabled="true"`, clase `--disabled`, `tabindex=-1`. |
| `Card#enable()` | `void` | Revierte `disable()`; restaura `tabindex=0` si es clickable. |
| `Card#focus()` | `void` | Enfoca la tarjeta. |
| `Card#disabled` | `boolean` | Getter: `true` si tiene `aria-disabled="true"`. |
| `Card#destroy()` | `void` | Quita los listeners de una tarjeta clickable. |
| `CardActionArea#disable()` / `enable()` / `focus()` / `destroy()` | `void` | Igual que en Card; en `<button>` también ajusta `disabled`. |
| `CardActionArea#disabled` | `boolean` | Getter de estado. |
| `CardMedia#image` | `string` | Getter/setter de la URL (fondo o `src`). |
| `CardActions#align` | `string` | Getter/setter: `start`, `center`, `end` o `between` (lanza `RangeError` con otro valor). |

### Eventos

Card no emite eventos `mtx:*`. Usa el evento nativo `click` en la tarjeta clickable o en el área de acción; en elementos no nativos el componente lo dispara también con Enter y Espacio.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-background-paper` | Fondo de la tarjeta. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` | Título y contenido. |
| `--mtx-color-text-disabled` / `--mtx-disabled-opacity` | Estado deshabilitado. |
| `--mtx-color-divider` | Borde de `outlined`. |
| `--mtx-color-grey-300` | Fondo de la media mientras carga. |
| `--mtx-elevation-*` | Sombras. |
| `--mtx-overlay-elevation-*` | Capa blanca por elevación en tema oscuro (`background-image`, fórmula de MUI). `none` en claro. |
| `--mtx-focus-ring-width` / `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-shape-radius` | Radio. |
| `--mtx-duration-standard` / `--mtx-duration-shortest` / `--mtx-easing-standard` | Transiciones. |

## Accesibilidad

- Usa `<article>` o `<section>` como raíz cuando la tarjeta sea un contenido autónomo.
- En una tarjeta `data-clickable` sin `<button>`/`<a>` se añaden `role="button"` y `tabindex="0"`; su nombre accesible sale de su contenido (título, subtítulo y texto). Evita un `aria-label` que no contenga el texto visible (WCAG 2.5.3 *Etiqueta en el nombre*, axe `label-content-name-mismatch`); si lo necesitas, empiézalo por el título visible.
- Prefiere `CardActionArea` sobre un `<button>` o `<a>` nativo: conserva su semántica y deja los botones de `card-actions` como controles independientes (no anides botones dentro del área).
- Las imágenes generadas con `data-image` en la tarjeta son decorativas (`aria-hidden`) salvo que añadas `data-image-alt`; úsalo cuando la imagen aporte información.
- Los IconButtons de las acciones necesitan `aria-label`.

| Tecla | Acción |
|---|---|
| `Tab` | Recorre el área de acción, la tarjeta clickable y los botones. |
| `Enter` / `Espacio` | Activa la tarjeta clickable o el área de acción enfocada. |
