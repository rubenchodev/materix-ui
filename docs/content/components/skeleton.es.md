---
title: "Skeleton"
description: "Marcadores de posición con la forma del contenido que se muestran mientras los datos cargan, con animación pulse o wave."
group: "feedback"
icon: "view_day"
weight: 28
example: "skeleton"
mui: "https://mui.com/material-ui/react-skeleton/"
---

**Skeleton** muestra un bloque gris con la forma del contenido que todavía no ha llegado (texto, avatar, imagen, tarjeta). Reduce la sensación de espera y evita saltos de maquetación cuando los datos aparecen. Úsalo para cargas cortas de contenido con estructura conocida; si no sabes qué forma tendrá el resultado o la operación no carga contenido (guardar, enviar), usa [Progress]({{< relref "/components/progress" >}}).

## Uso básico

Un único elemento con `data-mtx="skeleton"`. Sin variante es una línea de texto que ocupa el ancho disponible y la altura de la tipografía. `data-width` y `data-height` aceptan números (px) o cualquier unidad CSS.

{{< mtx-demo title="Sintaxis simplificada" layout="column" >}}
<span data-mtx="skeleton"></span>
<span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
<span data-mtx="skeleton" data-variant="rectangular" data-width="210" data-height="60"></span>
<span data-mtx="skeleton" data-variant="rounded" data-width="210" data-height="60"></span>
{{< /mtx-demo >}}

## Variantes

Cuatro formas, como en MUI: `text` (por defecto; se reduce al 60 % de la altura de línea y conserva el ritmo vertical del texto), `circular`, `rectangular` (sin radio) y `rounded` (radio de 4px).

{{< mtx-demo title="text, circular, rectangular y rounded" layout="block" >}}
<div data-mtx="stack" data-spacing="1">
  <span data-mtx="skeleton" data-variant="text" data-width="60%"></span>
  <span data-mtx="skeleton" data-variant="circular" data-width="56" data-height="56"></span>
  <span data-mtx="skeleton" data-variant="rectangular" data-height="56"></span>
  <span data-mtx="skeleton" data-variant="rounded" data-height="56"></span>
</div>
{{< /mtx-demo >}}

## Animaciones

`data-animation="pulse"` (por defecto, la opacidad oscila), `"wave"` (una franja recorre el bloque) o `"false"` (estático). Con `prefers-reduced-motion: reduce` la animación se desactiva sola.

