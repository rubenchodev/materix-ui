---
title: "Chip"
description: "Elemento compacto que representa una etiqueta, un filtro, una entrada o una acción; puede llevar icono, avatar y botón de eliminar."
group: "data-display"
icon: "label"
weight: 30
example: "chip"
mui: "https://mui.com/material-ui/react-chip/"
---

`Chip` representa una pieza de información compacta: una etiqueta, un filtro activo, un destinatario o una acción breve. Úsalo para listas de etiquetas, filtros seleccionables o entradas que el usuario puede quitar. Para una acción principal usa [Button](../button/); para un contador sobre un icono usa [Badge](../badge/).

## Uso básico

Un elemento vacío con `data-mtx="chip"` y `data-label`. El componente genera la etiqueta, el icono y el botón de eliminar según los atributos.

{{< mtx-demo title="Chips básicos" >}}
<div data-mtx="chip" data-label="Etiqueta"></div>
<div data-mtx="chip" data-label="Outlined" data-variant="outlined"></div>
<div data-mtx="chip" data-label="JavaScript" data-icon="code" data-color="primary"></div>
{{< /mtx-demo >}}

## Variantes

`filled` (predeterminada) usa un fondo sólido; `outlined` usa borde y fondo transparente.

{{< mtx-demo title="Filled y outlined" >}}
<div data-mtx="chip" data-label="Filled"></div>
<div data-mtx="chip" data-label="Outlined" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Filled primary" data-color="primary"></div>
<div data-mtx="chip" data-label="Outlined primary" data-variant="outlined" data-color="primary"></div>
{{< /mtx-demo >}}

## Tamaños

`medium` (32px, predeterminado) y `small` (24px).

{{< mtx-demo title="Medium y small" >}}
<div data-mtx="chip" data-label="Medium · 32px" data-icon="star"></div>
<div data-mtx="chip" data-label="Small · 24px" data-size="small" data-icon="star"></div>
<div data-mtx="chip" data-label="Medium" data-deletable data-color="primary"></div>
<div data-mtx="chip" data-label="Small" data-size="small" data-deletable data-color="primary"></div>
{{< /mtx-demo >}}

## Con iconos y avatar

`data-icon` añade un icono inicial de Material Icons. Para un avatar, coloca un hijo con la clase `mtx-chip__avatar` (puede ser un [Avatar](../avatar/) de 24px).

{{< mtx-demo title="Icono y avatar" >}}
<div data-mtx="chip" data-label="Sin icono"></div>
<div data-mtx="chip" data-label="Con icono" data-icon="face"></div>
<div data-mtx="chip" data-label="Ana García">
  <span class="mtx-chip__avatar" data-mtx="avatar" data-size="small" data-color="primary">A</span>
</div>
<div data-mtx="chip" data-label="Carlos Ruiz" data-variant="outlined">
  <span class="mtx-chip__avatar" data-mtx="avatar" data-size="small" data-src="https://i.pravatar.cc/80?img=12" data-alt=""></span>
</div>
{{< /mtx-demo >}}

## Colores

`data-color` acepta toda la paleta. En `outlined`, el color se aplica al texto y al borde.

{{< mtx-demo title="Filled" >}}
<div data-mtx="chip" data-label="Default"></div>
<div data-mtx="chip" data-label="Primary" data-color="primary"></div>
<div data-mtx="chip" data-label="Secondary" data-color="secondary"></div>
<div data-mtx="chip" data-label="Error" data-color="error"></div>
<div data-mtx="chip" data-label="Warning" data-color="warning"></div>
<div data-mtx="chip" data-label="Info" data-color="info"></div>
<div data-mtx="chip" data-label="Success" data-color="success"></div>
{{< /mtx-demo >}}

{{< mtx-demo title="Outlined" >}}
<div data-mtx="chip" data-label="Default" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Primary" data-color="primary" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Secondary" data-color="secondary" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Error" data-color="error" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Warning" data-color="warning" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Info" data-color="info" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Success" data-color="success" data-variant="outlined"></div>
{{< /mtx-demo >}}

## Clicable

`data-clickable` hace el chip interactivo: cursor de mano, estado hover, anillo de foco, `role="button"` y activación con Enter o Espacio. Emite `mtx:chip:click`.

{{< mtx-demo title="Chips clicables" >}}
<div data-mtx="chip" data-label="Clicable" data-clickable></div>
<div data-mtx="chip" data-label="Clicable outlined" data-variant="outlined" data-clickable></div>
<div data-mtx="chip" data-label="Con icono" data-icon="bolt" data-color="primary" data-clickable></div>
<button type="button" data-mtx="chip" data-label="Sobre un button nativo" data-clickable></button>
{{< /mtx-demo >}}

