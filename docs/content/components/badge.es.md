---
title: "Badge"
description: "Muestra un número o un punto de estado en la esquina de un icono, avatar o botón para señalar novedades o pendientes."
group: "data-display"
icon: "notifications"
weight: 20
example: "badge"
mui: "https://mui.com/material-ui/react-badge/"
---

`Badge` envuelve un elemento (icono, avatar, botón) y coloca en su esquina un contador o un punto. Úsalo para señalar mensajes sin leer, notificaciones pendientes o un estado en línea. No lo uses para etiquetas de texto independientes (usa [Chip](../chip/)) ni para mensajes de estado de página (usa [Alert](../alert/)).

## Uso básico

Envuelve el contenido con `data-mtx="badge"` e indica el valor en `data-content`. El componente crea el nodo de la insignia y lo posiciona.

{{< mtx-demo title="Contador sobre icono" >}}
<div data-mtx="badge" data-content="4" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="12" data-color="error">
  <span class="material-icons" aria-hidden="true">notifications</span>
</div>
{{< /mtx-demo >}}

## Variantes

`standard` (predeterminada) muestra el contenido; `dot` muestra un punto de 8px sin texto, útil para indicar «hay novedades» sin dar una cifra.

{{< mtx-demo title="Standard y dot" >}}
<div data-mtx="badge" data-content="4" data-color="secondary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-variant="dot" data-color="secondary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="Nuevo" data-color="success">
  <span class="material-icons" aria-hidden="true">inventory_2</span>
</div>
{{< /mtx-demo >}}

## Colores

Sin `data-color` (o con `default`) la insignia es gris neutro opaco que se adapta al tema claro y oscuro (clase `mtx-badge--default`). El resto de la paleta aplica su color de contraste al texto.

{{< mtx-demo title="Paleta" >}}
<div data-mtx="badge" data-content="4">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="secondary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="error">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="warning">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="info">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="4" data-color="success">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
{{< /mtx-demo >}}

## Valor máximo

Si el contenido es un entero mayor que `data-max` (99 por defecto), se muestra `{max}+`.

{{< mtx-demo title="data-max" >}}
<div data-mtx="badge" data-content="99" data-max="9" data-color="error">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="150" data-color="error">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="1000" data-max="999" data-color="error">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
{{< /mtx-demo >}}

## Visibilidad

Como en MUI, la insignia se oculta cuando el valor es `0` o no hay contenido. `data-show-zero` muestra el cero y `data-invisible` la oculta siempre (también en la variante `dot`). Al ocultarse se encoge con una transición, sin mover el contenido.

{{< mtx-demo title="Cero, show-zero e invisible" >}}
<div data-mtx="badge" data-content="0" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="0" data-show-zero data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="5" data-invisible data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
{{< /mtx-demo >}}

## En línea (standalone)

`data-standalone` coloca la insignia en el flujo del texto, sin elemento anclado: contadores de navegación, listas o pestañas. Con contenido 0 desaparece del todo (salvo `data-show-zero`). En línea el número sí se lee; con `data-label` (`{0}` = contenido mostrado) se añade además un texto solo para lectores de pantalla.

{{< mtx-demo title="Contadores en línea" layout="column" >}}
<div>
  <span data-mtx="badge" data-standalone data-content="4" data-color="primary"></span>
  <span data-mtx="badge" data-standalone data-content="120" data-color="error"></span>
  <span data-mtx="badge" data-standalone data-content="Nuevo"></span>
</div>
<ul data-mtx="list" aria-label="Carpetas">
  <li><a data-mtx="list-item-button" data-icon="inbox" href="#">Recibidos <span data-mtx="badge" data-standalone data-content="4" data-color="primary" data-label="{0} sin leer" class="mtx-ms-auto"></span></a></li>
</ul>
{{< /mtx-demo >}}

## Posición

`data-anchor` coloca la insignia en `top-right` (predeterminado), `top-left`, `bottom-right` o `bottom-left`.

