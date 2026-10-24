import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Checkbox } from '../checkbox';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TableToolbar,
  getComparator,
  paginateRows,
  sortRows,
  useTableSelection,
  useTableSort,
} from './index';
import type { UseTableSelectionOptions } from './index';

interface Person {
  id: string;
  name: string;
  age: number;
}

const PEOPLE: Person[] = [
  { id: 'ana', name: 'Ana', age: 32 },
  { id: 'luis', name: 'Luis', age: 41 },
  { id: 'system', name: 'System', age: 0 },
];

function SelectableTable(props: { options?: UseTableSelectionOptions<Person>; rows?: Person[] }) {
  const rows = props.rows ?? PEOPLE;
  const selection = useTableSelection(rows, (row) => row.id, {
    getRowLabel: (row) => row.name,
    ...props.options,
  });
  return (
    <>
      <TableToolbar title="Team" numSelected={selection.numSelected} selectedActions={<button type="button">Delete</button>} />
      <Table aria-label="Team" selectable>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox {...selection.getHeaderCheckboxProps()} />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Age</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} {...selection.getRowProps(row)} data-testid={`row-${row.id}`}>
              <TableCell padding="checkbox">
                {selection.canSelect(row) ? <Checkbox {...selection.getRowCheckboxProps(row)} /> : null}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

describe('Table', () => {
  it('aplica clases BEM, scope por sección y variante por contexto', () => {
    const { container } = render(
      <Table aria-label="T" size="small" hover>
        <TableCaption>Leyenda</TableCaption>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right" sortDirection="desc">Kcal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th">Ana</TableCell>
            <TableCell numeric>1</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell padding="none">1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    const table = container.querySelector('table')!;
    expect(table).toHaveClass('mtx-table', 'mtx-table--small', 'mtx-table--hover');
    expect(container.querySelector('caption')).toHaveClass('mtx-table-caption');
    expect(container.querySelector('thead')).toHaveClass('mtx-table-head');
    expect(container.querySelector('tbody')).toHaveClass('mtx-table-body');
    expect(container.querySelector('tfoot')).toHaveClass('mtx-table-footer');
    const heads = container.querySelectorAll('thead th');
    expect(heads[0]).toHaveAttribute('scope', 'col');
    expect(heads[1]).toHaveClass('mtx-table-cell--right');
    expect(heads[1]).toHaveAttribute('aria-sort', 'descending');
    expect(container.querySelector('tbody th')).toHaveAttribute('scope', 'row');
    expect(container.querySelector('tbody td')).toHaveClass('mtx-table-cell--numeric');
    expect(container.querySelector('tbody tr')).toHaveClass('mtx-table-row--hover');
    expect(container.querySelector('thead tr')).not.toHaveClass('mtx-table-row--hover');
    expect(container.querySelector('tfoot td:last-child')).toHaveClass('mtx-table-cell--padding-none');
  });

  it('paridad DOM con vanilla: contenedor, tabla, alineación y pie', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="table-container"><table data-mtx="table" data-size="small" aria-label="Sales">'
        + '<thead><tr><th>Month</th><th data-align="right">Sales</th></tr></thead>'
        + '<tbody><tr><td>January</td><td data-align="right">42.1</td></tr></tbody>'
        + '<tfoot><tr><td>Total</td><td data-align="right">42.1</td></tr></tfoot></table></div>',
    );
    const { container } = render(
      <TableContainer>
        <Table size="small" aria-label="Sales">
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell align="right">Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>January</TableCell>
              <TableCell align="right">42.1</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell align="right">42.1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, { attributes: ['scope'] });
  });

  it('fila seleccionada fuera de tabla seleccionable: aria-selected solo cuando es true', () => {
    const { container } = render(
      <Table aria-label="T">
        <TableBody>
          <TableRow selected><TableCell>A</TableCell></TableRow>
          <TableRow selected={false}><TableCell>B</TableCell></TableRow>
        </TableBody>
      </Table>,
    );
    const rows = container.querySelectorAll('tr');
    expect(rows[0]).toHaveClass('mtx-table-row--selected');
    expect(rows[0]).toHaveAttribute('aria-selected', 'true');
    expect(rows[1]).not.toHaveAttribute('aria-selected');
  });

  it('celda con tamaño distinto al de la tabla ajusta su variable de relleno', () => {
    const { container } = render(
      <Table aria-label="T">
        <TableBody>
          <TableRow><TableCell size="small">A</TableCell><TableCell>B</TableCell></TableRow>
        </TableBody>
      </Table>,
    );
    const [small, normal] = Array.from(container.querySelectorAll('td'));
    expect(small.style.getPropertyValue('--mtx-table-cell-padding')).toBe('6px 16px');
    expect(normal.getAttribute('style')).toBeNull();
  });
});

