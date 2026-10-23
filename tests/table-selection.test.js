import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/checkbox/checkbox.js';
import { TableToolbar } from '../src/components/table/table.js';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Monta una tabla de usuarios con toolbar vinculada.
 * @param {string} attrs Atributos extra de la tabla.
 * @returns {HTMLTableElement} Tabla.
 */
const mount = (attrs = '') => {
  document.body.innerHTML = `
    <div data-mtx="table-toolbar" data-table="#users" data-title="Usuarios">
      <div data-show="default" class="mtx-table-toolbar__actions"><input aria-label="Buscar"></div>
      <div data-show="selected" class="mtx-table-toolbar__actions"><button type="button">Borrar</button></div>
    </div>
    <div data-mtx="table-container" data-sticky-header data-max-height="300">
      <table id="users" data-mtx="table" data-hover ${attrs}>
        <caption>Usuarios activos</caption>
        <thead><tr><th>Nombre</th><th data-align="right">Edad</th></tr></thead>
        <tbody>
          <tr data-id="a"><td>Ana</td><td data-align="right">32</td></tr>
          <tr data-id="b"><td>Luis</td><td data-align="right">41</td></tr>
          <tr data-id="c" data-selected><td>María</td><td data-align="right">27</td></tr>
        </tbody>
        <tfoot><tr><td>Total</td><td>3</td></tr></tfoot>
      </table>
    </div>`;
  initAll();
  return document.getElementById('users');
};

