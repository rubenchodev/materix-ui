import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  getComparator,
  sortRows,
  useTableSort,
} from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Sorting', es: 'Ordenación' };
export const description = {
  en: '`TableSortLabel` is controlled (`active`, `direction`) and calls `onSort` with the next direction; `useTableSort` keeps a single active column and the `<th>` gets `aria-sort`. In right-aligned columns the arrow goes on the left. Use Tab and Enter to sort with the keyboard.',
  es: '`TableSortLabel` es controlada (`active`, `direction`) y llama a `onSort` con la dirección siguiente; `useTableSort` mantiene una sola columna activa y el `<th>` recibe `aria-sort`. En columnas alineadas a la derecha la flecha va a la izquierda. Usa Tab y Enter para ordenar con el teclado.',
};

interface Dessert {
  name: string;
  kcal: number;
  fat: number;
}

const DESSERTS: Dessert[] = [
  { name: 'Donut', kcal: 452, fat: 25.0 },
  { name: 'Éclair', kcal: 262, fat: 16.0 },
  { name: 'Magdalena', kcal: 305, fat: 3.7 },
  { name: 'Pan de jengibre', kcal: 356, fat: 16.0 },
  { name: 'Yogur helado', kcal: 159, fat: 6.0 },
];

export default function Demo() {
  const sort = useTableSort<keyof Dessert>({ defaultOrderBy: 'name' });
  const rows = sort.orderBy ? sortRows(DESSERTS, getComparator(sort.order, sort.orderBy, 'en')) : DESSERTS;
  return (
    <TableContainer>
      <Table aria-label="Postres ordenables">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel {...sort.getSortLabelProps('name')}>Postre</TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel {...sort.getSortLabelProps('kcal')}>Calorías</TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel {...sort.getSortLabelProps('fat')} disabled>
                Grasa (deshabilitado)
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.kcal}</TableCell>
              <TableCell align="right">{row.fat.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