describe('TableContainer', () => {
  it('maxHeight y stickyHeader: clases, estilo y región enfocable nombrada por el caption', () => {
    const { container } = render(
      <TableContainer maxHeight={240} stickyHeader>
        <Table>
          <TableCaption>Cities</TableCaption>
          <TableBody><TableRow><TableCell>NY</TableCell></TableRow></TableBody>
        </Table>
      </TableContainer>,
    );
    const root = container.firstElementChild as HTMLDivElement;
    expect(root).toHaveClass('mtx-table-container', 'mtx-table-container--scroll', 'mtx-table-container--sticky');
    expect(root.style.maxHeight).toBe('240px');
    expect(container.querySelector('table')).toHaveClass('mtx-table--sticky-header');
    expect(root).toHaveAttribute('tabindex', '0');
    expect(root).toHaveAttribute('role', 'region');
    expect(root.getAttribute('aria-labelledby')).toBe(container.querySelector('caption')!.id);
  });

  it('usa el aria-label de la tabla y respeta un tabindex propio', () => {
    const { container, rerender } = render(
      <TableContainer maxHeight="50vh"><Table aria-label="Users"><TableBody /></Table></TableContainer>,
    );
    const root = container.firstElementChild as HTMLDivElement;
    expect(root).toHaveAttribute('aria-label', 'Users');
    expect(root.style.maxHeight).toBe('50vh');
    rerender(<TableContainer maxHeight="50vh" tabIndex={-1}><Table aria-label="Users"><TableBody /></Table></TableContainer>);
    expect(root).toHaveAttribute('tabindex', '-1');
  });

  it('sin scroll no añade tabindex ni rol', () => {
    const { container } = render(<TableContainer><Table aria-label="T"><TableBody /></Table></TableContainer>);
    const root = container.firstElementChild!;
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('role');
  });
});