describe('Table — descendencia, selección, toolbar y ordenación', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('decora caption, celdas con data-align sin data-mtx y hover solo en el cuerpo', () => {
    const table = mount();
    expect(table.caption.classList.contains('mtx-table-caption')).toBe(true);
    expect(table.tBodies[0].rows[0].cells[1].classList.contains('mtx-table-cell--right')).toBe(true);
    expect(table.tHead.rows[0].classList.contains('mtx-table-row--hover')).toBe(false);
    expect(table.tFoot.rows[0].classList.contains('mtx-table-row--hover')).toBe(false);
    expect(table.tBodies[0].rows[0].classList.contains('mtx-table-row--hover')).toBe(true);
    expect(table.classList.contains('mtx-table--hover')).toBe(true);
  });

  it('aplica sticky header y data-max-height al contenedor', () => {
    const table = mount();
    const container = table.parentElement;
    expect(table.classList.contains('mtx-table--sticky-header')).toBe(true);
    expect(container.style.maxHeight).toBe('300px');
    expect(container.classList.contains('mtx-table-container--scroll')).toBe(true);
  });

  it('estiliza filas añadidas tras init (MutationObserver y refresh())', async () => {
    const table = mount();
    const row = document.createElement('tr');
    row.innerHTML = '<td>Nuevo</td><td data-align="right">50</td>';
    table.tBodies[0].appendChild(row);
    await flush();
    expect(row.classList.contains('mtx-table-row')).toBe(true);
    expect(row.cells[0].classList.contains('mtx-table-cell')).toBe(true);
    expect(row.cells[1].classList.contains('mtx-table-cell--right')).toBe(true);

    const other = document.createElement('tr');
    other.innerHTML = '<td>Otro</td><td>1</td>';
    table.tBodies[0].appendChild(other);
    getInstance(table).refresh();
    expect(other.classList.contains('mtx-table-row--hover')).toBe(true);
  });

  it('data-selectable crea casillas, estado indeterminado y emite selection-change', () => {
    const table = mount('data-selectable');
    const instance = getInstance(table);
    const head = table.tHead.querySelector('input[type="checkbox"]');
    const boxes = [...table.tBodies[0].querySelectorAll('input[type="checkbox"]')];
    expect(boxes).toHaveLength(3);
    expect(head.getAttribute('aria-label')).toBe('Select all rows');
    expect(boxes[0].getAttribute('aria-label')).toBe('Select Ana');
    expect(table.tFoot.rows[0].cells).toHaveLength(3);
    expect(instance.selected).toEqual(['c']);
    expect(head.indeterminate).toBe(true);

    const spy = vi.fn();
    table.addEventListener('mtx:table:selection-change', spy);
    boxes[0].click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail.selected).toEqual(['c', 'a']);
    expect(spy.mock.calls[0][0].detail.count).toBe(2);
    expect(spy.mock.calls[0][0].detail.reason).toBe('user');
    expect(table.tBodies[0].rows[0].classList.contains('mtx-table-row--selected')).toBe(true);

    head.click();
    expect(instance.selected.sort()).toEqual(['a', 'b', 'c']);
    expect(head.checked).toBe(true);
    expect(head.indeterminate).toBe(false);
    head.click();
    expect(instance.selected).toEqual([]);
    expect(table.tBodies[0].rows[2].getAttribute('aria-selected')).toBe('false');
  });

  it('reutiliza casillas propias en celdas data-padding="checkbox"', () => {
    document.body.innerHTML = `
      <table data-mtx="table" data-selectable>
        <thead><tr><th data-padding="checkbox"><input type="checkbox" aria-label="Todos"></th><th>N</th></tr></thead>
        <tbody>
          <tr data-id="1"><td data-padding="checkbox"><input type="checkbox" aria-label="Uno" checked></td><td>Uno</td></tr>
          <tr data-id="2"><td data-padding="checkbox"><input type="checkbox" aria-label="Dos" disabled></td><td>Dos</td></tr>
        </tbody>
      </table>`;
    initAll();
    const table = document.querySelector('table');
    expect(table.querySelectorAll('input[type="checkbox"]')).toHaveLength(3);
    expect(getInstance(table).selected).toEqual(['1']);
    const head = table.tHead.querySelector('input');
    expect(head.getAttribute('aria-label')).toBe('Todos');
    expect(head.checked).toBe(true);
    head.click();
    expect(getInstance(table).selected).toEqual([]);
  });

  it('API de selección: selected, toggleRow, selectAll, clearSelection e isSelected', () => {
    const table = mount('data-selectable');
    const instance = getInstance(table);
    instance.selected = ['a', 'b'];
    expect(instance.getSelectedRows().map((r) => r.dataset.id)).toEqual(['a', 'b']);
    instance.toggleRow('a');
    expect(instance.isSelected('a')).toBe(false);
    instance.toggleRow(table.tBodies[0].rows[2], true);
    expect(instance.isSelected('c')).toBe(true);
    instance.selectAll();
    expect(instance.selected).toHaveLength(3);
    instance.clearSelection();
    expect(instance.selected).toHaveLength(0);
  });

  it('mantiene la selección por data-id cuando se re-renderizan las filas', async () => {
    const table = mount('data-selectable');
    const instance = getInstance(table);
    instance.selected = ['b'];
    table.tBodies[0].innerHTML = '<tr data-id="b"><td>Luis</td><td>41</td></tr><tr data-id="d"><td>Eva</td><td>22</td></tr>';
    await flush();
    const rows = table.tBodies[0].rows;
    expect(rows[0].classList.contains('mtx-table-row--selected')).toBe(true);
    expect(rows[0].querySelector('input').checked).toBe(true);
    expect(rows[1].querySelector('input').checked).toBe(false);
  });

  it('data-select-on-click alterna la fila al hacer clic fuera de controles', () => {
    const table = mount('data-selectable data-select-on-click');
    const instance = getInstance(table);
    table.tBodies[0].rows[0].cells[1].click();
    expect(instance.isSelected('a')).toBe(true);
  });

  it('TableToolbar refleja la selección con resaltado, contador y grupos', () => {
    const table = mount('data-selectable');
    const toolbar = document.querySelector('[data-mtx="table-toolbar"]');
    const instance = getInstance(toolbar);
    expect(instance).toBeInstanceOf(TableToolbar);
    expect(toolbar.getAttribute('role')).toBe('toolbar');
    expect(toolbar.getAttribute('aria-labelledby')).toBe(instance.title.id);
    const count = toolbar.querySelector('.mtx-table-toolbar__count');
    expect(count.getAttribute('aria-live')).toBe('polite');
    expect(instance.count).toBe(1);
    expect(toolbar.classList.contains('mtx-table-toolbar--highlight')).toBe(true);
    expect(count.textContent).toBe('1 selected');
    expect(toolbar.querySelector('[data-show="default"]').hidden).toBe(true);

    getInstance(table).clearSelection();
    expect(toolbar.classList.contains('mtx-table-toolbar--highlight')).toBe(false);
    expect(count.textContent).toBe('');
    expect(instance.title.hidden).toBe(false);
    expect(toolbar.querySelector('[data-show="selected"]').hidden).toBe(true);

    instance.count = 4;
    expect(count.textContent).toBe('4 selected');
  });

  it('TableSortLabel desactiva las otras columnas y gestiona aria-sort', () => {
    document.body.innerHTML = `
      <table data-mtx="table"><thead><tr>
        <th><button data-mtx="table-sort-label" data-key="name" data-active>Nombre</button></th>
        <th><button data-mtx="table-sort-label" data-key="age">Edad</button></th>
      </tr></thead><tbody><tr><td>A</td><td>1</td></tr></tbody></table>`;
    initAll();
    const [name, age] = document.querySelectorAll('button');
    const [thName, thAge] = document.querySelectorAll('th');
    expect(thName.getAttribute('aria-sort')).toBe('ascending');
    expect(name.querySelector('svg')).not.toBeNull();
    age.click();
    expect(thAge.getAttribute('aria-sort')).toBe('ascending');
    expect(thName.hasAttribute('aria-sort')).toBe(false);
    expect(getInstance(name).active).toBe(false);
    age.click();
    expect(thAge.getAttribute('aria-sort')).toBe('descending');
  });
});

