---
title: "Select"
description: "Selector con menú propio estilo MUI: búsqueda, multiselección, acciones en lote, grupos, límites e iconos o imágenes en las opciones."
group: "inputs"
icon: "list"
weight: 80
example: "select"
mui: "https://mui.com/material-ui/react-select/"
---

`Select` permite elegir uno o varios valores de una lista mostrando un menú propio con estética MUI, búsqueda, selección múltiple y opciones con icono o imagen. El `<select>` nativo sigue siendo la fuente de verdad (se envía con el formulario y emite `change`), pero queda oculto. Si solo necesitas el desplegable del sistema operativo, más ligero y óptimo en móviles, usa [NativeSelect](../native-select/); para escribir texto libre, [TextField](../text-field/).

{{< callout type="info" title="¿Select o NativeSelect?" >}}
| Necesidad | Select | NativeSelect |
| :--- | :--- | :--- |
| Menú con estética MUI (Paper, marca de verificación) | Sí | No, usa el del sistema |
| Búsqueda dentro del menú | Sí (`data-search`) | No |
| Selección múltiple cómoda | Sí, con casillas y "Seleccionar todo" | Lista nativa (`multiple`, Ctrl/Cmd + clic) |
| Iconos o imágenes en las opciones | Sí (`data-icon`, `data-image`) | No |
| Texto de ayuda, icono inicial, read-only | Sí | No |
| Peso y rendimiento con miles de opciones | Medio | Mínimo |
| Experiencia táctil nativa en móviles | Menú propio | Selector del sistema |

Regla práctica: **NativeSelect** para formularios simples y listas largas en móvil; **Select** cuando necesitas búsqueda, multiselección, iconos o coherencia visual completa.
{{< /callout >}}

## Uso básico

Escribe solo el `<select>` con `data-mtx="select"` y `data-label`. El JavaScript crea el control visible, el label, la muesca del borde y el menú.

{{< mtx-demo title="Sintaxis simplificada" layout="block" >}}
<select data-mtx="select" data-label="Ciudad" name="city">
  <option value="mdx">Ciudad de México</option>
  <option value="gdl">Guadalajara</option>
  <option value="mty">Monterrey</option>
</select>
{{< /mtx-demo >}}

## Variantes

`data-variant`: `outlined` (predeterminada, con muesca), `filled` y `standard`.