describe('TableSortLabel', () => {
  it('paridad DOM con vanilla (activa y descendente)', async () => {
    const vanilla = await mountVanilla('<button data-mtx="table-sort-label" data-active data-direction="desc">Name</button>');
    const { container } = render(<TableSortLabel active direction="desc">Name</TableSortLabel>);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('onSort calcula la dirección siguiente y publica aria-sort en el th', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    function Sortable() {
      const sort = useTableSort<'name' | 'kcal'>({ defaultOrderBy: 'name', onSortChange: onSort });
      return (
        <Table aria-label="T">
          <TableHead>
            <TableRow>
              <TableCell><TableSortLabel {...sort.getSortLabelProps('name')}>Name</TableSortLabel></TableCell>
              <TableCell><TableSortLabel {...sort.getSortLabelProps('kcal')}>Kcal</TableSortLabel></TableCell>
            </TableRow>
          </TableHead>
        </Table>
      );
    }
    const { container } = render(<Sortable />);
    const [nameTh, kcalTh] = Array.from(container.querySelectorAll('th'));
    expect(nameTh).toHaveAttribute('aria-sort', 'ascending');
    expect(kcalTh).not.toHaveAttribute('aria-sort');
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSort).toHaveBeenLastCalledWith('name', 'desc');
    expect(nameTh).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getByRole('button', { name: 'Name' })).toHaveClass('mtx-table-sort-label--desc');
    await user.click(screen.getByRole('button', { name: 'Kcal' }));
    expect(onSort).toHaveBeenLastCalledWith('kcal', 'asc');
    expect(nameTh).not.toHaveAttribute('aria-sort');
    expect(kcalTh).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByRole('button', { name: 'Name' })).not.toHaveClass('mtx-table-sort-label--active');
  });

  it('deshabilitada no emite onSort', async () => {
    const onSort = vi.fn();
    render(<TableSortLabel disabled sortKey="fat" onSort={onSort}>Fat</TableSortLabel>);
    const button = screen.getByRole('button', { name: 'Fat' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(button);
    expect(onSort).not.toHaveBeenCalled();
  });

  it('detalle del onSort con la clave de la columna', async () => {
    const onSort = vi.fn();
    render(<TableSortLabel sortKey="kcal" onSort={onSort}>Kcal</TableSortLabel>);
    fireEvent.click(screen.getByRole('button'));
    expect(onSort).toHaveBeenCalledWith(expect.anything(), { direction: 'asc', active: true, key: 'kcal' });
  });
});

describe('TablePagination', () => {
  it('paridad DOM con vanilla (total remoto con primera y última)', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="table-pagination" data-count="48" data-rows-per-page="10" data-show-first-button data-show-last-button></div>',
    );
    const { container } = render(<TablePagination count={48} defaultRowsPerPage={10} showFirstButton showLastButton />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, { attributes: ['hidden'] });
  });

  it('paridad DOM con vanilla: deshabilitada y total desconocido', async () => {
    const vanilla = await mountVanilla('<div data-mtx="table-pagination" data-count="-1" data-rows-per-page="10" data-disabled></div>');
    const { container } = render(<TablePagination count={-1} defaultRowsPerPage={10} disabled />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, { attributes: ['hidden'] });
    expect(container.querySelector('.mtx-table-pagination__displayed-rows')).toHaveTextContent('1–10 of more than 10');
  });

  it('no controlada: navega, emite page-change y rows-per-page-change con la forma pública', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const onRowsPerPageChange = vi.fn();
    render(
      <TablePagination
        count={48}
        showFirstButton
        showLastButton
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />,
    );
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(expect.anything(), 1, { previousPage: 0, reason: 'nextPage' });
    expect(screen.getByText('11–20 of 48')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(expect.anything(), 4, { previousPage: 1, reason: 'lastPage' });
    expect(screen.getByText('41–48 of 48')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Rows per page:' }), '25');
    expect(onRowsPerPageChange).toHaveBeenLastCalledWith(expect.anything(), 25, { previousRowsPerPage: 10, page: 0 });
    expect(screen.getByText('1–25 of 48')).toBeInTheDocument();
  });

  it('controlada, opción Todas, etiquetas propias e idioma', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [page, setPage] = useState(1);
      const [rows, setRows] = useState(5);
      return (
        <TablePagination
          count={12}
          page={page}
          rowsPerPage={rows}
          rowsPerPageOptions={[5, -1]}
          onPageChange={(_e, next) => setPage(next)}
          onRowsPerPageChange={(_e, next) => { setRows(next); setPage(0); }}
          locale="es"
        />
      );
    }
    render(<Controlled />);
    expect(screen.getByText('6–10 de 12')).toBeInTheDocument();
    const select = screen.getByRole('combobox', { name: 'Filas por página:' });
    expect(Array.from((select as HTMLSelectElement).options).map((o) => o.textContent)).toEqual(['5', 'Todas']);
    await user.selectOptions(select, '-1');
    expect(screen.getByText('1–12 de 12')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toBeDisabled();
  });

  it('acota la página al total conocido', () => {
    render(<TablePagination count={8} page={5} rowsPerPage={4} />);
    expect(screen.getByText('5–8 of 8')).toBeInTheDocument();
  });
});

