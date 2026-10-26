import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Numeric alignment', es: 'Alineación numérica' };
export const description = {
  en: 'Numeric columns are right-aligned with `align="right"` on the header and the cells (or `numeric`, which adds `mtx-table-cell--numeric`).',
  es: 'Las columnas numéricas se alinean a la derecha con `align="right"` en la cabecera y en las celdas (o `numeric`, que añade `mtx-table-cell--numeric`).',
};

const ROWS = [
  { name: 'Yogur helado', calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: 'Sándwich de helado', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
  { name: 'Éclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
  { name: 'Magdalena', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
];

export default function Demo() {
  return (
    <TableContainer>
      <Table aria-label="Información nutricional">
        <TableHead>
          <TableRow>
            <TableCell>Postre (100 g)</TableCell>
            <TableCell align="right">Calorías</TableCell>
            <TableCell align="right">Grasa (g)</TableCell>
            <TableCell align="right">Carbohidratos (g)</TableCell>
            <TableCell numeric>Proteína (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat.toFixed(1)}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell numeric>{row.protein.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
