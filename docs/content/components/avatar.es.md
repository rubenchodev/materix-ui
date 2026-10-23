---
title: "Avatar"
description: "Representa a una persona o entidad con una imagen, sus iniciales o un icono; AvatarGroup apila varios y resume el excedente."
group: "data-display"
icon: "account_circle"
weight: 10
example: "avatar"
mui: "https://mui.com/material-ui/react-avatar/"
---

`Avatar` muestra la identidad de una persona o entidad en un espacio compacto: una foto, sus iniciales o un icono. Úsalo en listas de usuarios, cabeceras de tarjetas, comentarios o barras de aplicación. Si necesitas una etiqueta con texto que se pueda eliminar o pulsar, usa [Chip](../chip/); para un indicador numérico sobre un icono, usa [Badge](../badge/).

## Uso básico

Un solo elemento con `data-mtx="avatar"`. Escribe las iniciales como contenido, o usa `data-src` para una imagen y `data-icon` para un icono de Material Icons.

{{< mtx-demo title="Iniciales, icono e imagen" >}}
<div data-mtx="avatar" data-color="primary">RD</div>
<div data-mtx="avatar" data-icon="folder" data-color="secondary" role="img" aria-label="Carpeta"></div>
<div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=47" data-alt="Ana García"></div>
{{< /mtx-demo >}}

## Variantes

`data-variant` define la forma: `circular` (predeterminada), `rounded` (radio de 4px) o `square` (sin radio).

{{< mtx-demo title="Formas" >}}
<div data-mtx="avatar" data-color="primary">CI</div>
<div data-mtx="avatar" data-variant="rounded" data-color="secondary">RO</div>
<div data-mtx="avatar" data-variant="square" data-color="success">SQ</div>
<div data-mtx="avatar" data-variant="rounded" data-icon="assignment" data-color="info" role="img" aria-label="Tareas"></div>
{{< /mtx-demo >}}

## Tamaños

Hay tres tamaños canónicos: `small` (24px), `medium` (40px, predeterminado) y `large` (56px). Para casos puntuales, `data-size` también acepta un número en píxeles; el tamaño de fuente se calcula como el 45% del lado.

{{< mtx-demo title="Canónicos y personalizado" >}}
<div data-mtx="avatar" data-size="small" data-color="primary">S</div>
<div data-mtx="avatar" data-size="medium" data-color="primary">M</div>
<div data-mtx="avatar" data-size="large" data-color="primary">L</div>
<div data-mtx="avatar" data-size="72" data-color="secondary">72</div>
{{< /mtx-demo >}}

{{< callout type="warning" title="Iconos en avatares pequeños" >}}
Los iconos de Material Icons conservan su cuadrícula nativa de **24px** y no se redimensionan. En el tamaño `small` (24px) el icono ocupa todo el avatar; para ese tamaño prefiere iniciales.
{{< /callout >}}

## Con imagen, letras o icono

El contenido se resuelve en este orden: una `<img>` hija, después `data-src` (que genera la `<img>`, con soporte de `data-srcset` y `data-sizes`), después `data-icon` y, si no hay nada de lo anterior, el texto del elemento.

{{< mtx-demo title="Tipos de contenido" >}}
<div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=12" data-alt="Carlos Ruiz"></div>
<div data-mtx="avatar" data-color="warning">CR</div>
<div data-mtx="avatar" data-icon="person" role="img" aria-label="Usuario"></div>
<div data-mtx="avatar">
  <img src="https://i.pravatar.cc/120?img=32" alt="Lucía Méndez">
</div>
{{< /mtx-demo >}}

## Colores

Sin `data-color`, el avatar usa un gris neutro (`--mtx-avatar-default-bg`) con texto blanco (`--mtx-avatar-default-color`). `data-color` aplica cualquier color de la paleta con su texto de contraste.