describe('TableToolbar', () => {
  it('paridad DOM con vanilla con selección', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="table-toolbar" data-title="Nutrition" data-count="2">'
        + '<div class="mtx-table-toolbar__actions" data-show="selected"><button type="button">Delete</button></div></div>',
    );
    const { container } = render(<TableToolbar title="Nutrition" numSelected={2} selectedActions={<button type="button">Delete</button>} />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, { attributes: ['hidden'] });
  });

  it('sin título usa el nombre traducido y oculta el contador vacío', () => {
    render(<TableToolbar locale="es" actions={<button type="button">Filtrar</button>} />);
    const toolbar = screen.getByRole('toolbar', { name: 'Barra de herramientas de la tabla' });
    expect(toolbar).not.toHaveClass('mtx-table-toolbar--highlight');
    expect(toolbar.querySelector('.mtx-table-toolbar__count')).toHaveClass('mtx-table-toolbar__count--empty');
    expect(screen.getByRole('button', { name: 'Filtrar' }).parentElement).not.toHaveAttribute('hidden');
  });

  it('texto propio del contador', () => {
    render(<TableToolbar title="T" numSelected={3} selectedText="{0} rows" />);
    expect(screen.getByText('3 rows')).toBeInTheDocument();
    expect(screen.getByText('T')).not.toBeVisible();
  });
});