{{< mtx-demo title="Anclajes" >}}
<div data-mtx="badge" data-content="3" data-anchor="top-left" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="3" data-anchor="top-right" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="3" data-anchor="bottom-left" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
<div data-mtx="badge" data-content="3" data-anchor="bottom-right" data-color="primary">
  <span class="material-icons" aria-hidden="true">mail</span>
</div>
{{< /mtx-demo >}}

## Superposición

`data-overlap="rectangular"` (predeterminado) ancla la insignia a las esquinas de una caja. Sobre formas circulares, como un avatar, usa `data-overlap="circular"` para acercarla al borde del círculo.

{{< mtx-demo title="Rectangular y circular" >}}
<div data-mtx="badge" data-variant="dot" data-color="error">
  <div data-mtx="avatar" data-variant="square" data-color="primary">R</div>
</div>
<div data-mtx="badge" data-variant="dot" data-color="error" data-overlap="circular">
  <div data-mtx="avatar" data-color="primary">C</div>
</div>
<div data-mtx="badge" data-content="6" data-color="error" data-overlap="circular">
  <div data-mtx="avatar" data-color="secondary">R</div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Una barra de acciones con contadores sobre botones de icono y un avatar con estado en línea. El número se anuncia mediante el `aria-label` de cada botón.

{{< callout type="tip" title="Badge con IconButton" >}}
Puedes poner el badge dentro del `IconButton` envolviendo el icono (patrón de MUI) o envolver el botón con el badge y `data-overlap="circular"` para que la insignia quede en el borde del botón redondo. En ambos casos el número se anuncia en el `aria-label` del botón.
{{< /callout >}}

{{< mtx-demo title="Barra de acciones" >}}
<button data-mtx="icon-button" aria-label="Correo, 4 mensajes sin leer">
  <span data-mtx="badge" data-content="4" data-color="primary"><span class="material-icons" aria-hidden="true">mail</span></span>
</button>
<div data-mtx="badge" data-content="17" data-color="error" data-overlap="circular">
  <button data-mtx="icon-button" data-icon="notifications" aria-label="Notificaciones, 17 nuevas"></button>
</div>
<div data-mtx="badge" data-variant="dot" data-color="secondary" data-overlap="circular">
  <button data-mtx="icon-button" data-icon="shopping_cart" aria-label="Carrito, artículos pendientes"></button>
</div>
<div data-mtx="badge" data-variant="dot" data-color="success" data-overlap="circular" data-anchor="bottom-right">
  <div data-mtx="avatar" data-src="https://i.pravatar.cc/120?img=47" data-alt="Ana García, en línea"></div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Si la insignia ya viene renderizada (`.mtx-badge__badge`), el componente la reutiliza y solo calcula visibilidad y valor máximo a partir de `data-content`.

```html
<span class="mtx-badge mtx-badge--error mtx-badge--overlap-circular" data-mtx="badge" data-content="6">
  <span class="mtx-avatar mtx-avatar--secondary">R</span>
  <span class="mtx-badge__badge" aria-hidden="true">6</span>
</span>
```

## Uso programático

```javascript
// Inicializar un badge creado dinámicamente
const badge = Materix.init(document.getElementById('inbox-badge'));

// Instanciación directa o recuperación de la instancia
const same = Materix.getInstance(document.getElementById('inbox-badge'));

// Cambiar contenido y visibilidad
badge.content = 5;        // aplica data-max y la regla del cero
badge.content = null;     // sin contenido: se oculta
badge.invisible = true;   // oculta aunque tenga valor
```

Con ES modules:

```javascript
import { Badge } from '@rubenchodev/materix-ui';

const badge = new Badge(document.querySelector('#inbox-badge'));
badge.content = 120; // muestra "99+"
```