{{< callout type="info" title="Desviación de MUI: contraste AA" >}}
El avatar por defecto de MUI usa grey 400 (`#bdbdbd`) con el color de fondo como texto, un contraste de 1,8:1 que no cumple WCAG AA. Materix usa grey 600 (`#757575`) con texto blanco en ambos temas (4,6:1, AA). Para recuperar el aspecto de MUI, sobrescribe `--mtx-avatar-default-bg: var(--mtx-color-grey-400)` y `--mtx-avatar-default-color: var(--mtx-color-background-default)`.
{{< /callout >}}

{{< mtx-demo title="Paleta" >}}
<div data-mtx="avatar">DF</div>
<div data-mtx="avatar" data-color="primary">PR</div>
<div data-mtx="avatar" data-color="secondary">SE</div>
<div data-mtx="avatar" data-color="error">ER</div>
<div data-mtx="avatar" data-color="warning">WA</div>
<div data-mtx="avatar" data-color="info">IN</div>
<div data-mtx="avatar" data-color="success">SU</div>
{{< /mtx-demo >}}

## Estados

Avatar no es interactivo: sus estados son de contenido. Si no hay imagen ni icono, el avatar entra en modo fallback (clase `mtx-avatar--fallback`) y muestra las iniciales o el texto del elemento.

{{< mtx-demo title="Con imagen y sin imagen" >}}
<div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=47" data-alt="Ana García"></div>
<div data-mtx="avatar">AG</div>
<div data-mtx="avatar" data-icon="person" role="img" aria-label="Usuario sin foto"></div>
{{< /mtx-demo >}}

Cuando una imagen da error, el componente oculta la `<img>` rota (`hidden`), añade `mtx-avatar--fallback` y muestra en su lugar la primera letra del texto alternativo (o el texto del elemento).

## Agrupación

`data-mtx="avatar-group"` superpone los avatares con un borde del color de la superficie. `data-max` limita los elementos visibles **incluido** el indicador `+N`, y `data-total` permite anunciar más usuarios de los que hay montados en el DOM.

{{< callout type="info" title="Hijos del grupo" >}}
El grupo cuenta sus hijos `mtx-avatar` y también los hijos `data-mtx="avatar"` aún sin inicializar, así que `data-max` funciona con la sintaxis simplificada.
{{< /callout >}}

{{< mtx-demo title="AvatarGroup con máximo y total" >}}
<div data-mtx="avatar-group" data-max="4" data-label="Participantes">
  <div class="mtx-avatar" data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=5" data-alt="Ana García"></div>
  <div class="mtx-avatar" data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=12" data-alt="Carlos Ruiz"></div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">LM</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">JP</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">OT</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="warning">AS</div>
</div>
<div data-mtx="avatar-group" data-max="3" data-total="24" data-label="Equipo de diseño">
  <div class="mtx-avatar" data-mtx="avatar" data-color="info">RD</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="error">JM</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">LC</div>
</div>
{{< /mtx-demo >}}

`data-spacing` controla el solapamiento: `medium` (8px, predeterminado), `small` (16px, más compacto) o un número de píxeles.

{{< mtx-demo title="Espaciado" >}}
<div data-mtx="avatar-group" data-spacing="medium" data-label="Espaciado medio">
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">A</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">B</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">C</div>
</div>
<div data-mtx="avatar-group" data-spacing="small" data-label="Espaciado pequeño">
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">A</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">B</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">C</div>
</div>
<div data-mtx="avatar-group" data-spacing="0" data-label="Sin solapamiento">
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">A</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">B</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">C</div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Un avatar con indicador de estado en línea (combinado con [Badge](../badge/)) y una lista de autores de comentarios (combinada con [List](../list/)).

{{< mtx-demo title="Estado en línea y lista de autores" layout="column" >}}
<div data-mtx="badge" data-variant="dot" data-color="success" data-overlap="circular" data-anchor="bottom-right">
  <div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=47" data-alt="Ana García"></div>