{{< mtx-demo title="Variantes" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="select" data-label="Outlined" data-variant="outlined">
      <option value="es">Español</option>
      <option value="en">Inglés</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="select" data-label="Filled" data-variant="filled">
      <option value="es">Español</option>
      <option value="en">Inglés</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="select" data-label="Standard" data-variant="standard">
      <option value="es">Español</option>
      <option value="en">Inglés</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Tamaños

Medium 56px (predeterminado) y small 40px con `data-size="small"` o `data-small`: las mismas alturas que TextField, para alinear campos en una fila.

{{< mtx-demo title="Medium 56px y small 40px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Medium · 56px">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Small · 40px" data-size="small">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Con iconos

`data-start-icon` añade un icono (Material Icons) o una imagen (URL) al inicio del control. En cada `<option>`, `data-icon` o `data-image` muestra un icono o una imagen junto al texto, tanto en el menú como en el control al seleccionarla.

{{< mtx-demo title="Icono inicial e iconos o imágenes por opción" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="4">
    <select data-mtx="select" data-label="Destino" data-start-icon="place">
      <option value="bog">Bogotá</option>
      <option value="med">Medellín</option>
      <option value="cal">Cali</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <select data-mtx="select" data-label="Método de pago">
      <option value="card" data-icon="credit_card">Tarjeta</option>
      <option value="cash" data-icon="payments">Efectivo</option>
      <option value="bank" data-icon="account_balance">Transferencia</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <select data-mtx="select" data-label="País">
      <option value="co" data-image="https://flagcdn.com/w40/co.png">Colombia</option>
      <option value="mx" data-image="https://flagcdn.com/w40/mx.png">México</option>
      <option value="es" data-image="https://flagcdn.com/w40/es.png">España</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Colores

`data-color` acepta toda la paleta MUI: `primary` (predeterminado), `secondary`, `error`, `warning`, `info` y `success`. Cambia el label, el borde (outlined) o la línea inferior (filled y standard) con foco o menú abierto, y el color de la opción seleccionada en el menú. `data-color="error"` solo cambia el acento; el estado de error se activa con `data-error`.

{{< mtx-demo title="Paleta completa" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Primary">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Secondary" data-color="secondary">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Error" data-color="error">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Warning" data-color="warning" data-variant="filled">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Info" data-color="info" data-variant="filled">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <select data-mtx="select" data-label="Success" data-color="success" data-variant="standard">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Estados

`data-helper-text` añade un texto de ayuda enlazado con `aria-describedby`; `data-error` pinta el control en rojo (y marca `aria-invalid`); `disabled` (o `data-disabled`) lo deshabilita y `data-readonly` (o `readonly`) muestra el valor sin permitir abrir el menú. `required` en el `<select>` añade el asterisco al label (incluido en la muesca del borde outlined) y marca `aria-required`.

{{< mtx-demo title="Ayuda, error, deshabilitado y solo lectura" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="País de residencia" data-helper-text="Donde tributas actualmente">
      <option value="co">Colombia</option>
      <option value="mx">México</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Moneda" data-error data-helper-text="Selecciona una divisa válida" required>
      <option value="">Sin seleccionar</option>
      <option value="usd">USD</option>
      <option value="eur">EUR</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Plan" disabled>
      <option value="pro">Profesional</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Región" data-readonly>
      <option value="latam">Latinoamérica</option>
      <option value="eu">Europa</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Placeholder y textos largos

En selección única, `data-placeholder` (o `title` del `<select>`) se muestra mientras ninguna opción tenga el atributo `selected`: el componente deja el select sin valor (`selectedIndex = -1`), así que `required` lo valida. Una opción con `value=""` también cuenta como sin selección cuando hay placeholder. Los textos largos se recortan con puntos suspensivos sin ensanchar el campo.

{{< mtx-demo title="Placeholder y ellipsis" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Rol" data-placeholder="Elige un rol" required>
      <option value="admin">Administrador</option>
      <option value="editor">Editor</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="select" data-label="Dirección de envío" data-start-icon="local_shipping">
      <option value="1">Calle de Alcalá 123, 4.º izquierda, 28009 Madrid, España</option>
      <option value="2">Avenida Insurgentes Sur 1602, 03940 Ciudad de México</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Búsqueda

`data-search` añade una caja que filtra las opciones por texto y por valor mientras escribes. `data-header` muestra un encabezado en el menú y `data-none-results-text` personaliza el mensaje sin coincidencias (`{0}` se sustituye por el término buscado).

{{< mtx-demo title="Búsqueda con encabezado" layout="block" >}}
<select data-mtx="select" data-label="País" data-search data-header="Selecciona un país" data-none-results-text="Ningún país coincide con «{0}»">
  <option value="ar">Argentina</option>
  <option value="bo">Bolivia</option>
  <option value="cl">Chile</option>
  <option value="co">Colombia</option>
  <option value="ec">Ecuador</option>
  <option value="es">España</option>
  <option value="mx">México</option>
  <option value="pe">Perú</option>
  <option value="uy">Uruguay</option>
</select>
{{< /mtx-demo >}}

## Multiselección

Con `multiple` en el `<select>`, cada opción muestra una casilla y el menú queda abierto para marcar varias. `data-actions-box` añade "Seleccionar todo" y "Deseleccionar todo" (textos configurables con `data-select-all-text` y `data-deselect-all-text`). El texto del control se controla con `data-selected-text-format`:

- `values` (predeterminado): lista separada por comas.
- `count`: "N seleccionados".
- `count > N`: lista hasta N elementos y contador a partir de N + 1.
- `static`: muestra siempre el placeholder (`data-placeholder` o `title`).

{{< mtx-demo title="Múltiple con búsqueda, acciones y formatos" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <select data-mtx="select" data-label="Habilidades" data-search data-actions-box multiple>
      <option value="js" selected>JavaScript</option>
      <option value="ts" selected>TypeScript</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
      <option value="py">Python</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <select data-mtx="select" data-label="Lenguajes" data-selected-text-format="count > 2" data-placeholder="Elige lenguajes" multiple>
      <option value="js">JavaScript</option>
      <option value="ts">TypeScript</option>
      <option value="go">Go</option>
      <option value="rs">Rust</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

{{< callout type="tip" >}}
La multiselección de Materix sigue el patrón de casillas de MUI (`renderValue` con texto). No muestra chips dentro del control; si necesitas etiquetas visibles, pinta [Chips](../chip/) aparte a partir de `select.value`.
{{< /callout >}}

## Grupos y límite de selección

Los `<optgroup>` se muestran como subencabezados (al filtrar se ocultan los grupos vacíos). Las opciones y grupos `disabled` no se pueden elegir. `data-max-options` limita cuántas opciones se pueden marcar y deshabilita el resto al llegar al límite.

{{< mtx-demo title="Optgroups, opciones deshabilitadas y máximo 2" layout="block" >}}
<select data-mtx="select" data-label="Stack (máx. 2)" data-max-options="2" multiple>
  <optgroup label="Frontend">
    <option value="react">React</option>
    <option value="vue">Vue</option>
    <option value="angular" disabled>Angular (no disponible)</option>
  </optgroup>
  <optgroup label="Backend">
    <option value="node">Node.js</option>
    <option value="django">Django</option>
    <option value="laravel">Laravel</option>
  </optgroup>
</select>
{{< /mtx-demo >}}

## Casos de uso reales

Filtros de un listado: búsqueda de texto, categoría con iconos, etiquetas múltiples y orden, alineados en una fila small de 40px junto a un Button.

{{< mtx-demo title="Barra de filtros" layout="block" >}}
<div data-mtx="grid" data-spacing="2" data-align="center">
  <div data-mtx="grid" data-xs="12" data-md="3">
    <input data-mtx="text-field" data-label="Buscar" data-start-icon="search" data-size="small" type="search" />
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <select data-mtx="select" data-label="Categoría" data-size="small">
      <option value="all" data-icon="apps">Todas</option>
      <option value="laptops" data-icon="laptop">Portátiles</option>
      <option value="phones" data-icon="smartphone">Teléfonos</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">
    <select data-mtx="select" data-label="Etiquetas" data-size="small" data-selected-text-format="count" data-placeholder="Cualquiera" multiple>
      <option value="new">Novedad</option>
      <option value="sale">Oferta</option>
      <option value="eco">Sostenible</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="3">
    <button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button" type="button">Aplicar filtros</button>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR o control fino. El componente reutiliza el label, el control y el chevron si existen y genera el resto (display, muesca, menú).

```html
<div class="mtx-select mtx-select--outlined" data-mtx="select" data-search data-actions-box>
  <label class="mtx-select__label">Habilidades</label>
  <div class="mtx-select__control">
    <select class="mtx-select__native" multiple title="Elegir…">
      <option value="js" selected>JavaScript</option>
      <option value="ts">TypeScript</option>
    </select>
    <span class="mtx-select__chevron"></span>
  </div>
  <div class="mtx-select__helper-text" id="skills-help">Elige al menos una</div>
</div>
```

## Uso programático

```javascript
// Inicializar un <select> creado dinámicamente
const select = Materix.init(document.getElementById('ciudad'), 'select');

// Instancia directa o instancia existente (con el <select> o con el contenedor)
const other = new Materix.Select(document.querySelector('#pais'));
const same = Materix.getInstance(document.getElementById('ciudad'));

select.value = 'gdl';                 // selección única
const skills = Materix.getInstance(document.getElementById('habilidades'));
skills.value = ['js', 'ts'];           // selección múltiple (<select multiple>)
select.open();
select.close();
select.helperText = 'Actualizado';
select.select.addEventListener('change', () => console.log(select.value));
```

```javascript
import { Select, init, getInstance } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="API en vivo" >}}
<select id="doc-select-api" data-mtx="select" data-label="Entorno" data-helper-text="Usa los botones">
  <option value="dev">Desarrollo</option>
  <option value="staging">Pruebas</option>
  <option value="prod">Producción</option>
</select>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-select="value">value = 'prod'</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-select="open">open()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-select="toggle">disable() / enable()</button>
<output id="doc-select-out">value: dev</output>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-select-api');
  const out = document.getElementById('doc-select-out');
  if (!el || !window.Materix) return;
  const select = Materix.getInstance(el);
  if (!select) return;
  select.select.addEventListener('change', () => { out.textContent = 'change → value: ' + select.value; });
  document.querySelectorAll('[data-doc-select]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const action = btn.getAttribute('data-doc-select');
      if (action === 'value') { select.value = 'prod'; out.textContent = 'value: ' + select.value; }
      if (action === 'open') { event.stopPropagation(); select.open(); }
      if (action === 'toggle') { if (select.disabled) select.enable(); else select.disable(); out.textContent = 'disabled: ' + select.disabled; }
    });
  });
});
</script>

## Referencia de API

### Atributos data-*

Se leen del contenedor o del propio `<select>` (salvo `data-placeholder`, `data-disabled`, `data-readonly`, `data-hidden-label`, que solo se leen del contenedor y, en sintaxis simplificada, se copian a él automáticamente).

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `select` | — | Inicializa el componente. |
| `data-label` | texto | — | Label flotante (también atributo `label`). |
| `data-variant` | `outlined` \| `filled` \| `standard` | `outlined` | Variante visual. |
| `data-size` | `small` \| `medium` | `medium` (56px) | `small` = 40px. También `data-small`. |
| `data-color` | `primary` \| `secondary` \| `error` \| `warning` \| `info` \| `success` | `primary` | Color de foco, apertura y opción seleccionada. |
| `data-start-icon` | icono \| URL | — | Icono o imagen al inicio del control. |
| `data-helper-text` | texto | — | Texto de ayuda bajo el control. |
| `data-error` | booleano | — | Estado de error (borde, label y ayuda en rojo; `aria-invalid`). |
| `data-disabled` | booleano | — | Deshabilita el control (equivale a `disabled` en el `<select>`). |
| `data-readonly` | booleano | — | Solo lectura: no abre el menú. También `readonly` en el `<select>`. |
| `data-placeholder` | texto | `title` del `<select>` | Texto sin selección. En selección única, si ninguna opción tiene `selected`, el select queda vacío y se muestra este texto. |
| `data-search` | booleano | — | Caja de búsqueda en el menú. |
| `data-none-results-text` | texto con `{0}` | i18n | Mensaje sin coincidencias. Alias `data-no-results-text`. |
| `data-header` | texto | — | Encabezado dentro del menú. |
| `data-actions-box` | booleano | — | Botones "Seleccionar todo" / "Deseleccionar todo" (solo `multiple`). |
| `data-select-all-text` | texto | i18n | Texto del botón "Seleccionar todo". |
| `data-deselect-all-text` | texto | i18n | Texto del botón "Deseleccionar todo". Alias `data-clear-all-text`. |
| `data-max-options` | número | sin límite | Máximo de opciones marcables (solo `multiple`). |
| `data-selected-text-format` | `values` \| `count` \| `count > N` \| `static` | `values` | Texto del control en selección múltiple. |
| `data-hidden-label` | booleano | — | Dibuja el borde outlined sin muesca. |
| `data-icon` *(en `<option>`)* | icono | — | Icono de Material Icons junto a la opción. |
| `data-image` *(en `<option>`)* | URL | — | Imagen junto a la opción (banderas, logos, avatares). |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-select` | Contenedor raíz. |
| `mtx-select--outlined` / `--filled` / `--standard` | Variantes. |
| `mtx-select--small` | Altura 40px. |
| `mtx-select--color-{color}` | Color de acento (`primary`…`success`); el menú recibe `mtx-select__menu--color-{color}`. Se conserva el alias `mtx-select--secondary`. |
| `mtx-select--error` | Estado de error. |
| `mtx-select--open` | El menú está abierto (lo gestiona el JS). |
| `mtx-select--adorned-start` | Tiene icono inicial. |
| `mtx-select--hidden-label` / `--no-label` | Borde outlined sin muesca. |
| `mtx-select__label` | Label. |
| `mtx-select__control` | Control visible (`role="combobox"`). |
| `mtx-select__native` | `<select>` nativo oculto. |
| `mtx-select__display` / `--empty` | Valor mostrado (flex, con `__display-text` recortado con ellipsis); `--empty` cuando muestra el placeholder. |
| `mtx-select__display-icon` / `__display-image` / `__display-text` | Icono, imagen y texto de la opción elegida. |
| `mtx-select__adornment` / `--start` / `--image` | Icono o imagen inicial. |
| `mtx-select__chevron` | Flecha (gira al abrir). |
| `mtx-select__outline` / `__legend` | Borde con muesca (outlined). |
| `mtx-select__helper-text` | Texto de ayuda. |
| `mtx-select__menu` | Menú (`role="listbox"`). Se mueve a un portal al abrirse. |
| `mtx-select__header` | Encabezado del menú. |
| `mtx-select__search-wrap` / `__search` | Caja de búsqueda. |
| `mtx-select__actions` / `__action` / `--select-all` / `--deselect-all` | Botones de acción en lote. |
| `mtx-select__optgroup` / `--hidden` | Subencabezado de grupo. |
| `mtx-select__option` | Opción (`role="option"`). |
| `mtx-select__option--selected` / `--disabled` / `--hidden` | Estados de la opción. |
| `mtx-select__check` | Casilla de la opción (selección múltiple). |
| `mtx-select__option-icon` / `__option-image` / `__option-text` | Contenido de la opción. |
| `mtx-select__no-results` | Mensaje sin coincidencias. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `value` (get/set) | `string` \| `string[]` | Valor seleccionado (array en `multiple`). Asignarlo no emite `change`. |
| `multiple` (get) | `boolean` | Si el `<select>` es múltiple. |
| `disabled` (get) | `boolean` | Si está deshabilitado. |
| `helperText` (get/set) | `string` | Texto de ayuda (cadena vacía lo elimina). |
| `open()` | `void` | Abre el menú (no hace nada si está deshabilitado o en solo lectura). |
| `close()` | `void` | Cierra el menú. |
| `disable()` | `void` | Deshabilita y cierra el menú. |
| `enable()` | `void` | Habilita el control. |
| `focus()` | `void` | Enfoca el control visible. |
| `destroy()` | `void` | Elimina los listeners de la instancia. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

Propiedades útiles: `element` (contenedor), `select` (`<select>` nativo), `control`, `menu`.

### Eventos

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `change` (en el `<select>`, burbujea) | — (nativo) | El usuario elige o desmarca una opción, o usa "Seleccionar todo" / "Deseleccionar todo". |

Escucha `mtx:locale:change` del documento para traducir sus textos internos al cambiar el idioma con `Materix.setLocale()`.

### Variables CSS

`Select` no define variables propias; usa los tokens globales `--mtx-control-height-outlined|filled|standard` (56px) y sus variantes `-small` (40px), `--mtx-color-input-filled`, `--mtx-color-input-filled-hover`, `--mtx-color-primary`, `--mtx-color-secondary` y `--mtx-color-error`.

## Accesibilidad

- El control visible es un `role="combobox"` con `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` y `aria-labelledby` (al label). Sin label, copia el `aria-label` del `<select>`.
- El menú es un `role="listbox"` (`aria-multiselectable` en múltiple) y cada opción un `role="option"` con `aria-selected` y `aria-disabled`.
- `aria-disabled`, `aria-readonly`, `aria-required`, `aria-invalid` y `aria-describedby` (texto de ayuda) se sincronizan automáticamente.
- El `<select>` nativo queda con `aria-hidden="true"` y `tabindex="-1"`, pero sigue enviándose con el formulario.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Enter</kbd> (en el control) | Abre o cierra el menú. |
| <kbd>↓</kbd> / <kbd>↑</kbd> / <kbd>Espacio</kbd> (en el control) | Abre el menú y enfoca la opción seleccionada (o la búsqueda). |
| <kbd>↓</kbd> / <kbd>↑</kbd> (en el menú) | Mueve el foco entre opciones (cíclico). Desde la búsqueda, <kbd>↓</kbd> pasa a la primera opción. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> (en una opción) | Elige la opción (en múltiple, la marca o desmarca). |
| <kbd>Esc</kbd> | Cierra el menú y devuelve el foco al control. |
| <kbd>Tab</kbd> | Cierra el menú y continúa la navegación. |