{{< mtx-demo title="Contador controlado por API" >}}
<div id="doc-badge" data-mtx="badge" data-content="1" data-color="primary">
  <span class="material-icons" aria-hidden="true">notifications</span>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-badge="inc">Incrementar</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-badge="reset">Poner a 0</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-badge="toggle">Alternar invisible</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const badge = () => Materix.getInstance(document.getElementById('doc-badge'));
  document.querySelectorAll('[data-doc-badge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.docBadge;
      if (action === 'inc') badge().content = Number(badge().content || 0) + 1;
      if (action === 'reset') badge().content = 0;
      if (action === 'toggle') badge().invisible = !badge().invisible;
    });
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-content` | Texto o número | — | Contenido de la insignia. Sin contenido (variante `standard`) la insignia se oculta. |
| `data-variant` | `standard`, `dot` | `standard` | `dot` muestra un punto de 8px e ignora el contenido. |
| `data-color` | `default`, `primary`, `secondary`, `error`, `warning`, `info`, `success` | `default` | Color de fondo con texto de contraste. |
| `data-max` | Número | `99` | Si el contenido es un entero mayor, se muestra `{max}+`. |
| `data-standalone` | Booleano (presencia) | ausente | Insignia en línea, sin hijo anclado (`mtx-badge--standalone`). Sin contenido visible desaparece. |
| `data-label` | Texto con `{0}` | — | Texto accesible oculto (`mtx-badge__label`); `{0}` se sustituye por el contenido mostrado. |
| `data-show-zero` | Booleano (presencia; `"false"` lo desactiva) | ausente | Muestra la insignia cuando el valor es `0`. |
| `data-invisible` | Booleano (presencia; `"false"` lo desactiva) | ausente | Oculta la insignia aunque tenga contenido. |
| `data-anchor` | `top-right`, `top-left`, `bottom-right`, `bottom-left` | `top-right` | Esquina de anclaje. |
| `data-overlap` | `rectangular`, `circular` | `rectangular` | Ajusta la posición para formas circulares. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-badge` | Contenedor relativo que envuelve al hijo. |
| `mtx-badge__badge` | La insignia (creada automáticamente si no existe). |
| `mtx-badge--dot` | Variante punto (8×8px). |
| `mtx-badge--primary` … `--success` | Color de la paleta (`primary`, `secondary`, `error`, `warning`, `info`, `success`). |
| `mtx-badge--top-left` / `--bottom-right` / `--bottom-left` | Anclaje distinto del predeterminado. |
| `mtx-badge--overlap-circular` | Posición ajustada a formas circulares. |
| `mtx-badge--invisible` | Insignia oculta (escala 0 con transición). |
| `mtx-badge--default` | Color neutro (también sin `data-color`). |
| `mtx-badge--standalone` | Insignia en línea, sin anclaje ni transformación. |
| `mtx-badge__label` | Texto solo para lectores de pantalla (de `data-label`). |

### Métodos

| Propiedad | Retorna | Descripción |
|---|---|---|
| `content` (get/set) | `string \| null` | Contenido actual. Al asignarlo se vuelve a aplicar `data-max`, la regla del cero y la visibilidad. |
| `invisible` (get/set) | `boolean` | Lee si está oculta; al asignar fuerza u anula la ocultación explícita. |

### Eventos

Badge no emite eventos.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-text-primary`, `--mtx-color-background-paper` | Fondo (mezcla al 60%) y texto del color `default`. |
| `--mtx-color-{palette}`, `--mtx-color-{palette}-contrast` | Fondo y texto de cada color. |
| `--mtx-font-family` | Tipografía de la insignia (12px, peso 500). |
| `--mtx-duration-short`, `--mtx-easing-standard` | Transición de aparición y ocultación. |

## Accesibilidad

- Anclada a un hijo, la insignia lleva `aria-hidden="true"`: incluye la información en el nombre accesible del control, por ejemplo `aria-label="Notificaciones, 17 nuevas"` en el botón. En modo `data-standalone` el número se lee como texto; usa `data-label` para darle contexto ("4 sin leer").
- Marca los iconos decorativos con `aria-hidden="true"`.
- No transmitas información solo con el color de la insignia: el texto del `aria-label` o el contexto deben indicar su significado.
- Badge no es interactivo ni recibe foco; si el elemento envuelto es un botón, el foco y el teclado los gestiona ese botón.