</div>
<ul data-mtx="list" aria-label="Comentarios recientes">
  <li data-mtx="list-item" data-secondary="Comentó hace 5 minutos">
    <span class="mtx-list-item-icon"><span data-mtx="avatar" data-color="secondary" data-alt="">CR</span></span>
    Carlos Ruiz
  </li>
  <li data-mtx="list-item" data-secondary="Comentó hace 1 hora">
    <span class="mtx-list-item-icon"><span data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=32" data-alt=""></span></span>
    Lucía Méndez
  </li>
</ul>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR o control fino, renderiza las clases directamente. El componente reutiliza la `<img>` existente y no duplica nodos.

```html
<div class="mtx-avatar mtx-avatar--primary mtx-avatar--large" data-mtx="avatar">RD</div>

<div class="mtx-avatar mtx-avatar--rounded" data-mtx="avatar">
  <img src="/usuarios/ana.jpg" alt="Ana García">
</div>

<div class="mtx-avatar-group" data-mtx="avatar-group" data-max="4" data-total="8"
     aria-label="Participantes">
  <div class="mtx-avatar" data-mtx="avatar">RD</div>
  <div class="mtx-avatar mtx-avatar--primary" data-mtx="avatar">JM</div>
  <div class="mtx-avatar mtx-avatar--secondary" data-mtx="avatar">LC</div>
</div>
```

## Uso programático

Los avatares declarativos se inicializan solos al cargar la página. Para contenido dinámico:

```javascript
// Inicializar un elemento creado dinámicamente
const avatar = Materix.init(document.getElementById('user-avatar'));

// Instanciación directa
const group = new Materix.AvatarGroup(document.getElementById('team'));

// Recuperar una instancia existente
const sameGroup = Materix.getInstance(document.getElementById('team'));

// Inicializar todo lo que haya dentro de un contenedor
Materix.initAll(document.getElementById('user-list'));
```

Con ES modules:

```javascript
import { Avatar, AvatarGroup, getInstance } from 'materix-ui';

const group = getInstance(document.getElementById('team'));
group.max = 3;     // muestra 2 avatares + "+N"
group.total = 12;  // total lógico, aunque solo haya 4 montados
group.refresh();   // recalcula tras añadir o quitar hijos
```

{{< mtx-demo title="AvatarGroup controlado por API" >}}
<div id="doc-avatar-group" data-mtx="avatar-group" data-max="5" data-label="Equipo">
  <div class="mtx-avatar" data-mtx="avatar" data-color="primary">A</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="secondary">B</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="success">C</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="info">D</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="warning">E</div>
  <div class="mtx-avatar" data-mtx="avatar" data-color="error">F</div>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-avatar-max="3">max = 3</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-avatar-max="5">max = 5</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-doc-avatar-max]').forEach((btn) => {
    btn.addEventListener('click', () => {
      Materix.getInstance(document.getElementById('doc-avatar-group')).max = Number(btn.dataset.docAvatarMax);
    });
  });
});
</script>

## Referencia de API

### Atributos data-*

