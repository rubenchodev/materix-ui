import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import {
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
} from '../src/components/table/table.js';

function createTableHTML() {
  const container = document.createElement('div');
  container.className = 'mtx-table-container';
  container.setAttribute('data-mtx', 'table-container');

  const table = document.createElement('table');
  table.id = 'myTable';
  table.className = 'mtx-table';
  table.setAttribute('data-mtx', 'table');

  const thead = document.createElement('thead');
  thead.setAttribute('data-mtx', 'table-head');
  const headRow = document.createElement('tr');
  headRow.setAttribute('data-mtx', 'table-row');

  const th = document.createElement('th');
  th.className = 'mtx-table-cell';
  th.setAttribute('data-mtx', 'table-cell');

  const sortLabel = document.createElement('button');
  sortLabel.className = 'mtx-table-sort-label';
  sortLabel.setAttribute('data-mtx', 'table-sort-label');
  sortLabel.setAttribute('data-key', 'name');
  sortLabel.textContent = 'Nombre';
  th.appendChild(sortLabel);
  headRow.appendChild(th);
  thead.appendChild(headRow);

  const tbody = document.createElement('tbody');
  tbody.setAttribute('data-mtx', 'table-body');

  for (let i = 1; i <= 25; i++) {
    const row = document.createElement('tr');
    row.setAttribute('data-mtx', 'table-row');
    if (i === 1) row.setAttribute('data-selected', '');
    const cell = document.createElement('td');
    cell.className = 'mtx-table-cell';
    cell.setAttribute('data-mtx', 'table-cell');
    cell.textContent = `Fila ${i}`;
    row.appendChild(cell);
    tbody.appendChild(row);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);

  const pagination = document.createElement('div');
  pagination.className = 'mtx-table-pagination';
  pagination.setAttribute('data-mtx', 'table-pagination');
  pagination.setAttribute('data-table', '#myTable');
  pagination.setAttribute('data-rows-per-page', '10');

  document.body.appendChild(container);
  document.body.appendChild(pagination);

  return { container, table, sortLabel, pagination };
}

describe('Table family', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('inicializa la estructura de la tabla y sus filas', () => {
    const { container, table } = createTableHTML();
    initAll();

    expect(getInstance(container)).toBeInstanceOf(TableContainer);
    expect(getInstance(table)).toBeInstanceOf(Table);

    const firstRow = table.querySelector('tbody tr');
    const tableRow = getInstance(firstRow);
    expect(tableRow).toBeInstanceOf(TableRow);
    expect(firstRow.getAttribute('aria-selected')).toBe('true');
  });

  it('TableSortLabel alterna la dirección y dispara el evento mtx:table:sort', () => {
    const { sortLabel } = createTableHTML();
    initAll();

    const sortInst = getInstance(sortLabel);
    expect(sortInst).toBeInstanceOf(TableSortLabel);

    const sortSpy = vi.fn();
    sortLabel.addEventListener('mtx:table:sort', sortSpy);

    sortLabel.click();
    expect(sortSpy).toHaveBeenCalledTimes(1);
    expect(sortSpy.mock.calls[0][0].detail.direction).toBe('asc');
    expect(sortInst.direction).toBe('asc');

    sortLabel.click();
    expect(sortInst.direction).toBe('desc');
  });

  it('TablePagination controla la paginación y visibilidad de las filas', () => {
    const { table, pagination } = createTableHTML();
    initAll();

    const pagInst = getInstance(pagination);
    expect(pagInst).toBeInstanceOf(TablePagination);
    expect(pagInst.count).toBe(25);
    expect(pagInst.rowsPerPage).toBe(10);

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    expect(rows.slice(0, 10).every((r) => !r.hidden)).toBe(true);
    expect(rows.slice(10).every((r) => r.hidden)).toBe(true);

    pagInst.nextPage();
    expect(pagInst.page).toBe(1);
    expect(rows.slice(10, 20).every((r) => !r.hidden)).toBe(true);
  });

  it('TablePagination emite page-change y rows-per-page-change con la forma pública', () => {
    const { pagination } = createTableHTML();
    initAll();
    const pagInst = getInstance(pagination);
    const pageSpy = vi.fn();
    const rowsSpy = vi.fn();
    document.addEventListener('mtx:table:page-change', pageSpy);
    document.addEventListener('mtx:table:rows-per-page-change', rowsSpy);
    try {
      pagInst.nextPage();
      pagInst.page = 0;
      expect(pageSpy).toHaveBeenCalledTimes(1);
      const pageEvent = pageSpy.mock.calls[0][0];
      expect(pageEvent.detail).toEqual({ page: 1, previousPage: 0, reason: 'nextPage' });
      expect(pageEvent.bubbles).toBe(true);
      expect(pageEvent.cancelable).toBe(false);

      const select = pagination.querySelector('select');
      select.value = '25';
      select.dispatchEvent(new Event('change'));
      expect(rowsSpy).toHaveBeenCalledTimes(1);
      expect(rowsSpy.mock.calls[0][0].detail).toEqual({ rowsPerPage: 25, previousRowsPerPage: 10, page: 0 });
    } finally {
      document.removeEventListener('mtx:table:page-change', pageSpy);
      document.removeEventListener('mtx:table:rows-per-page-change', rowsSpy);
    }
  });
});

describe('TableContainer — región con scroll accesible', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('con data-max-height es enfocable y toma el nombre del caption', () => {
    document.body.innerHTML = '<div data-mtx="table-container" data-max-height="200">'
      + '<table data-mtx="table"><caption>Orders</caption><tbody><tr><td>1</td></tr></tbody></table></div>';
    initAll();
    const container = document.querySelector('.mtx-table-container');
    const caption = document.querySelector('caption');
    expect(container.getAttribute('tabindex')).toBe('0');
    expect(container.getAttribute('role')).toBe('region');
    expect(container.getAttribute('aria-labelledby')).toBe(caption.id);
  });

  it('usa el aria-label de la tabla y respeta un tabindex propio', () => {
    document.body.innerHTML = '<div data-mtx="table-container" data-max-height="200">'
      + '<table data-mtx="table" aria-label="Users"><tbody><tr><td>1</td></tr></tbody></table></div>'
      + '<div data-mtx="table-container" data-max-height="200" tabindex="-1"><table data-mtx="table"></table></div>';
    initAll();
    const [a, b] = document.querySelectorAll('.mtx-table-container');
    expect(a.getAttribute('aria-label')).toBe('Users');
    expect(b.getAttribute('tabindex')).toBe('-1');
    expect(b.hasAttribute('role')).toBe(false);
  });

  it('sin scroll no añade tabindex ni rol', () => {
    document.body.innerHTML = '<div data-mtx="table-container"><table data-mtx="table"></table></div>';
    initAll();
    const container = document.querySelector('.mtx-table-container');
    expect(container.hasAttribute('tabindex')).toBe(false);
    expect(container.hasAttribute('role')).toBe(false);
  });
});
