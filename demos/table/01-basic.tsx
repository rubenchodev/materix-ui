import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'A semantic `<table>` built from `Table`, `TableHead`, `TableBody`, `TableRow` and `TableCell`: header cells are `<th scope="col">` automatically. `TableContainer` scrolls horizontally inside its box.',
  es: 'Un `<table>` semántico construido con `Table`, `TableHead`, `TableBody`, `TableRow` y `TableCell`: las celdas de cabecera son `<th scope="col">` automáticamente. `TableContainer` desplaza horizontalmente dentro de su caja.',
};

const ROWS = [
  { product: 'Laptop Pro 16"', category: 'Computers', status: 'In stock' },
  { product: 'Mechanical keyboard', category: 'Accessories', status: 'In stock' },
  { product: '4K monitor 27"', category: 'Displays', status: 'Out of stock' },
];

export default function Demo() {
  return (
    <TableContainer>
      <Table aria-label="Inventory">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.product}>
              <TableCell>{row.product}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