## Eliminable

`data-deletable` añade el botón de eliminar y emite `mtx:chip:delete` al pulsarlo o al presionar Supr/Retroceso con el chip enfocado. El chip **no se elimina solo**: decide tú qué hacer al recibir el evento.

{{< mtx-demo title="Etiquetas eliminables" >}}
<div data-mtx="chip" data-label="React" data-deletable></div>
<div data-mtx="chip" data-label="Vue" data-deletable></div>
<div data-mtx="chip" data-label="Svelte" data-deletable data-variant="outlined"></div>
<div data-mtx="chip" data-label="Angular" data-deletable data-color="primary" data-delete-label="Quitar Angular"></div>
{{< /mtx-demo >}}

```javascript
document.addEventListener('mtx:chip:delete', (event) => {
  event.target.remove();
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('mtx:chip:delete', (event) => {
    event.target.remove();
  });
});
</script>

## Estados

`data-disabled` desactiva el chip: baja la opacidad, retira el foco y bloquea los eventos.

{{< mtx-demo title="Deshabilitado" >}}
<div data-mtx="chip" data-label="Deshabilitado" data-disabled></div>
<div data-mtx="chip" data-label="Deshabilitado" data-variant="outlined" data-disabled></div>
<div data-mtx="chip" data-label="Clicable deshabilitado" data-clickable data-disabled data-color="primary"></div>
<div data-mtx="chip" data-label="Eliminable deshabilitado" data-deletable data-disabled></div>
{{< /mtx-demo >}}

## Casos de uso reales

Filtros de búsqueda: chips clicables que alternan entre `outlined` (inactivo) y `filled primary` (activo), con `aria-pressed` para indicar su estado.

{{< mtx-demo title="Filtros" >}}
<div data-mtx="chip" data-label="Abiertos" data-filter data-clickable data-color="primary" aria-pressed="true"></div>
<div data-mtx="chip" data-label="En revisión" data-filter data-clickable data-variant="outlined" aria-pressed="false"></div>
<div data-mtx="chip" data-label="Cerrados" data-filter data-clickable data-variant="outlined" aria-pressed="false"></div>
{{< /mtx-demo >}}

```javascript
document.addEventListener('mtx:chip:click', (event) => {
  const chip = event.target;
  if (!chip.hasAttribute('data-filter')) return;
  const active = chip.getAttribute('aria-pressed') !== 'true';
  chip.setAttribute('aria-pressed', String(active));
  chip.classList.toggle('mtx-chip--primary', active);
  chip.classList.toggle('mtx-chip--outlined', !active);
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('mtx:chip:click', (event) => {
    const chip = event.target;
    if (!chip.hasAttribute('data-filter')) return;
    const active = chip.getAttribute('aria-pressed') !== 'true';
    chip.setAttribute('aria-pressed', String(active));
    chip.classList.toggle('mtx-chip--primary', active);
    chip.classList.toggle('mtx-chip--outlined', !active);
  });
});
</script>

## Sintaxis BEM completa

Si la estructura ya existe, el componente reutiliza `.mtx-chip__label`, `.mtx-chip__icon` y `.mtx-chip__delete`.

```html
<div class="mtx-chip mtx-chip--primary mtx-chip--outlined" data-mtx="chip" data-deletable>
  <span class="mtx-chip__icon material-icons" aria-hidden="true">star</span>
  <span class="mtx-chip__label">Favorito</span>
  <span class="mtx-chip__delete" aria-hidden="true" title="Eliminar Favorito">
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">…</svg>
  </span>
</div>
```

## Uso programático

```javascript
// Inicializar un chip creado dinámicamente
const chip = Materix.init(document.getElementById('tag-js'));

// Instanciación directa o recuperación de la instancia
const same = Materix.getInstance(document.getElementById('tag-js'));

chip.label = 'TypeScript'; // cambia el texto
chip.disable();            // deshabilita (aria-disabled, sin foco)
chip.enable();

document.getElementById('tag-js').addEventListener('mtx:chip:delete', (e) => e.target.remove());
```

Con ES modules:

