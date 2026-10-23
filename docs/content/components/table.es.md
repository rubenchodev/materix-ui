---
title: "Table"
description: "Muestra conjuntos de datos en filas y columnas sobre una tabla HTML semántica, con densidad, cabecera fija, ordenación, selección y paginación."
group: "data-display"
icon: "table_chart"
weight: 60
example: "table"
mui: "https://mui.com/material-ui/react-table/"
---

`Table` estiliza una `<table>` HTML normal con la estética de MUI y añade piezas interactivas opcionales: selección de filas (`data-selectable`), barra de herramientas (`table-toolbar`), etiquetas de ordenación (`table-sort-label`) y paginación (`table-pagination`). Los estilos se aplican por descendencia y un `MutationObserver` decora también las filas añadidas después de inicializar. Úsala para datos con varias columnas que el usuario compara o recorre. Para una sola columna de elementos usa [List](../list/); para tarjetas resumen usa [Card](../card/).

## Uso básico

Escribe una tabla HTML estándar con `data-mtx="table"`: el componente añade las clases a `thead`, `tbody`, `tfoot`, filas y celdas, y pone `scope="col"` en las cabeceras. Envuélvela en `data-mtx="table-container"` para que haga scroll horizontal dentro de su caja en pantallas estrechas.

{{< mtx-demo title="Tabla básica" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table">
    <thead>
      <tr>
        <th>Producto</th>
        <th>Categoría</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Portátil Pro 16"</td><td>Informática</td><td>Disponible</td></tr>
      <tr><td>Teclado mecánico</td><td>Accesorios</td><td>Disponible</td></tr>
      <tr><td>Monitor 4K 27"</td><td>Pantallas</td><td>Agotado</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Alineación numérica

Alinea a la derecha las columnas numéricas para que las cifras se comparen de un vistazo: basta `data-align="right"` (también `center`, `left`, `justify` o `numeric`) en la celda; no hace falta `data-mtx` en cada celda.

{{< mtx-demo title="Columnas numéricas" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table">
    <thead>
      <tr>
        <th>Postre (100 g)</th>
        <th data-align="right">Calorías</th>
        <th data-align="right">Grasa (g)</th>
        <th data-align="right">Proteína (g)</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Yogur helado</td><td data-align="right">159</td><td data-align="right">6,0</td><td data-align="right">4,0</td></tr>
      <tr><td>Sándwich de helado</td><td data-align="right">237</td><td data-align="right">9,0</td><td data-align="right">4,3</td></tr>
      <tr><td>Magdalena</td><td data-align="right">305</td><td data-align="right">3,7</td><td data-align="right">4,3</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Tamaños

`data-size="small"` (o `data-dense`) reduce el relleno vertical de las celdas de 16px a 6px, para tablas con muchas filas.

{{< mtx-demo title="Densa" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table" data-size="small">
    <thead>
      <tr><th>Usuario</th><th>Rol</th><th data-align="right">Accesos</th></tr>
    </thead>
    <tbody>
      <tr><td>Ana García</td><td>Administradora</td><td data-align="right">128</td></tr>
      <tr><td>Luis Pérez</td><td>Editor</td><td data-align="right">57</td></tr>
      <tr><td>María Torres</td><td>Lectora</td><td data-align="right">12</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Estados de fila

`data-hover` en la tabla resalta la fila bajo el cursor. `data-selected` en un `table-row` la marca como seleccionada (fondo primario al 8% y `aria-selected="true"`).

{{< mtx-demo title="Hover y fila seleccionada" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table" data-hover>
    <thead>
      <tr><th>Pedido</th><th>Cliente</th><th data-align="right">Importe</th></tr>
    </thead>
    <tbody>
      <tr><td>#1001</td><td>Ana García</td><td data-align="right">120,00 €</td></tr>
      <tr data-mtx="table-row" data-selected><td>#1002</td><td>Luis Pérez</td><td data-align="right">89,50 €</td></tr>
      <tr><td>#1003</td><td>María Torres</td><td data-align="right">42,90 €</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Cabecera fija

`data-sticky-header` (en el contenedor o en la tabla) fija la fila de cabecera al desplazar, como `stickyHeader` de MUI. `data-max-height` en el contenedor limita su altura (número = px, o cualquier longitud CSS) y activa el scroll interno.

{{< mtx-demo title="Sticky header" layout="block" >}}
<div data-mtx="table-container" data-sticky-header data-max-height="220">
  <table data-mtx="table" data-size="small">
    <thead>
      <tr><th>Ciudad</th><th data-align="right">Habitantes</th></tr>
    </thead>
    <tbody>
      <tr><td>Madrid</td><td data-align="right">3.332.035</td></tr>
      <tr><td>Barcelona</td><td data-align="right">1.660.122</td></tr>
      <tr><td>Valencia</td><td data-align="right">807.693</td></tr>
      <tr><td>Sevilla</td><td data-align="right">686.741</td></tr>
      <tr><td>Zaragoza</td><td data-align="right">682.513</td></tr>
      <tr><td>Málaga</td><td data-align="right">591.637</td></tr>
      <tr><td>Murcia</td><td data-align="right">466.040</td></tr>
      <tr><td>Palma</td><td data-align="right">429.400</td></tr>
      <tr><td>Bilbao</td><td data-align="right">346.405</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Pie y leyenda

Un `<tfoot>` recibe estilo de totales (texto secundario sobre fondo sutil). Un `<caption>` se muestra como leyenda bajo la tabla y recibe la clase `mtx-table-caption` automáticamente; además da nombre accesible a la tabla.

{{< mtx-demo title="Totales y caption" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table">
    <caption>Ventas del primer trimestre, en miles de euros.</caption>
    <thead>
      <tr><th>Mes</th><th data-align="right">Ventas</th></tr>
    </thead>
    <tbody>
      <tr><td>Enero</td><td data-align="right">42,1</td></tr>
      <tr><td>Febrero</td><td data-align="right">38,7</td></tr>
      <tr><td>Marzo</td><td data-align="right">51,3</td></tr>
    </tbody>
    <tfoot>
      <tr><td>Total</td><td data-align="right">132,1</td></tr>
    </tfoot>
  </table>
</div>
{{< /mtx-demo >}}

## Ordenación

Pon un `<button data-mtx="table-sort-label">` dentro de la cabecera. Al pulsarlo alterna la flecha entre ascendente y descendente, **desactiva las demás etiquetas de la misma cabecera** (una sola columna activa, como MUI), pone `aria-sort` en su `<th>` (y lo quita de las otras) y emite `mtx:table:sort` con `{ direction, active, key }`. En columnas alineadas a la derecha la flecha se coloca a la izquierda del texto. **El componente no reordena las filas**: hazlo tú al recibir el evento.

{{< mtx-demo title="Ordenar por columna" layout="block" >}}
<div data-mtx="table-container">
  <table id="doc-sort-table" data-mtx="table">
    <thead>
      <tr>
        <th><button data-mtx="table-sort-label" data-key="name" data-active>Postre</button></th>
        <th data-align="right"><button data-mtx="table-sort-label" data-key="kcal">Calorías</button></th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Donut</td><td data-align="right">452</td></tr>
      <tr><td>Éclair</td><td data-align="right">262</td></tr>
      <tr><td>Magdalena</td><td data-align="right">305</td></tr>
      <tr><td>Yogur helado</td><td data-align="right">159</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

```javascript
const table = document.getElementById('doc-sort-table');
table.addEventListener('mtx:table:sort', (event) => {
  const { key, direction } = event.detail;
  const column = key === 'kcal' ? 1 : 0;
  const body = table.tBodies[0];
  const rows = [...body.rows].sort((a, b) => {
    const x = a.cells[column].textContent;
    const y = b.cells[column].textContent;
    const cmp = column === 1 ? Number(x) - Number(y) : x.localeCompare(y, 'es');
    return direction === 'asc' ? cmp : -cmp;
  });
  body.append(...rows);
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('doc-sort-table');
  table.addEventListener('mtx:table:sort', (event) => {
    const { key, direction } = event.detail;
    const column = key === 'kcal' ? 1 : 0;
    const body = table.tBodies[0];
    const rows = [...body.rows].sort((a, b) => {
      const x = a.cells[column].textContent;
      const y = b.cells[column].textContent;
      const cmp = column === 1 ? Number(x) - Number(y) : x.localeCompare(y, 'es');
      return direction === 'asc' ? cmp : -cmp;
    });
    body.append(...rows);
  });
});
</script>

## Selección

`data-selectable` en la tabla activa la selección integrada (patrón *EnhancedTable* de MUI): se añade una columna de casillas, la de cabecera selecciona o deselecciona todas las filas habilitadas y pasa a indeterminada con selección parcial, y las filas seleccionadas reciben `mtx-table-row--selected`. Cada fila se identifica por `data-id` (si falta, se genera una clave interna) y la selección se conserva aunque las filas se vuelvan a pintar. Con `data-select-on-click` también se alterna pulsando cualquier parte de la fila que no sea un control. La tabla emite `mtx:table:selection-change` con `{ selected, rows, count, reason }`.

{{< mtx-demo title="Filas seleccionables" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table" data-selectable data-select-on-click data-hover aria-label="Equipo">
    <thead>
      <tr><th>Nombre</th><th data-align="right">Edad</th></tr>
    </thead>
    <tbody>
      <tr data-id="ana"><td>Ana García</td><td data-align="right">32</td></tr>
      <tr data-id="luis" data-selected><td>Luis Pérez</td><td data-align="right">41</td></tr>
      <tr data-id="maria"><td>María Torres</td><td data-align="right">27</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

- `data-selected` en una fila la marca como seleccionada la primera vez que la tabla la ve.
- Si ya escribes tus propias casillas en celdas `data-padding="checkbox"` (primera celda de la fila), la tabla las reutiliza en lugar de crear otras; una casilla `disabled` excluye la fila de «seleccionar todo».
- `data-no-select` en un `<tr>` lo deja fuera de la selección (útil para filas de sistema o bloqueadas: recibe una celda de checkbox vacía para que las columnas sigan alineadas; una fila de «sin resultados» con una sola celda `colspan` amplía su `colspan` en su lugar).
- Los nombres accesibles se generan traducidos: «Seleccionar todas las filas» y «Seleccionar {primera celda}» (o `data-label` de la fila).

## Toolbar

`data-mtx="table-toolbar"` es la barra superior de la tabla (*EnhancedTableToolbar* de MUI). Con `data-table="#id"` sigue la selección: sin filas seleccionadas muestra el título (`data-title`) y los hijos `data-show="default"`; con selección se resalta (`mtx-table-toolbar--highlight`, primario al 12%), sustituye el título por el contador «N seleccionados» (región `aria-live="polite"`) y muestra los hijos `data-show="selected"`. Lleva `role="toolbar"` y su nombre sale del título.

{{< mtx-demo title="Toolbar con acciones en lote" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <div data-mtx="table-toolbar" data-table="#doc-toolbar-table" data-title="Nutrición">
    <div class="mtx-table-toolbar__actions" data-show="default">
      <button data-mtx="icon-button" data-icon="filter_list" aria-label="Filtrar lista"></button>
    </div>
    <div class="mtx-table-toolbar__actions" data-show="selected">
      <button data-mtx="icon-button" data-icon="delete" aria-label="Eliminar seleccionados"></button>
    </div>
  </div>
  <div data-mtx="table-container">
    <table id="doc-toolbar-table" data-mtx="table" data-selectable data-select-on-click data-hover aria-label="Nutrición">
      <thead>
        <tr><th>Postre (100 g)</th><th data-align="right">Calorías</th></tr>
      </thead>
      <tbody>
        <tr data-id="cupcake"><td>Magdalena</td><td data-align="right">305</td></tr>
        <tr data-id="donut" data-selected><td>Donut</td><td data-align="right">452</td></tr>
        <tr data-id="eclair"><td>Éclair</td><td data-align="right">262</td></tr>
      </tbody>
    </table>
  </div>
</div>
{{< /mtx-demo >}}

Sin `data-table`, la barra busca una tabla dentro de su mismo contenedor padre; también puedes fijar el contador a mano con `toolbar.count = n`. Para un texto propio usa `data-selected-text="{0} usuarios seleccionados"`.

## Paginación

`data-mtx="table-pagination"` construye el selector de filas por página, el rango visible y los botones de navegación. Con `data-table="#selector"` pagina por sí sola las filas del `<tbody>` indicado; sin él, trabaja con `data-count` y tú cargas los datos al recibir `mtx:table:page-change`. Los textos se traducen con el idioma activo.

{{< mtx-demo title="Paginación local" layout="block" >}}
<div data-mtx="table-container">
  <table id="doc-paged-table" data-mtx="table" data-size="small">
    <thead>
      <tr><th>Código</th><th>País</th></tr>
    </thead>
    <tbody>
      <tr><td>AR</td><td>Argentina</td></tr>
      <tr><td>BO</td><td>Bolivia</td></tr>
      <tr><td>CL</td><td>Chile</td></tr>
      <tr><td>CO</td><td>Colombia</td></tr>
      <tr><td>EC</td><td>Ecuador</td></tr>
      <tr><td>ES</td><td>España</td></tr>
      <tr><td>MX</td><td>México</td></tr>
      <tr><td>PE</td><td>Perú</td></tr>
    </tbody>
  </table>
</div>
<div data-mtx="table-pagination" data-table="#doc-paged-table" data-rows-per-page="3" data-rows-per-page-options="3,5,-1" data-show-first-button data-show-last-button></div>
{{< /mtx-demo >}}

## Casos de uso reales

Una «data table» completa: Paper + toolbar + tabla seleccionable con ordenación + paginación. **La selección, el contador y la paginación local los gestiona Materix; tú solo mantienes los datos, el orden y el filtro** y vuelves a pintar el `<tbody>`. Las filas nuevas se estilizan y reciben su casilla solas, y la selección se conserva por `data-id`. El ejemplo funcional está en `/examples/table` (sección «Data table»).

```html
<div data-mtx="paper" data-variant="outlined">
  <div data-mtx="table-toolbar" data-table="#orders" data-title="Pedidos">
    <div class="mtx-table-toolbar__actions" data-show="default">
      <input id="search" data-mtx="text-field" data-label="Buscar cliente" data-size="small" data-start-icon="search" type="search">
    </div>
    <div class="mtx-table-toolbar__actions" data-show="selected">
      <button id="delete" class="mtx-button mtx-button--text mtx-button--error" data-mtx="button">Eliminar</button>
    </div>
  </div>
  <div data-mtx="table-container">
    <table id="orders" data-mtx="table" data-selectable data-hover aria-label="Pedidos">
      <thead>
        <tr>
          <th><button data-mtx="table-sort-label" data-key="client" data-active>Cliente</button></th>
          <th data-align="right"><button data-mtx="table-sort-label" data-key="total">Importe</button></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div id="pager" data-mtx="table-pagination" data-table="#orders" data-rows-per-page="5"></div>
</div>
```

```javascript
document.addEventListener('DOMContentLoaded', () => {
  let orders = [/* { id, client, total } */];
  let sort = { key: 'client', direction: 'asc' };
  let query = '';
  const table = document.getElementById('orders');
  const api = Materix.getInstance(table);
  const pager = Materix.getInstance(document.getElementById('pager'));

  const render = () => {
    const factor = sort.direction === 'asc' ? 1 : -1;
    const rows = orders
      .filter((o) => o.client.toLowerCase().includes(query))
      .sort((a, b) => factor * (sort.key === 'total' ? a.total - b.total : a.client.localeCompare(b.client)));
    table.tBodies[0].innerHTML = rows
      .map((o) => `<tr data-id="${o.id}"><td>${o.client}</td><td data-align="right">${o.total}</td></tr>`)
      .join('');
    pager.page = 0;
    pager.update();
  };

  table.addEventListener('mtx:table:sort', (e) => { sort = e.detail; render(); });
  document.getElementById('search').addEventListener('input', (e) => { query = e.target.value.toLowerCase(); render(); });
  document.getElementById('delete').addEventListener('click', () => {
    orders = orders.filter((o) => !api.isSelected(o.id));
    api.clearSelection();
    render();
  });
  render();
});
```

Con paginación en servidor, quita `data-table` de la paginación, usa `data-count` y pinta la página al recibir `mtx:table:page-change`: la selección por `data-id` se mantiene entre páginas (la casilla de cabecera refleja solo las filas visibles).

## Sintaxis BEM completa

Cada parte tiene su propio `data-mtx` y su clase, útil cuando la tabla se renderiza en el servidor.

```html
<div class="mtx-table-container" data-mtx="table-container">
  <table class="mtx-table mtx-table--small" data-mtx="table">
    <thead class="mtx-table-head" data-mtx="table-head">
      <tr class="mtx-table-row" data-mtx="table-row">
        <th class="mtx-table-cell" data-mtx="table-cell" scope="col">Postre</th>
        <th class="mtx-table-cell mtx-table-cell--right" data-mtx="table-cell" scope="col">Calorías</th>
      </tr>
    </thead>
    <tbody class="mtx-table-body" data-mtx="table-body">
      <tr class="mtx-table-row mtx-table-row--selected" data-mtx="table-row" aria-selected="true">
        <td class="mtx-table-cell" data-mtx="table-cell">Magdalena</td>
        <td class="mtx-table-cell mtx-table-cell--right" data-mtx="table-cell">305</td>
      </tr>
    </tbody>
    <tfoot class="mtx-table-footer" data-mtx="table-footer">…</tfoot>
  </table>
</div>
```

La barra de herramientas en BEM (sin JavaScript, el resaltado lo controlas tú):

```html
<div class="mtx-table-toolbar mtx-table-toolbar--highlight" role="toolbar" aria-label="Acciones de pedidos">
  <div class="mtx-table-toolbar__count" aria-live="polite">2 seleccionados</div>
  <div class="mtx-table-toolbar__actions">…</div>
</div>
```

## Uso programático

```javascript
// Inicializar una tabla insertada dinámicamente
Materix.initAll(document.getElementById('report'));

// Selección (tabla con data-selectable)
const table = Materix.getInstance(document.getElementById('orders'));
table.selected;                 // ['1001', '1004'] (valores de data-id)
table.selected = ['1002'];      // reemplaza la selección
table.toggleRow('1003');        // alterna (acepta clave o <tr>)
table.selectAll();              // todas las filas habilitadas
table.clearSelection();         // vacía también claves de filas que ya no están
table.isSelected('1002');       // true / false
table.getSelectedRows();        // <tr> seleccionados presentes en el DOM
table.refresh();                // re-decora a mano (normalmente no hace falta)

document.getElementById('orders').addEventListener('mtx:table:selection-change', (event) => {
  console.log(event.detail); // { selected, rows, count, reason: 'user' | 'api' | 'refresh' }
});

// Toolbar
const toolbar = Materix.getInstance(document.getElementById('orders-toolbar'));
toolbar.count = 3;              // fija el contador sin tabla vinculada

// Paginación
const pager = Materix.getInstance(document.getElementById('pager'));
pager.count = 240;          // total (o -1 si es desconocido)
pager.rowsPerPage = 25;     // vuelve a la página 0
pager.page = 3;             // índice base 0 (no emite evento)
pager.nextPage();           // emite mtx:table:page-change
pager.update();             // recalcula tras reordenar o añadir filas

// Ordenación
const sort = Materix.getInstance(document.querySelector('[data-key="total"]'));
sort.direction = 'desc';
sort.active = true;         // actualiza aria-sort del <th>
```

Con ES modules:

```javascript
import { Table, TableContainer, TableRow, TableCell, TableSortLabel, TablePagination, TableToolbar } from 'materix-ui';
```

## Referencia de API

### Atributos data-*

**Table** (`data-mtx="table"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-size` | `small` | normal | Celdas compactas (6px vertical). |
| `data-dense` | Booleano (presencia) | ausente | Alias de `data-size="small"`. |
| `data-hover` | Booleano (presencia) | ausente | Resalta la fila del cuerpo bajo el cursor (no afecta a cabecera ni pie). |
| `data-sticky-header` | Booleano (presencia) | ausente | Cabecera fija (también en el contenedor). |
| `data-selectable` | Booleano (presencia) | ausente | Selección integrada con columna de casillas y evento `mtx:table:selection-change`. |
| `data-select-on-click` | Booleano (presencia) | ausente | Con `data-selectable`, pulsar la fila (fuera de controles) la alterna. |

**Filas y celdas** (cualquier `<tr>`, `<th>` o `<td>` de la tabla, sin `data-mtx`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-id` (en `<tr>`) | Texto | clave interna | Identificador de la fila en la selección. |
| `data-selected` (en `<tr>`) | Booleano (presencia) | ausente | Fila seleccionada al aparecer. |
| `data-no-select` (en `<tr>`) | Booleano (presencia) | ausente | Excluye la fila de la selección (recibe una celda de checkbox vacía para mantener las columnas alineadas). |
| `data-label` (en `<tr>`) | Texto | primera celda | Texto del nombre accesible de su casilla. |
| `data-align` | `left`, `center`, `right`, `justify`, `numeric` | `left` | Alineación del texto (`numeric` equivale a `right`). |
| `data-padding` | `checkbox`, `none` | normal | Celda estrecha para checkbox (48px) o sin relleno. |
| `data-sort-direction` | `asc`, `desc` | — | Fija `aria-sort` (solo con `data-mtx="table-cell"`). |

**TableContainer** (`data-mtx="table-container"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-sticky-header` | Booleano (presencia) | ausente | Fija la cabecera de la tabla interior. |
| `data-max-height` | Número (px) o longitud CSS | — | Altura máxima con scroll interno (`mtx-table-container--scroll`). |

**TableRow** (`data-mtx="table-row"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-selected` | Booleano (presencia) | ausente | Fila seleccionada (`aria-selected="true"`). |
| `data-hover` | Booleano (presencia) | ausente | Hover solo en esta fila. |

**TableToolbar** (`data-mtx="table-toolbar"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-table` | Selector CSS | tabla del mismo contenedor padre | Tabla cuya selección sigue. |
| `data-title` | Texto | — | Título (`mtx-table-toolbar__title`, tipografía h6) y nombre accesible. |
| `data-selected-text` | Texto con `{0}` | i18n («{0} seleccionados») | Texto del contador. |
| `data-count` | Entero | `0` | Contador inicial sin tabla vinculada. |
| `data-show` (en hijos) | `default`, `selected` | — | Visible solo sin selección o solo con selección. |

**TableSortLabel** (`data-mtx="table-sort-label"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-key` | Texto | `null` | Identificador de la columna, enviado en el evento. |
| `data-active` | Booleano (presencia) | ausente | Columna ordenada actualmente (flecha visible). |
| `data-direction` | `asc`, `desc` | `asc` | Dirección actual. |
| `data-disable-auto-toggle` | Booleano (presencia) | ausente | Emite el evento sin cambiar dirección ni estado (modo controlado). |
| `data-disabled` | Booleano (presencia) | ausente | Inicia deshabilitada. |

**TablePagination** (`data-mtx="table-pagination"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-table` | Selector CSS | — | Tabla cuyas filas de `<tbody>` se paginan localmente. |
| `data-count` | Entero o `-1` | nº de filas de `data-table` | Total de filas; `-1` = desconocido («más de N»). |
| `data-page` | Entero ≥ 0 | `0` | Página inicial (base 0). |
| `data-rows-per-page` | Entero o `-1` | `10` | Filas por página; `-1` = todas. |
| `data-rows-per-page-options` | Lista separada por comas | `10,25,50,100` | Opciones del selector (`-1` = «Todas»). |
| `data-show-first-button` | Booleano (presencia) | ausente | Muestra el botón de primera página. |
| `data-show-last-button` | Booleano (presencia) | ausente | Muestra el botón de última página. |
| `data-disabled` | Booleano (presencia) | ausente | Inicia deshabilitada. |
| `data-label-rows-per-page` | Texto | i18n («Filas por página:») | Etiqueta del selector. |
| `data-label-of` / `data-label-more-than` | Texto | i18n («de» / «más de») | Textos del rango visible. |
| `data-label-all` | Texto | i18n («Todas») | Texto de la opción `-1`. |
| `data-label-first` / `-previous` / `-next` / `-last` | Texto | i18n | `aria-label` de cada botón. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-table-container` | Caja relativa con `overflow-x: auto`. |
| `mtx-table-container--scroll` | Con `data-max-height`: scroll vertical interno. |
| `mtx-table` | Tabla a ancho completo, bordes colapsados, fondo paper. Estiliza por descendencia `thead`, `tbody`, `tfoot`, `th` y `td`. |
| `mtx-table--small` / `--dense` | Celdas compactas. |
| `mtx-table--hover` | Hover en filas del cuerpo. |
| `mtx-table--sticky-header` | Cabecera fija (bordes separados). |
| `mtx-table--selectable` | Tabla con selección integrada. |
| `mtx-table-head` / `mtx-table-body` / `mtx-table-footer` | Secciones (el pie con fondo sutil y texto secundario). |
| `mtx-table-row`, `mtx-table-row--hover`, `mtx-table-row--selected` | Fila, hover y seleccionada. |
| `mtx-table-cell` | Celda (16px de relleno, borde inferior). |
| `mtx-table-cell--left` / `--center` / `--right` / `--justify` / `--numeric` | Alineación. |
| `mtx-table-cell--padding-checkbox` / `--padding-none` / `--checkbox` | Celdas de checkbox o sin relleno. |
| `mtx-table-cell--action` | Celda de acciones alineada a la derecha. |
| `mtx-table-caption` | Leyenda bajo la tabla (se añade sola a `<caption>`). |
| `mtx-table-toolbar`, `--highlight` | Barra de herramientas y su estado con selección. |
| `mtx-table-toolbar__title`, `__count`, `__count--empty`, `__actions`, `__actions--grow`, `__spacer` | Partes de la barra. |
| `mtx-table-sort-label`, `--active`, `--desc`, `__icon` | Etiqueta de ordenación, activa, descendente y flecha (SVG 18px). |
| `mtx-table-pagination`, `__toolbar`, `__select-label`, `__select`, `__displayed-rows`, `__actions`, `__button` | Partes de la paginación generada. |

### Métodos

**Table**

| Método / propiedad | Retorna | Descripción |
|---|---|---|
| `selected` (get/set) | `string[]` | Claves seleccionadas; asignarla reemplaza la selección. |
| `getSelectedRows()` | `HTMLTableRowElement[]` | Filas seleccionadas presentes en el DOM. |
| `isSelected(rowOrKey)` | `boolean` | Si una fila o clave está seleccionada. |
| `toggleRow(rowOrKey, force?)` | `void` | Alterna o fuerza la selección de una fila. |
| `selectAll()` / `clearSelection()` | `void` | Selecciona todas las filas habilitadas / vacía la selección. |
| `refresh()` | `void` | Vuelve a decorar filas y celdas (lo hace solo al cambiar el DOM). |
| `destroy()` | `void` | Retira listeners y el observador. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

**TableToolbar**

| Método / propiedad | Retorna | Descripción |
|---|---|---|
| `count` (get/set) | `number` | Número de seleccionadas mostrado. |
| `destroy()` | `void` | Retira los listeners. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

**TableSortLabel**

| Método / propiedad | Retorna | Descripción |
|---|---|---|
| `active` (get/set) | `boolean` | Columna activa; actualiza `aria-sort` del `<th>`. |
| `direction` (get/set) | `'asc' \| 'desc'` | Dirección de la flecha. |
| `disabled` (get) | `boolean` | Estado deshabilitado. |
| `disable()` / `enable()` | `void` | Deshabilita o habilita. |
| `focus()` | `void` | Enfoca la etiqueta. |
| `destroy()` | `void` | Retira los listeners. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

**TablePagination**

| Método / propiedad | Retorna | Descripción |
|---|---|---|
| `count` (get/set) | `number` | Total de filas (`-1` desconocido). |
| `page` (get/set) | `number` | Página actual (base 0); asignarla no emite evento. |
| `rowsPerPage` (get/set) | `number` | Filas por página; vuelve a la página 0. |
| `update()` | `void` | Recalcula rango, botones y filas visibles. |
| `firstPage()` / `previousPage()` / `nextPage()` / `lastPage()` | `void` | Navegación; emiten `mtx:table:page-change` si cambia la página. |
| `disabled` (get) | `boolean` | Estado deshabilitado. |
| `disable()` / `enable()` | `void` | Deshabilita o habilita todos los controles. |
| `destroy()` | `void` | Retira listeners y vuelve a mostrar todas las filas. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

Table, TableContainer, TableHead, TableBody, TableFooter, TableRow y TableCell no exponen métodos propios.

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:table:selection-change` | `{ selected: string[], rows: HTMLTableRowElement[], count, reason: 'user' \| 'api' \| 'refresh' }` | Cambia la selección (casillas, clic en fila, métodos o filas nuevas con `data-selected`). Se emite en la `<table>`. |
| `mtx:table:sort` | `{ direction: 'asc' \| 'desc', active: true, key: string \| null }` | Se pulsa (o se activa con teclado) una `table-sort-label`. `direction` es la nueva dirección. |
| `mtx:table:page-change` | `{ page, previousPage, reason }` | Cambia la página por los botones o los métodos de navegación. `reason`: `firstPage`, `previousPage`, `nextPage` o `lastPage`. |
| `mtx:table:rows-per-page-change` | `{ rowsPerPage, previousRowsPerPage, page: 0 }` | El usuario cambia el selector de filas por página. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-background-paper` | Fondo de la tabla y de la cabecera. |
| `--mtx-color-divider` | Bordes de celda y del selector. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` | Texto de celdas y de pie, paginación y caption. |
| `--mtx-color-action-hover` | Hover de filas y fondo del pie. |
| `--mtx-color-primary` | Fondo de filas seleccionadas (8%–12%). |
| `--mtx-color-action-active` / `--mtx-color-action-disabled` | Botones de paginación y flecha de orden. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-type-body2` | Tipografía de la paginación. |
| `--mtx-table-cell-padding` | Relleno de celda (16px; 6px 16px en small). |

## Accesibilidad

- Usa siempre `<table>`, `<thead>`, `<th>` y `<tbody>`: el componente añade `scope="col"` a las cabeceras (y `scope="row"` a los `<th>` del cuerpo). Añade un `<caption>` o un `aria-label` en la tabla para darle nombre.
- Un `table-container` con scroll (con `data-max-height`, o cuando la tabla desborda en horizontal) recibe `tabindex="0"` y `role="region"` para poder desplazarse con el teclado (WCAG 2.1.1). Su nombre sale del `<caption>` (`aria-labelledby`), del `aria-label`/`aria-labelledby` de la tabla o, si no hay, «Scrollable table». Se respeta un `tabindex` propio.
- La columna ordenada expone `aria-sort="ascending|descending"` en su `<th>` y solo una columna lo tiene a la vez; la flecha es decorativa (`aria-hidden`).
- Con `data-selectable`, cada casilla tiene nombre traducido («Seleccionar todas las filas», «Seleccionar Ana García»); la de cabecera expone `aria-checked="mixed"` en estado indeterminado y las filas `aria-selected`.
- La toolbar tiene `role="toolbar"`, toma su nombre del título y anuncia el contador de seleccionadas con `aria-live="polite"`.
- La paginación anuncia el rango visible (`aria-live="polite"`) y sus botones tienen nombres traducidos («Página siguiente»).
- `table-container` desplaza la tabla dentro de su caja: la página no tiene scroll horizontal en móvil.

| Tecla | Acción |
|---|---|
| Tab / Mayús+Tab | Recorre acciones de la toolbar, etiquetas de orden, casillas, selector y botones de página. |
| Enter / Espacio | Activa la etiqueta de orden enfocada o el botón de página. |
| Espacio | Marca o desmarca la casilla enfocada. |
| Flechas arriba/abajo | Cambian el valor del selector de filas por página. |
