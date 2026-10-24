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
  { id: 'cupcake', name: 'Cupcake', calories: 305, fat: 3.7 },
  { id: 'donut', name: 'Donut', calories: 452, fat: 25.0 },
  { id: 'eclair', name: 'Eclair', calories: 262, fat: 16.0 },
  { id: 'yogurt', name: 'Frozen yoghurt', calories: 159, fat: 6.0 },
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
        title="Nutrition"
        numSelected={selection.numSelected}
        actions={<IconButton icon="filter_list" aria-label="Filter list" />}
        selectedActions={
          <>
            <IconButton icon="file_download" aria-label="Export selected" />
            <IconButton icon="delete" aria-label="Delete selected" onClick={selection.clearSelection} />
          </>
        }
      />
      <TableContainer>
        <Table selectable selectOnClick hover aria-label="Nutrition">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox {...selection.getHeaderCheckboxProps()} />
              </TableCell>
              <TableCell>Dessert (100 g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat (g)</TableCell>
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