```javascript
import { Chip } from 'materix-ui';

const el = document.createElement('div');
el.setAttribute('data-label', 'Nuevo');
el.setAttribute('data-deletable', '');
document.querySelector('#tags').append(el);
new Chip(el);
```

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-label` | Texto | texto del elemento | Texto del chip. Si falta, se usa el texto directo del elemento. |
| `data-variant` | `filled`, `outlined` | `filled` | Estilo de fondo o borde. |
| `data-size` | `medium`, `small` | `medium` | Altura de 32px o 24px. |
| `data-color` | `default`, `primary`, `secondary`, `error`, `warning`, `info`, `success` | `default` | Color de la paleta. |
| `data-icon` | Nombre de Material Icons | — | Icono inicial decorativo. |
| `data-clickable` | Booleano (presencia) | ausente | Chip interactivo: hover, foco, `role="button"`, Enter/Espacio y evento `mtx:chip:click`. |
| `data-deletable` | Booleano (presencia) | ausente | Añade el icono de eliminar (clic, o Supr/Retroceso con el chip enfocado) y el evento `mtx:chip:delete`. |
| `data-delete-label` | Texto | i18n `chip.delete` (`Delete` / `Eliminar`) | Texto emergente (`title`) del icono de eliminar. |
| `data-delete-icon` | HTML | X circular SVG | Contenido del icono de eliminar. |
| `data-disabled` | Booleano (presencia) | ausente | Inicia el chip deshabilitado. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-chip` | Bloque base (32px, radio 16px). |
| `mtx-chip__label` | Texto, con elipsis si no cabe. |
| `mtx-chip__icon` | Icono inicial. |
| `mtx-chip__avatar` | Contenedor de avatar inicial. |
| `mtx-chip__delete` | Icono de eliminar (no enfocable, `aria-hidden`). |
| `mtx-chip--outlined` | Variante con borde. |
| `mtx-chip--small` | Tamaño de 24px. |
| `mtx-chip--primary` … `--success` | Color de la paleta. |
| `mtx-chip--clickable` | Estados de interacción (cursor, hover, foco, pulsado). |
| `mtx-chip--disabled` | Estado deshabilitado. |

### Métodos

| Método / propiedad | Retorna | Descripción |
|---|---|---|
| `label` (get/set) | `string` | Texto del chip. |
| `disabled` (get) | `boolean` | `true` si `aria-disabled="true"`. |
| `disable()` | `void` | Deshabilita, retira del orden de tabulación y desactiva el botón de eliminar. |
| `enable()` | `void` | Vuelve a habilitar el chip. |
| `emit(name, detail)` | `void` | Despacha `mtx:chip:{name}` con burbujeo. |
| `destroy()` | `void` | Retira los listeners de clic, teclado y eliminar. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:chip:click` | `{}` | Se pulsa (o se activa con Enter/Espacio) un chip con `data-clickable`. |
| `mtx:chip:delete` | `{}` | Se pulsa el botón de eliminar o se presiona Supr/Retroceso con el chip enfocado. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-chip-height`, `--mtx-chip-height-small` | Alturas (32px / 24px). |
| `--mtx-chip-radius`, `--mtx-chip-radius-small` | Radios (16px / 12px). |
| `--mtx-chip-font-size`, `--mtx-chip-font-size-small` | Tamaño de texto. |
| `--mtx-chip-label-padding`, `--mtx-chip-label-padding-small` | Relleno de la etiqueta. |
| `--mtx-chip-bg`, `--mtx-chip-text` | Fondo y texto del color `default`. |
| `--mtx-chip-delete-color`, `--mtx-chip-delete-color-hover` | Color del icono de eliminar. |
| `--mtx-chip-delete-size`, `--mtx-chip-delete-size-small` | Tamaño del icono de eliminar. |

## Accesibilidad

- Los chips estáticos son texto sin rol. Los chips con `data-clickable` o `data-deletable` reciben `role="button"` y `tabindex="0"` (salvo que el elemento ya sea `<button>` o `<a>`).
- Como en MUI, el icono de eliminar **no** es un control anidado: es un `<span aria-hidden="true">` que nunca recibe foco, así el chip con `role="button"` no contiene descendientes interactivos (regla axe `nested-interactive`). El chip se borra con el ratón sobre el icono o con Supr/Retroceso cuando el chip tiene el foco; el chip anuncia esas teclas con `aria-keyshortcuts="Delete Backspace"`. Un `<button class="mtx-chip__delete">` prerrenderizado se convierte en ese `<span>`.
- El `title` del icono sale del diccionario i18n (`Delete` en inglés, `Eliminar` en español, según el `lang` del elemento); personalízalo con `data-delete-label` (por ejemplo, «Quitar React»).
- En filtros, indica el estado activo con `aria-pressed`.
- Los iconos generados con `data-icon` llevan `aria-hidden="true"`.

| Tecla | Acción |
|---|---|
| Tab / Mayús+Tab | Mueve el foco entre chips interactivos. |
| Enter / Espacio | Activa un chip clicable (emite `mtx:chip:click`). |
| Supr / Retroceso | En un chip eliminable, emite `mtx:chip:delete`. |
| Escape | Quita el foco del chip. |