describe('useTableSelection', () => {
  it('casilla de cabecera indeterminada, aria-selected y contador de la toolbar', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <SelectableTable
        options={{ defaultSelected: ['luis'], onSelectionChange, isRowSelectable: (row) => row.id !== 'system' }}
      />,
    );
    const header = screen.getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement;
    expect(header.indeterminate).toBe(true);
    expect(header).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByTestId('row-luis')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('row-luis')).toHaveClass('mtx-table-row--selected');
    expect(screen.getByTestId('row-ana')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByTestId('row-system')).not.toHaveAttribute('aria-selected');
    expect(screen.getByText('1 selected')).toBeInTheDocument();

    await user.click(header);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['luis', 'ana'], expect.objectContaining({ count: 2, reason: 'user' }));
    expect(header.checked).toBe(true);
    expect(header.indeterminate).toBe(false);
    expect(screen.getByText('2 selected')).toBeInTheDocument();

    await user.click(header);
    expect(onSelectionChange).toHaveBeenLastCalledWith([], expect.objectContaining({ count: 0 }));
    expect(screen.getByRole('toolbar')).not.toHaveClass('mtx-table-toolbar--highlight');
  });

  it('casillas de fila con nombre accesible y alternancia', async () => {
    const user = userEvent.setup();
    render(<SelectableTable />);
    await user.click(screen.getByRole('checkbox', { name: 'Select Ana' }));
    expect(screen.getByTestId('row-ana')).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('checkbox', { name: 'Select Ana' }));
    expect(screen.getByTestId('row-ana')).toHaveAttribute('aria-selected', 'false');
  });

  it('selectOnClick alterna la fila al hacer clic fuera de controles', async () => {
    const user = userEvent.setup();
    render(<SelectableTable options={{ selectOnClick: true, isRowDisabled: (row) => row.id === 'system' }} />);
    await user.click(screen.getByText('Luis'));
    expect(screen.getByTestId('row-luis')).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByText('System'));
    expect(screen.getByTestId('row-system')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('checkbox', { name: 'Select System' })).toBeDisabled();
  });

  it('conserva la selección por clave al filtrar y la API programática', () => {
    let api: ReturnType<typeof useTableSelection<Person>> | null = null;
    function Probe({ rows }: { rows: Person[] }) {
      api = useTableSelection(rows, (row) => row.id);
      return <span data-testid="count">{api.numSelected}</span>;
    }
    const { rerender } = render(<Probe rows={PEOPLE} />);
    act(() => api!.selectAll());
    expect(api!.selected).toEqual(['ana', 'luis', 'system']);
    rerender(<Probe rows={PEOPLE.slice(0, 1)} />);
    expect(api!.selected).toHaveLength(3);
    expect(api!.allSelected).toBe(true);
    act(() => api!.toggleRow('ana'));
    expect(api!.isSelected('ana')).toBe(false);
    act(() => api!.setSelected(['luis']));
    expect(api!.selected).toEqual(['luis']);
    act(() => api!.clearSelection());
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('paridad DOM con vanilla: tabla seleccionable con casillas y fila seleccionada', async () => {
    const vanilla = await mountVanilla(
      '<table data-mtx="table" data-selectable aria-label="Team"><thead><tr><th>Name</th></tr></thead>'
        + '<tbody><tr data-id="ana"><td>Ana</td></tr><tr data-id="luis" data-selected><td>Luis</td></tr></tbody></table>',
    );
    function Selectable() {
      const rows = PEOPLE.slice(0, 2);
      const selection = useTableSelection(rows, (row) => row.id, { defaultSelected: ['luis'], getRowLabel: (row) => row.name });
      return (
        <Table selectable aria-label="Team">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox {...selection.getHeaderCheckboxProps()} /></TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} {...selection.getRowProps(row)}>
                <TableCell padding="checkbox"><Checkbox {...selection.getRowCheckboxProps(row)} /></TableCell>
                <TableCell>{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    const { container } = render(<Selectable />);
    // Checkbox de React envuelve la casilla en un `.mtx-form-control` estable: la tabla se compara sin
    // las casillas y cada `.mtx-checkbox` se compara aparte con la de vanilla.
    expectParity(container.firstElementChild, vanilla.firstElementChild, {
      ignoreSelectors: ['.mtx-form-control', '.mtx-checkbox'],
    });
    const reactBoxes = container.querySelectorAll('.mtx-checkbox');
    const vanillaBoxes = vanilla.querySelectorAll('.mtx-checkbox');
    expect(reactBoxes).toHaveLength(vanillaBoxes.length);
    reactBoxes.forEach((box, index) => {
      expectParity(box, vanillaBoxes[index], { ignoreAttributes: ['aria-checked'] });
    });
  });
});

describe('helpers de datos', () => {
  it('ordena de forma estable y pagina', () => {
    const rows = [{ n: 'b', v: 2 }, { n: 'a', v: 2 }, { n: 'c', v: 1 }];
    expect(sortRows(rows, getComparator('asc', 'v')).map((r) => r.n)).toEqual(['c', 'b', 'a']);
    expect(sortRows(rows, getComparator('desc', 'n')).map((r) => r.n)).toEqual(['c', 'b', 'a']);
    expect(paginateRows([1, 2, 3, 4, 5], 1, 2)).toEqual([3, 4]);
    expect(paginateRows([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
  });
});

describe('useTableSelection pruneMissing', () => {
  function Probe({ rows, prune, onChange }: { rows: Person[]; prune?: boolean; onChange?: () => void }) {
    const selection = useTableSelection(rows, (row) => row.id, {
      defaultSelected: ['ana', 'luis'],
      pruneMissing: prune,
      onSelectionChange: onChange,
    });
    return <TableToolbar title="T" numSelected={selection.numSelected} />;
  }

  it('por defecto conserva las claves de filas que ya no están', () => {
    const { rerender } = render(<Probe rows={PEOPLE} />);
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    rerender(<Probe rows={PEOPLE.slice(1)} />);
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('con pruneMissing descarta las claves eliminadas y avisa del cambio', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Probe rows={PEOPLE} prune onChange={onChange} />);
    rerender(<Probe rows={PEOPLE.slice(1)} prune onChange={onChange} />);
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(['luis'], expect.objectContaining({ count: 1, reason: 'api' }));
    rerender(<Probe rows={PEOPLE} prune onChange={onChange} />);
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });
});
