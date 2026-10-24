import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTableSelection,
} from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Selection', es: 'Selección' };
export const description = {
  en: '`useTableSelection(rows, getId)` drives the checkbox column: the header checkbox selects everything and turns indeterminate with a partial selection, rows get `aria-selected` and the selection is kept by id. With `selectOnClick` a row is also selected by clicking it; `isRowSelectable` excludes a row.',
  es: '`useTableSelection(rows, getId)` gobierna la columna de casillas: la de cabecera selecciona todo y queda indeterminada con selección parcial, las filas reciben `aria-selected` y la selección se guarda por id. Con `selectOnClick` la fila también se selecciona al hacer clic; `isRowSelectable` excluye una fila.',
};

const TEAM = [
  { id: 'ana', name: 'Ana García', role: 'Design', age: '32' },
  { id: 'luis', name: 'Luis Pérez', role: 'Engineering', age: '41' },
  { id: 'maria', name: 'María Torres', role: 'Product', age: '27' },
  { id: 'system', name: 'System account (not selectable)', role: 'Service', age: '—' },
];

export default function Demo() {
  const selection = useTableSelection(TEAM, (row) => row.id, {
    defaultSelected: ['luis'],
    selectOnClick: true,
    isRowSelectable: (row) => row.id !== 'system',
    getRowLabel: (row) => row.name,
  });
  return (
    <div className="demo-stack">
      <TableContainer>
        <Table selectable selectOnClick hover aria-label="Team">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox {...selection.getHeaderCheckboxProps()} />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TEAM.map((row) => (
              <TableRow key={row.id} {...selection.getRowProps(row)}>
                <TableCell padding="checkbox">
                  {selection.canSelect(row) ? <Checkbox {...selection.getRowCheckboxProps(row)} /> : null}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell align="right">{row.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p className="demo-status" aria-live="polite">
        selected: {JSON.stringify(selection.selected)}
      </p>
    </div>
  );
}
