import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Footer and caption', es: 'Pie y leyenda' };
export const description = {
  en: '`TableFooter` renders a `<tfoot>` with totals styling and `TableCaption` a `<caption>` shown below the table.',
  es: '`TableFooter` pinta un `<tfoot>` con estilo de totales y `TableCaption` un `<caption>` que se muestra bajo la tabla.',
};

const MONTHS = [
  { month: 'January', sales: 42.1, orders: 310 },
  { month: 'February', sales: 38.7, orders: 284 },
  { month: 'March', sales: 51.3, orders: 402 },
];

export default function Demo() {
  const totalSales = MONTHS.reduce((sum, row) => sum + row.sales, 0);
  const totalOrders = MONTHS.reduce((sum, row) => sum + row.orders, 0);
  return (
    <TableContainer>
      <Table>
        <TableCaption>First-quarter sales, in thousands of dollars.</TableCaption>
        <TableHead>
          <TableRow>
            <TableCell>Month</TableCell>
            <TableCell align="right">Sales</TableCell>
            <TableCell align="right">Orders</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {MONTHS.map((row) => (
            <TableRow key={row.month}>
              <TableCell>{row.month}</TableCell>
              <TableCell align="right">{row.sales.toFixed(1)}</TableCell>
              <TableCell align="right">{row.orders}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell align="right">{totalSales.toFixed(1)}</TableCell>
            <TableCell align="right">{totalOrders}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
