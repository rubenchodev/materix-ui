import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableToolbar,
  useTableSelection,
} from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Toolbar', es: 'Barra de herramientas' };
export const description = {
  en: '`TableToolbar` follows the selection through `numSelected`: with nothing selected it shows the `title` and the `actions`; with a selection it is highlighted, announces the count (`aria-live`) and shows the `selectedActions`.',
  es: '`TableToolbar` sigue la selección mediante `numSelected`: sin selección muestra el `title` y las `actions`; con selección se resalta, anuncia el contador (`aria-live`) y muestra las `selectedActions`.',
};

const DESSERTS = [
  { id: 'cupcake', name: 'Magdalena', calories: 305, fat: 3.7 },
  { id: 'donut', name: 'Donut', calories: 452, fat: 25.0 },
  { id: 'eclair', name: 'Éclair', calories: 262, fat: 16.0 },
  { id: 'yogurt', name: 'Yogur helado', calories: 159, fat: 6.0 },
];

export default function Demo() {
  const selection = useTableSelection(DESSERTS, (row) => row.id, {
    defaultSelected: ['donut', 'eclair'],
    selectOnClick: true,
    getRowLabel: (row) => row.name,
  });
  return (
    <Paper variant="outlined">
      <TableToolbar
        title="Nutrición"
        numSelected={selection.numSelected}
        actions={<IconButton icon="filter_list" aria-label="Filtrar lista" />}
        selectedActions={
          <>
            <IconButton icon="file_download" aria-label="Exportar seleccionados" />
            <IconButton icon="delete" aria-label="Eliminar seleccionados" onClick={selection.clearSelection} />
          </>
        }
      />
      <TableContainer>
        <Table selectable selectOnClick hover aria-label="Nutrición">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <span className="mtx-visually-hidden">Seleccionar</span>
                <Checkbox {...selection.getHeaderCheckboxProps()} />
              </TableCell>
              <TableCell>Postre (100 g)</TableCell>
              <TableCell align="right">Calorías</TableCell>
              <TableCell align="right">Grasa (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DESSERTS.map((row) => (
              <TableRow key={row.id} {...selection.getRowProps(row)}>
                <TableCell padding="checkbox">
                  <Checkbox {...selection.getRowCheckboxProps(row)} />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