**Avatar** (`data-mtx="avatar"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-src` | URL | — | Genera una `<img>` interna si el elemento no contiene una. |
| `data-srcset` | Lista `srcset` | — | `srcset` de la imagen generada desde `data-src`. |
| `data-sizes` | Lista `sizes` | — | `sizes` de la imagen generada desde `data-src`. |
| `data-alt` | Texto | `""` | Texto alternativo de la imagen (también se copia a una `<img>` hija sin `alt`). |
| `data-icon` | Nombre de Material Icons | — | Inserta un icono decorativo (`aria-hidden`). Se ignora si hay imagen. |
| `data-variant` | `circular`, `rounded`, `square` | `circular` | Forma del avatar. |
| `data-color` | `primary`, `secondary`, `error`, `warning`, `info`, `success` | gris neutro | Color de fondo con texto de contraste. |
| `data-size` | `small`, `medium`, `large` o número (px) | `medium` | 24px, 40px, 56px o un tamaño libre en píxeles. |

**AvatarGroup** (`data-mtx="avatar-group"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-max` | Entero ≥ 2 | `5` | Elementos visibles, incluido el indicador `+N`. |
| `data-total` | Entero ≥ 0 | nº de hijos | Total lógico de usuarios; el excedente se calcula sobre él. |
| `data-spacing` | `medium`, `small` o número (px) | `medium` | Solapamiento: 8px, 16px o el valor indicado. |
| `data-label` | Texto | — | Se copia a `aria-label` si el grupo no tiene uno. |
| `data-surplus-label` | Plantilla con `{count}` | i18n `avatarGroup.surplus` (`{count} more` / `{count} más`) | Etiqueta accesible del indicador `+N`. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-avatar` | Bloque base (40×40px, circular, gris neutro). |
| `mtx-avatar--rounded` | Esquinas con el radio de forma (`4px`). |
| `mtx-avatar--square` | Sin radio. |
| `mtx-avatar--small` / `--medium` / `--large` | 24px / 40px / 56px. |
| `mtx-avatar--primary` … `--success` | Color de la paleta (`primary`, `secondary`, `error`, `warning`, `info`, `success`). |
| `mtx-avatar--fallback` | Se añade cuando el avatar no tiene imagen (iniciales o texto). |
| `mtx-avatar-group` | Contenedor que superpone avatares. |
| `mtx-avatar--surplus` | Indicador `+N` generado por el grupo. |

### Métodos

**Avatar**

| Método | Retorna | Descripción |
|---|---|---|
| `destroy()` | `void` | Retira el listener de error de la imagen y desvincula la instancia del registro. |

**AvatarGroup**

| Método / propiedad | Retorna | Descripción |
|---|---|---|
| `max` (get/set) | `number` | Máximo visible (mínimo 2). Al asignarlo actualiza `data-max` y recalcula. |
| `total` (get/set) | `number` | Total lógico. Asignar `null` vuelve a contar los hijos. |
| `refresh()` | `void` | Recalcula qué avatares se ocultan y el indicador `+N`. |
| `destroy()` | `void` | Elimina el indicador y vuelve a mostrar todos los avatares. |

### Eventos

Avatar y AvatarGroup no emiten eventos.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-avatar-group-overlap` | Solapamiento entre avatares del grupo (la fija `data-spacing`). |
| `--mtx-avatar-default-bg` / `--mtx-avatar-default-color` | Fondo y texto del avatar por defecto (grey 600 + blanco en ambos temas). |
| `--mtx-color-grey-300` / `--mtx-color-grey-800` | Fondo del indicador `+N` en tema claro / oscuro. |
| `--mtx-color-background-paper` | Borde de separación dentro del grupo. |
| `--mtx-shape-full`, `--mtx-shape-radius` | Radio circular y redondeado. |
| `--mtx-color-{palette}`, `--mtx-color-{palette}-contrast` | Fondo y texto de cada color. |

## Accesibilidad

- Las imágenes conservan su `alt`: usa `data-alt` con el nombre de la persona. Si el nombre ya aparece junto al avatar, puedes dejar `data-alt=""` para que sea decorativo.
- Los iconos generados con `data-icon` llevan `aria-hidden="true"`. Si el avatar de icono transmite información, añade `role="img"` y `aria-label` al contenedor.
- Las iniciales se leen letra a letra; cuando no son decorativas, añade `role="img"` y `aria-label="Nombre completo"`.
- AvatarGroup copia `data-label` a `aria-label` y da al indicador `+N` una etiqueta del diccionario i18n como «3 más» (personalizable con `data-surplus-label`, p. ej. «{count} miembros más»). Los avatares excedentes se ocultan con `hidden`, por lo que tampoco se anuncian.
- El componente no es interactivo; si un avatar abre un perfil, envuélvelo en un `<a>` o `<button>` con nombre accesible.