describe('Table — filas data-no-select (alineación de columnas)', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('inserta una celda vacía sin casilla y la fila no participa en la selección', async () => {
    document.body.innerHTML = `
      <table id="t" data-mtx="table" data-selectable>
        <thead><tr><th>Nombre</th><th>Rol</th></tr></thead>
        <tbody>
          <tr data-id="a"><td>Ana</td><td>Admin</td></tr>
          <tr data-id="sys" data-no-select data-selected><td>Sistema</td><td>Servicio</td></tr>
          <tr><td colspan="2">Sin más resultados</td></tr>
        </tbody>
      </table>`;
    initAll();
    await flush();
    const table = document.getElementById('t');
    const [ana, sys, full] = table.tBodies[0].rows;
    expect(ana.cells).toHaveLength(3);
    expect(sys.cells).toHaveLength(3);
    expect(sys.cells[0].classList.contains('mtx-table-cell--padding-checkbox')).toBe(true);
    expect(sys.cells[0].querySelector('input')).toBeNull();
    expect(full.cells).toHaveLength(1);
    expect(full.cells[0].colSpan).toBe(3);
    const instance = getInstance(table);
    instance.selectAll();
    expect(instance.selected).toEqual(['a']);
    instance.refresh();
    expect(sys.cells).toHaveLength(3);
  });
});

describe('Table — destroy de la familia en cualquier orden', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  /**
   * Monta tabla seleccionable + toolbar + paginación vinculadas.
   * @returns {{table: object, toolbar: object, pagination: object, el: HTMLTableElement}} Instancias.
   */
  const mountFamily = () => {
    document.body.innerHTML = `
      <div id="tb" data-mtx="table-toolbar" data-table="#t" data-title="T"></div>
      <table id="t" data-mtx="table" data-selectable>
        <thead><tr><th>Nombre</th></tr></thead>
        <tbody>
          <tr data-id="a"><td>A</td></tr><tr data-id="b"><td>B</td></tr><tr data-id="c"><td>C</td></tr>
        </tbody>
      </table>
      <div id="pg" data-mtx="table-pagination" data-table="#t" data-rows-per-page="2"></div>`;
    initAll();
    const el = document.getElementById('t');
    return {
      el,
      table: getInstance(el),
      toolbar: getInstance(document.getElementById('tb')),
      pagination: getInstance(document.getElementById('pg')),
    };
  };

  it('tabla primero: la toolbar sigue funcionando hasta su destroy y luego no queda nada', async () => {
    const { el, table, toolbar, pagination } = mountFamily();
    table.selectAll();
    expect(toolbar.count).toBe(3);
    table.destroy();
    expect(getInstance(el)).toBeFalsy();
    // Sin instancia de tabla: un evento manual aún llega a la toolbar viva.
    el.dispatchEvent(new CustomEvent('mtx:table:selection-change', { bubbles: true, detail: { count: 1 } }));
    expect(toolbar.count).toBe(1);
    toolbar.destroy();
    expect(toolbar.table).toBeNull();
    el.dispatchEvent(new CustomEvent('mtx:table:selection-change', { bubbles: true, detail: { count: 2 } }));
    expect(toolbar.count).toBe(1);
    // La tabla destruida ya no reacciona a clics ni mutaciones.
    const spy = vi.fn();
    document.addEventListener('mtx:table:selection-change', spy);
    el.querySelector('tbody input').click();
    el.tBodies[0].insertAdjacentHTML('beforeend', '<tr data-id="d" data-selected><td>D</td></tr>');
    await flush();
    expect(spy).not.toHaveBeenCalled();
    expect(el.tBodies[0].rows[3].cells).toHaveLength(1);
    document.removeEventListener('mtx:table:selection-change', spy);
    pagination.destroy();
    expect(Array.from(el.tBodies[0].rows).every((row) => !row.hidden)).toBe(true);
  });

  it('toolbar y paginación primero: la tabla sigue emitiendo sin referencias colgantes', () => {
    const { el, table, toolbar, pagination } = mountFamily();
    toolbar.destroy();
    pagination.destroy();
    expect(Array.from(el.tBodies[0].rows).every((row) => !row.hidden)).toBe(true);
    const spy = vi.fn();
    el.addEventListener('mtx:table:selection-change', spy);
    table.selectAll();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].bubbles).toBe(true);
    expect(spy.mock.calls[0][0].cancelable).toBe(false);
    expect(toolbar.count).toBe(0);
    expect(document.getElementById('pg').querySelector('button[data-pagination-action="next"]')).toBeTruthy();
    pagination.element.querySelector('[data-pagination-action="next"]').click();
    expect(pagination.page).toBe(0);
    table.destroy();
    expect(table.destroyed).toBe(true);
  });
});
