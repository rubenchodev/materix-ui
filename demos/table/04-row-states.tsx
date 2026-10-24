import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Row states', es: 'Estados de fila' };
export const description = {
  en: 'Hover over the rows: `hover` on the table highlights the body rows (or `hover` on a single `TableRow`). `selected` marks a row as selected with `aria-selected="true"`.',
  es: 'Pasa el ratón por las filas: `hover` en la tabla resalta las filas del cuerpo (o `hover` en un `TableRow`). `selected` marca la fila como seleccionada con `aria-selected="true"`.',
};

const ORDERS = [
  { id: '#1001', customer: 'Ana García', amount: '$120.00', selected: false },
  { id: '#1002', customer: 'Luis Pérez (selected)', amount: '$89.50', selected: true },
  { id: '#1003', customer: 'María Torres', amount: '$42.90', selected: false },
];

export default function Demo() {
  return (
    <TableContainer>
      <Table hover aria-label="Recent orders">
        <TableHead>
          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ORDERS.map((order) => (
            <TableRow key={order.id} selected={order.selected}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell align="right">{order.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