{{< mtx-demo title="pulse, wave y false" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <span data-mtx="skeleton" data-variant="rounded" data-height="56"></span>
  <span data-mtx="skeleton" data-variant="rounded" data-height="56" data-animation="wave"></span>
  <span data-mtx="skeleton" data-variant="rounded" data-height="56" data-animation="false"></span>
</div>
{{< /mtx-demo >}}

## Tamaños

La variante `text` hereda el tamaño de la tipografía que la contiene: colócala dentro del mismo elemento que tendrá el texto real y tendrá su altura exacta. Las formas circulares siguen las alturas de Avatar (24, 40 y 56px).

{{< mtx-demo title="Tipografía h3, h5, body1 y caption" layout="block" >}}
<div class="mtx-typography--h3"><span data-mtx="skeleton"></span></div>
<div class="mtx-typography--h5"><span data-mtx="skeleton"></span></div>
<div class="mtx-typography--body1"><span data-mtx="skeleton"></span></div>
<div class="mtx-typography--caption"><span data-mtx="skeleton" data-width="40%"></span></div>
{{< /mtx-demo >}}

{{< mtx-demo title="Círculos de 24, 40 y 56px" >}}
<span data-mtx="skeleton" data-variant="circular" data-width="24" data-height="24"></span>
<span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
<span data-mtx="skeleton" data-variant="circular" data-width="56" data-height="56"></span>
{{< /mtx-demo >}}

## Párrafos

`data-lines="3"` genera varias líneas de texto dentro del elemento; la última es más corta (60 % por defecto, configurable con `data-last-width`).

{{< mtx-demo title="data-lines" layout="block" >}}
<div data-mtx="stack" data-spacing="3">
  <div data-mtx="skeleton" data-lines="3"></div>
  <div data-mtx="skeleton" data-lines="4" data-animation="wave" data-last-width="30%"></div>
</div>
{{< /mtx-demo >}}

## Con hijos

Si el skeleton envuelve contenido, adopta su tamaño exacto y lo oculta con `visibility: hidden` (como `children` en MUI). Así no repites medidas: el propio Avatar, Button o título sirve de molde.

{{< mtx-demo title="Inferir dimensiones del contenido" >}}
<div data-mtx="skeleton" data-variant="circular">
  <div data-mtx="avatar" data-icon="person"></div>
</div>
<div data-mtx="skeleton" data-variant="rounded">
  <button class="mtx-button mtx-button--contained" data-mtx="button">Guardar cambios</button>
</div>
<div class="mtx-typography--h5" data-mtx="skeleton">Título de longitud real</div>
{{< /mtx-demo >}}

## Estados

### Región de carga

Para alternar entre placeholder y contenido sin JavaScript propio, marca el contenedor con `data-loading` y sus hijos directos con `data-skeleton-placeholder` (visible mientras carga) y `data-skeleton-content` (visible al terminar). `Materix.skeleton.set(contenedor, bool)` cambia el estado, sincroniza `aria-busy` y emite `mtx:skeleton:change`.

{{< mtx-demo title="Alternar data-loading" layout="column" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-skeleton-toggle" aria-controls="doc-skeleton-region">Alternar carga</button>
<div id="doc-skeleton-region" aria-live="polite" data-loading aria-busy="true">
  <div data-skeleton-placeholder class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
    <div class="mtx-flex-1">
      <span data-mtx="skeleton" data-width="160"></span>
      <span data-mtx="skeleton" data-width="100"></span>
    </div>
  </div>
  <div data-skeleton-content class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <div data-mtx="avatar" data-color="secondary">LM</div>
    <div>
      <div class="mtx-typography--body1">Lucía Martín</div>
      <div class="mtx-typography--body2 mtx-color-text-secondary">Diseñadora de producto</div>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

```javascript
Materix.skeleton.set('#doc-skeleton-region', false); // muestra el contenido real
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('doc-skeleton-toggle').addEventListener('click', function () {
    Materix.skeleton.toggle('#doc-skeleton-region');
  });
});
</script>

{{< callout type="tip" title="Contenido dinámico" >}}
Si el contenido real se inserta por JavaScript, llama a `Materix.initAll(contenedor)` tras insertarlo y después a `Materix.skeleton.set(contenedor, false)`.
{{< /callout >}}

## Casos de uso reales

### Tarjeta de vídeo

{{< mtx-demo title="Card en carga" layout="block" >}}
<div data-mtx="card" data-elevation="1" class="mtx-mw-100">
  <span data-mtx="skeleton" data-variant="rectangular" data-height="160" data-animation="wave"></span>
  <div class="mtx-p-2 mtx-d-flex mtx-gap-2">
    <span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40" data-animation="wave"></span>
    <div class="mtx-flex-1">
      <span data-mtx="skeleton" data-animation="wave"></span>
      <span data-mtx="skeleton" data-width="60%" data-animation="wave"></span>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

### Lista de mensajes

{{< mtx-demo title="Lista en carga" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
    <div class="mtx-flex-1" data-mtx="skeleton" data-lines="2"></div>
  </div>
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
    <div class="mtx-flex-1" data-mtx="skeleton" data-lines="2"></div>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR, las clases `mtx-skeleton--{variante}` y `mtx-skeleton--{pulse|wave|no-animation}` se respetan al inicializar, y el bloque ya se ve sin JavaScript (añade tú `aria-hidden="true"`). En `data-lines`, si las líneas ya existen no se duplican.

```html
<span class="mtx-skeleton mtx-skeleton--text mtx-skeleton--wave" data-mtx="skeleton" aria-hidden="true"></span>
<span class="mtx-skeleton mtx-skeleton--rounded mtx-skeleton--pulse" data-mtx="skeleton" data-height="48" aria-hidden="true"></span>
<div class="mtx-skeleton-lines" data-mtx="skeleton" data-lines="2" aria-hidden="true">
  <span class="mtx-skeleton mtx-skeleton--text mtx-skeleton--pulse"></span>
  <span class="mtx-skeleton mtx-skeleton--text mtx-skeleton--pulse" style="width: 60%"></span>
</div>
```

## Uso programático

Los elementos `[data-mtx="skeleton"]` se inicializan solos; para contenido dinámico usa `Materix.init(el)` o `new Materix.Skeleton(el)`.

```javascript
// UMD (window.Materix)
const el = document.createElement('span');
el.setAttribute('data-width', '120');
el.setAttribute('data-height', '120');
container.append(el);
const block = Materix.init(el, 'skeleton');   // o: new Materix.Skeleton(el)
block.setVariant('circular').setAnimation('wave');

// Región de carga
Materix.skeleton.set('#perfil', true);
fetch('/api/perfil').then(() => Materix.skeleton.set('#perfil', false));
document.addEventListener('mtx:skeleton:change', (e) => console.log(e.detail.loading));
```

```javascript
// ES modules
import { Skeleton, skeleton } from 'materix-ui';

new Skeleton(document.querySelector('#avatar-placeholder'));
skeleton.toggle(document.querySelector('#perfil'));
```

{{< mtx-demo title="setVariant() y setAnimation()" >}}
<span data-mtx="skeleton" id="doc-skeleton-api" data-variant="rounded" data-width="96" data-height="96"></span>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-skeleton-variant">Cambiar variante</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-skeleton-animation">Cambiar animación</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var block = Materix.getInstance(document.getElementById('doc-skeleton-api'));
  var variants = ['rounded', 'circular', 'rectangular', 'text'];
  var animations = ['pulse', 'wave', 'false'];
  var v = 0;
  var a = 0;
  document.getElementById('doc-skeleton-variant').addEventListener('click', function () {
    v = (v + 1) % variants.length;
    block.setVariant(variants[v]);
  });
  document.getElementById('doc-skeleton-animation').addEventListener('click', function () {
    a = (a + 1) % animations.length;
    block.setAnimation(animations[a]);
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `skeleton` | — | Inicializa el componente. |
| `data-variant` | `text`, `circular`, `rectangular`, `rounded` | `text` | Forma del bloque. |
| `data-width` | número (px) o longitud CSS | ancho del contenedor | Ancho del bloque (o del párrafo con `data-lines`). |
| `data-height` | número (px) o longitud CSS | altura de línea (`text`) / `1.2em` | Alto del bloque. |
| `data-animation` | `pulse`, `wave`, `false` | `pulse` | Animación; `false` la desactiva. |
| `data-lines` | entero ≥ 2 | — | Genera N líneas `text` dentro del elemento. |
| `data-last-width` | número (px) o longitud CSS | `60%` | Ancho de la última línea con `data-lines`. |
| `data-loading` | presente / `false` | — | En un contenedor: muestra `[data-skeleton-placeholder]` y oculta `[data-skeleton-content]`. |
| `data-skeleton-placeholder` | — | — | Hijo directo visible solo mientras el contenedor carga. |
| `data-skeleton-content` | — | — | Hijo directo visible solo cuando el contenedor no carga. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-skeleton` | Bloque base (color `--mtx-skeleton-bg`, `display: block`). |
| `.mtx-skeleton--text` / `--circular` / `--rectangular` / `--rounded` | Variantes de forma. |
| `.mtx-skeleton--pulse` / `--wave` / `--no-animation` | Animaciones. |
| `.mtx-skeleton--with-children` | Se añade cuando envuelve contenido: adopta su tamaño y lo oculta. |
| `.mtx-skeleton__text` | Se genera alrededor del texto directo para ocultarlo con `visibility` (no texto transparente). |
| `.mtx-skeleton-lines` | Contenedor de párrafo generado con `data-lines`. |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `setVariant(variant)` | `this` | Cambia la forma (sin efecto en modo `data-lines`). |
| `setAnimation(animation)` | `this` | Cambia la animación (`'pulse'`, `'wave'`, `'false'` o `false`). |
| `variant` / `animation` | `string` | Getters del estado actual. |
| `destroy()` | `void` | Libera la instancia. |
| `Materix.skeleton.set(target, loading)` | `HTMLElement \| null` | Activa o desactiva la carga de un contenedor (elemento o selector): `data-loading` y `aria-busy`. |
| `Materix.skeleton.toggle(target)` | `boolean` | Alterna la carga y devuelve el nuevo estado. |
| `Materix.skeleton.isLoading(target)` | `boolean` | Indica si el contenedor está cargando. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:skeleton:change` | `{ loading: boolean }` | `Materix.skeleton.set()`/`toggle()` cambia el estado de un contenedor (burbujea). |

### Variables CSS

| Variable | Predeterminado | Descripción |
|---|---|---|
| `--mtx-skeleton-bg` | `rgba(0,0,0,.11)` · oscuro `rgba(255,255,255,.13)` | Color del bloque (text.primary al 11 / 13 % de MUI). |
| `--mtx-skeleton-wave` | `rgba(0,0,0,.04)` · oscuro `rgba(255,255,255,.08)` | Color de la franja de la animación `wave`. |

## Accesibilidad

- Cada bloque es decorativo: el componente añade `aria-hidden="true"`, y `set()` también lo pone en `[data-skeleton-placeholder]`.
- El estado de carga se comunica en el **contenedor**: `aria-busy="true"` mientras carga (lo gestiona `Materix.skeleton.set()`; en HTML estático escríbelo junto a `data-loading`). Con `aria-live="polite"` en ese contenedor, el lector anuncia el contenido cuando `aria-busy` desaparece.
- Si la carga puede tardar, añade un texto visible o un `mtx-visually-hidden` con "Cargando…" dentro del placeholder para quien no ve la animación.
- `prefers-reduced-motion: reduce` detiene `pulse` y `wave`; el bloque estático sigue indicando dónde aparecerá el contenido.
- No hay interacción de teclado: el placeholder no es enfocable y el contenido oculto con `display: none` no recibe foco.
